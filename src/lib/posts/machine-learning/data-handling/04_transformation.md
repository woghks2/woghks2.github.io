---
title: "04. 피처 변환 (Feature Transformation)"
description: "로그·Box-Cox·Yeo-Johnson 변환의 목적과 선택 기준"
date: "2024-08-29"
hashtags: ["MachineLearning", "Preprocessing", "Transformation"]
skills: ["Python", "Scikit-Learn"]
status: "published"
---

# 04. 피처 변환

## 개요

피처 변환은 숫자의 단위만 맞추는 작업이 아니라, 값의 분포와 변수 사이의 관계를 모델이 다루기 쉬운 형태로 바꾸는 과정입니다. 예를 들어 대부분의 사용자는 적은 횟수만 접속하지만 일부 사용자는 매우 자주 접속한다고 해보겠습니다. 원래 척도에서는 소수의 큰 값이 평균과 분산을 크게 움직이고, 선형 모델은 접속 횟수와 결과 사이 관계를 직선으로 설명하기 어려울 수 있습니다.

이때 로그 변환을 적용하면 큰 값의 간격을 압축해 긴 꼬리를 완화할 수 있습니다. Box-Cox와 Yeo-Johnson은 로그 하나를 고정해서 쓰는 대신, 데이터에 맞는 거듭제곱 변환을 찾는 방법입니다. 세 방법은 모두 분포를 정돈하는 데 활용되지만 허용하는 입력값과 변환의 유연성이 다릅니다.

## 로그 변환

로그 변환은 값이 커질수록 증가 폭을 줄입니다. 예를 들어 1과 10의 로그 차이는 10과 19의 로그 차이보다 크게 표현됩니다. 따라서 매출·방문 횟수·소득처럼 0 근처의 관측값이 많고 큰 값이 드물게 나타나는 오른쪽 꼬리 분포에서 큰 관측값의 영향력을 완화하고, 곱셈적 변화가 더해지는 관계로 바꾸는 데 유용합니다.

값이 0 이상이면 `log1p(x)=log(1+x)`를 쓸 수 있습니다. 0도 그대로 계산할 수 있기 때문입니다. 반면 원래 값에 바로 `log(x)`를 적용하려면 값이 양수여야 하고, 음수에는 실수 결과가 나오지 않습니다.

```python
import numpy as np
import pandas as pd
from scipy.stats import skew

visits = df["visits"].dropna()

# 긴 오른쪽 꼬리가 얼마나 줄었는지 왜도(skewness)로 확인
comparison = pd.DataFrame({
    "original": visits,
    "log1p": np.log1p(visits),
})

print("원본 왜도:", skew(comparison["original"]))
print("변환 후 왜도:", skew(comparison["log1p"]))
print(comparison.head())
```

로그 변환은 모든 분포를 정규분포로 만드는 방법이 아닙니다. 치우침을 완화할 수는 있어도 데이터에 따라 변환 후에도 비대칭이 남습니다. 큰 값이 중요한 신호라면 로그가 그 차이를 지나치게 압축하지 않는지도 확인해야 합니다.

## Box-Cox 변환

Box-Cox 변환은 로그 변환을 포함하는 거듭제곱 변환입니다. 변환의 모양을 정하는 `λ(람다)`를 데이터에서 추정해, 한쪽으로 치우친 분포를 더 대칭적으로 만들고 분산을 안정화하는 데 사용합니다. 로그 변환이 모든 데이터에 같은 압축을 적용한다면, Box-Cox는 데이터에 맞는 람다를 찾아 변환 강도를 조절한다는 차이가 있습니다.

`λ=1`에 가까우면 변환이 거의 선형이고, `λ=0`일 때는 로그 변환의 형태가 됩니다. 다만 Box-Cox는 **모든 입력값이 0보다 커야** 합니다. 0이 있으면 임의의 상수를 더해 양수로 만드는 방법도 있지만, 그 상수 선택이 결과에 영향을 주므로 이유와 값을 명시해야 합니다. 변환식은 다음과 같습니다.

