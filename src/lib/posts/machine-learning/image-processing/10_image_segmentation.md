---
title: "10. 이미지 분할과 객체 검출: K-Means와 Watershed"
description: "컴퓨터 비전의 꽃인 이미지 분할(Image Segmentation) 기법 중 K-Means 클러스터링과 지형학적 경계를 찾는 Watershed 알고리즘을 분석합니다."
date: "2022-08-29"
hashtags: ["ImageProcessing", "ImageSegmentation", "KMeans", "Watershed", "DistanceTransform"]
skills: ["Python", "OpenCV"]
status: "published"
---

# 이미지 분할과 객체 검출: K-Means와 Watershed

컴퓨터 비전(Computer Vision) 시스템에서 이미지 내부의 개별 물체들을 픽셀 단위로 정확하게 뜯어내어 식별하는 작업을 **이미지 분할(Image Segmentation)**이라고 부릅니다. 이는 물체 검출(Object Detection)과 영상 분석, 나아가 의료 인공지능 이미지 진단이나 자율주행차의 도로 인지 시스템 등 상위 수준의 인공지능 분석으로 가기 위한 핵심적인 역할을 수행합니다.

이번 글에서는 머신러닝의 대표적인 비지도 학습(Unsupervised Learning) 기법인 **K-Means 클러스터링**을 픽셀 데이터에 응용하는 방법과, 겹치거나 맞닿아 있는 객체를 개별 단위로 분리해내는 **워터쉐드(Watershed) 알고리즘** 및 **거리 변환(Distance Transform)**의 원리를 상세하게 파헤쳐 보겠습니다.

---

## 1. K-Means 클러스터링을 활용한 색상 기반 분할

**K-Means 클러스터링**은 주어진 데이터를 공간 상에 플롯하고, 데이터 포인트들과 각 군집 중심점(Centroid) 간의 거리 평균을 최소화하는 방식으로 데이터를 $K$개의 그룹으로 묶어내는 머신러닝 알고리즘입니다.

목적 함수는 다음처럼 쓸 수 있습니다.

$$\underset{C}{\arg\min}\sum_{i=1}^{N}\sum_{k=1}^{K} \mathbf{1}(x_i \in C_k)\|x_i-\mu_k\|^2$$

여기서 $x_i$는 하나의 픽셀 벡터이고, $\mu_k$는 $k$번째 군집의 중심입니다. 밝기 하나만 쓰면 1차원 군집화가 되고, RGB나 HSV 채널을 함께 쓰면 색상 공간 안에서 가까운 픽셀끼리 묶는 분할이 됩니다.

K-Means는 다음 두 단계를 수렴할 때까지 반복합니다.

1. 각 픽셀을 가장 가까운 중심점에 할당합니다.

$$label_i = \underset{k}{\arg\min}\|x_i-\mu_k\|^2$$

2. 각 군집에 속한 픽셀들의 평균으로 중심점을 다시 계산합니다.

$$\mu_k = \frac{1}{|C_k|}\sum_{x_i \in C_k}x_i$$

OpenCV의 `criteria`는 이 반복을 언제 멈출지 정합니다. 최대 반복 횟수에 도달하거나, 중심점 변화량이 지정한 epsilon보다 작아지면 학습을 종료합니다.

### 1-1. 이미지 처리에서의 응용
이미지의 각 픽셀 값(Y 채널의 밝기 혹은 RGB 컬러 채널 3차원 벡터)을 데이터 포인트로 변환하여 픽셀의 색상/명도가 유사한 영역들끼리 K-Means로 군집화하면 매우 빠르고 간단하게 색상 기반 이미지 분할을 달성할 수 있습니다.

