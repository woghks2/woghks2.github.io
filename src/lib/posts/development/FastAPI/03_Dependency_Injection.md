---
title: "3. Dependency Injection"
description: "FastAPI의 DI, Request Scope 수명 주기, 백그라운드 태스크에서의 DB 세션"
date: "2025-12-24"
hashtags: ["FastAPI", "Dependency Injection", "BackgroundTask"]
skills: ["FastAPI", "Python", "Backend Architecture"]
status: "published"
---

# 3. Dependency Provider와 Dependency Injection

이번 글에서는 `Depends`를 활용하여 각 레이어의 의존성을 관리하는 방법, 수명 주기(Request/App Scope)에 대한 이해, 그리고 백그라운드 태스크(Background Tasks)와 엮였을 때 흔히 겪는 트랜잭션 수명 주기 장애의 원인과 해결책까지 다뤄보겠습니다.

---

## 1. FastAPI `Depends`와 DI

DI는 객체가 스스로 의존하는 객체를 직접 생성하는 것이 아니라, 외부에서 주입받아 사용하는 디자인 패턴입니다. 이를 통해 객체 간의 결합도를 낮추고 테스트 용이성을 극대화할 수 있습니다.

FastAPI는 프레임워크 자체에 강력한 DI 시스템인 `Depends`를 내장하고 있습니다. 

```python
# bad: 의존 객체를 직접 생성하고 결합하는 방식
async def create_post_endpoint(payload: PostCreatePayload):
    # 엔드포인트가 데이터베이스 세션 생성부터 레포지토리, 서비스 인스턴스화까지 책임짐
    async with async_session_maker() as session:
        repo = PostRepository(session)
        service = PostService(repo)
        return await service.create(payload)
```

위 코드는 다음과 같은 문제를 안고 있습니다.

*  엔드포인트 함수가 비즈니스 로직 외에 "객체를 어떻게 생성하고 조립하는가"라는 인프라적 관심사까지 너무 많이 알고 있습니다.

* 단위 테스트를 수행할 때 `PostService`나 `PostRepository`를 Mocking 하거나 Fake 객체로 갈아끼우기가 매우 어렵습니다.

FastAPI의 `Depends`를 사용하면 객체의 조립 흐름을 프레임워크에 위임할 수 있습니다.

```python
# good: Depends를 통한 의존성 주입
from fastapi import Depends, status

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostCreatePayload,
    use_case: CreatePostUseCase = Depends(get_create_post_use_case)
):
    return await use_case.execute(payload)
```

---

## 2. 계층형 아키텍처에서의 의존성 그래프

일반적인 웹 애플리케이션의 의존성 흐름은 다음과 같은 방향으로 흘러갑니다.

```text
Router (HTTP 엔드포인트)
  └── UseCase (단일 유스케이스 실행 흐름 제어)
        └── Service (비즈니스 도메인 규칙)
              └── Repository (데이터 접근 제어)
                    └── DB Session (인프라스트럭처)
```

FastAPI는 엔드포인트 매개변수에 선언된 `Depends`를 분석하여, 필요한 의존성들의 그래프를 역방향으로 탐색하면서 자동으로 객체를 조립해 줍니다. 

예를 들어 `get_create_post_use_case`가 실행되려면 `get_post_service`가 필요하고, 이는 다시 `get_post_repository`를 필요로 하며, 최종적으로 `get_db_session`을 필요로 합니다. FastAPI는 이 체인을 끝까지 추적해 단 한 번의 호출로 모든 레이어의 객체를 완벽히 조립한 뒤 엔드포인트에 전달합니다.

의존성을 조립하여 반환하는 함수들을 **Dependency Provider**라고 부릅니다.

### Repository Provider

DB 세션을 주입받아 Repository 인스턴스를 생성합니다.

```python
# app/domains/post/dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db_session
from app.domains.post.repository import PostRepository

def get_post_repository(
    session: AsyncSession = Depends(get_db_session)
) -> PostRepository:
    return PostRepository(session)
```

### Service Provider

Repository를 주입받아 비즈니스 로직을 담당하는 Service 인스턴스를 생성합니다.

```python
from app.domains.post.service import PostService

def get_post_service(
    post_repo: PostRepository = Depends(get_post_repository)
) -> PostService:
    return PostService(post_repo=post_repo)
```

### UseCase Provider

Service를 주입받아 단일 유스케이스(예: 게시글 작성)를 실행하는 UseCase 인스턴스를 생성합니다.

