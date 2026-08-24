---
title: "9. 이미지 기하학적 변환: Affine과 Perspective"
description: "Affine Transform, 투시(원근) 변환 및 회전의 수학적 원리와 OpenCV 구현을 다룹니다."
date: "2022-08-25"
hashtags: ["ImageProcessing", "GeometricTransform", "AffineTransform", "Perspective", "OpenCV"]
skills: ["Python", "OpenCV"]
status: "published"
---

# 이미지 기하학적 변환: Affine과 Perspective

디지털 이미지 처리와 컴퓨터 비전 시스템에서 물체의 크기를 늘리거나 줄이고(Scaling), 회전하며(Rotation), 찌그러진 왜곡을 똑바로 정합(Rectification)하기 위해서는 **기하학적 변환(Geometric Transformation)**에 대한 깊은 이해가 필요합니다.

기하학적 변환은 이미지를 단순 가공하는 영역을 넘어, 카메라의 3차원 투영 왜곡 모델이나 로봇 비전의 캘리브레이션 등 물리적 공간 맵핑의 근간이 됩니다. 이번 글에서는 평행선을 보존하는 **어파인 변환(Affine Transform)**, 원근감을 조율하는 **투시 변환(Perspective Transform)**, 그리고 중심점 기반의 회전 변환의 수학적 조건과 Python 구현 코드를 상세히 정리해 보겠습니다.

---

## 1. 좌표 변환에서 중요한 두 가지: 역매핑과 보간

이미지를 변환한다는 것은 픽셀 값을 바꾸는 것이 아니라, 픽셀이 놓일 좌표를 다시 계산하는 일입니다. 하지만 출력 이미지의 모든 픽셀에 대해 "원본의 어느 좌표에서 값을 가져와야 하는가"를 계산해야 빈 구멍 없는 결과를 만들 수 있습니다.

이 때문에 OpenCV의 `warpAffine`, `warpPerspective`는 내부적으로 주로 **역매핑(Inverse Mapping)**을 사용합니다.

$$I_{out}(x', y') = I_{in}(T^{-1}(x', y'))$$

문제는 $T^{-1}(x', y')$가 대부분 정수 픽셀 좌표가 아니라는 점입니다. 그래서 주변 픽셀 값을 섞어 새 값을 추정하는 **보간(Interpolation)**이 필요합니다. `cv2.INTER_NEAREST`는 빠르지만 계단 현상이 크고, `cv2.INTER_LINEAR`는 일반적인 사진 변환에서 가장 무난한 기본값입니다.

양선형 보간(Bilinear Interpolation)은 주변 네 픽셀의 가중합으로 값을 추정합니다. 원본 좌표가 $(x, y)$이고 주변 정수 좌표가 $(x_0,y_0)$, $(x_1,y_1)$일 때,

$$I(x,y) \approx (1-a)(1-b)I(x_0,y_0)+a(1-b)I(x_1,y_0)+(1-a)bI(x_0,y_1)+abI(x_1,y_1)$$

여기서 $a=x-x_0$, $b=y-y_0$입니다.

---

## 2. 어파인 변환 (Affine Transform)

**어파인 변환**은 변환 전의 평행한 두 직선이 변환 후에도 그대로 **평행 상태(Parallelism)를 유지**하는 기하학적 맵핑 변환입니다.
이동(Translation), 회전(Rotation), 크기 조절(Scaling), 그리고 기울임 전단(Shearing) 연산이 모두 어파인 변환 범주에 속합니다.

### 2-1. 수학적 모델링
2차원 공간 상의 점 $(x, y)$를 $(x', y')$로 매핑하기 위해 선형 변환 행렬과 이동 벡터를 하나의 $2 \times 3$ 행렬 $M$으로 묶어 동차 좌표계(Homogeneous Coordinates) 형식으로 다음과 같이 표현합니다.

$$\begin{bmatrix} x' \\ y' \end{bmatrix} = \begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} + \begin{bmatrix} b_x \\ b_y \end{bmatrix}$$

$$M = \begin{bmatrix} a_{11} & a_{12} & b_x \\ a_{21} & a_{22} & b_y \end{bmatrix}$$

동차 좌표계를 쓰면 이동까지 포함한 어파인 변환을 하나의 행렬곱으로 표현할 수 있습니다.

