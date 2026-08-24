---
title: "5. SQLAlchemy & Repository"
description: "SQLAlchemy의 ORM과 Repository 패턴"
date: "2025-12-31"
hashtags: ["FastAPI", "SQLAlchemy", "Database", "AsyncQuery"]
skills: ["FastAPI", "Python", "SQLAlchemy"]
status: "published"
---

# 5. SQLAlchemy

FastAPI 환경에서 가장 널리 쓰이는 ORM인 SQLAlchemy 2.0은 개편을 거치며 정적 타입 힌트와 명시적인 비동기 쿼리 문법을 정립하였습니다.

이번 글에서는 SQLAlchemy 2.0의 ORM 모델 선언법, 비동기 세션 관리에 대해서 다뤄보겠습니다.

---

## 1. ORM 모델 선언 (Mapped & mapped_column)

SQLAlchemy 2.0은 파이썬의 타입 힌트를 직접 활용하여 ORM 속성의 타입을 안전하게 규정하는 `Mapped`와 `mapped_column` 문법을 도입하였습니다.

```python
# app/core/database.py
import datetime
from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# 모든 ORM 모델이 상속받을 베이스 클래스 선언
class BaseEntity(DeclarativeBase):
    # 공통 메타데이터와 컬럼 타입을 선언합니다!
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()  # DB 시점에 현재 시간 자동 주입
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()        # 데이터가 수정될 때마다 시간 자동 갱신
    )
```

* BaseEntity를 사용하면 `created_at`, `updated_at` 등이 애플리케이션 서버 시간이 아니라 DB 서버 시간을 기준으로 자동 주입됩니다. 컨테이너나 워커마다 시스템 시간이 미세하게 달라도 기록 시점의 기준을 데이터베이스로 통일할 수 있습니다.

```python
# app/domains/post/models.py
from typing import List
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import BaseEntity

class PostEntity(BaseEntity):
    __tablename__ = "posts"
    
    # 1. Mapped[type]와 mapped_column()을 이용한 정적 타입 바인딩
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    
    # 2. 관계 정의 (Relationship) - Mapped[List[...]]를 통한 타입 지정
    author: Mapped["UserEntity"] = relationship(back_populates="posts")
    comments: Mapped[List["CommentEntity"]] = relationship(
        back_populates="post", 
        cascade="all, delete-orphan" # 고아 객체 제거 (ex: 글 삭제 시 댓글 삭제 등)
    )
```

* `Mapped[Type]`을 통해서 타입 힌트를 명시적으로 선언하여 IDE의 자동 완성 및 타입 검증 기능을 활용할 수 있습니다.
* `mapped_column`을 통해서 컬럼 타입을 명시적으로 선언하여 데이터베이스 스키마와 일치시킬 수 있습니다.
* `relationship`을 통해서 테이블 간의 관계를 정의할 수 있습니다.
* `back_populates`를 통해 양방향 참조를 설정할 수 있습니다.

이 방식의 장점은 IDE에서 `post.title`을 참조할 때 문자열(`str`)로 정확하게 타입 추론이 되며, 누락되거나 틀린 속성을 참조했을 때 정적 분석기가 이를 즉시 경고해 준다는 점입니다.

---

## 2. DB 세션 및 커넥션 관리

비동기 웹 어플리케이션 환경에서 데이터베이스 연결은 `AsyncEngine`과 `AsyncSession`으로 논블로킹 방식으로 처리해야 합니다.

```python
# app/core/database.py (세션 팩토리 구성)
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import settings

# 비동기 데이터베이스 엔진 생성
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,  # 실무 가동 시에는 False로 세팅 (SQL 로그 노출 제어)
    pool_size=20, # 워커 수, DB max_connections, 트랜잭션 시간 등을 고려해 조정
    max_overflow=10
)

# 비동기 세션 생성기 바인딩
async_session_factory = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False  # 커밋 후 객체 속성이 만료되지 않도록 설정 (Lazy Loading 방지)
)

# Request Scope를 위한 세션 공급자 (Depends 전용)
async def get_db_session():
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            # yield 종료 시(HTTP 응답이 나갈 때) 세션을 자동으로 닫음
            await session.close()
```

> [!NOTE]
> **`expire_on_commit=False`가 비동기 환경에서 필수적인 이유**
> 비동기 환경(`AsyncSession`)에서 커밋 후 객체의 속성이 만료되면, 해당 객체에 다시 접근할 때 데이터베이스 조회를 시도하게 됩니다. 그러나 이때 동기식 Lazy Loading이 실행되면 비동기 루프 내에서 blocking이 발생하거나 `MissingGreenlet` 예외를 터뜨립니다.
따라서 비동기 애플리케이션에서는 항상 `expire_on_commit=False`를 활성화하는 것이 안전합니다.

