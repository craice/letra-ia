import { describe, expect, it } from 'vitest';
import type { Chapter } from '../src/lib/content/types';
import { emptyProgress, recordResult } from '../src/lib/progress/model';
import {
  challengeNumber, findPhase, flattenPhases, isAllComplete, isChapterUnlocked, isPhaseUnlocked, nextPhaseId,
} from '../src/lib/progress/unlock';

const exp = (id: string) => ({ id, type: 'explanation' as const, title: id, cards: [{ text: 't' }] });
const choose = (id: string) => ({
  id,
  type: 'choose-prompt' as const,
  situation: 's',
  resultPreview: 'r',
  options: [
    { text: 'a', correct: true, feedback: 'f' },
    { text: 'b', correct: false, feedback: 'f' },
    { text: 'c', correct: false, feedback: 'f' },
  ],
});
const chapters: Chapter[] = [
  { id: 'c1', title: 'C1', icon: '1', phases: [exp('a'), exp('b')] },
  { id: 'c2', title: 'C2', icon: '2', phases: [exp('c')] },
];

describe('unlock', () => {
  it('flattens in order with indexes', () => {
    expect(flattenPhases(chapters).map((f) => [f.chapterId, f.chapterIndex, f.phaseIndex, f.phase.id])).toEqual([
      ['c1', 0, 0, 'a'], ['c1', 0, 1, 'b'], ['c2', 1, 0, 'c'],
    ]);
  });

  it('first phase is always unlocked; others need the previous one completed', () => {
    const p0 = emptyProgress();
    expect(isPhaseUnlocked(chapters, p0, 'a')).toBe(true);
    expect(isPhaseUnlocked(chapters, p0, 'b')).toBe(false);
    expect(isPhaseUnlocked(chapters, p0, 'c')).toBe(false);
    const p1 = recordResult(p0, 'a', 1);
    expect(isPhaseUnlocked(chapters, p1, 'b')).toBe(true);
    expect(isPhaseUnlocked(chapters, p1, 'c')).toBe(false);
    const p2 = recordResult(p1, 'b', 1);
    expect(isPhaseUnlocked(chapters, p2, 'c')).toBe(true);
    expect(isPhaseUnlocked(chapters, p2, 'nope')).toBe(false);
  });

  it('chapter unlocks when its first phase is unlocked', () => {
    const p = recordResult(emptyProgress(), 'a', 1);
    expect(isChapterUnlocked(chapters, p, 'c1')).toBe(true);
    expect(isChapterUnlocked(chapters, p, 'c2')).toBe(false);
    expect(isChapterUnlocked(chapters, recordResult(p, 'b', 1), 'c2')).toBe(true);
  });

  it('nextPhaseId and isAllComplete', () => {
    let p = emptyProgress();
    expect(nextPhaseId(chapters, p)).toBe('a');
    p = recordResult(p, 'a', 1);
    p = recordResult(p, 'b', 1);
    expect(nextPhaseId(chapters, p)).toBe('c');
    expect(isAllComplete(chapters, p)).toBe(false);
    p = recordResult(p, 'c', 1);
    expect(nextPhaseId(chapters, p)).toBeNull();
    expect(isAllComplete(chapters, p)).toBe(true);
  });

  it('findPhase', () => {
    expect(findPhase(chapters, 'c')?.chapterId).toBe('c2');
    expect(findPhase(chapters, 'zzz')).toBeNull();
  });

  it('challengeNumber counts only non-explanation phases up to and including phaseIndex', () => {
    const chapter: Chapter = {
      id: 'c3', title: 'C3', icon: '3', phases: [exp('e1'), exp('e2'), choose('x'), choose('y')],
    };
    expect(challengeNumber(chapter, 2)).toBe(1);
    expect(challengeNumber(chapter, 3)).toBe(2);
  });
});
