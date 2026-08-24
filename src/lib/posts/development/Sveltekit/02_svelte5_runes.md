---
title: "2. Svelte 5 Runes"
description: "Runes($state, $derived, $effect)와 Props"
date: "2025-05-14"
hashtags: ["Svelte", "Runes", "Reactivity", "Reactions"]
skills: ["Svelte", "TypeScript"]
status: "published"
---

# 2. Svelte 5 Runes

Svelte 5에서 가장 큰 변화는 반응성 문법입니다.

이전 버전(v3, v4)은 컴파일 타임에 `let count = 0` 과 같은 파이썬/JS 일반 변수 선언이나 `$:` 라벨을 분석해 반응성을 주입했습니다. 이 방식은 간단한 싱글 컴포넌트에서는 훌륭했으나, 복잡한 대규모 객체 구조를 다루거나 비즈니스 로직을 일반 자바스크립트/타입스크립트(`.ts`) 파일로 추출하여 여러 컴포넌트에서 재사용하기에는 많은 한계가 있었습니다.

이를 해결하기 위해 Svelte 5에서 도입된 문법이 **Runes(룬)**입니다. 이번 글에서는 핵심 룬인 **`$state`**, **`$derived`**, **`$effect`**와 부모-자식 데이터 흐름을 다루는 **`$props`**, **`$bindable`**을 정리해 보겠습니다.

---

## 1. `$state`

`$state`는 특정 값을 반응성 상태로 선언하는 룬입니다. 이 값을 읽는 화면이나 파생 값은 상태 변경에 맞춰 다시 계산되거나 갱신됩니다.

```svelte
<script>
  // 단순 원시 타입 상태
  let count = $state(0);
  
  // 객체 상태 선언
  let user = $state({
    name: "홍길동",
    age: 20
  });

  // 배열 상태 선언
  let items = $state([1, 2, 3]);
</script>

<!-- 상태 변경 트리거 -->
<button onclick={() => count++}>카운터: {count}</button>

<!-- 객체 속성을 직접 수정해도 반응성이 전파됩니다. -->
<button onclick={() => user.age++}>{user.name}의 나이: {user.age}</button>

<!-- v4처럼 items = [...items, 4] 와 같이 강제 재할당을 할 필요 없이 push가 즉각 작동합니다. -->
<button onclick={() => items.push(items.length + 1)}>아이템 추가: {items.join(', ')}</button>
```

> [!NOTE]
> **Svelte 4 대비 `$state`가 가지는 장점**
> 기존 Svelte 4에서는 배열이나 객체 내부 값을 수정한 뒤 변수 자체를 다시 할당해야 반응성이 명확하게 동작하는 경우가 많았습니다. Svelte 5의 `$state`는 객체와 배열을 깊은 반응성 상태로 다룰 수 있어 `push`, `pop`, 속성 변경 같은 조작을 더 자연스럽게 표현할 수 있습니다.

---

## 2. `$derived`

`$derived`는 다른 반응성 값을 참조하여 자동으로 계산되는 **파생 상태**를 만듭니다. React의 `useMemo`나 Vue의 `computed`와 비슷한 역할입니다.

```svelte
<script>
  let count = $state(2);
  
  // 1. 단일 파생
  let double = $derived(count * 2);
  
  // 2. 복합 조건 파생
  let status = $derived(count > 10 ? "충분함" : "부족함");
</script>

<p>원본: {count}</p>
<p>2배수: {double}</p>
<p>상태: {status}</p>

<button onclick={() => count += 5}>증가</button>
```

* `$derived`로 선언된 값은 내부에서 읽은 반응성 값이 바뀔 때 다시 계산됩니다.
* 변하지 않은 상태에서 참조될 경우 이전 계산값을 캐싱(Caching)하여 돌려주므로 성능 낭비를 막아 줍니다.
* 의존성 관계를 배열로 직접 입력하지 않아도, 계산식 안에서 읽은 반응성 값이 의존성으로 추적됩니다.

---

## 3. `$effect`

`$effect`는 룬 상태가 변경되어 화면 렌더링이 완전히 반영된 직후, 비동기로 호출될 **부수 효과(Side Effect)** 로직을 정의할 때 사용합니다. (React의 `useEffect`와 유사합니다).

