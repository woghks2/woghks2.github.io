---
title: "programmers : 두 원 사이의 정수 쌍"
date: "2025-03-19"
skills: ["Python"]
hashtags: ["etc"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/181187"
description: "원의 방정식을 활용한 두 원 사이의 정수 쌍 문제"
status: "published"
---

# [programmers : 두 원 사이의 정수 쌍](https://school.programmers.co.kr/learn/courses/30/lessons/181187)

## **목표**

> 두 원 사이의 영역에 있는 정수 좌표 쌍의 개수를 구하는 문제.
> `$N=10^6$이라 $O(N)$으로 풀이. 1사분면 + x축 위에있는 (x>0)값 구하고 4배`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(r1,r2):    
    answer = 0
    for x in range(1,r2+1):
        y2_sq = int((r2**2-x**2)**0.5) # y2_sq보다 같거나 작은 (1부터 int(y2_sq))

        # y1도 같은 방식으로 구해서 빼준다.
        if x<r1:
            y1_sq = int((r1**2-x**2)**0.5)
            answer += y2_sq-y1_sq
            # y1_sq가 피타고라스 수 인 경우 그 값은 포함해야하므로 다시 +1 해주기
            if y1_sq == (r1**2-x**2)**0.5:
                answer += 1
        
        # r1과 같거나 커지면 항상 0이 포함되므로 y2 개수에 1을 세주면 된다
        else:
            answer += y2_sq + 1
    return 4*answer
```

[/tabs]

* SOLUTION 1
  * 시간 복잡도: $N=10^6$이라 $O(N)$으로 풀이
  * 접근 방법: 1사분면 + x축 위에있는 (x>0)값 구하고 4배

## **코멘트**

* 코드 바이트 수 줄인다고 띄어쓰기 줄이는 식으로 짰는데 걍 늘려서 짜야될듯... 가독성 떨여저서 실수함
