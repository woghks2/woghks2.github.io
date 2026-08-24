<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Separator } from "$lib/components/ui/separator";
    import { ModeWatcher } from "mode-watcher";
    import ModeToggle from "$lib/components/mode-toggle.svelte";
	import Footer from '$lib/components/footer.svelte';
	import ScrollProgress from '$lib/components/scroll-progress.svelte';

	let { children, data } = $props();
</script>


<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
</svelte:head>

<ModeWatcher />

	<Sidebar.SidebarProvider class="app-shell">
	<AppSidebar
		categories={data.sidebarCategories}
		postCountByMainCategory={data.postCountByMainCategory}
	/>
	<Sidebar.SidebarInset class="app-main-shell">
		<header class="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-sidebar-border bg-background/90 px-4 backdrop-blur-md lg:px-6">
            <div class="flex min-w-0 items-center gap-3 md:hidden">
			    <Sidebar.SidebarTrigger class="-ml-1" />
			    <Separator orientation="vertical" class="h-4" />
            </div>
            <ModeToggle />
            <ScrollProgress />
		</header>
		<div id="main-scroll-container" class="flex flex-1 flex-col">
            <div class="min-h-screen w-full flex-1 bg-background">
			    {@render children()}
            </div>
            <Footer />
		</div>


	</Sidebar.SidebarInset>
</Sidebar.SidebarProvider>
