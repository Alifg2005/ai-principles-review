import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'logical-agents',
  number: 7,
  title: 'Logical Agents',
  description:
    'Knowledge-based agents and the TELL/ASK cycle, declarative versus procedural knowledge, the Wumpus world, entailment and models, propositional logic, and semantic networks, frames and production rules.',
  source: {
    fileName: 'Topic-7 Logical Agents.pdf',
    label: 'Lecture 7',
    pageCount: 68,
    note: 'Logical connective glyphs were not preserved by text extraction; formulas were reconstructed from context and are written here in standard notation.',
  },
  questions: [
    {
      id: 'ch07-q01',
      question: 'Which limitation of problem-solving (search-based) agents motivates the move to logical agents?',
      options: [
        'They cannot use any data structures',
        'They cannot act in deterministic environments',
        'They cannot infer unobserved information',
        'They always require a human operator',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Search-based agents have limited reasoning and cannot infer facts they have not observed; logic-based agents use inference over knowledge.',
      difficulty: 'foundational',
      sourceReference: { section: 'Why logical agents?', pages: [4] },
    },
    {
      id: 'ch07-q02',
      question: 'A knowledge-based agent consists of which two main components?',
      options: [
        'A sensor array and a utility function',
        'A FIFO queue and a goal test',
        'A critic and a problem generator',
        'A knowledge base and an inference system',
      ],
      correctAnswerIndex: 3,
      explanation:
        'The knowledge base stores domain facts and rules, and the inference engine reasons over them to answer queries.',
      difficulty: 'foundational',
      sourceReference: { section: 'Knowledge-based agents / Components', pages: [5, 11] },
    },
    {
      id: 'ch07-q03',
      question: 'Each time a knowledge-based agent program is called, what is the correct order of operations?',
      options: [
        'ASK for an action, perform it, then TELL the percept',
        'TELL the percept, ASK for an action, then TELL which action was executed',
        'TELL the action, ASK for the percept, then perform the action',
        'ASK for the percept, TELL the goal, then ASK again',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The loop is: TELL the KB what was perceived, ASK it what to do, then TELL it which action was taken so a history is kept.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Agent program workflow: TELL and ASK', pages: [9, 10] },
    },
    {
      id: 'ch07-q04',
      question: 'At which level of a knowledge-based agent is knowledge encoded into sentences, such as a fact written as a predicate?',
      options: ['Logical level', 'Knowledge level', 'Implementation level', 'Hardware level'],
      correctAnswerIndex: 0,
      explanation:
        'The knowledge level states what the agent knows, the logical level encodes it as sentences, and the implementation level is the physical representation.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Architecture of a knowledge-based agent', pages: [7] },
    },
    {
      id: 'ch07-q05',
      question:
        'A hospital wants doctors to read and add diagnostic rules themselves without rewriting program code. Which approach to knowledge best supports this?',
      options: ['Declarative knowledge', 'Procedural knowledge', 'Implementation-level encoding', 'A utility function'],
      correctAnswerIndex: 0,
      explanation:
        'Declarative knowledge is easy to modify and read, and matches how domain experts think, so experts can add rules directly.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Declarative knowledge (knowing that)', pages: [13, 14] },
    },
    {
      id: 'ch07-q06',
      question: 'What is the main advantage of procedural knowledge over declarative knowledge?',
      options: [
        'Better readability for domain experts',
        'Easier to add or remove individual rules',
        'Higher computational efficiency',
        'Better cognitive matching',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Behaviour coded directly as a program runs fast, but it is harder to modify and explain. The other options are advantages of declarative knowledge.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Procedural knowledge (knowing how)', pages: [14, 15] },
    },
    {
      id: 'ch07-q07',
      question: 'In the Wumpus world, what does the agent perceive in a room directly (not diagonally) adjacent to a pit?',
      options: ['Stench', 'Glitter', 'Scream', 'Breeze'],
      correctAnswerIndex: 3,
      explanation:
        'Rooms next to a pit are breezy. Stench signals the Wumpus, glitter the gold, and a scream means the Wumpus has been killed.',
      difficulty: 'foundational',
      sourceReference: { section: 'Wumpus World PEAS description', pages: [16, 18, 20] },
    },
    {
      id: 'ch07-q08',
      question: 'How is the Wumpus world characterised in terms of observability?',
      options: [
        'Fully observable, because the agent sees the whole cave',
        'Partially observable, because the agent knows only its local percepts',
        'Unobservable, because the agent has no sensors',
        'Fully observable after the first move',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The agent perceives only what is local to its current room, so it must reason to work out where hazards are.',
      difficulty: 'foundational',
      sourceReference: { section: 'Wumpus World Characterization', pages: [21, 22] },
    },
    {
      id: 'ch07-q09',
      question: 'In the match–resolve–act cycle of a production system, what happens in the resolve step?',
      options: [
        "Every rule's condition is checked against the current facts",
        "The chosen rule's action is carried out",
        'New sensors are added to the agent',
        'One rule is chosen from the conflict set of rules whose conditions hold',
      ],
      correctAnswerIndex: 3,
      explanation:
        'Match finds the rules whose conditions hold, resolve picks one of them (conflict resolution), and act fires it.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Production rules', pages: [65] },
    },
    {
      id: 'ch07-q10',
      question: 'The agent starts at [1,1] and perceives nothing: no breeze and no stench. What can it validly infer?',
      options: [
        'The neighbouring squares are safe',
        'The gold is in an adjacent square',
        'The Wumpus is exactly two squares away',
        'There is a pit diagonally adjacent',
      ],
      correctAnswerIndex: 0,
      explanation:
        'No breeze means no adjacent pit, and no stench means no adjacent Wumpus, so the neighbouring squares are OK.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Exploring the Wumpus World', pages: [23] },
    },
    {
      id: 'ch07-q11',
      question: 'According to the lecture, a knowledge representation consists of syntax, semantics and which third element?',
      options: ['Hardware', 'Reasoning', 'Perception', 'Compilation'],
      correctAnswerIndex: 1,
      explanation:
        'Representation = syntax + semantics + reasoning: the symbols and rules, their meaning, and the algorithms that derive new information.',
      difficulty: 'foundational',
      sourceReference: { section: 'Knowledge representation (KR)', pages: [29] },
    },
    {
      id: 'ch07-q12',
      question: 'Why is natural language not ideal as a knowledge representation language?',
      options: [
        'It is not expressive enough',
        'It cannot describe objects',
        'It is ambiguous',
        'It depends on a particular programming language',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Natural language is expressive but ambiguous. Programming languages have the opposite problem: they are precise but not expressive enough.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Good knowledge representation languages', pages: [30] },
    },
    {
      id: 'ch07-q13',
      question: 'What does KB ⊨ α (the knowledge base entails α) mean?',
      options: [
        'α is true in every model in which KB is true',
        'α is true in at least one model in which KB is true',
        'KB is true in every model in which α is true',
        'α and KB are never true together',
      ],
      correctAnswerIndex: 0,
      explanation: 'Entailment holds if and only if α is true in all worlds where the KB is true.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Logical Entailment', pages: [35] },
    },
    {
      id: 'ch07-q14',
      question: 'A knowledge base is built from 4 propositional symbols. How many possible models are there?',
      options: ['4', '8', '12', '16'],
      correctAnswerIndex: 3,
      explanation: 'Each symbol can be true or false, so n symbols give 2ⁿ models: 2⁴ = 16.',
      difficulty: 'foundational',
      sourceReference: { section: 'Models', pages: [38] },
    },
    {
      id: 'ch07-q15',
      question: 'The sentence ¬A ∧ A is…',
      options: ['valid', 'satisfiable but not valid', 'unsatisfiable', 'true only when A is false'],
      correctAnswerIndex: 2,
      explanation: 'No assignment makes both A and ¬A true, so the sentence is true in no model: it is unsatisfiable.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Models (2)', pages: [39] },
    },
    {
      id: 'ch07-q16',
      question: 'With two symbols A and B, how is the sentence A ∧ B best classified?',
      options: [
        'Valid, because it is true in all four models',
        'Satisfiable but not valid, because it is true in exactly one model',
        'Unsatisfiable, because it is false in three models',
        'Valid, because A and B are atomic',
      ],
      correctAnswerIndex: 1,
      explanation:
        'A ∧ B is true only when both are true, which is one model. That makes it satisfiable, but not valid because it is false in the other three.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Models (2)', pages: [38, 39] },
    },
    {
      id: 'ch07-q17',
      question: 'Which of the following is a proposition?',
      options: ['"Is the server running?"', '"The server is running."', '"5 + 7"', '"Close the door."'],
      correctAnswerIndex: 1,
      explanation:
        'A proposition is a statement that is either true or false. Questions, bare expressions and commands have no truth value.',
      difficulty: 'foundational',
      sourceReference: { section: 'Propositional logic: propositions', pages: [40] },
    },
    {
      id: 'ch07-q18',
      question: 'Using model checking, does KB = {P ⇒ Q, P} entail α = Q?',
      options: [
        'No, because Q is false in some model of P ⇒ Q',
        'No, because KB is unsatisfiable',
        'Yes, because Q is true in every possible model',
        'Yes, because the only model where both P ⇒ Q and P are true has Q true',
      ],
      correctAnswerIndex: 3,
      explanation:
        'Of the four models, KB is true only when P = true and Q = true. α is true there, so KB ⊨ Q. Q is not valid on its own; it only has to hold where KB holds.',
      difficulty: 'advanced',
      sourceReference: { section: 'Exercise: Check entailment with truth table', pages: [44, 45] },
    },
    {
      id: 'ch07-q19',
      question:
        'A semantic network links Rex to the category Sheepdog and Sheepdog to Dog, and stores "has fur" at the Dog node. Concluding that Rex has fur relies on…',
      options: [
        'inheritance through membership and subclass links',
        'conflict resolution among production rules',
        'truth-table model checking',
        'a procedure attached to a frame slot',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Properties stored higher in the hierarchy are inherited by the levels below. This is the restricted, inheritance-based inference semantic networks support.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Semantic networks: inheritance', pages: [48, 49, 52] },
    },
    {
      id: 'ch07-q20',
      question:
        'Frame Vehicle has the typical value *Wheels = 4. Frame Motorbike IsA Vehicle and sets Wheels = 2. What is the value of Wheels for a motorbike instance?',
      options: [
        '4, because values are always inherited from the parent frame',
        'Undefined, because the two frames give conflicting values',
        '2, because a typical value can be overridden by a subclass',
        '6, because inherited values are added together',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Values marked as typical (*) act as defaults that a subclass or instance may override, so the more specific value 2 applies.',
      difficulty: 'advanced',
      sourceReference: { section: 'Frames: typical values / Frame slots', pages: [60, 61, 62] },
    },
  ],
});
