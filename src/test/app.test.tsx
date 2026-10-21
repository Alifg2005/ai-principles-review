import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../app/App';
import { chapterPath } from '../app/router';
import { siteConfig } from '../config/site';
import { THEME_STORAGE_KEY } from '../hooks/useTheme';
import { chapters, missingChapterNumbers } from '../lib/chapters';
import { missingChaptersNote } from '../lib/format';
import { OPTION_LETTERS } from '../lib/quiz';
import type { Chapter } from '../lib/schema';

const first = chapters[0]!;
const second = chapters[1]!;

function renderAt(path: string) {
  window.history.replaceState(null, '', path);
  const user = userEvent.setup();
  render(<App />);
  return user;
}

const optionName = (i: number) => new RegExp(`^Option ${OPTION_LETTERS[i]}:`);

/** Answers each question via the navigator; `pick` returns the option index to choose. */
async function answerAll(user: ReturnType<typeof userEvent.setup>, chapter: Chapter, pick: (i: number) => number) {
  for (let i = 0; i < chapter.questions.length; i++) {
    await user.click(screen.getByRole('button', { name: new RegExp(`^Question ${i + 1},`) }));
    await user.click(screen.getByRole('radio', { name: optionName(pick(i)) }));
  }
}

describe('home page', () => {
  it('shows course details and a chapter library generated from the registry', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/review ai principles/i);
    expect(screen.getByText(siteConfig.course.title)).toBeInTheDocument();
    expect(screen.getAllByText(siteConfig.author!).length).toBeGreaterThan(0);
    // No instructor is named anywhere in the interface.
    expect(document.body).not.toHaveTextContent(/instructor/i);

    const list = screen.getByRole('list', { name: 'Chapters' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(chapters.length);
    for (const chapter of chapters) {
      const link = within(list).getByRole('link', { name: new RegExp(chapter.title.replace(/[()]/g, '\\$&')) });
      expect(link).toHaveAttribute('href', chapterPath(chapter.id));
    }
    expect(within(list).getAllByText('20')).toHaveLength(chapters.length);
  });

  it('lists chapters in ascending numerical order', () => {
    renderAt('/');
    const list = screen.getByRole('list', { name: 'Chapters' });
    const rendered = within(list)
      .getAllByRole('link')
      .map((link) => Number(/^Chapter (\d+):/.exec(link.textContent ?? '')?.[1]));
    expect(rendered).toEqual([...rendered].sort((a, b) => a - b));
    expect(rendered).toEqual(chapters.map((c) => c.number));
    expect(new Set(rendered).size).toBe(rendered.length);
  });

  it('notes numbering gaps without adding placeholder chapters', () => {
    renderAt('/');
    const note = missingChaptersNote(missingChapterNumbers);
    if (note) expect(screen.getByText(note)).toBeInTheDocument();
    else expect(screen.queryByText(/not available in this review set/)).not.toBeInTheDocument();

    const list = screen.getByRole('list', { name: 'Chapters' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(chapters.length);
    for (const n of missingChapterNumbers) {
      expect(within(list).queryByText(new RegExp(`^Chapter ${n}:`))).not.toBeInTheDocument();
    }
  });

  it('opens a chapter from the library', async () => {
    const user = renderAt('/');
    await user.click(screen.getByRole('link', { name: new RegExp(`Chapter ${first.number}: ${first.title}`) }));
    expect(window.location.pathname).toBe(chapterPath(first.id));
    expect(screen.getByRole('heading', { level: 1, name: first.title })).toBeInTheDocument();
    expect(screen.getByText(first.questions[0]!.question)).toBeInTheDocument();
  });
});

describe('quiz flow', () => {
  it('navigates with previous/next and keeps and changes answers', async () => {
    const user = renderAt(chapterPath(first.id));
    expect(document.getElementById('question-counter')).toHaveTextContent('01 / 20');
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: optionName(1) }));
    expect(screen.getByRole('radio', { name: optionName(1) })).toBeChecked();

    await user.click(screen.getByRole('button', { name: /^next/i }));
    expect(screen.getByText(first.questions[1]!.question)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: optionName(1) })).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByRole('radio', { name: optionName(1) })).toBeChecked();

    await user.click(screen.getByRole('radio', { name: optionName(2) }));
    expect(screen.getByRole('radio', { name: optionName(2) })).toBeChecked();
    expect(screen.getByRole('radio', { name: optionName(1) })).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Question 1, answered, current' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  });

  it('does not reveal answers or explanations before submission', () => {
    renderAt(chapterPath(first.id));
    expect(screen.queryByText('Correct answer')).not.toBeInTheDocument();
    expect(screen.queryByText('Your answer')).not.toBeInTheDocument();
    expect(screen.queryByText(first.questions[0]!.explanation)).not.toBeInTheDocument();
  });

  it('asks for confirmation when questions are unanswered', async () => {
    const user = renderAt(chapterPath(first.id));
    await user.click(screen.getByRole('radio', { name: optionName(0) }));
    const [sidebarSubmit] = screen.getAllByRole('button', { name: 'Submit answers' });
    await user.click(sidebarSubmit!);

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveTextContent('19 questions are unanswered');
    expect(dialog).toHaveFocus();

    await user.click(within(dialog).getByRole('button', { name: /first unanswered/i }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Question 2, unanswered, current' })).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'Submit answers' })[0]!);
    await user.click(screen.getByRole('button', { name: 'Submit anyway' }));

    const score = screen.getByRole('heading', { level: 1 });
    expect(score).toHaveTextContent(/\/ 20/);
    expect(score).toHaveFocus();
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toContain('Unanswered');
    expect(screen.getAllByText('You did not answer this question.')).toHaveLength(19);
  });

  it('scores a perfect attempt without a confirmation step', async () => {
    const user = renderAt(chapterPath(first.id));
    await answerAll(user, first, (i) => first.questions[i]!.correctAnswerIndex);
    await user.click(screen.getAllByRole('button', { name: 'Submit answers' })[0]!);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('You scored 20 / 20');
    expect(screen.getByText(/100% · one segment/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Missed (0)' })).toBeDisabled();
  });

  it('scores from the answer key and shows review details', async () => {
    const user = renderAt(chapterPath(first.id));
    // First 10 correct, last 10 deliberately wrong.
    await answerAll(user, first, (i) => {
      const key = first.questions[i]!.correctAnswerIndex;
      return i < 10 ? key : (key + 1) % 4;
    });
    await user.click(screen.getAllByRole('button', { name: 'Submit answers' })[0]!);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('You scored 10 / 20');
    expect(screen.getByText(/50% · one segment/)).toBeInTheDocument();
    expect(screen.getAllByRole('term').map((t) => t.textContent)).not.toContain('Unanswered');
    expect(screen.getAllByText('Correct answer')).toHaveLength(20);
    expect(screen.getByText(first.questions[0]!.explanation)).toBeInTheDocument();
    expect(screen.getAllByText(/^Source:/).length).toBe(20);

    await user.click(screen.getByRole('button', { name: 'Missed (10)' }));
    expect(screen.queryByText(first.questions[0]!.explanation)).not.toBeInTheDocument();
    expect(screen.getByText(first.questions[19]!.explanation)).toBeInTheDocument();
  });

  it('starts a fresh attempt on retry', async () => {
    const user = renderAt(chapterPath(first.id));
    await user.click(screen.getByRole('radio', { name: optionName(0) }));
    await user.click(screen.getAllByRole('button', { name: 'Submit answers' })[0]!);
    await user.click(screen.getByRole('button', { name: 'Submit anyway' }));
    await user.click(screen.getByRole('button', { name: /retry chapter/i }));

    expect(screen.getByText('Attempt 2')).toBeInTheDocument();
    expect(screen.getByText(first.questions[0]!.question)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    for (let i = 0; i < 4; i++) expect(screen.getByRole('radio', { name: optionName(i) })).not.toBeChecked();
  });

  it('switches chapters with independent state', async () => {
    const user = renderAt(chapterPath(first.id));
    await user.click(screen.getByRole('radio', { name: optionName(0) }));
    await user.click(screen.getAllByRole('link', { name: /library/i })[0]!);
    await user.click(screen.getByRole('link', { name: new RegExp(`Chapter ${second.number}: `) }));

    expect(screen.getByRole('heading', { level: 1, name: second.title })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
});

describe('routing and errors', () => {
  it('handles an unknown chapter id', () => {
    renderAt('/chapters/does-not-exist');
    expect(screen.getByRole('heading', { level: 1, name: 'Chapter not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to the chapter library/i })).toBeInTheDocument();
  });

  it('handles an unknown route', () => {
    renderAt('/nope/really');
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
  });

  it('sets a page title for the quiz', () => {
    renderAt(chapterPath(first.id));
    expect(document.title).toContain(first.title);
    expect(document.title).toContain(siteConfig.productName);
  });
});

describe('theme', () => {
  it('toggles between light and dark and persists the choice', async () => {
    const user = renderAt('/');
    const toggle = screen.getByRole('button', { name: 'Switch to dark theme' });
    await user.click(toggle);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });
});
