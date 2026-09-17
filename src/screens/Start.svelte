<script lang="ts">
  import Button from '../ui/Button.svelte';
  import Speech from '../ui/Speech.svelte';

  let {
    hasProgress, onStart, onReset, onAbout,
  }: { hasProgress: boolean; onStart: () => void; onReset: () => void; onAbout: () => void } = $props();

  function confirmReset(): void {
    if (window.confirm('Apagar todo o seu progresso e recomeçar do zero?')) onReset();
  }
</script>

<section class="page start">
  <div class="brand">letra-ia</div>
  <h1>Entenda a IA. Use com confiança.</h1>
  <p class="lead">
    Um jogo curto para quem nunca mexeu com Claude, ChatGPT ou Gemini e quer aprender a pedir bem,
    desconfiar na hora certa e usar no dia a dia e no trabalho.
  </p>

  <Speech mood="happy" size={72}>
    <p>Oi! Eu vou te acompanhar. São seis capítulos, com desafios rápidos. Sem pressa: dá para parar e voltar quando quiser.</p>
  </Speech>

  <div class="actions">
    <Button variant="accent" onclick={onStart}>{hasProgress ? 'Continuar' : 'Começar'}</Button>
    {#if hasProgress}
      <Button variant="ghost" onclick={confirmReset}>Recomeçar do zero</Button>
    {/if}
  </div>

  <footer>
    <p class="credit">
      Feito por <a href="https://craice.me" rel="noopener">Rafael Craice</a>
    </p>
    <p class="kicker links">
      <button class="linkish kicker" onclick={onAbout}>Sobre</button>
      <span aria-hidden="true">·</span>
      <a href="https://github.com/craice/letra-ia" rel="noopener">Código aberto</a>
    </p>
  </footer>
</section>

<style>
  .start { display: flex; flex-direction: column; gap: var(--space-5); min-height: 100dvh; }
  .lead { font-size: 1.1rem; color: var(--body); }
  .actions { display: flex; flex-direction: column; gap: var(--space-3); }
  footer { margin-top: auto; text-align: center; }
  footer a { color: inherit; }
  .brand { font-family: var(--font-sans); font-weight: 600; color: var(--ink); }
  .credit { margin: 0 0 var(--space-2); font-size: 0.95rem; }
  .links { display: flex; gap: var(--space-2); justify-content: center; align-items: center; margin: 0; }
  .links a, .linkish { display: inline-flex; align-items: center; min-height: var(--touch); padding: 0 var(--space-2); }
  .linkish { background: none; border: 0; text-decoration: underline; cursor: pointer; }
</style>
