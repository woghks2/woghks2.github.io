
import { marked } from 'marked';
import katex from 'katex';
import { createHighlighter } from 'shiki';
import type { CodeTab, RenderedContentBlock } from '$lib/data';

const languageAliases: Record<string, string> = {
    txt: 'plaintext',
    text: 'plaintext',
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    shell: 'bash'
};

type CodeHighlighter = Awaited<ReturnType<typeof createHighlighter>>;

let codeHighlighterPromise: Promise<CodeHighlighter> | null = null;
let activeCodeHighlighter: CodeHighlighter | null = null;

function getCodeHighlighter(): Promise<CodeHighlighter> {
    codeHighlighterPromise ??= createHighlighter({
        themes: ['light-plus', 'dark-plus'],
        langs: [
            'svelte',
            'typescript',
            'javascript',
            'python',
            'sql',
            'bash',
            'java',
            'css',
            'html',
            'json',
            'markdown',
            'plaintext'
        ]
    });

    return codeHighlighterPromise;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function highlightCode(text: string, lang?: string): string {
    const language = (lang || 'text').toLowerCase();
    const shikiLanguage = languageAliases[language] || language;
    const highlighter = activeCodeHighlighter;

    try {
        if (highlighter?.getLoadedLanguages().includes(shikiLanguage)) {
            const html = highlighter.codeToHtml(text, {
                lang: shikiLanguage,
                themes: {
                    light: 'light-plus',
                    dark: 'dark-plus'
                }
            });
            return html.match(/<code>([\s\S]*)<\/code>/)?.[1] ?? escapeHtml(text);
        }
    } catch (e) {
        console.warn(`Shiki highlighting failed for language: ${language}`, e);
    }

    return escapeHtml(text);
}

function getLineCount(code: string): number {
    const trimmedCode = code.trim();
    if (!trimmedCode) return 1;
    return trimmedCode.split(/\r\n|\r|\n/).length;
}

// Callout (Admonition) Renderer
const calloutIcons: Record<string, string> = {
    note: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    tip: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.148-.22-4.06.12-5.454A3 3 0 0 0 9.5 3a3 3 0 0 0-3 3c0 1.38.5 2 1 3 1.072 2.148.22 4.06-.12 5.454A3 3 0 0 0 8.5 14.5z"/><path d="M15.5 14.5A2.5 2.5 0 0 0 18 12c0-1.38-.5-2-1-3-1.072-2.148-.22-4.06.12-5.454A3 3 0 0 0 16.5 3a3 3 0 0 0-3 3c0 1.38.5 2 1 3 1.072 2.148.22 4.06-.12 5.454A3 3 0 0 0 15.5 14.5z"/><path d="M12 14.5v-3.5"/><path d="M12 14.5v6.5"/></svg>',
    question: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    danger: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
};

// Configure marked to use Shiki for highlighting
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
    const language = lang || 'text';
    const highlighted = highlightCode(text, language);
    
    const match = text.match(/\n(?!$)/g);
    const linesNum = match ? match.length + 1 : 1;
    let lines = '';
    for (let i = 0; i < linesNum; i++) {
        lines += '<span></span>';
    }
    
    return `
    <div class="relative group my-8">
        <pre class="language-${language} line-numbers !m-0 overflow-x-auto py-6 !pl-10 pr-4"><code class="language-${language}">${highlighted}</code><span aria-hidden="true" class="line-numbers-rows">${lines}</span></pre>
        <div class="absolute top-4 right-4 flex items-center gap-2">
            <span class="code-meta-badge">
                 ${language}
            </span>
            <button class="copy-code-button" 
                    data-code="${encodeURIComponent(text.trim())}" 
                    aria-label="Copy code">
                <svg class="copy-icon h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <svg class="check-icon hidden h-3.5 w-3.5 text-green-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
        </div>
    </div>
    `;
};

