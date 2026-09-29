---
title: "05. 피처 스케일링 (Feature Scaling)"
description: "Standard, MinMax, Robust Scaling"
date: "2024-08-29"
hashtags: ["MachineLearning", "Preprocessing", "FeatureScaling"]
skills: ["Machine Learning", "Python", "Scikit-Learn"]
status: "published"
---

# 05. 피처 스케일링 (Feature Scaling)

## 개요

피처마다 단위가 다르면 거리나 계수를 사용하는 모델에서 큰 숫자 범위의 변수가 결과를 지배할 수 있습니다. 스케일링은 변수의 단위를 맞춰 이런 영향을 줄이는 전처리입니다. 모든 알고리즘에 필요한 것은 아니며, 모델이 입력 크기에 민감한지와 이상치가 있는지에 따라 방법을 선택합니다.

---
## 스케일링 방법

### MinMaxScaler
$$
x' = \frac{x - x_{\text{min}}}{x_{\text{max}} - x_{\text{min}}}
$$


MinMaxScaler는 각 피처의 최솟값을 빼고 최댓값과 최솟값의 차이로 나눠 기본적으로 0~1 범위로 옮깁니다. 변수 간 상대적인 순서와 간격은 선형적으로 유지되므로 픽셀처럼 입력 범위가 정해진 데이터에 쓰기 쉽습니다. 단점은 기준이 최소·최대값에 달려 있다는 것입니다. 학습 데이터에 큰 이상치 하나가 있으면 나머지 값이 0 근처에 몰리고, 운영 데이터에 학습 때보다 더 큰 값이 들어오면 변환 결과가 1을 넘을 수도 있습니다.

```python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler(feature_range=(0, 1))

# 기준은 Train에서 학습하고 Validation에는 그대로 적용
X_train_scaled = scaler.fit_transform(X_train[["col1", "col2"]])
X_valid_scaled = scaler.transform(X_valid[["col1", "col2"]])

print("학습 데이터 범위:", X_train_scaled.min(axis=0), X_train_scaled.max(axis=0))
print("검증 데이터 범위:", X_valid_scaled.min(axis=0), X_valid_scaled.max(axis=0))
```

---

### StandardScaler
$$
x' = \frac{x - \mu}{\sigma}
$$


StandardScaler는 각 피처의 평균을 빼고 표준편차로 나눠 평균 0, 표준편차 1의 척도로 바꿉니다. 분포의 모양을 정규분포로 바꾸는 과정은 아닙니다. 이 방법은 이상치가 적고 평균과 표준편차가 대표적인 중심·산포 척도일 때 안정적으로 쓸 수 있습니다. 특히 규제화된 선형 모델에서는 피처마다 단위가 다를 때 계수 패널티가 불균형해질 수 있어 스케일 조정이 중요합니다. 이상치가 크면 평균과 표준편차가 끌려가므로 RobustScaler나 분포 변환과 비교합니다.

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

# 학습 데이터의 평균과 표준편차를 기준으로 변환
X_train_scaled = scaler.fit_transform(X_train[["col1", "col2"]])
X_valid_scaled = scaler.transform(X_valid[["col1", "col2"]])

print("학습 평균:", X_train_scaled.mean(axis=0))
print("학습 표준편차:", X_train_scaled.std(axis=0))
```


### RobustScaler
$$
x' = \frac{x - \text{median}(x)}{IQR} = \frac{x - Q_2}{Q_3 - Q_1}
$$


RobustScaler는 평균 대신 중앙값을 빼고, 표준편차 대신 사분위 범위(IQR, Interquartile Range)로 나눕니다. 중앙값과 사분위수는 극단값에 덜 민감하므로 일부 큰 값이 있는 데이터에서 변환 기준이 쉽게 흔들리지 않습니다. 다만 이상치를 삭제하거나 정상값으로 되돌리는 방법은 아닙니다. 값의 순서는 그대로 남고 극단값도 변환 결과에 남으므로, 이상치 자체를 조사하고 처리할 필요가 있는지는 별도로 판단해야 합니다.

```python
from sklearn.preprocessing import RobustScaler

scaler = RobustScaler()