```python
import cv2
import numpy as np
import matplotlib.pyplot as plt

# 1. 대상 채널 데이터 확보 (예: YCbCr의 Y 채널)
y_channel = img_ycrcb[:, :, 0]

# 2. 데이터를 [픽셀 수, 1] 모양의 2차원 float32 배열로 변경
Z = y_channel.reshape((-1, 1)).astype(np.float32)

# 3. K-Means 학습 종료 조건(Criteria) 설정
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)

# 4. K-Means 수행 (K=2: 전경과 배경 2그룹으로 군집화)
K = 2
ret, labels, centers = cv2.kmeans(
    Z, K, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS
)

# 5. 소속된 라벨의 군집 중심값으로 픽셀값을 치환하여 이미지 재구성
centers = centers.astype(np.uint8)
img_segmented = centers[labels.flatten()].reshape(y_channel.shape)

# 6. 결과 시각화
fig, ax = plt.subplots(1, 2, figsize=(12, 6))
ax[0].imshow(img_gray, cmap='gray')
ax[0].set_title('Original Grayscale')
ax[0].axis('off')

ax[1].imshow(img_segmented, cmap='gray')
ax[1].set_title(f'Segmented Image (K={K})')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Original 및 K-Means Clustering 분할(K=2) 결과 비교](/images/posts/image-processing/10_image_segmentation_1.gif)

이 기법은 사전 라벨 데이터가 없는 환경에서 전반적인 명암 대비나 색조 분포에 따라 화면을 덩어리 영역으로 큼직하게 묶어내는 1차 전처리 기법으로 훌륭하게 활약합니다.

---

## 2. 워터쉐드 알고리즘 (Watershed Algorithm)

**워터쉐드(Watershed)**는 이미지를 지형학적인 고저차(밝기가 밝을수록 높은 산맥, 어두울수록 계곡 평지)로 모델링하여, 계곡에 물을 채웠을 때 서로 다른 웅덩이의 물이 만나 경계를 검출해내는 영역 분할 알고리즘입니다.

특히 동전 여러 개가 겹쳐 있거나 **서로 맞닿아 있는 객체를 개별 단위로 떼어내어 검출할 때** 효과적입닌다.

워터쉐드는 완전히 자동으로 경계를 잘라내는 알고리즘이라기보다, **마커 기반 영역 성장(Marker-based Region Growing)**에 가깝게 이해하는 편이 좋습니다. 확실한 전경에는 서로 다른 라벨을 붙이고, 확실한 배경과 모호한 경계 영역을 구분한 뒤, 라벨이 경사면을 따라 확장되다가 서로 만나는 지점을 경계로 확정합니다.

```text
[입력 이미지] 
   └── 이진화 & Opening (기본 노이즈 제거)
         ├── 팽창 (Sure Background 확보)
         └── 거리 변환 & Threshold (Sure Foreground 확보)
               └── 차분 연산 (모호한 경계 Unknown 영역 도출)
                     └── connectedComponents 라벨링 후 watershed 실행 ──> [최종 분할]
```

### 2-1. 워터쉐드 다단계 구현 정석

```python
# 1단계: Gaussian Blur 및 Otsu 이진화 후 Opening을 통한 기본 노이즈 제거
blur = cv2.GaussianBlur(img_gray, (5, 5), 0)
_, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

kernel = np.ones((3, 3), np.uint8)
opening = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel, iterations=2)

# 2단계: 확실한 배경(Sure Background) 확보
sure_bg = cv2.dilate(opening, kernel, iterations=3)

# 3단계: 거리 변환(Distance Transform)을 통한 확실한 전경(Sure Foreground) 확보
dist_transform = cv2.distanceTransform(opening, cv2.DIST_L2, 5)

# 최대 거리의 70% 이상인 핵심 영역만 확실한 전경으로 분리 필터링합니다.
_, sure_fg = cv2.threshold(dist_transform, 0.7 * dist_transform.max(), 255, 0)
sure_fg = np.uint8(sure_fg)

# 4단계: 모호한 경계 영역(Unknown) 산출
unknown = cv2.subtract(sure_bg, sure_fg)

# 5단계: 확실한 전경에 고유 라벨 마커 부여
_, markers = cv2.connectedComponents(sure_fg)
markers = markers + 1
markers[unknown == 255] = 0

