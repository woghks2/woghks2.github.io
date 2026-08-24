---
title: "프로젝트 아카이브"
description: "프로젝트 아카이브 및 간단 소개입니다."
date: "2024-09-16"
hashtags: []
skills: ["Python", "SQL", "FastAPI"]
status: "published"
---
# 프로젝트 아카이브

## 1️⃣ [던통](https://duntong.xyz/) - 게임 통계 서비스

### 프로젝트 소개

던전앤파이터 OpenAPI 데이터를 활용해 게임 통계와 게임 서비스 지표를 제공하는 게임 통계 서비스입니다.

서비스 개발 이후 데이터 플랫폼 구축 및 데이터 분석을 통한 프로덕트 개선까지 진행했습니다.

- **프로젝트 기간** : 2025.12 ~ 진행 중  
- **프로젝트 인원** : 개인 프로젝트
- **사용 기술 스택** : FastAPI, Svelte, PostgreSQL, Airflow, Superset, Redis, GCS, BigQuery, Grafana, Prometheus

### 프로젝트 아키텍처

![던통 데이터 플랫폼 아키텍처](/images/posts/projects/duntong/duntong-architecture.png)

### 데이터 플랫폼 구축 역할 &amp; 트러블 슈팅

**프로젝트 기여** :

- Data Lake → Data Warehouse → Data Mart → Serving DB로 이어지는 메달리온 아키텍처 구축
- **약 400만 캐릭터** 규모의 데이터를 대상으로 매일 **1천 만 건이 넘는 OpenAPI 데이터 수집**·적재·변환하는 데이터 파이프라인 운영
- Airflow, Google Cloud Storage, BigQuery를 활용한 데이터 수집 및 적재 자동화

**트러블슈팅** : 

- API 응답을 표준화를 통한 데이터 정합성 관리 및 멱등 키를 활용한 데이터 중복 방지
- Dynamic Task Mapping, 동시성 제한, 재시도, 멱등성, 원본·집계 건수 검증을 적용해 파이프라인 안정성 개선
- 데이터 신선도를 고려하여 API 갱신 주기를 변경하여 일일 API 호출량 75% 감소
- 파티션 프루닝에 실패했던 MERGE문을 DELETE-INSERT문으로 변경하여 분석 쿼리 비용 95% 절감

관련 링크 :

- [데이터 정합성과 멱등성을 고려한 데이터 파이프라인 구축](/posts/projects/data-platform-data-pipeline)
- [데이터 신선도를 고려한 API 호출량 최적화](/posts/projects/data-platform-data-warehouse)
- [BigQuery 비용 분석을 통한 조회 쿼리 비용 최적화](/posts/projects/duntong-5-bigquery-cost-optimization)



### 검색 접근성 개선 A/B 테스트

- 메인 화면 검색 컴포넌트 추가에 대한 A/B 테스트를 설계하고, 이벤트 계약·퍼널·Primary/Secondary/Guardrail 지표 정의
- 모의 데이터 분석에서 Hero Search Bar 적용안의 Home → Detail 전환율 uplift를 **+5.08%p**로 확인

관련 링크:

- [검색 접근성 개선 A/B 테스트](/posts/projects/search-accessibility-abtest)

---

## 2️⃣ 모하시네마 — 영화 추천 서비스

### 프로젝트 소개

사용자의 자연어를 바탕으로 영화를 추천하는 서비스입니다.

벡터 유사도 검색을 바탕으로 Two Tower 추천 시스템을 구현하여 사용자의 활동을 기반으로 영화 선호도를 파악하고, 자연어 질의를 처리하여 영화를 추천합니다.

- **프로젝트 기간** : 2025.09.01 ~ 2025.09.29  
- **사용 기술 스택** : Spring Boot, FastAPI, React, PostgreSQL, pgvector, PyTorch, Hugging Face
- **프로젝트 인원** : 백엔드(3명), 프론트엔드(1명), 인프라(1명), AI(1명)

### 프로젝트 아키텍처

![모하시네마 서비스 아키텍처](/images/posts/projects/moha-cinema/mohacinema-architecture.png)

### 프로젝트 기여 &amp; 트러블슈팅

**프로젝트 기여** :

- OpenAPI, 데이터 수집 파이프라인 구축
- AI 백엔드 서버 구축 및 모델 서빙
- TwoTower 추천 시스템 아키텍처 구현

**트러블슈팅** : 

- 임베딩 벡터 차원을 256에서 128로 줄여 Recall@K 기반으로 추천 시스템 성능을 유지하며 CPU 사용량 약 28% 절감
- Two Tower 아키텍처 기반에서 Domain Mismatch를 해결하기 위한 MLP 레이어를 사용하여 추천 성능 개선
- 임베딩 시 데이터 절삭 및 누락 문제 해결을 위해 Multi Chunk 임베딩 및 Multi Field 임베딩을 통해 임베딩 성능 개선
- 자연어 질의를 LLM API 대신 Sentence Transformer 기반 Zero-Shot 분류로 우선 처리하여 **응답 시간 1.5초 개선**

관련 링크:

- [영화 추천 서비스 - 1. 데이터 수집, Vector DB, 임베딩](/posts/projects/movie-recommendation-1)
- [영화 추천 서비스 - 2. 추천 시스템 아키텍처 및 실운영 문제 해결 (完)](/posts/projects/movie-recommendation-2)

---

## 3️⃣ BM 구매 예측 및 CRM 타겟 설계

### 프로젝트 소개

신규 캐릭터 전용 패키지 구매자의 활동 패턴을 학습해, 다음 유사 BM 출시 시 구매 가능성이 높은 유저를 우선 타겟팅하는 프로젝트입니다.

모델 성능을 확인하는 데서 끝나지 않고 CRM 타겟 설정에 사용할 수 있는 Top-K 기준까지 설계했습니다.

- **프로젝트 기간** : 2024.09  
- **프로젝트 유형** : 개인 프로젝트  
- **사용 기술 스택** : Python, Pandas, XGBoost, LightGBM, SMOTE
- **프로젝트 기여** :
- 유저의 활동 로그를 바탕으로 모델 학습 피처 설계
- RandomForest, LightGBM, XGBoost와 Vanilla·Class Weight·SMOTE 조합을 비교
- Test Recall 78.2%로 실제 구매자의 상당 부분을 포착
- Precision 45.0%로 전체 평균 구매율 33.9%보다 높은 타겟 구매율 확보
- PR-AUC 0.5217로 구매자 클래스 ranking 성능이 baseline 대비 개선
- 구매 가능성 점수 상위 20%의 구매율 56.1%, Lift 1.66배

**트러블슈팅** : 

- 구매율 33.9% 클래스 불균형으로 인한 구매자 포착 문제를 Vanilla, Class Weight, SMOTE 비교를 통해 Recall 78.2%, PR-AUC 0.5217을 달성
- 활동 로그에서 파생한 피처 간 높은 상관관계 문제를 RandomForest, XGBoost, LightGBM 모델 비교를 통해 XGBoost를 최종 모델로 선택
- 단일 threshold만으로는 CRM 타겟 규모 설정 문제를 Top-K 기준을 적용해 상위 20% 타겟에서 구매율 56.1%, Lift 1.66배 향상

관련 링크:

- [BM 구매 예측 및 CRM 타겟 설계](/posts/projects/purchase-predict)

