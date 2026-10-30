import { Eraser, RotateCcw, Undo2 } from 'lucide-react';
import { useRef, useState, type PointerEvent } from 'react';
import { usePracticeWork } from '../../hooks/usePracticeWork';

type Stroke = readonly (readonly [number, number])[];
interface DrawWork {
  strokes: readonly Stroke[];
  /** Earlier states for Undo, so Clear can be undone too. */
  history: readonly (readonly Stroke[])[];
}

const WIDTH = 640;
const HEIGHT = 400;
const EMPTY: DrawWork = { strokes: [], history: [] };

const toPath = (stroke: Stroke) =>
  stroke.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') +
  (stroke.length === 1 ? ` L${stroke[0]![0].toFixed(1)} ${stroke[0]![1].toFixed(1)}` : '');

/** Freehand workspace for mouse, pen and touch. Strokes are vector paths held in memory only. */
export function DrawExercise({ id }: { id: string }) {
  const [work, setWork] = usePracticeWork<DrawWork>(`${id}:drawing`, EMPTY);
  const [current, setCurrent] = useState<Stroke | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  const point = (event: PointerEvent<SVGSVGElement>): [number, number] => {
    const rect = svg.current?.getBoundingClientRect();
    const scaleX = rect?.width ? WIDTH / rect.width : 1;
    const scaleY = rect?.height ? HEIGHT / rect.height : 1;
    return [(event.clientX - (rect?.left ?? 0)) * scaleX, (event.clientY - (rect?.top ?? 0)) * scaleY];
  };

  const finish = () => {
    if (current) setWork({ strokes: [...work.strokes, current], history: [...work.history, work.strokes] });
    setCurrent(null);
  };

  return (
    <div>
      <svg
        ref={svg}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Drawing area with ${work.strokes.length} ${work.strokes.length === 1 ? 'stroke' : 'strokes'}`}
        data-testid="drawing-area"
        className="lab-grid block h-auto w-full cursor-crosshair rounded-xl border border-line-strong bg-surface"
        style={{ touchAction: 'none' }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture?.(event.pointerId);
          setCurrent([point(event)]);
        }}
        onPointerMove={(event) => {
          if (current) setCurrent([...current, point(event)]);
        }}
        onPointerUp={finish}
        onPointerCancel={finish}
      >
        {[...work.strokes, ...(current ? [current] : [])].map((stroke, i) => (
          <path
            key={i}
            d={toPath(stroke)}
            fill="none"
            className="stroke-ink"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <p className="mt-2 text-xs text-muted">Draw with a mouse, pen or finger. Paper works too; the reference is the same.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={work.history.length === 0}
          onClick={() =>
            setWork({ strokes: work.history[work.history.length - 1] ?? [], history: work.history.slice(0, -1) })
          }
        >
          <Undo2 className="size-4" aria-hidden="true" />
          Undo
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={work.strokes.length === 0}
          onClick={() => setWork({ strokes: [], history: [...work.history, work.strokes] })}
        >
          <Eraser className="size-4" aria-hidden="true" />
          Clear
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={work.strokes.length === 0 && work.history.length === 0}
          onClick={() => setWork(EMPTY)}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  );
}
