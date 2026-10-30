import { ArrowLeft, ArrowRight, PenLine, Spline } from 'lucide-react';
import { Link } from '../app/Link';
import { practicePath, practiceQuestionPath } from '../app/router';
import { AnswerPanel } from '../components/practice/AnswerPanel';
import { Blocks } from '../components/practice/Blocks';
import { ConstructExercise } from '../components/practice/ConstructExercise';
import { DrawExercise } from '../components/practice/DrawExercise';
import {
  CompleteExercise,
  LogicExercise,
  SequenceExercise,
  TableExercise,
  WrittenDraft,
} from '../components/practice/exercises';
import { GraphFigure } from '../components/practice/GraphFigure';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getChapter } from '../lib/chapters';
import { DIFFICULTY_LABEL } from '../lib/format';
import { getPracticeSet, isWritten, KIND_LABEL } from '../lib/practice';
import type { PracticeQuestion } from '../lib/practiceSchema';
import { pad2 } from '../lib/quiz';
import { NotFoundPage } from './NotFoundPage';

function Exercise({ question }: { question: PracticeQuestion }) {
  switch (question.kind) {
    case 'written':
      return <WrittenDraft id={question.id} />;
    case 'sequence':
      return <SequenceExercise question={question} />;
    case 'table':
      return <TableExercise question={question} />;
    case 'complete':
      return <CompleteExercise question={question} />;
    case 'construct':
      return <ConstructExercise question={question} />;
    case 'logic':
      return <LogicExercise question={question} />;
    case 'draw':
      return <DrawExercise id={question.id} />;
  }
}

export function PracticeQuestionPage({ chapterId, questionId }: { chapterId: string; questionId: string }) {
  const chapter = getChapter(chapterId);
  const set = getPracticeSet(chapterId);
  const index = set?.questions.findIndex((q) => q.id === questionId) ?? -1;
  const question = set?.questions[index];
  useDocumentTitle(question ? `${question.topic}: Written & Practical` : 'Question not found');

  if (!chapter || !set || !question) {
    return <NotFoundPage title="Question not found" message="This question does not exist or may have moved." />;
  }

  const previous = set.questions[index - 1];
  const next = set.questions[index + 1];
  const Icon = isWritten(question) ? PenLine : Spline;
  // Sequence and completion exercises render their own interactive copy of the figure.
  const showsFigure = question.figure && question.kind !== 'sequence' && question.kind !== 'complete';

  return (
    <div className="lab-grid min-h-[calc(100dvh-4rem)] border-b border-line">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 md:pt-10">
        <Link
          to={practicePath(chapterId)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
          {pad2(chapter.number)} {chapter.title}
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10">
          <article className="min-w-0 animate-[rise-in_260ms_var(--ease-out-soft)_both]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-sm tracking-widest tabular-nums">
                <span className="text-ink">{pad2(index + 1)}</span>
                <span className="text-muted"> / {pad2(set.questions.length)}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-on-accent">
                  <Icon className="size-3.5" aria-hidden="true" />
                  {isWritten(question) ? 'Written' : 'Practical'}
                </span>
                <span className="rounded-full border border-line-strong px-3 py-1 text-muted">
                  {DIFFICULTY_LABEL[question.difficulty]}
                </span>
              </div>
            </div>
            <p className="eyebrow mt-5">
              {question.topic}
              {isWritten(question) ? '' : ` · ${KIND_LABEL[question.kind]}`}
            </p>
            <h1 className="mt-2 font-display text-[clamp(1.5rem,3.2vw,2.15rem)] leading-[1.18] break-words">
              {question.prompt}
            </h1>

            {question.context && (
              <div className="mt-4">
                <Blocks blocks={question.context} />
              </div>
            )}
            {showsFigure && question.figure && (
              <div className="mt-4 rounded-xl border border-line bg-surface p-3">
                <GraphFigure graph={question.figure} title="Figure for this question" />
              </div>
            )}

            {question.traceRules && (
              <dl className="mt-4 rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed">
                <dt className="eyebrow">Order and ties</dt>
                <dd className="mt-0.5 mb-2">{question.traceRules.order}</dd>
                <dt className="eyebrow">Goal test</dt>
                <dd className="mt-0.5">{question.traceRules.goalTest}</dd>
              </dl>
            )}

            <div className="mt-6">
              <Exercise question={question} />
            </div>
            <AnswerPanel question={question} />

            <nav
              aria-label="Question navigation"
              className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6"
            >
              {previous ? (
                <Link to={practiceQuestionPath(chapterId, previous.id)} className="btn btn-ghost">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Previous
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link to={practiceQuestionPath(chapterId, next.id)} className="btn btn-ghost">
                  Next
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : (
                <Link to={practicePath(chapterId)} className="btn btn-ghost">
                  All questions
                </Link>
              )}
            </nav>
          </article>

          <aside aria-label="Chapter questions" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <h2 className="eyebrow">Questions</h2>
              <ol className="mt-3 grid grid-cols-5 gap-2">
                {set.questions.map((q, i) => (
                  <li key={q.id}>
                    <Link
                      to={practiceQuestionPath(chapterId, q.id)}
                      aria-current={q.id === question.id ? 'step' : undefined}
                      aria-label={`Question ${i + 1}, ${isWritten(q) ? 'written' : 'practical'}: ${q.topic}`}
                      className={[
                        'flex aspect-square min-h-11 w-full items-center justify-center rounded-lg border border-line-strong font-mono text-xs tabular-nums transition-colors hover:border-ink',
                        isWritten(q) ? '' : 'bg-surface-2',
                        q.id === question.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : '',
                      ].join(' ')}
                    >
                      {pad2(i + 1)}
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="mt-3 flex gap-4 font-mono text-[0.65rem] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm border border-line-strong" aria-hidden="true" /> Written
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm border border-line-strong bg-surface-2" aria-hidden="true" />{' '}
                  Practical
                </span>
              </div>
            </div>
          </aside>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Question {index + 1} of {set.questions.length}: {question.topic}.
        </p>
      </div>
    </div>
  );
}
