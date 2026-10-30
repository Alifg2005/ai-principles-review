import { ArrowUpRight, PenLine, Spline, TriangleAlert } from 'lucide-react';
import { Link } from '../../app/Link';
import { practicePath } from '../../app/router';
import { chapters } from '../../lib/chapters';
import { practiceCounts, practiceError, practiceSets } from '../../lib/practice';
import { pad2 } from '../../lib/quiz';

/** Homepage entry to Written & Practical Review, generated from the practice registry. */
export function PracticeLibrary() {
  return (
    <section id="practice" aria-labelledby="practice-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20 sm:px-6 md:pt-28">
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
        <div>
          <p className="eyebrow">Beyond multiple choice</p>
          <h2 id="practice-title" className="mt-3 font-display text-5xl leading-none sm:text-6xl">
            Written &amp; Practical Review
          </h2>
        </div>
        <dl className="grid gap-3 text-sm text-muted">
          <div className="flex gap-3">
            <PenLine className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <dt className="inline font-medium text-ink">Written. </dt>
              <dd className="inline">Recall it yourself, then reveal a short exam answer. Details stay optional.</dd>
            </div>
          </div>
          <div className="flex gap-3">
            <Spline className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <dt className="inline font-medium text-ink">Practical. </dt>
              <dd className="inline">Trace algorithms, build graphs, complete diagrams, write logic and draw.</dd>
            </div>
          </div>
        </dl>
      </div>

      {practiceError ? (
        <div role="alert" className="mt-10 flex gap-4 rounded-2xl border border-wrong bg-wrong-soft p-6">
          <TriangleAlert className="size-5 shrink-0 text-wrong" aria-hidden="true" />
          <div>
            <h3 className="font-medium">Practice data failed validation</h3>
            <p className="mt-1 text-sm text-muted">
              Run <code className="font-mono">npm run validate</code> for details.
            </p>
          </div>
        </div>
      ) : practiceSets.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line-strong p-8 text-center text-sm text-muted">
          Practice sets appear here once they are added to the practice registry.
        </p>
      ) : (
        <ul aria-label="Practice chapters" className="mt-10 grid border-t border-line md:grid-cols-2 md:gap-x-10">
          {practiceSets.map((set) => {
            const chapter = chapters.find((c) => c.id === set.chapterId);
            if (!chapter) return null;
            const { written, practical } = practiceCounts(set.questions);
            return (
              <li key={set.chapterId} className="group relative border-b border-line">
                <div className="flex items-center gap-4 py-4">
                  <span
                    className="w-11 font-display text-3xl leading-none text-muted tabular-nums transition-colors group-hover:text-accent"
                    aria-hidden="true"
                  >
                    {pad2(chapter.number)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium tracking-tight break-words">
                      <Link
                        to={practicePath(chapter.id)}
                        className="rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-accent"
                      >
                        <span className="sr-only">Practice chapter {chapter.number}:</span> {chapter.title}
                      </Link>
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {written} written · {practical} practical
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-accent transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
