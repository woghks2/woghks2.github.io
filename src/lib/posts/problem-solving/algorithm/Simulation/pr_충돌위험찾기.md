---
title: "programmers : 충돌 위험 찾기"
date: "2025-03-19"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/340211"
description: "시뮬레이션을 활용한 충돌 위험 찾기 문제"
status: "published"
---

# [programmers : 충돌 위험 찾기](https://school.programmers.co.kr/learn/courses/30/lessons/340211)

## **목표**

> 여러 로봇이 경로를 따라 이동할 때, 같은 시간에 같은 좌표에 2개 이상의 로봇이 있는 경우를 찾는 문제.
> `이동 우선순위가 정해져있어서 도착 위치에 돌때까지 while문으로 루프 돌리기. 각 위치별로 경로 모두 탐색`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import defaultdict as dd

def solution(points, routes):
    
    # 각 point끼리 path 모두 구하기
    paths = {}
    for sidx,(sy,sx) in enumerate(points,1):
        path = [(sx,sy)]
        x,y = sx,sy
        for eidx,(ey,ex) in enumerate(points,1):
            path = [(sx,sy)]  
            x,y = sx,sy

            while x!=ex or y!=ey:
                if y!=ey:
                    y += 1 if y < ey else -1
                else:
                    x += 1 if x < ex else -1
                path.append((x,y))

            paths[(sidx,eidx)] = path
    
    # 3개 이상의 경로도 이동할 수 있으니 처리함
    # start -> end 경로를 계속 붙이기
    # 각 로봇마다 move를 구하고 moves에 넣기
    moves = []
    for route in routes:
        move = []
        for i in range(len(route)-1):
            sidx,eidx = route[i:i+2]
            move.extend(paths[(sidx,eidx)])
            if i<len(route)-2:
                move.pop()
        moves.append(move)
    
    # 길이 맞춰주기위해 padding
    max_leng = len(max(moves, key=lambda x:len(x)))
    for move in moves:
        if len(move) < max_leng:
            for _ in range(max_leng-len(move)):
                move.append((0,0))
    
    # 순회하면서 각 시간대별로 겹치는 좌표 구하기
    locs_times = list(zip(*moves))
    answer = 0
    for locs in locs_times:
        crash = dd(int)
        for loc in locs:
            crash[loc] += 1
        for key,val in crash.items():
            if key != (0,0) and val > 1:
                answer += 1
    
    return answer
```

[/tabs]

* SOLUTION 1
  * 이동 우선순위: 이동 우선순위가 정해져있어서 도착 위치에 돌때까지 while문으로 루프 돌리기
  * 경로 탐색: 각 위치별로 경로 모두 탐색

## **코멘트**

* 나름 빡셈;
