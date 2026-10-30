import { z } from 'zod';
import { difficultySchema } from './schema';

const text = z.string().trim().min(1, 'must not be empty');

/** Rich answer content. Stored as data so question files never contain markup. */
export const tableDataSchema = z
  .object({ columns: z.array(text).min(1), rows: z.array(z.array(z.string())).min(1) })
  .superRefine((t, ctx) => {
    t.rows.forEach((row, i) => {
      if (row.length !== t.columns.length) {
        ctx.addIssue({ code: 'custom', message: `row ${i + 1} has ${row.length} cells`, path: ['rows', i] });
      }
    });
  });

export const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('p'), text }),
  z.object({ type: z.literal('ul'), items: z.array(text).min(1) }),
  z.object({ type: z.literal('ol'), items: z.array(text).min(1) }),
  z.object({ type: z.literal('formula'), text }),
  z.object({ type: z.literal('table'), table: tableDataSchema }),
]);

export const graphNodeSchema = z.object({
  id: text,
  label: text,
  x: z.number(),
  y: z.number(),
  shape: z.enum(['circle', 'box']).optional(),
  /** Box width in viewBox units. */
  w: z.number().positive().optional(),
  /** Box height in viewBox units. */
  h: z.number().positive().optional(),
  /** Small annotation beside the node, e.g. a heuristic value. */
  note: z.string().optional(),
  tone: z.enum(['goal', 'start', 'blank', 'env']).optional(),
});

export const graphEdgeSchema = z.object({
  from: text,
  to: text,
  label: z.string().optional(),
  dashed: z.boolean().optional(),
  /** Arrowheads at both ends, for two relations drawn on one line. */
  both: z.boolean().optional(),
});

export const graphSchema = z
  .object({
    directed: z.boolean(),
    width: z.number().positive(),
    height: z.number().positive(),
    nodes: z.array(graphNodeSchema).min(1),
    edges: z.array(graphEdgeSchema),
  })
  .superRefine((g, ctx) => {
    const ids = new Set<string>();
    g.nodes.forEach((n, i) => {
      if (ids.has(n.id)) ctx.addIssue({ code: 'custom', message: `duplicate node "${n.id}"`, path: ['nodes', i] });
      ids.add(n.id);
      if (n.x < 0 || n.x > g.width || n.y < 0 || n.y > g.height) {
        ctx.addIssue({ code: 'custom', message: `node "${n.id}" is outside the figure`, path: ['nodes', i] });
      }
    });
    g.edges.forEach((e, i) => {
      for (const end of [e.from, e.to]) {
        if (!ids.has(end)) ctx.addIssue({ code: 'custom', message: `edge uses unknown node "${end}"`, path: ['edges', i] });
      }
    });
  });

/**
 * What kind of content a section holds. Labelled per section of an answer, because one answer can
 * combine core material with clarification.
 */
export const sourceStatusSchema = z.enum([
  'course-concept',
  'additional-clarification',
  'original-worked-example',
]);

export const answerSchema = z
  .object({
  /** Always shown first when the answer is revealed. */
  short: z.array(blockSchema).min(1),
  shortStatus: sourceStatusSchema,
  /** Optional expansion behind "Show detailed answer". */
  detailed: z.array(blockSchema).min(1).optional(),
  detailedStatus: sourceStatusSchema.optional(),
  /** Further optional sections with a different source status from `detailed`. */
  more: z.array(z.object({ status: sourceStatusSchema, blocks: z.array(blockSchema).min(1) })).optional(),
  /** Rendered reference graph, tree or diagram. */
  figure: graphSchema.optional(),
  /** Important intermediate steps of an algorithm. */
  steps: tableDataSchema.optional(),
  })
  .superRefine((a, ctx) => {
    if (Boolean(a.detailed) !== Boolean(a.detailedStatus)) {
      ctx.addIssue({ code: 'custom', message: 'detailed and detailedStatus go together', path: ['detailedStatus'] });
    }
  });

/** Visible rules a search trace depends on, so the expected answer is not a guessing game. */
export const traceRulesSchema = z.object({
  /** Order in which children or neighbours are taken, and how ties are broken. */
  order: text,
  /** When the goal is recognised, and when the search stops. */
  goalTest: text,
});

const baseQuestion = {
  /** Stable identifier, e.g. `p03-07`. Never reuse or renumber. */
  id: z.string().regex(/^p\d{2}-\d{2}$/, 'must look like p03-07'),
  topic: text,
  difficulty: difficultySchema,
  prompt: text,
  /** Extra material the student needs, e.g. rules or a heuristic table. */
  context: z.array(blockSchema).optional(),
  /** Given diagram shown with the question. */
  figure: graphSchema.optional(),
  /** The kind of question. Reference figures and steps inherit this label. */
  questionStatus: z.enum(['course-concept', 'original-worked-example']),
  traceRules: traceRulesSchema.optional(),
  answer: answerSchema,
  /** A frequent confusion about this concept, shown as "Common mix-up". */
  mixUp: text.optional(),
};

const tableCellSchema = z.union([
  z.object({ given: z.string() }),
  z.object({
    /** Accepted answers, compared after notation normalisation. */
    accepted: z.array(text).min(1),
    options: z.array(text).min(2).optional(),
    /** Free response compared by the student, not auto-marked. */
    selfCheck: z.boolean().optional(),
  }),
]);

