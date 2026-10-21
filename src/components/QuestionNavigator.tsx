import { pad2, type Answers } from '../lib/quiz';
import type { Question } from '../lib/schema';

interface Props {
  questions: readonly Question[];
  answers: Answers;
  currentIndex: number;
  onSelect: (index: number) => void;
}

/** Grid of all questions showing answered / unanswered / current state. */
export function QuestionNavigator({ questions, answers, currentIndex, onSelect }: Props) {
  return (
    <ol className="grid grid-cols-5 gap-2" aria-label="Question navigator">
      {questions.map((q, i) => {
        const answered = answers[q.id] !== undefined;
        const current = i === currentIndex;
        const state = answered ? 'answered' : 'unanswered';
        return (
          <li key={q.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={current ? 'step' : undefined}
              aria-label={`Question ${i + 1}, ${state}${current ? ', current' : ''}`}
              className={[
                'flex aspect-square w-full min-h-11 items-center justify-center rounded-lg border font-mono text-xs tabular-nums transition-[background-color,border-color,color,transform] duration-150 active:scale-95',
                answered
                  ? 'border-ink bg-ink text-bg'
                  : 'border-line-strong text-muted hover:border-ink hover:text-ink',
                current ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : '',
              ].join(' ')}
            >
              {pad2(i + 1)}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
