---
title: "programmers : 인사고과"
date: "2024-04-02"
skills: ["Python"]
hashtags: ["greedy"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/152995"
description: "정렬을 활용한 인사고과 문제"
status: "published"
---

# [programmers : 인사고과](https://school.programmers.co.kr/learn/courses/30/lessons/152995)

## **목표**

> 각 사원의 인사고과 점수를 기준으로 석차를 매길 때, 특정 사원의 석차를 구하는 문제.
> `입력이 10만이라 각 사람에서 자신보다 둘 다 높은 점수를 가지는 경우는 체크 불가능. 정렬 이후 근태, 동료평가 중 하나를 피벗으로 삼고 조사하면 효율적으로 조사 가능`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import defaultdict as dd

def solution(scores):
    
    A,B = scores[0]
    S = A+B
    Bmax = 0
    
    scores.sort(key=lambda x:(x[0],-x[1]))
    
    rank = dd(int)
    while scores: # A점수가 크고 B점수가 작은거부터 순회하기
        a,b = scores.pop()
        if A<a and B<b: # 완호보다 둘다 높으면 인센x
            return -1
        
        if b >= Bmax: # A점수가 점점 낮아지는 순서로 들어온다. B점수라도 현재까지 최고점이어야
            Bmax = b
            rank[a+b] += 1
    
    # 점수 별 조사한 인원 바탕으로 점수 매기기
    temp = list(rank.items())
    temp.sort()
    answer = 0
    while temp:
        s,cnt = temp.pop()
        if s == S:
            break
        answer += cnt
    return answer + 1
```

[/tabs]

* SOLUTION 1
  * 정렬: 정렬 / 힙 / 해시 등을 생각해볼 수 있음. 정렬 이후 근태, 동료평가 중 하나를 피벗으로 삼고 조사하면 효율적으로 조사 가능
  * 그리디 접근: A점수가 크고 B점수가 작은 애들부터 조사 시작. A는 항상 작아지는 경우라서 B점수가 더 작아지는 경우가 생기면 인센x
  * 순위 계산: 점수 별 조사한 인원 바탕으로 점수 매기기

## **코멘트**

* 독해력 이슈로 다시 풀었....
