<script lang="ts">
	import type { PostSummary } from '$lib/data';
	import { formatCategorySlug, getCategoryAccentClass, getPostPath } from '$lib/category-meta';
	import TechStackBadge from './tech-stack-badge.svelte';
	import HashtagBadge from './hashtag-badge.svelte';
	import DateDisplay from './date-display.svelte';

	let { post }: { post: PostSummary } = $props();

	const accentClass = $derived(getCategoryAccentClass(post.mainCategory));
	const postHref = $derived(getPostPath(post));
</script>

<a href={postHref} class="group block h-full">
	<article
		class={`blog-card ${accentClass} relative flex h-full flex-col overflow-hidden p-5 transition-transform active:scale-[0.99]`}
	>
		<div class="absolute inset-x-0 top-0 h-1 bg-category-accent"></div>

		<div class="flex h-full flex-col gap-3">
			<div class="flex items-center justify-between gap-3">
				<span
					class="rounded-full bg-category-accent-soft px-2.5 py-1 text-[11px] font-semibold text-blog-ink"
				>
					{formatCategorySlug(post.subCategory || post.mainCategory)}
				</span>
				<DateDisplay date={post.date} />
			</div>

			<h3
				class="text-[15px] leading-snug font-semibold tracking-normal text-blog-ink transition-colors group-hover:underline group-hover:underline-offset-4"
			>
				{post.title}
			</h3>

			<p class="line-clamp-2 text-[13px] leading-6 font-normal text-blog-muted">
				{post.description}
			</p>

			<div class="flex flex-wrap gap-2 pt-1">
				{#each post.tags as tag}
					<HashtagBadge {tag} />
				{/each}
			</div>

			<div class="mt-auto flex flex-wrap gap-1.5 border-t border-blog-hairline-soft pt-4">
				<div class="flex flex-wrap gap-1.5">
					{#each post.techStack as tech}
						<TechStackBadge lang={tech} />
					{/each}
				</div>
			</div>
		</div>
	</article>
</a>
