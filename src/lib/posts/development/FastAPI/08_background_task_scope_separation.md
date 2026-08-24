---
title: "8. Background Task와 비동기 워커"
description: "FastAPI BackgroundTasks와 외부 워커 큐의 차이, 적용 기준, 안전한 예외 처리 방식."
date: "2026-01-08"
hashtags: ["FastAPI", "BackgroundTasks", "Celery", "Asynchronous", "Architecture"]
skills: ["FastAPI", "Python"]
status: "published"
---

# 8. Background Task와 비동기 워커

웹 애플리케이션의 핵심 품질 지표 중 하나는 **사용자 응답 시간(Latency)**입니다.

사용자가 게시글을 작성하고 저장 버튼을 눌렀을 때, 게시글 저장 외에도 이메일 발송, 푸시 알림 전송, 통계 데이터 갱신 같은 부가 작업이 따라붙을 수 있습니다. 이 모든 작업을 하나의 HTTP 요청 안에서 끝내려고 하면 사용자는 응답이 올 때까지 계속 기다려야 합니다.

사용자가 즉시 결과를 확인하지 않아도 되는 작업은 백그라운드로 넘기고, 메인 HTTP 응답은 빠르게 반환하는 편이 좋습니다. 이번 글에서는 FastAPI 내장 `BackgroundTasks`의 원리와 사용에 대해서 알아보겠습니다.

---

## 1. FastAPI 내장 `BackgroundTasks`

FastAPI는 Starlette가 제공하는 `BackgroundTasks`를 기본으로 제공합니다. Redis나 RabbitMQ 같은 별도 인프라 없이, HTTP 응답 이후에 실행할 함수를 등록할 수 있습니다.

```python
# app/domains/post/router.py
from fastapi import APIRouter, BackgroundTasks, status
from app.domains.post.schemas import PostCreateRequest

router = APIRouter(prefix="/posts", tags=["Posts"])

async def send_email_notification(email: str, title: str):
    # 실제 오래 걸리는 이메일 서버 통신 (가상)
    import asyncio
    await asyncio.sleep(3)  # I/O Bound 작업 시뮬레이션
    print(f"Email sent to {email} for post '{title}'")

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostCreateRequest,
    # 1. FastAPI 내장 BackgroundTasks 주입
    background_tasks: BackgroundTasks
):
    # 2. 메인 DB 저장 및 핵심 비즈니스 로직 즉시 수행
    post_id = 42  # 임시 저장 완료된 ID
    
    # 3. 오래 걸리는 외부 전송 로직은 백그라운드에 등록
    # add_task(실행할함수, 인자1, 인자2, ...)
    background_tasks.add_task(
        send_email_notification, 
        "user@test.com", 
        payload.title
    )
    
    # 4. 백그라운드 태스크가 끝나기를 기다리지 않고 응답 반환
    return {"id": post_id, "status": "created"}
```

### 내부 작동 원리
1. 클라이언트 요청이 핸들러로 들어오고, `BackgroundTasks` 객체가 주입됩니다.
2. `add_task`로 등록한 태스크 함수는 즉시 실행되지 않고 응답 객체에 연결됩니다.
3. 핸들러 함수가 결과를 리턴하고 HTTP 응답이 전송된 뒤, 등록된 함수들이 같은 애플리케이션 프로세스 안에서 실행됩니다.

중요한 점은 "별도 워커로 보내는 것"이 아니라는 점입니다. 내장 `BackgroundTasks`는 웹 프로세스 안에서 실행됩니다. 그래서 가벼운 후처리에는 좋지만, 무거운 작업이나 반드시 성공해야 하는 작업에는 한계가 있습니다.

---

## 2. 백그라운드 태스크 실행 시 안전망과 로깅 설계

백그라운드로 실행되는 함수는 HTTP 응답 생명주기 밖에서 돕니다. 태스크 안에서 에러가 발생해도 이미 응답은 나간 뒤이므로 클라이언트에게 오류 응답을 다시 보낼 수 없습니다. 그래서 태스크 내부에서 예외를 직접 잡고, 충분한 컨텍스트를 로그로 남겨야 합니다.

```python
import logging
from app.core.exceptions import NotificationGatewayException

logger = logging.getLogger("background_tasks")

async def safe_notification_task(email: str, title: str):
    try:
        # 비즈니스 로직 수행
        await send_email_notification(email, title)
    except NotificationGatewayException as e:
        # 에러를 상위로 방출하지 않고, 상세 컨텍스트를 로깅하여 트래킹합니다.
        logger.error(
            "Failed to send email notification. Email: %s, Title: %s. Reason: %s",
            email, title, str(e),
            exc_info=True  # Stack Trace를 로그에 남김
        )
    except Exception as e:
        # 예상치 못한 시스템 장애 방어
        logger.critical(
            "Unexpected error in background task: %s",
            str(e),
            exc_info=True
        )
```

