import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'natural-language-processing-1',
  number: 10,
  title: 'Natural Language Processing (Part 1)',
  description:
    'What NLP is, the stages from words to meaning, the kinds of knowledge of language, the five kinds of ambiguity and how computers resolve them, and why NLP is interdisciplinary and hard.',
  source: { label: 'Lecture 10 · Part 1' },
  questions: [
    {
      id: 'ch10-q01',
      question: 'Which description best fits natural language processing?',
      options: [
        'Designing faster processors for language software',
        'Computer analysis of input in a human language, converting it into a useful representation',
        'Storing large collections of documents in databases',
        'Recording and compressing speech audio',
      ],
      correctAnswerIndex: 1,
      explanation:
        'NLP is the set of methods that make human language accessible to computers, so they can understand, interpret and respond to it.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q02',
      question: 'Why did Turing base his test of intelligence on language?',
      options: [
        'Language is easy for computers to process',
        'Machines naturally communicate in human language',
        'Language requires no knowledge of the world',
        'Language captures so much of intelligent behaviour',
      ],
      correctAnswerIndex: 3,
      explanation:
        'A speaker plans language to communicate knowledge, and a listener infers the intended meaning. Doing both well involves much of what we call intelligence.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q03',
      question: 'Splitting a text into paragraphs, sentences and words belongs to which step?',
      options: [
        'Lexical (morphological) analysis',
        'Syntactic analysis',
        'Semantic analysis',
        'Pragmatic analysis',
      ],
      correctAnswerIndex: 0,
      explanation:
        'Lexical analysis analyses the structure of words and divides the text into units such as sentences and tokens. Grammar is checked later, in syntactic analysis.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q04',
      question: 'The word string "dog the barked loudly the" is rejected as badly formed. Which stage rejects it?',
      options: ['Lexical analysis', 'Discourse integration', 'Syntactic analysis', 'Pragmatic analysis'],
      correctAnswerIndex: 2,
      explanation:
        'Syntactic analysis checks the words against the grammar and finds their structure. Every word is valid, but the order breaks the grammar.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch10-q05',
      question: 'The phrase "a square circle" is grammatical, but a system flags it as meaningless. Which stage does this?',
      options: ['Semantic analysis', 'Syntactic analysis', 'Lexical analysis', 'Discourse integration'],
      correctAnswerIndex: 0,
      explanation:
        'Semantic analysis checks the text for meaningfulness. The structure is fine, but the meanings of "square" and "circle" conflict.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch10-q06',
      question:
        '"Lina lost her keys. She found them under the sofa." Working out that "She" means Lina and "them" means the keys happens in…',
      options: ['lexical analysis', 'syntactic analysis', 'discourse integration', 'morphological analysis'],
      correctAnswerIndex: 2,
      explanation:
        'Discourse integration connects a sentence to the sentences around it, so a pronoun can be linked to what was mentioned earlier.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch10-q07',
      question: 'A system interprets "Could you pass the salt?" as a request, not a question about ability. Which stage does this?',
      options: ['Lexical analysis', 'Syntactic analysis', 'Morphological analysis', 'Pragmatic analysis'],
      correctAnswerIndex: 3,
      explanation:
        'Pragmatic analysis re-interprets what was said in terms of what was meant, using situation, tone and the speaker\'s intent.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q08',
      question: 'How many morphemes does the word "unkindness" contain?',
      options: ['One', 'Three', 'Two', 'Four'],
      correctAnswerIndex: 1,
      explanation: 'un- + kind + -ness: a prefix, a root and a suffix. A morpheme is the smallest unit of meaning.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch10-q09',
      question: 'Which area of knowledge of language concerns how words relate to the sounds that realise them?',
      options: ['Morphology', 'Syntax', 'Semantics', 'Phonology'],
      correctAnswerIndex: 3,
      explanation:
        'Phonology is about sounds. Morphology is about word structure, syntax about sentence structure, and semantics about meaning.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q10',
      question: 'What does part-of-speech (POS) tagging do?',
      options: [
        'Labels each token with its grammatical category, such as noun or verb',
        'Splits a text into sentences',
        'Links each pronoun to the noun it refers to',
        'Translates a sentence into another language',
      ],
      correctAnswerIndex: 0,
      explanation:
        'POS tagging labels each token with its grammatical role, which helps decide what each word does in the sentence and supports parsing.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q11',
      question: '"Kim sat on the bank and watched the fish." What kind of ambiguity does "bank" have, and how would a computer resolve it?',
      options: [
        'Syntactic ambiguity, resolved by building parse trees',
        'Lexical ambiguity, resolved by word sense disambiguation using nearby context words',
        'Referential ambiguity, resolved by coreference resolution',
        'Pragmatic ambiguity, resolved by intent classification',
      ],
      correctAnswerIndex: 1,
      explanation:
        '"Bank" has several senses while the grammar stays the same, so the ambiguity is lexical. Context words such as "fish" point to the river sense.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch10-q12',
      question: '"The chef cooked the fish with the lemon." The phrase "with the lemon" can attach to "cooked" or to "fish". What kind of ambiguity is this?',
      options: ['Lexical', 'Referential', 'Syntactic', 'Pragmatic'],
      correctAnswerIndex: 2,
      explanation:
        'The words are clear, but the sentence structure can be read in two ways. Attachment ambiguity of this kind is syntactic.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch10-q13',
      question: '"Sara told Huda that she had passed." It is unclear who "she" is. What kind of ambiguity is this?',
      options: ['Semantic', 'Referential', 'Lexical', 'Syntactic'],
      correctAnswerIndex: 1,
      explanation: 'Referential ambiguity is uncertainty about what a pronoun refers to. Here "she" could be Sara or Huda.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q14',
      question: 'Which technique links pronouns to the nouns they refer to?',
      options: ['Coreference resolution', 'Word sense disambiguation', 'Tokenization', 'Part-of-speech tagging'],
      correctAnswerIndex: 0,
      explanation:
        'Coreference resolution decides which earlier noun a pronoun points to, often using the previous sentence as evidence.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q15',
      question: 'In "I made him duck", why is the word "duck" ambiguous?',
      options: [
        'It is a misspelling of another word',
        'It is a pronoun',
        'It has no morphemes',
        'It can be read as a noun or as a verb',
      ],
      correctAnswerIndex: 3,
      explanation:
        '"Duck" can be the bird or food (noun) or the action of lowering your head (verb). Each choice gives a different reading of the sentence.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch10-q16',
      question: 'What is the main reason natural language understanding is hard for computers?',
      options: [
        'Languages have too few words',
        'Sentences are always short',
        'Language is inherently ambiguous, and computers lack common-sense knowledge',
        'Computers cannot store text',
      ],
      correctAnswerIndex: 2,
      explanation:
        'Ambiguity runs through every level of language. People resolve it with common sense, reasoning and experience, which computers lack unless they are taught.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q17',
      question: 'Which discipline contributes the question "How do we learn and understand language?" to NLP?',
      options: ['Computer science', 'Engineering', 'Philosophy', 'Psychology'],
      correctAnswerIndex: 3,
      explanation:
        'Psychology studies human language processing: learning, understanding and producing language. Philosophy instead asks what meaning is.',
      difficulty: 'intermediate',
    },
    {
      id: 'ch10-q18',
      question: 'Condensing a long report into a shorter text with the same meaning is an example of…',
      options: ['automatic summarization', 'information extraction', 'text classification', 'question answering'],
      correctAnswerIndex: 0,
      explanation:
        'Summarization reduces size while keeping the meaning. Information extraction pulls specific facts out of a text instead.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q19',
      question: 'In the taxonomy of computer science, natural language processing is a subfield of…',
      options: ['databases', 'networking', 'artificial intelligence', 'algorithms'],
      correctAnswerIndex: 2,
      explanation:
        'NLP sits under artificial intelligence, alongside fields such as robotics and search. Its applications include machine translation and information retrieval.',
      difficulty: 'foundational',
    },
    {
      id: 'ch10-q20',
      question: 'Which order matches the layers a system passes through to understand language?',
      options: [
        'Syntactic → morphological → semantic → discourse',
        'Morphological → syntactic → semantic → discourse',
        'Semantic → syntactic → morphological → discourse',
        'Morphological → semantic → syntactic → discourse',
      ],
      correctAnswerIndex: 1,
      explanation:
        'Words are analysed into morphemes first, then given a syntactic structure, then a context-independent meaning, which discourse processing turns into the final meaning.',
      difficulty: 'advanced',
    },
  ],
});
