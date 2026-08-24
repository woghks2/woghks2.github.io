---
title: "3. 공간 도메인 필터링과 이미지 가공"
description: "커널(Kernel)과 합성곱(Convolution)의 수학적 원리를 이해하고, Blurring, Sharpening, Edge Detection 필터를 구현해 봅니다."
date: "2022-07-14"
hashtags: ["ImageProcessing", "Convolution", "Blurring", "Sharpening", "EdgeDetection"]
skills: ["Python", "OpenCV"]
status: "published"
---

# 공간 도메인 필터링과 이미지 가공

디지털 이미지 처리에서 **공간 도메인 필터링(Spatial Domain Filtering)**이란 이미지 공간의 픽셀 좌표 값을 직접 수정하여 이미지를 부드럽게 뭉개거나(Blurring), 선명하게 깎거나(Sharpening), 경계선(Edge)을 검출해 내는 핵심 전처리 기법입니다.

이러한 필터링 연산은 **합성곱(Convolution)**이라는 수학적 행렬 연산을 통해 이루어집니다. 이번 글에서는 합성곱 커널의 기본 성질을 규명하고, 다양한 블러링 필터와 샤프닝, 그리고 경계선 검출 필터의 원리와 Python 구현 코드를 상세하게 정리해 보겠습니다.

---

## 1. 합성곱(Convolution)과 커널(Kernel)의 작동 원리

공간 필터링은 일반적으로 홀수 크기(예: $3 \times 3$, $5 \times 5$, $7 \times 7$)의 작은 2차원 행렬인 **커널(Kernel)** 혹은 **마스크(Mask)**를 사용해 수행됩니다. 

커널이 이미지 전체를 좌상단부터 우하단까지 한 칸씩 미끄러지듯 순회하면서, 겹치는 이미지 영역의 픽셀 값과 커널의 계수(Coefficient)를 1대1로 곱한 뒤 모두 더한 최종 합을 중심 픽셀의 새로운 값으로 결정합니다.

수식으로 쓰면 입력 이미지 $f$, 커널 $w$, 출력 이미지 $g$는 다음처럼 표현됩니다.

$$g(x, y) = \sum_{i=-a}^{a}\sum_{j=-b}^{b} w(i, j) f(x-i, y-j)$$

OpenCV의 `cv2.filter2D()`는 엄밀한 수학적 Convolution처럼 커널을 뒤집기보다는, 실무에서 더 자주 쓰는 Correlation 형태로 동작합니다. 평균 블러나 Sobel처럼 대칭적이거나 방향이 명확한 커널에서는 큰 문제가 없지만, 비대칭 커널을 직접 설계할 때는 이 차이를 알고 있어야 결과 방향을 오해하지 않습니다.

```text
[입력 이미지 픽셀 영역]          [3x3 커널]
    p1  p2  p3                  w1  w2  w3
    p4  p5  p6        *         w4  w5  w6
    p7  p8  p9                  w7  w8  w9

새로운 중심 픽셀 p5' = (p1*w1 + p2*w2 + ... + p9*w9)
```

이때, 커널 행렬 내의 모든 원소의 합이 어떤 값을 가지느냐에 따라 필터의 전체적인 밝기 조절 특성이 결정됩니다.

커널 합이 $1$이면 평균 밝기를 보존하는 필터가 됩니다.

$$\sum_i\sum_j w(i,j)=1$$

커널 합이 $0$이면 일정한 밝기를 가진 평탄 영역이 모두 $0$으로 사라집니다. 그래서 Sobel, Prewitt, Laplacian 같은 미분 필터는 대체로 커널 합이 $0$입니다.

$$\sum_i\sum_j w(i,j)=0$$

또 하나 중요한 것은 경계 처리(Border Handling)입니다. 커널이 이미지 가장자리에 걸리면 참조해야 할 이웃 픽셀이 이미지 밖으로 나갑니다. OpenCV는 `BORDER_REFLECT`, `BORDER_REPLICATE`, `BORDER_CONSTANT` 같은 정책으로 이 문제를 처리합니다. 같은 커널이라도 경계 처리 방식에 따라 이미지 가장자리 결과가 달라질 수 있습니다.

