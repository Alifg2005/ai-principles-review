import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'search-strategies',
  number: 3,
  title: 'Search Strategies: Uninformed & Informed',
  description:
    'Blind versus informed search, breadth-first search with a FIFO queue, heuristics as estimates of solution cost, and best-first search with OPEN and CLOSED lists.',
  source: {
    fileName: 'Week 3 Search strategies_(Un)informed_Ch3.pdf',
    label: 'Week 3',
    pageCount: 32,
    note: 'The slides carry no lecture number; number 3 comes from the filename ("Week 3").',
  },
  questions: [
    {
      id: 'ch03-q01',
      question: 'With respect to states, what is the only thing a blind (uninformed) search can do?',
      options: [
        'Distinguish a goal state from a non-goal state',
        'Estimate how far each state is from the goal',
        'Rank non-goal states by how promising they are',
        'Compute the exact remaining cost from each state to the goal',
      ],
      correctAnswerIndex: 0,
      explanation:
        'A blind search has no domain information. It can only recognise whether a state is the goal and has no preference among non-goal states.',
      difficulty: 'foundational',
      sourceReference: { section: 'Search', pages: [4] },
    },
    {
      id: 'ch03-q02',
      question: 'What distinguishes an informed search from a blind search?',
      options: [
        'It always explores every node in the search space',
        'It never uses a queue',
        'It can judge whether one non-goal state is more promising than another',
        'It only works on trees, not graphs',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Informed search estimates what lies ahead, for example the cost to the goal, and uses that to decide where to look next.',
      difficulty: 'foundational',
      sourceReference: { section: 'Search', pages: [4] },
    },
    {
      id: 'ch03-q03',
      question: 'Which of these is NOT an uninformed search strategy?',
      options: ['Depth-first search', 'A* search', 'Uniform-cost search', 'Iterative deepening search'],
      correctAnswerIndex: 1,
      explanation:
        'A* appears under informed strategies. Depth-first, uniform-cost and iterative deepening are all listed as uninformed.',
      difficulty: 'foundational',
      sourceReference: { section: 'Uninformed search / Informed search strategies', pages: [5, 25] },
    },
    {
      id: 'ch03-q04',
      question: 'How is the frontier implemented in breadth-first search?',
      options: [
        'As a LIFO stack, so the newest node is expanded first',
        'As a priority queue ordered by heuristic value',
        'As a list sorted by accumulated path cost',
        'As a FIFO queue, so nodes are expanded in the order they were generated',
      ],
      correctAnswerIndex: 3,
      explanation:
        'BFS removes nodes from the head of a first-in, first-out queue and adds newly generated children to the tail.',
      difficulty: 'foundational',
      sourceReference: { section: 'Breadth-first search (BFS)', pages: [6] },
    },
    {
      id: 'ch03-q05',
      question: 'Which statement correctly describes how BFS explores a tree?',
      options: [
        'It follows one branch as deep as possible before backtracking',
        'It always expands the node with the smallest heuristic estimate',
        'It expands nodes in random order to avoid bias',
        'It visits all nodes at the current depth before moving to the next depth level',
      ],
      correctAnswerIndex: 3,
      explanation: 'BFS traverses level by level, finishing each depth before descending to the next.',
      difficulty: 'foundational',
      sourceReference: { section: 'Breadth-first search (BFS)', pages: [7] },
    },
    {
      id: 'ch03-q06',
      question:
        "A tree has root R. R's children, left to right, are M and N. M's children are P and Q; N's only child is T. With children enqueued left to right, what is the BFS visiting order?",
      options: ['R, M, P, Q, N, T', 'R, M, N, P, Q, T', 'R, N, M, T, Q, P', 'R, M, N, T, P, Q'],
      correctAnswerIndex: 1,
      explanation:
        'BFS visits level 0 (R), then level 1 (M, N), then level 2 in queue order (P, Q from M, then T from N). The first option is a depth-first order.',
      difficulty: 'intermediate',
      sourceReference: { section: 'BFS Algorithm / Try and check', pages: [19, 20, 21] },
    },
    {
      id: 'ch03-q07',
      question: 'In BFS, after the node at the head of the queue is removed, what happens to its unvisited neighbours?',
      options: [
        'They are added to the tail of the queue',
        'They are added to the head of the queue',
        'They are discarded unless one of them is the goal',
        'They are sorted by heuristic value and the best one is expanded immediately',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Generated children join the tail of the FIFO queue, which is what produces the level-by-level order.',
      difficulty: 'foundational',
      sourceReference: { section: 'Breadth-first search (BFS) / BFS Algorithm', pages: [6, 19] },
    },
    {
      id: 'ch03-q08',
      question: "In the lecture's step-by-step BFS illustration on a graph, when does the traversal terminate?",
      options: [
        'When the first leaf node is reached',
        "After a fixed number of iterations equal to the graph's depth",
        'When the queue becomes empty',
        'When the visited array contains the root',
      ],
      correctAnswerIndex: 2,
      explanation: 'The steps repeat while the queue is non-empty; once it is empty, the traversal stops.',
      difficulty: 'foundational',
      sourceReference: { section: 'BFS Illustration', pages: [18, 19] },
    },
    {
      id: 'ch03-q09',
      question: 'BFS can find the shortest path between two nodes under which condition?',
      options: [
        'When edge costs vary widely',
        'When path length is measured as the number of edges',
        'When a heuristic estimate is available',
        'Only when the graph is a tree shallower than three levels',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The applications slide qualifies BFS shortest paths: path length must equal the number of edges, meaning every step counts equally.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Applications of BFS', pages: [22] },
    },
    {
      id: 'ch03-q10',
      question:
        "A messaging app needs to find every user in the same connected group as a given user. According to the applications listed, which algorithm fits this task?",
      options: ['Breadth-first search', 'Best-first search guided by h(n)', 'A* search', 'A local search algorithm'],
      correctAnswerIndex: 0,
      explanation:
        'Finding all nodes in one connected component is a listed BFS application. No heuristic is needed because every reachable node must be visited anyway.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Applications of BFS', pages: [22] },
    },
    {
      id: 'ch03-q11',
      question: 'Informed search algorithms are also referred to as…',
      options: [
        'blind search or exhaustive search',
        'breadth search or level search',
        'random search or stochastic search',
        'heuristic search or directed search',
      ],
      correctAnswerIndex: 3,
      explanation: 'The lecture states that informed search is also called heuristic search or directed search.',
      difficulty: 'foundational',
      sourceReference: { section: 'Informed Search', pages: [23] },
    },
    {
      id: 'ch03-q12',
      question: 'In search algorithms, what does a heuristic function provide?',
      options: [
        'The exact, guaranteed cost of the optimal solution',
        'The full list of successors of a node',
        'An estimate of solution cost that acts as a rule of thumb',
        'The order in which a FIFO queue is emptied',
      ],
      correctAnswerIndex: 2,
      explanation:
        'A heuristic estimates solution cost. It is a rule of thumb for which choice might be best, not a guarantee.',
      difficulty: 'foundational',
      sourceReference: { section: 'Heuristics', pages: [24] },
    },
    {
      id: 'ch03-q13',
      question: 'Why is there no general theory for finding heuristics?',
      options: [
        'Heuristics are always generated randomly',
        'Heuristics only work for breadth-first search',
        'Every problem is different, so choosing a heuristic depends on knowledge of that problem space',
        'Heuristics are determined by the programming language used',
      ],
      correctAnswerIndex: 2,
      explanation: 'Because problems differ, a good heuristic comes from knowledge of the specific problem space.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Heuristics', pages: [24] },
    },
    {
      id: 'ch03-q14',
      question: 'Best-first search tracks its traversal with two lists. What is the role of the CLOSED list?',
      options: [
        'It holds nodes that are candidates for expansion next',
        'It stores heuristic values for goal nodes only',
        'It holds nodes rejected because their cost was too high',
        'It records nodes that have already been traversed',
      ],
      correctAnswerIndex: 3,
      explanation:
        'OPEN holds the nodes currently available for traversal; CLOSED keeps track of nodes that have already been traversed.',
      difficulty: 'foundational',
      sourceReference: { section: 'Best-First Search', pages: [26] },
    },
    {
      id: 'ch03-q15',
      question: 'Which data structure concept does best-first search rely on to pick the most promising node?',
      options: ['A priority queue', 'A FIFO queue', 'A LIFO stack', 'An unordered set'],
      correctAnswerIndex: 0,
      explanation:
        'Best-first search uses a priority queue ordered by the heuristic evaluation, so the most promising node comes out first.',
      difficulty: 'foundational',
      sourceReference: { section: 'Best-First Search', pages: [26] },
    },
    {
      id: 'ch03-q16',
      question:
        "Best-first search with h(n) starts at S, whose children are A (h = 6) and B (h = 3). B's children are C (h = 4) and D (h = 1). D's child is the goal G (h = 0). A's child is E (h = 2). Which path is found?",
      options: ['S → A → E', 'S → B → D → G', 'S → B → C → G', 'S → A → B → D → G'],
      correctAnswerIndex: 1,
      explanation:
        'From S, choose B (3 < 6). OPEN is then {A 6, C 4, D 1}, so choose D, then G (0). E is never generated because A is never expanded, even though h(E) = 2 is low.',
      difficulty: 'advanced',
      sourceReference: { section: 'Best-First Search: Example and Solution', pages: [28, 29] },
    },
    {
      id: 'ch03-q17',
      question: 'In best-first search, which node is selected from the OPEN list at each step?',
      options: [
        'The node that was added to OPEN first',
        'The node that was added to OPEN most recently',
        'The node with the largest h(n) value',
        'The node with the smallest h(n) value',
      ],
      correctAnswerIndex: 3,
      explanation:
        'h(n) estimates the cost from n to the goal, so the node with the lowest estimate is considered most promising and expanded next.',
      difficulty: 'foundational',
      sourceReference: { section: 'Best-First Search', pages: [27, 29] },
    },
    {
      id: 'ch03-q18',
      question: 'Why can informed search usually constrain the size of the search space compared with blind search?',
      options: [
        'It uses problem knowledge beyond the initial state, operators and goal test',
        'It skips the goal test entirely',
        'It keeps only the root node in memory',
        'It expands every node at each depth level',
      ],
      correctAnswerIndex: 0,
      explanation:
        'When more than the initial state, operators and goal test is known, such as the distance to the goal, that knowledge can prune where the search looks.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Informed Search', pages: [23] },
    },
    {
      id: 'ch03-q19',
      question:
        'A best-first search returns the path X → Y → Z → Goal. The actual edge costs are X–Y = 5, Y–Z = 2 and Z–Goal = 6. What is the total cost of the returned path?',
      options: ['7', '11', '13', '15'],
      correctAnswerIndex: 2,
      explanation:
        'Total path cost is the sum of the actual edge costs along the path: 5 + 2 + 6 = 13. Heuristic values guide the search but are not part of the path cost.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Find the total cost to go from P to S', pages: [30, 31] },
    },
    {
      id: 'ch03-q20',
      question: 'Which set lists only informed search strategies from the lecture?',
      options: [
        'Breadth-first search, depth-first search, uniform-cost search',
        'Best-first search, A* search, local search algorithms',
        'Bidirectional search, iterative deepening search, A* search',
        'Breadth-first search, best-first search, depth-first search',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The informed strategies listed are best-first search, A* search, heuristics and local search algorithms. Each other option includes at least one uninformed strategy.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Informed search strategies', pages: [25] },
    },
  ],
});
