import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPostBySlug, getPostRouteEntries, getPostsByCategory } from '$lib/server/content';
import { parseMarkdownBlocks } from '$lib/server/markdown';

export const entries = () => {
	const entries = getPostRouteEntries();
	const legacyDevelopmentEntries = entries
		.filter((entry) => entry.mainCategory === 'development')
		.map((entry) => ({ ...entry, mainCategory: 'web-programming' }));

	return [...entries, ...legacyDevelopmentEntries];
};

export const load: PageServerLoad = async ({ params }) => {
	if (params.mainCategory.toLowerCase() === 'web-programming') {
		throw redirect(
			308,
			`/posts/development/${encodeURIComponent(params.subCategory)}/${encodeURIComponent(params.id)}`
		);
	}

	const post = await getPostBySlug(params.mainCategory, params.subCategory, params.id);

	if (!post) {
		throw error(404, 'Post not found');
	}

	const contentBlocks = await parseMarkdownBlocks(post.content);
	const { content, ...postSummary } = post;

	return {
		post: postSummary,
		contentBlocks,
		categoryPosts: await getPostsByCategory(post.mainCategory, post.subCategory)
	};
};
