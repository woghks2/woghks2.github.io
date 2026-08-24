---
title: "2. Python을 활용한 컬러 채널 분석"
description: "OpenCV와 Matplotlib을 활용하여 RGB, HSV, YCbCr 컬러 채널을 물리적으로 분리하고 가공하는 파이썬 코드를 자세히 알아봅니다."
date: "2022-07-13"
hashtags: ["Python", "OpenCV", "ColorChannel", "HSV", "YCbCr"]
skills: ["Python", "OpenCV"]
status: "published"
---

# Python을 활용한 컬러 채널 분석

이론적으로 공부한 색 공간을 실제로 다루기 위해 가장 널리 사용되는 도구는 **Python의 OpenCV와 Matplotlib, 그리고 NumPy** 라이브러리입니다. 

단순히 이미지를 화면에 띄우는 것을 넘어, 특정 색상 채널만 추출해 분석하고, 명도와 채도를 수치적으로 조절하는 방법을 정밀하게 실습해 보겠습니다. 특히 OpenCV의 BGR 컬러 체계 주의점과 NumPy의 벡터화(Vectorization) 연산을 이용한 고속 YCbCr 채널 변환 코드 보충까지 공식 문서급 수준으로 자세히 알아보겠습니다.

---

## 1. 이미지 배열의 기본 형태

OpenCV로 읽은 컬러 이미지는 보통 `uint8` 타입의 3차원 배열입니다.

```text
image.shape = (height, width, channels)
image[y, x] = [B, G, R]  # OpenCV 기본 순서
```

좌표 접근 순서가 `(x, y)`가 아니라 `[y, x]`라는 점도 중요합니다. NumPy 배열에서는 첫 번째 축이 행(row, 세로), 두 번째 축이 열(column, 가로)이기 때문입니다. 이 규칙을 헷갈리면 슬라이싱, 마스킹, 좌표 시각화에서 축이 뒤집힌 결과가 나옵니다.

채널 분리는 결국 다음과 같은 텐서 슬라이싱입니다.

$$I_R = I[:, :, 0], \quad I_G = I[:, :, 1], \quad I_B = I[:, :, 2]$$

다만 OpenCV로 읽은 원본은 BGR 순서이므로 Matplotlib에 그대로 넘기면 빨간색과 파란색이 뒤바뀝니다. 그래서 시각화 전에는 `cv2.COLOR_BGR2RGB` 변환을 기본 습관으로 두는 것이 좋습니다.

---

## 2. Gray Scale 채널 변환과 색상 체계 주의점

이미지 처리의 첫걸음은 원본 이미지를 불러와 흑백(Gray Scale) 채널로 변환하여 픽셀의 밝기 농도만 다루는 것입니다.

흑백 변환은 RGB 채널을 하나의 밝기값으로 축약하는 선형 결합입니다.

$$Y(x, y) = 0.299R(x, y) + 0.587G(x, y) + 0.114B(x, y)$$

단순 평균이 아니라 가중 평균을 쓰는 이유는 인간의 눈이 초록 계열 밝기 변화에 더 민감하기 때문입니다. OpenCV의 `cv2.IMREAD_GRAYSCALE`이나 `cv2.cvtColor(..., cv2.COLOR_BGR2GRAY)`는 이 계열의 luminance 변환을 사용합니다.