```python
from app.domains.post.use_cases import CreatePostUseCase

def get_create_post_use_case(
    post_service: PostService = Depends(get_post_service)
) -> CreatePostUseCase:
    return CreatePostUseCase(post_service=post_service)
```

---

## 3. 의존성 파일 분리

프로젝트가 조금만 커져도 하나의 `dependencies.py` 파일에 수십 개의 Provider 함수가 몰리게 됩니다. 이를 방지하기 위해 도메인 패키지 하위에 의존성 전용 구조를 구성하는 것이 좋습니다.

```text
app/
└── domains/
    └── post/
        ├── dependencies/
        │   ├── __init__.py
        │   ├── repositories.py
        │   ├── services.py
        │   └── use_cases.py
        ├── repository.py
        ├── service.py
        └── use_cases.py
```

### Re-export 패턴 (`__init__.py`)

의존성 파일들이 파편화되면 Router에서 가져다 쓸 때 임포트 경로가 복잡해집니다. `dependencies/__init__.py`에서 하위 모듈들의 Provider들을 통합하여 외부로 내보내주면 관리가 매우 편해집니다.

```python
# app/domains/post/dependencies/__init__.py
from app.domains.post.dependencies.use_cases import (
    get_create_post_use_case,
    get_delete_post_use_case,
)
from app.domains.post.dependencies.services import get_post_service
from app.domains.post.dependencies.repositories import get_post_repository

__all__ = [
    "get_create_post_use_case",
    "get_delete_post_use_case",
    "get_post_service",
    "get_post_repository",
]
```

이렇게 구성하면 Router 쪽에서는 내부의 구체적인 파일 구조를 몰라도 패키지 수준에서 깔끔하게 임포트할 수 있습니다.

```python
# app/domains/post/router.py
from app.domains.post.dependencies import get_create_post_use_case
```

---

## 4. Request Scope vs App Scope

의존성 주입 시 객체가 살아있는 기간인 Scope에 대한 이해는 매우 중요합니다.

| 분류 | 특징 | 예시 객체 |
| :--- | :--- | :--- |
| **Request Scope** | HTTP 요청이 들어올 때마다 생성되고, 응답이 나가면 소멸 및 정리됨 | `AsyncSession`, `Repository`, `Service` 등 |
| **App Scope** | 애플리케이션 시작(Startup) 시 생성되어 전역적으로 단 하나만 유지(Singleton)됨 | `httpx.AsyncClient`, `Redis`, `sessionmaker` 등 |

### Request Scope에서 App Scope 객체 참조하기

이전 1편 글에서 다뤘던 `lifespan` 환경의 `app.state`에 상주하는 전역 공유 자원들(예: HTTP Client)을 Request Scope의 Provider 안에서 사용해야 할 때가 있습니다. 이때는 FastAPI의 `Request` 객체를 주입받아 상태를 참조하면 됩니다.

```python
import httpx
from fastapi import Request

# 전역으로 생성된 HttpClient를 Request Scope Provider에서 반환
def get_external_api_client(request: Request) -> httpx.AsyncClient:
    # app.state에 저장된 싱글톤 인스턴스를 안전하게 꺼내 씀
    return request.app.state.http_client
```

---

## 5. 백그라운드 태스크와 DB 세션의 수명 주기

FastAPI 개발 시 가장 자주 발생하는 런타임 장애 중 하나는 `BackgroundTasks`를 실행할 때 DB 세션의 수명 주기를 잘못 다루어 발생하는 예외입니다.

### 장애 발생 패턴

아래 코드는 겉보기에는 아무 문제가 없어 보이지만, 실행 시점에 `sqlalchemy.exc.InterfaceError: connection already closed` 또는 `InvalidRequestError: Session is closed` 예외를 던지며 실패합니다.

```python
# app/domains/post/router.py
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db_session

router = APIRouter()

async def send_welcome_notification_task(db: AsyncSession, user_id: int):
    # ❌ 이미 HTTP 응답이 완료되어 닫혀버린 db 세션을 사용하려고 시도함!
    user = await db.get(User, user_id)
    await send_email(user.email)

@router.post("/users")
async def register_user(
    payload: UserRegisterPayload,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db_session)  # Request Scope DB 세션
):
    user = User.create(payload)
    db.add(user)
    await db.commit()  # 여기까지는 정상 작동
    
    # 백그라운드 태스크로 넘기면서 동일한 db 세션을 인자로 전달
    background_tasks.add_task(send_welcome_notification_task, db, user.id)
    return {"status": "ok"}
```

