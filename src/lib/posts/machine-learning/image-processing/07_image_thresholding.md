---
title: "7. 임계 처리와 오츠(Otsu) 이진화"
description: "디지털 이미지 이진화의 기초인 단순 임계 처리부터 수학적으로 최적의 임계치를 찾아내는 오츠 알고리즘 및 조명 불균일을 극복하는 적응형 이진화 기법을 알아봅니다."
date: "2022-08-05"
hashtags: ["ImageProcessing", "Thresholding", "OtsuBinarization", "AdaptiveThreshold", "OpenCV"]
skills: ["Python", "OpenCV"]
status: "published"
---

# 임계 처리와 오츠(Otsu) 이진화

디지털 이미지 처리에서 **임계 처리(Thresholding)** 혹은 **이진화(Binarization)**란 이미지의 각 픽셀 밝기 값을 특정 기준값인 임계치 $T$와 비교하여, 검은색(0)과 흰색(255)의 두 가지 값만 갖는 이진 이미지로 변환하는 가장 핵심적인 이진 필터링 연산입니다.

이진화는 주로 복잡한 배경에서 글자나 셀 부품 등 우리가 관심 있는 물체(Foreground)만을 뚜렷하게 분리해 내기 위한 전처리 단계로 사용됩니다. 이번 글에서는 기본적인 전역 임계 처리 플래그 종류, 최적의 임계치를 자동으로 산출하는 **오츠(Otsu) 알고리즘**의 수학적 유도, 그리고 불균일한 조명 문제를 해결하는 **적응형 이진화(Adaptive Thresholding)**의 원리까지 살펴보겠습니다.

---

## 1. 전역 임계 처리 (Global Thresholding)

전역 임계 처리는 이미지 내 모든 픽셀에 동일한 단일 임계값 $T$를 일괄 적용하여 픽셀 값을 변환하는 방식입니다. OpenCV의 `cv2.threshold` 함수는 다양한 변환 모드 플래그를 지원합니다.

가장 기본적인 이진화는 다음과 같은 계단 함수로 볼 수 있습니다.

$$g(x, y) = \begin{cases}
255, & f(x, y) > T \\
0, & f(x, y) \le T
\end{cases}$$

이 방식은 구현이 단순하고 빠르지만, 임계값 $T$ 하나가 이미지 전체를 대표해야 한다는 전제를 갖습니다. 조명이 균일하고 전경/배경의 밝기 분포 차이가 클 때 잘 작동합니다.

```python
import cv2
import matplotlib.pyplot as plt

# 1. 흑백 이미지 로드
img_gray = cv2.imread("image.jpg", cv2.IMREAD_GRAYSCALE)

# 2. 임계값 T=127을 기준으로 이진화 및 반전 이진화 수행
cutoff = 127
ret, img_thresh = cv2.threshold(img_gray, cutoff, 255, cv2.THRESH_BINARY)
ret, img_thresh_rev = cv2.threshold(img_gray, cutoff, 255, cv2.THRESH_BINARY_INV)

# 시각화
fig, ax = plt.subplots(1, 3, figsize=(15, 5))
ax[0].imshow(img_gray, cmap='gray')
ax[0].set_title('Original Grayscale')
ax[0].axis('off')

ax[1].imshow(img_thresh, cmap='gray')
ax[1].set_title(f'THRESH_BINARY (T={cutoff})')
ax[1].axis('off')

ax[2].imshow(img_thresh_rev, cmap='gray')
ax[2].set_title(f'THRESH_BINARY_INV (T={cutoff})')
ax[2].axis('off')

plt.tight_layout()
plt.show()
```

![임계값 T 설정에 따른 Binary Thresholding과 Binary Inverse 결과](/images/posts/image-processing/07_image_thresholding_1.png)

### 1-1. 대표적인 임계 처리 플래그(Flag) 동작 방식

| OpenCV 플래그 | 수학적 맵핑 동작 | 특징 |
| :--- | :--- | :--- |
| **`cv2.THRESH_BINARY`** | $dst(x,y) = \begin{cases} maxval & \text{if } src(x,y) > T \\ 0 & \text{otherwise} \end{cases}$ | 일반적인 이진화. 밝은 영역은 흰색, 어두운 영역은 검은색으로 고정. |
| **`cv2.THRESH_BINARY_INV`** | $dst(x,y) = \begin{cases} 0 & \text{if } src(x,y) > T \\ maxval & \text{otherwise} \end{cases}$ | BINARY 결과를 반전시킴. |
| **`cv2.THRESH_TRUNC`** | $dst(x,y) = \begin{cases} T & \text{if } src(x,y) > T \\ src(x,y) & \text{otherwise} \end{cases}$ | $T$보다 큰 픽셀은 $T$로 강제로 깎아 뭉개고, 작은 픽셀은 원래 값을 보존. |
| **`cv2.THRESH_TOZERO`** | $dst(x,y) = \begin{cases} src(x,y) & \text{if } src(x,y) > T \\ 0 & \text{otherwise} \end{cases}$ | $T$보다 어두운 픽셀은 아예 검은색(0)으로 묻어버림. |
| **`cv2.THRESH_TOZERO_INV`**| $dst(x,y) = \begin{cases} 0 & \text{if } src(x,y) > T \\ src(x,y) & \text{otherwise} \end{cases}$ | $T$보다 밝은 픽셀을 검은색(0)으로 지워버림. |

