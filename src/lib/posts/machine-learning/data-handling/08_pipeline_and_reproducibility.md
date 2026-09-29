---
title: "08. 파이프라인과 재현성 (Pipeline and Reproducibility)"
description: "Scikit-learn 파이프라인 구성, 컬럼별 전처리와 시드 설정"
date: "2024-08-29"
hashtags: ["MachineLearning", "Pipeline", "Reproducibility"]
skills: ["Python", "Scikit-Learn"]
status: "published"
---

# 08. 파이프라인과 재현성

## 개요

모델을 학습할 때는 결측치 대체, 스케일링, 범주형 인코딩 같은 전처리가 함께 적용됩니다. 이 단계를 모델 코드와 따로 실행하면 Train에는 중앙값 대체를 하고 Validation에는 평균 대체를 하는 식으로 처리 기준이 달라질 수 있습니다. 전처리를 전체 데이터에 먼저 학습시키면 평가 데이터의 정보가 학습 과정으로 새어 들어가기도 합니다.

Scikit-learn의 Pipeline은 전처리 단계와 모델을 하나의 추정기로 묶습니다. Pipeline을 Train 데이터에 fit하면 각 전처리 규칙이 Train 안에서 학습되고, predict를 호출할 때에는 같은 규칙이 Validation·Test·운영 데이터에 적용됩니다. 교차 검증과 하이퍼파라미터 탐색에도 같은 객체를 전달할 수 있어 실험 절차를 일관되게 유지하기 좋습니다.

## Pipeline의 기본 구조

Pipeline은 이름과 변환기 또는 모델의 쌍을 순서대로 연결합니다. 중간 단계는 fit과 transform을 지원해야 하며, 마지막 단계는 보통 분류기나 회귀 모델입니다.

```python
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

model = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression(
        max_iter=1000,
        random_state=42,
    )),
])

model.fit(X_train, y_train)
valid_probability = model.predict_proba(X_valid)[:, 1]
```

위 코드에서 결측치 대체값과 평균·표준편차는 X_train으로만 계산됩니다. X_valid에는 이미 학습된 기준만 적용됩니다. 이렇게 하면 전처리와 예측을 한 경로로 수행하며 Train/Validation 간 불일치를 줄일 수 있습니다.

## 컬럼마다 다른 전처리

표 데이터에는 수치형과 범주형 피처가 함께 있는 경우가 많습니다. 숫자 피처는 중앙값 대체와 스케일링이 필요할 수 있고, 범주형 피처는 최빈값 대체와 One-Hot 인코딩이 필요합니다. ColumnTransformer는 컬럼 그룹마다 다른 Pipeline을 적용한 뒤 결과를 하나로 합칩니다.

```python
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import (
    OneHotEncoder,
    RobustScaler,
    StandardScaler,
)
from sklearn.linear_model import LogisticRegression

standard_columns = ["age", "active_days"]
robust_columns = ["monthly_spend", "session_seconds"]
category_columns = ["region", "device_type"]

preprocessor = ColumnTransformer(
    transformers=[
        (
            "standard",
            Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler()),
            ]),
            standard_columns,
        ),
        (
            "robust",
            Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", RobustScaler()),
            ]),
            robust_columns,
        ),
        (
            "category",
            Pipeline([
                ("imputer", SimpleImputer(
                    strategy="constant",
                    fill_value="unknown",
                )),
                ("onehot", OneHotEncoder(
                    handle_unknown="ignore",
                    min_frequency=10,
                )),
            ]),
            category_columns,
        ),
    ],
    remainder="drop",
)

model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(
        max_iter=1000,
        random_state=42,
    )),
])

model.fit(X_train, y_train)
valid_prediction = model.predict(X_valid)
```

여기서는 분포와 변수 의미를 고려해 두 수치형 그룹에 서로 다른 스케일러를 사용합니다. 각 컬럼은 지정한 변환 경로를 한 번 통과합니다. 같은 컬럼에 StandardScaler를 적용한 뒤 다시 RobustScaler를 적용하는 식으로 스케일러를 연달아 붙이는 것은 보통 의미가 없습니다. 첫 변환으로 이미 기준과 분포가 바뀌었기 때문입니다.

## 여러 스케일러를 비교하는 방법

여러 스케일러를 시험해 보고 싶다면 동일한 수치형 피처에 후보를 번갈아 적용하고 검증 점수를 비교합니다. GridSearchCV에 Pipeline을 전달하면 매 교차 검증 fold의 학습 부분에서만 스케일러가 fit되어 누수를 줄일 수 있습니다.

```python
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
from sklearn.linear_model import LogisticRegression

pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression(max_iter=1000)),
])

search = GridSearchCV(
    estimator=pipeline,
    param_grid={
        "scaler": [
            StandardScaler(),
            MinMaxScaler(),
            RobustScaler(),
        ],
        "classifier__C": [0.1, 1.0, 10.0],
    },
    scoring="roc_auc",
    cv=StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=42,
    ),
    n_jobs=-1,
)

search.fit(X_train, y_train)
print("선택된 설정:", search.best_params_)
print("교차 검증 점수:", search.best_score_)
```

