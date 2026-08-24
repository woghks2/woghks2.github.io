---
title: "programmers : 배달"
date: "2024-01-01"
skills: ["Python"]
hashtags: ["graph"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/12978"
description: "다익스트라를 활용한 배달 문제"
status: "published"
---

# [programmers : 배달](https://school.programmers.co.kr/learn/courses/30/lessons/12978)

## **목표**

> 1번 마을에서 K 시간 이하로 배달이 가능한 마을의 개수를 구하는 문제.
> `다익 기본`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
import heapq as hq

def solution(N, road, K):
    
    graph = [[] for _ in range(N+1)]
    for a,b,cost in road:
        graph[a].append((b,cost))
        graph[b].append((a,cost))
    
    V = [float('inf')]*(N+1)
    V[1] = 0
    heap = [(0,1)]
    while heap:
        t,x = hq.heappop(heap)
        
        for nx,cost in graph[x]:
            nt = t+cost
            if nt < V[nx]:
                V[nx] = nt
                hq.heappush(heap,(nt,nx))
                
    return sum([v<=K for v in V])        
```

[/tabs]

* SOLUTION 1
  * 다익스트라: 다익 기본

## **코멘트**

* 쉬운 문제