---

## 3.  Result 객체 처리 패턴

`await session.execute(query)`를 통해 반환되는 `Result` 객체는 기본적으로 SQL 결과 행(Row)들의 컬렉션입니다. SQLAlchemy 2.0에서는 타입 안정성과 가독성을 극대화하기 위해 목적에 따른 다양한 결과 처리 메서드를 제공합니다.

### 3-1. Result 처리 패턴 요약

| 메서드 체인 | 반환 타입 | 언제 쓰나? | 특징 및 예외 동작 |
| :--- | :--- | :--- | :--- |
| **`.scalars().all()`** | `List[Model]` | 여러 개의 모델 객체 목록을 한 번에 조회할 때 | 가장 흔히 쓰이는 패턴. 리스트 반환. |
| **`.scalars().first()`** | `Model \| None` | 결과 중 첫 번째 행만 안전하게 가져올 때 | 결과가 없으면 `None` 반환. 내부적으로 LIMIT를 강제하지는 않음. |
| **`.scalar_one()`** | `Model` | 정확하게 1개의 결과만 보장되고 존재해야 할 때 | 결과가 0개면 `NoResultFound`, 2개 이상이면 `MultipleResultsFound` 예외 발생. |
| **`.scalar_one_or_none()`** | `Model \| None` | PK 조회 등 0개 또는 1개의 결과만 보장될 때 | 결과가 없으면 `None` 반환. 2개 이상이면 `MultipleResultsFound` 예외 발생. (가장 추천) |
| **`.scalar()`** | `Any` | COUNT, SUM, MAX 등 단일 집계 값을 조회할 때 | 첫 번째 로우의 첫 번째 컬럼 값을 바로 반환. |
| **`.all()`** | `List[Row]` | 여러 테이블 조인이나 특정 컬럼 집합을 튜플 형태로 받을 때 | `(UserEntity, ProfileEntity)`와 같은 튜플을 포함한 로우 리스트 반환. |
| **`.mappings().all()`** | `Sequence[RowMapping]` | 결과를 key-value 형태의 매핑 객체로 받아 다룰 때 | 실제 `dict`가 필요하면 `dict(row)`로 변환. |

### 3-2. Result 처리 예제 코드

```python
from typing import Optional, Sequence
from sqlalchemy.engine import RowMapping
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.domains.user.models import UserEntity
from app.domains.post.models import PostEntity

# =============================================================
# 1. 유저 레포지토리 (UserRepository)
# =============================================================
class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_multi(self, offset: int = 0, limit: int = 20) -> Sequence[UserEntity]:
        """(1) 다중 엔티티 목록 조회"""
        stmt = select(UserEntity).offset(offset).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()  # 깔끔하게 엔티티 리스트만 반환

    async def get_by_id(self, user_id: int) -> Optional[UserEntity]:
        """(2) PK 기반의 안전한 단건 조회 (0개 또는 1개 보장)"""
        stmt = select(UserEntity).where(UserEntity.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()  # 없으면 None, 2개면 에러

    async def get_by_email_strict(self, email: str) -> UserEntity:
        """(3) 정확히 1개 존재함을 보장하는 이메일 조회"""
        stmt = select(UserEntity).where(UserEntity.email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one()  # 없거나 2개 이상이면 즉시 예외(404, 500)

    async def get_users_with_posts_mapping(self) -> list[dict]:
        """(5-2) 조인 결과를 Dict(Mapping) 형태로 가공해서 반환"""
        stmt = select(UserEntity, PostEntity).join(UserEntity.posts)
        result = await self.db.execute(stmt)
        
        # 서비스 레이어가 편하게 쓰도록 아예 레포에서 딕셔너리 리스트로 변환해서 리턴
        return [dict(row) for row in result.mappings().all()]


# =============================================================
# 2. 게시글 레포지토리 (PostRepository)
# =============================================================
class PostRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def count_by_author(self, author_id: int) -> int:
        """(4) 집계 함수 결과 스칼라 값 조회"""
        # 레포 안에서도 db.scalar() 헬퍼를 쓰면 한 줄 컷 가능합니다.
        return await self.db.scalar(
            select(func.count(PostEntity.id)).where(PostEntity.author_id == author_id)
        )

    async def get_posts_with_authors(self) -> Sequence[tuple[UserEntity, PostEntity]]:
        """(5-1) 복잡한 Join 결과를 Row 튜플 형태로 반환"""
        stmt = select(UserEntity, PostEntity).join(UserEntity.posts)
        result = await self.db.execute(stmt)
        return result.all()  # (UserEntity, PostEntity) 묶음 튜플 리스트 리턴
```

