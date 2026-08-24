---
title: "programmers : 수식 최대화"
date: "2025-03-17"
skills: ["Python"]
hashtags: ["etc"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/67257"
description: "완전탐색을 활용한 수식 최대화 문제"
status: "published"
---

# [programmers : 수식 최대화](https://school.programmers.co.kr/learn/courses/30/lessons/67257)

## **목표**

> 주어진 수식에서 연산자 우선순위를 바꿔서 최대 결과값을 구하는 문제.
> `연산자 순서 6개에 대해서 완탐 진행하기`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(expression):

    table = {"+":0, "-":1, "*":2}

    # 숫자 / 연산자 파싱
    string = ''
    arr = []
    count = [0,0,0]
    for exp in expression:
        if exp not in table:
            string += exp
        else:
            count[table[exp]] += 1
            arr.append(int(string))
            arr.append(exp)
            string = ''
    arr.append(int(string))

    # 6개의 케이스 탐색하기
    answer = 0
    for seq in ['+-*','+*-','-+*','-*+','*+-','*-+']:
        temp_arr = arr[:]
        temp_count = count[:]

        # 우선순위가 높은 연산자부터 제거해주기기
        for op in seq:
            while temp_count[table[op]]:
                for idx,val in enumerate(temp_arr):

                    # 우선순위가 높은 연산자를 만나면 연산자를 기준을 좌우 구분하고 한 숫자로 연산해주기
                    if val == op:
                        temp_count[table[op]] -= 1
                        left = temp_arr[:idx]
                        right = temp_arr[idx+1:]

                        if op == '+': right[0] = left[-1] + right[0]
                        elif op == '-': right[0] = left[-1] - right[0]
                        elif op == '*': right[0] = left[-1] * right[0]

                        left.pop()
                        temp_arr = left + right
                        break
        answer = max(abs(temp_arr[0]),answer)

    return answer
```

[/tabs]

* SOLUTION 1
  * 완전탐색: 연산자 순서 6개에 대해서 완탐 진행하기

## **코멘트**

* 재귀로 짜는게 더 깔끔했을 듯?
