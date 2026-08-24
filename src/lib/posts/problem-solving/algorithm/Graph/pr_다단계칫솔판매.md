---
title: "programmers : 다단계 칫솔 판매"
date: "2024-05-08"
skills: ["Python"]
hashtags: ["graph"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/77486"
description: "DFS를 활용한 다단계 칫솔 판매 문제"
status: "published"
---

# [programmers : 다단계 칫솔 판매](https://school.programmers.co.kr/learn/courses/30/lessons/77486)

## **목표**

> 다단계 조직에서 각 판매원이 얻는 수익을 계산하는 문제.
> `트리 형태. DFS를 이용해서 각 판매마다 부모를 타고 올라가면서 수익 전달하기`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import defaultdict as dd
import sys
sys.setrecursionlimit(10**6)

def solution(enroll, referral, seller, amount):
    
    G = dd(str) # 부모 연결
    for c,p in zip(enroll, referral):
        G[c] = p

    answer = dd(int)
    def dfs(s,a):
        nonlocal G
        if not G[s]:
            return
        if a < 1:
            answer[s] += a
            return
        answer[s] += a-a//10
        dfs(G[s],a//10)
        
    for s,a in zip(seller,amount):
        dfs(s,a*100)
    
    return [answer[name] for name in enroll]
```

[/tabs]

* SOLUTION 1
  * 트리 구조: 트리 형태
  * DFS: DFS를 이용해서 각 판매마다 부모를 타고 올라가면서 수익 전달하기
  * 탈출 조건: 탈출 조건은 root거나 전달 수익이 없는 경우

## **코멘트**

* 
