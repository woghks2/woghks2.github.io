---
title: "programmers : 점 찍기"
date: "2024-06-10"
skills: ["Python"]
hashtags: ["etc"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/140107"
description: "원의 방정식을 활용한 점 찍기 문제"
status: "published"
---

# [programmers : 점 찍기](https://school.programmers.co.kr/learn/courses/30/lessons/140107)

## **목표**

> 원점을 중심으로 하는 원의 경계 위 또는 내부에 있는 정수 좌표 점의 개수를 구하는 문제.
> `원의 방정식 + 그냥 반복문`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(k,d):
    
    answer = 0
    for x in range(0,d+1,k):
        ylim = (d**2-x**2)**0.5
        answer += ylim//k + 1           
    return answer
```

[/tabs]

* SOLUTION 1
  * 원의 방정식: 원의 방정식 + 그냥 반복문

## **코멘트**

* 레벨0 수준인뎅
