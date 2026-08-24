---
title: "6. Service Layer"
description: "Service Layer의 역할과 데이터 가공 및 예외 처리 기법을 알아봅니다."
date: "2026-01-03"
hashtags: ["FastAPI", "ServiceLayer", "BusinessLogic", "Architecture"]
skills: ["FastAPI", "Python"]
status: "published"
---

# 6. Service Layer와 비즈니스 로직

레이어드 아키텍처(Layered Architecture)에서 **Service Layer**는 애플리케이션의 핵심 규칙이 모이는 곳입니다.

Router는 HTTP 요청과 응답을 다루고, Repository는 데이터베이스 접근을 담당합니다. 그 사이에서 Service Layer는 "이 서비스에서 실제로 지켜야 하는 규칙"을 실행합니다.

이번 글에서는 Service Layer가 가져야 할 책임, Repository를 주입받아 비즈니스 흐름을 처리하는 방법, 도메인 예외 처리, 그리고 트랜잭션 경계를 어떻게 잡는지 정리해 보겠습니다.

---

## 1. Service Layer의 책임

Service Layer는 데이터가 데이터베이스에 어떻게 저장되는지, 혹은 클라이언트에게 어떤 HTTP 형태로 전달되는지 몰라도 됩니다. 오직 비즈니스 요구사항에 따른 흐름 제어에만 집중해야 합니다.

### Service Layer가 해야 할 일
- **비즈니스 규칙 검증**: "글 작성자는 활성화된 유저여야 한다", "하루에 작성 가능한 최대 글 개수는 5개다" 같은 규칙을 검증합니다.
- **도메인 상태 변화 관리**: 조건에 맞게 엔티티 필드를 수정하고, 필요한 연관 데이터를 생성합니다.
- **데이터 흐름 조율**: Repository를 통해 데이터를 읽어와 필요한 형태로 가공한 뒤 상위 레이어로 전달합니다.

### Service Layer가 피해야 할 일
- **HTTP 객체 직접 참조**: `Request`, `Response`, `HTTPException` 같은 FastAPI 전용 객체를 서비스 내부로 끌고 오지 않습니다.
- **SQL 쿼리 직접 작성**: `select(...)`나 raw SQL 문자열을 서비스 안에서 직접 만들지 않습니다. 데이터 조회는 주입받은 Repository에 위임합니다.

---

## 2. Repository를 주입받아 비즈니스 연산 수행하기

Service는 Repository를 생성하지 않고 외부에서 주입받아 사용합니다. 이렇게 하면 Service는 데이터 저장 방식보다 비즈니스 규칙에 집중할 수 있고, 테스트할 때도 Repository를 Fake 객체로 쉽게 바꿀 수 있습니다.

```python
# app/domains/post/service.py
from typing import List
from app.domains.post.models import PostEntity
from app.domains.post.repository import PostRepository
from app.domains.post.exceptions import PostAccessDeniedException, UserSuspendedException

class PostService:
    def __init__(self, post_repo: PostRepository):
        self.post_repo = post_repo

    async def create_new_post(self, title: str, content: str, author_id: int) -> PostEntity:
        # 1. 비즈니스 규칙 검증
        # (실무에서는 UserService 등에서 유저 상태를 조회해 검증할 수 있습니다)
        is_active_user = await self._check_user_status(author_id)
        if not is_active_user:
            raise UserSuspendedException("정지된 회원은 게시글을 작성할 수 없습니다.")
        
        # 2. 도메인 객체 생성 및 레포지토리를 통한 저장
        post = PostEntity(
            title=title,
            content=content,
            author_id=author_id
        )
        saved_post = await self.post_repo.save(post)
        return saved_post

    async def delete_post_safely(self, post_id: int, request_user_id: int) -> None:
        post = await self.post_repo.get_by_id(post_id)
        if not post:
            return
        
        # 3. 비즈니스 권한 검증: 본인 글만 삭제 허용
        if post.author_id != request_user_id:
            raise PostAccessDeniedException("자신이 작성한 게시글만 삭제할 수 있습니다.")
            
        await self.post_repo.remove(post)

    async def _check_user_status(self, user_id: int) -> bool:
        # 가상의 유저 상태 조회 도메인 로직
        return True
```

---

## 3. 응답 변환과 도메인 예외 처리

서비스 내부에서 권한 오류가 났다고 바로 `fastapi.HTTPException(status_code=403)`을 던지는 경우가 많습니다. 동작은 하지만, 프로젝트가 커질수록 응답 포맷과 에러 코드가 여기저기 흩어지기 쉽습니다.

