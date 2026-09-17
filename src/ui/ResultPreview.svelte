<script lang="ts">
  let { text }: { text: string } = $props();
</script>

<div class="preview card">
  <div class="kicker">O que a IA responderia</div>
  <p>{text}</p>
</div>

<style>
  .preview { margin-top: var(--space-4); border-left: 3px solid var(--support); }
  .kicker { margin-bottom: var(--space-2); }
  p { margin: 0; white-space: pre-line; }
</style>
