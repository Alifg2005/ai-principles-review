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

    it('cites a source reference for every question', () => {
      for (const q of chapter.questions) expect(q.sourceReference).toBeDefined();
    });
  });
});
