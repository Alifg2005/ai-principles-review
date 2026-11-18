import { tree } from '../../lib/graphLayout';
import { definePracticeSet, type Graph } from '../../lib/practiceSchema';

const ARCH_PARTS = ['Inference engine', 'Knowledge base', 'Working memory', 'Explanation facility'];
const COMPONENTS = ['Knowledge base', 'Inference engine', 'Working memory', 'User interface', 'Explanation facility'];
const STRATEGIES = ['R1', 'R2', 'R3'];

/** Expert system architecture, with the four core parts optionally blanked. */
function architecture(labels: string[], tone?: 'blank'): Graph {
  const box = (id: string, label: string, x: number, y: number, blank = false) => ({
    id,
    label,
    x,
    y,
    shape: 'box' as const,
    w: 118,
    h: 40,
    ...(blank && tone ? { tone } : {}),
  });
  return {
    directed: true,
    width: 580,
    height: 240,
    nodes: [
      box('user', 'User', 60, 115),
      box('ui', 'User interface', 195, 115),
      box('ie', labels[0]!, 330, 115, true),
      box('kb', labels[1]!, 490, 115, true),
      box('expert', 'Domain expert / knowledge engineer', 490, 30),
      box('wm', labels[2]!, 330, 205, true),
      box('ef', labels[3]!, 195, 205, true),
    ],
    edges: [
      { from: 'user', to: 'ui', both: true },
      { from: 'ui', to: 'ie', both: true },
      { from: 'ie', to: 'kb', both: true },
      { from: 'expert', to: 'kb', label: 'knowledge acquisition' },
      { from: 'ie', to: 'wm', both: true },
      { from: 'ef', to: 'ie' },
    ],
  };
}

const RULES_A = [
  'R1: A → C',
  'R2: B and C → D',
  'R3: D → E',
  'R4: F → E',
  'R5: E and B → G',
];

