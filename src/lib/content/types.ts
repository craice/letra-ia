export type BlockCategory = 'context' | 'task' | 'format' | 'tone' | 'example' | 'noise';
export type RequiredCategory = Exclude<BlockCategory, 'noise'>;

export const BLOCK_CATEGORIES: readonly BlockCategory[] = [
  'context', 'task', 'format', 'tone', 'example', 'noise',
];

export interface ExplanationCard {
  title?: string;
  text: string;
  illustration?: string;
}

export interface ExplanationPhase {
  id: string;
  type: 'explanation';
  title: string;
  cards: ExplanationCard[];
}

export interface PromptOption {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface ChoosePromptPhase {
  id: string;
  type: 'choose-prompt';
  situation: string;
  options: PromptOption[];
  resultPreview: string;
}

export interface PromptBlock {
  id: string;
  category: BlockCategory;
  text: string;
  feedback?: string;
}

export interface BuildPromptPhase {
  id: string;
  type: 'build-prompt';
  situation: string;
  required: RequiredCategory[];
  blocks: PromptBlock[];
  successFeedback: string;
  resultPreview: string;
}

export type Phase = ExplanationPhase | ChoosePromptPhase | BuildPromptPhase;

export const PHASE_TYPES: readonly Phase['type'][] = ['explanation', 'choose-prompt', 'build-prompt'];

export interface Chapter {
  id: string;
  title: string;
  icon: string;
  phases: Phase[];
}
