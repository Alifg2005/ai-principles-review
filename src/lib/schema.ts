import { z } from 'zod';

/** Every published chapter has exactly this many questions. */
export const QUESTIONS_PER_CHAPTER = 20;
/** Every question has exactly this many answer options. */
export const OPTIONS_PER_QUESTION = 4;

const nonEmpty = z.string().trim().min(1, 'must not be empty');

export const difficultySchema = z.enum(['foundational', 'intermediate', 'advanced']);

export const sourceReferenceSchema = z.object({
  /** Heading or topic in the source deck the question is grounded in. */
  section: nonEmpty,
  /** 1-based slide/page numbers in the source PDF. */
  pages: z.array(z.number().int().positive()).min(1),
});

export const questionSchema = z
  .object({
    /** Stable identifier, e.g. `ch02-q07`. Never reuse or renumber. */
    id: z.string().regex(/^ch\d{2}-q\d{2}$/, 'must look like ch02-q07'),
    question: nonEmpty,
    options: z.array(nonEmpty).length(OPTIONS_PER_QUESTION),
    correctAnswerIndex: z.number().int().min(0).max(OPTIONS_PER_QUESTION - 1),
    explanation: nonEmpty,
    difficulty: difficultySchema,
    sourceReference: sourceReferenceSchema.optional(),
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
    /** Lecture/topic number as used in the course. */
    number: z.number().int().positive(),
    title: nonEmpty,
    description: nonEmpty,
    source: z.object({
      /** Filename of the local-only PDF in course-materials/chapters/. Never shipped. */
      fileName: nonEmpty,
      /** Lecture label as printed in the source, e.g. "Topic 2". */
      label: nonEmpty,
      pageCount: z.number().int().positive(),
      /** Any caveat about extraction or numbering that reviewers should know. */
      note: nonEmpty.optional(),
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
      for (const page of q.sourceReference?.pages ?? []) {
        if (page > chapter.source.pageCount) {
          ctx.addIssue({
            code: 'custom',
            message: `source page ${page} exceeds pageCount ${chapter.source.pageCount}`,
            path: ['questions', i, 'sourceReference', 'pages'],
          });
        }
      }
    });
  });

export type Difficulty = z.infer<typeof difficultySchema>;
export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
export type ChapterInput = z.input<typeof chapterSchema>;

/** Typed identity helper for chapter data files. Validation happens in the registry. */
export function defineChapter(chapter: ChapterInput): ChapterInput {
  return chapter;
}
