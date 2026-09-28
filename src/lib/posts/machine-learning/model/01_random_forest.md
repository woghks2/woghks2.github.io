---
title: "01. 랜덤 포레스트 (Random Forest)"
description: "랜덤 포레스트의 배깅 구조, 장점과 한계, feature importance 해석 주의점을 정리합니다."
date: "2025-01-01"
hashtags: ["MachineLearning", "Models", "Classification", "RandomForest"]
skills: ["Machine Learning", "Python", "Scikit-Learn"]
status: "published"
---

# 01. 랜덤 포레스트 (Random Forest)

랜덤 포레스트는 여러 개의 의사결정나무를 만들어 그 결과를 종합하는 앙상블 모델이다.  
하나의 트리는 쉽게 과적합될 수 있지만, 서로 다른 샘플과 feature를 본 여러 트리를 평균내면 훨씬 안정적인 결과를 만들 수 있다.

## 언제 좋은 선택이 되나

랜덤 포레스트는 tabular 데이터에서 강한 baseline으로 자주 쓰인다.

- 변수 간 비선형 관계가 있을 때
- 상호작용을 사람이 일일이 설계하기 어려울 때
- 빠르게 튼튼한 기준 성능이 필요할 때

특히 전처리를 지나치게 복잡하게 하지 않고도 괜찮은 성능이 나오는 경우가 많다.

## 핵심 구조

랜덤 포레스트는 보통 두 가지 무작위성을 사용한다.

- bootstrap sampling: 데이터 샘플을 중복 허용 추출
- feature subsampling: 각 분할에서 일부 feature만 후보로 사용

이 덕분에 각 트리가 서로 조금씩 다른 관점을 갖게 되고, 평균이나 다수결을 취하면 분산이 줄어든다.

## 왜 단일 트리보다 안정적인가

단일 의사결정나무는 학습 데이터를 너무 세밀하게 외우기 쉽다.  
반면 랜덤 포레스트는 여러 트리가 조금씩 다른 실수를 하도록 만든 뒤 이를 평균내기 때문에, 특정 트리의 과적합 영향을 완화한다.

즉 핵심은 bias를 크게 줄이는 것이 아니라 **variance를 낮추는 것**이다.

## 실무에서 자주 보는 장점

- 스케일링에 크게 민감하지 않다
- feature 간 비선형 상호작용을 잘 잡는다
- baseline으로 강하다
- OOB 평가처럼 추가 검증 힌트를 얻을 수 있다

## 같이 주의할 점

### 해석력

단일 트리보다 구조가 복잡해져서 "왜 이렇게 예측했는가"를 바로 설명하기는 어렵다.  
feature importance를 볼 수는 있지만, 그것만으로 인과 해석을 해서는 안 된다.

### 속도와 메모리

트리 수가 많아질수록 모델 크기와 예측 비용이 커진다.  
특히 큰 데이터셋에서는 학습과 추론 비용이 무시되지 않는다.

### 외삽

트리 계열 모델은 학습 데이터 범위를 벗어난 영역을 매끄럽게 일반화하는 데 한계가 있다.  
회귀뿐 아니라 분류에서도 드문 영역에 대한 판단이 거칠 수 있다.

## 공부할 내용

- bootstrap sampling과 bagging
- `n_estimators`, `max_depth`, `max_features`
- OOB score 해석
- permutation importance와 impurity importance 차이

랜덤 포레스트는 "쉽고 강한 모델"로 알려져 있지만, 실제로는 어떤 데이터 구조에서 강한지를 이해하고 써야 한다.

## QNA

> [!question] Random Forest가 Decision Tree보다 안정적인 이유는 무엇인가요?
>
> 서로 다른 데이터 샘플과 feature 집합으로 여러 트리를 만든 뒤 결과를 종합하기 때문이다. 개별 트리의 과적합이 평균 과정에서 완화된다.

> [!question] Random Forest의 단점은 무엇인가요?
>
> 모델이 커지고 해석이 어려워진다. 또한 트리 수가 많아질수록 학습과 예측 비용이 커질 수 있다.

## 6. Bagging과 OOB 평가

Random Forest는 각 트리에 원본 데이터의 복원추출 표본을 다르게 제공하고, 각 분할에서 일부 feature만 후보로 사용합니다. 이 두 가지 무작위성이 서로 비슷한 트리가 만들어지는 것을 막고, 개별 트리의 높은 분산을 평균 과정에서 낮춥니다.

```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=500,
    max_features="sqrt",
    min_samples_leaf=3,
    class_weight="balanced",
    oob_score=True,
    n_jobs=-1,
    random_state=42,
)
model.fit(X_train, y_train)
print(model.oob_score_)
```

OOB(out-of-bag) 샘플은 특정 트리를 학습할 때 선택되지 않은 샘플이므로, 별도의 Validation을 일부 대체하는 참고 평가로 사용할 수 있습니다. 하지만 하이퍼파라미터를 반복해서 고르거나 threshold를 조정하는 과정까지 OOB 점수에 의존하면 그 평가값도 실험에 과적합될 수 있습니다. 최종 모델은 시간 분할이나 독립 Test set에서 다시 확인해야 합니다.

Random Forest의 feature_importances_는 분할 횟수와 불순도 감소량에 기반하므로, 고유값이 많은 연속형 변수나 상관된 변수가 있을 때 편향될 수 있습니다. 중요도를 해석할 때는 permutation importance나 부분 의존성 분석을 함께 사용하는 편이 안전합니다.
