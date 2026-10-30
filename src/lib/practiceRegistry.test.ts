import { describe, expect, it } from 'vitest';
import { tree } from './graphLayout';
import { checkConstruction, checkSequence, matchesAccepted, normaliseNotation } from './practiceCheck';
import { PracticeRegistryError, validatePracticeRegistry } from './practiceRegistry';
import type { PracticeSetInput } from './practiceSchema';
import type { Chapter } from './schema';

const chapter = {
  id: 'demo',
  number: 3,
  title: 'Demo',
  description: 'Demo',
  source: { fileName: 'demo.pdf', label: 'Topic 3', pageCount: 10 },
  questions: [],
} as Chapter;

const answer = { short: [{ type: 'p' as const, text: 'Answer' }], shortStatus: 'slide-based' as const };
const base = {
  topic: 'Topic',
  difficulty: 'foundational' as const,
  questionStatus: 'slide-based' as const,
  sourceReference: { section: 'Intro', pages: [1] },
  answer,
};

function makeSet(): PracticeSetInput {
  return {
    chapterId: 'demo',
    questions: [
      { ...base, id: 'p03-01', kind: 'written', answerStyle: 'definition', prompt: 'Define it.' },
      { ...base, id: 'p03-02', kind: 'logic', prompt: 'Write it.', accepted: ['P'] },
    ],
  };
}

function expectInvalid(raw: unknown[], pattern: RegExp) {
  try {
    validatePracticeRegistry(raw, [chapter]);
  } catch (error) {
    expect(error).toBeInstanceOf(PracticeRegistryError);
    expect((error as PracticeRegistryError).issues.join('\n')).toMatch(pattern);
    return;
  }
  throw new Error('expected practice registry to be rejected');
}

const withQuestion = (question: unknown) => {
  const set = makeSet();
  return [{ ...set, questions: [...set.questions, question] }];
};

describe('validatePracticeRegistry', () => {
  it('accepts a valid set', () => {
    expect(validatePracticeRegistry([makeSet()], [chapter])).toHaveLength(1);
  });

  it('rejects an unknown chapter', () => {
    expectInvalid([{ ...makeSet(), chapterId: 'nope' }], /unknown chapter/);
  });

  it('rejects a chapter with two sets', () => {
    expectInvalid([makeSet(), { ...makeSet(), questions: makeSet().questions.map((q) => q) }], /more than one/);
  });

  it('rejects ids from another chapter and malformed ids', () => {
    const set = makeSet();
    set.questions[0] = { ...base, id: 'p09-01', kind: 'written', answerStyle: 'list', prompt: 'x' };
    expectInvalid([set], /must start with "p03-"/);
    expectInvalid(withQuestion({ ...base, id: 'bad', kind: 'draw', prompt: 'x' }), /p03-07/);
  });

  it('rejects a set missing written or practical questions', () => {
    const set = makeSet();
    expectInvalid([{ ...set, questions: [set.questions[0]] }], /practical/);
    expectInvalid([{ ...set, questions: [set.questions[1]] }], /written/);
  });

  it('rejects a missing short answer', () => {
    expectInvalid(
      withQuestion({ ...base, id: 'p03-03', kind: 'written', answerStyle: 'list', prompt: 'x', answer: { short: [] } }),
      /answer\.short/,
    );
  });

  it('rejects an answer with no source label', () => {
    expectInvalid(
      withQuestion({ ...base, id: 'p03-03', kind: 'written', answerStyle: 'list', prompt: 'x', answer: { short: answer.short } }),
      /shortStatus/,
    );
  });

  it('rejects a detailed answer with no label of its own', () => {
    expectInvalid(
      withQuestion({ ...base, id: 'p03-03', kind: 'written', answerStyle: 'list', prompt: 'x', answer: { ...answer, detailed: answer.short } }),
      /detailedStatus/,
    );
  });

  it('requires a corrected answer to show what the slide says', () => {
    expectInvalid(
      withQuestion({
        ...base,
        id: 'p03-03',
        kind: 'written',
        answerStyle: 'list',
        prompt: 'x',
        answer: { ...answer, shortStatus: 'corrected-concept' },
      }),
      /must show what the slide says/,
    );
  });

  it('keeps original worked examples labelled as such', () => {
    expectInvalid(
      withQuestion({ ...base, id: 'p03-03', kind: 'written', answerStyle: 'list', prompt: 'x', questionStatus: 'original-worked-example' }),
      /same label/,
    );
  });

  it('rejects source pages beyond the page count', () => {
    expectInvalid(
      withQuestion({
        ...base,
        id: 'p03-03',
        kind: 'logic',
        prompt: 'x',
        accepted: ['P'],
        sourceReference: { section: 'x', pages: [99] },
      }),
      /exceeds pageCount/,
    );
  });

  it('rejects practical questions without their required reference solution', () => {
    expectInvalid(withQuestion({ ...base, id: 'p03-03', kind: 'draw', prompt: 'x' }), /reference figure/);
    expectInvalid(
      withQuestion({ ...base, id: 'p03-03', kind: 'construct', prompt: 'x', directed: true }),
      /reference figure/,
    );
  });

  it('rejects graphs with unknown nodes', () => {
    const figure = { directed: true, width: 100, height: 100, nodes: [{ id: 'a', label: 'a', x: 1, y: 1 }], edges: [{ from: 'a', to: 'z' }] };
    expectInvalid(
      withQuestion({ ...base, id: 'p03-03', kind: 'draw', prompt: 'x', answer: { ...answer, figure } }),
      /unknown node "z"/,
    );
  });

  it('rejects a sequence whose answer uses tokens that are not offered', () => {
    expectInvalid(
      withQuestion({ ...base, id: 'p03-03', kind: 'sequence', prompt: 'x', tokens: ['A', 'B'], expected: ['A', 'C'], answer: { ...answer, detailed: answer.short, detailedStatus: 'slide-based' } }),
      /not offered/,
    );
  });

  it('rejects a table with no blanks, or an accepted answer outside its options', () => {
    expectInvalid(
      withQuestion({ ...base, id: 'p03-03', kind: 'table', prompt: 'x', columns: ['A'], rows: [[{ given: '1' }]] }),
      /nothing for the student/,
    );
    expectInvalid(
      withQuestion({ ...base, id: 'p03-03', kind: 'table', prompt: 'x', columns: ['A'], rows: [[{ accepted: ['X'], options: ['Y', 'Z'] }]] }),
      /not among the options/,
    );
  });

  it('rejects a completion slot that is not in the figure', () => {
    const figure = { directed: false, width: 100, height: 100, nodes: [{ id: 'a', label: '1', x: 1, y: 1 }], edges: [] };
    expectInvalid(
      withQuestion({
        ...base,
        id: 'p03-03',
        kind: 'complete',
        prompt: 'x',
        figure,
        slots: [{ nodeId: 'q', options: ['A', 'B'], expected: 'A' }],
        answer: { ...answer, figure },
      }),
      /unknown node "q"/,
    );
  });
});

