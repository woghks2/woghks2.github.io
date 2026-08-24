---
title: "4. Pydantic"
description: "Pydantic v2의 직렬화, 역직렬화, ORM 변환 및 Validation"
date: "2025-12-29"
hashtags: ["FastAPI", "Pydantic", "Serialization", "Validation"]
skills: ["FastAPI", "Python", "Pydantic"]
status: "published"
---

# 4. Pydantic Schema와 데이터 타입 검증

FastAPI는 API의 입력과 출력을 정의하고 검증하기 위해 Python의 가장 대중적인 데이터 검증 라이브러리인 **Pydantic**을 채택하고 있습니다.
특히 FastAPI의 최신 버전들은 Rust로 코어가 재작성되어 기존 v1 대비 최대 수십 배의 성능 향상을 이뤄낸 **Pydantic v2**를 기반으로 동작합니다.

단순히 `BaseModel`을 상속받아 타입을 적는 기초적인 사용법을 넘어, Validation 및 Serialization에 대해서 정리해 보겠습니다.

---

## 1. Pydantic V2 핵심 변화점

Pydantic은 Raw Data의 형태를 검사할 뿐만 아니라, 정의된 타입 힌트에 맞춰 타입을 정제하고 강제 변환하는 Data Cleaning을 수행합니다. 

### Pydantic V2의 주요 변경 사항

1. **Rust 기반 pydantic-core 도입 (PyO3)**:
   - 데이터 검증 및 파싱의 핵심 로직이 Rust 언어로 재작성되었습니다. 대용량 데이터나 중첩 구조의 모델을 검증할 때 V1 대비 4~50배 이상의 성능 향상을 보입니다.
2. **Strict vs Lax 모드 지원**:
   - **Lax 모드 (기본값)**: 유연한 타입 변환(Coercion)을 허용합니다 (예: 문자열 `"123"`을 `int` 123으로, `"true"`를 `bool` True로 캐스팅).
   - **Strict 모드**: 타입 변환을 전혀 허용하지 않고, 정확히 일치하는 타입만 허용합니다 (`ConfigDict(strict=True)` 또는 개별 필드 선언 시 `Field(strict=True)`로 설정 가능).
3. **핵심 API 네이밍 변경**:
   - `dict()` ➡️ `model_dump()`
   - `json()` ➡️ `model_dump_json()`
   - `parse_obj()` ➡️ `model_validate()`
   - `parse_raw()` ➡️ `model_validate_json()`
   - `@root_validator` ➡️ `@model_validator`
   - `update_forward_refs()` ➡️ `model_rebuild()`
   - `class Config:` ➡️ `model_config = ConfigDict(...)`
4. **Annotated 패턴 적극 도입**:
   - 타입 힌트에 메타데이터와 검증 로직을 결합할 수 있게 되었습니다 (`Annotated[int, AfterValidator(is_even)]`). 이를 통해 가독성과 유효성 검증 로직의 재사용성이 획기적으로 늘어났습니다.

---

## 2. Serialization & Deserialization

### 2.1 역직렬화 (Deserialization / Parsing)
사전(dict) 데이터나 JSON 문자열을 Pydantic 객체로 변환하여 런타임 타입 검사를 수행하는 과정입니다.

```python
from pydantic import BaseModel

class UserProfile(BaseModel):
    id: int
    username: str
    is_active: bool

# 1. dict 데이터 파싱: raw_dict를 UserProfile 객체로 변환 (모델 스펙과 맞지 않으면 ValidationError 발생)
raw_dict = {"id": 1, "username": "admin", "is_active": True}
user = UserProfile.model_validate(raw_dict)

# 2. JSON 문자열 파싱 (Rust 엔진이 네이티브 파싱하여 초고속 처리)
json_str = '{"id": 2, "username": "guest", "is_active": false}' # (문자열에서 형식 맞으면 JSON)
user_from_json = UserProfile.model_validate_json(json_str)
```

### 2.2 직렬화 (Serialization / Exporting)
Pydantic 객체를 Python dict 또는 JSON 문자열 형태로 내보내는 작업입니다.

