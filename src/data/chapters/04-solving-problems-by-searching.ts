import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'solving-problems-by-searching',
  number: 4,
  title: 'Solving Problems by Searching (Part 2)',
  description:
    'Search-tree infrastructure, frontier queues, and the properties of breadth-first, uniform-cost, depth-first, depth-limited and iterative deepening search.',
  source: {
    fileName: 'Topic-4 Problem solving Agents-P2_Ch4.pdf',
    label: 'Topic 4',
    pageCount: 60,
    note: 'Number 4 comes from the filename ("Topic-4"); the title slide reads "Chapter 3: Solving Problems By Searching, Part 2", referring to the textbook chapter. Several slides are step-by-step tree diagrams whose structure is only partly recoverable from text; questions on traversal use original trees instead.',
  },
  questions: [
    {
      id: 'ch04-q01',
      question: 'Which search-tree node component records the cost of the path from the initial state to the node, written g(n)?',
      options: ['n.STATE', 'n.PARENT', 'n.ACTION', 'n.PATH-COST'],
      correctAnswerIndex: 3,
      explanation:
        'Each node stores its STATE, the PARENT that generated it, the ACTION applied, and PATH-COST: the cost g(n) from the initial state.',
      difficulty: 'foundational',
      sourceReference: { section: 'Infrastructure for Search Algorithms', pages: [5] },
    },
    {
      id: 'ch04-q02',
      question: 'What is the frontier in a search algorithm?',
      options: [
        'The set of all goal states',
        'The set of all nodes available for expansion at a given point',
        'The set of nodes that have already been expanded',
        'The deepest node in the search tree',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Newly discovered nodes are added to the frontier, and a node is removed from it when it is explored.',
      difficulty: 'foundational',
      sourceReference: { section: 'Infrastructure for Search Algorithms', pages: [6] },
    },
    {
      id: 'ch04-q03',
      question: 'Which queue variant pops the newest element and is also known as a stack?',
      options: ['LIFO queue', 'FIFO queue', 'Priority queue', 'Circular queue'],
      correctAnswerIndex: 0,
      explanation:
        'A last-in, first-out queue returns the most recently inserted element. FIFO returns the oldest, and a priority queue returns the highest-priority element.',
      difficulty: 'foundational',
      sourceReference: { section: 'Three common variants of a queue', pages: [7] },
    },
    {
      id: 'ch04-q04',
      question: 'How does the lecture define the total cost of a search?',
      options: [
        'The path cost of the solution only',
        'The number of nodes left in the frontier at termination',
        'The search cost (time and memory) combined with the path cost of the solution found',
        'The branching factor multiplied by the depth',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Search cost reflects time and memory usage; total cost adds that to the path cost of the solution.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Search Strategies', pages: [10] },
    },
    {
      id: 'ch04-q05',
      question:
        'What are the time and space complexity of breadth-first search, where b is the branching factor and d is the depth of the least-cost solution?',
      options: ['Time O(bᵈ), space O(bᵈ)', 'Time O(bᵐ), space O(bm)', 'Time O(bᵈ), space O(bd)', 'Time O(bd), space O(bᵈ)'],
      correctAnswerIndex: 0,
      explanation:
        'BFS generates 1 + b + b² + … + bᵈ nodes and keeps every node in memory, so both time and space are O(bᵈ).',
      difficulty: 'intermediate',
      sourceReference: { section: 'Properties of Breadth-first Search', pages: [22] },
    },
    {
      id: 'ch04-q06',
      question: 'Under what condition is breadth-first search optimal?',
      options: [
        'Always, regardless of step costs',
        'Only when the state space is infinite',
        'When a good heuristic is supplied',
        'When every step has the same cost',
      ],
      correctAnswerIndex: 3,
      explanation:
        'BFS returns the shallowest goal, which is the cheapest only when all steps cost the same (e.g. cost 1 per step).',
      difficulty: 'intermediate',
      sourceReference: { section: 'Properties of Breadth-first Search', pages: [22, 23] },
    },
    {
      id: 'ch04-q07',
      question: 'What is the main practical drawback of BFS highlighted in the lecture?',
      options: [
        'It is incomplete even when the branching factor is finite',
        "It can get lost in a 'blind alley' by descending forever",
        'Its time and memory grow exponentially with depth because every generated node is kept',
        'It cannot find the shortest path even when all steps cost the same',
      ],
      correctAnswerIndex: 2,
      explanation:
        'O(bᵈ) time and space grows exponentially, and even unwanted nodes must be stored. The blind-alley problem belongs to DFS.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Advantages & Disadvantages of BFS', pages: [23] },
    },
    {
      id: 'ch04-q08',
      question: 'Which node does uniform-cost search expand next?',
      options: [
        'The shallowest unexpanded node',
        'The node with the lowest path cost g(n)',
        'The deepest unexpanded node',
        'The node with the lowest heuristic value h(n)',
      ],
      correctAnswerIndex: 1,
      explanation:
        'UCS is guided by accumulated path cost rather than depth, always expanding the cheapest node.',
      difficulty: 'foundational',
      sourceReference: { section: 'Uniform Cost Search (UCS)', pages: [25, 26] },
    },
    {
      id: 'ch04-q09',
      question:
        'Uniform-cost search starts at S. Edge costs: S–A = 4, S–B = 1, B–C = 2, A–G = 1, C–G = 6. G is the goal and is recognised when it is selected for expansion. Which solution does UCS return?',
      options: [
        'S → B → C → G with cost 9',
        'S → A → G with cost 5',
        'S → B → C → G with cost 3',
        'S → A → G with cost 4',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Expand S (A = 4, B = 1), then B (C = 3), then C (G via C = 9), then A (G via A = 5, cheaper). G at cost 5 is now the cheapest node, so S → A → G is returned.',
      difficulty: 'advanced',
      sourceReference: { section: 'Uniform Cost Search (UCS) example', pages: [27, 28, 29, 30, 31, 32, 33] },
    },
    {
      id: 'ch04-q10',
      question: 'Uniform-cost search is described as a variant of which classic algorithm?',
      options: ["Dijkstra's algorithm", "Kruskal's algorithm", "Prim's algorithm", 'The Floyd–Warshall algorithm'],
      correctAnswerIndex: 0,
      explanation:
        "UCS is a variant of Dijkstra's shortest-path algorithm and guarantees an optimal solution when step costs are non-negative.",
      difficulty: 'foundational',
      sourceReference: { section: 'Uniform Cost Search (UCS)', pages: [25] },
    },
    {
      id: 'ch04-q11',
      question: 'Which data structure does depth-first search use for its frontier?',
      options: ['A FIFO queue', 'A priority queue ordered by g(n)', 'A LIFO queue (stack)', 'A priority queue ordered by h(n)'],
      correctAnswerIndex: 2,
      explanation: 'DFS always picks the most recently generated node, which is exactly LIFO (stack) behaviour.',
      difficulty: 'foundational',
      sourceReference: { section: 'Depth-first search', pages: [34] },
    },
    {
      id: 'ch04-q12',
      question:
        "Root A has children B and C (left to right). B has children D and E; C has one child, F. Children are explored left to right. In what order does DFS visit the nodes?",
      options: ['A, B, C, D, E, F', 'A, C, F, B, E, D', 'A, B, D, C, E, F', 'A, B, D, E, C, F'],
      correctAnswerIndex: 3,
      explanation:
        'DFS goes deep first: A → B → D (a leaf), back up to E, then back to the root\'s next child C → F. The first option is a breadth-first order.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Depth-First Search (DFS) walkthrough', pages: [35, 44] },
    },
    {
      id: 'ch04-q13',
      question: 'Why does depth-first tree search need only linear space, O(bm)?',
      options: [
        'It stores only a single root-to-leaf path plus the unexpanded siblings along that path',
        'It never revisits a node',
        'It expands only one child of every node',
        'It discards the root after the first expansion',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Once a node\'s descendants are fully explored it can be dropped from memory, so DFS only holds the current path and its pending siblings.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Properties of Depth-First Search', pages: [46, 47] },
    },
    {
      id: 'ch04-q14',
      question: 'Why is depth-first search not complete?',
      options: [
        'It requires every step to cost the same',
        'It can descend forever in infinite-depth spaces',
        'It runs out of memory before finishing',
        'It always returns the deepest goal',
      ],
      correctAnswerIndex: 1,
      explanation:
        'In an infinite-depth space, DFS may follow one branch endlessly and never return to the branch containing the goal.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Properties of Depth-First Search', pages: [46, 48] },
    },
    {
      id: 'ch04-q15',
      question: 'Depth-limited search with depth bound L fails to find a goal when…',
      options: [
        'the goal is shallower than L',
        'the branching factor is greater than 2',
        'the goal is the root node',
        'the shallowest goal lies deeper than L',
      ],
      correctAnswerIndex: 3,
      explanation:
        'DLS never searches beyond the bound. If the solution lies beneath it, the goal cannot be found, which is why DLS is incomplete.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Depth-Limited Search (DLS)', pages: [51, 52] },
    },
    {
      id: 'ch04-q16',
      question: 'How does iterative deepening search find a suitable depth limit?',
      options: [
        'It estimates the depth with a heuristic before starting',
        'It doubles the branching factor on each iteration',
        'It repeatedly runs depth-limited search with limits 0, 1, 2, … until a goal is found',
        'It runs BFS and DFS in parallel and stops when either finishes',
      ],
      correctAnswerIndex: 2,
      explanation:
        'IDS gradually increases the limit until it reaches d, the depth of the shallowest goal.',
      difficulty: 'foundational',
      sourceReference: { section: 'Iterative deepening search', pages: [53] },
    },
    {
      id: 'ch04-q17',
      question:
        'You must search a very large state space, you have no idea how deep the solution lies, and memory is limited. Which uninformed strategy does the lecture recommend?',
      options: [
        'Breadth-first search',
        'Depth-limited search with a guessed limit',
        'Uniform-cost search',
        'Iterative deepening search',
      ],
      correctAnswerIndex: 3,
      explanation:
        'IDS is the preferred uninformed method when the search space is large and the solution depth is unknown. It combines completeness with DFS-like memory use.',
      difficulty: 'advanced',
      sourceReference: { section: 'Iterative deepening search / Advantages of IDS', pages: [53, 60] },
    },
    {
      id: 'ch04-q18',
      question: 'What is the main disadvantage of iterative deepening search?',
      options: [
        'It repeats work on shallower levels before reaching the goal depth',
        'It is not complete',
        'Its space complexity is O(bᵈ)',
        'It may return a path that is not the shortest',
      ],
      correctAnswerIndex: 0,
      explanation: 'Each new iteration regenerates the shallower levels, which wastes computation.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Advantages & Disadvantages of IDS', pages: [60] },
    },
    {
      id: 'ch04-q19',
      question:
        'According to the comparison table, which algorithm is complete and optimal (for equal step costs) while using only O(bd) space?',
      options: ['Breadth-first search', 'Depth-first search', 'Iterative deepening search', 'Depth-limited search'],
      correctAnswerIndex: 2,
      explanation:
        'IDS is complete and optimal like BFS, but needs only O(bd) space. BFS needs O(bᵈ) space, and DFS is neither complete nor optimal.',
      difficulty: 'advanced',
      sourceReference: { section: 'BFS Vs. DFS Vs. IDS', pages: [59] },
    },
    {
      id: 'ch04-q20',
      question: 'Uninformed search strategies are distinguished from one another by…',
      options: [
        'the heuristic function each one uses',
        'the order in which nodes are expanded',
        'the programming language they are written in',
        'the number of goal states they allow',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Uninformed strategies have no heuristic. All they can vary is the order in which nodes are expanded.',
      difficulty: 'foundational',
      sourceReference: { section: 'Search Strategies: Uninformed', pages: [3] },
    },
  ],
});
