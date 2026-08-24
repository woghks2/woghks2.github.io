<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';

    let scrollProgress = $state(0);
    let isPostPage = $derived(page.url.pathname.startsWith('/posts/'));

    function updateScrollProgress() {
        const winScroll = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        
        if (height <= 0) {
            scrollProgress = 0;
        } else {
            scrollProgress = Math.min((winScroll / height) * 100, 100);
        }
    }

    onMount(() => {
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        // Initial check and a small delay for content rendering
        setTimeout(updateScrollProgress, 100);
        
        return () => window.removeEventListener('scroll', updateScrollProgress);
    });
</script>

{#if isPostPage}
    <div class="absolute bottom-[-1px] left-0 right-0 h-[3px] pointer-events-none appearance-none z-[100]">
        <div 
            class="h-full bg-orange-500 transition-all duration-75 ease-out shadow-[0_0_15px_rgba(249,115,22,0.8)]"
            style="width: {scrollProgress}%; border-radius: 0 4px 4px 0;"
        ></div>
    </div>
{/if}

<style>
    /* In case top-16 doesn't match the header height exactly, 
       we ensure it's positioned right at the bottom of the border */
</style>
