<script lang="ts">
	import { tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import { ListTree, ChevronDown, ChevronRight } from '@lucide/svelte';

	interface TocItem {
		id: string;
		text: string;
		level: number;
		children?: TocItem[];
		isOpen?: boolean;
	}

	let tocTree: TocItem[] = $state([]);
	let activeId = $state('');
	let { contentKey, title }: { contentKey: string; title: string } = $props();
	let tocObserver: IntersectionObserver | null = null;

	function resetToc() {
		tocObserver?.disconnect();
		tocObserver = null;
		tocTree = [];
		activeId = '';
	}

	function collectToc() {
		const titleHeading = document.getElementById('post-title');
		const headings = document.querySelectorAll('.prose h2, .prose h3');
		const items: TocItem[] = [];
		let currentH2: TocItem | null = null;

		if (titleHeading) {
			items.push({
				id: titleHeading.id,
				text: title || titleHeading.textContent || '',
				level: 1,
				children: [],
				isOpen: true
			});
		}

		headings.forEach((h, i) => {
			const id = `heading-${i}`;
			h.id = id;
			const level = parseInt(h.tagName[1]);
			const item: TocItem = {
				id,
				text: h.textContent || '',
				level,
				children: [],
				isOpen: true
			};

			if (level === 2) {
				currentH2 = item;
				items.push(item);
			} else if (level === 3 && currentH2) {
				currentH2.children?.push(item);
			} else {
				items.push(item);
			}
		});

		tocTree = items;

		tocObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				});
			},
			{ rootMargin: '-10% 0% -80% 0%' }
		);
		if (titleHeading) tocObserver.observe(titleHeading);
		headings.forEach((h) => tocObserver?.observe(h));
	}

	$effect(() => {
		const currentContentKey = contentKey;

		let cancelled = false;

		resetToc();

		tick().then(() => {
			if (cancelled) return;
			if (currentContentKey !== contentKey) return;
			collectToc();
		});

		return () => {
			cancelled = true;
			resetToc();
		};
	});

	function scrollTo(id: string) {
		const element = document.getElementById(id);
		if (element) {
			const offset = element.getBoundingClientRect().top + window.scrollY - 80;
			const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'auto'
				: 'smooth';
			window.scrollTo({ top: offset, behavior });
		}
	}

	function toggleSection(item: TocItem, e: MouseEvent) {
		e.stopPropagation();
		item.isOpen = !item.isOpen;
	}
</script>

<aside class="hidden w-60 shrink-0 self-start py-8 xl:sticky xl:top-24 xl:block">
	<div class="max-h-[calc(100vh-8rem)] w-full space-y-8 overflow-y-auto pt-16">
		<div class="space-y-4">
			<h3 class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-blog-muted">
				<ListTree class="h-3 w-3" />
				Table of Contents
			</h3>
			
			<nav class="flex flex-col space-y-1 border-l border-blog-hairline-soft pl-4" aria-label="Table of contents">
				{#each tocTree as item}
					<div class="flex flex-col">
						<div class="flex items-center group relative">
							{#if activeId === item.id || (item.children?.some(c => c.id === activeId))}
									<div class="absolute left-[-17px] top-1.5 bottom-1.5 w-[2px] rounded-full bg-blog-ink"></div>
							{/if}

							{#if item.children && item.children.length > 0}
								<button 
									onclick={(e) => toggleSection(item, e)}
									aria-label={item.isOpen ? `Collapse ${item.text}` : `Expand ${item.text}`}
									aria-expanded={item.isOpen}
									class="mr-1 p-1 text-blog-muted transition-colors hover:text-blog-ink"
								>
									{#if item.isOpen}
										<ChevronDown class="h-3 w-3" />
									{:else}
										<ChevronRight class="h-3 w-3" />
									{/if}
								</button>
							{:else}
								<span class="w-5"></span>
							{/if}

							<button
								onclick={() => scrollTo(item.id)}
								class="flex-1 truncate py-1 text-left text-xs transition-colors duration-200
									{activeId === item.id ? 'text-blog-ink font-semibold' : 'text-blog-muted font-medium hover:text-blog-ink'}"
							>
								{item.text}
							</button>
						</div>

						{#if item.children && item.children.length > 0 && item.isOpen}
							<div transition:slide={{ duration: 200 }} class="ml-6 flex flex-col space-y-1 mt-1 pl-2">
								{#each item.children as child}
									<button
										onclick={() => scrollTo(child.id)}
										class="relative truncate py-1 text-left text-xs transition-colors duration-200
											{activeId === child.id ? 'text-blog-ink font-semibold' : 'text-blog-muted font-medium hover:text-blog-ink'}"
									>
										{#if activeId === child.id}
											<div class="absolute left-[-33px] top-0 bottom-0 w-[2px] rounded-full bg-blog-ink"></div>
										{/if}
										{child.text}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</nav>
		</div>
	</div>
</aside>