그래서 최소한 raw `HTTPException`을 직접 던지기보다는, 프로젝트 공통 예외 클래스를 두고 도메인별 예외를 선언하는 편이 좋습니다. 여기서 선택지는 크게 두 가지입니다.

### 3.1 FastAPI 중심 API 서버라면 HTTP 기반 커스텀 예외

대부분의 백엔드 API 서버는 결국 프론트엔드에게 `400`, `404`, `500` 같은 HTTP 상태코드와 공통 에러 바디를 내려줘야 합니다. 서비스도 FastAPI 앱 내부에서만 사용된다면, HTTP 기반 커스텀 예외를 쓰는 방식이 충분히 실용적입니다.

```python
# app/core/exceptions.py
from typing import Any, TypedDict
from fastapi import HTTPException, status
from fastapi.encoders import jsonable_encoder

class ErrorResponseDict(TypedDict):
    code: str
    message: str
    errors: list[dict[str, Any]] | None

class BaseHTTPException(HTTPException):
    status_code: int = 500
    error_code: str = "UNKNOWN_ERROR"
    default_message: str = "알 수 없는 오류가 발생했습니다."

    def __init__(
        self,
        message: str | None = None,
        errors: Any | None = None,
        error_code: str | None = None,
    ):
        if error_code:
            self.error_code = error_code

        self.message = message or self.default_message
        self.errors = jsonable_encoder(errors) if errors else None

        detail: ErrorResponseDict = {
            "code": self.error_code,
            "message": self.message,
            "errors": self.errors,
        }
        super().__init__(status_code=self.status_code, detail=detail)

class NotFoundException(BaseHTTPException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "NOT_FOUND"
    default_message = "요청한 리소스를 찾을 수 없습니다."
```

```python
# app/domains/post/exceptions.py
from app.core.exceptions import NotFoundException

class PostNotFoundException(NotFoundException):
    error_code = "POST_NOT_FOUND"
    default_message = "게시글을 찾을 수 없습니다."

    def __init__(self, post_id: int, message: str | None = None):
        self.post_id = post_id
        super().__init__(message=message or self.default_message)
```

이 방식의 장점은 명확합니다. Service에서 `raise PostNotFoundException(post_id)`를 던지면 FastAPI가 바로 정해진 상태코드와 응답 포맷으로 내려줍니다. 전역 exception handler나 middleware에서 이 예외를 잡아 Discord 알림, Sentry 전송, 구조화 로그 적재 같은 운영 로직을 붙이기도 쉽습니다.

다만 Service Layer가 FastAPI의 `HTTPException` 계열에 의존한다는 점은 감수해야 합니다. FastAPI 중심 API 서버라면 크게 문제가 되지 않지만, 같은 Service를 배치나 워커에서도 강하게 재사용해야 한다면 아래 방식이 더 깔끔할 수 있습니다.

### 3.2 더 강한 분리가 필요하다면 순수 도메인 예외

Service Layer가 "왜 실패했는지"만 알려주고, 그것을 HTTP 403으로 바꿀지, 배치 로그로 남길지, 메시지 큐 재시도로 넘길지는 바깥 레이어가 결정하게 만들 수도 있습니다.

```python
# app/domains/post/exceptions.py
class DomainException(Exception):
    """도메인 레이어 최상위 예외"""
    error_code = "DOMAIN_ERROR"
    default_message = "도메인 오류가 발생했습니다."

    def __init__(self, message: str | None = None):
        self.message = message or self.default_message
        super().__init__(self.message)

class PostAccessDeniedException(DomainException):
    """권한 없는 사용자의 게시글 접근"""
    error_code = "POST_ACCESS_DENIED"
    default_message = "자신이 작성한 게시글만 접근할 수 있습니다."

class UserSuspendedException(DomainException):
    """계정이 정지된 사용자의 액션 거부"""
    error_code = "USER_SUSPENDED"
    default_message = "정지된 회원은 게시글을 작성할 수 없습니다."
```

### 3.3 Router에서 예외 치환하기
순수 도메인 예외를 선택했다면 Router 단에서 수동으로 `HTTPException`으로 변환하거나, FastAPI의 전역 exception handler를 통해 HTTP 상태코드로 매핑합니다. 

