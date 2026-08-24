<script lang="ts">
  let {
    size = undefined,
    color = '#000000',
    strokeWidth = 2,
    background = 'transparent',
    opacity = 1,
    rotation = 0,
    shadow = 0,
    flipHorizontal = false,
    flipVertical = false,
    padding = 0
  } = $props();

  let transforms = $derived([
    rotation !== 0 ? `rotate(${rotation}deg)` : '',
    flipHorizontal ? 'scaleX(-1)' : '',
    flipVertical ? 'scaleY(-1)' : ''
  ].filter(Boolean).join(' '));

  let viewBoxSize = $derived(24 + (padding * 2));
  let viewBoxOffset = $derived(-padding);
  let viewBox = $derived(`${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`);
  let bgColor = $derived(background !== 'transparent' ? background : undefined);
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox={viewBox}
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  style="opacity: {opacity}; transform: {transforms}; {shadow > 0 ? `filter: drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : ''}; {bgColor ? `background-color: ${bgColor}` : ''}"
>
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={strokeWidth} d="M12 8a2 2 0 0 1 2 2v4a2 2 0 1 1-4 0v-4a2 2 0 0 1 2-2m5 0v8h4m-8-1l1 1M3 15a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1"/>
</svg>
