---
title: "programmers : 단어퍼즐"
date: "2024-01-01"
skills: ["Python"]
hashtags: ["graph"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/12983"
description: "BFS를 활용한 단어퍼즐 문제"
status: "published"
---

# [programmers : 단어퍼즐](https://school.programmers.co.kr/learn/courses/30/lessons/12983)

## **목표**

> 주어진 단어들로 타겟 문자열을 만들 수 있는 최소 단어 개수를 구하는 문제.
> `시간제한이 좀 빡빡한 문제. BFS로 시작 단어에서 끝 단어를 만들 수 있는지 확인하기`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque,defaultdict as dd

def solution(strs,target):
    
    # 타겟 길이 T, 큐 Q, 방문처리 V, 길이 분류 table
    T = len(target)
    Q = deque()
    V = set()
    table = dd(list)
    for idx,s in enumerate(strs):
        l = len(s)
        table[l].append(s)
        if s == target[:l]:
            Q.append((l,1))
            V.add(l)
    
    # BFS 탐색
    answer = 1e9
    while Q:
        l,cnt = Q.popleft()
        if l == T:
            answer = min(answer,cnt)
        for nl in table.keys():
            # 현재 검사할 부분 단어
            temp = target[l:l+nl]
            for ns in table[nl]:
                # T보다 길어지면 매칭x
                if l+nl > T:
                    continue
                # 방문하지 않은 길이 매칭이 가능하면 방문처리하고 큐에 추가.
                if l+nl not in V and temp == ns:
                    Q.append((l+nl,cnt+1))
                    V.add(l+nl)
    return answer if answer != 1e9 else -1
```

[/tabs]

* SOLUTION 1
  * BFS: 시간제한이 좀 빡빡한 문제. BFS로 시작 단어에서 끝 단어를 만들 수 있는지 확인하기
  * 최적화: 큐에 string 자체를 넣으면 메모리나 시간적으로 손해. target string의 특정 인덱스까지 매칭을 시켰으면 방문처리하고 큐에 추가함

## **코멘트**

* 효율성 검사할거면 미리 적어놓든가, 시간제한이라도 주든가.........
