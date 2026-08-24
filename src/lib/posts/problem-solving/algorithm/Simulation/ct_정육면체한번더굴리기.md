---
title: "코드트리 : 정육면체 한 번 더 굴리기"
date: "2024-04-13"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://www.codetree.ai/training-field/frequent-problems/problems/cube-rounding-again/description?page=1&pageSize=20"
description: "BFS + deque를 활용한 정육면체 한 번 더 굴리기 문제"
status: "published"
---

# [코드트리 : 정육면체 한 번 더 굴리기](https://www.codetree.ai/training-field/frequent-problems/problems/cube-rounding-again/description?page=1&pageSize=20)

## **목표**

> 주사위를 굴려서 점수를 얻는 문제. 주사위가 이동한 칸에서 같은 숫자로 연결된 영역의 크기 × 숫자만큼 점수를 얻음.
> `현재 주사위의 상태를 list로 저장. BFS를 통해 현재 이동한 칸에서 점수를 얼마나 획득할 수 있는지 체크. 주사위를 굴릴 때 deque를 이용해서 index, value 큐 두 개를 이용해서 rotate 시키기`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque

N,M = map(int,input().split())
arr = [list(map(int,input().split())) for _ in range(N)]

inside = lambda x,y : 0<=x<N and 0<=y<N
dire = [(1,0),(0,1),(-1,0),(0,-1)]

# BFS로 각 칸 점수 계산
V = [[False]*N for _ in range(N)]
def bfs(x,y,number) -> int,list[tuple]:

    V[y][x] = True
    Q = deque([(x,y)])
    
    locs = [(x,y)] # 영역 좌표를 저장한다.
    size = 1 # 영역의 크기를 구한다.
    while Q:
        x,y = Q.popleft()

        for dx,dy in dire:
            nx,ny = x+dx,y+dy
            if inside(nx,ny) and not V[ny][nx] and arr[ny][nx] == number:
                Q.append((nx,ny))
                V[ny][nx] = True
                size += 1
                locs.append((nx,ny))
    return size*number,locs # 획득 점수 / 영역 좌표들

# table[좌표] = 획득점수
table = {}
for i in range(N):
    for j in range(N):
        if not V[i][j]:
            score,locations = bfs(j,i,arr[i][j])
            for x,y in locations:
                table[(x,y)] = score

# 현재 위치 (X,Y)에서 바라보는 방향 head로 이동하는 경우.
X,Y = 0,0
dice = [4,5,3,2,1,6] # 서 북 동 남 상 하
head = 0 # 0 ~ 3 dire에 맞춰서 동 남 서 북
def move(head):
    if head%2 == 0:
        I = deque([i for i in (2,4,0,5)])       # 동 상 서 하
        Q = deque([dice[i] for i in (2,4,0,5)]) # 동 상 서 하
        if head==0: Q.rotate(-1)
        else: Q.rotate(1)
    else:
        I = deque([i for i in (3,4,1,5)])       # 남 상 북 하
        Q = deque([dice[i] for i in (3,4,1,5)]) # 남 상 북 하
        if head==1: Q.rotate(-1)
        else: Q.rotate(1)
    
    for idx,val in zip(I,Q):
        dice[idx] = val
    return dice

score = 0
for _ in range(M):

    dx,dy = dire[head]
    if not inside(X+dx,Y+dy): # 벗어나면 반대방향으로 이동한다.
        X,Y = X-dx,Y-dy
        head = (head+2)%4 # 바라보는 방향 바꾸기
    else:
        X,Y = X+dx,Y+dy
    
    dice = move(head) # 움직인 주사위 상태를 받고
    score += table[(X,Y)] # 점수 획득하기
    if dice[-1] > arr[Y][X]:
        head = (head+1)%4
    elif dice[-1] < arr[Y][X]:
        head = (head-1)%4
print(score)
```

[/tabs]

* SOLUTION 1
  * 주사위 상태: 현재 주사위의 상태를 list로 저장 (자료형은 상관 없음. 인덱스만 기억하면 됨)
  * BFS 점수 계산: BFS를 통해 현재 이동한 칸에서 점수를 얼마나 획득할 수 있는지 체크
  * 주사위 굴리기: deque를 이용해서 index, value 큐 두 개를 이용해서 rotate 시키기

## **코멘트**

* 쉬운 문제.
