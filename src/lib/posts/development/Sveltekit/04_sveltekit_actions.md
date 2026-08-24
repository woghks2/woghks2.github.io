---
title: "4. Form Actions & API 엔드포인트"
description: "+server.js API 라우팅과 Form Actions 기반 폼 처리 패턴"
date: "2025-05-18"
hashtags: ["SvelteKit", "FormActions", "APIRoute"]
skills: ["Svelte", "TypeScript"]
status: "published"
---

# 4. Form Actions & API 엔드포인트

React나 Vue 등으로 싱글 페이지 애플리케이션(SPA)을 개발하다 보면, 폼 제출을 처리하기 위해 상태 바인딩, `event.preventDefault()`, `fetch/axios` 요청, 에러 상태 관리를 직접 작성하는 경우가 많습니다.

SvelteKit은 이 문제를 **HTML Form**과 서버 액션 중심으로 풀어냅니다. 자바스크립트가 없어도 동작하는 기본 폼 제출 흐름을 유지하고, 필요할 때 `use:enhance`로 SPA처럼 부드럽게 개선할 수 있습니다.

이번 글에서는 SvelteKit의 API 엔드포인트(`+server.js`) 설계법과 Form Actions, 그리고 **점진적 향상(Progressive Enhancement)** 흐름을 정리해 보겠습니다.

---

## 1. API 엔드포인트 설계 (`+server.js`)

SvelteKit은 단순히 UI를 그리는 수준을 넘어, 완전한 REST API 백엔드 서버의 역할을 수행할 수 있습니다. 폴더 안에 `+server.js` 파일을 만들고 HTTP Method 이름(GET, POST, PATCH 등)을 대문자로 갖는 함수를 내보내기만 하면 즉시 API 라우터가 개설됩니다.

```javascript
// src/routes/api/posts/+server.js
import { json } from '@sveltejs/kit';

// 1. GET 요청 처리 (목록 조회 API)
export async function GET({ url }) {
    const limit = url.searchParams.get('limit') ?? '10';
    
    const dummy_posts = [
        { id: 1, title: "Svelte 5 가이드" },
        { id: 2, title: "SvelteKit 폼 액션 활용" }
    ];
    
    // json() 헬퍼 함수를 통해 자동으로 올바른 Content-Type 헤더가 실린 JSON 응답을 반환합니다.
    return json(dummy_posts.slice(0, parseInt(limit)));
}

// 2. POST 요청 처리 (신규 등록 API)
export async function POST({ request }) {
    // 클라이언트가 실어 보낸 JSON 바디 파싱
    const { title, content } = await request.json();
    
    // 비즈니스 로직 및 DB 저장 수행 (가상)
    const new_post = { id: 42, title, content };
    
    return json(new_post, { status: 201 });
}
```

이 API는 프런트엔드 컴포넌트뿐만 아니라 외부 클라이언트도 호출할 수 있는 일반 HTTP 엔드포인트(`/api/posts`)가 됩니다.

---

## 2. Form Actions

일반적인 프레임워크에서는 폼을 보내려면 다음과 같이 코드가 복잡해집니다.

1. `let title = ...`, `let content = ...` 상태 변수 선언 및 데이터 양방향 바인딩
2. 제출 핸들러 함수 선언 및 `event.preventDefault()` 명시
3. 백엔드 주소로 비동기 요청을 쏘는 API 호출 로직 작성

SvelteKit의 **Form Actions**는 브라우저의 기본 폼 제출 사양을 활용합니다.

### 2.1 서버 액션 정의

폼을 수신하여 실제 데이터 작업을 수행할 백엔드 액션을 정의합니다.

```javascript
// src/routes/contact/+page.server.js
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
    // 폼에서 전송될 default POST 액션 선언
    default: async ({ request }) => {
        const formData = await request.formData();
        
        // 폼 필드 이름(name)으로 데이터 추출
        const email = formData.get('email');
        const message = formData.get('message');
        
        // 기본 유효성 검사 수행
        if (!email || !email.includes('@')) {
            // fail() 헬퍼를 통해 상태 코드 400과 함께 잘못된 에러 데이터를 화면으로 돌려보냅니다.
            return fail(400, {
                email,
                message,
                error: '유효한 이메일 주소를 입력해 주세요.'
            });
        }
        
        // 실제 메일 전송 또는 DB 기록 (가상)
        console.log(`Mail sent from ${email}: ${message}`);
        
        // 성공 시 결과를 그대로 반환
        return {
            success: true
        };
    }
};
```

### 2.2 클라이언트 폼 구현

`<form>` 태그에 어떠한 자바스크립트 바인딩 없이, 표준 HTML 사양대로 작성합니다.