```python
import cv2
import matplotlib.pyplot as plt

# 1. 이미지 읽기 (OpenCV는 기본적으로 BGR 배열로 읽어 들입니다)
path = "path/to/image.jpg"
img_bgr = cv2.imread(path, cv2.IMREAD_COLOR)

# 2. Matplotlib으로 시각화하기 위해 RGB 배열로 변환 (필수!)
# 이를 생략하고 matplotlib으로 그리게 되면 빨간색과 파란색이 색상의 이미지가 출력됩니다.
img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

# 3. 흑백 이미지 읽기
img_gray = cv2.imread(path, cv2.IMREAD_GRAYSCALE)

# 4. 비교 시각화
fig, ax = plt.subplots(1, 2, figsize=(10, 5))

ax[0].imshow(img_rgb)
ax[0].set_title('Color Image (RGB)')
ax[0].axis('off')

# 흑백 이미지는 단일 채널이므로 cmap='gray'를 명시해주어야 정확히 흑백으로 렌더링됩니다.
ax[1].imshow(img_gray, cmap='gray')
ax[1].set_title('Gray Scale Image')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Color Image 및 Gray Scale 변환 비교](/images/posts/image-processing/02_color_channel_python_1.png)

---

## 3. RGB 채널 분리 및 특정 색 영역 파악

컬러 이미지는 3차원 NumPy 행렬(`[height, width, channel]`)로 로드됩니다. 각 채널을 개별적으로 쪼개어 시각화하면 해당 색상의 분포 강도를 시각적으로 확인할 수 있습니다.

채널 분리는 분석뿐 아니라 마스크 생성의 출발점이 됩니다. 예를 들어 빨간색이 강한 영역을 단순하게 찾고 싶다면 다음과 같은 조건식을 만들 수 있습니다.

$$Mask_{red}(x, y) = [R(x, y) > T_R] \land [R(x, y) > G(x, y)] \land [R(x, y) > B(x, y)]$$

이 방식은 빠르지만 조명 변화에 취약합니다. 어두운 빨간 물체는 $R$ 값 자체가 낮아져 빠질 수 있고, 강한 노란 조명 아래에서는 $R$과 $G$가 함께 높아져 오검출이 생길 수 있습니다. 그래서 실무에서는 RGB 조건보다 HSV의 Hue 범위를 더 자주 씁니다.

```python
# RGB 각 채널 분리
r_channel = img_rgb[:, :, 0]
g_channel = img_rgb[:, :, 1]
b_channel = img_rgb[:, :, 2]

fig, ax = plt.subplots(2, 2, figsize=(10, 8))

# 원본 출력
ax[0, 0].imshow(img_rgb)
ax[0, 0].set_title('Original')
ax[0, 0].axis('off')

# 각 채널의 밝기를 해당 컬러의 cmap 역방향(_r) 등으로 표현
colors = [('Reds_r', r_channel, 'Red Channel'), 
          ('Greens_r', g_channel, 'Green Channel'), 
          ('Blues_r', b_channel, 'Blue Channel')]

for i, (cmap, channel, title) in enumerate(colors, start=1):
    r, c = i // 2, i % 2
    ax[r, c].imshow(channel, cmap=cmap)
    ax[r, c].set_title(title)
    ax[r, c].axis('off')

plt.tight_layout()
plt.show()
```

![Origin 및 Reds/Greens/Blues 개별 채널 이미지](/images/posts/image-processing/02_color_channel_python_2.png)

* **해석법**: 예를 들어 하늘이나 파란색 물체가 가득한 이미지 영역을 보면, **Blue Channel** 뷰에서 해당 물체 영역이 가장 밝게(값이 높게) 나타납니다. 반대로 빨간색 장미를 찍은 이미지는 **Red Channel**에서 장미 영역의 픽셀 값이 극대화되어 표현됩니다.

---

## 4. HSV 채널 가공 (채도 및 명도 조절)

HSV 색 공간은 특정 색상 검출뿐 아니라, **이미지의 대비(Contrast)나 채도를 가공할 때** 강력한 효과를 냅니다.

HSV에서 색상 검출은 보통 `inRange` 형태의 구간 마스크로 처리합니다.

$$Mask(x, y) =
\begin{cases}
1, & H_{min} \le H(x, y) \le H_{max},\ S(x,y) \ge S_{min},\ V(x,y) \ge V_{min} \\
0, & \text{otherwise}
\end{cases}$$

여기서 $S_{min}$과 $V_{min}$을 함께 두는 이유는 무채색 영역과 너무 어두운 영역을 제외하기 위해서입니다. Hue는 채도가 낮은 회색 영역에서는 의미가 약해지므로, Hue만 보고 색을 판단하면 회색 배경이 엉뚱하게 잡힐 수 있습니다.

먼저, HSV의 각 개별 채널을 분리하여 시각화해 보겠습니다.

```python
# HSV 개별 채널 분리 및 시각화
img_hsv = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV)
hue, saturation, value = cv2.split(img_hsv)

