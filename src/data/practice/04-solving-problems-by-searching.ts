import { tree } from '../../lib/graphLayout';
import { definePracticeSet, type Graph } from '../../lib/practiceSchema';

const TRAVERSAL_TREE = tree('A', { A: ['B', 'C'], B: ['D', 'E'], C: ['F'], D: ['G'], E: ['H', 'I'] }, { goals: ['H'] });
const LIMITED_TREE = tree('A', { A: ['B', 'C'], B: ['D', 'E'], C: ['F'], D: ['G'] }, { goals: ['G'] });
const DEEPENING_TREE = tree('A', { A: ['B', 'C'], B: ['D', 'E'], C: ['F'], D: ['G'] }, { goals: ['F'] });

const COST_GRAPH: Graph = {
  directed: true,
  width: 430,
  height: 270,
  nodes: [
    { id: 'S', label: 'S', x: 40, y: 135 },
    { id: 'A', label: 'A', x: 170, y: 40 },
    { id: 'B', label: 'B', x: 150, y: 215 },
    { id: 'C', label: 'C', x: 280, y: 240 },
    { id: 'D', label: 'D', x: 270, y: 135 },
    { id: 'G', label: 'G', x: 395, y: 135, tone: 'goal' },
  ],
  edges: [
    { from: 'S', to: 'A', label: '3' },
    { from: 'S', to: 'B', label: '1' },
    { from: 'B', to: 'C', label: '1' },
    { from: 'B', to: 'D', label: '5' },
    { from: 'A', to: 'G', label: '5' },
    { from: 'C', to: 'G', label: '7' },
    { from: 'D', to: 'G', label: '1' },
  ],
};

const ALGORITHM_PARTS = ['Uninformed (blind)', 'Informed (heuristic)', 'Depth-first search', 'A* search'];

function taxonomy(labels: string[], tone?: 'blank'): Graph {
  const leaf = (id: string, label: string, x: number, y: number, blank = false) => ({
    id,
    label,
    x,
    y,
    shape: 'box' as const,
    w: 130,
    h: 32,
    ...(blank && tone ? { tone } : {}),
  });
  return {
    directed: true,
    width: 500,
    height: 300,
    nodes: [
      leaf('root', 'Search algorithms', 250, 22),
      leaf('un', labels[0]!, 120, 76, true),
      leaf('in', labels[1]!, 380, 76, true),
      leaf('bfs', 'Breadth-first search', 120, 126),
      leaf('ucs', 'Uniform-cost search', 120, 164),
      leaf('dfs', labels[2]!, 120, 202, true),
      leaf('dls', 'Depth-limited search', 120, 240),
      leaf('ids', 'Iterative deepening', 120, 278),
      leaf('best', 'Best-first search', 380, 126),
      leaf('astar', labels[3]!, 380, 164, true),
    ],
    edges: [
      { from: 'root', to: 'un' },
      { from: 'root', to: 'in' },
      { from: 'un', to: 'bfs' },
      { from: 'in', to: 'best' },
    ],
  };
}

const FRONTIERS = ['FIFO queue', 'LIFO queue (stack)', 'Priority queue by g(n)'];
const COMPLEXITY = ['O(bᵈ)', 'O(bᵐ)', 'O(bd)', 'O(bm)'];
const YES_NO = ['Yes', 'No'];