```python
import datetime
from uuid import UUID, uuid4
from pydantic import BaseModel

class PostDetail(BaseModel):
    id: UUID
    title: str
    created_at: datetime.datetime

post = PostDetail(id=uuid4(), title="FastAPI 입문", created_at=datetime.datetime.now())

# 1. model_dump(): Python dict로 변환
# standard mode: UUID, datetime 객체가 그대로 Python 네이티브 타입으로 유지됨
print(post.model_dump(mode="python"))
# Output: {'id': UUID('...'), 'title': 'FastAPI 입문', 'created_at': datetime.datetime(...)}

# json mode: UUID, datetime이 JSON 표준 규격(ISO 문자열 등)으로 즉시 변환됨 (실무 필수)
print(post.model_dump(mode="json"))
# Output: {'id': '6ecdba1c-...', 'title': 'FastAPI 입문', 'created_at': '2026-06-08T15:00:00...'}

# 2. model_dump_json(): JSON 문자열로 즉시 직렬화
print(post.model_dump_json())
# Output: '{"id":"6ecdba1c-...","title":"FastAPI 입문","created_at":"2026-06-08T15:00:00"}'
```

### 2.3 직렬화 고급 옵션

직렬화 메서드 호출 시 다양한 필터링 옵션을 줄 수 있습니다.

```python
user.model_dump(
    by_alias=True,           # 스키마 필드명이 아닌 serialization_alias를 사용해 출력
    exclude={'password'},    # 특정 필드를 결과물에서 제외
    include={'id', 'email'}, # 특정 필드만 포함하여 결과물 생성
    exclude_none=True,       # None 값을 가진 필드는 완전히 제거
    exclude_unset=True,      # 클라이언트 요청 시 명시적으로 주어지지 않은(기본값 사용) 필드 제거
    exclude_defaults=True    # 스키마 정의 시 설정한 기본값과 완벽히 동일한 필드 제거
)
```

### 2.4 커스텀 Serializer 구현

특정 필드의 직렬화 로직을 세밀하게 재정의해야 할 때 사용합니다. `@field_serializer`와 `@model_serializer` 두 가지 방식을 지원합니다.

* @field_serializer: 특정 필드 단위 직렬화 커스텀: `@field_serializer` 데코레이터를 사용하여 특정 필드의 직렬화 로직을 재정의합니다.

* @model_serializer: 전체 모델 단위 직렬화 커스텀: `@model_serializer` 데코레이터를 사용하여 전체 모델의 직렬화 로직을 재정의합니다.
 
```python
import datetime
from pydantic import BaseModel, field_serializer, model_serializer

class UserSecret(BaseModel):
    id: int
    name: str
    birth_date: datetime.date

    # 1. 특정 필드 단위 직렬화 커스텀 (@field_serializer)
    @field_serializer("birth_date", mode="plain")
    def serialize_birth(self, value: datetime.date) -> str:
        return value.strftime("%Y/%m/%d")  # datetime.date 객체를 YYYY/MM/DD 형식의 문자열로 변환

    # 2. 전체 모델 단위 직렬화 커스텀 (@model_serializer)
    @model_serializer(mode="wrap")
    def serialize_model(self, handler) -> dict:
        data = handler(self)  # 기본 직렬화 수행 결과 획득
        data["formatted_name"] = f"Mr/Ms. {self.name}"  # 파생 필드 동적 주입
        return data # 새로운 formatted_name 필드 추가
```

### 2.5 Alias 분리 (Validation vs Serialization)

Pydantic V2에서는 필드를 입력받을 때 이름(Validation)과 외부로 출력할 때 이름(Serialization)을 서로 다르게 분리해 설정할 수 있습니다.

```python
from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel

class OrderInfo(BaseModel):
    # 입력(Request)은 'id'로 받고, 출력(Response)은 'orderId'로 내보냅니다.
    order_id: int = Field(validation_alias="id", serialization_alias="orderId")

class CustomBaseModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
```

* CustomBaseModel을 상속받는 모든 모델은 자동으로 카멜 케이스 필드 매핑 및 ORM Entity 변환을 지원합니다.

## 3. ORM Entity에서 Pydantic Schema로의 변환

FastAPI 개발 시 데이터베이스에서 긁어온 ORM 객체를 Pydantic DTO로 변환하여 JSON 응답으로 반환하게 됩니다.