fig, ax = plt.subplots(2, 2, figsize=(10, 8))
ax[0, 0].imshow(img_rgb)
ax[0, 0].set_title('Original')
ax[0, 0].axis('off')

hsv_channels = [('Hue Channel', hue), 
                ('Saturation Channel', saturation), 
                ('Value Channel', value)]

for i, (title, channel) in enumerate(hsv_channels, start=1):
    r, c = i // 2, i % 2
    ax[r, c].imshow(channel, cmap='gray')
    ax[r, c].set_title(title)
    ax[r, c].axis('off')

plt.tight_layout()
plt.show()
```

![Origin 및 Hue/Saturation/Value 개별 채널 이미지](/images/posts/image-processing/02_color_channel_python_3.png)

다음으로, `cv2.split`과 `cv2.merge`를 이용해 채도를 50 높이고 밝기를 50 낮추는 이미지 조절 실습 코드입니다.

```python
# 1. RGB 이미지를 HSV 색 공간으로 변환
img_hsv = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV)

# 2. H, S, V 채널 물리적 분리
hue, saturation, value = cv2.split(img_hsv)

# 3. 채널 연산 및 오버플로우 방지 (cv2.add / cv2.subtract 사용)
# 단순 NumPy 연산(S + 50)을 수행하면 255를 초과하는 순간 값의 랩어라운드(0에 가깝게 리셋)가 발생하여 색이 깨집니다.
# cv2.add는 255 임계치를 넘어가면 255에 고정(Saturate)시켜 안전하게 방어해 줍니다.
saturation_boosted = cv2.add(saturation, 50)
value_dimmed = cv2.subtract(value, 50)

# 4. 채널 재결합 (Merge) 및 최종 RGB 복원
img_adjusted_hsv = cv2.merge([hue, saturation_boosted, value_dimmed])
img_adjusted_rgb = cv2.cvtColor(img_adjusted_hsv, cv2.COLOR_HSV2RGB)

# 5. 결과 시각화
fig, ax = plt.subplots(1, 2, figsize=(12, 6))

ax[0].imshow(img_rgb)
ax[0].set_title('Original Image')
ax[0].axis('off')

ax[1].imshow(img_adjusted_rgb)
ax[1].set_title('Adjusted Image (High Saturation & Low Value)')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Original과 채도 및 명도 조절(Adjusted HSV) 결과 비교](/images/posts/image-processing/02_color_channel_python_4.png)

---

## 5. YCbCr (YCrCb) 색상 공간 분석 및 NumPy 고속 수동 변환

OpenCV에서는 YCbCr을 다룰 때 순서가 뒤바뀐 **YCrCb(Cr이 먼저)** 형식의 플래그인 `cv2.COLOR_RGB2YCrCb`를 제공합니다.

### 5-1. OpenCV 내장 기능 활용
```python
# OpenCV 내장 함수를 활용한 YCbCr 분리 및 시각화
img_ycrcb = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2YCrCb)
y, cr, cb = cv2.split(img_ycrcb)

fig, ax = plt.subplots(2, 2, figsize=(10, 8))
# Grayscale Image
ax[0, 0].imshow(img_gray, cmap='gray')
ax[0, 0].set_title('Grayscale Image')
ax[0, 0].axis('off')

channels = [('Y Channel', y), ('Cr Channel', cr), ('Cb Channel', cb)]
for i, (title, channel) in enumerate(channels, start=1):
    r, c = i // 2, i % 2
    ax[r, c].imshow(channel, cmap='gray')
    ax[r, c].set_title(title)
    ax[r, c].axis('off')

plt.tight_layout()
plt.show()
```

![Y Channel (Luma) 이미지](/images/posts/image-processing/02_color_channel_python_7.png)

Y 채널은 원본 이미지의 디테일과 윤곽을 명확히 보관하고 있으며, Cr과 Cb 채널은 순수한 색상 보정 정보(색차)만을 추상적으로 담고 있습니다.

### 5-2. NumPy 고속 행렬 연산을 활용한 수동 변환 구현 (보충 코드)
원리를 이해하기 위해 선형 변환 행렬을 사용해 직접 RGB를 YCbCr로 변환하는 코드를 작성해 봅니다. 2중 `for` 루프로 구현하면 파이썬의 한계 때문에 100만 화소 이미지를 처리하는 데 수 초가 걸려 실무에 쓸 수 없습니다. 

