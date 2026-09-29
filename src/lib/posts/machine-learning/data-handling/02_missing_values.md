---
title: "02. 결측치 처리 (Missing Value Handling)"
description: "결측 원인과 데이터 구조에 맞는 대체·제거 방법"
date: "2024-08-29"
hashtags: ["MachineLearning", "Preprocessing", "MissingValues"]
skills: ["Python", "Pandas", "Scikit-Learn"]
status: "published"
---

# 02. 결측치 처리

결측값은 모두 같은 이유로 생기지 않습니다. 값이 수집되지 않았을 수도 있고, 대상에 해당 정보가 없거나 응답을 거부했을 수도 있습니다. 결측을 무조건 0이나 평균으로 바꾸면 이런 차이가 사라집니다. 먼저 결측이 발생한 과정을 확인한 뒤 처리 방법을 선택해야 합니다.

## 결측 패턴 확인

결측 건수와 비율부터 확인합니다.

```python
missing = pd.DataFrame({
    "count": df.isna().sum(),
    "rate": df.isna().mean(),
}).query("count > 0").sort_values("rate", ascending=False)

print(missing)
```

결측 메커니즘은 결측이 어떤 이유로 발생했는지를 기준으로 세 가지로 설명합니다. **MCAR(Missing Completely At Random, 완전 무작위 결측)**은 결측 여부가 관측된 값과 결측된 값 모두와 관계없이 발생하는 경우입니다. **MAR(Missing At Random, 무작위 결측)**은 결측 여부가 다른 관측 가능한 변수와 관련된 경우입니다. 예를 들어 연령대에 따라 설문 응답 누락률이 다르지만, 연령대를 알고 나면 누락이 실제 소득과는 무관한 상황입니다. **MNAR(Missing Not At Random, 비무작위 결측)**은 결측 여부가 빠진 값 자체 또는 관측되지 않은 요인과 관련된 경우입니다. 소득이 높은 응답자일수록 소득 항목을 비워두는 상황이 한 예입니다. 여기서 MAR의 “무작위”는 전체에서 아무렇게나 빠진다는 뜻이 아니라, 관측된 변수들을 조건으로 두면 결측이 설명된다는 의미입니다. 실제 데이터만으로 유형을 확정하기는 어려우므로 수집 방식과 변수 정의를 함께 살펴야 합니다.

결측 여부에 따라 다른 피처나 타깃 비율이 달라지는지 확인하면 결측 자체가 정보를 담고 있는지 파악하는 데 도움이 됩니다.

```python
df["income_missing"] = df["income"].isna()
print(df.groupby("income_missing")["target"].mean())
```

## 제거와 대체

결측 행을 제거하면 표본이 줄어듭니다. 결측이 특정 집단에서 더 자주 발생하면 그 집단이 분석에서 빠져 결과가 편향될 수 있습니다. 컬럼 제거도 결측률 하나만 보고 결정하지 말고, 변수의 의미와 예측 기여를 같이 고려합니다.

수치형 변수는 평균이나 중앙값, 범주형 변수는 최빈값 또는 별도 범주로 채울 수 있습니다. 평균은 이상치에 민감하고, 중앙값은 긴 꼬리를 가진 분포에서 비교적 안정적입니다. 결측 자체가 신호라면 대체값과 결측 표시를 함께 사용할 수 있습니다.

```python
from sklearn.impute import SimpleImputer

numeric_imputer = SimpleImputer(
    strategy="median",
    add_indicator=True,
)
category_imputer = SimpleImputer(
    strategy="most_frequent",
)
```

KNN(K-Nearest Neighbors, K-최근접 이웃)이나 회귀 모델로 결측값을 추정하는 방법도 있지만, 복잡한 대체가 항상 더 정확한 것은 아닙니다. 대체 모델의 오차가 뒤의 학습에 전달될 수 있으므로 단순 대체와 같은 검증 조건에서 성능을 비교합니다.

## 시계열 결측

시계열에서는 행의 순서와 결측 구간 길이가 중요합니다. `ffill`은 앞의 관측값을 이어 쓰고, `bfill`은 다음 관측값을 가져옵니다. 과거 정보로 미래를 예측하는 문제에서 `bfill`은 예측 시점 이후 값을 사용하므로 누수가 될 수 있습니다.

```python
df = df.sort_values(["entity_id", "timestamp"])
df["value_ffill"] = (
    df.groupby("entity_id")["value"].ffill()
)
```

선형 보간은 앞뒤 값을 이용하므로 예측 기준일 이전 데이터만으로 계산되는지 확인해야 합니다. 직전 값을 오래 유지하는 것이 부적절한 도메인도 있으므로, 결측 구간이 길 때는 별도 표시를 하거나 해당 구간을 제외하는 방법도 검토합니다.

## 학습 데이터에서 대체 규칙 추정

평균·중앙값·최빈값 같은 대체 기준은 데이터에서 계산됩니다. 전체 데이터로 먼저 계산하면 Validation과 Test의 정보가 전처리에 들어갑니다. Pipeline을 사용하면 대체 규칙은 Train에 fit되고 평가 데이터에는 그 규칙만 적용됩니다.

```python
from sklearn.impute import SimpleImputer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

model = make_pipeline(
    SimpleImputer(strategy="median", add_indicator=True),
    StandardScaler(),
    LogisticRegression(max_iter=1000),
)
model.fit(X_train, y_train)
valid_pred = model.predict_proba(X_valid)[:, 1]
```

## 정리

결측값은 발생 원인과 변수 의미를 살핀 뒤 처리합니다. 제거는 표본 구성의 변화를 확인하고, 대체는 분포와 데이터 구조에 맞춰 선택합니다. 결측 자체가 정보를 담을 수 있으므로 표시 피처도 고려합니다. 시계열에서는 미래 값이 섞이지 않게 하고, 대체 규칙은 Train에서만 학습합니다.

### Q&A

> [!question] 결측률이 높으면 컬럼을 삭제해야 하나요?
>
> 결측률만으로 정할 수 없습니다. 해당 변수의 정보 가치, 결측이 발생한 집단, 제거 후 표본 구성이 달라지는지를 확인하고 대체·표시·삭제를 비교합니다.

> [!question] 평균 대체는 왜 문제가 될 수 있나요?
>
> 평균 대체는 값들을 평균 근처로 모아 분산을 줄이고 변수 사이의 관계를 약화할 수 있습니다. 중앙값, 결측 표시, 다른 대체 방법을 함께 비교하는 것이 좋습니다.

> [!question] 시계열에서 bfill은 언제 위험한가요?
>
> 다음 시점의 값을 현재 결측에 채우므로, 과거 시점에서 미래를 예측하는 상황에서는 미래 정보 누수가 될 수 있습니다.

본 포스팅은 개인적인 학습 내용을 바탕으로 작성되었으며, 가독성과 내용 보완을 위해 생성형 AI의 도움을 받아 재작성되었습니다.
