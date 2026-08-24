---
title: "programmers : n+1 카드게임"
date: "2024-01-18"
skills: ["Python"]
hashtags: ["greedy"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/258707"
description: "그리디 알고리즘을 활용한 n+1 카드게임 문제"
status: "published"
---

# [programmers : n+1 카드게임](https://school.programmers.co.kr/learn/courses/30/lessons/258707)

## **목표**

> 카드를 뽑아서 n+1을 만드는 조합으로 제출하는 게임에서, 최대 라운드를 진행할 수 있는지 구하는 문제.
> `각 원소가 겹치지 않음 -> 두 자연수로 n+1를 만드는 경우는 유일함 (a가 정해지면 나머지는 n+1-a). 우선순위: hand 내 매칭 -> hand와 temp 매칭 -> temp 내 매칭`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(coin, cards):
    answer = 1
    n = len(cards)
    hand = set(cards[:n//3])
    stack = cards[n//3:]
    temp = set()
    
    for i in range(len(stack)//2):
        for x in stack[2*i:2*i+2]: # 두개씩 뽑고
            if n+1-x in hand and coin: # 짝이 패에 있으면 구매
                coin -= 1
                hand.add(x)
            else: # 없으면 temp 리스트에
                temp.add(x)
 
        check1 = False      
        for x in hand: # 1. hand 내에서 매칭
            if n+1-x in hand:
                match = True
                hand.remove(x)
                hand.remove(n+1-x)
                answer += 1
                check1 = True
                break
        
        if not check1:
            check2 = False
            for x in hand: # 2. hand, temp 매칭
                if n+1-x in temp and coin:
                    coin -= 1
                    answer += 1
                    hand.remove(x)
                    temp.remove(n+1-x)
                    check2 = True
                    break
            if not check2:
                for x in temp: # 3. temp 내에서 매칭
                    if n+1-x in temp and coin >= 2:
                        coin -= 2
                        answer += 1
                        temp.remove(x)
                        temp.remove(n+1-x)
                        break
                else: # 4. 게임오버
                    return answer
        
    return answer
```

[/tabs]

* SOLUTION 1
  * 매칭 규칙: 각 원소가 겹치지 않음 -> 두 자연수로 n+1를 만드는 경우는 유일함 (a가 정해지면 나머지는 n+1-a)
  * 우선순위: 두 장을 뽑아서 기존의 패와 매칭할 수 있으면 코인을 사용해서 패에 넣기. 매칭할 수 없으면 temp에 넣어놓기
  * 제출 순서: hand 내에서 2장 내기 -> hand 와 temp를 매칭해서 2장 내기 -> temp 내에서 매칭해서 2장 내기

## **코멘트**

* 현장에서 바로 풀기에는 조금 까다롭지 않았나...
