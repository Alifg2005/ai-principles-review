import { definePracticeSet, type Graph } from '../../lib/practiceSchema';

const part = (id: string, label: string, x: number, y: number, w = 150, h = 40, tone?: 'blank') => ({
  id,
  label,
  x,
  y,
  shape: 'box' as const,
  w,
  h,
  ...(tone ? { tone } : {}),
});
const environment = (x: number, height: number) => ({
  id: 'env',
  label: 'Environment',
  x,
  y: height / 2,
  shape: 'box' as const,
  w: 92,
  h: height - 20,
  tone: 'env' as const,
});

const MODEL_PARTS = ['State', 'How the world evolves', 'What my actions do', 'Condition–action rules'];
const LEARNING_PARTS = ['Critic', 'Learning element', 'Performance element', 'Problem generator'];

function modelBased(labels: string[], tone?: 'blank'): Graph {
  return {
    directed: true,
    width: 560,
    height: 350,
    nodes: [
      environment(505, 350),
      part('sensors', 'Sensors', 290, 28, 110, 34),
      part('now', 'What is the world like now?', 290, 110, 150, 46),
      part('state', labels[0]!, 85, 50, 140, 36, tone),
      part('evolves', labels[1]!, 85, 110, 140, 40, tone),
      part('actions', labels[2]!, 85, 170, 140, 40, tone),
      part('rules', labels[3]!, 85, 250, 140, 42, tone),
      part('decide', 'What action should I do now?', 290, 250, 150, 46),
      part('effectors', 'Effectors', 290, 322, 110, 34),
    ],
    edges: [
      { from: 'env', to: 'sensors', label: 'percepts' },
      { from: 'sensors', to: 'now' },
      { from: 'state', to: 'now' },
      { from: 'evolves', to: 'now' },
      { from: 'actions', to: 'now' },
      { from: 'now', to: 'decide' },
      { from: 'rules', to: 'decide' },
      { from: 'decide', to: 'effectors' },
      { from: 'effectors', to: 'env', label: 'actions' },
    ],
  };
}

function learningAgent(labels: string[], tone?: 'blank'): Graph {
  return {
    directed: true,
    width: 560,
    height: 340,
    nodes: [
      environment(505, 340),
      part('sensors', 'Sensors', 335, 40, 100, 34),
      part('critic', labels[0]!, 110, 40, 150, 40, tone),
      part('learn', labels[1]!, 110, 150, 150, 40, tone),
      part('perf', labels[2]!, 335, 150, 130, 46, tone),
      part('gen', labels[3]!, 110, 270, 150, 40, tone),
      part('effectors', 'Effectors', 335, 300, 100, 34),
    ],
    edges: [
      { from: 'env', to: 'sensors', label: 'percepts' },
      { from: 'sensors', to: 'critic' },
      { from: 'critic', to: 'learn', label: 'feedback' },
      { from: 'learn', to: 'perf', label: 'changes' },
      { from: 'learn', to: 'gen', label: 'learning goals' },
      { from: 'gen', to: 'perf', label: 'experiments' },
      { from: 'perf', to: 'effectors' },
      { from: 'effectors', to: 'env', label: 'actions' },
    ],
  };
}

const VACUUM = ['Suck', 'Right', 'Left', 'Do nothing'];
const TYPES = ['Simple reflex', 'Model-based reflex', 'Goal-based', 'Utility-based', 'Learning'];

