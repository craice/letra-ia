<script module lang="ts">
  export type Mood = 'neutral' | 'explaining' | 'happy' | 'hmm';
</script>

<script lang="ts">
  let { mood = 'neutral', size = 48 }: { mood?: Mood; size?: number } = $props();
</script>

<svg
  class="mascot {mood}"
  width={size}
  height={size}
  viewBox="0 0 40 40"
  role="img"
  aria-label="Guia"
>
  <circle cx="20" cy="21" r="16" fill="var(--card)" stroke="var(--ink)" stroke-width="1.5" />
  <!-- rays -->
  <path d="M20 4 v-3 M9 7 l-2 -2 M31 7 l2 -2" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" />
  <!-- eyes -->
  {#if mood === 'happy'}
    <path d="M12 17 q2.5 -3 5 0 M23 17 q2.5 -3 5 0" stroke="var(--ink)" stroke-width="1.5" fill="none" stroke-linecap="round" />
  {:else if mood === 'hmm'}
    <circle cx="14.5" cy="17" r="1.4" fill="var(--ink)" />
    <path d="M23 15.5 h5" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" />
  {:else}
    <circle cx="14.5" cy="17" r="1.4" fill="var(--ink)" />
    <circle cx="25.5" cy="17" r="1.4" fill="var(--ink)" />
  {/if}
  <!-- mouth -->
  {#if mood === 'happy'}
    <path d="M12 24 q8 8 16 0" stroke="var(--ink)" stroke-width="1.5" fill="none" stroke-linecap="round" />
  {:else if mood === 'hmm'}
    <path d="M14 26 q6 -3 12 0" stroke="var(--ink)" stroke-width="1.5" fill="none" stroke-linecap="round" />
  {:else if mood === 'explaining'}
    <ellipse cx="20" cy="25" rx="3" ry="2.2" stroke="var(--ink)" stroke-width="1.5" fill="none" />
  {:else}
    <path d="M13 24 q7 6 14 0" stroke="var(--ink)" stroke-width="1.5" fill="none" stroke-linecap="round" />
  {/if}
</svg>

<style>
  .mascot { flex: none; display: block; }
  .happy { animation: bounce 500ms ease; }
  @keyframes bounce {
    0% { transform: translateY(0); }
    40% { transform: translateY(-4px); }
    100% { transform: translateY(0); }
  }
</style>