```svelte
<!-- src/routes/contact/+page.svelte -->
<script>
  // 서버 액션이 리턴해 준 성공 결과 및 에러 정보는 'form' props로 실시간 자동 주입됩니다.
  let { form } = $props();
</script>

<main>
  <h1>문의하기</h1>

  {#if form?.success}
    <p class="success-alert">문의가 정상적으로 접수되었습니다. 감사합니다! 🎉</p>
  {:else}
    <form method="POST">
      <label>
        이메일:
        <!-- 에러가 나서 튕겨 돌아왔을 때, 사용자가 썼던 값을 복원(preserve)해 줍니다. -->
        <input type="email" name="email" value={form?.email ?? ''} />
      </label>
      
      {#if form?.error}
        <p class="error-text">{form.error}</p>
      {/if}

      <label>
        문의 내용:
        <textarea name="message" value={form?.message ?? ''}></textarea>
      </label>

      <button type="submit">제출하기</button>
    </form>
  {/if}
</main>
```

---

## 3. 점진적 향상 (Progressive Enhancement)

> [!NOTE]
> **점진적 향상(Progressive Enhancement)과 use:enhance**
> 위에서 작성한 폼의 중요한 특징은 **자바스크립트가 없어도 동작한다**는 점입니다. 초기 자바스크립트 번들이 로딩 중이거나 네트워크 문제로 스크립트 다운로드가 실패해도, 브라우저의 HTML 폼 규격에 따라 서버에 요청을 보낼 수 있습니다.
>
> 자바스크립트가 정상적으로 활성화되었을 때는 화면 깜빡임 없는 단일 페이지 애플리케이션(SPA)의 AJAX 비동기 통신 형태로 전송 방식을 부드럽게 스위칭해주는데, SvelteKit은 폼 태그에 **`use:enhance`** 지시자 딱 한 줄을 선언해 주는 것만으로 이를 실현합니다.

```svelte
<!-- use:enhance로 비동기 전송 흐름을 적용 -->
<form method="POST" use:enhance>
  ...
</form>
```

### `use:enhance`가 해주는 일

* 자바스크립트가 동작 가능할 때는 기본 submit 대신 백그라운드 fetch로 폼을 전송합니다.
* 서버에서 `fail`이 반환되면 입력값과 오류 상태를 페이지의 `form` prop으로 돌려받아 화면에 표시할 수 있습니다.
* 자바스크립트가 동작하지 않을 때는 일반 HTML 폼 POST 방식으로 처리됩니다.

---

## 4. 명명된 액션 (Named Actions)

하나의 페이지 안에 "문의하기", "구독 신청" 등 서로 다른 처리를 하는 여러 개의 폼이 병렬로 나란히 들어가야 할 때가 있습니다. 이때는 **명명된 액션(Named Actions)**을 선언해 구분합니다.

```javascript
// src/routes/newsletter/+page.server.js
export const actions = {
    subscribe: async ({ request }) => {
        // 구독 처리 로직...
        return { success: true };
    },
    unsubscribe: async ({ request }) => {
        // 구독 취소 로직...
        return { success: true };
    }
};
```

폼 태그의 `action` 주소 값 뒤에 `?/액션이름`을 접미사로 붙여 해당 타깃 서버 액션을 강제 지정합니다.

```svelte
<!-- 구독 신청 폼 -->
<form method="POST" action="?/subscribe" use:enhance>
  <button type="submit">뉴스레터 구독</button>
</form>

<!-- 구독 취소 폼 -->
<form method="POST" action="?/unsubscribe" use:enhance>
  <button type="submit">뉴스레터 해지</button>
</form>
```

---

## 요약

1. **API 라우팅**: `+server.js`에 대문자 HTTP 메서드를 정의하고 `json()` 헬퍼를 활용해 독립적인 마이크로 REST API를 손쉽게 구축합니다.
2. **Form Actions의 가치**: 별도의 상태 바인딩과 fetch 코드 없이 HTML 표준 명세의 폼과 백엔드 핸들러를 직통으로 연결합니다.
3. **fail() 유효성 피드백**: 유효성 검사 실패 시 `fail` 함수로 400 에러 상태 및 입력 보존 데이터를 폼 컴포넌트(`form` prop)에 돌려줍니다.
4. **점진적 향상 (`use:enhance`)**: 지시자 추가만으로 논-자바스크립트 호환 모드와 SPA 비동기 통신 모드를 영리하게 자동 전환하여 안정성을 높입니다.
5. **이름 있는 액션**: 주소창 뒤의 `?/action_name` 명세를 통해 단일 페이지 내에서 여러 독립적인 폼 액션을 조율합니다.
