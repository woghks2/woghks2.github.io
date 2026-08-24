---
title: "3. 데이터 로딩과 성능 최적화"
description: "SvelteKit의 load 함수, Promise Streaming, Preload"
date: "2025-05-16"
hashtags: ["SvelteKit", "DataLoading", "Streaming", "Preload"]
skills: ["Svelte", "TypeScript"]
status: "published"
---

# 3. 데이터 로딩과 성능 최적화

사용자가 웹 브라우저에서 특정 주소로 접속하거나 페이지를 이동할 때, 웹 프레임워크는 필요한 데이터(DB 조회 값, 외부 API 응답 등)를 조회하여 화면에 뿌려줘야 합니다.

SvelteKit은 이를 위해 **`load` 함수**라는 표준화된 데이터 로딩 규격을 제공합니다. 여기에 느린 데이터를 Promise로 나중에 흘려보내는 **스트리밍(Streaming with Promises)**, 링크 진입 전에 코드와 데이터를 미리 가져오는 **프리로드(Preload)** 기능을 함께 제공합니다.

이번 글에서는 SvelteKit의 데이터 로딩 흐름과 체감 속도를 개선하는 스트리밍 및 프리로드 기법을 정리해 보겠습니다.

---

## 1. SvelteKit의 데이터 로딩: `load` 함수

SvelteKit에서 페이지 컴포넌트(`+page.svelte`)가 필요로 하는 데이터는 같은 폴더 내의 **`+page.js`** 혹은 **`+page.server.js`**에 정의된 `load` 함수를 통해 주입됩니다.

### 1.1 서버 vs 공통 로드 함수의 구분

* **`+page.server.js` (Server-only)**: 반드시 서버 사이드 환경에서만 실행됩니다. DB 자원에 다이렉트로 접근하거나, 외부 API 연동 시 보안 인증 키(API Key)를 브라우저에 노출시키고 싶지 않을 때 사용합니다.
* **`+page.js` (Universal)**: 서버 사이드 렌더링(SSR) 시점에는 서버에서 실행되고, 이후 페이지 전환(CSR) 시점에는 브라우저 환경에서 실행되는 범용 로드 함수입니다.

### 1.2 서버 로드 함수 구현 예제

블로그 글 상세 조회(`/posts/[id]`) 시나리오 예제입니다.

```javascript
// src/routes/posts/[id]/+page.server.js
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch }) {
    const { id } = params;
    
    // 외부 API 또는 데이터베이스 단건 조회
    const response = await fetch(`https://api.external.com/posts/${id}`);
    
    if (!response.ok) {
        // 에러를 던지면 가장 가까운 +error.svelte가 응답을 대체합니다.
        throw error(response.status, {
            message: '존재하지 않는 게시글이거나 가져오기에 실패했습니다.'
        });
    }
    
    const post = await response.json();
    
    // 컴포넌트에 넘겨줄 데이터를 JSON 객체로 반환합니다.
    return {
        post
    };
}
```

### 1.3 컴포넌트에서 데이터 주입받기

Svelte 5에서는 부모로부터 수신받는 `$props()` 룬을 통해 `data` 속성으로 로드 함수가 반환한 결과를 안전하게 받아와 렌더링합니다.

```svelte
<!-- src/routes/posts/[id]/+page.svelte -->
<script>
  // load 함수의 리턴 데이터가 'data' 키로 자동 주입됩니다.
  let { data } = $props();
</script>

<main>
  <h1>{data.post.title}</h1>
  <p>작성일: {data.post.created_at}</p>
  <hr />
  <div>{data.post.content}</div>
