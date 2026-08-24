<script lang="ts">
	import type { PostSummary } from '$lib/data';
	import { formatCategorySlug, getCategoryAccentClass, getCategoryPath } from '$lib/category-meta';
	import TechStackBadge from '$lib/components/tech-stack-badge.svelte';
	import HashtagBadge from '$lib/components/hashtag-badge.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import { CalendarDays, Hash, AlignLeft, ListTree, Globe } from '@lucide/svelte';

	let { post } = $props<{ post: PostSummary }>();

	const accentClass = $derived(getCategoryAccentClass(post.mainCategory));
	const formattedMainCategory = $derived(formatCategorySlug(post.mainCategory));
	const formattedSubCategory = $derived(formatCategorySlug(post.subCategory));
	const categoryHref = $derived(getCategoryPath(post.mainCategory, post.subCategory));
</script>

<header class={`mb-9 space-y-6 ${accentClass}`}>
	<div class="space-y-4">
		<Breadcrumb.Breadcrumb>
			<Breadcrumb.BreadcrumbList class="text-xs font-medium text-blog-muted">
				<Breadcrumb.BreadcrumbItem>
					<Breadcrumb.BreadcrumbLink href="/" class="text-blog-muted hover:text-blog-ink">
						Home
					</Breadcrumb.BreadcrumbLink>
				</Breadcrumb.BreadcrumbItem>
				<Breadcrumb.BreadcrumbSeparator />
				<Breadcrumb.BreadcrumbItem>
					{#if post.subCategory}
						<span class="text-blog-muted">{formattedMainCategory}</span>
					{:else}
						<Breadcrumb.BreadcrumbLink
							href={categoryHref}
							class="font-semibold text-blog-ink hover:text-blog-ink"
						>
							{formattedMainCategory}
						</Breadcrumb.BreadcrumbLink>
					{/if}
				</Breadcrumb.BreadcrumbItem>
				{#if post.subCategory}
					<Breadcrumb.BreadcrumbSeparator />
					<Breadcrumb.BreadcrumbItem>
						<Breadcrumb.BreadcrumbLink
							href={categoryHref}
							class="font-semibold text-blog-ink hover:text-blog-ink"
						>
							{formattedSubCategory}
						</Breadcrumb.BreadcrumbLink>
					</Breadcrumb.BreadcrumbItem>
				{/if}
			</Breadcrumb.BreadcrumbList>
		</Breadcrumb.Breadcrumb>

		<h1
			id="post-title"
			class="text-3xl leading-[1.12] font-bold tracking-normal text-blog-ink md:text-4xl"
		>
			{post.title}
		</h1>
	</div>

	<div class="space-y-2 text-sm">
		<!-- Short Description -->
		<div
			class="grid grid-cols-1 gap-1.5 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-center sm:gap-x-5"
		>
			<div class="flex h-8 items-center gap-2 text-blog-muted">
				<AlignLeft class="h-3.5 w-3.5" />
				<span class="text-[11px] font-semibold tracking-[0.08em] uppercase">Description</span>
			</div>
			<p class="flex min-h-8 items-center text-sm leading-5 font-normal text-blog-body">
				{post.description}
			</p>
		</div>

		<!-- Skills -->
		<div
			class="grid grid-cols-1 gap-1.5 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-center sm:gap-x-5"
		>
			<div class="flex h-8 items-center gap-2 text-blog-muted">
				<ListTree class="h-3.5 w-3.5" />
				<span class="text-[11px] font-semibold tracking-[0.08em] uppercase">Skills</span>
			</div>
			<div class="flex min-h-8 flex-wrap items-center gap-2">
				{#each post.techStack as tech}
					<TechStackBadge lang={tech} class="text-sm" />
				{/each}
			</div>
		</div>

		<!-- Tags -->
		<div
			class="grid grid-cols-1 gap-1.5 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-center sm:gap-x-5"
		>
			<div class="flex h-8 items-center gap-2 text-blog-muted">
				<Hash class="h-3.5 w-3.5" />
				<span class="text-[11px] font-semibold tracking-[0.08em] uppercase">Hashtags</span>
			</div>
			<div class="flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1">
				{#each post.tags as tag}
					<HashtagBadge {tag} />
				{/each}
			</div>
		</div>

		<!-- Problem URL -->
		{#if post.problem_url}
			<div
				class="grid grid-cols-1 gap-1.5 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-start sm:gap-x-5"
			>
				<div class="flex h-8 items-center gap-2 text-blog-muted">
					<Globe class="h-3.5 w-3.5" />
					<span class="text-[11px] font-semibold tracking-[0.08em] uppercase">Problem</span>
				</div>
				<a
					href={post.problem_url}
					target="_blank"
					class="flex min-h-8 items-center text-sm leading-5 font-normal break-all text-blog-ink underline underline-offset-4"
				>
					{post.problem_url}
				</a>
			</div>
		{/if}

		<!-- Date -->
		<div
			class="grid grid-cols-1 gap-1.5 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-center sm:gap-x-5"
		>
			<div class="flex h-8 items-center gap-2 text-blog-muted">
				<CalendarDays class="h-3.5 w-3.5" />
				<span class="text-[11px] font-semibold tracking-[0.08em] uppercase">Date</span>
			</div>
			<p class="flex min-h-8 items-center text-sm font-normal text-blog-body">{post.date}</p>
		</div>
	</div>
</header>

<Separator class="mb-7 bg-blog-hairline-soft" />
