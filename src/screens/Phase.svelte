<script lang="ts">
  import type { Chapter } from '../lib/content/types';
  import { findPhase } from '../lib/progress/unlock';
  import Explanation from '../phases/Explanation.svelte';
  import ChoosePrompt from '../phases/ChoosePrompt.svelte';
  import BuildPrompt from '../phases/BuildPrompt.svelte';
  import Button from '../ui/Button.svelte';

  let {
    chapters, phaseId, onComplete, onBack,
  }: {
    chapters: Chapter[];
    phaseId: string;
    onComplete: (phaseId: string, attempts: number) => void;
    onBack: () => void;
  } = $props();

  const found = $derived(findPhase(chapters, phaseId));
  const chapter = $derived(found ? chapters[found.chapterIndex]! : null);
  const progressPct = $derived(found && chapter ? ((found.phaseIndex + 1) / chapter.phases.length) * 100 : 0);

  function done(attempts: number): void {
    onComplete(phaseId, attempts);
  }
</script>

<section class="page">
  <header class="top">
    <button class="back kicker" onclick={onBack}>← Mapa</button>
    {#if found && chapter}
      <span class="kicker">Capítulo {found.chapterIndex + 1} · Fase {found.phaseIndex + 1} de {chapter.phases.length}</span>
    {/if}
  </header>

  {#if found && chapter}
    <div class="progress" role="progressbar" aria-valuenow={found.phaseIndex + 1} aria-valuemin="1" aria-valuemax={chapter.phases.length} aria-label="Progresso no capítulo">
      <span style:width="{progressPct}%"></span>
    </div>

    {#key phaseId}
      {#if found.phase.type === 'explanation'}
        <Explanation phase={found.phase} onComplete={done} />
      {:else if found.phase.type === 'choose-prompt'}
        <ChoosePrompt phase={found.phase} onComplete={done} />
      {:else if found.phase.type === 'build-prompt'}
        <BuildPrompt phase={found.phase} onComplete={done} />
      {:else}
        <div class="card">
          <h2>Ainda não sei mostrar esta fase</h2>
          <p>Este tipo de desafio não está disponível nesta versão do jogo.</p>
          <Button variant="ghost" onclick={onBack}>Voltar ao mapa</Button>
        </div>
      {/if}
    {/key}
  {:else}
    <div class="card">
      <h2>Fase não encontrada</h2>
      <p>Esse conteúdo pode ter sido movido ou removido.</p>
      <Button variant="ghost" onclick={onBack}>Voltar ao mapa</Button>
    </div>
  {/if}
</section>

<style>
  .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3); gap: var(--space-3); }
  .back { background: none; border: 0; padding: var(--space-2) 0; min-height: var(--touch); color: var(--ink-soft); }
  .progress { height: 3px; background: #e3e0d5; border-radius: 2px; margin-bottom: var(--space-5); overflow: hidden; }
  .progress span { display: block; height: 100%; background: var(--accent); transition: width 300ms ease; }
</style>
