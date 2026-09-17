import { emptyProgress, parseProgress, recordResult, serializeProgress, type Progress } from './model';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ProgressStore {
  readonly progress: Progress;
  complete(phaseId: string, attempts: number): void;
  setPlayerName(name: string): void;
  reset(): void;
}

export const PROGRESS_KEY = 'letra-ia:progress';

export function createProgressStore(storage: StorageLike, key: string = PROGRESS_KEY): ProgressStore {
  let progress = $state<Progress>(parseProgress(safeGet(storage, key)));

  function persist(next: Progress): void {
    progress = next;
    try {
      storage.setItem(key, serializeProgress(next));
    } catch {
      // storage full or blocked: keep working in memory
    }
  }

  return {
    get progress() {
      return progress;
    },
    complete(phaseId, attempts) {
      persist(recordResult(progress, phaseId, attempts));
    },
    setPlayerName(name) {
      const trimmed = name.trim();
      const next: Progress = { ...progress };
      if (trimmed) next.playerName = trimmed;
      else delete next.playerName;
      persist(next);
    },
    reset() {
      try {
        storage.removeItem(key);
      } catch {
        // ignore
      }
      progress = emptyProgress();
    },
  };
}

function safeGet(storage: StorageLike, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}
