---
title: "코드트리 : 포탑 부수기"
date: "2024-01-01"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://www.codetree.ai/training-field/frequent-problems/problems/destroy-the-turret/submissions?page=1&pageSize=20"
description: "힙 + BFS + DFS를 활용한 포탑 부수기 문제"
status: "published"
---

# [코드트리 : 포탑 부수기](https://www.codetree.ai/training-field/frequent-problems/problems/destroy-the-turret/submissions?page=1&pageSize=20)

## **목표**

> 포탑들이 서로 공격하고 수리하는 시뮬레이션 문제. 가장 약한 포탑이 가장 강한 포탑을 공격하고, 레이저 공격이 가능하면 레이저로, 불가능하면 폭탄으로 공격.
> `공격/수비는 힙으로 구현. 레이저 길찾기는 모듈러를 활용해서 경계선 이동하기. BFS로 탐색 후 DFS로 최단 경로 구하기`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque
import heapq as hq

H,W,K = map(int,input().split())
arr = [list(map(int,input().split())) for _ in range(H)]

dire = [(1,0),(0,1),(-1,0),(0,-1)]
splash = [(j,i) for i in (1,0,-1) for j in (1,0,-1)] # 폭탄 : 중심좌표 포함 9칸
inside = lambda x,y : 0<=x<W and 0<=y<H

# 각 좌표 마지막 공격
last_atk = [[0]*W for _ in range(H)]

def find_tower():

    for i in range(H):
        for j in range(W):
            if arr[i][j]:
                # 공격력,마지막 공격시점, 행,열, 좌표 -> 힙으로 구현
                hq.heappush(attackers,(arr[i][j],-last_atk[i][j],-(j+i),-j,(j,i)))
                hq.heappush(defenders,(-arr[i][j],last_atk[i][j],j+i,j,(j,i)))

    # 한 명만 남으면 탈출
    if len(attackers) == 1:
        return (None,None)
    
    # 가장 약한 (공격자) / 가장 강한 (수비자)
    *_,atk_loc = hq.heappop(attackers)
    *_,dfd_loc = hq.heappop(defenders)
    return atk_loc,dfd_loc

# 레이저 경로를 찾을 수 있는지
def bfs(now:tuple, end:tuple):
    
    global find,path
    
    x,y = now
    Q = deque([now])
    V = [[-1]*W for _ in range(H)]
    V[y][x] = 0    
    while Q:
        x,y = Q.popleft()
        
        if (x,y) == end:
            find = V[y][x]
        
        for dx,dy in dire:
            nx,ny = (x+dx)%W,(y+dy)%H
            if V[ny][nx] == -1 and arr[ny][nx]:
                V[ny][nx] = V[y][x] + 1
                Q.append((nx,ny))
    return V

# 레이저 경로가 있으면 최단 경로 구하기
def dfs(now:tuple, end:tuple, V:list):
    
    global find,path,visit
    x,y = now
    if path:
        return
    
    if now == end:
        path = V[:]
        return
    
    if visit[y][x] >= find:
        return
    
    for dx,dy in dire:
        nx,ny = (x+dx)%W,(y+dy)%H
        if arr[ny][nx] and (visit[ny][nx] == visit[y][x]+1):
            dfs((nx,ny),end,V+[(nx,ny)])
            
# 주어진 경로를 따라서 공격.
def laser(dmg:int, path:list):
    fight.update(path)
    dmg_2,q = divmod(dmg,2)
    for x,y in path:
        arr[y][x] -= dmg_2
    arr[y][x] -= (dmg_2+q)
    
# 중심 좌표를 기준으로 공격.
def bomb(dmg:int, dfd_loc:tuple):
    dmg_2,q = divmod(dmg,2)
    dfd_x,dfd_y = dfd_loc
    for dx,dy in splash: # 포탄포함 9칸
        nx,ny = (dfd_x+dx)%W, (dfd_y+dy)%H
        if (nx,ny) != atk_loc:
            arr[ny][nx] -= dmg_2
            fight.add((nx,ny))
    arr[dfd_y][dfd_x] -= (dmg_2+q)

# 부서짐 / 회복   
def update():
    for i in range(H):
        for j in range(W):
            if arr[i][j] <= 0: 
                arr[i][j] = 0
            else:
                if (j,i) not in fight:
                    arr[i][j] += 1

for k in range(K):

    # 0. 싸움한 포탑들, 힙 저장
    fight = set()
    attackers,defenders = [],[]

    # 1. 타워 찾기
    atk_loc,dfd_loc = find_tower()
    if (atk_loc,dfd_loc) == (None,None):
        break
    fight.add(atk_loc)

    # 2. 공격 유형 정하기
    path,find = None,False
    ax,ay = atk_loc
    arr[ay][ax] += H+W
    last_atk[ay][ax] = k+1
    visit = bfs(atk_loc,dfd_loc)
    dfs(atk_loc,dfd_loc,[])
    
    # 3. 공격하기
    if find: laser(arr[ay][ax],path)
    else: bomb(arr[ay][ax],dfd_loc)

    # 4. 부서짐/정비
    update()
    
answer = 0
for i in range(H):
    for j in range(W):
        answer = max(answer,arr[i][j])
print(answer)
```

[/tabs]

* SOLUTION 1
  * 공격/수비: 힙을 통해서 구현. 최대 100개의 정보에서 logN으로 빠르게 뽑음
  * 레이저 길찾기: 모듈러를 활용해서 경계선 이동하기. BFS로 탐색
  * 레이저 공격: 지점을 공격할 수 있을 경우, DFS로 길찾기. 지나온 경로에 모두 DMG//2만큼 빼주고, 공격 지점에는 (DMG//2 + 나머지) 한 번 더 뺌
  * 폭탄 공격: 공격 지점 9칸에 DMG//2만큼 빼주고, 공격 지점에는 (DMG//2 + 나머지) 한 번 더 뺌
  * 건물 부수기/수리: 맵 한 번 훑어주면서 좌표 업데이트

## **코멘트**

* 첫 DFS 풀이는 47분 걸렸는데, 디버깅 하면 자꾸 다른 테케에서 빵꾸나서 다시 짰음
* BFS로 바꿨다가 또 다른 테케에서 빵꾸나서 둘이 합쳐서 풀이
* DFS에서 방문처리를 안해서 시간이 오래 걸린 듯
