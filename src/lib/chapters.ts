import { chapterRegistry } from '../data/chapters';
import { ChapterRegistryError, findMissingChapterNumbers, validateRegistry } from './registry';
import type { Chapter } from './schema';

function load(): { chapters: readonly Chapter[]; registryError: ChapterRegistryError | null } {
  try {
    return { chapters: validateRegistry(chapterRegistry), registryError: null };
  } catch (error) {
    if (!(error instanceof ChapterRegistryError)) throw error;
    // Invalid data is rejected wholesale and surfaced in the UI, never partially shown.
    console.error(error);
    return { chapters: [], registryError: error };
  }
}

const loaded = load();

/** Validated, number-sorted chapters (empty if the registry failed validation). */
export const chapters = loaded.chapters;
export const registryError = loaded.registryError;

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export const totalQuestions = chapters.reduce((sum, c) => sum + c.questions.length, 0);

/** Gaps in the course numbering (e.g. [6]) that have no chapter in this review set. */
export const missingChapterNumbers = findMissingChapterNumbers(chapters.map((c) => c.number));
