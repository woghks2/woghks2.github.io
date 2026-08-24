<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import type { PostSummary } from "$lib/data";
  import { getPostPath } from "$lib/category-meta";
  import TechStackBadge from "./tech-stack-badge.svelte";
  import HashtagBadge from "./hashtag-badge.svelte";
  import DateDisplay from "./date-display.svelte";

  let {
    data,
    numberById = {}
  } = $props<{
    data: PostSummary[];
    numberById?: Record<string, number>;
  }>();

  // problem-solving, development 관련 카테고리에서만 tech stack 표시
  const showTechStack = $derived(
    data.length > 0 &&
    (
      data[0].mainCategory === 'problem-solving' ||
      data[0].mainCategory === 'development' ||
      data[0].mainCategory === 'web' ||
      data[0].mainCategory === 'projects'
    )
  );

  function stripTitleNumber(title: string) {
    return title.replace(/^\s*\d+[.)]\s*/, '');
  }

  function getPostNumber(post: PostSummary, fallbackIndex: number) {
    return numberById[post.id] ?? fallbackIndex + 1;
  }
</script>

<div class="blog-card overflow-hidden">
  <div class="overflow-x-auto">
  <Table.Table class="min-w-[840px]">
    <Table.TableHeader class="bg-blog-surface-soft">
      <Table.TableRow class="hover:bg-transparent">
        <Table.TableHead class="w-[72px] py-3.5 pl-6 pr-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-blog-muted">No.</Table.TableHead>
        <Table.TableHead class="w-[320px] py-3.5 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-blog-muted">Title</Table.TableHead>
        <Table.TableHead class="hidden py-3.5 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-blog-muted md:table-cell">Description</Table.TableHead>
        {#if showTechStack}
          <Table.TableHead class="hidden w-[220px] py-3.5 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-blog-muted md:table-cell">Tech Stack</Table.TableHead>
        {/if}
        <Table.TableHead class="hidden w-[250px] py-3.5 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-blog-muted md:table-cell">Tags</Table.TableHead>
        <Table.TableHead class="w-[110px] py-3.5 pl-4 pr-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-blog-muted">Date</Table.TableHead>
      </Table.TableRow>
    </Table.TableHeader>
    <Table.TableBody>
      {#each data as post, index}
        <Table.TableRow class="group border-b border-blog-hairline-soft transition-colors last:border-0 hover:bg-blog-surface-soft/70">
          <Table.TableCell class="w-[72px] py-3 pl-6 pr-3">
            <span class="text-sm font-medium tabular-nums text-blog-muted">
              {getPostNumber(post, index)}
            </span>
          </Table.TableCell>

          <Table.TableCell class="max-w-[320px] py-3 px-4">
            <div class="min-w-0">
              <a href={getPostPath(post)} class="block min-w-0 truncate text-[15px] font-semibold tracking-normal text-blog-ink transition-colors group-hover:underline group-hover:underline-offset-4" title={stripTitleNumber(post.title)}>
                {stripTitleNumber(post.title)}
              </a>
            </div>
          </Table.TableCell>

          <Table.TableCell class="hidden max-w-[350px] py-3 px-4 md:table-cell">
            <p class="truncate text-[13px] leading-6 text-blog-muted">
              {post.description}
            </p>
          </Table.TableCell>

          {#if showTechStack}
            <Table.TableCell class="hidden max-w-[220px] py-3 px-4 md:table-cell">
              <div class="truncate">
                {#each post.techStack as tech}
                  <span class="inline-block mr-1.5 mb-1 last:mr-0">
                    <TechStackBadge lang={tech} />
                  </span>
                {/each}
              </div>
            </Table.TableCell>
          {/if}

          <Table.TableCell class="hidden max-w-[250px] py-3 px-4 md:table-cell">
            <div class="truncate">
              {#each post.tags as tag}
                <HashtagBadge {tag} class="mr-1.5" />
              {/each}
            </div>
          </Table.TableCell>

          <Table.TableCell class="py-3 pl-4 pr-6">
            <DateDisplay date={post.date} />
          </Table.TableCell>
        </Table.TableRow>
      {/each}
    </Table.TableBody>
  </Table.Table>
  </div>
</div>
