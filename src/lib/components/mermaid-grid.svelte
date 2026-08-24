<script lang="ts">
    import Mermaid from '$lib/components/mermaid.svelte';

    let { diagrams, stacked = false } = $props<{
        diagrams: Array<{
            title: string;
            code: string;
        }>;
        stacked?: boolean;
    }>();
</script>

<div class={`my-10 grid gap-6 ${stacked ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
    {#each diagrams as diagram}
        <section class="min-w-0">
            <h4 class="mb-3 text-lg font-semibold text-blog-ink">{diagram.title}</h4>
            <Mermaid code={diagram.code} compact />
        </section>
    {/each}
</div>
