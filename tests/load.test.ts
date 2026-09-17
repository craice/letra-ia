import { describe, expect, it } from 'vitest';
import { loadChapters } from '../src/lib/content/load';
import index from '../content/capitulos.json';

describe('loadChapters', () => {
  it('returns one entry per id in content/capitulos.json, in order', () => {
    const loaded = loadChapters();
    expect(loaded.map((l) => l.id)).toEqual(index.order);
  });

  it('every entry has chapter !== null and errors equal to []', () => {
    const loaded = loadChapters();
    for (const item of loaded) {
      expect(item.chapter).not.toBeNull();
      expect(item.errors).toEqual([]);
    }
  });
});
