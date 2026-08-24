---
title: "4. 주파수 도메인 필터링과 푸리에 변환"
description: "공간 도메인과 주파수 도메인의 차이를 이해하고, 2차원 이산 푸리에 변환(2D DFT)과 LPF/HPF 필터 및 커널의 주파수 분석 기법을 살펴봅니다."
date: "2022-07-22"
hashtags: ["ImageProcessing", "FourierTransform", "FrequencyDomain", "LPF", "HPF"]
skills: ["Python", "OpenCV"]
status: "published"
---

# 주파수 도메인 필터링과 푸리에 변환

이미지 처리는 픽셀 좌표 공간을 다루는 **공간 도메인(Spatial Domain)**뿐만 아니라, 이미지를 파동(Wave)들의 합으로 분해하여 분석하는 **주파수 도메인(Frequency Domain)**에서도 활발하게 수행됩니다.

공간 도메인에서의 복잡한 합성곱(Convolution) 연산은 주파수 도메인에서 단순 곱셈(Multiplication) 연산으로 치환되는 놀라운 수학적 성질을 갖습니다. 이번 글에서는 2차원 고속 푸리에 변환(2D Fast Fourier Transform, FFT)의 기본 개념, 진폭(Magnitude)과 위상(Phase)의 물리적 의미, 주파수 필터(LPF, HPF) 구현, 그리고 공간 영역의 커널들이 주파수 영역에서 어떻게 투영되는지 자세히 살펴보겠습니다.

---

## 1. Spatial Domain vs Frequency Domain

두 도메인의 접근 방식과 연산 오버헤드는 아래와 같은 핵심적 차이를 보입니다.

```text
[공간 도메인 (Spatial Domain)]
- 이미지를 픽셀의 밝기 맵(Grid)으로 취급
- 픽셀과 주변 이웃 간의 국소적 관계를 직접 제어 (Convolution)
- 연산 시간 복잡도: O(H * W * K^2)  (K: 커널 크기)

[주파수 도메인 (Frequency Domain)]
- 이미지를 다양한 주파수, 방향, 진폭을 가진 사인/코사인 파동의 중첩으로 취급
- 푸리에 변환을 거쳐 주파수 성분만 곱셈 연산 후, 다시 역변환하여 이미지 복원
- 연산 시간 복잡도: O(H * W * log(H * W))
```

### 1-1. 합성곱 정리(Convolution Theorem)
주파수 도메인 필터링의 존재 이유는 합성곱 정리에서 출발합니다.
* 공간 도메인의 두 신호 $f(x, y)$와 $g(x, y)$의 합성곱($f * g$)을 푸리에 변환하면, 각 신호의 푸리에 변환값 $F(u, v)$와 $G(u, v)$의 **단순 점 곱셈(Dot Product)**과 일치합니다.

$$\mathcal{F}\{f(x, y) * g(x, y)\} = F(u, v) \cdot G(u, v)$$

이 덕분에 커널 $K$의 크기가 $101 \times 101$ 등으로 매우 거대할 경우, 공간 영역에서 합성곱을 돌리는 것은 엄청난 연산 부하를 유발하지만, 주파수 영역에서는 고속 푸리에 변환(FFT)을 거쳐 단순히 픽셀 대 픽셀 곱셈만 한 뒤 역변환(IFFT)하는 것이 수천 배 더 효율적입니다.

---

## 2. 2D 고속 푸리에 변환 (FFT / IFFT)

Python NumPy 라이브러리는 2차원 이미지에 대한 이산 푸리에 변환(DFT) 엔진을 내장하고 있습니다.

2차원 이산 푸리에 변환은 이미지 $f(x, y)$를 주파수 좌표 $(u, v)$의 복소수 계수 $F(u, v)$로 바꾸는 연산입니다.

$$F(u, v) = \sum_{x=0}^{M-1}\sum_{y=0}^{N-1} f(x, y)e^{-j2\pi\left(\frac{ux}{M}+\frac{vy}{N}\right)}$$

역변환은 이 주파수 계수들을 다시 합쳐 원래 이미지로 복원합니다.

$$f(x, y) = \frac{1}{MN}\sum_{u=0}^{M-1}\sum_{v=0}^{N-1} F(u, v)e^{j2\pi\left(\frac{ux}{M}+\frac{vy}{N}\right)}$$

