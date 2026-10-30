# AGENTS.md: AI Principles Review

This file is the **permanent source of truth** for how this project is built and changed.
Every coding agent and contributor must follow it. Where another document disagrees with this
file, this file wins. `docs/CHAPTER_WORKFLOW.md` explains *how to apply* these rules when adding
a chapter; it does not add new rules.

---

## 1. Purpose

AI Principles Review (visual identity **MIND//LAB**) is a static, chapter-based study app for the
university course *Artificial Intelligence: Principles and Techniques* (ARTI 401). Students pick a
chapter, answer exactly 20 multiple-choice questions, submit, and review a scored, explained
breakdown. Quiz content is written during development from the course lecture PDFs; nothing
AI-related runs at quiz time.

## 2. Architecture

```
src/
├── app/            App shell, minimal History-API router (router.ts) and <Link>
├── components/     Reusable presentational components (header, footer, rows, motifs, ring…)
├── config/site.ts  ALL editable personal/academic info (author, course)
├── data/chapters/  One file per chapter + index.ts (THE canonical registry) + registry.test.ts
├── data/practice/  Written & Practical questions per chapter + index.ts + practice.test.ts
├── hooks/          useTheme, useDocumentTitle
├── lib/            schema.ts (zod), registry.ts (validation), chapters.ts (loaded data),
│                   quiz.ts (reducer + scoring), format.ts (display helpers),
│                   practiceSchema.ts, practiceRegistry.ts, practice.ts, practiceCheck.ts, graphLayout.ts
├── pages/          HomePage, QuizPage → QuizSession → ResultsView, NotFoundPage
├── styles/         index.css: Tailwind v4 + design tokens
└── test/           Integration tests (RTL) and setup
scripts/verify-build.mjs   Post-build copyright safeguard
course-materials/          LOCAL ONLY, git-ignored, never shipped
```

- Routes: `/` (home + libraries), `/chapters/:id` (quiz, then results in the same view),
  `/practice/:chapterId` (question list), `/practice/:chapterId/:questionId` (one question), anything
  else → 404. `vercel.json` rewrites every path to `index.html`.
- Data flow: `data/chapters/index.ts` → `lib/registry.ts#validateRegistry` → `lib/chapters.ts`
  → pages. Pages never import chapter files directly.
- Quiz state is a pure reducer (`lib/quiz.ts`) held in memory per attempt. Retry = remount with a
  new key. Scoring is `scoreQuiz(chapter, answers)`: deterministic, pure, keyed by question id.

## 3. Approved stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 (`@tailwindcss/vite`) · lucide-react ·
zod (runtime schema) · Vitest + React Testing Library + jsdom · ESLint (typescript-eslint,
react-hooks). Package manager: **npm** (keep `package-lock.json`).

**Do not add:** a backend, database, authentication, runtime AI/LLM calls, server environment
variables, analytics, global state libraries, a routing library, a component library, accounts,
leaderboards, chatbots, forums or admin panels. New dependencies need a concrete reason that the
existing stack cannot meet.

## 4. Coding conventions

- TypeScript strict mode incl. `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. No
  `any`, no `@ts-ignore`/`@ts-expect-error`, no `eslint-disable` to silence real problems.
- Types for chapter data come from zod (`z.infer`) in `lib/schema.ts`; do not duplicate them.
- Small focused modules; business logic lives in `lib/`, never inside components.
- No effects for derived state. Effects only sync with the outside world (document title,
  focus, media queries).
- No chapter-specific UI, no per-chapter pages, no hard-coded chapter lists in components.
- No dead buttons, fake interactions, placeholder screens or broken links.
- Match existing naming, comment density and formatting (2 spaces, single quotes, 120 cols).

## 5. Design system

Concept: *contemporary scientific editorial design meets an experimental AI laboratory.*

- **Tokens** live in `src/styles/index.css` as CSS variables, switched by
  `html[data-theme="dark"]`, and exposed to Tailwind via `@theme` (`bg-bg`, `bg-surface`,
  `bg-surface-2`, `border-line`, `border-line-strong`, `text-ink`, `text-muted`, `bg-accent`,
  `text-on-accent`, `*-correct`, `*-wrong`, `*-skip` and their `-soft` variants).
  Never use raw hex values or Tailwind palette colours in components.
- **Light:** warm paper `#f4f0e6`, charcoal ink, deep forest-green accent `#1f4d34`.
  **Dark:** ink black `#0b0c0a`, charcoal surfaces, acid-lime accent `#c6f432`.
- **Type:** Instrument Serif (`font-display`) for editorial headlines and big numerals; Geist
  (`font-sans`) for body; Geist Mono (`font-mono`) for labels, counters and metadata
  (`.eyebrow` utility for small uppercase labels).
- **Motifs:** the faint `.lab-grid` engineering-paper background, the `NeuralFigure` plate, and
  the seeded `ChapterMotif` per chapter. Use CSS/SVG/typography only, never generated images.
- **Shape:** rounded-full buttons (`btn btn-primary`, `btn btn-ghost`), `rounded-xl/2xl` cards,
  1px `line` borders, at most one soft shadow on the hero figure.
- **Avoid:** purple/blue AI gradients, glassmorphism, glows, repetitive identical card grids,
  heavy animation.
- **Motion:** short, ease-out (`--ease-out-soft`), opacity/transform only. Every animation must
  be neutralised by the global `prefers-reduced-motion` rule.
- Both themes must be complete for every new UI state. Correct/incorrect/unanswered must never be
  conveyed by colour alone (always pair with an icon or text).

## 6. Component reuse

Reuse before creating: `ChapterRow`, `ChapterMotif`, `QuestionNavigator`, `ScoreRing`, `GraphFigure`, `Blocks`,
`ThemeToggle`, `SiteHeader`/`SiteFooter`/`BrandMark`, `NotFoundPage`, `Link`. A new chapter must
**never** require touching anything in `components/`, `pages/` or `app/`.

## 7. Chapter data schema

Defined in `src/lib/schema.ts` (zod) and enforced by `validateRegistry`:

| Field | Rule |
| --- | --- |
| `id` | unique kebab-case slug, used in the URL |
| `number` | positive integer, unique, the lecture/topic number from the source |
| `title`, `description` | non-empty; title from the source deck |
| `source.label` | chapter label (e.g. "Topic 2"). The only source field allowed in shipped data |
| `questions` | **exactly 20** |
| `question.id` | `chNN-qMM`, NN = zero-padded chapter number; unique; never renumbered |
| `question.question` | non-empty, unique within the chapter |
| `question.options` | **exactly 4**, non-empty, unique (case-insensitive) |
| `question.correctAnswerIndex` | integer 0–3 |
| `question.explanation` | non-empty, concise (1–3 sentences) |
| `question.clarification` | optional note beyond the lecture, shown after submission behind its own control |
| `question.difficulty` | `foundational` \| `intermediate` \| `advanced` |

Chapter files: `src/data/chapters/NN-slug.ts`, default-exporting `defineChapter({...})`.
Registration: import + append in `src/data/chapters/index.ts`. That is the **only** registry.

## 7a. Written & Practical Review

A separate question bank in `src/data/practice/NN-slug.ts` (`definePracticeSet`), registered in
`src/data/practice/index.ts`, schema in `lib/practiceSchema.ts`. Question content never goes in
components. The multiple-choice rules (exactly 20, four options) do not apply; the count follows
the material.

- **Kinds:** `written`, `sequence` (trace or ordering), `table`, `complete` (diagram completion),
  `construct` (graph builder), `logic` (symbolic input), `draw` (freehand). Use the simplest kind
  that fits the task, and `draw` only when a task really is a drawing.
- **Answers:** `answer.short` is always shown first and must stay concise (75 words at most, tested).
  `answer.detailed` is optional and must add to the short answer, not repeat it. Add `figure` for
  a rendered reference and `steps` for intermediate algorithm states.
- **Content labels:** every answer section carries one of three labels: `course-concept`,
  `additional-clarification` or `original-worked-example`. Set `shortStatus` and `detailedStatus`, and
  put content of a different kind in `more`. `questionStatus` labels the question and its reference
  figure and steps.
- **Source errors and conventions:** never copy an error silently. Present the correct concept directly;
  use `mixUp` ("Common mix-up") for a frequent confusion, in neutral wording. Name an unusual definition
  as this course's convention.
- **Search traces:** `traceRules` must state order, tie-breaking and goal-test timing before the
  student starts.
- **Several defensible answers:** state the assumptions before the student answers and say so in the
  answer. If reliable marking is not possible, use `selfCheck` cells so nothing is marked wrong.
- **Accuracy:** add a check to `data/practice/practice.test.ts` that recomputes every algorithm
  trace, truth table or evaluation from the question's own data.
- **Marking:** `logic` must never call a non-matching answer wrong, because equivalent forms exist.
  Work is held in memory only (`usePracticeWork`); nothing is persisted.

## 8. Quiz-generation standards

- Ground every question in the supplied PDF. Do not use general knowledge to fill gaps.
- Cover the chapter's learning objectives across: foundational recall, conceptual
  understanding, comparisons, applied scenarios, and reasoning/tracing (e.g. search traces,
  truth tables, FOL translations). Aim for roughly 30–40% foundational, 35–45% intermediate and
  20–30% advanced, adapted to the material.
- Four plausible options; distractors should be real misconceptions or neighbouring concepts
  from the same chapter. No "all/none of the above", no joke options, no giveaway length.
- Exactly one defensibly correct answer. Avoid ambiguous wording; use "NOT" sparingly and in caps.
- Spread correct positions: each index 3–7 times per chapter, never three identical in a row
  (enforced by tests). Choose positions deliberately; do not leave them all at A.
- Explanations state *why* the answer is right (and, where useful, why a tempting distractor is
  wrong) without contradicting the source.
- Check each answer against the source, but do not cite slides, filenames or page numbers in shipped data.
- No duplicates or near-duplicates testing the same fact.

## 9. Source-material protection (mandatory)

- Original PDFs/slides live **only** in `course-materials/chapters/` (git-ignored).
- `.gitignore` must keep: `/course-materials/`, `*.pdf`, `*.ppt`, `*.pptx`, `*.doc`, `*.docx`,
  `*.key`, `/dist/`, `/node_modules/`, `.env*` (except `.env.example`). Do not weaken these rules.
  If a legitimately publishable document is ever needed, add a narrowly scoped negation for that
  one path and justify it in the PR.
- `.vercelignore` mirrors the document exclusions for CLI deploys.
- Never copy, import, `fetch` or link source documents from `src/`, `public/` or any build
  input. Never generate public URLs for them.
- Extract text to a temporary location **outside the repository** (e.g. the OS temp directory).
  Never commit extracted text.
- If source files are ever found tracked: `git rm --cached <file>` (keeps the local copy), report
  it, and check history with `git log --all -- '*.pdf' course-materials`. **Do not rewrite shared
  history or delete remote files without the owner's explicit authorisation.**
- Shipped data must not contain source filenames, page counts, slide numbers or internal processing
  notes. Report such details in the completion report instead.
- `npm run build` runs `scripts/verify-build.mjs`, which fails if restricted files or source metadata
  are in `dist/`, or if restricted files are tracked or not ignored. Never bypass or weaken it.

## 10. Copyright-aware content

Quiz questions and explanations must be **original wording** that tests understanding. Do not
reproduce lecture text, textbook passages, diagrams or extended lecture-specific examples. Short
technical terms, standard notation, and brief references to well-known textbook examples
(e.g. "the Romania map", "the Wumpus world") are acceptable. Prefer original scenarios. If
generated content seems to track the source too closely, rewrite it or flag it in the
completion report.

## 11. Content validation

Content is valid only when `npm run validate` (= `vitest run src/data`) passes: schema,
uniqueness, 20×4 structure, answer-index range, answer-position spread, difficulty mix, absence of
source metadata, and one registry entry per data file. Additionally, before publishing,
manually re-check every answer key against the cited slides.

## 12. Required checks before declaring work done

```
npm run typecheck   # tsc -b, zero errors
npm run lint        # zero errors and zero warnings
npm test            # all tests pass
npm run build       # validate + typecheck + vite build + copyright safeguard
git status --short  # no course materials or extracted text staged/untracked outside ignores
```

Never claim a check passed without running it. Never skip, delete or loosen tests to get green.

## 13. Deployment

Static Vite build to Vercel (`vercel.json`: framework vite, `npm run build`, output `dist`, SPA
rewrite). No server env vars, no runtime filesystem access. Do not claim a deployment happened
unless it was performed and verified. Client-side answer keys are visible to anyone; never
describe them as secret or tamper-proof.

## 14. Prohibited shortcuts

Placeholder or lorem content · fabricated questions for unreadable pages · editing existing
chapters while adding a new one · per-chapter components or routes · bypassing validation ·
committing PDFs or extracted text · claiming automatic PDF ingestion (it does not exist: a human
adds the PDF and issues the chapter command) · inventing names, numbers or titles not in the
source or config.

## 15. Completion report (required after every change)

1. What changed (features / chapters).
2. New and modified files.
3. Source files processed and any extraction limitations.
4. Validation results: question count per chapter, answer-position spread.
5. Commands run and their actual results (typecheck, lint, tests, build, safeguard).
6. Git-ignore / tracking verification for course materials.
7. Unresolved issues, ambiguities or content flagged for human review.
