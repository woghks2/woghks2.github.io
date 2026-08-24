---
title: "programmers : 올바른 괄호의 개수"
date: "2024-04-23"
skills: ["Python"]
hashtags: ["dp"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/12929"
description: "DFS + DP를 활용한 올바른 괄호의 개수 구하기"
status: "published"
---

# [programmers : 올바른 괄호의 개수](https://school.programmers.co.kr/learn/courses/30/lessons/12929)

## **목표**

> n개의 '('와 n개의 ')'로 만들 수 있는 올바른 괄호의 개수를 구하는 문제.
> `DFS로 탐색하면서 중복 방문한 노드는 메모제이션한 값으로 프루닝`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(n):
    
    dp = [[-1]*(n+1) for _ in range(n+1)]
    
    def dfs(l,r):
        
        # 맞춰서 도달 했으면 카운팅
        if (l,r) == (0,0):
            return 1
        # r을 더 많이쓰면 올바르지 않음. 괄호는 주어진 개수만 사용해야함
        if l>r or l<0 or r<0:
            return 0
        # 방문한 노드는 메모제이션
        if dp[l][r] != -1:
            return dp[l][r]
        # (썼을때랑 )썼을 때 탐색하기
        answer = dfs(l-1,r) + dfs(l,r-1)
        dp[l][r] = answer
        return answer
        
    return dfs(n,n)
```

[/tabs]

* SOLUTION 1
  * DFS + DP: DFS로 탐색하면서 중복 방문한 노드는 메모제이션한 값으로 프루닝

## **코멘트**

* 안어려운데 프로그래머스가 DP 올려치기가 좀 심한듯
