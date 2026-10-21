import { chapterSchema, type Chapter } from './schema';

export class ChapterRegistryError extends Error {
  readonly issues: string[];
  constructor(issues: string[]) {
    super(`Invalid chapter registry:\n- ${issues.join('\n- ')}`);
    this.name = 'ChapterRegistryError';
    this.issues = issues;
  }
}

/**
 * Chapter numbers between 1 and the highest registered number that have no chapter,
 * e.g. [1, 2, 5] → [3, 4]. Derived from the data, so gaps close automatically when filled.
 */
export function findMissingChapterNumbers(numbers: readonly number[]): number[] {
  if (numbers.length === 0) return [];
  const present = new Set(numbers);
  const highest = Math.max(...numbers);
  const missing: number[] = [];
  for (let n = 1; n < highest; n++) if (!present.has(n)) missing.push(n);
  return missing;
}

/**
 * Validates raw chapter data and returns chapters sorted by number.
 * Throws a ChapterRegistryError listing every problem; invalid data is never accepted.
 */
export function validateRegistry(raw: readonly unknown[]): Chapter[] {
  const issues: string[] = [];
  const chapters: Chapter[] = [];

  raw.forEach((entry, index) => {
    const result = chapterSchema.safeParse(entry);
    if (!result.success) {
      const label = (entry as { id?: unknown } | null)?.id ?? `entry #${index}`;
      for (const issue of result.error.issues) {
        issues.push(`${String(label)} › ${issue.path.join('.') || '(root)'}: ${issue.message}`);
      }
      return;
    }
    chapters.push(result.data);
  });

  const idCounts = new Map<string, number>();
  const byNumber = new Map<number, string>();
  const byFile = new Map<string, string>();
  for (const chapter of chapters) {
    idCounts.set(chapter.id, (idCounts.get(chapter.id) ?? 0) + 1);

    const otherByNumber = byNumber.get(chapter.number);
    if (otherByNumber !== undefined) {
      issues.push(`chapter number ${chapter.number} is used by both "${otherByNumber}" and "${chapter.id}"`);
    }
    byNumber.set(chapter.number, chapter.id);

    const otherByFile = byFile.get(chapter.source.fileName);
    if (otherByFile !== undefined) {
      issues.push(`source file "${chapter.source.fileName}" is registered by both "${otherByFile}" and "${chapter.id}"`);
    }
    byFile.set(chapter.source.fileName, chapter.id);
  }
  for (const [id, count] of idCounts) {
    if (count > 1) issues.push(`chapter id "${id}" is registered ${count} times`);
  }

  if (issues.length > 0) throw new ChapterRegistryError(issues);
  return [...chapters].sort((a, b) => a.number - b.number);
}