여기서 중심 근처의 낮은 주파수는 이미지의 전반적인 밝기와 큰 형태를 담고, 바깥쪽 높은 주파수는 경계선, 질감, 잡음처럼 급격한 변화를 담습니다.

```python
import numpy as np

def FFT(img_gray):
    # 1. 2D Fourier Transform 수행
    img_freq = np.fft.fft2(img_gray)
    
    # 2. 중심(DC component)으로 저주파 성분이 모이도록 Shift 수행
    # 기본 변환 결과는 네 모퉁이에 저주파가 존재하므로, 사람이 보기 편하게 중심으로 시프팅해 줍니다.
    img_freq_shift = np.fft.fftshift(img_freq)
    
    # 3. 시각화를 위한 로그 스케일 진폭 계산
    magnitude = 20 * np.log(np.abs(img_freq_shift) + 1)
    return img_freq_shift, magnitude

def IFFT(img_freq_shift):
    # 1. Shift 해제
    img_freq = np.fft.ifftshift(img_freq_shift)
    # 2. 2D Inverse Fourier Transform 수행
    img = np.fft.ifft2(img_freq)
    # 3. 허수부 성분을 제거하기 위해 절대값 취함
    img = np.abs(img)
    return img
```

---

## 3. 진폭(Magnitude) vs 위상(Phase)의 정보량 실험

푸리에 변환 결과인 복소수 행렬 $F(u, v)$는 **진폭(Magnitude)**과 **위상(Phase)**으로 분리할 수 있습니다.
* **진폭 (Spectrum / Magnitude)**: 해당 주파수 성분이 이미지 내에 얼마나 세게(강하게) 포함되어 있는지 세기를 나타냅니다.
* **위상 (Phase)**: 해당 파동 성분들이 이미지 내부의 어느 위치(좌표)에서 정렬되어 더해지는지 위상각 정보를 나타냅니다.

복소수 계수는 다음처럼 극좌표 형태로 표현할 수 있습니다.

$$F(u,v)=|F(u,v)|e^{j\phi(u,v)}$$

진폭과 위상은 각각 다음과 같습니다.

$$|F(u,v)|=\sqrt{Re(F)^2 + Im(F)^2}$$

$$\phi(u,v)=atan2(Im(F), Re(F))$$

스펙트럼을 시각화할 때 로그를 씌우는 이유는 DC 성분과 저주파 성분이 너무 커서 그대로 그리면 고주파 성분이 거의 보이지 않기 때문입니다.

$$S(u,v)=\log(1+|F(u,v)|)$$

```python
# 위상과 진폭 분리 및 훼손 복원 시각화
magnitude = np.abs(img_freq_shift)
phase = np.angle(img_freq_shift)

# 실험 1: 진폭을 임의의 노이즈로 훼손하고 위상 정보만 유지한 채 IFFT 복원
random_magnitude = np.random.rand(*magnitude.shape) * np.max(magnitude)
img_magnitude_destroyed = IFFT(random_magnitude * np.exp(1j * phase))

# 실험 2: 위상을 임의의 랜덤 값으로 훼손하고 진폭 정보만 유지한 채 IFFT 복원
random_phase = np.random.rand(*phase.shape) * 2 * np.pi
img_phase_destroyed = IFFT(magnitude * np.exp(1j * random_phase))

fig, ax = plt.subplots(1, 3, figsize=(15, 5))
ax[0].imshow(img_gray, cmap='gray')
ax[0].set_title('Original Grayscale')
ax[0].axis('off')

ax[1].imshow(img_magnitude_destroyed, cmap='gray')
ax[1].set_title('Image with Random Magnitude')
ax[1].axis('off')

ax[2].imshow(img_phase_destroyed, cmap='gray')
ax[2].set_title('Image with Random Phase')
ax[2].axis('off')

plt.tight_layout()
plt.show()
```

![Original, Random Phase 훼손, Random Spectrum 훼손 이미지 비교](/images/posts/image-processing/04_frequency_domain_filtering_1.png)
![Fourier Transform 진폭/위상 훼손 실험 시각화](/images/posts/image-processing/04_frequency_domain_filtering_2.png)

