---
title: "programmers : 연속 펄스 부분 수열의 합"
date: "2025-03-23"
skills: ["Python"]
hashtags: ["dp"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/161988"
description: "2차원 DP를 활용한 연속 펄스 부분 수열 최대 합 구하기"
status: "published"
---

# [programmers : 연속 펄스 부분 수열의 합](https://school.programmers.co.kr/learn/courses/30/lessons/161988)

## **목표**

> 배열에 1, -1, 1, -1... 패턴으로 곱한 부분 수열의 합의 최대값을 구하는 문제.
> `state는 1이 곱해졌는지, -1로 곱해졌는지 2가지로 나뉘므로 2차원 dp만들고 O(N)으로 순회`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(arr):
    
    N = len(arr)
    dp = [[0]*N for _ in range(2)]
    dp[0][0] = arr[0]
    dp[1][0] = -arr[0]
    
    for i in range(N-1):
        dp[0][i+1] = max(arr[i+1], dp[1][i] + arr[i+1])
        dp[1][i+1] = max(-arr[i+1], dp[0][i] - arr[i+1])

    return max(max(dp[i]) for i in range(2))
```

[/tabs]

* SOLUTION 1
  * 2차원 DP: 입력보고 O(N)으로 비벼야겠다고 생각. state는 1이 곱해졌는지, -1로 곱해졌는지 2가지로 나뉘길래 2차원 dp만들고 O(N)으로 순회
  * DP 저장: dp배열에는 현재 1 혹은 -1이 곱해졌을 때 부분 수열의 합의 최대값을 기록
  * 최대값: dp배열에는 최대값을 끝까지 가지고 있지 않음 (다음 위치에는 부분 수열의 합이 작아질수도) -> max(dp[0]), max(dp[1]) 비교

## **코멘트**

*  