# 6단계: 워터쉐드 실행
markers = cv2.watershed(img_rgb, markers)

# 7단계: 검출된 경계선 시각화 (-1 영역을 빨간색 외곽선으로 그리기)
img_rgb[markers == -1] = [255, 0, 0]

# 8단계: 단계별 중간 분석 시각화
fig, ax = plt.subplots(2, 3, figsize=(15, 10))
titles = ['Sure Background', 'Distance Transform', 'Sure Foreground', 
          'Unknown Region', 'Markers (Colored)', 'Segmented Result']
images = [sure_bg, dist_transform, sure_fg, unknown, markers, img_rgb]

for idx in range(6):
    r, c = idx // 3, idx % 3
    cmap = 'jet' if idx == 4 else 'gray'
    if idx == 5:
        ax[r, c].imshow(images[idx])
    else:
        ax[r, c].imshow(images[idx], cmap=cmap)
    ax[r, c].set_title(titles[idx])
    ax[r, c].axis('off')

plt.tight_layout()
plt.show()
```

![Watershed 알고리즘 단계별 중간 분석(Sure BG, Sure FG, Markers, Segmented) 시각화](/images/posts/image-processing/10_image_segmentation_2.png)

### 2-2. 거리 변환(Distance Transform)이 핵심인 이유
단순히 이진화만 수행하면 맞닿아 있는 두 개의 동전이 하나의 커다란 덩어리 픽셀로 결합해 버려 개수(Count)를 세거나 분할할 수 없습니다. 

거리 변환은 각 전경 픽셀에서 가장 가까운 배경 픽셀까지의 거리를 계산합니다.

$$D(p)=\min_{q \in Background} d(p,q)$$

OpenCV에서 `cv2.DIST_L2`를 쓰면 유클리드 거리에 가까운 값을 계산합니다.

$$d(p,q)=\sqrt{(p_x-q_x)^2+(p_y-q_y)^2}$$

하지만 **거리 변환**을 적용하면 두 동전의 접점 영역은 배경과 가까워 거리 값이 매우 낮게 나오는 반면, 두 동전의 정중앙 코어 영역은 거리가 깊어 높은 값(봉우리)을 형성합니다. 이를 통해 **두 동전의 개별적인 씨앗(Seed) 영역을 확실한 전경(Sure Foreground)으로 따로 쪼개어 검출**할 수 있게 되는 것이며, 이것이 워터쉐드 알고리즘의 강력한 동작 원리입니다.

워터쉐드가 실패하는 대표적인 경우는 마커가 너무 많거나 너무 적을 때입니다. 마커가 너무 많으면 하나의 객체가 여러 조각으로 찢어지는 over-segmentation이 발생하고, 마커가 너무 적으면 서로 다른 객체가 하나로 합쳐지는 under-segmentation이 발생합니다. 따라서 이진화, 모폴로지, 거리 변환 임계값을 조절하는 과정이 실제 성능을 좌우합니다.

---

## 요약

1. **이미지 분할(Segmentation)**: 의미론적으로 유사한 픽셀끼리 묶어 객체를 정확히 배경과 격리하는 컴퓨터 비전의 상위 전처리 연산입니다.
2. **K-Means 픽셀 군집화**: 별도 정보 없이 색상/명암 데이터의 거리 최적화 수식을 기반으로 이미지를 $K$개의 균등 덩어리 영역으로 나눕니다.
3. **지형학적 모델링(Watershed)**: 이미지 밝기 고도를 물 채우기 범람 모형으로 해석하여 객체 간 경계를 분수령(Markers = -1)으로 잡아내는 엣지 정밀 기법입니다.
4. **거리 변환(Distance Transform)의 가치**: 배경과의 유클리드 거리를 측정해 접합되어 뭉쳐 버린 여러 전경 물체의 독자적인 무게 중심(Sure Foreground)을 발라내어 분산 분할에 성공하게 해 줍니다.
