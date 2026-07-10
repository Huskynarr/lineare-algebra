# Repository Guidelines

## Project Structure & Module Organization

This repository is a static linear algebra learning app without a build step. `index.html` provides the page shell, SEO metadata, and script loading order. Application behavior is split across `app.js` and focused modules such as `app.math.js`, `app.tools.js`, `app.quiz.js`, `app.progress.js`, `app.render.js`, and `app.viz.js`. Keep the script order in `index.html`: `data/learningPath.js` must load before the app modules.

Course content and references live in `data/learningPath.js`. Styling and design tokens are in `styles.css`; consult `DESIGN.md` before adding colors or components. PWA files include `service-worker.js`, `manifest.webmanifest`, icons, and `og-image.svg`. Generator utilities live in `tools/`, while workflows are under `.github/workflows/`. There is no separate test directory or build output.

## Build, Test, and Development Commands

No package installation or build step is required.

```bash
python3 -m http.server 8080
```

Serves the app at `http://localhost:8080`; use HTTP when checking Service Worker behavior.

```bash
node --check app.js
node --check app.math.js
node --check app.tools.js
node --check app.progress.js
node --check app.quiz.js
node --check app.viz.js
node --check app.render.js
node --check service-worker.js
node --check data/learningPath.js
node --check tools/gen-llms.js
node --check tools/validate-content.js
node tools/validate-content.js
node -e "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8'))"
```

These syntax and manifest checks are the project’s automated verification. When lesson content or references change, run `node tools/gen-llms.js` and commit the regenerated `llms.txt` and `llms-full.txt`.

## Coding Style & Naming Conventions

Use plain JavaScript, HTML, and CSS without new dependencies. Follow existing two-space indentation and descriptive `camelCase` identifiers. Keep interface and lesson text in clear German. Preserve HTML escaping for rendered content and security attributes on external links. Lesson IDs are persistent savegame keys; do not rename them casually.

When changing cached assets, increment both `CACHE_NAME` in `service-worker.js` and `SW_VERSION` in `app.js`, keeping their version numbers aligned.

## Testing Guidelines

There is no test framework or coverage target. Run every command above, then manually verify navigation, quizzes, savegame import/export, responsive layout, and offline caching. Content changes should include an updated mini-quiz and curated lesson references.

## Commit & Pull Request Guidelines

Use concise Conventional Commit prefixes seen in history: `feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, or `chore:`. Keep commits focused. Pull requests should explain the change, note manual verification, link relevant issues, and include screenshots for visible UI changes. Confirm CI passes before requesting review.
