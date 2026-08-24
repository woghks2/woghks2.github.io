---
title: "코드트리 : 꼬리잡기놀이"
date: "2024-03-26"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://www.codetree.ai/training-field/frequent-problems/problems/tail-catch-play/description?page=1&pageSize=20"
description: "DFS + deque를 활용한 꼬리잡기놀이 문제"
status: "published"
---

# [코드트리 : 꼬리잡기놀이](https://www.codetree.ai/training-field/frequent-problems/problems/tail-catch-play/description?page=1&pageSize=20)

## **목표**

> 경로를 따라 이동하는 팀들이 공을 받아 점수를 얻는 문제. 공이 경로의 특정 위치에 도달하면 해당 위치의 사람이 점수를 얻고 머리와 꼬리가 바뀜.
> `경로 내에서 회전하는 문제. 환형이므로 deque 사용. 이동경로는 BFS로 하면 경로 순서가 꼬이므로 DFS로 구현`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque, defaultdict as dd

N,M,K = map(int,input().split())
arr = [list(map(int,input().split())) for _ in range(N)]
dire = [(1,0),(0,1),(-1,0),(0,-1)]

# 경로 찾기 : DFS
def dfs(x,y,path):
    for dx,dy in dire:
        nx,ny = x+dx,y+dy
        if 0<=nx<N and 0<=ny<N and arr[ny][nx] and not visit[ny][nx]:
            visit[ny][nx] = True
            path.extend([(nx,ny)])
            dfs(nx,ny,path)
            locs[count] = path

# 항상 덱의 맨 앞에는 1,3을 놓고 시작하자.
def arange():
    for i in locs:
        if curl[i] == 1: start = 3
        else: start = 1
        
        while infos[i][0] != start:
            infos[i].rotate()
            locs[i].rotate()

# curl의 방향에 따라서 회전 방향 다르게 구현하기
def rotate():
    for i in infos:
        if curl[i]: infos[i].rotate(1)
        else: infos[i].rotate(-1)

# 회전한 info 정보 바탕으로 arr 좌표 업데이트하기.
def update():
    for i in locs:
        if curl[i] == 1: start = 3
        else: start = 1
        
        while infos[i][0] != start:
            infos[i].rotate()
            locs[i].rotate()
            
        for (x,y),p in zip(locs[i],infos[i]):
            arr[y][x] = p

# 점수 얻기 + 머리꼬리 뒤집기 
def get_score(x,y):

    # i번 그룹에 존재
    for i in groups:
        if (x,y) in groups[i]:
            curl[i] ^= 1
            break

    # 머리 / 공 잡은사람
    count = []
    for idx,(loc,p) in enumerate(zip(locs[i],infos[i])):
        if loc == (x,y) or p == 1:
            count.append(idx)
    
    # 머리 꼬리 바꾸기
    for idx,p in enumerate(infos[i]):
        if p==1: infos[i][idx] = 3
        elif p==3: infos[i][idx] = 1
    update()
    
    # 머리에 맞추면 count 길이가 1이다. loc랑 p 조건문이 한 번만 동작
    if len(count) == 1:
        return 1
    count.sort()
    return (count[1]-count[0]+1)**2

# 경로 탐색 : DFS 구현하기. (항상 시계방향으로 회전하게 돼있음)
visit = [[False]*(N) for _ in range(N)]
locs = dd(lambda : deque())
count = 0
for i in range(N):
    for j in range(N):
        if arr[i][j] and not visit[i][j]:
            visit[i][j] = True
            dfs(j,i,deque([(j,i)]))
            count += 1

# 위치 / 경로 매칭. infos는 머리, 꼬리, 빈 칸 정보. groups은 경로 내 좌표들의 집합 (빨리 찾기 위함)
infos = dd(lambda : deque())
groups = dd(set)
for i in locs:
    for x,y in locs[i]:
        infos[i].append(arr[y][x])
    groups[i].update(locs[i])

# 일단 덱의 시작을 꼬리에 맞춰서 시작한다.
for i in infos:
    while infos[i][0] != 3:
        infos[i].rotate()
        locs[i].rotate()

# 회전 방향 찾아주기. [3 (4 4 4) 1 2 2] 꼴로 생겼으면 반시계 회전임. (3 뒤에 1 4가 바로오면)
curl = []
for i in infos:
    if infos[i][1] in (1,4): curl.append(0)
    else: curl.append(1)

score = 0
for k in range(K):
    # 한 칸 이동
    rotate()      
    update()

    # 공 던지기 : 경로 계산은 나머지 구해서
    stage = k%(4*N)
    if 0<=stage<N:
        for i in range(N):
            if arr[k%N][i] in (1,2,3):
                score += get_score(i,k%N)
                break
    elif N<=stage<2*N:
        for i in range(N-1,-1,-1):
            if arr[i][k%N] in (1,2,3):
                score += get_score(k%N,i)
                break
    elif 2*N<=stage<3*N:
        for i in range(N-1,-1,-1):
            if arr[N-1-k%N][i] in (1,2,3):
                score += get_score(i,N-1-k%N)
                break
    else:
        for i in range(N):
            if arr[i][N-1-k%N] in (1,2,3):
                score += get_score(N-1-k%N,i)
                break
    update()

print(score)
```

[/tabs]

* SOLUTION 1
  * 경로 회전: 경로 내에서 회전하는 문제. 환형이므로 deque 사용
  * 이동경로: BFS로 하면 경로 순서가 꼬임. DFS로 구현
  * 회전 방향: 각 경로들이 어떤 방향으로 회전하는지 조사
  * 공 경로: 스테이지 별 공의 경로 구현하기. 나머지로 구현

## **코멘트**

* 구현 난이도 자체는 어렵지 않은데 테케랑 실수할거리가 많은 문제인듯
* 첫 번째로, 인덱스 역순으로 시작하는 것들 -붙여서 좌표를 찾는 방식으로 구현했는데 함수 내에서 음수 좌표를 못찾아서 시간 소모.
* 두 번째로는 모든 경로에 사람이 있는 경우를 생각 못해서 루프 조건문을 잘 못 작성.
* 세 번째로는 curl 방향 찾아주기.
