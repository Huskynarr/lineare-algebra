# AGENTS.md

Static, dependency-free learning app for linear algebra. No build step, no package manager, no test framework — all "CI" is `node --check` syntax validation.

## Verify changes

```bash
node --check app.js
node --check service-worker.js
node --check data/learningPath.js
node --check tools/gen-llms.js
node -e "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8'))"
```

These checks mirror `.github/workflows/ci.yml` and are the only automated verification. There is no linter, formatter, or typecheck — do not invent commands.

For runtime testing (Service Worker requires http, not `file://`):

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

When `data/learningPath.js` content changes, also regenerate the LLM files:

```bash
node tools/gen-llms.js   # rewrites llms.txt + llms-full.txt
```

The generator has no external dependencies (Node builtins only). Commit the regenerated `llms.txt` / `llms-full.txt` together with the content change. `tools/` is excluded from the GitHub Pages deploy.

## Architecture

- `index.html` loads `data/learningPath.js` then `app.js` with `defer`. Order is load-bearing: `learningPath.js` sets `window.LEARNING_PATH` and `window.LEARNING_REFERENCES`, which `app.js` reads at startup. Do not reorder the script tags.
- `app.js` is a single IIFE, strict mode. All UI is rendered via `innerHTML` with `escapeHtml()` — preserve this escaping when adding templated content. Reference links rendered via `renderReferences` use `rel="noopener noreferrer nofollow"` and `target="_blank"`; keep these attributes.
- `data/learningPath.js` is the single source of content: 12 modules (incl. a "complex numbers" prelude module `mod-0`), each with lessons containing `theory`, `example`, `exercise`, `hint`, and `quiz` (with `answerIndex` for MC or `correctAnswer`/`acceptAnswers` for text input). Adding/renaming a lesson `id` breaks existing user savegames (progress is keyed by `id`).
- `data/learningPath.js` also exposes `window.LEARNING_REFERENCES` — an `Object.freeze`-ed map of `lessonId -> [{label, url, source}]`. These power the per-lesson "Quellen & weiterführende Links" section and are included in `llms-full.txt`. Keep references curated: Wikipedia (German) for the core concept, plus where relevant a university reference (MIT OCW 18.06 by Prof. Gilbert Strang, 3Blue1Brown) and/or a historical-mathematician Wikipedia article. Do NOT invent professor/course URLs you cannot verify — prefer the Wikipedia article about the person, which names their university.
- Progress lives in `localStorage` under `lineare-algebra-savegame-v1`. `SAVEGAME_VERSION` and the import sanitizer (`sanitizeProgress`) govern compatibility — bump the version only with a migration story.
- Mastery score = 70% completion + 30% quiz-correct (see `renderProgressSummary`).

## Per-lesson FAQ / dynamic JSON-LD

- `renderFAQBlock(lesson)` renders a visible `<details class="faq-item">` Q&A block per lesson (question from `quiz.question`, answer assembled from the correct option + `explanation` + `solution`).
- `updateLessonFAQJsonLd(lesson)` rewrites the text content of the `<script id="dynamic-faq-jsonld">` element in `index.html` on every lesson render. The element MUST exist in `index.html` — do not remove it. Always emit valid JSON (the renderer uses `JSON.stringify`, keep it that way).

## SEO / OpenGraph / GEO

- `index.html` carries 5 JSON-LD blocks: `EducationalOrganization`, `WebSite`, `Course` (with `teaches`, `hasCourseInstance`, `about.sameAs` to Wikipedia), `FAQPage` (site-level, 6 Q&A), and the dynamic `Question` (`#dynamic-faq-jsonld`). Keep all blocks valid JSON — verify with a parser after edits.
- `og-image.svg` is a 1200×630 SVG referenced by `og:image` and `twitter:image`. SVG is fine for most platforms; if a PNG fallback becomes necessary, add it to `APP_ASSETS` and reference it.
- `robots.txt` explicitly allows major AI/LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended, Meta-ExternalAgent, …). When adding a new well-known LLM bot, add an explicit `Allow` block here.
- `llms.txt` (short, llmstxt.org format) and `llms-full.txt` (full content as Markdown) are committed artifacts — regenerate via `node tools/gen-llms.js` whenever lesson content or references change.
- `sitemap.xml` lists the app URL plus `llms.txt` and `llms-full.txt`. Add new standalone crawlable files here.

## Service worker / offline

`service-worker.js` caches a fixed `APP_ASSETS` list and uses a cache-then-network strategy. When changing any asset, bump `CACHE_NAME` (currently `lineare-algebra-cache-v15`) — the `activate` handler only purges caches whose name differs. Also bump `SW_VERSION` in `app.js` (used as a `?v=` query param on the registration URL) to force browsers to register a fresh SW and bypass CDN/HTTP caches of the old script. New assets must be added to `APP_ASSETS` explicitly or they won't be pre-cached. Keep `CACHE_NAME`'s version number and `SW_VERSION` in sync.

## Conventions

- UI text and content are in German (`lang="de"`). Keep new copy in clean, beginner-friendly German.
- When changing lesson content, also add/update the per-lesson mini-quiz (per `CONTRIBUTING.md`) AND the entry in `LEARNING_REFERENCES` AND regenerate `llms.txt` / `llms-full.txt`.
- Design tokens live in `styles.css` `:root` and `[data-theme="light"]`. See `DESIGN.md` before adding colors or component styles.
- Commit style: conventional prefixes — `feat:`, `fix:`, `docs:` (see `CONTRIBUTING.md`).

## Deploy

Push to `main` triggers `.github/workflows/deploy-pages.yml`, which rsyncs the repo (excluding `.git`, `.github`, `site/`, `tools/`) into `site/` and publishes to GitHub Pages. Pages source must be set to **GitHub Actions**. No build artifacts are committed; `site/` is gitignored.