---

## 2. 오츠 이진화 (Otsu's Binarization)

전역 이진화를 수행할 때 가장 어려운 문제는 **"임계치 $T$를 몇으로 정해야 물체가 가장 깔끔하게 떨어지는가?"**입니다. 사람이 눈으로 보며 수동으로 조절하는 방식은 자동화 공정에 쓸 수 없습니다. 

**오츠(Otsu) 알고리즘**은 이미지의 밝기 분포 히스토그램을 분석하여, 수학적으로 **최적의 전역 임계값 $T$를 스스로 계산해 내는** 알고리즘입니다.

### 2-1. 수학적 알고리즘 원리
오츠 알고리즘은 이미지를 특정 임계값 $T$를 기준으로 배경(Background, $C_1$)과 전경(Foreground, $C_2$)이라는 두 개의 클래스로 분류합니다.

좋은 이진화란 배경에 속한 픽셀들은 배경끼리 뭉치고, 전경에 속한 픽셀들은 전경끼리 잘 뭉쳐서 두 집단이 확연하게 구분되는 상태를 뜻합니다. 이를 통계적으로 해석하면 **"클래스 간 분산(Between-Class Variance, $\sigma_B^2$)을 최대화"**하는 임계값 $T$를 구하는 것과 일치합니다.

임계값 $T$에 대해 두 클래스의 확률은 다음처럼 계산됩니다.

$$\omega_1(T)=\sum_{i=0}^{T}p(i), \quad \omega_2(T)=\sum_{i=T+1}^{L-1}p(i)$$

각 클래스의 평균 밝기는 다음과 같습니다.

$$\mu_1(T)=\frac{1}{\omega_1(T)}\sum_{i=0}^{T}i p(i), \quad \mu_2(T)=\frac{1}{\omega_2(T)}\sum_{i=T+1}^{L-1}i p(i)$$

$$\sigma_B^2(T) = \omega_1(T) \omega_2(T) [\mu_1(T) - \mu_2(T)]^2$$

* $\omega_1(T), \omega_2(T)$: 임계값 $T$를 기준으로 나누어진 두 클래스의 픽셀 수 비율 (확률)
* $\mu_1(T), \mu_2(T)$: 두 클래스의 평균 밝기값

오츠 알고리즘은 밝기 범위인 $0 \sim 255$ 전체를 루프 돌며 위 식의 가중 분산 값 $\sigma_B^2(T)$을 계산하고, **이 값을 최대로 만드는 $T$를 최종 임계치로 선정**합니다.

동일한 문제를 클래스 내부 분산(Within-Class Variance)을 최소화하는 문제로도 볼 수 있습니다.

$$\sigma_W^2(T)=\omega_1(T)\sigma_1^2(T)+\omega_2(T)\sigma_2^2(T)$$

전체 분산은 고정되어 있으므로, 클래스 간 분산을 최대화하는 것과 클래스 내부 분산을 최소화하는 것은 같은 목표가 됩니다.

### 2-2. OpenCV 구현
```python
# 오츠 이진화 수행 및 시각화
# 임계치 값에 0을 입력하고, 플래그에 cv2.THRESH_OTSU를 결합(|)하여 전달합니다.
ret, img_otsu = cv2.threshold(img_gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

fig, ax = plt.subplots(1, 2, figsize=(10, 5))
ax[0].imshow(img_gray, cmap='gray')
ax[0].set_title('Grayscale Image')
ax[0].axis('off')

ax[1].imshow(img_otsu, cmap='gray')
ax[1].set_title(f'Otsu Thresholding (T={ret:.1f})')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Grayscale Image 및 Otsu Thresholding 결과 비교](/images/posts/image-processing/07_image_thresholding_2.png)

---

### 2-3. 기타 전역 임계 처리 기법 (Trunc, ToZero)

`cv2.THRESH_TRUNC`, `cv2.THRESH_TOZERO` 등의 플래그를 활용하여 임계치를 기준으로 픽셀 밝기를 제한하거나 잘라내는 실습 코드입니다.

```python
# TRUNC, TOZERO, TOZERO_INV 이진화 및 시각화
cutoff = 127
_, img_trunc = cv2.threshold(img_gray, cutoff, 255, cv2.THRESH_TRUNC)
_, img_tozero = cv2.threshold(img_gray, cutoff, 255, cv2.THRESH_TOZERO)
_, img_tozero_inv = cv2.threshold(img_gray, cutoff, 255, cv2.THRESH_TOZERO_INV)