> [!TIP]
> `.scalars()`는 데이터베이스 결과 로우(`Row`)에서 첫 번째 컬럼(보통 우리가 조회하려 하는 ORM 객체 자체)만 자동으로 언랩(unwrap)하여 뽑아내어 타이핑과 조작을 편리하게 만들어줍니다.

---

## 4. N+1 문제와 Lazy & Eager Loading

### 4-1. N+1 Query Problem 이란?
ORM을 사용할 때 흔히 발생하는 치명적인 성능 병목 현상입니다. 메인 엔티티 목록(N개)을 가져오는 쿼리 1번을 실행한 뒤, 각 엔티티의 연관 관계(Relationship) 데이터에 접근할 때마다 추가로 쿼리가 1번씩 실행되어 총 **N + 1**번의 쿼리가 수행되는 현상을 의미합니다.

```python
# N+1 문제가 발생하는 최악의 예시 (Async 환경)
users = (await db.execute(select(UserEntity).limit(100))).scalars().all()

for user in users:
    # user.posts에 접근할 때마다 매번 데이터베이스에 SELECT 쿼리가 새로 날아감!
    # 루프를 돌며 추가 쿼리가 100번 더 수행됨 (총 101번의 DB 커넥션 낭비)
    print(f"User {user.id} has {len(user.posts)} posts.")
```

### 4-2. SQLAlchemy 로딩 전략 비교

SQLAlchemy는 연관 데이터를 언제, 어떤 방식으로 조회할 것인지에 대한 5가지 핵심 로딩 방식을 제공합니다.

| 로딩 전략 | `lazy` 옵션 | 비동기 적합성 | 특징 | 추천 용도 |
| :--- | :--- | :--- | :--- | :--- |
| **Lazy Loading** | `"select"` (기본값) | ❌ 부적합 | 연관 관계에 최초 접근하는 시점에 쿼리 실행. | 일반적인 `AsyncSession` ORM 접근에서는 피해야 함 (`MissingGreenlet` 에러 발생 주범). |
| **Select IN Load** | `"selectin"` | 🟢 매우 적합 | 메인 쿼리 1번 실행 후, 획득한 ID들을 모아 `IN` 절로 연관 테이블을 2번째 쿼리로 일괄 조회. | **One-to-Many(1:N), Many-to-Many(N:M) 관계의 기본 전략.** |
| **Joined Load** | `"joined"` | 🟢 적합 | SQL의 `LEFT OUTER JOIN`을 사용해 단 1번의 쿼리로 연관 데이터까지 모두 결합해 가져옴. | **Many-to-One(N:1), One-to-One(1:1) 관계의 기본 전략.** |
| **Subquery Load** | `"subquery"` | ⚠️ 비권장 | 서브쿼리를 이용해 연관 관계를 일괄 조회. | `selectin` 대비 실행 계획 최적화가 어렵고 속도가 느려 거의 쓰이지 않음. |
| **Raise Load** | `"raise"` | 🟢 적극 추천 | 명시적으로 로딩을 지정하지 않은 연관 관계에 접근 시 즉시 예외 발생. | **개발 단계에서의 N+1 / Lazy Loading 실수 방지 디버깅용.** |

---

### 4-3. 왜 Many-to-One은 `joinedload`인가?

Many-to-One (N:1) 관계에서는 `joinedload`가 유리한 이유를 포스트(PostEntity)를 조회하며 글쓴이(UserEntity)를 가져오는 예시를 바탕으로 생각해 봅시다. 

* 글 1개당 작성자는 **오직 1명**입니다. 
* 따라서 `PostEntity`와 `UserEntity`를 `LEFT OUTER JOIN` 하더라도 결과 행(Row)의 개수는 원본 포스트 개수와 똑같습니다. 
* 결과 행 수가 늘어나지 않기 때문에, 쿼리 왕복(Round-trip) 횟수를 1번으로 줄이는 `joinedload`가 유리합니다.

```python
# Many-to-One 관계 즉시 로딩 예시
# 단 1번의 JOIN 쿼리로 모든 정보를 결합해 가져옴
stmt = select(PostEntity).options(joinedload(PostEntity.author))
result = await db.execute(stmt)
posts = result.scalars().all()
```

### 4-4. 왜 One-to-Many 관계에서 `selectinload`일까?

