---
title: "programmers : 지게차와 크레인"
date: "2025-02-11"
skills: ["Python", "Java"]
hashtags: ["simulation"]
problem_url: "https://school.programmers.co.kr/learn/courses/30/lessons/131130"
description: "BFS + padding을 활용한 지게차와 크레인 문제"
status: "published"
---

# [programmers : 지게차와 크레인](https://school.programmers.co.kr/learn/courses/30/lessons/131130)

## **목표**

> 창고에서 화물을 제거하는 문제. 지게차는 모든 같은 화물을 제거하고, 크레인은 경계면과 닿아있는 화물만 제거함.
> `padding을 해줘서 테두리를 추가한 후, BFS로 외곽과 닿아있는 부분을 감지. 각 query 실행 -> BFS를 통해서 boundary update`

## **문제 풀이**

### **Python**

[tabs: Solution 1]

```python
from collections import deque

def solution(storage, queries):
    
    inside = lambda x,y : 0<=x<W and 0<=y<H
    H,W = len(storage)+2,len(storage[0])+2
    dires = [(1,0),(0,1),(-1,0),(0,-1)]
    
    # padding
    arr = [['-']*W for _ in range(H)]
    for i in range(H-2):
        for j in range(W-2):
            arr[i+1][j+1] = storage[i][j]

    # (0,0) BFS -> return boundary
    def bfs():
        V = [[0]*W for _ in range(H)]
        V[0][0] = 1
        Q = deque([(0,0)])
        while Q:
            x,y = Q.popleft()
            for dx,dy in dires:
                nx,ny = x+dx,y+dy
                if inside(nx,ny) and arr[ny][nx] == '-' and not V[ny][nx]:
                    Q.append((nx,ny))
                    V[ny][nx] = 1
        return V
    
    boundary = bfs()
    
    # 쿼리 처리
    for query in queries:
        target =  query[0]
        # 길이가 2인 경우
        if len(query) == 2:
            for i in range(H):
                for j in range(W):
                    if arr[i][j] == target:
                        arr[i][j] = '-'
        # 길이가 1인 경우
        else:
            # remove_list에 추가해서 loop 도중에 변경시키지 않고, 크레인 작업이 끝난 후 일괄적으로 적용한다.
            remove_list = []
            for i in range(1,H-1):
                for j in range(1,W-1):
                    if arr[i][j] == target:
                        # 4방향 중 하나라도 경계면과 닿아있으면 remove_list에 추가
                        if any(inside(j+dj,i+di) and boundary[i+di][j+dj] for dj,di in dires):
                            remove_list.append((j,i))
            for x,y in remove_list:
                arr[y][x] = '-'
                
        boundary = bfs()
        
    # 정답
    answer = 0
    for i in range(H):
        for j in range(W):
            if arr[i][j] != '-':
                answer += 1
    return answer
```

[/tabs]

### **Java**

[tabs: Solution 2]

```java
import java.util.*;

class Solution {
    static int[][] dires = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};

    public int solution(String[] storage, String[] requests) {
        int H = storage.length + 2;
        int W = storage[0].length() + 2;

        // padding 배열 초기화
        char[][] arr = new char[H][W];
        for (int i = 0; i < H; i++) {
            Arrays.fill(arr[i], '-');
        }
        // 배열 업데이트
        for (int i = 1; i < H - 1; i++) {
            for (int j = 1; j < W - 1; j++) {
                arr[i][j] = storage[i - 1].charAt(j - 1);
            }
        }
        
        // 쿼리
        for (String request : requests) {
            char target = request.charAt(0);
            List<int[]> removeList = new ArrayList<>();
            
            // 2인 경우 전부 제거
            if (request.length() == 2) {
                for (int i = 0; i < H; i++) {
                    for (int j = 0; j < W; j++) {
                        if (arr[i][j] == target) {
                            arr[i][j] = '-';
                        }
                    }
                }
            } else {
                // 1인 경우 주변에 하나라도 boundary
                boolean[][] boundary = bfs(arr, H, W);
                for (int i = 1; i < H - 1; i++) {
                    for (int j = 1; j < W - 1; j++) {
                        if (arr[i][j] == target) {
                            for (int[] dire : dires) {
                                int ni = i + dire[0], nj = j + dire[1];
                                if (boundary[ni][nj]) {
                                    removeList.add(new int[]{i,j});
                                    break;
                                }
                            }
                        }
                    }
                }
                for (int[] loc : removeList) {
                    arr[loc[0]][loc[1]] = '-';
                }
            }
        }
        // 남은 화물 개수 세기
        int answer = 0;
        for (int i = 1; i < H - 1; i++) {
            for (int j = 1; j < W - 1; j++) {
                if (arr[i][j] != '-') answer++;
            }
        }
        return answer;
    }

    public boolean[][] bfs(char[][] arr, int H, int W) {
        boolean[][] V = new boolean[H][W];
        ArrayDeque<int[]> Q = new ArrayDeque<>();
        Q.offer(new int[]{0,0});
        V[0][0] = true;

        while (!Q.isEmpty()) {
            int[] cur = Q.poll();
            int x = cur[0], y = cur[1];

            for (int[] d : dires) {
                int nx = x + d[0], ny = y + d[1];
                if (nx >= 0 && nx < H && ny >= 0 && ny < W && arr[nx][ny] == '-' && !V[nx][ny]) {
                    V[nx][ny] = true;
                    Q.offer(new int[]{nx,ny});
                }
            }
        }
        return V;
    }
}
```

[/tabs]

* SOLUTION 1
  * padding: padding을 해줘서 테두리를 추가한 후, BFS로 외곽과 닿아있는 부분을 감지
  * 쿼리 처리: 각 query 실행 -> BFS를 통해서 boundary update

* SOLUTION 2
  * Java 구현: 동일한 로직을 Java로 구현

## **코멘트**

* 배열의 크기는 length, 문자열의 크기는 length().
* 타입 잘 보고 확인하기.
* java에서 입력 받을 때, toCharArray로 변환해서 한 번에 할당하거나, charAt을 사용해서 해당 인덱스의 문자를 받아온다.
* 배열의 테두리에서 시작하는 방법은 패딩을 하면 쉽게 풀리는 문제가 많다.
