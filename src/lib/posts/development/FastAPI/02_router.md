---
title: "2. FastAPI Router"
description: "Path, Query, Body 파라미터와 response_model."
date: "2025-12-23"
hashtags: ["FastAPI", "Router", "REST", "Pydantic", "response_model"]
skills: ["FastAPI", "Python", "Pydantic"]
status: "published"
---

# 2. Router의 입력 계약과 응답 설계

FastAPI에서 **Router**는 들어오는 HTTP 요청을 수신하고, 알맞은 파이썬 함수와 연결해 주는 역할을 수행합니다.

Router 단계에서 가장 핵심적인 책임은 "입력과 출력의 엄격한 계약(Contract)을 수립하는 것"입니다. 
즉, 어떤 주소(URL)로 어떤 포맷의 데이터(Path, Query, Body)를 받으며, 성공 혹은 실패했을 때 어떤 HTTP Status와 Response Model로 클라이언트에게 돌려줄 것인지를 정의해야 합니다.

이번 글에서는 REST 아키텍처에 부합하는 라우팅 규칙 설계 방법, 입력 매개변수 제약조건 수립, 상세한 Swagger 문서화 설정, 그리고 `JSONResponse`를 직접 반환할 때 발생하는 직렬화 우회 문제까지 꼼꼼히 정리해 보겠습니다.

---

## 1. REST와 HTTP 메서드 설계 방향

RESTful API 설계의 핵심은 **"URL은 제어하고자 하는 리소스(자원)를 나타내고, 행위는 HTTP Method로 표현하는 것"**입니다.

```text
GET    /api/v1/posts          -> 게시글 목록 조회 (I/O)
GET    /api/v1/posts/{id}     -> 특정 게시글 단건 조회
POST   /api/v1/posts          -> 새 게시글 등록 (Write)
PUT    /api/v1/posts/{id}     -> 게시글 전체 갱신 (Overwrite)
PATCH  /api/v1/posts/{id}     -> 게시글 일부 수정 (Partial Update)
DELETE /api/v1/posts/{id}     -> 게시글 삭제
```

URL 경로에 `create-post`나 `delete_post`와 같이 동사형 단어가 들어가는 것은 REST 안티 패턴입니다. 행위는 오직 HTTP 메서드로만 구분되도록 설계해야 합니다. FastAPI는 `@router.get()`, `@router.post()`, `@router.put()`, `@router.patch()`, `@router.delete()` 데코레이터를 통해 이를 네이티브하게 지원합니다.

---

## 2. APIRouter 선언과 모듈화

모든 엔드포인트를 하나의 파일에 작성할 수는 없습니다. FastAPI는 `APIRouter` 클래스를 제공하여 도메인 단위로 라우터를 분리해 개발한 뒤, 최종적으로 `main.py`에 등록할 수 있게 해 줍니다.

```python
# app/domains/post/router.py
from fastapi import APIRouter

# prefix와 tags를 지정하여 도메인 수준의 관심사를 묶어 줍니다.
router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)

@router.get("")
async def list_posts():
    return {"message": "list of posts"}
```

이 라우터는 최종적으로 공통 라우터 경로를 거쳐 `main.py`에 결합됩니다.
```python
# app/api/router.py (라우터 허브)
from fastapi import APIRouter
from app.domains.post.router import router as post_router
from app.domains.user.router import router as user_router

api_router = APIRouter()
api_router.include_router(post_router)
api_router.include_router(user_router)
```

---

## 3. Path Parameter
 
URL 경로의 일부로 전달되는 **Path 파라미터**는 대상 리소스의 고유 식별자(ID 등)를 지정할 때 사용합니다. FastAPI는 파이썬 타입 힌트를 분석하여 입력받은 인자의 데이터 타입을 자동으로 변환해 줍니다.

```python
from fastapi import APIRouter, Path

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.get("/{post_id}")  # post_id를 Path Parameter로 받아 해당 ID의 게시글을 조회합니다.
async def get_post_by_id(
    # Path 함수를 사용하여 스웨거 문서 설명 및 범위 조건 제약을 정의합니다.
    post_id: int = Path(..., title="게시글 식별 ID", ge=1, description="1 이상의 정수값이어야 합니다.")
):
    return {"post_id": post_id}
```

