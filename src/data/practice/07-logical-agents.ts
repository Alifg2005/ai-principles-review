import { definePracticeSet, type Graph } from '../../lib/practiceSchema';

const TF = ['T', 'F'];
const tf = (answer: 'T' | 'F') => ({ accepted: [answer], options: TF });
const given = (v: string) => ({ given: v });

const CYCLE_PARTS = ['TELL: percept', 'ASK: which action?', 'TELL: action taken', 'Perform the action'];

function agentCycle(labels: string[], tone?: 'blank'): Graph {
  const step = (id: string, label: string, x: number, y: number) => ({
    id,
    label,
    x,
    y,
    shape: 'box' as const,
    w: 140,
    h: 46,
    ...(tone ? { tone } : {}),
  });
  return {
    directed: true,
    width: 480,
    height: 250,
    nodes: [
      { id: 'kb', label: 'Knowledge base', x: 240, y: 125, shape: 'box', w: 130, h: 50, tone: 'env' },
      step('tell', labels[0]!, 90, 40),
      step('ask', labels[1]!, 390, 40),
      step('act', labels[3]!, 390, 210),
      step('record', labels[2]!, 90, 210),
    ],
    edges: [
      { from: 'tell', to: 'ask' },
      { from: 'ask', to: 'act' },
      { from: 'act', to: 'record' },
      { from: 'record', to: 'tell' },
      { from: 'tell', to: 'kb', dashed: true },
      { from: 'ask', to: 'kb', dashed: true },
      { from: 'record', to: 'kb', dashed: true },
    ],
  };
}

const ROOM_OPTIONS = ['Pit', 'Wumpus', 'Safe'];

function wumpusGrid(labels: Record<string, string>, tone?: 'blank'): Graph {
  const room = (id: string, label: string, x: number, y: number, blank = false) => ({
    id,
    label,
    x,
    y,
    shape: 'box' as const,
    w: 118,
    h: 62,
    ...(blank && tone ? { tone } : {}),
  });
  return {
    directed: false,
    width: 390,
    height: 215,
    nodes: [
      room('r13', labels.r13!, 65, 36, true),
      room('r11', '[1,1] Start: no percepts', 65, 180),
      room('r12', '[1,2] Stench, no breeze', 65, 108),
      room('r21', '[2,1] Breeze, no stench', 195, 180),
      room('r22', labels.r22!, 195, 108, true),
      room('r31', labels.r31!, 325, 180, true),
    ],
    edges: [],
  };
}

const SEMANTIC_NET: Graph = {
  directed: true,
  width: 460,
  height: 300,
  nodes: [
    { id: 'Rex', label: 'Rex', x: 60, y: 260 },
    { id: 'Sheepdog', label: 'Sheepdog', x: 170, y: 190, shape: 'box', w: 84, h: 34 },
    { id: 'Dog', label: 'Dog', x: 280, y: 125, shape: 'box', w: 70, h: 34 },
    { id: 'Mammal', label: 'Mammal', x: 390, y: 60, shape: 'box', w: 80, h: 34 },
    { id: 'Fur', label: 'Fur', x: 240, y: 30, shape: 'box', w: 60, h: 34 },
    { id: 'Sara', label: 'Sara', x: 260, y: 265, shape: 'box', w: 66, h: 34 },
  ],
  edges: [
    { from: 'Rex', to: 'Sheepdog', label: 'is_a' },
    { from: 'Sheepdog', to: 'Dog', label: 'is_a' },
    { from: 'Dog', to: 'Mammal', label: 'is_a' },
    { from: 'Mammal', to: 'Fur', label: 'has' },
    { from: 'Rex', to: 'Sara', label: 'owned_by' },
  ],
};

const LEVELS = ['Knowledge', 'Logical', 'Implementation'];
const STATUS = ['Valid', 'Satisfiable, not valid', 'Unsatisfiable'];

