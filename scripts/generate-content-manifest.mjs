import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const POSTS_ROOT = join(ROOT, 'src', 'lib', 'posts');
const OUT_ROOT = join(ROOT, 'src', 'lib', 'generated');
const IGNORED_POST_DIR_NAMES = new Set(['00_public']);
const INCLUDE_DRAFTS = process.env.CONTENT_INCLUDE_DRAFTS === 'true';

const MAIN_CATEGORY_LABELS = {
	'problem-solving': 'Problem Solving',
	'machine-learning': 'Machine Learning',
	'data-analysis': 'Data Analysis',
	development: 'Development',
	projects: 'Project',
	cs: 'CS',
	certifications: 'Certifications'
};

const SUB_CATEGORY_ORDER = {
	'problem-solving': ['query', 'algorithm'],
	'machine-learning': [
		'statistics',
		'data-handling',
		'training-optimization',
		'evaluation',
		'model',
		'image-processing'
	],
	'data-analysis': ['commerce', 'game'],
	development: ['fastapi', 'sveltekit', 'postgresql', 'bigquery'],
	projects: [],
	cs: ['database', 'os', 'network'],
	certifications: ['adp']
};

function toPosixPath(path) {
	return path.split(sep).join('/');
}

function shouldIgnoreDirectory(name) {
	return IGNORED_POST_DIR_NAMES.has(name.toLowerCase());
}

async function walkFiles(root, extension) {
	const files = [];

	async function walk(current) {
		let entries = [];

		try {
			entries = await readdir(current, { withFileTypes: true });
		} catch {
			return;
		}

		for (const entry of entries) {
			const fullPath = join(current, entry.name);

			if (entry.isDirectory()) {
				if (shouldIgnoreDirectory(entry.name)) continue;
				await walk(fullPath);
			} else if (entry.isFile() && entry.name.endsWith(extension)) {
				files.push(fullPath);
			}
		}
	}

	await walk(root);
	return files.sort((a, b) => a.localeCompare(b));
}

async function getDirectoryCategoryPairs() {
	const pairs = [];

	let mainEntries = [];
	try {
		mainEntries = await readdir(POSTS_ROOT, { withFileTypes: true });
	} catch {
		return pairs;
	}

	for (const mainEntry of mainEntries) {
		if (!mainEntry.isDirectory()) continue;
		if (shouldIgnoreDirectory(mainEntry.name)) continue;

		const mainCategory = mainEntry.name.toLowerCase();
		const mainCategoryPath = join(POSTS_ROOT, mainEntry.name);
		let subEntries = [];

		try {
			subEntries = await readdir(mainCategoryPath, { withFileTypes: true });
		} catch {
			continue;
		}

		for (const subEntry of subEntries) {
			if (!subEntry.isDirectory()) continue;
			if (shouldIgnoreDirectory(subEntry.name)) continue;

			pairs.push({
				mainCategory,
				subCategory: normalizeSubCategory(mainCategory, subEntry.name)
			});
		}
	}

	return pairs.sort((a, b) => {
		const mainDiff = compareMainCategories(a.mainCategory, b.mainCategory);
		if (mainDiff !== 0) return mainDiff;
		return compareSubCategories(a.mainCategory, a.subCategory, b.subCategory);
	});
}

function parseFrontMatter(contentString) {
	const parsed = matter(contentString);
	return {
		metadata: parsed.data ?? {},
		contentBody: parsed.content.trim()
	};
}

function normalizeSubCategory(mainCategory, folderName) {
	return folderName.toLowerCase();
}

function toStringValue(value, fallback = '') {
	if (value instanceof Date) {
		return value.toISOString().slice(0, 10);
	}

	if (typeof value === 'string') {
		return value;
	}

	if (value === null || value === undefined) {
		return fallback;
	}

	return String(value);
}

function toStringArray(value, fallback = []) {
	if (!Array.isArray(value)) {
		return fallback;
	}

	return value.map((item) => toStringValue(item)).filter(Boolean);
}

function toUrlValue(value) {
	const text = toStringValue(value);
	const markdownLinkMatch = text.match(/^\[[^\]]+\]\((https?:\/\/.+)\)$/);
	return markdownLinkMatch ? markdownLinkMatch[1] : text;
}

function isVisiblePost(metadata) {
	const status = toStringValue(metadata.status, 'published').trim().toLowerCase();
	return INCLUDE_DRAFTS || status !== 'draft';
}

