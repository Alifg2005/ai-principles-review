import type { Chapter, Question } from './schema';

/** Selected option index keyed by stable question id. */
export type Answers = Readonly<Record<string, number>>;

export interface QuizState {
  readonly currentIndex: number;
  readonly answers: Answers;
  readonly status: 'in-progress' | 'submitted';
}

export type QuizAction =
  | { type: 'select'; questionId: string; optionIndex: number }
  | { type: 'goto'; index: number }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'submit' };

export function createQuizState(): QuizState {
  return { currentIndex: 0, answers: {}, status: 'in-progress' };
}

/** Builds a pure reducer for a quiz with `total` questions. */
export function createQuizReducer(total: number) {
  const clamp = (i: number) => Math.min(Math.max(i, 0), Math.max(total - 1, 0));
  return (state: QuizState, action: QuizAction): QuizState => {
    // Once submitted, the attempt is frozen; a retry creates a fresh state.
    if (state.status === 'submitted') return state;
    switch (action.type) {
      case 'select':
        return { ...state, answers: { ...state.answers, [action.questionId]: action.optionIndex } };
      case 'goto':
        return { ...state, currentIndex: clamp(action.index) };
      case 'next':
        return { ...state, currentIndex: clamp(state.currentIndex + 1) };
      case 'previous':
        return { ...state, currentIndex: clamp(state.currentIndex - 1) };
      case 'submit':
        return { ...state, status: 'submitted' };
    }
  };
}

export type QuestionOutcome = 'correct' | 'incorrect' | 'unanswered';

export interface QuestionResult {
  readonly question: Question;
  readonly selectedIndex: number | null;
  readonly outcome: QuestionOutcome;
}

export interface QuizResult {
  readonly total: number;
  readonly correct: number;
  readonly incorrect: number;
  readonly unanswered: number;
  /** Whole-number percentage, rounded half up. */
  readonly percentage: number;
  readonly items: readonly QuestionResult[];
}

/** Deterministically scores answers against the validated answer key. */
export function scoreQuiz(chapter: Pick<Chapter, 'questions'>, answers: Answers): QuizResult {
  const items = chapter.questions.map((question): QuestionResult => {
    const selectedIndex = answers[question.id] ?? null;
    const outcome: QuestionOutcome =
      selectedIndex === null ? 'unanswered' : selectedIndex === question.correctAnswerIndex ? 'correct' : 'incorrect';
    return { question, selectedIndex, outcome };
  });
  const count = (o: QuestionOutcome) => items.filter((i) => i.outcome === o).length;
  const total = items.length;
  const correct = count('correct');
  return {
    total,
    correct,
    incorrect: count('incorrect'),
    unanswered: count('unanswered'),
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    items,
  };
}

export function countAnswered(chapter: Pick<Chapter, 'questions'>, answers: Answers): number {
  return chapter.questions.filter((q) => answers[q.id] !== undefined).length;
}

/** Two-digit display index, e.g. 1 → "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;
