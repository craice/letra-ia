<script lang="ts">
  import Start from './screens/Start.svelte';
  import Map from './screens/Map.svelte';
  import { loadChapters, validChapters } from './lib/content/load';
  import { progressStore } from './lib/progress';
  import { isAllComplete, nextPhaseId } from './lib/progress/unlock';

  type Screen =
    | { name: 'start' }
    | { name: 'map' }
    | { name: 'phase'; phaseId: string }
    | { name: 'certificate' };

  const loaded = loadChapters();
  const chapters = validChapters(loaded);

  let screen = $state<Screen>({ name: 'start' });

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

{#if screen.name === 'start'}
  <Start {hasProgress} onStart={start} onReset={reset} />
{:else if screen.name === 'map'}
  <Map {loaded} {chapters} progress={progressStore.progress} onOpenPhase={openPhase} onHome={() => (screen = { name: 'start' })} />
{:else if screen.name === 'phase'}
  <p class="page">Fase {screen.phaseId} <button onclick={() => completePhase((screen as { phaseId: string }).phaseId, 1)}>concluir</button></p>
{:else}
  <p class="page">Certificado (em construção)</p>
{/if}
