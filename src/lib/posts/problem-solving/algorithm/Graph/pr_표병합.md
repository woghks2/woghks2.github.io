---
title: "programmers : 표 병합"
date: "2024-02-25"
skills: ["Python"]
hashtags: ["graph"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/150366"
description: "유니온-파인드를 활용한 표 병합 문제"
status: "published"
---

# [programmers : 표 병합](https://school.programmers.co.kr/learn/courses/30/lessons/150366)

## **목표**

> 표의 셀을 병합하고 분리하는 기능을 구현하는 문제.
> `입력이 (50*50) * 1000 = 25만. 각 노드들을 연결했다, 끊었다 -> 유니온 파인드?`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
def solution(commands):
    
    parent = [i for i in range(51*51)]
    cells = ['EMPTY']*(51*51)
    
    # 경로 압축을 해줘야 시간이 오래 걸리지 않는다.
    def find(a):
        if parent[a] != a:
            parent[a] = find(parent[a])
        return parent[a]

    # a의 부모쪽으로 유니온 파인드를 진행한다.
    def union(a,b):
        pa,pb = find(a),find(b)
        parent[pb] = pa
    
    # 경로가 끊기는 문제가 발생해서 MERGE,UNMERGE 후에 업데이트 시킨다.
    def update():
        for i in range(51*51):
            find(i)

    answer = []
    for command in commands:
        cmd = command.split()

        # 1. 업데이트를 하는 경우
        if cmd[0] == 'UPDATE':
            # 특정 위치에 값을 넣는 경우
            if len(cmd) == 4:
                _,r,c,v = cmd
                x = 51*int(r)+int(c)
                cells[parent[x]] = v 
            # v1값을 v2로 변경하는 경우
            else:
                _,v1,v2 = cmd
                for i in range(51*51):
                    if cells[parent[i]] == v1:
                        cells[parent[i]] = v2

        # 2. 셀 합치는 경우
        elif cmd[0] == 'MERGE':
            r1,c1,r2,c2 = map(int,cmd[1:])
            x1,x2 = 51*r1+c1,51*r2+c2 # 현재 셀
            p1,p2 = find(x1),find(x2) # 부모 셀
            
            # 셀이 다르면 유니온 파인드 진행
            if p1 != p2:
                # 각 셀이 빈 셀인지, 값이 있는 셀인지 확인한다.
                v1,v2 = 'EMPTY','EMPTY'
                for i in range(51*51):
                    if i == p1 and cells[i] != 'EMPTY': v1 = cells[i]
                    if i == p2 and cells[i] != 'EMPTY': v2 = cells[i]

                # v2에만 값이 있으면 p2를 루트노드로
                if v1 == 'EMPTY' and v2 != 'EMPTY':
                    x,v,p = x2,v2,p2
                    union(p2,p1)
                # v1에만 값이 있으면 p1을 루트노드로
                else:
                    x,v,p = x1,v1,p1
                    union(p1,p2)
                # 현재 선택한 셀에서 루트 노드만 값을 넣어주고 나머지는 EMPTY
                for i in range(51*51):
                    if parent[i] == p: # 현재 그룹
                        if i != p: cells[i] == 'EMPTY'
                        else: cells[i] = v
            update()        
        
        # 3. 셀 병합 풀기
        elif cmd[0] == 'UNMERGE':
            r,c = map(int,cmd[1:])
            p = parent[51*r+c] # 선택한 셀의 부모
            v = cells[p] # 셀의 값
            for i in range(51*51):
                # 현재 지정한 그룹일 경우 병합 해제
                if parent[i] == p:
                    parent[i] = i # 병합 해제
                    # 지정한 위치에는 값을 넣고 아닌 곳은 EMPTY
                    if i != 51*r+c: cells[i] = 'EMPTY'
                    else: cells[i] = v
            update()
            
        else:
            r,c = map(int,cmd[1:])
            answer.append(cells[parent[51*r+c]])
            
    return answer
```

[/tabs]

* SOLUTION 1
  * 유니온-파인드: 각 노드들을 연결했다, 끊었다 -> 유니온 파인드?
  * 최적화: 그냥 구현으로도 풀 수 있겠지만, 유니온 파인드로 진행. 2차원 리스트에서 반복적으로 다른 리스트로 이동하게 되면 시간적으로 부담돼서 1차원으로 변경
  * 업데이트: MERGE, UNMERGE 이후 2500개의 셀을 훑고 업데이트 해야 하므로 1차원으로 바꿈

## **코멘트**

* 루트 노드만 제대로 업데이트 해주면 어렵지 않은 문제
* MST 문제를 많이 풀면서 유니온 파인드에는 크게 문제가 없었는데 어떤 노드를 루트로 지정하는지, 유니온 과정에서 루트 노드 지정이 풀렸을 때 어떻게 처리하는 문제는 없었는데 이번에 다시 공부했음.
* 루트 노드를 끊어놓는 테케를 넣으려고 일부러 입력을 50*50 사이즈로 준 듯 하다.
