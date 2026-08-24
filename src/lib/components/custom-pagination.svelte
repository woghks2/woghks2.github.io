<script lang="ts">
	import * as Pagination from "$lib/components/ui/pagination";

	let { 
        count, 
        perPage, 
        page = $bindable(1),
        class: className 
    } = $props<{
        count: number;
        perPage: number;
        page: number;
        class?: string;
    }>();
</script>

{#if count > perPage}
    <div class="mt-4 flex justify-center {className}">
        <Pagination.Root {count} {perPage} bind:page>
            {#snippet children({ pages, currentPage })}
                <Pagination.Content>
                    <Pagination.Item>
                        <Pagination.PrevButton />
                    </Pagination.Item>
                    {#each pages as p (p.key)}
                        {#if p.type === "page"}
                            <Pagination.Item>
                                <Pagination.Link 
                                    page={p} 
                                    isActive={currentPage === p.value}
                                >
                                    {p.value}
                                </Pagination.Link>
                            </Pagination.Item>
                        {:else}
                            <Pagination.Item>
                                <Pagination.Ellipsis />
                            </Pagination.Item>
                        {/if}
                    {/each}
                    <Pagination.Item>
                        <Pagination.NextButton />
                    </Pagination.Item>
                </Pagination.Content>
            {/snippet}
        </Pagination.Root>
    </div>
{/if}
