import { describe, expect, it } from 'vitest';
import { loadChapters } from '../src/lib/content/load';

describe('loadChapters', () => {
  it('returns one entry per id in content/capitulos.json, in order', () => {
    const loaded = loadChapters();
    expect(loaded.length).toBe(1);
    expect(loaded[0]?.id).toBe('01-o-que-e-ia');
  });

  it('every entry has chapter !== null and errors equal to []', () => {
    const loaded = loadChapters();
    for (const item of loaded) {
      expect(item.chapter).not.toBeNull();
      expect(item.errors).toEqual([]);
    }
  });
});