</main>
```

---

## 2. Promise Streaming

페이지에 노출되는 데이터 중 일부는 매우 빠르게 조회되지만, 특정 통계 데이터나 외부 제3자 연동 데이터는 조회에 수 초 이상의 대기 시간이 발생할 수 있습니다.

일반적인 `load` 함수는 모든 비동기 조회(`await`)가 끝날 때까지 페이지 전환 자체를 Blocking 시키므로 사용자는 화면이 멈춘 듯한 경험을 하게 됩니다.

SvelteKit은 이를 해결하기 위해 서버 `load`에서 **Promise 객체를 그대로 리턴하여 데이터를 나중에 전달하는 방식**을 지원합니다.

### 2.1 스트리밍 로드 함수 구현

비동기 처리를 강제 대기(`await`)시키지 않고, **Promise 객체 자체를 그대로 키로 리턴**합니다.

```javascript
// src/routes/dashboard/+page.server.js
/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    // 1. 빠르게 나오는 메인 데이터 (동기식 대기)
    const fastResponse = await fetch('https://api.com/fast-data');
    const mainData = await fastResponse.json();

    // 2. 아주 느린 통계 데이터 (await를 붙이지 않고 Promise 자체를 반환)
    const slowStatsPromise = fetch('https://api.com/slow-stats')
        .then(res => res.json());

    return {
        mainData, // 화면에 즉시 렌더링될 데이터
        streamedStats: slowStatsPromise // 완료되면 뒤늦게 흘러갈 Promise
    };
}
```

### 2.2 Svelte await 블록

Svelte의 내장 `{#await}` 문법을 활용하면 스트리밍되는 데이터를 스켈레톤 UI와 자연스럽게 연동할 수 있습니다.

```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script>
  let { data } = $props();
</script>

<main>
  <h1>대시보드</h1>
  <section class="main-card">
    <p>메인 정보: {data.mainData.summary}</p>
  </section>

  <section class="stats-card">
    <h3>느린 비동기 통계 정보</h3>
    
    <!-- streamedStats 프로미스 객체의 상태에 따라 화면을 분기 렌더링합니다. -->
    {#await data.streamedStats}
      <!-- 1. 데이터가 완전히 도착하기 전에 보여줄 스켈레톤/로딩 UI -->
      <div class="skeleton">실시간 통계 데이터를 불러오는 중... ⏳</div>
    {:then stats}
      <!-- 2. 백그라운드에서 조회가 완료되어 도착한 시점의 화면 -->
      <div class="result">
        <p>전체 방문자수: {stats.visitor_count}</p>
        <p>오늘의 매출: {stats.sales_revenue}원</p>
      </div>
    {:catch error}
      <!-- 3. 비동기 조회 도중 오류 발생 시 -->
      <p class="error">통계를 불러오는 데 실패했습니다: {error.message}</p>
    {/await}
  </section>
</main>
```

이 방식을 사용하면 사용자는 메인 요약을 먼저 보고, 느린 통계 영역만 로딩 상태로 남겨둘 수 있습니다. 모든 데이터를 기다렸다가 한 번에 화면을 보여주는 방식보다 체감 대기 시간이 줄어듭니다.

---

## 3. Preload

사용자는 링크를 클릭하기 전에 마우스를 올리거나 터치를 시작하는 경우가 많습니다. SvelteKit은 이 시점에 페이지 코드와 `load` 데이터를 미리 가져오는 **Preload** 기능을 제공합니다.

### 3.1 사용법 및 원리

라우터 태그 영역이나 개별 링크에 `data-sveltekit-preload-data` 속성을 추가해 주기만 하면 끝납니다.

```svelte
<!-- 네비게이션 영역 전체에 프리로드 규칙 적용 -->
<nav data-sveltekit-preload-data="hover">
  <a href="/">홈</a>
  <!-- 사용자가 이 링크 위에 마우스를 0.2초간 Hover하면, 
       클릭하기 전에 posts/123의 +page.js 파일과 load() 함수가
       백그라운드 네트워크에서 미리 조용히 실행됩니다. -->
  <a href="/posts/123">인기 포스트 읽기</a>
</nav>
```

사용자가 링크를 클릭하는 순간 이미 필요한 코드와 데이터가 준비되어 있다면, 페이지 전환이 더 빠르게 느껴집니다.

### 3.2 설정값 옵션 종류

* **`"hover"`**: 마우스를 갖다 대거나 모바일에서 탭 터치 시작(touchstart) 시점에 로드합니다.
* **`"tap"`**: 실제로 클릭을 떼기 직전(mousedown/touchstart) 시점에 즉시 요청을 보냅니다. 대역폭 낭비가 가장 적습니다.
* **`"off"`**: 해당 링크는 자동 프리로드 대상에서 명시적으로 제외합니다.

> [!WARNING]
> **프리로드(Preload) 설정 시 유의사항 및 서버 부하 위험**
> 모든 링크에 무조건 `data-sveltekit-preload-data="hover"`를 걸어두면 사용자가 화면 구석구석 마우스를 굴릴 때마다 서버에 무의미한 DB 조회 쿼리가 수십 개씩 연달아 쏟아지게 됩니다. 
> 데이터가 수시로 갱신되어 조회가 무겁거나, 요금 부과가 심한 외부 타사 API 연동 링크에는 프리로드를 끄거나 `"tap"`으로 낮춰서 대역폭과 서버 리소스를 보호해야 합니다.

---

## 4. Prerendering

자주 변경되지 않는 서비스 소개 페이지, 약관 등은 사용자가 접속할 때마다 DB에서 데이터를 긁어와 화면을 렌더링(SSR)할 필요가 전혀 없습니다. `prerender` 설정을 통해 빌드 시점에 static HTML로 완성해 두면 최상의 캐싱 효율과 속도를 누릴 수 있습니다.

```javascript
// src/routes/terms/+page.js
// 빌드 시점에 정적 파일로 생성되도록 지정합니다.
export const prerender = true;
```

---

## 요약

1. **`load` 함수의 결합**: `+page.server.js`와 `+page.js`를 이용해 서버 전용 및 범용 비동기 데이터 쿼리를 컴포넌트(`data` props)에 매핑합니다.
2. **API 스트리밍**: 무거운 연산이나 외부 호출은 Promise를 다이렉트로 던져서 동기식 페이지 렌더링 블로킹을 우회하고, Svelte의 `{#await}` 블록으로 조율합니다.
3. **호버 프리로드**: `data-sveltekit-preload-data="hover"` 지시자로 마우스 오버 시점에 자바스크립트 코드와 데이터를 선제 로드하여 클릭 즉시 화면을 띄우는 UX를 구축합니다.
4. **정적 빌드**: 변경이 거의 없는 문서는 `prerender = true` 설정을 걸어 캐싱 최적화된 static 파일로 배포하여 부하를 경감합니다.
