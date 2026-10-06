---
title: "2. ROC 커브와 PR 커브 (ROC and Precision-Recall Curves)"
description: "분류 임계값에 따른 ROC·PR 커브와 AUC를 해석하고 비교하는 방법"
date: "2025-01-01"
hashtags: ["MachineLearning", "Evaluation", "ROCCurve", "PrecisionRecall"]
skills: ["Machine Learning", "Python", "Scikit-Learn"]
status: "published"
---

# 2. ROC 커브와 PR 커브 (ROC and Precision-Recall Curves)

## 1. 임계값에 따라 성능이 달라지는 이유

분류 모델은 각 데이터가 양성(Positive)일 점수나 확률을 계산합니다. 이 점수를 임계값(Threshold)과 비교해 양성 또는 음성으로 분류합니다. 임계값이 달라지면 TP, FP, FN의 수가 바뀌므로 Precision과 Recall도 달라집니다.

한 임계값에서의 성능만 보는 대신 여러 임계값에서의 변화를 그린 그래프가 ROC 커브와 Precision-Recall(PR) 커브입니다. 아래 시뮬레이터에서 클래스 분리도와 양성 비율을 바꿔가며 두 그래프가 어떻게 달라지는지 볼 수 있습니다.

[roc-pr-widget]

### 위젯 초기값 해석

아래 내용은 위젯의 초기 설정인 클래스 분리도 2.2, 양성 비율 36%, 점수 임계값 0.0을 기준으로 설명합니다. 슬라이더를 움직이면 현재 지표는 위젯에서 실시간으로 바뀝니다.

#### 클래스 분리도 2.2

위젯은 Negative 점수가 $N(0, 1)$, Positive 점수가 $N(2.2, 1)$인 정규분포를 따른다고 가정합니다. 두 분포의 표준편차가 같을 때 $d' = \frac{\mu_1 - \mu_0}{\sigma}$이므로, 2.2는 두 점수 평균의 차이가 표준편차의 2.2배라는 뜻입니다. 이 가정에서 ROC-AUC는 $\Phi(d'/\sqrt{2}) \approx 0.94$입니다. 이는 임의의 Positive 점수가 임의의 Negative 점수보다 높게 매겨질 확률을 나타내며, 특정 임계값에서의 정확도가 94%라는 뜻은 아닙니다. 두 정규분포가 겹치는 면적은 약 27%입니다.

#### 양성 비율 36%

전체 샘플 가운데 실제 Positive가 차지하는 비율을 뜻합니다. PR 커브의 점선은 이 비율인 0.36을 기준선으로 표시합니다. 무작위로 순위를 매긴 분류기의 기대 기준으로 볼 수 있으며, 모든 임계값에서 Precision의 최솟값을 뜻하지는 않습니다.

#### 점수 임계값 0.0

위젯은 점수가 임계값 이상이면 Positive로 판정합니다. 임계값 0.0은 Negative 점수 분포 $N(0, 1)$의 평균이므로, 이론상 FPR은 0.50입니다. Positive 점수 분포 $N(2.2, 1)$에서는 TPR(Recall)이 약 0.986입니다. 양성 비율 0.36을 적용하면 Precision은 약 0.526입니다. 따라서 이 지점은 모든 샘플을 Positive로 판정하는 끝점이 아닙니다. 전부 Positive로 판정하면 Recall은 1, Precision은 양성 비율 0.36이 됩니다.

## 2. ROC 커브와 ROC-AUC

ROC(Receiver Operating Characteristic) 커브는 세로축의 TPR과 가로축의 FPR을 임계값별로 표시합니다.

- **TPR (True Positive Rate)**: `TP / (TP + FN)` — 실제 Positive 중 제대로 찾아낸 비율입니다. Recall과 같습니다.
- **FPR (False Positive Rate)**: `FP / (FP + TN)` — 실제 Negative 중 Positive로 잘못 분류한 비율입니다.

임계값을 낮추면 Positive로 분류되는 사례가 많아져 TPR이 높아지는 동시에 FPR도 높아질 수 있습니다. ROC 커브가 좌상단에 가까울수록 오탐을 적게 내면서 Positive를 많이 찾아낸다는 뜻입니다. 대각선은 무작위 순위에 가까운 기준선입니다.

ROC-AUC는 ROC 커브 아래 면적입니다. 1에 가까울수록 Positive와 Negative를 점수 순서로 잘 구분합니다. 동점이 없다고 할 때 ROC-AUC는 임의의 Positive 한 건에 더 높은 점수를 줄 확률로 해석할 수도 있습니다. AUC는 전체적인 순위 성능을 요약하며, 실제 서비스에 쓸 임계값을 정해주지는 않습니다.

## 3. PR 커브와 AP

PR 커브는 가로축의 Recall과 세로축의 Precision을 임계값별로 표시합니다. 실제 Positive를 더 많이 찾아낼 때 Positive라고 예측한 결과의 신뢰도를 얼마나 유지하는지 보여줍니다.

- **Recall**: `TP / (TP + FN)` — 실제 Positive 중 찾아낸 비율입니다.
- **Precision**: `TP / (TP + FP)` — Positive라고 예측한 것 중 실제 Positive의 비율입니다.

PR 커브가 우상단에 가까우면 높은 Recall과 Precision을 함께 얻고 있다는 뜻입니다. PR 커브에서 무작위 예측의 기준선은 데이터의 Positive 비율입니다. 예를 들어 실제 Positive가 전체의 5%라면 기준선은 약 0.05입니다.

