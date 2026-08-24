---
title: "programmers : 산모양 타일링"
date: "2024-06-12"
skills: ["Python"]
hashtags: ["dp"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/258705"
description: "타일링 DP를 활용한 산모양 타일링 경우의 수 구하기"
status: "published"
---

# [programmers : 산모양 타일링](https://school.programmers.co.kr/learn/courses/30/lessons/258705)

## **목표**

> 산 모양 타일을 1×2 또는 2×1 타일로 채우는 경우의 수를 구하는 문제.
> `유명한 타일링 DP로 각 지점에 대해서 가능한 경우의 수를 DP로 채우고, 점화식을 찾아서 바텀업으로 풀이`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(n,tops):
    
    mod = 10007
    dp = [[0]*(2*n+1) for _ in range(2)]
    dp[0][0] = 1
    dp[0][1] = 2
    dp[1][1] = 3 if tops[0] else 0
    for i in range(2,2*n+1):
        
        if i%2==0:
            dp[0][i] = sum([dp[0][i-2],
                            dp[1][i-1] if tops[i//2-1] else dp[0][i-1]])%mod
        else:
            dp[0][i] = sum([dp[0][i-1],
                            dp[1][i-2] if tops[i//2-1] else dp[0][i-2]])%mod
            if tops[i//2]:
                dp[1][i] = sum([2*dp[0][i-1],
                                dp[1][i-2] if tops[i//2-1] else dp[0][i-2]])%mod

    return dp[0][-1]
```

[/tabs]

* SOLUTION 1
  * 타일링 DP: 유명한 타일링 DP. 각 지점에 대해서 가능한 경우의 수를 DP로 채움
  * 점화식: 점화식을 찾아서 바텀업으로 풀이. 탑다운으로 풀기에는 바로 분할해서 보기 쉽지 않음
  * 바텀업: 이전 타일 상태에서 경로만 지정해주면 바텀업이 쉬움

## **코멘트**

* ez
