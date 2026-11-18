import { definePracticeSet, type Graph } from '../../lib/practiceSchema';

const CATEGORIES = ['S', 'NP', 'VP', 'Det', 'N', 'V'];
const POS = ['DET', 'ADJ', 'N', 'V', 'P', 'ADV', 'PRON'];
const ROLES = ['Subject', 'Verb', 'Indirect object', 'Direct object'];
const ATTACH = ['VP (verb)', 'NP (noun)'];

/** Parse tree for "the cat chased a dog", with selected category nodes optionally blanked. */
function catTree(labels: Record<string, string>, tone?: 'blank'): Graph {
  const cat = (id: string, fallback: string, x: number, y: number) => ({
    id,
    label: labels[id] ?? fallback,
    x,
    y,
    ...(labels[id] && tone ? { tone } : {}),
  });
  const word = (id: string, label: string, x: number, y: number) => ({
    id,
    label,
    x,
    y,
    shape: 'box' as const,
    w: 58,
    h: 26,
    tone: 'env' as const,
  });
  return {
    directed: false,
    width: 440,
    height: 330,
    nodes: [
      cat('s', 'S', 220, 25),
      cat('np1', 'NP', 110, 90),
      cat('vp', 'VP', 320, 90),
      cat('det1', 'Det', 70, 160),
      cat('n1', 'N', 150, 160),
      cat('v', 'V', 250, 160),
      cat('np2', 'NP', 380, 160),
      cat('det2', 'Det', 340, 230),
      cat('n2', 'N', 410, 230),
      word('w1', 'the', 70, 230),
      word('w2', 'cat', 150, 230),
      word('w3', 'chased', 250, 230),
      word('w4', 'a', 340, 300),
      word('w5', 'dog', 405, 300),
    ],
    edges: [
      { from: 's', to: 'np1' },
      { from: 's', to: 'vp' },
      { from: 'np1', to: 'det1' },
      { from: 'np1', to: 'n1' },
      { from: 'vp', to: 'v' },
      { from: 'vp', to: 'np2' },
      { from: 'np2', to: 'det2' },
      { from: 'np2', to: 'n2' },
      { from: 'det1', to: 'w1' },
      { from: 'n1', to: 'w2' },
      { from: 'v', to: 'w3' },
      { from: 'det2', to: 'w4' },
      { from: 'n2', to: 'w5' },
    ],
  };
}

const GRAMMAR = [
  'S → NP VP',
  'NP → Det N',
  'VP → V NP',
  'Det → the | a',
  'N → cat | dog',
  'V → chased',
];

