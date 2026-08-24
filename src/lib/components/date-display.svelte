<script lang="ts">
  import { CalendarDays } from "@lucide/svelte";

  let { date } = $props<{ date: string }>();
</script>

<div class="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold text-blog-muted">
  <CalendarDays class="h-3.5 w-3.5 opacity-60" />
  <span>{date}</span>
</div>
