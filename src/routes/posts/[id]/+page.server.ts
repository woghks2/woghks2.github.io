import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPostPath } from '$lib/category-meta';
import { findPostById, getPostIdRouteEntries } from '$lib/server/content';

export const entries = () => getPostIdRouteEntries();

export const load: PageServerLoad = async ({ params }) => {
	const post = await findPostById(params.id);

	if (!post) {
		throw error(404, 'Post not found');
	}

	throw redirect(301, getPostPath(post));
};
