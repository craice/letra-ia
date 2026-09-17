<script lang="ts">
  import Icon from './Icon.svelte';
  let { kind, messages }: { kind: 'success' | 'error' | null; messages: string[] } = $props();
</script>

<div class="feedback" class:success={kind === 'success'} class:error={kind === 'error'} aria-live="polite">
  {#if kind && messages.length > 0}
    <span class="icon"><Icon name={kind === 'success' ? 'check' : 'reload'} size={24} /></span>
    <div>
      {#each messages as m, i (i)}
        <p>{m}</p>
      {/each}
    </div>
  {/if}
</div>

<style>
  .feedback { min-height: 1.5rem; margin-top: var(--space-4); display: flex; gap: var(--space-3); border-radius: var(--radius); }
  .success, .error { padding: var(--space-3) var(--space-4); border: 1px solid; }
  .success { background: var(--success-soft); border-color: var(--success); }
  .error { background: var(--error-soft); border-color: var(--error); }
  .icon { flex: none; margin-top: 2px; }
  .success .icon { color: var(--success); }
  .error .icon { color: var(--error); }
  p:last-child { margin: 0; }
</style>
