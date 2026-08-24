---
title: "프로그래머스 : N으로표현 (레벨3)"
date: "2024-04-24"
skills: ["Python"]
hashtags: ["bruteforce"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/42895"
description: "프로그래머스 : N으로표현 (레벨3) 문제 풀이"
status: "published"
---

# **프로그래머스 : N으로표현 (레벨3)**
* https://school.programmers.co.kr/learn/courses/30/lessons/42895
<br>


---

### **풀이**

#### **방향성 생각**
* 탐색 범위가 매우 작다.
* 완탐, BFS, DP정도가 생각이난다.
* BFS로 했는데, 케이스가 빵꾸나서 완탐으로 진행
* 숫자 seed는 N과 N...N (N이 1개부터 5개), N+N, N*N, N/N(=1) (N이 1이 아닌경우)
* 숫자 z개를 이용해서 만들 수 있는 경우 = (숫자 x를 이용해서 만드는 경우 + 숫자 y를 이용해서 만드는 경우)
* for문을 돌면서 z를 업데이트 한다.
* z가 1~8일 때 답이 있으면 return z, 아니면 return -1
<br>

---

### **전체코드**
```python
from collections import defaultdict as dd

def solution(N,target):
    
    # table에 seed 업데이트
    table = dd(set)
    for i in range(1,6):
        if int(s*i) <= 32000:
            table[i].add(int(s*i))
    table[2].update([N+N,N*N])
    if N != 1: table[2].add(1)
    
    # 8개 이하로 만드는 경우 업데이트.
    for i in range(1,8):
        for j in range(1,8):
            if i+j <= 8:
                for a in table[i]:
                    for b in table[j]:
                        temp = (a+b,a-b,a*b)
                        table[i+j].update((a+b,a-b,a*b))
                        if b: table[i+j].add(a//b)
                        if a: table[i+j].add(b//a)
    # 리턴
    for i in range(1,9):
        if target in table[i]:
            return i
    return -1
```

#### **코멘트**

* BFS로도 될거같은데 test case 6 7 8 빵꾸나서 패스...