<script lang="ts">
  import type { Chapter } from '../lib/content/types';
  import type { Progress } from '../lib/progress/model';
  import Button from '../ui/Button.svelte';
  import Icon from '../ui/Icon.svelte';
  import Speech from '../ui/Speech.svelte';

  let {
    chapter, chapterIndex, total, progress, nextPhase, onContinue, onMap,
  }: {
    chapter: Chapter;
    chapterIndex: number;
    total: number;
    progress: Progress;
    nextPhase: string | null;
    onContinue: (phaseId: string) => void;
    onMap: () => void;
  } = $props();

  const stars = $derived(
    chapter.phases.reduce((sum, p) => sum + (progress.phases[p.id]?.stars ?? 0), 0),
  );
  const maxStars = $derived(chapter.phases.length * 3);
</script>

<section class="page end">
  <div class="card done">
    <span class="mark" aria-hidden="true"><Icon name={chapter.icon} size={32} /></span>
    <span class="kicker">Capítulo {chapterIndex + 1} de {total}</span>
    <h1>{chapter.title}</h1>
    <p class="meta sans">★ {stars} de {maxStars} estrelas neste capítulo</p>
  </div>

  <Speech mood="happy">
    <p>Capítulo fechado. Quando quiser, seguimos para o próximo.</p>
  </Speech>

  <div class="actions">
    {#if nextPhase}
      <Button variant="accent" onclick={() => onContinue(nextPhase)}>Próximo capítulo</Button>
    {/if}
    <Button variant="ghost" onclick={onMap}>Ver o mapa</Button>
  </div>
</section>

<style>
  .end { display: flex; flex-direction: column; gap: var(--space-5); }
  .done { text-align: center; padding: var(--space-6) var(--space-4); display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
  .mark { width: 64px; height: 64px; border-radius: 50%; background: var(--ink); color: var(--on-dark); display: grid; place-items: center; margin-bottom: var(--space-2); }
  .done h1 { margin: 0; }
  .meta { color: var(--ink-soft); font-size: 0.9rem; margin: 0; }
  .actions { display: flex; flex-direction: column; gap: var(--space-3); }
</style>
