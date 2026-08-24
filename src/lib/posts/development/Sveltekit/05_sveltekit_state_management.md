---
title: "5. Svelte 상태 관리와 Context API"
description: "상태 공유 방식과 Context API 설계 기법을 정리합니다."
date: "2025-05-19"
hashtags: ["Svelte", "StateManagement", "ContextAPI", "Reactivity"]
skills: ["Svelte", "TypeScript"]
status: "published"
---

# 5. Svelte 5 상태 관리와 Context API

프로젝트가 커질수록 여러 컴포넌트가 공유하는 공통 상태를 어떻게 다룰지가 중요해집니다. 로그인한 유저 정보, 테마, 필터 조건, UI 패널 상태 등이 대표적인 예입니다.

Svelte 5에서도 기존 `writable/readable stores`는 사용할 수 있습니다. 다만 Runes가 도입되면서, 일반 `.svelte.ts` 파일 안에서 `$state`를 활용해 상태 모듈을 구성하는 방식도 자연스러운 선택지가 되었습니다.

특히 SvelteKit처럼 서버 사이드 렌더링(SSR)이 가능한 환경에서는 전역 모듈 상태를 무심코 공유하면 요청 간 **상태 오염(State Pollution)**이 발생할 수 있습니다. 이번 글에서는 Runes 기반 상태 모듈과 Context API를 결합해 상태를 안전하게 격리하는 방법을 정리해 보겠습니다.

---

## 1. 기존 Writable Store와 Runes 상태

Svelte 4 이하에서는 상태 공유를 위해 `svelte/store` 모듈의 `writable` 함수를 쓰고, 컴포넌트 내부에서 달러 기호(`$store`)를 사용해 반응성 구독을 트리거했습니다.

```javascript
// v4 스타일 전역 스토어
import { writable } from 'svelte/store';
export const countStore = writable(0);
```

이 방식은 다음과 같은 한계가 있었습니다.

* `$countStore`처럼 달러 기호를 붙여 써야 하는 특수 컴파일러 규격에 묶여 있었습니다.
* 일반 자바스크립트/타입스크립트 함수 내부에서 스토어 데이터를 읽거나 쓰려면 수동으로 `subscribe` 하고 반드시 `unsubscribe`를 해제해 주지 않으면 메모리 누수(Memory Leak)가 발생하는 번거로움이 있었습니다.

Svelte 5에서는 `$state` 룬을 컴포넌트 내부뿐 아니라 `.svelte.js`, `.svelte.ts` 파일에서도 사용할 수 있습니다. 이 덕분에 간단한 전역 UI 상태나 도메인 상태는 별도 store API 없이도 상태 모듈로 구성할 수 있습니다.

---

## 2. Svelte 5의 상태 모듈 디자인

Svelte 5에서는 클래스나 팩토리 함수를 활용해 상태와 변경 메서드를 함께 묶을 수 있습니다. 아래는 클래스 기반으로 카운터 상태를 캡슐화한 예시입니다.

```typescript
// src/lib/stores/counter.svelte.ts
// .svelte.ts 확장자는 이 파일이 내부에 반응성 룬($state 등)을 품고 있음을 명시합니다.

class CounterStore {
    // 1. 내부 반응성 상태 캡슐화
    #count = $state(0);
    
    // 2. 파생 상태 선언 (읽기 전용 Getter)
    get value() {
        return this.#count;
    }
    
    get double() {
        return this.#count * 2;
    }
    
    // 3. 상태 변경 액션 정의
    increment() {
        this.#count++;
    }
    
    decrement() {
        this.#count--;
    }
    
    reset() {
        this.#count = 0;
    }
}

// 싱글톤 인스턴스 전역 내보내기 (클라이언트 전용 앱일 경우 유효)
export const counterStore = new CounterStore();
```

컴포넌트 단에서는 달러 기호(`$`) 구독 매커니즘 없이 일반 객체를 조회하듯이 다이렉트로 가져다 씁니다.

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { counterStore } from '$lib/stores/counter.svelte';
</script>

<p>카운트: {counterStore.value}</p>
<p>2배수: {counterStore.double}</p>

