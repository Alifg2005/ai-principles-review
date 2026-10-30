import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../app/App';
import { chapterPath, matchRoute, practicePath, practiceQuestionPath } from '../app/router';
import { resetPracticeWork } from '../hooks/usePracticeWork';
import { chapters } from '../lib/chapters';
import { getPracticeSet, isWritten, practiceCounts, practiceSets } from '../lib/practice';
import type { PracticeQuestion } from '../lib/practiceSchema';

function renderAt(path: string) {
  window.history.replaceState(null, '', path);
  const user = userEvent.setup();
  render(<App />);
  return user;
}

function find<K extends PracticeQuestion['kind']>(kind: K) {
  for (const set of practiceSets) {
    const question = set.questions.find((q) => q.kind === kind);
    if (question) return { chapterId: set.chapterId, question: question as Extract<PracticeQuestion, { kind: K }> };
  }
  throw new Error(`no ${kind} question`);
}
const pathTo = (chapterId: string, id: string) => practiceQuestionPath(chapterId, id);
const openById = (id: string) => {
  const set = practiceSets.find((s) => s.questions.some((q) => q.id === id))!;
  return renderAt(pathTo(set.chapterId, id));
};
const reveal = (name: RegExp) => screen.getByRole('button', { name });

beforeEach(() => {
  resetPracticeWork();
});

describe('homepage section', () => {
  it('lists every chapter with written and practical counts', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: 'Written & Practical Review' })).toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Practice chapters' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(practiceSets.length);
    const set = practiceSets[0]!;
    const { written, practical } = practiceCounts(set.questions);
    expect(within(list).getByText(`${written} written · ${practical} practical`, { exact: false })).toBeInTheDocument();
  });

  it('keeps the multiple-choice library intact alongside it', () => {
    renderAt('/');
    const quizList = screen.getByRole('list', { name: 'Chapters' });
    expect(within(quizList).getAllByRole('listitem')).toHaveLength(chapters.length);
    expect(within(quizList).getAllByRole('link')[0]).toHaveAttribute('href', chapterPath(chapters[0]!.id));
  });

  it('navigates to a chapter question list', async () => {
    const user = renderAt('/');
    const chapter = chapters[0]!;
    await user.click(screen.getByRole('link', { name: `Practice chapter ${chapter.number}: ${chapter.title}` }));
    expect(window.location.pathname).toBe(practicePath(chapter.id));
    expect(screen.getByRole('heading', { level: 1, name: chapter.title })).toBeInTheDocument();
  });
});

describe('routing', () => {
  it('matches practice routes', () => {
    expect(matchRoute('/practice/a')).toEqual({ name: 'practice-chapter', chapterId: 'a' });
    expect(matchRoute('/practice/a/p01-01')).toEqual({ name: 'practice-question', chapterId: 'a', questionId: 'p01-01' });
    expect(matchRoute('/practice')).toEqual({ name: 'not-found' });
    expect(matchRoute('/practice/a/b/c')).toEqual({ name: 'not-found' });
  });

  it('handles unknown chapters and questions', () => {
    renderAt('/practice/nope');
    expect(screen.getByRole('heading', { level: 1, name: 'Chapter not found' })).toBeInTheDocument();
  });

  it('handles an unknown question', () => {
    renderAt(`/practice/${chapters[0]!.id}/p99-99`);
    expect(screen.getByRole('heading', { level: 1, name: 'Question not found' })).toBeInTheDocument();
  });
});

