<script lang="ts">
    import { cn } from "$lib/utils";

    let { tag, class: className = "" } = $props<{
        tag: string;
        class?: string;
    }>();
</script>

<span 
    class={cn(
        "inline-flex items-center text-sm font-normal text-blog-body",
        className
    )}
>
    #{tag}
</span>
