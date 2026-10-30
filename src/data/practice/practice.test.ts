/**
 * Content gate for Written & Practical Review. Runs in `npm run validate` and every build.
 * Model answers for algorithms and logic are recomputed here, so a wrong key fails the build.
 */
import { readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { checkConstruction } from '../../lib/practiceCheck';
import { validatePracticeRegistry } from '../../lib/practiceRegistry';
import type { Block, Graph, PracticeQuestion } from '../../lib/practiceSchema';
import { validateRegistry } from '../../lib/registry';
import { chapterRegistry } from '../chapters';
import { practiceRegistry } from './index';

const chapters = validateRegistry(chapterRegistry);
const sets = validatePracticeRegistry(practiceRegistry, chapters);
const questions = sets.flatMap((s) => s.questions);

function question(id: string): PracticeQuestion {
  const q = questions.find((item) => item.id === id);
  if (!q) throw new Error(`no question ${id}`);
  return q;
}

/** Children or neighbours in edge order, then alphabetical where a question says so. */
function neighbours(graph: Graph, id: string, sorted = false): string[] {
  const out = graph.edges.flatMap((e) => {
    if (e.from === id) return [e.to];
    return !graph.directed && e.to === id ? [e.from] : [];
  });
  return sorted ? out.sort() : out;
}
const cost = (graph: Graph, a: string, b: string) => {
  const edge = graph.edges.find((e) => e.from === a && e.to === b);
  return Number(edge?.label);
};
const heuristic = (graph: Graph, id: string) => Number(graph.nodes.find((n) => n.id === id)?.note?.replace('h=', ''));
const figureOf = (id: string) => {
  const figure = question(id).figure;
  if (!figure) throw new Error(`${id} has no figure`);
  return figure;
};
const expectedOf = (id: string) => {
  const q = question(id);
  if (q.kind !== 'sequence') throw new Error(`${id} is not a sequence`);
  return q.expected;
};
const rowsOf = (id: string) => {
  const q = question(id);
  if (q.kind !== 'table') throw new Error(`${id} is not a table`);
  return q.rows;
};
const cellText = (cell: unknown) => {
  const c = cell as { given?: string; accepted?: string[] };
  return c.given ?? c.accepted?.[0] ?? '';
};

function bfs(graph: Graph, start: string, goal?: string): string[] {
  const seen = new Set([start]);
  const queue = [start];
  const order: string[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    if (node === goal) return order;
    for (const next of neighbours(graph, node, true)) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}

function dfs(graph: Graph, node: string, goal: string | undefined, limit = Infinity, depth = 0): { order: string[]; found: boolean } {
  const order = [node];
  if (node === goal) return { order, found: true };
  if (depth >= limit) return { order, found: false };
  for (const next of neighbours(graph, node)) {
    const sub = dfs(graph, next, goal, limit, depth + 1);
    order.push(...sub.order);
    if (sub.found) return { order, found: true };
  }
  return { order, found: false };
}

/** Best-first family: UCS with g, greedy with h, A* with g + h. Ties break alphabetically. */
function bestFirst(graph: Graph, start: string, goal: string, f: (g: number, id: string) => number) {
  const frontier = new Map<string, { g: number; path: string[] }>([[start, { g: 0, path: [start] }]]);
  const closed = new Set<string>();
  const order: string[] = [];
  while (frontier.size) {
    const [node, entry] = [...frontier.entries()].sort(
      ([a, x], [b, y]) => f(x.g, a) - f(y.g, b) || a.localeCompare(b),
    )[0]!;
    frontier.delete(node);
    closed.add(node);
    order.push(node);
    if (node === goal) return { order, g: entry.g, path: entry.path };
    for (const next of neighbours(graph, node)) {
      const g = entry.g + cost(graph, node, next);
      const known = frontier.get(next);
      if (!closed.has(next) && (!known || g < known.g)) frontier.set(next, { g, path: [...entry.path, next] });
    }
  }
  throw new Error('no path');
}

/** True cheapest remaining cost from every node, for checking admissibility. */
function trueCost(graph: Graph, node: string, goal: string): number {
  if (node === goal) return 0;
  return Math.min(Infinity, ...neighbours(graph, node).map((n) => cost(graph, node, n) + trueCost(graph, n, goal)));
}

const blockWords = (blocks: readonly Block[]) =>
  blocks
    .flatMap((b) => {
      if (b.type === 'p' || b.type === 'formula') return [b.text];
      if (b.type === 'table') return b.table.rows.flat();
      return b.items;
    })
    .join(' ')
    .split(/\s+/).length;

describe('practice registry', () => {
  it('passes schema and chapter cross-validation', () => {
    expect(sets.length).toBeGreaterThan(0);
  });

  it('registers every data file, in chapter order', () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const files = readdirSync(dir).filter((f) => /^\d{2}-[a-z0-9-]+\.ts$/.test(f));
    expect(files).toHaveLength(practiceRegistry.length);
    const ids = sets.map((s) => s.chapterId);
    expect(ids).toEqual(chapters.map((c) => c.id).filter((id) => ids.includes(id)));
  });

  it('has no duplicate prompts', () => {
    const prompts = questions.map((q) => q.prompt.toLowerCase());
    expect(new Set(prompts).size).toBe(prompts.length);
  });

  it('keeps short answers short, so revision stays quick', () => {
    for (const q of questions) {
      expect(blockWords(q.answer.short), `${q.id} short answer`).toBeLessThanOrEqual(75);
    }
  });

  it('gives every chapter a balance of written and practical work', () => {
    for (const set of sets) {
      const written = set.questions.filter((q) => q.kind === 'written').length;
      expect(written, set.chapterId).toBeGreaterThanOrEqual(2);
      expect(set.questions.length - written, set.chapterId).toBeGreaterThanOrEqual(4);
    }
  });

  it('uses the agreed neutral text for all 12 common mix-ups', () => {
    const expected: Record<string, RegExp> = {
      'p01-07': /the valid conclusion is 'Socrates is mortal'/,
      'p01-08': /^ANI stands for Artificial Narrow Intelligence\. AGI is the separate, later stage\.$/,
      'p03-04': /different algorithms, although both are sometimes abbreviated BFS/,
      'p03-05': /A path connects nodes/,
      'p04-03': /^BFS is optimal only when all step costs are equal\.$/,
      'p04-07': /at depth at most L, including exactly L/,
      'p04-10': /A priority queue is the standard way/,
      'p05-03': /complete unless infinitely many nodes have f < f\(G\)/,
      'p05-05': /Treat the distances as plain numbers/,
      'p08-03': /closed formula or sentence/,
      'p08-04': /^∃x At\(x, IAU\) ⇒ Smart\(x\)\. The sentence is true because/,
      'p08-05': /∀x ∃y likes\(y,x\).*∃y ∀x likes\(y,x\)\. Quantifier order matters\.$/,
    };
    for (const [id, pattern] of Object.entries(expected)) expect(question(id).mixUp, id).toMatch(pattern);
    expect(questions.filter((q) => q.mixUp)).toHaveLength(12);
  });

  it('ships no source metadata or commentary about slides', () => {
    for (const q of questions) expect(q, q.id).not.toHaveProperty('sourceReference');
    expect(JSON.stringify(sets)).not.toMatch(/\.pdf|\bslides?\b|\blecture\b|extraction/i);
  });

  it('states the A* assumptions for tree and graph search', () => {
    const text = JSON.stringify(question('p05-03').answer.more);
    for (const phrase of ['Tree search', 'Graph search', 'consistent', 'admissible', 'selected for expansion']) {
      expect(text).toContain(phrase);
    }
  });

  it('identifies the wff definition as the convention of this lecture', () => {
    const q = question('p08-03');
    expect(JSON.stringify(q.answer.short)).toContain("this course's convention");
    expect(q.mixUp).toContain('closed formula');
  });

  it('states the p02-09 assumptions up front and does not auto-mark it', () => {
    const q = question('p02-09');
    expect(JSON.stringify(q.context)).toContain('only the capabilities described');
    const blanks = rowsOf('p02-09').map((row) => row[1] as { accepted: string[]; selfCheck?: boolean });
    expect(blanks.every((cell) => cell.selfCheck)).toBe(true);
    // The model classification itself is unchanged.
    expect(blanks.map((cell) => cell.accepted[0])).toEqual(['Simple reflex', 'Model-based reflex', 'Goal-based', 'Utility-based', 'Learning']);
  });

  it('preserves the agreed conventions', () => {
    expect(question('p04-10').mixUp).toContain('priority queue');
    expect(question('p07-13').answer.shortStatus).toBe('original-worked-example');
    // No unit is chosen for the Romania distances.
    expect(question('p05-05').mixUp).toContain('plain numbers');
    // Tree and graph search stay optional, outside every short answer.
    for (const q of questions) {
      expect(JSON.stringify(q.answer.short), q.id).not.toMatch(/tree search|graph search/i);
    }
    // Search traces keep the lecture's timing: the goal is tested on removal or selection, never generation.
    for (const id of ['p03-09', 'p04-12', 'p04-13', 'p04-14', 'p05-06', 'p05-07', 'p05-08']) {
      expect(question(id).traceRules?.goalTest, id).toMatch(/removed|chosen|selected/);
    }
  });

  it('does not present PEAS or agent classification as the only possible answer', () => {
    expect(question('p02-07').prompt).toContain('Several answers are valid');
    expect(JSON.stringify(question('p02-07').answer.short)).toContain('One reasonable answer');
    expect(question('p02-09').prompt).toContain('Assume only what is stated');
    expect(JSON.stringify(question('p02-09').answer.more)).toContain('equally defensible');
  });

  it('shows order, tie-breaking and goal-test rules on every search trace', () => {
    const traces = ['p03-06', 'p03-07', 'p03-08', 'p03-09', 'p04-12', 'p04-13', 'p04-14', 'p04-15', 'p04-16', 'p05-06', 'p05-07', 'p05-08'];
    for (const id of traces) {
      expect(question(id).traceRules?.order, id).toBeTruthy();
      expect(question(id).traceRules?.goalTest, id).toBeTruthy();
    }
    // Any exercise on a search graph in these chapters must state its rules.
    for (const q of questions) {
      if (/^p0[345]-/.test(q.id) && q.figure && q.kind !== 'complete') expect(q.traceRules, q.id).toBeDefined();
    }
  });
});

describe('algorithm answers match a real run', () => {
  it('BFS', () => {
    expect(expectedOf('p03-06')).toEqual(bfs(figureOf('p03-06'), 'S'));
    expect(expectedOf('p04-12')).toEqual(bfs(figureOf('p04-12'), 'A', 'H'));
  });

  it('BFS queue trace on the cyclic graph', () => {
    const graph = figureOf('p03-07');
    const seen = new Set(['P']);
    const queue = ['P'];
    for (const row of rowsOf('p03-07')) {
      const removed = queue.shift()!;
      expect(cellText(row[0])).toBe(removed);
      for (const next of neighbours(graph, removed, true)) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
      expect(cellText(row[1])).toBe(queue.join(', ') || 'empty');
    }
  });

  it('BFS tree construction', () => {
    const q = question('p03-08');
    const graph = figureOf('p03-08');
    const reference = q.answer.figure!;
    const seen = new Set(['P']);
    const queue = ['P'];
    const edges: { from: string; to: string }[] = [];
    while (queue.length) {
      const node = queue.shift()!;
      for (const next of neighbours(graph, node, true)) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
          edges.push({ from: node, to: next });
        }
      }
    }
    const nodes = [...seen].map((id) => ({ id, label: id, x: 0, y: 0 }));
    expect(checkConstruction(nodes, edges, reference, { directed: true, compareEdgeLabels: false }).correct).toBe(true);
  });

  it('best-first search trace and path cost', () => {
    const graph = figureOf('p03-09');
    const run = bestFirst(graph, 'S', 'G', (_g, id) => heuristic(graph, id));
    expect(rowsOf('p03-09').map((row) => cellText(row[1]))).toEqual(run.order);
    expect(run.path).toEqual(['S', 'B', 'E', 'G']);
    expect(run.g).toBe(10);
  });

  it('DFS order and stack trace', () => {
    const graph = figureOf('p04-13');
    const run = dfs(graph, 'A', 'H');
    expect(rowsOf('p04-13').map((row) => cellText(row[0]))).toEqual(run.order);
    const stack = ['A'];
    for (const row of rowsOf('p04-13')) {
      const removed = stack.shift()!;
      if (removed === 'H') {
        expect(cellText(row[1])).toBe('goal');
        break;
      }
      stack.unshift(...neighbours(graph, removed));
      expect(cellText(row[1])).toBe(stack.join(', '));
    }
  });

  it('UCS trace and optimal cost', () => {
    const graph = figureOf('p04-14');
    const run = bestFirst(graph, 'S', 'G', (g) => g);
    expect(run.order).toEqual(['S', 'B', 'C', 'A', 'D', 'G']);
    expect(run.path).toEqual(['S', 'B', 'D', 'G']);
    expect(run.g).toBe(7);
    expect(rowsOf('p04-14').map((row) => cellText(row[0]).split(' ')[0])).toEqual(run.order.slice(0, -1));
    expect(trueCost(graph, 'S', 'G')).toBe(7);
  });

  it('depth-limited search stops at the limit without finding the goal', () => {
    const run = dfs(figureOf('p04-15'), 'A', 'G', 2);
    expect(expectedOf('p04-15')).toEqual(run.order);
    expect(run.found).toBe(false);
  });

  it('iterative deepening visits each limit in full', () => {
    const graph = figureOf('p04-16');
    rowsOf('p04-16').forEach((row, limit) => {
      expect(cellText(row[1])).toBe(dfs(graph, 'A', 'F', limit).order.join(', '));
    });
    expect(dfs(graph, 'A', 'F', 2).found).toBe(true);
    expect(dfs(graph, 'A', 'F', 1).found).toBe(false);
  });

  it('greedy best-first search', () => {
    const t = figureOf('p05-06');
    expect(expectedOf('p05-06')).toEqual(bestFirst(t, 'S', 'G', (_g, id) => heuristic(t, id)).order);
    const g = figureOf('p05-07');
    const run = bestFirst(g, 'S', 'G', (_x, id) => heuristic(g, id));
    expect(expectedOf('p05-07')).toEqual(run.order);
    expect(run.g).toBe(11);
  });

  it('A* finds the optimal path with an admissible heuristic', () => {
    const graph = figureOf('p05-08');
    const run = bestFirst(graph, 'S', 'G', (g, id) => g + heuristic(graph, id));
    expect(run.order).toEqual(['S', 'A', 'C', 'G']);
    expect(rowsOf('p05-08').map((row) => cellText(row[2]))).toEqual(run.order.slice(1));
    expect(run.g).toBe(trueCost(graph, 'S', 'G'));
    for (const node of graph.nodes) {
      expect(heuristic(graph, node.id), node.id).toBeLessThanOrEqual(trueCost(graph, node.id, 'G'));
    }
  });

  it('the A* graph heuristic is consistent, as its answer claims', () => {
    const graph = figureOf('p05-08');
    for (const e of graph.edges) {
      expect(heuristic(graph, e.from), `${e.from}->${e.to}`).toBeLessThanOrEqual(Number(e.label) + heuristic(graph, e.to));
    }
  });

  it('claims of no ties hold in the traces that state them', () => {
    const noTies = (id: string, value: (g: number, n: string) => number) => {
      const graph = figureOf(id);
      const frontier = new Map([['S', 0]]);
      const closed = new Set<string>();
      while (frontier.size) {
        const ranked = [...frontier].map(([n, g]) => ({ n, f: value(g, n) })).sort((a, b) => a.f - b.f);
        expect(ranked[0]!.f, id).not.toBe(ranked[1]?.f);
        const node = ranked[0]!.n;
        const g = frontier.get(node)!;
        frontier.delete(node);
        closed.add(node);
        if (node === 'G') return;
        for (const next of neighbours(graph, node)) {
          const step = Number(graph.edges.find((e) => e.from === node && e.to === next)?.label) || 0;
          if (!closed.has(next) && (!frontier.has(next) || g + step < frontier.get(next)!)) frontier.set(next, g + step);
        }
      }
    };
    for (const id of ['p03-09', 'p05-06', 'p05-07']) {
      const graph = figureOf(id);
      noTies(id, (_g, n) => heuristic(graph, n));
    }
    noTies('p04-14', (g) => g);
  });

  it('A* arithmetic for the Romania table', () => {
    for (const row of rowsOf('p05-10')) {
      const [a, b] = cellText(row[1]).split(' + ').map(Number);
      const g = a! + b!;
      expect(cellText(row[3])).toBe(String(g));
      expect(cellText(row[4])).toBe(String(g + Number(cellText(row[2]))));
    }
  });

  it('BFS node count', () => {
    const answer = question('p04-08').answer.short[0];
    expect(answer).toEqual({ type: 'formula', text: `1 + 3 + 9 + 27 = ${1 + 3 + 9 + 27} nodes` });
  });
});

