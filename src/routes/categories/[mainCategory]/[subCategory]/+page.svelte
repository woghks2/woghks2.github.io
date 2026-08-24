<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import { formatCategorySlug, getCategoryAccentClass } from '$lib/category-meta';
	import { getPostPath } from '$lib/category-meta';
	import DateDisplay from '$lib/components/date-display.svelte';
	import HashtagBadge from '$lib/components/hashtag-badge.svelte';
	import TechStackBadge from '$lib/components/tech-stack-badge.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Pagination from '$lib/components/ui/pagination';
	import { fly } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	const mainCategory = $derived(page.params.mainCategory ?? '');
	const subCategory = $derived(page.params.subCategory ?? '');
	const filteredPosts = $derived(data.posts);

	const formattedMain = $derived(formatCategorySlug(mainCategory ?? '').toUpperCase());
	const formattedSub = $derived(formatCategorySlug(subCategory ?? '').toUpperCase());
	const currentAccentClass = $derived(getCategoryAccentClass(mainCategory));

	let currentPage = $state(1);
	const perPage = 10;
	const orderedPosts = $derived.by(() =>
		[...filteredPosts].sort((a, b) => {
			const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
			if (dateDiff !== 0) return dateDiff;

			return a.title.localeCompare(b.title, undefined, { numeric: true });
		})
	);
	const paginatedPosts = $derived(
		orderedPosts.slice((currentPage - 1) * perPage, currentPage * perPage)
	);
</script>

<div class="blog-page">
	<div class="blog-container space-y-8">
		<div class="blog-content-grid">
			<main class="blog-content-main">
				<section class={`category-index-header ${currentAccentClass}`}>
					<div class="space-y-5">
						<Breadcrumb.Breadcrumb>
							<Breadcrumb.BreadcrumbList>
								<Breadcrumb.BreadcrumbItem>
									<Breadcrumb.BreadcrumbLink href="/">Home</Breadcrumb.BreadcrumbLink>
								</Breadcrumb.BreadcrumbItem>
								<Breadcrumb.BreadcrumbSeparator />
								<Breadcrumb.BreadcrumbItem>
									<Breadcrumb.BreadcrumbPage>{formattedMain}</Breadcrumb.BreadcrumbPage>
								</Breadcrumb.BreadcrumbItem>
								<Breadcrumb.BreadcrumbSeparator />
								<Breadcrumb.BreadcrumbItem>
									<Breadcrumb.BreadcrumbPage>{formattedSub}</Breadcrumb.BreadcrumbPage>
								</Breadcrumb.BreadcrumbItem>
							</Breadcrumb.BreadcrumbList>
						</Breadcrumb.Breadcrumb>

						<div>
							<h1>{formattedSub}</h1>
							<span class="category-index-count">{filteredPosts.length} posts</span>
						</div>
					</div>
				</section>

				{#if filteredPosts.length > 0}
					<div class="category-post-list" in:fly={{ y: 8, duration: 180, delay: 100 }}>
						{#each paginatedPosts as post}
							<a href={getPostPath(post)} class="category-post-row">
								<article class="category-post-body">
									<div class="category-post-title-line">
										<h2>{post.title}</h2>
										<DateDisplay date={post.date} />
									</div>

									<p>{post.description}</p>

									<div class="category-post-meta">
										<div class="category-post-tags">
											{#each post.tags.slice(0, 4) as tag}
												<HashtagBadge {tag} class="text-[12px]" />
											{/each}
										</div>

										<div class="category-post-tech">
											{#each post.techStack.slice(0, 4) as tech}
												<TechStackBadge lang={tech} class="px-2 py-0.5 text-[11px]" />
											{/each}
										</div>
									</div>
								</article>
							</a>
						{/each}
					</div>

					{#if filteredPosts.length > perPage}
						<div class="py-8">
							<Pagination.Root count={filteredPosts.length} {perPage} bind:page={currentPage}>
								{#snippet children({ pages, currentPage })}
									<Pagination.Content>
										<Pagination.Item>
											<Pagination.PrevButton />
										</Pagination.Item>
										{#each pages as page (page.key)}
											{#if page.type === 'page'}
												<Pagination.Item>
													<Pagination.Link {page} isActive={currentPage === page.value}>
														{page.value}
													</Pagination.Link>
												</Pagination.Item>
											{:else}
												<Pagination.Item>
													<Pagination.Ellipsis />
												</Pagination.Item>
											{/if}
										{/each}
										<Pagination.Item>
											<Pagination.NextButton />
										</Pagination.Item>
									</Pagination.Content>
								{/snippet}
							</Pagination.Root>
						</div>
					{/if}
				{:else}
					<div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-blog-hairline bg-blog-surface-soft py-20 text-blog-muted">
						<p>No posts found in this category.</p>
					</div>
				{/if}
			</main>

			<aside class="blog-content-rail" aria-hidden="true"></aside>
		</div>
	</div>
</div>
