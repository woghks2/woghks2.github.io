<script lang="ts">
	import type { PostSummary, RenderedContentBlock } from '$lib/data';
	import CodeTabs from '$lib/components/code-tabs.svelte';
	import Mermaid from '$lib/components/mermaid.svelte';
	import MermaidGrid from '$lib/components/mermaid-grid.svelte';
	import PostHeader from '$lib/components/post-header.svelte';
	import PostToc from '$lib/components/post-toc.svelte';
	import RelatedPosts from '$lib/components/related-posts.svelte';
	import { formatCategorySlug, getCategoryMeta } from '$lib/category-meta';
	import { ChevronLeft } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import 'katex/dist/katex.min.css';

	let { post, categoryPosts, contentBlocks } = $props<{
		post: PostSummary;
		categoryPosts: PostSummary[];
		contentBlocks: RenderedContentBlock[];
	}>();

	const currentPostId = $derived(post.id);
	const categoryName = $derived(
		post.subCategory
			? `${getCategoryMeta(post.mainCategory).label} > ${formatCategorySlug(post.subCategory)}`.toUpperCase()
			: getCategoryMeta(post.mainCategory).label.toUpperCase()
	);
	const backHref = $derived(
		post.mainCategory.toLowerCase() === 'projects' && !post.subCategory ? '/projects' : '/'
	);
	const contentKey = $derived(
		[post.mainCategory, post.subCategory, post.id].filter(Boolean).join('/')
	);
</script>

<div class="min-h-screen px-4 sm:px-6 lg:px-8">
	<div class="post-layout-viewport">
		<div class="post-layout-grid mx-auto grid w-full xl:items-start">
			<article class="min-w-0 py-8 sm:py-10" in:fly={{ y: 20, duration: 600 }}>
				<a
					href={backHref}
					class="group mb-7 inline-flex h-9 items-center rounded-lg border border-blog-hairline bg-background px-3 text-sm font-semibold text-blog-muted transition-colors hover:text-blog-ink"
				>
					<ChevronLeft class="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
					Back to list
				</a>

				<PostHeader {post} />

				<div
					class="prose max-w-none prose-zinc dark:prose-invert
					prose-headings:font-semibold prose-headings:tracking-normal prose-headings:text-blog-ink
					prose-h1:text-3xl prose-h1:leading-tight
					prose-h2:mt-11 prose-h2:mb-4 prose-h2:text-2xl prose-h2:leading-tight
					prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h3:leading-snug
					prose-p:my-4 prose-p:text-base prose-p:leading-7 prose-p:text-blog-body
					prose-a:text-blog-ink prose-a:underline prose-a:underline-offset-4 prose-blockquote:border-l-blog-hairline prose-blockquote:text-blog-body
					prose-strong:font-semibold prose-strong:text-blog-ink prose-code:bg-transparent
					prose-code:before:content-none prose-code:after:content-none
					prose-pre:bg-transparent prose-pre:p-0
					prose-li:text-base prose-li:leading-7 prose-li:text-blog-body"
				>
					{#each contentBlocks as block}
						{#if block.type === 'html'}
							{@html block.content}
						{:else if block.type === 'tabs'}
							<CodeTabs tabs={block.tabs} />
						{:else if block.type === 'mermaid'}
							<Mermaid code={block.code} />
						{:else if block.type === 'mermaid-grid'}
							<MermaidGrid diagrams={block.diagrams} />
						{/if}
					{/each}
				</div>

				<RelatedPosts {currentPostId} {categoryPosts} {categoryName} />
			</article>

			<PostToc {contentKey} title={post.title} />
		</div>
	</div>
</div>
