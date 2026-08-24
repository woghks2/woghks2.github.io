---
title: "programmers : 숫자 타자 대회"
date: "2024-05-09"
skills: ["Python"]
hashtags: ["dp"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/136797"
description: "다익스트라 + DP를 활용한 숫자 타자 대회 최소 가중치 구하기"
status: "published"
---

# [programmers : 숫자 타자 대회](https://school.programmers.co.kr/learn/courses/30/lessons/136797)

## **목표**

> 키패드에서 숫자를 입력할 때 왼손과 오른손을 사용하여 최소 가중치로 입력하는 문제.
> `다익스트라로 좌표 이동 시 걸리는 가중치맵을 구한 후, DP 테이블을 순회하면서 최소값 갱신`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
import heapq as hq
from collections import defaultdict as dd

def solution(numbers):
    
    # 키패드
    arr = [['1','2','3'],
           ['4','5','6'],
           ['7','8','9'],
           ['*','0','#']]
    # x,y,cost
    dire = [(1,0,2),(0,1,2),(-1,0,2),(0,-1,2),(1,1,3),(1,-1,3),(-1,-1,3),(-1,1,3)]

    # 다익스트라 맵 V를 반환
    def di(a,b):
        V = [[1e9]*3 for _ in range(4)]
        V[b][a] = 0
        heap = [(0,a,b)]
        while heap:
            c,x,y = hq.heappop(heap)
            for dx,dy,dc in dire:
                nx,ny,nc = x+dx,y+dy,c+dc
                if 0<=nx<3 and 0<=ny<4 and nc < V[ny][nx]:
                    V[ny][nx] = nc
                    hq.heappush(heap,(nc,nx,ny))
        V[b][a] = 1
        return V
    
    # 변환 테이블을 갱신해준다.
    table = {}
    for i in range(4):
        for j in range(3):
            V = di(j,i)
            for y in range(4):
                for x in range(3):
                    table[arr[i][j]+arr[y][x]] = V[y][x]
    
    # 초기상태 왼4오6부터 시작
    string = '46' + numbers
    L = len(string)
    dp = [dd(lambda : 1e9) for _ in range(L+1)]
    dp[2][('4','6')] = 0 # 2자리까지 탐색 / 왼4오6 누른상태 가중치 0
    num = '123456789*0#'
    # 다음 문자 nxt가 나온다.
    for l in range(2,L):        
        nxt = string[l]
        for a in num: # 고정 손
            if nxt==a: # 움직일 손이 고정된 위치인 a랑 겹칠 수 없다
                continue
            for b in num: # 움직이는 손
                if dp[l][(b,a)] != 1e9: # 현재값 or 이전위치에서 b를 옮겨서 얻은 값
                    dp[l+1][(nxt,a)] = min(dp[l+1][(nxt,a)],dp[l][(b,a)]+table[b+nxt])
                if dp[l][(a,b)] != 1e9:
                    dp[l+1][(a,nxt)] = min(dp[l+1][(a,nxt)],dp[l][(a,b)]+table[b+nxt])

    return min(dp[L].values())
```

[/tabs]

* SOLUTION 1
  * 다익스트라: 백준의 DDR과 비슷한 문제. 키패드가 12개에 왼손 오른손 처리하면 144개라 양이 좀 많음. 다익스트라로 좌표 이동 시 걸리는 가중치맵을 구함
  * DP: DP 테이블을 순회하면서 최소값 갱신

## **코멘트**

* 시간이 좀 빡빡했던 문제...
* DP table에서 hash 대신 list로 접근했으면 더 빠르게 동작했을 듯... 변환해주는 코드를 더 짜야해서 패스...