export default definePracticeSet({
  chapterId: 'natural-language-processing-2',
  questions: [
    {
      id: 'p11-01',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Grammars and parsing',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'What is a grammar, and what does a parser do with it?',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Grammar: a finite set of rules that generates all and only the sentences of a language and gives each a structure.',
              'Parser: checks a sentence against the grammar and, if it is correct, returns a parse tree showing how its words group together.',
            ],
          },
        ],
      },
    },
    {
      id: 'p11-02',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Grammars and parsing',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Distinguish non-terminals, preterminals and terminals in a parse tree, with an example of each.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Non-terminal: a category that builds structure but never appears in the sentence, e.g. S, NP, VP.',
              'Preterminal: a part-of-speech tag directly above a word, e.g. Det or N.',
              'Terminal: an actual word of the sentence, e.g. "apple".',
            ],
          },
        ],
      },
    },
    {
      id: 'p11-03',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'POS tagging',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Why is POS tagging needed, and why is it a disambiguation problem?',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Parsing needs to know which words are nouns, verbs and modifiers before it can build structure.',
              'Many words can take several parts of speech ("books" as noun or verb), so the tagger must choose one correct tag per occurrence from context.',
            ],
          },
        ],
      },
    },
    {
      id: 'p11-04',
      kind: 'written',
      answerStyle: 'comparison',
      topic: 'Breaking up and labelling',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Compare sequential and hierarchical breaking up, and categorical and functional labelling.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Sequential: splits text left to right into units; no structure.',
              'Hierarchical: splits into phrases, then words; produces a tree.',
              'Categorical labelling: gives word classes (N, V, Det).',
              'Functional labelling: gives roles (subject, verb, object).',
            ],
          },
        ],
        detailed: [
          {
            type: 'p',
            text: 'Morphological labelling is a third option: it marks stems and affixes, as in solve + -ed. Combining hierarchical breaking with categorical or functional labelling is the most powerful, because structure plus roles can separate readings that a flat word list cannot.',
          },
        ],
        detailedStatus: 'course-concept',
      },
    },
    {
      id: 'p11-05',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Semantics and discourse',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Explain word sense disambiguation and anaphora, with an example of each.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Word sense disambiguation: choosing a word\'s correct meaning from its context, e.g. "diamond" as a gemstone when it shimmers.',
              'Anaphora: an expression whose meaning depends on another expression in context, e.g. "it" in "Bill had a balloon. John wanted it."',
            ],
          },
        ],
      },
    },
    {
      id: 'p11-06',
      kind: 'sequence',
      topic: 'Derivation',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'Derive "the cat chased a dog" from the grammar. Always rewrite the leftmost non-terminal, and give the rules in the order used.',
      context: [{ type: 'ul', items: GRAMMAR }],
      tokens: ['S → NP VP', 'NP → Det N', 'VP → V NP', 'Det → the', 'Det → a', 'N → cat', 'N → dog', 'V → chased'],
      allowRepeats: true,
      expected: ['S → NP VP', 'NP → Det N', 'Det → the', 'N → cat', 'VP → V NP', 'V → chased', 'NP → Det N', 'Det → a', 'N → dog'],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'Nine rewrites, always on the leftmost non-terminal. NP → Det N is used twice, once for each noun phrase.' }],
        steps: {
          columns: ['Rule', 'String after rewriting'],
          rows: [
            ['S → NP VP', 'NP VP'],
            ['NP → Det N', 'Det N VP'],
            ['Det → the', 'the N VP'],
            ['N → cat', 'the cat VP'],
            ['VP → V NP', 'the cat V NP'],
            ['V → chased', 'the cat chased NP'],
            ['NP → Det N', 'the cat chased Det N'],
            ['Det → a', 'the cat chased a N'],
            ['N → dog', 'the cat chased a dog'],
          ],
        },
      },
    },
    {
      id: 'p11-07',
      kind: 'complete',
      topic: 'Parse trees',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Complete the parse tree for "the cat chased a dog".',
      figure: catTree({ np1: '1', vp: '2', v: '3', np2: '4', n2: '5' }, 'blank'),
      slots: [
        { nodeId: 'np1', options: CATEGORIES, expected: 'NP' },
        { nodeId: 'vp', options: CATEGORIES, expected: 'VP' },
        { nodeId: 'v', options: CATEGORIES, expected: 'V' },
        { nodeId: 'np2', options: CATEGORIES, expected: 'NP' },
        { nodeId: 'n2', options: CATEGORIES, expected: 'N' },
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'S splits into the subject NP and the VP; the VP holds the verb and the object NP. Each NP is a determiner plus a noun.' }],
        figure: catTree({}),
      },
    },
    {
      id: 'p11-08',
      kind: 'table',
      topic: 'POS tagging',
      difficulty: 'foundational',
      questionStatus: 'original-worked-example',
      prompt: 'Tag each word of "The small dog chased a red ball."',
      columns: ['Word', 'Tag'],
      rows: [
        [{ given: 'The' }, { accepted: ['DET'], options: POS }],
        [{ given: 'small' }, { accepted: ['ADJ'], options: POS }],
        [{ given: 'dog' }, { accepted: ['N'], options: POS }],
        [{ given: 'chased' }, { accepted: ['V'], options: POS }],
        [{ given: 'a' }, { accepted: ['DET'], options: POS }],
        [{ given: 'red' }, { accepted: ['ADJ'], options: POS }],
        [{ given: 'ball' }, { accepted: ['N'], options: POS }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'formula', text: 'DET ADJ N V DET ADJ N' }],
      },
    },
    {
      id: 'p11-09',
      kind: 'table',
      topic: 'Functional labelling',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Give the grammatical role of each part of "Mona gave Ali a book."',
      mixUp:
        'In "They called her a taxi", meaning "named her a taxi", "her" is the direct object and "a taxi" is an object complement, not an indirect object. In the reading "called a taxi for her", "her" is the indirect object and "a taxi" the direct object.',
      columns: ['Part', 'Role'],
      rows: [
        [{ given: 'Mona' }, { accepted: ['Subject'], options: ROLES }],
        [{ given: 'gave' }, { accepted: ['Verb'], options: ROLES }],
        [{ given: 'Ali' }, { accepted: ['Indirect object'], options: ROLES }],
        [{ given: 'a book' }, { accepted: ['Direct object'], options: ROLES }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'The book is what is given (direct object); Ali receives it (indirect object). Roles say who does what to whom, which categories alone do not.' }],
      },
    },
    {
      id: 'p11-10',
      kind: 'table',
      topic: 'Attachment ambiguity',
      difficulty: 'advanced',
      questionStatus: 'original-worked-example',
      prompt: 'For the most natural reading of each sentence, does the prepositional phrase attach to the verb phrase or to the noun phrase?',
      mixUp:
        '"I saw a man with a telescope" is genuinely ambiguous: both attachments are grammatical. Functional labelling records which reading was chosen, but context, not the labelling itself, decides between them.',
      columns: ['Sentence', 'Attaches to'],
      rows: [
        [{ given: 'She ate the soup with a spoon.' }, { accepted: ['VP (verb)'], options: ATTACH }],
        [{ given: 'She ate the soup with noodles.' }, { accepted: ['NP (noun)'], options: ATTACH }],
        [{ given: 'We bought the house with a garden.' }, { accepted: ['NP (noun)'], options: ATTACH }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [
          {
            type: 'p',
            text: 'A spoon is an instrument for eating, so it attaches to the VP. Noodles and a garden describe the soup and the house, so they attach to the NP. World knowledge decides here, not the tags.',
          },
        ],
      },
    },
    {
      id: 'p11-11',
      kind: 'logic',
      topic: 'Semantics in logic',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Write "Every student who studies passes" in predicate logic, using Student(x), Studies(x) and Passes(x).',
      accepted: [
        '∀x Student(x) ∧ Studies(x) ⇒ Passes(x)',
        '∀x (Student(x) ∧ Studies(x) ⇒ Passes(x))',
        '∀x ((Student(x) ∧ Studies(x)) ⇒ Passes(x))',
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'formula', text: '∀x ((Student(x) ∧ Studies(x)) ⇒ Passes(x))' }],
        detailed: [
          {
            type: 'p',
            text: 'The domain is everyone, the condition is "is a student and studies", and the conclusion is "passes". Reading in the other direction gives the English back: for every x, if x is a student who studies, x passes.',
          },
        ],
        detailedStatus: 'original-worked-example',
      },
    },
    {
      id: 'p11-12',
      kind: 'written',
      answerStyle: 'steps',
      topic: 'Semantics in logic',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Translate ∀x (Person(x) ∧ Likes(x, Coffee) ⇒ Awake(x)) into natural English, showing the steps.',
      answer: {
        shortStatus: 'original-worked-example',
        short: [
          {
            type: 'ol',
            items: [
              'Domain: all people.',
              'Condition: the person likes coffee.',
              'Conclusion: the person is awake.',
              'English: "Every person who likes coffee is awake."',
            ],
          },
        ],
      },
    },
    {
      id: 'p11-13',
      kind: 'draw',
      topic: 'Parse trees',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Draw the parse tree for "Young Sara left early." Label each node with its category.',
      answer: {
        shortStatus: 'original-worked-example',
        short: [{ type: 'p', text: 'S → NP VP. The NP is an adjective plus a noun; the VP is a verb plus an adverb.' }],
        figure: {
          directed: false,
          width: 360,
          height: 250,
          nodes: [
            { id: 's', label: 'S', x: 180, y: 25 },
            { id: 'np', label: 'NP', x: 95, y: 90 },
            { id: 'vp', label: 'VP', x: 265, y: 90 },
            { id: 'adj', label: 'Adj', x: 55, y: 155 },
            { id: 'n', label: 'N', x: 135, y: 155 },
            { id: 'v', label: 'V', x: 225, y: 155 },
            { id: 'adv', label: 'Adv', x: 305, y: 155 },
            { id: 'w1', label: 'Young', x: 55, y: 220, shape: 'box', w: 62, h: 26, tone: 'env' },
            { id: 'w2', label: 'Sara', x: 135, y: 220, shape: 'box', w: 62, h: 26, tone: 'env' },
            { id: 'w3', label: 'left', x: 225, y: 220, shape: 'box', w: 62, h: 26, tone: 'env' },
            { id: 'w4', label: 'early', x: 305, y: 220, shape: 'box', w: 62, h: 26, tone: 'env' },
          ],
          edges: [
            { from: 's', to: 'np' },
            { from: 's', to: 'vp' },
            { from: 'np', to: 'adj' },
            { from: 'np', to: 'n' },
            { from: 'vp', to: 'v' },
            { from: 'vp', to: 'adv' },
            { from: 'adj', to: 'w1' },
            { from: 'n', to: 'w2' },
            { from: 'v', to: 'w3' },
            { from: 'adv', to: 'w4' },
          ],
        },
      },
    },
    {
      id: 'p11-14',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Breaking up and labelling',
      difficulty: 'advanced',
      questionStatus: 'course-concept',
      prompt: 'Explain why sequential breaking cannot resolve the ambiguity in "I saw a man with a telescope", and what can.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Sequential breaking gives only I | saw | a | man | with | a | telescope, the same for both readings.',
              'Hierarchical breaking shows where the PP attaches: to the VP (instrument) or inside the NP (the man has it).',
              'Functional labels, plus context, select the intended reading.',
            ],
          },
        ],
      },
    },
  ],
});