반대로 사용자(UserEntity)를 가져오며 작성한 포스트 목록(PostEntity)을 가져오는 경우를 생각해봅시다.
 
* 유저가 10명 있고, 유저당 작성한 글이 평균 100개라고 가정해 봅시다.
* 이를 `joinedload`로 JOIN 하면 결과 행은 $10 \times 100 = 1,000$행이 반환됩니다.
* 이 1,000개의 행에는 똑같은 유저 정보(이메일, 비밀번호 해시, 가입일 등)가 **100번씩 계속 중복**되어 들어가 있습니다.
* **결과 행 중복(Cartesian Product) 현상**으로 인해 엄청난 네트워크 대역폭 낭비와 메모리 낭비가 일어나며, SQLAlchemy 엔진은 내부적으로 중복 행을 다시 묶어주는 무거운 중복 제거(`.unique()`) 작업을 강제하게 됩니다.

`selectinload`를 사용하면 다음과 같이 효율적으로 동작합니다.

```python
# One-to-Many 관계 즉시 로딩 예시
stmt = select(UserEntity).options(selectinload(UserEntity.posts))
result = await db.execute(stmt)
users = result.scalars().all()
```

SQLAlchemy는 내부적으로 **단 2번의 쿼리**로 작업을 쪼갭니다.
1. 먼저 대상 유저 10명을 찾습니다. `SELECT * FROM users;` (유저 ID 1부터 10 획득)
2. 획득한 ID들을 가지고 포스트 테이블을 모아서 조회합니다: 
   `SELECT * FROM posts WHERE posts.author_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);`

이 방식은 중복 데이터가 0%이므로 전송 대역폭이 비약적으로 절약되고, 데이터 크기가 커질수록 `joinedload`보다 훨씬 빠른 성능을 낼 수 있습니다.

---

## 5. Repository 패턴

비동기 쿼리 패턴과 앞서 다룬 로딩 전략을 직접 설계에 반영하여 작성한 레포지토리의 완전한 모습입니다.

```python
# app/domains/post/repository.py
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload
from app.domains.comment.models import CommentEntity
from app.domains.post.models import PostEntity

class PostRepository:
    def __init__(self, session: AsyncSession):
        self.session = session # 비동기 세션 주입

    # 1. 단건 조회 (Primary Key 기반)
    # session.get()은 캐시를 먼저 탐색하므로 PK 조회 시 select().where()보다 더 빠르고 명시적입니다.
    async def get_by_id(self, post_id: int) -> Optional[PostEntity]:
        return await self.session.get(PostEntity, post_id)

    # 2. 1:N 관계 즉시 로딩을 포함한 단건 조회 (selectinload 활용)
    async def get_with_comments(self, post_id: int) -> Optional[PostEntity]:
        stmt = (
            select(PostEntity)
            .options(selectinload(PostEntity.comments))  # 1대N 관계 Eager Loading
            .where(PostEntity.id == post_id)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()  # 안전한 단건 반환

    # 3. N:1 관계 즉시 로딩을 포함한 리스트 조회 (joinedload 활용)
    async def list_posts_with_author(self, offset: int = 0, limit: int = 20) -> List[PostEntity]:
        stmt = (
            select(PostEntity)
            .options(joinedload(PostEntity.author))  # N대1 관계 Eager Loading
            .order_by(PostEntity.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        # N:1 joinedload는 컬렉션을 join하지 않으므로 일반적으로 unique()가 필수는 아닙니다.
        return list(result.scalars().all())

    # 4. 다차원 중첩(Nested) 즉시 로딩 처리
    async def get_post_detail_with_comments_and_comment_authors(self, post_id: int) -> Optional[PostEntity]:
        stmt = (
            select(PostEntity)
            .options(
                joinedload(PostEntity.author),                                 # 포스트 작성자 로드 (Many-to-One)
                selectinload(PostEntity.comments).joinedload(CommentEntity.author) # 댓글 목록 로드 + 댓글 작성자 로드 (Nested)
            )
            .where(PostEntity.id == post_id)
        )
        result = await self.session.execute(stmt)
        return result.unique().scalar_one_or_none()

    # 5. 엔티티 추가 (Create)
    async def save(self, post: PostEntity) -> PostEntity:
        self.session.add(post)
        await self.session.flush()  # DB에 즉각 반영하여 자동 생성된 PK(id) 값을 가져옴
        return post

    # 6. 엔티티 삭제 (Delete)
    async def remove(self, post: PostEntity) -> None:
        await self.session.delete(post)
```

---

## 6. 제네릭 BaseRepository

도메인 레포지토리마다 매번 반복되는 단순 CRUD는 Generic 상속 구조를 통해 유려하게 재사용할 수 있습니다. 

