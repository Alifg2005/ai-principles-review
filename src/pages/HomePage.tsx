import { ArrowDown, ArrowRight, Info, TriangleAlert } from 'lucide-react';
import { Link } from '../app/Link';
import { chapterPath } from '../app/router';
import { ChapterRow } from '../components/ChapterRow';
import { NeuralFigure } from '../components/NeuralFigure';
import { siteConfig } from '../config/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { chapters, missingChapterNumbers, registryError, totalQuestions } from '../lib/chapters';
import { missingChaptersNote } from '../lib/format';
import { pad2 } from '../lib/quiz';

export function HomePage() {
  useDocumentTitle();
  const { course, author } = siteConfig;
  const first = chapters[0];
  const gapNote = missingChaptersNote(missingChapterNumbers);

  return (
    <>
      <section className="lab-grid relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-16 sm:px-6 md:pt-20 lg:grid-cols-12 lg:gap-8 lg:pb-24">
          <div className="lg:col-span-7">
            <p className="eyebrow animate-[rise-in_500ms_var(--ease-out-soft)_both]">
              {course.code ? `${course.code} · ` : ''}Course review
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] tracking-[-0.01em] animate-[rise-in_600ms_var(--ease-out-soft)_60ms_both]">
              Review AI Principles, Chapter by Chapter.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted animate-[rise-in_600ms_var(--ease-out-soft)_120ms_both]">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-[rise-in_600ms_var(--ease-out-soft)_180ms_both]">
              <Link to="/#library" className="btn btn-primary">
                Browse chapters
                <ArrowDown className="size-4" aria-hidden="true" />
              </Link>
              {first && (
                <Link to={chapterPath(first.id)} className="btn btn-ghost">
                  Start with chapter {pad2(first.number)}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              )}
            </div>

            <dl className="mt-12 grid max-w-xl gap-x-8 gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="eyebrow">Course</dt>
                <dd className="mt-1 text-ink">{course.title}</dd>
              </div>
              {author && (
                <div>
                  <dt className="eyebrow">Prepared by</dt>
                  <dd className="mt-1 text-ink">{author}</dd>
                </div>
              )}
            </dl>
          </div>

          <figure className="relative self-end rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_0_var(--line),0_24px_48px_-32px_rgb(0_0_0/0.35)] sm:p-6 lg:col-span-5">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Fig. 01</span>
              <span className="font-mono text-[0.65rem] text-muted">f : P* → A</span>
            </div>
            <div className="mt-4">
              <NeuralFigure />
            </div>
            <figcaption className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-muted">
              An agent maps everything it has perceived to its next action. Each chapter here examines one part of that
              mapping.
            </figcaption>
            <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-xl border border-line text-center">
              <Stat label="Chapters" value={pad2(chapters.length)} />
              <Stat label="Questions" value={String(totalQuestions)} />
              <Stat label="Per review" value="20" />
            </dl>
          </figure>
        </div>
      </section>

      <section id="library" aria-labelledby="library-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16 sm:px-6 md:pt-24">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">Index</p>
            <h2 id="library-title" className="mt-3 font-display text-5xl leading-none sm:text-6xl">
              Chapter library
            </h2>
          </div>
          <div className="max-w-sm space-y-2 md:text-right">
            <p className="text-sm text-muted" aria-live="polite">
              <span className="font-mono text-ink">{chapters.length}</span>{' '}
              {chapters.length === 1 ? 'chapter' : 'chapters'} available. Pick one to start a fresh twenty-question review.
            </p>
            {gapNote && (
              <p className="flex items-start gap-1.5 font-mono text-xs text-muted md:justify-end">
                <Info className="mt-px size-3.5 shrink-0 text-accent" aria-hidden="true" />
                {gapNote}
              </p>
            )}
          </div>
        </div>

        {registryError ? (
          <div role="alert" className="flex gap-4 rounded-2xl border border-wrong bg-wrong-soft p-6">
            <TriangleAlert className="size-5 shrink-0 text-wrong" aria-hidden="true" />
            <div>
              <h3 className="font-medium">Chapter data failed validation</h3>
              <p className="mt-1 text-sm text-muted">
                No chapters are shown until the data is fixed. Run <code className="font-mono">npm run validate</code> for
                details.
              </p>
            </div>
          </div>
        ) : chapters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong p-10 text-center">
            <h3 className="font-display text-3xl">No chapters yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Chapters appear here automatically once they are added to the chapter registry. See
              docs/CHAPTER_WORKFLOW.md.
            </p>
          </div>
        ) : (
          <ol className="list-none" aria-label="Chapters">
            {chapters.map((chapter) => (
              <ChapterRow key={chapter.id} chapter={chapter} />
            ))}
          </ol>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col-reverse px-2 py-3">
      <dt className="eyebrow !text-[0.6rem]">{label}</dt>
      <dd className="font-display text-3xl leading-tight tabular-nums">{value}</dd>
    </div>
  );
}
