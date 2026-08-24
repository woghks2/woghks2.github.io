---
title: "1. SvelteKit 라우팅"
description: "SvelteKit 프로젝트 구조와 디렉터리 기반 라우팅 시스템"
date: "2025-05-13"
hashtags: ["SvelteKit", "Routing", "Frontend", "Architecture"]
skills: ["Svelte", "TypeScript"]
status: "published"
---

# 1. SvelteKit 파일 기반 라우팅

Svelte가 컴포넌트 단위의 UI를 작성하는 프레임워크라면, **SvelteKit**은 라우팅, 서버 사이드 렌더링(SSR), 데이터 로딩, API 엔드포인트, 배포 어댑터까지 묶어 제공하는 **Svelte의 공식 애플리케이션 프레임워크**입니다. React 진영의 Next.js와 비슷한 위치라고 볼 수 있습니다.

SvelteKit의 핵심 규칙은 **디렉터리 기반 라우팅**입니다. 이번 글에서는 SvelteKit 프로젝트의 기본 구조와 핵심 라우터 파일들(`+page`, `+layout`, `+error`)의 역할, 동적 파라미터 매핑 규칙을 정리해 보겠습니다.

---

## 1. Svelte vs SvelteKit의 경계 구분

두 개념은 명확하게 구분되어 동작합니다.

```text
Svelte (UI Layer)
  ├── 컴포넌트 선언 및 화면 드로잉
  ├── 반응성 상태 관리 (Runes)
  └── CSS 스타일 바인딩

SvelteKit (Application Layer)
  ├── URL 주소에 따른 페이지 라우팅 (Routing)
  ├── 서버 사이드 렌더링 (SSR) 및 데이터 사전 로드
  ├── API 엔드포인트 설계 (+server.js)
  └── 어댑터(Adapter)를 이용한 Vercel, Node, Static 서버 배포
```

SvelteKit은 내부적으로 모든 화면 컴포넌트를 Svelte 파일로 작성할 뿐, 페이지 간의 이동이나 데이터 전송 등은 애플리케이션 프레임워크인 SvelteKit의 제어 하에 이루어집니다.

---

## 2. SvelteKit 디렉터리 구조

프로젝트를 새로 생성하면 가장 중요하게 다루게 될 핵심 폴더는 바로 `src/routes/`입니다.

```text
my-project/
├── src/
│   ├── lib/            # 공통 컴포넌트, 유틸, 헬퍼 폴더 ($lib 별칭 매핑)
│   └── routes/         # 라우팅이 일어나는 물리 공간
│       ├── +layout.svelte
│       ├── +page.svelte
│       ├── about/
│       │   └── +page.svelte
│       └── posts/
│           ├── +page.svelte
│           └── [id]/
│               └── +page.svelte
└── svelte.config.js
```

SvelteKit은 `routes` 하위의 폴더 구조를 기반으로 URL 주소를 자동으로 완성합니다.

* `/` -> `src/routes/+page.svelte`가 렌더링됨
* `/about` -> `src/routes/about/+page.svelte`가 렌더링됨
* `/posts/42` -> `src/routes/posts/[id]/+page.svelte`가 렌더링됨

---

## 3. 핵심 라우팅 파일

SvelteKit의 라우터 파일들은 항상 **플러스 기호(`+`)** 접두사를 이름 앞에 달고 작동합니다. 각 파일은 고유한 역할에 집중합니다.

### 3.1 `+page.svelte`

사용자가 특정 URL에 접속했을 때 보여줄 핵심 HTML 화면 뷰입니다.

```svelte
<!-- src/routes/about/+page.svelte -->
<main>
  <h1>소개 페이지</h1>
  <p>저희 서비스를 소개해 드립니다.</p>
</main>
```

### 3.2 `+layout.svelte`

여러 페이지에서 공통적으로 노출되어야 하는 상단 네비게이션바, 푸터, 사이드바 등을 레이아웃 파일에 선언합니다. Svelte 5에서는 하위 페이지 컴포넌트가 `children` snippet으로 전달되고, 레이아웃은 `{@render children()}` 위치에 이를 렌더링합니다.

