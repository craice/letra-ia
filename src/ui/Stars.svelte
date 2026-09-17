<script lang="ts">
  let { value, label }: { value: 0 | 1 | 2 | 3; label?: string } = $props();
  const text = $derived(label ?? `${value} de 3 estrelas`);
</script>

<span class="stars" role="img" aria-label={text}>
  {#each [1, 2, 3] as n (n)}
    <span class:on={n <= value} aria-hidden="true">★</span>
  {/each}
</span>

<style>
  .stars { letter-spacing: 2px; color: var(--line); font-size: 1.1rem; }
  .on { color: var(--accent); }
</style>
