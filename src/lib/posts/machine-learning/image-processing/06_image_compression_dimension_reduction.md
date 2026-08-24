---
title: "6. 이미지 압축과 차원 축소: PCA, SVD, DCT"
description: "디지털 이미지의 데이터 용량을 절약하기 위한 핵심 기법인 PCA 주성분 분석, SVD 특이값 분해, 그리고 JPEG의 핵심인 DCT 변환의 원리를 알아봅니다."
date: "2022-07-28"
hashtags: ["ImageProcessing", "ImageCompression", "PCA", "SVD", "DCT"]
skills: ["Python", "OpenCV"]
status: "published"
---

# 이미지 압축과 차원 축소: PCA, SVD, DCT

고화질 디지털 이미지는 가로, 세로 픽셀의 단순 배열만으로도 수백만 개에서 수천만 개의 픽셀 데이터를 갖기 때문에 저장 용량과 전송 대역폭 측면에서 상당한 연산 부하를 일으킵니다.

이를 해결하기 위해 컴퓨터 비전에서는 정보의 손실을 최소화하면서 데이터 크기를 대폭 낮추는 **차원 축소(Dimension Reduction)** 및 **이미지 압축(Image Compression)** 기법을 사용합니다. 이번 글에서는 대표적인 기법인 **PCA**와 **SVD**, 그리고 실제 JPEG 이미지 압축 알고리즘의 심장 역할을 하는 **DCT**의 원리와 Python 구현 코드를 상세하게 정리해 보겠습니다.

---

## 1. 압축의 기준: 모든 픽셀이 같은 중요도를 갖지는 않는다

원본 RGB 이미지를 그대로 저장하면 필요한 데이터 크기는 대략 다음과 같습니다.

$$Size = H \times W \times 3 \times bitdepth$$

예를 들어 8비트 RGB 이미지라면 픽셀 하나당 24비트가 필요합니다. 하지만 자연 이미지는 인접 픽셀끼리 비슷한 색을 갖는 경우가 많고, 저주파 구조가 전체 인상을 대부분 결정합니다. 즉, 데이터는 많지만 실제 정보량은 그보다 작습니다.

PCA, SVD, DCT는 모두 이 중복성을 이용합니다. 큰 에너지를 가진 축이나 주파수 성분만 남기고, 사람이 잘 못 느끼거나 정보량이 작은 성분을 버리는 방식입니다. 차이는 "어떤 좌표계에서 중요도를 정렬하느냐"에 있습니다.

---

## 2. PCA (주성분 분석, Principal Component Analysis)

**PCA**는 데이터의 분산(Variance)을 최대한 보존하는 새로운 직교 축(주성분, Principal Component)을 찾아내어 저차원 공간으로 데이터를 프로젝션하는 대표적인 통계학적 차원 축소 기법입니다.

### 2-1. 이미지 데이터에서의 동작 원리
가로 $W$, 세로 $H$를 갖는 이미지 행렬을 데이터 포인트들의 집합으로 보고 공분산 행렬(Covariance Matrix)을 유도합니다. 이 공분산 행렬의 고유벡터(Eigenvector)들이 곧 주성분 방향이 되며, 이에 해당하는 고유값(Eigenvalue) 크기 순서대로 상위 $k$개의 성분만 남겨두고 데이터를 압축합니다.

데이터 행렬을 $X$라고 할 때, 평균을 제거한 중심화 행렬은 다음과 같습니다.

$$X_c = X - \mu$$

공분산 행렬은 다음처럼 계산됩니다.

$$C = \frac{1}{n-1}X_c^T X_c$$

PCA는 이 공분산 행렬의 고유값 문제를 푸는 과정입니다.

$$Cv_i = \lambda_i v_i$$

고유값 $\lambda_i$가 클수록 해당 방향 $v_i$가 데이터의 분산을 많이 설명합니다. 그래서 상위 $k$개의 고유벡터만 모아 투영하면, 원본 정보의 큰 축은 보존하면서 작은 변동 성분은 버릴 수 있습니다.

$$Z = X_c W_k$$

복원은 다시 원래 좌표계로 되돌리는 과정입니다.

$$\hat{X}=ZW_k^T+\mu$$