```svelte
<!-- src/routes/+layout.svelte (루트 레이아웃) -->
<script>
  let { children } = $props();
</script>

<nav>
  <a href="/">홈</a>
  <a href="/about">소개</a>
  <a href="/posts">게시글</a>
</nav>

<main>
  <!-- 하위 page 컴포넌트들이 이곳에 렌더링됩니다. -->
  {@render children()}
</main>

<footer>
  <p>© 2026. All rights reserved.</p>
</footer>
```

#### 중첩 레이아웃 (Nested Layout)

레이아웃은 하위 폴더 구조로 내려갈수록 중첩되어 동작합니다. 예를 들어 `src/routes/posts/+layout.svelte`를 만들면, 이 파일은 전체 루트 레이아웃(`+layout.svelte`) 안에 포함된 상태에서 포스트 관련 페이지(`posts/` 하위)들에만 전용으로 추가 렌더링됩니다.

### 3.3 `+error.svelte`

데이터 로딩 실패, 존재하지 않는 페이지(404), 혹은 예외 런타임 오류가 발생하면 SvelteKit은 가장 가까운 경로의 `+error.svelte` 컴포넌트를 찾아 화면을 대체합니다.

```svelte
<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<main>
  <h1>오류가 발생했습니다! 😢</h1>
  <p>상태 코드: {$page.status}</p>
  <p>원인: {$page.error?.message}</p>
  <a href="/">홈으로 돌아가기</a>
</main>
```

---

## 4. 동적 파라미터 라우팅 (Dynamic Routes)

특정 ID를 기준으로 세부 상세 화면을 동적으로 보여주고 싶을 때는 폴더 이름을 대괄호`[paramName]`로 감싸 선언합니다.

* 폴더명: `src/routes/posts/[id]/`
* 해당 페이지 주소: `/posts/123`, `/posts/abc` 등

이 주소에 들어간 dynamic 값(`123`, `abc`)은 로드 함수나 페이지 내부에서 `params.id`라는 식별자로 쉽게 조회할 수 있습니다. (구체적인 데이터 연동 방법은 이후 3편 '데이터 로딩' 포스팅에서 깊이 있게 살펴보겠습니다).

---

## 5. 플러스 기호(`+`) 접두사의 의미

> [!NOTE]
> **플러스 기호(`+`) 접두사와 폴더 응집성**
> 파일 기반 라우팅에서는 어떤 파일이 라우트 파일이고 어떤 파일이 보조 파일인지 명확하게 구분하는 규칙이 중요합니다.
>
> SvelteKit은 오직 **플러스 기호가 붙은 정해진 파일명(`+page`, `+layout`, `+server`, `+error`)**만 라우팅 노드로 해석합니다.
> 이 규칙 덕분에 해당 경로 폴더 안에 관련 보조 컴포넌트와 스타일 시트를 함께 둘 수 있습니다. 라우트 단위의 파일 응집성을 유지하기 좋은 구조입니다.

```text
src/routes/posts/
├── +page.svelte           # 실제 /posts 경로 화면 (라우팅 노드)
├── PostCard.svelte        # 포스트 목록에서만 쓰이는 보조 컴포넌트
└── styles.css             # 포스트 전용 CSS 스타일 파일
```

---

## 요약

1. **SvelteKit의 포지션**: UI 레이어인 Svelte를 품고 라우팅, 서버 사이드 렌더링(SSR), 정적 빌드 등 애플리케이션의 동작 뼈대를 구성하는 공식 풀스택 프레임워크입니다.
2. **파일 기반 라우팅**: `src/routes/`의 폴더 트리 구조가 그대로 브라우저의 URL 주소 체계로 투영됩니다.
3. **핵심 3대 파일**: 화면을 정의하는 `+page`, 중첩 구성을 가능케 하는 `+layout`, 에러를 책임지는 `+error`를 조립해 서비스를 구성합니다.
4. **플러스 접두사 보호**: `+`가 안 붙은 일반 컴포넌트나 스타일 코드는 주소 매핑에서 제외되므로 폴더 내부에 자유롭게 배치하여 높은 모듈 응집성을 유지할 수 있습니다.
