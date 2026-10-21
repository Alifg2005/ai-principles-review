import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'knowledge-representation',
  number: 8,
  title: 'Knowledge Representation: First-Order Logic',
  description:
    'Why propositional logic falls short, the building blocks of first-order logic, universal and existential quantifiers, common translation mistakes, quantifier order and duality.',
  source: {
    fileName: 'Knowledge Representation.pdf',
    label: 'Knowledge Representation',
    pageCount: 45,
    note: 'The deck is unnumbered; number 8 is inferred because Lecture 7 announces first-order logic as the next lecture. The outline lists FOL-to-CNF conversion, but no CNF slides are present, so CNF is not examined. Quantifier and connective glyphs were reconstructed from context.',
  },
  questions: [
    {
      id: 'ch08-q01',
      question: 'What is the main limitation of propositional logic that first-order logic addresses?',
      options: [
        'Propositional logic cannot make general statements about groups of objects, such as "all students take exams"',
        'Propositional logic cannot express negation',
        'Propositional logic has no notion of truth values',
        'Inference in propositional logic is harder than in first-order logic',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Without variables or quantifiers, propositional logic must state a separate fact for every individual. FOL can express the general rule once.',
      difficulty: 'foundational',
      sourceReference: { section: 'Problem of Propositional Logic', pages: [6, 8] },
    },
    {
      id: 'ch08-q02',
      question: 'How does inference in first-order logic compare with inference in propositional logic, according to the lecture?',
      options: [
        'FOL inference is easier because it has variables',
        'The two are equally complex',
        'Neither supports inference',
        'Inference in propositional logic is easy, while inference in FOL is more complex',
      ],
      correctAnswerIndex: 3,
      explanation:
        'FOL gains expressive power (variables, relations), but at the cost of more complex inference.',
      difficulty: 'foundational',
      sourceReference: { section: 'Continued: FOL fixes the problems of PL', pages: [8] },
    },
    {
      id: 'ch08-q03',
      question: 'What distinguishes a function from a predicate in first-order logic?',
      options: [
        'A function is always unary; a predicate is always binary',
        'A predicate returns an object; a function returns true or false',
        'A function returns a value (an object); a predicate is either true or false',
        'There is no difference; the terms are interchangeable',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Functions map arguments to a value, such as MultiplyByTwo(x). Predicates state something that is true or false, such as Even(x).',
      difficulty: 'foundational',
      sourceReference: { section: 'Predicate vs Function', pages: [10] },
    },
    {
      id: 'ch08-q04',
      question: 'Which of the following is best modelled as a function rather than a predicate?',
      options: ['Taller(Omar, Ziad)', 'CapitalOf(France)', 'Even(4)', 'Likes(Sara, Tea)'],
      correctAnswerIndex: 1,
      explanation:
        'CapitalOf(France) denotes a single object, a city, so it is a function. The others are statements that are true or false, so they are predicates.',
      difficulty: 'intermediate',
      sourceReference: { section: 'First-Order logic / Predicate vs Function', pages: [9, 10] },
    },
    {
      id: 'ch08-q05',
      question: 'Which expression is a binary predicate expressing a relation between two objects?',
      options: ['Male(x)', 'MotherOf(x)', 'Green', 'Brother(x, y)'],
      correctAnswerIndex: 3,
      explanation:
        'Brother(x, y) relates two objects. Male(x) is a unary predicate (a property), MotherOf(x) is a function, and Green is a property term.',
      difficulty: 'foundational',
      sourceReference: { section: 'First-Order logic', pages: [9] },
    },
    {
      id: 'ch08-q06',
      question: 'Which of the following is a ground term?',
      options: ['Plus(2, 5)', 'F(x)', 'y', 'MotherOf(z)'],
      correctAnswerIndex: 0,
      explanation: 'A ground term contains no variables. Plus(2, 5) uses only constants; each other option contains a variable.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Syntax of FOL: Basic Elements', pages: [14] },
    },
    {
      id: 'ch08-q07',
      question: 'In the formula ∃z Owns(w, z), which variables are free and which are bound?',
      options: [
        'w is bound and z is free',
        'w is free and z is bound',
        'Both w and z are bound',
        'Both w and z are free',
      ],
      correctAnswerIndex: 1,
      explanation: 'The quantifier ∃z binds z. Nothing binds w, so w is free.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Syntax of FOL: free and bound variables', pages: [15] },
    },
    {
      id: 'ch08-q08',
      question: 'According to the lecture, a well-formed formula (sentence) in FOL is one that…',
      options: [
        'uses only the ∧ connective',
        'contains at least one constant',
        'contains no free variables',
        'has exactly one quantifier',
      ],
      correctAnswerIndex: 2,
      explanation: 'A wff in this lecture is a sentence in which every variable is bound by a universal or existential quantifier.',
      difficulty: 'foundational',
      sourceReference: { section: 'Syntax of FOL: Basic Elements', pages: [16] },
    },
    {
      id: 'ch08-q09',
      question: 'Which FOL sentence correctly expresses "Every pilot is licensed"?',
      options: [
        '∀x Pilot(x) ∧ Licensed(x)',
        '∃x Pilot(x) ⇒ Licensed(x)',
        '∀x Pilot(x) ⇒ Licensed(x)',
        '∃x Pilot(x) ∧ Licensed(x)',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Universal statements use ⇒ as the main connective: for every x, if x is a pilot then x is licensed.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Universal Quantifier: examples', pages: [20, 21] },
    },
    {
      id: 'ch08-q10',
      question: 'What does ∀x Chef(x) ∧ Creative(x) actually assert?',
      options: [
        'Every chef is creative',
        'Everything in the domain is a chef and is creative',
        'Some chef is creative',
        'No chef is creative',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Using ∧ under ∀ forces every object to satisfy both parts. This is the common mistake the lecture warns about.',
      difficulty: 'advanced',
      sourceReference: { section: 'A common mistake to avoid', pages: [23, 24] },
    },
    {
      id: 'ch08-q11',
      question: 'Which sentence correctly expresses "Some cities are coastal"?',
      options: [
        '∀x City(x) ⇒ Coastal(x)',
        '∃x City(x) ⇒ Coastal(x)',
        '∀x City(x) ∧ Coastal(x)',
        '∃x City(x) ∧ Coastal(x)',
      ],
      correctAnswerIndex: 3,
      explanation:
        'Existential statements typically use ∧: there exists an x that is a city and is coastal.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Existential Quantifiers', pages: [26, 28] },
    },
    {
      id: 'ch08-q12',
      question: 'Why is ∃x City(x) ⇒ Coastal(x) a poor translation of "Some city is coastal"?',
      options: [
        'It is true as soon as anything is not a city, even if no city is coastal',
        'It is false whenever any city is coastal',
        'It is a syntax error in FOL',
        'It means that every city is coastal',
      ],
      correctAnswerIndex: 0,
      explanation:
        'An implication with a false premise is true, so any non-city makes the whole existential true. This is the common mistake with ∃.',
      difficulty: 'advanced',
      sourceReference: { section: 'Existential Quantifiers: A Common Mistake', pages: [29] },
    },
    {
      id: 'ch08-q13',
      question: 'Over a finite domain, a universally quantified sentence is roughly equivalent to…',
      options: [
        'a disjunction of its instances',
        'a conjunction of its instances',
        'one instance chosen at random',
        'the negation of its instances',
      ],
      correctAnswerIndex: 1,
      explanation:
        '∀ behaves like a conjunction (every instance must hold), while ∃ behaves like a disjunction (at least one instance holds).',
      difficulty: 'intermediate',
      sourceReference: { section: 'The Universal Quantifier', pages: [18, 27] },
    },
    {
      id: 'ch08-q14',
      question: 'Which statement about the order of quantifiers is correct?',
      options: [
        '∀x ∀y is equivalent to ∀y ∀x, but swapping a ∀ with an ∃ changes the meaning',
        'Swapping any two quantifiers never changes the meaning',
        '∃x ∃y is not equivalent to ∃y ∃x',
        '∀x ∃y and ∃y ∀x always mean the same thing',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Quantifiers of the same kind commute. Swapping a universal with an existential changes the meaning.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Properties of quantifiers', pages: [36] },
    },
    {
      id: 'ch08-q15',
      question:
        'Mentors(a, b) means "a mentors b": the first argument is the mentor and the second is the person being mentored. What does ∀x ∃y Mentors(y, x) state?',
      options: [
        'There is one person who mentors everyone',
        'Every person mentors at least one person',
        'Every person mentors every other person',
        'Every person is mentored by at least one person',
      ],
      correctAnswerIndex: 3,
      explanation:
        'In Mentors(y, x), y is the mentor and x is the one mentored. ∀x ∃y then says: for every x there is some y (possibly a different one for each x) who mentors x. Swapping the arguments, ∀x ∃y Mentors(x, y), would mean everyone mentors someone; putting ∃y first would require one mentor for everyone. Always read argument order from the predicate\'s definition, not from the English word order.',
      difficulty: 'advanced',
      sourceReference: { section: 'Properties of quantifiers', pages: [36] },
    },
    {
      id: 'ch08-q16',
      question: 'What is the negation of ∀x Likes(x, Coffee)?',
      options: ['∀x ¬Likes(x, Coffee)', '¬∃x Likes(x, Coffee)', '∃x ¬Likes(x, Coffee)', '∃x Likes(x, Coffee)'],
      correctAnswerIndex: 2,
      explanation:
        '"Not everyone likes coffee" is the same as "someone does not like coffee": ¬∀x P(x) ≡ ∃x ¬P(x).',
      difficulty: 'intermediate',
      sourceReference: { section: 'Connections between ∀ and ∃', pages: [37] },
    },
    {
      id: 'ch08-q17',
      question: 'Using quantifier duality, ∃x Likes(x, Tea) is equivalent to…',
      options: ['¬∀x ¬Likes(x, Tea)', '∀x ¬Likes(x, Tea)', '¬∃x ¬Likes(x, Tea)', '∀x Likes(x, Tea)'],
      correctAnswerIndex: 0,
      explanation:
        '"Someone likes tea" means it is not the case that everyone dislikes tea. Any statement with one quantifier can be rewritten with the other using negation.',
      difficulty: 'advanced',
      sourceReference: { section: 'Quantifier duality', pages: [38, 39] },
    },
    {
      id: 'ch08-q18',
      question: 'Which sentence expresses "No one likes cold soup"?',
      options: [
        '∃x ¬Likes(x, ColdSoup)',
        '∀x Likes(x, ColdSoup)',
        '∀x ¬Likes(x, ColdSoup)',
        '¬∀x Likes(x, ColdSoup)',
      ],
      correctAnswerIndex: 2,
      explanation:
        '"No one" means that for every x, x does not like it. Both ∃x ¬Likes and ¬∀x Likes only say that someone does not like it.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Exercise solutions / Thinking in FOL: Quantifiers', pages: [31, 43] },
    },
    {
      id: 'ch08-q19',
      question:
        'Translating "Huda sold the car to Faisal" into FOL, which representation follows the lecture\'s objects-and-relations method?',
      options: [
        'Sold(Huda) ∧ Car ∧ Faisal',
        'Sold(Huda, Car, Faisal), a three-place relation',
        '∀x Sold(x)',
        'Huda(Sold, Car, Faisal)',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Nouns become objects (Huda, Car, Faisal) and the verb becomes the relation. "Sold who, what, to whom" is an n-ary relation with n = 3.',
      difficulty: 'intermediate',
      sourceReference: { section: 'Thinking in FOL', pages: [41] },
    },
    {
      id: 'ch08-q20',
      question: 'Which sentence states that there is a single song that everyone sings?',
      options: ['∀x ∃y Sings(x, y)', '∀x ∀y Sings(x, y)', '∃x ∃y Sings(x, y)', '∃y ∀x Sings(x, y)'],
      correctAnswerIndex: 3,
      explanation:
        'Putting ∃y first fixes one song y, and ∀x then requires every person to sing it. ∀x ∃y would let each person sing a different song.',
      difficulty: 'advanced',
      sourceReference: { section: 'Thinking in FOL: multiple variables', pages: [44] },
    },
  ],
});
