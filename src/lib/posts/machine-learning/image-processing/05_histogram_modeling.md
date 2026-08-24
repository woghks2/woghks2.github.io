---
title: "5. 히스토그램 스트레칭과 평활화"
description: "이미지 화질 개선의 필수 관문인 히스토그램 모델링 기법의 수학적 개념과 RGB vs YCbCr 변환 시의 색상 왜곡 방지책을 정리합니다."
date: "2022-07-22"
hashtags: ["ImageProcessing", "HistogramEqualization", "HistogramStretching", "Contrast", "OpenCV"]
skills: ["Python", "OpenCV"]
status: "published"
---

# 히스토그램 스트레칭과 평활화

디지털 카메라로 사진을 찍다 보면 조명 조건이나 카메라 노출 설정 한계로 인해 이미지가 너무 어둡거나 흐리멍덩하여 대비(Contrast)가 극도로 낮게 찍힐 때가 있습니다.

이러한 이미지의 시각적 화질을 개선(Image Enhancement)하기 위해 가장 널리 사용되는 수학적 기법이 바로 **히스토그램 모델링(Histogram Modeling)**입니다. 이번 글에서는 좁게 뭉쳐 있는 픽셀의 밝기 범위를 넓게 펴주는 **히스토그램 평활화(Equalization)**와 원하는 특정 범위로 균등히 늘려주는 **히스토그램 스트레칭(Stretching)**의 수학적 원리, 그리고 컬러 이미지를 변환할 때 색상 왜곡(Color Artifact)을 방지하기 위한 YCbCr 분할 가공 패턴을 상세히 알아보겠습니다.

---

## 1. 히스토그램 평활화 (Histogram Equalization)

**히스토그램 평활화**는 명암값(Luminance)의 분포를 나타내는 히스토그램 빈도를 이미지 전체 영역(0 ~ 255)에 걸쳐 최대한 평평하고 균등한 밀도를 가지도록 수학적으로 펴주는 명암 변환 기법입니다.

히스토그램은 이미지 안에서 특정 밝기값이 얼마나 자주 등장하는지 세는 분포표입니다.

$$h(k) = |\{(x, y) \mid I(x, y)=k\}|$$

이 값을 전체 픽셀 수 $N$으로 나누면 밝기값에 대한 확률분포가 됩니다.

$$p(k) = \frac{h(k)}{N}$$

따라서 히스토그램 모델링은 픽셀 밝기 분포 $p(k)$를 사람이 보기 좋거나 후속 알고리즘이 처리하기 좋은 형태로 다시 매핑하는 작업입니다.

### 1-1. 수학적 유도 원리
이미지의 입력 명암을 $r$ ($0 \le r \le L-1$), 변환된 출력 명암을 $s$ ($0 \le s \le L-1$)라고 할 때, 변환 함수 $s = T(r)$은 단조 증가(Monotonically Increasing) 성질과 명암 단계 보존 규칙을 만족해야 합니다.

출력 이미지의 확률 밀도 함수(PDF)가 평평한 균일 분포(Uniform Distribution)가 되기 위해서는 입력 이미지의 **누적 분포 함수(CDF, Cumulative Distribution Function)**를 변환 함수로 사용해야 합니다. 이산 이미지에서의 수식은 다음과 같이 정의됩니다.

$$s_k = T(r_k) = (L-1) \sum_{j=0}^{k} p_r(r_j) = \frac{L-1}{N} \sum_{j=0}^{k} n_j$$

* $L$: 이미지의 전체 명암 단계 (일반적으로 256)
* $N$: 이미지의 총 픽셀 수 (가로 $\times$ 세로)
* $n_j$: 입력 이미지에서 명암값 $j$를 갖는 픽셀 수
* $p_r(r_j)$: 명암값 $r_j$가 나타날 이산 확률 밀도

즉, 0부터 $k$번째 밝기 단계까지 쌓인 누적 픽셀 수의 비율을 계산한 뒤, 이를 전체 밝기 범위($L-1$)로 곱해 매핑하면 히스토그램이 균일하게 평평해지는 결과를 얻게 됩니다.