PR-AUC는 PR 커브 아래 면적을 가리키는 말로 쓰이지만, 계산 방식에 따라 값이 달라질 수 있습니다. Average Precision(AP)은 흔히 쓰이는 요약 지표이며, PR 커브를 사다리꼴 방식으로 적분한 값과 항상 같지는 않습니다. 결과를 비교할 때는 사용한 계산 방식과 함수를 함께 기록하는 편이 좋습니다.

## 4. 불균형 데이터에서는 PR 커브도 확인하기

ROC의 FPR은 실제 Negative 중 오탐이 차지하는 비율입니다. Negative가 매우 많은 데이터에서는 오탐이 늘어도 분모의 TN이 커서 FPR이 낮게 보일 수 있습니다. 그래서 ROC-AUC가 높더라도 실제 운영에서 Positive 예측의 Precision이 낮을 수 있습니다.

PR 지표는 TN을 사용하지 않고 TP, FP, FN을 바탕으로 계산하므로, Positive가 드문 문제에서 오탐이 Precision에 미치는 영향을 더 직접적으로 보여줍니다.

| 데이터와 평가 목적 | 함께 살펴볼 지표 | 해석할 때 볼 점 |
|---|---|---|
| 클래스 비율이 비교적 균형이고 전반적인 순위 성능을 비교 | ROC-AUC | 다양한 임계값에서 TPR과 FPR의 관계를 요약합니다. |
| Positive가 드물고 Positive 예측의 품질이 중요 | PR 커브와 AP 또는 PR-AUC | 무작위 기준선은 Positive 비율이며, FP 증가에 따른 Precision 변화를 확인합니다. |
| 실제 운영 임계값을 정해야 함 | 임계값별 혼동 행렬, Precision·Recall, 예상 비용 | AUC 하나만으로 운영 기준을 결정할 수 없습니다. |

ROC와 PR 중 하나만 항상 더 좋은 것은 아닙니다. 클래스 비율, 관심 클래스, FP와 FN의 비용을 고려해 필요한 지표를 함께 봐야 합니다.

## 5. 임계값 선택하기

커브와 AUC로 여러 임계값에 걸친 성능을 비교한 다음에는 실제 환경에서 사용할 임계값을 정해야 합니다. 이때는 검증 데이터에서 후보 임계값별 혼동 행렬과 Precision·Recall을 계산하고, FP와 FN 각각의 처리 비용을 반영합니다.

- 미탐(FN)이 더 큰 손실을 만든다면 Recall을 높이는 임계값을 검토합니다.
- 오탐(FP)이 더 큰 손실을 만든다면 Precision을 우선하는 임계값을 검토합니다.
- 두 오류 비용이 비슷하고 균형점을 찾고 싶다면 Youden's J(`TPR - FPR`)를 참고할 수 있습니다. 비용이 비대칭인 문제에서는 이 기준만으로 고르면 안 됩니다.

임계값 0.5는 보편적으로 최적인 값이 아닙니다. 점수가 잘 보정되어 있는지, 클래스 비율과 오류 비용이 어떤지에 따라 적절한 임계값이 달라집니다.

## 6. Python에서 계산하기

ROC·PR 커브 함수에는 0/1로 자른 예측값이 아니라 모델의 Positive 점수나 확률을 전달합니다.

```python
from sklearn.metrics import (
    average_precision_score,
    precision_recall_curve,
    roc_auc_score,
    roc_curve,
)

# y_true: 실제 정답(0 또는 1)
# y_score: 모델이 출력한 Positive 점수 또는 확률
fpr, tpr, roc_thresholds = roc_curve(y_true, y_score)
roc_auc = roc_auc_score(y_true, y_score)

precision, recall, pr_thresholds = precision_recall_curve(y_true, y_score)
average_precision = average_precision_score(y_true, y_score)
```

## 정리

ROC 커브는 FPR과 TPR의 관계를, PR 커브는 Recall과 Precision의 관계를 보여줍니다. ROC-AUC와 AP/PR-AUC는 여러 임계값에 걸친 성능을 요약하지만 실제 임계값을 대신 선택하지는 않습니다. Positive가 드문 문제에서는 PR 커브도 확인하고, 최종 운영 기준은 오류 비용을 반영해 정해야 합니다.

## Q&A

> [!question] AUC에 ROC 커브와 PR 커브가 포함되나요?
>
> 곡선과 면적은 별개입니다. ROC 커브 아래 면적을 ROC-AUC, PR 커브를 요약하는 면적 지표를 PR-AUC라고 부릅니다. AP는 PR 성능을 요약하는 널리 쓰이는 별도 계산 방식입니다.

> [!question] ROC-AUC가 높아도 모델이 실무에서 좋지 않을 수 있나요?
>
> 그럴 수 있습니다. Positive가 매우 드물면 FPR이 낮게 유지되어도 오탐 건수가 많을 수 있고, 운영 임계값에서 Precision이 낮을 수 있습니다. 실제 임계값에서의 혼동 행렬과 Precision·Recall을 함께 확인하세요.

> [!question] 임계값을 항상 0.5로 두면 안 되나요?
>
> 0.5는 기본값일 뿐 최적값을 보장하지 않습니다. 검증 데이터와 FP·FN의 업무 비용을 바탕으로 임계값을 조정해야 합니다.
