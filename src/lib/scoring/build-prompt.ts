import type { BuildPromptPhase, PromptBlock, RequiredCategory } from '../content/types';

export interface BuildPromptResult {
  success: boolean;
  missing: RequiredCategory[];
  noise: PromptBlock[];
  messages: string[];
}

export const MISSING_MESSAGES: Record<RequiredCategory, string> = {
  context: 'Faltou o contexto: a IA não sabe da sua situação se você não contar.',
  task: 'Faltou dizer a tarefa: o que exatamente você quer que ela faça?',
  format: 'Faltou o formato: lista, parágrafo, tabela, quantos itens?',
  tone: 'Faltou o tom: formal, descontraído, direto, carinhoso?',
  example: 'Faltou um exemplo: mostrar como você gosta ajuda muito a IA a acertar.',
};

export function evaluateBuildPrompt(
  phase: BuildPromptPhase,
  selectedIds: readonly string[],
): BuildPromptResult {
  const selected = new Set(selectedIds);
  const chosen = phase.blocks.filter((b) => selected.has(b.id));
  const categories = new Set(chosen.map((b) => b.category));

  const missing = phase.required.filter((r) => !categories.has(r));
  const noise = chosen.filter((b) => b.category === 'noise');

  const messages = [
    ...missing.map((m) => MISSING_MESSAGES[m]),
    ...noise.map((b) => b.feedback ?? 'Esse trecho não ajuda o pedido.'),
  ];

  return { success: missing.length === 0 && noise.length === 0, missing, noise, messages };
}
