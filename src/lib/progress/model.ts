import { starsForAttempts, type Stars } from '../scoring/stars';

export interface PhaseResult {
  stars: Stars;
  attempts: number;
}

export interface Progress {
  version: 1;
  phases: Record<string, PhaseResult>;
  playerName?: string;
}

export const PROGRESS_VERSION = 1 as const;

export function emptyProgress(): Progress {
  return { version: PROGRESS_VERSION, phases: {} };
}

function isStars(x: unknown): x is Stars {
  return x === 1 || x === 2 || x === 3;
}

export function parseProgress(raw: string | null | undefined): Progress {
  if (!raw) return emptyProgress();
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return emptyProgress();
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return emptyProgress();
  const obj = data as Record<string, unknown>;
  if (obj.version !== PROGRESS_VERSION) return emptyProgress();

  const result = emptyProgress();
  if (typeof obj.phases === 'object' && obj.phases !== null && !Array.isArray(obj.phases)) {
    for (const [id, entry] of Object.entries(obj.phases as Record<string, unknown>)) {
      if (typeof entry !== 'object' || entry === null) continue;
      const e = entry as Record<string, unknown>;
      if (isStars(e.stars) && typeof e.attempts === 'number' && Number.isFinite(e.attempts)) {
        result.phases[id] = { stars: e.stars, attempts: e.attempts };
      }
    }
  }
  if (typeof obj.playerName === 'string' && obj.playerName.trim()) result.playerName = obj.playerName;
  return result;
}

export function serializeProgress(p: Progress): string {
  return JSON.stringify(p);
}

export function recordResult(p: Progress, phaseId: string, attempts: number): Progress {
  const newStars = starsForAttempts(attempts);
  const previous = p.phases[phaseId];
  const stars = previous && previous.stars > newStars ? previous.stars : newStars;
  return {
    ...p,
    phases: { ...p.phases, [phaseId]: { stars, attempts } },
  };
}

export function totalStars(p: Progress): number {
  return Object.values(p.phases).reduce((sum, r) => sum + r.stars, 0);
}