renderer.blockquote = (quote: unknown) => {
    let text = String(quote);
    let isToken = false;
    
    // Handle Marked v12+ Token object
    if (typeof quote === 'object' && quote !== null && 'text' in quote) {
        isToken = true;
        text = (quote as any).text;
    }

    // Regex to find [!type] Title syntax
    // Supports both <p>[!type]</p> (HTML input) and [!type] (Markdown text input)
    const regex = /^\s*(?:<p[^>]*>)?\s*\[!(\w+)\]\s*(.*?)(?:<\/p>)?/i;
    const match = text.match(regex);
    
    if (match) {
        const type = match[1].toLowerCase();
        let rawTitle = match[2];
        rawTitle = rawTitle.replace(/<\/p>$/, '');
        const title = rawTitle || type.charAt(0).toUpperCase() + type.slice(1);
        
        let body = text.replace(match[0], '').trim();
        
        // If we are dealing with a token (raw markdown), we must render the body to HTML
        if (isToken) {
             body = marked.parse(body) as string;
        }

        const typeMap: Record<string, string> = {
            'question': 'question', 'help': 'question', 'faq': 'question',
            'warning': 'warning', 'attention': 'warning', 'caution': 'warning',
            'danger': 'danger', 'error': 'danger', 'failure': 'danger',
            'note': 'note', 'abstract': 'note', 'summary': 'note', 'tldr': 'note',
            'tip': 'tip', 'hint': 'tip', 'important': 'tip',
            'info': 'info', 'todo': 'info'
        };
        
        const resolvedType = typeMap[type] || 'note';
        const icon = calloutIcons[resolvedType] || calloutIcons['note'];
        
        return `
            <div class="callout callout-${resolvedType} my-6 rounded-md border text-sm shadow-sm overflow-hidden">
                <div class="callout-title flex items-center gap-2 px-4 py-3 font-bold select-none border-b bg-muted/50">
                    <span class="callout-icon flex items-center justify-center w-4 h-4">${icon}</span>
                    <span>${title}</span>
                </div>
                ${body ? `<div class="callout-content p-4 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 text-muted-foreground/90 leading-relaxed">${body}</div>` : ''}
            </div>
        `;
    }
    
    // Fallback for standard blockquotes
    if (isToken) {
        return `<blockquote>${marked.parse(text)}</blockquote>`;
    }

    return `<blockquote>${text}</blockquote>`;
};

marked.setOptions({ renderer });

// Latex Extension for Marked
const latexExtension = {
    name: 'latex',
    level: 'inline', // Is this right? Block latex might need 'block' level
    start(src: string) {
        return src.match(/\$|\\\[|\\\(|\$\$/)?.index;
    },
    tokenizer(src: string, tokens: any) {
        // Block Latex: $$...$$ or \[...\]
        const blockRule = /^(\$\$|\\\[)([\s\S]+?)(\$\$|\\\])/;
        const blockMatch = blockRule.exec(src);
        if (blockMatch) {
            return {
                type: 'latex',
                raw: blockMatch[0],
                text: blockMatch[2].trim(),
                displayMode: true
            };
        }

        // Inline Latex: $...$ or \(...\)
        const inlineRule = /^(\$|\\\()([\s\S]+?)(\$|\\\))/;
        const inlineMatch = inlineRule.exec(src);
        if (inlineMatch) {
            return {
                type: 'latex',
                raw: inlineMatch[0],
                text: inlineMatch[2].trim(),
                displayMode: false
            };
        }
    },
    renderer(token: any) {
        try {
            return katex.renderToString(token.text, {
                displayMode: token.displayMode,
                throwOnError: false
            });
        } catch (err) {
            return token.text;
        }
    }
};

marked.use({ extensions: [latexExtension] });

export async function parseMarkdownBlocks(md: string): Promise<RenderedContentBlock[]> {
    if (!md) return [];
    activeCodeHighlighter = await getCodeHighlighter();
    const blocks: RenderedContentBlock[] = [];
    
    // Updated regex to handle CRLF and optional whitespace after the identifier
	const combinedRegex =
		/\[tabs:([^\]]+)\]([\s\S]*?)\[\/tabs\]|:::diagram-grid(?:\s+(stacked))?\s*\r?\n([\s\S]*?)\r?\n:::\s*|```mermaid\s*\r?\n([\s\S]*?)```/g;
    
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(md)) !== null) {
        if (match.index > lastIndex) {
            blocks.push({
                type: 'html',
                content: marked.parse(md.substring(lastIndex, match.index)) as string
            });
        }

		if (match[0].startsWith('[tabs:')) {
            const labels = match[1].split(',').map(s => s.trim());
            const innerContent = match[2];
            // Updated inner regex to handle CRLF as well
            const codeBlockRegex = /```(\w+)?\s*\r?\n([\s\S]*?)```/g;
            const tabs: CodeTab[] = [];
            let codeMatch;
            let i = 0;
            while ((codeMatch = codeBlockRegex.exec(innerContent)) !== null && i < labels.length) {
                const lang = codeMatch[1] || 'text';
                const code = codeMatch[2];
                tabs.push({
                    label: labels[i],
                    lang,
                    code,
                    highlightedCode: highlightCode(code.trim(), lang),
                    lineCount: getLineCount(code)
                });
                i++;
			}
			blocks.push({ type: 'tabs', tabs });
		} else if (match[4] !== undefined) {
			const diagrams = Array.from(
				match[4].matchAll(/(?:^|\r?\n)#{3,6}\s+(.+?)\s*\r?\n+```mermaid\s*\r?\n([\s\S]*?)```/g)
			).map((diagram) => ({
				title: diagram[1].trim(),
				code: diagram[2]
			}));

			if (diagrams.length > 0) {
				blocks.push({ type: 'mermaid-grid', diagrams, stacked: match[3] === 'stacked' });
			}
		} else {
			const mermaidCode = match[5];
			blocks.push({ type: 'mermaid', code: mermaidCode });
        }

        lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < md.length) {
        blocks.push({
            type: 'html',
            content: marked.parse(md.substring(lastIndex)) as string
        });
    }

    return blocks;
}
