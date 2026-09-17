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
    min-height: 48px;
    padding: 0 var(--space-5);
    border-radius: var(--radius-btn);
    border: 1px solid transparent;
    width: 100%;
    transition: background-color 120ms ease, opacity 120ms ease;
  }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .primary { background: var(--ink); color: var(--on-dark); }
  /* The signature coral CTA. White on #cc785c is 3.27:1, so the label is set as
     WCAG "large text" (>= 18.66px bold), whose AA threshold is 3:1. */
  .accent { background: var(--accent); color: #fff; font-size: 1.1875rem; font-weight: 700; }
  .accent:active:not(:disabled) { background: var(--accent-strong); }
  .ghost { background: var(--paper); color: var(--ink); border-color: var(--line); }
</style>