Pydantic V2에서는 `model_config = ConfigDict(from_attributes=True)` 설정을 활성화하여 이를 구현합니다. (V1의 `orm_mode = True`가 명칭이 변경되었습니다).

```python
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class UserEntity(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    email = Column(String(100))

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # ORM 객체 매핑 허용
    
    id: int
    username: str
    email: str

# 데이터베이스 조회 결과인 Entity 객체를 model validate를 사용해서 DTO로 즉시 변환
orm_user = UserEntity(id=42, username="orm_master", email="orm@db.com")
pydantic_user = UserResponse.model_validate(orm_user)
```

> [!WARNING]
> Lazy Loading 및 MissingGreenlet 에러 주의
> 스키마 내부 필드에 관계형 필드(예: `comments: list[CommentSchema]`)가 정의되어 있을 경우, 반드시 SQLAlchemy 쿼리 시점에 `selectinload` 혹은 `joinedload`를 통해 연관 테이블 데이터를 미리 긁어와야 합니다. 즉시 로딩 처리 없이 Pydantic DTO 변환(`model_validate`)을 시도하면 세션이 닫힌 시점이거나 비동기 루프 내에서 동기식 I/O 호출이 이루어져 `MissingGreenlet` 에러가 발생합니다.

---

## 4. Validators 심화 (Field & Model Validator)

유효성 검증 로직은 크게 필드 단위(`field_validator`)와 모델 전체 단위(`model_validator`)로 나뉘며, Annotated와 데코레이터 방식을 적재적소에 배분해야 합니다.

### 4.1 필드 단위 검증의 4가지 실행 모드 (`mode`)

`@field_validator` 및 `Annotated` 검증 기법은 4가지 세부 실행 시점을 지원합니다.

1. **`mode="after"` (기본값 / 강력 권장)**: Pydantic의 타입 강제 변환(Coercion)이 무사히 성공한 직후에 커스텀 검증 함수를 실행합니다. 입력 매개변수의 타입이 이미 확정된 상태이므로 타입 안전성이 완벽합니다.
2. **`mode="before"`**: 타입 변환 등이 일어나기 이전의 원시 입력 데이터(`Any`) 상태에서 검증하거나 데이터를 미리 전처리(예: 공백 제거, 소문자화)할 때 유용합니다.
3. **`mode="plain"`**: Pydantic의 내장 타입 검증 과정을 완전히 우회하고 처음부터 끝까지 개발자가 작성한 커스텀 함수로만 검증을 진행합니다.
4. **`mode="wrap"`**: Pydantic 내부 검증기의 실행 전후를 감싸서(`wrapping`) 예외를 가로채거나, 검증 실패 시 기본값을 반환하는 등의 유연한 복구 로직을 구현할 수 있습니다.

```python
from typing import Any
from pydantic import BaseModel, ConfigDict, field_validator

class CustomBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    # 부모 클래스에 자주 쓰는 검증/전처리 로직을 static method로 선언
    @staticmethod
    def strip_space(v: Any) -> Any:
        return v.strip() if isinstance(v, str) else v

    @staticmethod
    def validate_min_length(v: str, min_len: int, field_name: str) -> str:
        if len(v) < min_len:
            raise ValueError(f"{field_name}은(는) 최소 {min_len}자 이상이어야 합니다.")
        return v


# -------------------------------------------------------------
# 자식 클래스
# -------------------------------------------------------------
class UserRegisterRequest(CustomBaseModel): # 부모의 static method 상속
    username: str
    nickname: str

    # 1. 공백 제거 도구 가져다 쓰기
    @field_validator("username", "nickname", mode="before")
    @classmethod
    def trim_inputs(cls, v: Any) -> Any:
        return cls.strip_space(v)  # 부모의 staticmethod 호출!

    # 2. 글자 수 검증 도구 가져다 쓰기
    @field_validator("nickname", mode="after")
    @classmethod
    def check_nickname(cls, v: str) -> str:
        return cls.validate_min_length(v, min_len=2, field_name="닉네임")
```

