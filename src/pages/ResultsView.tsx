import { BookOpen, Check, Minus, RotateCcw, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ButtonHTMLAttributes } from 'react';
import { Link } from '../app/Link';
import { ScoreRing } from '../components/ScoreRing';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatSource, verdict } from '../lib/format';
import { OPTION_LETTERS, pad2, scoreQuiz, type Answers, type QuestionOutcome, type QuestionResult } from '../lib/quiz';
import type { Chapter } from '../lib/schema';

interface Props {
  chapter: Chapter;
  answers: Answers;
  attempt: number;
  onRetry: () => void;
}

type Filter = 'all' | 'missed';

export function ResultsView({ chapter, answers, attempt, onRetry }: Props) {
  const result = useMemo(() => scoreQuiz(chapter, answers), [chapter, answers]);
  const [filter, setFilter] = useState<Filter>('all');
  const headingRef = useRef<HTMLHeadingElement>(null);

  useDocumentTitle(`Results: ${pad2(chapter.number)} ${chapter.title}`);

  // Move focus to the results so keyboard and screen-reader users land on them.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const missedCount = result.incorrect + result.unanswered;
  const visible = filter === 'all' ? result.items : result.items.filter((i) => i.outcome !== 'correct');

  return (
    <div>
      <section className="lab-grid border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-14 sm:px-6 md:grid-cols-[1fr_auto] md:items-center md:pt-14">
          <div>
            <p className="eyebrow">
              Results · Chapter {chapter.number}
              {attempt > 1 ? ` · Attempt ${attempt}` : ''}
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-4 font-display text-[clamp(4rem,14vw,8.5rem)] leading-[0.85] tabular-nums outline-none"
            >
              <span className="sr-only">You scored </span>
              {result.correct}
              <span className="text-muted"> / {result.total}</span>
            </h1>
            <p className="mt-4 text-xl text-ink">{verdict(result.percentage)}</p>
            <p className="mt-1 text-muted">{chapter.title}</p>

            <dl className="mt-8 flex flex-wrap gap-3">
              <Tally label="Correct" value={result.correct} outcome="correct" />
              <Tally label="Incorrect" value={result.incorrect} outcome="incorrect" />
              {result.unanswered > 0 && <Tally label="Unanswered" value={result.unanswered} outcome="unanswered" />}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary" onClick={onRetry}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Retry chapter
              </button>
              <Link to="/#library" className="btn btn-ghost">
                <BookOpen className="size-4" aria-hidden="true" />
                Back to library
              </Link>
            </div>
          </div>

          <figure className="mx-auto w-full max-w-[15rem] md:mx-0">
            <ScoreRing outcomes={result.items.map((i) => i.outcome)} percentage={result.percentage} />
            <figcaption className="mt-3 text-center font-mono text-[0.65rem] tracking-wider text-muted">
              {result.percentage}% · one segment per question
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="review-title" className="mx-auto max-w-4xl px-4 pt-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Answer review</p>
            <h2 id="review-title" className="mt-2 font-display text-4xl sm:text-5xl">
              Question by question
            </h2>
          </div>
          <div role="group" aria-label="Filter questions" className="inline-flex rounded-full border border-line-strong p-1">
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
              All ({result.total})
            </FilterButton>
            <FilterButton active={filter === 'missed'} onClick={() => setFilter('missed')} disabled={missedCount === 0}>
              Missed ({missedCount})
            </FilterButton>
          </div>
        </div>

        <ol className="mt-8 space-y-4">
          {visible.map((item) => (
            <ReviewItem key={item.question.id} item={item} number={chapter.questions.indexOf(item.question) + 1} />
          ))}
        </ol>
      </section>
    </div>
  );
}

const OUTCOME_META: Record<QuestionOutcome, { label: string; icon: typeof Check; badge: string; tally: string }> = {
  correct: { label: 'Correct', icon: Check, badge: 'bg-correct-soft text-correct', tally: 'border-correct text-correct' },
  incorrect: { label: 'Incorrect', icon: X, badge: 'bg-wrong-soft text-wrong', tally: 'border-wrong text-wrong' },
  unanswered: { label: 'Unanswered', icon: Minus, badge: 'bg-skip-soft text-skip', tally: 'border-skip text-skip' },
};

function Tally({ label, value, outcome }: { label: string; value: number; outcome: QuestionOutcome }) {
  const { icon: Icon, tally } = OUTCOME_META[outcome];
  return (
    <div className={`flex items-center gap-3 rounded-full border bg-surface px-4 py-2 ${tally}`}>
      <Icon className="size-4" aria-hidden="true" />
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-mono text-sm font-medium text-ink tabular-nums">{value}</dd>
    </div>
  );
}

function FilterButton({
  active,
  children,
  ...rest
}: { active: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`min-h-11 rounded-full px-4 text-sm transition-colors disabled:opacity-40 ${active ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}
      {...rest}
    >
      {children}
    </button>
  );
}

function ReviewItem({ item, number }: { item: QuestionResult; number: number }) {
  const { question, selectedIndex, outcome } = item;
  const meta = OUTCOME_META[outcome];
  const Icon = meta.icon;

  return (
    <li id={`review-${question.id}`} className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-sm text-muted tabular-nums">Q{pad2(number)}</span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${meta.badge}`}>
          <Icon className="size-3.5" aria-hidden="true" strokeWidth={2.5} />
          {meta.label}
        </span>
      </div>
      <h3 className="mt-3 text-lg leading-snug font-medium break-words sm:text-xl">{question.question}</h3>

      <ul className="mt-5 grid gap-2" aria-label="Options">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctAnswerIndex;
          const isSelected = i === selectedIndex;
          const tone = isCorrect
            ? 'border-correct bg-correct-soft'
            : isSelected
              ? 'border-wrong bg-wrong-soft'
              : 'border-line';
          return (
            <li key={i} className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm ${tone}`}>
              <span className="mt-px font-mono text-xs text-muted">{OPTION_LETTERS[i]}</span>
              <span className="flex-1 break-words">{option}</span>
              <span className="flex shrink-0 flex-col items-end gap-1 font-mono text-[0.62rem] tracking-wider uppercase">
                {isSelected && <span className={isCorrect ? 'text-correct' : 'text-wrong'}>Your answer</span>}
                {isCorrect && <span className="text-correct">Correct answer</span>}
              </span>
            </li>
          );
        })}
      </ul>
      {selectedIndex === null && (
        <p className="mt-3 text-sm text-skip">You did not answer this question.</p>
      )}

      <div className="mt-5 border-l-2 border-accent pl-4">
        <p className="text-[0.95rem] leading-relaxed">{question.explanation}</p>
        {question.sourceReference && (
          <p className="mt-2 font-mono text-xs text-muted">Source: {formatSource(question.sourceReference)}</p>
        )}
      </div>
    </li>
  );
}
