---
title: "programmers : 타겟 넘버"
date: "2023-11-10"
skills: ["Python"]
hashtags: ["bruteforce"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/43165"
description: "BFS를 활용한 타겟 넘버 만들기"
status: "published"
---

# [programmers : 타겟 넘버](https://school.programmers.co.kr/learn/courses/30/lessons/43165)

## **목표**

> 숫자 배열에 +, - 연산자를 사용하여 타겟 넘버를 만드는 방법의 수를 구하는 문제.
> `BFS로 각 숫자에 대해 +와 - 두 가지 경우를 탐색하여 타겟 넘버 도달 횟수 계산`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque

def solution(numbers,target):
    
    answer = 0
    q = deque([(0,0)])
    while q:
        x,stage = q.popleft()
        
        # 숫자를 모두 사용했을 때, 타겟 넘버가 됐으면 answer += 1
        if stage == len(numbers) and x == target:
            answer += 1
        
        # 숫자를 모두 사용하지 않은 경우, +와 -에 대해서 탐색
        if stage < len(numbers):
            for i in (numbers[stage],-numbers[stage]):
                q.append((x+i,stage+1))
            
    return answer
```

[/tabs]

* SOLUTION 1
  * 완전 탐색: 리스트 길이가 20 이하이므로 2^20 = 약 10만 케이스로 완전 탐색 가능
  * BFS: 현재 숫자와 사용한 숫자 개수를 큐에 담아서 탐색
  * 가지치기: 각 단계에서 +와 - 두 가지 경우만 탐색하여 효율적으로 처리

## **코멘트**

* 기본 BFS 문제