function toDisplayTitle(slug) {
	return slug
		.split(/[-_]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function getMainCategoryTitle(mainCategory) {
	return MAIN_CATEGORY_LABELS[mainCategory] ?? toDisplayTitle(mainCategory);
}

function compareMainCategories(a, b) {
	return getMainCategoryTitle(a).localeCompare(getMainCategoryTitle(b), undefined, {
		sensitivity: 'base'
	});
}

function compareSubCategories(mainCategory, a, b) {
	const preferredOrder = SUB_CATEGORY_ORDER[mainCategory] ?? [];
	const aIndex = preferredOrder.indexOf(a);
	const bIndex = preferredOrder.indexOf(b);

	if (aIndex !== -1 || bIndex !== -1) {
		if (aIndex === -1) return 1;
		if (bIndex === -1) return -1;
		if (aIndex !== bIndex) return aIndex - bIndex;
	}

	return a.localeCompare(b);
}

function getSortableDate(date) {
	const parsed = new Date(date).getTime();
	return Number.isNaN(parsed) ? 0 : parsed;
}

function comparePosts(a, b) {
	const dateDiff = getSortableDate(b.date) - getSortableDate(a.date);
	if (dateDiff !== 0) return dateDiff;

	const categoryDiff = a.mainCategory.localeCompare(b.mainCategory);
	if (categoryDiff !== 0) return categoryDiff;

	const subCategoryDiff = a.subCategory.localeCompare(b.subCategory);
	if (subCategoryDiff !== 0) return subCategoryDiff;

	return a.title.localeCompare(b.title);
}

function parsePost(filePath, rawContent) {
	if (!rawContent.trim()) {
		return null;
	}

	const relativePath = toPosixPath(relative(join(ROOT, 'src', 'lib', 'posts'), filePath));
	const pathParts = relativePath.split('/');
	const mainCategory = pathParts[0]?.toLowerCase() ?? 'uncategorized';
	const parentFolder = pathParts[pathParts.length - 2] ?? mainCategory;
	const filename = pathParts[pathParts.length - 1] ?? 'post.md';
	const id = filename.replace(/\.md$/, '');
	const { metadata, contentBody } = parseFrontMatter(rawContent);

	if (!isVisiblePost(metadata)) {
		return null;
	}

	let title = toStringValue(metadata.title);
	if (!title) {
		const firstLine = rawContent.split('\n')[0] || filename;
		title = firstLine
			.replace(/^#\s*/, '')
			.replace(/\*\*/g, '')
			.replaceAll('\\[', '[')
			.replaceAll('\\]', ']')
			.trim();

		if (!title) title = filename.replace(/\.md$/, '');
	}

	const isFlatProjectPost = mainCategory === 'projects' && pathParts.length === 2;
	const subCategory = isFlatProjectPost
		? ''
		: normalizeSubCategory(mainCategory, pathParts[1] ?? parentFolder);
	let techStack = toStringArray(metadata.skills, ['Markdown']);

	if (!Array.isArray(metadata.skills)) {
		const techStackMatch = title.match(/\[(.*?)\]/);
		if (techStackMatch) {
			techStack = [techStackMatch[1]];
		}
	}

	const summary = {
		id,
		title,
		description: toStringValue(metadata.description, `Post about ${title}`),
		mainCategory,
		subCategory,
		date: toStringValue(metadata.date, '2024-01-01'),
		views: 0,
		tags: toStringArray(metadata.hashtags, [parentFolder.toLowerCase()]),
		techStack,
		folderCategory: parentFolder,
		...(metadata.category ? { category: toStringValue(metadata.category) } : {}),
		...(metadata.problem_url ? { problem_url: toUrlValue(metadata.problem_url) } : {})
	};

	return {
		sourcePath: `/src/lib/posts/${relativePath}`,
		summary,
		content: contentBody
	};
}

function renderTsValue(value) {
	return JSON.stringify(value, null, 2);
}

async function main() {
	const [postFiles, directoryCategoryPairs] = await Promise.all([
		walkFiles(POSTS_ROOT, '.md'),
		getDirectoryCategoryPairs()
	]);

	const posts = [];
	for (const filePath of postFiles) {
		const post = parsePost(filePath, await readFile(filePath, 'utf8'));
		if (post) {
			posts.push(post);
		}
	}

	posts.sort((a, b) => comparePosts(a.summary, b.summary));

	const postSummaries = posts.map(({ sourcePath, summary }) => ({ ...summary, sourcePath }));
	const postContentBySourcePath = Object.fromEntries(
		posts.map(({ sourcePath, content }) => [sourcePath, content])
	);

	await mkdir(OUT_ROOT, { recursive: true });

	await writeFile(
		join(OUT_ROOT, 'content-manifest.ts'),
		`import type { PostSummary } from '$lib/data';\n\n` +
			`export type IndexedPostSummary = PostSummary & { sourcePath: string };\n` +
			`export const postSummaries = ${renderTsValue(postSummaries)} satisfies IndexedPostSummary[];\n\n` +
			`export const directoryCategoryPairs = ${renderTsValue(directoryCategoryPairs)} satisfies Array<{ mainCategory: string; subCategory: string }>;\n`,
		'utf8'
	);

	await writeFile(
		join(OUT_ROOT, 'content-bodies.ts'),
		`export const postContentBySourcePath: Record<string, string> = ${renderTsValue(postContentBySourcePath)};\n`,
		'utf8'
	);

	console.log(`Generated content manifest: ${postSummaries.length} posts.`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