### 3-1. 실험 분석 결과
* **위상 정보가 파괴된 이미지**는 구조를 알아볼 수 없는 안개 같은 구름 덩어리로 변합니다.
* **진폭 정보가 파괴된 이미지**는 질감은 손상되었으나 **물체의 형태와 윤곽선(Edge)이 뚜렷하게 식별**됩니다.
* 즉, 디지털 이미지에서 물체의 구조적 기하 정보(형태)는 진폭보다 **위상(Phase) 채널에 압도적으로 많이 보관되어 있음**을 증명합니다.

---

## 4. 주파수 도메인 필터링 (LPF & HPF)

중심(저주파) 영역을 통과시키거나 차단하는 필터링 마스크를 생성하여 합성합니다.

주파수 도메인 필터링은 원본 주파수 성분 $F(u,v)$에 필터 $H(u,v)$를 곱하는 과정입니다.

$$G(u,v)=H(u,v)F(u,v)$$

그리고 역푸리에 변환을 적용해 공간 도메인 이미지 $g(x,y)$를 얻습니다.

$$g(x,y)=\mathcal{F}^{-1}\{G(u,v)\}$$

이상적 저주파 통과 필터는 중심 거리 $D(u,v)$가 cutoff $D_0$ 이하인 주파수만 통과시킵니다.

$$H_{LPF}(u,v)=
\begin{cases}
1, & D(u,v) \le D_0 \\
0, & D(u,v) > D_0
\end{cases}$$

고주파 통과 필터는 반대로 중심부를 제거합니다.

```python
# 1. 저주파 통과 필터 (Low Pass Filter, LPF) - 블러 효과
def LPF(fshift, cut_ratio=0.1):
    h, w = fshift.shape
    ch, cw = h // 2, w // 2
    mask = np.zeros((h, w), np.uint8)
    
    # 중심 영역(저주파)에만 1을 부여하고 나머지는 0으로 차단
    mask[ch - int(cut_ratio * h):ch + int(cut_ratio * h), 
         cw - int(cut_ratio * w):cw + int(cut_ratio * w)] = 1
    return fshift * mask

# 2. 고주파 통과 필터 (High Pass Filter, HPF) - 에지 검출 효과
def HPF(fshift, cut_ratio=0.1):
    h, w = fshift.shape
    ch, cw = h // 2, w // 2
    mask = np.ones((h, w), np.uint8)
    
    # 중심 영역(저주파)만 0으로 차단하고 바깥쪽 고주파는 살려둡니다.
    mask[ch - int(cut_ratio * h):ch + int(cut_ratio * h), 
         cw - int(cut_ratio * w):cw + int(cut_ratio * w)] = 0
    return fshift * mask

# 필터링 적용 및 시각화
freq_LPF = LPF(img_freq_shift, cut_ratio=0.1)
freq_HPF = HPF(img_freq_shift, cut_ratio=0.1)

img_LPF = IFFT(freq_LPF)
img_HPF = IFFT(freq_HPF)

fft_lowpass = 20 * np.log(np.abs(freq_LPF) + 1)
fft_highpass = 20 * np.log(np.abs(freq_HPF) + 1)

fig, ax = plt.subplots(2, 3, figsize=(15, 10))
# 상단: 결과 이미지
ax[0, 0].imshow(img_gray, cmap='gray')
ax[0, 0].set_title('Original')
ax[0, 0].axis('off')

ax[0, 1].imshow(img_LPF, cmap='gray')
ax[0, 1].set_title('Low-pass Filtered')
ax[0, 1].axis('off')

ax[0, 2].imshow(img_HPF, cmap='gray')
ax[0, 2].set_title('High-pass Filtered')
ax[0, 2].axis('off')

# 하단: 주파수 스펙트럼
ax[1, 0].imshow(magnitude, cmap='magma')
ax[1, 0].set_title('Original FFT')
ax[1, 0].axis('off')

ax[1, 1].imshow(fft_lowpass, cmap='magma')
ax[1, 1].set_title('LPF FFT')
ax[1, 1].axis('off')

ax[1, 2].imshow(fft_highpass, cmap='magma')
ax[1, 2].set_title('HPF FFT')
ax[1, 2].axis('off')

plt.tight_layout()
plt.show()
```

