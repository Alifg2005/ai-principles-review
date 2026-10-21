import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'informed-search-algorithms',
  number: 5,
  title: 'Informed Search Algorithms',
  description:
    'Best-first search with evaluation functions, greedy best-first search, A* with f(n) = g(n) + h(n), admissible heuristics, and how the strategies compare.',
  source: {
    fileName: 'Topic 5-Informed Search Algorithms.pdf',
    label: 'Lecture 5',
    pageCount: 38,
    note: 'The Romania map walkthrough slides are images; questions rely on the extracted text and tables, plus original worked examples.',
  },
  questions: [
    {
      id: 'ch05-q01',
      question: 'In best-first search, how is the next node to expand chosen?',
      options: [
        'The oldest node in the frontier is always chosen',
        'The node with the lowest value of an evaluation function f(n) is expanded first',
        'The node with the highest evaluation is expanded first',
        'Nodes are chosen at random to avoid loops',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The evaluation function is read as a cost estimate, so the node with the lowest evaluation is expanded first, using a priority queue.',
      difficulty: 'foundational',
      sourceReference: { section: 'Informed/Heuristic Search', pages: [5] },
    },
    {
      id: 'ch05-q02',
      question: 'Greedy best-first search and A* search are both described as…',
      options: [
        'uninformed strategies that use FIFO queues',
        'variants of depth-limited search',
        'special cases of best-first search',
        'local search algorithms that keep a single node in memory',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Both are special cases of best-first search. They differ in the evaluation function f(n) they use.',
      difficulty: 'foundational',
      sourceReference: { section: 'Special cases of best-first search', pages: [7] },
    },
    {
      id: 'ch05-q03',
      question: 'Which evaluation function does greedy best-first search use?',
      options: ['f(n) = h(n)', 'f(n) = g(n)', 'f(n) = g(n) + h(n)', 'f(n) = g(n) − h(n)'],
      correctAnswerIndex: 0,
      explanation:
        'Greedy search ranks nodes only by the heuristic estimate of the cost from n to the goal.',
      difficulty: 'foundational',
      sourceReference: { section: 'Greedy best-first search', pages: [8] },
    },
    {
      id: 'ch05-q04',
      question: 'Why is the algorithm called "greedy"?',
      options: [
        'It expands every node to collect as much information as possible',
        'It always prefers the cheapest path cost so far',
        'It uses more memory than any other search strategy',
        'At each step it tries to get as close to the goal as it can, based on the heuristic',
      ],
      correctAnswerIndex: 3,
      explanation:
        'It grabs whatever looks closest to the goal right now, without accounting for the cost already paid.',
      difficulty: 'foundational',
      sourceReference: { section: 'Greedy best-first search', pages: [8] },
    },
    {
      id: 'ch05-q05',
      question: 'Why is greedy best-first search not complete?',
      options: [
        'It needs an admissible heuristic to run at all',
        'It can get stuck in loops, moving back and forth between states',
        'It cannot use a priority queue',
        'It ignores the heuristic once the goal enters the frontier',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Following only h(n), the search can oscillate between states (Iasi and Neamt in the lecture example) and never reach the goal.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Properties of greedy best-first search', pages: [15] },
    },
    {
      id: 'ch05-q06',
      question: 'In the Romania route-finding example, what shows that greedy best-first search is not optimal?',
      options: [
        'The route it finds via Sibiu and Fagaras is longer than the route through Rimnicu Vilcea and Pitesti',
        'It never reaches Bucharest',
        'It explores every city in Romania before stopping',
        'Its returned path passes through Arad twice',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Greedy search reaches Bucharest via Sibiu and Fagaras, but the route via Rimnicu Vilcea and Pitesti is shorter. It finds a solution, not the best one.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Properties of greedy best-first search', pages: [14, 15] },
    },
    {
      id: 'ch05-q07',
      question:
        'From start S: S–A costs 2 (h(A) = 7), S–B costs 1 (h(B) = 3), A–G costs 2, B–D costs 5 (h(D) = 4), D–G costs 5. G is the goal. What path does greedy best-first search return, and is it the cheapest?',
      options: [
        'S → A → G; yes, it is the cheapest',
        'S → B → D → G; yes, it is the cheapest',
        'S → A → G; no, a cheaper path exists',
        'S → B → D → G; no, S → A → G is cheaper',
      ],
      correctAnswerIndex: 3,
      explanation:
        'Greedy picks B (h = 3 < 7), then D, then G, giving a path cost of 1 + 5 + 5 = 11. The path S → A → G costs only 4, which shows greedy search is not optimal.',
      difficulty: 'advanced',
      sourceReference: { section: 'Greedy best-first search / Properties', pages: [8, 15] },
    },
    {
      id: 'ch05-q08',
      question: 'In A* search, what does f(n) = g(n) + h(n) estimate?',
      options: [
        'The cost from the start node to n only',
        'The number of nodes remaining in the frontier',
        'The cost of the cheapest solution that passes through n',
        'The exact cost from n to the goal',
      ],
      correctAnswerIndex: 2,
      explanation:
        'g(n) is the cost already paid to reach n and h(n) estimates the remaining cost, so their sum estimates the cheapest complete solution through n.',
      difficulty: 'foundational',
      sourceReference: { section: 'A* Search', pages: [27] },
    },
    {
      id: 'ch05-q09',
      question: 'A heuristic h(n) is admissible when…',
      options: [
        'it never overestimates the true minimum cost from n to the goal',
        'it always overestimates the true cost so that search runs faster',
        'it equals g(n) for every node',
        'it is computed by breadth-first search',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Admissibility means h(n) ≤ h*(n) for every node n, where h*(n) is the true cheapest cost to the goal.',
      difficulty: 'foundational',
      sourceReference: { section: 'A* Search: admissible heuristic', pages: [28] },
    },
    {
      id: 'ch05-q10',
      question: 'Why does the straight-line distance heuristic never overestimate the actual road distance?',
      options: [
        'Because roads always follow straight lines',
        'Because a straight line is the shortest possible path between two points in Euclidean space',
        'Because it is computed after the search finishes',
        'Because it already includes the path cost g(n)',
      ],
      correctAnswerIndex: 1,
      explanation:
        'No road between two points can be shorter than the straight line between them, so h_SLD is admissible.',
      difficulty: 'intermediate',
      sourceReference: { section: 'A* Search: admissible heuristic', pages: [28] },
    },
    {
      id: 'ch05-q11',
      question: 'Given that h(n) ≥ 0 and h is admissible, what must h(G) be for any goal G?',
      options: ['The total path cost from the start', '1', '0', 'Any positive number'],
      correctAnswerIndex: 2,
      explanation:
        'The true remaining cost at a goal is 0, and an admissible, non-negative heuristic cannot exceed it, so h(G) = 0.',
      difficulty: 'intermediate',
      sourceReference: { section: 'A* Search: admissible heuristic', pages: [28] },
    },
    {
      id: 'ch05-q12',
      question:
        'During an A* search, node K has path cost g(K) = 120. Its neighbour M is reached from K by a step costing 40, and h(M) = 70. What is f(M)?',
      options: ['165', '190', '215', '230'],
      correctAnswerIndex: 3,
      explanation: 'g(M) = 120 + 40 = 160, so f(M) = g(M) + h(M) = 160 + 70 = 230.',
      difficulty: 'intermediate',
      sourceReference: { section: 'A* Search Example', pages: [31, 32, 33] },
    },
    {
      id: 'ch05-q13',
      question:
        'An A* frontier contains P (g = 100, h = 260), Q (g = 230, h = 110) and R (g = 300, h = 60). Which node is expanded next?',
      options: [
        'P, because it has the smallest g(n)',
        'Q, because it has the smallest f(n)',
        'R, because it has the smallest h(n)',
        'P or R, because they tie on f(n)',
      ],
      correctAnswerIndex: 1,
      explanation:
        'f(P) = 360, f(Q) = 340 and f(R) = 360. A* expands the lowest f, which is Q. Choosing R by smallest h would be greedy behaviour.',
      difficulty: 'advanced',
      sourceReference: { section: 'A* Search', pages: [27, 31] },
    },
    {
      id: 'ch05-q14',
      question: "According to the lecture's summary of A* properties, when is A* optimal?",
      options: [
        'When the heuristic overestimates the true cost',
        'When all step costs are exactly 1',
        'When the frontier is a FIFO queue',
        'When an admissible heuristic is used',
      ],
      correctAnswerIndex: 3,
      explanation: 'A* is optimal when its heuristic is admissible, meaning it never overestimates.',
      difficulty: 'foundational',
      sourceReference: { section: 'Properties of A* Search', pages: [36] },
    },
    {
      id: 'ch05-q15',
      question: 'What key advantage does A* have over greedy best-first search?',
      options: [
        'It avoids expanding paths that are already expensive, because it accounts for g(n)',
        'It does not need a heuristic',
        'It uses less memory because it keeps only one path',
        'It always expands fewer nodes than any other algorithm',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Including g(n) penalises paths that have already become costly, which greedy search ignores.',
      difficulty: 'intermediate',
      sourceReference: { section: 'A* Search', pages: [27] },
    },
    {
      id: 'ch05-q16',
      question: 'According to their stated space complexity, what weakness do greedy best-first search and A* share?',
      options: [
        'Neither can use a priority queue',
        'Both are incomplete in finite spaces',
        'Both keep all generated nodes in memory',
        'Both require every step to cost 1',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Both property slides note that the algorithm keeps all nodes in memory, which can be a serious limitation on large problems.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Properties of greedy best-first search / A*', pages: [15, 36] },
    },
    {
      id: 'ch05-q17',
      question: 'What does a heuristic function contribute in informed search?',
      options: [
        'A number indicating how good or bad (how promising) a node is',
        'The exact list of actions that reaches the goal',
        'A guarantee that the search is complete',
        'A random order for expanding nodes',
      ],
      correctAnswerIndex: 0,
      explanation: 'A heuristic function produces a number that indicates how good or bad a node is likely to be.',
      difficulty: 'foundational',
      sourceReference: { section: 'Informed/Heuristic Search', pages: [4] },
    },
    {
      id: 'ch05-q18',
      question: "In the lecture's comparison of uninformed and informed strategies, which pair are both complete and optimal?",
      options: [
        'DFS and greedy best-first search',
        'Greedy best-first search and A*',
        'DFS and IDS',
        'BFS and A*',
      ],
      correctAnswerIndex: 3,
      explanation:
        'The comparison table marks BFS (with equal step costs), IDS and A* as complete and optimal. DFS and greedy best-first search are neither.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Comparison', pages: [37] },
    },
    {
      id: 'ch05-q19',
      question:
        'In the Romania example, after expanding Sibiu (g = 140), A* computes f(Rimnicu Vilcea) = 413 and f(Fagaras) = 415. Which city is expanded first, and why?',
      options: [
        'Fagaras, because its h(n) value is smaller',
        'Fagaras, because it is closer to Bucharest by road',
        'Rimnicu Vilcea, because its f(n) value is lower',
        'Rimnicu Vilcea, because its h(n) value is smaller',
      ],
      correctAnswerIndex: 2,
      explanation:
        'A* compares f(n) = g(n) + h(n): 413 < 415, so Rimnicu Vilcea goes first, even though Fagaras has the smaller h (176 vs 193). Choosing by h alone is what greedy search does.',
      difficulty: 'advanced',
      sourceReference: { section: 'A* Search Example', pages: [31] },
    },
    {
      id: 'ch05-q20',
      question: "According to the lecture's objective, why can an informed strategy find solutions more efficiently than an uninformed one?",
      options: [
        'It considers fewer actions per state by design',
        'It uses problem-specific knowledge beyond the definition of the problem itself',
        'It always runs on faster hardware',
        'It skips the goal test',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Informed search adds knowledge beyond the bare problem definition, such as distance estimates, to guide where it searches.',
      difficulty: 'foundational',
      sourceReference: { section: 'Objective', pages: [2] },
    },
  ],
});