$$
\begin{bmatrix}
x' \\
y' \\
1
\end{bmatrix}
=
\begin{bmatrix}
a_{11} & a_{12} & b_x \\
a_{21} & a_{22} & b_y \\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$

이 표현을 쓰면 회전, 확대, 이동 같은 여러 변환을 행렬곱으로 순차 결합할 수 있습니다.

$$M_{total}=M_{translate}M_{rotate}M_{scale}$$

### 2-2. 변환 행렬 유도 조건
어파인 변환의 자유도(Degree of Freedom)는 6이므로, 변환 전후의 매핑 관계를 알기 위해서는 일직선상에 존재하지 않는 **최소 3개의 점(Points)**의 매치 관계를 명시해주어야 합니다.

```python
import cv2
import numpy as np
import matplotlib.pyplot as plt

h, w, _ = img.shape

# 1. 변환 전 3개의 점 좌표 정의
start_pts = np.float32([[50, 50], [200, 50], [50, 200]])
# 2. 이에 매핑될 변환 후의 3개 점 좌표 정의
end_pts = np.float32([[10, 100], [200, 50], [100, 250]])

# 3. 세 점의 매치를 바탕으로 2x3 어파인 변환 행렬 M 유도
affine_matrix = cv2.getAffineTransform(start_pts, end_pts)

# 4. 어파인 변환 적용
img_affined = cv2.warpAffine(img, affine_matrix, (w, h))

# 5. 결과 시각화
fig, ax = plt.subplots(1, 2, figsize=(12, 6))
ax[0].imshow(img)
ax[0].set_title('Original Image')
ax[0].axis('off')

ax[1].imshow(img_affined)
ax[1].set_title('Affine Transformed Image')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Original 및 Affine 변환(warpAffine) 결과 비교](/images/posts/image-processing/09_image_geometric_transformation_1.png)

---

## 3. 투시 변환 (Perspective / Projective Transform)

**투시(원근) 변환**은 평행선 보존 규칙이 깨지는 변환입니다. 카메라로 3차원 현실 공간을 비스듬히 찍었을 때 멀리 있는 물체는 작게 보이고 가까운 곳은 크게 보이는 **사영 기하학적(Projective Geometry) 왜곡**을 모방하거나 역으로 이를 평평하게 정합할 때 사용합니다.

* **실무적 사용 예시**: 비스듬하게 삐뚤어진 각도로 촬영된 영수증이나 문서 이미지의 4개 모서리 좌표를 따낸 뒤, 이를 직사각형 규격으로 투시 역변환하여 위에서 똑바로 스캔한 듯한 정면 사각 문서 이미지(Document Rectification)로 만들어 낼 때 필수 불가결하게 사용됩니다.

### 3-1. 수학적 모델링
사영 기하의 원근감을 맵핑하기 위해 변환 관계는 $3 \times 3$ 정방 사영 행렬로 모델링됩니다.

$$\begin{bmatrix} x' \\ y' \\ w' \end{bmatrix} = \begin{bmatrix} h_{11} & h_{12} & h_{13} \\ h_{21} & h_{22} & h_{23} \\ h_{31} & h_{32} & h_{33} \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$$

실제 2차원 좌표값은 $w'$로 나눈 $\left(\frac{x'}{w'}, \frac{y'}{w'}\right)$로 결정되므로, 멀어질수록 나눗셈 스케일값($w'$)이 커져 물체가 원근감 있게 축소 렌더링됩니다.

따라서 실제 출력 좌표는 다음처럼 계산됩니다.

$$x_{out}=\frac{h_{11}x+h_{12}y+h_{13}}{h_{31}x+h_{32}y+h_{33}}$$

$$y_{out}=\frac{h_{21}x+h_{22}y+h_{23}}{h_{31}x+h_{32}y+h_{33}}$$

투시 변환 행렬은 스케일을 곱해도 같은 변환을 나타내므로 자유도는 9가 아니라 8입니다. 그래서 네 점의 대응쌍이 필요합니다. 각 점은 $x$, $y$ 두 개의 방정식을 제공하므로 총 8개의 식을 만들 수 있습니다.

### 3-2. 변환 행렬 유도 조건
투시 변환의 자유도는 8이므로, 변환 전후의 대응 관계를 알아내기 위해서는 일직선에 존재하지 않는 **최소 4개의 점(Points)**의 매핑 쌍이 제시되어야 합니다.

```python
# 1. 변환 전 4개 모서리 점 좌표 정의
start_pts = np.float32([[50, 50], [400, 50], [50, 300], [400, 300]])
# 2. 변환 후 똑바른 형태가 될 4개 대응 좌표 정의
end_pts = np.float32([[10, 100], [380, 60], [100, 260], [350, 300]])

