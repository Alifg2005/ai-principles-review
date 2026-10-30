import type { Graph } from './practiceSchema';

interface TreeOptions {
  /** Node annotations, e.g. heuristic values. */
  notes?: Record<string, string>;
  /** Edge labels keyed `parent>child`, e.g. step costs. */
  costs?: Record<string, string | number>;
  goals?: string[];
  directed?: boolean;
}

const LEVEL_GAP = 66;
const LEAF_GAP = 52;
const MARGIN = 34;

/**
 * Lays out a tree from a child map, so question files state structure rather than coordinates.
 * Leaves are spaced evenly and each parent is centred over its children.
 */
export function tree(root: string, children: Record<string, string[]>, options: TreeOptions = {}): Graph {
  const { notes = {}, costs = {}, goals = [], directed = true } = options;
  const position = new Map<string, { x: number; depth: number }>();
  let nextLeaf = 0;

  const place = (id: string, depth: number): number => {
    const kids = children[id] ?? [];
    const xs = kids.map((kid) => place(kid, depth + 1));
    const x = xs.length ? (xs[0]! + xs[xs.length - 1]!) / 2 : MARGIN + LEAF_GAP * nextLeaf++;
    position.set(id, { x, depth });
    return x;
  };
  place(root, 0);

  const placed = [...position.entries()];
  const maxDepth = Math.max(...placed.map(([, p]) => p.depth));
  return {
    directed,
    // Extra room on the right keeps node annotations inside the figure.
    width: Math.max(MARGIN * 2 + LEAF_GAP * Math.max(nextLeaf - 1, 1) + 30, 200),
    height: MARGIN * 2 + LEVEL_GAP * maxDepth,
    nodes: placed.map(([id, p]) => ({
      id,
      label: id,
      x: p.x,
      y: MARGIN + LEVEL_GAP * p.depth,
      ...(notes[id] !== undefined ? { note: notes[id] } : {}),
      ...(goals.includes(id) ? { tone: 'goal' as const } : {}),
    })),
    edges: Object.entries(children).flatMap(([parent, kids]) =>
      kids.map((kid) => {
        const cost = costs[`${parent}>${kid}`];
        return { from: parent, to: kid, ...(cost !== undefined ? { label: String(cost) } : {}) };
      }),
    ),
  };
}
