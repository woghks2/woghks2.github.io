---
title: "09. 피처 생성 (Feature Construction)"
description: "Pandas로 만드는 수치·날짜·비율·행동 피처와 설계 기준"
date: "2024-08-29"
hashtags: ["MachineLearning", "FeatureEngineering", "FeatureConstruction"]
skills: ["Python", "Pandas", "Scikit-Learn"]
status: "published"
---

# 09. 피처 생성

## 개요

피처 생성은 원천 컬럼을 그대로 넣는 데서 그치지 않고, 예측하려는 패턴이 드러나도록 값을 변환하거나 여러 컬럼을 조합하는 과정입니다. 날짜로부터 가입 후 경과일을 계산하거나, 총 사용량을 활성 일수로 나눠 하루 평균을 만드는 식입니다. 같은 원천 데이터라도 어떤 기준 시점과 단위로 요약하느냐에 따라 모델이 학습할 수 있는 정보가 달라집니다.

피처를 만들기 전에 먼저 예측 단위와 예측 시점을 정합니다. 한 행이 사용자 한 명인지, 사용자-날짜 조합인지에 따라 집계 방법이 달라집니다. 또 예측 시점에 아직 알 수 없는 미래 정보를 섞으면 성능이 실제보다 높아지는 누수가 생깁니다.

## 수치형 파생 피처

수치형 피처에서는 합계, 차이, 비율, 로그, 구간 표시를 만들 수 있습니다. 비율은 규모가 다른 대상을 비교할 때 유용하지만, 분모가 0이거나 아주 작은 경우 결과가 불안정해지므로 먼저 처리해야 합니다.

```python
import numpy as np
import pandas as pd

df["total_amount"] = df["item_price"] * df["item_count"]
df["amount_per_item"] = np.divide(
    df["total_amount"],
    df["item_count"],
    out=np.zeros(len(df), dtype=float),
    where=df["item_count"].to_numpy() != 0,
)
df["amount_log"] = np.log1p(df["total_amount"].clip(lower=0))
df["has_discount"] = (df["discount_amount"] > 0).astype("int8")
```

여기서 총액은 가격과 수량을 결합하고, 개당 금액은 규모를 보정한 값입니다. 로그 총액은 큰 값의 차이를 압축합니다. 어떤 변환이 적절한지는 값의 허용 범위와 모델에 따라 다릅니다. 예를 들어 음수가 의미 있는 변수에 무조건 제곱근이나 로그를 적용하면 안 됩니다.

## 날짜와 기간 피처

날짜 문자열은 먼저 datetime 형식으로 바꾼 뒤 연·월·요일, 주말 여부, 기준일로부터의 경과 기간을 만들 수 있습니다. 달력에서 반복되는 요일 효과를 표현할 때 요일 숫자를 그대로 넣는 대신 사인·코사인으로 순환 구조를 나타낼 수도 있습니다.

```python
df["event_time"] = pd.to_datetime(df["event_time"])
as_of = pd.Timestamp("2025-01-01")

df["event_hour"] = df["event_time"].dt.hour
df["event_weekday"] = df["event_time"].dt.dayofweek
df["is_weekend"] = df["event_weekday"].ge(5).astype("int8")
df["weekday_sin"] = np.sin(2 * np.pi * df["event_weekday"] / 7)
df["weekday_cos"] = np.cos(2 * np.pi * df["event_weekday"] / 7)
df["days_since_event"] = (as_of - df["event_time"]).dt.days
```

가입일과 기준일이 있다면 가입 후 경과일, 첫 활동과 마지막 활동 사이 기간처럼 생애주기 피처도 계산할 수 있습니다. 이때 기준일은 실제 예측이 이루어지는 시점이어야 합니다. 전체 데이터의 가장 늦은 날짜를 기준으로 기간을 계산하면 과거 예측 행에 미래 정보가 반영될 수 있습니다.

## 비율과 행동 요약 피처

도메인 피처는 원천값을 업무상 해석 가능한 비율과 빈도로 표현합니다. 거래 데이터에서는 평균 거래 금액과 거래 빈도, 서비스 이용 데이터에서는 활성 일수 대비 사용 횟수, 재고 데이터에서는 판매량 대비 재고 수준을 생각할 수 있습니다. 이 피처들은 각각 거래 규모, 이용 강도, 재고 회전이라는 해석 가능한 단위를 만듭니다.

예를 들어 사용자별 활동 로그에서 관측 기간 동안의 활동 횟수와 활동 일수를 집계한 다음 일평균을 계산할 수 있습니다.

```python
activity = (
    events.loc[events["event_time"] < as_of]
    .assign(event_date=lambda x: x["event_time"].dt.date)
    .groupby("user_id")
    .agg(
        event_count=("event_name", "size"),
        active_days=("event_date", "nunique"),
        first_seen=("event_time", "min"),
        last_seen=("event_time", "max"),
    )
)

activity["events_per_active_day"] = (
    activity["event_count"]
    / activity["active_days"].replace(0, np.nan)
)
activity["active_span_days"] = (
    activity["last_seen"] - activity["first_seen"]
).dt.days
```

