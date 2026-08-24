---
title: "programmers : 등산코스 정하기"
date: "2024-06-13"
skills: ["Python"]
hashtags: ["graph"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/118669"
description: "다익스트라를 활용한 등산코스 정하기 문제"
status: "published"
---

# [programmers : 등산코스 정하기](https://school.programmers.co.kr/learn/courses/30/lessons/118669)

## **목표**

> 게이트에서 출발하여 봉우리에 도달하는 최소 강도를 구하는 문제.
> `기본 다익스트라 문제. 시작점에서 봉우리에 도착하는 최소 강도를 구함`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
import heapq as hq

def solution(N, paths, gates, summits):

    gates,summits = set(gates),set(summits)
    G = [[] for _ in range(N+1)]
    for a,b,cost in paths:
        G[a].append((b,cost))
        G[b].append((a,cost))
    
    answer = []
    heap = []
    for gate in gates:
        hq.heappush(heap,(0,gate))
        V = [1e9]*(N+1)
        V[gate] = 0
        
    while heap:
        t,x = hq.heappop(heap)

        # 더미 데이터 패스
        if t > V[x]:
            continue

        for nx,cost in G[x]:
            
            nt = max(t,cost) # 이동 간선
            if nx in summits: # 봉우리면 나갈 필요가 없다. 올라온 간선으로 내려가면 된다. 힙에 넣지 않고 기록만
                V[nx] = min(V[nx],nt)
                answer.append((nx,nt))
            else:
                if nt < V[nx]:
                    hq.heappush(heap,(nt,nx))
                    V[nx] = nt

    answer.sort(key=lambda x: (x[1],x[0]))
    return answer[0]
```

[/tabs]

* SOLUTION 1
  * 다익스트라: 기본 다익스트라 문제
  * 접근 방법: 시작점에서 봉우리에 도착하는 최소 강도를 구함
  * 최적화: 입력 크기가 큰 편이라서 각 Node마다 다익스트라를 돌리면 $(NlogN)^2$라서 터져버림. 시작점 gates를 한 번에 힙에 넣고, summits에 도달할 때 마다 정답 후보에 넣음

## **코멘트**

* 기본 다익
