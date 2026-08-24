<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { getCategoryAccentClass } from '$lib/category-meta';
	import { ChevronRight } from '@lucide/svelte';
	import type { SidebarCategory } from '$lib/data';
	import type { Component } from 'svelte';

	type SidebarCategoryWithIcon = SidebarCategory & {
		icon: Component;
		postCount: number;
		url?: string;
	};

	let { items }: { items: SidebarCategoryWithIcon[] } = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Categories</Sidebar.GroupLabel>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as category}
				{#if category.url}
					<Sidebar.MenuItem class={getCategoryAccentClass(category.slug)}>
						<Sidebar.MenuButton tooltipContent={category.title}>
							{#snippet child({ props })}
								<a href={category.url} {...props}>
									<span
										class="flex h-5 w-5 items-center justify-center rounded-md bg-category-accent-soft text-category-accent"
									>
										<category.icon class="h-3.5 w-3.5" />
									</span>
									<span class="min-w-0 flex-1 truncate">{category.title}</span>
									<span
										class="shrink-0 text-xs font-medium text-sidebar-foreground/45 tabular-nums group-data-[collapsible=icon]:hidden"
									>
										{category.postCount}
									</span>
									<span
										class="h-4 w-4 shrink-0 group-data-[collapsible=icon]:hidden"
										aria-hidden="true"
									></span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{:else}
					<Collapsible.Root class={`group/collapsible ${getCategoryAccentClass(category.slug)}`}>
						<Sidebar.MenuItem>
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props} tooltipContent={category.title}>
										<span
											class="flex h-5 w-5 items-center justify-center rounded-md bg-category-accent-soft text-category-accent"
										>
											<category.icon class="h-3.5 w-3.5" />
										</span>
										<span class="min-w-0 flex-1 truncate">{category.title}</span>
										<span
											class="shrink-0 text-xs font-medium text-sidebar-foreground/45 tabular-nums group-data-[collapsible=icon]:hidden"
										>
											{category.postCount}
										</span>
										<ChevronRight
											class="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90"
										/>
									</Sidebar.MenuButton>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content class="overflow-hidden [contain:layout_paint]">
								<Sidebar.MenuSub>
									{#each category.items as subItem}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton>
												{#snippet child({ props })}
													<a href={subItem.url} {...props}>
														<span class="min-w-0 flex-1 truncate">{subItem.title}</span>
														<span
															class="ml-auto shrink-0 text-[11px] font-medium text-sidebar-foreground/45 tabular-nums"
														>
															{subItem.postCount}
														</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						</Sidebar.MenuItem>
					</Collapsible.Root>
				{/if}
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