export default definePracticeSet({
  chapterId: 'intelligent-agents',
  questions: [
    {
      id: 'p02-01',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Agents',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'Define an intelligent agent, and give one human and one robotic example of sensors and actuators.',
      sourceReference: { section: 'What is an intelligent agent?', pages: [5, 6] },
      answer: {
        shortStatus: 'slide-based',
        short: [
          { type: 'p', text: 'An autonomous entity that perceives its environment through sensors and acts on it through actuators to achieve goals. It may learn from the environment.' },
          {
            type: 'ul',
            items: ['Human: eyes and ears (sensors); hands and legs (actuators).', 'Robot: cameras (sensors); motors (actuators).'],
          },
        ],
      },
    },
    {
      id: 'p02-02',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Percepts',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'Distinguish a percept from a percept sequence.',
      sourceReference: { section: 'What is Percept? / Percept sequence', pages: [8, 9] },
      answer: {
        shortStatus: 'slide-based',
        detailedStatus: 'original-worked-example',
        short: [
          {
            type: 'ul',
            items: ['Percept: the input an agent receives at one moment.', 'Percept sequence: the complete history of everything the agent has perceived.'],
          },
        ],
        detailed: [{ type: 'p', text: 'A parking sensor reading "1 metre clear" is a percept. All its readings since the car started form the percept sequence, which is what the agent function maps to an action.' }],
      },
    },
    {
      id: 'p02-03',
      kind: 'written',
      answerStyle: 'list',
      topic: 'Rationality',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'What is a rational agent, and which four factors determine rationality?',
      sourceReference: { section: 'Rational agent', pages: [15, 16] },
      answer: {
        shortStatus: 'slide-based',
        detailedStatus: 'additional-clarification',
        short: [
          { type: 'p', text: 'An agent that chooses the action expected to maximise its performance measure, given its evidence and built-in knowledge. Rationality depends on:' },
          {
            type: 'ul',
            items: ['The performance measure of success', 'Prior knowledge of the environment', 'The actions it can perform', 'The percept sequence to date'],
          },
        ],
        detailed: [{ type: 'p', text: 'Rational does not mean all-knowing: the action must be the best expected choice on the evidence available, even if the actual outcome turns out badly.' }],
      },
    },
    {
      id: 'p02-04',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Agent types',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'How does a model-based reflex agent differ from a simple reflex agent?',
      sourceReference: { section: 'Simple reflex agents / Model-based reflex agents', pages: [23, 26, 27] },
      answer: {
        shortStatus: 'slide-based',
        detailedStatus: 'slide-based',
        short: [
          {
            type: 'ul',
            items: [
              'Simple reflex: condition–action rules on the current percept only. No memory.',
              'Model-based: also keeps an internal state, updated over time, so it can handle what it cannot currently see.',
            ],
          },
        ],
        detailed: [
          { type: 'p', text: 'Updating the state needs two kinds of knowledge: how the world evolves independently of the agent, and how the agent\'s own actions affect the world.' },
        ],
      },
    },
    {
      id: 'p02-05',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Agent types',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'Why are goals sometimes not enough? Explain the difference between goal-based and utility-based agents.',
      sourceReference: { section: 'Goal-based agents / Utility-based agent', pages: [30, 33] },
      answer: {
        shortStatus: 'slide-based',
        short: [
          {
            type: 'ul',
            items: [
              'Goal-based: searches and plans for actions that reach the goal. Success is yes or no.',
              'Utility-based: a utility function scores outcomes, giving the degree of success.',
              'Many action sequences can reach a goal; utility picks the best one, for example the fastest or safest.',
            ],
          },
        ],
      },
    },
    {
      id: 'p02-06',
      kind: 'written',
      answerStyle: 'list',
      topic: 'Learning agents',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'Name the four elements of a learning agent and state the role of each.',
      sourceReference: { section: 'Learning agent', pages: [38] },
      answer: {
        shortStatus: 'slide-based',
        short: [
          {
            type: 'ul',
            items: [
              'Learning element: improves the agent using feedback.',
              'Performance element: selects actions.',
              'Critic: tells the learning element how well the agent is doing.',
              'Problem generator: suggests actions that give new, informative experiences.',
            ],
          },
        ],
      },
    },
    {
      id: 'p02-07',
      kind: 'table',
      topic: 'PEAS',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Write a PEAS description for a smart irrigation controller that waters a farm field. Several answers are valid.',
      sourceReference: { section: 'PEAS', pages: [17, 18, 19, 20, 21] },
      columns: ['Element', 'Your answer'],
      rows: [
        [{ given: 'Performance measure' }, { accepted: ['Healthy crops, water saved'], selfCheck: true }],
        [{ given: 'Environment' }, { accepted: ['Field, soil, weather, crops'], selfCheck: true }],
        [{ given: 'Actuators' }, { accepted: ['Valves, pumps'], selfCheck: true }],
        [{ given: 'Sensors' }, { accepted: ['Soil moisture, rain and temperature sensors'], selfCheck: true }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [
          { type: 'p', text: 'One reasonable answer:' },
          {
            type: 'ul',
            items: [
              'P: healthy crops, water saved, low energy cost',
              'E: field, soil, weather, crops',
              'A: valves, pumps',
              'S: soil moisture, rain and temperature sensors',
            ],
          },
        ],
        detailed: [{ type: 'p', text: 'This is one reasonable answer, not the only one. It assumes a controller that opens valves from sensor readings. A system that also uses a weather feed would list it as a sensor input; one that buys water might add cost to its performance measure.' },
          { type: 'p', text: 'To check your own answer, ask: P measures success, E is what the agent is in, A is what it acts with, and S is what it senses with. An item is correct if it is in the right category for the system you assumed.' }],
      },
    },
    {
      id: 'p02-08',
      kind: 'table',
      topic: 'Vacuum-cleaner world',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'Trace the reflex vacuum agent: give the action for each [location, status] percept.',
      sourceReference: { section: 'Example: Vacuum-cleaner world', pages: [13, 14] },
      columns: ['Percept', 'Action'],
      rows: [
        [{ given: '[A, Dirty]' }, { accepted: ['Suck'], options: VACUUM }],
        [{ given: '[A, Clean]' }, { accepted: ['Right'], options: VACUUM }],
        [{ given: '[B, Dirty]' }, { accepted: ['Suck'], options: VACUUM }],
        [{ given: '[B, Clean]' }, { accepted: ['Left'], options: VACUUM }],
      ],
      answer: {
        shortStatus: 'slide-based',
        detailedStatus: 'slide-based',
        short: [{ type: 'p', text: 'If the square is dirty, suck. Otherwise move to the other square: right from A, left from B.' }],
        detailed: [{ type: 'p', text: 'The status test comes first, so location only matters when the square is clean. The agent uses only the current percept, which makes it a simple reflex agent.' }],
      },
    },
    {
      id: 'p02-09',
      kind: 'table',
      topic: 'Agent types',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'Classify each system by the feature its description emphasises. Assume only what is stated.',
      context: [
        {
          type: 'ul',
          items: [
            'Each system has only the capabilities described, and nothing more.',
            'Choose the type that the described capability points to: current percept only, an internal model, planning towards a goal, scoring outcomes, or improving from experience.',
            'Real systems often combine types, so this is a self-review exercise and your choices are not marked.',
          ],
        },
      ],
      sourceReference: { section: 'Types of AI Agents', pages: [22, 23, 26, 30, 33, 36] },
      columns: ['System', 'Agent type'],
      rows: [
        [{ given: 'An automatic door opens whenever its motion sensor fires' }, { accepted: ['Simple reflex'], options: TYPES, selfCheck: true }],
        [{ given: 'A lawn mower keeps a map of mown strips and reacts by rules, with no route planning' }, { accepted: ['Model-based reflex'], options: TYPES, selfCheck: true }],
        [{ given: 'A warehouse robot plans a path to a target shelf' }, { accepted: ['Goal-based'], options: TYPES, selfCheck: true }],
        [{ given: 'A booking assistant scores flights on price, duration and stops' }, { accepted: ['Utility-based'], options: TYPES, selfCheck: true }],
        [{ given: 'A music app improves its suggestions from listening feedback' }, { accepted: ['Learning'], options: TYPES, selfCheck: true }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Model classification under the stated assumptions is in the table below. To decide, ask in order: memory? planning towards a goal? scoring outcomes? improving from experience?' }],
        steps: {
          columns: ['System', 'Type', 'Deciding feature'],
          rows: [
            ['Door', 'Simple reflex', 'Current percept only'],
            ['Mower', 'Model-based reflex', 'Internal map, no planning'],
            ['Warehouse robot', 'Goal-based', 'Plans towards a goal'],
            ['Booking assistant', 'Utility-based', 'Scores competing outcomes'],
            ['Music app', 'Learning', 'Improves from feedback'],
          ],
        },
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'p', text: "The model classification follows the stated descriptions. Real systems often combine types: slide 22 notes that any type can become a learning agent, a music app may also score songs by utility, and a warehouse robot that compares paths by time would be utility-based. Given different assumptions, a different label can be equally defensible." }],
          },
        ],
      },
    },
    {
      id: 'p02-10',
      kind: 'complete',
      topic: 'Agent architecture',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'Complete the block diagram of a model-based reflex agent.',
      sourceReference: { section: 'Model-based reflex agents', pages: [28] },
      figure: modelBased(['1', '2', '3', '4'], 'blank'),
      slots: [
        { nodeId: 'state', options: MODEL_PARTS, expected: 'State' },
        { nodeId: 'evolves', options: MODEL_PARTS, expected: 'How the world evolves' },
        { nodeId: 'actions', options: MODEL_PARTS, expected: 'What my actions do' },
        { nodeId: 'rules', options: MODEL_PARTS, expected: 'Condition–action rules' },
      ],
      answer: {
        shortStatus: 'slide-based',
        short: [{ type: 'p', text: 'State and the two world-knowledge boxes feed "What is the world like now?". The rules then turn that picture into an action.' }],
        figure: modelBased(MODEL_PARTS),
      },
    },
    {
      id: 'p02-11',
      kind: 'complete',
      topic: 'Learning agents',
      difficulty: 'intermediate',
      questionStatus: 'slide-based',
      prompt: 'Complete the block diagram of a learning agent.',
      sourceReference: { section: 'Learning agent', pages: [37, 38] },
      figure: learningAgent(['1', '2', '3', '4'], 'blank'),
      slots: [
        { nodeId: 'critic', options: LEARNING_PARTS, expected: 'Critic' },
        { nodeId: 'learn', options: LEARNING_PARTS, expected: 'Learning element' },
        { nodeId: 'perf', options: LEARNING_PARTS, expected: 'Performance element' },
        { nodeId: 'gen', options: LEARNING_PARTS, expected: 'Problem generator' },
      ],
      answer: {
        shortStatus: 'slide-based',
        short: [{ type: 'p', text: 'The critic judges results, the learning element changes the performance element, and the problem generator proposes experiments.' }],
        figure: learningAgent(LEARNING_PARTS),
      },
    },
    {
      id: 'p02-12',
      kind: 'draw',
      topic: 'Agent architecture',
      difficulty: 'foundational',
      questionStatus: 'slide-based',
      prompt: 'Draw the block diagram of a simple reflex agent, including the environment.',
      sourceReference: { section: 'Simple reflex agents', pages: [24] },
      answer: {
        shortStatus: 'slide-based',
        short: [{ type: 'p', text: 'Sensors report the current state, condition–action rules choose the action, and effectors carry it out. No state or memory box appears.' }],
        figure: {
          directed: true,
          width: 500,
          height: 280,
          nodes: [
            environment(445, 280),
            part('sensors', 'Sensors', 230, 28, 110, 34),
            part('now', 'What is the world like now?', 230, 105, 150, 46),
            part('rules', 'Condition–action rules', 70, 185, 120, 46),
            part('decide', 'What action should I do now?', 230, 185, 150, 46),
            part('effectors', 'Effectors', 230, 255, 110, 34),
          ],
          edges: [
            { from: 'env', to: 'sensors', label: 'percepts' },
            { from: 'sensors', to: 'now' },
            { from: 'now', to: 'decide' },
            { from: 'rules', to: 'decide' },
            { from: 'decide', to: 'effectors' },
            { from: 'effectors', to: 'env', label: 'actions' },
          ],
        },
      },
    },
  ],
});