조금 더 직관적으로 보면, CDF는 "현재 밝기 이하의 픽셀이 전체에서 몇 퍼센트인가"를 의미합니다.

$$CDF(k)=P(r \le k)=\sum_{j=0}^{k}p_r(r_j)$$

평활화는 이 누적 확률값을 새로운 밝기값으로 사용합니다.

$$s_k=(L-1)CDF(k)$$

어두운 구간에 픽셀이 많이 몰려 있으면 CDF가 그 구간에서 빠르게 증가하므로, 해당 구간의 밝기값들이 넓은 출력 범위로 펼쳐집니다. 이것이 낮은 대비 이미지의 명암이 살아나는 핵심 원리입니다.

---

### 1-2. RGB 채널 평활화의 위험성과 YCbCr 솔루션
컬러 이미지에 히스토그램 평활화를 적용할 때 흔히 저지르는 실수는 RGB 채널 각각에 평활화 함수를 다이렉트로 호출하는 것입니다.

```python
# ❌ 배드 케이스: RGB 각 채널에 다이렉트로 평활화 적용
# 각 채널의 평활화가 따로 놀면서 RGB 고유 색상 배합 비율이 깨져 심각한 색조 왜곡이 유발됩니다.
img_rgb_eq = cv2.merge([cv2.equalizeHist(img_rgb[:, :, i]) for i in range(3)])
```

####  올바른 해결책
인간의 시각이 밝기에 예민하고 색상에는 둔감하다는 성질을 이용해, 이미지를 **YCbCr** 색 공간으로 변환한 뒤 **밝기 정보인 Y 채널에만 평활화를 수행**하고 다시 RGB로 재조립합니다.

```python
# 1. RGB 이미지를 YCrCb 색 공간으로 변환
img_ycrcb = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2YCrCb)
y_channel, cr_channel, cb_channel = cv2.split(img_ycrcb)

# 2. 오직 밝기 정보인 Y 채널에만 히스토그램 평활화 수행
y_equalized = cv2.equalizeHist(y_channel)

# 3. 색상 정보인 Cr, Cb는 원본 그대로 보존한 채 재결합
img_ycrcb_eq = cv2.merge([y_equalized, cr_channel, cb_channel])
img_rgb_eq_correct = cv2.cvtColor(img_ycrcb_eq, cv2.COLOR_YCrCb2RGB)

# 잘못된 RGB 평활화 예시 (색상 왜곡 유발)
img_rgb_eq_incorrect = cv2.merge([cv2.equalizeHist(img_rgb[:, :, idx]) for idx in range(3)])

# 비교 분석 시각화 및 히스토그램 출력
fig, ax = plt.subplots(2, 3, figsize=(18, 12))
images = [img_rgb, img_rgb_eq_incorrect, img_rgb_eq_correct]
titles = ['Original Image', 'RGB Equalized (Incorrect)', 'YCbCr Equalized (Correct)']
colors = ['red', 'green', 'blue']

for idx in range(3):
    ax[0, idx].imshow(images[idx])
    ax[0, idx].set_title(titles[idx])
    ax[0, idx].axis('off')
    
    # 히스토그램
    for c_idx in range(3):
        ax[1, idx].hist(images[idx][:, :, c_idx].flatten(), bins=256, color=colors[c_idx], alpha=0.5)
    ax[1, idx].set_title(f'{titles[idx]} Histogram')

plt.tight_layout()
plt.show()
```

![RGB 평활화 vs YCbCr 평활화 결과 및 히스토그램 분포 비교](/images/posts/image-processing/05_histogram_modeling_1.png)

이 방식을 사용하면 이미지 본연의 고유 색조(Hue/Saturation) 톤은 그대로 보존되면서, 흐린 이미지의 어둡고 밝은 대비(Contrast)만 매우 선명하고 고급스럽게 화질이 극대화됩니다.

다만 전역 히스토그램 평활화는 이미지 전체에 하나의 변환 함수를 적용하므로, 부분적으로만 어두운 이미지나 배경 노이즈가 많은 이미지에서는 노이즈까지 함께 강조될 수 있습니다. 이런 경우에는 이미지를 작은 타일로 나눠 지역별 평활화를 수행하는 **CLAHE(Contrast Limited Adaptive Histogram Equalization)**가 더 안정적입니다.