![Original 및 Low-pass, High-pass 필터링 결과 비교](/images/posts/image-processing/04_frequency_domain_filtering_3.png)
![LPF 및 HPF의 주파수 도메인 스펙트럼(FFT) 시각화](/images/posts/image-processing/04_frequency_domain_filtering_4.gif)

### 4-1. 이상적 필터(Ideal Filter)의 한계: 링잉 현상(Ringing Effect)
위 코드처럼 경계를 $0$과 $1$로 칼같이 잘라내는 필터를 **이상적 필터(Ideal Filter)**라고 합니다. 이 필터를 통과시킨 이미지(`img_LPF`)를 시각적으로 확인해보면 윤곽 주변에 물결치는 듯한 줄무늬 잡음인 **링잉 현상(Ringing Effect)**이 심하게 관찰됩니다. 
이는 주파수 영역에서 급격한 불연속 마스킹을 수행하여 나타나는 수학적 깁스 현상(Gibbs Phenomenon) 때문이며, 실제 제품 개발 시에는 경계를 부드럽게 감쇄시키는 **Butterworth Filter**나 **Gaussian Filter** 마스크를 만들어 필터링을 수행해 극복합니다.

Butterworth 저주파 필터는 급격한 절단 대신 완만한 감쇄를 사용합니다.

$$H(u,v)=\frac{1}{1+\left(\frac{D(u,v)}{D_0}\right)^{2n}}$$

Gaussian 저주파 필터는 중심에서 멀어질수록 지수적으로 부드럽게 감소합니다.

$$H(u,v)=e^{-\frac{D(u,v)^2}{2D_0^2}}$$

두 방식 모두 이상적 필터보다 경계가 매끄러워 링잉을 줄이는 데 유리합니다.

---

### 4-2. 주파수 영역에서의 Blurring 분석

공간 영역의 Mean 필터와 Gaussian 필터가 주파수 도메인에서 어떻게 표현되는지 비교하는 시각화 코드입니다.

```python
# Mean 및 Gaussian Blurring 주파수 분석
k_size = 7
mean_kernel = np.ones((k_size, k_size), np.float32) / (k_size**2)

# 가우시안 1D 커널을 외적(Outer Product)하여 2D 커널 생성
gaussian_1d = cv2.getGaussianKernel(k_size, sigma=1.5)
gaussian_kernel = np.outer(gaussian_1d, gaussian_1d)

# 커널들을 이미지 크기만큼 제로 패딩한 뒤 FFT 수행
h_p, w_p = img_gray.shape
padded_mean = np.zeros((h_p, w_p))
padded_mean[:k_size, :k_size] = mean_kernel
mean_fft = np.fft.fftshift(np.fft.fft2(padded_mean))
mean_magnitude = 20 * np.log(np.abs(mean_fft) + 1)

padded_gaussian = np.zeros((h_p, w_p))
padded_gaussian[:k_size, :k_size] = gaussian_kernel
gaussian_fft = np.fft.fftshift(np.fft.fft2(padded_gaussian))
gaussian_magnitude = 20 * np.log(np.abs(gaussian_fft) + 1)

fig, ax = plt.subplots(2, 2, figsize=(12, 10))
# 상단: 필터링 결과 이미지
ax[0, 0].imshow(cv2.filter2D(img_gray, -1, mean_kernel), cmap='gray')
ax[0, 0].set_title('Mean Blurred Image')
ax[0, 0].axis('off')

ax[0, 1].imshow(cv2.filter2D(img_gray, -1, gaussian_kernel), cmap='gray')
ax[0, 1].set_title('Gaussian Blurred Image')
ax[0, 1].axis('off')

# 하단: 주파수 스펙트럼
ax[1, 0].imshow(mean_magnitude, cmap='magma')
ax[1, 0].set_title('Mean Filter FFT')
ax[1, 0].axis('off')

ax[1, 1].imshow(gaussian_magnitude, cmap='magma')
ax[1, 1].set_title('Gaussian Filter FFT')
ax[1, 1].axis('off')

plt.tight_layout()
plt.show()
```

![Original 및 Mean/Gaussian Blurring 결과 비교](/images/posts/image-processing/04_frequency_domain_filtering_3.png)
![Blurring 필터별 주파수 스펙트럼 비교 시각화](/images/posts/image-processing/04_frequency_domain_filtering_4.gif)

