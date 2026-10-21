import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'introduction-to-ai',
  number: 1,
  title: 'Introduction to Artificial Intelligence',
  description:
    'What intelligence is, competing definitions of AI, the four schools of thought, the Turing test, the foundations and history of the field, and the stages of AI.',
  source: {
    fileName: 'Week 1 Intro to AI.pdf',
    label: 'Week 1',
    pageCount: 65,
  },
  questions: [
    {
      id: 'ch01-q01',
      question: 'According to the lecture, how does the field of AI go beyond simply studying how humans think?',
      options: [
        'It focuses only on replicating human emotions in software',
        'It aims both to understand intelligence and to build intelligent entities',
        "It studies the brain's biology in order to treat neurological disease",
        'It is limited to writing faster algorithms for problems that are already solved',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The lecture contrasts human self-study with AI, which attempts not only to understand intelligence but also to build intelligent entities such as robot cleaners or self-driving cars.',
      difficulty: 'foundational',
      sourceReference: { section: 'Intelligence', pages: [5] },
    },
    {
      id: 'ch01-q02',
      question:
        'A new driver stalls a manual car, realises the clutch was released too quickly, and adjusts on the next attempt. Which aspect of intelligence does this illustrate?',
      options: [
        'Interacting with the environment',
        'Learning about the environment',
        'Perceiving world knowledge through the senses',
        'Learning from the environment',
      ],
      correctAnswerIndex: 3,
      explanation:
        'Using the outcome of a mistake to change future behaviour is "learning from" the environment, one of the components in the lecture\'s definition of intelligence.',
      difficulty: 'intermediate',
      sourceReference: { section: "What's involved in Intelligence?", pages: [6] },
    },
    {
      id: 'ch01-q03',
      question: 'Which set of capabilities does the lecture say an intelligent system should have?',
      options: [
        'Reasoning, learning, problem solving and perception',
        'Memorisation, repetition, storage and retrieval',
        'Emotion, consciousness, intuition and belief',
        'Encryption, compression, networking and display',
      ],
      correctAnswerIndex: 0,
      explanation:
        'The slide on what intelligent systems should do ends by listing reasoning, learning, problem solving and perception.',
      difficulty: 'foundational',
      sourceReference: { section: 'Intelligent System Should do the following', pages: [10] },
    },
    {
      id: 'ch01-q04',
      question: 'Who coined the term "artificial intelligence", and in what setting?',
      options: [
        'Alan Turing, in his 1950 paper on machine intelligence',
        'Herbert Simon, when presenting the Logic Theorist in 1955',
        'John McCarthy, at the 1956 Dartmouth Conference',
        'Joseph Weizenbaum, while developing ELIZA in 1966',
      ],
      correctAnswerIndex: 2,
      explanation:
        'John McCarthy first adopted the term at the Dartmouth Conference in 1956, which established AI as an academic field.',
      difficulty: 'foundational',
      sourceReference: { section: 'What Is Artificial Intelligence? / History of AI', pages: [11, 48] },
    },
    {
      id: 'ch01-q05',
      question:
        'Which goal of AI is concerned with understanding the principles that make intelligent behaviour possible in natural or artificial systems?',
      options: ['The engineering goal', 'The expert-system goal', 'The scientific goal', 'The commercial goal'],
      correctAnswerIndex: 2,
      explanation:
        'The scientific goal is to understand the principles behind intelligent behaviour by analysing agents and testing hypotheses; the engineering goal focuses on designing useful intelligent artefacts.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Goals of AI', pages: [13] },
    },
    {
      id: 'ch01-q06',
      question:
        'Which pairing correctly describes a sensory input and an action of a software agent, as opposed to a human or robotic agent?',
      options: [
        'Receiving file contents as input; writing files as output',
        'Using infrared range finders as input; driving motors as output',
        'Seeing through cameras as input; turning wheels as output',
        'Hearing through ears as input; speaking with a mouth as output',
      ],
      correctAnswerIndex: 0,
      explanation:
        'A software agent senses keystrokes, file contents and network packets, and acts by displaying output, writing files and sending packets. The other options describe robotic or human agents.',
      difficulty: 'foundational',
      sourceReference: { section: 'What is an Agent?', pages: [14] },
    },
    {
      id: 'ch01-q07',
      question: 'What is the difference between a percept and a percept sequence?',
      options: [
        'A percept is an action; a percept sequence is a list of planned actions',
        'A percept is stored permanently; a percept sequence is discarded after use',
        "A percept describes the environment; a percept sequence describes the agent's goals",
        'A percept is the input at a single instant; a percept sequence is the complete history of everything perceived',
      ],
      correctAnswerIndex: 3,
      explanation:
        "A percept is the agent's perceptual input at a given instant, while the percept sequence is the full history of everything the agent has ever perceived.",
      difficulty: 'foundational',
      sourceReference: { section: 'Percept and Percept Sequence', pages: [16] },
    },
    {
      id: 'ch01-q08',
      question: 'How does the lecture distinguish the agent function from the agent program?',
      options: [
        'The agent function runs on hardware; the agent program is only a theoretical model',
        'The agent function is an abstract mathematical mapping; the agent program is its concrete implementation running on the agent architecture',
        'They are two names for exactly the same component',
        'The agent function selects goals; the agent program selects sensors',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The lecture stresses keeping the two ideas distinct: the function is an abstract description, and the program is the concrete implementation that runs on an architecture.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Agent Functions / Agent Program', pages: [17, 18] },
    },
    {
      id: 'ch01-q09',
      question: 'In the notation f : P* → A for an agent function, what does P* represent?',
      options: [
        'The set of all possible percept sequences',
        'The set of all possible actions',
        "The agent's performance measure",
        'A single percept at the current instant',
      ],
      correctAnswerIndex: 0,
      explanation:
        'P* is the set of all possible percept histories; the agent function maps each such history to an action in A.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Agent Functions', pages: [17] },
    },
    {
      id: 'ch01-q10',
      question:
        'A research team judges its system by whether its behaviour achieves the best expected outcome with the information available, not by whether it resembles human behaviour. Which approach to AI is this?',
      options: ['Thinking humanly', 'Acting humanly', 'Acting rationally', 'Thinking rationally'],
      correctAnswerIndex: 2,
      explanation:
        'Judging behaviour (acting) against an ideal of best expected outcome (rationality) is the acting-rationally approach, which the course adopts as its standard model.',
      difficulty: 'advanced',
      sourceReference: { section: 'Four Schools of Thought / Acting Rationally', pages: [19, 29] },
    },
    {
      id: 'ch01-q11',
      question: 'Under the Turing test, when is the computer said to pass?',
      options: [
        'When it answers every question faster than the human participant',
        'When the interrogator, after posing written questions, cannot tell whether the responses came from a person or a machine',
        'When it proves a set of mathematical theorems without errors',
        'When it physically manipulates objects that the interrogator presents',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The machine passes if a human interrogator, after asking written questions, cannot tell whether the answers came from a person or a computer.',
      difficulty: 'foundational',
      sourceReference: { section: 'Acting Humanly (Turing Test)', pages: [21] },
    },
    {
      id: 'ch01-q12',
      question: 'Which two capabilities does the Total Turing Test add beyond those needed for the standard Turing test?',
      options: [
        'Natural language processing and knowledge representation',
        'Automated reasoning and machine learning',
        'Knowledge representation and automated reasoning',
        'Computer vision and robotics',
      ],
      correctAnswerIndex: 3,
      explanation:
        'Because the standard test excludes physical interaction, the Total Turing Test adds computer vision (to perceive objects) and robotics (to manipulate them).',
      difficulty: 'intermediate',
      sourceReference: { section: 'What would a computer need to pass the Turing test?', pages: [23] },
    },
    {
      id: 'ch01-q13',
      question:
        'During a Turing test, the machine must recall a detail the interrogator mentioned several questions earlier. Which required capability most directly supports this?',
      options: ['Robotics', 'Computer vision', 'Machine learning', 'Knowledge representation'],
      correctAnswerIndex: 3,
      explanation:
        'The lecture assigns knowledge representation the role of storing information provided during the test so it can be used later.',
      difficulty: 'intermediate',
      sourceReference: { section: 'What would a computer need to pass the Turing test?', pages: [23] },
    },
    {
      id: 'ch01-q14',
      question: 'Which of the following is listed as a difficulty of the cognitive-modelling ("thinking humanly") approach?',
      options: [
        "Reverse-engineering human thought is very hard, and the brain's hardware differs greatly from a computer program",
        'All knowledge must be stated with complete certainty in formal logic',
        'It ignores psychology and relies only on mathematics',
        'It can only be evaluated using physical robots',
      ],
      correctAnswerIndex: 0,
      explanation:
        'The lecture lists that humans do not always behave rationally, reverse engineering the mind is hard, and brain hardware is very different from a program. The certainty problem belongs to the laws-of-thought approach.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Thinking Humanly (Cognitive Modeling Approach)', pages: [27] },
    },
    {
      id: 'ch01-q15',
      question: 'What is a key drawback of the "laws of thought" (thinking rationally) approach?',
      options: [
        'It cannot represent relations between objects',
        'It depends on experimental psychology to validate its theories',
        'Informal or uncertain knowledge is hard to express in formal logical notation, and the approach can be computationally costly',
        'It produces wrong conclusions even when its premises are correct',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Logic needs knowledge stated formally and with certainty; uncertain knowledge is hard to encode and the computation can be expensive. There is also a gap between solving a problem in principle and in practice.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Thinking Rationally: The "Laws of Thought" approach', pages: [28] },
    },
    {
      id: 'ch01-q16',
      question: 'Under the "acting rationally" view adopted as the course\'s standard model, a rational agent is one that…',
      options: [
        'always imitates what a human expert would do',
        'acts to achieve the best expected outcome given the information available',
        'never makes a mistake in any environment',
        'reasons only with formal logic before every action',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Rational behaviour means doing the right thing: acting to maximise expected goal achievement given the available information.',
      difficulty: 'foundational',
      sourceReference: { section: 'Acting Rationally', pages: [29] },
    },
    {
      id: 'ch01-q17',
      question: 'Which foundational discipline contributed utility and decision theory to AI?',
      options: ['Economics', 'Linguistics', 'Neuroscience', 'Control theory and cybernetics'],
      correctAnswerIndex: 0,
      explanation:
        'The summary of foundations credits economics with utility and decision theory, reflecting its focus on making good choices under uncertainty.',
      difficulty: 'foundational',
      sourceReference: { section: 'Foundations of AI', pages: [41, 45] },
    },
    {
      id: 'ch01-q18',
      question:
        'An irrigation controller keeps soil moisture at a target level by adjusting itself, with no constant human input. Which foundational field of AI does this idea come from most directly?',
      options: ['Psychology', 'Linguistics', 'Philosophy', 'Control theory and cybernetics'],
      correctAnswerIndex: 3,
      explanation:
        'Control theory and cybernetics study how machines regulate themselves and design systems that optimise an objective over time without constant human input.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Foundations of AI', pages: [43, 46] },
    },
    {
      id: 'ch01-q19',
      question: 'Which sequence places these milestones in the correct chronological order?',
      options: [
        'Logic Theorist → McCulloch–Pitts neuron model → ELIZA → Deep Blue defeats Kasparov',
        'McCulloch–Pitts neuron model → Logic Theorist → ELIZA → Deep Blue defeats Kasparov',
        'McCulloch–Pitts neuron model → ELIZA → Logic Theorist → Deep Blue defeats Kasparov',
        'ELIZA → McCulloch–Pitts neuron model → Deep Blue defeats Kasparov → Logic Theorist',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The artificial neuron model dates from 1943, the Logic Theorist from 1955, ELIZA from 1966, and Deep Blue beat Kasparov in 1997.',
      difficulty: 'advanced',
      sourceReference: { section: 'History of AI', pages: [48, 49, 50] },
    },
    {
      id: 'ch01-q20',
      question: 'Siri, Alexa and self-driving cars are given in the lecture as examples of which stage of AI?',
      options: [
        'Artificial General Intelligence (strong AI)',
        'Artificial Super Intelligence',
        'Artificial Narrow Intelligence (weak AI)',
        'Self-aware AI',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Narrow (weak) AI performs a narrowly defined set of tasks. The lecture notes that almost all AI systems built so far, including these assistants and vehicles, fall into this category.',
      difficulty: 'foundational',
      sourceReference: { section: 'Stages of AI', pages: [57] },
    },
  ],
});