```python
import numpy as np
import cv2
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

# 1. YCrCb 변환 후 밝기(Y) 채널만 분리하여 압축을 진행합니다 (색조 왜곡 방지)
img_ycrcb = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2YCrCb)
y, cr, cb = cv2.split(img_ycrcb)

# 2. PCA 차원 축소 수행 (상위 k개의 주성분만 남김)
k = 30
pca = PCA(n_components=k)
# fit_transform을 통해 데이터를 k차원 주성분 공간으로 압축합니다.
y_pca = pca.fit_transform(y) 

# 3. 압축된 데이터로부터 다시 역변환(Reconstruction) 수행
y_reconstructed = pca.inverse_transform(y_pca) 
y_reconstructed = np.clip(y_reconstructed, 0, 255).astype(np.uint8)

# 4. 색차 채널과 결합 후 RGB로 복원
img_pca_comp = cv2.merge([y_reconstructed, cr, cb])
img_pca_comp = cv2.cvtColor(img_pca_comp, cv2.COLOR_YCrCb2RGB)
```

### 2-2. 설명 분산 비율(Explained Variance Ratio)의 분석
주성분 개수 $k$를 결정할 때는 누적 설명 분산 비율을 플롯하여 분석합니다.

```python
# 설명 분산 비율 분석 및 그래프 출력
explained_variance = pca.explained_variance_ratio_
cumulative_variance = np.cumsum(explained_variance)

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(range(1, k + 1), explained_variance, marker='o', label='Explained Variance')
ax.plot(range(1, k + 1), cumulative_variance, marker='s', label='Cumulative Variance')
ax.set_xlabel('Principal Components')
ax.set_ylabel('Variance Ratio')
ax.set_title('PCA Explained Variance Ratio')
ax.set_ylim([-0.05, 1.05])
ax.legend(loc='best')
plt.tight_layout()
plt.show()
```

![PCA 고유값 설명 분산 및 누적 분산 비율 그래프](/images/posts/image-processing/06_image_compression_dimension_reduction_2.png)
* 대다수 일반 이미지의 경우 상위 $30 \sim 50$개의 성분만으로 전체 데이터 정보량의 **90% 이상**을 거뜬히 표현해 낼 수 있어, 비약적인 용량 절약이 가능합니다.

---

## 3. SVD (특이값 분해, Singular Value Decomposition)

**SVD**는 임의의 $M \times N$ 행렬 $A$를 세 개의 특수한 행렬의 곱으로 완벽히 분해하는 기법입니다.

$$A = U \Sigma V^T$$

* $U$: $M \times M$ 직교 행렬 (Left Singular Vectors, 행 공간의 특성)
* $V^T$: $N \times N$ 직교 행렬 (Right Singular Vectors, 열 공간의 특성)
* $\Sigma$: $M \times N$ 대각 행렬 (Singular Values, 특이값)

### 3-1. Truncated SVD를 이용한 이미지 압축
$\Sigma$의 대각 원소인 특이값 $\sigma_i$는 이미지 구조에서 에너지가 큰 순서대로 내림차순 정렬됩니다. 이 중 상위 $k$개의 특이값과 이에 매핑되는 좌우 고유벡터들만 남기고 나머지를 버리는 방식으로 이미지를 저차원 근사하여 압축합니다.

상위 $k$개 특이값만 남긴 근사 행렬은 다음과 같습니다.

$$A_k = U_k\Sigma_kV_k^T$$

SVD 압축이 강력한 이유는 **Eckart-Young 정리** 때문입니다. Frobenius norm 기준으로 원본 행렬 $A$를 rank-$k$ 행렬로 근사할 때, $A_k$가 가장 오차가 작은 최적해입니다.

$$A_k = \underset{rank(B)=k}{\arg\min}\|A-B\|_F$$

즉, 같은 개수의 선형 성분만 남긴다는 조건에서는 SVD가 가장 효율적으로 이미지를 근사합니다.

