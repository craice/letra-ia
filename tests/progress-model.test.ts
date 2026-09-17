import { describe, expect, it } from 'vitest';
import {
  emptyProgress, parseProgress, recordResult, serializeProgress, totalStars,
} from '../src/lib/progress/model';

describe('parseProgress', () => {
  it('returns empty progress for null, garbage and wrong version', () => {
    expect(parseProgress(null)).toEqual(emptyProgress());
    expect(parseProgress('{not json')).toEqual(emptyProgress());
    expect(parseProgress('"a string"')).toEqual(emptyProgress());
    expect(parseProgress(JSON.stringify({ version: 99, phases: {} }))).toEqual(emptyProgress());
  });

  it('round-trips valid progress', () => {
    const p = recordResult(emptyProgress(), 'x', 2);
    p.playerName = 'Ana';
    expect(parseProgress(serializeProgress(p))).toEqual(p);
  });

  it('drops malformed phase entries but keeps good ones', () => {
    const raw = JSON.stringify({
      version: 1,
      phases: { good: { stars: 2, attempts: 2 }, bad: { stars: 7 }, worse: 'x' },
      playerName: 42,
    });
    const p = parseProgress(raw);
    expect(p.phases).toEqual({ good: { stars: 2, attempts: 2 } });
    expect(p.playerName).toBeUndefined();
  });
});

describe('recordResult', () => {
  it('stores stars from attempts and never lowers them', () => {
    let p = recordResult(emptyProgress(), 'x', 1);
    expect(p.phases.x).toEqual({ stars: 3, attempts: 1 });
    p = recordResult(p, 'x', 3);
    expect(p.phases.x).toEqual({ stars: 3, attempts: 3 });
    p = recordResult(emptyProgress(), 'y', 3);
    p = recordResult(p, 'y', 1);
    expect(p.phases.y?.stars).toBe(3);
  });

  it('does not mutate the input', () => {
    const a = emptyProgress();
    recordResult(a, 'x', 1);
    expect(a.phases).toEqual({});
  });
});

describe('totalStars', () => {
  it('sums stars', () => {
    let p = recordResult(emptyProgress(), 'a', 1);
    p = recordResult(p, 'b', 2);
    expect(totalStars(p)).toBe(5);
  });
});
