import { ArrowLeft, ArrowRight, PenLine, Spline } from 'lucide-react';
import { Link } from '../app/Link';
import { practiceQuestionPath } from '../app/router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePracticeWork } from '../hooks/usePracticeWork';
import { getChapter } from '../lib/chapters';
import { DIFFICULTY_LABEL } from '../lib/format';
import { getPracticeSet, isWritten, KIND_LABEL, practiceCounts } from '../lib/practice';
import { pad2 } from '../lib/quiz';
import { NotFoundPage } from './NotFoundPage';

type Filter = 'all' | 'written' | 'practical';

/** One chapter's question list, filterable by written or practical. */
export function PracticeChapterPage({ chapterId }: { chapterId: string }) {
  const chapter = getChapter(chapterId);
  const set = getPracticeSet(chapterId);
  const [filter, setFilter] = usePracticeWork<Filter>(`filter:${chapterId}`, 'all');
  useDocumentTitle(chapter ? `Written & Practical: ${chapter.title}` : 'Chapter not found');

  if (!chapter || !set) {
    return <NotFoundPage title="Chapter not found" message="This chapter has no written and practical review." />;
  }

  const counts = practiceCounts(set.questions);
  const numbered = set.questions.map((question, index) => ({ question, number: index + 1 }));
  const visible = numbered.filter(({ question }) => {
    if (filter === 'all') return true;
    return filter === 'written' ? isWritten(question) : !isWritten(question);
  });
  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: `All (${counts.total})` },
    { id: 'written', label: `Written (${counts.written})` },
    { id: 'practical', label: `Practical (${counts.practical})` },
  ];

  return (
    <div className="lab-grid min-h-[calc(100dvh-4rem)] border-b border-line">
      <div className="mx-auto max-w-4xl px-4 pt-6 pb-16 sm:px-6 md:pt-10">
        <Link
          to="/#practice"
          className="inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Written &amp; Practical Review
        </Link>
        <header className="mt-4 flex items-end gap-4 border-b border-line pb-6 sm:gap-6">
          <span className="font-display text-6xl leading-[0.8] text-accent tabular-nums sm:text-7xl" aria-hidden="true">
            {pad2(chapter.number)}
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Chapter {chapter.number} · Written &amp; Practical</p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight break-words sm:text-3xl">{chapter.title}</h1>
          </div>
        </header>

        <div
          role="group"
          aria-label="Filter questions"
          className="mt-6 inline-flex flex-wrap rounded-3xl border border-line-strong bg-surface p-1"
        >
          {filters.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={`min-h-11 rounded-full px-4 text-sm transition-colors ${filter === id ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <ol aria-label="Questions" className="mt-6 space-y-2">
          {visible.map(({ question, number }) => {
            const Icon = isWritten(question) ? PenLine : Spline;
            return (
              <li key={question.id}>
                <Link
                  to={practiceQuestionPath(chapterId, question.id)}
                  className="group flex items-start gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink"
                >
                  <span className="pt-0.5 font-mono text-xs text-muted tabular-nums">{pad2(number)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] tracking-wide text-muted uppercase">
                      <span className="inline-flex items-center gap-1.5 text-accent">
                        <Icon className="size-3.5" aria-hidden="true" />
                        {KIND_LABEL[question.kind]}
                      </span>
                      <span>{question.topic}</span>
                      <span>{DIFFICULTY_LABEL[question.difficulty]}</span>
                    </span>
                    <span className="mt-1.5 block leading-snug break-words">{question.prompt}</span>
                  </span>
                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