# 중앙값과 사분위 범위도 Train에서만 계산
X_train_scaled = scaler.fit_transform(X_train[["col1", "col2"]])
X_valid_scaled = scaler.transform(X_valid[["col1", "col2"]])

print("학습 중앙값 기준:", scaler.center_)
print("학습 IQR 기준:", scaler.scale_)
```

---

## 스케일러 선택

| 기준             | MinMaxScaler          | StandardScaler         | RobustScaler              |
|------------------|------------------------|-------------------------|----------------------------|
| **중심 기준**       | 최소값 (`min`)            | 평균 (`mean`)              | 중앙값 (`median`)            |
| **스케일 기준**     | 최대값 - 최소값 (`max - min`) | 표준편차 (`std`)           | IQR (`Q3 - Q1`)             |
| **적용 범위**       | 0 ~ 1                   | 평균 0, 표준편차 1          | 중앙 기준 상대적 범위             |
| **분포 가정**       | 분포 가정 없음             | 분포 가정 없음                | 분포 가정 없음                         |
| **이상치 민감도**   | 매우 큼                  | 큼                         | **낮음 (이상치에 강함)**         |
| **권장 사용 모델**  | 딥러닝, KNN, 거리 기반 모델 | 선형 회귀, 로지스틱 회귀, PCA | 이상치 많은 실무 데이터 (로그, 수익 등) |
| **실무 사용 예시**  | 픽셀, 정규화, 비정규 분포     | 통계 기반 모델, 회귀        | 수익, 사용량, 클릭수 등 이상치 포함 데이터 |



| 메서드             | 의미                                       | 사용 대상         |
| --------------- | ---------------------------------------- | ------------- |
| `fit()`         | 학습 데이터를 기준으로 **스케일 기준(평균, 최대/최소 등)을 학습** | 학습 데이터        |
| `transform()`   | 이미 학습된 기준으로 **데이터를 변환**                  | 학습/검증/테스트 데이터 |
| `fit_transform` | fit() + transform()                      | 학습 데이터 전용     |

각 스케일러는 Train 데이터에서 평균·최솟값·중앙값처럼 변환에 필요한 기준을 학습합니다. Validation과 Test에 다시 `fit()`하면 평가 데이터 기준으로 스케일이 달라지므로, Train에만 `fit()`하고 나머지 데이터에는 같은 스케일러의 `transform()`만 적용합니다.

---

## 적용 예시

### 정규화가 필요한 모델 사용 시
예를 들어 수입과 방문 횟수를 KNN의 거리 계산에 함께 사용하면 수입의 숫자 범위가 커서 거리를 거의 결정할 수 있습니다. 신경망에서도 피처 척도가 크게 다르면 최적화가 느려질 수 있습니다. 이런 모델에서는 MinMaxScaler와 StandardScaler를 기준선으로 비교합니다.

거리 기반 알고리즘은 피처별 척도 차이에 민감하므로 스케일링을 적용하는 편이 일반적입니다. 다만 MinMaxScaler와 StandardScaler 중 어느 쪽이 더 적합한지는 데이터 분포와 Validation 결과로 결정합니다.

### 이상치가 존재하는 경우
수입이나 거래액처럼 일부 값이 극단적으로 크면 MinMaxScaler의 범위가 그 값에 좌우되고 StandardScaler의 평균과 표준편차도 영향을 받습니다. 중앙값과 IQR을 사용하는 RobustScaler를 비교할 수 있지만, 변환 뒤에도 극단 관측치는 남는다는 점을 기억해야 합니다.

### 피처마다 단위가 다른 경우
키·몸무게·수입처럼 단위가 다른 피처를 거리 기반 모델이나 규제화된 회귀에 넣을 때는 StandardScaler를 출발점으로 사용할 수 있습니다. 단위 차이를 줄이는 것이 변수의 실제 중요도를 같게 만든다는 뜻은 아니므로, 필요하면 도메인 가중치와 모델 성능도 함께 고려합니다.

---

## 정리

스케일링은 거리 기반·선형·신경망 모델에서 주로 필요하며 트리 모델에는 대체로 필수가 아닙니다. 스케일러는 Train에만 fit하고 평가 데이터에는 transform을 적용합니다.

## Q&A


> [!question] 왜 거리 기반 모델에서 스케일링이 필요한가?
> 
> 예를 들어 두 사용자 사이의 유클리드 거리를 계산할 때 나이 차이는 5년이고 연 소득 차이는 20,000 단위라면, 스케일을 맞추지 않은 거리에서는 소득 항이 훨씬 크게 작용합니다. 스케일링은 이런 단위 차이를 줄여 각 피처가 거리 계산에 반영될 기회를 맞춥니다. 다만 모든 피처의 실제 중요도를 같게 만든다는 뜻은 아닙니다.

> [!question] StandardScaler가 정규분포를 만드는 건가요?
> 
> StandardScaler는 평균과 표준편차를 조정할 뿐 피처를 정규분포로 만들지 않습니다. 일반적인 선형 회귀와 로지스틱 회귀는 입력 피처 자체가 정규분포라는 가정을 필수로 두지 않습니다. PCA도 정규성을 요구하지 않지만, 스케일이 큰 변수가 주성분 방향을 지배하지 않도록 표준화를 함께 쓰는 경우가 많습니다.

> [!question] MinMaxScaler는 왜 이상치에 민감한가?
> 
> 최대값과 최소값 기준으로 스케일링을 수행하기 때문에, 극단적인 이상치 하나가 전체 스케일 기준을 밀어버릴 수 있다. 그 결과 대부분의 데이터가 0 근처에 몰리게 된다.

> [!question] RobustScaler는 어떤 상황에서 효과적인가?
> 
> 극단값이 있는 데이터에서는 중앙값과 IQR을 기준으로 하는 RobustScaler가 변환 기준을 덜 흔들리게 합니다. 다만 이를 이상치 제거 또는 분포 교정과 동일하게 보면 안 됩니다. 극단값의 원인을 확인하고, 필요하면 별도의 변환·절단·수정 방법을 비교해야 합니다.

> [!question] 스케일링과 정규화는 어떻게 다른가?
> 
> 용어는 문맥에 따라 다르게 쓰이지만, Scikit-learn의 `Normalizer`는 행마다 벡터 길이를 맞추는 방법이고 여기서 설명한 피처별 스케일링과 다릅니다. StandardScaler는 각 열의 평균과 표준편차를 조정하고, MinMaxScaler는 각 열을 지정 범위로 옮깁니다. 둘 다 정규분포를 만들어주는 변환은 아닙니다.

> [!question] 트리 기반 모델에서는 스케일링이 왜 필요하지 않은가?
> 
> 결정 트리는 피처가 특정 임계값보다 큰지 작은지를 기준으로 분할합니다. 피처에 양의 선형 스케일을 적용해도 값의 순서가 유지되므로 분할 가능한 그룹은 대체로 같습니다. 그래서 트리 계열 모델은 보통 스케일링 없이도 학습할 수 있습니다. 다만 값의 단위가 잘못됐거나 이상치가 비현실적이라는 데이터 품질 문제까지 해결되는 것은 아닙니다.

> [!question] 검증/테스트 데이터에는 왜 transform()만 써야 하나?
> 
> 학습 데이터 기준으로 fit된 스케일 기준(평균, 표준편차 등)을 그대로 유지해야 모델이 일관된 입력을 받는다. 검증/테스트에서 다시 fit하면 기준이 바뀌어 모델 출력이 왜곡된다.

> [!question] 피처마다 단위가 다를 때 스케일링을 꼭 해야 하나?
> 
> 단위 차이가 학습에 영향을 주는 선형·거리 기반·경사하강법 모델이라면 스케일링을 비교하는 것이 좋습니다. 다만 변수의 값이 크다는 이유만으로 항상 더 큰 영향이나 업데이트가 생긴다고 단정할 수는 없습니다. 모델의 계산 방식과 규제, 입력 분포를 함께 고려합니다.

본 포스팅은 개인적인 학습 내용을 바탕으로 작성되었으며, 가독성과 내용 보완을 위해 생성형 AI의 도움을 받아 재작성되었습니다.
