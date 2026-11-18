import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'expert-systems',
  number: 8,
  title: 'Expert Systems',
  description:
    'What expert systems are and when to build one, the development team and phases, architecture and components, rule-based and case-based knowledge, certainty factors, forward and backward chaining, and conflict resolution.',
  source: { label: 'Topic 8' },
  questions: [
    {
      id: 'ch08-q01',
      question: 'Which description best fits an expert system?',
      options: [
        'A program that runs fixed numerical algorithms faster than a person can',
        'A database that stores expert opinions without reasoning over them',
        'A system that emulates the decision-making of a human expert by reasoning over a body of knowledge, mostly IF–THEN rules',
        'A general-purpose AI that can solve problems in any domain',
      ],
      correctAnswerIndex: 2,
      explanation:
        'An expert system simulates a human expert in one domain. Instead of procedural code, it reasons over a knowledge base that is mostly written as IF–THEN rules.',
      difficulty: 'foundational',
    },
    {
      id: 'ch08-q02',
      question: 'How is the knowledge domain related to the problem domain?',
      options: [
        'The knowledge domain is contained within the problem domain',
        'The knowledge domain is always larger than the problem domain',
        'The two are unrelated',
        'The two are always identical',
      ],
      correctAnswerIndex: 0,
      explanation:
        "The problem domain, such as medicine, is the whole area. The expert's knowledge about solving particular problems in it is the knowledge domain, so the problem domain is always a superset.",
      difficulty: 'foundational',
    },
    {
      id: 'ch08-q03',
      question:
        'A thermometer reading of 39.5 °C is interpreted as "the patient has a fever". In the hierarchy from raw data to decisions, this interpreted reading is…',
      options: ['raw data', 'knowledge', 'a decision', 'information'],
      correctAnswerIndex: 3,
      explanation:
        'Information is data placed in context. The bare number is raw data; a rule such as IF fever AND cough THEN flu is knowledge; acting on the conclusion is a decision.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch08-q04',
      question: 'A company wants an expert system for a task that no human can currently perform. Why is this a poor candidate?',
      options: [
        'Expert systems only work in medicine',
        'Without a human expert there is no source of rules to encode',
        'Expert systems cannot represent IF–THEN rules',
        'The task is too narrow for an expert system',
      ],
      correctAnswerIndex: 1,
      explanation:
        'One criterion for building an expert system is that a human can solve the problem. With no expert, there is no knowledge to acquire and no rules to write.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch08-q05',
      question: 'In terms of scope and depth of understanding, which problem suits an expert system?',
      options: [
        'Broad scope and deep understanding',
        'Limited scope and manageable depth',
        'Broad scope and shallow depth',
        'Any scope, as long as enough data is available',
      ],
      correctAnswerIndex: 1,
      explanation:
        'An expert system solves specific problems. A problem that is too broad or needs too deep an understanding falls outside the suitable region.',
      difficulty: 'foundational',
    },
    {
      id: 'ch08-q06',
      question: 'Which is a reason NOT to build an expert system?',
      options: [
        'Human experts in the field are scarce',
        'Many test cases are available',
        'The task is knowledge-intensive',
        'An efficient conventional algorithm already solves the problem',
      ],
      correctAnswerIndex: 3,
      explanation:
        'If a conventional program already solves the problem efficiently, an expert system adds cost without benefit. The other options are reasons in favour of one.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch08-q07',
      question: 'A medical expert system diagnoses infections well but has nothing useful to say about a broken bone. Which limitation does this show?',
      options: [
        'Brittleness',
        'The knowledge acquisition bottleneck',
        'The lack of a user interface',
        'Too many certainty factors',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Brittleness means the system only has knowledge of its specific domain and no general fallback outside it. The bottleneck instead refers to how slow knowledge acquisition is.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch08-q08',
      question: 'Compared with a conventional program, an expert system…',
      options: [
        'integrates knowledge and control in one sequential algorithm',
        'requires its input to be complete before it can run',
        'keeps knowledge separate from control and can work with incomplete input',
        'always returns the optimal solution',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Expert systems separate the knowledge base from the inference engine, accept incomplete input, and give acceptable recommendations rather than guaranteed optimal results.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch08-q09',
      question: 'Who designs, builds and tests the expert system, and interviews the domain expert?',
      options: ['The domain expert', 'The end-user', 'The project manager', 'The knowledge engineer'],
      correctAnswerIndex: 3,
      explanation:
        'The knowledge engineer finds out how the expert solves problems, chooses how to represent the knowledge, and builds, tests and integrates the system.',
      difficulty: 'foundational',
    },
    {
      id: 'ch08-q10',
      question: 'Which sequence lists the four development phases in order?',
      options: [
        'Specification, Analysis, Deployment, Development',
        'Analysis, Specification, Development, Deployment',
        'Analysis, Development, Specification, Deployment',
        'Development, Analysis, Specification, Deployment',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Analysis decides whether an expert system is the answer; specification defines inputs, outputs and the method; development acquires knowledge and builds the system; deployment installs it for routine use.',
      difficulty: 'foundational',
    },
    {
      id: 'ch08-q11',
      question: '"Am I building the right product?" is the question asked during…',
      options: ['validation', 'verification', 'knowledge acquisition', 'deployment'],
      correctAnswerIndex: 0,
      explanation:
        'Validation checks usefulness, relevance and alignment with the goal. Verification asks "am I building the product right?" and checks accuracy and consistency.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch08-q12',
      question: 'Which component justifies a conclusion by showing how it was reached and why a fact is needed?',
      options: ['The knowledge base', 'Working memory', 'The explanation facility', 'The user interface'],
      correctAnswerIndex: 2,
      explanation:
        'The explanation facility answers "how" and "why" questions, for example why a particular antibiotic is recommended.',
      difficulty: 'foundational',
    },
    {
      id: 'ch08-q13',
      question: 'While the inference engine runs, where are the facts about the current case held?',
      options: ['In the knowledge base', 'In the explanation facility', 'In working memory', 'In the user interface'],
      correctAnswerIndex: 2,
      explanation:
        'Working memory is the short-term store of current facts. The knowledge base holds the general rules; the engine compares the two.',
      difficulty: 'foundational',
    },
    {
      id: 'ch08-q14',
      question: 'When rules are written from a decision tree, what does one path from the root to a leaf become?',
      options: ['One IF–THEN rule', 'One fact in working memory', 'One certainty factor', 'One conflict set'],
      correctAnswerIndex: 0,
      explanation:
        'Each node is a question and each branch an answer. Following one path collects the conditions (the IF part) that lead to the leaf conclusion (the THEN part).',
      difficulty: 'foundational',
    },
    {
      id: 'ch08-q15',
      question:
        'Two rules support the same conclusion with certainty factors 0.6 and 0.5. Using the combination formula CF1 + CF2 × (1 − CF1), what is the combined certainty factor?',
      options: ['1.1', '0.3', '0.55', '0.8'],
      correctAnswerIndex: 3,
      explanation: '0.6 + 0.5 × (1 − 0.6) = 0.6 + 0.2 = 0.8. Combined evidence raises confidence but never above 1.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch08-q16',
      question: 'In case-based reasoning, which component adjusts an old solution to fit the new problem?',
      options: ['The retriever', 'The adapter', 'The evaluator', 'The executer'],
      correctAnswerIndex: 1,
      explanation:
        'The retriever finds similar past cases, the adapter modifies the old solution, the refiner checks it, the executer applies it and the evaluator records the outcome.',
      difficulty: 'foundational',
    },
    {
      id: 'ch08-q17',
      question:
        'Facts: {P, Q}. Rules: R1: P → R; R2: R and Q → S; R3: S → T; R4: U → T. Which facts are in working memory when forward chaining stops?',
      options: ['{P, Q, R, S, T}', '{P, Q, R}', '{P, Q, R, S, T, U}', '{P, Q, T}'],
      correctAnswerIndex: 0,
      explanation:
        'R1 adds R, R2 then adds S (R and Q hold), and R3 adds T. R4 never fires because U is not a fact, so U is never added.',
      difficulty: 'advanced',
    },
    {
      id: 'ch08-q18',
      question: 'A doctor starts from the hypothesis "meningitis" and looks for evidence that confirms it. Which strategy matches this?',
      options: ['Forward chaining', 'Backward chaining', 'Case retrieval', 'Conflict resolution by recency'],
      correctAnswerIndex: 1,
      explanation:
        'Starting from a goal and seeking the facts that prove it is backward (goal-driven) chaining, which suits diagnosis. Forward chaining starts from the data.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch08-q19',
      question:
        'Two rules can fire. One has three matching conditions and the other has one, and the engine chooses the three-condition rule. Which conflict-resolution method is this?',
      options: ['Highest priority', 'Most recent data', 'Random selection', 'Most specific (longest matching)'],
      correctAnswerIndex: 3,
      explanation:
        'The most-specific strategy prefers the rule with more conditions, since it carries more information about the situation.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch08-q20',
      question: 'What is a meta-rule?',
      options: [
        'A rule that carries a certainty factor',
        'A rule converted from a decision tree',
        'A rule about rules, stating which ones to prefer',
        'A rule stored in working memory',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Meta-knowledge is knowledge about how to use domain knowledge. A meta-rule might say that rules from experts outrank rules from novices.',
      difficulty: 'advanced',
    },
  ],
});