---

## 2. 이미지 스무딩: Blurring 필터 3대장

블러링(Blurring)은 고주파(High Frequency) 잡음이나 디테일한 미세 텍스처를 깎아내어 이미지를 부드럽게 스무딩하는 필터입니다. 

### 2-1. 평균 블러링 (Mean / Average Blur)
커널 영역 내부의 모든 픽셀 값을 균등하게 평균내어 대입합니다. 커널 내 모든 계수의 합은 **반드시 1**이 되어야 합니다. (그렇지 않으면 필터를 거친 이미지의 전체 밝기가 변조됩니다).

$$Kernel_{Mean} = \frac{1}{9} \begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{bmatrix}$$

```python
# OpenCV Mean Blur 구현 및 시각화
k = 7
img_mean_blur = cv2.blur(img_rgb, (k, k))

fig, ax = plt.subplots(1, 2, figsize=(12, 6))
ax[0].imshow(img_rgb)
ax[0].set_title('Original Image')
ax[0].axis('off')

ax[1].imshow(img_mean_blur)
ax[1].set_title(f'Mean Blur (kernel size: {k}x{k})')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Mean Blur 결과 이미지 (kernel size: 7x7)](/images/posts/image-processing/03_spatial_domain_filtering_1.png)
* **한계**: 잡음을 제거해 주지만, 물체의 윤곽선(Edge) 경계까지 심하게 뭉개버린다는 단점이 있습니다.

### 2-2. 미디언 블러링 (Median Blur)
커널 영역 내부의 픽셀 값들을 오름차순으로 정렬한 뒤, 산술 평균이 아닌 **중앙값(Median)**을 취해 대입합니다. 

수식으로 쓰면 중심 픽셀의 출력값은 주변 윈도우 $\Omega_{x,y}$ 안에 있는 픽셀들의 중앙값입니다.

$$g(x,y)=median\{f(s,t)\mid (s,t)\in \Omega_{x,y}\}$$

미디언 필터는 선형 필터가 아닙니다. 그래서 Convolution으로 표현할 수는 없지만, 극단값에 강한 robust estimator로 볼 수 있습니다. 소금-후추 잡음처럼 일부 픽셀만 $0$ 또는 $255$로 튀는 상황에서는 평균보다 중앙값이 훨씬 안정적입니다.

```python
# OpenCV Median Blur 구현 및 시각화
k = 7
img_median_blur = cv2.medianBlur(img_rgb, k)

fig, ax = plt.subplots(1, 2, figsize=(12, 6))
ax[0].imshow(img_rgb)
ax[0].set_title('Original Image')
ax[0].axis('off')

ax[1].imshow(img_median_blur)
ax[1].set_title(f'Median Blur (kernel size: {k}x{k})')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Median Blur 결과 이미지 (kernel size: 7x7)](/images/posts/image-processing/03_spatial_domain_filtering_2.png)
* **독보적인 장점**: 평균 블러링이 커널 내의 터무니없는 극단치(Outlier) 잡음값에 흔들리는 반면, 미디언 필터는 중간값만 골라내므로 **소금-후추 잡음(Salt & Pepper Noise, 검은색과 흰색 점 형태 잡음) 제거에 압도적인 성능**을 보이며 윤곽선도 비교적 뚜렷하게 보존합니다.

### 2-3. 가우시안 블러링 (Gaussian Blur)
중심 픽셀에서 멀어질수록 가중치를 2차원 가우시안 종형 분포 곡선에 따라 감쇄시켜 평균을 구합니다.

$$G(x, y) = \frac{1}{2\pi\sigma^2} e^{-\frac{x^2 + y^2}{2\sigma^2}}$$

