# Chapter workflow

How to add a new chapter by applying the rules in [`AGENTS.md`](../AGENTS.md). The app is built
once: a new chapter is **one new data file plus one registry line**. No component, page, route
or style changes.

> Adding a PDF does not trigger anything automatically. The human drops the file in place and
> gives the coding agent the standard command (see README › *Adding a chapter*).

## 0. Prerequisites (human)

1. Copy the new lecture PDF into `course-materials/chapters/`, keeping the original filename.
2. Ask the agent:

   > Add the new chapter PDF following AGENTS.md and docs/CHAPTER_WORKFLOW.md. Analyze the source, generate exactly 20 validated multiple-choice questions, update the canonical chapter registry, verify copyright safeguards, run the relevant tests, and confirm the production build succeeds.

## 1. Locate the new source

```bash
ls course-materials/chapters/
grep -h "title:" src/data/chapters/*.ts
```

The new PDF is the one whose chapter title is not yet registered. If more than one file is new,
or none is, **stop and report** instead of guessing.

## 2. Verify protection before reading it

```bash
git check-ignore -v "course-materials/chapters/<file>.pdf"   # must print a matching rule
git ls-files course-materials '*.pdf'                         # must print nothing
```

If either check fails, fix `.gitignore` / untrack with `git rm --cached` first (AGENTS.md §9).

## 3. Extract and read the full source

Extract to a temp directory **outside the repo**:

```bash
OUT="$(mktemp -d)"
pdftotext -layout "course-materials/chapters/<file>.pdf" "$OUT/source.txt"
```

- Read every page. Note image-only pages (no text) and garbled symbols (logic glyphs often drop).
- If the PDF is scanned, try OCR (e.g. `ocrmypdf` or `tesseract`) if available. If reliable text
  still cannot be obtained, **report the specific pages/limits and do not invent content**.

## 4. Determine identity

- **Title:** from the title slide.
- **Number:** the lecture/topic/week number printed in the deck or filename. If it is absent,
  infer only from explicit evidence (e.g. "next lecture" references) and record that in
  your completion report. If it stays ambiguous, stop and report.
- **id:** kebab-case slug of the title.
- Check for collisions: `grep -h "id:\|number:\|title:" src/data/chapters/*.ts`. The
  validator also rejects duplicate ids and numbers. Never overwrite an existing chapter.

## 5. Write the questions

Create `src/data/chapters/NN-<slug>.ts` (NN = zero-padded number), modelled on an existing file:

```ts
import { defineChapter } from '../../lib/schema';

export default defineChapter({
  id: 'slug',
  number: 9,
  title: 'Title From Slide',
  description: 'One or two sentences on what the chapter covers.',
  source: { label: 'Topic 9' },
  questions: [
    {
      id: 'ch09-q01',
      question: '…',
      options: ['…', '…', '…', '…'],
      correctAnswerIndex: 2,
      explanation: '…',
      difficulty: 'foundational',
    },
    // … exactly 20
  ],
});
```

Follow AGENTS.md §8 and §10: original wording, plausible distractors, balanced difficulty,
planned answer positions (each index 3–7 times, never three equal in a row), concise
explanations. Do not put filenames, slide numbers or extraction notes in the data.

## 6. Register it

In `src/data/chapters/index.ts`, add one import and append it to `chapterRegistry`.
Do not reorder or edit other entries; sorting is automatic by `number`.

## 6a. Add written and practical questions (when the material supports them)

Create `src/data/practice/NN-<slug>.ts` with `definePracticeSet`, using the chapter's `id` as
`chapterId` and ids like `p09-01`, and register it in `src/data/practice/index.ts`. Follow
AGENTS.md §7a: choose question kinds from what the slides actually ask students to do, render the
diagram slides to check them (text extraction misses figures), present the correct concept directly, using `mixUp` for frequent confusions,
and add recomputation checks for any algorithm or logic answers. A chapter without a practice set
is valid: it simply does not appear in that section.

## 7. Validate and review

```bash
npm run validate
```

Then re-read each question against the source and confirm the answer key. Fix and re-run
until it passes cleanly.

## 8. Full verification

```bash
npm run typecheck && npm run lint && npm test && npm run build
git status --short
```

`npm run build` ends with the copyright safeguard; it must print `✔ Copyright safeguard check
passed`. Confirm `git status` shows only the new data file and `index.ts` (plus any intentional
doc updates) and nothing from `course-materials/`.

The integration tests render the library from the registry, so a passing run also proves the new
chapter appears automatically.

## 9. Report

Deliver the completion report from AGENTS.md §15, including new/modified files, the 20/20
count, answer-position spread, extraction limitations, and anything needing human review.