또한, Service가 반환한 데이터베이스 엔티티(`PostEntity`)는 Router나 UseCase 레벨에서 Pydantic 스키마(`PostResponse`)로 매핑해 외부에 공개할 필드만 정제해서 내보내는 것이 좋습니다.

```python
# app/domains/post/router.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.domains.post.dependencies import get_post_service
from app.domains.post.service import PostService
from app.domains.post.exceptions import DomainException

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    request_user_id: int,  # 헤더나 토큰에서 파싱된 유저 ID
    service: PostService = Depends(get_post_service)
):
    try:
        await service.delete_post_safely(post_id, request_user_id)
        return {"status": "success"}
    except DomainException as e:
        # 도메인 예외를 HTTP 프로토콜 규격인 HTTPException으로 변경하여 응답합니다.
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
```

이 방식을 유지하면 나중에 실행 환경이 FastAPI에서 콘솔 배치 스크립트나 Celery 워커로 바뀌어도 Service Layer 코드를 거의 그대로 재사용할 수 있습니다.

정리하면, FastAPI 백엔드 안에서만 쓰는 서비스라면 HTTP 기반 커스텀 예외가 생산적입니다. 반대로 도메인 로직을 여러 실행 환경에서 공유해야 한다면 순수 도메인 예외와 어댑터 매핑을 고려하는 것이 좋습니다.

---

## 4. 원자성

서비스 레이어 안에서 여러 저장소를 조작해야 할 때 트랜잭션 범위를 어떻게 잡아야 할까요? 
예를 들어, "회원이 글을 작성하면, 글 저장과 동시에 회원의 활동 점수를 올린다"는 요구사항이 있습니다. 이 두 작업은 반드시 **동일한 단일 DB 트랜잭션 안에서 하나로 묶여 실행(Atomicity)**되어야 합니다.

```python
class PostService:
    def __init__(self, post_repo: PostRepository, user_repo: UserRepository):
        self.post_repo = post_repo
        self.user_repo = user_repo

    async def write_post_and_increase_score(self, title: str, author_id: int) -> None:
        # 나쁜 패턴: 개별 레포지토리 저장 함수에서 매번 commit을 수행함
        # 만약 user_repo.increase_score() 단계에서 예외가 발생하면
        # 글은 저장되었으나 활동 점수는 반영되지 않는 데이터 부정합 상태가 발생합니다.
        post = PostEntity(title=title, author_id=author_id)
        await self.post_repo.save_and_commit(post) 
        
        await self.user_repo.increase_score_and_commit(author_id)
```

### 올바른 흐름 제어
트랜잭션 커밋과 롤백의 최종 결정 권한은 Repository가 아니라 흐름을 조율하는 Service 또는 Unit of Work가 쥐는 편이 좋습니다.

```python
class PostService:
    def __init__(self, post_repo: PostRepository, user_repo: UserRepository, db_session: AsyncSession):
        self.post_repo = post_repo
        self.user_repo = user_repo
        self.db_session = db_session  # 트랜잭션 제어를 위해 주입받음

    async def write_post_and_increase_score(self, title: str, author_id: int) -> None:
        # 하나의 세션 내에서 트랜잭션을 수동으로 조율
        try:
            # 1. 글 임시 저장 (DB 세션 버퍼에만 추가)
            post = PostEntity(title=title, author_id=author_id)
            await self.post_repo.save(post)
            
            # 2. 점수 반영 (동일 세션 내 대기)
            await self.user_repo.increase_score(author_id)
            
            # 3. 모든 작업이 끝난 후 단 한 번 최종 커밋
            await self.db_session.commit()
        except Exception as e:
            # 하나라도 실패 시 즉시 롤백하여 데이터 일관성 복구
            await self.db_session.rollback()
            raise e
```

---

## 요약

1. **도메인 비즈니스 분리**: Service Layer는 HTTP 기술이나 로우 쿼리 명세를 모른 채 도메인 논리만 제어.
2. **의존성 주입 활용**: Repository를 생성자로 주입받아 사용하므로 테스트 시 Fake 객체로 대체하기 쉬움.
3. **예외 처리 선택지**: FastAPI 중심 API 서버라면 공통 `BaseHTTPException` 기반 도메인 예외가 실용적이고, 더 강한 분리가 필요하면 순수 `DomainException`과 handler 매핑을 사용.
4. **트랜잭션 원자성**: 여러 엔티티 상태를 변경하는 비즈니스는 개별 저장소 단위로 커밋하지 않고, 동일한 세션 트랜잭션으로 묶어 마지막에 한 번 커밋.
