import type { PostSummary } from '$lib/data';

export type IndexedPostSummary = PostSummary & { sourcePath: string };
export const postSummaries = [
  {
    "id": "09_testing_layered_hexagonal_architecture",
    "title": "9. Layered Architecture 테스트 전략",
    "description": "pytest와 AsyncClient를 활용한 Repository, Service, API 레이어별 테스트 전략.",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2026-01-21",
    "views": 0,
    "tags": [
      "FastAPI",
      "Testing",
      "pytest",
      "AsyncTest",
      "Architecture"
    ],
    "techStack": [
      "FastAPI",
      "Python"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/09_testing_layered_hexagonal_architecture.md"
  },
  {
    "id": "08_background_task_scope_separation",
    "title": "8. Background Task와 비동기 워커",
    "description": "FastAPI BackgroundTasks와 외부 워커 큐의 차이, 적용 기준, 안전한 예외 처리 방식.",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2026-01-08",
    "views": 0,
    "tags": [
      "FastAPI",
      "BackgroundTasks",
      "Celery",
      "Asynchronous",
      "Architecture"
    ],
    "techStack": [
      "FastAPI",
      "Python"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/08_background_task_scope_separation.md"
  },
  {
    "id": "07_usecase_layer_flow",
    "title": "7. UseCase Layer",
    "description": "Service Layer의 비대화를 막고 사용자 시나리오 단위로 흐름을 제어하는 UseCase Layer 설계.",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2026-01-05",
    "views": 0,
    "tags": [
      "FastAPI",
      "UseCase",
      "CleanArchitecture",
      "FlowControl"
    ],
    "techStack": [
      "FastAPI",
      "Python"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/07_usecase_layer_flow.md"
  },
  {
    "id": "06_service_layer",
    "title": "6. Service Layer",
    "description": "Service Layer의 역할과 데이터 가공 및 예외 처리 기법을 알아봅니다.",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2026-01-03",
    "views": 0,
    "tags": [
      "FastAPI",
      "ServiceLayer",
      "BusinessLogic",
      "Architecture"
    ],
    "techStack": [
      "FastAPI",
      "Python"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/06_service_layer.md"
  },
  {
    "id": "05_sqlalchemy_repository_layer",
    "title": "5. SQLAlchemy & Repository",
    "description": "SQLAlchemy의 ORM과 Repository 패턴",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2025-12-31",
    "views": 0,
    "tags": [
      "FastAPI",
      "SQLAlchemy",
      "Database",
      "AsyncQuery"
    ],
    "techStack": [
      "FastAPI",
      "Python",
      "SQLAlchemy"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/05_sqlalchemy_repository_layer.md"
  },
  {
    "id": "04_pydantic",
    "title": "4. Pydantic",
    "description": "Pydantic v2의 직렬화, 역직렬화, ORM 변환 및 Validation",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2025-12-29",
    "views": 0,
    "tags": [
      "FastAPI",
      "Pydantic",
      "Serialization",
      "Validation"
    ],
    "techStack": [
      "FastAPI",
      "Python",
      "Pydantic"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/04_pydantic.md"
  },
  {
    "id": "03_Dependency_Injection",
    "title": "3. Dependency Injection",
    "description": "FastAPI의 DI, Request Scope 수명 주기, 백그라운드 태스크에서의 DB 세션",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2025-12-24",
    "views": 0,
    "tags": [
      "FastAPI",
      "Dependency Injection",
      "BackgroundTask"
    ],
    "techStack": [
      "FastAPI",
      "Python",
      "Backend Architecture"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/03_Dependency_Injection.md"
  },
  {
    "id": "02_router",
    "title": "2. FastAPI Router",
    "description": "Path, Query, Body 파라미터와 response_model.",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2025-12-23",
    "views": 0,
    "tags": [
      "FastAPI",
      "Router",
      "REST",
      "Pydantic",
      "response_model"
    ],
    "techStack": [
      "FastAPI",
      "Python",
      "Pydantic"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/02_router.md"
  },
  {
    "id": "01_app_core_lifespan_state",
    "title": "1. FastAPI 앱의 생명주기와 공유 리소스",
    "description": "FastAPI의 앱 구조 설계와 전역 자원 수명 주기 관리.",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2025-12-22",
    "views": 0,
    "tags": [
      "FastAPI",
      "Lifespan",
      "app.state"
    ],
    "techStack": [
      "FastAPI",
      "Python"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/01_app_core_lifespan_state.md"
  },
  {
    "id": "00_why_fastapi",
    "title": "0. 왜 FastAPI인가?",
    "description": "백엔드에서 FastAPI가 가진 장단점 비교 분석.",
    "mainCategory": "web-programming",
    "subCategory": "fastapi",
    "date": "2025-12-21",
    "views": 0,
    "tags": [
      "FastAPI",
      "Spring Boot",
      "Node.js",
      "Architecture"
    ],
    "techStack": [
      "FastAPI",
      "Python"
    ],
    "folderCategory": "FastAPI",
    "sourcePath": "/src/lib/posts/web-programming/FastAPI/00_why_fastapi.md"
  },
  {
    "id": "06_sveltekit_snippets",
    "title": "6. Snippets과 컴포넌트 설계",
    "description": "Snippets({#snippet}) 문법과 컴포넌트 설계\"",
    "mainCategory": "web-programming",
    "subCategory": "sveltekit",
    "date": "2025-05-22",
    "views": 0,
    "tags": [
      "Svelte",
      "Snippets",
      "ComponentDesign"
    ],
    "techStack": [
      "Svelte",
      "TypeScript"
    ],
    "folderCategory": "Sveltekit",
    "sourcePath": "/src/lib/posts/web-programming/Sveltekit/06_sveltekit_snippets.md"
  },
  {
    "id": "05_sveltekit_state_management",
    "title": "5. Svelte 상태 관리와 Context API",
    "description": "상태 공유 방식과 Context API 설계 기법을 정리합니다.",
    "mainCategory": "web-programming",
    "subCategory": "sveltekit",
    "date": "2025-05-19",
    "views": 0,
    "tags": [
      "Svelte",
      "StateManagement",
      "ContextAPI",
      "Reactivity"
    ],
    "techStack": [
      "Svelte",
      "TypeScript"
    ],
    "folderCategory": "Sveltekit",
    "sourcePath": "/src/lib/posts/web-programming/Sveltekit/05_sveltekit_state_management.md"
  },
  {
    "id": "04_sveltekit_actions",
    "title": "4. Form Actions & API 엔드포인트",
    "description": "+server.js API 라우팅과 Form Actions 기반 폼 처리 패턴",
    "mainCategory": "web-programming",
    "subCategory": "sveltekit",
    "date": "2025-05-18",
    "views": 0,
    "tags": [
      "SvelteKit",
      "FormActions",
      "APIRoute"
    ],
    "techStack": [
      "Svelte",
      "TypeScript"
    ],
    "folderCategory": "Sveltekit",
    "sourcePath": "/src/lib/posts/web-programming/Sveltekit/04_sveltekit_actions.md"
  },
  {
    "id": "03_sveltekit_data_loading",
    "title": "3. 데이터 로딩과 성능 최적화",
    "description": "SvelteKit의 load 함수, Promise Streaming, Preload",
    "mainCategory": "web-programming",
    "subCategory": "sveltekit",
    "date": "2025-05-16",
    "views": 0,
    "tags": [
      "SvelteKit",
      "DataLoading",
      "Streaming",
      "Preload"
    ],
    "techStack": [
      "Svelte",
      "TypeScript"
    ],
    "folderCategory": "Sveltekit",
    "sourcePath": "/src/lib/posts/web-programming/Sveltekit/03_sveltekit_data_loading.md"
  },
  {
    "id": "02_svelte5_runes",
    "title": "2. Svelte 5 Runes",
    "description": "Runes($state, $derived, $effect)와 Props",
    "mainCategory": "web-programming",
    "subCategory": "sveltekit",
    "date": "2025-05-14",
    "views": 0,
    "tags": [
      "Svelte",
      "Runes",
      "Reactivity",
      "Reactions"
    ],
    "techStack": [
      "Svelte",
      "TypeScript"
    ],
    "folderCategory": "Sveltekit",
    "sourcePath": "/src/lib/posts/web-programming/Sveltekit/02_svelte5_runes.md"
  },
  {
    "id": "01_sveltekit_routing",
    "title": "1. SvelteKit 라우팅",
    "description": "SvelteKit 프로젝트 구조와 디렉터리 기반 라우팅 시스템",
    "mainCategory": "web-programming",
    "subCategory": "sveltekit",
    "date": "2025-05-13",
    "views": 0,
    "tags": [
      "SvelteKit",
      "Routing",
      "Frontend",
      "Architecture"
    ],
    "techStack": [
      "Svelte",
      "TypeScript"
    ],
    "folderCategory": "Sveltekit",
    "sourcePath": "/src/lib/posts/web-programming/Sveltekit/01_sveltekit_routing.md"
  },
  {
    "id": "00_why_svelte",
    "title": "0. 왜 Svelte인가?",
    "description": "Svelte의 장단점과 React/Vue와의 차이점",
    "mainCategory": "web-programming",
    "subCategory": "sveltekit",
    "date": "2025-05-11",
    "views": 0,
    "tags": [
      "Svelte",
      "Runes",
      "Frontend",
      "Architecture"
    ],
    "techStack": [
      "Svelte",
      "TypeScript"
    ],
    "folderCategory": "Sveltekit",
    "sourcePath": "/src/lib/posts/web-programming/Sveltekit/00_why_svelte.md"
  },
  {
    "id": "boj_01175",
    "title": "백준 : 1175. 배달",
    "description": "비트마스킹과 BFS를 활용한 배달 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-24",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1175",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01175.md"
  },
  {
    "id": "boj_27211",
    "title": "백준 : 27211. 도넛 행성",
    "description": "BFS를 활용한 도넛 행성 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-24",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/27211",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_27211.md"
  },
  {
    "id": "boj_10775",
    "title": "백준 : 10775. 공항",
    "description": "그리디 + 유니온파인드를 활용한 공항 게이트 배정",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-23",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/10775",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_10775.md"
  },
  {
    "id": "boj_01976",
    "title": "백준 : 1976. 여행 가자",
    "description": "유니온-파인드를 활용한 여행 가자 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-23",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1976",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01976.md"
  },
  {
    "id": "boj_01253",
    "title": "백준 : 1253. 좋다",
    "description": "이분탐색을 활용한 좋다 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-21",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/1253",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_01253.md"
  },
  {
    "id": "boj_01300",
    "title": "백준 : 1300. K번째 수",
    "description": "이분탐색을 활용한 K번째 수 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-21",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/1300",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_01300.md"
  },
  {
    "id": "boj_11280",
    "title": "백준 : 11280. 2-SAT - 3",
    "description": "타잔 알고리즘을 활용한 2-SAT 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-16",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/11280",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_11280.md"
  },
  {
    "id": "boj_11281",
    "title": "백준 : 11281. 2-SAT - 4",
    "description": "타잔 알고리즘을 활용한 2-SAT 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-16",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/11281",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_11281.md"
  },
  {
    "id": "boj_01038",
    "title": "백준 : 1038. 감소하는 수",
    "description": "백준 : 1038. 감소하는 수 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-15",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/1038",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_01038.md"
  },
  {
    "id": "boj_02293",
    "title": "백준 : 2293. 동전 1",
    "description": "탑다운/바텀업 DP를 활용한 동전 조합 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-15",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/2293",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_02293.md"
  },
  {
    "id": "swea_5653",
    "title": "SWEA : 5653. 줄기세포배양",
    "description": "힙을 활용한 이벤트 기반 줄기세포 배양 시뮬레이션",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-15",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWXRJ8EKe48DFAUo",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/swea_5653.md"
  },
  {
    "id": "boj_17472",
    "title": "백준 : 17472. 다리 만들기 2",
    "description": "BFS + MST를 활용한 다리 만들기 2 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-12",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/17472",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_17472.md"
  },
  {
    "id": "swea_5648",
    "title": "SWEA : 5648. 원자 소멸 시뮬레이션",
    "description": "시뮬레이션을 활용한 원자 소멸 시뮬레이션",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-12",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWXRFInKex8DFAUo#none",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/swea_5648.md"
  },
  {
    "id": "boj_12015",
    "title": "백준 : 12015. 가장 긴 증가하는 부분 수열 2",
    "description": "이분탐색을 활용한 가장 긴 증가하는 부분 수열 2 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-10",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/12015",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_12015.md"
  },
  {
    "id": "boj_12738",
    "title": "백준 : 12738. 가장 긴 증가하는 부분 수열 3",
    "description": "이분탐색을 활용한 가장 긴 증가하는 부분 수열 3 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-10",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/12738",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_12738.md"
  },
  {
    "id": "boj_12783",
    "title": "백준 : 12738. 가장 긴 증가하는 부분 수열 3",
    "description": "이분탐색을 활용한 가장 긴 증가하는 부분 수열 3 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-10",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/12783",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_12783.md"
  },
  {
    "id": "boj_02613",
    "title": "백준 : 2613. 숫자구슬",
    "description": "2차원 DP + 역추적을 활용한 숫자구슬 최소 그룹 합 최댓값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-10",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/2613",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_02613.md"
  },
  {
    "id": "swea_4013",
    "title": "SWEA : 4013. 특이한 자석",
    "description": "deque + BFS를 활용한 특이한 자석 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-10",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWIeV9sKkcoDFAVH",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/swea_4013.md"
  },
  {
    "id": "swea_5656",
    "title": "SWEA : 5656. 벽돌 깨기",
    "description": "DFS + BFS를 활용한 벽돌 깨기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-10",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "etc",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWXRQm6qfL0DFAUo",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/swea_5656.md"
  },
  {
    "id": "boj_17485",
    "title": "백준 : 17485. 진우의 달 여행 (Large)",
    "description": "3차원 바텀업 DP를 활용한 달 여행 최소 연료 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/17485",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_17485.md"
  },
  {
    "id": "boj_20181",
    "title": "백준 : 20181. 꿈틀꿈틀 호석 애벌레 - 효율성",
    "description": "슬라이딩 윈도우 + DFS + DP를 활용한 최대 만족도 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/20181",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_20181.md"
  },
  {
    "id": "boj_02515",
    "title": "백준 : 2515. 전시장",
    "description": "이분탐색/투포인터 + DP를 활용한 전시장 최대 가치 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/2515",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_02515.md"
  },
  {
    "id": "pr_물고기종류별대어찾기",
    "title": "programmers : 물고기 종류 별 대어 찾기",
    "description": "ROW_NUMBER + JOIN",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/293261",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_물고기종류별대어찾기.md"
  },
  {
    "id": "pr_물고기종류별잡은수구하기",
    "title": "programmers : 물고기 종류 별 잡은 수 구하기",
    "description": "JOIN + GROUP BY",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/293257",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_물고기종류별잡은수구하기.md"
  },
  {
    "id": "pr_월별잡은물고기수구하기",
    "title": "programmers : 월별 잡은 물고기 수 구하기",
    "description": "MONTH + GROUP BY",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/293260",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_월별잡은물고기수구하기.md"
  },
  {
    "id": "pr_잔챙이잡은수구하기",
    "title": "programmers : 잔챙이 잡은 수 구하기",
    "description": "NULL 처리",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/293258",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_잔챙이잡은수구하기.md"
  },
  {
    "id": "pr_잡은물고기중가장큰물고기의길이구하기",
    "title": "programmers : 잡은 물고기 중 가장 큰 물고기의 길이 구하기",
    "description": "MAX + CONCAT",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/298515",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_잡은물고기중가장큰물고기의길이구하기.md"
  },
  {
    "id": "pr_잡은물고기의평균길이구하기",
    "title": "programmers : 잡은 물고기의 평균 길이 구하기",
    "description": "COALESCE + AVG",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/293259",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_잡은물고기의평균길이구하기.md"
  },
  {
    "id": "pr_특정물고기를잡은총수구하기",
    "title": "programmers : 특정 물고기를 잡은 총 수 구하기",
    "description": "JOIN + WHERE IN",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/298518",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_특정물고기를잡은총수구하기.md"
  },
  {
    "id": "pr_특정조건을만족하는물고기별수와최대길이구하기",
    "title": "programmers : 특정 조건을 만족하는 물고기별 수와 최대 길이 구하기",
    "description": "CTE + HAVING",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-07",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/298519",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_특정조건을만족하는물고기별수와최대길이구하기.md"
  },
  {
    "id": "boj_11000",
    "title": "백준 : 11000. 강의실 배정",
    "description": "정렬 + 스위핑/힙을 활용한 강의실 배정",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-06",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/11000",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_11000.md"
  },
  {
    "id": "boj_06549",
    "title": "백준 : 6549. 히스토그램에서 가장 큰 직사각형",
    "description": "모노톤 스택 또는 유니온 파인드를 활용한 히스토그램 최대 직사각형 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-06",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/6549",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_06549.md"
  },
  {
    "id": "boj_14888",
    "title": "백준 : 14888. 연산자 끼워넣기",
    "description": "백트래킹을 활용한 연산자 끼워넣기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/14888",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_14888.md"
  },
  {
    "id": "boj_14889",
    "title": "백준 : 14889. 스타트와 링크",
    "description": "비트마스킹을 활용한 스타트와 링크 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/14889",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_14889.md"
  },
  {
    "id": "boj_01890",
    "title": "백준 : 1890. 점프",
    "description": "탑다운 DP를 활용한 점프 경로 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/1890",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_01890.md"
  },
  {
    "id": "boj_01938",
    "title": "백준 : 1938. 통나무 옮기기",
    "description": "BFS를 활용한 통나무 옮기기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1938",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01938.md"
  },
  {
    "id": "swea_1949",
    "title": "SWEA : 1949. 등산로 조성",
    "description": "DFS + 백트래킹을 활용한 등산로 조성 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "etc",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV5PoOKKAPIDFAUq",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/swea_1949.md"
  },
  {
    "id": "swea_1953",
    "title": "SWEA : 1953. 탈주범검거",
    "description": "BFS를 활용한 탈주범검거 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV5PpLlKAQ4DFAUq",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_1953.md"
  },
  {
    "id": "swea_2117",
    "title": "SWEA : 2117. 홈 방범 서비스",
    "description": "완전탐색을 활용한 홈 방범 서비스 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "etc",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV5V61LqAf8DFAWu",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/swea_2117.md"
  },
  {
    "id": "swea_7793",
    "title": "SWEA : 7793. 오! 나의 여신님",
    "description": "멀티소스 BFS를 활용한 오! 나의 여신님 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWsBQpPqMNMDFARG",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_7793.md"
  },
  {
    "id": "pr_대장균들의자식의수구하기",
    "title": "programmers : 대장균들의 자식의 수 구하기",
    "description": "LEFT JOIN + COALESCE",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/299305",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_대장균들의자식의수구하기.md"
  },
  {
    "id": "pr_대장균의크기에따라분류하기1",
    "title": "programmers : 대장균의 크기에 따라 분류하기 1",
    "description": "CASE WHEN",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/299307",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_대장균의크기에따라분류하기1.md"
  },
  {
    "id": "pr_대장균의크기에따라분류하기2",
    "title": "programmers : 대장균의 크기에 따라 분류하기 2",
    "description": "ROW_NUMBER + CASE WHEN",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/301649",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_대장균의크기에따라분류하기2.md"
  },
  {
    "id": "pr_분기별분화된대장균의개체수구하기",
    "title": "programmers : 분기별 분화된 대장균의 개체 수 구하기",
    "description": "CASE WHEN + GROUP BY",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/299308",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_분기별분화된대장균의개체수구하기.md"
  },
  {
    "id": "pr_특정형질을가지는대장균찾기",
    "title": "programmers : 특정 형질을 가지는 대장균 찾기",
    "description": "비트연산",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-04-05",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/301646",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_특정형질을가지는대장균찾기.md"
  },
  {
    "id": "boj_01182",
    "title": "백준 : 1182. 부분수열의 합",
    "description": "백준 : 1182. 부분수열의 합 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-31",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/1182",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_01182.md"
  },
  {
    "id": "boj_01715",
    "title": "백준 : 1715. 카드 정렬하기",
    "description": "백준 : 1715. 카드 정렬하기 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-30",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://www.acmicpc.net/problem/1715",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/boj_01715.md"
  },
  {
    "id": "boj_01863",
    "title": "백준 : 1863. 스카이라인 쉬운거",
    "description": "스택을 활용한 스카이라인 건물 개수 세기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-30",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/1863",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_01863.md"
  },
  {
    "id": "boj_01933",
    "title": "백준 : 1933. 스카이라인",
    "description": "힙을 활용한 스카이라인 이벤트 처리",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-29",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/1933",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_01933.md"
  },
  {
    "id": "boj_19598",
    "title": "백준 : 19598. 최소 회의실 개수",
    "description": "그리디 알고리즘을 활용한 최소 회의실 개수 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-29",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://www.acmicpc.net/problem/19598",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/boj_19598.md"
  },
  {
    "id": "boj_01374",
    "title": "백준 : 1374. 강의실",
    "description": "백준 : 1374. 강의실 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-28",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://www.acmicpc.net/problem/1374",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/boj_01374.md"
  },
  {
    "id": "boj_17940",
    "title": "백준 : 17940. 지하철",
    "description": "다익스트라를 활용한 지하철 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-26",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/17940",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_17940.md"
  },
  {
    "id": "boj_16402",
    "title": "백준 : 16402. 제국",
    "description": "유니온-파인드를 활용한 제국 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-25",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16402",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16402.md"
  },
  {
    "id": "pr_특정 세대의 대장균 찾기",
    "title": "programmers : 특정 세대의 대장균 찾기",
    "description": "RECURSIVE CTE",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-03-25",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/301650",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_특정 세대의 대장균 찾기.md"
  },
  {
    "id": "boj_05214",
    "title": "백준 : 5214. 환승",
    "description": "0-1 BFS를 활용한 환승 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-24",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/5214",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_05214.md"
  },
  {
    "id": "pr_멸종위기의 대장균 찾기",
    "title": "programmers : 멸종위기의 대장균 찾기",
    "description": "RECURSIVE CTE",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-03-24",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/301651",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_멸종위기의 대장균 찾기.md"
  },
  {
    "id": "boj_11976",
    "title": "백준 : 11976. 불켜기",
    "description": "BFS를 활용한 불켜기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-23",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/11976",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_11976.md"
  },
  {
    "id": "pr_미로탈출명령어",
    "title": "programmers : 미로 탈출 명령어",
    "description": "BFS를 활용한 미로 탈출 명령어 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-23",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/150365",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_미로탈출명령어.md"
  },
  {
    "id": "pr_연속펄스부분수열의합",
    "title": "programmers : 연속 펄스 부분 수열의 합",
    "description": "2차원 DP를 활용한 연속 펄스 부분 수열 최대 합 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-23",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/161988",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/pr_연속펄스부분수열의합.md"
  },
  {
    "id": "pr_주사위고르기",
    "title": "programmers : 주사위 고르기",
    "description": "비트마스킹을 활용한 주사위 고르기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-23",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/258709",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/pr_주사위고르기.md"
  },
  {
    "id": "boj_02003",
    "title": "백준 : 2003. 수들의 합",
    "description": "백준 : 2003. 수들의 합 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-22",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/2003",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_02003.md"
  },
  {
    "id": "boj_02146",
    "title": "백준 : 2146. 다리 만들기",
    "description": "BFS/유니온-파인드를 활용한 다리 만들기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-22",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2146",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02146.md"
  },
  {
    "id": "pr_프렌즈4블록",
    "title": "programmers : 프렌즈 4블록",
    "description": "시뮬레이션을 활용한 프렌즈 4블록 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-22",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/17679",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/pr_프렌즈4블록.md"
  },
  {
    "id": "boj_17822",
    "title": "백준 : 17822. 원판 돌리기",
    "description": "큐 + BFS를 활용한 원판 돌리기 시뮬레이션",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-21",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.acmicpc.net/problem/17822",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/boj_17822.md"
  },
  {
    "id": "pr_두큐합같게만들기",
    "title": "programmers : 두 큐 합 같게 만들기",
    "description": "누적합 + 이분탐색을 활용한 두 큐 합 같게 만들기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-20",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/118667",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/pr_두큐합같게만들기.md"
  },
  {
    "id": "boj_20390",
    "title": "백준 : 20390. 완전그래프의 최소 스패닝 트리",
    "description": "프림 알고리즘을 활용한 완전그래프의 최소 스패닝 트리 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-19",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/20390",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_20390.md"
  },
  {
    "id": "pr_두원사이의정수쌍",
    "title": "programmers : 두 원 사이의 정수 쌍",
    "description": "원의 방정식을 활용한 두 원 사이의 정수 쌍 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-19",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/181187",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/pr_두원사이의정수쌍.md"
  },
  {
    "id": "pr_충돌위험찾기",
    "title": "programmers : 충돌 위험 찾기",
    "description": "시뮬레이션을 활용한 충돌 위험 찾기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-19",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/340211",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/pr_충돌위험찾기.md"
  },
  {
    "id": "boj_14719",
    "title": "백준 : 14719. 빗물",
    "description": "스택/그리디를 활용한 빗물 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-17",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/14719",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_14719.md"
  },
  {
    "id": "pr_가장큰정사각형찾기",
    "title": "programmers : 가장 큰 정사각형 찾기",
    "description": "누적합을 활용한 가장 큰 정사각형 찾기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-17",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/12905",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/pr_가장큰정사각형찾기.md"
  },
  {
    "id": "pr_마법의엘리베이터",
    "title": "programmers : 마법의 엘리베이터",
    "description": "그리디 알고리즘을 활용한 마법의 엘리베이터 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-17",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/148653",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/pr_마법의엘리베이터.md"
  },
  {
    "id": "pr_수식최대화",
    "title": "programmers : 수식 최대화",
    "description": "완전탐색을 활용한 수식 최대화 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-17",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/67257",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/pr_수식최대화.md"
  },
  {
    "id": "pr_행렬테두리회전하기",
    "title": "programmers : 행렬 테두리 회전하기",
    "description": "deque를 활용한 행렬 테두리 회전하기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-17",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/77485",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/pr_행렬테두리회전하기.md"
  },
  {
    "id": "boj_02593",
    "title": "백준 : 2593. 탑",
    "description": "스택을 활용한 탑에서 레이저가 닿는 위치 찾기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-16",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/2593",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_02593.md"
  },
  {
    "id": "boj_16985",
    "title": "백준 16985 : Maaaaaaaaaze (골드2)",
    "description": "백준 16985 : Maaaaaaaaaze (골드2) 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-14",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/16985",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_16985.md"
  },
  {
    "id": "boj_01167",
    "title": "백준 : 1167. 트리의 지름",
    "description": "BFS를 두 번 수행하여 트리의 지름 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-13",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/1167",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_01167.md"
  },
  {
    "id": "boj_01655",
    "title": "백준 : 1655. 가운데를 말해요",
    "description": "최대 힙과 최소 힙을 활용한 중앙값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-13",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/1655",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_01655.md"
  },
  {
    "id": "boj_01766",
    "title": "백준 : 1766. 문제집",
    "description": "우선순위 큐를 활용한 위상정렬",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-13",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/1766",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_01766.md"
  },
  {
    "id": "boj_02696",
    "title": "백준 : 2696. 중앙값 구하기",
    "description": "최대 힙과 최소 힙을 활용한 중앙값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-13",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/2696",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_02696.md"
  },
  {
    "id": "boj_19701",
    "title": "백준 : 19701. 소 운전한다",
    "description": "다익스트라와 상태 관리를 활용한 소 운전한다 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-12",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/19701",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_19701.md"
  },
  {
    "id": "boj_13232",
    "title": "백준 : 13232. Domain clusters",
    "description": "타잔 알고리즘을 활용한 Domain clusters 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-10",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/13232",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_13232.md"
  },
  {
    "id": "boj_15783",
    "title": "백준 : 15783. 세진 바이러스",
    "description": "타잔 알고리즘과 위상정렬을 활용한 세진 바이러스 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-10",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/15783",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_15783.md"
  },
  {
    "id": "boj_01506",
    "title": "백준 : 1506. 경찰서",
    "description": "타잔 알고리즘을 활용한 경찰서 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1506",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01506.md"
  },
  {
    "id": "boj_18133",
    "title": "백준 : 18133. 가톨릭대학교에 워터 슬라이드를??",
    "description": "타잔 알고리즘을 활용한 가톨릭대학교에 워터 슬라이드를?? 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/18133",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_18133.md"
  },
  {
    "id": "boj_26146",
    "title": "백준 : 26146. 즉흥 여행 (easy)",
    "description": "타잔 알고리즘을 활용한 즉흥 여행 (easy) 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/26146",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_26146.md"
  },
  {
    "id": "swea_1247",
    "title": "SWEA : 1247. 최적 경로",
    "description": "비트마스킹 + 다익스트라를 활용한 최적 경로 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV15OZ4qAPICFAYD",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_1247.md"
  },
  {
    "id": "swea_1267",
    "title": "SWEA : 1267. 작업 순서",
    "description": "위상정렬을 활용한 작업 순서 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV18TrIqIwUCFAZN",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_1267.md"
  },
  {
    "id": "swea_1868",
    "title": "SWEA : 1868. 파핑파핑 지뢰찾기",
    "description": "BFS + 그리디를 활용한 파핑파핑 지뢰찾기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV5LwsHaD1MDFAXc",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/swea_1868.md"
  },
  {
    "id": "swea_1873",
    "title": "SWEA : 1873. 상호의 배틀필드",
    "description": "단순 구현을 활용한 상호의 배틀필드 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV5LyE7KD2ADFAXc",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/swea_1873.md"
  },
  {
    "id": "swea_2382",
    "title": "SWEA : 2382. 미생물 격리",
    "description": "딕셔너리를 활용한 미생물 격리 시뮬레이션",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV597vbqAH0DFAVl",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/swea_2382.md"
  },
  {
    "id": "swea_5644",
    "title": "SWEA : 5644. 무선 충전",
    "description": "비트마스킹을 활용한 무선 충전 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWXRDL1aeugDFAUo",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/swea_5644.md"
  },
  {
    "id": "swea_6109",
    "title": "SWEA : 6109. 추억의 2048 게임",
    "description": "단순 구현을 활용한 추억의 2048 게임 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWbrg9uabZsDFAWQ",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/swea_6109.md"
  },
  {
    "id": "swea_6782",
    "title": "SWEA : 6782. 현주가 좋아하는 제곱근 놀이",
    "description": "수학을 활용한 현주가 좋아하는 제곱근 놀이 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "etc",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWgqsAlKr9sDFAW0",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/swea_6782.md"
  },
  {
    "id": "swea_7733",
    "title": "SWEA : 7733. 치즈 도둑",
    "description": "BFS를 활용한 치즈 도둑 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWrDOdQqRCUDFARG",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_7733.md"
  },
  {
    "id": "swea_1767",
    "title": "SWEA 1767 : 프로세서 연걸하기 (test)",
    "description": "백트래킹",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV4suNtaXFEDFAUf",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/swea_1767.md"
  },
  {
    "id": "swea_2105",
    "title": "SWEA 2105 : 디저트 카페 (test)",
    "description": "백트래킹",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-09",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV5VwAr6APYDFAWu",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/swea_2105.md"
  },
  {
    "id": "boj_04196",
    "title": "백준 : 4196. 도미노",
    "description": "타잔 알고리즘을 활용한 도미노 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-08",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/4196",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_04196.md"
  },
  {
    "id": "boj_16475",
    "title": "백준 : 16475. 수학 미로",
    "description": "다익스트라 + 상태 관리를 활용한 수학 미로 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-07",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16475",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16475.md"
  },
  {
    "id": "boj_02150",
    "title": "백준 : 2150. Strongly Connected Component",
    "description": "타잔 알고리즘을 활용한 SCC 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-07",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2150",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02150.md"
  },
  {
    "id": "boj_22956",
    "title": "백준 : 22956. 소나기",
    "description": "유니온-파인드를 활용한 소나기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-06",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/22956",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_22956.md"
  },
  {
    "id": "boj_15906",
    "title": "백준 : 15906. 변신 이동 게임",
    "description": "다익스트라 + 상태 관리를 활용한 변신 이동 게임 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-03",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/15906",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_15906.md"
  },
  {
    "id": "boj_18128",
    "title": "백준 : 18128. 치삼이의 징검다리 건너기",
    "description": "BFS + 다익스트라를 활용한 치삼이의 징검다리 건너기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-03",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/18128",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_18128.md"
  },
  {
    "id": "boj_30894",
    "title": "백준 : 30894. 유령의 집 탈출하기",
    "description": "BFS와 시뮬레이션을 활용한 유령의 집 탈출하기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-03",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/30894",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_30894.md"
  },
  {
    "id": "boj_10776",
    "title": "백준 : 10776. 제국",
    "description": "다익스트라를 활용한 제국 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-02",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/10776",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_10776.md"
  },
  {
    "id": "boj_18224",
    "title": "백준 : 18224. 미로에 갇힌 건우",
    "description": "BFS와 상태 관리를 활용한 미로에 갇힌 건우 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-03-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/18224",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_18224.md"
  },
  {
    "id": "boj_28707",
    "title": "백준 : 28707. 배열 정렬",
    "description": "다익스트라와 상태 관리를 활용한 배열 정렬 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-27",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/28707",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_28707.md"
  },
  {
    "id": "boj_18809",
    "title": "백준 : 18809. Gaaaaaaaaaarden",
    "description": "비트마스킹 + BFS를 활용한 Gaaaaaaaaaarden 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-26",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/18809",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_18809.md"
  },
  {
    "id": "boj_16118",
    "title": "백준 : 16118. 달빛 여우",
    "description": "다익스트라를 활용한 달빛 여우 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-24",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16118",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16118.md"
  },
  {
    "id": "boj_01559",
    "title": "백준 : 1559. 놀라운 미로",
    "description": "비트마스킹 BFS를 활용한 놀라운 미로 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-23",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1559",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01559.md"
  },
  {
    "id": "boj_11657",
    "title": "백준 : 11657. 타임머신",
    "description": "벨만-포드 알고리즘을 활용한 타임머신 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-19",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/11657",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_11657.md"
  },
  {
    "id": "boj_01865",
    "title": "백준 : 1865. 웜홀",
    "description": "벨만-포드를 활용한 웜홀 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-19",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1865",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01865.md"
  },
  {
    "id": "boj_02458",
    "title": "백준 : 2458. 키 순서",
    "description": "BFS/DFS를 활용한 키 순서 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-18",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2458",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02458.md"
  },
  {
    "id": "boj_04485",
    "title": "백준 : 4485. 녹색 옷 입은 애가 젤다지?",
    "description": "다익스트라를 활용한 녹색 옷 입은 애가 젤다지? 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-17",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/4485",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_04485.md"
  },
  {
    "id": "boj_23848",
    "title": "백준 : 23848. 등비수열의 합",
    "description": "누적합 + 투포인터를 활용한 등비수열의 합 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-16",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/23848",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_23848.md"
  },
  {
    "id": "boj_20158",
    "title": "백준 : 20158. 사장님 달려가고 있습니다",
    "description": "BFS와 상태 관리를 활용한 사장님 달려가고 있습니다 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-13",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/20158",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_20158.md"
  },
  {
    "id": "lc_1934",
    "title": "leetcode : 1934. Confirmation Rate",
    "description": "leetcode : 1934. Confirmation Rate 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-13",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/confirmation-rate/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1934.md"
  },
  {
    "id": "lc_2356",
    "title": "leetcode : 2356. Number of Unique Subjects Taught by Each Teacher",
    "description": "leetcode : 2356. Number of Unique Subjects Taught by Each Teacher 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-13",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/number-of-unique-subjects-taught-by-each-teacher/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_2356.md"
  },
  {
    "id": "lc_3220",
    "title": "leetcode : 3220. Odd and Even Transactions",
    "description": "leetcode : 3220. Odd and Even Transactions 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-13",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/odd-and-even-transactions/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_3220.md"
  },
  {
    "id": "pr_지게차와 크레인",
    "title": "programmers : 지게차와 크레인",
    "description": "BFS + padding을 활용한 지게차와 크레인 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-11",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/131130",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/pr_지게차와 크레인.md"
  },
  {
    "id": "lc_1890",
    "title": "leetcode : 1890. The Latest Login in 2020",
    "description": "leetcode : 1890. The Latest Login in 2020 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-11",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/the-latest-login-in-2020/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1890.md"
  },
  {
    "id": "lc_1907",
    "title": "leetcode : 1907. Count Salary Categories",
    "description": "leetcode : 1907. Count Salary Categories 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-11",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/count-salary-categories/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1907.md"
  },
  {
    "id": "boj_01800",
    "title": "백준 : 1800. 인터넷 설치",
    "description": "이분탐색 + 다익스트라를 활용한 인터넷 설치 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-10",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1800",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01800.md"
  },
  {
    "id": "lc_1873",
    "title": "leetcode : 1873. Calculate Special Bonus",
    "description": "leetcode : 1873. Calculate Special Bonus 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-10",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/calculate-special-bonus/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1873.md"
  },
  {
    "id": "boj_12865",
    "title": "백준 : 12865. 평범한 배낭",
    "description": "냅색 DP를 활용한 배낭 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-09",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/12865",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_12865.md"
  },
  {
    "id": "boj_02240",
    "title": "백준 : 2240. 자두나무",
    "description": "3차원 바텀업 DP를 활용한 자두 최대 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-09",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/2240",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_02240.md"
  },
  {
    "id": "lc_1789",
    "title": "leetcode : 1789. Primary Department for Each Employee",
    "description": "leetcode : 1789. Primary Department for Each Employee 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-09",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/primary-department-for-each-employee/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1789.md"
  },
  {
    "id": "boj_02470",
    "title": "백준 : 2470. 두 용액",
    "description": "투포인터를 활용한 두 용액 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-07",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/2470",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_02470.md"
  },
  {
    "id": "boj_14867",
    "title": "백준 : 14867. 물통",
    "description": "BFS를 활용한 물통 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-06",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/14867",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_14867.md"
  },
  {
    "id": "boj_05549",
    "title": "백준 : 5549. 행성탐사",
    "description": "2차원 누적합을 활용한 행성탐사 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-06",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/5549",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_05549.md"
  },
  {
    "id": "lc_1667",
    "title": "leetcode : 1667. Fix Names in a Table",
    "description": "leetcode : 1667. Fix Names in a Table 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-06",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/fix-names-in-a-table/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1667.md"
  },
  {
    "id": "lc_1683",
    "title": "leetcode : 1683. Invalid Tweets",
    "description": "leetcode : 1683. Invalid Tweets 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-06",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/invalid-tweets/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1683.md"
  },
  {
    "id": "lc_1693",
    "title": "leetcode : 1693. Daily Leads and Partners",
    "description": "leetcode : 1693. Daily Leads and Partners 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-06",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/daily-leads-and-partners/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1693.md"
  },
  {
    "id": "lc_1729",
    "title": "leetcode : 1729. Find Followers Count",
    "description": "leetcode : 1729. Find Followers Count 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-06",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/find-followers-count/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1729.md"
  },
  {
    "id": "boj_02167",
    "title": "백준 : 2167. 2차원 배열의 합",
    "description": "2차원 누적합을 활용한 2차원 배열의 합 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-05",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/2167",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_02167.md"
  },
  {
    "id": "lc_1661",
    "title": "leetcode : 1661. Average Time of Process per Machine",
    "description": "leetcode : 1661. Average Time of Process per Machine 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-05",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/average-time-of-process-per-machine/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1661.md"
  },
  {
    "id": "boj_24463",
    "title": "백준 : 24463. 미로",
    "description": "BFS와 역추적을 활용한 미로 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-04",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/24463",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_24463.md"
  },
  {
    "id": "lc_1587",
    "title": "leetcode : 1587. Bank Account Summary II",
    "description": "leetcode : 1587. Bank Account Summary II 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-04",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/bank-account-summary-ii/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1587.md"
  },
  {
    "id": "lc_1633",
    "title": "leetcode : 1633. Percentage of Users Attended a Contest",
    "description": "leetcode : 1633. Percentage of Users Attended a Contest 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-04",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/percentage-of-users-attended-a-contest/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1633.md"
  },
  {
    "id": "boj_16681",
    "title": "백준 : 16681. 등산",
    "description": "다익스트라를 활용한 등산 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-03",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16681",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16681.md"
  },
  {
    "id": "lc_1581",
    "title": "leetcode : 1581. Customer Who Visited but Did Not Make Any Transactions",
    "description": "leetcode : 1581. Customer Who Visited but Did Not Make Any Transactions 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-03",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/customer-who-visited-but-did-not-make-any-transactions/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1581.md"
  },
  {
    "id": "boj_09370",
    "title": "백준 : 9370. 미확인 도착지",
    "description": "다익스트라를 활용한 미확인 도착지 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-02",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/9370",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_09370.md"
  },
  {
    "id": "lc_1484",
    "title": "leetcode : 1484. Group Sold Products By The Date",
    "description": "leetcode : 1484. Group Sold Products By The Date 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-02",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/group-sold-products-by-the-date/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1484.md"
  },
  {
    "id": "boj_05972",
    "title": "백준 : 5972. 택배 배송",
    "description": "다익스트라를 활용한 택배 배송 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-02-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/5972",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_05972.md"
  },
  {
    "id": "lc_1407",
    "title": "leetcode : 1407. Top Travellers",
    "description": "leetcode : 1407. Top Travellers 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-02-01",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/top-travellers/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1407.md"
  },
  {
    "id": "boj_01012",
    "title": "백준 : 1012. 유기농 배추",
    "description": "BFS를 활용한 유기농 배추 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-31",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1012",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01012.md"
  },
  {
    "id": "lc_1378",
    "title": "leetcode : 1378. Replace Employee ID With The Unique Identifier",
    "description": "leetcode : 1378. Replace Employee ID With The Unique Identifier 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-31",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/replace-employee-id-with-the-unique-identifier/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1378.md"
  },
  {
    "id": "lc_1393",
    "title": "leetcode : 1393. Capital Gain/Loss",
    "description": "leetcode : 1393. Capital Gain/Loss 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-31",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/capital-gainloss/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1393.md"
  },
  {
    "id": "lc_1341",
    "title": "leetcode : 1341. Movie Rating",
    "description": "leetcode : 1341. Movie Rating 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-26",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/movie-rating/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1341.md"
  },
  {
    "id": "lc_1327",
    "title": "leetcode : 1327. List the Products Ordered in a Period",
    "description": "leetcode : 1327. List the Products Ordered in a Period 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-23",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/list-the-products-ordered-in-a-period/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1327.md"
  },
  {
    "id": "lc_1321",
    "title": "leetcode : 1321. Restaurant Growth",
    "description": "leetcode : 1321. Restaurant Growth 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-22",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/restaurant-growth/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1321.md"
  },
  {
    "id": "boj_23286",
    "title": "백준 : 23286. 허들 넘기",
    "description": "다익스트라/플로이드-워셜을 활용한 허들 넘기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-21",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/23286",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_23286.md"
  },
  {
    "id": "lc_1280",
    "title": "leetcode : 1280. Students and Examinations",
    "description": "leetcode : 1280. Students and Examinations 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-21",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/students-and-examinations/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1280.md"
  },
  {
    "id": "boj_05800",
    "title": "백준 : 5800. 성적 통계",
    "description": "백준 : 5800. 성적 통계 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-20",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/5800",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_05800.md"
  },
  {
    "id": "lc_1251",
    "title": "leetcode : 1251. Average Selling Price",
    "description": "leetcode : 1251. Average Selling Price 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-20",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/average-selling-price/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1251.md"
  },
  {
    "id": "lc_1211",
    "title": "leetcode : 1211. Queries Quality and Percentage",
    "description": "leetcode : 1211. Queries Quality and Percentage 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-19",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/queries-quality-and-percentage/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1211.md"
  },
  {
    "id": "lc_1204",
    "title": "leetcode : 1204. Last Person to Fit in the Bus",
    "description": "leetcode : 1204. Last Person to Fit in the Bus 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-18",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/last-person-to-fit-in-the-bus/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1204.md"
  },
  {
    "id": "lc_1193",
    "title": "leetcode : 1193. Monthly Transactions I",
    "description": "leetcode : 1193. Monthly Transactions I 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-17",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/monthly-transactions-i/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1193.md"
  },
  {
    "id": "lc_1164",
    "title": "leetcode : 1164. Product Price at a Given Date",
    "description": "leetcode : 1164. Product Price at a Given Date 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-16",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/product-price-at-a-given-date/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1164.md"
  },
  {
    "id": "lc_1174",
    "title": "leetcode : 1174. Immediate Food Delivery II",
    "description": "leetcode : 1174. Immediate Food Delivery II 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-16",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/immediate-food-delivery-ii/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1174.md"
  },
  {
    "id": "lc_1148",
    "title": "leetcode : 1148. Article Views I",
    "description": "leetcode : 1148. Article Views I 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-15",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/article-views-i/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1148.md"
  },
  {
    "id": "lc_1158",
    "title": "leetcode : 1158. Market Analysis I",
    "description": "leetcode : 1158. Market Analysis I 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-15",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/market-analysis-i/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1158.md"
  },
  {
    "id": "lc_1084",
    "title": "leetcode : 1084. Sales Analysis III",
    "description": "leetcode : 1084. Sales Analysis III 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-14",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/sales-analysis-iii/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1084.md"
  },
  {
    "id": "lc_1141",
    "title": "leetcode : 1141. User Activity for the Past 30 Days I",
    "description": "GROUP BY, DATE_SUB, nunique",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-14",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/user-activity-for-the-past-30-days-i/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1141.md"
  },
  {
    "id": "boj_12886",
    "title": "백준 : 12886. 돌 그룹",
    "description": "BFS를 활용한 돌 그룹 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-13",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/12886",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_12886.md"
  },
  {
    "id": "lc_1070",
    "title": "leetcode : 1070. Product Sales Analysis III",
    "description": "leetcode : 1070. Product Sales Analysis III 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-13",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/product-sales-analysis-iii/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1070.md"
  },
  {
    "id": "lc_1075",
    "title": "leetcode : 1075. Project Employees I",
    "description": "leetcode : 1075. Project Employees I 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-13",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/project-employees-i/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1075.md"
  },
  {
    "id": "lc_1050",
    "title": "leetcode : 1050. Actors and Directors Who Cooperated At Least Three Times",
    "description": "leetcode : 1050. Actors and Directors Who Cooperated At Least Three Times 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-12",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/actors-and-directors-who-cooperated-at-least-three-times/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1050.md"
  },
  {
    "id": "lc_1068",
    "title": "leetcode : 1068. Product Sales Analysis I",
    "description": "leetcode : 1068. Product Sales Analysis I 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-12",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/product-sales-analysis-i/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1068.md"
  },
  {
    "id": "boj_02917",
    "title": "백준 : 2917. 늑대사냥꾼",
    "description": "다익스트라와 BFS를 활용한 늑대사냥꾼 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-11",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2917",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02917.md"
  },
  {
    "id": "lc_1045",
    "title": "leetcode : 1045. Customers Who Bought All Products",
    "description": "leetcode : 1045. Customers Who Bought All Products 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-11",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/customers-who-bought-all-products/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1045.md"
  },
  {
    "id": "lc_0627",
    "title": "leetcode : 627. Swap Salary",
    "description": "CASE WHEN",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-11",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/swap-salary/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0627.md"
  },
  {
    "id": "boj_01726",
    "title": "백준 : 1726. 로봇",
    "description": "BFS를 활용한 로봇 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-10",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1726",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01726.md"
  },
  {
    "id": "lc_0620",
    "title": "leetcode : 620. Not Boring Movies",
    "description": "WHERE + ORDER BY",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-10",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/not-boring-movies/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0620.md"
  },
  {
    "id": "lc_0626",
    "title": "leetcode : 626. Exchange Seats",
    "description": "CASE WHEN, 윈도우 함수",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-10",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/exchange-seats/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0626.md"
  },
  {
    "id": "boj_02211",
    "title": "백준 : 2211. 네트워크 복구",
    "description": "다익스트라를 활용한 네트워크 복구 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-09",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2211",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02211.md"
  },
  {
    "id": "lc_0610",
    "title": "leetcode : 610. Triangle Judgement",
    "description": "CASE WHEN, IF",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-09",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/triangle-judgement/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0610.md"
  },
  {
    "id": "lc_0619",
    "title": "leetcode : 619. Biggest Single Number",
    "description": "집계 함수 및 스칼라 서브쿼리 NULL 처리",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-09",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/biggest-single-number/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0619.md"
  },
  {
    "id": "lc_0607",
    "title": "leetcode : 607. Sales Person",
    "description": "leetcode : 607. Sales Person 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-08",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/sales-person/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0607.md"
  },
  {
    "id": "lc_0608",
    "title": "leetcode : 608. Tree Node",
    "description": "SELF JOIN + CASE WHEN",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-08",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/tree-node/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0608.md"
  },
  {
    "id": "lc_0601",
    "title": "leetcode : 601. Human Traffic of Stadium",
    "description": "윈도우 함수, 연속된 행 그룹",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-07",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/human-traffic-of-stadium/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0601.md"
  },
  {
    "id": "lc_0602",
    "title": "leetcode : 602. Friend Requests II: Who Has the Most Friends",
    "description": "UNION",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-07",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0602.md"
  },
  {
    "id": "boj_15809",
    "title": "백준 : 15809. 전국시대",
    "description": "유니온-파인드를 활용한 전국시대 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-06",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/15809",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_15809.md"
  },
  {
    "id": "lc_0595",
    "title": "leetcode : 595. Big Countries",
    "description": "다중 조건",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-06",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/big-countries/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0595.md"
  },
  {
    "id": "lc_0596",
    "title": "leetcode : 596. Classes More Than 5 Students",
    "description": "GROUPBY + HAVING",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-06",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/classes-more-than-5-students/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0596.md"
  },
  {
    "id": "boj_01956",
    "title": "백준 : 1956. 운동",
    "description": "플로이드-워셜을 활용한 운동 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-05",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1956",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01956.md"
  },
  {
    "id": "lc_0585",
    "title": "leetcode : 585. Investments in 2016",
    "description": "GROUP BY + JOIN, 다중조건",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-05",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/investments-in-2016/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0585.md"
  },
  {
    "id": "lc_0586",
    "title": "leetcode : 586. Customer Placing the Largest Number of Orders",
    "description": "테이블 내 특정 그룹의 최대값",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-05",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/customer-placing-the-largest-number-of-orders/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0586.md"
  },
  {
    "id": "boj_01238",
    "title": "백준 : 1238. 파티",
    "description": "다익스트라를 활용한 파티 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-04",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1238",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01238.md"
  },
  {
    "id": "lc_0577",
    "title": "leetcode : 577. Employee Bonus",
    "description": "JOIN",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-04",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/employee-bonus/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0577.md"
  },
  {
    "id": "lc_0584",
    "title": "leetcode : 584. Find Customer Referee",
    "description": "NULL 처리",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-04",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/find-customer-referee/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0584.md"
  },
  {
    "id": "boj_13911",
    "title": "백준 : 13911. 집 구하기",
    "description": "다익스트라를 활용한 집 구하기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-03",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/13911",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_13911.md"
  },
  {
    "id": "lc_0570",
    "title": "leetcode : 570. Managers with at Least 5 Direct Reports",
    "description": "셀프조인 및 집계",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-03",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/managers-with-at-least-5-direct-reports/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0570.md"
  },
  {
    "id": "boj_16398",
    "title": "백준 : 16398. 행성 연결",
    "description": "유니온-파인드를 활용한 행성 연결 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-02",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16398",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16398.md"
  },
  {
    "id": "lc_0262",
    "title": "leetcode : 262. Trips and Users",
    "description": "다중조건, 조인 및 집계함수",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-02",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/trips-and-users/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0262.md"
  },
  {
    "id": "lc_0511",
    "title": "leetcode : 511. Game Play Analysis I",
    "description": "그룹의 최솟값",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-02",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/game-play-analysis-i/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0511.md"
  },
  {
    "id": "boj_01922",
    "title": "백준 : 1922. 네트워크 연결",
    "description": "MST를 활용한 네트워크 연결 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2025-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1922",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01922.md"
  },
  {
    "id": "lc_0196",
    "title": "leetcode : 196. Delete Duplicate Emails",
    "description": "중복 데이터 제거",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-01",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/delete-duplicate-emails/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0196.md"
  },
  {
    "id": "lc_0197",
    "title": "leetcode : 197. Rising Temperature",
    "description": "LEAD/shift",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2025-01-01",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/rising-temperature/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0197.md"
  },
  {
    "id": "boj_02011",
    "title": "백준 : 2011. 암호코드",
    "description": "탑다운 DP를 활용한 암호코드 해석 방법의 수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-12-31",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/2011",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_02011.md"
  },
  {
    "id": "lc_0184",
    "title": "leetcode : 184. Department Highest Salary",
    "description": "DENSE RANK, GROUP BY를 통한 그룹 내 최대값 찾기",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-12-31",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/department-highest-salary/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0184.md"
  },
  {
    "id": "lc_0185",
    "title": "leetcode : 185. Department Top Three Salaries",
    "description": "DENSE RANK",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-12-31",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/department-top-three-salaries/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0185.md"
  },
  {
    "id": "boj_15486",
    "title": "백준 : 15486. 퇴사 2",
    "description": "바텀업/탑다운 DP를 활용한 퇴사 최대 수익 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-12-30",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/15486",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_15486.md"
  },
  {
    "id": "lc_0182",
    "title": "leetcode : 182. Duplicate Emails",
    "description": "GROUP BY HAVING을 활용한 중복 데이터 찾기",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-12-30",
    "views": 0,
    "tags": [
      "leetcode",
      "Pandas"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/duplicate-emails/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0182.md"
  },
  {
    "id": "lc_0183",
    "title": "leetcode : 183. Customers Who Never Order",
    "description": "타 테이블의 특정 조건을 만족하는 데이터를 찾는 문제",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-12-30",
    "views": 0,
    "tags": [
      "leetcode",
      "pandas"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/customers-who-never-order/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0183.md"
  },
  {
    "id": "lc_0178",
    "title": "leetcode : 178. Rank Scores",
    "description": "DENSE RANK와 정렬",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-12-29",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/rank-scores/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0178.md"
  },
  {
    "id": "lc_0180",
    "title": "leetcode : 180. Consecutive Numbers",
    "description": "윈도우 함수, rolling과 LEAD/LAG",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-12-29",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/consecutive-numbers/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0180.md"
  },
  {
    "id": "lc_0176",
    "title": "leetcode : 176. Second Highest Salary",
    "description": "스칼라 서브쿼리와 집계 함수를 통한 Null 처리",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-12-28",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/second-highest-salary/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0176.md"
  },
  {
    "id": "lc_0177",
    "title": "leetcode : 177. Nth Highest Salary",
    "description": "SQL 함수 선언과 스칼라 서브쿼리 Null 처리",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-12-28",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/nth-highest-salary/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0177.md"
  },
  {
    "id": "lc_0181",
    "title": "leetcode : 181. Employees Earning More Than Their Managers",
    "description": "SELF JOIN",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-12-27",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/employees-earning-more-than-their-managers/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0181.md"
  },
  {
    "id": "boj_11054",
    "title": "백준 : 11054. 가장 긴 바이토닉 부분 수열",
    "description": "탑다운 DP를 활용한 바이토닉 부분 수열 최대 길이 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-12-26",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/11054",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_11054.md"
  },
  {
    "id": "boj_05557",
    "title": "백준 : 5557. 1학년",
    "description": "DFS + DP를 활용한 등식 성립 경우의 수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-12-25",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/5557",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_05557.md"
  },
  {
    "id": "boj_12904",
    "title": "백준 : 12904. A와 B",
    "description": "백준 : 12904. A와 B 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-12-24",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://www.acmicpc.net/problem/12904",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/boj_12904.md"
  },
  {
    "id": "boj_16952",
    "title": "백준 : 16952. 체스판 여행 2",
    "description": "BFS를 활용한 체스판 여행 2 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-12-07",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16952",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16952.md"
  },
  {
    "id": "boj_16959",
    "title": "백준 : 16959. 체스판 여행 1",
    "description": "BFS를 활용한 체스판 여행 1 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-12-06",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16959",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16959.md"
  },
  {
    "id": "boj_16930",
    "title": "백준 : 16930. 달리기",
    "description": "BFS를 활용한 달리기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-29",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16930",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16930.md"
  },
  {
    "id": "boj_17267",
    "title": "백준 : 17267. 상남자",
    "description": "0-1 BFS를 활용한 상남자 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-28",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/17267",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_17267.md"
  },
  {
    "id": "boj_01981",
    "title": "백준 : 1981. 배열에서 이동",
    "description": "BFS + 이분탐색을 활용한 배열에서 이동 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-28",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1981",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01981.md"
  },
  {
    "id": "boj_02325",
    "title": "백준 : 2325. 개코전쟁",
    "description": "다익스트라를 활용한 개코전쟁 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-27",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2325",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02325.md"
  },
  {
    "id": "boj_01473",
    "title": "백준 : 1473. 미로 탈출",
    "description": "비트마스킹 BFS를 활용한 미로 탈출 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-26",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1473",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01473.md"
  },
  {
    "id": "boj_28032",
    "title": "백준 : 28032. Filed Day",
    "description": "BFS와 비트마스킹을 활용한 Filed Day 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-26",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/28032",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_28032.md"
  },
  {
    "id": "boj_20304",
    "title": "백준 : 20304. 비밀번호 제작",
    "description": "BFS를 활용한 비밀번호 제작 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-23",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/20304",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_20304.md"
  },
  {
    "id": "boj_03197",
    "title": "백준 : 3197. 백조의 호수",
    "description": "BFS와 유니온-파인드를 활용한 백조의 호수 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-23",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/3197",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_03197.md"
  },
  {
    "id": "boj_14868",
    "title": "백준 : 14868. 문명",
    "description": "BFS + 유니온-파인드를 활용한 문명 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-22",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/14868",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_14868.md"
  },
  {
    "id": "boj_11779",
    "title": "백준 : 11779. 최소비용 구하기 2",
    "description": "다익스트라와 역추적을 활용한 최소비용 구하기 2 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-21",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/11779",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_11779.md"
  },
  {
    "id": "boj_01916",
    "title": "백준 : 1916. 최소비용 구하기",
    "description": "다익스트라를 활용한 최소비용 구하기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-21",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1916",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01916.md"
  },
  {
    "id": "boj_10251",
    "title": "백준 : 10251. 운전 면허 시험",
    "description": "다차원 DP를 활용한 운전 면허 시험 최소 시간 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-19",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/10251",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_10251.md"
  },
  {
    "id": "boj_01753",
    "title": "백준 : 1753. 최단경로",
    "description": "다익스트라를 활용한 최단경로 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-18",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1753",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01753.md"
  },
  {
    "id": "boj_01644",
    "title": "백준 : 1644. 소수의 연속합",
    "description": "에라토스테네스 체 + 투포인터를 활용한 소수의 연속합 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-16",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/1644",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_01644.md"
  },
  {
    "id": "boj_02479",
    "title": "백준 : 2479. 경로찾기",
    "description": "BFS와 비트마스킹을 활용한 경로찾기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-16",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2479",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02479.md"
  },
  {
    "id": "boj_01240",
    "title": "백준 : 1240. 노드 사이의 거리",
    "description": "BFS를 활용한 노드 사이의 거리 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-15",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1240",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01240.md"
  },
  {
    "id": "boj_01660",
    "title": "백준 : 1660. 캡틴 이다솜",
    "description": "DP를 활용한 사면체 만들기 최소 블록 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-15",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/1660",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_01660.md"
  },
  {
    "id": "boj_01083",
    "title": "백준 : 1083. 소트",
    "description": "백준 : 1083. 소트 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-11-14",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://www.acmicpc.net/problem/1083",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/boj_01083.md"
  },
  {
    "id": "boj_02230",
    "title": "백준 : 2230. 수 고르기",
    "description": "투포인터를 활용한 수 고르기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-10-02",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/2230",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_02230.md"
  },
  {
    "id": "boj_03151",
    "title": "백준 3151 : 합이 0 (골드4)",
    "description": "백준 3151 : 합이 0 (골드4) 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-10-02",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/3151",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_03151.md"
  },
  {
    "id": "boj_01202",
    "title": "백준 : 1202. 보석 도둑",
    "description": "그리디 + 정렬 + 힙을 활용한 보석 도둑 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-10-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/1202",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_01202.md"
  },
  {
    "id": "boj_01595",
    "title": "백준 : 1595. 북쪽나라의 도로",
    "description": "BFS를 활용한 북쪽나라의 도로 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-10-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1595",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01595.md"
  },
  {
    "id": "boj_01633",
    "title": "백준 : 1633. 최고의 팀 만들기",
    "description": "DFS + DP를 활용한 최고의 팀 구성 최대 점수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-10-01",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/1633",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_01633.md"
  },
  {
    "id": "boj_01368",
    "title": "백준 : 1368. 물대기",
    "description": "유니온-파인드를 활용한 물대기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-09-21",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1368",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01368.md"
  },
  {
    "id": "lc_1741",
    "title": "leetcode : 1741. Find Total Time Spent by Each Employee",
    "description": "leetcode : 1741. Find Total Time Spent by Each Employee 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-09-07",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/find-total-time-spent-by-each-employee/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1741.md"
  },
  {
    "id": "lc_1757",
    "title": "leetcode : 1757. Recyclable and Low Fat Products",
    "description": "leetcode : 1757. Recyclable and Low Fat Products 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-09-07",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/recyclable-and-low-fat-products/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1757.md"
  },
  {
    "id": "lc_1795",
    "title": "leetcode : 1795. Rearrange Products Table",
    "description": "leetcode : 1795. Rearrange Products Table 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-09-07",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/rearrange-products-table/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1795.md"
  },
  {
    "id": "lc_1731",
    "title": "leetcode : 1731. The Number of Employees Which Report to Each Employee",
    "description": "leetcode : 1731. The Number of Employees Which Report to Each Employee 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-09-06",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/the-number-of-employees-which-report-to-each-employee/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1731.md"
  },
  {
    "id": "boj_01197",
    "title": "백준 : 1197. 최소 스패닝 트리",
    "description": "유니온-파인드를 활용한 최소 스패닝 트리 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-09-03",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1197",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01197.md"
  },
  {
    "id": "lc_1527",
    "title": "leetcode : 1527. Patients With a Condition",
    "description": "leetcode : 1527. Patients With a Condition 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-08-31",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/patients-with-a-condition/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1527.md"
  },
  {
    "id": "lc_1517",
    "title": "leetcode : 1517. Find Users With Valid E-Mails",
    "description": "leetcode : 1517. Find Users With Valid E-Mails 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-08-29",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/find-users-with-valid-e-mails/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1517.md"
  },
  {
    "id": "boj_10942",
    "title": "백준 : 10942. 팰린드롬?",
    "description": "DP를 활용한 팰린드롬 쿼리 처리",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-08-04",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/10942",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_10942.md"
  },
  {
    "id": "boj_02473",
    "title": "백준 : 2473. 세 용액",
    "description": "투포인터를 활용한 세 용액 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-08-04",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/2473",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_02473.md"
  },
  {
    "id": "boj_11660",
    "title": "백준 : 11660. 구간 합 구하기 5",
    "description": "2차원 누적합을 활용한 구간 합 구하기 5 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-08-02",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/11660",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_11660.md"
  },
  {
    "id": "boj_01806",
    "title": "백준 : 1806. 부분합",
    "description": "백준 : 1806. 부분합 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-08-02",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/1806",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_01806.md"
  },
  {
    "id": "boj_11404",
    "title": "백준 : 11404. 플로이드",
    "description": "플로이드-워셜 알고리즘을 활용한 플로이드 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-08-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/11404",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_11404.md"
  },
  {
    "id": "boj_01967",
    "title": "백준 : 1967. 트리의 지름",
    "description": "BFS를 활용한 트리의 지름 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-08-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1967",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01967.md"
  },
  {
    "id": "boj_09465",
    "title": "백준 : 9465. 스티커",
    "description": "2×2 상태 DP를 활용한 스티커 최대 점수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-08-01",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/9465",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_09465.md"
  },
  {
    "id": "boj_14938",
    "title": "백준 : 14938. 서강그라운드",
    "description": "다익스트라를 활용한 서강그라운드 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-07-31",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/14938",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_14938.md"
  },
  {
    "id": "boj_29792",
    "title": "백준 : 29792. 규칙적인 보스돌이",
    "description": "BFS와 냅색 알고리즘을 활용한 규칙적인 보스돌이 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-22",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/29792",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_29792.md"
  },
  {
    "id": "boj_16562",
    "title": "백준 : 16562. 친구비",
    "description": "유니온-파인드를 활용한 친구비 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-16",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16562",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16562.md"
  },
  {
    "id": "pr_등산코스정하기",
    "title": "programmers : 등산코스 정하기",
    "description": "다익스트라를 활용한 등산코스 정하기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-13",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/118669",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_등산코스정하기.md"
  },
  {
    "id": "pr_산모양타일링",
    "title": "programmers : 산모양 타일링",
    "description": "타일링 DP를 활용한 산모양 타일링 경우의 수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-12",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/258705",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/pr_산모양타일링.md"
  },
  {
    "id": "boj_30804",
    "title": "백준 : 30804. 과일탕후루",
    "description": "투포인터를 활용한 과일탕후루 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-11",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/30804",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_30804.md"
  },
  {
    "id": "pr_괄호회전하기",
    "title": "programmers : 괄호 회전하기",
    "description": "큐 + 스택을 활용한 괄호 문자열 올바름 검사",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-11",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/76502",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/pr_괄호회전하기.md"
  },
  {
    "id": "pr_가장긴팰린드롬",
    "title": "programmers : 가장 긴 팰린드롬",
    "description": "가장 긴 팰린드롬 찾기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-10",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/12904",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/pr_가장긴팰린드롬.md"
  },
  {
    "id": "pr_유사칸토어비트열",
    "title": "programmers : 유사 칸토어 비트열",
    "description": "분할정복을 활용한 유사 칸토어 비트열 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-10",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/148652",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/pr_유사칸토어비트열.md"
  },
  {
    "id": "pr_점찍기",
    "title": "programmers : 점 찍기",
    "description": "원의 방정식을 활용한 점 찍기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-10",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/140107",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/pr_점찍기.md"
  },
  {
    "id": "pr_혼자놀기의달인",
    "title": "programmers : 혼자 놀기의 달인",
    "description": "간단한 구현을 활용한 혼자 놀기의 달인 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-10",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/131130",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/pr_혼자놀기의달인.md"
  },
  {
    "id": "pr_혼자서하는틱택토",
    "title": "programmers : 혼자서 하는 틱택토",
    "description": "BFS를 활용한 혼자서 하는 틱택토 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-10",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/160585",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_혼자서하는틱택토.md"
  },
  {
    "id": "boj_12869",
    "title": "백준 : 12869. 뮤탈리스크",
    "description": "탑다운 DP를 활용한 SCV 파괴 최소 공격 횟수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-08",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/12869",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_12869.md"
  },
  {
    "id": "boj_14948",
    "title": "백준 : 14948. 군대탈출하기",
    "description": "다익스트라를 활용한 군대탈출하기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-08",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/14948",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_14948.md"
  },
  {
    "id": "boj_24041",
    "title": "백준 : 24041. 성싶당 밀키트",
    "description": "이분탐색을 활용한 성싶당 밀키트 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-06-05",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/24041",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_24041.md"
  },
  {
    "id": "boj_17612",
    "title": "백준 : 17612. 쇼핑몰",
    "description": "힙을 활용한 계산대 배정 및 출구 순서 계산",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-05-28",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/17612",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_17612.md"
  },
  {
    "id": "boj_09576",
    "title": "백준 : 9576. 책 나눠주기",
    "description": "그리디 알고리즘을 활용한 책 나눠주기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-05-28",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://www.acmicpc.net/problem/9576",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/boj_09576.md"
  },
  {
    "id": "boj_02143",
    "title": "백준 : 2143. 두 배열의 합",
    "description": "누적합 + 해싱을 활용한 두 배열의 합 매칭",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-05-26",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/2143",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_02143.md"
  },
  {
    "id": "ct_코드트리투어",
    "title": "코드트리 : 코드트리 투어",
    "description": "다익스트라 + 힙을 활용한 코드트리 투어 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-05-11",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.codetree.ai/training-field/frequent-problems/problems/codetree-tour/description?page=1&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/ct_코드트리투어.md"
  },
  {
    "id": "pr_숫자타자대회",
    "title": "programmers : 숫자 타자 대회",
    "description": "다익스트라 + DP를 활용한 숫자 타자 대회 최소 가중치 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-05-09",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/136797",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/pr_숫자타자대회.md"
  },
  {
    "id": "pr_다단계칫솔판매",
    "title": "programmers : 다단계 칫솔 판매",
    "description": "DFS를 활용한 다단계 칫솔 판매 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-05-08",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/77486",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_다단계칫솔판매.md"
  },
  {
    "id": "boj_01613",
    "title": "백준 : 1613. 역사",
    "description": "플로이드-워셜을 활용한 역사 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-05-05",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1613",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01613.md"
  },
  {
    "id": "ct_고대문명유적탐사",
    "title": "코드트리 : 고대 문명 유적 탐사",
    "description": "BFS + 회전을 활용한 고대 문명 유적 탐사 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-05-01",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.codetree.ai/training-field/frequent-problems/problems/ancient-ruin-exploration/description?page=1&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/ct_고대문명유적탐사.md"
  },
  {
    "id": "pr_N으로표현",
    "title": "프로그래머스 : N으로표현 (레벨3)",
    "description": "프로그래머스 : N으로표현 (레벨3) 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-24",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/42895",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/pr_N으로표현.md"
  },
  {
    "id": "pr_사칙연산",
    "title": "programmers : 사칙연산",
    "description": "State DP를 활용한 사칙연산 식 최대값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-23",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/1843",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/pr_사칙연산.md"
  },
  {
    "id": "pr_올바른괄호의개수",
    "title": "programmers : 올바른 괄호의 개수",
    "description": "DFS + DP를 활용한 올바른 괄호의 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-23",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/12929",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/pr_올바른괄호의개수.md"
  },
  {
    "id": "boj_07453",
    "title": "백준 : 7453. 합이 0인 네 정수",
    "description": "누적합 + 해싱을 활용한 네 배열의 합이 0인 경우의 수 계산",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-22",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/7453",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_07453.md"
  },
  {
    "id": "boj_10986",
    "title": "백준 : 10986. 나머지 합",
    "description": "백준 : 10986. 나머지 합 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-21",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/10986",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_10986.md"
  },
  {
    "id": "boj_03109",
    "title": "백준 : 3109. 빵집",
    "description": "DFS/그리디를 활용한 빵집 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-14",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/3109",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_03109.md"
  },
  {
    "id": "boj_06497",
    "title": "백준 : 6497. 전력난",
    "description": "MST를 활용한 전력난 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-13",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/6497",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_06497.md"
  },
  {
    "id": "ct_정육면체한번더굴리기",
    "title": "코드트리 : 정육면체 한 번 더 굴리기",
    "description": "BFS + deque를 활용한 정육면체 한 번 더 굴리기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-13",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.codetree.ai/training-field/frequent-problems/problems/cube-rounding-again/description?page=1&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/ct_정육면체한번더굴리기.md"
  },
  {
    "id": "boj_14728",
    "title": "백준 : 14728. 벼락치기",
    "description": "냅색 DP를 활용한 벼락치기 최대 점수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-08",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/14728",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_14728.md"
  },
  {
    "id": "lc_0550",
    "title": "leetcode : 550. Game Play Analysis IV",
    "description": "날짜연산 및 리텐션 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-04-08",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/game-play-analysis-iv/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0550.md"
  },
  {
    "id": "ct_예술성",
    "title": "코드트리 : 예술성",
    "description": "BFS + 회전을 활용한 예술성 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-07",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.codetree.ai/training-field/frequent-problems/problems/artistry/description?page=1&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/ct_예술성.md"
  },
  {
    "id": "pr_부대복귀",
    "title": "programmers : 부대복귀",
    "description": "BFS를 활용한 부대복귀 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-07",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/132266",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_부대복귀.md"
  },
  {
    "id": "boj_22866",
    "title": "백준 : 22866. 탑 보기",
    "description": "스택을 활용한 양방향 탐색으로 볼 수 있는 건물 개수 및 가장 가까운 건물 찾기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-04",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/22866",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_22866.md"
  },
  {
    "id": "boj_18124",
    "title": "백준 : 18234. 당근훔쳐먹기",
    "description": "그리디 알고리즘을 활용한 당근훔쳐먹기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-02",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://www.acmicpc.net/problem/18124",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/boj_18124.md"
  },
  {
    "id": "ct_코드트리코딩대회",
    "title": "코드트리 : 코드트리 코딩 대회",
    "description": "DFS + DP를 활용한 코드트리 코딩 대회 최소 인원 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-02",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.codetree.ai/training-field/search/problems/codetree-coding-contest/description?page=33&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/ct_코드트리코딩대회.md"
  },
  {
    "id": "pr_인사고과",
    "title": "programmers : 인사고과",
    "description": "정렬을 활용한 인사고과 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-04-02",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/152995",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/pr_인사고과.md"
  },
  {
    "id": "lc_0175",
    "title": "leetcode: 175. Combine Two Tables",
    "description": "피벗테이블과의 LEFT JOIN 문제",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-03-27",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/combine-two-tables/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_0175.md"
  },
  {
    "id": "ct_꼬리잡기놀이",
    "title": "코드트리 : 꼬리잡기놀이",
    "description": "DFS + deque를 활용한 꼬리잡기놀이 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-03-26",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.codetree.ai/training-field/frequent-problems/problems/tail-catch-play/description?page=1&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/ct_꼬리잡기놀이.md"
  },
  {
    "id": "pr_붕대감기",
    "title": "programmers : 붕대 감기",
    "description": "시간 차이 계산을 활용한 붕대 감기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-03-25",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/250137",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/pr_붕대감기.md"
  },
  {
    "id": "pr_여행경로",
    "title": "programmers : 여행경로",
    "description": "DFS + 백트래킹을 활용한 여행경로 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-03-25",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/43164",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_여행경로.md"
  },
  {
    "id": "boj_02186",
    "title": "백준 : 2186. 문자판",
    "description": "DFS + DP를 활용한 문자판 경로 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-03-18",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/2186",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_02186.md"
  },
  {
    "id": "boj_02307",
    "title": "백준 : 2307. 도로검문",
    "description": "다익스트라 + 역추적을 활용한 도로검문 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-03-16",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2307",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02307.md"
  },
  {
    "id": "boj_02406",
    "title": "백준 : 2406. 안정적인 네트워크",
    "description": "MST를 활용한 안정적인 네트워크 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-03-05",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2406",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02406.md"
  },
  {
    "id": "ct_나무박멸",
    "title": "코드트리 : 나무박멸",
    "description": "시뮬레이션을 활용한 나무박멸 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-03-05",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.codetree.ai/training-field/frequent-problems/problems/tree-kill-all/description?page=1&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/ct_나무박멸.md"
  },
  {
    "id": "boj_01301",
    "title": "백준 : 1301. 비즈 공예",
    "description": "DFS + DP를 활용한 비즈 배열 경우의 수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-03-03",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/1301",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_01301.md"
  },
  {
    "id": "pr_석유시추",
    "title": "programmers : 석유 시추",
    "description": "BFS를 활용한 석유 시추 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-03-02",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/250136",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_석유시추.md"
  },
  {
    "id": "boj_02056",
    "title": "백준 : 2056. 작업",
    "description": "위상정렬을 활용한 작업 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-29",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2056",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02056.md"
  },
  {
    "id": "boj_10282",
    "title": "백준 : 10282. 해킹",
    "description": "다익스트라를 활용한 해킹 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-28",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/10282",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_10282.md"
  },
  {
    "id": "boj_02610",
    "title": "백준 : 2610. 회의준비",
    "description": "유니온-파인드와 플로이드-워셜을 활용한 회의준비 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-28",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2610",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02610.md"
  },
  {
    "id": "pr_수레움직이기",
    "title": "programmers : 수레 움직이기",
    "description": "DFS를 활용한 수레 움직이기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-28",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/250134",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_수레움직이기.md"
  },
  {
    "id": "boj_14238",
    "title": "백준 : 14238. 출근기록",
    "description": "DFS + DP를 활용한 올바른 출근 기록 문자열 찾기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-25",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/14238",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_14238.md"
  },
  {
    "id": "boj_02632",
    "title": "백준 : 2632. 피자판매",
    "description": "누적합 + 이분탐색을 활용한 피자판매 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-25",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/2632",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_02632.md"
  },
  {
    "id": "ct_싸움땅",
    "title": "코드트리 : 싸움땅",
    "description": "힙 + 딕셔너리를 활용한 싸움땅 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-25",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.codetree.ai/training-field/frequent-problems/problems/battle-ground/description?page=1&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/ct_싸움땅.md"
  },
  {
    "id": "pr_표병합",
    "title": "programmers : 표 병합",
    "description": "유니온-파인드를 활용한 표 병합 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-25",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/150366",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_표병합.md"
  },
  {
    "id": "boj_16954",
    "title": "백준 : 16954. 움직이는 미로탈출",
    "description": "BFS를 활용한 움직이는 미로탈출 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-19",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/16954",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_16954.md"
  },
  {
    "id": "boj_12969",
    "title": "백준 : 12969. ABC",
    "description": "DFS + DP를 활용한 조건을 만족하는 문자열 찾기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-18",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/12969",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_12969.md"
  },
  {
    "id": "boj_01736",
    "title": "백준 : 1736. 쓰레기 치우기",
    "description": "그리디 알고리즘을 활용한 쓰레기 치우기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-18",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://www.acmicpc.net/problem/1736",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/boj_01736.md"
  },
  {
    "id": "boj_01797",
    "title": "백준 : 1797. 균형잡힌 줄서기",
    "description": "정렬 + 누적합 + 해시를 활용한 균형잡힌 그룹 찾기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-18",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/1797",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_01797.md"
  },
  {
    "id": "boj_02253",
    "title": "백준 : 2253. 점프",
    "description": "2차원 DP를 활용한 돌다리 점프 최소 횟수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-18",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/2253",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_02253.md"
  },
  {
    "id": "boj_09347",
    "title": "백준 : 9347. 울타리",
    "description": "다익스트라를 활용한 울타리 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-18",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/9347",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_09347.md"
  },
  {
    "id": "ct_메이즈러너",
    "title": "코드트리 : 메이즈러너",
    "description": "브루트포스 + 회전을 활용한 메이즈러너 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-02-18",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.codetree.ai/training-field/frequent-problems/problems/maze-runner/description?page=1&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/ct_메이즈러너.md"
  },
  {
    "id": "pr_n+1카드게임",
    "title": "programmers : n+1 카드게임",
    "description": "그리디 알고리즘을 활용한 n+1 카드게임 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-18",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/258707",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/pr_n+1카드게임.md"
  },
  {
    "id": "boj_01888",
    "title": "백준 : 1888. 곰팡이",
    "description": "BFS + 시뮬레이션을 활용한 곰팡이 덩어리 통합 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-17",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.acmicpc.net/problem/1888",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/boj_01888.md"
  },
  {
    "id": "boj_30015",
    "title": "백준 : 30015. 학생회뽑기",
    "description": "비트마스킹을 활용한 학생회뽑기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-17",
    "views": 0,
    "tags": [
      "greedy"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Greedy",
    "problem_url": "https://www.acmicpc.net/problem/30015",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Greedy/boj_30015.md"
  },
  {
    "id": "boj_10868",
    "title": "백준 : 10868. 최솟값",
    "description": "세그먼트 트리를 활용한 구간 최솟값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/10868",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_10868.md"
  },
  {
    "id": "boj_11505",
    "title": "백준 : 11505. 구간 곱 구하기",
    "description": "세그먼트 트리를 활용한 구간 곱 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/11505",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_11505.md"
  },
  {
    "id": "boj_11658",
    "title": "백준 : 11658. 구간 합 구하기 3",
    "description": "2D 펜윅 트리를 활용한 구간 합 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/11658",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_11658.md"
  },
  {
    "id": "boj_11725",
    "title": "백준 : 11725. 트리의 부모 찾기",
    "description": "BFS를 활용한 트리의 부모 찾기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/11725",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_11725.md"
  },
  {
    "id": "boj_12014",
    "title": "백준 : 12014. 주식",
    "description": "LIS를 활용한 주식 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/12014",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_12014.md"
  },
  {
    "id": "boj_01275",
    "title": "백준 : 1275. 커피숍2",
    "description": "펜윅 트리를 활용한 구간 합 및 업데이트",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/1275",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_01275.md"
  },
  {
    "id": "boj_12837",
    "title": "백준 : 12837. 가계부 (Hard)",
    "description": "펜윅 트리 또는 세그먼트 트리를 활용한 구간 합 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/12837",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_12837.md"
  },
  {
    "id": "boj_01365",
    "title": "백준 : 1365. 꼬인 전깃줄",
    "description": "LIS를 활용한 꼬인 전깃줄 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/1365",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_01365.md"
  },
  {
    "id": "boj_14003",
    "title": "백준 : 14003. 가장 긴 증가하는 부분 수열 5",
    "description": "LIS + 역추적을 활용한 가장 긴 증가하는 부분 수열 5 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/14003",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_14003.md"
  },
  {
    "id": "boj_14428",
    "title": "백준 : 14428. 수열과 쿼리 16",
    "description": "세그먼트 트리를 활용한 구간 최솟값 인덱스 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/14428",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_14428.md"
  },
  {
    "id": "boj_14438",
    "title": "백준 : 14438. 수열과 쿼리 17",
    "description": "세그먼트 트리를 활용한 구간 최솟값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/14438",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_14438.md"
  },
  {
    "id": "boj_14567",
    "title": "백준 : 14567. 선수과목",
    "description": "위상정렬을 활용한 선수과목 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python",
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/14567",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_14567.md"
  },
  {
    "id": "boj_01818",
    "title": "백준 : 1818. 책정리",
    "description": "LIS를 활용한 책정리 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/1818",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_01818.md"
  },
  {
    "id": "boj_18436",
    "title": "백준 : 18436. 수열과 쿼리 37",
    "description": "세그먼트 트리를 활용한 구간 홀수/짝수 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/18436",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_18436.md"
  },
  {
    "id": "boj_02001",
    "title": "백준 : 2001. 보석줍기",
    "description": "비트마스킹 BFS를 활용한 보석줍기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2001",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02001.md"
  },
  {
    "id": "boj_02042",
    "title": "백준 : 2042. 구간 합 구하기",
    "description": "펜윅 트리를 활용한 구간 합 및 업데이트",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/2042",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_02042.md"
  },
  {
    "id": "boj_02174",
    "title": "백준 : 2174. 로봇 시뮬레이션",
    "description": "시뮬레이션을 활용한 로봇 이동 충돌 검사",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.acmicpc.net/problem/2174",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/boj_02174.md"
  },
  {
    "id": "boj_02268",
    "title": "백준 : 2268. 수들의 합 7",
    "description": "펜윅 트리를 활용한 구간 합 및 업데이트",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/2268",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_02268.md"
  },
  {
    "id": "boj_02352",
    "title": "백준 : 2352. 반도체 설계",
    "description": "LIS를 활용한 반도체 설계 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/2352",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_02352.md"
  },
  {
    "id": "boj_02357",
    "title": "백준 : 2357. 최솟값과 최댓값",
    "description": "세그먼트 트리를 활용한 구간 최솟값과 최댓값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/2357",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_02357.md"
  },
  {
    "id": "boj_02517",
    "title": "백준 : 2517. 달리기",
    "description": "좌표 압축 + 펜윅 트리를 활용한 역순 쌍 개수 계산",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/2517",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_02517.md"
  },
  {
    "id": "boj_03745",
    "title": "백준 : 3745. 오름세",
    "description": "LIS를 활용한 오름세 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://www.acmicpc.net/problem/3745",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/boj_03745.md"
  },
  {
    "id": "boj_03977",
    "title": "백준 : 3977. 축구 전술",
    "description": "타잔 알고리즘을 활용한 축구 전술 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/3977",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_03977.md"
  },
  {
    "id": "boj_05419",
    "title": "백준 : 5419. 북서풍",
    "description": "좌표 압축 + 펜윅 트리를 활용한 역순 쌍 개수 계산",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/5419",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_05419.md"
  },
  {
    "id": "boj_05676",
    "title": "백준 : 5676. 음주 코딩",
    "description": "세그먼트 트리를 활용한 구간 곱의 부호 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/5676",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_05676.md"
  },
  {
    "id": "boj_07570",
    "title": "백준 : 7570. 줄 세우기",
    "description": "1씩 증가하는 LIS를 활용한 줄 세우기 최소 이동 횟수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/7570",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_07570.md"
  },
  {
    "id": "ct_포탑부수기",
    "title": "코드트리 : 포탑 부수기",
    "description": "힙 + BFS + DFS를 활용한 포탑 부수기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.codetree.ai/training-field/frequent-problems/problems/destroy-the-turret/submissions?page=1&pageSize=20",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/ct_포탑부수기.md"
  },
  {
    "id": "pr_단어퍼즐",
    "title": "programmers : 단어퍼즐",
    "description": "BFS를 활용한 단어퍼즐 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/12983",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_단어퍼즐.md"
  },
  {
    "id": "pr_배달",
    "title": "programmers : 배달",
    "description": "다익스트라를 활용한 배달 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/12978",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/pr_배달.md"
  },
  {
    "id": "pr_연속된부분수열의합",
    "title": "programmers : 연속된 부분 수열의 합",
    "description": "투포인터를 활용한 연속된 부분 수열의 합 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "etc"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "etc",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/178870",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/etc/pr_연속된부분수열의합.md"
  },
  {
    "id": "swea_1238",
    "title": "SWEA : 1238. Contact",
    "description": "BFS를 활용한 Contact 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV15B1cKAKwCFAYD",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_1238.md"
  },
  {
    "id": "swea_1251",
    "title": "SWEA : 1251. 하나로",
    "description": "크루스칼 알고리즘을 활용한 하나로 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV15StKqAQkCFAYD",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_1251.md"
  },
  {
    "id": "swea_3124",
    "title": "SWEA : 3124. 최소 스패닝 트리",
    "description": "크루스칼 알고리즘을 활용한 최소 스패닝 트리 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AV_mSnmKUckDFAWb",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_3124.md"
  },
  {
    "id": "swea_3289",
    "title": "SWEA : 3289. 서로소 집합",
    "description": "유니온-파인드를 활용한 서로소 집합 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWBJKA6qr2oDFAWr",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_3289.md"
  },
  {
    "id": "swea_7465",
    "title": "SWEA : 7465. 창용 마을 무리의 개수",
    "description": "유니온-파인드를 활용한 창용 마을 무리의 개수 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Java"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://swexpertacademy.com/main/code/problem/problemDetail.do?contestProbId=AWngfZVa9XwDFAQU",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/swea_7465.md"
  },
  {
    "id": "lc_1965",
    "title": "leetcode : 1965. Employees With Missing Information",
    "description": "leetcode : 1965. Employees With Missing Information 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/employees-with-missing-information/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1965.md"
  },
  {
    "id": "lc_1978",
    "title": "leetcode : 1978. Employees Whose Manager Left the Company",
    "description": "leetcode : 1978. Employees Whose Manager Left the Company 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "leetcode"
    ],
    "techStack": [
      "SQL",
      "Pandas"
    ],
    "folderCategory": "leetcode",
    "problem_url": "https://leetcode.com/problems/employees-whose-manager-left-the-company/description/",
    "sourcePath": "/src/lib/posts/problem-solving/query/leetcode/lc_1978.md"
  },
  {
    "id": "pr_부모의형질을모두가지는대장균찾기",
    "title": "programmers : 부모의 형질을 모두 가지는 대장균 찾기",
    "description": "비트연산",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/301647",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_부모의형질을모두가지는대장균찾기.md"
  },
  {
    "id": "pr_연도별대장균크기의편차구하기",
    "title": "programmers : 연도별 대장균 크기의 편차 구하기",
    "description": "JOIN + GROUP BY",
    "mainCategory": "problem-solving",
    "subCategory": "query",
    "date": "2024-01-01",
    "views": 0,
    "tags": [
      "programmers"
    ],
    "techStack": [
      "SQL"
    ],
    "folderCategory": "programmers",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/299310",
    "sourcePath": "/src/lib/posts/problem-solving/query/programmers/pr_연도별대장균크기의편차구하기.md"
  },
  {
    "id": "boj_17143",
    "title": "백준 : 17143. 낚시왕",
    "description": "시뮬레이션을 활용한 낚시왕 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-12-26",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.acmicpc.net/problem/17143",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/boj_17143.md"
  },
  {
    "id": "boj_09328",
    "title": "백준 : 9328. 열쇠",
    "description": "BFS + 시뮬레이션을 활용한 열쇠 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-12-19",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.acmicpc.net/problem/9328",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/boj_09328.md"
  },
  {
    "id": "boj_01035",
    "title": "백준 : 1035. 조각 움직이기",
    "description": "비트마스킹 + BFS를 활용한 조각 연결 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-12-16",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/1035",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_01035.md"
  },
  {
    "id": "pr_모음사전",
    "title": "프로그래머스 모음사전 (레벨2)",
    "description": "프로그래머스 모음사전 (레벨2) 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-11-30",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/43165",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/pr_모음사전.md"
  },
  {
    "id": "boj_10844",
    "title": "백준 : 10844. 쉬운 계단 수",
    "description": "DP를 활용한 계단 수 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-11-23",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/10844",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_10844.md"
  },
  {
    "id": "boj_18244",
    "title": "백준 : 18244. 변형 계단 수",
    "description": "상태 DP를 활용한 변형 계단 수 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-11-23",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/18244",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_18244.md"
  },
  {
    "id": "pr_타겟넘버",
    "title": "programmers : 타겟 넘버",
    "description": "BFS를 활용한 타겟 넘버 만들기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-11-10",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/43165",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/pr_타겟넘버.md"
  },
  {
    "id": "boj_01234",
    "title": "백준 : 1234. 크리스마스 트리",
    "description": "DFS를 활용한 크리스마스 트리 장식 경우의 수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-11-05",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/1234",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_01234.md"
  },
  {
    "id": "boj_01405",
    "title": "백준 : 1405. 미친 로봇",
    "description": "백트래킹을 활용한 미친 로봇 단순 이동 확률 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-11-05",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/1405",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_01405.md"
  },
  {
    "id": "boj_14391",
    "title": "백준 : 14391. 종이 조각",
    "description": "비트마스킹 + BFS를 활용한 종이 조각 최대값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-10-22",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/14391",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_14391.md"
  },
  {
    "id": "boj_18513",
    "title": "백준 : 18513. 샘터",
    "description": "힙 + 그리디를 활용한 샘터 주변 집 배치",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-10-22",
    "views": 0,
    "tags": [
      "datastructure"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Data Structure",
    "problem_url": "https://www.acmicpc.net/problem/18513",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Data Structure/boj_18513.md"
  },
  {
    "id": "boj_17825",
    "title": "백준 17825 : 주사위 윷놀이 (골드2)",
    "description": "백준 17825 : 주사위 윷놀이 (골드2) 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-10-22",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/17825",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_17825.md"
  },
  {
    "id": "pr_불량사용자",
    "title": "프로그래머스 불량 사용자 (레벨3)",
    "description": "프로그래머스 불량 사용자 (레벨3) 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-10-13",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/64064",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/pr_불량사용자.md"
  },
  {
    "id": "boj_20055",
    "title": "백준 : 20055. 컨베이어 벨트 위의 로봇",
    "description": "deque를 활용한 컨베이어 벨트 위의 로봇 시뮬레이션",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-10-10",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.acmicpc.net/problem/20055",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/boj_20055.md"
  },
  {
    "id": "boj_18405",
    "title": "백준 : 18405. 경쟁적 전염",
    "description": "시뮬레이션을 활용한 경쟁적 전염 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-09-20",
    "views": 0,
    "tags": [
      "simulation"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Simulation",
    "problem_url": "https://www.acmicpc.net/problem/18405",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Simulation/boj_18405.md"
  },
  {
    "id": "boj_01749",
    "title": "백준 : 1749. 점수따먹기",
    "description": "누적합을 활용한 2D 배열 최대 부분합 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-09-11",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/1749",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_01749.md"
  },
  {
    "id": "boj_18428",
    "title": "백준 18428 : 감시피하기 (골드5)",
    "description": "백준 18428 : 감시피하기 (골드5) 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-08-31",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/18428",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_18428.md"
  },
  {
    "id": "boj_01939",
    "title": "백준 : 1939. 중량제한",
    "description": "최대힙/BFS를 활용한 중량제한 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-08-29",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/1939",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_01939.md"
  },
  {
    "id": "boj_15686",
    "title": "백준 : 15686. 치킨 거리",
    "description": "조합을 활용한 치킨 거리 최소값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-08-27",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/15686",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_15686.md"
  },
  {
    "id": "boj_15683",
    "title": "백준 15863 : 감시 (골드4)",
    "description": "백준 15863 : 감시 (골드4) 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-08-27",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/골드4",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_15683.md"
  },
  {
    "id": "boj_14500",
    "title": "백준 : 14500. 테트로미노",
    "description": "누적합을 활용한 테트로미노 최대값 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-08-05",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://www.acmicpc.net/problem/14500",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/boj_14500.md"
  },
  {
    "id": "boj_01562",
    "title": "백준 : 1562. 계단 수",
    "description": "비트 DP 또는 상태 DP를 활용한 0~9가 모두 등장하는 계단 수 개수 구하기",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-07-18",
    "views": 0,
    "tags": [
      "dp"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "DP",
    "problem_url": "https://www.acmicpc.net/problem/1562",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/DP/boj_01562.md"
  },
  {
    "id": "pr_양궁대회",
    "title": "프로그래머스 양궁대회 (레벨2)",
    "description": "프로그래머스 양궁대회 (레벨2) 문제 풀이",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-06-22",
    "views": 0,
    "tags": [
      "bruteforce"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Brute Force",
    "problem_url": "https://school.programmers.co.kr/learn/courses/30/lessons/92342",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Brute Force/pr_양궁대회.md"
  },
  {
    "id": "boj_13549",
    "title": "백준 : 13549. 숨바꼭질 3",
    "description": "BFS/다익스트라를 활용한 숨바꼭질 3 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-05-22",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/13549",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_13549.md"
  },
  {
    "id": "boj_02667",
    "title": "백준 : 2667. 단지번호붙이기",
    "description": "BFS를 활용한 단지번호붙이기 문제",
    "mainCategory": "problem-solving",
    "subCategory": "algorithm",
    "date": "2023-05-08",
    "views": 0,
    "tags": [
      "graph"
    ],
    "techStack": [
      "Python"
    ],
    "folderCategory": "Graph",
    "problem_url": "https://www.acmicpc.net/problem/2667",
    "sourcePath": "/src/lib/posts/problem-solving/algorithm/Graph/boj_02667.md"
  },
  {
    "id": "10_image_segmentation",
    "title": "10. 이미지 분할과 객체 검출: K-Means와 Watershed",
    "description": "컴퓨터 비전의 꽃인 이미지 분할(Image Segmentation) 기법 중 K-Means 클러스터링과 지형학적 경계를 찾는 Watershed 알고리즘을 분석합니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-08-29",
    "views": 0,
    "tags": [
      "ImageProcessing",
      "ImageSegmentation",
      "KMeans",
      "Watershed",
      "DistanceTransform"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/10_image_segmentation.md"
  },
  {
    "id": "09_image_geometric_transformation",
    "title": "9. 이미지 기하학적 변환: Affine과 Perspective",
    "description": "Affine Transform, 투시(원근) 변환 및 회전의 수학적 원리와 OpenCV 구현을 다룹니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-08-25",
    "views": 0,
    "tags": [
      "ImageProcessing",
      "GeometricTransform",
      "AffineTransform",
      "Perspective",
      "OpenCV"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/09_image_geometric_transformation.md"
  },
  {
    "id": "08_morphological_transformation",
    "title": "8. 모폴로지 연산과 이진 이미지 노이즈 제거",
    "description": "수학적 형태학을 기반으로 이진 이미지의 잡음을 제거하고 형상을 정제하는 침식, 팽창, 열기, 닫기 등의 모폴로지 연산을 이해합니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-08-08",
    "views": 0,
    "tags": [
      "ImageProcessing",
      "Morphological",
      "Erosion",
      "Dilation",
      "Opening",
      "Closing"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/08_morphological_transformation.md"
  },
  {
    "id": "07_image_thresholding",
    "title": "7. 임계 처리와 오츠(Otsu) 이진화",
    "description": "디지털 이미지 이진화의 기초인 단순 임계 처리부터 수학적으로 최적의 임계치를 찾아내는 오츠 알고리즘 및 조명 불균일을 극복하는 적응형 이진화 기법을 알아봅니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-08-05",
    "views": 0,
    "tags": [
      "ImageProcessing",
      "Thresholding",
      "OtsuBinarization",
      "AdaptiveThreshold",
      "OpenCV"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/07_image_thresholding.md"
  },
  {
    "id": "06_image_compression_dimension_reduction",
    "title": "6. 이미지 압축과 차원 축소: PCA, SVD, DCT",
    "description": "디지털 이미지의 데이터 용량을 절약하기 위한 핵심 기법인 PCA 주성분 분석, SVD 특이값 분해, 그리고 JPEG의 핵심인 DCT 변환의 원리를 알아봅니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-07-28",
    "views": 0,
    "tags": [
      "ImageProcessing",
      "ImageCompression",
      "PCA",
      "SVD",
      "DCT"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/06_image_compression_dimension_reduction.md"
  },
  {
    "id": "04_frequency_domain_filtering",
    "title": "4. 주파수 도메인 필터링과 푸리에 변환",
    "description": "공간 도메인과 주파수 도메인의 차이를 이해하고, 2차원 이산 푸리에 변환(2D DFT)과 LPF/HPF 필터 및 커널의 주파수 분석 기법을 살펴봅니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-07-22",
    "views": 0,
    "tags": [
      "ImageProcessing",
      "FourierTransform",
      "FrequencyDomain",
      "LPF",
      "HPF"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/04_frequency_domain_filtering.md"
  },
  {
    "id": "05_histogram_modeling",
    "title": "5. 히스토그램 스트레칭과 평활화",
    "description": "이미지 화질 개선의 필수 관문인 히스토그램 모델링 기법의 수학적 개념과 RGB vs YCbCr 변환 시의 색상 왜곡 방지책을 정리합니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-07-22",
    "views": 0,
    "tags": [
      "ImageProcessing",
      "HistogramEqualization",
      "HistogramStretching",
      "Contrast",
      "OpenCV"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/05_histogram_modeling.md"
  },
  {
    "id": "03_spatial_domain_filtering",
    "title": "3. 공간 도메인 필터링과 이미지 가공",
    "description": "커널(Kernel)과 합성곱(Convolution)의 수학적 원리를 이해하고, Blurring, Sharpening, Edge Detection 필터를 구현해 봅니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-07-14",
    "views": 0,
    "tags": [
      "ImageProcessing",
      "Convolution",
      "Blurring",
      "Sharpening",
      "EdgeDetection"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/03_spatial_domain_filtering.md"
  },
  {
    "id": "02_color_channel_python",
    "title": "2. Python을 활용한 컬러 채널 분석",
    "description": "OpenCV와 Matplotlib을 활용하여 RGB, HSV, YCbCr 컬러 채널을 물리적으로 분리하고 가공하는 파이썬 코드를 자세히 알아봅니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-07-13",
    "views": 0,
    "tags": [
      "Python",
      "OpenCV",
      "ColorChannel",
      "HSV",
      "YCbCr"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/02_color_channel_python.md"
  },
  {
    "id": "01_color_space",
    "title": "1. Color Space (색 공간)",
    "description": "디지털 이미지 처리의 출발점인 색 공간(Color Space)의 개념과 대표 규격(RGB, CMYK, HSV, YUV)의 특징을 생리학적 배경과 함께 알아봅니다.",
    "mainCategory": "machine-learning",
    "subCategory": "image-processing",
    "date": "2022-07-07",
    "views": 0,
    "tags": [
      "ImageProcessing",
      "ComputerVision",
      "ColorSpace",
      "RGB",
      "YUV"
    ],
    "techStack": [
      "Python",
      "OpenCV"
    ],
    "folderCategory": "image-processing",
    "sourcePath": "/src/lib/posts/machine-learning/image-processing/01_color_space.md"
  }
] satisfies IndexedPostSummary[];

export const directoryCategoryPairs = [
  {
    "mainCategory": "machine-learning",
    "subCategory": "image-processing"
  },
  {
    "mainCategory": "problem-solving",
    "subCategory": "query"
  },
  {
    "mainCategory": "problem-solving",
    "subCategory": "algorithm"
  },
  {
    "mainCategory": "web-programming",
    "subCategory": "fastapi"
  },
  {
    "mainCategory": "web-programming",
    "subCategory": "sveltekit"
  },
  {
    "mainCategory": "web-programming",
    "subCategory": "postgresql"
  },
  {
    "mainCategory": "web-programming",
    "subCategory": "bigquery"
  }
] satisfies Array<{ mainCategory: string; subCategory: string }>;
