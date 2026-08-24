---
title: "programmers : 유사 칸토어 비트열"
date: "2024-06-10"
skills: ["Python"]
hashtags: ["etc"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/148652"
description: "분할정복을 활용한 유사 칸토어 비트열 문제"
status: "published"
---

# [programmers : 유사 칸토어 비트열](https://school.programmers.co.kr/learn/courses/30/lessons/148652)

## **목표**

> n번째 유사 칸토어 비트열에서 l부터 r까지 구간의 1의 개수를 구하는 문제.
> `범위가 $5^{20}$이라서 그냥은 못푼다. 규칙 찾아서 푸는 분할정복 / 재귀 형태가 보임`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(n,l,r):
    
    l -= 1
    r -= 1

    def dfs(n,l,r):
        
        # 0번째 칸토어 비트열
        if n == 0:
            return 1
        
        # n-1번째 칸토어 비트열의 길이
        leng = 5**(n-1)
        
        count = 0
        for i in range(5):
            
            # 11011 에서 0 부분은은 계속 0이므로 세지 않음
            if i==2:
                continue
            
            # 구간 [s,e]
            s,e = i*leng, (i+1)*leng-1
            
            # 잘못된 구간  x
            if s>r or e<l:
                continue
            
            # n-1번째 칸토어 비트열 개수 카운팅
            count += dfs(n-1,max(0,l-s),min(leng-1,r-s))
        
        return count
    
    return dfs(n,l,r)
```

[/tabs]

* SOLUTION 1
  * 분할정복: 범위가 $5^{20}$이라서 그냥은 못푼다
  * 재귀: 규칙 찾아서 푸는 분할정복 / 재귀 형태가 보임

## **코멘트**

* DFS + DP 하다보니까 엄청 빨라진듯
