import { createProgressStore, type StorageLike } from './store.svelte';

function memoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

function pickStorage(): StorageLike {
  try {
    const probe = '__letra_ia_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return memoryStorage();
  }
}

export const progressStore = createProgressStore(pickStorage());
export type { ProgressStore, StorageLike } from './store.svelte';
