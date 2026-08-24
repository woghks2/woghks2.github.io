---
title: "6. Snippets과 컴포넌트 설계"
description: Snippets({#snippet}) 문법과 컴포넌트 설계"
date: "2025-05-22"
hashtags: ["Svelte", "Snippets", "ComponentDesign"]
skills: ["Svelte", "TypeScript"]
status: "published"
---

# 6. Snippets과 컴포넌트 설계

웹 서비스를 개발하다 보면 구조는 같지만 내부 내용은 상황에 따라 달라지는 공통 컴포넌트를 자주 만들게 됩니다. 카드, 모달, 리스트, 테이블 같은 컴포넌트가 대표적인 예입니다.

Svelte 5는 기존 버전(v3, v4)에서 자식 컴포넌트에 마크업 조각을 주입할 때 사용하던 **슬롯(`<slot>`)** 대신 **Snippets(스니펫)** 문법을 권장합니다. 슬롯은 여전히 동작하지만, Svelte 5에서는 deprecated로 분류됩니다.

이번 글에서는 기존 슬롯의 아쉬웠던 점과 Svelte 5의 **`{#snippet}`**, **`{@render}`** 문법을 이용한 컴포넌트 설계 방식을 정리해 보겠습니다.

---

## 1. 슬롯(`<slot>`) 문법의 한계

Svelte 4 이하에서는 자식 컴포넌트에 콘텐츠 영역을 흘려주기 위해 `<slot />` 태그를 썼습니다. 여러 영역에 다른 마크업을 끼워 넣으려면 이름을 붙인 명명된 슬롯(`<slot name="header" />`)을 써야 했고, 자식 컴포넌트 안의 데이터를 부모 템플릿으로 다시 끌어 올려 쓰려면 `let:` 지시자(Scoped Slots)라는 까다롭고 가독성 낮은 특수 문법을 강제해야 했습니다.

```svelte
<!-- v4 방식의 복잡한 Scoped Slot 문법 예시 -->
<List items={users}>
  <!-- 데이터 바인딩 관계를 태그 속성단에서 let:으로 억지로 뚫어 썼음 -->
  <div slot="item" let:item={user}>
    <p>이름: {user.name}</p>
  </div>
</List>
```

> [!NOTE]
> **슬롯(`<slot>`)에서 스니펫(Snippet)으로의 전환이 가져다주는 큰 이점**
> Svelte 4 이하에서는 자식 데이터를 부모 템플릿으로 끌어올리기 위해 `let:item={user}`와 같은 특수 컴파일러 지시자를 HTML 태그 속성에 강제해야 했습니다. 이는 정적 타입 분석 흐름을 차단하고 템플릿의 가독성을 저해했습니다.
>
> Svelte 5의 **Snippets**는 일반적인 자바스크립트/타입스크립트 함수처럼 인자를 받아 마크업을 그리는 **"마크업 렌더러 함수"**에 가깝습니다. 이 구조는 명명된 슬롯이나 scoped slot보다 데이터 흐름을 읽기 쉽고, TypeScript와 함께 쓰기도 좋습니다.

---

## 2. Snippets의 선언과 렌더링 기초

* **`{#snippet name(param)}`**: 마크업 조각 템플릿을 정의합니다.
* **`{@render name(value)}`**: 정의된 마크업 조각을 실제 브라우저 DOM에 그립니다.

```svelte
<!-- 단순 컴포넌트 내에서의 재사용 Snippet 예시 -->
<script>
  let userList = $state([
    { name: "김철수", role: "어드민" },
    { name: "이영희", role: "일반유저" }
  ]);
</script>

<!-- 1. 마크업 조각(Snippet) 정의 -->
{#snippet userBadge(user)}
  <div class="badge">
    <strong>{user.name}</strong> 
    <span class="role">{user.role}</span>
  </div>
{/snippet}

<main>
  <h3>회원 정보</h3>
  <ul>
    {#each userList as user}
      <li>
        <!-- 2. 매개변수를 담아 정의된 렌더러 호출 -->
        {@render userBadge(user)}
      </li>
    {/each}
  </ul>
</main>

<style>
  .badge { padding: 8px; border: 1px solid #ccc; margin: 4px 0; }
  .role { color: #888; font-size: 0.8rem; }
</style>
```

한 컴포넌트 파일 안에서 반복되는 마크업을 함수처럼 분리할 수 있어 컴포넌트 내부 구조가 단순해집니다.

---

## 3. 자식에게 Snippet을 Props로 전달하는 컴포넌트 설계

Snippets의 장점은 공통 디자인 시스템 컴포넌트를 설계할 때 잘 드러납니다. 부모는 자식 컴포넌트의 props로 일반 데이터뿐만 아니라, **정의된 snippet 템플릿 조각 자체를 함수 인자처럼 전달**할 수 있습니다.

### 3.1 자식 공통 컴포넌트 설계 (List)

```svelte
<!-- src/lib/components/List.svelte (자식 컴포넌트) -->
<script>
  // 부모로부터 목록 데이터(items)와
  // 개별 행을 그릴 스니펫 템플릿(rowTemplate)을 Props로 수신합니다.
  let { items, rowTemplate } = $props();
</script>

<div class="list-wrapper">
  {#each items as item}
    <div class="list-row">
      <!-- 부모가 건네준 템플릿 조각에 실제 루프 데이터를 실어 렌더링 -->
      {@render rowTemplate(item)}
    </div>
  {/each}
</div>
```

### 3.2 부모 컴포넌트에서의 사용

```svelte
<!-- src/routes/+page.svelte (부모 컴포넌트) -->
<script>
  import List from '$lib/components/List.svelte';
  
  let books = $state([
    { title: "Svelte 5 가이드", author: "리치 해리스" },
    { title: "FastAPI 비동기 설계", author: "안티그래비티" }
  ]);
</script>

<!-- 1. 자식에게 꼽아줄 도메인 특화 마크업 스니펫 선언 -->
{#snippet bookRow(book)}
  <div class="book-item">
    <h4>{book.title}</h4>
    <p>저자: {book.author}</p>
  </div>
{/snippet}

<!-- 2. Props 매핑을 통해 데이터와 마크업 조각을 통째로 주입 -->
<List items={books} rowTemplate={bookRow} />
```

이 방식을 사용하면 `List.svelte` 자식 컴포넌트는 목록의 외형과 반복 구조를 책임지고, 개별 아이템의 표현 방식은 부모가 `bookRow` snippet으로 결정할 수 있습니다. 구조와 상세 표현을 분리하기 좋은 패턴입니다.

---

## 4. 암묵적 자식 스니펫 (`children`)

컴포넌트 호출 시 내부에 감싸서 넣는 일반 콘텐츠 마크업 영역은 자식 컴포넌트 내부에서 특별한 예약어인 **`children`** 이라는 이름의 스니펫 Props로 자동 주입되어 처리됩니다.

```svelte
<!-- src/lib/components/Card.svelte (자식) -->
<script>
  // 컴포넌트 태그 사이에 들어오는 모든 마크업은 children 스니펫으로 자동 바인딩
  let { children } = $props();
</script>

<div class="card-frame">
  <!-- 자식 렌더러 실행 -->
  {#if children}
    {@render children()}
  {/if}
</div>
```

```svelte
<!-- 부모 호출부 -->
<Card>
  <!-- 태그 사이에 콘텐츠를 바로 적으면 children으로 쏙 들어갑니다. -->
  <h4>공통 카드 제목</h4>
  <p>공통 본문 내용입니다.</p>
</Card>
```

---

## 요약

1. **슬롯의 교체**: Svelte 5는 구조가 장황하고 가독성이 떨어졌던 명명된 슬롯 및 Scoped Slot 대신 직관적인 Snippets 문법을 표준으로 내세웁니다.
2. **함수형 렌더링**: `{#snippet}`은 데이터를 아규먼트로 받아 마크업 조각으로 반환하는 일종의 템플릿 렌더러 함수처럼 활용됩니다.
3. **Props 결합 아키텍처**: 자식 컴포넌트에 스니펫 자체를 인자로 전달하여 자식 단에서 루프를 돌려 그리는 고성능 공통 디자인 시스템 컴포넌트를 설계할 수 있습니다.
4. **`children` 예약어**: 자식이 태그 사이에 작성된 기본 템플릿을 받을 때 자동 주입되는 암묵적 스니펫 파라미터입니다.
