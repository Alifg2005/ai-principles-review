import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'intelligent-agents',
  number: 2,
  title: 'Intelligent Agents',
  description:
    'Agents and environments, percepts, rationality, PEAS task descriptions, and the progression from simple reflex agents to goal-based, utility-based and learning agents.',
  source: {
    fileName: 'Topic 2 Intelligent agents-Updated.pdf',
    label: 'Topic 2',
    pageCount: 40,
  },
  questions: [
    {
      id: 'ch02-q01',
      question: 'Which description best defines an agent in this topic?',
      options: [
        'A program that only stores and retrieves data on request',
        'A device that collects data but never acts on it',
        'Anything that perceives its environment through sensors and acts upon it through actuators',
        'A system that needs a human to approve every action',
      ],
      correctAnswerIndex: 2,
      explanation: 'An agent perceives its environment through sensors and acts on that environment through actuators.',
      difficulty: 'foundational',
      sourceReference: { section: 'What is an intelligent agent?', pages: [5] },
    },
    {
      id: 'ch02-q02',
      question:
        'A smart doorbell registers "motion detected at the front step" at 8:02 pm. In agent terminology, this single reading is best described as…',
      options: ['a percept', 'a percept sequence', 'an actuator', 'a performance measure'],
      correctAnswerIndex: 0,
      explanation:
        'A percept is the input an agent receives from its sensors at one moment. The percept sequence would be the full history of such readings.',
      difficulty: 'foundational',
      sourceReference: { section: 'What is Percept?', pages: [8, 9] },
    },
    {
      id: 'ch02-q03',
      question: 'Which of the following is NOT one of the four rules for designing an AI agent presented in the lecture?',
      options: [
        'The agent must be able to perceive its environment',
        'Observations must be used to make decisions',
        'The action taken must be rational',
        'The agent must store its complete percept history in memory',
      ],
      correctAnswerIndex: 3,
      explanation:
        'The four rules are: perceive the environment, use observations to decide, let decisions result in actions, and make those actions rational. Storing the full percept history is not required; simple reflex agents keep no memory at all.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Rules for AI agent', pages: [11] },
    },
    {
      id: 'ch02-q04',
      question: 'In the reflex vacuum-cleaner agent program, what does the agent do when it is in square A and the square is clean?',
      options: ['Suck', 'Move right', 'Move left', 'Do nothing'],
      correctAnswerIndex: 1,
      explanation:
        'The program sucks if the square is dirty; otherwise it moves right from A and left from B.',
      difficulty: 'foundational',
      sourceReference: { section: 'Program implements the agent function for Vacuum-Agent', pages: [13, 14] },
    },
    {
      id: 'ch02-q05',
      question: "The rationality of an agent depends on four factors. Which list matches them?",
      options: [
        'Performance measure, prior knowledge of the environment, available actions, and percept sequence to date',
        'Processor speed, memory size, sensor resolution, and network latency',
        'Goals, emotions, beliefs, and intuitions',
        'Learning element, critic, performance element, and problem generator',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Rationality depends on the performance measure, prior knowledge, available actions and the percept sequence so far. The last option lists the components of a learning agent.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Rational Agent', pages: [16] },
    },
    {
      id: 'ch02-q06',
      question: 'What is the purpose of a PEAS description?',
      options: [
        'To rank agents by processing speed',
        'To list the learning algorithms an agent uses',
        'To specify the task environment for which a rational agent is designed',
        'To describe the internal data structures of an agent program',
      ],
      correctAnswerIndex: 2,
      explanation:
        'To design a rational agent you first specify its task environment through its Performance measure, Environment, Actuators and Sensors.',
      difficulty: 'foundational',
      sourceReference: { section: 'PEAS', pages: [17] },
    },
    {
      id: 'ch02-q07',
      question: "For an automated warehouse-sorting robot, which item belongs under Sensors in its PEAS description?",
      options: [
        'Number of parcels sorted correctly per hour',
        'Barcode scanner',
        'Conveyor belts and storage shelves',
        'Robotic gripper arm',
      ],
      correctAnswerIndex: 1,
      explanation:
        'A barcode scanner gathers input, so it is a sensor. Parcels per hour is a performance measure, conveyors and shelves are the environment, and the gripper is an actuator.',
      difficulty: 'intermediate',
      sourceReference: { section: 'PEAS examples', pages: [17, 18, 19, 20, 21] },
    },
    {
      id: 'ch02-q08',
      question: "In the lecture's PEAS description of a medical diagnosis system, which element is listed as an actuator?",
      options: [
        'Keyboard entry of symptoms and findings',
        'Patient, hospital and staff',
        'Healthy patient and minimised costs',
        'Screen display of questions, tests, diagnoses and treatments',
      ],
      correctAnswerIndex: 3,
      explanation:
        'The system acts by displaying questions, tests, diagnoses, treatments and referrals. The keyboard is its sensor, the patient and hospital are its environment, and patient health is its performance measure.',
      difficulty: 'intermediate',
      sourceReference: { section: 'PEAS Agent: Medical diagnosis system', pages: [20] },
    },
    {
      id: 'ch02-q09',
      question: 'What fundamentally limits a simple reflex agent?',
      options: [
        'It must search through action sequences before acting',
        'It relies on a utility function that is costly to compute',
        'It chooses actions from the current percept only, ignoring percept history',
        'It cannot use condition–action rules',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Simple reflex agents fire condition–action rules on the current percept alone. With no memory, they cannot respond properly to situations they were not prepared for.',
      difficulty: 'foundational',
      sourceReference: { section: 'Simple reflex agents', pages: [23] },
    },
    {
      id: 'ch02-q10',
      question:
        'A garden sprinkler switches on whenever its soil sensor reads "dry". It keeps no memory and does no planning. What type of agent is it?',
      options: ['Utility-based agent', 'Goal-based agent', 'Model-based reflex agent', 'Simple reflex agent'],
      correctAnswerIndex: 3,
      explanation:
        'A single if–then rule applied to the current percept, with no internal state or look-ahead, is a simple reflex agent.',
      difficulty: 'foundational',
      sourceReference: { section: 'Simple reflex agents', pages: [23, 25] },
    },
    {
      id: 'ch02-q11',
      question: 'A model-based reflex agent must encode two kinds of knowledge to update its internal state. What are they?',
      options: [
        "How the world evolves independently of the agent, and how the agent's own actions affect the world",
        'A utility function and a goal test',
        'A list of every possible percept and a list of every possible action',
        'The learning element and the critic',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Keeping the internal model current requires knowing how the world changes on its own and how the agent\'s actions change it.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Model-based reflex agents', pages: [27] },
    },
    {
      id: 'ch02-q12',
      question:
        'A delivery drone keeps an internal map of no-fly zones it has encountered, updates it as it flies, and reacts to obstacles using rules plus that map. It does not plan routes toward a destination. Which agent type fits best?',
      options: ['Simple reflex agent', 'Model-based reflex agent', 'Utility-based agent', 'Learning agent'],
      correctAnswerIndex: 1,
      explanation:
        'Combining the current percept with a stored, updated model of the world, but without goal-directed planning, is the defining feature of a model-based reflex agent.',
      difficulty: 'advanced',
      sourceReference: { section: 'Model-based reflex agents', pages: [26, 27] },
    },
    {
      id: 'ch02-q13',
      question: 'What capability do goal-based agents have that reflex agents lack?',
      options: [
        'They use sensors to perceive the environment',
        'They respond instantly using fixed condition–action rules',
        'They keep no memory of previous percepts',
        'They consider the consequences of possible actions ("what will happen if I do…?") through search and planning',
      ],
      correctAnswerIndex: 3,
      explanation:
        'Goal-based agents look ahead, evaluating action sequences against their goals before acting, while reflex agents simply respond to situations.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Goal-based agents', pages: [30, 31] },
    },
    {
      id: 'ch02-q14',
      question: 'Why are goals alone sometimes not enough, motivating utility-based agents?',
      options: [
        'Goals cannot be represented in an agent program',
        'Goal-based agents cannot perceive their environment',
        'Many action sequences may reach the goal, and a goal alone cannot rank them by how fast, safe or cheap they are',
        'Utility-based agents do not need a performance measure',
      ],
      correctAnswerIndex: 2,
      explanation:
        'A goal is binary: reached or not. When several routes reach it, a utility function is needed to prefer the better ones, for example faster or safer routes.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Utility-based agent', pages: [33] },
    },
    {
      id: 'ch02-q15',
      question: 'If reaching a goal indicates success, what does utility indicate?',
      options: [
        'The degree of success: how successful an outcome is',
        'Whether or not the goal has been reached',
        'The number of percepts processed so far',
        "The cost of the agent's sensors",
      ],
      correctAnswerIndex: 0,
      explanation: 'The lecture frames utility as the degree of "happiness" or success, not merely whether success occurred.',
      difficulty: 'foundational',
      sourceReference: { section: 'Utility-based agent', pages: [33] },
    },
    {
      id: 'ch02-q16',
      question:
        'A smart thermostat chooses among several heating schedules that all reach the target temperature, scoring each by energy cost and occupant comfort. Which agent type is this?',
      options: ['Simple reflex agent', 'Utility-based agent', 'Model-based reflex agent', 'Goal-based agent'],
      correctAnswerIndex: 1,
      explanation:
        'Every schedule meets the goal, so what decides between them is a score over several criteria. That is a utility-based agent.',
      difficulty: 'advanced',
      sourceReference: { section: 'Utility-based agent', pages: [33, 34] },
    },
    {
      id: 'ch02-q17',
      question: 'In a learning agent, which component suggests actions that will lead to new and informative experiences?',
      options: ['Performance element', 'Critic', 'Problem generator', 'Learning element'],
      correctAnswerIndex: 2,
      explanation: 'The problem generator proposes exploratory actions so the agent gains new, informative experiences.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Learning agent', pages: [38] },
    },
    {
      id: 'ch02-q18',
      question:
        'Which learning-agent component gives feedback on how well the agent is doing, so the learning element can modify the performance element?',
      options: ['Critic', 'Problem generator', 'Actuator', 'Percept sequence'],
      correctAnswerIndex: 0,
      explanation:
        'The learning element uses the critic\'s feedback to decide how the performance element should change to do better in future.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Learning agent', pages: [38] },
    },
    {
      id: 'ch02-q19',
      question: 'Which statement about learning agents is consistent with the lecture?',
      options: [
        'Learning is a separate agent type that cannot be combined with the other four',
        'Learning agents can only operate in environments they fully know in advance',
        'Learning agents discard their initial knowledge once they start learning',
        'Any of the four basic agent types can be turned into a learning agent',
      ],
      correctAnswerIndex: 3,
      explanation:
        'All four basic types can become learning agents. Learning adds new experience to the initial knowledge and helps the agent work in unfamiliar environments.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Types of AI Agents / Learning agent', pages: [22, 36] },
    },
    {
      id: 'ch02-q20',
      question: 'A rational agent should choose, for each percept sequence, the action that…',
      options: [
        'matches what a human would do in the same situation',
        'is expected to maximise its performance measure, given its percept evidence and built-in knowledge',
        'guarantees the best actual outcome regardless of what information is available',
        'requires the least computation',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Rationality is about expected performance given the evidence and the agent\'s built-in knowledge, not about perfect outcomes or imitating humans.',
      difficulty: 'foundational',
      sourceReference: { section: 'Rational agent', pages: [15, 16] },
    },
  ],
});
