import { describe, expect, it } from 'vitest';
import { evaluateBuildPrompt, MISSING_MESSAGES } from '../src/lib/scoring/build-prompt';
import type { BuildPromptPhase } from '../src/lib/content/types';

const phase: BuildPromptPhase = {
  id: 'p',
  type: 'build-prompt',
  situation: 'S',
  required: ['context', 'task', 'tone'],
  blocks: [
    { id: 'ctx', category: 'context', text: 'Contexto' },
    { id: 'task', category: 'task', text: 'Tarefa' },
    { id: 'tone', category: 'tone', text: 'Tom' },
    { id: 'fmt', category: 'format', text: 'Formato' },
    { id: 'cpf', category: 'noise', text: 'Meu CPF é ...', feedback: 'Nunca compartilhe documentos.' },
  ],
  successFeedback: 'Boa.',
  resultPreview: 'R',
};

describe('evaluateBuildPrompt', () => {
  it('succeeds when all required categories are covered and no noise is selected', () => {
    const r = evaluateBuildPrompt(phase, ['ctx', 'task', 'tone']);
    expect(r.success).toBe(true);
    expect(r.missing).toEqual([]);
    expect(r.noise).toEqual([]);
    expect(r.messages).toEqual([]);
  });

  it('extra non-required blocks do not hurt', () => {
    expect(evaluateBuildPrompt(phase, ['ctx', 'task', 'tone', 'fmt']).success).toBe(true);
  });

  it('reports missing categories in required order with messages', () => {
    const r = evaluateBuildPrompt(phase, ['task']);
    expect(r.success).toBe(false);
    expect(r.missing).toEqual(['context', 'tone']);
    expect(r.messages).toEqual([MISSING_MESSAGES.context, MISSING_MESSAGES.tone]);
  });

  it('reports selected noise blocks with their own feedback', () => {
    const r = evaluateBuildPrompt(phase, ['ctx', 'task', 'tone', 'cpf']);
    expect(r.success).toBe(false);
    expect(r.noise.map((b) => b.id)).toEqual(['cpf']);
    expect(r.messages).toEqual(['Nunca compartilhe documentos.']);
  });

  it('ignores unknown ids', () => {
    expect(evaluateBuildPrompt(phase, ['ctx', 'task', 'tone', 'ghost']).success).toBe(true);
  });
});