* `ge=1` (Greater than or Equal): 1보다 크거나 같은 정수만 허용하도록 유효성을 검증합니다. 만약 클라이언트가 `post_id`에 `-5`나 `"abc"`를 담아 요청하면, 엔드포인트 비즈니스 로직이 실행되기 전에 FastAPI가 자동으로 `422 Unprocessable Entity` 응답을 내려 요청을 사전 차단합니다.

---

## 4. Query Parameter

URL 주소창에 `?key=value` 형태로 전달되는 **Query 파라미터**는 정렬 조건, 필터링, 페이지네이션 등 주 자원을 가공해 보여주기 위한 옵션 정보를 다룰 때 사용합니다.

파이썬의 `typing.Annotated` 문법을 사용하면 타입 힌트와 검증 메타데이터를 깔끔하게 분리하여 가독성을 높일 수 있습니다.

```python
from typing import Annotated
from fastapi import APIRouter, Query

router = APIRouter(prefix="/posts", tags=["Posts"])

# 자주 재사용되는 Query 매개변수 스펙을 미리 타입 별칭으로 정의해 둘 수 있습니다.
PageQuery = Annotated[int, Query(ge=1, description="조회할 페이지 번호")]
LimitQuery = Annotated[int, Query(ge=1, le=100, alias="limitSize", description="한 페이지에 노출할 개수")]

@router.get("")
async def get_posts(
    page: PageQuery = 1,
    limit: LimitQuery = 20,
    search: Annotated[str | None, Query(max_length=50)] = None  # 검색어 필터
):
    return {"page": page, "limit": limit, "search": search}
```

* `alias="limitSize"`: API 외부 규격상 키 이름은 `limitSize`로 받고, 파이썬 코드 내부에서는 스네이크 케이스(`limit`) 변수로 사용할 수 있도록 맵핑해 줍니다. DTO를 사용하지 않고 쿼리 매개변수를 개별 변수로 받을 때 용이합니다.

---

## 5. Body Parameter (Pydantic DTO)

대량의 데이터나 복잡한 중첩 구조의 정보를 전송할 때는 HTTP Body 영역에 JSON 포맷으로 실어 보내며, 이를 Pydantic 모델을 상속받은 DTO로 변환해 매핑합니다.

```python
from pydantic import BaseModel, Field

# 요청 바디 규격 정의
class PostCreatePayload(BaseModel):
    title: str = Field(..., min_length=2, max_length=100, description="글 제목")
    content: str = Field(..., description="글 본문")
    is_private: bool = Field(default=False, description="비공개 여부")

@router.post("", status_code=201)
async def create_post(payload: PostCreatePayload):
    # payload는 이미 Pydantic에 의해 파싱 및 완벽히 검증된 객체 상태입니다.
    return {"title": payload.title, "content": payload.content}
```

---

## 6. response_model

FastAPI에서 응답 데이터 스펙을 규정하고 OpenAPI 문서에 완벽히 명세하기 위해서는 데코레이터 내부에 메타데이터 인자들을 명시해 주는 것이 좋습니다.

```python
from fastapi import APIRouter, status
from pydantic import BaseModel

class PostResponse(BaseModel):
    id: int
    title: str
    content: str

class Message(BaseModel):
    message: str

@router.get(
    "/{post_id}",
    response_model=PostResponse,  # 1. 출력 데이터 변환 및 유효성 검증용 스키마 지정
    status_code=status.HTTP_200_OK,  # 2. 대표 성공 HTTP 상태코드 명시
    responses={ # 3. 각 HTTP 상태 코드에 대한 응답 스키마 지정
        status.HTTP_404_NOT_FOUND: {"model": Message, "description": "게시글을 찾을 수 없음"},
        status.HTTP_400_BAD_REQUEST: {"model": Message, "description": "잘못된 요청 형식"},
    },
    summary="게시글 단건 조회 API",  # 4. Swagger 화면 우측에 노출될 간략 요약
    description="경로 인자로 받은 ID값을 기준으로 특정 게시글을 상세 조회하여 반환합니다.", # 5. 상세 설명
    response_description="조회 성공 시 반환되는 게시글 정보",  # 6. 리턴 타입 설명
    deprecated=False  # 7. 사용 중단 여부 설정 (True 지정 시 Swagger UI에 취소선이 표시됨)
)
async def get_post_detail(post_id: int):
    # DB 조회 결과 가상 데이터
    dummy_post = {
        "id": post_id,
        "title": "FastAPI 입문 가이드",
        "content": "FastAPI는 고성능 비동기 웹 프레임워크입니다.",
        "invisible_secret": "hidden_key"  # PostResponse 스키마에 정의되지 않은 필드
    }
    
    # Pydantic response_model에 의해 'invisible_secret' 필드는
    # 최종 JSON 응답 직렬화 과정에서 자동으로 걸러져 안전하게 전송됩니다.
    return dummy_post
```