> [!TIP]
> **Annotated vs Decorator 선택 기준**
> - **Annotated**: 이메일 포맷 체크, 양수 체크 등 도메인 전반에 걸쳐 공통적으로 반복 적용되는 검증은 Annotated 타입으로 한 번 정의하고 여러 모델에서 재사용하는 것이 생산성에 좋습니다.
> - **Decorator**: 특정 API 스키마 내부에서만 1회성으로 사용되는 세부적인 도메인 규칙은 `@field_validator`를 사용하는 것이 파일 내부의 가독성을 높입니다.

### 4.2 모델 수준 검증 (`@model_validator`)
비밀번호와 비밀번호 확인 값이 같은지 비교하는 등, 여러 필드의 값을 종합적으로 교차 체크할 때 사용합니다.

```python
from pydantic import BaseModel, model_validator
from typing_extensions import Self

class UserSignupRequest(BaseModel):
    password: str
    password_confirm: str

    @model_validator(mode="after")
    def check_passwords_match(self) -> Self:
        # self를 통해 타입 검증이 모두 끝난 필드 데이터에 동시 접근
        if self.password != self.password_confirm:
            raise ValueError("입력하신 두 비밀번호가 일치하지 않습니다.")
        return self  # 반드시 self를 반환해야 합니다.
```

---

## 5️. Computed Fields

Pydantic V2에 도입된 `@computed_field`는 객체의 고유 속성을 기반으로 동적으로 계산되는 파생 값을 정의할 때 매우 유용합니다. `@property`와 조합하여 사용하며, 직렬화 시 자동으로 포함되고 OpenAPI JSON 스키마 명세에도 반영됩니다.

```python
from pydantic import BaseModel, computed_field

class Product(BaseModel):
    name: str
    price: float
    discount_rate: float

    # 계산된 필드는 properties처럼 다룰 수 있으며 JSON 직렬화 결과에 포함됩니다.
    # property만 사용하는 경우, model_dump() 사용 시 필드가 사라지지만, computed_field의 경우 사라지지 않는다.
    @computed_field
    @property
    def sale_price(self) -> float:
        return self.price * (1 - self.discount_rate)
```

---

## 6. Model Config (ConfigDict)

모델의 동작 전반에 대한 정책을 규정하는 핵심 설정 오브젝트입니다.

```python
from pydantic import BaseModel, ConfigDict

class StrictImmutableModel(BaseModel):
    model_config = ConfigDict(
        extra="forbid",             # 정의되지 않은 추가 필드 입력 시 validation error 발생 (보안 강화)
        validate_default=True,      # 디폴트 값(default=...)에 대해서도 엄격하게 validation 진행
        frozen=True,                # 모델 인스턴스 생성 후 속성 변경 불가 (Immutable 객체로 지정)
        str_strip_whitespace=True,  # 모든 문자열 필드의 앞뒤 공백 자동 제거
        from_attributes=True,       # ORM Entity 매핑 기능 활성화
        arbitrary_types_allowed=True # 외부 라이브러리 객체 등 임의의 인스턴스 타입 허용
    )
```

---

## 7. Plain Dataclass vs Pydantic Dataclass

파이썬 기본 내장인 `dataclasses` 라이브러리와 Pydantic을 결합하여 경량 컨테이너를 설계할 수 있습니다.

### 7.1 세부 기능 및 비교표

| 비교 항목 | Plain Dataclass (`dataclasses.dataclass`) | Pydantic Dataclass (`pydantic.dataclasses.dataclass`) | BaseModel (`pydantic.BaseModel`) |
| :--- | :--- | :--- | :--- |
| **의존성** | 파이썬 표준 라이브러리 (외부 의존성 없음) | Pydantic 설치 필요 | Pydantic 설치 필요 |
| **런타임 타입 검사** | 없음 (정적 분석 툴에서만 타입 힌트 체크) | 제공 (Pydantic의 모든 `Field` 및 `Validator` 동작) | 가장 강력하게 제공 |
| **속도 및 성능 (생성)** | **가장 빠름** (오버헤드 제로) | 약 6배 내외 더 느림 (Validation 엔진 가동) | 데이터가 많을수록 오버헤드 발생 |
| **메모리 오버헤드** | **매우 적음** (초경량) | Pydantic 엔진 메타데이터로 인해 메모리 증가 | 메타데이터 구조로 메모리 사용량 큼 |
| **직렬화 (Serialization)** | `asdict()`, `astuple()` (datetime 등의 호환 보장 X) | `TypeAdapter`를 통한 `dump_python()`, `dump_json()` 사용 | `model_dump()`, `model_dump_json()`의 최적 옵션 제공 |
| **Computed Fields** | `@property` 수동 구현 (직렬화 자동 포함 불가) | `@property` 지원 | `@computed_field`를 통한 JSON 직렬화 연동 |
| **기본 Mutability** | 가변 객체 (기본값) | 가변 객체 (기본값) | **불변 객체 권장** (`frozen=True`) |