#### 원인 분석

1. `db: AsyncSession`은 `Depends(get_db_session)`을 통해 생성된 **Request Scope** 객체입니다.
2. FastAPI는 `register_user` 핸들러가 반환하고 HTTP 응답이 클라이언트에게 발송되는 즉시, 주입했던 의존성 그래프를 정리(Clean-up)합니다. 즉, `get_db_session` 내부의 `finally` 구문이나 컨텍스트 매니저가 실행되어 `db.close()`가 호출됩니다.
3. 백그라운드 태스크는 HTTP 응답이 나간 "이후"에 비동기로 실행됩니다. 이때 태스크 내부에서 이미 close되어 닫힌 연결 객체(`db`)를 통해 쿼리를 날리려 하므로 커넥션 종료 예외가 발생하는 것입니다.

### 올바른 해결책
백그라운드 태스크는 HTTP 요청의 생명주기와 완전히 독립되어 실행되므로, **스스로 새로운 DB 세션을 열고 수동으로 생명주기를 관리(Commit/Rollback/Close)해야 합니다.** 

이를 위해 애플리케이션 전역 범위(App Scope)에서 싱글톤으로 관리되는 세션 팩토리(sessionmaker)를 직접 주입받아 태스크 내부에서 컨텍스트 매니저(`async with`)를 사용해 독립적인 트랜잭션을 실행해야 합니다.

```python
# app/core/database.py
# 전역적으로 선언된 세션 팩토리 (App Scope)
async_session_factory = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

def get_db_session_factory():
    return async_session_factory
```

```python
# app/domains/post/router.py
from sqlalchemy.ext.asyncio import async_sessionmaker

# 올바른 백그라운드 태스크 구현
async def send_welcome_notification_task(
    session_factory: async_sessionmaker[AsyncSession], 
    user_id: int
):
    # HTTP 요청 생명주기와 상관없이 독립적인 세션을 생성하여 수동 관리
    async with session_factory() as session:
        async with session.begin(): # 트랜잭션 수동 시작
            user = await session.get(User, user_id)
            # 비즈니스 로직 수행...
            await send_email(user.email)
        # async with 블록을 벗어나면서 자동으로 commit/rollback 및 close 처리됨

@router.post("/users")
async def register_user(
    payload: UserRegisterPayload,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db_session),
    # 세션 자체가 아니라 세션을 만들어내는 '팩토리'를 주입받음
    session_factory: async_sessionmaker[AsyncSession] = Depends(get_db_session_factory)
):
    user = User.create(payload)
    db.add(user)
    await db.commit()
    
    # 백그라운드 태스크에는 세션 팩토리를 넘겨줌
    background_tasks.add_task(send_welcome_notification_task, session_factory, user.id)
    return {"status": "ok"}
```

---

## 6. Provider의 관심사 제약 (Do & Don't)

Dependency Provider는 의존성을 조립하는 인프라 레이어의 일부입니다. 따라서 작성할 때 명확한 경계 조건을 지켜야 디버깅하기 힘든 코드가 양산되는 것을 막을 수 있습니다.

### DO
- **객체 인스턴스화**: 의존 관계에 맞춰 객체를 올바르게 조립합니다.
- **설정 주입**: `Settings` 파일에서 읽어온 상수나 환경 변수들을 클래스 생성자에 바인딩합니다.
- **싱글톤 상태 조회**: `request.app.state` 등 전역 리소스풀에서 자원을 조회해 반환합니다.

### DON'T
- **비즈니스 로직 연산**: 데이터 검증, 도메인 계산 등 비즈니스 로직을 Provider 내부에서 처리하지 마세요.
- **수동 DB 트랜잭션 수행**: 단순 의존성 조립을 넘어서 직접 DB 데이터를 조작하거나 커밋하지 마세요 (단, 세션 열기/닫기 등 수명 주기 제어는 제외).
- **외부 통신**: 외부 API 호출이나 무거운 I/O 바인딩 로직을 Provider 안에서 호출하지 마세요.

---

## 7. Port 패턴 (Protocol)과의 결합

추상화 인터페이스를 의존하게 하고 실제 구현체는 DI Container단에서 주입해 주는 방식인 **Port 패턴**을 사용하면 APP의 유연성을 끌어올릴 수 있습니다.

Python에서는 `typing.Protocol`을 사용하여 Abstraction Class(ABC)보다 가볍게 구현할 수 있습니다.

