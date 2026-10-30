import type { Chapter, Difficulty } from './schema';

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  foundational: 'Foundational',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function difficultyBreakdown(chapter: Chapter): Record<Difficulty, number> {
  const counts: Record<Difficulty, number> = { foundational: 0, intermediate: 0, advanced: 0 };
  for (const q of chapter.questions) counts[q.difficulty] += 1;
  return counts;
}

/**
 * Student-facing note for numbering gaps: [6] → "Chapter 6 is not available in this review set."
 * Returns null when there are no gaps.
 */
export function missingChaptersNote(missing: readonly number[]): string | null {
  if (missing.length === 0) return null;
  if (missing.length === 1) return `Chapter ${missing[0]} is not available in this review set.`;
  const list = `${missing.slice(0, -1).join(', ')} and ${missing[missing.length - 1]}`;
  return `Chapters ${list} are not available in this review set.`;
}

export function verdict(percentage: number): string {
  if (percentage >= 90) return 'Excellent command of this chapter.';
  if (percentage >= 70) return 'A solid grasp. Review the questions you missed.';
  if (percentage >= 50) return 'Partial understanding. Revisit the chapter for the gaps.';
  return 'Worth another careful pass through the material.';
}
