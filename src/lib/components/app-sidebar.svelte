<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import {
		Home,
		Code2,
		Brain,
		BarChart3,
		Globe,
		FolderKanban,
		FolderRoot,
		Database,
		Monitor
	} from '@lucide/svelte';
	import AppSidebarHeader from '$lib/components/app-sidebar-header.svelte';
	import NavMain from '$lib/components/nav-main.svelte';
	import NavCategories from '$lib/components/nav-categories.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import avatarImage from '$lib/assets/profile/sidebar-avatar.jpg';
	import type { SidebarCategory } from '$lib/data';
	import type { Component } from 'svelte';

	type SidebarCategoryWithIcon = SidebarCategory & {
		icon: Component;
		postCount: number;
		url?: string;
	};

	let {
		categories = [],
		postCountByMainCategory = {}
	}: {
		categories?: SidebarCategory[];
		postCountByMainCategory?: Record<string, number>;
	} = $props();

	const user = {
		name: '베짱이28호',
		avatar: avatarImage
	};

	const mainItems = [
		{
			title: 'Home',
			url: '/',
			icon: Home
		}
	];

	const categoryIcons: Record<string, Component> = {
		'problem-solving': Code2,
		'machine-learning': Brain,
		'data-analysis': BarChart3,
		development: Monitor,
		projects: FolderKanban,
		cs: Database,
		certifications: Globe
	};

	function sortByTitle(items: SidebarCategoryWithIcon[]) {
		return [...items].sort((a, b) =>
			a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
		);
	}

	const sidebarCategories = $derived.by<SidebarCategoryWithIcon[]>(() => {
		const mappedCategories = categories
			.filter((category) => category.items.length > 0 || category.url)
			.map((category) => ({
				...category,
				icon: categoryIcons[category.slug] ?? FolderRoot,
				postCount: postCountByMainCategory[category.slug] ?? 0
			}));

		return sortByTitle(mappedCategories);
	});
</script>

<Sidebar.Sidebar>
	<AppSidebarHeader />
	<Sidebar.SidebarContent>
		<NavMain items={mainItems} />
		<NavCategories items={sidebarCategories} />
	</Sidebar.SidebarContent>
	<Sidebar.SidebarFooter>
		<NavUser {user} />
	</Sidebar.SidebarFooter>
</Sidebar.Sidebar>
