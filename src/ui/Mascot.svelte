<script module lang="ts">
  export type Mood = 'neutral' | 'explaining' | 'happy' | 'hmm';

  // A pixel-art lowercase "a" (for "Letra") whose bowl is the face.
  // o = coral body, w = face, x = eye, d = mouth, . = empty. 13 columns by 13 rows.
  const BODY = [
    '...ooooooo...',
    '..ooooooooo..',
    '..ooo...oooo.',
    '........oooo.',
    '...ooooooooo.',
    '..oooooooooo.',
    '.ooowwwwwooo.',
    '.oowwwwwwwoo.',
    '.oowwwwwwwoo.',
    '.oowwwwwwwoo.',
    '.ooowwwwwooo.',
    '..oooooooooo.',
    '...ooooo.oooo',
  ];

  // Face pixels per mood, as [column, row, kind].
  type Pixel = [number, number, 'x' | 'd'];
  const FACES: Record<Mood, Pixel[]> = {
    neutral: [[4, 7, 'x'], [4, 8, 'x'], [8, 7, 'x'], [8, 8, 'x'], [5, 10, 'd'], [6, 10, 'd'], [7, 10, 'd']],
    explaining: [[4, 7, 'x'], [4, 8, 'x'], [8, 7, 'x'], [8, 8, 'x'], [6, 9, 'd'], [6, 10, 'd']],
    happy: [[4, 7, 'x'], [8, 7, 'x'], [4, 9, 'd'], [8, 9, 'd'], [5, 10, 'd'], [6, 10, 'd'], [7, 10, 'd']],
    hmm: [[4, 7, 'x'], [4, 8, 'x'], [7, 8, 'x'], [8, 8, 'x'], [6, 10, 'd'], [7, 10, 'd']],
  };

  const BODY_PIXELS: [number, number, 'o' | 'w'][] = BODY.flatMap((row, y) =>
    [...row].flatMap((ch, x) => (ch === 'o' || ch === 'w' ? [[x, y, ch] as [number, number, 'o' | 'w']] : [])),
  );
</script>

<script lang="ts">
  let { mood = 'neutral', size = 48 }: { mood?: Mood; size?: number } = $props();
</script>

<svg
  class="mascot {mood}"
  width={size}
  height={size}
  viewBox="0 0 13 13"
  shape-rendering="crispEdges"
  role="img"
  aria-label="Letra, a guia do jogo"
>
  {#each BODY_PIXELS as [x, y, kind] (`${x}-${y}`)}
    <rect {x} {y} width="1.02" height="1.02" class={kind} />
  {/each}
  {#each FACES[mood] as [x, y, kind] (`${x}-${y}`)}
    <rect {x} {y} width="1.02" height="1.02" class={kind === 'x' ? 'eye' : 'mouth'} />
  {/each}
</svg>

<style>
  .mascot { flex: none; display: block; }
  .o { fill: var(--accent); }
  .w { fill: var(--paper); }
  .eye { fill: var(--ink); animation: blink 5s steps(1) infinite; }
  .mouth { fill: var(--accent-strong); }
  .happy { animation: hop 480ms steps(4); }
  @keyframes blink {
    0%, 94% { opacity: 1; }
    95%, 100% { opacity: 0; }
  }
  @keyframes hop {
    0% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
    100% { transform: translateY(0); }
  }
</style>
