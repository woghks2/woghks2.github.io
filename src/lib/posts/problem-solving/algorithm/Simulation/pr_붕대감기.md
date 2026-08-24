---
title: "programmers : 붕대 감기"
date: "2024-03-25"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/250137"
description: "시간 차이 계산을 활용한 붕대 감기 문제"
status: "published"
---

# [programmers : 붕대 감기](https://school.programmers.co.kr/learn/courses/30/lessons/250137)

## **목표**

> 붕대를 감아 체력을 회복하면서 공격을 받는 시뮬레이션 문제.
> `iteration을 모두 돌려도 되지만 비효율적. 시간 차이에서 몫, 나머지를 사용해서 효율적으로 푸는게 정해`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(bandage, health, attacks):
    
    prepare,regen,bonus = bandage
    hp = health
    
    # 공격
    _,dmg = attacks[0]
    hp -= dmg
    if hp <= 0: return -1
        
    for i in range(1,len(attacks)):

        # 회복
        dt = attacks[i][0]-attacks[i-1][0]-1
        p,q = divmod(dt,prepare)
        hp += regen*dt + bonus*p   
        if hp > health: hp = health

        # 공격
        time,dmg = attacks[i]
        hp -= dmg
        if hp <= 0:
            return -1

    return hp
```

[/tabs]

* SOLUTION 1
  * 시간 차이 계산: 공격 - 회복 - 공격 - 회복 순서로 진행. 회복 시, 이전에 공격을 받은 시간이 필요
  * 효율적 계산: 시간 차이에서 몫, 나머지를 사용해서 효율적으로 풀이
  * 예외 처리: 첫 번째 공격을 먼저 받고 공격 / (회복-공격) ... 순으로 진행

## **코멘트**

* 정답률이 낮길래 풀었는데 초심자용 문제라서 정답률이 낮았다...
