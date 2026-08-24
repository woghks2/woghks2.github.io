---
title: "programmers : 연속된 부분 수열의 합"
date: "2024-01-01"
skills: ["Python"]
hashtags: ["etc"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/178870"
description: "투포인터를 활용한 연속된 부분 수열의 합 문제"
status: "published"
---

# [programmers : 연속된 부분 수열의 합](https://school.programmers.co.kr/learn/courses/30/lessons/178870)

## **목표**

> 수열의 연속된 부분 수열 중 그 합이 k가 되는 경우 중 가장 짧은 길이를 가지는 부분 수열의 시작 인덱스와 끝 인덱스를 구하는 문제.
> `구간 양 끝을 체크하면서 계속 연산을 해야함. 누적합을 만들어서 바로 계산. $N=10^7$에 $NlogN$이라 투포인터로 접근`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(sequence, k):
    
    arr = [0]
    for val in sequence:
        arr.append(arr[-1]+val)
        
    leng = len(sequence)
    l,r = 0,0
    answer = []
    while l<leng:

        # 구간 값 같으면 추가
        if arr[r]-arr[l] == k:
            answer.append([r-l,l,r-1])
            l += 1
            continue
        # 구간 값이 크면 좌측을 줄여서 값 줄이기
        elif arr[r]-arr[l] > k:
            l += 1
        # 작으면 우측을 확장해서 새로운 값 탐색
        else:
            r += 1

        if r > leng:
            break
    answer.sort()
    return answer[0][1:]
```

[/tabs]

* SOLUTION 1
  * 투포인터: 구간 양 끝을 체크하면서 계속 연산을 해야함. 누적합을 만들어서 바로 계산
  * 시간 복잡도: $N=10^7$에 $NlogN$이라 투포인터로 접근하는 건 어렵지 않게 생각할 수 있음

## **코멘트**

* 쉬운문제
