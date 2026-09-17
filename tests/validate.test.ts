import { describe, expect, it } from 'vitest';
import { validateChapter, validateContent } from '../src/lib/content/validate';
import type { Chapter } from '../src/lib/content/types';

const validChapter: Chapter = {
  id: 'c1',
  title: 'Capítulo 1',
  icon: '💬',
  phases: [
    { id: 'p1', type: 'explanation', title: 'Oi', cards: [{ text: 'Olá.' }] },
    {
      id: 'p2',
      type: 'choose-prompt',
      situation: 'Situação.',
      options: [
        { text: 'A', correct: false, feedback: 'Não.' },
        { text: 'B', correct: true, feedback: 'Sim.' },
        { text: 'C', correct: false, feedback: 'Não.' },
      ],
      resultPreview: 'Resposta.',
    },
    {
      id: 'p3',
      type: 'build-prompt',
      situation: 'Situação.',
      required: ['context', 'task'],
      blocks: [
        { id: 'b1', category: 'context', text: 'Contexto.' },
        { id: 'b2', category: 'task', text: 'Tarefa.' },
        { id: 'b3', category: 'noise', text: 'Ruído.', feedback: 'Evite.' },
      ],
      successFeedback: 'Boa.',
      resultPreview: 'Resposta.',
    },
  ],
};

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

describe('validateChapter', () => {
  it('accepts a valid chapter', () => {
    expect(validateChapter(validChapter)).toEqual([]);
  });

  it('rejects non-object input', () => {
    expect(validateChapter(null)).not.toEqual([]);
    expect(validateChapter('x')).not.toEqual([]);
  });

  it('requires id, title, icon and a non-empty phases array', () => {
    const c = clone(validChapter) as unknown as Record<string, unknown>;
    delete c.title;
    c.phases = [];
    const errors = validateChapter(c);
    expect(errors.some((e) => e.includes('title'))).toBe(true);
    expect(errors.some((e) => e.includes('phases'))).toBe(true);
  });

  it('rejects unknown phase type', () => {
    const c = clone(validChapter);
    (c.phases[0] as { type: string }).type = 'quiz';
    expect(validateChapter(c).some((e) => e.includes('p1') && e.includes('type'))).toBe(true);
  });

  it('rejects duplicate phase ids within a chapter', () => {
    const c = clone(validChapter);
    c.phases[1]!.id = 'p1';
    expect(validateChapter(c).some((e) => e.includes('duplicate') && e.includes('p1'))).toBe(true);
  });

  it('explanation needs 1 to 3 cards with text', () => {
    const c = clone(validChapter);
    const p = c.phases[0] as { cards: unknown[] };
    p.cards = [{ text: 'a' }, { text: 'b' }, { text: 'c' }, { text: 'd' }];
    expect(validateChapter(c).some((e) => e.includes('cards'))).toBe(true);
    p.cards = [{ title: 'sem texto' }];
    expect(validateChapter(c).some((e) => e.includes('text'))).toBe(true);
  });

  it('choose-prompt needs 3 or 4 options, exactly one correct, all with feedback', () => {
    const c = clone(validChapter);
    const p = c.phases[1] as { options: { text: string; correct: boolean; feedback?: string }[] };
    p.options[0]!.correct = true;
    expect(validateChapter(c).some((e) => e.includes('exactly one correct'))).toBe(true);
    p.options[0]!.correct = false;
    p.options.pop();
    expect(validateChapter(c).some((e) => e.includes('3 or 4 options'))).toBe(true);
    p.options.push({ text: 'D', correct: false });
    expect(validateChapter(c).some((e) => e.includes('feedback'))).toBe(true);
  });

  it('build-prompt needs required covered, unique block ids, feedback on noise', () => {
    const c = clone(validChapter);
    const p = c.phases[2] as {
      required: string[];
      blocks: { id: string; category: string; text: string; feedback?: string }[];
    };
    p.required.push('format');
    expect(validateChapter(c).some((e) => e.includes('format') && e.includes('no block'))).toBe(true);
    p.required.pop();
    p.blocks[1]!.id = 'b1';
    expect(validateChapter(c).some((e) => e.includes('duplicate block id'))).toBe(true);
    p.blocks[1]!.id = 'b2';
    delete p.blocks[2]!.feedback;
    expect(validateChapter(c).some((e) => e.includes('noise') && e.includes('feedback'))).toBe(true);
    p.blocks[2]!.feedback = 'ok';
    p.blocks[0]!.category = 'banana';
    expect(validateChapter(c).some((e) => e.includes('category'))).toBe(true);
  });

  it('build-prompt rejects noise in required', () => {
    const c = clone(validChapter);
    (c.phases[2] as { required: string[] }).required.push('noise');
    expect(validateChapter(c).some((e) => e.includes('required') && e.includes('noise'))).toBe(true);
  });
});

describe('validateContent', () => {
  it('accepts distinct chapters', () => {
    const c2 = clone(validChapter);
    c2.id = 'c2';
    c2.phases.forEach((p) => (p.id = `${p.id}-2`));
    expect(validateContent([validChapter, c2])).toEqual([]);
  });

  it('rejects duplicate phase ids across chapters and duplicate chapter ids', () => {
    const c2 = clone(validChapter);
    const errors = validateContent([validChapter, c2]);
    expect(errors.some((e) => e.includes('chapter id') && e.includes('c1'))).toBe(true);
    expect(errors.some((e) => e.includes('phase id') && e.includes('p1'))).toBe(true);
  });
});