```python
# app/core/repository.py
from typing import Generic, List, Optional, Type, TypeVar, Any
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import BaseEntity

T = TypeVar("T", bound=BaseEntity)

class BaseRepository(Generic[T]):
    def __init__(self, model_class: Type[T], session: AsyncSession):
        self.model_class = model_class
        self.session = session

    # (1) PK 기반 단순 조회
    async def get_by_id(self, entity_id: Any) -> Optional[T]:
        return await self.session.get(self.model_class, entity_id)

    # (2) 필터 조건을 만족하는 단건 조회 (결과가 없으면 None 반환, 2개 이상이면 에러)
    async def get_one_or_none(self, **filters) -> Optional[T]:
        stmt = select(self.model_class).filter_by(**filters)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    # (3) 필터 조건을 만족하는 단건 조회 (결과가 무조건 1개여야 함, 없거나 2개 이상이면 에러)
    async def get_one(self, **filters) -> T:
        stmt = select(self.model_class).filter_by(**filters)
        result = await self.session.execute(stmt)
        return result.scalar_one()

    # (4) 테이블 전체 목록 조회
    async def list_all(self) -> List[T]:
        stmt = select(self.model_class)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    # (5) 조건부 카운트 집계 헬퍼 메서드
    async def count(self, **filters) -> int:
        stmt = (
            select(func.count())
            .select_from(self.model_class)
            .filter_by(**filters)
        )
        return await self.session.scalar(stmt)

    # (6) 엔티티 추가 (Create / Update 준비)
    async def save(self, entity: T) -> T:
        self.session.add(entity)
        await self.session.flush()
        return entity

    # (7) 엔티티 삭제 (Delete)
    async def remove(self, entity: T) -> None:
        await self.session.delete(entity)
```

이제 도메인 레포지토리는 `BaseRepository`를 상속받은 뒤, 공통 헬퍼 메서드를 활용하면서 해당 도메인 고유의 복잡한 비즈니스 쿼리 패턴만 독립적으로 구현하면 됩니다.

```python
# app/domains/post/repository.py
from app.domains.post.models import PostEntity
from app.core.repository import BaseRepository

class PostRepository(BaseRepository[PostEntity]):
    def __init__(self, session: AsyncSession):
        super().__init__(model_class=PostEntity, session=session)

    # 포스트 도메인만의 특화 쿼리 구현
    async def list_by_author_id(self, author_id: int) -> List[PostEntity]:
        stmt = (
            select(PostEntity)
            .where(PostEntity.author_id == author_id)
            .order_by(PostEntity.created_at.desc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
```

모든 데이터 작업을 제네릭 클래스에 쑤셔 넣으려고 시도하면 안 됩니다. 복잡한 JOIN 쿼리, 집계 연산, 동적 필터링을 `BaseRepository`에 공통화 시키면 추상화가 너무 비대해져 오히려 가독성과 유연성이 망가집니다.

`BaseRepository`에는 오직 단순한 PK 단건 조회와 추가/삭제, 기본적인 헬퍼 수준의 연산만 남겨두고, 조금이라도 도메인 지식이나 특화 조건이 들어가는 쿼리는 반드시 각 도메인의 개별 레포지토리 내부에 직접 구현하는 것이 깔끔합니다.

---

## 요약

1. **SQLAlchemy 2.0 명세**: `Mapped`와 `mapped_column` 선언 방식을 적극 도입하여 강력한 컴파일 타임 타입 검사를 수행.
2. **비동기 세션 관리**: `AsyncSession`은 요청 단위로 격리하고, `yield` 컨텍스트 매니저를 통해 데이터베이스 세션 수명 주기를 안전하게 제어.
3. **Result 처리 메서드**: 단순 목록 조회에는 `.scalars().all()`, 안전한 고유 키 단건 조회에는 `.scalar_one_or_none()`, 집계 결과에는 `db.scalar()`
4. **즉시 로딩의 방향성**:
   * **Many-to-One / One-to-One**: 데이터 중복이 발생하지 않는 `joinedload`를 통해 단 1번의 조인 쿼리로 조회.
   * **One-to-Many / Many-to-Many**: Cartesian Product 중복 전송과 오버헤드를 막기 위해 `selectinload`를 활용하여 2번에 나누어 조회.
5. **Generic BaseRepository**: 단순 CRUD 및 `count()`, `get_one_or_none()`과 같은 보편적인 패턴은 상위 추상층으로 통일하고, 복잡한 비즈니스 쿼리는 도메인 레포지토리에 격리하여 개발.
