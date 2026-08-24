import {
	directoryCategoryPairs,
	postSummaries,
	type IndexedPostSummary
} from '$lib/generated/content-manifest';
import type { Post, PostSummary, SidebarCategory, SidebarSubCategory } from '$lib/data';

const MAIN_CATEGORY_LABELS: Record<string, string> = {
	'problem-solving': 'Problem Solving',
	'machine-learning': 'Machine Learning',
	'data-analysis': 'Data Analysis',
	development: 'Development',
	projects: 'Project',
	cs: 'CS',
	certifications: 'Certifications'
};

const SUB_CATEGORY_LABELS: Record<string, Record<string, string>> = {
	'problem-solving': {
		query: 'Query(SQL/Pandas)',
		algorithm: 'Algorithm'
	},
	'machine-learning': {
		statistics: 'Statistics',
		'data-handling': 'Data Handling',
		'training-optimization': 'Training & Optimization',
		evaluation: 'Evaluation',
		model: 'Model',
		'image-processing': 'Image Processing',
		workflow: 'Workflow'
	},
	'data-analysis': {
		commerce: 'Commerce'
	},
	development: {
		fastapi: 'FastAPI',
		sveltekit: 'SvelteKit'
	},
	projects: {
		'movie-recommendation': '영화추천 서비스',
		duntong: '던통'
	},
	cs: {
		database: 'Database',
		os: 'OS',
		network: 'Network'
	},
	certifications: {
		adp: 'ADP'
	}
};

const SUB_CATEGORY_ORDER: Record<string, string[]> = {
	'problem-solving': ['query', 'algorithm'],
	'machine-learning': [
		'statistics',
		'data-handling',
		'training-optimization',
		'evaluation',
		'model',
		'image-processing',
		'workflow'
	],
	'data-analysis': ['commerce'],
	development: ['fastapi', 'sveltekit', 'postgresql', 'bigquery'],
	projects: ['movie-recommendation', 'duntong'],
	cs: ['database', 'os', 'network'],
	certifications: ['adp']
};

