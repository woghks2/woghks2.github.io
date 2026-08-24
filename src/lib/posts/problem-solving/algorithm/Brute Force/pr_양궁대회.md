---
title: "프로그래머스 양궁대회 (레벨2)"
date: "2023-06-22"
skills: ["Python"]
hashtags: ["bruteforce"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/92342"
description: "프로그래머스 양궁대회 (레벨2) 문제 풀이"
status: "published"
---

# **프로그래머스 양궁대회 (레벨2)**
* https://school.programmers.co.kr/learn/courses/30/lessons/92342
<br>


---

### **풀이**

#### **방향성 생각**
* 규칙에 맞게 점수 계산하기.
* N이 10발로 작으므로 모든 케이스 계산 가능
* 중복된 점수를 얻을 수 있으니 중복조합 사용해서 풀이

<br>


---


### **전체코드**
```python
from itertools import combinations_with_replacement as H

def solution(n,apeach):
    
    # 각 케이스마다 중복조합으로 만들어진 튜플에 for문을 돌려서 화살의 개수를 계산한다.

    # 점수는 0점~10점 순으로 만들어서 인덱스랑 점수를 맞춰준다.

    apeach = apeach[::-1]
    temp = list(range(0,11))
    lion_list = list(H(temp,n))
    
    score_sub,score_board = [],[]
    for score in lion_list :
        table = {idx : 0 for idx in range(11)}
        for j in score :
            table[j] += 1

        # 어피치, 라이언의 점수를 계산

        # zip으로 동시에 점수 두개를 받고 enumerate를 활용해서 점수를 추가할 때 인덱스를 바로 불러와준다.

        # 라이언이 이긴 경우에 리스트에 점수차, 화살 분포를 추가해준다. 
        score_a, score_l = 0,0
        lion = sorted(list(table.items()),key=lambda x:x[0])
        lion = [item[1] for item in lion]
        for idx,(a,l) in enumerate(zip(apeach,lion)) :
            if a!=0 or l!=0 :
                if a >= l :
                    score_a += idx
                else :
                    score_l += idx
                
        if score_a < score_l :
            score_sub.append(score_l-score_a)
            score_board.append(lion)

    # 이긴 경우 없으면 [-1] 리턴
    if not score_board :
        return [-1]
    
    max_score_sub = max(score_sub)
    answer = [score_board[::-1] for score_sub, score_board in zip(score_sub, score_board) \
                if score_sub == max_score_sub]

    answer.sort(key = lambda x:(x[10],x[9],x[8],x[7],x[6],x[5],x[4],x[3],x[2],x[1],x[0]))
    return answer[-1]
```

#### **코멘트**

* 마지막 정렬 조건만 체크하면 어렵지 않게 풀이 가능
