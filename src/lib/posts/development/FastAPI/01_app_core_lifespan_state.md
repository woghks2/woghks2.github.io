---
title: "1. FastAPI 앱의 생명주기와 공유 리소스"
description: "FastAPI의 앱 구조 설계와 전역 자원 수명 주기 관리."
date: "2025-12-22"
hashtags: ["FastAPI", "Lifespan", "app.state"]
skills: ["FastAPI", "Python"]
status: "published"
---

# 1. FastAPI 앱의 생명주기와 공유 리소스

FastAPI 프로젝트의 뼈대를 이루는 `app/core` 영역은 애플리케이션 전체의 수명 주기를 제어하고 전역 인프라 자원을 관리하는 중추적인 역할을 담당합니다.

여기에 들어가는 핵심 구성 요소들은 다음과 같습니다.

* **settings**: 환경 변수 로드 및 관리
* **database**: DB 엔진 및 세션 팩토리 초기화
* **middleware**: CORS, 보안 헤더, 세션 미들웨어 등록
* **exception handlers**: 전역 에러 핸들링 규칙 정의
* **lifespan**: 애플리케이션 시작과 종료 시점의 전역 이벤트 처리
* **app.state**: 모든 요청에서 안전하게 돌려 쓸 공유 리소스 관리

이 영역을 어떻게 구성하느냐에 따라 애플리케이션이 프로덕션 환경에서 원활하게 구동되고 관리될 수 있는지가 결정됩니다.

이번 글에서는 `main.py` 구성, `lifespan` 컨텍스트 매니저를 통한 자원 관리, `app.state`를 이용한 스레드 안전한 전역 객체 공유 기법을 자세히 다뤄보겠습니다.

---

## 1. main.py

```python
# app/main.py
from fastapi import FastAPI
from app.core.config import settings
from app.core.lifespan import lifespan
from app.core.exceptions import register_exception_handlers
from app.core.middlewares import register_middlewares
from app.api.router import api_router  # 모든 도메인 라우터의 통합본

def create_app() -> FastAPI:
    # 1. 설정을 기반으로 FastAPI 초기화 (OpenAPI 노출 제어 포함)
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.SHOW_DOCS else None,
        docs_url="/docs" if settings.SHOW_DOCS else None,
        redoc_url="/redoc" if settings.SHOW_DOCS else None,
        lifespan=lifespan  # 수명 주기 관리자 등록
    )
    
    # 2. 미들웨어 등록
    register_middlewares(app)
    
    # 3. 전역 예외 처리기 등록
    register_exception_handlers(app)
    
    # 4. 통합 라우터 연결
    app.include_router(api_router, prefix=settings.API_V1_STR)
    
    return app

app = create_app()
```

위와 같이 `create_app()` 팩토리 함수 패턴을 활용하면 테스트 코드에서 `app` 객체를 오버라이드하여 동적으로 생성하기 매우 편리해집니다.

---

## 2. Pydantic Settings

안전한 환경 변수 관리를 위해 Pydantic v2에서 제공하는 `pydantic-settings` 라이브러리를 활용합니다.

```python
# app/core/config.py
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # 환경 변수명과 일치시키며, 기본값을 제공하거나 필수로 설정할 수 있습니다.
    PROJECT_NAME: str = "FastAPI Blog Service"
    API_V1_STR: str = "/api/v1"
    
    SHOW_DOCS: bool = Field(default=True, validation_alias="SHOW_DOCS")
    DATABASE_URL: str = Field(..., validation_alias="DATABASE_URL")
    
    # .env 파일을 읽어오는 설정 선언
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"  # 정의되지 않은 여분의 환경변수는 무시
    )

settings = Settings()
```

---

## 3. Lifespan

과거 FastAPI에서는 `@app.on_event("startup")`과 `shutdown` 데코레이터를 사용하여 생명주기 이벤트를 처리했으나, 현재는 `lifespan` 컨텍스트 매니저를 사용합니다.

```python
# app/core/lifespan.py
import contextlib
import httpx
from fastapi import FastAPI
from app.core.database import db_helper  # DB 엔진 관리 헬퍼
from app.core.config import settings

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # ------------------ [STARTUP AREA] ------------------
    # 1. 공통 비동기 HTTP 클라이언트 초기화 (App Scope)
    # 매 요청마다 클라이언트를 띄우면 핸드셰이크 오버헤드가 발생하므로 싱글톤으로 관리합니다.
    http_client = httpx.AsyncClient(timeout=httpx.Timeout(10.0))
    app.state.http_client = http_client
    
    # 2. 데이터베이스 연결 수명 주기 확인 (Ping)
    await db_helper.check_connection()
    
    # 3. 도메인 캐시 및 시스템 리소스 웜업 (Warmup)
    await warmup_cache(app)
    
    yield  # 이 시점에서 애플리케이션이 클라이언트 요청을 수락하고 대기합니다.
    
    # ----------------- [SHUTDOWN AREA] ------------------
    
    # 1. 비동기 HTTP 클라이언트 리소스 해제
    await http_client.aclose()
    
    # 2. 데이터베이스 접속 커넥션 풀 완전 종료
    await db_helper.dispose()
```

