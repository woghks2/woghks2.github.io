---
title: "programmers : 마법의 엘리베이터"
date: "2025-03-17"
skills: ["Python"]
hashtags: ["greedy"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/148653"
description: "그리디 알고리즘을 활용한 마법의 엘리베이터 문제"
status: "published"
---

# [programmers : 마법의 엘리베이터](https://school.programmers.co.kr/learn/courses/30/lessons/148653)

## **목표**

> 0층까지 내려가는 데 필요한 최소 버튼 조작 횟수를 구하는 문제. 각 자리수에서 +1 또는 -1 버튼을 누를 수 있음.
> `BFS/다익은 범위 넓어서 시간 초과. 1의 자리부터 접근해서 0~4이면 빼주고 6~9면 올려줌. 5의 경우에는 다음 자리수도 봐야함`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(x):
    answer = 0

    def dfs(n):
        nonlocal answer

        if not n:
            return

        p,q = divmod(n,10)

        if 0<=q<5:
            answer += q

        elif 5<q<10:
            answer += (10-q)
            p += 1

        elif q == 5:
            answer += 5
            np,nq = divmod(n,100)
            if nq>=50:
                p += 1
        dfs(p)

    dfs(x)
    return answer
```

[/tabs]

* SOLUTION 1
  * 그리디 접근: BFS/다익은 범위 넓어서 시간 초과. 테케 2번처럼 그리디하게 접근
  * 자리수 처리: 1의 자리부터 접근해서 0~4이면 빼주고 6~9면 올려줌
  * 5 처리: 5의 경우에는 다음 자리수도 봐야함. 재귀를 사용해서 다음 자리를 계속해서 탐색

## **코멘트**

* 