describe('chapter list', () => {
  it('filters written and practical questions', async () => {
    const chapter = chapters[0]!;
    const set = getPracticeSet(chapter.id)!;
    const { written, practical, total } = practiceCounts(set.questions);
    const user = renderAt(practicePath(chapter.id));
    const list = () => within(screen.getByRole('list', { name: 'Questions' })).getAllByRole('listitem');
    expect(list()).toHaveLength(total);

    await user.click(screen.getByRole('button', { name: `Written (${written})` }));
    expect(list()).toHaveLength(written);
    expect(screen.queryByText(set.questions.find((q) => !isWritten(q))!.prompt)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: `Practical (${practical})` }));
    expect(list()).toHaveLength(practical);
    expect(screen.queryByText(set.questions.find(isWritten)!.prompt)).not.toBeInTheDocument();
  });

  it('opens a question from the list', async () => {
    const chapter = chapters[1]!;
    const question = getPracticeSet(chapter.id)!.questions[0]!;
    const user = renderAt(practicePath(chapter.id));
    await user.click(screen.getByRole('link', { name: new RegExp(question.topic) }));
    expect(screen.getByRole('heading', { level: 1, name: question.prompt })).toBeInTheDocument();
  });
});

describe('written questions', () => {
  const { chapterId, question } = find('written');
  const withDetail = practiceSets.flatMap((s) => s.questions).find((q) => isWritten(q) && q.answer.detailed)!;
  const detailText = (q: PracticeQuestion) => {
    const block = q.answer.detailed![0]!;
    return block.type === 'p' ? block.text : '';
  };

  it('hides the answer until revealed and marks the question as written', () => {
    renderAt(pathTo(chapterId, question.id));
    expect(within(screen.getByRole('article')).getByText('Written')).toBeInTheDocument();
    expect(screen.queryByText('Short answer')).not.toBeInTheDocument();
    expect(reveal(/reveal model answer/i)).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the short answer first and the detailed answer only on request', async () => {
    const user = openById(withDetail.id);
    await user.click(reveal(/reveal model answer/i));
    expect(screen.getByText('Short answer')).toBeInTheDocument();
    expect(screen.queryByText(detailText(withDetail))).not.toBeInTheDocument();

    await user.click(reveal(/show detailed answer/i));
    expect(screen.getByText(detailText(withDetail))).toBeInTheDocument();
    expect(screen.getByText('Short answer')).toBeInTheDocument();

    await user.click(reveal(/hide detailed answer/i));
    expect(screen.queryByText(detailText(withDetail))).not.toBeInTheDocument();
  });

  it('shows the source reference and slide notes with the answer', async () => {
    const user = openById('p08-05');
    await user.click(reveal(/reveal model answer/i));
    expect(screen.getByText(/Source:/)).toBeInTheDocument();
    expect(screen.getByText(/Note on the slides/)).toBeInTheDocument();
  });

  it('separates lecture wording from the corrected concept', async () => {
    const user = openById('p04-07');
    await user.click(reveal(/reveal model answer/i));
    expect(screen.getByText('Lecture wording')).toBeInTheDocument();
    expect(screen.getByText('Correct concept')).toBeInTheDocument();
    expect(screen.getByText(/depth less than L/)).toBeInTheDocument();
    expect(screen.getAllByText('Corrected concept').length).toBeGreaterThanOrEqual(2);
  });

  it('labels each section of one answer separately', async () => {
    const user = openById('p05-03');
    await user.click(reveal(/reveal model answer/i));
    const panel = () => within(screen.getByRole('region', { name: 'Model answer' }));
    const clarifications = () => panel().queryAllByText('Additional clarification').length;
    const before = clarifications();
    await user.click(reveal(/show detailed answer/i));
    expect(clarifications()).toBe(before + 1);
    expect(screen.getByText(/needs a consistent heuristic/)).toBeInTheDocument();
    expect(panel().getAllByText('Slide-based').length).toBeGreaterThanOrEqual(1);
  });

  it('keeps clarification behind the optional detail button', async () => {
    const user = openById('p05-11');
    await user.click(reveal(/reveal reference solution/i));
    expect(screen.queryByText(/never reopens closed nodes/)).not.toBeInTheDocument();
    await user.click(reveal(/show detailed answer/i));
    expect(screen.getByText(/never reopens closed nodes/)).toBeInTheDocument();
  });

  it('marks original worked examples', async () => {
    const user = openById('p05-08');
    await user.click(reveal(/reveal reference solution/i));
    expect(screen.getAllByText('Original worked example').length).toBeGreaterThanOrEqual(2);
  });

  it('shows search rules before the student starts', () => {
    openById('p04-14');
    expect(screen.getByText('Order and ties')).toBeInTheDocument();
    expect(screen.getByText('Goal test')).toBeInTheDocument();
    expect(screen.getByText(/not when it is generated/)).toBeInTheDocument();
  });

  it('keeps a draft when moving to another question and back', async () => {
    const set = getPracticeSet(chapters[0]!.id)!;
    const user = renderAt(pathTo(set.chapterId, set.questions[0]!.id));
    await user.type(screen.getByRole('textbox', { name: /your answer/i }), 'my attempt');
    await user.click(screen.getByRole('link', { name: 'Next' }));
    expect(screen.getByRole('heading', { level: 1, name: set.questions[1]!.prompt })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Previous' }));
    expect(screen.getByRole('textbox', { name: /your answer/i })).toHaveValue('my attempt');
  });
});

describe('navigation', () => {
  it('moves between questions and shows the question map', async () => {
    const set = getPracticeSet(chapters[0]!.id)!;
    const user = renderAt(pathTo(set.chapterId, set.questions[0]!.id));
    expect(screen.queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument();
    const map = screen.getByRole('complementary', { name: 'Chapter questions' });
    expect(within(map).getAllByRole('link')).toHaveLength(set.questions.length);
    await user.click(within(map).getAllByRole('link')[2]!);
    expect(screen.getByRole('heading', { level: 1, name: set.questions[2]!.prompt })).toBeInTheDocument();
    const links = within(screen.getByRole('complementary', { name: 'Chapter questions' })).getAllByRole('link');
    expect(links[0]).not.toHaveAttribute('aria-current');
    expect(links[2]).toHaveAttribute('aria-current', 'step');
  });
});

describe('trace exercises', () => {
  it('builds an order from the figure, undoes it, and checks it', async () => {
    const user = openById('p04-12');
    const figure = screen.getByRole('group', { name: /exercise graph/i });
    await user.click(within(figure).getByRole('button', { name: 'Node A' }));
    await user.click(within(figure).getByRole('button', { name: 'Node C' }));
    const order = () => screen.getByRole('list', { name: 'Your order' });
    expect(within(order()).getAllByRole('listitem')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Check my order' }));
    expect(screen.getByRole('status')).toHaveTextContent('1 of 8 positions match');

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(within(order()).getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('confirms a correct order and shows intermediate steps on reveal', async () => {
    const user = openById('p04-12');
    for (const label of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
      await user.click(screen.getByRole('button', { name: label }));
    }
    await user.click(screen.getByRole('button', { name: 'Check my order' }));
    expect(screen.getByRole('status')).toHaveTextContent('Correct order');
    expect(screen.queryByText('Step by step')).not.toBeInTheDocument();
    await user.click(reveal(/reveal reference solution/i));
    expect(screen.getByText('Step by step')).toBeInTheDocument();
  });

  it('supports keyboard selection of figure nodes', async () => {
    const user = openById('p04-12');
    screen.getByRole('button', { name: 'Node A' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Node A, position 1' })).toBeInTheDocument();
  });
});

describe('table exercises', () => {
  it('marks a truth table cell by cell', async () => {
    const user = openById('p07-11');
    const cells = screen.getAllByRole('combobox');
    expect(cells).toHaveLength(12);
    await user.selectOptions(cells[0]!, 'T');
    await user.selectOptions(cells[1]!, 'T');
    await user.click(screen.getByRole('button', { name: 'Check table' }));
    expect(screen.getByRole('status')).toHaveTextContent('1 of 12 cells correct');
  });

  it('accepts free text regardless of case and spacing', async () => {
    const user = openById('p03-07');
    const inputs = screen.getAllByRole('textbox');
    for (const [i, value] of ['q,r', 'R, S', 's', 't', 'EMPTY'].entries()) await user.type(inputs[i]!, value);
    await user.click(screen.getByRole('button', { name: 'Check table' }));
    expect(screen.getByRole('status')).toHaveTextContent('5 of 5 cells correct');
  });

  it('states the classification assumptions and never marks choices wrong', async () => {
    const user = openById('p02-09');
    expect(screen.getByText(/only the capabilities described/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Check table' })).not.toBeInTheDocument();
    expect(screen.getByText(/compare yours with the reference/i)).toBeInTheDocument();
    const first = screen.getAllByRole('combobox')[0]!;
    await user.selectOptions(first, 'Utility-based');
    expect(first).toHaveValue('Utility-based');
    expect(screen.queryByText('Incorrect')).not.toBeInTheDocument();
    await user.click(reveal(/reveal reference solution/i));
    expect(screen.getByText('Deciding feature')).toBeInTheDocument();
    expect(first).toHaveValue('Utility-based');
    expect(screen.queryByText('Incorrect')).not.toBeInTheDocument();
  });

  it('does not grade self-check tables', () => {
    openById('p02-07');
    expect(screen.queryByRole('button', { name: 'Check table' })).not.toBeInTheDocument();
    expect(screen.getByText(/compare yours with the reference/i)).toBeInTheDocument();
  });

  it('resets the table', async () => {
    const user = openById('p03-07');
    const first = screen.getAllByRole('textbox')[0]!;
    await user.type(first, 'q');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('');
  });
});

describe('diagram completion', () => {
  it('places choices in the diagram and checks them', async () => {
    const user = openById('p01-09');
    const figure = () => screen.getByRole('img', { name: /incomplete diagram/i });
    await user.selectOptions(screen.getByRole('combobox', { name: /part 1/i }), 'Thinking humanly');
    expect(figure().getAttribute('aria-label')).toContain('Thinking humanly');
    await user.selectOptions(screen.getByRole('combobox', { name: /part 2/i }), 'Acting humanly');
    await user.click(screen.getByRole('button', { name: 'Check diagram' }));
    expect(screen.getByRole('status')).toHaveTextContent('1 of 4 parts correct');
  });

  it('reveals the completed reference diagram', async () => {
    const user = openById('p01-09');
    await user.click(reveal(/reveal reference solution/i));
    expect(screen.getByText('Reference diagram')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /^reference diagram/i }).getAttribute('aria-label')).toContain('Acting rationally');
  });
});

describe('graph construction', () => {
  it('adds nodes, connects them, and compares with the reference', async () => {
    const user = openById('p03-08');
    for (const label of ['P', 'Q', 'R', 'S', 'T']) {
      await user.click(screen.getByRole('button', { name: `Add node ${label}` }));
    }
    const space = screen.getByRole('group', { name: 'Graph workspace' });
    const connect = async (a: string, b: string) => {
      await user.click(within(space).getByRole('button', { name: new RegExp(`^Node ${a}`) }));
      await user.click(within(space).getByRole('button', { name: new RegExp(`^Node ${b}`) }));
    };
    await connect('P', 'Q');
    await connect('P', 'R');
    await connect('Q', 'S');
    await user.click(screen.getByRole('button', { name: 'Check structure' }));
    expect(screen.getByText(/Missing connections: S → T/)).toBeInTheDocument();

    await connect('S', 'T');
    await user.click(screen.getByRole('button', { name: 'Check structure' }));
    expect(screen.getByText(/matches the reference/)).toBeInTheDocument();
  });

  it('removes a connection, undoes and resets', async () => {
    const user = openById('p03-08');
    await user.click(screen.getByRole('button', { name: 'Add node P' }));
    await user.click(screen.getByRole('button', { name: 'Add node Q' }));
    const space = screen.getByRole('group', { name: 'Graph workspace' });
    await user.click(within(space).getByRole('button', { name: 'Node P' }));
    await user.click(within(space).getByRole('button', { name: 'Node Q' }));
    expect(screen.getByRole('list', { name: 'Connections' })).toHaveTextContent('P → Q');

    await user.click(screen.getByRole('button', { name: 'Remove connection P to Q' }));
    expect(screen.queryByRole('list', { name: 'Connections' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByRole('list', { name: 'Connections' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(within(space).queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies the chosen edge label', async () => {
    const user = openById('p07-17');
    await user.click(screen.getByRole('button', { name: 'Add node Rex' }));
    await user.click(screen.getByRole('button', { name: 'Add node Sara' }));
    await user.selectOptions(screen.getByRole('combobox', { name: /label for the next connection/i }), 'owned_by');
    const space = screen.getByRole('group', { name: 'Graph workspace' });
    await user.click(within(space).getByRole('button', { name: 'Node Rex' }));
    await user.click(within(space).getByRole('button', { name: 'Node Sara' }));
    expect(screen.getByRole('list', { name: 'Connections' })).toHaveTextContent('Rex → Sara (owned_by)');
  });

  it('moves a node by dragging without connecting it', async () => {
    const user = openById('p03-08');
    await user.click(screen.getByRole('button', { name: 'Add node P' }));
    const node = within(screen.getByRole('group', { name: 'Graph workspace' })).getByRole('button', { name: 'Node P' });
    const circle = () => node.querySelector('circle')!.getAttribute('cx');
    const before = circle();
    fireEvent.pointerDown(node, { clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(node, { clientX: 150, clientY: 90, pointerId: 1 });
    fireEvent.click(node);
    expect(circle()).not.toBe(before);
    expect(node).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('logic exercises', () => {
  it('inserts symbols and recognises a reference form', async () => {
    const user = openById('p08-09');
    const input = screen.getByRole('textbox', { name: 'Your expression' });
    await user.click(screen.getByRole('button', { name: 'Insert ∀' }));
    expect(input).toHaveValue('∀');
    await user.clear(input);
    await user.type(input, 'forall x Surgeon(x) -> Doctor(x)');
    await user.click(screen.getByRole('button', { name: 'Compare with reference' }));
    expect(screen.getByRole('status')).toHaveTextContent('Matches a reference form');
  });

  it('never calls a different form wrong', async () => {
    const user = openById('p08-09');
    await user.type(screen.getByRole('textbox', { name: 'Your expression' }), '∀y Surgeon(y) ⇒ Doctor(y)');
    await user.click(screen.getByRole('button', { name: 'Compare with reference' }));
    expect(screen.getByRole('status')).toHaveTextContent('Equivalent forms or other variable names can still be correct');
  });

  it('preserves logical notation in the reference answer', async () => {
    const user = openById('p08-13');
    await user.click(reveal(/reveal reference solution/i));
    expect(screen.getByText('∃y ∀x Knows(x, y)')).toBeInTheDocument();
  });
});

describe('drawing workspace', () => {
  const paths = () => screen.getByTestId('drawing-area').querySelectorAll('path');
  const stroke = (x: number) => {
    const area = screen.getByTestId('drawing-area');
    fireEvent.pointerDown(area, { clientX: x, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(area, { clientX: x + 20, clientY: 30, pointerId: 1 });
    fireEvent.pointerUp(area, { clientX: x + 20, clientY: 30, pointerId: 1 });
  };

  it('allows touch drawing without scrolling the page', () => {
    openById('p01-12');
    expect(screen.getByTestId('drawing-area').style.touchAction).toBe('none');
  });

  it('draws strokes and supports undo, clear and reset', async () => {
    const user = openById('p01-12');
    expect(paths()).toHaveLength(0);
    stroke(10);
    stroke(60);
    expect(paths()).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(paths()).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(paths()).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(paths()).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(paths()).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
  });

  it('reveals the reference while keeping the drawing for comparison', async () => {
    const user = openById('p01-12');
    stroke(10);
    await user.click(reveal(/reveal reference solution/i));
    expect(screen.getByText('Reference diagram')).toBeInTheDocument();
    expect(paths()).toHaveLength(1);
  });
});
