---
title: "programmers : 괄호 회전하기"
date: "2024-06-11"
skills: ["Python"]
hashtags: ["datastructure"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/76502"
description: "큐 + 스택을 활용한 괄호 문자열 올바름 검사"
status: "published"
---

# [programmers : 괄호 회전하기](https://school.programmers.co.kr/learn/courses/30/lessons/76502)

## **목표**

> 괄호 문자열을 한 칸씩 회전시켜 올바른 괄호 문자열이 되는 경우의 수를 구하는 문제.
> `큐 + 스택으로 문자열 회전 및 괄호 매칭 검사`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque

def solution(string):
    
    # 매칭 되면 스택 터뜨리기, 아니면 스택에 추가하기
    def check(sub_string):
        stack = []
        for s in sub_string:
            if stack:
                e = stack[-1]
                if ((e,s) == ('[',']')) or ((e,s)==('{','}')) or (e,s)==(('(',')')):
                    stack.pop()
                else:
                    stack.append(s)
            else:
                stack.append(s)
        # 올바른 문자열은 스택이 다 터져야함
        if stack:
            return 0
        return 1
    
    answer = 0
    Q = deque(string)
    for _ in range(len(string)):
        Q.rotate(-1)
        sub_string = ''.join(Q)
        answer += check(sub_string)
    return answer
```

[/tabs]

* SOLUTION 1
  * 큐 + 스택: 입력 문자열의 크기 N=1000이므로 모든 경우에 대해서 순회하여 체크
  * 회전: 큐를 사용하여 문자열을 한 칸씩 회전
  * 검사: 스택을 사용하여 괄호 매칭 검사. 매칭되면 스택에서 제거, 아니면 스택에 추가

## **코멘트**

* 쉬운문제
