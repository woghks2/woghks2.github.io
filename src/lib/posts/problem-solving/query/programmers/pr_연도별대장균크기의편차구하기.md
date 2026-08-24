---
title: "programmers : 연도별 대장균 크기의 편차 구하기"
date: "2024-01-01"
skills: ["SQL"]
hashtags: ["programmers"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/299310"
description: "JOIN + GROUP BY"
status: "published"
---

# [programmers : 연도별 대장균 크기의 편차 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/299310)

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

> 분화된 연도(YEAR), 분화된 연도별 대장균 크기의 편차(YEAR_DEV), 대장균 개체의 ID(ID) 를 출력하는 SQL 문을 작성해주세요. 분화된 연도별 대장균 크기의 편차는 분화된 연도별 가장 큰 대장균의 크기 - 각 대장균의 크기로 구하며 결과는 연도에 대해 오름차순으로 정렬하고 같은 연도에 대해서는 대장균 크기의 편차에 대해 오름차순으로 정렬해주세요.

## **문제 풀이**

### **MySQL**

[tabs: Solution 1]

```sql
-- SOLUTION 1
WITH GROUPED AS (
    SELECT YEAR(DIFFERENTIATION_DATE) AS YEAR, MAX(SIZE_OF_COLONY) AS MAX_SIZE
    FROM ECOLI_DATA
    GROUP BY YEAR(DIFFERENTIATION_DATE)
)

SELECT
    G.YEAR,
    (G.MAX_SIZE - E.SIZE_OF_COLONY) AS YEAR_DEV,
    E.ID
FROM ECOLI_DATA AS E
JOIN GROUPED AS G ON YEAR(E.DIFFERENTIATION_DATE) = G.YEAR
ORDER BY YEAR, YEAR_DEV
```

[/tabs]

* SOLUTION 1
  * GROUP BY로 CTE에서 년도별 최대 크기를 구한다.
  * JOIN 이후에, GROUP BY + ORDER BY

## **코멘트**

* .
