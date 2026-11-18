import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'natural-language-processing-2',
  number: 11,
  title: 'Natural Language Processing (Part 2)',
  description:
    'Grammars and parsing, terminals and non-terminals, POS tagging, phrase structure rules and derivations, breaking up and labelling sentences, attachment ambiguity, word sense disambiguation, anaphora and pragmatics.',
  source: { label: 'Lecture 10 · Part 2' },
  questions: [
    {
      id: 'ch11-q01',
      question: 'What does parsing do?',
      options: [
        'Translates a sentence into another language',
        'Assigns a dictionary sense to each word',
        'Removes punctuation from the text',
        'Checks the sentence against the grammar and, if it is correct, returns a parse tree',
      ],
      correctAnswerIndex: 3,
      explanation:
        'A parser uses the grammar to decide whether a sentence is well formed and, if it is, builds a tree showing its structure.',
      difficulty: 'foundational',
    },
    {
      id: 'ch11-q02',
      question: 'Which description best fits a grammar?',
      options: [
        'A list of every sentence in the language',
        'A finite set of rules that generates all and only the sentences of a language and assigns them a structure',
        'A dictionary of word meanings',
        'A statistical model that tags words',
      ],
      correctAnswerIndex: 1,
      explanation:
        'A grammar is a finite set of rules. It generates every legal sentence, no illegal ones, and gives each one a structural description.',
      difficulty: 'foundational',
    },
    {
      id: 'ch11-q03',
      question: 'In the parse tree for "Omar reads the book", which node is a terminal?',
      options: ['S', 'NP', 'book', 'Det'],
      correctAnswerIndex: 2,
      explanation:
        'A terminal is a word that actually appears in the sentence. S and NP are non-terminals, and Det is a preterminal (a part-of-speech label).',
      difficulty: 'foundational',
    },
    {
      id: 'ch11-q04',
      question: 'What is a preterminal?',
      options: [
        'A part-of-speech category directly above a word, such as noun or verb',
        'The root node S of the tree',
        'Any phrase containing more than one word',
        'A punctuation mark at the end of a sentence',
      ],
      correctAnswerIndex: 0,
      explanation:
        'A preterminal sits between the phrase-level non-terminals and the terminal words. It is usually a part-of-speech tag.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch11-q05',
      question: '"Light" is a noun in "turn on the light" and a verb in "light a candle". What is the main purpose of POS tagging here?',
      options: [
        'Correcting spelling',
        'Translating the word',
        'Disambiguation: giving the word one correct tag for each occurrence',
        'Splitting the text into sentences',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Many words can take several parts of speech. The tagger must give each occurrence exactly one tag, decided from context.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch11-q06',
      question: 'In the verb phrase "can hit the ball", what is the word "can"?',
      options: ['A determiner', 'A preposition', 'An adjective', 'An auxiliary'],
      correctAnswerIndex: 3,
      explanation:
        'An auxiliary expresses necessity or possibility, like must, will, should, could, may or might. It combines with the main verb.',
      difficulty: 'foundational',
    },
    {
      id: 'ch11-q07',
      question: 'How should the phrase structure rule S → NP VP be read?',
      options: [
        'Rewrite S as an NP followed by a VP',
        'NP is a kind of S',
        'The VP must come before the NP',
        'S is a word that appears in the sentence',
      ],
      correctAnswerIndex: 0,
      explanation: 'Each rule X → Y is an instruction to rewrite X as Y, in the order given.',
      difficulty: 'foundational',
    },
    {
      id: 'ch11-q08',
      question:
        'Grammar: S → NP VP, NP → Det N, VP → V NP, Det → a | the, N → dog | cat, V → chased. Which sentence does it generate?',
      options: ['dog the chased cat', 'The dog chased a cat', 'The dog chased', 'Chased the dog a cat'],
      correctAnswerIndex: 1,
      explanation:
        'S → NP VP → Det N V NP → Det N V Det N gives "the dog chased a cat". "The dog chased" fails because VP → V NP needs an object.',
      difficulty: 'advanced',
    },
    {
      id: 'ch11-q09',
      question: 'What kind of phrase is "near the river"?',
      options: ['A prepositional phrase', 'A noun phrase', 'A verb phrase', 'An adjective phrase'],
      correctAnswerIndex: 0,
      explanation: 'It is a preposition ("near") followed by a noun phrase ("the river"): PP → P NP.',
      difficulty: 'foundational',
    },
    {
      id: 'ch11-q10',
      question: 'Which structure fits the phrase "fond of sweets"?',
      options: ['NP → N PP', 'VP → V PP', 'PP → P NP', 'ADJP → ADJ PP'],
      correctAnswerIndex: 3,
      explanation:
        'The head is the adjective "fond", followed by the prepositional phrase "of sweets", so it is an adjective phrase.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch11-q11',
      question: 'What can sequential breaking (sentence segmentation and tokenization) resolve on its own?',
      options: [
        'Lexical ambiguity in a word like "bat"',
        'Whether a question is really a request',
        'Sentence and token boundaries',
        'Which word a prepositional phrase attaches to',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Sequential breaking only finds where sentences, words and tokens begin and end. It cannot determine meaning, structure or intent.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch11-q12',
      question: 'Breaking "replanted" into re- + plant + -ed shows which technique?',
      options: [
        'Sequential breaking with categorical labelling',
        'Sequential breaking with morphological labelling',
        'Hierarchical breaking with functional labelling',
        'Discourse integration',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Morphological labelling splits words into a stem and affixes. It shows word formation, but not the word\'s part of speech.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch11-q13',
      question: 'In "Alex likes swimming", labelling "Alex" as Subject (rather than N) is an example of…',
      options: ['morphological labelling', 'categorical labelling', 'sequential breaking only', 'functional labelling'],
      correctAnswerIndex: 3,
      explanation:
        'Categorical labelling gives the word class (N). Functional labelling gives the grammatical role, such as subject or direct object.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch11-q14',
      question: 'Why is hierarchical breaking needed for the phrase "old men and women"?',
      options: [
        'It shows whether "old" applies to the men only or to both men and women',
        'It splits each word into morphemes',
        'It assigns a part of speech to each word',
        'It detects where the sentence ends',
      ],
      correctAnswerIndex: 0,
      explanation:
        'The two groupings, [old [men and women]] and [[old men] and women], mean different things. Only a hierarchical structure can show the difference.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch11-q15',
      question:
        'In "I saw a man with a telescope", take the reading in which the man has the telescope. Where does the phrase "with a telescope" attach?',
      options: [
        'To the VP, as an instrument',
        'To the NP "a man", as a modifier',
        'Directly to S',
        'To the auxiliary',
      ],
      correctAnswerIndex: 1,
      explanation:
        'When the man has the telescope, the PP describes the man, so it attaches inside the noun phrase. In the instrument reading it attaches to the VP.',
      difficulty: 'advanced',
    },
    {
      id: 'ch11-q16',
      question: '"The pitcher on the table was full of lemonade." Choosing the jug sense of "pitcher" over the baseball player is called…',
      options: ['part-of-speech tagging', 'parsing', 'word sense disambiguation', 'anaphora resolution'],
      correctAnswerIndex: 2,
      explanation:
        'Word sense disambiguation picks the correct meaning of a word using its context. A baseball player cannot be full of lemonade.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch11-q17',
      question: 'What is an expression whose interpretation depends on another expression in the context?',
      options: ['A morpheme', 'An anaphor (anaphora)', 'A preterminal', 'A terminal'],
      correctAnswerIndex: 1,
      explanation:
        'Anaphora is the use of an expression, such as "it" or "she", whose meaning depends on another expression in the context.',
      difficulty: 'foundational',
    },
    {
      id: 'ch11-q18',
      question: 'Mapping "find all the students who are taking AI" to a database query is an example of…',
      options: ['tokenization', 'POS tagging', 'parsing', 'semantic analysis'],
      correctAnswerIndex: 3,
      explanation:
        'Semantic analysis maps language onto a representation of its meaning, such as an SQL query or a predicate logic statement.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch11-q19',
      question: 'Which English sentence matches ∀x (Student(x) ∧ Studies(x) ⇒ Passes(x))?',
      options: [
        'Every student who studies passes.',
        'Some student studies and passes.',
        'Every student studies and passes.',
        'Anyone who passes has studied.',
      ],
      correctAnswerIndex: 0,
      explanation:
        'The domain is everything, the condition is "is a student and studies", and the conclusion is "passes". The last option reverses the implication.',
      difficulty: 'advanced',
    },
    {
      id: 'ch11-q20',
      question: 'Why can POS tagging alone not resolve the ambiguity in "I saw the man with the telescope"?',
      options: [
        'Some of the words cannot be tagged',
        'The sentence is too long to tag',
        'Tags label word categories but do not say which word a phrase attaches to',
        'The sentence contains unknown words',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Both readings have identical tags. The difference is in structure and roles, which needs parsing with functional labelling or context.',
      difficulty: 'advanced',
    },
  ],
});
