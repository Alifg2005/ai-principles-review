import { ArrowLeft, ArrowRight, Check, CircleAlert } from 'lucide-react';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Link } from '../app/Link';
import { QuestionNavigator } from '../components/QuestionNavigator';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { DIFFICULTY_LABEL } from '../lib/format';
import { countAnswered, createQuizReducer, createQuizState, OPTION_LETTERS, pad2 } from '../lib/quiz';
import type { Chapter } from '../lib/schema';
import { ResultsView } from './ResultsView';

interface Props {
  chapter: Chapter;
  attempt: number;
  onRetry: () => void;
}

export function QuizSession({ chapter, attempt, onRetry }: Props) {
  const total = chapter.questions.length;
  const reducer = useMemo(() => createQuizReducer(total), [total]);
  const [state, dispatch] = useReducer(reducer, undefined, createQuizState);
  const [confirming, setConfirming] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);

  useDocumentTitle(`${pad2(chapter.number)} ${chapter.title}`);

  const answered = countAnswered(chapter, state.answers);
  const unanswered = total - answered;
  const question = chapter.questions[state.currentIndex]!;
  const selected = state.answers[question.id];
  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === total - 1;
  const showConfirm = confirming && unanswered > 0;

  useEffect(() => {
    if (showConfirm) confirmRef.current?.focus();
  }, [showConfirm]);

  if (state.status === 'submitted') {
    return <ResultsView chapter={chapter} answers={state.answers} attempt={attempt} onRetry={onRetry} />;
  }

  const requestSubmit = () => {
    if (unanswered > 0) {
      setConfirming(true);
      return;
    }
    dispatch({ type: 'submit' });
    window.scrollTo({ top: 0 });
  };

  const confirmSubmit = () => {
    dispatch({ type: 'submit' });
    window.scrollTo({ top: 0 });
  };

  const goToFirstUnanswered = () => {
    const index = chapter.questions.findIndex((q) => state.answers[q.id] === undefined);
    if (index >= 0) dispatch({ type: 'goto', index });
    setConfirming(false);
  };

  return (
    <div className="lab-grid min-h-[calc(100dvh-4rem)] border-b border-line">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pt-10">
        {/* Chapter header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/#library"
            className="inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Library
          </Link>
          {attempt > 1 && <span className="eyebrow">Attempt {attempt}</span>}
        </div>
        <header className="mt-4 flex items-end gap-4 border-b border-line pb-6 sm:gap-6">
          <span className="font-display text-6xl leading-[0.8] text-accent tabular-nums sm:text-7xl" aria-hidden="true">
            {pad2(chapter.number)}
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Chapter {chapter.number} · Review</p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight break-words sm:text-3xl">{chapter.title}</h1>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-10">
          {/* Question column */}
          <section aria-labelledby="question-counter" className="min-w-0">
            <div className="flex items-center justify-between gap-4">
              <p id="question-counter" className="font-mono text-sm tracking-widest tabular-nums">
                <span className="text-ink">{pad2(state.currentIndex + 1)}</span>
                <span className="text-muted"> / {pad2(total)}</span>
              </p>
              <span className="rounded-full border border-line-strong px-3 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-muted uppercase">
                {DIFFICULTY_LABEL[question.difficulty]}
              </span>
            </div>
            <div
              className="mt-3 h-1 overflow-hidden rounded-full bg-surface-2"
              role="progressbar"
              aria-label="Questions answered"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={answered}
              aria-valuetext={`${answered} of ${total} answered`}
            >
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out-soft"
                style={{ width: `${(answered / total) * 100}%` }}
              />
            </div>

            <fieldset key={question.id} className="mt-8 animate-[rise-in_320ms_var(--ease-out-soft)_both]">
              <legend className="font-display text-[clamp(1.6rem,3.6vw,2.4rem)] leading-[1.15] break-words">
                {question.question}
              </legend>
              <div className="mt-8 grid gap-3">
                {question.options.map((option, i) => {
                  const checked = selected === i;
                  return (
                    <label
                      key={i}
                      className={[
                        'group relative flex min-h-14 cursor-pointer items-start gap-4 rounded-xl border p-4 transition-[background-color,border-color] duration-150',
                        'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent',
                        checked
                          ? 'border-accent bg-accent-soft'
                          : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={i}
                        checked={checked}
                        onChange={() => dispatch({ type: 'select', questionId: question.id, optionIndex: i })}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={[
                          'flex size-7 shrink-0 items-center justify-center rounded-md border font-mono text-xs transition-colors',
                          checked ? 'border-accent bg-accent text-on-accent' : 'border-line-strong text-muted group-hover:text-ink',
                        ].join(' ')}
                      >
                        {checked ? <Check className="size-3.5" strokeWidth={3} /> : OPTION_LETTERS[i]}
                      </span>
                      <span className="pt-0.5 leading-relaxed break-words">
                        <span className="sr-only">Option {OPTION_LETTERS[i]}: </span>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => dispatch({ type: 'previous' })}
                disabled={isFirst}
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Previous
              </button>
              {isLast ? (
                <button type="button" className="btn btn-primary" onClick={requestSubmit}>
                  Submit answers
                  <Check className="size-4" aria-hidden="true" />
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'next' })}>
                  Next
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside aria-label="Quiz progress" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="eyebrow">Question map</h2>
                <p className="font-mono text-xs text-muted tabular-nums">
                  <span className="text-ink">{answered}</span>/{total} answered
                </p>
              </div>
              <div className="mt-4">
                <QuestionNavigator
                  questions={chapter.questions}
                  answers={state.answers}
                  currentIndex={state.currentIndex}
                  onSelect={(index) => dispatch({ type: 'goto', index })}
                />
              </div>
              <div className="mt-4 flex gap-4 font-mono text-[0.65rem] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-ink" aria-hidden="true" /> Answered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm border border-line-strong" aria-hidden="true" /> Open
                </span>
              </div>
              <button type="button" className="btn btn-primary mt-5 w-full" onClick={requestSubmit}>
                Submit answers
              </button>

              {showConfirm && (
                <div
                  ref={confirmRef}
                  tabIndex={-1}
                  role="alertdialog"
                  aria-labelledby="confirm-title"
                  aria-describedby="confirm-desc"
                  className="mt-4 rounded-xl border border-skip bg-skip-soft p-4 outline-none animate-[rise-in_220ms_var(--ease-out-soft)_both]"
                >
                  <p id="confirm-title" className="flex items-center gap-2 font-medium">
                    <CircleAlert className="size-4 text-skip" aria-hidden="true" />
                    {unanswered} {unanswered === 1 ? 'question is' : 'questions are'} unanswered
                  </p>
                  <p id="confirm-desc" className="mt-1 text-sm text-muted">
                    Unanswered questions count as not correct. Submit anyway?
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className="btn btn-ghost !px-4" onClick={goToFirstUnanswered}>
                      Go to first unanswered
                    </button>
                    <button type="button" className="btn btn-primary !px-4" onClick={confirmSubmit}>
                      Submit anyway
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-4 px-1 text-xs leading-relaxed text-muted">
              Answers stay editable until you submit. Correct answers and explanations appear only after submission.
            </p>
          </aside>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Question {state.currentIndex + 1} of {total}. {answered} answered.
        </p>
      </div>
    </div>
  );
}
