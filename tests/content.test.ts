import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateChapter, validateContent } from '../src/lib/content/validate';
import type { Chapter } from '../src/lib/content/types';

const contentDir = join(__dirname, '..', 'content');
const chaptersDir = join(contentDir, 'capitulos');

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}

describe('content/', () => {
  const index = readJson(join(contentDir, 'capitulos.json')) as { order: string[] };
  const files = readdirSync(chaptersDir).filter((f) => f.endsWith('.json'));

  it('capitulos.json lists every chapter file exactly once, and nothing else', () => {
    const basenames = files.map((f) => f.replace(/\.json$/, '')).sort();
    expect([...index.order].sort()).toEqual(basenames);
    expect(new Set(index.order).size).toBe(index.order.length);
  });

  for (const file of files) {
    it(`${file} is a valid chapter whose id matches its file name`, () => {
      const data = readJson(join(chaptersDir, file));
      expect(validateChapter(data)).toEqual([]);
      expect((data as Chapter).id).toBe(file.replace(/\.json$/, ''));
    });
  }

  it('phase ids are unique across all chapters', () => {
    const chapters = files.map((f) => readJson(join(chaptersDir, f)) as Chapter);
    expect(validateContent(chapters)).toEqual([]);
  });

  it('every chapter has 5 to 7 phases and starts with an explanation', () => {
    for (const file of files) {
      const chapter = readJson(join(chaptersDir, file)) as Chapter;
      expect(chapter.phases.length, file).toBeGreaterThanOrEqual(5);
      expect(chapter.phases.length, file).toBeLessThanOrEqual(7);
      expect(chapter.phases[0]?.type, file).toBe('explanation');
    }
  });

  it('chapters 01 and 02 introduce concepts without build-prompt phases', () => {
    for (const file of files) {
      if (!/^0[12]-/.test(file)) continue;
      const chapter = readJson(join(chaptersDir, file)) as Chapter;
      for (const phase of chapter.phases) {
        expect(phase.type, `${file} ${phase.id}`).not.toBe('build-prompt');
      }
    }
  });

  it('every phase id is prefixed with its chapter number (NN-*.json -> c<N>-)', () => {
    for (const file of files) {
      const match = file.match(/^(\d+)-/);
      if (!match) continue;
      const n = parseInt(match[1]!, 10);
      const chapter = readJson(join(chaptersDir, file)) as Chapter;
      for (const phase of chapter.phases) {
        expect(phase.id, file).toMatch(new RegExp(`^c${n}-`));
      }
    }
  });
});
