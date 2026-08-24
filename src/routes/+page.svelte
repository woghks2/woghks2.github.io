<script lang="ts">
	import type { PageData } from './$types';
	import type { PostSummary } from '$lib/data';
	import {
		formatCategorySlug,
		getCategoryAccentClass,
		getCategoryMeta,
		getPostPath
	} from '$lib/category-meta';
	import { Search } from '@lucide/svelte';
	import { fly } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	const posts = $derived(data.posts ?? []);
	const homePostLimit = $derived(data.homePostLimit ?? 10);

	const filteredPosts = $derived(posts.slice(0, homePostLimit));

	const topTags = $derived.by(() => {
		const tagCounts = new Map<string, number>();

		for (const post of posts) {
			for (const tag of post.tags) {
				tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
			}
		}

		return Array.from(tagCounts.entries())
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
			.slice(0, 8)
			.map(([tag, count]) => ({ tag, count }));
	});

	function formatDate(date: string) {
		return date.replaceAll('-', '.');
	}

	function getPostKind(post: PostSummary) {
		return getCategoryMeta(post.mainCategory).label;
	}
</script>

<div class="blog-page blog-home-page">
	<div class="blog-home-container">
		<div class="blog-content-grid">
			<main class="blog-post-index blog-content-main" aria-labelledby="post-index-title">
				<div class="blog-post-index-header">
					<div>
						<p class="blog-eyebrow">Latest Posting</p>
						<h2 id="post-index-title">최근 포스팅</h2>
					</div>

					<div class="blog-home-search" aria-hidden="true">
						<Search class="h-3.5 w-3.5" />
						<span>Search posts</span>
					</div>
				</div>

				<div class="blog-post-list">
					{#each filteredPosts as post, index}
						{@const accentClass = getCategoryAccentClass(post.mainCategory)}
						<a
							href={getPostPath(post)}
							class={`blog-post-row ${accentClass}`}
							in:fly={{ y: 8, duration: 160, delay: index * 24 }}
						>
							<article>
								<div class="blog-post-row-main">
									<div class="blog-post-row-meta">
										<span class="blog-post-kind">
											<span class="bg-category-accent"></span>
											{getPostKind(post)}
										</span>
										<span>{formatCategorySlug(post.subCategory || post.mainCategory)}</span>
										<span>{formatDate(post.date)}</span>
									</div>

									<h3>{post.title}</h3>
									<p>{post.description}</p>

									<div class="blog-post-row-footer">
										<div class="blog-post-tags">
											{#each post.tags.slice(0, 3) as tag}
												<span>#{tag}</span>
											{/each}
										</div>
									</div>
								</div>
							</article>
						</a>
					{/each}
				</div>
			</main>

			<aside class="blog-home-rail blog-content-rail" aria-label="태그">
				<section class="blog-tag-rail">
					<p class="blog-eyebrow">Popular Tags</p>
					<div class="blog-topic-cloud">
						{#each topTags as tag}
							<span><strong>#{tag.tag}</strong><em>{tag.count}</em></span>
						{/each}
					</div>
				</section>
			</aside>
		</div>
	</div>
</div>
