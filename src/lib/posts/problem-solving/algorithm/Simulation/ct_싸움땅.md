---
title: "코드트리 : 싸움땅"
date: "2024-02-25"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://www.codetree.ai/training-field/frequent-problems/problems/battle-ground/description?page=1&pageSize=20"
description: "힙 + 딕셔너리를 활용한 싸움땅 문제"
status: "published"
---

# [코드트리 : 싸움땅](https://www.codetree.ai/training-field/frequent-problems/problems/battle-ground/description?page=1&pageSize=20)

## **목표**

> 플레이어들이 이동하고 총을 주워 싸우는 시뮬레이션 문제. 플레이어는 이동 후 같은 칸에 다른 플레이어가 있으면 싸우고, 없으면 총을 교환함.
> `플레이어는 위치/능력치/방향으로 관리. 총은 같은 좌표에 여러 개가 들어가므로 최대힙 사용. 환형, 사이클, 반대방향에서는 모듈러 사용`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
import heapq as hq
from collections import defaultdict as dd
N,M,K = map(int,input().split())

# 특정 좌표의 총들을 최대 힙으로 뽑기
guns = dd(list)
for i in range(N):
    for j,gun in enumerate(map(int,input().split())):
        if gun: hq.heappush(guns[(j,i)],-gun)

# player[idx] = [x,y,방향,스탯,총의 공격력]
players = dd(list)
for idx in range(M):
    y,x,d,s = map(int,input().split())
    players[idx+1] = [x-1,y-1,d,s,0]

# locs[(x,y)] = idx
locs = dd(int)
for idx in range(M):
    x,y,d,s,g = players[idx+1]
    locs[(x,y)] = idx+1
    
dire = [(0,-1),(1,0),(0,1),(-1,0)]
    
# 범위 체크, 상 우 하 좌 순서
def inside(x,y):
    if 0<=x<N and 0<=y<N:
        return True
    return False
        
# (x,y)에서 총을 바꾼다.
def change(x,y,g):
    hq.heappush(guns[(x,y)],-g)
    g = hq.heappop(guns[(x,y)])
    return -g

# 공격자가 이긴 경우
def atk_win(s,g,es,eg):
    if (s+g > es+eg) or ((s+g == es+eg) and s>es):
        return True
    return False

# 패배자 이동
def loser_move(lidx):    

    lx,ly,ld,ls,lg = players[lidx]
    hq.heappush(guns[(lx,ly)],-lg) # 땅에 버리고
    for i in range(4):
        nld = (ld+i)%4
        dx,dy = dire[nld]
        nlx,nly = lx+dx,ly+dy

        if inside(nlx,nly) and locs[(nlx,nly)] == 0:
            locs[(nlx,nly)] = lidx
            players[lidx] = [nlx,nly,nld,ls,change(nlx,nly,0)]
            return

score = [0]*(M+1)
for _ in range(K):
    # 플레이어마다 이동
    for idx in range(1,M+1):
        
        x,y,d,s,g = players[idx]
        dx,dy = dire[d]
        nx,ny,nd = x+dx,y+dy,d
        
        # 벽에 막히는 경우 반대 방향으로 이동
        if not inside(nx,ny):
            nx,ny,nd = x-dx,y-dy,(d+2)%4

        locs[(x,y)] = 0
        # 사람이 없는 경우 : (x,y) -> (nx,ny)
        if locs[(nx,ny)] == 0:
            locs[(nx,ny)] = idx
            players[idx] = [nx,ny,nd,s,change(nx,ny,g)] # 이동 후 총 교환
  
        # 사람 있는 경우 : 공격자 : (x,y) -> (nx,ny) / 진사람 : (nx,ny) -> (?,?)
        else:
            players[idx] = [nx,ny,nd,s,g] # 공격자 이동
            eidx = locs[(nx,ny)] # 수비자 번호
            ex,ey,ed,es,eg = players[eidx] # 수비자 정보

            # 능력치 계산
            if atk_win(s,g,es,eg):
                score[idx] += abs((s+g)-(es+eg))
                locs[(nx,ny)] = idx
                loser_move(eidx)
                players[idx][-1] = change(nx,ny,players[idx][-1])
            else:
                score[eidx] += abs((s+g)-(es+eg))
                locs[(nx,ny)] = eidx
                loser_move(idx)      
                players[eidx][-1] = change(nx,ny,players[eidx][-1])

print(*score[1:])
```

[/tabs]

* SOLUTION 1
  * 플레이어 관리: 플레이어는 위치/능력치/방향으로 관리. 특정 좌표로 이동한 경우, 어떤 플레이어가 있는지 바로 확인해야 함
  * 총 관리: 같은 좌표에 여러 개의 총이 들어가므로 최대힙 사용
  * 플레이어 이동: 환형, 사이클, 반대방향에서는 모듈러 사용. 앞으로 한칸 이동 (벽이면 (인덱스+2)%4 해주기 상우하좌)

## **코멘트**

* 확실히 막 짜는거보다는, 구상을 한 번 하고 어떤 자료구조를 쓰고 어떤 함수를 쓸 지 생각하는게 빠르다.
* 처음 코드는 70분 정도 걸렸는데, 테케 6을 통과 못해서 다시 풀이