function toDisplayTitle(slug: string): string {
	return slug
		.split(/[-_]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function getMainCategoryTitle(mainCategory: string): string {
	return MAIN_CATEGORY_LABELS[mainCategory] ?? toDisplayTitle(mainCategory);
}

function getSubCategoryTitle(mainCategory: string, subCategory: string): string {
	return SUB_CATEGORY_LABELS[mainCategory]?.[subCategory] ?? toDisplayTitle(subCategory);
}

function getCategoryPairKey(mainCategory: string, subCategory: string): string {
	return `${mainCategory.toLowerCase()}::${subCategory.toLowerCase()}`;
}

function getDirectoryCategoryPairs(): Array<{ mainCategory: string; subCategory: string }> {
	return directoryCategoryPairs
		.map((pair) => ({
			mainCategory: pair.mainCategory.toLowerCase(),
			subCategory: pair.subCategory.toLowerCase()
		}))
		.sort((a, b) => {
			const mainDiff = compareSidebarMainCategories(a.mainCategory, b.mainCategory);
			if (mainDiff !== 0) return mainDiff;

			const aItem = {
				slug: a.subCategory,
				title: getSubCategoryTitle(a.mainCategory, a.subCategory),
				url: '',
				postCount: 0
			};
			const bItem = {
				slug: b.subCategory,
				title: getSubCategoryTitle(b.mainCategory, b.subCategory),
				url: '',
				postCount: 0
			};

			return compareSidebarSubCategories(a.mainCategory, aItem, bItem);
		});
}

function compareSidebarMainCategories(a: string, b: string): number {
	return getMainCategoryTitle(a).localeCompare(getMainCategoryTitle(b), undefined, {
		sensitivity: 'base'
	});
}

function compareSidebarSubCategories(
	mainCategory: string,
	a: SidebarSubCategory,
	b: SidebarSubCategory
): number {
	const preferredOrder = SUB_CATEGORY_ORDER[mainCategory] ?? [];
	const aIndex = preferredOrder.indexOf(a.slug);
	const bIndex = preferredOrder.indexOf(b.slug);

	if (aIndex !== -1 || bIndex !== -1) {
		if (aIndex === -1) return 1;
		if (bIndex === -1) return -1;
		if (aIndex !== bIndex) return aIndex - bIndex;
	}

	return a.title.localeCompare(b.title);
}

function stripPostSourcePath(post: IndexedPostSummary): PostSummary {
	const { sourcePath, ...summary } = post;
	return summary;
}

function findIndexedPost(
	mainCategory: string,
	subCategory: string,
	id: string
): IndexedPostSummary | undefined {
	const normalizedMain = mainCategory.toLowerCase();
	const normalizedSub = subCategory.toLowerCase();

	return postSummaries.find(
		(candidate) =>
			candidate.id === id &&
			candidate.mainCategory.toLowerCase() === normalizedMain &&
			candidate.subCategory.toLowerCase() === normalizedSub
	);
}

export async function getAllPosts(): Promise<PostSummary[]> {
	return postSummaries.map(stripPostSourcePath);
}

export async function getRecentPosts(limit: number): Promise<PostSummary[]> {
	return postSummaries.slice(0, limit).map(stripPostSourcePath);
}

export async function getPostCountByMainCategory(): Promise<Record<string, number>> {
	return postSummaries.reduce<Record<string, number>>((counts, post) => {
		counts[post.mainCategory] = (counts[post.mainCategory] ?? 0) + 1;
		return counts;
	}, {});
}

export function getCategoryRouteEntries(): Array<{ mainCategory: string; subCategory: string }> {
	return getDirectoryCategoryPairs();
}

export function getPostIdRouteEntries(): Array<{ id: string }> {
	return postSummaries.map((post) => ({
		id: post.id
	}));
}

export function getPostRouteEntries(): Array<{
	mainCategory: string;
	subCategory: string;
	id: string;
}> {
	return postSummaries
		.filter((post) => post.subCategory !== '')
		.map((post) => ({
			mainCategory: post.mainCategory,
			subCategory: post.subCategory,
			id: post.id
		}));
}

export function getFlatProjectPostRouteEntries(): Array<{ id: string }> {
	return postSummaries
		.filter((post) => post.mainCategory.toLowerCase() === 'projects' && post.subCategory === '')
		.map((post) => ({ id: post.id }));
}

export async function getSidebarCategories(): Promise<SidebarCategory[]> {
	const postCountByPair = new Map<string, number>();
	const groupedCategories = new Map<string, SidebarSubCategory[]>();

	for (const post of postSummaries) {
		const mainCategory = post.mainCategory.toLowerCase();
		const pairKey = getCategoryPairKey(mainCategory, post.subCategory);
		postCountByPair.set(pairKey, (postCountByPair.get(pairKey) ?? 0) + 1);

		// A main category can contain posts directly without any subcategory folders.
		// Keep the category itself in the sidebar even when it has no child items.
		if (!groupedCategories.has(mainCategory)) {
			groupedCategories.set(mainCategory, []);
		}
	}

	for (const pair of getDirectoryCategoryPairs()) {
		const items = groupedCategories.get(pair.mainCategory) ?? [];
		items.push({
			slug: pair.subCategory,
			title: getSubCategoryTitle(pair.mainCategory, pair.subCategory),
			url: `/categories/${encodeURIComponent(pair.mainCategory)}/${encodeURIComponent(pair.subCategory)}`,
			postCount: postCountByPair.get(getCategoryPairKey(pair.mainCategory, pair.subCategory)) ?? 0
		});
		groupedCategories.set(pair.mainCategory, items);
	}

	return Array.from(groupedCategories.entries())
		.sort(([a], [b]) => compareSidebarMainCategories(a, b))
		.map(([mainCategory, items]) => {
			if (mainCategory === 'projects') {
				return {
					slug: mainCategory,
					title: getMainCategoryTitle(mainCategory),
					url: '/projects',
					items: []
				};
			}

			return {
				slug: mainCategory,
				title: getMainCategoryTitle(mainCategory),
				items: items.sort((a, b) => compareSidebarSubCategories(mainCategory, a, b))
			};
		});
}

export async function getPostsByCategory(
	mainCategory: string,
	subCategory: string
): Promise<PostSummary[]> {
	const normalizedMain = mainCategory.toLowerCase();
	const normalizedSub = subCategory.toLowerCase();

	return postSummaries
		.filter(
			(post) =>
				post.mainCategory.toLowerCase() === normalizedMain &&
				post.subCategory.toLowerCase() === normalizedSub
		)
		.map(stripPostSourcePath);
}

export async function getPostsByMainCategory(mainCategory: string): Promise<PostSummary[]> {
	const normalizedMain = mainCategory.toLowerCase();

	return postSummaries
		.filter((post) => post.mainCategory.toLowerCase() === normalizedMain)
		.map(stripPostSourcePath);
}

export async function findPostById(id: string): Promise<PostSummary | null> {
	const post = postSummaries.find((candidate) => candidate.id === id);
	return post ? stripPostSourcePath(post) : null;
}

export async function getPostBySlug(
	mainCategory: string,
	subCategory: string,
	id: string
): Promise<Post | null> {
	const post = findIndexedPost(mainCategory, subCategory, id);
	if (!post) return null;

	const { postContentBySourcePath } = await import('$lib/generated/content-bodies');
	const content = postContentBySourcePath[post.sourcePath];
	if (content === undefined) return null;

	return {
		...stripPostSourcePath(post),
		content
	};
}

export async function getFlatProjectPostById(id: string): Promise<Post | null> {
	const post = postSummaries.find(
		(candidate) =>
			candidate.id === id &&
			candidate.mainCategory.toLowerCase() === 'projects' &&
			candidate.subCategory === ''
	);

	if (!post) return null;

	const { postContentBySourcePath } = await import('$lib/generated/content-bodies');
	const content = postContentBySourcePath[post.sourcePath];
	if (content === undefined) return null;

	return {
		...stripPostSourcePath(post),
		content
	};
}