```python
# SVD 수행 (y 채널)
U, S, VT = np.linalg.svd(y, full_matrices=False)

# 대각 행렬 형태로 변환
S_matrix = np.diag(S)

# 상위 k개의 특이값 성분만 추출
k = 30
U_k = U[:, :k]
S_k = S_matrix[:k, :k]
VT_k = VT[:k, :]

# 행렬곱 연산을 통해 저차원 근사 복원 수행
y_isvd = np.dot(U_k, np.dot(S_k, VT_k))
y_isvd = np.clip(y_isvd, 0, 255).astype(np.uint8)

# 컬러 복원
img_svd_comp = cv2.merge([y_isvd, cr, cb])
img_svd_rgb = cv2.cvtColor(img_svd_comp, cv2.COLOR_YCrCb2RGB)

# 시각화
fig, ax = plt.subplots(1, 2, figsize=(12, 6))
ax[0].imshow(img_rgb)
ax[0].set_title('Original Image')
ax[0].axis('off')

ax[1].imshow(img_svd_rgb)
ax[1].set_title(f'SVD Image (Components: {k})')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Original 및 SVD (Components: 30) 압축 복원 결과](/images/posts/image-processing/06_image_compression_dimension_reduction_3.gif)

SVD는 PCA와 수학적으로 동등한 맥락을 지니고 있어 이미지의 윤곽과 주요 질감 구조를 저차원 특이값 조합만으로 뚜렷하게 복원해 내는 강점을 보입니다.

```python
# SVD 특이값 설명 분산 및 누적 분산 비율 그래프
explained_variance_svd = (S**2) / np.sum(S**2)
cumulative_variance_svd = np.cumsum(explained_variance_svd)

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot(range(1, len(S) + 1), explained_variance_svd, label='Explained Variance')
ax.plot(range(1, len(S) + 1), cumulative_variance_svd, label='Cumulative Variance')
ax.set_xlabel('Singular Values Index')
ax.set_ylabel('Variance Ratio')
ax.set_title('SVD Explained Variance Ratio')
ax.set_xlim([0, k])
ax.set_ylim([-0.05, 1.05])
ax.legend(loc='best')
plt.show()
```

![SVD 특이값 설명 분산 및 누적 분산 비율 그래프](/images/posts/image-processing/06_image_compression_dimension_reduction_4.png)

---

## 4. DCT (이산 코사인 변환, Discrete Cosine Transform)

**DCT**는 푸리에 변환과 유사하게 이미지 신호를 주파수 성분으로 매핑하지만, **실수(Real Number) 성분인 코사인(Cosine) 파형들만의 조합**으로 이미지를 변환합니다.

푸리에 변환이 복소수 지수 함수를 기반으로 신호를 분해한다면, DCT는 대칭 확장된 신호를 코사인 기저 함수만으로 분해합니다. 이미지 압축에서는 허수부를 따로 다룰 필요가 없고, 자연 이미지의 에너지를 낮은 주파수 쪽에 잘 모아주기 때문에 DFT보다 훨씬 실용적인 선택이 됩니다.

### 4-1. 2D DCT의 수학적 정의

이미지 블록 $f(x, y)$의 크기가 $N \times N$이라고 할 때, 2차원 DCT 계수 $F(u, v)$는 다음과 같이 정의됩니다.

$$F(u, v) = \alpha(u)\alpha(v)\sum_{x=0}^{N-1}\sum_{y=0}^{N-1} f(x, y)\cos\left[\frac{(2x+1)u\pi}{2N}\right]\cos\left[\frac{(2y+1)v\pi}{2N}\right]$$

여기서 정규화 계수 $\alpha(k)$는 다음과 같습니다.

$$\alpha(k)=
\begin{cases}
\sqrt{\frac{1}{N}}, & k=0 \\
\sqrt{\frac{2}{N}}, & k>0
\end{cases}$$

역변환(IDCT)은 DCT 계수들을 다시 코사인 기저 함수의 가중합으로 더해 원래 픽셀 블록을 복원합니다.

$$f(x, y) = \sum_{u=0}^{N-1}\sum_{v=0}^{N-1} \alpha(u)\alpha(v)F(u, v)\cos\left[\frac{(2x+1)u\pi}{2N}\right]\cos\left[\frac{(2y+1)v\pi}{2N}\right]$$

이 식에서 $F(0, 0)$은 **DC 성분**이라고 부릅니다. 블록 전체의 평균 밝기를 담고 있습니다. 반대로 $u$와 $v$가 커질수록 더 빠르게 진동하는 고주파 성분, 즉 세밀한 질감이나 경계 변화에 해당합니다.

### 4-2. 왜 JPEG는 8x8 블록을 쓰는가?

JPEG는 전체 이미지를 한 번에 DCT하지 않고, 이미지를 작은 $8 \times 8$ 블록으로 나눈 뒤 각 블록마다 DCT를 적용합니다.

```text
[원본 이미지]
  └── YCbCr 변환
        └── 8x8 블록 분할
              └── 각 블록에 DCT
                    └── 양자화(Quantization)
                          └── 지그재그 스캔 + 엔트로피 부호화
