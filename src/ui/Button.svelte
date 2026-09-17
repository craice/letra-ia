<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'primary',
    type = 'button',
    disabled = false,
    onclick,
    children,
  }: {
    variant?: 'primary' | 'accent' | 'ghost';
    type?: 'button' | 'submit';
    disabled?: boolean;
    onclick?: () => void;
    children: Snippet;
  } = $props();
</script>

<button class="btn {variant}" {type} {disabled} {onclick}>
  {@render children()}
</button>

<style>
  .btn {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 1rem;
    min-height: var(--touch);
    padding: 0 var(--space-5);
    border-radius: var(--radius-pill);
    border: 1px solid transparent;
    width: 100%;
    transition: transform 120ms ease, opacity 120ms ease;
  }
  .btn:active:not(:disabled) { transform: scale(0.98); }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .primary { background: var(--ink); color: var(--paper); }
  .accent { background: var(--accent-strong); color: #fff; }
  .ghost { background: transparent; color: var(--ink); border-color: var(--line); }
</style>
