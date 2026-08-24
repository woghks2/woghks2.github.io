import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategoryRouteEntries, getPostsByCategory } from '$lib/server/content';

export const entries = () => {
	const entries = getCategoryRouteEntries();
	const legacyDevelopmentEntries = entries
		.filter((entry) => entry.mainCategory === 'development')
		.map((entry) => ({ ...entry, mainCategory: 'web-programming' }));

	return [...entries, ...legacyDevelopmentEntries];
};

export const load: PageServerLoad = async ({ params }) => {
	if (params.mainCategory.toLowerCase() === 'web-programming') {
		throw redirect(
			308,
			`/categories/development/${encodeURIComponent(params.subCategory)}`
		);
	}

	return {
		posts: await getPostsByCategory(params.mainCategory, params.subCategory)
	};
};
