export type Stars = 1 | 2 | 3;

export function starsForAttempts(attempts: number): Stars {
  const n = Number.isFinite(attempts) && attempts > 1 ? Math.floor(attempts) : 1;
  if (n === 1) return 3;
  if (n === 2) return 2;
  return 1;
}