describe('notation', () => {
  it('treats ASCII shortcuts and spacing as the same notation', () => {
    expect(normaliseNotation('forall x P(x) -> ~Q(x)')).toBe(normaliseNotation('∀x P(x) ⇒ ¬Q(x)'));
    expect(normaliseNotation('exists x (A(x) & B(x))')).toBe(normaliseNotation('∃x (A(x) ∧ B(x))'));
    expect(normaliseNotation('P | Q <-> R')).toBe(normaliseNotation('P ∨ Q ⇔ R'));
  });

  it('keeps parentheses, because they can change the meaning', () => {
    expect(normaliseNotation('(P ∧ Q) ∨ R')).not.toBe(normaliseNotation('P ∧ (Q ∨ R)'));
  });

  it('ignores list separators', () => {
    expect(matchesAccepted('a,b ,c', ['A, B, C'])).toBe(true);
  });

  it('never accepts an empty answer', () => {
    expect(matchesAccepted('   ', ['A'])).toBe(false);
  });
});

describe('checkSequence', () => {
  it('reports each position', () => {
    expect(checkSequence(['A', 'C'], ['A', 'B', 'C'])).toEqual({ correct: false, positions: [true, false], matched: 1 });
    expect(checkSequence(['A', 'B'], ['A', 'B']).correct).toBe(true);
  });
});

describe('checkConstruction', () => {
  const reference = tree('A', { A: ['B', 'C'] });
  const node = (label: string) => ({ id: label, label, x: 0, y: 0 });
  const options = { directed: true, compareEdgeLabels: false };

  it('accepts a matching structure regardless of placement or case', () => {
    const result = checkConstruction(
      [node('a'), node('b'), node('c')],
      [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' },
      ],
      reference,
      options,
    );
    expect(result.correct).toBe(true);
  });

  it('reports missing and extra parts', () => {
    const result = checkConstruction([node('A'), node('B'), node('Z')], [{ from: 'B', to: 'A' }], reference, options);
    expect(result.correct).toBe(false);
    expect(result.missingNodes).toEqual(['C']);
    expect(result.extraNodes).toEqual(['Z']);
    expect(result.missingEdges).toEqual(['A → B', 'A → C']);
    expect(result.extraEdges).toEqual(['B → A']);
  });

  it('ignores direction only for undirected graphs', () => {
    const edges = [
      { from: 'B', to: 'A' },
      { from: 'C', to: 'A' },
    ];
    const nodes = [node('A'), node('B'), node('C')];
    expect(checkConstruction(nodes, edges, reference, { directed: false, compareEdgeLabels: false }).correct).toBe(true);
    expect(checkConstruction(nodes, edges, reference, options).correct).toBe(false);
  });

  it('compares edge labels when the exercise uses them', () => {
    const labelled = tree('A', { A: ['B'] }, { costs: { 'A>B': 'is_a' } });
    const nodes = [node('A'), node('B')];
    const check = (label: string) =>
      checkConstruction(nodes, [{ from: 'A', to: 'B', label }], labelled, { directed: true, compareEdgeLabels: true }).correct;
    expect(check('is_a')).toBe(true);
    expect(check('has')).toBe(false);
  });
});