DB 세션도 주의해야 합니다. Request Scope에서 주입받은 `AsyncSession`을 그대로 백그라운드 태스크에 넘기면, 태스크가 실행될 시점에는 이미 세션이 닫혀 있을 수 있습니다. 백그라운드 태스크에서 DB를 써야 한다면 세션 객체가 아니라 `async_sessionmaker` 같은 세션 팩토리를 넘기고, 태스크 내부에서 새 세션을 열어야 합니다.

---

## 3. 내장 `BackgroundTasks` vs 분산 비동기 큐

FastAPI 내장 `BackgroundTasks`는 간단하지만, 모든 백그라운드 작업을 책임지는 도구는 아닙니다. 작업의 중요도와 무게에 따라 외부 큐로 분리해야 합니다.

| 비교 항목 | FastAPI 내장 BackgroundTasks | 외부 분산 큐 (Celery / Arq) |
| :--- | :--- | :--- |
| **실행 리소스** | 웹 애플리케이션의 프로세스 메모리를 공유 | 독립적으로 격리된 워커(Worker) 프로세스 메모리 사용 |
| **데이터 영속성** | **없음** (서버 프로세스 재부팅 시 대기 중인 모든 큐 유실) | **있음** (Redis/RabbitMQ 등 브로커 백업으로 데이터 유실 차단) |
| **속도 제어 및 재시도** | 불가능 (실패 시 복구 불가) | 강력함 (자동 재시도, 실패 큐 격리, 속도 제한 가능) |
| **추천 작업** | 가벼운 I/O, 실패해도 재처리 부담이 낮은 작업 | 결제 후처리, 정산, 대량 메일, AI 추론, 비디오 인코딩 |

### 내장 BackgroundTasks를 써도 되는 경우
- 실패해도 사용자의 핵심 데이터가 깨지지 않는 작업.
- 실행 시간이 짧고 대부분 I/O 대기인 작업.
- 재시도, 예약 실행, 실패 큐 관리가 없어도 되는 작업.
- 웹 프로세스가 재시작되면 작업이 유실될 수 있음을 받아들일 수 있는 작업.

### 외부 큐로 빼야 하는 경우
- 결제, 정산, 주문, 알림처럼 반드시 처리되어야 하는 작업.
- 실패 시 재시도 정책이 필요한 작업.
- CPU 사용량이 크거나 실행 시간이 긴 작업.
- 웹 서버와 별도로 워커 개수를 늘려 처리량을 조절해야 하는 작업.

---

## 4. 외부 분산 큐로 분리하는 구조

데이터 유실이 허용되지 않는 결제 완료 알림, 정산 작업, 대규모 데이터 마이그레이션 등은 독립된 워커를 사용하는 메시지 브로커 구조로 위임하는 편이 좋습니다.

```text
[FastAPI Client]
       │ (HTTP POST 요청)
       ▼
[FastAPI Router]
       │ 
       │ (1. 비동기 Task 발행 - JSON 직렬화 데이터 전송)
       ▼
[Message Broker (Redis / RabbitMQ)]
       │
       │ (2. Task 큐잉 및 분배)
       ▼
[Celery / Arq Worker Process] (별도 컨테이너 또는 서버)
       │ (3. 비즈니스 로직 수행 및 트랜잭션 종료)
       ▼
[Database]
```

웹 서버는 메시지 브로커에 "이 작업을 처리해줘"라는 작은 메시지만 보낸 뒤 바로 응답합니다. 실제 무거운 처리는 워커가 담당합니다. 이렇게 하면 웹 서버의 응답성과 백그라운드 작업 처리량을 따로 관리할 수 있습니다.

---

## 요약

1. **응답 속도 개선**: 사용자가 즉시 기다릴 필요 없는 작업은 백그라운드로 넘겨 HTTP 응답을 빠르게 반환.
2. **예외와 로깅 필수**: 백그라운드 태스크의 실패는 클라이언트 응답으로 되돌릴 수 없으므로 태스크 내부에서 로깅과 예외 처리를 수행.
3. **세션 수명 주의**: Request Scope DB 세션을 태스크에 넘기지 말고, 필요하면 세션 팩토리로 태스크 내부에서 새 세션을 생성.
4. **외부 큐 도입 기준**: 재시도, 영속성, 긴 실행 시간, CPU 부하가 필요해지는 순간 Celery/Arq 같은 별도 워커 구조로 분리.