`yield`를 기준으로 위쪽은 애플리케이션이 켜지면서 실행, 아래쪽은 애플리케이션이 정상적으로 내려갈 때 실행될 정리 코드입니다.

`yield` 이후 요청 처리 중 예외가 발생하더라도 파이썬 컨텍스트 매니저에 의해 아래쪽 `shutdown` 영역의 안전 장치들이 실행됩니다. 다만 `yield` 이전의 startup 단계에서 예외가 발생하면 애플리케이션이 기동되지 않으므로, 초기화 순서와 예외 처리는 별도로 신경 써야 합니다.

---

## 4. `app.state`

앞서 `lifespan` 예제에서 `app.state.http_client = http_client` 형태로 자원을 등록하는 것을 보셨을 것입니다. 

`app.state`는 FastAPI 애플리케이션 인스턴스의 빈 보관소 역할을 하는 내장 속성입니다. 프론트로 치면 Store나 Context랑 비슷하다고 생각할 수 있습니다.

여기에 등록된 값은 애플리케이션의 수명과 일치하며, HTTP 요청 컨텍스트 내부에서 언제든지 꺼내 쓸 수 있습니다.

```python
# app/domains/post/router.py
from fastapi import APIRouter, Request, status

router = APIRouter()

@router.get("/external-posts")
async def get_external_posts(request: Request):
    # lifespan에서 생성해 둔 전역 HTTP 클라이언트를 안전하게 공유받아 요청 처리
    client = request.app.state.http_client
    response = await client.get("https://api.external.com/posts")
    return response.json()
```

### 4.1 스레드 및 코루틴 안정성
`app.state`에 담긴 객체는 애플리케이션 전체에 걸쳐 싱글톤으로 유지됩니다.

비동기 환경에서 이 객체를 여러 요청이 동시에 호출하더라도 안전하도록, 공유 대상 객체(예: `httpx.AsyncClient`, `aioredis.Redis`)는 반드시 Thread-Safe하거나 Concurrency-Safe한 라이브러리 객체여야 합니다.

---

## 5. Startup 캐시 웜업 및 외부 리소스 관리

실무 환경에서는 앱이 켜진 직후 첫 번째 요청이 데이터베이스 슬로우 쿼리를 유발하지 않도록, 공통 메타데이터나 시스템 설정 등을 캐시에 적재하는 동작이 필수적입니다.

```python
async def warmup_cache(app: FastAPI):
    # 데이터베이스 세션을 수동으로 확보하여 초기 메타데이터 조회
    from app.core.database import async_session_factory
    
    async with async_session_factory() as session:
        # DB에서 공통 공지사항이나 공통 마스터 코드 목록 조회
        result = await session.execute(select(MasterCodeEntity))
        master_codes = result.scalars().all()
        
        # 조회된 데이터 가공 후 app.state 또는 캐시 서버에 세팅
        app.state.cached_master_codes = {c.key: c.value for c in master_codes}
```

이와 같은 공통 데이터는 `app.state.cached_master_codes`에 보관함으로써 매 요청마다 DB에 쿼리를 전송하지 않아도 되며, 전반적인 읽기 성능이 비약적으로 극대화됩니다.

---

## 6. Shutdown

Gunicorn이나 Uvicorn이 서버의 `SIGTERM` 혹은 `SIGINT` 시그널을 받으면, 활성화된 웹 프로세스는 즉시 종료 단계를 시작합니다.

이때 클라이언트 요청이 아직 진행 중이거나 DB 연결이 강제로 끊어지면 데이터 손실 및 커넥션 누수가 일어납니다.

* **Graceful Shutdown**: 새로운 클라이언트의 접근을 막되, 처리 중이던 기존 연결은 끝날 때까지 수 초간 기다립니다. (로컬 개발 시 Ctrl+C를 누르면 보통 `SIGINT` 시그널을 보내어 Graceful Shutdown을 트리거합니다. 2번 눌러서 바로 종료할 수 있다)

* **리소스 정리 순서**: 
  1. 외부 타사 서비스와 연동되는 HTTP 통신 소켓 등을 먼저 정리(`aclose()`)합니다.
  2. 비즈니스 단의 작업이 안전하게 정리된 후, 가장 최하위 인프라인 데이터베이스 커넥션 풀(`dispose()`)을 완전히 종료합니다.
  3. 모든 연결 해제가 완료되면 애플리케이션 프로세스가 안전하게 사멸합니다.

---

## 요약

1. **얇은 `main.py`**: 라우터, 예외 처리, 미들웨어 등은 별도 모듈로 분리하여 `main.py`를 간결하게 유지.
2. **Pydantic Settings**: `.env` 파일과 시스템 환경 변수를 정적 검증하여 타입 안전하게 로드.
3. **Lifespan의 단일화**: `asynccontextmanager` 패턴을 통해 Startup과 Shutdown 수명 주기를 일원화하여 조작.
4. **`app.state` 전역 공유**: `httpx.AsyncClient`나 캐시 커넥션 등 전역 싱글톤 리소스는 `app.state`에 담아 각 엔드포인트나 의존성 공급기에서 재사용.
5. **안전한 Shutdown**: 리소스의 유실이나 메모리 누수를 막기 위해, 시스템 시그널 수신 단계에서 통신 소켓과 DB 연결을 순차적으로 안전하게 close.
