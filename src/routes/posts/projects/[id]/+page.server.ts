import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getFlatProjectPostById,
	getFlatProjectPostRouteEntries,
	getPostsByMainCategory
} from '$lib/server/content';
import { parseMarkdownBlocks } from '$lib/server/markdown';

export const entries = () => getFlatProjectPostRouteEntries();

export const load: PageServerLoad = async ({ params }) => {
	const post = await getFlatProjectPostById(params.id);

	if (!post) {
		throw error(404, 'Project post not found');
	}

	const contentBlocks = await parseMarkdownBlocks(post.content);
	const { content, ...postSummary } = post;

	return {
		post: postSummary,
		contentBlocks,
		categoryPosts: await getPostsByMainCategory('projects')
	};
};
