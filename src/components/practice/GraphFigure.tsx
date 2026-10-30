import type { KeyboardEvent } from 'react';
import type { Graph, GraphNode } from '../../lib/practiceSchema';

const R = 18;
const BOX_H = 40;

interface Props {
  graph: Graph;
  /** Accessible name; a structural description is added automatically. */
  title: string;
  /** Replaces node labels by id, e.g. a student's choice in a completion exercise. */
  labels?: Record<string, string>;
  /** Small marker per node id, e.g. the visiting order. */
  badges?: Record<string, string>;
  onNodeClick?: (node: GraphNode) => void;
  className?: string;
}

const boxSize = (n: GraphNode) => ({ w: n.w ?? 120, h: n.h ?? BOX_H });

/** Point on a node's outline in the direction of (tx, ty). */
function anchor(n: GraphNode, tx: number, ty: number) {
  const dx = tx - n.x;
  const dy = ty - n.y;
  const len = Math.hypot(dx, dy) || 1;
  if (n.shape === 'box') {
    const { w, h } = boxSize(n);
    const scale = Math.min(w / 2 / (Math.abs(dx) || 1e-6), h / 2 / (Math.abs(dy) || 1e-6));
    return { x: n.x + dx * scale, y: n.y + dy * scale };
  }
  return { x: n.x + (dx / len) * R, y: n.y + (dy / len) * R };
}

function arrowHead(x: number, y: number, fromX: number, fromY: number) {
  const angle = Math.atan2(y - fromY, x - fromX);
  const size = 8;
  const point = (a: number) => `${x - size * Math.cos(a)},${y - size * Math.sin(a)}`;
  return `${x},${y} ${point(angle - 0.42)} ${point(angle + 0.42)}`;
}

/** Splits a label into lines that fit a box of the given width. */
function wrap(label: string, width: number): string[] {
  const max = Math.max(Math.floor(width / 6.4), 4);
  const lines: string[] = [];
  let line = '';
  for (const word of label.split(/\s+/)) {
    if (line && `${line} ${word}`.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function describeGraph(graph: Graph, labels: Record<string, string> = {}): string {
  const name = (id: string) => labels[id] ?? graph.nodes.find((n) => n.id === id)?.label ?? id;
  const nodes = graph.nodes.map((n) => `${name(n.id)}${n.note ? ` (${n.note})` : ''}`).join(', ');
  const edges = graph.edges
    .map((e) => `${name(e.from)} ${graph.directed ? 'to' : 'and'} ${name(e.to)}${e.label ? ` (${e.label})` : ''}`)
    .join('; ');
  return `Nodes: ${nodes}.${edges ? ` Connections: ${edges}.` : ''}`;
}

const NODE_FILL: Record<NonNullable<GraphNode['tone']> | 'default', string> = {
  default: 'fill-surface stroke-ink',
  goal: 'fill-accent-soft stroke-accent',
  start: 'fill-surface-2 stroke-ink',
  blank: 'fill-skip-soft stroke-skip',
  env: 'fill-surface-2 stroke-line-strong',
};

/** Renders any given or reference graph, tree or block diagram from data. */
export function GraphFigure({ graph, title, labels = {}, badges = {}, onNodeClick, className = '' }: Props) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const interactive = Boolean(onNodeClick);

  return (
    <svg
      viewBox={`0 0 ${graph.width} ${graph.height}`}
      className={`mx-auto block h-auto w-full ${className}`}
      style={{ maxWidth: Math.max(graph.width * 1.15, 320) }}
      role={interactive ? 'group' : 'img'}
      aria-label={`${title}. ${describeGraph(graph, labels)}`}
    >
      {graph.edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const start = anchor(a, b.x, b.y);
        const end = anchor(b, a.x, a.y);
        const mx = (start.x + end.x) / 2;
        const my = (start.y + end.y) / 2;
        return (
          <g key={i}>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className="stroke-muted"
              strokeWidth="1.25"
              {...(e.dashed ? { strokeDasharray: '4 3' } : {})}
            />
            {graph.directed && <polygon points={arrowHead(end.x, end.y, start.x, start.y)} className="fill-muted" />}
            {e.both && <polygon points={arrowHead(start.x, start.y, end.x, end.y)} className="fill-muted" />}
            {e.label && (
              <text
                x={mx}
                y={my}
                dy="0.32em"
                textAnchor="middle"
                className="fill-ink stroke-surface font-mono"
                fontSize="11"
                strokeWidth="3.5"
                style={{ paintOrder: 'stroke' }}
              >
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {graph.nodes.map((n) => {
        const label = labels[n.id] ?? n.label;
        const fill = NODE_FILL[n.tone ?? 'default'];
        const badge = badges[n.id];
        const activate = onNodeClick ? () => onNodeClick(n) : undefined;
        const nodeProps = activate
          ? {
              role: 'button',
              tabIndex: 0,
              'aria-label': `Node ${label}${badge ? `, position ${badge}` : ''}`,
              className: 'cursor-pointer outline-none [&:focus-visible>.halo]:stroke-accent',
              onClick: activate,
              onKeyDown: (event: KeyboardEvent) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  activate();
                }
              },
            }
          : {};
        if (n.shape === 'box') {
          const { w, h } = boxSize(n);
          const lines = wrap(label, w);
          return (
            <g key={n.id} {...nodeProps}>
              <rect
                x={n.x - w / 2}
                y={n.y - h / 2}
                width={w}
                height={h}
                rx="6"
                className={fill}
                strokeWidth="1.25"
              />
              <text x={n.x} y={n.y} textAnchor="middle" className="fill-ink font-sans" fontSize="11.5">
                {lines.map((line, i) => (
                  <tspan key={i} x={n.x} dy={i === 0 ? `${0.32 - (lines.length - 1) * 0.6}em` : '1.2em'}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        }
        return (
          <g key={n.id} {...nodeProps}>
            {activate && <circle className="halo fill-transparent stroke-transparent" cx={n.x} cy={n.y} r={R + 6} strokeWidth="2" />}
            <circle
              cx={n.x}
              cy={n.y}
              r={R}
              className={badge ? 'fill-accent stroke-accent' : fill}
              strokeWidth="1.25"
            />
            <text
              x={n.x}
              y={n.y}
              dy="0.34em"
              textAnchor="middle"
              className={`font-mono ${badge ? 'fill-on-accent' : 'fill-ink'}`}
              fontSize={label.length > 2 ? 10 : 13}
            >
              {label}
            </text>
            {n.note && (
              <text x={n.x + R + 3} y={n.y - R + 4} className="fill-muted font-mono" fontSize="10.5">
                {n.note}
              </text>
            )}
            {badge && (
              <text x={n.x - R - 3} y={n.y - R + 4} textAnchor="end" className="fill-accent font-mono" fontSize="10.5">
                {badge}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
