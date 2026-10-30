import { definePracticeSet } from '../../lib/practiceSchema';

const given = (v: string) => ({ given: v });
const TERM = ['Constant', 'Variable', 'Function', 'Predicate'];
const SCOPE = ['Free', 'Bound'];
const TF = ['T', 'F'];

export default definePracticeSet({
  chapterId: 'knowledge-representation',
  questions: [
    {
      id: 'p08-01',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Propositional vs first-order',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'What are the limitations of propositional logic, and how does first-order logic overcome them?',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'original-worked-example',
        short: [
          {
            type: 'ul',
            items: [
              'PL has only facts, with no variables, so it cannot make general statements about a group.',
              'PL cannot directly express properties of individuals or relations between them.',
              'FOL adds variables, predicates and the quantifiers ∀ and ∃. The cost: more complex inference.',
            ],
          },
        ],
        detailed: [{ type: 'p', text: '"Every member of the club pays dues" needs a separate proposition per member in PL. In FOL it is one rule: ∀x Member(x) ⇒ PaysDues(x).' }],
      },
    },
    {
      id: 'p08-02',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'FOL syntax',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Distinguish a predicate from a function in FOL, with an example of each.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: ['Function: returns a value (an object), e.g. MotherOf(Yasser).', 'Predicate: is true or false, e.g. Even(x).'],
          },
        ],
      },
    },
    {
      id: 'p08-03',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'FOL syntax',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Define a term, a ground term, a free variable and a well-formed formula (as used in this course).',
      mixUp: "In this course, a wff is a sentence with no free variables. In standard logic, a wff is any well-formed formula, and a formula with no free variables is called a closed formula or sentence.",
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Term: a constant, a variable, or a function applied to terms. It denotes an object.',
              'Ground term: a term with no variables.',
              'Free variable: a variable not bound by a quantifier.',
              'Well-formed formula (this course\'s convention): a sentence with no free variables.',
            ],
          },
        ],
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'p', text: "P(x) is a wff in standard logic but not a closed formula, because x is free. ∀x P(x) is both. Under this course's convention, only ∀x P(x) counts as a wff." }],
          },
        ],
      },
    },
    {
      id: 'p08-04',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Quantifiers',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Which connective normally goes with each quantifier? Explain the common mistake with each.',
      mixUp: "∃x At(x, IAU) ⇒ Smart(x). The sentence is true because anyone not at IAU makes the implication true, even if nobody at IAU is smart.",
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              '∀ goes with ⇒. Using ∧ wrongly claims that everything has both properties.',
              '∃ goes with ∧. Using ⇒ is wrongly true as soon as anything fails the first condition.',
            ],
          },
        ],
        detailed: [
          { type: 'p', text: '∀x Student(x) ∧ Smart(x) says everything is a student and smart. ∃x Student(x) ⇒ Smart(x) is satisfied by any non-student, because an implication with a false premise is true.' },
        ],
      },
    },
    {
      id: 'p08-05',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Quantifier order',
      difficulty: 'advanced',
      questionStatus: 'course-concept',
      prompt: 'When does swapping quantifiers change the meaning? Illustrate with Likes(x, y), meaning "x likes y".',
      mixUp: "With likes(x,y) meaning 'x likes y', 'Everyone is loved by at least one person' is ∀x ∃y likes(y,x), and 'There is a person who loves everyone' is ∃y ∀x likes(y,x). Quantifier order matters.",
      answer: {
        shortStatus: 'course-concept',
        short: [
          { type: 'p', text: 'Swapping the same quantifier changes nothing. Swapping ∀ with ∃ changes the meaning:' },
          {
            type: 'ul',
            items: ['∀x ∃y Likes(x, y): everyone likes someone (possibly different people).', '∃y ∀x Likes(x, y): one person is liked by everyone.'],
          },
        ],
      },
    },
    {
      id: 'p08-06',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Quantifier duality',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'State the negation rules for quantifiers and the two duality equivalences.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'course-concept',
        short: [
          { type: 'formula', text: '¬∀x P(x)  ≡  ∃x ¬P(x)\n¬∃x P(x)  ≡  ∀x ¬P(x)\n∀x P(x)   ≡  ¬∃x ¬P(x)\n∃x P(x)   ≡  ¬∀x ¬P(x)' },
        ],
        detailed: [{ type: 'p', text: '"Not everyone likes ice cream" means "someone does not like ice cream". Moving a negation across a quantifier flips ∀ and ∃.' }],
      },
    },
    {
      id: 'p08-07',
      kind: 'table',
      topic: 'FOL syntax',
      difficulty: 'foundational',
      questionStatus: 'original-worked-example',
      prompt: 'Classify each expression.',
      columns: ['Expression', 'Type'],
      rows: [
        [given('Dammam'), { accepted: ['Constant'], options: TERM }],
        [given('x'), { accepted: ['Variable'], options: TERM }],
        [given('FatherOf(Omar)'), { accepted: ['Function'], options: TERM }],
        [given('Taller(Omar, Ziad)'), { accepted: ['Predicate'], options: TERM }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Ask what the expression gives you: a fixed individual, a placeholder, an object computed from others, or a truth value.' }],
      },
    },
    {
      id: 'p08-08',
      kind: 'table',
      topic: 'FOL syntax',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'In ∀x (R(y, x) ∧ ∃y P(y, z)), is each variable occurrence free or bound?',
      columns: ['Occurrence', 'Status'],
      rows: [
        [given('x in R(y, x)'), { accepted: ['Bound'], options: SCOPE }],
        [given('y in R(y, x)'), { accepted: ['Free'], options: SCOPE }],
        [given('y in P(y, z)'), { accepted: ['Bound'], options: SCOPE }],
        [given('z in P(y, z)'), { accepted: ['Free'], options: SCOPE }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'x is bound by ∀x. ∃y covers only P(y, z), so the y in R(y, x) is outside its scope and free. Nothing binds z.' }],
        detailed: [{ type: 'p', text: 'The same variable name can be free in one place and bound in another, so judge each occurrence by the quantifier scope it sits in.' }],
        more: [
          {
            status: 'additional-clarification',
            blocks: [{ type: 'p', text: "Because y and z occur free, this is not a wff under this course's convention. In standard logic it is a wff but not a closed formula." }],
          },
        ],
      },
    },
    {
      id: 'p08-09',
      kind: 'logic',
      topic: 'Translating to FOL',
      difficulty: 'foundational',
      questionStatus: 'original-worked-example',
      prompt: 'Translate to FOL: "All surgeons are doctors." Use Surgeon(x) and Doctor(x).',
      accepted: ['∀x Surgeon(x) ⇒ Doctor(x)', '∀x (Surgeon(x) ⇒ Doctor(x))'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '∀x Surgeon(x) ⇒ Doctor(x)' }] },
    },
    {
      id: 'p08-10',
      kind: 'logic',
      topic: 'Translating to FOL',
      difficulty: 'foundational',
      questionStatus: 'original-worked-example',
      prompt: 'Translate to FOL: "Some engineers are poets." Use Engineer(x) and Poet(x).',
      accepted: ['∃x Engineer(x) ∧ Poet(x)', '∃x (Engineer(x) ∧ Poet(x))'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '∃x Engineer(x) ∧ Poet(x)' }] },
    },
    {
      id: 'p08-11',
      kind: 'logic',
      topic: 'Translating to FOL',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Translate to FOL: "No cat likes water." Use Cat(x), Likes(x, y) and the constant Water.',
      accepted: [
        '∀x Cat(x) ⇒ ¬Likes(x, Water)',
        '∀x (Cat(x) ⇒ ¬Likes(x, Water))',
        '¬∃x Cat(x) ∧ Likes(x, Water)',
        '¬∃x (Cat(x) ∧ Likes(x, Water))',
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '∀x Cat(x) ⇒ ¬Likes(x, Water)\n¬∃x (Cat(x) ∧ Likes(x, Water))' }],
        detailed: [{ type: 'p', text: 'Both forms are correct and equivalent. The second reads literally as "there is no x that is a cat and likes water".' }],
      },
    },
    {
      id: 'p08-12',
      kind: 'logic',
      topic: 'Translating to FOL',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Translate to FOL, where Admires(x, y) means "x admires y": "Everyone admires someone."',
      accepted: ['∀x ∃y Admires(x, y)'],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '∀x ∃y Admires(x, y)' }],
        detailed: [{ type: 'p', text: 'Because ∃y sits inside ∀x, y may be different for each x. Argument order follows the definition: the admirer comes first.' }],
      },
    },
    {
      id: 'p08-13',
      kind: 'logic',
      topic: 'Translating to FOL',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'Translate to FOL, where Knows(x, y) means "x knows y": "There is one song that everyone knows." Let y be the song.',
      accepted: ['∃y ∀x Knows(x, y)'],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '∃y ∀x Knows(x, y)' }],
        detailed: [{ type: 'p', text: 'Putting ∃y first fixes a single y that every x must know. ∀x ∃y Knows(x, y) would allow each person a different song.' }],
      },
    },
    {
      id: 'p08-14',
      kind: 'logic',
      topic: 'Quantifier duality',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Using duality, rewrite ∀x Passed(x) with ∃ instead of ∀.',
      accepted: ['¬∃x ¬Passed(x)'],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '¬∃x ¬Passed(x)' }],
        detailed: [{ type: 'p', text: '"Everyone passed" means "there is nobody who did not pass".' }],
      },
    },
    {
      id: 'p08-15',
      kind: 'logic',
      topic: 'Quantifiers',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'A student translated "Every nurse is trained" as ∀x Nurse(x) ∧ Trained(x). Write the corrected sentence.',
      accepted: ['∀x Nurse(x) ⇒ Trained(x)', '∀x (Nurse(x) ⇒ Trained(x))'],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '∀x Nurse(x) ⇒ Trained(x)' }],
        detailed: [{ type: 'p', text: 'The original says that everything in the domain is a nurse and is trained.' }],
      },
    },
    {
      id: 'p08-16',
      kind: 'table',
      topic: 'Quantifier order',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'The domain is {a, b}, and L(x, y) is true only for the two arrows shown: L(a, b) and L(b, a). Evaluate each sentence.',
      figure: {
        directed: true,
        width: 240,
        height: 80,
        nodes: [
          { id: 'a', label: 'a', x: 50, y: 40 },
          { id: 'b', label: 'b', x: 190, y: 40 },
        ],
        edges: [{ from: 'a', to: 'b', both: true, label: 'L' }],
      },
      columns: ['Sentence', 'Value'],
      rows: [
        [given('∀x ∃y L(x, y)'), { accepted: ['T'], options: TF }],
        [given('∃y ∀x L(x, y)'), { accepted: ['F'], options: TF }],
        [given('∃x ∃y L(x, y)'), { accepted: ['T'], options: TF }],
        [given('∀x ∀y L(x, y)'), { accepted: ['F'], options: TF }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        detailedStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Each element points to some element, so ∀x ∃y is true. No single y is pointed to by both a and b, so ∃y ∀x is false.' }],
        detailed: [{ type: 'p', text: 'y = b would need L(b, b), and y = a would need L(a, a), and neither holds. ∃x ∃y only needs one arrow. ∀x ∀y would need all four pairs. This small model shows concretely that the two quantifier orders differ.' }],
      },
    },
  ],
});
