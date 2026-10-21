import { describe, expect, it } from 'vitest';
import { countAnswered, createQuizReducer, createQuizState, pad2, scoreQuiz, type QuizState } from './quiz';

const questions = Array.from({ length: 4 }, (_, i) => ({
  id: `ch01-q0${i + 1}`,
  question: `Q${i + 1}`,
  options: ['a', 'b', 'c', 'd'],
  correctAnswerIndex: i,
  explanation: 'x',
  difficulty: 'foundational' as const,
}));
const chapter = { questions };
const reduce = createQuizReducer(questions.length);

describe('quizReducer', () => {
  it('records and changes answers by question id', () => {
    let s = reduce(createQuizState(), { type: 'select', questionId: 'ch01-q01', optionIndex: 2 });
    s = reduce(s, { type: 'select', questionId: 'ch01-q01', optionIndex: 0 });
    expect(s.answers).toEqual({ 'ch01-q01': 0 });
  });

  it('navigates and clamps to the question range', () => {
    let s = reduce(createQuizState(), { type: 'previous' });
    expect(s.currentIndex).toBe(0);
    s = reduce(s, { type: 'next' });
    s = reduce(s, { type: 'next' });
    expect(s.currentIndex).toBe(2);
    s = reduce(s, { type: 'goto', index: 99 });
    expect(s.currentIndex).toBe(3);
    s = reduce(s, { type: 'next' });
    expect(s.currentIndex).toBe(3);
  });

  it('keeps answers while navigating', () => {
    let s = reduce(createQuizState(), { type: 'select', questionId: 'ch01-q01', optionIndex: 1 });
    s = reduce(s, { type: 'next' });
    s = reduce(s, { type: 'previous' });
    expect(s.answers['ch01-q01']).toBe(1);
  });

  it('freezes the attempt after submission', () => {
    const submitted: QuizState = reduce(createQuizState(), { type: 'submit' });
    expect(submitted.status).toBe('submitted');
    const after = reduce(submitted, { type: 'select', questionId: 'ch01-q01', optionIndex: 3 });
    expect(after).toBe(submitted);
    expect(reduce(submitted, { type: 'submit' })).toBe(submitted);
  });
});

describe('scoreQuiz', () => {
  it('scores correct, incorrect and unanswered deterministically', () => {
    const answers = { 'ch01-q01': 0, 'ch01-q02': 3, 'ch01-q03': 2 };
    const r = scoreQuiz(chapter, answers);
    expect(r).toMatchObject({ total: 4, correct: 2, incorrect: 1, unanswered: 1, percentage: 50 });
    expect(r.items.map((i) => i.outcome)).toEqual(['correct', 'incorrect', 'correct', 'unanswered']);
    expect(scoreQuiz(chapter, answers)).toEqual(r);
  });

  it('handles a perfect score and an empty attempt', () => {
    expect(scoreQuiz(chapter, { 'ch01-q01': 0, 'ch01-q02': 1, 'ch01-q03': 2, 'ch01-q04': 3 }).percentage).toBe(100);
    expect(scoreQuiz(chapter, {})).toMatchObject({ correct: 0, unanswered: 4, percentage: 0 });
  });

  it('treats answer index 0 as answered', () => {
    expect(scoreQuiz(chapter, { 'ch01-q02': 0 }).items[1]!.outcome).toBe('incorrect');
  });

  it('rounds the percentage', () => {
    const three = { questions: questions.slice(0, 3) };
    expect(scoreQuiz(three, { 'ch01-q01': 0 }).percentage).toBe(33);
    expect(scoreQuiz(three, { 'ch01-q01': 0, 'ch01-q02': 1 }).percentage).toBe(67);
  });
});

describe('helpers', () => {
  it('counts answered questions', () => {
    expect(countAnswered(chapter, { 'ch01-q01': 0, 'ch01-q04': 1 })).toBe(2);
  });
  it('pads numbers to two digits', () => {
    expect(pad2(1)).toBe('01');
    expect(pad2(20)).toBe('20');
  });
});