fig, ax = plt.subplots(2, 2, figsize=(10, 10))
ax[0, 0].imshow(img_gray, cmap='gray')
ax[0, 0].set_title('Original Gray')
ax[0, 0].axis('off')

ax[0, 1].imshow(img_trunc, cmap='gray')
ax[0, 1].set_title('THRESH_TRUNC')
ax[0, 1].axis('off')

ax[1, 0].imshow(img_tozero, cmap='gray')
ax[1, 0].set_title('THRESH_TOZERO')
ax[1, 0].axis('off')

ax[1, 1].imshow(img_tozero_inv, cmap='gray')
ax[1, 1].set_title('THRESH_TOZERO_INV')
ax[1, 1].axis('off')

plt.tight_layout()
plt.show()
```

![Original 및 TRUNC, TOZERO, TOZERO_INV 필터 결과 비교](/images/posts/image-processing/07_image_thresholding_3.png)

---

## 3. 적응형 이진화 (Adaptive Thresholding)

오츠 알고리즘을 포함한 전역 이진화는 이미지 전체의 밝기 분포가 균일할 때는 완벽하게 작동합니다. 하지만 실제로 그림자가 지거나 조명이 한쪽 방향에서 강하게 들어와 **조명이 불균일한 이미지**를 처리해야 할 때가 많습니다. 이 경우 전역 임계값을 쓰면 어두운 쪽 영역은 글자가 통째로 타서 사라지거나 검게 뭉개집니다.

**적응형 이진화**는 픽셀 하나하나마다 **이웃하는 국소 영역(Block)**을 따로 지정하여, 개별 위치마다 임계값을 동적으로 계산하여 이진화를 수행합니다.

각 픽셀의 임계값은 주변 블록 $\Omega_{x,y}$에서 계산됩니다. 평균 방식은 다음과 같습니다.

$$T(x,y)=\frac{1}{|\Omega_{x,y}|}\sum_{(s,t)\in\Omega_{x,y}}I(s,t)-C$$

가우시안 방식은 중심에 가까운 픽셀에 더 큰 가중치를 줍니다.

$$T(x,y)=\sum_{(s,t)\in\Omega_{x,y}}G(s,t)I(s,t)-C$$

따라서 출력은 전역 임계값이 아니라 위치별 임계값 $T(x,y)$로 결정됩니다.

$$g(x,y)=
\begin{cases}
255, & I(x,y)>T(x,y) \\
0, & I(x,y)\le T(x,y)
\end{cases}$$

```python
# 적응형 이진화 구현
img_adaptive_mean = cv2.adaptiveThreshold(
    img_gray,
    255,
    cv2.ADAPTIVE_THRESH_MEAN_C,  # 임계값 계산 규칙 1: 이웃 픽셀들의 평균값
    cv2.THRESH_BINARY,
    7,  # Block Size: 이웃을 탐색할 홀수 크기의 윈도우 크기 (7x7)
    5   # C: 평균값에서 차감할 보정 상수 (임계치를 살짝 낮추어 잡음 방지)
)

img_adaptive_gaussian = cv2.adaptiveThreshold(
    img_gray,
    255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,  # 임계값 계산 규칙 2: 가우시안 분포 가중 평균값
    cv2.THRESH_BINARY,
    7,
    5
)
```

### 3-1. 평균 방식 vs 가우시안 방식의 차이
* **Mean C**: 지정된 블록 내의 단순 평균에서 $C$를 뺍니다. 노이즈에 다소 민감하지만 경계가 날카롭게 분리됩니다.
* **Gaussian C**: 중심에 가까운 이웃 픽셀에 가중치를 두어 임계값을 구하므로, 조명 불균일과 그림자가 아주 미세하게 복잡한 문서나 질감 표면에서 **Mean 방식보다 훨씬 깨끗하고 잡음이 적은 엣지 이진화 결과**를 선사합니다.

---

## 요약

1. **이진화의 본질**: 임계치를 기준으로 이미지를 흑(0)과 백(255)의 명확한 전경/배경 구도로 분리하는 기초적인 형상 추출 기법입니다.
2. **OpenCV 임계 플래그**: `THRESH_BINARY`, `THRESH_TRUNC`, `THRESH_TOZERO` 등을 이용하여 조건별 픽셀 정제 정책을 결정합니다.
3. **오츠(Otsu) 알고리즘**: 클래스 간 분산($\sigma_B^2$)을 최대화하는 통계적 임계점 $T$를 탐색해 주는 똑똑한 전역 자동 이진화 기법입니다.
4. **적응형 이진화의 가치**: 전역 단일 임계 처리의 한계인 불균일 조명 및 그림자 간섭 문제를 국소 윈도우(Block)별 임계값 계산(Mean, Gaussian)을 통해 원천 해결합니다.
