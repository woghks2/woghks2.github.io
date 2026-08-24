---
title: "programmers : 가장 긴 팰린드롬"
date: "2024-06-10"
skills: ["Python"]
hashtags: ["etc"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/12904"
description: "가장 긴 팰린드롬 찾기 문제"
status: "published"
---

# [programmers : 가장 긴 팰린드롬](https://school.programmers.co.kr/learn/courses/30/lessons/12904)

## **목표**

> 문자열에서 가장 긴 팰린드롬의 길이를 구하는 문제.
> `가장 긴 팰린드롬을 찾는거라 가장 긴 팰린드롬부터 찾아줌. 포인터를 이용해서 양 끝 팰린드롬 비교함`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(s):
    L = len(s)
    for i in range(L,0,-1):  # 팰린드롬 길이
        for j in range(L-i+1):  # 시작 위치
            l,r = j,j+i-1
            flag = True
            while l<r:
                if s[l] == s[r]: # 같으면 좁혀주고
                    l += 1
                    r -= 1
                else: # 다르면 실패
                    flag = False
                    break
            if flag:
                return i
    return 1
```

[/tabs]

* SOLUTION 1
  * 탐색 순서: 가장 긴 팰린드롬을 찾는거라 가장 긴 팰린드롬부터 찾아줌
  * 비교 방법: 포인터를 이용해서 양 끝 팰린드롬 비교함

## **코멘트**

* 쉬운문제