export default definePracticeSet({
  chapterId: 'expert-systems',
  questions: [
    {
      id: 'p08-01',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Expert systems',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Define an expert system and state its key idea.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'p',
            text: 'A computer system that simulates the decision-making of a human expert in a specific domain. It reasons over a knowledge base, mostly IF–THEN rules, instead of following procedural code. Key idea: it captures a specialist\'s knowledge and makes it available to anyone.',
          },
        ],
        detailed: [
          {
            type: 'p',
            text: 'Knowledge is extracted from domain experts and loaded into the knowledge base; more experience entered means better performance. In use, the system asks questions, and each answer narrows the possibilities until it reaches a decision or diagnosis.',
          },
        ],
      },
    },
    {
      id: 'p08-02',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Expert systems',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Distinguish the problem domain from the knowledge domain, with an example.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Problem domain: the whole area the expert works in, such as medicine.',
              'Knowledge domain: the expert\'s knowledge for solving particular problems in it, such as diagnosing infections.',
              'The problem domain is always a superset of the knowledge domain.',
            ],
          },
        ],
      },
    },
    {
      id: 'p08-03',
      kind: 'written',
      answerStyle: 'list',
      topic: 'When to use an expert system',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'List four criteria that make a problem suitable for an expert system, and one reason not to build one.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'A human expert can solve it.',
              'The possible solutions can be defined.',
              'The scope is limited and the depth manageable.',
              'The solution technique is documented, for example as a tree or manual.',
              'Not suitable: an efficient conventional algorithm already exists.',
            ],
          },
        ],
        detailed: [
          {
            type: 'p',
            text: 'Other good signs: a high expected payoff, a knowledge-intensive task, many test cases, and no need for creativity, physical skill or heavy natural-language processing. Other reasons against: the hard part is computation rather than knowledge, the knowledge cannot be captured, or the problem does not justify the cost.',
          },
        ],
      },
    },
    {
      id: 'p08-04',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Expert systems',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Compare an expert system with a conventional program on four characteristics.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'table',
            table: {
              columns: ['Characteristic', 'Conventional program', 'Expert system'],
              rows: [
                ['Control', 'Integrated with information', 'Knowledge separate from control'],
                ['Solved by', 'Algorithm', 'Rules and inference'],
                ['Input', 'Must be complete', 'Can be incomplete'],
                ['Answers', 'Optimal solution', 'Acceptable solution'],
              ],
            },
          },
        ],
      },
    },
    {
      id: 'p08-05',
      kind: 'written',
      answerStyle: 'steps',
      topic: 'Development',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Name the four development phases of an expert system, and distinguish verification from validation.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ol',
            items: [
              'Analysis: is an expert system the answer?',
              'Specification: inputs, outputs and the inference approach.',
              'Development: acquire knowledge, build the model and knowledge base, verify and validate.',
              'Deployment: install for routine use, then fix and update.',
            ],
          },
          { type: 'p', text: 'Verification: "Am I building the product right?" Validation: "Am I building the right product?"' },
        ],
      },
    },
    {
      id: 'p08-06',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Inference strategies',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Compare forward and backward chaining, and give a problem suited to each.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'table',
            table: {
              columns: ['Feature', 'Forward chaining', 'Backward chaining'],
              rows: [
                ['Driven by', 'Data', 'Goal'],
                ['Starts from', 'Known facts', 'A hypothesis to prove'],
                ['Efficiency', 'May fire rules unrelated to the goal', 'Examines only relevant rules'],
                ['Suits', 'All facts known up front; many conclusions', 'Diagnosis of a specific goal'],
              ],
            },
          },
        ],
      },
    },
    {
      id: 'p08-07',
      kind: 'complete',
      topic: 'Architecture',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Complete the architecture of an expert system.',
      figure: architecture(['1', '2', '3', '4'], 'blank'),
      slots: [
        { nodeId: 'ie', options: ARCH_PARTS, expected: 'Inference engine' },
        { nodeId: 'kb', options: ARCH_PARTS, expected: 'Knowledge base' },
        { nodeId: 'wm', options: ARCH_PARTS, expected: 'Working memory' },
        { nodeId: 'ef', options: ARCH_PARTS, expected: 'Explanation facility' },
      ],
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'p',
            text: 'The user talks to the interface, which passes queries to the inference engine. The engine matches rules in the knowledge base against case facts in working memory; the explanation facility justifies its conclusions.',
          },
        ],
        figure: architecture(ARCH_PARTS),
      },
    },
    {
      id: 'p08-08',
      kind: 'table',
      topic: 'Architecture',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'In a medical diagnosis expert system, which component does each job?',
      columns: ['Job', 'Component'],
      rows: [
        [{ given: 'Holds the medical rules' }, { accepted: ['Knowledge base'], options: COMPONENTS }],
        [{ given: 'Decides which rule applies' }, { accepted: ['Inference engine'], options: COMPONENTS }],
        [{ given: 'Holds the facts about the current patient' }, { accepted: ['Working memory'], options: COMPONENTS }],
        [{ given: 'Asks the doctor questions' }, { accepted: ['User interface'], options: COMPONENTS }],
        [{ given: 'Says why an antibiotic is recommended' }, { accepted: ['Explanation facility'], options: COMPONENTS }],
      ],
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'p',
            text: 'Knowledge base: general rules. Working memory: facts about this case. Inference engine: chooses and fires rules. User interface: dialogue. Explanation facility: how and why.',
          },
        ],
      },
    },
    {
      id: 'p08-09',
      kind: 'table',
      topic: 'Forward chaining',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Initial facts: {A, B}. Run forward chaining and record the rule fired and the new fact in each cycle. Write "none" in the last row.',
      context: [{ type: 'ul', items: RULES_A }],
      traceRules: {
        order: 'In each cycle, fire the lowest-numbered rule whose conditions all hold and that has not fired yet.',
        goalTest: 'No goal: stop when no rule can fire.',
      },
      columns: ['Cycle', 'Rule fired', 'New fact'],
      rows: [
        [{ given: '1' }, { accepted: ['R1'] }, { accepted: ['C'] }],
        [{ given: '2' }, { accepted: ['R2'] }, { accepted: ['D'] }],
        [{ given: '3' }, { accepted: ['R3'] }, { accepted: ['E'] }],
        [{ given: '4' }, { accepted: ['R5'] }, { accepted: ['G'] }],
        [{ given: '5' }, { accepted: ['none'] }, { accepted: ['none'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Final working memory: {A, B, C, D, E, G}. R4 never fires because F is not a fact.' }],
        detailed: [
          {
            type: 'p',
            text: 'Each fired rule adds its conclusion, which can enable later rules: C enables R2, D enables R3, and E with B enables R5. Forward chaining keeps going until no rule matches, so it derives every reachable fact, not just one goal.',
          },
        ],
      },
    },
    {
      id: 'p08-10',
      kind: 'table',
      topic: 'Backward chaining',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'Same rules, initial facts {A, B}. Prove the goal G by backward chaining. For each goal, give the rule used and what it needs.',
      context: [{ type: 'ul', items: RULES_A }],
      traceRules: {
        order: 'For each goal, try the lowest-numbered rule that concludes it. Prove its conditions left to right.',
        goalTest: 'A goal is proved when it is a known fact or a rule for it succeeds.',
      },
      columns: ['Goal', 'Rule used', 'Needs'],
      rows: [
        [{ given: 'G' }, { accepted: ['R5'] }, { accepted: ['E, B'] }],
        [{ given: 'E' }, { accepted: ['R3'] }, { accepted: ['D'] }],
        [{ given: 'D' }, { accepted: ['R2'] }, { accepted: ['B, C'] }],
        [{ given: 'C' }, { accepted: ['R1'] }, { accepted: ['A'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'A and B are known facts, so the chain succeeds: A → C, then B and C → D, then D → E, then E and B → G. G is proved.' }],
        detailed: [
          {
            type: 'p',
            text: 'Each condition becomes a subgoal and the rule waits while it is proved. R3 is tried before R4 for E; R4 would need F, which is not known. Only rules relevant to G are examined.',
          },
        ],
      },
    },
    {
      id: 'p08-11',
      kind: 'sequence',
      topic: 'Case-based reasoning',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Put the steps of the case-based reasoning cycle in order.',
      tokens: ['Evaluate', 'Adapt', 'Execute', 'Retrieve', 'Refine'],
      expected: ['Retrieve', 'Adapt', 'Refine', 'Execute', 'Evaluate'],
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'formula', text: 'Retrieve → Adapt → Refine → Execute → Evaluate' }],
        steps: {
          columns: ['Step', 'Component', 'Medical example'],
          rows: [
            ['Retrieve', 'Retriever', 'Find patients with similar symptoms'],
            ['Adapt', 'Adapter', 'Adjust the dose for the new weight'],
            ['Refine', 'Refiner', 'Check the treatment is safe'],
            ['Execute', 'Executer', 'Give the treatment'],
            ['Evaluate', 'Evaluator', 'Store a success or repair a failure'],
          ],
        },
      },
    },
    {
      id: 'p08-12',
      kind: 'table',
      topic: 'Certainty factors',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Two rules support the same conclusion. Combine their certainty factors with CF1 + CF2 × (1 − CF1). Give two decimal places where needed.',
      mixUp: 'The formula CF1 + CF2 × (1 − CF1) combines two positive certainty factors that support the same conclusion. Evidence against a conclusion is combined differently.',
      columns: ['CF1', 'CF2', 'Combined CF'],
      rows: [
        [{ given: '0.4' }, { given: '0.5' }, { accepted: ['0.7', '0.70'] }],
        [{ given: '0.8' }, { given: '0.5' }, { accepted: ['0.9', '0.90'] }],
        [{ given: '0.6' }, { given: '0.6' }, { accepted: ['0.84'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Each extra rule closes part of the remaining gap to 1, so confidence rises but never exceeds 1.' }],
        steps: {
          columns: ['CF1', 'CF2', 'Working', 'Combined'],
          rows: [
            ['0.4', '0.5', '0.4 + 0.5 × 0.6', '0.70'],
            ['0.8', '0.5', '0.8 + 0.5 × 0.2', '0.90'],
            ['0.6', '0.6', '0.6 + 0.6 × 0.4', '0.84'],
          ],
        },
      },
    },
    {
      id: 'p08-13',
      kind: 'construct',
      topic: 'Tree-structured rules',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Build the decision tree for these rules. Use "yes" and "no" as connection labels.',
      context: [
        {
          type: 'ul',
          items: [
            'IF warm-blooded AND has feathers THEN bird.',
            'IF warm-blooded AND no feathers THEN mammal.',
            'IF not warm-blooded THEN reptile.',
          ],
        },
      ],
      directed: true,
      nodeLabels: ['Warm-blooded?', 'Feathers?', 'Bird', 'Mammal', 'Reptile'],
      edgeLabels: ['yes', 'no'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Questions become nodes and answers become labelled branches. Each root-to-leaf path is one of the three rules.' }],
        figure: tree(
          'Warm-blooded?',
          { 'Warm-blooded?': ['Feathers?', 'Reptile'], 'Feathers?': ['Bird', 'Mammal'] },
          { costs: { 'Warm-blooded?>Feathers?': 'yes', 'Warm-blooded?>Reptile': 'no', 'Feathers?>Bird': 'yes', 'Feathers?>Mammal': 'no' } },
        ),
      },
    },
    {
      id: 'p08-14',
      kind: 'table',
      topic: 'Conflict resolution',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'All three rules match in the same cycle. Which rule does each conflict-resolution strategy choose?',
      context: [
        {
          type: 'ul',
          items: [
            'Working memory, oldest first: alarm (time 1), heat (time 2), smoke (time 3).',
            'R1: IF alarm THEN evacuate. Highest priority.',
            'R2: IF alarm AND heat THEN call the fire service.',
            'R3: IF smoke THEN open the vents.',
          ],
        },
      ],
      columns: ['Strategy', 'Rule chosen'],
      rows: [
        [{ given: 'Highest priority' }, { accepted: ['R1'], options: STRATEGIES }],
        [{ given: 'Most specific (longest matching)' }, { accepted: ['R2'], options: STRATEGIES }],
        [{ given: 'Most recent data' }, { accepted: ['R3'], options: STRATEGIES }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [
          {
            type: 'p',
            text: 'Priority picks R1, which is ranked highest. Specificity picks R2, which has the most conditions. Recency picks R3, which uses the newest fact, smoke.',
          },
        ],
      },
    },
    {
      id: 'p08-15',
      kind: 'logic',
      topic: 'Production rules',
      difficulty: 'foundational',
      questionStatus: 'original-worked-example',
      prompt: 'Write this rule as a propositional sentence: "IF the battery is dead AND the lights do not work THEN replace the battery." Use D, L for "the lights do not work", and R.',
      accepted: ['D ∧ L ⇒ R', '(D ∧ L) ⇒ R'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '(D ∧ L) ⇒ R' }],
      },
    },
  ],
});