# 3. 3x3 투시 변환 행렬 계산
perspective_matrix = cv2.getPerspectiveTransform(start_pts, end_pts)

# 4. 투시 변환 적용
img_perspective = cv2.warpPerspective(img, perspective_matrix, (w, h))

# 5. 결과 시각화
fig, ax = plt.subplots(1, 2, figsize=(12, 6))
ax[0].imshow(img)
ax[0].set_title('Original Image')
ax[0].axis('off')

ax[1].imshow(img_perspective)
ax[1].set_title('Perspective Transformed Image')
ax[1].axis('off')

plt.tight_layout()
plt.show()
```

![Original 및 투시 변환(warpPerspective) 결과 비교](/images/posts/image-processing/09_image_geometric_transformation_2.png)

---

## 4. 회전 변환 (Rotation)

이미지를 기준 좌표 $(X_c, Y_c)$를 중심으로 $\theta$도 만큼 회전시키고 크기 비율($Scale$)을 제어하는 변환 역시 어파인 변환의 일종입니다. 

기본 삼각함수 공식 기반 회전 행렬은 소수점 오차에 의해 가장자리가 소실되거나 중심 축 이동 처리가 복잡하므로, OpenCV에서는 이를 2차원으로 결합하여 쉽게 계산해 주는 편리한 API를 내장하고 있습니다.

원점 기준 회전 행렬은 다음과 같습니다.

$$R(\theta)=
\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix}$$

하지만 이미지를 중심 기준으로 회전하려면 원점을 이미지 중심으로 옮겼다가 회전 후 다시 되돌려야 합니다.

$$p' = T(c)R(\theta)T(-c)p$$

`cv2.getRotationMatrix2D(center, angle, scale)`은 이 이동-회전-이동 복합 변환을 $2 \times 3$ 어파인 행렬로 만들어 줍니다.

```python
# 이미지 중심을 회전축으로 지정 및 다양한 각도 회전 시각화
center = (w / 2, h / 2)
angles = [30, 60, 90]
scale = 1.0

fig, ax = plt.subplots(1, len(angles) + 1, figsize=(16, 4))
ax[0].imshow(img)
ax[0].set_title('Original Image')
ax[0].axis('off')

for idx, angle in enumerate(angles, start=1):
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, scale)
    img_rotated = cv2.warpAffine(img, rotation_matrix, (w, h))
    
    ax[idx].imshow(img_rotated)
    ax[idx].set_title(f'Rotated {angle} deg')
    ax[idx].axis('off')

plt.tight_layout()
plt.show()
```

![Original 및 각도별(30도, 60도, 90도) 회전 변환 결과 비교](/images/posts/image-processing/09_image_geometric_transformation_3.png)

---

## 요약

1. **어파인 변환(Affine)**: 이동, 회전, 스케일링, 전단을 아우르며 변환 후에도 직선 평행성을 영구 보존하는 $2 \times 3$ 기하학적 맵핑이며, 3개의 점 매핑 쌍으로 관계를 특정합니다.
2. **투시 변환(Perspective)**: 3D 원근 기하 변환을 대변하며 평행성 보존이 깨집니다. 4개의 모서리 점 매치 쌍으로 관계를 유도하는 $3 \times 3$ 행렬 연산이며 문서 스캔 정합에 필수적입니다.
3. **OpenCV 활용**: 어파인 연산은 `warpAffine`으로, 원근 투시 연산은 `warpPerspective` 메서드를 연결해 적용합니다.
4. **회전과 배율**: 중심 좌표를 기준으로 회전각($\theta$)과 확대 배율을 동시에 지닌 어파인 행렬을 생성하는 `getRotationMatrix2D` 헬퍼를 유용하게 사용합니다.
