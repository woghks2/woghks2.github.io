<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import Python from './icons/python.svelte';
	import Svelte from './icons/svelte.svelte';
	import Java from './icons/java.svelte';
	import JavaScript from './icons/javascript.svelte';
	import TypeScript from './icons/typescript.svelte';
	import Sql from './icons/sql.svelte';
	import Html from './icons/html.svelte';
	import Css from './icons/css.svelte';
	import Pytorch from './icons/pytorch.svelte';
	import Pandas from './icons/pandas.svelte';
	import ReactIcon from './icons/react.svelte';
	import Nextjs from './icons/nextjs.svelte';
	import Airflow from './icons/airflow.svelte';
	import Opencv from './icons/opencv.svelte';
	import Mysql from './icons/mysql.svelte';
	import Postgresql from './icons/postgresql.svelte';
	import Docker from './icons/docker.svelte';
	import Spring from './icons/spring.svelte';
	import Fastapi from './icons/fastapi.svelte';
	import Redis from './icons/redis.svelte';
	import Kafka from './icons/kafka.svelte';
	import Amplitude from './icons/amplitude.svelte';
	import Tableau from './icons/tableau.svelte';

	let { lang, class: className = '' } = $props<{
		lang: string;
		class?: string;
	}>();

	const config = {
		python: { label: 'Python', icon: Python, color: '#3776AB', bg: 'rgba(55, 118, 171, 0.1)' },
		svelte: { label: 'Svelte', icon: Svelte, color: '#FF3E00', bg: 'rgba(255, 62, 0, 0.1)' },
		sveltekit: { label: 'Svelte', icon: Svelte, color: '#FF3E00', bg: 'rgba(255, 62, 0, 0.1)' },
		java: { label: 'Java', icon: Java, color: '#007396', bg: 'rgba(0, 115, 150, 0.1)' },
		javascript: { label: 'JavaScript', icon: JavaScript, color: '#F7DF1E', bg: 'rgba(247, 223, 30, 0.1)' },
		typescript: { label: 'TypeScript', icon: TypeScript, color: '#3178C6', bg: 'rgba(49, 120, 198, 0.1)' },
		sql: { label: 'SQL', icon: Sql, color: '#4479A1', bg: 'rgba(68, 121, 161, 0.1)' },
		html: { label: 'HTML', icon: Html, color: '#E34F26', bg: 'rgba(227, 79, 38, 0.1)' },
		css: { label: 'CSS', icon: Css, color: '#1572B6', bg: 'rgba(21, 114, 182, 0.1)' },
		pytorch: { label: 'PyTorch', icon: Pytorch, color: '#EE4C2C', bg: 'rgba(238, 76, 44, 0.1)' },
		pandas: { label: 'Pandas', icon: Pandas, color: '#130754', bg: 'rgba(19, 7, 84, 0.1)' },
		react: { label: 'React', icon: ReactIcon, color: '#61DAFB', bg: 'rgba(97, 218, 251, 0.1)' },
		nextjs: { label: 'Next.js', icon: Nextjs, color: '#4B5563', bg: 'rgba(75, 85, 99, 0.1)' },
		airflow: { label: 'Airflow', icon: Airflow, color: '#017CEE', bg: 'rgba(1, 124, 238, 0.1)' },
		opencv: { label: 'OpenCV', icon: Opencv, color: '#5C3EE8', bg: 'rgba(92, 62, 232, 0.1)' },
		mysql: { label: 'MySQL', icon: Mysql, color: '#4479A1', bg: 'rgba(68, 121, 161, 0.1)' },
		postgresql: { label: 'PostgreSQL', icon: Postgresql, color: '#336791', bg: 'rgba(51, 103, 145, 0.1)' },
		docker: { label: 'Docker', icon: Docker, color: '#2496ED', bg: 'rgba(36, 150, 237, 0.1)' },
		spring: { label: 'Spring', icon: Spring, color: '#6DB33F', bg: 'rgba(109, 179, 63, 0.1)' },
		springboot: { label: 'Spring Boot', icon: Spring, color: '#6DB33F', bg: 'rgba(109, 179, 63, 0.1)' },
		fastapi: { label: 'FastAPI', icon: Fastapi, color: '#009688', bg: 'rgba(0, 150, 136, 0.1)' },
		vectordb: { label: 'VectorDB', icon: null, color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' },
		llm: { label: 'LLM', icon: null, color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)' },
		redis: { label: 'Redis', icon: Redis, color: '#DC382D', bg: 'rgba(220, 56, 45, 0.1)' },
		kafka: { label: 'Kafka', icon: Kafka, color: '#374151', bg: 'rgba(55, 65, 81, 0.1)' },
		amplitude: { label: 'Amplitude', icon: Amplitude, color: '#0055FF', bg: 'rgba(0, 85, 255, 0.1)' },
		tableau: { label: 'Tableau', icon: Tableau, color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.1)' }
	} as const;

	const item = $derived(
		config[lang.toLowerCase() as keyof typeof config] || {
			label: lang,
			icon: null,
			color: 'currentColor',
			bg: 'transparent'
		}
	);
</script>


<Badge
	variant="outline"
	data-lang={lang.toLowerCase()}
	class={cn("badge-tech flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all", className)}
	style="--original-color: {item.color}; color: var(--badge-color); background-color: color-mix(in srgb, var(--active-color), var(--background) 90%); border: 1px solid color-mix(in srgb, var(--active-color), transparent 72%);"
>
	{#if item.icon}
		<item.icon size="14" color="var(--active-color)" />
	{/if}
	<span class="font-normal">{item.label}</span>
</Badge>

<style>
	:global(.badge-tech) {
		--active-color: var(--original-color);
		--badge-color: var(--active-color);
	}

	/* Javascript: Improve visibility in light mode */
	:global(.badge-tech[data-lang="javascript"]) {
		--badge-color: #e6c200; /* Pure deep yellow, not orange */
		border-color: #e6c200 !important;
	}

	/* Javascript: Restore to defaults in dark mode */
	:global(.dark) :global(.badge-tech[data-lang="javascript"]) {
		--badge-color: var(--active-color);
		border-color: color-mix(in srgb, var(--active-color), transparent 60%) !important;
	}

	/* Achromatic tags: Soften white in dark mode */
	:global(.dark) :global(.badge-tech[data-lang="nextjs"]),
	:global(.dark) :global(.badge-tech[data-lang="kafka"]),
	:global(.dark) :global(.badge-tech[data-lang="llm"]),
	:global(.dark) :global(.badge-tech[data-lang="vectordb"]) {
		--active-color: #9ca3af;; /* Gray 500 */
	}

	/* Redis: Lighter red in dark mode */
	:global(.dark) :global(.badge-tech[data-lang="redis"]) {
		--active-color: #ff4d4d;
	}

	/* Pandas: Visible Purple border & text in dark mode */
	:global(.dark) :global(.badge-tech[data-lang="pandas"]) {
		--active-color: #c084fc;
	}
</style>
