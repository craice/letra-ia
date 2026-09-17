<script lang="ts">
  import type { ExplanationPhase } from '../lib/content/types';
  import Button from '../ui/Button.svelte';
  import Speech from '../ui/Speech.svelte';
  import Icon from '../ui/Icon.svelte';

  let { phase, onComplete }: { phase: ExplanationPhase; onComplete: (attempts: number) => void } = $props();

  let index = $state(0);
  const card = $derived(phase.cards[index]!);
  const isLast = $derived(index === phase.cards.length - 1);

  function next(): void {
    if (isLast) onComplete(1);
    else index += 1;
  }
</script>

<h1>{phase.title}</h1>

<article class="card lesson" aria-live="polite">
  {#if card.illustration}
    <div class="illo"><Icon name={card.illustration} size={48} /></div>
  {/if}
  {#if card.title}<h2>{card.title}</h2>{/if}
  <p>{card.text}</p>
</article>

<Speech mood="explaining">
  <p>{isLast ? 'Ficou claro? Então vamos praticar.' : 'Leia com calma. Quando quiser, passe para o próximo.'}</p>
</Speech>

<div class="nav">
  <span class="kicker">{index + 1} de {phase.cards.length}</span>
  <Button variant={isLast ? 'accent' : 'primary'} onclick={next}>{isLast ? 'Entendi' : 'Próximo'}</Button>
</div>

<style>
  .lesson { margin-bottom: var(--space-4); }
  .illo { color: var(--accent-strong); margin-bottom: var(--space-3); }
  .lesson h2 { font-size: 1.6rem; }
  .lesson p { margin: 0; }
  .nav { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-5); align-items: center; }
</style>
