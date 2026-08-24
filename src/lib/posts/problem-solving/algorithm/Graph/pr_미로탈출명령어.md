---
title: "programmers : 미로 탈출 명령어"
date: "2025-03-23"
skills: ["Python"]
hashtags: ["graph"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/150365"
description: "BFS를 활용한 미로 탈출 명령어 문제"
status: "published"
---

# [programmers : 미로 탈출 명령어](https://school.programmers.co.kr/learn/courses/30/lessons/150365)

## **목표**

> 정확히 k번 이동하여 도착지에 도달하는 사전순으로 가장 빠른 경로를 구하는 문제.
> `정해는 그리디 + 조건많은 분기? 근데 50 * 50 * 2500 = 625만이라 BFS도 될거같아서 비벼봄`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque

def solution(n, m, x, y, r, c, k):
    
    H,W,sy,sx,ey,ex = n,m,x-1,y-1,r-1,c-1
    
    x_dist, y_dist = ex-sx, ey-sy
    min_dist = abs(x_dist) + abs(y_dist)
    
    # 거리 부족하거나 홀짝 안맞아서 도착지점 못가는 경우 (맵 밖으로 나가려는 시도는 1회로 처리 안해서)
    if k < min_dist or min_dist%2 != k%2:
        return "impossible"
    
    dires = [(0,1),(-1,0),(1,0),(0,-1)]
    inside = lambda x,y : 0<=x<W and 0<=y<H
    table = 'dlru'
    
    # 3차원 배열 만들고 BFS
    answer = ''
    V = [[[False]*W for _ in range(H)] for _ in range(k+1)]
    V[0][sy][sx] = True
    Q = deque([(sx,sy,0,'')])
    while Q:
        x,y,t,s = Q.popleft()

        if t==k:
            if (x,y) == (ex,ey):
                answer = s
                break
            continue
            
        for dire,(dx,dy) in enumerate(dires):
            nx,ny = x+dx,y+dy
            if inside(nx,ny) and not V[t+1][ny][nx]:
                V[t+1][ny][nx] = True
                Q.append((nx,ny,t+1,s + table[dire]))
    
    return answer
```

[/tabs]

* SOLUTION 1
  * BFS: 정해는 그리디 + 조건많은 분기? 근데 50 * 50 * 2500 = 625만이라 BFS도 될거같아서 비벼봄
  * 3차원 배열: 시간대별 맵의 배열을 3차원으로 만들기

## **코멘트**

* 보통 10초 / 2GB 이런식으로 나오면 러프하게 실수 없이 풀 수 있는 풀이로 푸는게 맞는듯?
* 조건 많은 분기에서 조건 빼먹거나 케이스 분류를 잘못하는 경우도 있어서 쉬운 풀이로 풀기
