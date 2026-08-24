<script lang="ts">
    import { fade } from 'svelte/transition';
    import * as Table from "$lib/components/ui/table";
    import CustomPagination from "$lib/components/custom-pagination.svelte";
    import { getPostPath } from "$lib/category-meta";
    import DateDisplay from "./date-display.svelte";
    import type { PostSummary } from '$lib/data';

    let { 
        currentPostId, 
        categoryPosts, 
        categoryName,
        perPage = 5 
    } = $props<{
        currentPostId: string;
        categoryPosts: PostSummary[];
        categoryName: string;
        perPage?: number;
    }>();

    // 초기 페이지 계산 로직은 상위에서 처리하여 currentPage만 바인딩으로 받거나,
    // 여기서 내부적으로 처리할 수 있습니다. 
    // 하지만 상위의 untrack 로직($effect)이 있으므로, 
    // 여기서는 단순히 props로 page를 제어하는 방식이 깔끔합니다.
    // 다만, 리팩토링 편의를 위해 내부 상태로 관리하되, 
    // id 변경 시 초기화 로직을 이 컴포넌트 내부 $effect로 옮기는 것이 좋습니다.

    let currentPage = $state(1);

    // currentPostId가 변경되면 페이지를 다시 계산
    $effect(() => {
        const currentIndex = categoryPosts.findIndex((p: PostSummary) => p.id === currentPostId);
        if (currentIndex !== -1) {
            currentPage = Math.floor(currentIndex / perPage) + 1;
        } else {
            currentPage = 1;
        }
    });

    const paginatedPosts = $derived.by(() => {
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;
        return categoryPosts.slice(start, end);
    });
</script>

{#if paginatedPosts.length > 0}
    <section class="mt-20 border-t border-blog-hairline-soft pt-10" in:fade={{ duration: 600 }}>
        <h2 class="mb-6 text-lg font-semibold text-blog-ink">'{categoryName}' 카테고리의 다른 글</h2>
        <div class="blog-card overflow-hidden" in:fade={{ duration: 600 }}>
            <Table.Table>
                <Table.TableHeader class="bg-blog-surface-soft">
                    <Table.TableRow class="hover:bg-transparent">
                        <Table.TableHead class="w-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-blog-muted">Title</Table.TableHead>
                        <Table.TableHead class="min-w-[120px] px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-blog-muted">Date</Table.TableHead>
                    </Table.TableRow>
                </Table.TableHeader>
                <Table.TableBody>
                    {#each paginatedPosts as relatedPost}
                        <Table.TableRow 
                            class="border-blog-hairline-soft transition-colors hover:bg-blog-surface-soft/70"
                        >
                            <Table.TableCell class="px-6 py-3">
                                <a 
                                    href={getPostPath(relatedPost)} 
                                    class="block text-sm font-medium transition-colors
                                        {relatedPost.id === currentPostId 
                                            ? 'text-blog-ink underline underline-offset-4 decoration-1 decoration-blog-ink/30' 
                                            : 'text-blog-body hover:text-blog-ink hover:underline hover:underline-offset-4'}"
                                >
                                    {relatedPost.title}
                                </a>
                            </Table.TableCell>
                            <Table.TableCell class="whitespace-nowrap px-6 py-3 text-right">
                                <DateDisplay date={relatedPost.date} />
                            </Table.TableCell>
                        </Table.TableRow>
                    {/each}
                </Table.TableBody>
            </Table.Table>
        </div>
        <CustomPagination 
            count={categoryPosts.length} 
            {perPage} 
            bind:page={currentPage} 
        />
    </section>
{/if}
