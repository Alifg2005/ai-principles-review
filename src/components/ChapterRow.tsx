import { ArrowUpRight } from 'lucide-react';
import { Link } from '../app/Link';
import { chapterPath } from '../app/router';
import { difficultyBreakdown } from '../lib/format';
import { pad2 } from '../lib/quiz';
import type { Chapter } from '../lib/schema';
import { ChapterMotif } from './ChapterMotif';

/** One entry in the chapter index. The whole row is clickable via a stretched link. */
export function ChapterRow({ chapter }: { chapter: Chapter }) {
  const mix = difficultyBreakdown(chapter);
  return (
    <li className="group relative border-t border-line transition-colors duration-200 last:border-b hover:bg-surface focus-within:bg-surface">
      <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 px-1 py-7 sm:gap-x-8 md:grid-cols-[7rem_1fr_9rem_auto] md:items-center md:px-4">
        <div className="row-span-2 md:row-span-1">
          <span
            className="block font-display text-6xl leading-none text-ink tabular-nums transition-colors group-hover:text-accent sm:text-7xl"
            aria-hidden="true"
          >
            {pad2(chapter.number)}
          </span>
          <span className="eyebrow mt-2 block !text-[0.62rem]">{chapter.source.label}</span>
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-medium tracking-tight break-words sm:text-2xl">
            <Link
              to={chapterPath(chapter.id)}
              className="rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-accent"
            >
              <span className="sr-only">Chapter {chapter.number}:</span> {chapter.title}
            </Link>
          </h3>
          <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{chapter.description}</p>
        </div>

        <div className="col-start-2 md:col-start-auto">
          <dl className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted md:flex-col">
            <div>
              <dt className="sr-only">Questions</dt>
              <dd>
                <span className="text-ink">{chapter.questions.length}</span> questions
              </dd>
            </div>
            <div>
              <dt className="sr-only">Difficulty mix (foundational, intermediate, advanced)</dt>
              <dd title="Foundational · Intermediate · Advanced">
                {mix.foundational}F · {mix.intermediate}I · {mix.advanced}A
              </dd>
            </div>
          </dl>
          <ChapterMotif seed={chapter.number} className="mt-3 hidden h-10 w-[4.5rem] md:block" />
        </div>

        <span
          className="col-start-2 inline-flex items-center gap-2 text-sm font-medium text-accent md:col-start-auto"
          aria-hidden="true"
        >
          Start review
          <ArrowUpRight className="size-4 transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </li>
  );
}
