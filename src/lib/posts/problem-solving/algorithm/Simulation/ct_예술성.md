---
title: "코드트리 : 예술성"
date: "2024-04-07"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://www.codetree.ai/training-field/frequent-problems/problems/artistry/description?page=1&pageSize=20"
description: "BFS + 회전을 활용한 예술성 문제"
status: "published"
---

# [코드트리 : 예술성](https://www.codetree.ai/training-field/frequent-problems/problems/artistry/description?page=1&pageSize=20)

## **목표**

> 그림의 예술 점수를 계산하는 문제. 인접한 그룹 간의 조화로움을 계산하고, 그림을 회전시켜 다시 계산하는 과정을 반복.
> `BFS로 덩어리 찾기. 배열 순회하면서 경계선 카운팅 해주기. list(zip(*array)) + a로 시계, 반시계 구현하기`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque, defaultdict as dd

N = int(input())
arr = [list(map(int,input().split())) for _ in range(N)]

dire = [(1,0),(0,1),(-1,0),(0,-1)]

# 각 사이클 마다 BFS 진행. 덩어리의 크기 반환
def bfs(x,y,number):
    t = arr[y][x]
    Q = deque([(x,y)])
    V[y][x] = number
    size = 1
    while Q:
        x,y = Q.popleft()
        for dx,dy in dire:
            nx,ny = x+dx,y+dy
            if 0<=nx<N and 0<=ny<N and not V[ny][nx] and arr[ny][nx] == t:
                Q.append((nx,ny))
                V[ny][nx] = number
                size += 1
    return size

# 2차원 리스트를 입력받아서 회전
def rotate(array,clockwise):
    if clockwise:
        temp_array = list(zip(*array))
        for i in range(len(temp_array)):
            temp_array[i] = list(temp_array[i][::-1])
    else:
        temp_array = list(zip(*array))
        temp_array = temp_array[::-1]
        for i in range(len(temp_array)):
            temp_array[i] = list(temp_array[i])
    return temp_array

answer = 0
for _ in range(4):
    
    # 각 사이클마다 BFS 진행
    V = [[False]*N for _ in range(N)]
    sizes = dd(int) # 덩어리의 크기
    values = dd(int) # 각 덩어리의 값
    count = 1
    for i in range(N):
        for j in range(N):
            if not V[i][j]:
                sizes[count] = bfs(j,i,count)
                values[count] = arr[i][j]
                count += 1
    
    # 순회하면서 인접노드와 다른 경우 카운팅
    harmonys = dd(int)
    for i in range(N):
        for j in range(N):
            a = V[i][j]
            for dj,di in dire:
                nj,ni = j+dj,i+di
                # 서로 다른 덩어리일 경우 카운팅해주기.
                if 0<=nj<N and 0<=ni<N and V[i][j] != V[ni][nj]:
                    na = V[ni][nj]
                    harmonys[(min(a,na),max(a,na))] += 1
    
    # 점수 계산하기
    for g1,g2 in harmonys.keys(): # 중복카운팅 됐으므로 harmony 값에서 나누기 2
        answer += (sizes[g1]+sizes[g2])*values[g1]*values[g2]*(harmonys[(g1,g2)]//2)
        
    # 회전시키기
    new_arr = rotate(arr,False)
    for i in [0,(N//2)+1]:
        for j in [0,(N//2)+1]:
            before = [[arr[i+ni][j+nj] for nj in range(N//2)] for ni in range(N//2)]
            after = rotate(before,True)
            for ni in range(N//2):
                for nj in range(N//2):
                    new_arr[i+ni][j+nj] = after[ni][nj]
    arr = [row[:] for row in new_arr]
print(answer)
```

[/tabs]

* SOLUTION 1
  * BFS로 덩어리 찾기: 각 사이클마다 BFS 진행하여 덩어리의 크기 반환
  * 경계선 카운팅: 배열 순회하면서 경계선 카운팅 해주기
  * 회전 구현: list(zip(*array)) + a로 시계, 반시계 구현하기

## **코멘트**

* 배열 회전은 단골이라 어렵지 않은 문제.
* before = [[arr[i+ni][j+nj] for nj in range(N//2)] for ni in range(N//2)]
  * 이 부분에서 y축부터 읽어서 배열이 좀 꼬여서 찾는데 시간 좀 걸렸음.
  * 항상 순서 생각하면서 넣기.