describe('logic answers match evaluation', () => {
  const bool = (v: boolean) => (v ? 'T' : 'F');

  it('truth table and entailment', () => {
    for (const row of rowsOf('p07-11')) {
      const p = cellText(row[0]) === 'T';
      const q = cellText(row[1]) === 'T';
      expect(cellText(row[2])).toBe(bool(p || q));
      expect(cellText(row[3])).toBe(bool(!p));
      const kb = (p || q) && !p;
      expect(cellText(row[4])).toBe(bool(kb));
      expect(cellText(row[5])).toBe(bool(q));
      if (kb) expect(q).toBe(true);
    }
  });

  it('sentence classifications', () => {
    const models = [true, false].flatMap((p) => [true, false].map((q) => [p, q] as const));
    const classify = (f: (p: boolean, q: boolean) => boolean) => {
      const values = models.map(([p, q]) => f(p, q));
      if (values.every(Boolean)) return 'Valid';
      return values.some(Boolean) ? 'Satisfiable, not valid' : 'Unsatisfiable';
    };
    const expected = [
      classify((p) => p || !p),
      classify((p) => p && !p),
      classify((p, q) => !p || q),
      classify((p, q) => !(p && q) || p),
    ];
    expect(rowsOf('p07-12').map((row) => cellText(row[1]))).toEqual(expected);
  });

  it('propositional equivalences hold in every model', () => {
    for (const p of [true, false]) {
      for (const q of [true, false]) {
        expect(!(p && q)).toBe(!p || !q);
        expect(!p || q).toBe(p ? q : true);
      }
    }
  });

  it('Wumpus conclusions follow from the percepts', () => {
    // A room is a candidate only if every visited neighbour's percept agrees with it.
    const rooms = ['2,2', '3,1', '1,3'];
    const neighboursOf: Record<string, string[]> = { '2,2': ['1,2', '2,1'], '3,1': ['2,1'], '1,3': ['1,2'] };
    const breeze: Record<string, boolean> = { '1,2': false, '2,1': true };
    const stench: Record<string, boolean> = { '1,2': true, '2,1': false };
    const possible = (percept: Record<string, boolean>) =>
      rooms.filter((room) => neighboursOf[room]!.every((n) => percept[n]));
    expect(possible(breeze)).toEqual(['3,1']);
    expect(possible(stench)).toEqual(['1,3']);
  });

  it('quantifier sentences on the two-element model', () => {
    const domain = ['a', 'b'];
    const L = (x: string, y: string) => x !== y;
    expect(rowsOf('p08-16').map((row) => cellText(row[1]))).toEqual([
      bool(domain.every((x) => domain.some((y) => L(x, y)))),
      bool(domain.some((y) => domain.every((x) => L(x, y)))),
      bool(domain.some((x) => domain.some((y) => L(x, y)))),
      bool(domain.every((x) => domain.every((y) => L(x, y)))),
    ]);
  });

  it('production rules fire in forward-chaining order', () => {
    const rules = [
      { id: 'R1', needs: ['starter fails'], adds: 'call a mechanic' },
      { id: 'R2', needs: ['battery weak', 'engine cold'], adds: 'starter fails' },
      { id: 'R3', needs: ['headlights dim'], adds: 'battery weak' },
    ];
    const facts = new Set(['headlights dim', 'engine cold']);
    const fired: string[] = [];
    for (let i = 0; i < rules.length; i++) {
      const rule = rules.find((r) => !fired.includes(r.id) && r.needs.every((n) => facts.has(n)));
      if (!rule) break;
      fired.push(rule.id);
      facts.add(rule.adds);
    }
    expect(expectedOf('p07-19')).toEqual(fired);
  });
});
