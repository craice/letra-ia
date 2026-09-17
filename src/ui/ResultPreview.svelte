<script lang="ts">
  let { text }: { text: string } = $props();
</script>

<div class="preview">
  <div class="kicker">O que a IA responderia</div>
  <p>{text}</p>
</div>

<style>
  /* Dark product-mockup card: the cream-to-dark rhythm marks "this is the machine talking". */
  .preview { margin-top: var(--space-4); background: var(--surface-dark); color: var(--on-dark); border-radius: var(--radius); padding: 20px; }
  .kicker { margin-bottom: var(--space-2); color: var(--on-dark-soft); font-family: var(--font-mono); letter-spacing: 0.5px; }
  p { margin: 0; white-space: pre-line; }
</style>
