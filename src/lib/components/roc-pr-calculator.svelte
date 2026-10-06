<script lang="ts">
	type CurvePoint = { x: number; y: number };

	let separation = $state(2.2);
	let positiveRatio = $state(0.36);
	let scoreThreshold = $state(0);

	function normalCdf(value: number): number {
		const a1 = 0.254829592;
		const a2 = -0.284496736;
		const a3 = 1.421413741;
		const a4 = -1.453152027;
		const a5 = 1.061405429;
		const p = 0.3275911;
		const sign = value < 0 ? -1 : 1;
		const x = Math.abs(value) / Math.SQRT2;
		const t = 1 / (1 + p * x);
		const erf = sign * (1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)));
		return 0.5 * (1 + erf);
	}

	function areaUnderCurve(points: CurvePoint[]): number {
		let area = 0;
		for (let index = 0; index < points.length - 1; index += 1) {
			const current = points[index];
			const next = points[index + 1];
			area += ((next.x - current.x) * (current.y + next.y)) / 2;
		}
		return area;
	}

	function graphPath(points: CurvePoint[]): string {
		return points
			.map((point, index) => {
				const x = 34 + point.x * 270;
				const y = 190 - point.y * 164;
				return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
			})
			.join(' ');
	}

	const rocPoints = $derived.by(() => {
		const points: CurvePoint[] = [];
		for (let index = 0; index <= 120; index += 1) {
			const threshold = 4 - (index / 120) * 8;
			points.push({
				x: 1 - normalCdf(threshold),
				y: 1 - normalCdf(threshold - separation)
			});
		}
		return points;
	});

	const prPoints = $derived.by(() => {
		const points: CurvePoint[] = [];
		for (let index = 0; index <= 120; index += 1) {
			const threshold = 4 - (index / 120) * 8;
			const recall = 1 - normalCdf(threshold - separation);
			const falsePositiveRate = 1 - normalCdf(threshold);
			const truePositive = recall * positiveRatio;
			const falsePositive = falsePositiveRate * (1 - positiveRatio);
			points.push({
				x: recall,
				y: truePositive + falsePositive === 0 ? 1 : truePositive / (truePositive + falsePositive)
			});
		}
		return points;
	});

	const rocAuc = $derived(areaUnderCurve(rocPoints));
	const prAuc = $derived(areaUnderCurve(prPoints));
	const currentFpr = $derived(1 - normalCdf(scoreThreshold));
	const currentTpr = $derived(1 - normalCdf(scoreThreshold - separation));
	const currentPrecision = $derived(
		currentTpr * positiveRatio + currentFpr * (1 - positiveRatio) === 0
			? 1
			: (currentTpr * positiveRatio) /
				  (currentTpr * positiveRatio + currentFpr * (1 - positiveRatio))
	);
	const rocPath = $derived(graphPath(rocPoints));
	const prPath = $derived(graphPath(prPoints));
	const rocBaselineY = $derived(190 - positiveRatio * 164);
</script>

