# CLAUDE.md

Read `AGENTS.md` before changing code and `DESIGN.md` before changing UI styles.

## Project

Static German learning app for mathematics and linear algebra, aimed at learners from Hauptschule-level foundations through Bachelor material. There is no build step, package manager, framework, or test framework. KaTeX is loaded from jsDelivr and cached as an optional offline asset.

## Architecture

Script order in `index.html` is load-bearing:

1. `data/learningPath.js` exposes `window.LEARNING_PATH` and `window.LEARNING_REFERENCES`.
2. `app.math.js` contains pure mathematical helpers.
3. `app.tools.js` contains calculator behavior.
4. `app.progress.js` handles savegames and the learner score.
5. `app.quiz.js` handles quizzes, warmup, review queue, and lesson games.
6. `app.viz.js` renders interactive Canvas diagrams.
7. `app.render.js` renders escaped HTML.
8. `app.js` initializes state, binds events, and orchestrates rendering.

The learning path has 17 modules and 52 lessons. Lesson IDs are persistent savegame keys. Progress uses `lineare-algebra-savegame-v1` with `SAVEGAME_VERSION = 2`.

## Cross-Cutting Rules

- Keep learner-facing text in clear German.
- Preserve `escapeHtml()` around data inserted through `innerHTML`.
- Content changes require an appropriate quiz, curated references, and `node tools/gen-llms.js`.
- Run `node tools/validate-content.js` after lesson edits; it catches broken LaTeX escapes and schema drift.
- Cached asset changes require matching version bumps in `service-worker.js` and `app.js`; keep both numbers identical.
- New local assets must be added to `APP_ASSETS`.
- Keep `#dynamic-faq-jsonld` and JSON-LD generation valid.

## Verification

Run every JavaScript syntax check listed in `AGENTS.md`, validate `manifest.webmanifest`, and manually test via:

```bash
python3 -m http.server 8080
```

Check the three start routes, quizzes, text-answer persistence, calculators, Canvas controls, savegame import/export, responsive navigation, and offline reload.