$$
x^{(\lambda)} =
\begin{cases}
\frac{x^\lambda - 1}{\lambda}, & \lambda \ne 0 \\
\log(x), & \lambda = 0
\end{cases}
$$

람다를 데이터에서 추정하는 이유는 로그 변환 하나로 충분히 완화되지 않는 비대칭에 맞춰 변환 곡률을 조절하기 위해서입니다.

```python
from scipy.stats import boxcox

# 예측 평가에서는 람다를 Train에서만 추정한다.
train_values = train_df["value"].dropna()
valid_values = valid_df["value"].dropna()

train_transformed, fitted_lambda = boxcox(train_values)
valid_transformed = boxcox(valid_values, lmbda=fitted_lambda)

print(f"Train에서 추정한 lambda: {fitted_lambda:.3f}")
print("Train 변환 전/후 평균:", train_values.mean(), train_transformed.mean())
print("Validation 변환 결과 개수:", len(valid_transformed))
```

Box-Cox가 최적화하는 것은 선택한 통계적 기준에 따른 변환 파라미터입니다. 타깃 예측 성능을 직접 최대화한다는 뜻은 아니며, 정규분포를 보장하지도 않습니다. 변환 전후의 분포와 실제 모델의 Validation 성능을 함께 봐야 합니다.

## Yeo-Johnson 변환

Yeo-Johnson 변환도 람다를 추정하는 거듭제곱 변환이지만, 양수 구간과 음수 구간에 서로 맞는 식을 사용합니다. 그래서 **0과 음수를 포함한 실수 전체에 적용할 수 있다**는 점이 Box-Cox와 가장 큰 차이입니다. 변수에 0이나 음수가 실제로 존재하고 임의의 상수를 더하고 싶지 않다면 Yeo-Johnson이 더 자연스러운 선택입니다. 입력이 양수일 때와 음수일 때 변환식은 각각 다음과 같습니다.

$$
x^{(\lambda)} =
\begin{cases}
\frac{(x+1)^\lambda - 1}{\lambda}, & x \ge 0, \lambda \ne 0 \\
\log(x+1), & x \ge 0, \lambda = 0 \\
-\frac{(-x+1)^{2-\lambda} - 1}{2-\lambda}, & x < 0, \lambda \ne 2 \\
-\log(-x+1), & x < 0, \lambda = 2
\end{cases}
$$

양수와 음수에 서로 다른 식을 쓰기 때문에 입력에 0이나 음수가 있어도 정의됩니다.

```python
from sklearn.preprocessing import PowerTransformer

transformer = PowerTransformer(
    method="yeo-johnson",
    standardize=False,
)

# 학습 데이터로 변환 파라미터를 추정한다.
train_transformed = transformer.fit_transform(
    X_train[["value"]]
)

# Validation에는 같은 파라미터를 적용한다.
valid_transformed = transformer.transform(
    X_valid[["value"]]
)

print("추정된 lambda:", transformer.lambdas_[0])
print("Train 변환 결과:", train_transformed[:5].ravel())
print("Validation 변환 결과:", valid_transformed[:5].ravel())
```

기본 설정인 `standardize=True`에서는 Yeo-Johnson 변환 뒤 표준화까지 함께 수행합니다. 변환 효과와 스케일 조정을 따로 비교하고 싶다면 위 예시처럼 `standardize=False`로 두고 StandardScaler를 별도 단계로 둘 수 있습니다. `fit`은 Train에서만 실행하고 Validation과 Test에는 같은 변환기를 `transform`해야 합니다.

## 세 방법의 차이

로그 변환은 수식이 고정되어 단순하고 해석하기 쉽습니다. 값이 0 이상이고 긴 오른쪽 꼬리를 빠르게 압축하고 싶을 때 먼저 시도하기 좋습니다. Box-Cox는 입력이 양수일 때 로그보다 유연하게 변환 강도를 데이터에서 추정합니다. Yeo-Johnson은 그 유연성을 유지하면서 0과 음수도 처리하므로 입력 범위에 제약이 적습니다.

