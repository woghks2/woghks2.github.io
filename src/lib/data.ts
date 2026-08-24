export type PostSummary = {
	id: string;
	title: string;
	description: string;
	mainCategory: string;
	subCategory: string;
	date: string;
	views: number;
	tags: string[];
	techStack: string[];
	folderCategory?: string;
	category?: string;
	problem_url?: string;
};

export type Post = PostSummary & {
	content: string;
};

export type CodeTab = {
	label: string;
	lang: string;
	code: string;
	highlightedCode: string;
	lineCount: number;
};

export type RenderedContentBlock =
	| {
			type: 'html';
			content: string;
	  }
	| {
			type: 'tabs';
			tabs: CodeTab[];
	  }
	| {
			type: 'mermaid';
			code: string;
	  }
	| {
			type: 'mermaid-grid';
				diagrams: Array<{
					title: string;
					code: string;
				}>;
			stacked: boolean;
	  };

export type SidebarSubCategory = {
	slug: string;
	title: string;
	url: string;
	postCount: number;
};

export type SidebarCategory = {
	slug: string;
	title: string;
	items: SidebarSubCategory[];
	url?: string;
};
