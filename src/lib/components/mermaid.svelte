<script lang="ts">
    import { onMount } from 'svelte';

	let { code = "", compact = false } = $props<{ code: string; compact?: boolean }>();
    let svg = $state("");
    let id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
    let isMounted = $state(false);
    let mermaidApi: typeof import('mermaid').default | null = null;
    let themeObserver: MutationObserver | null = null;

    function getCssVariable(name: string) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    async function renderDiagram() {
        if (!code || !isMounted) return;
        
        try {
            if (!mermaidApi) {
                const { default: mermaid } = await import('mermaid');
                mermaidApi = mermaid;
            }

            mermaidApi.initialize({
                startOnLoad: false,
                theme: 'base',
                securityLevel: 'loose',
                fontFamily: 'Pretendard, sans-serif',
                themeVariables: {
                    background: getCssVariable('--diagram-surface'),
                    mainBkg: getCssVariable('--diagram-node'),
                    secondBkg: getCssVariable('--diagram-node-alt'),
                    primaryColor: getCssVariable('--diagram-node'),
                    primaryTextColor: getCssVariable('--diagram-text'),
                    primaryBorderColor: getCssVariable('--diagram-accent'),
                    secondaryColor: getCssVariable('--diagram-node-alt'),
                    secondaryTextColor: getCssVariable('--diagram-text'),
                    secondaryBorderColor: getCssVariable('--diagram-border'),
                    tertiaryColor: getCssVariable('--diagram-label-bg'),
                    tertiaryTextColor: getCssVariable('--diagram-text'),
                    tertiaryBorderColor: getCssVariable('--diagram-border'),
                    lineColor: getCssVariable('--diagram-line'),
                    textColor: getCssVariable('--diagram-text'),
                    nodeTextColor: getCssVariable('--diagram-text'),
                    edgeLabelBackground: getCssVariable('--diagram-label-bg'),
                    noteBkgColor: getCssVariable('--diagram-label-bg'),
                    noteTextColor: getCssVariable('--diagram-text'),
                    noteBorderColor: getCssVariable('--diagram-border')
                }
            });
            
            const renderId = `${id}-${Date.now()}`;
            const { svg: renderedSvg } = await mermaidApi.render(renderId, code);
            svg = renderedSvg;
        } catch (e) {
            console.error("Mermaid error:", e);
            svg = `<div class="p-4 bg-destructive/10 text-destructive text-xs rounded border border-destructive/20 text-center">
                다이어그램 렌더링에 실패했습니다. 문법을 확인해 주세요.
            </div>`;
        }
    }

    onMount(() => {
        isMounted = true;
        void renderDiagram();

        themeObserver = new MutationObserver(() => {
            void renderDiagram();
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => {
            themeObserver?.disconnect();
        };
    });

    $effect(() => {
        if (code && isMounted) {
            void renderDiagram();
        }
    });
</script>

<div class:my-10={!compact} class="flex justify-center overflow-x-auto rounded-lg border border-content-panel-border bg-content-panel p-8">
    <div class="mermaid-container w-full flex justify-center">
        {@html svg}
    </div>
</div>

<style>
    :global(.mermaid-container svg) {
        max-width: 100%;
        height: auto;
    }

    :global(.dark .mermaid-container svg path[fill^='hsl(0, 0%, 81']) {
        fill: var(--diagram-node-alt) !important;
    }

    :global(.dark .mermaid-container svg path[fill^='hsl(0, 0%, 11']) {
        fill: var(--diagram-surface) !important;
    }

    :global(.dark .mermaid-container svg .entityLabel),
    :global(.dark .mermaid-container svg text) {
        fill: var(--foreground) !important;
        color: var(--foreground) !important;
    }
</style>
