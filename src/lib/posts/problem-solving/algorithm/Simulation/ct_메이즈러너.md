---
title: "코드트리 : 메이즈러너"
date: "2024-02-18"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://www.codetree.ai/training-field/frequent-problems/problems/maze-runner/description?page=1&pageSize=20"
description: "브루트포스 + 회전을 활용한 메이즈러너 문제"
status: "published"
---

# [코드트리 : 메이즈러너](https://www.codetree.ai/training-field/frequent-problems/problems/maze-runner/description?page=1&pageSize=20)

## **목표**

> 참가자들이 미로를 탈출하는 게임. 참가자들이 이동한 후, 참가자와 출구를 포함한 가장 작은 정사각형을 시계방향으로 90도 회전시키고 벽의 내구도를 감소시킴.
> `사각형 찾기는 브루트 포스 (맵이 별로 안크다). 미로 회전은 list(zip(*리스트)) + [::-1]로 90도 회전. 모듈화시켜서 미로, 플레이어 정보를 계속 업데이트`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import defaultdict as dd

# 미로 정보 : 벽(1이상) / 출구(-1)
N,M,K = map(int,input().split())
maze = [[0]*(N+1)]
for _ in range(N):
    maze.append([0]+list(map(int,input().split())))

# 플레이어 위치 : 리스트 형태 / 딕셔너리 형태
player_list = [[0]*(N+1) for _ in range(N+1)]
player_dict = dd(int)
for _ in range(M):
    py,px = map(int,input().split())
    player_dict[(px,py)] += 1
    player_list[py][px] += 1

# 출구 정보
ey,ex = map(int,input().split())
maze[ey][ex] = -1
dire = [(0,1),(0,-1),(1,0),(-1,0)] # 상하우좌

# 거리 / 내부 체크
dist = lambda x1,y1,x2,y2 : abs(y2-y1)+abs(x2-x1)
inside = lambda x,y: 1<=x<=N and 1<=y<=N

def move(player_dict):   
    global step,escape
    new_list = [[0]*(N+1) for _ in range(N+1)]
    new_dict = dd(int)
    for (px,py),a in tuple(player_dict.items()): # (px,py)에 a명
        if a >= 1:
            d = dist(px,py,ex,ey)
            for dx,dy in dire:
                npx,npy = px+dx,py+dy
                if inside(npx,npy) and maze[npy][npx] <= 0: # 내부/벽아닌경우
                    nd = dist(npx,npy,ex,ey)
                    if nd < d: # 짧아지면 이동
                        if (ex,ey) != (npx,npy):
                            new_list[npy][npx] += a
                            new_dict[(npx,npy)] += a
                        else:
                            escape += a
                        step += a
                        break
            else:
                new_list[py][px] += a
                new_dict[(px,py)] += a
    return new_list,new_dict

def rect(player_dict):
    for l in range(1,N+1):
        for i in range(1,N+1-l):
            for j in range(1,N+1-l):
                if j<=ex<=j+l and i<=ey<=i+l:
                    for (px,py),a in player_dict.items():
                        if a >= 1 and j<=px<=j+l and i<=py<=i+l:
                            return (j,i,l+1)

def rotate(array):
    temp = []
    for i in range(size):
        temp.append(array[y+i][x:x+size])
    temp = list(zip(*temp)) # 전치
    for i in range(size):
        temp[i] = list(temp[i][::-1])
    return temp

def destroy(array):
    for i in range(y,y+size):
        for j in range(x,x+size):
            if array[i][j] >= 1:
                array[i][j] -= 1
    return array

def update(maze,player_list):
    new_dict = dd(int)
    for i in range(1,N+1):
        for j in range(1,N+1):
            if maze[i][j] == -1:
                ex,ey = j,i
            if player_list[i][j] >= 1:
                new_dict[(j,i)] += player_list[i][j]
    return ex,ey,maze, new_dict

escape = 0
step = 0 # 이동 거리
exit_loc = (ey,ex) # 출구 위치
for k in range(K):
    
    player_list, player_dict = move(player_dict)
    if escape == M:
        break
        
    x,y,size = rect(player_dict)
    # 회전
    sub_maze = rotate(maze)
    sub_player_list = rotate(player_list)
    for i in range(size):
        maze[y+i][x:x+size] = sub_maze[i]      
        player_list[y+i][x:x+size] = sub_player_list[i]
    maze = destroy(maze)
    
    ex,ey,maze,player_dict = update(maze, player_list)

print(step)
print(ey,ex)
```

[/tabs]

* SOLUTION 1
  * 사각형 찾기: 브루트 포스 (맵이 별로 안크다)
  * 미로 회전: list(zip(*리스트)) + [::-1]로 90도 회전
  * 모듈화: 모듈화시켜서 미로, 플레이어 정보를 계속 업데이트 해주기
  * 플레이어 정보: 플레이어 정보를 2D로 표현해서 풀면서 위치 쉽게 파악하기. 플레이어를 2D에만 놓으면 비효율적이므로, 딕셔너리를 추가해서 플레이어만 다루기

## **코멘트**

* 풀기 전에 모듈화, 자료구조 등 생각해서 풀기.
* 모듈화를 해야 디버깅을 할 때, 금방 찾을 수 있다.
* 삼성 구현에서 특히 list, dict을 잘 써야 시간을 줄일 수 있다.
* 플레이어가 동일한 위치에 있는 경우 여러 번 이동하는 경우를 줄일 수 있다.
* 이 문제에서는 크게 차이가 없긴 한데 **마법사 상어와 복제** 문제에서는 차이가 꽤 있었다.