CLAHE는 각 타일의 히스토그램을 평활화하되, 특정 밝기 구간의 빈도가 너무 커지면 clip limit으로 잘라 노이즈 증폭을 제한합니다.

```python
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
y_clahe = clahe.apply(y_channel)
```

---

## 2. 히스토그램 스트레칭 (Histogram Stretching)

**히스토그램 스트레칭**은 이미지의 가장 어두운 픽셀값 $I_{min}$과 가장 밝은 픽셀값 $I_{max}$를 찾아내어, 사용자가 정의한 목표 임계 범위($Min_{target} \sim Max_{target}$)로 선형적으로 잡아 늘려 확장시키는 기법입니다.

### 2-1. 수학적 수식
$$I_{out} = \frac{I_{in} - I_{min}}{I_{max} - I_{min}} \times (Max_{target} - Min_{target}) + Min_{target}$$

만약 타깃 범위가 보편적인 $0 \sim 255$라면 식은 더욱 단순해집니다.

$$I_{out} = \frac{I_{in} - I_{min}}{I_{max} - I_{min}} \times 255$$

히스토그램 평활화가 비선형 CDF 매핑이라면, 스트레칭은 선형 변환입니다.

$$I_{out}=aI_{in}+b$$

여기서

$$a=\frac{Max_{target}-Min_{target}}{I_{max}-I_{min}}$$

$$b=Min_{target}-aI_{min}$$

따라서 스트레칭은 픽셀 간 밝기 순서를 그대로 유지합니다. 반면 평활화는 분포를 기준으로 비선형 재배치가 일어나므로, 대비 개선은 더 강하지만 원본 톤이 더 크게 바뀔 수 있습니다.

---

### 2-2. OpenCV 구현 및 YCbCr 결합 예제
오차 범위를 제거하는 Min-Max 정규화(`cv2.NORM_MINMAX`) 모드를 활용하여 구현합니다. 스트레칭 역시 색감 오염을 막기 위해 **Y 채널에 우선 적용하는 것을 원칙**으로 합니다.

```python
# 1. YCrCb 채널 분리
img_ycrcb = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2YCrCb)
y, cr, cb = cv2.split(img_ycrcb)

# 2. Y 채널의 밝기를 NORM_MINMAX를 이용해 원하는 범위(예: 100 ~ 200)로 스트레칭 수행
# 100~200 등 특정 범위로 가두어 어중간한 안개 효과나 저대비 연출을 시뮬레이션할 수도 있습니다.
y_stretched = cv2.normalize(y, None, 100, 200, cv2.NORM_MINMAX)

# 3. 재합성 및 RGB 복원
img_ycrcb_st = cv2.merge([y_stretched, cr, cb])
img_rgb_st = cv2.cvtColor(img_ycrcb_st, cv2.COLOR_YCrCb2RGB)
```

---

## 요약

1. **히스토그램 모델링**: 명암 분포를 통계적으로 보정하여 이미지 대비를 키우는 대표적인 화질 개선 전처리 수단입니다.
2. **평활화의 수학적 본질**: 입력 이미지 픽셀의 누적 분포 함수(CDF) 값을 구하고 이를 변환 인자로 매핑하여 히스토그램 분포를 평평하게(Flat) 보정합니다.
3. **RGB 평활화의 위험**: RGB 각 채널을 다이렉트로 평활화하면 채널 결합 비중이 깨져 원본에 없던 임의의 색 왜곡이 유발되므로 금기시됩니다.
4. **Y 채널 가공 원칙**: 색조 오염을 막으려면 YCbCr로 변환하여 오직 밝기(Y) 정보에만 평활화/스트레칭을 적용한 뒤 RGB로 재합성해야 합니다.
5. **스트레칭의 특징**: 최소-최대 명암 범위를 선형 맵핑을 통해 양극단으로 잡아 늘려 화질 가시성을 선명하게 올리는 단순 대비 확장 기법입니다.
