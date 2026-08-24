---
title: "8. 모폴로지 연산과 이진 이미지 노이즈 제거"
description: "수학적 형태학을 기반으로 이진 이미지의 잡음을 제거하고 형상을 정제하는 침식, 팽창, 열기, 닫기 등의 모폴로지 연산을 이해합니다."
date: "2022-08-08"
hashtags: ["ImageProcessing", "Morphological", "Erosion", "Dilation", "Opening", "Closing"]
skills: ["Python", "OpenCV"]
status: "published"
---

# 모폴로지 연산과 이진 이미지 노이즈 제거

디지털 이미지 처리를 진행할 때, 경계선 검출(Edge Detection)이나 임계 처리(Thresholding)를 거쳐 획득한 이진 이미지(Binary Image)에는 자잘한 먼지 같은 노이즈가 끼어 있거나, 물체 내부에 원치 않는 미세한 구멍(Hole)들이 뚫려 있는 경우가 다반사입니다.

이러한 이진 이미지의 형태학적 뼈대와 윤곽을 수학적으로 가공하여 노이즈를 제거하고 형태를 매끄럽게 정제하는 기법을 **모폴로지 변환(Morphological Transformation)**이라고 부릅니다. 이번 글에서는 기본 연산인 **침식(Erosion)**과 **팽창(Dilation)**, 그리고 이를 조합한 **열기(Opening)**와 **닫기(Closing)** 및 경계 추출 기법들의 원리와 Python OpenCV 구현법을 자세히 알아보겠습니다.

---

## 1. 기본 모폴로지 연산: 침식과 팽창

모폴로지 연산은 대상 이미지 위에 **구조 요소(Structuring Element / Kernel)**라고 부르는 작은 격자 마스크(보통 1로 가득 찬 $3\times3$, $5\times5$ 행렬 등)를 올려놓고 픽셀을 순회하며 연산을 수행합니다.

이진 이미지를 집합으로 보면 흰색 전경 픽셀들의 집합을 $A$, 구조 요소를 $B$라고 둘 수 있습니다. 이 관점에서 침식과 팽창은 단순 필터가 아니라 집합의 형태를 깎고 확장하는 연산입니다.

$$A \ominus B = \{z \mid B_z \subseteq A\}$$

$$A \oplus B = \{z \mid (B_z \cap A) \neq \emptyset\}$$

즉, 침식은 구조 요소가 전경 안에 완전히 들어갈 수 있는 위치만 남기고, 팽창은 구조 요소가 전경과 조금이라도 겹치는 위치까지 전경을 확장합니다.

구조 요소의 모양도 결과에 큰 영향을 줍니다. 정사각형 커널은 가로/세로/대각 방향을 모두 강하게 반영하고, 십자형 커널은 상하좌우 연결성을 더 강조합니다. OpenCV에서는 `cv2.getStructuringElement()`로 사각형, 타원형, 십자형 구조 요소를 만들 수 있습니다.

```python
rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
ellipse_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
cross_kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (5, 5))
```

### 1-1. 침식 (Erosion)
침식은 구조 요소가 겹치는 이미지 영역 내부의 픽셀 값 중 **최소값(Minimum)**을 중심 픽셀에 부여하는 연산입니다.

* **이진 이미지에서의 효과**: 
  * 구조 요소(커널) 범위 내에 단 하나의 검은색 픽셀(0)이라도 겹치면 중심 픽셀을 검은색으로 밀어버립니다.
  * 결과적으로 흰색 전경 물체의 영역이 외곽선부터 사방으로 깎여나가 **축소**됩니다.
  * 이 과정에서 독립적으로 떠 있는 **먼지 같은 자잘한 흰색 노이즈가 완전히 삭제**되는 효과를 얻습니다.
```python
# 침식 및 팽창 연산 구현 및 시각화
kernel = np.ones((5, 5), np.uint8)
img_erosion = cv2.erode(img_binary, kernel, iterations=1)
img_dilation = cv2.dilate(img_binary, kernel, iterations=1)

fig, ax = plt.subplots(1, 3, figsize=(15, 5))
ax[0].imshow(img_binary, cmap='gray')
ax[0].set_title('Original Binary')
ax[0].axis('off')

ax[1].imshow(img_erosion, cmap='gray')
ax[1].set_title('Erosion (Minimum filter)')
ax[1].axis('off')

ax[2].imshow(img_dilation, cmap='gray')
ax[2].set_title('Dilation (Maximum filter)')
ax[2].axis('off')

plt.tight_layout()
plt.show()
```

