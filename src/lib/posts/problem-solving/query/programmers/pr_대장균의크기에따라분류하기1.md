---
title: "programmers : 대장균의 크기에 따라 분류하기 1"
date: "2025-04-05"
skills: ["SQL"]
hashtags: ["programmers"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/299307"
description: "CASE WHEN"
status: "published"
---

# [programmers : 대장균의 크기에 따라 분류하기 1](https://school.programmers.co.kr/learn/courses/30/lessons/299307)

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

> 대장균 개체의 크기가 100 이하라면 'LOW', 100 초과 1000 이하라면 'MEDIUM', 1000 초과라면 'HIGH' 라고 분류합니다. 대장균 개체의 ID(ID) 와 분류(SIZE)를 출력하는 SQL 문을 작성해주세요.이때 결과는 개체의 ID 에 대해 오름차순 정렬해주세요.

## **문제 풀이**

### **MySQL**

[tabs: Solution 1]

```sql
-- SOLUTION 1
SELECT
    ID,
    CASE
        WHEN SIZE_OF_COLONY <= 100 THEN "LOW"
        WHEN SIZE_OF_COLONY <= 1000 THEN "MEDIUM"
        ELSE "HIGH"
    END AS SIZE
FROM ECOLI_DATA
ORDER BY ID
```

[/tabs]

* SOLUTION 1
  * 다중 조건이라서 CASE WHEN으로 풀이

## **코멘트**

* .
