<script lang="ts">
  import type { Chapter } from '../lib/content/types';
  import type { LoadedChapter } from '../lib/content/load';
  import type { Progress } from '../lib/progress/model';
  import { totalStars } from '../lib/progress/model';
  import { challengeNumber, isChapterUnlocked, isPhaseUnlocked, nextPhaseId } from '../lib/progress/unlock';
  import Stars from '../ui/Stars.svelte';
  import Button from '../ui/Button.svelte';
  import Icon from '../ui/Icon.svelte';

  let {
    loaded, chapters, progress, onOpenPhase, onHome, onCertificate,
  }: {
    loaded: LoadedChapter[];
    chapters: Chapter[];
    progress: Progress;
    onOpenPhase: (id: string) => void;
    onHome: () => void;
    onCertificate: () => void;
  } = $props();

  const next = $derived(nextPhaseId(chapters, progress));
  const stars = $derived(totalStars(progress));
  const maxStars = $derived(chapters.reduce((n, c) => n + c.phases.length * 3, 0));

  function chapterDone(chapter: Chapter): number {
    return chapter.phases.filter((p) => p.id in progress.phases).length;
  }
</script>

<section class="page">
  <header class="top">
    <button class="back kicker" onclick={onHome}>← Início</button>
    <span class="kicker">★ {stars} / {maxStars}</span>
  </header>

  <h1>Sua jornada</h1>
  <p class="lead">Seis capítulos, do básico ao trabalho.</p>

  <ol class="chapters">
    {#each loaded as item, i (item.id)}
      {@const chapter = item.chapter}
      {#if chapter}
        {@const unlocked = isChapterUnlocked(chapters, progress, chapter.id)}
        <li class="chapter card" class:locked={!unlocked}>
          <div class="head">
            <span class="num sans" class:done={chapterDone(chapter) === chapter.phases.length} aria-hidden="true"><Icon name={chapter.icon} size={24} /></span>
            <span class="visually-hidden">Capítulo {i + 1}</span>
            <div>
              <h2>{chapter.title}</h2>
              <span class="kicker">{chapterDone(chapter)} de {chapter.phases.length} fases</span>
            </div>
          </div>
          {#if unlocked}
            <ol class="phases">
              {#each chapter.phases as phase, j (phase.id)}
                {@const result = progress.phases[phase.id]}
                {@const open = isPhaseUnlocked(chapters, progress, phase.id)}
                {@const title = phase.type === 'explanation' ? phase.title : `Desafio ${challengeNumber(chapter, j)}`}
                <li>
                  <button
                    class="phase"
                    class:current={phase.id === next}
                    disabled={!open}
                    onclick={() => onOpenPhase(phase.id)}
                    aria-label={`${title}. Fase ${j + 1}${result ? `, ${result.stars} estrelas` : open ? ', disponível' : ', bloqueada'}`}
                  >
                    <span class="dot" class:filled={!!result} aria-hidden="true">{j + 1}</span>
                    <span class="ptitle">{title}</span>
                    {#if result}<Stars value={result.stars} />{/if}
                  </button>
                </li>
              {/each}
            </ol>
          {/if}
        </li>
      {:else}
        <li class="chapter card locked">
          <div class="head">
            <span class="num sans">{i + 1}</span>
            <div>
              <h2>Capítulo indisponível</h2>
              <span class="kicker">Este conteúdo não pôde ser carregado.</span>
            </div>
          </div>
        </li>
      {/if}
    {/each}
  </ol>

  <div class="cta">
    {#if next}
      <Button variant="accent" onclick={() => onOpenPhase(next)}>Continuar</Button>
    {:else}
      <Button variant="accent" onclick={onCertificate}>Ver certificado</Button>
    {/if}
  </div>
</section>

<style>
  .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
  .back { background: none; border: 0; padding: var(--space-2) 0; min-height: var(--touch); color: var(--ink-soft); }
  .lead { color: var(--ink-soft); }
  .chapters { list-style: none; padding: 0; margin: var(--space-4) 0 0; display: flex; flex-direction: column; gap: var(--space-3); padding-bottom: calc(var(--touch) + var(--space-5)); }
  .chapter.locked { opacity: 0.55; }
  .head { display: flex; gap: var(--space-3); align-items: center; }
  .head h2 { font-size: 1.4rem; margin: 0 0 2px; }
  .num { width: 44px; height: 44px; color: var(--ink); border-radius: 50%; display: grid; place-items: center; border: 1px solid var(--line); font-size: 0.9rem; flex: none; }
  .num.done { background: var(--ink); color: var(--on-dark); border-color: var(--ink); }
  .phases { list-style: none; padding: 0; margin: var(--space-3) 0 0; display: flex; flex-direction: column; gap: var(--space-1); }
  .phase { display: flex; align-items: center; gap: var(--space-3); width: 100%; min-height: var(--touch); background: none; border: 0; border-radius: var(--radius); padding: var(--space-2); text-align: left; color: var(--ink); }
  .phase:disabled { color: var(--ink-soft); cursor: default; opacity: 0.6; }
  .phase.current { background: var(--accent-soft); }
  .dot { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; font-family: var(--font-sans); font-size: 0.75rem; flex: none; }
  .dot.filled { background: var(--ink); border-color: var(--ink); color: var(--on-dark); }
  .phase.current .dot { animation: pulse 2s infinite; }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 var(--line); }
    50% { box-shadow: 0 0 0 6px var(--line); }
  }
  .ptitle { flex: 1; }
  .cta { position: sticky; bottom: var(--space-4); margin-top: var(--space-5); }
</style>
