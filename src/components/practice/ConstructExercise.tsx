import { Check, Plus, RotateCcw, Undo2, X } from 'lucide-react';
import { useRef, useState, type PointerEvent } from 'react';
import { usePracticeWork } from '../../hooks/usePracticeWork';
import { checkConstruction, type BuiltEdge, type BuiltNode } from '../../lib/practiceCheck';
import type { ConstructQuestion } from '../../lib/practiceSchema';

const WIDTH = 520;
const HEIGHT = 340;
const R = 24;
const COLS = 5;

interface Built {
  nodes: readonly BuiltNode[];
  edges: readonly BuiltEdge[];
  history: readonly { nodes: readonly BuiltNode[]; edges: readonly BuiltEdge[] }[];
}
const EMPTY: Built = { nodes: [], edges: [], history: [] };

/** Next free grid position, so new nodes never land on top of each other. */
function slot(index: number) {
  const row = Math.floor(index / COLS);
  return { x: 56 + (index % COLS) * 102, y: 50 + (row % 4) * 80 };
}

/**
 * Graph and tree construction. Tap or press one node, then another, to connect them; drag to
 * rearrange. Every action also works by keyboard because nodes are real buttons.
 */
export function ConstructExercise({ question }: { question: ConstructQuestion }) {
  const [built, setBuilt] = usePracticeWork<Built>(`${question.id}:built`, EMPTY);
  const [checked, setChecked] = usePracticeWork(`${question.id}:checked`, false);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [edgeLabel, setEdgeLabel] = useState(question.edgeLabels?.[0] ?? '');
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: string; startX: number; startY: number; moved: boolean } | null>(null);

  const commit = (next: Pick<Built, 'nodes' | 'edges'>) => {
    setBuilt({ ...next, history: [...built.history, { nodes: built.nodes, edges: built.edges }] });
    setChecked(false);
  };
  const usedLabels = new Set(built.nodes.map((n) => n.label.toLowerCase()));
  const addNode = (label: string) => {
    const clean = label.trim();
    if (!clean || usedLabels.has(clean.toLowerCase())) return;
    commit({ nodes: [...built.nodes, { id: clean, label: clean, ...slot(built.nodes.length) }], edges: built.edges });
    setDraft('');
  };

  const tapNode = (id: string) => {
    if (selected === null) {
      setSelected(id);
      return;
    }
    if (selected !== id) {
      const label = question.edgeLabels ? edgeLabel : undefined;
      const exists = built.edges.some((e) => e.from === selected && e.to === id && e.label === label);
      if (!exists) {
        commit({ nodes: built.nodes, edges: [...built.edges, { from: selected, to: id, ...(label ? { label } : {}) }] });
      }
    }
    setSelected(null);
  };

  const toSvg = (event: PointerEvent) => {
    const rect = svg.current?.getBoundingClientRect();
    const sx = rect?.width ? WIDTH / rect.width : 1;
    const sy = rect?.height ? HEIGHT / rect.height : 1;
    return { x: (event.clientX - (rect?.left ?? 0)) * sx, y: (event.clientY - (rect?.top ?? 0)) * sy };
  };

  const moveNode = (id: string, x: number, y: number) => {
    const px = Math.min(Math.max(x, R), WIDTH - R);
    const py = Math.min(Math.max(y, R), HEIGHT - R);
    setBuilt({ ...built, nodes: built.nodes.map((n) => (n.id === id ? { ...n, x: px, y: py } : n)) });
  };

  const byId = new Map(built.nodes.map((n) => [n.id, n]));
  const reference = question.answer.figure;
  const result = reference
    ? checkConstruction(built.nodes, built.edges, reference, {
        directed: question.directed,
        compareEdgeLabels: Boolean(question.edgeLabels),
      })
    : null;

  return (
    <div>
      {question.nodeLabels ? (
        <div>
          <p className="eyebrow">Add nodes</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {question.nodeLabels.map((label) => (
              <button
                key={label}
                type="button"
                disabled={usedLabels.has(label.toLowerCase())}
                aria-label={`Add node ${label}`}
                onClick={() => addNode(label)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg border border-line-strong bg-surface px-3 text-sm transition-colors hover:border-ink disabled:opacity-35"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            addNode(draft);
          }}
        >
          <input
            aria-label="New node label"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Node label"
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3 text-sm"
          />
          <button type="submit" className="btn btn-ghost">
            <Plus className="size-4" aria-hidden="true" />
            Add
          </button>
        </form>
      )}

      {question.edgeLabels && (
        <label className="mt-4 block">
          <span className="eyebrow block">Label for the next connection</span>
          <select
            value={edgeLabel}
            onChange={(event) => setEdgeLabel(event.target.value)}
            className="mt-1 min-h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm sm:w-64"
          >
            {question.edgeLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
      )}

      <p className="mt-4 text-sm text-muted" role="status">
        {selected
          ? `${selected} selected. Choose the node to connect it ${question.directed ? 'to' : 'with'}, or ${selected} again to cancel.`
          : 'Tap a node, then another, to connect them. Drag a node to move it.'}
      </p>

      <svg
        ref={svg}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="group"
        aria-label="Graph workspace"
        className="lab-grid mt-2 block h-auto w-full rounded-xl border border-line-strong bg-surface"
      >
        {built.edges.map((e, i) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          const ux = (b.x - a.x) / len;
          const uy = (b.y - a.y) / len;
          const x2 = b.x - ux * R;
          const y2 = b.y - uy * R;
          const angle = Math.atan2(uy, ux);
          const head = [angle - 0.42, angle + 0.42].map((t) => `${x2 - 10 * Math.cos(t)},${y2 - 10 * Math.sin(t)}`).join(' ');
          return (
            <g key={i}>
              <line x1={a.x + ux * R} y1={a.y + uy * R} x2={x2} y2={y2} className="stroke-ink" strokeWidth="1.5" />
              {question.directed && <polygon points={`${x2},${y2} ${head}`} className="fill-ink" />}
              {e.label && (
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2}
                  textAnchor="middle"
                  dy="0.3em"
                  fontSize="12"
                  strokeWidth="3.5"
                  className="fill-ink stroke-surface font-mono"
                  style={{ paintOrder: 'stroke' }}
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {built.nodes.map((n) => (
          <g
            key={n.id}
            role="button"
            tabIndex={0}
            aria-label={`Node ${n.label}${selected === n.id ? ', selected' : ''}`}
            aria-pressed={selected === n.id}
            className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-accent"
            style={{ touchAction: 'none' }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture?.(event.pointerId);
              drag.current = { id: n.id, startX: event.clientX, startY: event.clientY, moved: false };
            }}
            onPointerMove={(event) => {
              const d = drag.current;
              if (!d || d.id !== n.id) return;
              if (!d.moved && Math.hypot(event.clientX - d.startX, event.clientY - d.startY) < 6) return;
              d.moved = true;
              const { x, y } = toSvg(event);
              moveNode(n.id, x, y);
            }}
            onClick={() => {
              // A drag ends in a click event too; only a real tap selects or connects.
              const moved = drag.current?.moved ?? false;
              drag.current = null;
              if (!moved) tapNode(n.id);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                tapNode(n.id);
              }
            }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={R}
              strokeWidth={selected === n.id ? 3 : 1.5}
              className={selected === n.id ? 'fill-accent-soft stroke-accent' : 'fill-surface stroke-ink'}
            />
            <text x={n.x} y={n.y} dy="0.34em" textAnchor="middle" fontSize={n.label.length > 5 ? 9.5 : 12.5} className="fill-ink font-mono select-none">
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      {built.edges.length > 0 && (
        <ul aria-label="Connections" className="mt-3 flex flex-wrap gap-1.5">
          {built.edges.map((e, i) => (
            <li key={i} className="flex items-center gap-1 rounded-lg border border-line pl-2.5 text-sm">
              {e.from} {question.directed ? '→' : '–'} {e.to}
              {e.label ? ` (${e.label})` : ''}
              <button
                type="button"
                aria-label={`Remove connection ${e.from} to ${e.to}`}
                onClick={() => commit({ nodes: built.nodes, edges: built.edges.filter((_, j) => j !== i) })}
                className="inline-flex size-11 items-center justify-center text-muted hover:text-ink"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={built.history.length === 0}
          onClick={() => {
            const previous = built.history[built.history.length - 1];
            if (previous) setBuilt({ ...previous, history: built.history.slice(0, -1) });
            setSelected(null);
            setChecked(false);
          }}
        >
          <Undo2 className="size-4" aria-hidden="true" />
          Undo
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={built.nodes.length === 0}
          onClick={() => {
            setBuilt(EMPTY);
            setSelected(null);
            setChecked(false);
          }}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </button>
        <button type="button" className="btn btn-ghost" disabled={built.nodes.length === 0} onClick={() => setChecked(true)}>
          <Check className="size-4" aria-hidden="true" />
          Check structure
        </button>
      </div>

      {checked && result && (
        <div
          role="status"
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${result.correct ? 'bg-correct-soft text-correct' : 'bg-skip-soft'}`}
        >
          {result.correct ? (
            'The structure matches the reference.'
          ) : (
            <ul className="space-y-1">
              {result.missingNodes.length > 0 && <li>Missing nodes: {result.missingNodes.join(', ')}</li>}
              {result.extraNodes.length > 0 && <li>Extra nodes: {result.extraNodes.join(', ')}</li>}
              {result.missingEdges.length > 0 && <li>Missing connections: {result.missingEdges.join(', ')}</li>}
              {result.extraEdges.length > 0 && <li>Extra connections: {result.extraEdges.join(', ')}</li>}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
