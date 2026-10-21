import { useState } from 'react';
import { getChapter } from '../lib/chapters';
import { NotFoundPage } from './NotFoundPage';
import { QuizSession } from './QuizSession';

/**
 * Resolves the chapter from the route and owns the attempt counter.
 * Bumping the counter remounts QuizSession, so a retry always starts fresh.
 */
export function QuizPage({ chapterId }: { chapterId: string }) {
  const chapter = getChapter(chapterId);
  const [attempt, setAttempt] = useState(1);

  if (!chapter) {
    return (
      <NotFoundPage
        title="Chapter not found"
        message={`There is no chapter called "${chapterId}". It may have been renamed, or the link is incorrect.`}
      />
    );
  }

  return (
    <QuizSession
      key={attempt}
      chapter={chapter}
      attempt={attempt}
      onRetry={() => {
        setAttempt((n) => n + 1);
        window.scrollTo({ top: 0 });
      }}
    />
  );
}
