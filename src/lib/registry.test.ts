import { describe, expect, it } from 'vitest';
import { ChapterRegistryError, findMissingChapterNumbers, validateRegistry } from './registry';
import type { ChapterInput } from './schema';

function makeChapter(overrides: Partial<ChapterInput> = {}, number = 1): ChapterInput {
  const prefix = `ch${String(number).padStart(2, '0')}`;
  return {
    id: `chapter-${number}`,
    number,
    title: `Chapter ${number}`,
    description: 'A test chapter.',
    source: { fileName: `chapter-${number}.pdf`, label: `Topic ${number}`, pageCount: 10 },
    questions: Array.from({ length: 20 }, (_, i) => ({
      id: `${prefix}-q${String(i + 1).padStart(2, '0')}`,
      question: `Question ${i + 1}?`,
      options: ['Alpha', 'Beta', 'Gamma', 'Delta'],
      correctAnswerIndex: i % 4,
      explanation: 'Because of reasons.',
      difficulty: 'foundational' as const,
      sourceReference: { section: 'Intro', pages: [1] },
    })),
    ...overrides,
  };
}

function expectInvalid(raw: unknown[], pattern: RegExp) {
  try {
    validateRegistry(raw);
  } catch (error) {
    expect(error).toBeInstanceOf(ChapterRegistryError);
    expect((error as ChapterRegistryError).issues.join('\n')).toMatch(pattern);
    return;
  }
  throw new Error('expected registry to be rejected');
}

describe('findMissingChapterNumbers', () => {
  it('finds gaps below the highest chapter number, in any input order', () => {
    expect(findMissingChapterNumbers([8, 1, 2, 3, 4, 5, 7])).toEqual([6]);
    expect(findMissingChapterNumbers([1, 4, 9])).toEqual([2, 3, 5, 6, 7, 8]);
  });

  it('reports no gaps for contiguous or empty numbering', () => {
    expect(findMissingChapterNumbers([1, 2, 3])).toEqual([]);
    expect(findMissingChapterNumbers([])).toEqual([]);
  });

  it('closes a gap once the missing chapter is added', () => {
    expect(findMissingChapterNumbers([1, 2, 3, 4, 5, 6, 7, 8])).toEqual([]);
  });
});

describe('validateRegistry', () => {
  it('accepts valid chapters and sorts them by number', () => {
    const result = validateRegistry([makeChapter({}, 3), makeChapter({}, 1)]);
    expect(result.map((c) => c.number)).toEqual([1, 3]);
  });

  it('accepts an empty registry', () => {
    expect(validateRegistry([])).toEqual([]);
  });

  it('rejects a chapter with fewer than 20 questions', () => {
    const chapter = makeChapter();
    expectInvalid([{ ...chapter, questions: chapter.questions.slice(0, 19) }], /questions/);
  });

  it('rejects a question with three options', () => {
    const chapter = makeChapter();
    chapter.questions[0] = { ...chapter.questions[0]!, options: ['A', 'B', 'C'] };
    expectInvalid([chapter], /options/);
  });

  it('rejects an out-of-range answer index', () => {
    const chapter = makeChapter();
    chapter.questions[0] = { ...chapter.questions[0]!, correctAnswerIndex: 4 };
    expectInvalid([chapter], /correctAnswerIndex/);
  });

  it('rejects empty question text and explanations', () => {
    const chapter = makeChapter();
    chapter.questions[0] = { ...chapter.questions[0]!, question: '   ' };
    chapter.questions[1] = { ...chapter.questions[1]!, explanation: '' };
    expectInvalid([chapter], /must not be empty/);
  });

  it('rejects duplicate question ids within a chapter', () => {
    const chapter = makeChapter();
    chapter.questions[1] = { ...chapter.questions[1]!, id: chapter.questions[0]!.id };
    expectInvalid([chapter], /duplicate question id/);
  });

  it('rejects duplicate options within a question', () => {
    const chapter = makeChapter();
    chapter.questions[0] = { ...chapter.questions[0]!, options: ['A', 'B', 'a', 'D'] };
    expectInvalid([chapter], /options must be unique/);
  });

  it('rejects question ids that do not match the chapter number', () => {
    const chapter = makeChapter({}, 2);
    chapter.questions[0] = { ...chapter.questions[0]!, id: 'ch09-q01' };
    expectInvalid([chapter], /must start with "ch02-"/);
  });

  it('rejects source pages beyond the page count', () => {
    const chapter = makeChapter();
    chapter.questions[0] = { ...chapter.questions[0]!, sourceReference: { section: 'X', pages: [99] } };
    expectInvalid([chapter], /exceeds pageCount/);
  });

  it('rejects duplicate registrations of the same chapter', () => {
    const chapter = makeChapter();
    expectInvalid([chapter, chapter], /registered 2 times/);
  });

  it('rejects two chapters sharing a number', () => {
    const a = makeChapter({}, 1);
    const b = { ...makeChapter({}, 1), id: 'other', source: { ...a.source, fileName: 'other.pdf' } };
    expectInvalid([a, b], /chapter number 1 is used by both/);
  });

  it('rejects two chapters sharing a source file', () => {
    const a = makeChapter({}, 1);
    const b = makeChapter({ source: { ...a.source } }, 2);
    expectInvalid([a, b], /source file/);
  });

  it('rejects invalid metadata', () => {
    expectInvalid([makeChapter({ id: 'Not A Slug' })], /kebab-case/);
    expectInvalid([makeChapter({ number: 0 })], /number/);
  });
});
