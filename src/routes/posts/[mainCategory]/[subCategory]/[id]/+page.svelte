<script lang="ts">
	import type { PageData } from './$types';
	import PostDetailPage from '$lib/components/post-detail-page.svelte';

	let { data }: { data: PageData } = $props();
</script>

<PostDetailPage {...data} />
