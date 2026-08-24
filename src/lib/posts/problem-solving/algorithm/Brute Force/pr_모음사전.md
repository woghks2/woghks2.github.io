---
title: "프로그래머스 모음사전 (레벨2)"
date: "2023-11-30"
skills: ["Python"]
hashtags: ["bruteforce"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/43165"
description: "프로그래머스 모음사전 (레벨2) 문제 풀이"
status: "published"
---

# **프로그래머스 모음사전 (레벨2)**
* https://school.programmers.co.kr/learn/courses/30/lessons/43165
<br>

---

### **풀이**

#### **방향성 생각**
* 모음 순서는 AEIOU 순서이다.
* 순서가 먼저 바뀌기 이전에, 길이부터 먼저 채우고 문자가 바뀌는 것을 확인할 수 있다.
* 모음 규칙이 DFS 재귀 형태와 비슷하므로 DFS로 순서를 찾는다.
<br>

### **전체코드**
```python
def solution(word):
    arr,string = ['A','E','I','O','U'],[]
    answer = 0
    
    def dfs():
        nonlocal answer,string
        
        # 정답이랑 동일하면 True
        if ''.join(string) == word:
            return True
        
        # 길이를 다 채웠음에도 불구하고, 정답이 아니면 False
        if len(string) == 5:
            return False
        
        for a in arr:
            string.append(a)
            answer += 1
            if dfs():
                return True
            string.pop()
    dfs()
    return answer
```

#### **코멘트**

* 재귀 DFS 형태만 생각하면 어렵지 않게 풀 수 있다.