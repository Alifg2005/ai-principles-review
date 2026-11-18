import { definePracticeSet } from '../../lib/practiceSchema';

const STAGES = ['Lexical', 'Syntactic', 'Semantic', 'Discourse', 'Pragmatic'];
const AMBIGUITY = ['Lexical', 'Syntactic', 'Semantic', 'Pragmatic', 'Referential'];
const DISCIPLINES = ['Linguistics', 'Computational linguistics', 'Computer science', 'Philosophy', 'Psychology', 'Engineering'];
const choose = (answer: string, options: string[]) => ({ accepted: [answer], options });

export default definePracticeSet({
  chapterId: 'natural-language-processing-1',
  questions: [
    {
      id: 'p10-01',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'What is NLP',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Define natural language processing, and state the forms its input and output can take.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'p',
            text: 'NLP is the computer analysis of input in a human language and its conversion into a useful representation, so computers can understand, interpret and respond to language. Input and output can be written text or speech.',
          },
        ],
      },
    },
    {
      id: 'p10-02',
      kind: 'written',
      answerStyle: 'steps',
      topic: 'Stages of processing',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'List the five general steps in NLP, with one phrase describing each.',
      answer: {
        shortStatus: 'course-concept',
        detailedStatus: 'original-worked-example',
        short: [
          {
            type: 'ol',
            items: [
              'Lexical (morphological): word structure; split text into sentences and tokens.',
              'Syntactic (parsing): grammatical structure.',
              'Semantic: meaning; check it makes sense.',
              'Discourse integration: connect to surrounding sentences.',
              'Pragmatic: intended meaning in context.',
            ],
          },
        ],
        detailed: [
          {
            type: 'p',
            text: '"Nora returned the laptop because it was broken." Lexical: tokens. Syntactic: subject Nora, verb returned, object the laptop. Semantic: return(Nora, laptop) with a reason. Discourse: "it" is the laptop. Pragmatic: the speaker is likely explaining or complaining.',
          },
        ],
      },
    },
    {
      id: 'p10-03',
      kind: 'written',
      answerStyle: 'definition',
      topic: 'Knowledge of language',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Define phonology, morphology, syntax and semantics, and give the definition of a morpheme.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Phonology: how words relate to their sounds.',
              'Morphology: how words are built from morphemes.',
              'Syntax: how words combine into correct sentences and phrases.',
              'Semantics: what words mean and how meanings combine; context-independent meaning.',
              'Morpheme: the smallest unit of meaning, e.g. un + happy + ness.',
            ],
          },
        ],
      },
    },
    {
      id: 'p10-04',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Why NLP is hard',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Explain why building NLP systems is hard.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Language is inherently ambiguous at every level.',
              'Systems need huge amounts of data and resources such as grammars and dictionaries.',
              'Analysing a sentence is computationally complex.',
              'Computers lack the common sense, reasoning and experience people use, unless taught.',
            ],
          },
        ],
      },
    },
    {
      id: 'p10-05',
      kind: 'written',
      answerStyle: 'explanation',
      topic: 'Ambiguity',
      difficulty: 'advanced',
      questionStatus: 'course-concept',
      prompt: 'Give three interpretations of "I made him duck", and explain which words cause the ambiguity.',
      mixUp:
        '"Visiting relatives can be boring" is sometimes called semantic ambiguity and sometimes syntactic ambiguity. Both views are defensible: the readings differ in meaning, and "visiting" can also be parsed as a verb or as a modifier.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'I cooked a duck for him.',
              'I created a toy duck that he owns.',
              'I caused him to lower his head quickly.',
              '"Duck" can be a noun or a verb; "made" can mean cooked, created or caused.',
            ],
          },
        ],
      },
    },
    {
      id: 'p10-06',
      kind: 'table',
      topic: 'Stages of processing',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Which stage of processing does each task belong to?',
      columns: ['Task', 'Stage'],
      rows: [
        [{ given: 'Splitting a paragraph into sentences and words' }, choose('Lexical', STAGES)],
        [{ given: 'Rejecting "cat the on sat mat the" as ungrammatical' }, choose('Syntactic', STAGES)],
        [{ given: 'Flagging "a square circle" as meaningless' }, choose('Semantic', STAGES)],
        [{ given: 'Deciding that "it" refers to the laptop mentioned in the previous sentence' }, choose('Discourse', STAGES)],
        [{ given: 'Reading "It\'s cold in here" as a request to close the window' }, choose('Pragmatic', STAGES)],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [
          {
            type: 'p',
            text: 'Tokens, then grammar, then meaning, then links between sentences, then intended meaning in the situation.',
          },
        ],
      },
    },
    {
      id: 'p10-07',
      kind: 'table',
      topic: 'Ambiguity',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Classify the ambiguity in each sentence.',
      columns: ['Sentence', 'Type of ambiguity'],
      rows: [
        [{ given: '"Kim saw a bat." (animal or sports bat?)' }, choose('Lexical', AMBIGUITY)],
        [{ given: '"I watched the girl with binoculars." (who has the binoculars?)' }, choose('Syntactic', AMBIGUITY)],
        [{ given: '"Ali told Omar he was late." (who was late?)' }, choose('Referential', AMBIGUITY)],
        [{ given: '"Do you know what time it is?" (yes or no, or the time?)' }, choose('Pragmatic', AMBIGUITY)],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [
          {
            type: 'ul',
            items: [
              'One word, several senses: lexical, resolved by word sense disambiguation.',
              'Phrase attachment: syntactic, resolved by parsing plus context.',
              'Pronoun reference: referential, resolved by coreference resolution.',
              'Literal versus intended meaning: pragmatic, resolved by intent recognition.',
            ],
          },
        ],
      },
    },
    {
      id: 'p10-08',
      kind: 'sequence',
      topic: 'Stages of processing',
      difficulty: 'intermediate',
      questionStatus: 'course-concept',
      prompt: 'Put the stages a system uses to understand a chatbot message in order, from raw text to action.',
      tokens: ['Semantic analysis', 'POS tagging', 'Final meaning (intent)', 'Morphological analysis', 'Discourse integration', 'Structure (parsing)'],
      expected: ['Morphological analysis', 'POS tagging', 'Structure (parsing)', 'Semantic analysis', 'Discourse integration', 'Final meaning (intent)'],
      answer: {
        shortStatus: 'course-concept',
        short: [{ type: 'p', text: 'Morphology, POS tagging, structure, semantics, discourse, then the final intent that drives an action.' }],
        steps: {
          columns: ['Stage', 'Output for "I can\'t print"'],
          rows: [
            ['Morphological analysis', 'I / can / not / print'],
            ['POS tagging', 'PRON, AUX, PART, VERB'],
            ['Structure (parsing)', 'subject = I, verb = print'],
            ['Semantic analysis', 'NEGATE(can(print(I)))'],
            ['Discourse integration', 'Linked to an earlier "printer is offline"'],
            ['Final meaning (intent)', 'printing_problem: offer troubleshooting'],
          ],
        },
      },
    },
    {
      id: 'p10-09',
      kind: 'table',
      topic: 'Morphology',
      difficulty: 'intermediate',
      questionStatus: 'original-worked-example',
      prompt: 'Split each word into its morphemes, joined with "+". Several notations are acceptable.',
      columns: ['Word', 'Morphemes'],
      rows: [
        [{ given: 'replayed' }, { accepted: ['re + play + ed'], selfCheck: true }],
        [{ given: 'kindness' }, { accepted: ['kind + ness'], selfCheck: true }],
        [{ given: 'unbreakable' }, { accepted: ['un + break + able'], selfCheck: true }],
      ],
      answer: {
        shortStatus: 'original-worked-example',
        short: [
          {
            type: 'ul',
            items: ['re- + play + -ed', 'kind + -ness', 'un- + break + -able'],
          },
        ],
        detailed: [
          {
            type: 'p',
            text: 'In each word the root carries the core meaning and the prefixes and suffixes modify it. Writing affixes as "re-" or "-ed" is common but optional.',
          },
        ],
        detailedStatus: 'original-worked-example',
      },
    },
    {
      id: 'p10-10',
      kind: 'table',
      topic: 'Interdisciplinary NLP',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'Which discipline contributes each question or task to NLP?',
      columns: ['Question or task', 'Discipline'],
      rows: [
        [{ given: 'How do words form phrases and sentences?' }, choose('Linguistics', DISCIPLINES)],
        [{ given: 'How can the structure of sentences be identified computationally?' }, choose('Computational linguistics', DISCIPLINES)],
        [{ given: 'Algorithms for automata and parsers' }, choose('Computer science', DISCIPLINES)],
        [{ given: 'What is meaning, and how do sentences acquire it?' }, choose('Philosophy', DISCIPLINES)],
        [{ given: 'How do we learn and understand language?' }, choose('Psychology', DISCIPLINES)],
        [{ given: 'Building question-answering systems' }, choose('Engineering', DISCIPLINES)],
      ],
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'p',
            text: 'Structure from linguistics, computation from computational linguistics and computer science, meaning from philosophy, human processing from psychology, and working systems from engineering.',
          },
        ],
      },
    },
    {
      id: 'p10-11',
      kind: 'written',
      answerStyle: 'list',
      topic: 'Applications',
      difficulty: 'foundational',
      questionStatus: 'course-concept',
      prompt: 'List five applications of NLP.',
      answer: {
        shortStatus: 'course-concept',
        short: [
          {
            type: 'ul',
            items: [
              'Text classification',
              'Machine translation',
              'Information extraction, e.g. from CVs',
              'Automatic summarization',
              'Question answering',
            ],
          },
        ],
        detailed: [
          { type: 'p', text: 'Others include indexing and searching large texts, speech understanding, knowledge acquisition and text or dialogue generation.' },
        ],
        detailedStatus: 'course-concept',
      },
    },
  ],
});
