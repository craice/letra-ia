<script lang="ts">
  import Start from './screens/Start.svelte';
  import About from './screens/About.svelte';
  import { track, trackScreen } from './lib/analytics';
  import Map from './screens/Map.svelte';
  import Phase from './screens/Phase.svelte';
    import Certificate from './screens/Certificate.svelte';
  import ChapterEnd from './screens/ChapterEnd.svelte';
  import { loadChapters, validChapters } from './lib/content/load';
  import { progressStore } from './lib/progress';
  import { findPhase, isAllComplete, nextInChapter, nextPhaseId } from './lib/progress/unlock';

  type Screen =
    | { name: 'start' }
    | { name: 'map' }
      | { name: 'phase'; phaseId: string }
    | { name: 'chapter-end'; chapterId: string }
    | { name: 'certificate' }
    | { name: 'about' };

  const loaded = loadChapters();
  const chapters = validChapters(loaded);

  let screen = $state<Screen>({ name: 'start' });
  let mainEl: HTMLElement | undefined;

  $effect(() => {
    trackScreen(screen.name, screen.name === 'phase' ? { phase_id: screen.phaseId } : {});
    mainEl?.focus({ preventScroll: false });
  });

  const endChapter = $derived.by(() => {
    const current = screen;
    if (current.name !== 'chapter-end') return null;
    const index = chapters.findIndex((c) => c.id === current.chapterId);
    return index < 0 ? null : { index, chapter: chapters[index]! };
  });

  const hasProgress = $derived(Object.keys(progressStore.progress.phases).length > 0);

  function goToMap(): void {
    screen = { name: 'map' };
  }

  function start(): void {
    if (isAllComplete(chapters, progressStore.progress)) {
      screen = { name: 'certificate' };
      return;
    }
    // First visit lands on the map so the journey is visible once; after that,
    // "Continuar" resumes the pending phase without a detour.
    const next = hasProgress ? nextPhaseId(chapters, progressStore.progress) : null;
    if (next) openPhase(next);
    else goToMap();
  }

  function openPhase(phaseId: string): void {
    screen = { name: 'phase', phaseId };
  }

  function completePhase(phaseId: string, attempts: number): void {
    const wasDone = phaseId in progressStore.progress.phases;
    progressStore.complete(phaseId, attempts);
    track('phase_complete', {
      phase_id: phaseId,
      attempts,
      stars: progressStore.progress.phases[phaseId]?.stars ?? 0,
    });
    if (wasDone) {
      // Replaying a finished phase: stay out of the way and go back to the map.
      goToMap();
      return;
    }
    if (nextPhaseId(chapters, progressStore.progress) === null) {
      track('journey_complete');
      screen = { name: 'certificate' };
      return;
    }
    const inChapter = nextInChapter(chapters, phaseId);
    if (inChapter) {
      openPhase(inChapter);
      return;
    }
    const chapterId = findPhase(chapters, phaseId)?.chapterId;
    if (!chapterId) {
      goToMap();
      return;
    }
    track('chapter_complete', { chapter_id: chapterId });
    screen = { name: 'chapter-end', chapterId };
  }

  function reset(): void {
    progressStore.reset();
    screen = { name: 'start' };
  }
</script>

<main tabindex="-1" bind:this={mainEl}>
  {#if screen.name === 'start'}
    <Start {hasProgress} onStart={start} onReset={reset} onAbout={() => (screen = { name: 'about' })} />
  {:else if screen.name === 'about'}
    <About onHome={() => (screen = { name: 'start' })} />
  {:else if screen.name === 'map'}
    <Map
      {loaded}
      {chapters}
      progress={progressStore.progress}
      onOpenPhase={openPhase}
      onHome={() => (screen = { name: 'start' })}
      onCertificate={() => (screen = { name: 'certificate' })}
    />
  {:else if screen.name === 'phase'}
    <Phase {chapters} phaseId={screen.phaseId} onComplete={completePhase} onBack={goToMap} />
  {:else if screen.name === 'chapter-end'}
    {#if endChapter}
      <ChapterEnd
        chapter={endChapter.chapter}
        chapterIndex={endChapter.index}
        total={chapters.length}
        progress={progressStore.progress}
        nextPhase={nextPhaseId(chapters, progressStore.progress)}
        onContinue={openPhase}
        onMap={goToMap}
      />
    {:else}
      <Map
        {loaded}
        {chapters}
        progress={progressStore.progress}
        onOpenPhase={openPhase}
        onHome={() => (screen = { name: 'start' })}
        onCertificate={() => (screen = { name: 'certificate' })}
      />
    {/if}
  {:else}
    <Certificate
      {chapters}
      progress={progressStore.progress}
      onSetName={(n) => progressStore.setPlayerName(n)}
      onHome={() => (screen = { name: 'start' })}
      onMap={() => (screen = { name: 'map' })}
    />
  {/if}
</main>
