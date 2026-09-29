---
title: "01. 데이터 분할과 데이터 누수 (Data Splitting and Leakage)"
description: "Train/Validation/Test 분리와 누수 방지"
date: "2024-08-29"
hashtags: ["MachineLearning", "Preprocessing", "DataSplitting", "DataLeakage"]
skills: ["Machine Learning", "Python", "Scikit-Learn"]
status: "published"
---

# 01. 데이터 분할과 데이터 누수

모델을 학습하기 전에 먼저 정해야 할 것은 데이터를 어떻게 나누고, 어떤 시점의 정보를 예측에 사용할지입니다. 이 기준이 흐릿하면 모델이 학습 중에 정답에 가까운 정보를 미리 보게 됩니다. 평가 점수는 높아져도 실제 서비스에서는 같은 성능을 내지 못하는데, 이런 문제를 **데이터 누수(Data Leakage)**라고 합니다.

구매 예측 문제를 예로 들어보겠습니다. 특정 시점에 사용자의 활동 정보를 보고 다음 패키지 구매 여부를 예측한다면, 결제 이후에 생성된 정보를 피처로 넣어서는 안 됩니다. 또 전처리 통계량을 전체 데이터에서 계산하면 평가 데이터의 분포가 학습 과정에 들어갑니다. 분할은 단순한 데이터 정리 단계가 아니라, 실제 예측 상황을 재현하기 위한 평가 설계입니다.

---

## Train, Validation, Test

데이터를 세 부분으로 나누는 이유는 모델을 학습하는 일과 모델을 고르는 일, 마지막 성능을 확인하는 일을 분리하기 위해서입니다.

| 구분 | 사용하는 목적 |
| --- | --- |
| Train | 모델 파라미터와 전처리 규칙을 학습 |
| Validation | 모델·파라미터·분류 기준을 선택 |
| Test | 선택을 마친 모델의 최종 일반화 성능 확인 |

예를 들어 구매 예측에서 여러 알고리즘과 불균형 처리 방법을 비교한다면, 그 선택은 Validation 결과를 바탕으로 합니다. Test를 매번 확인하며 설정을 바꾸면 Test에 맞춰 모델을 고르게 되어 마지막 평가가 더 이상 독립적이지 않습니다.

분류 문제에서는 데이터를 먼저 Train/Validation/Test로 나눈 뒤, 후보 모델과 threshold를 Validation에서 선택하고 Test는 최종 성능 확인에 사용합니다.

---

## 데이터 분할

분류 데이터는 무작위로 나누는 것만으로 클래스 비율이 크게 달라질 수 있습니다. 구매자 비율이 낮은 데이터라면 한쪽 분할에 구매자가 충분히 들어가지 않을 수도 있으므로 `stratify=y`로 타깃 비율을 유지합니다.

아래 코드는 전체 데이터의 60%를 Train, 20%를 Validation, 20%를 Test로 나눕니다.

```python
from sklearn.model_selection import train_test_split

# 먼저 Test를 분리한다.
X_train_valid, X_test, y_train_valid, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42,
)

# 남은 80%에서 전체 데이터 기준 20%에 해당하는 Validation을 분리한다.
X_train, X_valid, y_train, y_valid = train_test_split(
    X_train_valid,
    y_train_valid,
    test_size=0.25,
    stratify=y_train_valid,
    random_state=42,
)
```

두 번째 분할의 `test_size`가 0.25인 이유는 남은 80%의 4분의 1이 전체 데이터의 20%이기 때문입니다. `random_state`는 분할을 재현하기 위한 값입니다. 값을 고정해도 데이터가 대표성을 가진다는 뜻은 아니므로, 필요하다면 여러 seed나 교차 검증으로 분할에 따른 변동을 함께 확인해야 합니다.

---

## 분할 기준

행이 서로 독립적이지 않다면 행 단위 무작위 분할이 적절하지 않을 수 있습니다. 같은 사용자에게서 여러 시점의 로그가 만들어졌는데 일부 로그는 Train, 나머지는 Test에 들어가면 모델이 사용자의 고유한 특성을 이미 본 셈이 됩니다. 실제 신규 사용자에게 적용할 때보다 점수가 부풀려질 수 있습니다.

### 그룹 데이터

평가 목적이 처음 보는 사용자에 대한 예측이라면 사용자 단위로 분리합니다. 아래 예시는 한 사용자의 행이 Train과 Test에 섞이지 않도록 그룹 기준으로 나누는 형태입니다.

```python
from sklearn.model_selection import GroupShuffleSplit

splitter = GroupShuffleSplit(
    n_splits=1,
    test_size=0.2,
    random_state=42,
)

train_idx, test_idx = next(
    splitter.split(X, y, groups=user_ids)
)

X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
```

반면 동일한 사용자의 과거 기록으로 그 사용자의 미래 행동을 예측하는 것이 목적이라면, 사용자 자체를 분리하는 것보다 시점 기준 분리가 맞을 수 있습니다. 어떤 분할을 선택할지는 데이터 형식보다 **운영에서 누구의 어떤 시점에 예측할 것인지**에 따라 결정해야 합니다.

### 시계열 데이터

과거 기록으로 미래 결과를 예측하는 문제에서는 미래 행을 Train에 넣지 않습니다. 예측 기준일을 정하고 그 이전 데이터를 학습, 이후 데이터를 평가에 사용합니다.

```python
train = df[df["event_date"] < "2025-01-01"]
valid = df[
    (df["event_date"] >= "2025-01-01")
    & (df["event_date"] < "2025-02-01")
]
test = df[df["event_date"] >= "2025-02-01"]
```