<section class="not-prose my-8 rounded-xl border border-[#30363d] bg-[#0e1117] p-5 font-sans text-[#e6edf3]">
	<h3 class="mb-1 text-lg font-semibold text-white">ROC 커브 &amp; PR 커브 시뮬레이터</h3>
	<p class="mb-5 text-xs text-[#8b949e]">
		클래스 분리도, 양성 비율, 점수 임계값을 바꾸며 두 커브의 변화를 확인하세요.
	</p>

	<div class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-center">
			<div class="text-xs text-[#8b949e]">ROC-AUC</div>
			<div class="mt-1 text-xl font-semibold text-sky-300">{rocAuc.toFixed(3)}</div>
			<div class="mt-1 text-[11px] text-[#8b949e]">현재 점: FPR {currentFpr.toFixed(2)}, TPR {currentTpr.toFixed(2)}</div>
		</div>
		<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-3 text-center">
			<div class="text-xs text-[#8b949e]">PR-AUC (사다리꼴 적분)</div>
			<div class="mt-1 text-xl font-semibold text-indigo-300">{prAuc.toFixed(3)}</div>
			<div class="mt-1 text-[11px] text-[#8b949e]">현재 점: Recall {currentTpr.toFixed(2)}, Precision {currentPrecision.toFixed(2)}</div>
		</div>
	</div>

	<div class="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
		<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-3">
			<h4 class="mb-2 text-center text-xs font-semibold text-[#c9d1d9]">ROC Curve (FPR vs TPR)</h4>
			<svg viewBox="0 0 320 220" class="mx-auto block w-full max-w-[320px] rounded bg-[#0d1117]" role="img" aria-label="ROC curve">
				<line x1="34" y1="26" x2="34" y2="190" stroke="#6e7681" />
				<line x1="34" y1="190" x2="304" y2="190" stroke="#6e7681" />
				<line x1="34" y1="108" x2="304" y2="108" stroke="#30363d" />
				<line x1="169" y1="26" x2="169" y2="190" stroke="#30363d" />
				<line x1="34" y1="190" x2="304" y2="26" stroke="#8b949e" stroke-dasharray="4 4" />
				<path d={rocPath} fill="none" stroke="#388bfd" stroke-width="3" />
				<circle cx={34 + currentFpr * 270} cy={190 - currentTpr * 164} r="5" fill="#f85149" stroke="#fff" stroke-width="1.5" />
				<text x="7" y="31" fill="#8b949e" font-size="10">1</text>
				<text x="7" y="194" fill="#8b949e" font-size="10">0</text>
				<text x="32" y="207" fill="#8b949e" font-size="10">0</text>
				<text x="296" y="207" fill="#8b949e" font-size="10">1</text>
				<text x="150" y="218" fill="#8b949e" font-size="10">FPR</text>
				<text x="5" y="14" fill="#8b949e" font-size="10">TPR</text>
			</svg>
		</div>

		<div class="rounded-lg border border-[#30363d] bg-[#161b22] p-3">
			<h4 class="mb-2 text-center text-xs font-semibold text-[#c9d1d9]">PR Curve (Recall vs Precision)</h4>
			<svg viewBox="0 0 320 220" class="mx-auto block w-full max-w-[320px] rounded bg-[#0d1117]" role="img" aria-label="Precision recall curve">
				<line x1="34" y1="26" x2="34" y2="190" stroke="#6e7681" />
				<line x1="34" y1="190" x2="304" y2="190" stroke="#6e7681" />
				<line x1="34" y1="108" x2="304" y2="108" stroke="#30363d" />
				<line x1="169" y1="26" x2="169" y2="190" stroke="#30363d" />
				<line x1="34" y1={rocBaselineY} x2="304" y2={rocBaselineY} stroke="#8b949e" stroke-dasharray="4 4" />
				<path d={prPath} fill="none" stroke="#58a6ff" stroke-width="3" />
				<circle cx={34 + currentTpr * 270} cy={190 - currentPrecision * 164} r="5" fill="#f85149" stroke="#fff" stroke-width="1.5" />
				<text x="7" y="31" fill="#8b949e" font-size="10">1</text>
				<text x="7" y="194" fill="#8b949e" font-size="10">0</text>
				<text x="32" y="207" fill="#8b949e" font-size="10">0</text>
				<text x="296" y="207" fill="#8b949e" font-size="10">1</text>
				<text x="140" y="218" fill="#8b949e" font-size="10">Recall</text>
				<text x="2" y="14" fill="#8b949e" font-size="10">Precision</text>
			</svg>
			<p class="mt-1 text-center text-[10px] text-[#8b949e]">점선: 양성 비율 기준선 ({(positiveRatio * 100).toFixed(0)}%)</p>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-x-6 gap-y-4 rounded-lg bg-[#161b22] p-4 text-sm sm:grid-cols-2">
		<label>
			<span class="mb-2 flex justify-between"><span>클래스 분리도</span><strong>{separation.toFixed(1)}</strong></span>
			<input class="w-full accent-sky-400" type="range" min="0" max="3.5" step="0.1" bind:value={separation} />
		</label>
		<label>
			<span class="mb-2 flex justify-between"><span>양성 비율</span><strong>{(positiveRatio * 100).toFixed(0)}%</strong></span>
			<input class="w-full accent-sky-400" type="range" min="0.02" max="0.5" step="0.02" bind:value={positiveRatio} />
		</label>
		<label class="sm:col-span-2">
			<span class="mb-2 flex justify-between"><span>점수 임계값</span><strong>{scoreThreshold.toFixed(1)}</strong></span>
			<input class="w-full accent-sky-400" type="range" min="-4" max="4" step="0.1" bind:value={scoreThreshold} />
		</label>
	</div>
	<p class="mt-3 text-[10px] text-[#8b949e]">시뮬레이션 가정: Negative 점수는 N(0, 1), Positive 점수는 N({separation.toFixed(1)}, 1) 분포를 따릅니다.</p>
</section>
