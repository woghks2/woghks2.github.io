---
title: "06. 피처 인코딩 (Feature Encoding)"
description: "범주형 변수의 구조에 맞는 인코딩과 누수 방지"
date: "2024-08-29"
hashtags: ["MachineLearning", "Preprocessing", "Encoding"]
skills: ["Python", "Pandas", "Scikit-Learn"]
status: "published"
---

# 06. 피처 인코딩

## 개요

지역, 상품 종류, 결제 수단처럼 값이 이름이나 종류로 표현된 변수를 범주형 변수라고 합니다. 대부분의 머신러닝 모델은 범주 이름을 그대로 계산하지 못하므로 숫자 표현으로 바꿔야 합니다. 이 과정이 인코딩입니다.

인코딩에서 중요한 점은 숫자를 부여하는 순간 범주 사이의 순서나 거리에 대한 가정이 생긴다는 것입니다. 색상에 빨강=0, 파랑=1, 초록=2를 부여하면 순서가 없는 색상에 크기 관계를 만든 셈입니다. 변수에 실제 순서가 있는지, 모델이 숫자값을 어떻게 해석하는지 먼저 확인해야 합니다.

## One-Hot Encoding

지역이나 결제 수단처럼 순서가 없는 명목형 변수에는 One-Hot Encoding이 기본 선택지입니다. 범주마다 열을 만들고 해당 범주에만 1을 표시합니다. 각 범주를 독립된 표시로 표현하기 때문에 숫자의 크기가 잘못된 서열로 해석되는 문제를 피할 수 있습니다.

```python
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(
    handle_unknown="ignore",
    min_frequency=10,
    sparse_output=False,
)

X_train_encoded = encoder.fit_transform(X_train[["payment_type"]])
X_valid_encoded = encoder.transform(X_valid[["payment_type"]])
```

범주가 많으면 열 수가 급격히 늘어납니다. 상품 ID가 수만 종류라면 메모리와 계산 비용이 커질 수 있습니다. 빈도가 낮은 범주를 기타로 묶거나, 빈도 인코딩·해시 인코딩·Target Encoding을 비교할 수 있습니다. 새 범주가 운영 중 등장할 가능성도 고려해 미관측 범주 처리 규칙을 정합니다.

모든 범주 열을 만들면 절편이 있는 비규제 선형 회귀에서 열 사이에 완전한 선형 종속이 생길 수 있어 첫 범주를 빼기도 합니다. 하지만 drop-first가 모든 알고리즘에 필요한 것은 아닙니다. 규제화 모델이나 트리 모델에서는 전체 열을 두는 설정도 사용할 수 있으므로 모델별로 결정합니다.

## Ordinal Encoding

만족도 낮음·보통·높음처럼 순서가 있는 범주에는 Ordinal Encoding을 사용할 수 있습니다. 순서를 직접 지정해 낮음=0, 보통=1, 높음=2처럼 표현합니다.

```python
from sklearn.preprocessing import OrdinalEncoder

encoder = OrdinalEncoder(
    categories=[["낮음", "보통", "높음"]],
    handle_unknown="use_encoded_value",
    unknown_value=-1,
)

X_train_encoded = encoder.fit_transform(X_train[["satisfaction"]])
X_valid_encoded = encoder.transform(X_valid[["satisfaction"]])
```

이 방법은 순서를 보존하지만 낮음에서 보통으로 가는 차이와 보통에서 높음으로 가는 차이가 같다는 가정을 수치 모델에 전달합니다. 그 가정이 적절하지 않다면 One-Hot과 성능을 비교해야 합니다. 순서가 없는 변수에 알파벳 순서대로 숫자를 부여하는 것은 Ordinal Encoding이 아닙니다.

## Label Encoding과 트리 모델

Label Encoding은 범주에 정수 ID를 붙이는 방식입니다. 입력 변수에 적용하면 범주 사이에 숫자 순서가 생깁니다. 일부 트리 모델은 숫자 임계값으로 나누기 때문에 코드값의 순서에 영향을 받을 수 있습니다. 범주형 변수를 지원하는 모델은 해당 기능을 쓰고, 정수 코드를 입력해야 하는 경우에는 라이브러리가 이를 범주로 처리하는지 확인해야 합니다.

Scikit-learn의 LabelEncoder는 보통 입력 피처보다 타깃 레이블을 정수로 바꿀 때 사용합니다. 입력 피처의 순서를 지정하려면 OrdinalEncoder가 더 알맞습니다.

## Target Encoding

Target Encoding은 범주별 타깃 평균을 수치 피처로 사용합니다. 범주 수가 매우 많은 변수를 낮은 차원으로 표현할 수 있지만, 정답 정보를 인코딩에 직접 사용하므로 누수 위험이 큽니다. 전체 데이터의 범주별 평균을 구하면 각 행의 타깃이 자기 피처값 계산에 포함될 수 있습니다.

학습 데이터 안에서 교차 검증 방식으로 인코딩 값을 만들고, 표본 수가 적은 범주는 전체 평균 쪽으로 완화하는 smoothing을 적용합니다. Validation과 Test에는 Train에서 계산한 통계만 적용해야 합니다.

## 구간화

연속형 값을 구간으로 나누는 것도 범주화 방법입니다. Pandas의 cut은 정한 경계나 같은 폭의 구간을 만들고, qcut은 분위수를 이용해 각 구간의 표본 수를 비슷하게 맞춥니다. 구간화는 비선형 관계를 표현하기 쉽지만, 구간 안의 차이를 잃고 경계 바로 옆 값이 다른 범주가 되는 단점이 있습니다.

```python
import pandas as pd

df["age_group"] = pd.cut(
    df["age"],
    bins=[0, 20, 35, 50, 100],
    labels=["10대", "20-30대", "40대", "50대 이상"],
    right=False,
)
df["spend_group"] = pd.qcut(df["spend"], q=4, duplicates="drop")
```

## 정리

순서 없는 범주에는 One-Hot, 의미 있는 순서가 있는 범주에는 Ordinal Encoding을 우선 검토합니다. Label Encoding은 입력 모델이 정수 코드를 범주로 처리하는지 확인하고, Target Encoding은 타깃 누수를 막는 교차 검증 절차가 필요합니다. 범주 수와 미관측 범주를 고려해 인코더를 Train에 fit하고 나머지 데이터에는 같은 규칙을 적용합니다.

## Q&A

> [!question] 지역 변수에 Label Encoding을 써도 되나요?
>
> 정수값을 실제 범주로 처리하는 모델인지 확인해야 합니다. 그렇지 않으면 지역 사이에 존재하지 않는 순서와 거리가 생길 수 있어 One-Hot이나 범주형 입력 기능을 검토합니다.

> [!question] One-Hot Encoding에서 첫 범주를 항상 빼야 하나요?
>
> 아닙니다. 절편을 포함한 비규제 선형 회귀에서 선형 종속을 피하려고 뺄 수 있지만, 모든 모델에 필요한 설정은 아닙니다.

> [!question] Target Encoding은 왜 누수에 취약한가요?
>
> 범주별 타깃 통계를 입력값으로 쓰기 때문입니다. 평가 행의 정답이 인코딩 통계에 들어가지 않도록 Train 안에서 교차 검증 방식으로 계산해야 합니다.

본 포스팅은 개인적인 학습 내용을 바탕으로 작성되었으며, 가독성과 내용 보완을 위해 생성형 AI의 도움을 받아 재작성되었습니다.
