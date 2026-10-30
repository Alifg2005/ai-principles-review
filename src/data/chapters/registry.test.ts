/**
 * Content gate for every registered chapter. Runs as `npm run validate` and
 * before every production build, so invalid quiz data can never ship.
 */
import { readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateRegistry } from '../../lib/registry';
import { OPTIONS_PER_QUESTION, QUESTIONS_PER_CHAPTER } from '../../lib/schema';
import { chapterRegistry } from './index';

const chapters = validateRegistry(chapterRegistry);

describe('canonical chapter registry', () => {
  it('passes schema and cross-chapter validation', () => {
    expect(() => validateRegistry(chapterRegistry)).not.toThrow();
  });

  it('registers every chapter data file exactly once', () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const dataFiles = readdirSync(dir).filter((f) => /^\d{2}-[a-z0-9-]+\.ts$/.test(f));
    expect(dataFiles.length).toBe(chapterRegistry.length);
  });

  it('has globally unique question ids', () => {
    const ids = chapters.flatMap((c) => c.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ch08-q15 defines the Mentors argument order and keys the "mentored by" reading', () => {
    const q = chapters.flatMap((c) => c.questions).find((item) => item.id === 'ch08-q15');
    expect(q).toBeDefined();
    expect(q!.question).toContain('Mentors(a, b) means "a mentors b"');
    expect(q!.question).toContain('∀x ∃y Mentors(y, x)');
    expect(q!.options[q!.correctAnswerIndex]).toBe('Every person is mentored by at least one person');
    // The argument-swapped reading must be offered as a distractor, not as the key.
    expect(q!.options).toContain('Every person mentors at least one person');
    expect(q!.explanation).toMatch(/y is the mentor and x is the one mentored/);
  });

  it('keeps the questions that gained a clarification unchanged', () => {
    const all = chapters.flatMap((c) => c.questions);
    const q14 = all.find((item) => item.id === 'ch05-q14')!;
    expect(q14.question).toBe('In the standard summary of A* properties, when is A* optimal?');
    expect(q14.options[q14.correctAnswerIndex]).toBe('When an admissible heuristic is used');
    expect(q14.correctAnswerIndex).toBe(3);
    const q08 = all.find((item) => item.id === 'ch08-q08')!;
    expect(q08.question).toBe('In this course, a well-formed formula (sentence) in FOL is one that…');
    expect(q08.options[q08.correctAnswerIndex]).toBe('contains no free variables');
    expect(q08.correctAnswerIndex).toBe(2);
  });

  it('keeps ch05-q18 unchanged apart from its clarification', () => {
    const q18 = chapters.flatMap((c) => c.questions).find((item) => item.id === 'ch05-q18')!;
    expect(q18.question).toBe(
      'In the comparison of uninformed and informed strategies, which pair are both complete and optimal?',
    );
    expect(q18.options).toEqual(['DFS and greedy best-first search', 'Greedy best-first search and A*', 'DFS and IDS', 'BFS and A*']);
    expect(q18.correctAnswerIndex).toBe(3);
    expect(q18.explanation).toBe(
      'The comparison table marks BFS (with equal step costs), IDS and A* as complete and optimal. DFS and greedy best-first search are neither.',
    );
  });

  it('states the conditions behind A* in the ch05-q18 clarification', () => {
    const text = chapters.flatMap((c) => c.questions).find((item) => item.id === 'ch05-q18')?.clarification ?? '';
    for (const phrase of [
      'assumes the relevant search conditions',
      'finite branching factor',
      'positive lower bound on step costs',
      'admissibility is sufficient for tree search',
      'without reopening closed nodes generally requires consistency',
      'additional background',
    ]) {
      expect(text).toContain(phrase);
    }
  });

  it('adds clarifications only to the intended questions', () => {
    const ids = chapters.flatMap((c) => c.questions).filter((q) => q.clarification).map((q) => q.id);
    expect(ids.sort()).toEqual(['ch05-q14', 'ch05-q18', 'ch08-q08']);
  });

  it('clarifies A* conditions and the wff convention without implying otherwise', () => {
    const clarification = (id: string) => chapters.flatMap((c) => c.questions).find((q) => q.id === id)?.clarification ?? '';
    for (const phrase of ['tree search', 'Graph search', 'consistent', 'not unconditional']) {
      expect(clarification('ch05-q14')).toContain(phrase);
    }
    for (const phrase of ['stricter convention', 'use that answer here', 'closed formula', 'free variables']) {
      expect(clarification('ch08-q08')).toContain(phrase);
    }
  });

  describe.each(chapters.map((c) => [c.id, c] as const))('%s', (_id, chapter) => {
    it(`has exactly ${QUESTIONS_PER_CHAPTER} questions with ${OPTIONS_PER_QUESTION} options each`, () => {
      expect(chapter.questions).toHaveLength(QUESTIONS_PER_CHAPTER);
      for (const q of chapter.questions) {
        expect(q.options).toHaveLength(OPTIONS_PER_QUESTION);
        expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswerIndex).toBeLessThan(OPTIONS_PER_QUESTION);
        expect(q.explanation.trim().length).toBeGreaterThan(20);
      }
    });

    it('spreads correct answers across positions (each used 3–7 times)', () => {
      const counts = [0, 0, 0, 0];
      for (const q of chapter.questions) counts[q.correctAnswerIndex]! += 1;
      for (const c of counts) {
        expect(c).toBeGreaterThanOrEqual(3);
        expect(c).toBeLessThanOrEqual(7);
      }
    });

    it('never has three identical answer positions in a row', () => {
      const keys = chapter.questions.map((q) => q.correctAnswerIndex);
      for (let i = 2; i < keys.length; i++) {
        expect(keys[i] === keys[i - 1] && keys[i] === keys[i - 2]).toBe(false);
      }
    });

    it('mixes difficulty levels', () => {
      const levels = new Set(chapter.questions.map((q) => q.difficulty));
      expect(levels.size).toBeGreaterThanOrEqual(2);
    });

    it('ships no source metadata', () => {
      expect(Object.keys(chapter.source)).toEqual(['label']);
      for (const q of chapter.questions) expect(q).not.toHaveProperty('sourceReference');
      expect(JSON.stringify(chapter)).not.toMatch(/\.pdf|\bslides?\b|extraction/i);
    });
  });
});
