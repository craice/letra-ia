<script lang="ts">
  import Start from './screens/Start.svelte';
  import About from './screens/About.svelte';
  import Map from './screens/Map.svelte';
  import Phase from './screens/Phase.svelte';
  import Certificate from './screens/Certificate.svelte';
  import { loadChapters, validChapters } from './lib/content/load';
  import { progressStore } from './lib/progress';
  import { isAllComplete, nextPhaseId } from './lib/progress/unlock';

  type Screen =
    | { name: 'start' }
    | { name: 'map' }
    | { name: 'phase'; phaseId: string }
    | { name: 'certificate' }
    | { name: 'about' };

  const loaded = loadChapters();
  const chapters = validChapters(loaded);

  let screen = $state<Screen>({ name: 'start' });
  let mainEl: HTMLElement | undefined;

  $effect(() => {
    screen;
    mainEl?.focus({ preventScroll: false });
  });

  const hasProgress = $derived(Object.keys(progressStore.progress.phases).length > 0);

  function goToMap(): void {
    screen = { name: 'map' };
  }

  function start(): void {
    if (isAllComplete(chapters, progressStore.progress)) screen = { name: 'certificate' };
    else goToMap();
  }

  function openPhase(phaseId: string): void {
    screen = { name: 'phase', phaseId };
  }

  function completePhase(phaseId: string, attempts: number): void {
    progressStore.complete(phaseId, attempts);
    const next = nextPhaseId(chapters, progressStore.progress);
    if (next === null) screen = { name: 'certificate' };
    else goToMap();
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
