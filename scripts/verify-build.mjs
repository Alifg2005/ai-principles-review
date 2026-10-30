#!/usr/bin/env node
/**
 * Post-build copyright safeguard. Runs automatically at the end of `npm run build`.
 *
 * Fails the build if:
 *  - dist/ contains any restricted document type (.pdf, .ppt(x), .doc(x), .key);
 *  - dist/ contains a file whose name matches a local course-materials file;
 *  - dist/ text mentions a local course-material filename, source metadata or processing notes;
 *  - (when Git is available) any restricted file is tracked by Git, or any file
 *    in course-materials/ is not ignored.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const MATERIALS = join(ROOT, 'course-materials');
const RESTRICTED = new Set(['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.key']);
// Source metadata and internal processing notes that must never ship.
const FORBIDDEN_TEXT = [/\bfileName\b/, /\bpageCount\b/, /\bsourceReference\b/, /\bslideNote\b/, /\bslideWording\b/, /slide-based/, /Lecture wording/, /text extraction/i, /walkthrough slides/i, /CNF slides/i, /\bslides? \d/i, /\.pdf\b/i];

const problems = [];
const notes = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// 1. Build output
if (!existsSync(DIST)) {
  problems.push('dist/ does not exist; run the Vite build first.');
} else {
  const distFiles = walk(DIST);
  const materialNames = existsSync(MATERIALS) ? new Set(walk(MATERIALS).map((f) => basename(f).toLowerCase())) : new Set();
  for (const file of distFiles) {
    const rel = relative(ROOT, file);
    if (RESTRICTED.has(extname(file).toLowerCase())) problems.push(`restricted document in build output: ${rel}`);
    if (materialNames.has(basename(file).toLowerCase())) problems.push(`course-material file copied into build: ${rel}`);
    if (!['.js', '.css', '.html', '.svg', '.json', '.map'].includes(extname(file).toLowerCase())) continue;
    const text = readFileSync(file, 'utf8');
    const lower = text.toLowerCase();
    for (const pattern of FORBIDDEN_TEXT) {
      if (pattern.test(text)) problems.push(`source metadata in build output (${pattern}): ${rel}`);
    }
    for (const name of materialNames) {
      const stem = name.replace(/\.[^.]+$/, '');
      // A plain name can equal a chapter title; the .pdf rule above still catches the full filename.
      if (/[\d_-]/.test(stem) && lower.includes(stem)) problems.push(`course-material filename in build output ("${stem}"): ${rel}`);
    }
  }
  notes.push(`scanned ${distFiles.length} files in dist/ for restricted documents, source metadata and filenames`);
}

// 2. Git tracking (skipped gracefully where Git or the repository is unavailable, e.g. some CI images)
function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

let gitAvailable = false;
try {
  gitAvailable = git(['rev-parse', '--is-inside-work-tree']).trim() === 'true';
} catch {
  notes.push('git unavailable: skipped tracking checks');
}

if (gitAvailable) {
  const tracked = git(['ls-files', '-z']).split('\0').filter(Boolean);
  for (const file of tracked) {
    if (file.startsWith('course-materials/')) problems.push(`course material is tracked by git: ${file}`);
    else if (RESTRICTED.has(extname(file).toLowerCase())) problems.push(`restricted document is tracked by git: ${file}`);
  }
  if (existsSync(MATERIALS)) {
    const local = walk(MATERIALS).map((f) => relative(ROOT, f).split('\\').join('/'));
    for (const file of local) {
      try {
        git(['check-ignore', '-q', '--', file]);
      } catch {
        problems.push(`course material is NOT ignored by git: ${file}`);
      }
    }
    notes.push(`verified ${local.length} local course-material file(s) are git-ignored and untracked`);
  }
}

if (problems.length > 0) {
  console.error('\n✖ Copyright safeguard check FAILED:\n');
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nSee AGENTS.md › Source-material protection.\n');
  process.exit(1);
}

console.log('\n✔ Copyright safeguard check passed');
for (const n of notes) console.log(`  · ${n}`);
