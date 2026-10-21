# AI Principles Review · MIND//LAB

An interactive study experience for reviewing AI Principles through chapter-based quizzes grounded
in the instructor's course materials.

Built for **ARTI 401 · Artificial Intelligence: Principles and Techniques**.
Prepared by **Ali Feras Alghanim**. Course instructor: **Dr. Omer Awad Mohammed Bakhet**.

---

## Features

- **Chapter library** generated from a validated data registry: 7 chapters, 140 questions.
- **20-question reviews** per chapter, one question at a time, with a progress bar, `01 / 20`
  counter, previous/next controls and a question map showing answered and open questions.
- Answers stay editable until submission; a confirmation step appears if questions are
  unanswered; submission is idempotent.
- **Results**: score out of 20, percentage, correct / incorrect / unanswered counts, a
  per-question score ring, and a full review with your answer, the correct answer, an
  explanation and the source slides. A filter shows only missed questions.
- **Retry** starts a fresh attempt; switching chapters always starts clean.
- **Light and dark themes**: follows the OS on first visit, remembers your choice, and applies
  the theme before first paint (no flash).
- Accessible: semantic HTML, native radio groups, visible focus, live announcements,
  skip link, reduced-motion support, 44px touch targets, responsive from phones to desktops.

## Technology

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · lucide-react · zod · Vitest + React
Testing Library · ESLint. Static frontend only: no backend, database, accounts or runtime AI calls.

## Project structure

```
├── AGENTS.md                      Permanent project rules (read first)
├── docs/CHAPTER_WORKFLOW.md       Step-by-step procedure for adding a chapter
├── .github/prompts/add-chapter.prompt.md
├── course-materials/chapters/     Original PDFs: LOCAL ONLY, git-ignored, never deployed
├── public/favicon.svg
├── scripts/verify-build.mjs       Post-build copyright safeguard
├── vercel.json
└── src/
    ├── app/          App shell, router, Link
    ├── components/   Reusable UI
    ├── config/site.ts  Editable names, course title and code
    ├── data/chapters/  One file per chapter + index.ts (canonical registry)
    ├── hooks/        Theme and document title
    ├── lib/          Schema, registry validation, quiz engine, formatting
    ├── pages/        Home, Quiz, Results, 404
    ├── styles/       Design tokens + Tailwind
    └── test/         Integration tests
```

## Getting started

