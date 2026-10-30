import { tree } from '../../lib/graphLayout';
import { definePracticeSet, type Graph } from '../../lib/practiceSchema';

/** h is admissible here, and greedy search and A* return different paths. */
const ROUTE_GRAPH: Graph = {
  directed: true,
  width: 400,
  height: 230,
  nodes: [
    { id: 'S', label: 'S', x: 40, y: 115, note: 'h=6' },
    { id: 'A', label: 'A', x: 140, y: 45, note: 'h=4' },
    { id: 'B', label: 'B', x: 170, y: 195, note: 'h=3' },
    { id: 'C', label: 'C', x: 265, y: 30, note: 'h=2' },
    { id: 'D', label: 'D', x: 240, y: 110, note: 'h=5' },
    { id: 'G', label: 'G', x: 360, y: 115, note: 'h=0', tone: 'goal' },
  ],
  edges: [
    { from: 'S', to: 'A', label: '2' },
    { from: 'S', to: 'B', label: '5' },
    { from: 'A', to: 'C', label: '2' },
    { from: 'A', to: 'D', label: '1' },
    { from: 'C', to: 'G', label: '2' },
    { from: 'D', to: 'G', label: '9' },
    { from: 'B', to: 'G', label: '6' },
  ],
};

const YES_NO = ['Yes', 'No'];
const COMPLEXITY = ['O(bᵐ)', 'O(bᵈ)'];