최근 N일 활동량 같은 피처를 만들 때에도 집계 종료 시점이 예측 기준일을 넘지 않는지 확인해야 합니다. 예측일 이후의 로그를 포함한 rolling 집계는 시간 누수입니다.

---

## 전처리 누수

평균 대체나 표준화에 필요한 통계량은 데이터에서 학습되는 값입니다. 전체 데이터의 평균과 표준편차를 구한 뒤 Train만 학습시키면 Validation과 Test의 정보가 전처리 규칙에 반영됩니다.

```python
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

pipeline = make_pipeline(
    SimpleImputer(strategy="median"),
    StandardScaler(),
    LogisticRegression(max_iter=1000),
)

pipeline.fit(X_train, y_train)
valid_probability = pipeline.predict_proba(X_valid)[:, 1]
```

Pipeline을 사용하면 각 전처리 단계의 `fit`은 Train에서만 실행되고, Validation이나 Test에는 학습된 규칙의 `transform`만 적용됩니다. 스케일링이나 결측치 대체처럼 통계량을 계산하는 작업뿐 아니라, 피처 선택과 인코딩도 같은 원칙을 따라야 합니다.

---

## 리샘플링 누수

구매 예측처럼 양성 클래스가 상대적으로 적은 문제에서는 SMOTE로 Train의 소수 클래스를 보강할 수 있습니다. 다만 Train과 Validation을 나누기 전에 전체 데이터에 SMOTE를 적용하면 합성 샘플 생성 과정에 Validation 정보가 섞일 수 있습니다.

교차 검증을 할 때도 리샘플링은 각 학습 fold 안에서만 수행해야 합니다. `imblearn`의 Pipeline은 fold마다 학습 부분에만 SMOTE를 적용하도록 구성할 수 있습니다.

```python
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier

model = Pipeline([
    ("scale", StandardScaler()),
    ("smote", SMOTE(random_state=42)),
    ("classifier", XGBClassifier(
        n_estimators=300,
        max_depth=5,
        learning_rate=0.05,
        eval_metric="logloss",
        random_state=42,
    )),
])

model.fit(X_train, y_train)
valid_probability = model.predict_proba(X_valid)[:, 1]
```

실무 데이터의 불균형 처리에서는 SMOTE만 선택지인 것은 아닙니다. 원본 학습, class weight, SMOTE를 같은 검증 기준으로 비교하고, Test는 최종으로 선택된 설정을 평가하는 데 남겨둡니다. 핵심은 어떤 방법을 쓰더라도 평가 데이터가 학습이나 샘플 생성에 관여하지 않도록 경계를 지키는 것입니다.

---

## 누수 점검

점수가 예상보다 지나치게 높거나, Train과 실제 운영 성능 차이가 크다면 분할과 피처 생성 과정을 다시 살펴볼 필요가 있습니다. 다음 질문이 유용합니다.

이 피처는 실제 예측 시점에 알 수 있는 값인가? 같은 사용자나 그룹의 정보가 Train과 평가 데이터에 함께 들어갔는가? 결측치 대체, 스케일링, 인코딩, 피처 선택을 Train에서만 학습했는가? SMOTE나 다른 리샘플링을 분할 전에 적용하지 않았는가? 시간 데이터라면 미래의 로그가 과거 예측 피처에 들어가지 않았는가? Test 결과를 반복해서 보고 모델 설정을 바꾸지 않았는가?

체크리스트 자체보다 중요한 것은 평가 데이터가 운영 상황에서의 미관측 데이터를 얼마나 잘 대표하는지 설명할 수 있는가입니다.

---

## 정리

데이터 분할은 모델 평가를 위한 형식적 절차가 아니라, 실제 예측 시나리오를 재현하는 과정입니다. 무작위 분할이 적합한지, 사용자나 시간 기준으로 나눠야 하는지는 데이터의 구조와 운영 목표에 달려 있습니다.

전처리 통계량은 Train에서만 학습하고, Validation은 모델과 threshold 선택에, Test는 최종 확인에 사용합니다. SMOTE 같은 리샘플링도 학습 데이터 내부에서만 적용해야 평가 성능이 현실을 반영합니다.

### Q&A

> [!question] 데이터가 적은데 Train, Validation, Test를 모두 나눠야 하나요?
>
> 데이터가 충분하지 않다면 교차 검증으로 Train/Validation 역할을 반복 수행하고, 최종 평가용 데이터를 별도로 유지할 수 있습니다. 다만 Test를 여러 번 확인하며 설정을 고르면 독립 평가의 의미가 약해지므로, 데이터가 적을수록 평가 계획을 먼저 정하는 것이 중요합니다.

> [!question] SMOTE는 왜 Train에만 적용해야 하나요?
>
> SMOTE는 기존 소수 클래스 샘플 사이를 보간해 합성 샘플을 만듭니다. Validation이나 Test까지 포함해 먼저 적용하면 평가 데이터의 분포와 샘플이 학습에 영향을 줄 수 있어 실제보다 점수가 높게 측정될 수 있습니다.

> [!question] 분류 문제에서 항상 stratify를 사용하면 되나요?
>
> 클래스 비율을 유지하는 것이 목적이라면 유용하지만, 시간 순서나 사용자 그룹 구조가 더 중요한 데이터에서는 무작위 층화 분할이 평가 목적을 왜곡할 수 있습니다. 먼저 운영 상황을 재현하는 분할 기준을 정하고, 그 기준 안에서 클래스 비율을 고려해야 합니다.

본 포스팅은 개인적인 학습 내용을 바탕으로 작성되었으며, 가독성과 내용 보완을 위해 생성형 AI의 도움을 받아 재작성되었습니다.
