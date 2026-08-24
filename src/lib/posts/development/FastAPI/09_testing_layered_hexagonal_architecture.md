---
title: "9. Layered Architecture 테스트 전략"
description: "pytest와 AsyncClient를 활용한 Repository, Service, API 레이어별 테스트 전략."
date: "2026-01-21"
hashtags: ["FastAPI", "Testing", "pytest", "AsyncTest", "Architecture"]
skills: ["FastAPI", "Python"]
status: "published"
---

# 9. Layered Architecture 테스트 전략

프로덕션에 안정적으로 배포되는 웹 애플리케이션을 만들려면 테스트 전략이 필요합니다.

FastAPI는 비동기 프레임워크이면서 DI를 제공하기 때문에, 레이어 단위로 테스트를 나누기 좋습니다. Repository는 실제 DB 쿼리를 검증하고, Service는 가짜 Repository로 비즈니스 규칙만 검증하고, Router는 `dependency_overrides`로 무거운 의존성을 교체해 HTTP 흐름을 확인할 수 있습니다.

이번 글에서는 `pytest` 환경 설정, 트랜잭션 롤백 기반 Repository 테스트, Fake/Mock을 주입하는 Service 테스트, 그리고 `dependency_overrides`를 활용한 Router 테스트 전략을 정리해 보겠습니다.

---

## 1. pytest 및 비동기 테스트 환경 구축

Python 비동기 코드를 테스트하려면 `pytest`, `pytest-asyncio`, `httpx`가 필요합니다. 테스트 설정의 거점인 `conftest.py`에 공통 fixture를 모아두면 각 테스트 파일이 깔끔해집니다.

```python
# tests/conftest.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.main import app
from app.core.database import BaseEntity

# 테스트용 독립 인메모리 SQLite DB 구성
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    # 테스트 구동 전 스키마 생성
    async with engine.begin() as conn:
        await conn.run_sync(BaseEntity.metadata.create_all)
    yield engine
    # 테스트 종료 후 정리
    async with engine.begin() as conn:
        await conn.run_sync(BaseEntity.metadata.drop_all)
    await engine.dispose()
```

최근 `pytest-asyncio`에서는 테스트 함수에 `@pytest.mark.asyncio`를 붙이는 것만으로 대부분 충분합니다. 예전처럼 직접 `event_loop` fixture를 재정의하는 방식은 플러그인 버전에 따라 경고가 날 수 있으니, 특별한 이유가 없다면 기본 루프 관리를 그대로 쓰는 편이 안전합니다.

---

## 2. Repository 테스트: 트랜잭션 롤백 전략

데이터베이스와 직접 통신하는 Repository 계층은 실제 쿼리가 올바르게 동작하는지 확인해야 합니다. 이때 중요한 규칙은 앞선 테스트가 저장한 데이터가 뒤의 테스트에 영향을 주지 않아야 한다는 점입니다.

이를 위해 개별 테스트 함수마다 트랜잭션을 시작하고, 테스트가 끝나면 rollback하는 세션 fixture를 사용합니다.

```python
# tests/conftest.py (추가)
@pytest.fixture
async def db_session(test_engine) -> AsyncSession:
    # 테스트 세션 팩토리 생성
    async_session_factory = async_sessionmaker(
        bind=test_engine,
        expire_on_commit=False
    )
    
    async with async_session_factory() as session:
        # 테스트 시작 시 수동 트랜잭션 바인딩
        await session.begin()
        yield session
        # 테스트 완료 즉시 롤백하여 변경 사항을 데이터베이스에서 지워버림
        await session.rollback()
```

실무에서는 테스트 DB를 SQLite 인메모리로 둘지, 실제 PostgreSQL 테스트 컨테이너로 둘지도 고민해야 합니다. SQLite는 빠르지만 PostgreSQL 전용 타입, 제약조건, SQL 문법 차이를 모두 검증하지 못합니다. Repository 레이어의 SQL 정확도가 중요하다면 실제 DB와 같은 엔진을 테스트 환경에서도 쓰는 편이 더 안전합니다.

