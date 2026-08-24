<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { Component } from "svelte";

	let { items }: { items: { title: string; url: string; icon: Component }[] } = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