![Original Binary, Erosion, Dilation 결과 비교](/images/posts/image-processing/08_morphological_transformation_1.png)

### 1-2. 팽창 (Dilation)
팽창은 구조 요소가 겹치는 이미지 영역 내부의 픽셀 값 중 **최대값(Maximum)**을 중심 픽셀에 부여하는 연산입니다.

* **이진 이미지에서의 효과**:
  * 구조 요소 범위 내에 단 하나의 흰색 픽셀(255)이라도 있으면 중심 픽셀을 흰색으로 확장시킵니다.
  * 결과적으로 흰색 전경 물체 영역이 사방으로 부풀어 오르며 **확장**됩니다.
  * 이 과정에서 물체 내부에 뚫려 있던 **미세한 검은색 구멍(Holes)들이 메워지고, 끊어진 얇은 선이 이어지는** 효과를 봅니다.


---

## 2. 고급 모폴로지 연산: 열기와 닫기

침식과 팽창을 단독으로 쓰면 이미지의 전체적인 크기가 깎여나가거나 부풀어 올라 왜곡이 심해집니다. 이 크기 왜곡을 방지하기 위해 두 연산의 실행 순서를 반대로 정합한 기법이 바로 **열기**와 **닫기**입니다.

### 2-1. 열기 (Opening) = 침식(Erosion) 후 팽창(Dilation)
1. 이미지를 먼저 **침식(Erosion)**하여 배경의 자잘한 흰색 잡음들을 완전히 소멸시킵니다.
2. 살아남은 주요 큰 전경 물체들을 다시 원래 크기로 **팽창(Dilation)**하여 복원시킵니다.

집합 연산으로는 다음과 같이 표현됩니다.

$$A \circ B = (A \ominus B) \oplus B$$

```python
# 열기 및 닫기 연산 구현 및 시각화
kernel = np.ones((5, 5), np.uint8)
img_opening = cv2.morphologyEx(img_binary, cv2.MORPH_OPEN, kernel)
img_closing = cv2.morphologyEx(img_binary, cv2.MORPH_CLOSE, kernel)

fig, ax = plt.subplots(1, 3, figsize=(15, 5))
ax[0].imshow(img_binary, cmap='gray')
ax[0].set_title('Original Binary')
ax[0].axis('off')

ax[1].imshow(img_opening, cmap='gray')
ax[1].set_title('Opening (Erosion -> Dilation)')
ax[1].axis('off')

ax[2].imshow(img_closing, cmap='gray')
ax[2].set_title('Closing (Dilation -> Erosion)')
ax[2].axis('off')

plt.tight_layout()
plt.show()
```

![Original Binary, Opening, Closing 결과 비교](/images/posts/image-processing/08_morphological_transformation_2.png)
* **실무 효과**: 물체의 원래 크기를 보존하면서, 외곽에 튀어나온 거친 돌출부(Noise)를 매끄럽게 깎아내고 **배경의 흰색 잔여 잡음을 지워내는 데 특효**를 발휘합니다.

### 2-2. 닫기 (Closing) = 팽창(Dilation) 후 침식(Erosion)
1. 이미지를 먼저 **팽창(Dilation)**하여 전경 물체 내부의 자잘한 구멍이나 틈새를 먼저 메워 합쳐버립니다.
2. 뭉뚱그려 비대해진 물체를 다시 원래의 크기로 **침식(Erosion)**하여 돌려놓습니다.

집합 연산으로는 다음과 같습니다.

$$A \bullet B = (A \oplus B) \ominus B$$

열기와 닫기는 한 번 적용한 뒤 같은 구조 요소로 다시 적용해도 결과가 더 변하지 않는 **멱등성(Idempotence)**을 갖습니다.

$$A \circ B \circ B = A \circ B$$

$$A \bullet B \bullet B = A \bullet B$$

* **실무 효과**: 물체의 원래 스케일을 유지하면서, **물체 내부에 송송 뚫려 있던 검은색 구멍(Holes)을 깔끔하게 메우고 갈라진 틈새를 메워 하나로 이어주는 데** 핵심으로 쓰입니다.

