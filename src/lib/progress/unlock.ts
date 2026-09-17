import type { Chapter, Phase } from '../content/types';
import type { Progress } from './model';

export interface FlatPhase {
  chapterId: string;
  chapterIndex: number;
  phaseIndex: number;
  phase: Phase;
}

export function flattenPhases(chapters: Chapter[]): FlatPhase[] {
  return chapters.flatMap((chapter, chapterIndex) =>
    chapter.phases.map((phase, phaseIndex) => ({ chapterId: chapter.id, chapterIndex, phaseIndex, phase })),
  );
}

export function findPhase(chapters: Chapter[], phaseId: string): FlatPhase | null {
  return flattenPhases(chapters).find((f) => f.phase.id === phaseId) ?? null;
}

export function isPhaseUnlocked(chapters: Chapter[], p: Progress, phaseId: string): boolean {
  const flat = flattenPhases(chapters);
  const i = flat.findIndex((f) => f.phase.id === phaseId);
  if (i < 0) return false;
  if (i === 0) return true;
  return flat[i - 1]!.phase.id in p.phases;
}

export function isChapterUnlocked(chapters: Chapter[], p: Progress, chapterId: string): boolean {
  const chapter = chapters.find((c) => c.id === chapterId);
  const first = chapter?.phases[0];
  return first ? isPhaseUnlocked(chapters, p, first.id) : false;
}

export function nextPhaseId(chapters: Chapter[], p: Progress): string | null {
  return flattenPhases(chapters).find((f) => !(f.phase.id in p.phases))?.phase.id ?? null;
}

export function isAllComplete(chapters: Chapter[], p: Progress): boolean {
  const flat = flattenPhases(chapters);
  return flat.length > 0 && nextPhaseId(chapters, p) === null;
}

/**
 * 1-based count of non-explanation phases in `chapter`, up to and including
 * `phaseIndex`. Used to label challenges ("Desafio N") without counting the
 * explanation phases that precede them.
 */
export function challengeNumber(chapter: Chapter, phaseIndex: number): number {
  let n = 0;
  for (let i = 0; i <= phaseIndex; i++) {
    if (chapter.phases[i]!.type !== 'explanation') n++;
  }
  return n;
}