```python
# tests/domains/post/test_repository.py
import pytest
from app.domains.post.repository import PostRepository
from app.domains.post.models import PostEntity

@pytest.mark.asyncio
async def test_save_and_retrieve_post(db_session):
    # Given
    repo = PostRepository(db_session)
    post = PostEntity(title="테스트 제목", content="본문", author_id=1)
    
    # When
    saved_post = await repo.save(post)
    
    # Then
    retrieved = await repo.get_by_id(saved_post.id)
    assert retrieved is not None
    assert retrieved.title == "테스트 제목"
    # 이 테스트 함수가 종료되는 순간 db_session 피스처에 의해 DB는 원래 빈 상태로 롤백됩니다.
```

---

## 3. Service & UseCase 테스트: 의존성 모의

Service와 UseCase 테스트에서는 실제 데이터베이스를 띄우지 않아도 됩니다. 주입받는 Repository나 외부 클라이언트를 Fake 또는 Mock으로 대체하고, 비즈니스 규칙만 빠르게 검증합니다.

```python
# tests/domains/post/test_service.py
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock
from app.domains.post.service import PostService
from app.domains.post.exceptions import PostAccessDeniedException

@pytest.mark.asyncio
async def test_delete_post_denied_if_not_author():
    # Given: 가짜 Repository 모의 객체 생성 및 반환 동작 정의
    mock_post_repo = AsyncMock()
    
    # 임의로 타인의 글(author_id=99) 엔티티를 반환하도록 Mock 설정
    mock_post = SimpleNamespace(id=1, author_id=99)
    mock_post_repo.get_by_id.return_value = mock_post
    
    # 모의 객체를 주입하여 Service 인스턴스화
    service = PostService(post_repo=mock_post_repo)
    
    # When & Then: 본인이 아닌 유저(ID: 7)가 지우려고 하면 예외가 발생하는지 확인
    with pytest.raises(PostAccessDeniedException):
        await service.delete_post_safely(post_id=1, request_user_id=7)
        
    # delete Repository 함수가 호출되지 않았음을 명확히 검증
    mock_post_repo.remove.assert_not_called()
```

Mock을 너무 많이 쓰면 테스트가 구현 세부사항에 묶일 수 있습니다. 단순한 저장소라면 `AsyncMock`으로 충분하지만, 도메인 규칙이 복잡하다면 실제 동작을 흉내 내는 작은 Fake Repository 클래스를 만드는 편이 더 읽기 좋을 때도 많습니다.

---

## 4. API 엔드포인트 테스트: `dependency_overrides` 활용

가장 상위 레이어인 Router를 검증할 때는 `httpx.AsyncClient`로 실제 HTTP 요청처럼 호출합니다. 대신 내부 인증 서비스나 DB 세션 같은 무거운 의존성은 `dependency_overrides`로 테스트용 객체로 갈아끼웁니다.

```python
# tests/conftest.py (추가)
@pytest.fixture
async def client(db_session) -> AsyncClient:
    from httpx import ASGITransport, AsyncClient
    from app.core.database import get_db_session
    
    # 1. 실제 get_db_session 의존성을 테스트용 롤백 세션으로 교체합니다.
    app.dependency_overrides[get_db_session] = lambda: db_session
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
        
    # 2. 테스트가 끝나면 다른 테스트에 지장을 주지 않도록 오버라이드 맵을 초기화합니다.
    app.dependency_overrides.clear()
```

```python
# tests/domains/post/test_router.py
import pytest
from fastapi import status

@pytest.mark.asyncio
async def test_create_post_api_success(client):
    # Given
    payload = {
        "title": "API 테스트",
        "content": "API 본문 내용",
        "author_id": 1
    }
    
    # When
    response = await client.post("/api/v1/posts", json=payload)
    
    # Then
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["title"] == "API 테스트"
    assert "id" in data
```

---

## 요약

1. **비동기 테스트 구성**: `pytest-asyncio`와 공통 fixture를 활용해 비동기 엔진, 세션, HTTP 클라이언트를 관리.
2. **Repository 롤백**: DB 테스트는 매 테스트 종료 후 rollback하여 테스트 간 데이터 오염을 방지.
3. **Service 단위 검증**: Repository와 외부 클라이언트를 Mock/Fake로 대체해 비즈니스 규칙만 빠르게 검증.
4. **Router 테스트**: `dependency_overrides`와 `ASGITransport` 기반 `AsyncClient`를 사용해 HTTP 흐름을 테스트.
