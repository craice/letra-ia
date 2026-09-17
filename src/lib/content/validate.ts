import { BLOCK_CATEGORIES, PHASE_TYPES, type Chapter } from './types';

type Obj = Record<string, unknown>;

function isObj(x: unknown): x is Obj {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

function isNonEmptyString(x: unknown): x is string {
  return typeof x === 'string' && x.trim().length > 0;
}

function requireString(obj: Obj, key: string, where: string, errors: string[]): void {
  if (!isNonEmptyString(obj[key])) errors.push(`${where}: "${key}" must be a non-empty string`);
}

function validateExplanation(p: Obj, where: string, errors: string[]): void {
  requireString(p, 'title', where, errors);
  const cards = p.cards;
  if (!Array.isArray(cards) || cards.length < 1 || cards.length > 3) {
    errors.push(`${where}: "cards" must have 1 to 3 items`);
    return;
  }
  cards.forEach((card, i) => {
    const cw = `${where} cards[${i}]`;
    if (!isObj(card)) {
      errors.push(`${cw}: must be an object`);
      return;
    }
    requireString(card, 'text', cw, errors);
    if (card.title !== undefined && !isNonEmptyString(card.title)) errors.push(`${cw}: "title" must be a string`);
    if (card.illustration !== undefined && !isNonEmptyString(card.illustration)) {
      errors.push(`${cw}: "illustration" must be a string`);
    }
  });
}

function validateChoosePrompt(p: Obj, where: string, errors: string[]): void {
  requireString(p, 'situation', where, errors);
  requireString(p, 'resultPreview', where, errors);
  const options = p.options;
  if (!Array.isArray(options) || options.length < 3 || options.length > 4) {
    errors.push(`${where}: must have 3 or 4 options`);
    return;
  }
  let correct = 0;
  options.forEach((opt, i) => {
    const ow = `${where} options[${i}]`;
    if (!isObj(opt)) {
      errors.push(`${ow}: must be an object`);
      return;
    }
    requireString(opt, 'text', ow, errors);
    requireString(opt, 'feedback', ow, errors);
    if (typeof opt.correct !== 'boolean') errors.push(`${ow}: "correct" must be a boolean`);
    if (opt.correct === true) correct++;
  });
  if (correct !== 1) errors.push(`${where}: must have exactly one correct option (found ${correct})`);
}

function validateBuildPrompt(p: Obj, where: string, errors: string[]): void {
  requireString(p, 'situation', where, errors);
  requireString(p, 'successFeedback', where, errors);
  requireString(p, 'resultPreview', where, errors);

  const required = p.required;
  if (!Array.isArray(required) || required.length === 0) {
    errors.push(`${where}: "required" must be a non-empty array`);
    return;
  }
  const blocks = p.blocks;
  if (!Array.isArray(blocks) || blocks.length === 0) {
    errors.push(`${where}: "blocks" must be a non-empty array`);
    return;
  }

  const seenIds = new Set<string>();
  const categoriesPresent = new Set<string>();
  blocks.forEach((b, i) => {
    const bw = `${where} blocks[${i}]`;
    if (!isObj(b)) {
      errors.push(`${bw}: must be an object`);
      return;
    }
    requireString(b, 'id', bw, errors);
    requireString(b, 'text', bw, errors);
    if (typeof b.id === 'string') {
      if (seenIds.has(b.id)) errors.push(`${bw}: duplicate block id "${b.id}"`);
      seenIds.add(b.id);
    }
    if (typeof b.category !== 'string' || !(BLOCK_CATEGORIES as readonly string[]).includes(b.category)) {
      errors.push(`${bw}: unknown category "${String(b.category)}"`);
      return;
    }
    categoriesPresent.add(b.category);
    if (b.category === 'noise' && !isNonEmptyString(b.feedback)) {
      errors.push(`${bw}: noise blocks must have "feedback"`);
    }
  });

  required.forEach((r) => {
    if (typeof r !== 'string' || !(BLOCK_CATEGORIES as readonly string[]).includes(r)) {
      errors.push(`${where}: "required" has unknown category "${String(r)}"`);
      return;
    }
    if (r === 'noise') errors.push(`${where}: "required" cannot contain "noise"`);
    else if (!categoriesPresent.has(r)) errors.push(`${where}: required category "${r}" has no block`);
  });
}

export function validateChapter(data: unknown): string[] {
  const errors: string[] = [];
  if (!isObj(data)) return ['chapter: must be an object'];

  const where = `chapter "${String(data.id ?? '?')}"`;
  requireString(data, 'id', where, errors);
  requireString(data, 'title', where, errors);
  requireString(data, 'icon', where, errors);

  const phases = data.phases;
  if (!Array.isArray(phases) || phases.length === 0) {
    errors.push(`${where}: "phases" must be a non-empty array`);
    return errors;
  }

  const seen = new Set<string>();
  phases.forEach((phase, i) => {
    if (!isObj(phase)) {
      errors.push(`${where} phases[${i}]: must be an object`);
      return;
    }
    const pw = `${where} phase "${String(phase.id ?? `#${i}`)}"`;
    requireString(phase, 'id', pw, errors);
    if (typeof phase.id === 'string') {
      if (seen.has(phase.id)) errors.push(`${pw}: duplicate phase id "${phase.id}"`);
      seen.add(phase.id);
    }
    const type = phase.type;
    if (typeof type !== 'string' || !(PHASE_TYPES as readonly string[]).includes(type)) {
      errors.push(`${pw}: unknown type "${String(type)}"`);
      return;
    }
    if (type === 'explanation') validateExplanation(phase, pw, errors);
    else if (type === 'choose-prompt') validateChoosePrompt(phase, pw, errors);
    else validateBuildPrompt(phase, pw, errors);
  });

  return errors;
}

export function validateContent(chapters: Chapter[]): string[] {
  const errors: string[] = [];
  const chapterIds = new Set<string>();
  const phaseIds = new Map<string, string>();

  for (const chapter of chapters) {
    if (chapterIds.has(chapter.id)) errors.push(`duplicate chapter id "${chapter.id}"`);
    chapterIds.add(chapter.id);
    for (const phase of chapter.phases) {
      const owner = phaseIds.get(phase.id);
      if (owner) errors.push(`duplicate phase id "${phase.id}" in chapters "${owner}" and "${chapter.id}"`);
      else phaseIds.set(phase.id, chapter.id);
    }
  }
  return errors;
}