```python
# OpenCV Gaussian Blur 구현 및 시각화
# sigmaX=0으로 지정하면 커널 크기에 맞춰 자동으로 시그마(표준편차)가 계산됩니다.
img_gaussian_blur = cv2.GaussianBlur(img_rgb, (25, 25), sigmaX=0)

fig, ax = plt.subplots(1, 2, figsize=(12, 6))
ax[0].imshow(img_rgb)
ax[0].set_title('Original Image')
ax[0].axis('off')

ax[1].imshow(img_gaussian_blur)
ax[1].set_title('Gaussian Blur (kernel size: 25x25)')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Gaussian Blur 결과 이미지 (kernel size: 25x25)](/images/posts/image-processing/03_spatial_domain_filtering_3.png)
* **해석**: 물리적으로 매우 자연스러운 블러 효과를 주며, 주파수 도메인 관점에서는 대표적인 **저주파 통과 필터(Low Pass Filter, LPF)**로 작용하여 고주파 노이즈를 부드럽게 감쇄시킵니다.

---

## 3. 이미지 샤프닝: Sharpening 필터

샤프닝(Sharpening)은 중심 픽셀과 주변 픽셀의 대비를 강제로 키워 흐릿한 이미지의 윤곽을 뚜렷하게 강조하는 고주파 통과 계열 필터입니다. 

* **수학적 특징**: 필터를 거친 이미지의 밝기가 보존되도록 **커널 계수의 총 합은 1**이 되어야 합니다. 중심은 큰 양수값을 가지고, 주변은 어두운 음수값을 배치합니다.

샤프닝은 본질적으로 원본 이미지에 고주파 성분을 더하는 작업입니다. 가장 직관적인 방식은 원본에서 블러 이미지를 뺀 뒤 다시 원본에 더하는 **언샤프 마스킹(Unsharp Masking)**입니다.

$$High(x,y)=I(x,y)-Blur(I)(x,y)$$

$$I_{sharp}(x,y)=I(x,y)+\lambda \cdot High(x,y)$$

여기서 $\lambda$는 샤프닝 강도입니다. 값이 너무 크면 경계 주변에 하얗거나 검은 테두리인 halo artifact가 생길 수 있습니다.

```python
import numpy as np

# 다양한 샤프닝 마스크 정의 및 시각화
kernels = {
    'Sharpen1': np.array([
        [-2, -2, -2],
        [-2, 17, -2],
        [-2, -2, -2]
    ]),
    'Sharpen2': np.array([
        [0, -5, 0],
        [0, 11, 0],
        [0, -5, 0]
    ]),
    'Sharpen3': np.array([
        [0, 0, 0],
        [-5, 11, -5],
        [0, 0, 0]
    ])
}

# Gaussian Blur를 거친 흐린 이미지 준비
img_blur = cv2.GaussianBlur(img_rgb, (15, 15), 0)

fig, ax = plt.subplots(2, 2, figsize=(12, 10))
ax[0, 0].imshow(img_blur)
ax[0, 0].set_title('Blurred Image')
ax[0, 0].axis('off')

for i, (name, kernel) in enumerate(kernels.items(), start=1):
    sharpened_img = cv2.filter2D(img_blur, -1, kernel)
    r, c = i // 2, i % 2
    ax[r, c].imshow(sharpened_img)
    ax[r, c].set_title(name)
    ax[r, c].axis('off')

