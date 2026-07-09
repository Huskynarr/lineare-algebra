# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read these first

- **`AGENTS.md`** — the authoritative build, architecture, and conventions guide. Read it before any non-trivial change. It documents the verification commands, content/data flow, SEO/JSON-LD, service-worker, and deploy story in detail.
- **`DESIGN.md`** — mandatory reference before touching any color, layout, component, or typography. All design tokens live in `styles.css` (`:root` dark, `[data-theme="light"]` light); never use magic values in components.

## What this project is

Static, dependency-free linear-algebra learning app (German, `lang="de"`). No build step, no package manager, no test framework, no framework, no CSS preprocessor. Single-page app, progressive web app with offline support.

## Verification (the only CI)

There is no linter, formatter, or typecheck — do not invent commands. CI (`.github/workflows/ci.yml`) runs only syntax validation:

```bash
node --check app.js
node --check service-worker.js
node --check data/learningPath.js
node --check tools/gen-llms.js
node -e "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8'))"
```

Runtime testing needs HTTP (Service Workers don't work over `file://`):

```bash
python3 -m http.server 8080   # open http://localhost:8080
```

## Architecture (big picture)

The app is a single IIFE in `app.js` (strict mode) driving a static `index.html`. The load order of script tags is load-bearing:

1. `index.html` loads `data/learningPath.js` (deferred) → sets `window.LEARNING_PATH` (modules/lessons) and `window.LEARNING_REFERENCES` (lessonId → curated source links).
2. `index.html` loads `app.js` (deferred) → reads those globals at startup.

**Do not reorder the script tags.**

- **`data/learningPath.js`** is the single source of content: 12 modules incl. a `mod-0` complex-numbers prelude, each lesson has `theory`, `example`, `exercise`, `hint`, and `quiz` (MC uses `answerIndex`; text input uses `correctAnswer`/`acceptAnswers`). Lesson `id`s key the user savegame — adding/renaming an `id` breaks existing progress.
- **`app.js`** renders all UI via `innerHTML` + `escapeHtml()`; preserve this escaping. Key render/quiz/state functions are visible in the file's function list (`renderLessonDetail`, `renderQuiz`, `evaluateQuiz`, `loadProgress`, `sanitizeProgress`, etc.).
- **Progress** lives in `localStorage` under `lineare-algebra-savegame-v1`. `SAVEGAME_VERSION` (currently `1`) + `sanitizeProgress` govern compatibility — bump the version only with a migration story. Mastery score = 70% completion + 30% quiz-correct.
- **Per-lesson FAQ / JSON-LD**: `updateLessonFAQJsonLd(lesson)` rewrites the text of the `<script id="dynamic-faq-jsonld">` element in `index.html` on every render — that element MUST exist; keep JSON valid (`JSON.stringify`).

## Cross-cutting change rules

When you change lesson content, you usually touch several coupled artifacts at once:

- Add/update the per-lesson mini-quiz (see `CONTRIBUTING.md`).
- Update the `LEARNING_REFERENCES` entry. Do NOT invent professor/course URLs you can't verify — prefer the Wikipedia article about a person (it names their university). Keep Wikipedia (German) for the core concept; add MIT OCW 18.06 (Prof. Gilbert Strang) / 3Blue1Brown where relevant.
- Regenerate LLM files and commit them together with the content change:
  ```bash
  node tools/gen-llms.js   # rewrites llms.txt + llms-full.txt
  ```
- `index.html` has 5 JSON-LD blocks (`EducationalOrganization`, `WebSite`, `Course`, site-level `FAQPage`, dynamic `Question`) — keep all valid JSON, verify with a parser after edits.

## Service worker / cache versioning

`service-worker.js` caches a fixed `APP_ASSETS` list (cache-then-network). New assets must be added to `APP_ASSETS` explicitly or they won't be pre-cached. When changing any asset, bump **both** in lockstep:
- `CACHE_NAME` in `service-worker.js` (currently `lineare-algebra-cache-v17`) — the `activate` handler purges caches whose name differs.
- `SW_VERSION` in `app.js` (currently `17`) — used as `?v=` on the registration URL to force a fresh SW past CDN/HTTP caches.

Keep the two version numbers in sync.

## Deploy

Push to `main` runs `.github/workflows/deploy-pages.yml`: rsyncs the repo (excluding `.git`, `.github`, `site/`, `tools/`) into `site/` and publishes to GitHub Pages. Pages source must be set to **GitHub Actions**. No build artifacts are committed; `site/` is gitignored.

## Conventions

- UI text/content in clean, beginner-friendly German.
- Design tokens only (`var(--…)`), never raw hex in components — see `DESIGN.md`.
- Commit style: conventional prefixes `feat:`, `fix:`, `docs:` (see `CONTRIBUTING.md`).
