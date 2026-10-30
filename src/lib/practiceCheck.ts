import type { Graph } from './practiceSchema';

/**
 * Normalises notation for comparison: ASCII logic shortcuts become symbols, and spacing and
 * case are ignored. Parentheses are kept because they can change the meaning.
 */
export function normaliseNotation(value: string): string {
  return value
    .toLowerCase()
    .replace(/forall/g, '∀')
    .replace(/exists/g, '∃')
    .replace(/<=>|<->/g, '⇔')
    .replace(/=>|->|→/g, '⇒')
    .replace(/[~!]/g, '¬')
    .replace(/&&?|\band\b/g, '∧')
    .replace(/\|\|?|\bor\b/g, '∨')
    .replace(/[\s.,]/g, '');
}

export function matchesAccepted(value: string, accepted: readonly string[]): boolean {
  const normalised = normaliseNotation(value);
  return normalised.length > 0 && accepted.some((a) => normaliseNotation(a) === normalised);
}

export interface SequenceCheck {
  readonly correct: boolean;
  /** Per-position result for the student's order. */
  readonly positions: readonly boolean[];
  readonly matched: number;
}

export function checkSequence(order: readonly string[], expected: readonly string[]): SequenceCheck {
  const positions = order.map((token, i) => token === expected[i]);
  const matched = positions.filter(Boolean).length;
  return { correct: order.length === expected.length && matched === expected.length, positions, matched };
}

export interface BuiltNode {
  readonly id: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
}
export interface BuiltEdge {
  readonly from: string;
  readonly to: string;
  readonly label?: string;
}

export interface ConstructionCheck {
  readonly correct: boolean;
  readonly missingNodes: readonly string[];
  readonly extraNodes: readonly string[];
  readonly missingEdges: readonly string[];
  readonly extraEdges: readonly string[];
}

const clean = (label: string) => label.trim().toLowerCase();

/** Compares a student's graph with the reference by labels, so node placement does not matter. */
export function checkConstruction(
  nodes: readonly BuiltNode[],
  edges: readonly BuiltEdge[],
  reference: Graph,
  { directed, compareEdgeLabels }: { directed: boolean; compareEdgeLabels: boolean },
): ConstructionCheck {
  const refLabel = new Map(reference.nodes.map((n) => [n.id, n.label]));
  const builtLabel = new Map(nodes.map((n) => [n.id, n.label]));

  const key = (from: string, to: string, label: string | undefined) => {
    const ends = [clean(from), clean(to)];
    if (!directed) ends.sort();
    return `${ends[0]}|${ends[1]}|${compareEdgeLabels ? clean(label ?? '') : ''}`;
  };
  const show = (from: string, to: string, label: string | undefined) =>
    `${from} ${directed ? '→' : '–'} ${to}${compareEdgeLabels && label ? ` (${label})` : ''}`;

  const refEdges = new Map(
    reference.edges.map((e) => {
      const from = refLabel.get(e.from) ?? e.from;
      const to = refLabel.get(e.to) ?? e.to;
      return [key(from, to, e.label), show(from, to, e.label)];
    }),
  );
  const myEdges = new Map(
    edges.map((e) => {
      const from = builtLabel.get(e.from) ?? e.from;
      const to = builtLabel.get(e.to) ?? e.to;
      return [key(from, to, e.label), show(from, to, e.label)];
    }),
  );
  const refNodes = reference.nodes.map((n) => n.label);
  const myNodes = nodes.map((n) => n.label);

  const missingNodes = refNodes.filter((l) => !myNodes.some((m) => clean(m) === clean(l)));
  const extraNodes = myNodes.filter((l) => !refNodes.some((r) => clean(r) === clean(l)));
  const missingEdges = [...refEdges].filter(([k]) => !myEdges.has(k)).map(([, v]) => v);
  const extraEdges = [...myEdges].filter(([k]) => !refEdges.has(k)).map(([, v]) => v);

  return {
    correct: !missingNodes.length && !extraNodes.length && !missingEdges.length && !extraEdges.length,
    missingNodes,
    extraNodes,
    missingEdges,
    extraEdges,
  };
}