따라서 선택은 다음처럼 생각할 수 있습니다. 양수 변수에서 단순한 압축이 목적이면 로그를 사용하고, 양수 변수에서 데이터에 맞는 거듭제곱 변환을 찾으려면 Box-Cox를 비교합니다. 0이나 음수가 포함되어 있다면 Yeo-Johnson을 고려합니다. 어떤 방법이든 변환 후 분포가 실제로 나아졌는지, 예측 문제의 검증 성능이 개선됐는지 확인해야 합니다.

## 모델과 해석

피처가 정규분포를 따라야 한다고 모든 모델에 요구되는 것은 아닙니다. 일반적인 선형 회귀의 계수 추정은 입력 피처 자체가 정규분포라는 가정을 필요로 하지 않습니다. 통계적 추론에서 잔차의 분포가 중요할 수는 있지만, 이를 이유로 모든 피처에 변환을 적용해서는 안 됩니다. PCA(Principal Component Analysis, 주성분 분석)도 정규분포를 필수 조건으로 요구하지 않습니다.

트리 모델은 값의 순서와 분할점을 주로 이용하므로 단조 변환의 효과가 작을 수 있습니다. 반대로 선형 모델에서 관계가 휘어져 있거나 극단적인 규모 차이가 학습에 방해가 된다면 변환이 도움이 될 수 있습니다. 변환은 모델 종류와 목적에 따라 실험으로 선택합니다.

변환 후 계수 해석도 달라집니다. 로그 변환한 피처의 계수는 원래 단위가 한 단위 증가할 때의 효과와 같지 않습니다. 원래 단위로 설명해야 한다면 계수를 로그 척도에서 해석하거나, 결과를 적절히 역변환해야 합니다.

## 정리

로그는 큰 양수의 간격을 직접 압축하는 간단한 방법입니다. Box-Cox는 양수 데이터에서 람다를 추정해 로그보다 유연하게 분포를 변환하고, Yeo-Johnson은 같은 방식으로 0과 음수까지 처리합니다. 어느 방법도 정규분포나 높은 예측 성능을 보장하지 않으므로 데이터 분포와 Validation 결과를 보고 선택합니다. 학습 과정에서 추정되는 람다는 Train 데이터에만 fit해야 합니다.

## Q&A

> [!question] 로그 변환 대신 Box-Cox를 쓰는 이유는 무엇인가요?
>
> 로그는 모든 변수에 동일한 변환을 적용하지만 Box-Cox는 데이터에 맞는 `λ`를 추정해 변환 강도를 조절합니다. 다만 입력값이 모두 양수여야 하며, 더 유연한 변환이 실제 예측 성능에 도움이 되는지는 검증해야 합니다.

> [!question] 음수나 0이 포함된 변수에는 어떤 변환을 쓰나요?
>
> Yeo-Johnson은 0과 음수를 포함한 실수값에 적용할 수 있습니다. Box-Cox를 쓰려고 임의의 상수를 더하는 방법도 있지만, 상수 선택에 따라 결과가 달라질 수 있으므로 기본적으로는 Yeo-Johnson을 비교하는 편이 명확합니다.

> [!question] 변환하면 피처가 정규분포가 되나요?
>
> 보장되지 않습니다. 변환은 특정한 분포 모양을 완화하거나 분산을 안정화하는 데 도움을 줄 수 있지만, 실제 결과는 데이터마다 다릅니다. 변환 전후 분포와 모델의 Validation 성능을 확인해야 합니다.

> [!question] 스케일링과 로그 변환은 어떻게 다른가요?
>
> 로그 변환은 값 사이의 간격과 분포 모양을 바꿉니다. 스케일링은 평균·표준편차나 최솟값·최댓값 같은 기준으로 피처의 단위를 맞춥니다. 목적이 다르므로 필요한 경우 둘을 순서대로 적용할 수 있지만, 각 단계는 Train에만 fit해야 합니다.

본 포스팅은 개인적인 학습 내용을 바탕으로 작성되었으며, 가독성과 내용 보완을 위해 생성형 AI의 도움을 받아 재작성되었습니다.
