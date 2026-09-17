<script lang="ts">
  import { ICONS } from '../lib/icons/registry';

  let { name, size = 24 }: { name: string; size?: number } = $props();
  // Unknown names render an empty box of the same size, so layout never jumps.
  const paths = $derived(ICONS[name] ?? []);
</script>

<svg
  class="icon"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="currentColor"
  shape-rendering="crispEdges"
  aria-hidden="true"
  focusable="false"
>
  {#each paths as d, i (i)}
    <path {d} />
  {/each}
</svg>

<style>
  .icon { display: block; flex: none; }
</style>