---

## 3. 그 외의 모폴로지 변환들 (Gradient, Tophat, Blackhat)

OpenCV의 `cv2.morphologyEx()` 함수는 열기/닫기 외에도 유용한 차분 연산 플래그들을 제공합니다.

### 3-1. 모폴로지 그라디언트 (Morphological Gradient)
팽창 이미지에서 침식 이미지를 뺍니다 (Dilation - Erosion).
* **효과**: 전경 물체의 내부 영역은 모두 지워지고, 오직 **물체의 외곽선(Boundary)만 매우 얇고 균일하게 추출**되는 화질 효과를 냅니다.

수식으로는 다음과 같습니다.

$$Gradient(A)= (A \oplus B) - (A \ominus B)$$

탑햇과 블랙햇도 원본과 열기/닫기 결과의 차분으로 정의할 수 있습니다.

$$Tophat(A)=A-(A\circ B)$$

$$Blackhat(A)=(A\bullet B)-A$$

```python
# 모폴로지 그라디언트, 탑햇, 블랙햇 연산 구현 및 시각화
kernel = np.ones((5, 5), np.uint8)
img_gradient = cv2.morphologyEx(img_binary, cv2.MORPH_GRADIENT, kernel)
img_tophat = cv2.morphologyEx(img_binary, cv2.MORPH_TOPHAT, kernel)
img_blackhat = cv2.morphologyEx(img_binary, cv2.MORPH_BLACKHAT, kernel)

fig, ax = plt.subplots(2, 2, figsize=(12, 10))
ax[0, 0].imshow(img_binary, cmap='gray')
ax[0, 0].set_title('Original Binary')
ax[0, 0].axis('off')

ax[0, 1].imshow(img_gradient, cmap='gray')
ax[0, 1].set_title('Morphological Gradient')
ax[0, 1].axis('off')

ax[1, 0].imshow(img_tophat, cmap='gray')
ax[1, 0].set_title('Top Hat')
ax[1, 0].axis('off')

ax[1, 1].imshow(img_blackhat, cmap='gray')
ax[1, 1].set_title('Black Hat')
ax[1, 1].axis('off')

plt.tight_layout()
plt.show()
```

![Original, Gradient, Tophat, Blackhat 결과 비교](/images/posts/image-processing/08_morphological_transformation_3.png)

### 3-2. 탑햇 (Top Hat)
원본 이미지에서 열기(Opening) 이미지를 뺍니다 (Original - Opening).
* **효과**: 열기 연산에 의해 지워졌던 자잘한 밝은 돌출부 노이즈나, 원본 이미지에서 주변에 비해 **도드라지게 밝은 미세 성분만** 발라내어 시각화합니다.


### 3-3. 블랙햇 (Black Hat)
닫기(Closing) 이미지에서 원본 이미지를 뺍니다 (Closing - Original).
* **효과**: 닫기 연산에 의해 메워졌던 물체 내부의 **어두운 구멍(Holes)이나 어두운 틈새 성분만** 정밀하게 추출해 냅니다.


---

## 요약

1. **모폴로지 변환**: 이진 이미지의 기하학적 형태 구조를 마스크(구조 요소) 연산을 통해 정제하고 가공하는 수학적 형태학 기법입니다.
2. **침식(Erosion)과 팽창(Dilation)**: 주변부 최소값 매핑을 통해 흰색 영역을 깎아 노이즈를 지우거나, 최대값 매핑으로 부풀려 빈 구멍을 메우는 기본 연산입니다.
3. **열기(Opening)**: 침식 후 팽창을 적용해 전경 크기 손상 없이 거친 외곽선 정제와 배경 노이즈 제거를 수행합니다.
4. **닫기(Closing)**: 팽창 후 침식을 적용해 전경 크기를 유지하며 내부 빈 구멍(Hole) 메우기 및 단선 연결을 해결합니다.
5. **그라디언트 및 핫햇**: 팽창과 침식의 편차로 윤곽 경계선만 따내거나, 오리지널과의 차분(Top Hat, Black Hat)을 통해 밝은 미세점 및 어두운 틈새 정보만 골라 추출합니다.
