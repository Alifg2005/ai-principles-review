import { ChevronDown, Eye, EyeOff, TriangleAlert } from 'lucide-react';
import { usePracticeWork } from '../../hooks/usePracticeWork';
import { isWritten, STATUS_LABEL, STATUS_MEANING } from '../../lib/practice';
import type { PracticeQuestion, SourceStatus } from '../../lib/practiceSchema';
import { Blocks, DataTable } from './Blocks';
import { GraphFigure } from './GraphFigure';

const STATUS_TONE: Record<SourceStatus, string> = {
  'course-concept': 'border-line-strong text-muted',
  'additional-clarification': 'border-accent bg-accent-soft text-ink',
  'original-worked-example': 'border-line-strong bg-surface-2 text-ink',
};

export function StatusLabel({ status }: { status: SourceStatus }) {
  return (
    <span
      title={STATUS_MEANING[status]}
      className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] tracking-wide ${STATUS_TONE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function SectionHeading({ title, status }: { title: string; status: SourceStatus }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <h3 className="eyebrow">{title}</h3>
      <StatusLabel status={status} />
    </div>
  );
}

/**
 * Reveals the model answer. The short answer always comes first; the detailed answer stays
 * behind its own button, so nobody has to read more than they want to. Every section carries
 * its own label, because one answer can combine core material with clarification.
 */
export function AnswerPanel({ question }: { question: PracticeQuestion }) {
  const [revealed, setRevealed] = usePracticeWork(`${question.id}:revealed`, false);
  const [detailOpen, setDetailOpen] = usePracticeWork(`${question.id}:detail`, false);
  const { answer, mixUp } = question;
  const written = isWritten(question);
  const noun = written ? 'model answer' : 'reference solution';
  const detailId = `${question.id}-detail`;
  const hasDetail = Boolean(answer.detailed || answer.more);

  return (
    <section aria-label={written ? 'Model answer' : 'Reference solution'} className="mt-6">
      <button type="button" className="btn btn-primary" aria-expanded={revealed} onClick={() => setRevealed(!revealed)}>
        {revealed ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        {revealed ? `Hide ${noun}` : `Reveal ${noun}`}
      </button>

      {revealed && (
        <div className="mt-4 rounded-2xl border border-accent bg-surface p-5 animate-[rise-in_220ms_var(--ease-out-soft)_both] sm:p-6">
          <SectionHeading title="Short answer" status={answer.shortStatus} />
          <div className="mt-3">
            <Blocks blocks={answer.short} />
          </div>

          {mixUp && (
            <div className="mt-5 rounded-xl border border-skip bg-skip-soft p-4 text-sm leading-relaxed">
              <div className="flex items-center gap-2">
                <TriangleAlert className="size-4 shrink-0 text-skip" aria-hidden="true" />
                <h3 className="font-medium">Common mix-up</h3>
              </div>
              <p className="mt-2">{mixUp}</p>
            </div>
          )}

          {answer.figure && (
            <figure className="mt-5 rounded-xl border border-line p-3">
              <figcaption className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="eyebrow">Reference diagram</span>
                <StatusLabel status={question.questionStatus} />
              </figcaption>
              <GraphFigure graph={answer.figure} title="Reference diagram" />
            </figure>
          )}

          {answer.steps && (
            <div className="mt-5">
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="eyebrow">Step by step</span>
                <StatusLabel status={question.questionStatus} />
              </div>
              <DataTable table={answer.steps} />
            </div>
          )}

          {hasDetail && (
            <div className="mt-5 border-t border-line pt-4">
              <button
                type="button"
                className="btn btn-ghost"
                aria-expanded={detailOpen}
                aria-controls={detailId}
                onClick={() => setDetailOpen(!detailOpen)}
              >
                {detailOpen ? 'Hide detailed answer' : 'Show detailed answer'}
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${detailOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {detailOpen && (
                <div id={detailId} className="mt-4 space-y-5">
                  {answer.detailed && answer.detailedStatus && (
                    <div className="border-l-2 border-accent pl-4">
                      <SectionHeading title="Detail" status={answer.detailedStatus} />
                      <div className="mt-2">
                        <Blocks blocks={answer.detailed} />
                      </div>
                    </div>
                  )}
                  {answer.more?.map((section, i) => (
                    <div key={i} className="border-l-2 border-accent pl-4">
                      <SectionHeading title="Further detail" status={section.status} />
                      <div className="mt-2">
                        <Blocks blocks={section.blocks} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
            <span>Question:</span>
            <StatusLabel status={question.questionStatus} />
          </div>
          <details className="mt-3 text-xs text-muted">
            <summary className="inline-flex min-h-11 cursor-pointer items-center">What do these labels mean?</summary>
            <dl className="mt-1 space-y-1">
              {(Object.keys(STATUS_LABEL) as SourceStatus[]).map((status) => (
                <div key={status}>
                  <dt className="inline font-medium text-ink">{STATUS_LABEL[status]}: </dt>
                  <dd className="inline">{STATUS_MEANING[status]}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      )}
    </section>
  );
}