export default definePracticeSet({
  chapterId: 'logical-agents',
  questions: [
    {
      id: 'p07-01',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Knowledge-based agents',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'What is a knowledge-based agent, and what are its two main components?',
      sourceReference: { section: 'Knowledge-based agents / Components', pages: [5, 11] },
      answer: {
        shortStatus: 'slide-based',
        short: [
          { type: 'p', text: 'An agent with an explicit representation of knowledge that it can reason with.' },
          {
            type: 'ul',
            items: ['Knowledge base: domain facts and rules, stored as sentences.', 'Inference engine: domain-independent reasoning that derives new information and answers queries.'],
          },
        ],
      },
    },
    {
      id: 'p07-02',
      kind: 'written',
      answerStyle: 'steps',
      topic: 'TELL and ASK',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'List the three steps a knowledge-based agent performs each time its program is called.',
      sourceReference: { section: 'Agent program workflow: TELL and ASK', pages: [9, 10] },
      answer: {
        shortStatus: 'slide-based',
        detailedStatus: 'slide-based',
        short: [
          { type: 'ol', items: ['TELL the KB what it perceives.', 'ASK the KB which action to take.', 'TELL the KB which action was executed.'] },
        ],
        detailed: [{ type: 'p', text: 'The first TELL keeps the KB up to date, the ASK uses inference to choose the action, and the last TELL keeps a history for future reasoning. Together they form a continuous loop.' }],
      },
    },
    {
      id: 'p07-03',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Declarative vs procedural',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'Compare declarative and procedural knowledge.',
      sourceReference: { section: 'Declarative vs procedural knowledge', pages: [13, 14, 15] },
      answer: {
        shortStatus: 'slide-based',
        short: [
          {
            type: 'table',
            table: {
              columns: ['Aspect', 'Declarative', 'Procedural'],
              rows: [
                ['Meaning', 'Knowing that', 'Knowing how'],
                ['Built by', 'TELLing facts and rules to a KB', 'Coding behaviour directly'],
                ['Strength', 'Easy to modify and read', 'Fast, efficient computation'],
                ['Weakness', 'Lower computational efficiency', 'Hard to modify and explain'],
              ],
            },
          },
        ],
      },
    },
    {
      id: 'p07-04',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Entailment and models',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'Define a model and entailment. How many models does a KB with n symbols have?',
      sourceReference: { section: 'Logical Entailment / Models', pages: [35, 38] },
      answer: {
        shortStatus: 'slide-based',
        short: [
          {
            type: 'ul',
            items: [
              'Model: an assignment of true or false to every symbol. There are 2ⁿ of them.',
              'KB ⊨ α (KB entails α): α is true in every model where KB is true.',
            ],
          },
        ],
      },
    },
    {
      id: 'p07-05',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Entailment and models',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'Define valid, satisfiable and unsatisfiable, with an example of each.',
      sourceReference: { section: 'Models (2)', pages: [39] },
      answer: {
        shortStatus: 'slide-based',
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'p', text: "P ∨ ¬P is another valid sentence: whichever value P takes, one side is true." }],
          },
        ],
        short: [
          {
            type: 'ul',
            items: ['Valid: true in all models, e.g. the sentence True.', 'Satisfiable: true in at least one model, e.g. A ∧ B.', 'Unsatisfiable: true in no model, e.g. ¬A ∧ A.'],
          },
        ],
      },
    },
    {
      id: 'p07-06',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Knowledge representation',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'What are the three parts of a knowledge representation, and why are neither programming languages nor natural languages ideal for it?',
      sourceReference: { section: 'Knowledge representation (KR) / Good KR languages', pages: [29, 30] },
      answer: {
        shortStatus: 'slide-based',
        short: [
          {
            type: 'ul',
            items: [
              'Representation = syntax (symbols and rules) + semantics (meaning) + reasoning (deriving new information).',
              'Programming languages are not expressive enough for incomplete information.',
              'Natural languages are expressive but ambiguous.',
            ],
          },
        ],
      },
    },
    {
      id: 'p07-07',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Other KR methods',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'Compare semantic networks with frames.',
      sourceReference: { section: 'Semantic networks / Frames', pages: [48, 49, 58, 59] },
      answer: {
        shortStatus: 'slide-based',
        detailedStatus: 'slide-based',
        short: [
          {
            type: 'ul',
            items: [
              'Semantic network: named nodes joined by labeled links that show relationships.',
              'Frame: an object with slots and fillers, holding everything about the object inside the node.',
              'Both use graphs and support inference through inheritance.',
            ],
          },
        ],
        detailed: [{ type: 'p', text: 'Frames also allow defaults (typical values that can be overridden), facets and attached procedures. They resemble classes in object-oriented programming, without the methods.' }],
      },
    },
    {
      id: 'p07-08',
      kind: 'written',
      answerStyle: 'list',
      topic: 'Wumpus world',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'Characterise the Wumpus world environment, and list its five percepts.',
      sourceReference: { section: 'Wumpus World Characterization', pages: [20, 21] },
      answer: {
        shortStatus: 'slide-based',
        short: [
          { type: 'p', text: 'Partially observable, deterministic, sequential, static, discrete, single-agent.' },
          { type: 'p', text: 'Percepts: breeze, stench, glitter, scream, bump.' },
        ],
      },
    },
    {
      id: 'p07-09',
      kind: 'complete',
      topic: 'TELL and ASK',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'Complete the cycle of a knowledge-based agent, starting at the top left.',
      sourceReference: { section: 'A simple knowledge-based agent', pages: [8, 9, 10] },
      figure: agentCycle(['1', '2', '4', '3'], 'blank'),
      slots: [
        { nodeId: 'tell', options: CYCLE_PARTS, expected: 'TELL: percept' },
        { nodeId: 'ask', options: CYCLE_PARTS, expected: 'ASK: which action?' },
        { nodeId: 'act', options: CYCLE_PARTS, expected: 'Perform the action' },
        { nodeId: 'record', options: CYCLE_PARTS, expected: 'TELL: action taken' },
      ],
      answer: {
        shortStatus: 'slide-based',
        short: [{ type: 'p', text: 'Perceive and TELL, ASK for an action, perform it, then TELL the KB what was done.' }],
        figure: agentCycle(CYCLE_PARTS),
      },
    },
    {
      id: 'p07-10',
      kind: 'table',
      topic: 'Architecture levels',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Which level of a knowledge-based agent does each statement describe?',
      sourceReference: { section: 'Architecture of a knowledge-based agent', pages: [7] },
      columns: ['Statement', 'Level'],
      rows: [
        [given('A delivery robot knows that Gate 3 opens onto the loading bay'), { accepted: ['Knowledge'], options: LEVELS }],
        [given('Opens(Gate3, LoadingBay)'), { accepted: ['Logical'], options: LEVELS }],
        [given('The fact is stored as a record in the robot\'s memory'), { accepted: ['Implementation'], options: LEVELS }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Knowledge: what the agent knows. Logical: how that is encoded as sentences. Implementation: how the sentences are physically represented.' }],
      },
    },
    {
      id: 'p07-11',
      kind: 'table',
      topic: 'Entailment and models',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Let KB = (P ∨ Q) ∧ ¬P and α = Q. Complete the truth table, then decide whether KB ⊨ α.',
      sourceReference: { section: 'Exercise: Check entailment with truth table', pages: [36, 44, 45] },
      columns: ['P', 'Q', 'P ∨ Q', '¬P', 'KB', 'α = Q'],
      rows: [
        [given('T'), given('T'), tf('T'), tf('F'), tf('F'), given('T')],
        [given('T'), given('F'), tf('T'), tf('F'), tf('F'), given('F')],
        [given('F'), given('T'), tf('T'), tf('T'), tf('T'), given('T')],
        [given('F'), given('F'), tf('F'), tf('T'), tf('F'), given('F')],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'KB ⊨ Q. KB is true only in row 3 (P = F, Q = T), and Q is true there.' }],
        detailed: [{ type: 'p', text: 'To test entailment, look only at the rows where KB is true and check α in each. Rows where KB is false do not matter, which is why Q being false in rows 2 and 4 does not break entailment.' }],
      },
    },
    {
      id: 'p07-12',
      kind: 'table',
      topic: 'Entailment and models',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Classify each sentence.',
      sourceReference: { section: 'Models (2) / Truth tables for connectives', pages: [39, 44] },
      columns: ['Sentence', 'Classification'],
      rows: [
        [given('P ∨ ¬P'), { accepted: ['Valid'], options: STATUS }],
        [given('P ∧ ¬P'), { accepted: ['Unsatisfiable'], options: STATUS }],
        [given('P ⇒ Q'), { accepted: ['Satisfiable, not valid'], options: STATUS }],
        [given('(P ∧ Q) ⇒ P'), { accepted: ['Valid'], options: STATUS }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'P ⇒ Q is false only when P is true and Q is false. (P ∧ Q) ⇒ P can never have a true premise with a false conclusion.' }],
      },
    },
    {
      id: 'p07-13',
      kind: 'logic',
      topic: 'Propositional logic',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'Write as a propositional sentence: "Swimming at the beach is not allowed, and either swimming at the beach is allowed or sharks have not been spotted." Use S = swimming is allowed and K = sharks have been spotted.',
      sourceReference: { section: 'Exercise: propositional sentence', pages: [46] },
      accepted: ['¬S ∧ (S ∨ ¬K)'],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '¬S ∧ (S ∨ ¬K)' }],
        detailed: [{ type: 'p', text: 'The slide poses this exercise without a solution, so this answer is derived from the sentence itself. The "and" joins two clauses and the "either … or" stays in brackets. The sentence forces S false, and so K false too.' }],
      },
    },
    {
      id: 'p07-14',
      kind: 'logic',
      topic: 'Equivalences',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'Using De Morgan\'s law, rewrite ¬(P ∧ Q) without negating a bracket.',
      sourceReference: { section: 'Propositional logic: equivalences', pages: [47] },
      accepted: ['¬P ∨ ¬Q'],
      answer: {
        shortStatus: 'slide-based',
        detailedStatus: 'slide-based',
        short: [{ type: 'formula', text: '¬P ∨ ¬Q' }],
        detailed: [{ type: 'p', text: 'De Morgan moves the negation inside and swaps the connective: ∧ becomes ∨, and ∨ becomes ∧.' }],
      },
    },
    {
      id: 'p07-15',
      kind: 'logic',
      topic: 'Equivalences',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'Using implication elimination, rewrite P ⇒ Q with only ¬ and ∨.',
      sourceReference: { section: 'Propositional logic: equivalences', pages: [47] },
      accepted: ['¬P ∨ Q', 'Q ∨ ¬P'],
      answer: {
        shortStatus: 'slide-based',
        short: [{ type: 'formula', text: '¬P ∨ Q' }],
      },
    },
    {
      id: 'p07-16',
      kind: 'complete',
      topic: 'Wumpus world',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'The agent has visited [1,1], [2,1] and [1,2] and sensed the percepts shown. Each cell\'s first number is the column and the second is the row. Work out what is in each marked room.',
      sourceReference: { section: 'Exploring the Wumpus World', pages: [23, 25, 27, 28] },
      figure: wumpusGrid({ r13: 'A [1,3]', r22: 'B [2,2]', r31: 'C [3,1]' }, 'blank'),
      slots: [
        { nodeId: 'r13', options: ROOM_OPTIONS, expected: 'Wumpus' },
        { nodeId: 'r22', options: ROOM_OPTIONS, expected: 'Safe' },
        { nodeId: 'r31', options: ROOM_OPTIONS, expected: 'Pit' },
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [
          {
            type: 'ul',
            items: [
              '[3,1] is a pit: the breeze in [2,1] needs a pit in [2,2] or [3,1], and no breeze in [1,2] rules out [2,2].',
              '[1,3] holds the Wumpus: the stench in [1,2] needs it in [2,2] or [1,3], and no stench in [2,1] rules out [2,2].',
              '[2,2] is therefore safe.',
            ],
          },
        ],
        figure: wumpusGrid({ r13: '[1,3] Wumpus', r22: '[2,2] Safe', r31: '[3,1] Pit' }),
        detailed: [{ type: 'p', text: 'Each conclusion combines percepts from different rooms, including the lack of a percept. This is logical reasoning: if the percepts are correct, the conclusions are guaranteed to be correct.' }],
      },
    },
    {
      id: 'p07-17',
      kind: 'construct',
      topic: 'Semantic networks',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Build a semantic network for: "Rex is a sheepdog. A sheepdog is a dog. A dog is a mammal. Mammals have fur. Rex is owned by Sara."',
      sourceReference: { section: 'Semantic networks / Exercise', pages: [49, 52, 54, 56, 57] },
      directed: true,
      nodeLabels: ['Rex', 'Sheepdog', 'Dog', 'Mammal', 'Fur', 'Sara'],
      edgeLabels: ['is_a', 'has', 'owned_by'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'A chain of is_a links from Rex up to Mammal, with has(Mammal, Fur) and owned_by(Rex, Sara). Following the chain lets Rex inherit "has fur".' }],
        figure: SEMANTIC_NET,
      },
    },
    {
      id: 'p07-18',
      kind: 'table',
      topic: 'Frames',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'Use these frames to fill in the values. An asterisk marks a typical value, which a subclass or instance can override.',
      context: [
        {
          type: 'table',
          table: {
            columns: ['Frame', 'Slots'],
            rows: [
              ['Staff', 'Breaks = yes, WeeklyHours = *40'],
              ['Intern (IsA Staff)', 'WeeklyHours = *20, Mentor = required'],
              ['Lina (instance of Intern)', 'WeeklyHours = 15'],
              ['Sami (instance of Intern)', 'no slots of its own'],
            ],
          },
        },
      ],
      sourceReference: { section: 'Frames: typical values / inheritance example', pages: [59, 60, 61, 62] },
      columns: ['Query', 'Value'],
      rows: [
        [given('WeeklyHours of Lina'), { accepted: ['15'] }],
        [given('WeeklyHours of Sami'), { accepted: ['20'] }],
        [given('Breaks of Sami'), { accepted: ['yes'] }],
        [given('Mentor of Lina'), { accepted: ['required'] }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Use the most specific value available. Lina overrides with 15, Sami inherits 20 from Intern, and Breaks comes down from Staff.' }],
      },
    },
    {
      id: 'p07-19',
      kind: 'sequence',
      topic: 'Production rules',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Known facts: the headlights are dim and the engine is cold. Give the order in which these rules fire through the match–resolve–act cycle.',
      context: [
        {
          type: 'ul',
          items: [
            'R1: IF the starter fails THEN call a mechanic.',
            'R2: IF the battery is weak AND the engine is cold THEN the starter fails.',
            'R3: IF the headlights are dim THEN the battery is weak.',
          ],
        },
      ],
      sourceReference: { section: 'Production rules', pages: [65, 66] },
      tokens: ['R1', 'R2', 'R3'],
      expected: ['R3', 'R2', 'R1'],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'formula', text: 'R3 → R2 → R1' }],
        steps: {
          columns: ['Cycle', 'Match', 'Act', 'New fact'],
          rows: [
            ['1', 'R3', 'Fire R3', 'Battery is weak'],
            ['2', 'R2', 'Fire R2', 'Starter fails'],
            ['3', 'R1', 'Fire R1', 'Call a mechanic'],
          ],
        },
        detailed: [{ type: 'p', text: 'Only one new rule matches in each cycle, so no conflict resolution is needed here. If several rules matched, the resolve step would choose one from the conflict set.' }],
      },
    },
    {
      id: 'p07-20',
      kind: 'draw',
      topic: 'Frames',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Draw frames for this hierarchy: Vehicle has Wheels and Owner slots. Bicycle is a Vehicle with Wheels = 2. "Maya\'s bike" is an instance of Bicycle with Owner = Maya. Show the links between the frames.',
      sourceReference: { section: 'Frames: vehicle example', pages: [59, 62, 63] },
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Three boxes, each listing its slots, linked upward: Maya\'s bike → Bicycle → Vehicle. Wheels = 2 is inherited by Maya\'s bike.' }],
        figure: {
          directed: true,
          width: 320,
          height: 270,
          nodes: [
            { id: 'v', label: 'Vehicle: Wheels, Owner', x: 160, y: 35, shape: 'box', w: 190, h: 46 },
            { id: 'b', label: 'Bicycle: Wheels = 2', x: 160, y: 135, shape: 'box', w: 190, h: 46 },
            { id: 'm', label: "Maya's bike: Owner = Maya", x: 160, y: 235, shape: 'box', w: 190, h: 46 },
          ],
          edges: [
            { from: 'm', to: 'b', label: 'instance of' },
            { from: 'b', to: 'v', label: 'is a' },
          ],
        },
      },
    },
  ],
});