Requires **Node.js 22.22.2+ (22.x), 24.15+ (24.x) or 26+**, and npm. The floor comes from the
test tools (Vitest 5 and jsdom 30), which also run during `npm run build`. The supported range is
declared in `package.json` → `engines`.

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run validate` | Validate all chapter data (schema, 20×4, answer spread, sources) |
| `npm run typecheck` | TypeScript project build check |
| `npm run lint` | ESLint |
| `npm test` | All unit + integration tests |
| `npm run build` | validate → typecheck → production build → copyright safeguard |
| `npm run preview` | Serve the production build locally |

Edit names, course title and code in **`src/config/site.ts`**.

## Adding a chapter

1. Copy the lecture PDF into `course-materials/chapters/` (it stays local and git-ignored).
2. Give your coding agent this single instruction:

```text
Add the new chapter PDF following AGENTS.md and docs/CHAPTER_WORKFLOW.md. Analyze the source, generate exactly 20 validated multiple-choice questions, update the canonical chapter registry, verify copyright safeguards, run the relevant tests, and confirm the production build succeeds.
```

(In VS Code with Copilot you can also run the `add-chapter` prompt from `.github/prompts/`.)

Adding a PDF does **not** run anything automatically. The agent does the work when you give it
the instruction. The new chapter appears in the library without any change to pages or components.

## Chapter data

Each chapter is a TypeScript file in `src/data/chapters/` registered in `index.ts`:

```ts
{
  id: 'intelligent-agents',          // URL slug: /chapters/intelligent-agents
  number: 2,
  title: 'Intelligent Agents',
  description: '…',
  source: { fileName: 'Topic 2 Intelligent agents-Updated.pdf', label: 'Topic 2', pageCount: 41 },
  questions: [                       // exactly 20
    {
      id: 'ch02-q01',                // stable id; scoring is keyed by it
      question: '…',
      options: ['…', '…', '…', '…'], // exactly 4
      correctAnswerIndex: 2,         // 0–3
      explanation: '…',
      difficulty: 'foundational',    // | 'intermediate' | 'advanced'
      sourceReference: { section: 'What is an intelligent agent?', pages: [5] },
    },
  ],
}
```

The full schema lives in `src/lib/schema.ts`. Invalid data (wrong counts, duplicate ids, bad
indices, empty text, duplicate registrations, out-of-range page references) is rejected by
`npm run validate`, which also runs before every build.

## Deploying to Vercel

1. Push the repository to GitHub (course materials are ignored, so they are never pushed).
2. Import the repo in Vercel. `vercel.json` already sets the Vite framework, `npm run build`,
   the `dist` output, and the SPA rewrite for `/chapters/:id` URLs.
3. No environment variables are needed. Vercel reads `engines.node` from `package.json` to pick
   the Node.js major version and installs with npm because of `package-lock.json`. Use Node 22.x
   or 24.x in the project settings; because the range is open-ended (`>=26.0.0`), Vercel may
   warn that it can upgrade the major version automatically.

The production build fails automatically if a restricted document type ends up in `dist/` or if
course materials are tracked by Git.

## Copyright and source material

- **Original lecture PDFs are local-only.** They live in `course-materials/chapters/`, which is
  excluded by `.gitignore` (along with all `*.pdf`, `*.ppt(x)`, `*.doc(x)` and `*.key` files)
  and by `.vercelignore`. They are never imported, copied into `public/`, or bundled.
  `scripts/verify-build.mjs` checks this on every build.
- **Quiz content is derived, not copied.** Questions and explanations are original wording
  written to test understanding of the lecture material. They do not reproduce slide text,
  diagrams or extended examples. Derived educational content can still carry copyright
  considerations, so treat this repository as a personal study aid unless the instructor
  agrees to wider distribution.
- Well-known textbook examples (e.g. the Romania route map, the Wumpus world) are referenced
  by name only.

## Known limitations

- Answer keys ship to the browser, so anyone can read them in the bundle. This is a study aid,
  not an exam system.
- Progress is not saved between visits (by design; no accounts or storage of attempts).
- Some slides are image-only (diagrams, worked-example figures). Questions are based on the
  extracted text, and traversal/search questions use original example trees instead.
- Logic glyphs (∀ ∃ ∧ ∨ ⇒ ¬) did not survive PDF text extraction; formulas were reconstructed
  from context and written in standard notation.
- Chapter numbers follow the source decks. Chapters 1, 2, 5 and 7 print their number on the
  slides. Chapters 3 and 4 are numbered from their filenames ("Week 3…", "Topic-4…"). Chapter
  4's title slide reads "Chapter 3: Solving Problems By Searching, Part 2"; that refers to the
  textbook chapter, not the course lecture number.
- No Topic 6 deck was supplied, so numbering jumps from 5 to 7. *Knowledge Representation* is
  unnumbered in its PDF and is listed as chapter 8 because Lecture 7 announces first-order logic
  as the next lecture. Its outline mentions FOL→CNF conversion, but no CNF slides are present,
  so CNF is not examined.
- Fonts load from Google Fonts; offline first loads fall back to system fonts.

## Screenshots

No screenshots are committed yet. Add real captures of the home page, a quiz and a results
screen (both themes) under `docs/screenshots/` and link them here.

## Attribution and licensing

Application code © Ali Feras Alghanim. Lecture materials belong to their respective authors and
the course instructor and are not part of this repository. Some decks reference *Artificial
Intelligence: A Modern Approach* (Russell & Norvig); no textbook content is reproduced. No
open-source licence has been chosen yet; add a `LICENSE` file before publishing more widely.
