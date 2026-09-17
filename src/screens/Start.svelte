<script lang="ts">
  import Button from '../ui/Button.svelte';
  import Speech from '../ui/Speech.svelte';

  let { hasProgress, onStart, onReset }: { hasProgress: boolean; onStart: () => void; onReset: () => void } = $props();

  function confirmReset(): void {
    if (window.confirm('Apagar todo o seu progresso e recomeçar do zero?')) onReset();
  }
</script>

<section class="page start">
  <div class="kicker">Letra IA</div>
  <h1>Entenda a IA. Use com confiança.</h1>
  <p class="lead">
    Um jogo curto para quem nunca mexeu com Claude, ChatGPT ou Gemini e quer aprender a pedir bem,
    desconfiar na hora certa e usar no dia a dia e no trabalho.
  </p>

  <Speech mood="explaining">
    <p>Oi! Eu vou te acompanhar. São seis capítulos, com desafios rápidos. Sem pressa: dá para parar e voltar quando quiser.</p>
  </Speech>

  <div class="actions">
    <Button variant="accent" onclick={onStart}>{hasProgress ? 'Continuar' : 'Começar'}</Button>
    {#if hasProgress}
      <Button variant="ghost" onclick={confirmReset}>Recomeçar do zero</Button>
    {/if}
  </div>

  <footer>
    <p class="kicker">
      Código aberto ·
      <a href="https://github.com/craice/letra-ia" rel="noopener">GitHub</a>
    </p>
  </footer>
</section>

<style>
  .start { display: flex; flex-direction: column; gap: var(--space-5); min-height: 100dvh; }
  .lead { font-size: 1.15rem; color: var(--ink-soft); font-style: italic; }
  .actions { display: flex; flex-direction: column; gap: var(--space-3); }
  footer { margin-top: auto; text-align: center; }
  footer a { color: inherit; }
</style>