## 5. 공간 도메인 커널의 주파수 분석 (Visualization)

우리가 3편에서 보았던 Sobel X, Y, Laplacian 등의 공간 영역 마스크들이 주파수 도메인에서는 어떤 특성(Band-pass)을 가지는지 검증하는 기법입니다.

```python
def analyze_kernel_frequency(kernel, target_size=(256, 256)):
    # 1. 작은 커널(3x3)을 이미지 크기만큼 제로 패딩(Zero Padding)합니다.
    h_pad = target_size[0] - kernel.shape[0]
    w_pad = target_size[1] - kernel.shape[1]
    padded_kernel = np.pad(kernel, ((0, h_pad), (0, w_pad)), 'constant')
    
    # 2. 2D FFT 수행
    f = np.fft.fft2(padded_kernel)
    fshift = np.fft.fftshift(f)
    
    # 3. 진폭 스펙트럼 산출
    magnitude = 20 * np.log(np.abs(fshift) + 1)
    return magnitude

# 커널별 주파수 분석 및 시각화
kernels = {
    'Sharpen1': np.array([[-2,-2,-2], [-2,17,-2], [-2,-2,-2]]),
    'Sharpen2': np.array([[0,-5,0], [0,11,0], [0,-5,0]]),
    'Sharpen3': np.array([[0,0,0], [-5,11,-5], [0,0,0]]),
    'Laplacian': np.array([[0,-1,0], [-1,4,-1], [0,-1,0]])
}

fig, ax = plt.subplots(2, 4, figsize=(16, 8))
for i, (name, kernel) in enumerate(kernels.items()):
    kernel_fft = analyze_kernel_frequency(kernel)
    
    # 상단: 커널 형태
    ax[0, i].imshow(kernel, cmap='gray')
    ax[0, i].set_title(f'{name} Kernel')
    ax[0, i].axis('off')
    
    # 하단: 주파수 스펙트럼
    ax[1, i].imshow(kernel_fft, cmap='magma')
    ax[1, i].set_title(f'{name} FFT')
    ax[1, i].axis('off')

plt.tight_layout()
plt.show()
```

![Mean Blur 및 Gaussian Blur 주파수 도메인 스펙트럼 비교](/images/posts/image-processing/04_frequency_domain_filtering_5.png)

* **해석법**:
  * **Sobel X 커널**의 주파수 변환 결과를 보면, 가로축 방향의 바깥쪽(고주파) 성분만 밝게 활성화되어 있어 세로 방향의 경계선(가로 주파수 변화)을 잡아내는 특성을 스펙트럼에서 직관적으로 목격할 수 있습니다.
  * **Laplacian 커널**은 중심 저주파는 어둡고, 사방의 모든 외곽(고주파) 영역이 대칭형으로 균등하게 활성화되는 원형 고주파 통과 필터(HPF)의 특성을 보입니다.

---

## 요약

1. **컨볼루션 정리**: 공간 도메인의 복잡한 Convolution은 주파수 도메인에서 단순 Multiplication과 동등하며, 대형 마스크 처리 시 압도적인 성능적 장점을 갖습니다.
2. **2D FFT & Shift**: `fft2`를 거쳐 `fftshift`를 수행해 중심부에 에너지가 모인 직관적인 저주파 정렬 주파수 스펙트럼 지도를 획득합니다.
3. **위상(Phase)의 가치**: 위상각 정보는 이미지 기하 구조(윤곽)를 복원하는 핵심 자산이며, 진폭(Magnitude) 정보는 질감의 강도 정보를 갖습니다.
4. **필터링 대칭**: 저주파 통과(LPF)는 Blurring 효과를, 고주파 통과(HPF)는 Edge 강조 효과를 매핑하지만, Ideal 필터는 링잉 현상(Ringing Effect)을 유발하므로 Gaussian 필터를 씁니다.
5. **커널 패딩 분석**: 3x3 공간 커널을 패딩 후 푸리에 변환하여 분석하면, 공간 계수들이 주파수 평면 상에서 어떤 주파수 대역을 타깃하는지 시각적 확인이 가능합니다.