### 7.2 실무 선택 및 의사결정 가이드

> [!NOTE]
> - **이미 신뢰도가 높은 내부 시스템끼리 데이터를 주고받을 때** ➡️ **Plain Dataclass** 사용(가벼움).
>   - 예: 이미 API 단에서 완벽히 검증을 마치고 비즈니스 로직(Service, Repository) 내부에서만 움직이는 순수한 데이터 묶음, 설정값 상자, 스크립트용 DTO.
>   - 런타임 밸리데이션 오버헤드가 없기 때문에 루프 안에서 수십만 번 객체를 재생성하더라도 성능 저하가 없습니다.
> - **시스템의 경계(Boundary)에 가깝거나, 데이터 무결성이 강력히 요구될 때** ➡️ **Pydantic Dataclass** 또는 **BaseModel**이 적합합니다.
>   - 예: 외부 API 요청 바디, 설정 파일 파싱 로직, 동적 JSON 스키마 생성이 필요한 도메인 구조물.

### 7.3 코드 구현 비교

#### 1. Plain Dataclass (경량 내부 데이터 묶음용)
```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass(frozen=True)  # 내부용은 데이터 부작용 최소화를 위해 immutable 지정을 권장합니다.
class InternalUserDTO:
    user_id: int
    name: str
    roles: list[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)

    @property
    def is_admin(self) -> bool:
        return "admin" in self.roles
```

#### 2. Pydantic Dataclass (타입 검증 및 직렬화 편의 기능이 융합된 DTO)
```python
from pydantic.dataclasses import dataclass
from pydantic import ConfigDict, Field

@dataclass(config=ConfigDict(frozen=True, validate_default=True))
class UserDTO:
    user_id: int
    name: str = Field(min_length=2)
    roles: list[str] = Field(default_factory=list)
```

Pydantic dataclass는 `BaseModel`을 상속하지 않으므로 인스턴스에 `model_dump()` 메서드가 직접 생기지는 않습니다. 직렬화가 필요하다면 `TypeAdapter`를 감싸서 사용합니다.

```python
from pydantic import TypeAdapter

adapter = TypeAdapter(UserDTO)
payload = adapter.dump_python(UserDTO(user_id=1, name="admin"))
```

---

## 요약

1. **Pydantic V2 핵심 변화**: Rust 엔진 도입으로 속도가 극대화되었으며, Lax/Strict 모드 선택, `model_config = ConfigDict(...)` 설정 및 Annotated 기반 검증 패턴을 활용.
2. **역직렬화와 직렬화**: 역직렬화 시 `model_validate_json`을, 직렬화 시 `model_dump(mode="json")`을 사용하여 JSON 호환 포맷으로 쉽게 가공하며, `@field_serializer`로 세부 처리를 커스텀.
3. **ORM 매핑과 지연 로딩 방지**: `from_attributes=True` 사용 시 연관 관계를 스키마에 정의했다면 데이터베이스 쿼리 레벨에서 반드시 즉시 로딩(`selectinload` 등) 처리를 하여 런타임 예외를 방지.
4. **유효성 검사**: 간단한 필드는 `Annotated`와 `Before/AfterValidator`로 컴포넌트화하여 재사용하고, 객체 수준의 크로스 필딩 검사는 `@model_validator`를 적용.
5. **Dataclass의 적절한 채택**:
   - 이미 검증된 데이터에 대한 고속 내부 이동이나 메모리 절약이 최우선 목표라면 **Plain Dataclass**를 채택.
   - 외부 접점과의 유효성 검사나 풍부한 직렬화 기능이 융합된 컨테이너가 필요하다면 **Pydantic Dataclass** 또는 **BaseModel**을 채택.
