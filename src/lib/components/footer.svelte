<script lang="ts">
	import Discord from './icons/discord.svelte';
	import Github from './icons/github.svelte';
	import Gmail from './icons/gmail.svelte';
	import Linkedin from './icons/linkedin.svelte';
const currentYear = new Date().getFullYear();

	const socialLinks = [
		{
			name: 'Github',
			href: 'https://github.com/woghks2',
			icon: Github,
			label: 'Github'
		},
		{
			name: 'Discord',
			href: 'https://discord.com',
			icon: Discord,
			label: 'Discord'
		},
		{
			name: 'Gmail',
			href: 'mailto:tbxkdls19@gmail.com',
			icon: Gmail,
			label: 'Gmail'
		},
		{
			name: 'Linkedin',
			href: 'https://linkedin.com/in/your-profile',
			icon: Linkedin,
			label: 'Linkedin'
		}
	];
</script>



<footer class="mt-auto border-t border-blog-hairline bg-card px-4 py-10 text-blog-ink sm:px-6">
	<div class="mx-auto max-w-6xl">
		<div class="flex flex-col justify-between gap-8 md:flex-row md:items-end">
			<div class="flex max-w-md flex-col gap-3">
				<h2 class="text-xl font-semibold tracking-normal">Blog</h2>
				<p class="text-xs text-blog-muted">
					© {currentYear} Personal Blog. All rights reserved.
				</p>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				{#each socialLinks as link}
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex h-10 items-center gap-2 px-1 text-sm font-medium text-blog-muted transition-colors hover:text-blog-ink"
					>
						<link.icon size="18" />

						<span>{link.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>


