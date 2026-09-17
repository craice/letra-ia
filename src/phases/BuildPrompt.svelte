<script lang="ts">
  import type { BuildPromptPhase } from '../lib/content/types';
  import { evaluateBuildPrompt, type BuildPromptResult } from '../lib/scoring/build-prompt';
  import Button from '../ui/Button.svelte';
  import Feedback from '../ui/Feedback.svelte';
  import ResultPreview from '../ui/ResultPreview.svelte';
  import Speech from '../ui/Speech.svelte';

  let { phase, onComplete }: { phase: BuildPromptPhase; onComplete: (attempts: number) => void } = $props();

  let selected = $state<string[]>([]);
  let attempts = $state(0);
  let result = $state<BuildPromptResult | null>(null);

  const solved = $derived(result?.success === true);
  const composed = $derived(
    selected.map((id) => phase.blocks.find((b) => b.id === id)?.text ?? '').join(' '),
  );
  const mood = $derived(solved ? 'happy' : result ? 'hmm' : 'neutral');

  function toggle(id: string): void {
    if (solved) return;
    selected = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    result = null;
  }

  function test(): void {
    attempts += 1;
    result = evaluateBuildPrompt(phase, selected);
  }
</script>

<Speech {mood}>
  <p>{phase.situation}</p>
</Speech>

<p class="kicker label">Toque nas peças para montar seu pedido</p>

<ul class="blocks" role="list">
  {#each phase.blocks as block (block.id)}
    {@const on = selected.includes(block.id)}
    <li>
      <button
        class="block"
        class:on
        class:bad={solved === false && result?.noise.some((n) => n.id === block.id)}
        aria-pressed={on}
        disabled={solved}
        onclick={() => toggle(block.id)}
      >
        <span class="check sans" aria-hidden="true">{on ? selected.indexOf(block.id) + 1 : '+'}</span>
        {block.text}
      </button>
    </li>
  {/each}
</ul>

<div class="card composed" aria-live="polite">
  <div class="kicker">Seu pedido</div>
  {#if composed}
    <p>{composed}</p>
  {:else}
    <p class="empty">Nenhuma peça ainda.</p>
  {/if}
</div>

{#if !solved}
  <div class="actions">
    <Button variant="primary" disabled={selected.length === 0} onclick={test}>Testar meu prompt</Button>
  </div>
{/if}

<Feedback
  kind={result ? (result.success ? 'success' : 'error') : null}
  messages={result ? (result.success ? [phase.successFeedback] : result.messages) : []}
/>

{#if solved}
  <ResultPreview text={phase.resultPreview} />
  <div class="actions">
    <Button variant="accent" onclick={() => onComplete(attempts)}>Continuar</Button>
  </div>
{/if}

<style>
  .label { margin: var(--space-5) 0 var(--space-2); }
  .blocks { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-2); }
  .block {
    width: 100%; text-align: left; min-height: var(--touch); display: flex; gap: var(--space-3); align-items: flex-start;
    background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius);
    padding: var(--space-3) var(--space-4); color: var(--ink); font-size: 1rem; line-height: 1.45;
  }
  .block.on { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); background: var(--surface-soft); }
  .block.bad { border-color: var(--error); box-shadow: inset 0 0 0 1px var(--error); background: var(--error-soft); }
  .block:disabled { cursor: default; }
  .check { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; font-size: 0.8rem; flex: none; margin-top: 2px; }
  .block.on .check { background: var(--ink); border-color: var(--ink); color: var(--on-dark); }
  .composed { margin-top: var(--space-4); border-color: transparent; }
  .composed p { margin: 0; }
  .empty { color: var(--ink-soft); }
  .actions { margin-top: var(--space-4); }
</style>
