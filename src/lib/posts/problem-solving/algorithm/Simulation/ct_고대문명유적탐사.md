---
title: "코드트리 : 고대 문명 유적 탐사"
date: "2024-05-01"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://www.codetree.ai/training-field/frequent-problems/problems/ancient-ruin-exploration/description?page=1&pageSize=20"
description: "BFS + 회전을 활용한 고대 문명 유적 탐사 문제"
status: "published"
---

# [코드트리 : 고대 문명 유적 탐사](https://www.codetree.ai/training-field/frequent-problems/problems/ancient-ruin-exploration/description?page=1&pageSize=20)

## **목표**

> 5×5 격자에서 피벗을 선택해 회전시키고, 3개 이상 연결된 같은 숫자를 제거하여 점수를 얻는 문제.
> `BFS + 구현. 회전은 피벗 주변 8칸을 큐에 담아서 rotate`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque

K,M = map(int,input().split())
arr = [list(map(int,input().split())) for _ in range(5)]
numbers = list(map(int,input().split()))
dire = [(1,0),(0,1),(-1,0),(0,-1)]

# BFS를 돌려서 영역의 크기와 연결된 좌표들을 반환한다.
# BFS를 돌린 후 영역 크기가 3 이상이면 영역들을 모두 0으로 만들어야 하기 때문
def bfs(x,y,n):
    connected = [(x,y)]
    q = deque([(x,y)])
    cnt = 1
    while q:
        x,y = q.popleft()
        for dx,dy in dire:
            nx,ny = x+dx,y+dy
            if 0<=nx<5 and 0<=ny<5 and not V[ny][nx] and arr[ny][nx] == n:
                q.append((nx,ny))
                connected.append((nx,ny))
                V[ny][nx] = True
                cnt += 1
    return cnt,connected

# 피벗의 좌표를 받고 주변 8칸을 idx,val을 따로따로 큐에 담는다.
def read_pivot(px,py):
    Q,I = deque(),deque()
    for x,y in [(px-1,py-1),(px,py-1),(px+1,py-1),(px+1,py),(px+1,py+1),(px,py+1),(px-1,py+1),(px-1,py)]:
        Q.append(arr[y][x])
        I.append((x,y))
    return Q,I

# 업데이트된 Q,I를 바탕으로 arr을 업데이트한다.
def update():
    for i in range(8):
        x,y = I[i]
        arr[y][x] = Q[i]

# arr을 순회하면서 BFS를 한다.
# 각 결과들을 저장해야하니, 주어진 조건에 맞춰서 (점수,각도,열,행) 순서대로 리턴하기
def get_score():
    score = 0
    for y in range(5):
        for x in range(5):
            if not V[y][x]:
                V[y][x] = True
                size,connected = bfs(x,y,arr[y][x])
                if size >= 3:
                    score += size
    return (score,angle,px,py)

# 생성되는 유물의 개수
use = 0

for _ in range(K):
    answer = 0 # 각 턴마다 얻는 점수

    # 모든 케이스를 조사해서 얻을 정보
    scores = []
    for py in range(1,4):
        for px in range(1,4):
            Q,I = read_pivot(px,py)
            for angle in (90,180,270):
                V = [[False]*5 for _ in range(5)]
                Q.rotate(2) # 2칸씩 회전하면 90도씩 회전한다
                update()
                scores.append(get_score())
            Q.rotate(2) # 원상태로 돌려놓는다
            update()
    
    # 조건에 맞는 케이스 선택
    scores.sort(key = lambda x: (-x[0],x[1],x[2],x[3]))
    score,angle,ax,ay = scores[0]
    
    # 유물 획득이 불가능하면 탈출
    if not score:
        break

    # 정답 케이스로 회전
    Q,I = read_pivot(ax,ay)
    Q.rotate(2*(angle//90))
    update()

    # 회전한 후, BFS 진행 + 생성을 반복한다.
    while True:
        score = 0
        V = [[False]*5 for _ in range(5)]
        for y in range(5):
            for x in range(5):
                if not V[y][x]:
                    V[y][x] = True
                    size,info = bfs(x,y,arr[y][x])
                    if size >= 3:
                        score += size
                        for zx,zy in info:
                            arr[zy][zx] = 0
        if not score:
            break
        
        # 유물 획득 자리에 다시 새로운 유물 생성하기.
        answer += score
        for j in range(5):
            for i in range(4,-1,-1):
                if arr[i][j] == 0:
                    arr[i][j] = numbers[use]
                    use += 1

    print(answer, end=' ')
```

[/tabs]

* SOLUTION 1
  * BFS + 구현: BFS + 구현
  * 회전: 회전은 피벗 주변 8칸을 큐에 담아서 rotate

## **코멘트**

* 쉬운문제