plt.tight_layout()
plt.show()
```

![Blurred Image 및 Sharpen1, Sharpen2 필터 적용 결과](/images/posts/image-processing/03_spatial_domain_filtering_4.png)
![Sharpen3 적용 결과 이미지](/images/posts/image-processing/03_spatial_domain_filtering_5.png)

---

## 4. 경계선 검출: Edge Detection 필터

경계선(Edge)이란 이미지 내부에서 픽셀 밝기(Luminance)가 급격하게 변하는 지점입니다. 수학적으로는 픽셀 변화율의 **1차 미분(Gradient) 혹은 2차 미분**에 해당합니다.

* **수학적 특징**: 평탄한 영역(Homogeneous Region)을 연산했을 때 출력값이 0이 되어 검은색 배경이 확보되도록 **커널 모든 계수의 합은 반드시 0**이 되어야 합니다.

이미지 밝기 함수 $I(x,y)$의 1차 미분은 두 방향 기울기로 표현됩니다.

$$\nabla I = \left[\frac{\partial I}{\partial x}, \frac{\partial I}{\partial y}\right]$$

경계선의 강도는 보통 gradient magnitude로 계산합니다.

$$|\nabla I| = \sqrt{G_x^2 + G_y^2}$$

방향은 다음처럼 구합니다.

$$\theta = \tan^{-1}\left(\frac{G_y}{G_x}\right)$$

Sobel X는 $G_x$, Sobel Y는 $G_y$를 근사합니다. Laplacian은 2차 미분을 이용해 밝기 변화가 급격하게 꺾이는 지점을 찾습니다.

$$\nabla^2 I = \frac{\partial^2 I}{\partial x^2} + \frac{\partial^2 I}{\partial y^2}$$

```python
# 대표적인 경계선 검출 커널 구성 및 시각화
kernels_edge = {
    'Sobel X': np.array([
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ]),
    'Prewitt Y': np.array([
        [ 1,  1,  1],
        [ 0,  0,  0],
        [-1, -1, -1]
    ]),
    'Laplacian': np.array([
        [ 0, -1,  0],
        [-1,  4, -1],
        [ 0, -1,  0]
    ])
}

fig, ax = plt.subplots(2, 2, figsize=(12, 10))
ax[0, 0].imshow(img_gray, cmap='gray')
ax[0, 0].set_title('Original Gray')
ax[0, 0].axis('off')

for i, (name, kernel) in enumerate(kernels_edge.items(), start=1):
    edge_img = cv2.filter2D(img_gray, -1, kernel)
    r, c = i // 2, i % 2
    ax[r, c].imshow(edge_img, cmap='gray')
    ax[r, c].set_title(name)
    ax[r, c].axis('off')

plt.tight_layout()
plt.show()
```

![Edge Detection 커널(Sobel X/Y, Prewitt X/Y, Laplacian) 적용 결과](/images/posts/image-processing/03_spatial_domain_filtering_6.gif)

### 4-1. Prewitt과 Sobel의 미세한 성능 차이
* **Prewitt 커널**은 계수가 균등하여 구현이 간단하나, 픽셀의 국소적 노이즈에 다소 예민하게 엣지를 잘못 짚는 한계가 있습니다.
* **Sobel 커널**은 중심축 방향 픽셀에 가중치 2를 두는 일종의 가우시안 가중치를 결합한 형태입니다. 노이즈 스무딩 효과가 내포되어 있어 실무 경계선 검출 환경에서 Prewitt보다 훨씬 더 매끄럽고 신뢰성 높은 검출 결과를 보장합니다.

---

## 요약

1. **합성곱(Convolution)**: 이미지 픽셀 평면에 커널 마스크 행렬을 정합하여 이동하며 가중합을 산출하는 기본 공간 연산 기법입니다.
2. **평균 vs 미디언**: 평균 필터는 윤곽을 흐리며 잡음을 지우고, 미디언 필터는 정렬 중앙값 선택 방식으로 소금-후추 잡음을 에지 손상 없이 지워냅니다.
3. **가우시안과 LPF**: 중심 우대 가우시안 분포로 부드러운 흐림 효과를 구현하며 고주파 잡음을 안정적으로 걸러냅니다.
4. **샤프닝의 조건**: 중심은 크고 양수, 주변은 음수를 주며 총합이 1이 되어야 밝기 왜곡 없이 대비만 선명하게 향상됩니다.
5. **경계선 검출의 조건**: 미분 계수 성질에 따라 커널 총합이 0이 되어야 평탄부가 검은색(0)으로 억제되며, Sobel 필터는 가중 차분으로 잡음 둔감 엣지를 추출합니다.
