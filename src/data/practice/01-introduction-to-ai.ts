import { definePracticeSet, type Graph } from '../../lib/practiceSchema';

const box = (id: string, label: string, x: number, y: number, tone?: 'blank' | 'env') => ({
  id,
  label,
  x,
  y,
  shape: 'box' as const,
  w: 160,
  h: 54,
  ...(tone ? { tone } : {}),
});

/** The four approaches as a 2×2 grid. */
function fourSchools(a: string, b: string, c: string, d: string, tone?: 'blank'): Graph {
  return {
    directed: false,
    width: 440,
    height: 190,
    nodes: [
      { id: 'hdr1', label: 'Human-based', x: 170, y: 18, shape: 'box', w: 130, h: 28, tone: 'env' },
      { id: 'hdr2', label: 'Ideal rationality', x: 340, y: 18, shape: 'box', w: 130, h: 28, tone: 'env' },
      { id: 'row1', label: 'Reasoning', x: 42, y: 75, shape: 'box', w: 76, h: 54, tone: 'env' },
      { id: 'row2', label: 'Behaviour', x: 42, y: 150, shape: 'box', w: 76, h: 54, tone: 'env' },
      box('a', a, 170, 75, tone),
      box('b', b, 340, 75, tone),
      box('c', c, 170, 150, tone),
      box('d', d, 340, 150, tone),
    ],
    edges: [],
  };
}

const APPROACHES = ['Thinking humanly', 'Thinking rationally', 'Acting humanly', 'Acting rationally'];
const FIELDS = ['Philosophy', 'Mathematics', 'Economics', 'Neuroscience', 'Psychology', 'Control theory', 'Linguistics'];
const choose = (answer: string) => ({ accepted: [answer], options: FIELDS });