이 예시는 하나의 전처리 경로에서 스케일러를 선택합니다. 앞서 본 ColumnTransformer 예시처럼 변수 그룹마다 서로 다른 스케일러를 쓰는 경우와는 목적이 다릅니다. 둘 다 가능하지만, 어떤 피처에 어떤 변환을 적용할지 실험 설계에서 명확히 해야 합니다. 최종 선택 뒤에는 별도 Test set에서 한 번 평가합니다.

## 불균형 처리도 Pipeline 안에서

SMOTE처럼 학습 샘플 수를 바꾸는 단계는 Scikit-learn의 일반 Pipeline 대신 imbalanced-learn의 Pipeline 안에 넣습니다. 교차 검증의 각 학습 fold에만 오버샘플링이 적용되므로 Validation fold에 합성 데이터가 섞이는 것을 막을 수 있습니다.

```python
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

model = ImbPipeline([
    ("scale", StandardScaler()),
    ("smote", SMOTE(random_state=42)),
    ("classifier", LogisticRegression(max_iter=1000)),
])
```

## 시드 설정

무작위성이 들어가는 데이터 분할, 교차 검증 fold 구성, 일부 모델 초기화, 데이터 증강에는 random_state나 seed를 설정합니다. 같은 seed로 분할과 모델 설정을 맞추면 코드 변경에 따른 차이를 비교하기 쉬워집니다. Scikit-learn에서는 전역 seed보다 각 함수나 추정기의 random_state를 명시하는 편이 설정 위치를 확인하기 쉽습니다.

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42,
)

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    n_jobs=-1,
)
```

NumPy나 Python의 random 모듈을 직접 호출하는 코드가 있다면 각 난수 생성기도 별도로 초기화해야 합니다. 딥러닝이나 GPU 연산, 병렬 처리에서는 라이브러리와 하드웨어에 따라 같은 seed를 줘도 결과가 완전히 같지 않을 수 있습니다. 따라서 seed 고정은 변동성을 줄이고 실험을 반복하기 위한 장치이지, 모든 환경에서 결과가 비트 단위로 동일하다는 보장은 아닙니다.

## 실험 기록

재현성을 위해 seed 하나만 저장해서는 부족합니다. 데이터 버전과 추출 기준일, Train/Validation/Test 분할 규칙, 피처 목록, 전처리와 모델 파라미터, 평가 지표, Python 및 주요 라이브러리 버전을 같이 기록합니다. 모델을 선택할 때 사용한 Validation 결과와 최종 Test 결과도 구분해서 남깁니다.

## 정리

Pipeline은 결측치 대체부터 인코딩·스케일링·모델까지 하나의 순서로 묶어 전처리 불일치와 누수를 줄입니다. ColumnTransformer를 사용하면 컬럼 그룹별로 다른 변환을 적용할 수 있고, 여러 스케일러는 같은 피처에 차례로 붙이기보다 후보별 검증이나 서로 다른 컬럼 그룹에 적용합니다. 난수 설정은 분할·교차 검증·모델 등 각 무작위 단계에 지정하고, 데이터와 실행 환경도 함께 기록해야 실험을 다시 비교할 수 있습니다.

## Q&A

> [!question] 스케일러를 여러 개 써도 되나요?
>
> 네. ColumnTransformer로 서로 다른 컬럼 그룹에 StandardScaler와 RobustScaler를 각각 적용할 수 있습니다. 같은 컬럼에 스케일러를 연속 적용하는 것보다, 후보 스케일러를 교차 검증에서 비교해 적절한 변환을 선택하는 편이 일반적입니다.

> [!question] Pipeline을 사용하면 데이터 누수가 완전히 사라지나요?
>
> 전처리를 Pipeline 안에 넣으면 전처리 단계가 fold별 Train에서 fit되므로 대표적인 누수를 막기 쉽습니다. 하지만 예측 시점 이후의 정보를 피처로 넣거나, 분할 전에 전체 데이터로 피처 선택을 하면 누수는 여전히 생길 수 있습니다.

> [!question] seed를 고정했는데도 결과가 달라질 수 있나요?
>
> 가능합니다. 병렬 연산, GPU, 라이브러리 버전, 난수 생성기를 별도로 쓰는 코드가 결과에 영향을 줄 수 있습니다. 실험 환경과 데이터 버전까지 기록하고, 필요하면 여러 seed로 성능의 변동 폭도 확인합니다.

본 포스팅은 개인적인 학습 내용을 바탕으로 작성되었으며, 가독성과 내용 보완을 위해 생성형 AI의 도움을 받아 재작성되었습니다.
