---
title: "programmers : 프렌즈 4블록"
date: "2025-03-22"
skills: ["Python"]
hashtags: ["simulation"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/17679"
description: "시뮬레이션을 활용한 프렌즈 4블록 문제"
status: "published"
---

# [programmers : 프렌즈 4블록](https://school.programmers.co.kr/learn/courses/30/lessons/17679)

## **목표**

> 2×2 블록이 같은 문자로 이루어진 경우 제거하고, 블록이 떨어져 빈 공간을 채우는 과정을 반복하여 제거된 블록의 개수를 구하는 문제.
> `아래로 떨어지는거 구현하기 불편해서 transpose + 각 row에서 reversed 시켜서 풀이`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(m, n, board):
    
    # 2x2 박스 체크
    def check(x,y):
        temp = set(arr[yy][xx] for xx,yy in [(x,y),(x+1,y),(x,y+1),(x+1,y+1)])
        return len(temp) == 1 and '#' not in temp
    # 2x2 박스 제거
    def remove(x,y):
        for xx,yy in [(x,y),(x+1,y),(x,y+1),(x+1,y+1)]:
            arr[yy][xx] = '#'

    # 아래로 떨어지는거를 왼쪽으로 밀리는 방식으로 구현 / 좌표계 변환
    arr = [list(row[::-1]) for row in zip(*board)]
    H,W = n,m

    while True:
        
        remove_locs = [(x,y) for y in range(H-1) for x in range(W-1) if check(x,y)]
        
        # 제거할거 없으면 탈출
        if not remove_locs:
            break
        
        # 있으면 제거
        for x,y in remove_locs:
            remove(x,y)
        
        # 떨어지는거 구현
        for y in range(H):
            temp = [val for val in arr[y] if val != '#']
            temp.extend(['#']*(W-len(temp)))
            arr[y] = temp
    
    # #개수 구하기
    answer = 0
    for y in range(H):
        for x in range(W):
            if arr[y][x] == '#':
                answer += 1
    return answer
```

[/tabs]

* SOLUTION 1
  * 좌표계 변환: 아래로 떨어지는거 구현하기 불편해서 transpose + 각 row에서 reversed 시켜서 풀이

## **코멘트**

* 문자 6개만 쓰는거 아니었음?
* A to Z까지 쓴다고 나와있어서 #으로 바꿨음...
