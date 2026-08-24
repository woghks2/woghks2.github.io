---
title: "7. UseCase Layer"
description: "Service Layer의 비대화를 막고 사용자 시나리오 단위로 흐름을 제어하는 UseCase Layer 설계."
date: "2026-01-05"
hashtags: ["FastAPI", "UseCase", "CleanArchitecture", "FlowControl"]
skills: ["FastAPI", "Python"]
status: "published"
---

# 7. UseCase Layer와 흐름 제어

서비스 지향 아키텍처나 레이어드 아키텍처를 도입한 프로젝트가 커지면 높은 확률로 **Fat Service** 문제를 마주하게 됩니다.

처음에는 `PostService` 하나만 있어도 충분해 보입니다. 그런데 시간이 지나면 글 생성, 글 조회, 인기 글 필터링, 정지 유저 검증, 알림 발송, 통계 갱신 같은 흐름이 한 클래스 안에 계속 쌓입니다. 이 상태가 오래가면 Service가 도메인 규칙을 담는 곳인지, 화면 시나리오를 조립하는 곳인지 애매해집니다.

이때 사용할 수 있는 선택지가 **UseCase Layer**입니다. UseCase는 사용자가 시스템을 통해 달성하려는 하나의 구체적인 시나리오를 독립된 클래스로 분리합니다. 이번 글에서는 UseCase가 Service와 어떻게 다르고, 언제 도입하면 좋은지, FastAPI Router와 어떻게 조립하는지 정리해 보겠습니다.

---

## 1. UseCase Layer의 역할

UseCase는 Service를 대체하는 레이어가 아닙니다. Service가 도메인 규칙을 담는다면, UseCase는 여러 Service와 외부 모듈을 조합해 하나의 사용자 흐름을 완성합니다.

```text
Router
  -> UseCase: 요청 하나의 실행 흐름 조율
      -> Service: 도메인 규칙 처리
      -> Repository: 데이터 접근
      -> External Client: 알림, 결제, 외부 API 호출
```

UseCase의 핵심은 "한 요청에서 무엇을 어떤 순서로 실행할지"를 드러내는 것입니다. 예를 들어 게시글 작성 API는 단순히 글만 저장하지 않을 수 있습니다. 작성 권한을 확인하고, 글을 저장하고, 태그를 연결하고, 작성 완료 알림을 보내고, 검색 인덱스를 갱신할 수도 있습니다. 이런 흐름을 Service 하나에 계속 넣으면 금방 무거워집니다.

### UseCase가 어울리는 경우
- **여러 도메인을 조율할 때**: 게시글 저장과 유저 점수 증가처럼 여러 Service가 함께 움직이는 경우.
- **외부 시스템 호출이 섞일 때**: 결제 승인, 알림 발송, 파일 업로드, 검색 인덱스 갱신 등이 필요한 경우.
- **트랜잭션 흐름이 중요할 때**: 어떤 작업까지 성공해야 commit할지 명확히 보여줘야 하는 경우.
- **시나리오 이름을 코드에 드러내고 싶을 때**: `CreatePostUseCase`, `PublishPostUseCase`처럼 기능 목록이 폴더에서 바로 읽히게 하고 싶을 때.

---

## 2. 파이썬 `__call__` 메서드를 활용한 UseCase 구현

파이썬 클래스의 `__call__` 매직 메서드를 구현하면 인스턴스 자체를 일반 함수처럼 호출할 수 있습니다. UseCase는 보통 "행위"에 가깝기 때문에 `await use_case(...)` 형태가 꽤 잘 어울립니다.

```python
# app/domains/post/use_cases/create_post.py
from app.domains.post.models import PostEntity
from app.domains.post.service import PostService
from app.domains.user.service import UserService
from app.core.notifications import NotificationSender

class CreatePostUseCase:
    # 필요한 서비스나 모듈들을 생성자 주입(DI)으로 받습니다.
    def __init__(
        self,
        post_service: PostService,
        user_service: UserService,
        notification_sender: NotificationSender
    ):
        self.post_service = post_service
        self.user_service = user_service
        self.notification_sender = notification_sender

    # __call__ 메서드를 통해 유스케이스 실행부를 정의합니다.
    async def __call__(self, title: str, content: str, author_id: int) -> PostEntity:
        # 1. 작성 권한 검증 (유저 서비스 호출)
        await self.user_service.verify_user_activity(author_id)
        
        # 2. 게시글 생성 (포스트 서비스 호출)
        post = await self.post_service.create_new_post(
            title=title, 
            content=content, 
            author_id=author_id
        )
        
        # 3. 작성 성공 시 외부 채널로 알림 발송
        await self.notification_sender.send_push_notification(
            user_id=author_id,
            message=f"새 글 '{post.title}'이 정상 등록되었습니다."
        )
        
        return post
```

---

## 3. Router와 UseCase의 조립 모습

UseCase 계층을 도입하면 Router는 요청 파싱과 응답 모델 지정에 집중할 수 있습니다. 실제 흐름은 주입받은 UseCase에 위임합니다.

```python
# app/domains/post/router.py
from fastapi import APIRouter, Depends, status
from app.domains.post.dependencies import get_create_post_use_case
from app.domains.post.use_cases.create_post import CreatePostUseCase
from app.domains.post.schemas import PostCreateRequest, PostDetailResponse

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post(
    "", 
    status_code=status.HTTP_201_CREATED,
    response_model=PostDetailResponse,
    summary="새로운 포스트 작성"
)
async def write_post(
    payload: PostCreateRequest,
    # Depends를 통해 조립된 UseCase 인스턴스를 주입받음
    use_case: CreatePostUseCase = Depends(get_create_post_use_case)
):
    # 단 한 줄로 비즈니스 유스케이스 실행 흐름 조율
    post = await use_case(
        title=payload.title,
        content=payload.content,
        author_id=payload.author_id
    )
    return post
```

이 구조에서는 Router가 HTTP 규격 처리(payload 파싱, `response_model` 검증)에 집중합니다. 반대로 UseCase는 HTTP를 몰라도 됩니다. 입력값만 받아서 하나의 시나리오를 실행하면 됩니다.

## 요약

1. **Fat Service 방지**: 하나의 Service에 너무 많은 시나리오가 쌓이면 UseCase로 흐름을 분리.
2. **시나리오 단위 표현**: `CreatePostUseCase`, `DeletePostUseCase`처럼 사용자의 행위가 코드 구조에서 바로 보이게 설계.
3. **오케스트레이션 역할**: UseCase는 여러 Service, Repository, 외부 클라이언트를 조율하여 하나의 요청 흐름을 완성.
4. **하이브리드 적용**: 복잡한 Write 계열에는 적극 적용하고, 단순 Read 계열에는 과도하게 강제하지 않음.
