<script lang="ts">
  import type { Snippet } from 'svelte';
  import Mascot, { type Mood } from './Mascot.svelte';

  let { mood = 'neutral', children }: { mood?: Mood; children: Snippet } = $props();
</script>

<div class="speech">
  <Mascot {mood} />
  <div class="bubble card">
    {@render children()}
  </div>
</div>

<style>
  .speech { display: flex; gap: var(--space-3); align-items: flex-start; }
  .bubble { flex: 1; font-size: 1.1rem; padding: var(--space-3) var(--space-4); }
  .bubble :global(p:last-child) { margin-bottom: 0; }
</style>
