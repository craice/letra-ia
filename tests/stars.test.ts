import { describe, expect, it } from 'vitest';
import { starsForAttempts } from '../src/lib/scoring/stars';

describe('starsForAttempts', () => {
  it('maps attempts to stars', () => {
    expect(starsForAttempts(1)).toBe(3);
    expect(starsForAttempts(2)).toBe(2);
    expect(starsForAttempts(3)).toBe(1);
    expect(starsForAttempts(10)).toBe(1);
  });

  it('treats 0 or invalid as a single attempt', () => {
    expect(starsForAttempts(0)).toBe(3);
    expect(starsForAttempts(-4)).toBe(3);
    expect(starsForAttempts(Number.NaN)).toBe(3);
  });
});