```python
# app/domains/post/ports.py
from typing import Protocol, List
from app.domains.post.models import Post

class PostRepositoryPort(Protocol):
    async def get_by_id(self, post_id: int) -> Post | None:
        ...
    async def save(self, post: Post) -> Post:
        ...
```

```python
# app/domains/post/service.py
from app.domains.post.ports import PostRepositoryPort

class PostService:
    # Service 레이어는 구체적인 DB 연동 기술을 모른 채, 인터페이스 규격(Port)에만 의존함
    def __init__(self, post_repo: PostRepositoryPort):
        self.post_repo = post_repo
```

의존성을 조립해 주는 Provider 단에서 비로소 인터페이스(Port)에 대응하는 실제 구현체(SQLAlchemy Repository)를 연결합니다.

```python
# app/domains/post/dependencies.py
from app.domains.post.repository import SqlAlchemyPostRepository

def get_post_service(
    # 실제 구현체를 주입받지만, 반환 시점이나 서비스 생성자에는 Port 인터페이스 형태로 바인딩
    post_repo: SqlAlchemyPostRepository = Depends(get_post_repository)
) -> PostService:
    return PostService(post_repo=post_repo)
```

이 방식을 사용하면 추후 데이터베이스 모듈을 SQLAlchemy에서 다른 라이브러리로 바꾸거나 가짜 인메모리 저장소로 변경할 때 서비스 레이어 코드를 건드리지 않고 의존성 주입 코드만 수정하여 대응할 수 있습니다.

---

## 8. Test Override (`dependency_overrides`)

FastAPI의 DI 시스템이 가진 강점 중 하나는 테스트 격리가 아주 쉽다는 점입니다.
`app.dependency_overrides` 딕셔너리를 활용하면 실제 실행용 DI Provider를 테스트용 함수로 교체할 수 있습니다.

```python
# tests/test_post_router.py
import pytest
from httpx import AsyncClient
from app.main import app
from app.domains.post.dependencies import get_create_post_use_case

# 테스트용 가짜 UseCase
class FakeCreatePostUseCase:
    async def execute(self, payload):
        return {"id": 999, "title": "Fake Title"}

@pytest.mark.asyncio
async def test_create_post_endpoint(client: AsyncClient):
    # Given: 특정 의존성을 테스트용 가짜 객체로 오버라이드
    app.dependency_overrides[get_create_post_use_case] = lambda: FakeCreatePostUseCase()
    
    try:
        # When: 엔드포인트 요청 전송
        response = await client.post("/api/v1/posts", json={"title": "Test"})
        
        # Then: 가짜 객체가 동작하여 반환한 데이터 검증
        assert response.status_code == 201
        assert response.json()["id"] == 999
        
    finally:
        # 테스트 종료 후 반드시 오버라이드 맵 초기화 (부수 효과 방지)
        app.dependency_overrides.clear()
```

이와 같이 데이터베이스 세션 공급기(`get_db_session`)를 가짜 sqlite 세션이나 테스트 트랜잭션 롤백 세션 공급기로 오버라이드하여 데이터베이스 통합 테스트를 쉽고 안전하게 작성할 수 있습니다.

---

## 요약

1. **`Depends`는 IoC 컨테이너다**: 의존 관계 조립 책임을 엔드포인트가 아닌 프레임워크 DI 시스템에 위임.
2. **레이어드 아키텍처 조립**: `get_xxx` 계열의 의존성 체이닝을 통해 Router에 필요한 최종 UseCase/Service를 원스톱으로 공급.
3. **수명 주기 관리**: 요청 시 생성/소멸하는 **Request Scope**와 전역적으로 유지되는 **App Scope** 객체를 명확하게 구분.
4. **백그라운드 태스크 함정**: 백그라운드 태스크는 HTTP 응답 후에 수행되므로 Request Scope의 DB 세션을 공유하면 커넥션 유실 예외가 발생합니다. **App Scope의 세션 팩토리를 던져 태스크 내부에서 수동으로 세션을 제어**.
5. **Port & Adapter 적용**: `typing.Protocol` 인터페이스를 의존하게 하고 Provider 단에서 실제 구현체를 바인딩하여 유연성을 극대화.
6. **테스트 용이성**: `app.dependency_overrides`를 활용해 DB 커넥션이나 비즈니스 유스케이스를 손쉽게 Mocking하여 테스트 격리를 수행.
