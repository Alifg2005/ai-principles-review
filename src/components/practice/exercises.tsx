import { Check, Delete, RotateCcw, X } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { usePracticeWork } from '../../hooks/usePracticeWork';
import { checkSequence, matchesAccepted } from '../../lib/practiceCheck';
import type {
  CompleteQuestion,
  LogicQuestion,
  SequenceQuestion,
  TableCell,
  TableQuestion,
} from '../../lib/practiceSchema';
import { GraphFigure } from './GraphFigure';

const fieldClass =
  'min-h-11 w-full rounded-lg border bg-surface px-3 text-sm text-ink transition-colors hover:border-ink focus-visible:border-accent';

function Result({ ok, children }: { ok: boolean; children: ReactNode }) {
  const Icon = ok ? Check : X;
  return (
    <p
      role="status"
      className={`mt-4 flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${ok ? 'bg-correct-soft text-correct' : 'bg-skip-soft text-ink'}`}
    >
      <Icon className={`mt-0.5 size-4 shrink-0 ${ok ? 'text-correct' : 'text-skip'}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** Written practice: an optional, ungraded space to recall the answer before revealing it. */
export function WrittenDraft({ id }: { id: string }) {
  const [draft, setDraft] = usePracticeWork(`${id}:draft`, '');
  return (
    <div>
      <label htmlFor={`${id}-draft`} className="eyebrow">
        Your answer (optional, not graded)
      </label>
      <textarea
        id={`${id}-draft`}
        rows={4}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="mt-2 w-full rounded-lg border border-line-strong bg-surface p-3 text-sm leading-relaxed transition-colors hover:border-ink focus-visible:border-accent"
      />
    </div>
  );
}

/** Algorithm tracing and ordering: tap nodes or items in order, then check. */
export function SequenceExercise({ question }: { question: SequenceQuestion }) {
  const [order, setOrder] = usePracticeWork<string[]>(`${question.id}:order`, []);
  const [checked, setChecked] = usePracticeWork(`${question.id}:checked`, false);
  const repeats = question.allowRepeats ?? false;

  const change = (next: string[]) => {
    setOrder(next);
    setChecked(false);
  };
  const add = (token: string) => {
    if (repeats || !order.includes(token)) change([...order, token]);
  };
  const result = checkSequence(order, question.expected);

  const badges: Record<string, string> = {};
  if (question.figure && !repeats) {
    for (const node of question.figure.nodes) {
      const at = order.indexOf(node.label);
      if (at >= 0) badges[node.id] = String(at + 1);
    }
  }

  return (
    <div>
      {question.figure && (
        <div className="rounded-xl border border-line p-3">
          <GraphFigure
            graph={question.figure}
            title="Exercise graph. Activate nodes in order"
            badges={badges}
            onNodeClick={(node) => add(node.label)}
          />
        </div>
      )}
      <p className="eyebrow mt-4">{question.figure ? 'Tap the nodes above, or use these buttons' : 'Tap in order'}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {question.tokens.map((token) => (
          <button
            key={token}
            type="button"
            disabled={!repeats && order.includes(token)}
            onClick={() => add(token)}
            className="min-h-11 min-w-11 rounded-lg border border-line-strong bg-surface px-3 text-sm transition-colors hover:border-ink disabled:opacity-35"
          >
            {token}
          </button>
        ))}
      </div>

      <p className="eyebrow mt-5">Your order</p>
      {order.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Nothing placed yet.</p>
      ) : (
        <ol aria-label="Your order" className="mt-2 flex flex-wrap items-center gap-1.5">
          {order.map((token, i) => (
            <li
              key={`${token}-${i}`}
              className={[
                'rounded-md border px-2 py-1 text-sm',
                checked ? (result.positions[i] ? 'border-correct bg-correct-soft' : 'border-wrong bg-wrong-soft') : 'border-line',
              ].join(' ')}
            >
              <span className="mr-1.5 font-mono text-xs text-muted">{i + 1}</span>
              {token}
              {checked && <span className="sr-only">{result.positions[i] ? ' (correct)' : ' (incorrect)'}</span>}
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost" disabled={!order.length} onClick={() => change(order.slice(0, -1))}>
          <Delete className="size-4" aria-hidden="true" />
          Undo
        </button>
        <button type="button" className="btn btn-ghost" disabled={!order.length} onClick={() => change([])}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear
        </button>
        <button type="button" className="btn btn-ghost" disabled={!order.length} onClick={() => setChecked(true)}>
          <Check className="size-4" aria-hidden="true" />
          Check my order
        </button>
      </div>
      {checked && (
        <Result ok={result.correct}>
          {result.correct
            ? 'Correct order.'
            : `${result.matched} of ${question.expected.length} positions match. Compare with the steps in the solution.`}
        </Result>
      )}
    </div>
  );
}

const isBlank = (cell: TableCell): cell is Extract<TableCell, { accepted: string[] }> => 'accepted' in cell;

/** Structured tables: frontier traces, truth tables, classifications. */
export function TableExercise({ question }: { question: TableQuestion }) {
  const [values, setValues] = usePracticeWork<Record<string, string>>(`${question.id}:cells`, {});
  const [checked, setChecked] = usePracticeWork(`${question.id}:checked`, false);

  const graded = question.rows.flatMap((row, i) =>
    row.flatMap((cell, j) => (isBlank(cell) && !cell.selfCheck ? [{ key: `${i}-${j}`, cell }] : [])),
  );
  const isRight = (key: string, accepted: string[]) => matchesAccepted(values[key] ?? '', accepted);
  const correct = graded.filter(({ key, cell }) => isRight(key, cell.accepted)).length;
  const hasSelfCheck = question.rows.some((row) => row.some((cell) => isBlank(cell) && cell.selfCheck));

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              {question.columns.map((c) => (
                <th key={c} scope="col" className="px-3 py-2 font-mono text-xs font-medium text-muted">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row, i) => (
              <tr key={i} className="border-b border-line last:border-b-0">
                {row.map((cell, j) => {
                  const key = `${i}-${j}`;
                  if (!isBlank(cell)) {
                    return (
                      <td key={j} className="px-3 py-2 align-middle">
                        {cell.given}
                      </td>
                    );
                  }
                  const mark = checked && !cell.selfCheck ? isRight(key, cell.accepted) : null;
                  const tone = mark === null ? 'border-line-strong' : mark ? 'border-correct' : 'border-wrong';
                  const label = `${question.columns[j]}, row ${i + 1}`;
                  const set = (value: string) => {
                    setValues({ ...values, [key]: value });
                    setChecked(false);
                  };
                  return (
                    <td key={j} className="min-w-28 px-2 py-1.5 align-middle">
                      <div className="flex items-center gap-1.5">
                        {cell.options ? (
                          <select
                            aria-label={label}
                            value={values[key] ?? ''}
                            onChange={(event) => set(event.target.value)}
                            className={`${fieldClass} ${tone}`}
                          >
                            <option value="">Choose…</option>
                            {cell.options.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            aria-label={label}
                            value={values[key] ?? ''}
                            onChange={(event) => set(event.target.value)}
                            autoComplete="off"
                            spellCheck={false}
                            className={`${fieldClass} ${tone}`}
                          />
                        )}
                        {mark !== null && (
                          <span className={mark ? 'text-correct' : 'text-wrong'}>
                            {mark ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
                            <span className="sr-only">{mark ? 'Correct' : 'Incorrect'}</span>
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {graded.length > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => setChecked(true)}>
            <Check className="size-4" aria-hidden="true" />
            Check table
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setValues({});
            setChecked(false);
          }}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </button>
      </div>
      {hasSelfCheck && graded.length === 0 && (
        <p className="mt-3 text-sm text-muted">Many answers can be valid here. Compare yours with the reference solution.</p>
      )}
      {checked && (
        <Result ok={correct === graded.length}>
          {correct} of {graded.length} cells correct.
          {correct < graded.length ? ' Lists are compared in the order the question asks for.' : ''}
        </Result>
      )}
    </div>
  );
}

/** Diagram completion: choose the missing parts and see them placed in the figure. */
export function CompleteExercise({ question }: { question: CompleteQuestion }) {
  const [choices, setChoices] = usePracticeWork<Record<string, string>>(`${question.id}:slots`, {});
  const [checked, setChecked] = usePracticeWork(`${question.id}:checked`, false);
  const correct = question.slots.filter((s) => choices[s.nodeId] === s.expected).length;
  const name = (nodeId: string) => question.figure.nodes.find((n) => n.id === nodeId)?.label ?? nodeId;

  return (
    <div>
      <div className="rounded-xl border border-line p-3">
        <GraphFigure graph={question.figure} title="Incomplete diagram" labels={choices} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {question.slots.map((slot) => {
          const mark = checked ? choices[slot.nodeId] === slot.expected : null;
          return (
            <label key={slot.nodeId} className="block">
              <span className="eyebrow flex items-center gap-1.5">
                Part {name(slot.nodeId)}
                {mark !== null && (
                  <span className={mark ? 'text-correct' : 'text-wrong'}>{mark ? 'correct' : 'incorrect'}</span>
                )}
              </span>
              <select
                value={choices[slot.nodeId] ?? ''}
                onChange={(event) => {
                  const next = { ...choices };
                  if (event.target.value) next[slot.nodeId] = event.target.value;
                  else delete next[slot.nodeId];
                  setChoices(next);
                  setChecked(false);
                }}
                className={`${fieldClass} mt-1 ${mark === null ? 'border-line-strong' : mark ? 'border-correct' : 'border-wrong'}`}
              >
                <option value="">Choose…</option>
                {slot.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost" onClick={() => setChecked(true)}>
          <Check className="size-4" aria-hidden="true" />
          Check diagram
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setChoices({});
            setChecked(false);
          }}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </button>
      </div>
      {checked && (
        <Result ok={correct === question.slots.length}>
          {correct} of {question.slots.length} parts correct.
        </Result>
      )}
    </div>
  );
}

const SYMBOLS = ['∀', '∃', '¬', '∧', '∨', '⇒', '⇔', '(', ')'] as const;

/**
 * Symbolic answers with a symbol keyboard. Equivalent formulas can look different, so a
 * non-match is reported as "compare", never as wrong.
 */
export function LogicExercise({ question }: { question: LogicQuestion }) {
  const [value, setValue] = usePracticeWork(`${question.id}:logic`, '');
  const [checked, setChecked] = usePracticeWork(`${question.id}:checked`, false);
  const input = useRef<HTMLInputElement>(null);
  const inputId = `${question.id}-logic`;

  const insert = (symbol: string) => {
    const el = input.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    setValue(value.slice(0, start) + symbol + value.slice(end));
    setChecked(false);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + symbol.length, start + symbol.length);
    });
  };
  const match = matchesAccepted(value, question.accepted);

  return (
    <div>
      <label htmlFor={inputId} className="eyebrow">
        Your expression
      </label>
      <input
        id={inputId}
        ref={input}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setChecked(false);
        }}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`${fieldClass} mt-2 border-line-strong font-mono text-base`}
      />
      <div role="group" aria-label="Insert symbol" className="mt-2 flex flex-wrap gap-1.5">
        {SYMBOLS.map((symbol) => (
          <button
            key={symbol}
            type="button"
            aria-label={`Insert ${symbol}`}
            onClick={() => insert(symbol)}
            className="size-11 rounded-lg border border-line-strong bg-surface font-mono text-base transition-colors hover:border-ink"
          >
            {symbol}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        You can also type <span className="font-mono">forall exists ~ &amp; | -&gt; &lt;-&gt;</span>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost" disabled={!value.trim()} onClick={() => setChecked(true)}>
          <Check className="size-4" aria-hidden="true" />
          Compare with reference
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!value}
          onClick={() => {
            setValue('');
            setChecked(false);
          }}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear
        </button>
      </div>
      {checked && (
        <Result ok={match}>
          {match
            ? 'Matches a reference form.'
            : 'Not an exact match. Equivalent forms or other variable names can still be correct, so compare with the reference.'}
        </Result>
      )}
    </div>
  );
}
