import { tree } from '../../lib/graphLayout';
import { definePracticeSet, type Graph } from '../../lib/practiceSchema';

/** Undirected graph with a cycle, so BFS must track visited nodes. */
const CYCLE_GRAPH: Graph = {
  directed: false,
  width: 300,
  height: 250,
  nodes: [
    { id: 'P', label: 'P', x: 150, y: 28 },
    { id: 'Q', label: 'Q', x: 60, y: 100 },
    { id: 'R', label: 'R', x: 240, y: 100 },
    { id: 'S', label: 'S', x: 150, y: 165 },
    { id: 'T', label: 'T', x: 150, y: 225 },
  ],
  edges: [
    { from: 'P', to: 'Q' },
    { from: 'P', to: 'R' },
    { from: 'Q', to: 'S' },
    { from: 'R', to: 'S' },
    { from: 'S', to: 'T' },
  ],
};

const BEST_FIRST_TREE = tree(
  'S',
  { S: ['A', 'B'], A: ['C'], B: ['D', 'E'], E: ['F', 'G'] },
  {
    notes: { S: 'h=12', A: 'h=9', B: 'h=6', C: 'h=4', D: 'h=5', E: 'h=3', F: 'h=4', G: 'h=0' },
    costs: { 'S>A': 2, 'S>B': 3, 'A>C': 6, 'B>D': 4, 'B>E': 5, 'E>F': 1, 'E>G': 2 },
    goals: ['G'],
  },
);