```

블록 단위로 처리하는 이유는 세 가지입니다.

* **지역적 유사성**: 자연 이미지는 가까운 픽셀끼리 비슷한 값을 갖습니다. 작은 블록 안에서는 이 성질이 더 강해져 저주파 성분에 에너지가 잘 몰립니다.
* **계산 효율**: 전체 이미지에 거대한 DCT를 적용하는 것보다, 작은 블록을 반복 처리하는 편이 메모리와 연산 측면에서 훨씬 다루기 쉽습니다.
* **손실 제어**: 블록별로 고주파 성분을 강하게 줄이면 용량이 크게 줄고, 사람 눈에는 상대적으로 덜 거슬립니다.

다만 압축률을 과하게 높이면 블록 경계가 사각형으로 드러나는 **블로킹 아티팩트(Blocking Artifact)**가 생깁니다. JPEG 특유의 네모난 깨짐 현상은 바로 이 $8 \times 8$ 블록 처리의 부작용입니다.

### 4-3. 에너지 집중(Energy Compaction) 효과와 JPEG 압축
DCT는 일반 이미지 데이터가 가진 에너지를 **좌측 상단(저주파 영역)으로 극도로 몰아넣는 에너지 집중 효과**가 대단히 뛰어납니다.

아래처럼 DCT 계수 행렬을 보면 좌측 상단은 낮은 주파수, 우측 하단은 높은 주파수입니다.

```text
저주파(평균 밝기, 큰 구조)  →  고주파(경계, 질감, 노이즈)
┌─────────────────────────────┐
│ DC   low   low    ...       │
│ low  mid   mid    ...       │
│ low  mid   high   ...       │
│ ...  ...   ...    highest   │
└─────────────────────────────┘
```

이미지의 시각적 인상은 대부분 저주파 성분이 결정합니다. 고주파 성분은 머리카락, 천의 질감, 경계의 미세한 흔들림처럼 세부 디테일을 담지만, 일부가 사라져도 사람은 생각보다 잘 알아차리지 못합니다.

이 때문에 JPEG 압축 표준은 전체 이미지를 $8 \times 8$ 블록 단위로 쪼갠 뒤 각 블록에 DCT를 수행하고, 우측 하단(고주파 영역)에 몰린 미세 노이즈 성분들을 양자화 테이블(Quantization Table)을 통해 대거 0으로 날려버리는 기법으로 고효율 고화질 손실 압축을 완성합니다.

### 4-4. 양자화(Quantization)가 진짜 압축을 만든다

DCT 자체는 정보를 잃지 않는 변환입니다. `cv2.dct()` 후 `cv2.idct()`를 바로 적용하면, 부동소수점 오차를 제외하고 원본에 가깝게 복원됩니다. 실제 압축률을 만드는 단계는 **양자화**입니다.

양자화는 DCT 계수 $F(u, v)$를 양자화 테이블 $Q(u, v)$로 나눈 뒤 반올림하는 과정입니다.

$$\hat{F}(u, v) = round\left(\frac{F(u, v)}{Q(u, v)}\right)$$

복원할 때는 다시 곱합니다.

$$F'(u, v) = \hat{F}(u, v)Q(u, v)$$

문제는 반올림 과정에서 원래의 소수 정보가 사라진다는 점입니다. 그래서 JPEG는 손실 압축입니다. 대신 고주파 위치일수록 더 큰 $Q(u, v)$를 사용하여 작은 고주파 계수들을 0으로 만들고, 이 0이 연속으로 많이 생기면 뒤쪽의 엔트로피 부호화 단계에서 저장 용량이 크게 줄어듭니다.

간단히 말하면 JPEG 압축은 다음 전략입니다.

1. 사람 눈에 중요한 밝기 큰 구조는 보존한다.
2. 사람이 덜 민감한 색차와 고주파 디테일은 더 강하게 줄인다.
3. DCT 계수 행렬에 0을 많이 만들어 저장하기 좋은 형태로 바꾼다.

```python
# OpenCV DCT 및 IDCT 구현
def DCT(img):
    # DCT 연산을 위해 float32 정밀도로 형변환이 선행되어야 합니다.
    return cv2.dct(np.float32(img))

