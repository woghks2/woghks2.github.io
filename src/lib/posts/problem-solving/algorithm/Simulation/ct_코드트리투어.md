---
title: "코드트리 : 코드트리 투어"
date: "2024-05-11"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://www.codetree.ai/training-field/frequent-problems/problems/codetree-tour/description?page=1&pageSize=20"
description: "다익스트라 + 힙을 활용한 코드트리 투어 문제"
status: "published"
---

# [코드트리 : 코드트리 투어](https://www.codetree.ai/training-field/frequent-problems/problems/codetree-tour/description?page=1&pageSize=20)

## **목표**

> 여행 상품을 관리하는 시스템. 상품 생성, 취소, 판매, 출발지 변경 등의 쿼리를 처리하는 문제.
> `node x에서 다른 노드까지 최단거리는 다익스트라. 상품에는 판매중인 상품/대기중인 상품(접근 불가)가 있고, id가 고유한 상품이므로 삭제를 했을 경우 다시는 나오지 않음`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import defaultdict as dd
import heapq as hq

def di(start):
    visit = dd(lambda: 1e9)
    visit[start] = 0
    heap = [(0,start)]
    while heap:
        c,x = hq.heappop(heap)
        if c < visit[x]:
            continue

        for nx,cost in G[x]:
            nc = c+cost
            if nc < visit[nx]:
                hq.heappush(heap,(nc,nx))
                visit[nx] = nc
    return visit

departure = 0
possible,impossible = [],[]
possible_set,impossible_set,ban = set(),set(),set()
for _ in range(int(input())):
    query,*infos = list(map(int,input().split()))
    
    # 그래프 연결
    if query == 100:
        n,m,*infos = infos
        
        # 간선 정보 업데이트 : 중복 간선 / 셀프 간선 처리 (딕셔너리 2중첩)
        G_temp = dd(lambda : dd(lambda : 1e9))
        for i in range(m):
            a,b,cost = infos[3*i:3*i+3]
            G_temp[a][b] = min(G_temp[a][b],cost)
            G_temp[b][a] = min(G_temp[b][a],cost)
        
        # 그래프 연결 (해싱2회 -> 리스트 접근 후 순회)
        G = dd(list)
        for s in G_temp:
            G[s].extend(G_temp[s].items())
        V = di(departure)    

    # 여행 상품 생성
    elif query == 200:
        iden,price,dest = infos
        profit = price-V[dest]
        
        # 도달 가능
        if profit >= 0:
            hq.heappush(possible,(-profit,iden,price,dest))
            possible_set.add(iden)
        # 도달 불가능
        else:
            impossible.append((-profit,iden,price,dest))
            impossible_set.add(iden)

    # 여행 상품취소
    elif query == 300:
        iden = infos[0]
        if iden in possible_set or iden in impossible_set:
            ban.add(iden)
        possible_set.discard(iden)
        impossible_set.discard(iden)
        
    # 상품 판매
    elif query == 400:
        temp = []
        while possible: # 상품 있으면 뽑고
            profit,iden,price,dest = hq.heappop(possible)
            # 중간에 300에 의해서 사라진 애들이면 삭제
            if iden in ban:
                continue
            # 판매중이면 출력
            if iden in possible_set:
                print(iden)
                possible_set.discard(iden)
                ban.add(iden)
                break
            # 판매 안하면 잠시 temp에 담아두기
            else:
                temp.append((profit,iden,price,dest))                
        else:
            print(-1)
        # 담아뒀던 temp 다시 판매상품으로
        for i in temp:
            hq.heappush(possible,i)

    # 출발지 변경
    elif query == 500:
        departure = infos[0]
        V = di(departure)
        temp,temp_ban = [],[]
        possible_set,impossible_set = set(),set()
        for sales in (possible,impossible):
            for _,iden,price,dest in sales:
                if iden in ban:
                    continue
                profit = price-V[dest]
                if profit >= 0: # 도달 가능 / 취소안한상품
                    hq.heappush(temp,(-profit,iden,price,dest))
                    possible_set.add(iden)
                else: # 도달 불가능
                    temp_ban.append((-profit,iden,price,dest))
                    impossible_set.add(iden)
        possible = temp
        impossible = temp_ban
```

[/tabs]

* SOLUTION 1
  * 다익스트라: node x에서 다른 노드까지 최단거리 -> 다익스트라
  * 그래프 연결: 100 쿼리에서 그래프 연결 + 다익스트라
  * 상품 관리: 200/300은 상품 생성/삭제. id가 고유한 상품이므로 삭제를 했을 경우 다시는 나오지 않음
  * 상품 판매: 400은 상품 판매. 상품을 판매한 경우 다시는 나오지 않음. 상품에는 판매중인 상품/대기중인 상품(접근 불가)가 있음
  * 출발지 변경: 500은 시작점 변경 + 다익스트라. 판매 중인 상품/대기중인 상품 정보를 바탕으로 다익스트라 구성

## **코멘트**

* 금방 풀었는데 TLE에서 오래걸림...
* 루프에서 항상 TLE 방지하는 코드 작성해주기......
* 특히 시간복잡도 계산이 어려운 경우 or 더미 데이터가 쌓이는 경우
