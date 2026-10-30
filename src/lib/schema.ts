import { z } from 'zod';

/** Every published chapter has exactly this many questions. */
export const QUESTIONS_PER_CHAPTER = 20;
/** Every question has exactly this many answer options. */
export const OPTIONS_PER_QUESTION = 4;

const nonEmpty = z.string().trim().min(1, 'must not be empty');

export const difficultySchema = z.enum(['foundational', 'intermediate', 'advanced']);

export const questionSchema = z
  .object({
    /** Stable identifier, e.g. `ch02-q07`. Never reuse or renumber. */
    id: z.string().regex(/^ch\d{2}-q\d{2}$/, 'must look like ch02-q07'),
    question: nonEmpty,
    options: z.array(nonEmpty).length(OPTIONS_PER_QUESTION),
    correctAnswerIndex: z.number().int().min(0).max(OPTIONS_PER_QUESTION - 1),
    explanation: nonEmpty,
    /** Optional note beyond the core material, shown after submission behind its own control. */
    clarification: nonEmpty.optional(),
    difficulty: difficultySchema,
  })
  .superRefine((q, ctx) => {
    const normalised = q.options.map((o) => o.trim().toLowerCase());
    if (new Set(normalised).size !== normalised.length) {
      ctx.addIssue({ code: 'custom', message: 'options must be unique', path: ['options'] });
    }
  });

export const chapterSchema = z
  .object({
    /** URL-safe, unique slug, e.g. `intelligent-agents`. */
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase kebab-case slug'),
    /** Chapter number as used in the course. */
    number: z.number().int().positive(),
    title: nonEmpty,
    description: nonEmpty,
    source: z.object({
      /** Chapter label shown in the library, e.g. "Topic 2". */
      label: nonEmpty,
    }),
    questions: z.array(questionSchema).length(QUESTIONS_PER_CHAPTER),
  })
  .superRefine((chapter, ctx) => {
    const prefix = `ch${String(chapter.number).padStart(2, '0')}-`;
    const ids = new Set<string>();
    const texts = new Set<string>();
    chapter.questions.forEach((q, i) => {
      if (ids.has(q.id)) {
        ctx.addIssue({ code: 'custom', message: `duplicate question id "${q.id}"`, path: ['questions', i, 'id'] });
      }
      ids.add(q.id);
      if (!q.id.startsWith(prefix)) {
        ctx.addIssue({
          code: 'custom',
          message: `question id "${q.id}" must start with "${prefix}"`,
          path: ['questions', i, 'id'],
        });
      }
      const text = q.question.trim().toLowerCase();
      if (texts.has(text)) {
        ctx.addIssue({ code: 'custom', message: 'duplicate question text', path: ['questions', i, 'question'] });
      }
      texts.add(text);
    });
  });

export type Difficulty = z.infer<typeof difficultySchema>;
export type Question = z.infer<typeof questionSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
export type ChapterInput = z.input<typeof chapterSchema>;

/** Typed identity helper for chapter data files. Validation happens in the registry. */
export function defineChapter(chapter: ChapterInput): ChapterInput {
  return chapter;
}