export default definePracticeSet({
  chapterId: 'informed-search-algorithms',
  questions: [
    {
      id: 'p05-01',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Best-first search',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'How does best-first search choose the next node, and how is it implemented?',
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'It expands the node with the lowest value of an evaluation function f(n), read as a cost estimate. It is implemented with a priority queue.' }],
      },
    },
    {
      id: 'p05-02',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'A* search',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Write the A* evaluation function and define each term.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          { type: 'formula', text: 'f(n) = g(n) + h(n)' },
          {
            type: 'ul',
            items: ['g(n): path cost from the start to n', 'h(n): estimated cost of the cheapest path from n to the goal', 'f(n): estimated cost of the cheapest solution through n'],
          },
        ],
      },
    },
    {
      id: 'p05-03',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Greedy vs A*',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Compare greedy best-first search with A*.',
      mixUp: "A* is optimal with an admissible heuristic, and complete unless infinitely many nodes have f < f(G).",
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'table',
            table: {
              columns: ['Property', 'Greedy', 'A*'],
              rows: [
                ['f(n)', 'h(n)', 'g(n) + h(n)'],
                ['Complete?', 'No (can loop)', 'Yes, under conditions'],
                ['Optimal?', 'No', 'Yes, under conditions on h'],
                ['Time and space', 'O(bᵐ)', 'O(bᵈ)'],
              ],
            },
          },
        ],
        detailed: [
          { type: 'p', text: 'Greedy looks only ahead, so it can be drawn into paths that are already expensive. A* also counts the cost already paid. Both keep all nodes in memory, and a good heuristic can improve their running time dramatically. A* is optimal with an admissible heuristic and complete unless infinitely many nodes have f < f(G). The Romania walkthrough regenerates cities such as Arad, which is tree search.' },
        ],
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'ul', items: ["Tree search: an admissible heuristic guarantees optimality.","Graph search with a closed list that never reopens nodes: this needs a consistent heuristic, meaning h(n) ≤ c(n, n′) + h(n′) for every successor n′. Every consistent heuristic is admissible.","Graph search that reopens a closed node when it finds a cheaper path is optimal with an admissible heuristic alone.","In all cases the goal test happens when a node is selected for expansion, not when it is generated.","Completeness also assumes a finite branching factor and step costs of at least some ε > 0, which ensures finitely many nodes have f at most the optimal cost."] }],
          },
        ],
      },
    },
    {
      id: 'p05-04',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Admissible heuristics',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Define an admissible heuristic, and explain why straight-line distance is admissible.',
      answer: {
        shortStatus: 'course-concept',
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'p', text: "Admissibility is enough for tree search. For graph search that never reopens closed nodes, the stronger condition is consistency: h(n) ≤ c(n, n′) + h(n′). Straight-line distance is also consistent, by the triangle inequality." }],
          },
        ],
        short: [
          { type: 'p', text: 'h is admissible if it never overestimates the true cost to the goal: h(n) ≤ h*(n) for every n, with h(n) ≥ 0, so h(G) = 0.' },
          { type: 'p', text: 'Straight-line distance is admissible because a straight line is the shortest possible path between two points.' },
        ],
      },
    },
    {
      id: 'p05-05',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Greedy best-first search',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Using the Romania example, explain why greedy best-first search is neither complete nor optimal.',
      mixUp: "Treat the distances as plain numbers. The difference between the two routes is 32.",
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: ['Not complete: it can loop, for example Iasi → Neamt → Iasi → …', 'Not optimal: the route via Sibiu and Fagaras (450) is 32 longer than the route via Rimnicu Vilcea and Pitesti (418).'],
          },
        ],
      },
    },
    {
      id: 'p05-06',
      kind: 'sequence',
      topic: 'Greedy best-first search',
      difficulty: 'foundational',
      questionStatus: 'original-worked-example',
      prompt: 'Goal is G. Give the order in which greedy best-first search expands nodes, using the h values shown.',
      traceRules: { order: "Expand the lowest h(n) in the frontier. No ties occur in this example.", goalTest: "Tested when a node is selected for expansion." },
      figure: tree(
        'S',
        { S: ['A', 'B'], A: ['C', 'D'], B: ['E', 'F'], E: ['G'] },
        { notes: { S: 'h=9', A: 'h=4', B: 'h=6', C: 'h=7', D: 'h=8', E: 'h=2', F: 'h=5', G: 'h=0' }, goals: ['G'] },
      ),
      tokens: ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
      expected: ['S', 'A', 'B', 'E', 'G'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'formula', text: 'S, A, B, E, G' }],
        steps: {
          columns: ['Expanded', 'Frontier (h)', 'Next'],
          rows: [
            ['S', 'A4, B6', 'A'],
            ['A', 'B6, C7, D8', 'B'],
            ['B', 'C7, D8, E2, F5', 'E'],
            ['E', 'C7, D8, F5, G0', 'G'],
          ],
        },
      },
    },
    {
      id: 'p05-07',
      kind: 'sequence',
      topic: 'Greedy vs A*',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Run greedy best-first search on this graph, from S to G. Give the expansion order.',
      traceRules: { order: "Expand the lowest h(n) in the frontier. No ties occur in this example.", goalTest: "Tested when a node is selected for expansion." },
      figure: ROUTE_GRAPH,
      tokens: ['S', 'A', 'B', 'C', 'D', 'G'],
      expected: ['S', 'B', 'G'],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [
          { type: 'formula', text: 'S, B, G' },
          { type: 'p', text: 'The path costs 5 + 6 = 11, but S → A → C → G costs only 6, so greedy search is not optimal here.' },
        ],
        detailed: [
          { type: 'p', text: 'B looks better than A because h(B) = 3 < h(A) = 4, and greedy search ignores the expensive step of 5 needed to reach B. Then G has h = 0, so it is chosen at once.' },
        ],
      },
    },
    {
      id: 'p05-08',
      kind: 'table',
      topic: 'A* search',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'Run A* on the same graph from S to G. Give f for each node as it is generated, and the node expanded next.',
      traceRules: { order: "Expand the lowest f(n). Ties break alphabetically; B and D tie at 8 but neither is ever lowest.", goalTest: "Tested when a node is selected for expansion, not when it is generated." },
      figure: ROUTE_GRAPH,
      columns: ['Expanded', 'Generated: f = g + h', 'Next to expand'],
      rows: [
        [{ given: 'S' }, { given: 'A: 2 + 4, B: 5 + 3' }, { accepted: ['A'], options: ['A', 'B'] }],
        [{ given: 'A' }, { given: 'C: 4 + 2, D: 3 + 5' }, { accepted: ['C'], options: ['B', 'C', 'D'] }],
        [{ given: 'C' }, { given: 'G: 6 + 0' }, { accepted: ['G'], options: ['B', 'D', 'G'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [
          { type: 'p', text: 'Expansion order S, A, C, G. Solution S → A → C → G with cost 6, the optimal path.' },
        ],
        steps: {
          columns: ['Expanded', 'Frontier with f', 'Lowest f'],
          rows: [
            ['S', 'A6, B8', 'A'],
            ['A', 'B8, C6, D8', 'C'],
            ['C', 'B8, D8, G6', 'G'],
            ['G', 'Goal removed: cost 6', ''],
          ],
        },
        detailed: [
          { type: 'p', text: 'Because A* counts g, the costly step to B keeps f(B) at 8. On the same graph greedy search returned a path costing 11. The heuristic here is both admissible and consistent, so the result is optimal whether or not closed nodes are reopened.' },
        ],
      },
    },
    {
      id: 'p05-09',
      kind: 'table',
      topic: 'Admissible heuristics',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'h* is the true cheapest cost to the goal. Is each heuristic value admissible for its node?',
      columns: ['Node', 'h(n)', 'h*(n)', 'Admissible?'],
      rows: [
        [{ given: 'K' }, { given: '4' }, { given: '6' }, { accepted: ['Yes'], options: YES_NO }],
        [{ given: 'L' }, { given: '7' }, { given: '7' }, { accepted: ['Yes'], options: YES_NO }],
        [{ given: 'M' }, { given: '9' }, { given: '5' }, { accepted: ['No'], options: YES_NO }],
        [{ given: 'Goal' }, { given: '0' }, { given: '0' }, { accepted: ['Yes'], options: YES_NO }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Only M fails, because 9 > 5 overestimates. Equality is allowed: the condition is h(n) ≤ h*(n).' }],
      },
    },
    {
      id: 'p05-10',
      kind: 'table',
      topic: 'A* search',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Romania example: A* has reached Sibiu with g = 140. Complete g and f for the next cities, using the road costs and straight-line values given.',
      columns: ['City', 'Route cost', 'h', 'g', 'f'],
      rows: [
        [{ given: 'Fagaras' }, { given: '140 + 99' }, { given: '176' }, { accepted: ['239'] }, { accepted: ['415'] }],
        [{ given: 'Rimnicu Vilcea' }, { given: '140 + 80' }, { given: '193' }, { accepted: ['220'] }, { accepted: ['413'] }],
        [{ given: 'Pitesti' }, { given: '220 + 97' }, { given: '100' }, { accepted: ['317'] }, { accepted: ['417'] }],
        [{ given: 'Bucharest via Pitesti' }, { given: '317 + 101' }, { given: '0' }, { accepted: ['418'] }, { accepted: ['418'] }],
      ],
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'A* expands Rimnicu Vilcea (413) before Fagaras (415), and finally returns Bucharest via Pitesti at 418, not the 450 route through Fagaras.' }],
      },
    },
    {
      id: 'p05-11',
      kind: 'table',
      topic: 'Comparison',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Complete the comparison of the two informed strategies.',
      columns: ['Property', 'Greedy', 'A*'],
      rows: [
        [{ given: 'Complete?' }, { accepted: ['No'], options: YES_NO }, { accepted: ['Yes'], options: YES_NO }],
        [{ given: 'Time' }, { accepted: ['O(bᵐ)'], options: COMPLEXITY }, { accepted: ['O(bᵈ)'], options: COMPLEXITY }],
        [{ given: 'Space' }, { accepted: ['O(bᵐ)'], options: COMPLEXITY }, { accepted: ['O(bᵈ)'], options: COMPLEXITY }],
        [{ given: 'Optimal?' }, { accepted: ['No'], options: YES_NO }, { accepted: ['Yes'], options: YES_NO }],
      ],
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'A* is better on every line of the table. Its optimality assumes an admissible heuristic.' }],
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'p', text: "The admissible condition applies directly to tree search. Graph search that never reopens closed nodes needs a consistent heuristic. The table shows O(bᵈ) for A*; the practical cost depends strongly on heuristic quality." }],
          },
        ],
      },
    },
  ],
});
