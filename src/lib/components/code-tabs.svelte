<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import type { CodeTab } from "$lib/data";

    import { Copy, Check } from "@lucide/svelte";

    let { tabs = [] } = $props<{
        tabs: CodeTab[];
    }>();

    let activeTab = $state("");
    let isCopied = $state(false);

    $effect(() => {
        if (!activeTab && tabs.length > 0) {
            activeTab = tabs[0].label;
        }
    });

    async function copyToClipboard(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            isCopied = true;
            setTimeout(() => {
                isCopied = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    function getLineNumbers(tab: CodeTab) {
        return Array(tab.lineCount || 1).fill(0);
    }
</script>

<div class="my-8 overflow-hidden rounded-lg border border-content-panel-border bg-content-panel shadow-lg">
    <Tabs.Root bind:value={activeTab} class="w-full gap-0">
        <div class="flex items-center justify-between border-b border-content-panel-border bg-content-panel-header">
            <Tabs.List class="h-9 w-full justify-start gap-0 rounded-none border-0 bg-transparent p-0">
                {#each tabs as tab, i}
                    {#if i > 0}
                        <div class="h-4 w-[1px] self-center bg-content-panel-border"></div>
                    {/if}
                    <Tabs.Trigger 
                        value={tab.label}
                        class="h-full flex-1 min-w-0 rounded-none border-0 px-6 py-0 text-[12px] font-bold tracking-normal shadow-none transition-colors
                               bg-transparent text-content-panel-muted
                               hover:bg-content-panel-hover hover:text-content-panel-text
                               
                               data-[state=active]:bg-content-panel
                               data-[state=active]:text-content-panel-text
                               data-[state=active]:shadow-none
                               
                               relative z-10"
                    >
                        {tab.label}
                    </Tabs.Trigger>
                {/each}
            </Tabs.List>
        </div>

        {#each tabs as tab}
            <Tabs.Content value={tab.label} class="mt-0 bg-content-panel focus-visible:outline-none">
                <div class="relative group">
                    <pre class="line-numbers !m-0 !rounded-none !border-0 !bg-content-panel py-6 !pl-10 pr-4 text-[14px] leading-[1.4]"><code class="language-{tab.lang || 'text'}">{@html tab.highlightedCode}</code><span aria-hidden="true" class="line-numbers-rows">{#each getLineNumbers(tab) as _}<span></span>{/each}</span></pre>
                    
                    <div class="absolute top-4 right-4 flex items-center gap-2">
                        <span class="code-meta-badge">
                             {tab.lang}
                        </span>
                        <button 
                            onclick={() => copyToClipboard(tab.code.trim())}
                            class="copy-code-button"
                            aria-label="Copy code"
                        >
                            {#if isCopied}
                                <Check class="h-3.5 w-3.5 text-green-500" />
                            {:else}
                                <Copy class="h-3.5 w-3.5" />
                            {/if}
                        </button>
                    </div>
                </div>
            </Tabs.Content>
        {/each}
    </Tabs.Root>
</div>
