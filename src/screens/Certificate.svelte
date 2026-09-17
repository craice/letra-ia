<script lang="ts">
  import { untrack } from 'svelte';
  import type { Chapter } from '../lib/content/types';
  import { totalStars, type Progress } from '../lib/progress/model';
  import Button from '../ui/Button.svelte';
  import Mascot from '../ui/Mascot.svelte';

  let {
    chapters, progress, onSetName, onHome, onMap,
  }: {
    chapters: Chapter[];
    progress: Progress;
    onSetName: (name: string) => void;
    onHome: () => void;
    onMap: () => void;
  } = $props();

  let name = $state(untrack(() => progress.playerName ?? ''));
  const stars = $derived(totalStars(progress));
  const maxStars = $derived(chapters.reduce((n, c) => n + c.phases.length * 3, 0));
  const date = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  function saveName(): void {
    onSetName(name);
  }

  async function share(): Promise<void> {
    try {
      await navigator.share({
        title: 'letra-ia',
        text: `Concluí a jornada do letra-ia com ${stars} de ${maxStars} estrelas. Um jogo aberto para entender e usar bem a IA.`,
        url: window.location.href,
      });
    } catch {
      // user cancelled or share failed: nothing to do
    }
  }
</script>

<section class="page">
  <header class="top no-print">
    <button class="back kicker" onclick={onHome}>← Início</button>
  </header>

  <div class="card cert">
    <div class="kicker">Certificado</div>
    <Mascot mood="happy" size={64} />
    <h1>Jornada concluída</h1>
    <p class="lead">
      {#if progress.playerName}<strong>{progress.playerName}</strong>{:else}Você{/if}
      completou os {chapters.length} capítulos do letra-ia e sabe pedir bem, desconfiar na hora certa e usar a IA no dia a dia e no trabalho.
    </p>
    <p class="meta sans">★ {stars} de {maxStars} estrelas · {date}</p>

    <label class="name no-print">
      <span class="kicker">Seu nome no certificado</span>
      <input class="sans" type="text" bind:value={name} onblur={saveName} placeholder="Como quer aparecer?" maxlength="60" />
    </label>
  </div>

  <div class="actions no-print">
    <Button variant="primary" onclick={() => window.print()}>Imprimir ou salvar em PDF</Button>
    {#if canShare}
      <Button variant="ghost" onclick={share}>Compartilhar</Button>
    {/if}
    <Button variant="ghost" onclick={onMap}>Ver o mapa</Button>
  </div>
</section>

<style>
  .top { margin-bottom: var(--space-3); }
  .back { background: none; border: 0; padding: var(--space-2) 0; min-height: var(--touch); color: var(--ink-soft); }
  .cert { text-align: center; padding: var(--space-6) var(--space-4); display: flex; flex-direction: column; align-items: center; gap: var(--space-3); }
  .lead { font-size: 1.15rem; max-width: 34ch; }
  .meta { color: var(--ink-soft); font-size: 0.9rem; }
  .name { display: flex; flex-direction: column; gap: var(--space-2); width: 100%; max-width: 320px; text-align: left; margin-top: var(--space-3); }
  input { min-height: var(--touch); padding: 0 var(--space-3); border: 1px solid var(--line); border-radius: var(--radius-btn); background: var(--paper); font-size: 1rem; }
  .actions { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-5); }
</style>