이처럼 사용자별 총량만 쓰는 대신 활동일수로 나눈 강도, 첫 활동부터 마지막 활동까지의 지속 기간, 마지막 활동 이후 경과일을 함께 만들 수 있습니다. 다만 관측 기간이 사용자마다 다르면 단순 총량 비교가 공정하지 않을 수 있으므로 분모나 관측 창을 함께 설계합니다.

## 상호작용 피처

상호작용 피처는 두 변수의 효과가 서로에 따라 달라질 때 그 조합을 명시적으로 표현합니다. 예를 들어 방문 빈도만으로는 방문당 평균 소비가 높은 사용자를 구분하지 못할 수 있어 방문 횟수와 평균 소비액을 각각 제공할 수 있습니다. 곱이나 비율은 해석 가능한 관계일 때만 추가합니다.

```python
df["visits_x_avg_spend"] = (
    df["visit_count"] * df["avg_spend"]
)
df["orders_per_month"] = (
    df["order_count"] / df["tenure_months"].clip(lower=1)
)
```

다항식 피처를 만들면 제곱항과 변수 간 곱을 일괄 생성할 수 있지만, 피처 수가 빠르게 늘고 상관이 강해질 수 있습니다. 모든 조합을 만들기보다 가설을 세운 뒤 제한된 후보를 비교합니다. 트리 기반 모델은 일부 비선형 상호작용을 자체적으로 나눌 수 있으므로, 명시적 상호작용이 항상 이득인 것은 아닙니다.

## 범주 조합

두 범주의 조합은 한 변수만으로 표현되지 않는 그룹 차이를 나타낼 수 있습니다. 예를 들어 기기 종류와 접속 채널의 조합이 의미 있을 수 있습니다.

```python
df["device_channel"] = (
    df["device_type"].fillna("unknown").astype(str)
    + "__"
    + df["channel"].fillna("unknown").astype(str)
)
```

조합 범주는 가능한 조합 수가 커져 희귀 범주가 많이 생길 수 있습니다. 인코딩 전에 빈도와 미관측 조합을 확인하고, 지나치게 드문 값은 기타 범주로 묶거나 원래 두 변수를 따로 쓰는 방법과 비교합니다.

## 생성한 피처 검증

피처가 그럴듯한 이름을 가졌다고 예측에 유용한 것은 아닙니다. 새 피처를 추가했을 때 동일한 분할과 평가지표에서 모델 성능이 달라지는지 확인하고, 피처 그룹별로 제외하는 비교도 수행합니다. 상관이 높은 파생 피처는 모델의 해석을 어렵게 만들 수 있고, 분모가 작은 비율이나 매우 희소한 범주 조합은 과적합을 키울 수 있습니다.

특히 타깃 평균이나 미래 기간 통계를 포함하는 피처는 생성 시점에 누수가 생기기 쉽습니다. 집계 범위가 예측 기준 시점 이전인지, 사용자나 그룹 경계가 섞이지 않았는지, 결측과 0을 구분했는지 확인해야 합니다.

## 정리

피처 생성은 수치 변환, 날짜·기간 계산, 비율과 빈도 집계, 상호작용, 범주 조합으로 원천 데이터의 의미를 예측 가능한 형태로 표현합니다. Pandas에서는 assign·groupby·agg·transform과 날짜 accessor를 이용해 반복 가능한 피처를 만들 수 있습니다. 분모·결측·희귀 조합을 처리하고, 모든 피처가 예측 시점에 이용 가능한지 확인한 뒤 검증 데이터에서 기여를 평가합니다.

## Q&A

> [!question] 피처 생성과 피처 변환은 어떻게 다른가요?
>
> 피처 변환은 기존 값의 척도나 분포를 바꾸는 데 초점이 있습니다. 피처 생성은 여러 값이나 원천 행을 결합해 새로운 의미의 변수를 만드는 더 넓은 과정이며, 로그 변환도 넓은 의미에서는 파생 피처 생성의 한 형태로 볼 수 있습니다.

> [!question] 비율 피처를 만들 때 분모가 0이면 어떻게 하나요?
>
> 문제 의미에 맞춰 결측으로 두거나 별도 상태 표시를 추가하고, 계산 단계에서 0으로 나누지 않도록 처리합니다. 0을 임의로 다른 숫자로 바꾸면 실제 비율과 구분되지 않을 수 있습니다.

> [!question] 피처가 많을수록 성능이 좋아지나요?
>
> 그렇지 않습니다. 중복·노이즈 피처나 희귀 범주 조합은 과적합과 운영 복잡도를 키울 수 있습니다. 같은 검증 기준으로 피처 추가 전후를 비교하고, 실제 기여가 확인된 피처를 남깁니다.

본 포스팅은 개인적인 학습 내용을 바탕으로 작성되었으며, 가독성과 내용 보완을 위해 생성형 AI의 도움을 받아 재작성되었습니다.