export default definePracticeSet({
  chapterId: 'search-strategies',
  questions: [
    {
      id: 'p03-01',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Blind vs informed',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Compare blind (uninformed) search with informed search.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Blind: no domain information. It can only tell a goal state from a non-goal state.',
              'Informed: uses extra knowledge, such as an estimated cost to the goal, to judge which non-goal state is more promising.',
            ],
          },
        ],
        detailed: [{ type: 'p', text: 'From one city, a blind search has no preference among the neighbouring cities. An informed search would first try the one its evaluation function estimates to be closest to the destination, which usually reduces the search space.' }],
      },
    },
    {
      id: 'p03-02',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Heuristics',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'What is a heuristic, and why is there no general theory for finding one?',
      answer: {
        shortStatus: 'course-concept',
        short: [
          { type: 'ul', items: ['A function that estimates solution cost; a rule of thumb for which choice might be best.', 'Every problem is different, so the choice depends on knowledge of that problem space.'] },
        ],
      },
    },
    {
      id: 'p03-03',
      kind: 'written',
      answerStyle: 'steps',
      topic: 'Breadth-first search',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'State the steps of the BFS algorithm and the data structure it uses.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'additional-clarification',
        short: [
          { type: 'p', text: 'FIFO queue:' },
          {
            type: 'ol',
            items: ['Add the start node to the queue.', 'Remove the node at the head.', 'Add its unvisited neighbours to the tail.', 'Repeat until the queue is empty.'],
          },
        ],
        detailed: [{ type: 'p', text: 'FIFO is what produces level-by-level order: nodes generated earlier, which are shallower, leave the queue before nodes generated later.' }],
      },
    },
    {
      id: 'p03-04',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Best-first search',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'What do the OPEN and CLOSED lists hold in best-first search, and which node is chosen next?',
      mixUp: "Write the names out in an exam: best-first search and breadth-first search are different algorithms, although both are sometimes abbreviated BFS.",
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: ['OPEN: nodes currently available for traversal, ordered by h(n).', 'CLOSED: nodes already traversed.', 'Next node: the one in OPEN with the lowest h(n).'],
          },
        ],
      },
    },
    {
      id: 'p03-05',
      kind: 'written',
      answerStyle: 'list',
      topic: 'Breadth-first search',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Give three applications of BFS.',
      mixUp: "A path connects nodes, so say 'between two nodes'.",
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: ['Shortest path when length is the number of edges', 'Finding neighbouring locations in GPS navigation', 'Finding all nodes in one connected component'],
          },
        ],
        detailed: [{ type: 'p', text: 'Others include peer-to-peer network connections and broadcasting packets in a network.' }],
      },
    },
    {
      id: 'p03-06',
      kind: 'sequence',
      topic: 'Breadth-first search',
      difficulty: 'foundational',
      questionStatus: 'original-worked-example',
      prompt: 'Find the BFS visiting order for this tree. Children enter the queue from left to right.',
      traceRules: { order: "Children enter the queue left to right. No ties can occur.", goalTest: "No goal: traverse every node until the queue is empty." },
      figure: tree('S', { S: ['A', 'B', 'C'], A: ['D', 'E'], B: ['F'], C: ['G', 'H'], E: ['I'] }),
      tokens: ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      expected: ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'formula', text: 'S, A, B, C, D, E, F, G, H, I' }],
        steps: {
          columns: ['Level', 'Nodes visited'],
          rows: [
            ['0', 'S'],
            ['1', 'A, B, C'],
            ['2', 'D, E, F, G, H'],
            ['3', 'I'],
          ],
        },
      },
    },
    {
      id: 'p03-07',
      kind: 'table',
      topic: 'Breadth-first search',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Run BFS from P. Give the queue after each removal. Add neighbours alphabetically and skip nodes already visited. Write "empty" for an empty queue.',
      traceRules: { order: "Neighbours are added alphabetically and marked visited when added.", goalTest: "No goal: continue until the queue is empty." },
      figure: CYCLE_GRAPH,
      columns: ['Removed', 'Queue (head first)'],
      rows: [
        [{ given: 'P' }, { accepted: ['Q, R'] }],
        [{ given: 'Q' }, { accepted: ['R, S'] }],
        [{ given: 'R' }, { accepted: ['S'] }],
        [{ given: 'S' }, { accepted: ['T'] }],
        [{ given: 'T' }, { accepted: ['empty'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Visiting order: P, Q, R, S, T. S enters the queue only once, because it is already marked visited when R is removed.' }],
        steps: {
          columns: ['Removed', 'Added', 'Queue'],
          rows: [
            ['P', 'Q, R', 'Q, R'],
            ['Q', 'S', 'R, S'],
            ['R', 'none (S already visited)', 'S'],
            ['S', 'T', 'T'],
            ['T', 'none', 'empty'],
          ],
        },
      },
    },
    {
      id: 'p03-08',
      kind: 'construct',
      topic: 'Breadth-first search',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Build the BFS tree for the graph below, starting at P with neighbours taken alphabetically. Connect each node from the node that first discovered it.',
      traceRules: { order: "Neighbours are taken alphabetically and marked visited when discovered.", goalTest: "No goal: continue until every reachable node is discovered." },
      figure: CYCLE_GRAPH,
      directed: true,
      nodeLabels: ['P', 'Q', 'R', 'S', 'T'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'P discovers Q and R, Q discovers S, and S discovers T. The edge R–S is not in the tree because S was already visited.' }],
        figure: tree('P', { P: ['Q', 'R'], Q: ['S'], S: ['T'] }),
      },
    },
    {
      id: 'p03-09',
      kind: 'table',
      topic: 'Best-first search',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Trace best-first search from S to goal G using h(n). Write OPEN alphabetically, and CLOSED in the order nodes were chosen.',
      traceRules: { order: "Choose the lowest h(n) in OPEN. No ties occur in this example.", goalTest: "Tested when a node is chosen from OPEN, not when it is generated." },
      figure: BEST_FIRST_TREE,
      columns: ['Step', 'Chosen', 'OPEN after expanding', 'CLOSED'],
      rows: [
        [{ given: '1' }, { accepted: ['S'] }, { accepted: ['A, B'] }, { accepted: ['S'] }],
        [{ given: '2' }, { accepted: ['B'] }, { accepted: ['A, D, E'] }, { accepted: ['S, B'] }],
        [{ given: '3' }, { accepted: ['E'] }, { accepted: ['A, D, F, G'] }, { accepted: ['S, B, E'] }],
        [{ given: '4' }, { accepted: ['G'] }, { accepted: ['A, D, F'] }, { accepted: ['S, B, E, G'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [
          { type: 'p', text: 'Path S → B → E → G. Its actual cost is 3 + 5 + 2 = 10.' },
        ],
        detailed: [
          { type: 'p', text: 'At each step the lowest h(n) in OPEN is chosen: B (6 < 9), then E (3 is lower than 5 and 9), then G (0). A is never expanded, so C is never generated. The cost comes from the edges on the path; the h values guide the search but are not added.' },
        ],
      },
    },
  ],
});