export const practiceQuestionSchema = z
  .discriminatedUnion('kind', [
    z.object({
      ...baseQuestion,
      kind: z.literal('written'),
      answerStyle: z.enum(['definition', 'comparison', 'explanation', 'steps', 'list']),
    }),
    z.object({
      ...baseQuestion,
      kind: z.literal('sequence'),
      /** Items the student places in order. With a figure these are its node labels. */
      tokens: z.array(text).min(2),
      expected: z.array(text).min(1),
      allowRepeats: z.boolean().optional(),
    }),
    z.object({
      ...baseQuestion,
      kind: z.literal('table'),
      columns: z.array(text).min(1),
      rows: z.array(z.array(tableCellSchema)).min(1),
    }),
    z.object({
      ...baseQuestion,
      kind: z.literal('complete'),
      figure: graphSchema,
      slots: z
        .array(z.object({ nodeId: text, options: z.array(text).min(2), expected: text }))
        .min(1),
    }),
    z.object({
      ...baseQuestion,
      kind: z.literal('construct'),
      directed: z.boolean(),
      /** Node labels offered to the student; omit to let them type their own. */
      nodeLabels: z.array(text).optional(),
      edgeLabels: z.array(text).optional(),
    }),
    z.object({
      ...baseQuestion,
      kind: z.literal('logic'),
      /** Reference forms. Other forms may still be correct, so a non-match is never marked wrong. */
      accepted: z.array(text).min(1),
    }),
    z.object({
      ...baseQuestion,
      kind: z.literal('draw'),
    }),
  ])
  .superRefine((q, ctx) => {
    const issue = (message: string, path: (string | number)[] = []) => ctx.addIssue({ code: 'custom', message, path });
    if (q.questionStatus === 'original-worked-example' && q.answer.shortStatus !== 'original-worked-example') {
      issue('the answer to an original worked example must carry the same label', ['answer', 'shortStatus']);
    }
    switch (q.kind) {
      case 'sequence': {
        for (const t of q.expected) if (!q.tokens.includes(t)) issue(`expected token "${t}" is not offered`, ['expected']);
        if (!q.allowRepeats && new Set(q.expected).size !== q.expected.length) {
          issue('expected order repeats a token but allowRepeats is off', ['expected']);
        }
        if (q.figure) {
          const labels = new Set(q.figure.nodes.map((n) => n.label));
          for (const t of q.tokens) if (!labels.has(t)) issue(`token "${t}" is not a node in the figure`, ['tokens']);
        }
        if (!q.answer.steps && !q.answer.detailed) issue('a trace needs steps or a detailed answer', ['answer']);
        break;
      }
      case 'table': {
        let blanks = 0;
        q.rows.forEach((row, i) => {
          if (row.length !== q.columns.length) issue(`row ${i + 1} has ${row.length} cells`, ['rows', i]);
          row.forEach((cell, j) => {
            if ('accepted' in cell) {
              blanks += 1;
              if (cell.options && !cell.accepted.every((a) => cell.options?.includes(a))) {
                issue('accepted answer is not among the options', ['rows', i, j]);
              }
            }
          });
        });
        if (blanks === 0) issue('table has nothing for the student to fill in', ['rows']);
        break;
      }
      case 'complete': {
        const ids = new Set(q.figure.nodes.map((n) => n.id));
        q.slots.forEach((s, i) => {
          if (!ids.has(s.nodeId)) issue(`slot uses unknown node "${s.nodeId}"`, ['slots', i]);
          if (!s.options.includes(s.expected)) issue('expected value is not among the options', ['slots', i]);
        });
        if (!q.answer.figure) issue('a completion needs a reference figure', ['answer', 'figure']);
        break;
      }
      case 'construct':
      case 'draw':
        if (!q.answer.figure) issue(`a ${q.kind} exercise needs a reference figure`, ['answer', 'figure']);
        break;
      default:
        break;
    }
  });

export const practiceSetSchema = z
  .object({
    /** Must match a chapter id in the canonical chapter registry. */
    chapterId: text,
    questions: z.array(practiceQuestionSchema).min(1),
  })
  .superRefine((set, ctx) => {
    const seen = new Set<string>();
    set.questions.forEach((q, i) => {
      if (seen.has(q.id)) ctx.addIssue({ code: 'custom', message: `duplicate id "${q.id}"`, path: ['questions', i] });
      seen.add(q.id);
    });
    if (!set.questions.some((q) => q.kind === 'written')) {
      ctx.addIssue({ code: 'custom', message: 'needs at least one written question', path: ['questions'] });
    }
    if (!set.questions.some((q) => q.kind !== 'written')) {
      ctx.addIssue({ code: 'custom', message: 'needs at least one practical question', path: ['questions'] });
    }
  });

export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type Block = z.infer<typeof blockSchema>;
export type TableData = z.infer<typeof tableDataSchema>;
export type Graph = z.infer<typeof graphSchema>;
export type GraphNode = z.infer<typeof graphNodeSchema>;
export type GraphEdge = z.infer<typeof graphEdgeSchema>;
export type PracticeQuestion = z.infer<typeof practiceQuestionSchema>;
export type PracticeKind = PracticeQuestion['kind'];
export type PracticeSet = z.infer<typeof practiceSetSchema>;
export type PracticeSetInput = z.input<typeof practiceSetSchema>;
export type TableQuestion = Extract<PracticeQuestion, { kind: 'table' }>;
export type SequenceQuestion = Extract<PracticeQuestion, { kind: 'sequence' }>;
export type CompleteQuestion = Extract<PracticeQuestion, { kind: 'complete' }>;
export type ConstructQuestion = Extract<PracticeQuestion, { kind: 'construct' }>;
export type LogicQuestion = Extract<PracticeQuestion, { kind: 'logic' }>;
export type TableCell = TableQuestion['rows'][number][number];

/** Typed identity helper for practice data files. Validation happens in the registry. */
export function definePracticeSet(set: PracticeSetInput): PracticeSetInput {
  return set;
}