<button onclick={() => counterStore.increment()}>증가</button>
<button onclick={() => counterStore.reset()}>리셋</button>
```

수동 구독과 구독 해제 코드를 줄이면서, 상태와 변경 메서드를 한곳에 모아둘 수 있습니다.

---

## 3. SSR 환경에서의 전역 공유 문제 (상태 오염)

> [!WARNING]
> **SSR 환경에서의 전역 공유 문제 (상태 오염 / State Pollution)**
> 위 예제처럼 클래스를 인스턴스화하여 `export const store = new Store()`로 직접 내보내는 방식은 싱글톤 상태로 동작합니다. 클라이언트 전용 SPA라면 문제가 작지만, SSR 서버에서는 주의해야 합니다.
>
> 서버 사이드 렌더링이 동작하는 SvelteKit 환경에서는 같은 서버 프로세스가 여러 사용자의 요청을 처리할 수 있습니다.
>
> ```text
> [ 모든 유저의 요청이 거쳐 가는 단일 Node.js / Vercel 서버 프로세스 ]
>     │
>     ├─ 유저 A 요청 ──> new CounterStore() 인스턴스 참조 (값: 10으로 변경)
>     │
>     └─ 유저 B 요청 ──> 동일한 new CounterStore() 인스턴스 공유 (값: 10 노출!)
> ```
>
> 서버에 상주하는 글로벌 모듈 상태를 여러 요청이 공유하면, 유저 A의 요청에서 바뀐 값이 유저 B의 SSR 결과에 섞일 수 있습니다.
>
> 이를 막기 위한 기본 규칙은 **요청별로 달라지는 상태를 전역 싱글톤 모듈에 보관하지 않는 것**입니다. 필요한 경우 컴포넌트 트리 단위로 인스턴스를 만들고 Context API로 전달합니다.

---

## 4. Context API를 결합한 상태 격리

Context API인 `setContext`와 `getContext`를 활용하면, 부모 컴포넌트 하위 트리 안에서만 접근 가능한 상태 인스턴스를 전달할 수 있습니다.

```typescript
// src/lib/stores/auth.svelte.ts
import { getContext, setContext } from 'svelte';

export class AuthStore {
    user = $state({ username: 'guest', is_logged_in: false });

    login(username: string) {
        this.user = { username, is_logged_in: true };
    }

    logout() {
        this.user = { username: 'guest', is_logged_in: false };
    }
}

// 안전한 주입을 위한 심볼 키 지정
const AUTH_STORE_KEY = Symbol('AUTH_STORE');

// 컴포넌트 트리마다 개별적으로 할당하기 위한 컨텍스트 초기화 메서드
export function initAuthStore() {
    const store = new AuthStore();
    setContext(AUTH_STORE_KEY, store);
    return store;
}

export function useAuthStore() {
    return getContext<AuthStore>(AUTH_STORE_KEY);
}
```

상위 공통 레이아웃 컴포넌트에서 초기화(init)를 수행하여 하위 컴포넌트들에게 Context로 상태 인스턴스를 흘려보냅니다.

```svelte
<!-- src/routes/+layout.svelte (모든 유저 요청 단위로 매번 재실행됨) -->
<script>
  import { initAuthStore } from '$lib/stores/auth.svelte';
  let { children } = $props();
  
  // 레이아웃 인스턴스마다 새 AuthStore 인스턴스를 만들고 context 트리에 주입
  let auth = initAuthStore();
</script>

<header>
  {#if auth.user.is_logged_in}
    <span>안녕하세요, {auth.user.username}님!</span>
    <button onclick={() => auth.logout()}>로그아웃</button>
  {:else}
    <button onclick={() => auth.login('admin')}>임시 로그인</button>
  {/if}
</header>

{@render children()}
```

하위 페이지나 자식 컴포넌트들은 공유 모듈을 직접 import 하지 않고, `useAuthStore` 헬퍼를 통해 부모 컨텍스트 영역에 격리되어 안전하게 뜬 해당 세션의 스토어를 조회해 사용합니다.

```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script>
  import { useAuthStore } from '$lib/stores/auth.svelte';
  
  // 안전하게 주입받은 개별 세션의 인증 상태 참조
  let auth = useAuthStore();
</script>

<main>
  <h3>개인 정보 대시보드</h3>
  <p>회원 로그인 상태: {auth.user.is_logged_in ? "로그인 완료" : "비로그인 상태"}</p>
</main>
```

---

## 요약

1. **룬 상태 스토어**: Svelte 5는 Writable Store 없이도 일반 클래스 변수에 `$state`를 감싸는 구조적 캡슐화로 스토어 역할을 완전히 완수합니다.
2. **달러 기호($) 축출**: 복잡했던 수동 구독 체계와 템플릿 제약이 사라져 일반 자바스크립트 스크립트 내부에서도 매우 자유롭게 반응 상태를 변조할 수 있습니다.
3. **상태 오염(State Pollution) 방지**: 서버 프로세스를 공유하는 SvelteKit의 SSR 특성상 싱글톤 전역 인스턴스 export는 보안 유출을 유발하므로 절대 피해야 합니다.
4. **Context를 통한 격리**: HTTP Request마다 새 스토어를 인스턴스화하고 `setContext` / `getContext`로 하위 컴포넌트 트리에 바인딩하여 유저 간 격리성을 안전하게 확보합니다.