export default definePracticeSet({
  chapterId: 'introduction-to-ai',
  questions: [
    {
      id: 'p01-01',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Intelligence',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Define intelligence, and list the four things it involves regarding an environment.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          { type: 'p', text: 'Intelligence is the ability to understand and learn, rather than act by instinct or automatically. It involves:' },
          {
            type: 'ul',
            items: [
              'Learning about the environment',
              'Learning from the environment',
              'Understanding the environment',
              'Interacting with the environment',
            ],
          },
        ],
        detailed: [
          { type: 'p', text: 'Seven characteristics of intelligence: communication, creativity, internal knowledge, ability to learn, perceiving world knowledge, goal-directed behaviour and self-awareness.' },
        ],
        more: [
          {
            status: 'original-worked-example',
            blocks: [{ type: 'p', text: "A new cashier shows all four: they learn what the till does (about), correct a mistake after a wrong refund (from), grasp why the rules exist (understand), and then serve customers smoothly (interact)." }],
          },
        ],
      },
    },
    {
      id: 'p01-02',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Defining AI',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Give two accepted definitions of Artificial Intelligence, and state who coined the term.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'The study and design of intelligent agents: systems that perceive their environment and act to maximise their chances of success.',
              'The science and engineering of making intelligent machines, especially intelligent computer programs (John McCarthy).',
              'John McCarthy coined the term in 1956.',
            ],
          },
        ],
        detailed: [
          { type: 'p', text: 'Other definitions stress different ideas. Rich focuses on tasks people currently do better. Tanimoto focuses on tasks that appear to need intelligence when humans do them.' },
        ],
      },
    },
    {
      id: 'p01-03',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Goals of AI',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Distinguish the scientific goal of AI from its engineering goal.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Scientific goal: understand the principles that make intelligent behaviour possible in natural or artificial systems.',
              'Engineering goal: work out which computational mechanisms model intelligent behaviour, and design useful intelligent artefacts.',
            ],
          },
        ],
        detailed: [
          { type: 'p', text: 'In short: science asks why intelligence works, by analysing agents and testing hypotheses. Engineering asks how to build it so that it is useful.' },
        ],
      },
    },
    {
      id: 'p01-04',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Turing test',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Describe the Turing test and state when a machine passes it.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          { type: 'p', text: 'A human interrogator exchanges written questions with a hidden computer and a hidden person. The machine passes if the interrogator cannot tell which responses came from the machine.' },
        ],
        detailed: [
          { type: 'p', text: 'Alan Turing proposed it in 1950 as an operational test: it replaces "Can machines think?" with "Can machines behave intelligently?". Because it measures only behaviour, it belongs to the acting-humanly approach.' },
        ],
      },
    },
    {
      id: 'p01-05',
      kind: 'written',
      answerStyle: 'list',
      topic: 'Turing test',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'List the capabilities needed to pass the Turing test, and the two extra capabilities the Total Turing Test requires.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          { type: 'p', text: 'Turing test:' },
          {
            type: 'ul',
            items: [
              'Natural language processing: communicate',
              'Knowledge representation: store information',
              'Automated reasoning: answer and draw conclusions',
              'Machine learning: adapt and find patterns',
            ],
          },
          { type: 'p', text: 'Total Turing Test adds:' },
          { type: 'ul', items: ['Computer vision: perceive objects', 'Robotics: move and act on objects'] },
        ],
      },
    },
    {
      id: 'p01-06',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Agents',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Distinguish between the agent function and the agent program.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Agent function: abstract mathematical mapping from percept histories to actions, f : P* → A.',
              'Agent program: concrete implementation of that function, running on the agent architecture.',
            ],
          },
        ],
        detailed: [
          { type: 'p', text: 'P* is the set of all possible percept sequences and A the set of possible actions. The function is a description of behaviour; the program is the code that produces it, using only what the architecture provides.' },
        ],
      },
    },
    {
      id: 'p01-07',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Four approaches',
      difficulty: 'advanced',
      questionStatus: 'course-concept',
      prompt: 'State the main idea and one limitation of the thinking-humanly and thinking-rationally approaches.',
      mixUp: "Check that the conclusion is about the subject in the premises: from 'Socrates is a man' and 'All men are mortal', the valid conclusion is 'Socrates is mortal'.",
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'table',
            table: {
              columns: ['Approach', 'Idea', 'Limitation'],
              rows: [
                ['Thinking humanly', 'Model how humans think (cognitive science)', 'Reverse-engineering the mind is very hard; the brain differs from a program'],
                ['Thinking rationally', 'Correct conclusions from correct premises, using logic', 'Informal or uncertain knowledge is hard to formalise; computation is costly'],
              ],
            },
          },
        ],
        detailed: [
          { type: 'p', text: 'The course adopts the remaining rational view, acting rationally: an agent does what is expected to maximise goal achievement given the information available.' },
        ],
      },
    },
    {
      id: 'p01-08',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Stages of AI',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Compare the three stages of AI: ANI, AGI and ASI.',
      mixUp: "ANI stands for Artificial Narrow Intelligence. AGI is the separate, later stage.",
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'ANI (narrow, weak): performs a narrow set of specific tasks. Almost all systems built so far.',
              'AGI (general, strong): thinks and decides like a human. No existing examples.',
              'ASI (super): capability surpasses humans. Currently hypothetical.',
            ],
          },
        ],
      },
    },
    {
      id: 'p01-09',
      kind: 'complete',
      topic: 'Four approaches',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Complete the grid of the four approaches to AI.',
      figure: fourSchools('1', '2', '3', '4', 'blank'),
      slots: [
        { nodeId: 'a', options: APPROACHES, expected: 'Thinking humanly' },
        { nodeId: 'b', options: APPROACHES, expected: 'Thinking rationally' },
        { nodeId: 'c', options: APPROACHES, expected: 'Acting humanly' },
        { nodeId: 'd', options: APPROACHES, expected: 'Acting rationally' },
      ],
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'Rows separate thought from behaviour. Columns separate human performance from an ideal standard of rationality.' }],
        figure: fourSchools('Thinking humanly', 'Thinking rationally', 'Acting humanly', 'Acting rationally'),
      },
    },
    {
      id: 'p01-10',
      kind: 'table',
      topic: 'Foundations of AI',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Match each contribution to the field that AI draws it from.',
      columns: ['Contribution', 'Field'],
      rows: [
        [{ given: 'Logic, methods of reasoning, the mind as a physical system' }, choose('Philosophy')],
        [{ given: 'Formal proof, computation, tractability, probability' }, choose('Mathematics')],
        [{ given: 'Utility and decision theory' }, choose('Economics')],
        [{ given: 'The physical substrate of mental activity' }, choose('Neuroscience')],
        [{ given: 'Perception, motor control, experimental techniques' }, choose('Psychology')],
        [{ given: 'Systems that maximise an objective function over time' }, choose('Control theory')],
        [{ given: 'Grammar, and how language relates to thought' }, choose('Linguistics')],
      ],
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'Computer engineering, the eighth field, supplies the fast hardware.' }],
        steps: {
          columns: ['Field', 'Contribution to AI'],
          rows: [
            ['Philosophy', 'Logic, reasoning, mind as a physical system'],
            ['Mathematics', 'Proof, computation, tractability, probability'],
            ['Economics', 'Utility, decision theory'],
            ['Neuroscience', 'Physical substrate of mental activity'],
            ['Psychology', 'Perception, motor control, experiments'],
            ['Control theory', 'Maximising an objective over time'],
            ['Linguistics', 'Grammar, language and thought'],
          ],
        },
      },
    },
    {
      id: 'p01-11',
      kind: 'sequence',
      topic: 'History of AI',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Place these milestones in chronological order, earliest first.',
      tokens: ['Deep Blue beats Kasparov', 'ELIZA chatbot', 'Artificial neuron model', "Watson wins Jeopardy", 'Dartmouth Conference', 'Expert systems boom', "Turing's test proposed"],
      expected: ['Artificial neuron model', "Turing's test proposed", 'Dartmouth Conference', 'ELIZA chatbot', 'Expert systems boom', 'Deep Blue beats Kasparov', 'Watson wins Jeopardy'],
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'Neuron model, Turing test, Dartmouth, ELIZA, expert systems, Deep Blue, Watson.' }],
        steps: {
          columns: ['Year', 'Milestone'],
          rows: [
            ['1943', 'McCulloch and Pitts: artificial neuron model'],
            ['1950', 'Turing: "Computing Machinery and Intelligence"'],
            ['1956', 'Dartmouth Conference: the term AI adopted'],
            ['1966', 'Weizenbaum: ELIZA'],
            ['1980', 'Expert systems boom, after the first AI winter'],
            ['1997', 'IBM Deep Blue beats Kasparov'],
            ['2011', 'IBM Watson wins Jeopardy'],
          ],
        },
      },
    },
    {
      id: 'p01-12',
      kind: 'draw',
      topic: 'Agents',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Sketch how an agent interacts with its environment. Label the sensors, actuators, percepts and actions.',
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'A closed loop: the environment produces percepts through sensors, the agent decides, and its actuators act back on the environment.' }],
        figure: {
          directed: true,
          width: 470,
          height: 240,
          nodes: [
            { id: 'env', label: 'Environment', x: 80, y: 120, shape: 'box', w: 120, h: 170, tone: 'env' },
            { id: 'sen', label: 'Sensors', x: 350, y: 45, shape: 'box', w: 150, h: 42 },
            { id: 'pro', label: 'Agent program (decides)', x: 350, y: 120, shape: 'box', w: 150, h: 46 },
            { id: 'act', label: 'Actuators', x: 350, y: 195, shape: 'box', w: 150, h: 42 },
          ],
          edges: [
            { from: 'env', to: 'sen', label: 'percepts' },
            { from: 'sen', to: 'pro' },
            { from: 'pro', to: 'act' },
            { from: 'act', to: 'env', label: 'actions' },
          ],
        },
      },
    },
  ],
});
