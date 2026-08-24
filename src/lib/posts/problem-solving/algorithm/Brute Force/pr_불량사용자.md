---
title: "프로그래머스 불량 사용자 (레벨3)"
date: "2023-10-13"
skills: ["Python"]
hashtags: ["bruteforce"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/64064"
description: "프로그래머스 불량 사용자 (레벨3) 문제 풀이"
status: "published"
---

# **프로그래머스 불량 사용자 (레벨3)**
* https://school.programmers.co.kr/learn/courses/30/lessons/64064
<br>

---

### **풀이**

#### **방향성 생각**
* 입력 사이즈도 굉장히 작다.
* 길이에 맞게 매칭해주고 *처리만 잘 해주기.


<br>

### **전체코드**
```python
from itertools import permutations as P

def solution(user_id, banned_id):
    
    def check(user, ban):   
        if len(user) != len(ban):
            return False     
        for a,b in zip(user,ban):        
            if b != '*' and a != b:
                return False           
        return True
    
    answer = set()
    for temp in P(user_id,len(banned_id)):
        flag = True
        for user,ban in zip(temp,banned_id):
            if not check(user,ban):
                flag = False
                break
        if flag:
            answer.add(tuple(sorted(temp)))
    
    return len(answer)

```

#### **코멘트**

* 길이가 같은 경우에만 진행
* zip을 사용하면 길이가 초과하는 부분은 절사된다. 이 문제에서는 길이가 맞는 경우에만 사용하긴 했다.