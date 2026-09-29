---
title: "10. 집계 및 윈도우 함수 (Aggregation and Window)"
description: "그룹 집계와 시간 윈도우로 관측 이력을 요약하는 방법"
date: "2024-08-29"
hashtags: ["MachineLearning", "FeatureEngineering", "Aggregation", "Window"]
skills: ["Machine Learning", "Python", "Pandas"]
status: "published"
---

# 10. 집계 및 윈도우 함수

## 집계

로그 데이터는 한 대상의 행동이나 측정값이 여러 행으로 나뉘어 기록되는 경우가 많습니다. 집계는 이 행들을 사용자·상품·날짜 같은 기준으로 묶어 하나의 요약 행으로 바꿉니다. 사용자별 방문 횟수, 날짜별 평균 센서값, 상품별 주문 합계 등이 대표적입니다.

집계 전에 예측 단위를 정해야 합니다. 한 행이 사용자 한 명인지, 사용자와 날짜의 조합인지에 따라 그룹 키가 달라집니다. 그리고 예측 기준 시각(cutoff time) 이전의 데이터만 사용해야 합니다. 기준 시각 이후의 로그까지 합치면 미래 정보를 피처에 제공하는 데이터 누수(data leakage)가 발생합니다.

~~~python
import pandas as pd

events["event_time"] = pd.to_datetime(events["event_time"])
cutoff = pd.Timestamp("2024-08-01")
history = events.loc[events["event_time"] < cutoff]

user_features = (
    history.groupby("user_id")
    .agg(
        event_count=("event_id", "count"),
        amount_sum=("amount", "sum"),
        amount_mean=("amount", "mean"),
        amount_std=("amount", "std"),
        active_days=("event_time", lambda s: s.dt.normalize().nunique()),
        last_event=("event_time", "max"),
    )
    .reset_index()
)
user_features["days_since_last_event"] = (
    cutoff - user_features["last_event"]
).dt.total_seconds() / 86400
~~~

groupby().agg()는 그룹마다 한 행을 만들기 때문에 사용자 단위 테이블을 만드는 데 알맞습니다. 평균과 합계만 보지 말고 횟수, 표준편차, 서로 다른 활동 일수, 마지막 활동 후 경과 시간처럼 다른 관점의 통계를 함께 살펴봅니다. 표준편차는 표본이 하나뿐인 그룹에서 결측이 될 수 있으므로 관측 수와 함께 확인해야 합니다.

agg와 달리 transform은 원래 행 수를 유지하며 그룹 통계량을 각 행에 돌려줍니다. 그룹 평균을 원본 행의 피처로 붙일 때 편리하지만, 미래 레코드나 예측 대상이 계산에 섞이지 않도록 합니다. 타깃 평균(target encoding 등)을 계산할 때는 학습 정답이 검증 행의 피처로 새어 나오지 않도록 폴드 안에서 계산하는 교차 적합(cross-fitting)이 필요합니다.

## 윈도우

윈도우(window)는 정렬된 데이터에서 일정 범위의 관측만 골라 통계량을 계산합니다. 전체 기간 평균이 오래된 상태까지 반영한다면, 이동 윈도우는 최근 상태를 더 잘 드러냅니다. rolling(7)의 7은 기본적으로 7일이 아니라 7개 행이므로, 행 간격이 일정한지 확인해야 합니다.

~~~python
daily = (
    events.set_index("event_time")
    .groupby("user_id")["amount"]
    .resample("D").sum()
    .rename("daily_amount")
    .reset_index()
    .sort_values(["user_id", "event_time"])
)

daily["mean_7_rows"] = (
    daily.groupby("user_id")["daily_amount"]
    .transform(lambda s: s.shift(1).rolling(7, min_periods=3).mean())
)
~~~

위 코드는 일 단위 합계를 만든 뒤 사용자별 직전 7개 날짜의 평균을 계산합니다. 이벤트가 없던 날을 0으로 볼지 결측으로 둘지는 데이터 의미에 따라 정합니다. 활동이 없었다면 0이 맞지만, 기록 자체가 빠진 것이라면 0은 실제 관측과 누락을 혼동시킵니다.

실제 시간 간격으로 창을 정하려면 날짜 인덱스에서 rolling("7D")처럼 씁니다. 이는 최근 7일의 시간 범위를 대상으로 해 행 기준 창과 결과가 달라질 수 있습니다. 현재 시점의 값을 예측하면서 그 시점의 관측값을 창에 포함하면 누수가 생길 수 있어 shift(1)이나 closed="left"로 과거 구간만 사용합니다.

