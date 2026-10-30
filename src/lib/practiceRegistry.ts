import { practiceSetSchema, type PracticeSet } from './practiceSchema';
import type { Chapter } from './schema';

export class PracticeRegistryError extends Error {
  readonly issues: string[];
  constructor(issues: string[]) {
    super(`Invalid practice registry:\n- ${issues.join('\n- ')}`);
    this.name = 'PracticeRegistryError';
    this.issues = issues;
  }
}

/**
 * Validates practice sets against the schema and the chapter registry, returning them in
 * chapter order. Throws listing every problem; invalid data is never partially accepted.
 */
export function validatePracticeRegistry(raw: readonly unknown[], chapters: readonly Chapter[]): PracticeSet[] {
  const issues: string[] = [];
  const sets: PracticeSet[] = [];

  raw.forEach((entry, index) => {
    const result = practiceSetSchema.safeParse(entry);
    if (!result.success) {
      const label = (entry as { chapterId?: unknown } | null)?.chapterId ?? `entry #${index}`;
      for (const issue of result.error.issues) {
        issues.push(`${String(label)} › ${issue.path.join('.') || '(root)'}: ${issue.message}`);
      }
      return;
    }
    sets.push(result.data);
  });

  const seenChapters = new Set<string>();
  const seenIds = new Set<string>();
  for (const set of sets) {
    if (seenChapters.has(set.chapterId)) issues.push(`chapter "${set.chapterId}" has more than one practice set`);
    seenChapters.add(set.chapterId);

    const chapter = chapters.find((c) => c.id === set.chapterId);
    if (!chapter) {
      issues.push(`practice set references unknown chapter "${set.chapterId}"`);
      continue;
    }
    const prefix = `p${String(chapter.number).padStart(2, '0')}-`;
    for (const q of set.questions) {
      if (seenIds.has(q.id)) issues.push(`question id "${q.id}" is used more than once`);
      seenIds.add(q.id);
      if (!q.id.startsWith(prefix)) issues.push(`question id "${q.id}" must start with "${prefix}"`);
    }
  }

  if (issues.length > 0) throw new PracticeRegistryError(issues);
  const order = (s: PracticeSet) => chapters.find((c) => c.id === s.chapterId)?.number ?? 0;
  return [...sets].sort((a, b) => order(a) - order(b));
}
