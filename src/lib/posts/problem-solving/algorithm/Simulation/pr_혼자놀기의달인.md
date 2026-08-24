---
title: "programmers : 혼자 놀기의 달인"
date: "2024-06-10"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/131130"
description: "간단한 구현을 활용한 혼자 놀기의 달인 문제"
status: "published"
---

# [programmers : 혼자 놀기의 달인](https://school.programmers.co.kr/learn/courses/30/lessons/131130)

## **목표**

> 카드를 선택해서 그룹을 만들 때, 두 그룹의 크기의 곱의 최댓값을 구하는 문제.
> `간단한 구현으로 다음 연결 카드를 찾는 과정에서 재귀로 깔끔하게 짤 수도 있음`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(cards):
    
    # play를 통해서 카드 연결하고 그룹 찾기
    def play(x,V):
        group = []
        while not V[x]:
            V[x] = True
            group.append(x)
            x = cards[x]-1
        return group
    
    L = len(cards)
    answer = 0
    for i in range(L):
        V = [False]*L
        group1 = play(i,V)
        if len(group1) == L:
            continue
        
        for j in range(L):
            if not V[j]:
                group2 = play(j,V)
                answer = max(answer, len(group1)*len(group2))
    
    return answer
```

[/tabs]

* SOLUTION 1
  * 간단한 구현: 그냥 간단한 구현
  * 재귀 활용: 다음 연결 카드를 찾는 과정에서 재귀로 깔끔하게 짤 수도 있음

## **코멘트**

* 
