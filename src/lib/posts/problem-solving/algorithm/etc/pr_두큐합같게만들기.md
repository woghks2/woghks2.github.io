---
title: "programmers : 두 큐 합 같게 만들기"
date: "2025-03-20"
skills: ["Python"]
hashtags: ["etc"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/118667"
description: "누적합 + 이분탐색을 활용한 두 큐 합 같게 만들기 문제"
status: "published"
---

# [programmers : 두 큐 합 같게 만들기](https://school.programmers.co.kr/learn/courses/30/lessons/118667)

## **목표**

> 두 큐의 합을 같게 만들기 위해 필요한 최소 작업 횟수를 구하는 문제. 작업은 한 큐에서 원소를 뽑아 다른 큐에 넣는 것.
> `입력이 커서 $O(N)$이나 $O(NlogN)$으로 풀이. 누적합 + 이분탐색으로 풀이`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(Q1,Q2):
    
    leng = len(Q1)
    
    def solve(q1,q2):

        # 누적합 배열 만들기
        cumsum = [0]
        for val in q1 + q2:
            cumsum.append(cumsum[-1] + val)

        # 불가능한 경우 빈 리스트 반환
        target = cumsum[-1]//2
        if cumsum[-1]%2:
            return []

        # 이분탐색으로 가능한 경우 탐색하기
        possible = [] 
        for p in range(leng):
            l,r = p,2*leng
            while l<=r:
                m = (l+r)//2
                if cumsum[m] - cumsum[p] > target:
                    r = m-1
                elif cumsum[m] - cumsum[p] < target:
                    l = m+1
                else:
                    possible.append((p+1,m)) # 1 - based : [p+1,m] = target
                    break
        return possible
    
    # 이동 필요 없는 경우 : 제출 테케 2번
    if sum(Q1) == sum(Q2):
        return 0
    
    # [1,2,3,4,5] [6,7,8,9,10] 인덱스를 이런식으로 놔두고 케이스 나누기
    answer = float('inf')
    for s,e in solve(Q1,Q2) + solve(Q2,Q1):
        if s==e: # 숫자 하나로 가능한 경우 (test 2, 제출 테케 1번)
            answer = min(answer, s + leng+e-1)
        elif e<leng: # 앞 큐에서 뒷 큐로 모두 보내는 경우 (test1 - ex1)
            answer = min(answer, e + leng+s)
        elif e==leng: # 앞 큐의 나머지부분을 뒷 큐로 보내는 경우
            answer = min(answer, s-1)
        elif e>leng: # 앞 큐의 뒷부분과, 뒷 큐의 앞부분이 겹치는 경우 (test1 - ex2)
            answer = min(answer, s-1 + e-leng)

    return answer if answer != float('inf') else -1
```

[/tabs]

* SOLUTION 1
  * 시간 복잡도: 입력이 커서 $O(N)$이나 $O(NlogN)$으로 풀이
  * 접근 방법: 가장 빠르게 떠오른 풀이는 누적합 + 투포인터인데, 두 큐를 합쳐서 투포인터 돌리면 TLE 확률이 커져서 누적합 + 이분탐색으로 풀이

## **코멘트**

* 머리가 나쁘면 머리가 고생한다. 너무 어렵게 푼 듯