~~~python
daily = daily.sort_values(["user_id", "event_time"])
daily["sum_7d"] = (
    daily.groupby("user_id", group_keys=False)
    .apply(
        lambda g: g.set_index("event_time")["daily_amount"]
        .rolling("7D", closed="left", min_periods=1).sum()
    )
    .reset_index(level=0, drop=True)
)
~~~

closed="left"는 현재 시각은 빼고 그보다 앞선 구간을 계산합니다. Pandas 버전과 인덱스 형태에 따라 그룹 결과의 인덱스 정렬 방식이 달라질 수 있으므로, 실제 사용 전 원본 행과 계산 결과가 올바르게 대응하는지 확인합니다.

## 지연값과 변화량

지연값(lag)은 이전 관측을 현재 행에 연결합니다. shift(1)은 이전 행이지 항상 전날은 아닙니다. 매일 한 번씩 관측되는 자료에서만 shift(7)을 7일 전으로 해석할 수 있습니다. 그룹별 자료는 시간순 정렬 후 그룹 안에서 계산해야 다른 대상의 값이 섞이지 않습니다.

~~~python
daily = daily.sort_values(["user_id", "event_time"])
g = daily.groupby("user_id")["daily_amount"]

daily["lag_1"] = g.shift(1)
daily["lag_7"] = g.shift(7)
daily["change_1"] = daily["daily_amount"] - daily["lag_1"]
daily["pct_change_1"] = g.pct_change()
~~~

차이(change)는 절대적인 증감을, 변화율(pct_change)은 이전 값 대비 상대적인 증감을 나타냅니다. 이전 값이 0이거나 매우 작으면 변화율이 무한대나 극단값이 될 수 있어 분모와 결과 범위를 점검합니다.

## 누적 윈도우

확장 윈도우(expanding window)는 시작부터 현재 직전까지의 기록을 누적해 계산합니다. 전체 이력에서의 평균 수준을 나타낼 때 쓸 수 있습니다. 지수 가중 이동 평균(EWM, Exponentially Weighted Moving)은 오래된 값의 가중치를 지수적으로 줄여 최근 변화에 더 민감하게 반응합니다.

~~~python
g = daily.groupby("user_id")["daily_amount"]

daily["history_mean"] = g.transform(
    lambda s: s.shift(1).expanding(min_periods=3).mean()
)
daily["ewm_mean_14"] = g.transform(
    lambda s: s.shift(1).ewm(span=14, min_periods=3, adjust=False).mean()
)
~~~

윈도우 크기는 관측 주기와 예측 지평을 바탕으로 후보를 만들고, 시간 순서를 보존한 검증으로 비교합니다. 검증 구간을 보고 윈도우나 결측 대체값을 선택하면 평가가 낙관적으로 바뀔 수 있습니다. 각 피처가 어느 시각까지의 정보를 사용했는지 명확히 정의하는 것이 핵심입니다.

## 정리

집계는 그룹마다 요약 행을 만들고, 윈도우는 기준 시점 주변의 이력으로 통계량을 계산합니다. agg는 그룹 테이블, transform은 원본 행에 통계 연결에 적합합니다. rolling(7)은 7개 행이고 rolling("7D")는 7일 시간 범위라는 차이를 구분합니다. 그룹·정렬·예측 기준 시각을 먼저 정하고 과거 정보만 포함하도록 만듭니다.

## Q&A

> [!question] 집계 통계와 타깃 통계는 같은 방식으로 만들어도 되나요?
>
> 일반 입력값 집계도 미래 기록이 섞이지 않아야 합니다. 정답 레이블을 이용하는 타깃 통계는 학습 행 자신의 정답이 피처에 반영되지 않도록 폴드별 계산이나 교차 적합을 적용합니다.

> [!question] rolling(7)과 rolling("7D")는 언제 다르게 동작하나요?
>
> rolling(7)은 최근 일곱 행, rolling("7D")는 최근 7일의 시간 구간을 사용합니다. 매일 한 건씩 빠짐없이 기록되면 비슷하지만, 누락 날짜나 하루 여러 건이 있으면 결과가 달라집니다.

> [!question] 윈도우 초반의 결측값은 어떻게 처리하나요?
>
> 과거 관측이 부족해 계산할 수 없다는 뜻입니다. min_periods로 최소 관측 수를 정하고 초기 구간을 제외하거나 결측 표시 피처를 추가할 수 있습니다. 0을 넣기 전 실제 0과 같은 의미인지 확인합니다.

본 포스팅은 개인적인 학습 내용을 바탕으로 작성되었으며, 가독성과 내용 보완을 위해 생성형 AI의 도움을 받아 재작성되었습니다.
