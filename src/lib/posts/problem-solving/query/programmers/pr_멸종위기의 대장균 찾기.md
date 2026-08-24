---
title: "programmers : 멸종위기의 대장균 찾기"
date: "2025-03-24"
skills: ["SQL"]
hashtags: ["programmers"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/301651"
description: "RECURSIVE CTE"
status: "published"
---

# [programmers : 멸종위기의 대장균 찾기](https://school.programmers.co.kr/learn/courses/30/lessons/301651)

## **다이어그램**

```mermaid
erDiagram
    ECOLI_DATA ||--o{ ECOLI_DATA : "parent-child"
    ECOLI_DATA {
        int ID PK
        int PARENT_ID FK
        int SIZE_OF_COLONY
        date DIFFERENTIATION_DATE
        int GENOTYPE
    }
```

## **목표**

> 각 세대별 자식이 없는 개체의 수(COUNT)와 세대(GENERATION)를 출력하는 SQL문을 작성해주세요. 이때 결과는 세대에 대해 오름차순 정렬해주세요. 단, 모든 세대에는 자식이 없는 개체가 적어도 1개체는 존재합니다.

## **문제 풀이**

### **MySQL**

[tabs: Solution 1]

```sql
-- SOLUTION 1
WITH RECURSIVE GEN AS (
    SELECT ID, PARENT_ID, 1 AS GENERATION
    FROM ECOLI_DATA
    WHERE PARENT_ID IS NULL

    UNION ALL
    SELECT e.ID, e.PARENT_ID, g.GENERATION + 1
    FROM ECOLI_DATA e
    INNER JOIN GEN g ON e.PARENT_ID = g.ID
),

NO_PARENT AS (
    SELECT g1.ID, g1.GENERATION
    FROM GEN g1
    LEFT JOIN GEN g2 ON g1.ID = g2.PARENT_ID
    WHERE g2.ID IS NULL
)

SELECT COUNT(*) AS COUNT, GENERATION
FROM NO_PARENT
GROUP BY GENERATION
ORDER BY GENERATION
```

[/tabs]

* SOLUTION 1
  * 각 세대를 찾기 위해 RECURSIVE CTE를 사용한다.
  * 처음 써봤는데, 첫 CTE 내부 쿼리에서는 초기값을 할당하고, 그 이후로는 UNION ALL로 테이블을 계속 병합하는 방식
  * 세대를 구했으면 다른 문제들과 똑같이 풀 수 있다.

## **코멘트**

* 프로그래머스는 약간 과한 문제가 종종 있는듯...
