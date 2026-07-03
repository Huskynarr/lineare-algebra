# AGENTS.md

Static, dependency-free learning app for linear algebra. No build step, no package manager, no test framework — all "CI" is `node --check` syntax validation.

## Verify changes

```bash
node --check app.js
node --check service-worker.js
node --check data/learningPath.js
node -e "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8'))"
```

These four checks mirror `.github/workflows/ci.yml` and are the only automated verification. There is no linter, formatter, or typecheck — do not invent commands.

For runtime testing (Service Worker requires http, not `file://`):

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

## Architecture

- `index.html` loads `data/learningPath.js` then `app.js` with `defer`. Order is load-bearing: `learningPath.js` sets `window.LEARNING_PATH`, which `app.js` reads at startup. Do not reorder the script tags.
- `app.js` is a single IIFE, strict mode. All UI is rendered via `innerHTML` with `escapeHtml()` — preserve this escaping when adding templated content.
- `data/learningPath.js` is the single source of content: 11 modules, each with lessons containing `theory`, `example`, `exercise`, `hint`, and `quiz` (with `answerIndex`). Adding/renaming a lesson `id` breaks existing user savegames (progress is keyed by `id`).
- Progress lives in `localStorage` under `lineare-algebra-savegame-v1`. `SAVEGAME_VERSION` and the import sanitizer (`sanitizeProgress`) govern compatibility — bump the version only with a migration story.
- Mastery score = 70% completion + 30% quiz-correct (see `renderProgressSummary`).

## Service worker / offline

`service-worker.js` caches a fixed `APP_ASSETS` list and uses a cache-then-network strategy. When changing any asset, bump `CACHE_NAME` (`lineare-algebra-cache-v1`) — the `activate` handler only purges caches whose name differs. New assets must be added to `APP_ASSETS` explicitly or they won't be pre-cached.

## Conventions

- UI text and content are in German (`lang="de"`). Keep new copy in clean, beginner-friendly German.
- When changing lesson content, also add/update the per-lesson mini-quiz (per `CONTRIBUTING.md`).
- Commit style: conventional prefixes — `feat:`, `fix:`, `docs:` (see `CONTRIBUTING.md`).

## Deploy

Push to `main` triggers `.github/workflows/deploy-pages.yml`, which rsyncs the repo (excluding `.git`, `.github`, `site/`) into `site/` and publishes to GitHub Pages. Pages source must be set to **GitHub Actions**. No build artifacts are committed; `site/` is gitignored.
