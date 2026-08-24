---
title: "코드트리 : 나무박멸"
date: "2024-03-05"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://www.codetree.ai/training-field/frequent-problems/problems/tree-kill-all/description?page=1&pageSize=20"
description: "시뮬레이션을 활용한 나무박멸 문제"
status: "published"
---

# [코드트리 : 나무박멸](https://www.codetree.ai/training-field/frequent-problems/problems/tree-kill-all/description?page=1&pageSize=20)

## **목표**

> 나무가 성장하고 확장한 후 제초제를 뿌려 나무를 제거하는 최대 제거량을 구하는 문제.
> `나무 주변으로 빈 칸, 벽, 나무가 있는지 체크하고(search), 주변 나무 개수에 따라 성장함(grow), 주변 빈 칸에 따라 확장함(spread), 제초제를 뿌릴 위치를 찾고(find_spot) 나무 제거`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
# 나무 박멸
N,M,K,C = map(int,input().split())
arr = [list(map(int,input().split())) for _ in range(N)]
    
weedkiller = [[0]*N for _ in range(N)]

dire = [(1,0),(-1,0),(0,1),(0,-1)]
dig = [(1,1),(-1,1),(1,-1),(-1,-1)]

inside = lambda x,y: 0<=x<N and 0<=y<N

def search():
    infos = {}
    for y in range(N):
        for x in range(N):
            # 나무가 있는 칸 주변 조사
            if arr[y][x] > 0:
                infos[(x,y)] = {'tree':[],'empty':[]}
                for dx,dy in dire:
                    nx,ny = x+dx,y+dy
                    if inside(nx,ny):
                        # 나무 있으면 좌표 추가
                        if arr[ny][nx] > 0:
                            infos[(x,y)]['tree'].append((nx,ny))
                        # 빈 칸이고 제초제 없는 곳 추가
                        elif arr[ny][nx] == 0 and (m==0 or m > weedkiller[ny][nx]):
                            infos[(x,y)]['empty'].append((nx,ny))
    return infos

# info 바탕으로 주변 나무 개수만큼 사이즈 업
def grow(infos):
    for (x,y) in infos:
        arr[y][x] += len(infos[(x,y)]['tree']) # 주변 나무 개수만큼 사이즈 업

# info 바탕으로 주변 빈칸에 번식
def spread(infos):
    for (x,y) in infos:
        if infos[(x,y)]['empty']:
            size = arr[y][x]//len(infos[(x,y)]['empty'])
            for nx,ny in infos[(x,y)]['empty']: # 빈칸에 확장
                if m==0 or m > weedkiller[ny][nx]:
                    arr[ny][nx] += size

# 제초제 뿌릴 위치 찾기.
def find_spot():
    count = {}
    for y in range(N):
        for x in range(N):
            if arr[y][x] > 0: # 나무 있는 칸
                cnt = arr[y][x]
                for dx,dy in dig:
                    for k in range(1,K+1):
                        nx,ny = x+k*dx,y+k*dy
                        if not inside(nx,ny) or arr[ny][nx] <= 0:
                            break
                        cnt += arr[ny][nx]
                count[(x,y)] = cnt
                
    if not count:
        return None

    temp = sorted(count.items(),key= lambda x:(x[1],-x[0][1],-x[0][0]))
    return temp[-1][0]

# 중심 위치를 바탕으로 제초제 확산
def eliminate(loc):
    x,y = loc
    weedkiller[y][x] = m+C
    E = arr[y][x]
    arr[y][x] = 0
    for dx,dy in dig:
        for k in range(1,K+1):
            nx,ny = x+k*dx,y+k*dy
            if not inside(nx,ny):
                break
            if arr[ny][nx] <= 0: # 바깥 or 벽으로 막히면 다음방향
                if arr[ny][nx] == 0:
                    weedkiller[ny][nx] = m+C
                break
            else:
                E += arr[ny][nx]
                arr[ny][nx] = 0
                weedkiller[ny][nx] = m+C
    return E

# 시뮬레이션
answer = 0
for m in range(M):

    infos = search()
    grow(infos)
    spread(infos)
    loc = find_spot()
    if loc == None:
        break
    
    E = eliminate(loc)
    answer += E
print(answer)
```

[/tabs]

* SOLUTION 1
  * 나무 조사: 나무 주변으로 빈 칸, 벽, 나무가 있는지 체크 (search)
  * 성장: 주변에 있는 나무 개수에 따라 성장함 (grow)
  * 확장: 주변에 있는 빈 칸에 따라 확장함 (spread)
  * 제초제 위치: 제초제를 뿌릴 위치를 찾음 (위치:개수) 이후 정렬 (기준 3개) -> find_spot
  * 제초제 유지: 제초제 유지시간을 기록해야하니 N*N size 리스트를 더 만듦

## **코멘트**

* 복붙 금지... 진짜금지...
* 문제 잘 읽기. 빈칸까지 제초제를 뿌리는 조건이랑 제초제 선정 나무가 여러개일 때 선정 기준을 못봤다.
