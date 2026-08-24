---
title: "programmers : 여행경로"
date: "2024-03-25"
skills: ["Python"]
hashtags: ["graph"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/43164"
description: "DFS + 백트래킹을 활용한 여행경로 문제"
status: "published"
---

# [programmers : 여행경로](https://school.programmers.co.kr/learn/courses/30/lessons/43164)

## **목표**

> 주어진 항공권을 모두 사용하여 ICN에서 출발하는 경로를 구하는 문제.
> `DFS + 백트래킹. 티켓 수 백트래킹해주기`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import defaultdict as dd

def solution(tickets):
    
    # 전체 티켓 수
    T = len(tickets)

    # 티켓 출발 도착 개수 받아오기
    infos = dd(lambda :dd(int))
    for a,b in tickets:
        infos[a][b] += 1
    
    def dfs(path,T):
        nonlocal infos,paths
        
        # 현재 위치
        dep = path[-1]
        
        # 티켓 모두 소모했으면 경로 추가
        if T==0:
            paths.append(path)
            return
            
        # 티켓 정보
        for arv,t in infos[dep].items():
		        # 티켓 있으면 티켓 사용하고 DFS
            if t:
                infos[dep][arv] -= 1
                dfs(path+[arv],T-1)
                infos[dep][arv] += 1
    paths = []
    dfs(['ICN'],T)
    paths.sort()

    return paths[0]
```

[/tabs]

* SOLUTION 1
  * DFS + 백트래킹: DFS + 백트래킹
  * 티켓 관리: 티켓 수 백트래킹해주기

## **코멘트**

* 기본 DFS 백트래킹 문제.
* 탈출 조건만 잘 걸어주기.
* 리스트 + 연산이 코스트가 좀 있다.
* 리스트가 길다고 느껴지면 extend를 사용하기
