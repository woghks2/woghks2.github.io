<script lang="ts">
	let tp = $state(80);
	let fp = $state(20);
	let fn = $state(20);
	let tn = $state(880);

	const precision = $derived(tp + fp === 0 ? 0 : tp / (tp + fp));
	const recall = $derived(tp + fn === 0 ? 0 : tp / (tp + fn));
	const specificity = $derived(tn + fp === 0 ? 0 : tn / (tn + fp));
	const falsePositiveRate = $derived(fp + tn === 0 ? 0 : fp / (fp + tn));
	const f1 = $derived(precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall));
	const sampleCount = $derived(tp + fp + fn + tn);

	function percent(value: number): string {
		return `${(value * 100).toFixed(1)}%`;
	}
</script>

<section class="not-prose my-8 rounded-xl border border-[#30363d] bg-[#0e1117] p-5 font-sans text-[#e6edf3]">
	<h3 class="mb-1 text-lg font-semibold text-white">혼동 행렬 &amp; 평가 지표 계산기</h3>
	<p class="mb-5 text-xs text-[#8b949e]">
		TP, FP, FN, TN 슬라이더를 조절하여 실시간 평가 지표 변화를 확인하세요. (총 샘플: {sampleCount.toLocaleString()}개)
	</p>

	<div class="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
		<div class="rounded-xl bg-[#161b22] px-3 py-2.5">
			<div class="text-xs text-[#8b949e]">Precision (정밀도)</div>
			<div class="mt-0.5 text-xl font-semibold text-white">{percent(precision)}</div>
			<div class="mt-1 font-mono text-[10px] text-[#8b949e]">TP / (TP + FP)</div>
		</div>
		<div class="rounded-xl bg-[#161b22] px-3 py-2.5">
			<div class="text-xs text-[#8b949e]">Recall (재현율)</div>
			<div class="mt-0.5 text-xl font-semibold text-white">{percent(recall)}</div>
			<div class="mt-1 font-mono text-[10px] text-[#8b949e]">TP / (TP + FN)</div>
		</div>
		<div class="rounded-xl bg-[#161b22] px-3 py-2.5">
			<div class="text-xs text-[#8b949e]">Specificity (특이도)</div>
			<div class="mt-0.5 text-xl font-semibold text-white">{percent(specificity)}</div>
			<div class="mt-1 font-mono text-[10px] text-[#8b949e]">TN / (TN + FP)</div>
		</div>
		<div class="rounded-xl bg-[#161b22] px-3 py-2.5">
			<div class="text-xs text-[#8b949e]">FPR</div>
			<div class="mt-0.5 text-xl font-semibold text-white">{percent(falsePositiveRate)}</div>
			<div class="mt-1 font-mono text-[10px] text-[#8b949e]">FP / (FP + TN)</div>
		</div>
		<div class="rounded-xl bg-[#161b22] px-3 py-2.5">
			<div class="text-xs text-[#8b949e]">F1-Score</div>
			<div class="mt-0.5 text-xl font-semibold text-white">{f1.toFixed(3)}</div>
			<div class="mt-1 font-mono text-[10px] text-[#8b949e]">2·(P·R)/(P+R)</div>
		</div>
	</div>

	<div class="mb-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
		<div class="rounded-xl bg-[#161b22] p-3">
			<h4 class="mb-2 text-sm font-semibold text-white">혼동 행렬 (Confusion Matrix)</h4>
			<table class="w-full border-separate border-spacing-1 text-center text-[10px] sm:text-xs">
				<thead>
					<tr>
						<th></th>
						<th class="px-1 font-medium text-[#8b949e]">예측 Positive</th>
						<th class="px-1 font-medium text-[#8b949e]">예측 Negative</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th class="px-1 text-left font-medium text-[#8b949e]">실제 Positive</th>
						<td class="rounded-md border border-sky-400 bg-[#0e1117] p-2"><strong class="block text-sky-300">TP</strong><span>{tp}</span></td>
						<td class="rounded-md border border-rose-400 bg-[#0e1117] p-2"><strong class="block text-rose-300">FN</strong><span>{fn}</span></td>
					</tr>
					<tr>
						<th class="px-1 text-left font-medium text-[#8b949e]">실제 Negative</th>
						<td class="rounded-md border border-amber-400 bg-[#0e1117] p-2"><strong class="block text-amber-300">FP</strong><span>{fp}</span></td>
						<td class="rounded-md border border-emerald-400 bg-[#0e1117] p-2"><strong class="block text-emerald-300">TN</strong><span>{tn}</span></td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="rounded-xl bg-[#161b22] p-3">
			<div class="relative h-36 pl-9 pt-1">
				<div class="absolute inset-x-9 top-1 flex justify-between text-[10px] text-[#8b949e]"><span>100%</span><span>50%</span><span>0%</span></div>
				<div class="absolute inset-x-9 bottom-6 top-5 flex flex-col justify-between">
					<div class="border-t border-[#30363d]"></div>
					<div class="border-t border-[#30363d]"></div>
					<div class="border-t border-[#30363d]"></div>
				</div>
				<div class="relative z-10 flex h-full items-end justify-around border-b border-[#30363d] px-8 pb-0 pt-5">
					<div class="flex h-full w-10 items-end"><div class="w-full rounded-t-full bg-sky-300" style={`height:${precision * 100}%`}></div></div>
					<div class="flex h-full w-10 items-end"><div class="w-full rounded-t-full bg-indigo-300" style={`height:${recall * 100}%`}></div></div>
					<div class="flex h-full w-10 items-end"><div class="w-full rounded-t-full bg-emerald-400" style={`height:${specificity * 100}%`}></div></div>
					<div class="flex h-full w-10 items-end"><div class="w-full rounded-t-full bg-orange-300" style={`height:${falsePositiveRate * 100}%`}></div></div>
					<div class="flex h-full w-10 items-end"><div class="w-full rounded-t-full bg-lime-300" style={`height:${f1 * 100}%`}></div></div>
				</div>
			</div>
			<div class="ml-9 mt-1 flex justify-around text-[10px] text-[#8b949e]"><span>Precision</span><span>Recall</span><span>Specificity</span><span>FPR</span><span>F1-Score</span></div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-x-6 gap-y-4 rounded-xl bg-[#161b22] p-4 text-sm sm:grid-cols-2">
		<label>
			<span class="mb-2 flex justify-between"><span>TP</span><strong>{tp}</strong></span>
			<input class="w-full accent-sky-400" type="range" min="0" max="1000" bind:value={tp} />
		</label>
		<label>
			<span class="mb-2 flex justify-between"><span>FP</span><strong>{fp}</strong></span>
			<input class="w-full accent-sky-400" type="range" min="0" max="1000" bind:value={fp} />
		</label>
		<label>
			<span class="mb-2 flex justify-between"><span>FN</span><strong>{fn}</strong></span>
			<input class="w-full accent-sky-400" type="range" min="0" max="1000" bind:value={fn} />
		</label>
		<label>
			<span class="mb-2 flex justify-between"><span>TN</span><strong>{tn}</strong></span>
			<input class="w-full accent-sky-400" type="range" min="0" max="1000" bind:value={tn} />
		</label>
	</div>
</section>
