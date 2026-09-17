<script lang="ts">
  import type { ChoosePromptPhase } from '../lib/content/types';
  import Button from '../ui/Button.svelte';
  import Feedback from '../ui/Feedback.svelte';
  import ResultPreview from '../ui/ResultPreview.svelte';
  import Speech from '../ui/Speech.svelte';

  let { phase, onComplete }: { phase: ChoosePromptPhase; onComplete: (attempts: number) => void } = $props();

  let attempts = $state(0);
  let tried = $state<number[]>([]);
  let solved = $state<number | null>(null);
  let lastFeedback = $state<string | null>(null);

  const mood = $derived(solved !== null ? 'happy' : lastFeedback ? 'hmm' : 'neutral');

  function choose(i: number): void {
    if (solved !== null || tried.includes(i)) return;
    attempts += 1;
    const option = phase.options[i]!;
    lastFeedback = option.feedback;
    if (option.correct) solved = i;
    else tried = [...tried, i];
  }
</script>

<Speech {mood}>
  <p>{phase.situation}</p>
</Speech>

<p class="kicker prompt-label">Escolha o melhor pedido</p>

<ul class="options" role="list">
  {#each phase.options as option, i (i)}
    <li>
      <button
        class="option"
        class:wrong={tried.includes(i)}
        class:right={solved === i}
        disabled={solved !== null || tried.includes(i)}
        aria-pressed={solved === i}
        onclick={() => choose(i)}
      >
        <span class="quote" aria-hidden="true">“</span>{option.text}<span class="quote" aria-hidden="true">”</span>
      </button>
    </li>
  {/each}
</ul>

<Feedback kind={solved !== null ? 'success' : lastFeedback ? 'error' : null} messages={lastFeedback ? [lastFeedback] : []} />

{#if solved !== null}
  <ResultPreview text={phase.resultPreview} />
  <div class="next">
    <Button variant="accent" onclick={() => onComplete(attempts)}>Continuar</Button>
  </div>
{/if}

<style>
  .prompt-label { margin: var(--space-5) 0 var(--space-2); }
  .options { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-2); }
  .option {
    width: 100%; text-align: left; min-height: var(--touch);
    background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius);
    padding: var(--space-3) var(--space-4); color: var(--ink); font-size: 1rem; line-height: 1.45;
  }
  .option:not(:disabled):hover { border-color: var(--ink-soft); }
  .option.wrong { opacity: 0.5; text-decoration: line-through; }
  .option.right { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); background: var(--surface-soft); }
  .quote { color: var(--ink-soft); }
  .next { margin-top: var(--space-5); }
</style>
