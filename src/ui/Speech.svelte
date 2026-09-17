<script lang="ts">
  import type { Snippet } from 'svelte';
  import Mascot, { type Mood } from './Mascot.svelte';

  let { mood = 'neutral', size = 48, children }: { mood?: Mood; size?: number; children: Snippet } = $props();
</script>

<div class="speech">
  <Mascot {mood} {size} />
  <div class="bubble card">
    {@render children()}
  </div>
</div>

<style>
  .speech { display: flex; gap: var(--space-3); align-items: flex-start; }
  .bubble { flex: 1; color: var(--ink); border-color: transparent; padding: 14px var(--space-4); }
  .bubble :global(p:last-child) { margin-bottom: 0; }
</style>