def IDCT(img_dct):
    return cv2.idct(img_dct).astype(np.uint8)

# 상위 10%의 저주파 주파수 영역만 살리는 삼각/사각형 마스크 필터
def get_dct_mask(img_dct, cutoff_percentage=10):
    h, w = img_dct.shape
    ratio = np.sqrt(cutoff_percentage / 100)
    mask = np.zeros((h, w), np.float32)
    # 좌측 상단의 저주파 주파수 성분만 1로 통과시키고 나머지는 0으로 삭제
    mask[:int(h * ratio), :int(w * ratio)] = 1.0
    return mask

# Y 채널 DCT 수행 및 90% 고주파 데이터 차단 압축
y_dct = DCT(y)
y_dct_masked = y_dct * get_dct_mask(y_dct, 10) # 10% 데이터 보존

# 역변환 복원
y_idct = IDCT(y_dct_masked)
img_dct_comp = cv2.merge([y_idct, cr, cb])
img_dct_rgb = cv2.cvtColor(img_dct_comp, cv2.COLOR_YCrCb2RGB)
```

* **결과 분석**: 단 **10%**의 저주파 에너지 영역 데이터만 남기고 90%의 고주파 데이터를 버렸음에도 불구하고, 복원된 이미지(`img_dct_rgb`)는 사람의 눈으로 원본과 거의 구별할 수 없을 정도의 우수한 시각적 화질을 그대로 유지합니다. 이것이 현대 비디오/이미지 코덱 압축의 근간이 되는 놀라운 수학적 강점입니다.

### 4-5. OpenCV로 8x8 블록 DCT 직접 확인하기

위 예시는 Y 채널 전체에 DCT를 적용했지만, JPEG의 실제 동작을 이해하려면 $8 \times 8$ 블록 하나를 직접 들여다보는 편이 좋습니다.

```python
# Y 채널에서 8x8 블록 하나를 잘라 DCT 계수를 확인합니다.
block = y[:8, :8].astype(np.float32)

# JPEG에서는 보통 0~255 범위를 -128~127 근처로 중심 이동합니다.
block_centered = block - 128.0
block_dct = cv2.dct(block_centered)

# 예시용 양자화: 실제 JPEG 테이블 대신 단순한 스케일을 사용합니다.
q = np.ones((8, 8), np.float32) * 16
block_quantized = np.round(block_dct / q)

# 복원
block_dequantized = block_quantized * q
block_restored = cv2.idct(block_dequantized) + 128.0
block_restored = np.clip(block_restored, 0, 255).astype(np.uint8)

print("DCT coefficient")
print(np.round(block_dct, 1))

print("Quantized coefficient")
print(block_quantized.astype(int))
```

이 출력을 보면 양자화 이후 고주파 영역 계수 상당수가 0이 되는 것을 확인할 수 있습니다. 저장 관점에서는 이 0의 연속이 핵심입니다. 이미지 관점에서는 저주파 계수만으로도 블록의 평균 밝기와 큰 명암 구조가 보존되기 때문에, 어느 정도 자연스러운 복원이 가능합니다.

---

## 요약

1. **차원 축소와 압축**: 이미지 정보의 에너지가 큰 극소수의 주성분이나 특정 주파수 성분만 보존하고 나머지를 거세하여 용량을 경감하는 패턴입니다.
2. **PCA (주성분 분석)**: 데이터의 분산이 큰 공분산 행렬의 직교 고유벡터들을 찾아 좌표 변환을 통해 차원을 정밀 축소합니다.
3. **SVD (특이값 분해)**: 행렬을 $U\Sigma V^T$로 분해한 뒤, 상위 특이값만 남겨 행렬곱으로 저차원 근사하여 이미지를 압축 복원합니다.
4. **DCT와 JPEG**: 실수 기반 코사인 파형 변환으로 $8 \times 8$ 블록의 에너지를 좌상단 저주파 계수로 응집시키고, 양자화를 통해 고주파 계수를 0에 가깝게 만들어 손실 압축을 수행합니다.
