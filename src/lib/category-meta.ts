import type { PostSummary } from '$lib/data';

export type CategoryMeta = {
	label: string;
	accentClass: string;
};

export const categoryMetaBySlug: Record<string, CategoryMeta> = {
	'problem-solving': {
		label: 'Problem Solving',
		accentClass: 'category-accent-problem-solving'
	},
	'machine-learning': {
		label: 'Machine Learning',
		accentClass: 'category-accent-machine-learning'
	},
	'data-analysis': {
		label: 'Data Analysis',
		accentClass: 'category-accent-data-analysis'
	},
	development: {
		label: 'Development',
		accentClass: 'category-accent-development'
	},
	projects: {
		label: 'Projects',
		accentClass: 'category-accent-projects'
	},
	cs: {
		label: 'CS',
		accentClass: 'category-accent-cs'
	},
	certifications: {
		label: 'Certifications',
		accentClass: 'category-accent-certifications'
	}
};

const categoryDisplayNameBySlug: Record<string, string> = {
	duntong: '던통',
	'data-handling': 'Data Handling',
	'training-optimization': 'Training & Optimization',
	evaluation: 'Evaluation',
	model: 'Model',
	fastapi: 'FastAPI',
	sveltekit: 'SvelteKit',
	postgresql: 'PostgreSQL',
	bigquery: 'BigQuery'
};

export function formatCategorySlug(slug: string): string {
	const normalizedSlug = slug.toLowerCase();
	if (categoryDisplayNameBySlug[normalizedSlug]) {
		return categoryDisplayNameBySlug[normalizedSlug];
	}

	return slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getCategoryMeta(slug: string): CategoryMeta {
	return (
		categoryMetaBySlug[slug] ?? {
			label: formatCategorySlug(slug),
			accentClass: ''
		}
	);
}

export function getCategoryAccentClass(slug: string): string {
	return getCategoryMeta(slug).accentClass;
}

export function getCategoryPath(mainCategory: string, subCategory: string): string {
	if (mainCategory.toLowerCase() === 'projects' && !subCategory) {
		return '/projects';
	}

	return `/categories/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}`;
}

export function getPostPath(
	post: Pick<PostSummary, 'mainCategory' | 'subCategory' | 'id'>
): string {
	if (post.mainCategory.toLowerCase() === 'projects' && !post.subCategory) {
		return `/posts/projects/${encodeURIComponent(post.id)}`;
	}

	return `/posts/${encodeURIComponent(post.mainCategory)}/${encodeURIComponent(post.subCategory)}/${encodeURIComponent(post.id)}`;
}
