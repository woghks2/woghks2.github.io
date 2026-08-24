---
title: "programmers : 사칙연산"
date: "2024-04-23"
skills: ["Python"]
hashtags: ["dp"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/1843"
description: "State DP를 활용한 사칙연산 식 최대값 구하기"
status: "published"
---

# [programmers : 사칙연산](https://school.programmers.co.kr/learn/courses/30/lessons/1843)

## **목표**

> 사칙연산 배열에 괄호를 추가하여 식의 최대값을 구하는 문제.
> `각 현재 숫자에 영향을 줄 수 있는 - 개수가 몇 개 있는지, 현재 몇 번째 숫자를 연산중인지 2가지 상태를 기준으로 2차원 DP 업데이트`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(arr):
    
    # 연산, 숫자 묶기
    L,C = len(arr)//2,0 # 길이 / - 개수 (열 수 있는 괄호 갯수)
    temp = []
    for i in range(L):
        op,num = arr[2*i+1],int(arr[2*i+2])
        if op == '-': C+= 1
        temp.append((op,num))
    
    # DP 초기화 : 길이가 L+1, 열 수 있는 괄호가 C개 -> 총 C+1개 상태
    dp = [[-1e9]*(L+1) for _ in range(C+1)]
    dp[0][0] = int(arr[0])
    
    # 테이블 업데이트 dp[열려있는 괄호 수][길이]
    for l in range(L):
        op,num = temp[l]
        for c in range(C+1):
            if op == '+': # 앞에 (-)가 x개 --연산--> 앞에 (-)가 c개
                dp[c][l+1] = max(dp[x][l] + num*((-1)**x) for x in range(c,C+1))
            else: # 앞에 (-)가 x개 --연산--> 앞에 (-)가 c개
                dp[c][l+1] = max(dp[x][l] - num*((-1)**x) for x in range(c,C+1))
                if c: # 괄호를 여는 연산: 앞에 (-)가 c-1개 --연산--> 앞에 (-) c개
                    dp[c][l+1] = max(dp[c][l+1], dp[c-1][l] + num*((-1)**c))
    return max(dp[i][-1] for i in range(C+1))
```

[/tabs]

* SOLUTION 1
  * 분할정복/State DP: 분할정복으로 풀이하면, 부분 구조의 최대값, 최소값이 필요. ()앞에 어떤 부호가 붙는지가 중요해서 부호 별로 메모제이션을 해줘야함
  * 상태 기준: 각 현재 숫자에 영향을 줄 수 있는 - 개수가 몇 개 있는지, 현재 몇 번째 숫자를 연산중인지 2가지 상태를 기준으로 삼고 2차원 DP를 업데이트
  * 괄호 처리: (-) 부호를 만나면 괄호를 열 수 있음. 숫자 앞에 열려있는 괄호가 홀수개면 (-) 홀수개가 있으므로 빼기, 짝수개면 더하기

## **코멘트**

* 탑다운으로 해보려고 했는데 잘 안돼서 바텀업으로 풀이.
* 노드 관계가 단순해서 바텀업으로도 빠르게 풀었다.
