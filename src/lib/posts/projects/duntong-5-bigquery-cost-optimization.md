---
title: "[던통] 게임 통계 서비스 - 5. BigQuery 비용 최적화"
description: "빅쿼리 비용 분석 및 파티션 프루닝 실패 원인을 분석해 BigQuery 비용 95% 절감하기"
date: "2026-09-01"
hashtags: ["BigQuery", "Cost Optimization", "Partitioning", "SQL"]
skills: ["BigQuery", "SQL", "Airflow"]
status: "published"
---

# [던통] 게임 통계 서비스 - 5. BigQuery 비용 최적화

## 1️⃣ BigQuery 비용 최적화

PostgreSQL과 같은 RDB에서는 인덱스를 통해 데이터를 효율적으로 조회했다면, BigQuery와 같은 분산 데이터 웨어하우스에서는 파티셔닝과 클러스터링을 통해 데이터를 효율적으로 조회할 수 있습니다.

파티셔닝은 데이터를 논리적으로 분할하여 조회 성능을 향상시키는 방법입니다. 예를 들어, 있는 데이터를 'date' 컬럼을 기준으로 파티셔닝하면, 특정 날짜의 데이터만 조회할 때 전체 테이블을 스캔하지 않고 해당 파티션만 조회할 수 있습니다.

매일 데이터를 DW에 적재하는 과정에서 멱등성을 위해서 MERGE 또는 DELETE-INSERT 문을 사용할 수 있습니다. MERGE의 경우 upsert에 해당하는 구문이고, DELETE-INSERT의 경우 삭제 후 삽입하는 방식으로 멱등성을 보장합니다.

정리하자면 다음과 같습니다.

| 방식 | 장점 | 단점 | 적합한 경우 |
|---|---|---|---|
| `MERGE` | 키 기준으로 삽입·수정·삭제를 한 번에 처리할 수 있음. 변경되지 않은 파티션을 유지하기 쉬움 | 조건이 복잡해지면 중복 키, 누락 행, 오래된 행 처리 로직이 복잡해짐 | 명확한 PK 기준의 일반적인 증분 upsert |
| `DELETE-INSERT` | 대상 날짜나 파티션을 완전히 재생성하므로 멱등성이 명확함. 이전 결과에 남은 stale row를 방지할 수 있음 | 영향 범위의 데이터를 모두 다시 작성함. 트랜잭션 없이 분리 실행하면 중간 상태가 노출될 수 있음 | 일별 집계, 기간 백필, 분포·스냅샷 결과 재생성 |

<br/>

하지만 MERGE문의 경우 쿼리는 간편하게 작성할 수 있지만, 실행 계획이 복잡해지고 파티션 프루닝이 실패할 수 있어 DELETE-INSERT 방식보다 비효율적일 수 있습니다. 이러한 지점을 BigQuery 비용을 통해서 확인할 수 있었습니다.

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 not-prose">
  <figure class="m-0">
    <img src="/images/posts/projects/duntong/bigquery-cost.png" alt="빅쿼리 비용" class="m-0 w-full rounded-lg" />
    <figcaption class="mt-2 text-center text-sm text-blog-muted">빅쿼리 비용</figcaption>
  </figure>
  <figure class="m-0">
    <img src="/images/posts/projects/duntong/bigquery-cost-analysis-only.png" alt="빅쿼리 비용에서 분석만" class="m-0 w-full rounded-lg" />
    <figcaption class="mt-2 text-center text-sm text-blog-muted">빅쿼리 분석 비용</figcaption>
  </figure>
</div>

위 사진에서 좌측의 빅쿼리 비용 중 분석 비용만 추출한 그래프에서 특정 일자를 기준으로 비용이 생기는 것을 확인할 수 있었습니다. BigQuery에서는 매 달 1TB의 쿼리를 무료로 사용할 수 있기에 쿼리에 문제가 발생하지 않는다면 데이터 파이프라인을 구축하기에는 충분한 사용량이었습니다.

하지만, 매월 10일 정도부터 비용이 발생하는 것으로 보아 빠르게 사용량이 소진되었음을 알 수 있었습니다. 이에 쿼리 실행 시 기존 계획과 다르게 풀스캔을 하는 쿼리가 있거나, 테이블에 파티셔닝이 없어 파티션 프루닝이 실패했음을 의심할 수 있었습니다.  파이프라인에서 확인할 수 있는 테이블과 쿼리를 전수조사 한 결과, service_date 기준으로 파티셔닝되어 있었고 쿼리 실행 시 풀스캔을 하는 쿼리를 확인할 수 있었습니다.

```text
MERGE target
  → MATCHED UPDATE
  → NOT MATCHED INSERT
  → NOT MATCHED BY SOURCE DELETE
```

기존 MERGE에는 다음과 같은 WHEN NOT MATCHED BY SOURCE THEN DELETE 로직이 포함되어 있었습니다. 문제는 NOT MATCHED BY SOURCE가 source에 존재하지 않는 target 행을 삭제하기 위해 target과 source를 대조하는 과정에서 발생했습니다. 실제 실행계획을 확인한 결과, service_date 조건이 target READ 단계까지 전파되지 않아 파티션 테이블의 전체 누적 DM을 읽고 있었습니다.


```sql
BEGIN TRANSACTION;

DELETE FROM target
WHERE service_date BETWEEN @start_date AND @end_date;

INSERT INTO target
SELECT ...
FROM source
WHERE service_date BETWEEN @start_date AND @end_date;

COMMIT TRANSACTION;
```

그 결과 대상 날짜 파티션만 명시적으로 삭제·재생성하면서 stale row 제거와 재실행 멱등성은 유지할 수 있었습니다. 결과적으로 아래와 같이 그래프와 표에 있는 것 처럼 95%에 달하는 스캔량을 줄여 비용을 절감할 수 있었습니다.

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 not-prose">
  <figure class="m-0">
    <img src="/images/posts/projects/duntong/daily-activity-billed-bytes-before-after.png" alt="Daily Activity DAG BigQuery billed bytes Before / After" class="m-0 w-full rounded-lg" />
    <figcaption class="mt-2 text-center text-sm text-blog-muted">BigQuery 비용 Before / After</figcaption>
  </figure>
  <figure class="m-0">
    <img src="/images/posts/projects/duntong/daily-activity-billed-bytes-last-30-days.png" alt="Daily Activity DAG BigQuery billed bytes 최근 30일" class="m-0 w-full rounded-lg" />
    <figcaption class="mt-2 text-center text-sm text-blog-muted">BigQuery 비용 최근 30일</figcaption>
  </figure>
</div>

| 작업 | Before | After | 절감률 |
|---|---:|---:|---:|
| 아이템 분포 집계 | 35.041GB | 0.067383GB | 99.81% |
| Activity 운영 집계 | 18.791GB | 0.418945GB | 97.77% |
| Activity 지표 5개 쿼리 | 9.984GB | 2.280273GB | 77.16% |
| 아이템 획득 DM | 6.654GB | 0.208008GB | 96.87% |
| 총합 | 70.470GB | 2.974609GB | 95.78% |

핵심은 DELETE-INSERT가 MERGE보다 좋다는 것이 아니라, MERGE의 target 테이블에서 발생하는 anti-join 때문에 파티션 프루닝이 실패했기 때문에 Daily Batch로 데이터를 넣는 명시적인 파티션 교체 방식으로 변경했다는 점입니다.