NumPy의 **행렬 곱셈(Vectorization)** 연산을 활용하면 단 몇 줄의 코드로 **수백 배 더 빠르게** 변환할 수 있습니다.

RGB에서 YCbCr로의 변환은 각 픽셀 벡터에 같은 변환 행렬을 곱하는 작업입니다.

$$
\begin{bmatrix}
Y \\
Cb \\
Cr
\end{bmatrix}
=
\begin{bmatrix}
0.299 & 0.587 & 0.114 \\
-0.1687 & -0.3313 & 0.5 \\
0.5 & -0.4187 & -0.0813
\end{bmatrix}
\begin{bmatrix}
R \\
G \\
B
\end{bmatrix}
+
\begin{bmatrix}
0 \\
128 \\
128
\end{bmatrix}
$$

$$Y = 0.299R + 0.587G + 0.114B$$
$$Cb = -0.169R - 0.331G + 0.500B + 128$$
$$Cr = 0.500R - 0.419G - 0.081B + 128$$

```python
import numpy as np

def convert_rgb_to_ycbcr_fast(img_rgb: np.ndarray) -> np.ndarray:
    # 1. 2D 선형 맵핑 행렬 정의
    cvt_matrix = np.array([
        [0.299, 0.587, 0.114],
        [-0.1687, -0.3313, 0.500],
        [0.500, -0.4187, -0.0813]
    ])
    
    # 2. NumPy 행렬곱(@) 연산을 통한 고속 벡터화 연산 수행
    # [height * width, 3] 형태로 평탄화한 뒤 행렬곱을 수행하고 원래 이미지 모양으로 복원합니다.
    h, w, c = img_rgb.shape
    flattened = img_rgb.reshape(-1, 3).astype(np.float32)
    transformed = flattened @ cvt_matrix.T
    
    # 3. 색차 채널(Cb, Cr)에 대해 중앙 정렬 바이어스 값 128씩 시프팅 보정
    transformed[:, 1] += 128.0
    transformed[:, 2] += 128.0
    
    # 4. uint8 정수 범위(0~255)로 클리핑 및 캐스팅
    ycbcr_img = np.clip(transformed, 0, 255).astype(np.uint8)
    return ycbcr_img.reshape(h, w, c)

# 커스텀 고속 함수 테스트 및 채널 결과 시각화
custom_ycbcr = convert_rgb_to_ycbcr_fast(img_rgb)
y_c, cb_c, cr_c = cv2.split(custom_ycbcr)

fig, ax = plt.subplots(1, 2, figsize=(10, 5))
ax[0].imshow(cr_c, cmap='Reds_r')
ax[0].set_title('Custom Chroma Red (Cr)')
ax[0].axis('off')

ax[1].imshow(cb_c, cmap='Blues_r')
ax[1].set_title('Custom Chroma Blue (Cb)')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Chroma Red 및 Chroma Blue 이미지 결과](/images/posts/image-processing/02_color_channel_python_8.png)

이와 같이 NumPy 행렬 곱셈 연산을 사용해 벡터화 코드를 작성하면 Python의 반복문 오버헤드를 줄여 실시간 영상 프레임 연산 등에서도 성능을 낼 수 있습니다.

---

## 요약

1. **컬러 스위칭 필수**: OpenCV는 기본 채널이 BGR 순서이므로, 시각화나 처리를 할 때 반드시 `COLOR_BGR2RGB`로의 복원이 선행되어야 합니다.
2. **채널 연산 규칙**: 채널 데이터를 보정할 때는 데이터의 언더플로우/오버플로우를 자동으로 보정해주는 `cv2.add`와 `cv2.subtract`를 사용해야 색상이 찢어지지 않습니다.
3. **HSV 검출 활용**: 조명 값에 둔감한 색상 위주의 검출 처리를 할 때는 HSV 변환 후 Hue 범위 필터링을 구성합니다.
4. **벡터화의 효율성**: 픽셀을 일일이 `for` 루프로 돌리는 변환 연산은 지양하고, NumPy 행렬곱을 이용한 고속 벡터화 코드로 병목을 해소해야 합니다.
