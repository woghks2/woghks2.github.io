import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { execFileSync } from 'node:child_process';
import { relative } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

function contentManifestPlugin(): Plugin {
	let isGenerating = false;

	function generateContentManifest() {
		if (isGenerating) return;

		isGenerating = true;
		try {
			execFileSync(process.execPath, ['scripts/generate-content-manifest.mjs'], {
				stdio: 'inherit'
			});
		} finally {
			isGenerating = false;
		}
	}

	function isPostMarkdownFile(file: string) {
		const normalizedPath = relative(process.cwd(), file).replaceAll('\\', '/');
		return normalizedPath.startsWith('src/lib/posts/') && normalizedPath.endsWith('.md');
	}

	return {
		name: 'content-manifest',
		buildStart() {
			generateContentManifest();
		},
		handleHotUpdate({ file, server }) {
			if (!isPostMarkdownFile(file)) return;

			generateContentManifest();
			server.ws.send({ type: 'full-reload' });
			return [];
		}
	};
}

export default defineConfig({
	plugins: [contentManifestPlugin(), tailwindcss(), sveltekit()],
	server: {
		port: 5174
	}
});
