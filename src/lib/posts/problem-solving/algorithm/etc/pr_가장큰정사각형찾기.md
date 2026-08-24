---
title: "programmers : 가장 큰 정사각형 찾기"
date: "2025-03-17"
skills: ["Python"]
hashtags: ["etc"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/12905"
description: "누적합을 활용한 가장 큰 정사각형 찾기 문제"
status: "published"
---

# [programmers : 가장 큰 정사각형 찾기](https://school.programmers.co.kr/learn/courses/30/lessons/12905)

## **목표**

> 2차원 배열에서 1로 이루어진 가장 큰 정사각형의 넓이를 구하는 문제.
> `누적합을 이용해서 반복 계산 줄이기. 누적합 배열 만들어주고, 큰 정사각형부터 찾을 수 있도록 3중 for문 돌리면서 탈출해주기`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(arr):

    H,W = len(arr), len(arr[0])
    cumsum = [[0]*(W+1) for _ in range(H+1)]
    for i in range(H):
        for j in range(W):
            cumsum[i+1][j+1] = cumsum[i][j+1] + cumsum[i+1][j] - cumsum[i][j] + arr[i][j]

    answer = 1 if cumsum[-1][-1] else 0
    for n in range(min(H,W),0,-1):
        for y in range(H,n,-1):
            for x in range(W,n,-1):
                square = cumsum[y][x] - cumsum[y-n-1][x] - cumsum[y][x-n-1] + cumsum[y-n-1][x-n-1]
                if square == (n+1)**2:
                    answer = max(answer, square)
                    return answer
    return answer
```

[/tabs]

* SOLUTION 1
  * 누적합: 누적합을 이용해서 반복 계산 줄이기
  * 탐색 순서: 누적합 배열 만들어주고, 큰 정사각형부터 찾을 수 있도록 3중 for문 돌리면서 탈출해주기

## **코멘트**

* 