---

## 7. JSONResponse vs Schema/Dict

FastAPI 엔드포인트 함수에서는 `dict` 나 `Pydantic Model` 뿐만 아니라, `fastapi.responses.JSONResponse` 객체를 직접 생성해 반환할 수도 있습니다. 하지만 둘 사이에는 치명적인 동작 차이가 있습니다.

### 7.1 dict / Pydantic Model 반환 시 동작 흐름

1. 함수가 데이터를 반환하면 FastAPI의 Serializer Interceptor가 동작합니다.
2. 데코레이터에 선언된 `response_model` 스펙에 맞춰 데이터를 필터링하고 직렬화를 수행합니다.
3. 이를 통해 불필요한 민감 정보의 유출을 원천 방지합니다.

### 7.2 JSONResponse 직접 반환 시 동작 흐름

1. 함수가 데이터를 반환하면 FastAPI의 Serializer Interceptor가 동작하지 않습니다.
2. 따라서 `JSONResponse` 객체를 직접 반환하면 데이터 필터링 및 직렬화가 적용되지 않습니다.
3. 이를 통해 민감한 데이터(예: 패스워드, 내부 시스템 키 등)의 유출이 발생할 수 있습니다.

```python
from fastapi import responses

@router.get("/direct-response/{post_id}", response_model=PostResponse)
async def get_direct_response(post_id: int):
    data = {
        "id": post_id,
        "title": "우회 테스트",
        "content": "본문",
        "invisible_secret": "민감한_어드민_데이터"  # 유출 대상!
    }
    
    # JSONResponse를 직접 리턴하면 FastAPI의 response_model 직렬화 필터 레이어가 작동하지 않습니다!
    return responses.JSONResponse(content=data, status_code=200)
```

#### 문제점

`JSONResponse` 객체를 통째로 넘기면 FastAPI는 이미 완성된 응답 객체라고 판단하여 `response_model`에 의한 데이터 검증 및 필터링을 생략합니다. 이로 인해 스웨거 문서에는 필터링된 형태만 표기되나, 실제 네트워크 데이터에는 `invisible_secret` 필드가 노출될 수 있습니다.

Global Error Handling의 경우 JSONResponse를 반환하고, 데이터의 경우 데이터 자체(dict 혹은 BaseModel)를 반환하는 것이 정석입니다.

---

## 요약

1. **REST 디자인 패턴**: URL은 복수가 명사 형태로 작성하며, 동작 행위는 HTTP Method로 매핑합니다.
2. **APIRouter 분리**: 도메인별로 라우터를 쪼개고 `prefix`와 `tags`를 활용해 명세를 일원화합니다.
3. **타입 기반 제약 조건**: `Path(...)`와 `Query(...)`에 `ge`, `le`, `min_length` 등을 주입하여 진입부에서 예외 데이터를 원천 격리합니다.
4. **Annotated의 결합**: `Annotated` 문법을 활용해 타입 선언부와 검증 메타데이터를 깔끔하게 분리합니다.
5. **response_model 보안 필터링**: `response_model` 설정은 반환할 규격을 고정하고 불필요한 스키마 외 필드의 직렬화 노출을 원천 방지합니다.
6. **JSONResponse 우회 주의**: `JSONResponse`를 핸들러에서 다이렉트로 반환하면 `response_model` 필터링 레이어가 바이패스되므로 지양해야 합니다.

ApiResponse라는 공통 응답 모델을 만들면서 JSONResponse의 보안 취약점을 알게 되었는데, 프레임워크에서 제공하는 기능들에 대해서 딥다이브 하는 게 중요하다고 느낀다...