export default definePracticeSet({
  chapterId: 'solving-problems-by-searching',
  questions: [
    {
      id: 'p04-01',
      kind: 'written',
      answerStyle: 'list',
      topic: 'Search infrastructure',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'List the four components stored in a search-tree node.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: ['STATE: the state this node corresponds to', 'PARENT: the node that generated it', 'ACTION: the action applied to the parent', 'PATH-COST: g(n), the cost from the initial state'],
          },
        ],
      },
    },
    {
      id: 'p04-02',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Search infrastructure',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'What is the frontier, and what are the three common queue variants?',
      answer: {
        shortStatus: 'course-concept',
        short: [
          { type: 'p', text: 'The frontier is the set of nodes available for expansion. Its queue can be:' },
          { type: 'ul', items: ['FIFO: pops the oldest element', 'LIFO (stack): pops the newest element', 'Priority queue: pops the highest-priority element'] },
        ],
      },
    },
    {
      id: 'p04-03',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'BFS vs DFS',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Compare BFS and DFS on completeness, optimality, time and space.',
      mixUp: "BFS is optimal only when all step costs are equal.",
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'table',
            table: {
              columns: ['Property', 'BFS', 'DFS'],
              rows: [
                ['Complete?', 'Yes (finite b)', 'No'],
                ['Optimal?', 'Yes (equal step costs)', 'No'],
                ['Time', 'O(bᵈ)', 'O(bᵐ)'],
                ['Space', 'O(bᵈ)', 'O(bm)'],
              ],
            },
          },
        ],
        detailed: [
          { type: 'p', text: 'b is the branching factor, d the depth of the least-cost solution, and m the maximum depth. DFS is worthwhile because it stores only the current path and the unexpanded siblings along it, so its memory use is linear. Its time is terrible when m is much larger than d.' },
        ],
      },
    },
    {
      id: 'p04-04',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Depth-first search',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'What is the "blind alley" problem of DFS, and how does it affect completeness?',
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'DFS can keep going deeper down one path and get lost. In an infinite-depth space it may never come back to the branch holding the goal, so it is not complete.' }],
      },
    },
    {
      id: 'p04-05',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Uniform-cost search',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'State the main idea of uniform-cost search and when it is optimal.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [{ type: 'p', text: 'Expand the node with the lowest path cost g(n). It is optimal when step costs are non-negative, so path cost never decreases with depth.' }],
        detailed: [{ type: 'p', text: 'UCS is a variant of Dijkstra\'s algorithm and is guided by path cost instead of depth. Its complexity result also assumes a positive lower bound ε on action costs.' }],
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'p', text: "With equal step costs, UCS expands nodes in the same level-by-level pattern as BFS." }],
          },
        ],
      },
    },
    {
      id: 'p04-06',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Iterative deepening',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'How does iterative deepening work, when is it preferred, and what is its disadvantage?',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: ['Runs depth-limited search with limits 0, 1, 2, … until a goal is found.', 'Preferred when the search space is large and the solution depth is unknown.', 'Disadvantage: wasted computation repeating the shallower levels.'],
          },
        ],
      },
    },
    {
      id: 'p04-07',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Depth-limited search',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'When is depth-limited search complete, and why is it not optimal?',
      mixUp: "Depth-limited search is complete when a goal exists at depth at most L, including exactly L.",
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: ['Complete only if a goal lies at depth at most L. A deeper goal is never found.', 'Not optimal: like DFS, it can find a non-optimal goal first.'],
          },
        ],
      },
    },
    {
      id: 'p04-08',
      kind: 'written',
      answerStyle: 'steps',
      topic: 'Complexity',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'A search tree has branching factor b = 3 and its shallowest solution is at depth d = 3. How many nodes does BFS generate in the worst case?',
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '1 + 3 + 9 + 27 = 40 nodes' }],
        detailed: [{ type: 'p', text: 'Apply 1 + b + b² + … + bᵈ, which is the level-by-level count. It is dominated by the last term, which is why it is written as O(bᵈ).' }],
      },
    },
    {
      id: 'p04-09',
      kind: 'complete',
      topic: 'Search taxonomy',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Complete the classification of search algorithms.',
      figure: taxonomy(['1', '2', '3', '4'], 'blank'),
      slots: [
        { nodeId: 'un', options: ALGORITHM_PARTS, expected: 'Uninformed (blind)' },
        { nodeId: 'in', options: ALGORITHM_PARTS, expected: 'Informed (heuristic)' },
        { nodeId: 'dfs', options: ALGORITHM_PARTS, expected: 'Depth-first search' },
        { nodeId: 'astar', options: ALGORITHM_PARTS, expected: 'A* search' },
      ],
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'Uninformed strategies use only the problem definition; informed strategies add problem-specific knowledge. Bidirectional search is also uninformed.' }],
        figure: taxonomy(ALGORITHM_PARTS),
      },
    },
    {
      id: 'p04-10',
      kind: 'table',
      topic: 'Search infrastructure',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Which frontier does each algorithm use?',
      columns: ['Algorithm', 'Frontier'],
      rows: [
        [{ given: 'Breadth-first search' }, { accepted: ['FIFO queue'], options: FRONTIERS }],
        [{ given: 'Uniform-cost search' }, { accepted: ['Priority queue by g(n)'], options: FRONTIERS }],
        [{ given: 'Depth-first search' }, { accepted: ['LIFO queue (stack)'], options: FRONTIERS }],
        [{ given: 'Depth-limited search' }, { accepted: ['LIFO queue (stack)'], options: FRONTIERS }],
      ],
      mixUp: "UCS orders nodes by path cost. A priority queue is the standard way to implement that ordering.",
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'BFS uses FIFO, UCS orders by path cost, and DFS and DLS both use LIFO. DLS simply adds a depth limit.' }],
      },
    },
    {
      id: 'p04-11',
      kind: 'table',
      topic: 'Complexity',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Complete the comparison table of BFS, DFS and IDS.',
      columns: ['Property', 'BFS', 'DFS', 'IDS'],
      rows: [
        [{ given: 'Complete?' }, { accepted: ['Yes'], options: YES_NO }, { accepted: ['No'], options: YES_NO }, { accepted: ['Yes'], options: YES_NO }],
        [{ given: 'Time' }, { accepted: ['O(bᵈ)'], options: COMPLEXITY }, { accepted: ['O(bᵐ)'], options: COMPLEXITY }, { accepted: ['O(bᵈ)'], options: COMPLEXITY }],
        [{ given: 'Space' }, { accepted: ['O(bᵈ)'], options: COMPLEXITY }, { accepted: ['O(bm)'], options: COMPLEXITY }, { accepted: ['O(bd)'], options: COMPLEXITY }],
        [{ given: 'Optimal?' }, { accepted: ['Yes'], options: YES_NO }, { accepted: ['No'], options: YES_NO }, { accepted: ['Yes'], options: YES_NO }],
      ],
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'IDS combines the completeness and optimality of BFS (for equal step costs) with memory that is linear in depth, like DFS.' }],
      },
    },
    {
      id: 'p04-12',
      kind: 'sequence',
      topic: 'Breadth-first search',
      difficulty: 'foundational',
      questionStatus: 'original-worked-example',
      prompt: 'Goal is H. Give the BFS visiting order, stopping when H is removed from the queue. Children are added left to right.',
      traceRules: { order: "Children are added left to right. FIFO order leaves no ties.", goalTest: "Tested when a node is removed from the queue." },
      figure: TRAVERSAL_TREE,
      tokens: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      expected: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'formula', text: 'A, B, C, D, E, F, G, H' }],
        steps: {
          columns: ['Removed', 'Queue after adding children (head first)'],
          rows: [
            ['A', 'B, C'],
            ['B', 'C, D, E'],
            ['C', 'D, E, F'],
            ['D', 'E, F, G'],
            ['E', 'F, G, H, I'],
            ['F', 'G, H, I'],
            ['G', 'H, I'],
            ['H', 'Goal found'],
          ],
        },
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'p', text: "This trace stops when the goal is removed from the queue. Some textbooks test BFS when a node is generated, which would stop earlier, as soon as H is added." }],
          },
        ],
      },
    },
    {
      id: 'p04-13',
      kind: 'table',
      topic: 'Depth-first search',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Goal is H in the tree below. Trace DFS: give the stack after each node is removed and its children pushed, with the top of the stack first and left children on top. Write "goal" when H is removed.',
      traceRules: { order: "Children are pushed so the leftmost is on top. LIFO order leaves no ties.", goalTest: "Tested when a node is removed from the stack." },
      figure: TRAVERSAL_TREE,
      columns: ['Removed', 'Stack (top first)'],
      rows: [
        [{ given: 'A' }, { accepted: ['B, C'] }],
        [{ given: 'B' }, { accepted: ['D, E, C'] }],
        [{ given: 'D' }, { accepted: ['G, E, C'] }],
        [{ given: 'G' }, { accepted: ['E, C'] }],
        [{ given: 'E' }, { accepted: ['H, I, C'] }],
        [{ given: 'H' }, { accepted: ['goal'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Visiting order: A, B, D, G, E, H. BFS on the same tree needs 8 nodes; DFS reaches H after 6.' }],
        detailed: [{ type: 'p', text: 'G is a leaf, so removing it adds nothing and the search backs up to E, the next deepest node with unexplored successors. DFS does not always win: it depends on where the goal lies.' }],
      },
    },
    {
      id: 'p04-14',
      kind: 'table',
      topic: 'Uniform-cost search',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'Trace UCS from S to G. List the frontier alphabetically as node and g value, such as "A3, B1". Keep only the cheapest entry for each node. The goal test happens when a node is removed.',
      traceRules: { order: "Remove the lowest g(n). Ties would break alphabetically, but none occur. A cheaper entry replaces a dearer one for the same node.", goalTest: "Tested when a node is removed, not when it is generated." },
      figure: COST_GRAPH,
      columns: ['Removed (g)', 'Frontier after expanding'],
      rows: [
        [{ given: 'S (0)' }, { accepted: ['A3, B1'] }],
        [{ given: 'B (1)' }, { accepted: ['A3, C2, D6'] }],
        [{ given: 'C (2)' }, { accepted: ['A3, D6, G9'] }],
        [{ given: 'A (3)' }, { accepted: ['D6, G8'] }],
        [{ given: 'D (6)' }, { accepted: ['G7'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [
          { type: 'p', text: 'G is removed with g = 7. The cheapest path is S → B → D → G, with cost 1 + 5 + 1 = 7.' },
        ],
        detailed: [
          { type: 'p', text: 'G enters the frontier three times, at 9, then 8, then 7, and the cheaper entry replaces the old one each time.' },
        ],
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'p', text: "Testing for the goal on removal, not on generation, is what makes UCS optimal: stopping when G first appeared would have returned the path that costs 9." }],
          },
        ],
      },
    },
    {
      id: 'p04-15',
      kind: 'sequence',
      topic: 'Depth-limited search',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Goal is G. Run depth-limited search with L = 2 (the root has depth 0). Give the visiting order, going left to right.',
      traceRules: { order: "Children are visited left to right. Nodes at depth L are visited but not expanded.", goalTest: "Tested when a node is visited." },
      figure: LIMITED_TREE,
      tokens: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      expected: ['A', 'B', 'D', 'E', 'C', 'F'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [
          { type: 'formula', text: 'A, B, D, E, C, F' },
          { type: 'p', text: 'The search ends without finding G. G is at depth 3, beyond the limit, which shows why DLS is incomplete.' },
        ],
        steps: {
          columns: ['Depth', 'Nodes'],
          rows: [
            ['0', 'A'],
            ['1', 'B, C'],
            ['2', 'D, E, F (not expanded: at the limit)'],
            ['3', 'G (never generated)'],
          ],
        },
      },
    },
    {
      id: 'p04-16',
      kind: 'table',
      topic: 'Iterative deepening',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Goal is F. Give the nodes visited in each iteration of iterative deepening, going left to right and stopping as soon as the goal is visited.',
      traceRules: { order: "Each iteration restarts from the root and visits children left to right.", goalTest: "Tested when a node is visited. The search stops at once when the goal is visited." },
      figure: DEEPENING_TREE,
      columns: ['Limit', 'Nodes visited'],
      rows: [
        [{ given: '0' }, { accepted: ['A'] }],
        [{ given: '1' }, { accepted: ['A, B, C'] }],
        [{ given: '2' }, { accepted: ['A, B, D, E, C, F'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'F is found at limit 2, its own depth. G is never generated. A is visited 3 times and B and C twice, which is the repeated work of IDS.' }],
      },
    },
  ],
});
