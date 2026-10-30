import { practiceRegistry } from '../data/practice';
import { chapters, registryError } from './chapters';
import { PracticeRegistryError, validatePracticeRegistry } from './practiceRegistry';
import type { PracticeKind, PracticeQuestion, PracticeSet, SourceStatus } from './practiceSchema';

function load(): { sets: readonly PracticeSet[]; error: PracticeRegistryError | null } {
  // Without valid chapters there is nothing to attach practice sets to; the chapter error is already shown.
  if (registryError) return { sets: [], error: null };
  try {
    return { sets: validatePracticeRegistry(practiceRegistry, chapters), error: null };
  } catch (error) {
    if (!(error instanceof PracticeRegistryError)) throw error;
    console.error(error);
    return { sets: [], error };
  }
}

const loaded = load();

/** Validated practice sets in chapter order (empty if the registry failed validation). */
export const practiceSets = loaded.sets;
export const practiceError = loaded.error;

export function getPracticeSet(chapterId: string): PracticeSet | undefined {
  return practiceSets.find((s) => s.chapterId === chapterId);
}

export const isWritten = (q: PracticeQuestion) => q.kind === 'written';

export function practiceCounts(questions: readonly PracticeQuestion[]) {
  const written = questions.filter(isWritten).length;
  return { written, practical: questions.length - written, total: questions.length };
}

export const KIND_LABEL: Record<PracticeKind, string> = {
  written: 'Written',
  sequence: 'Trace',
  table: 'Fill the table',
  complete: 'Complete the diagram',
  construct: 'Build the graph',
  logic: 'Logic notation',
  draw: 'Draw',
};

export const STATUS_LABEL: Record<SourceStatus, string> = {
  'slide-based': 'Slide-based',
  'corrected-concept': 'Corrected concept',
  'additional-clarification': 'Additional clarification',
  'original-worked-example': 'Original worked example',
};

export const STATUS_MEANING: Record<SourceStatus, string> = {
  'slide-based': 'Directly supported by the lecture material.',
  'corrected-concept': 'Scientifically corrected where a lecture slide contains an apparent error.',
  'additional-clarification': 'Standard academic information that expands on the slides.',
  'original-worked-example': 'A practice example created to demonstrate a course concept.',
};
