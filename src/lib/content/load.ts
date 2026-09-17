import index from '../../../content/capitulos.json';
import { validateChapter, validateContent } from './validate';
import type { Chapter } from './types';

export interface LoadedChapter {
  id: string;
  chapter: Chapter | null;
  errors: string[];
}

const modules = import.meta.glob('../../../content/capitulos/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

function byBasename(): Map<string, unknown> {
  const map = new Map<string, unknown>();
  for (const [path, data] of Object.entries(modules)) {
    const base = path.split('/').pop()!.replace(/\.json$/, '');
    map.set(base, data);
  }
  return map;
}

export function loadChapters(): LoadedChapter[] {
  const files = byBasename();
  const loaded: LoadedChapter[] = (index as { order: string[] }).order.map((id) => {
    const data = files.get(id);
    if (data === undefined) return { id, chapter: null, errors: [`file "${id}.json" not found`] };
    const errors = validateChapter(data);
    if (errors.length === 0 && (data as Chapter).id !== id) {
      errors.push(`chapter id "${(data as Chapter).id}" does not match file "${id}"`);
    }
    return { id, chapter: errors.length === 0 ? (data as Chapter) : null, errors };
  });

  const crossErrors = validateContent(validChapters(loaded));
  if (crossErrors.length > 0) {
    for (const item of loaded) if (item.chapter) item.errors.push(...crossErrors);
  }
  return loaded;
}

export function validChapters(loaded: LoadedChapter[]): Chapter[] {
  return loaded.flatMap((l) => (l.chapter ? [l.chapter] : []));
}
