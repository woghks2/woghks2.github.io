<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import headerImage from '$lib/assets/profile/sidebar-header.jpg';
</script>

<Sidebar.Header class="border-b border-sidebar-border bg-sidebar px-4 py-6">
	<div class="flex flex-col items-center text-center group-data-[collapsible=icon]:px-0">
		<img
			src={headerImage}
			alt="Sidebar header profile"
			class="h-20 w-20 shrink-0 rounded-full object-cover group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
		/>
		<strong
			class="mt-4 block text-base leading-6 font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden"
		>
			베짱이의 작업공간
		</strong>
		<p
			class="mt-1 text-[12px] leading-5 text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden"
		>
			<span class="block">게임, 커머스 도메인에 관심있는</span>
			<span class="block">데이터 분석가입니다.</span>
		</p>
		<p
			class="mt-2 rounded-md bg-sidebar-accent/60 px-2 py-1 text-[12px] leading-4 font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden"
		>
			블로그 이전중입니다!
		</p>
	</div>
</Sidebar.Header>