```svelte
<script>
  let count = $state(0);
  
  // count 상태가 바뀔 때마다 자동으로 이펙트 함수가 실행됩니다.
  $effect(() => {
    console.log(`현재 저장된 카운트: ${count}`);
    
    // 정리(Clean-up) 함수 리턴 가능
    return () => {
      console.log("새로운 이펙트 실행 전 이전 상태 정리");
    };
  });
</script>

<button onclick={() => count++}>증가</button>
```

> [!WARNING]
> **`$effect` 사용 시 주의점 및 무한 루프 위험**
> * **자동 의존성 추적**: React처럼 이펙트 함수 끝에 `[count]` 같은 의존성 배열을 적어줄 필요가 없습니다. `$effect` 함수가 동기적으로 읽은 반응성 값들이 의존성으로 추적됩니다.
> * **관심사 제한**: `$effect` 내부에서 또 다른 `$state` 변수의 값을 무분별하게 변경하면 **무한 루프(Infinite Loop)**에 빠지기 쉬우므로, 렌더링된 이후의 단순 DOM 조작, 로컬 스토리지 보관, 혹은 외부 API로의 로그 수집 용도로만 제한적으로 활용하는 것이 좋습니다.

---

## 4. Props와 `$bindable`

부모 컴포넌트가 자식 컴포넌트에게 상태 데이터를 전달하거나 양방향 바인딩을 열어줄 때도 새로운 룬 문법이 적용됩니다.

### 4.1 `$props`를 통한 단방향 데이터 수신

Svelte 5는 구조분해 할당 형식의 **`$props()`** 구문으로 props를 받습니다.

```svelte
<!-- src/lib/components/PostCard.svelte (자식 컴포넌트) -->
<script>
  // 부모로부터 title과 default content 수신
  let { title, content = "본문이 비어 있습니다." } = $props();
</script>

<div class="card">
  <h3>{title}</h3>
  <p>{content}</p>
</div>
```

### 4.2 `$bindable`을 통한 양방향 데이터 바인딩

때로는 자식 컴포넌트 내부에서 수정한 값을 부모 컴포넌트의 원래 상태에도 동기화(양방향 바인딩)해야 할 때가 있습니다. (예: 입력 모달 팝업의 열림/닫힘 상태 공유). 이때는 자식 컴포넌트 단에서 변수에 **`$bindable()`**을 감싸 선언해 줍니다.

```svelte
<!-- src/lib/components/Modal.svelte (자식 컴포넌트) -->
<script>
  // 부모의 상태와 연결될 bindable 속성 선언
  let { isOpen = $bindable(false) } = $props();
</script>

{#if isOpen}
  <div class="modal">
    <p>레이어 팝업 본문</p>
    <button onclick={() => isOpen = false}>닫기</button>
  </div>
{/if}
```

부모 컴포넌트는 다음과 같이 `bind:` 지시자를 사용하여 자식의 상태와 부모의 상태를 일치시킵니다.

```svelte
<!-- src/routes/+page.svelte (부모 컴포넌트) -->
<script>
  import Modal from '$lib/components/Modal.svelte';
  let showModal = $state(false);
</script>

<button onclick={() => showModal = true}>모달 열기</button>

<!-- bind:속성명 문법을 사용해 연결 -->
<Modal bind:isOpen={showModal} />
```

---

## 요약

1. **`$state`**: 미세 반응성 객체를 선언하여, 강제 변수 재할당 없이 속성값 수정이나 배열 변조를 자동으로 감지합니다.
2. **`$derived`**: 다른 상태에 의존적인 계산식 결과를 캐싱하여 반환하는 읽기 전용 상태를 구성합니다.
3. **`$effect`**: 의존성 배열 입력 없이 상태 갱신 완료 직후 비동기로 실행될 부수 효과 코드를 수립합니다.
4. **`$props`**: 구조분해 할당 문법을 도입하여 부모로부터 전달받을 입력 인자를 직관적으로 식별합니다.
5. **`$bindable`**: 자식 컴포넌트에서 속성을 수정했을 때 부모 계층까지 상태를 거슬러 올라가 동기화하는 바인딩 통로를 개설합니다.
