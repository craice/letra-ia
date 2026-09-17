<script lang="ts">
  import Mascot from '../ui/Mascot.svelte';

  let { onHome }: { onHome: () => void } = $props();
</script>

<section class="page about">
  <header class="top">
    <button class="back kicker" onclick={onHome}>← Início</button>
  </header>

  <div class="hero">
    <Mascot mood="happy" size={72} />
    <div>
      <div class="brand">letra-ia</div>
      <h1>Sobre o jogo</h1>
    </div>
  </div>

  <p class="lead">
    O letra-ia é um jogo aberto e gratuito de letramento em IA. Ele existe para que qualquer pessoa,
    de qualquer área, entenda como as IAs de conversa funcionam e use essas ferramentas com confiança.
  </p>

  <div class="card">
    <h2>Quem fez</h2>
    <p>
      Feito por <strong>Rafael Craice</strong>.
      <a href="https://craice.me" rel="noopener">craice.me</a>
    </p>
    <p>
      O projeto foi construído com o <a href="https://claude.com/claude-code" rel="noopener">Claude Code</a>,
      da concepção ao código, ao conteúdo e à revisão.
    </p>
  </div>

  <div class="card">
    <h2>Do que ele é feito</h2>
    <dl>
      <div><dt>Código</dt><dd>Svelte 5, Vite, TypeScript e Vitest. Site estático no GitHub Pages.</dd></div>
      <div><dt>Fontes</dt><dd>Cormorant Garamond nos títulos e Inter no texto, via Google Fonts (licença SIL Open Font).</dd></div>
      <div><dt>Ícones</dt><dd><a href="https://pixelarticons.com" rel="noopener">Pixelarticons</a>, de Gerrit Halfmann (licença MIT).</dd></div>
      <div><dt>Visual</dt><dd>Tokens do <a href="https://www.designmd.co/d/claude" rel="noopener">DESIGN.md</a> publicado pelo DesignMD.</dd></div>
      <div><dt>Mascote</dt><dd>A Letra, um "a" em pixel-art desenhado para o jogo.</dd></div>
    </dl>
  </div>

  <div class="card">
    <h2>Aberto de verdade</h2>
    <p>
      O código está sob licença MIT e o conteúdo sob CC BY-SA 4.0. Você pode usar, adaptar e ensinar
      com ele. Correções e novas fases são bem-vindas no
      <a href="https://github.com/craice/letra-ia" rel="noopener">GitHub</a>.
    </p>
    <p class="fine">
      Projeto independente, sem ligação com Anthropic, OpenAI, Google ou qualquer empresa de IA.
    </p>
  </div>
</section>

<style>
  .top { margin-bottom: var(--space-3); }
  .back { background: none; border: 0; padding: var(--space-2) 0; min-height: var(--touch); color: var(--ink-soft); }
  .hero { display: flex; gap: var(--space-4); align-items: center; margin-bottom: var(--space-4); }
  .hero h1 { margin: 0; }
  .brand { font-family: var(--font-sans); font-weight: 600; color: var(--ink); letter-spacing: 0; }
  .lead { font-size: 1.1rem; margin-bottom: var(--space-5); }
  .card { margin-bottom: var(--space-4); }
  .card h2 { font-size: 1.6rem; }
  .card p:last-child { margin-bottom: 0; }
  dl { margin: 0; display: flex; flex-direction: column; gap: var(--space-3); }
  dt { font-family: var(--font-sans); font-size: 0.75rem; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-soft); }
  dd { margin: 2px 0 0; }
  .fine { font-size: 0.9rem; color: var(--ink-soft); }
  a { color: var(--ink); text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 3px; }
</style>
