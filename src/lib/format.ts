import type { Chapter, Difficulty, SourceReference } from './schema';

/** Formats slide numbers compactly: [3,4,5,9] → "slides 3–5, 9". */
export function formatPages(pages: readonly number[]): string {
  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (const page of [...sorted.slice(1), Number.NaN]) {
    if (start === undefined || prev === undefined) break;
    if (page === prev + 1) {
      prev = page;
      continue;
    }
    ranges.push(start === prev ? `${start}` : `${start}–${prev}`);
    start = page;
    prev = page;
  }
  const single = sorted.length === 1;
  return `${single ? 'slide' : 'slides'} ${ranges.join(', ')}`;
}

export function formatSource(ref: SourceReference): string {
  return `${ref.section} · ${formatPages(ref.pages)}`;
}

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
  if (percentage >= 50) return 'Partial understanding. Revisit the slides for the gaps.';
  return 'Worth another careful pass through the material.';
}
