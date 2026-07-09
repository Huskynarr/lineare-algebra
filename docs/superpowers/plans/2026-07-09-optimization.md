# Lineare-Algebra Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the 2990-line `app.js` into namespaced files, memoize rendering, audit CSS, and add an a11y/Core-Web-Vitals pass — all without a build step, framework, or test framework.

**Architecture:** `window.LA` namespace, files loaded via `<script defer>` in fixed order. IIFE in `app.js` stays the boot point. Verification = `node --check` syntax gate (the only CI) + manual HTTP runtime smoke, since there is no test framework.

**Tech Stack:** Vanilla JS (no modules, no bundler), KaTeX CDN, Service Worker cache, static CSS.

## Global Constraints

- No build step, no package manager, no test framework, no framework, no CSS preprocessor (CLAUDE.md).
- `node --check` is the only automated gate — never invent lint/test commands.
- Runtime testing needs HTTP: `python3 -m http.server 8080` (Service Workers don't work over `file://`).
- UI text/content in clean beginner-friendly German.
- Design tokens only (`var(--…)`), never raw hex in components (DESIGN.md). `:root` / `[data-theme="light"]` token blocks untouchable.
- Savegame format `lineare-algebra-savegame-v1` / `SAVEGAME_VERSION` stays `1` — no migration.
- Service-worker versioning: `CACHE_NAME` (`service-worker.js`) and `SW_VERSION` (`app.js`) bumped in lockstep. Current = v19 / 19; this plan bumps to **v20 / 20**.
- Commit style: conventional prefixes `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.

---

## File Structure

Created:
- `app.math.js` — pure math functions (parse/format/calculate). No DOM.
- `app.progress.js` — savegame load/sanitize/persist, mastery, certificate.
- `app.quiz.js` — quiz evaluation, review queue, lesson game, generators.
- `app.viz.js` — vector visualization (canvas/svg draw helpers).
- `app.render.js` — all render* functions, FAQ/JSON-LD, renderMath.

Modified:
- `app.js` — slimmed to core: `window.LA` boot, `elements` cache, `state`, `init`, theme, i18n, `bindEvents`, `render` orchestration, shared helpers (`escapeHtml`, `randInt`, `showStatus`, `t`).
- `index.html` — add 5 new `<script defer src>` tags in load order before `app.js`.
- `service-worker.js` — add 5 new assets to `APP_ASSETS`, bump `CACHE_NAME` to v20.
- `styles.css` — remove unused selectors, add a11y/CWV rules.

Each `app.*.js` starts with `window.LA = window.LA || {};` then `LA.<area> = LA.<area> || {};` and assigns functions. `defer` guarantees execution order, so no IIFE wrapper needed.

---

## Task 1: Scaffold namespace + wire load order (no logic moved yet)

Establishes the `window.LA` skeleton, the script-tag order, and the SW cache bump. After this task the app behaves identically — `app.js` still owns all functions, but `window.LA` exists and new empty files load.

**Files:**
- Create: `app.math.js`, `app.progress.js`, `app.quiz.js`, `app.viz.js`, `app.render.js` (skeletons)
- Modify: `index.html:487-488`, `service-worker.js:1-15`, `app.js:16`

**Interfaces:**
- Produces: `window.LA` global with `LA.math`, `LA.progress`, `LA.quiz`, `LA.viz`, `LA.render` namespaces (empty objects). Later tasks fill them.

- [ ] **Step 1: Create the five skeleton files**

Each file identical skeleton (substitute area name):

```js
// app.math.js
window.LA = window.LA || {};
LA.math = LA.math || {};
```

Repeat for `app.progress.js` (`LA.progress`), `app.quiz.js` (`LA.quiz`), `app.viz.js` (`LA.viz`), `app.render.js` (`LA.render`).

- [ ] **Step 2: Add `window.LA = window.LA || {};` at top of `app.js`**

Insert as first line inside the existing IIFE is NOT needed — `app.js` is the IIFE. Add a top-level line above the IIFE instead. Actually the IIFE wraps everything; add inside the IIFE as the first statement so core helpers can later attach to `LA`. Read `app.js:1-5` to find the IIFE opening, then insert `window.LA = window.LA || {};` as the first line inside it.

- [ ] **Step 3: Wire script tags in `index.html`**

Replace lines 487-488:
```html
    <script defer src="data/learningPath.js"></script>
    <script defer src="app.js"></script>
```
with:
```html
    <script defer src="data/learningPath.js"></script>
    <script defer src="app.math.js"></script>
    <script defer src="app.progress.js"></script>
    <script defer src="app.quiz.js"></script>
    <script defer src="app.viz.js"></script>
    <script defer src="app.render.js"></script>
    <script defer src="app.js"></script>
```
Order is load-bearing: `data/learningPath.js` first (sets `window.LEARNING_PATH`), math→progress→quiz→viz→render, `app.js` last (boot).

- [ ] **Step 4: Add new assets to `APP_ASSETS` and bump cache**

In `service-worker.js`, change line 1 to `const CACHE_NAME = "lineare-algebra-cache-v20";` and insert the five files into the `APP_ASSETS` array after `"./app.js",`:
```js
  "./app.js",
  "./app.math.js",
  "./app.progress.js",
  "./app.quiz.js",
  "./app.viz.js",
  "./app.render.js",
  "./data/learningPath.js",
```
In `app.js:16` change `const SW_VERSION = 19;` to `const SW_VERSION = 20;`.

- [ ] **Step 5: Syntax-check all touched files**

Run:
```bash
node --check app.js app.math.js app.progress.js app.quiz.js app.viz.js app.render.js service-worker.js
```
Expected: no output (all pass).

- [ ] **Step 6: Runtime smoke**

```bash
python3 -m http.server 8080
```
Open http://localhost:8080. Verify: app loads, module list renders, one lesson opens, quiz works, theme toggles. `window.LA` and `window.LA.math` exist in console (empty objects). No console errors.

- [ ] **Step 7: Commit**

```bash
git add app.math.js app.progress.js app.quiz.js app.viz.js app.render.js index.html service-worker.js app.js
git commit -m "refactor: scaffold window.LA namespace and load order"
```

---

## Task 2: Extract pure math functions → `app.math.js`

Move all `calculate*`, `parseMatrix`, `formatMatrix`, `detNxN`, `traceM`, `charPolynomialCoeffs`, `partitionBlocks`, `formatNum`, `gcd`, `fmtComplex`, `matMul` and any other pure (no-DOM, no-state) math helpers out of `app.js` into `LA.math`. These are leaf functions — safest to move first.

**Files:**
- Modify: `app.math.js` (fill), `app.js` (remove moved functions, re-point callers)

**Interfaces:**
- Produces: `LA.math.parseMatrix(input)`, `LA.math.formatMatrix(m)`, `LA.math.calculateDotProduct()`, `LA.math.calculateDeterminant2x2()`, `LA.math.calculateMatrixMultiply()`, `LA.math.calculateInverse2x2()`, `LA.math.calculateGauss()`, `LA.math.detNxN(m)`, `LA.math.traceM(m)`, `LA.math.calculateBilinearForm()`, `LA.math.calculateEigenvalues()`, `LA.math.calculateJordanForm()`, `LA.math.charPolynomialCoeffs()`, `LA.math.partitionBlocks()`, `LA.math.formatNum()`, `LA.math.gcd()`, `LA.math.fmtComplex()`, `LA.math.matMul()`.
- Consumes: none from other tasks (pure). Callers in `app.js`/`app.render.js`/`app.quiz.js` reference via `LA.math.<name>`.

- [ ] **Step 1: Identify exact math functions**

```bash
grep -nE "^\s*function (calculate|parse|format|det|trace|char|partition|gcd|fmt|matMul)" app.js
```
Record each line range. Confirm with the Spec's Sektion-1 math list; add any pure helper not listed.

- [ ] **Step 2: Move each function into `app.math.js`**

For each function `foo`, cut its body from `app.js` and paste into `app.math.js` as `LA.math.foo = function(...) { ... };` (preserve params and body verbatim). Keep internal closures (e.g. `fmt` inside `calculateInverse2x2`) intact.

- [ ] **Step 3: Re-point callers**

In `app.js` (and later `app.render.js`/`app.quiz.js` once they exist — but for now `app.js`), replace bare `parseMatrix(` → `LA.math.parseMatrix(`, etc., for every moved function:
```bash
grep -nE "parseMatrix|formatMatrix|calculateDotProduct|calculateDeterminant|calculateMatrixMultiply|calculateInverse|calculateGauss|detNxN|traceM|charPolynomial|partitionBlocks|formatNum|\bgcd\b|fmtComplex|matMul" app.js
```
Edit each call site to use the `LA.math.` prefix. Do NOT prefix the definitions (they're gone from `app.js`).

- [ ] **Step 4: Syntax-check**

```bash
node --check app.js app.math.js
```
Expected: no output.

- [ ] **Step 5: Runtime smoke**

```bash
python3 -m http.server 8080
```
Open a lesson with a calculator/visualization (e.g. matrix multiply, determinant). Verify computation results unchanged. Open DevTools console — no `ReferenceError`.

- [ ] **Step 6: Commit**

```bash
git add app.js app.math.js
git commit -m "refactor: extract pure math functions to app.math.js"
```

---

## Task 3: Extract progress/savegame → `app.progress.js`

Move savegame and mastery functions into `LA.progress`. These read/write `localStorage` and `state` but do no DOM rendering.

**Files:**
- Modify: `app.progress.js` (fill), `app.js` (remove + re-point)

**Interfaces:**
- Produces: `LA.progress.defaultProgress()`, `LA.progress.isObject()`, `LA.progress.loadProgress()`, `LA.progress.sanitizeProgress(source)`, `LA.progress.sanitizeCertificate(source)`, `LA.progress.persistProgress()`, `LA.progress.exportSavegame()`, `LA.progress.importSavegame(event)`, `LA.progress.resetProgress()`, `LA.progress.computeMastery()`, `LA.progress.computeMasteryFor()`, `LA.progress.certificateAvailable()`, `LA.progress.certificateStage()`.
- Consumes: `state` (read/write) and `SAVEGAME_VERSION`, `CERTIFICATE_MASTERY_THRESHOLD` constants from core. Since `state` lives in the core IIFE, progress functions need access — see Step 2 for the access pattern.

- [ ] **Step 1: Identify progress functions and their `state` usage**

```bash
grep -nE "^\s*function (defaultProgress|isObject|loadProgress|sanitizeProgress|sanitizeCertificate|persistProgress|exportSavegame|importSavegame|resetProgress|computeMastery|computeMasteryFor|certificateAvailable|certificateStage)" app.js
```
For each, grep internal `state.` references to confirm coupling.

- [ ] **Step 2: Decide `state` access**

`state` is a core-local `const`. Two options:
- (a) expose `state` on `window.LA` as `LA.state` (read/write shared), or
- (b) pass `state` into progress functions as a param.
Use **(a)**: in `app.js` core, after `const state = {...}`, add `LA.state = state;`. Progress functions reference `LA.state` instead of `state`. Simpler, matches the existing mutation style (progress mutates `state` in place). Also expose `LA.SAVEGAME_VERSION` and `LA.CERTIFICATE_MASTERY_THRESHOLD` the same way.

- [ ] **Step 3: Move functions into `app.progress.js`**

For each progress function, cut from `app.js`, paste as `LA.progress.foo = function(...) {...}`, replace internal `state` → `LA.state`, `SAVEGAME_VERSION` → `LA.SAVEGAME_VERSION`, `CERTIFICATE_MASTERY_THRESHOLD` → `LA.CERTIFICATE_MASTERY_THRESHOLD`. `resetProgress` calls `render()` — keep the call as `LA.render.render && LA.render.render()` (render moves in Task 5; until then `LA.render.render` is undefined and the guard avoids breakage). Actually simpler: core still owns `render` until Task 5, so expose `LA.renderFn = render` in core and call `LA.renderFn()` here. Use that pattern: in `app.js` add `LA.renderFn = render;` near `LA.state`.

- [ ] **Step 4: Re-point callers in `app.js`**

```bash
grep -nE "defaultProgress|loadProgress|sanitizeProgress|sanitizeCertificate|persistProgress|exportSavegame|importSavegame|resetProgress|computeMastery|certificateAvailable|certificateStage" app.js
```
Prefix call sites with `LA.progress.`. Leave `isObject` calls too.

- [ ] **Step 5: Syntax-check**

```bash
node --check app.js app.progress.js
```

- [ ] **Step 6: Runtime smoke — savegame integrity (critical)**

```bash
python3 -m http.server 8080
```
Open app. In console, before testing:
```js
localStorage.getItem('lineare-algebra-savegame-v1')  // note existing value
```
Then: complete a lesson, run a quiz, refresh page — progress persists. Export savegame (if UI exists), import it back. Reset progress, confirm wipe + reload. Re-import to restore. Confirm `SAVEGAME_VERSION` still `1` in localStorage payload.

- [ ] **Step 7: Commit**

```bash
git add app.js app.progress.js
git commit -m "refactor: extract savegame/progress to app.progress.js"
```

---

## Task 4: Extract quiz + generators → `app.quiz.js`

Move quiz evaluation, review queue, lesson-game, and question generators into `LA.quiz`.

**Files:**
- Modify: `app.quiz.js` (fill), `app.js` (remove + re-point)

**Interfaces:**
- Produces: `LA.quiz.evaluateQuiz()`, `LA.quiz.evaluateTextQuiz()`, `LA.quiz.normalizeAnswer(str)`, `LA.quiz.addToReviewQueue(lessonId)`, `LA.quiz.removeFromReviewQueue(lessonId)`, `LA.quiz.advanceFromQuiz()`, `LA.quiz.generateLessonGameQuestions()`, `LA.quiz.advanceLessonGame()`, `LA.quiz.mcq(...)`, `LA.quiz.quizAnswer(...)`, plus `gen*` question generators (`genBasics`, `genComplex`, `genDecimal`, `genDeterminant`, `genDot`, `genEigen`, `genEquation`, `generateQuestion`, `generateWarmupQuestions`, `genExam`).
- Consumes: `LA.state`, `LA.math.*` (gcd, fmtComplex, etc.), `LA.renderFn` (to re-render after quiz), `escapeHtml`, `randInt` (core helpers — expose as `LA.escapeHtml`, `LA.randInt`).

- [ ] **Step 1: Identify quiz + generator functions**

```bash
grep -nE "^\s*function (evaluateQuiz|evaluateTextQuiz|normalizeAnswer|addToReviewQueue|removeFromReviewQueue|advanceFromQuiz|generateLessonGameQuestions|advanceLessonGame|mcq|quizAnswer|gen[A-Z]|generateQuestion|generateWarmupQuestions)" app.js
```

- [ ] **Step 2: Expose core helpers quiz needs**

In `app.js` core add `LA.escapeHtml = escapeHtml;` and `LA.randInt = randInt;` (after those functions are defined). Quiz code calls `LA.escapeHtml`/`LA.randInt`.

- [ ] **Step 3: Move functions into `app.quiz.js`**

Cut each, paste as `LA.quiz.foo = function(...) {...}`. Replace internal bare refs: `state` → `LA.state`, `escapeHtml` → `LA.escapeHtml`, `randInt` → `LA.randInt`, math calls → `LA.math.*`, `render()`/`renderLessonDetail()` → `LA.renderFn()` / `LA.render.renderLessonDetail()` (guard: `LA.render.renderLessonDetail && LA.render.renderLessonDetail()` until Task 5). `randInt` likely used heavily by generators.

- [ ] **Step 4: Re-point callers in `app.js`**

```bash
grep -nE "evaluateQuiz|evaluateTextQuiz|addToReviewQueue|removeFromReviewQueue|advanceFromQuiz|generateLessonGameQuestions|advanceLessonGame|mcq|quizAnswer|genBasics|generateQuestion|generateWarmupQuestions" app.js
```
Prefix `LA.quiz.`.

- [ ] **Step 5: Syntax-check**

```bash
node --check app.js app.quiz.js
```

- [ ] **Step 6: Runtime smoke — quiz + warmup**

```bash
python3 -m http.server 8080
```
Open a lesson, answer MC quiz (correct + wrong), answer text-input quiz, verify feedback. Run warmup panel (10 tasks), complete it. Trigger lesson game if present. Add/remove lesson from review queue. No console errors.

- [ ] **Step 7: Commit**

```bash
git add app.js app.quiz.js
git commit -m "refactor: extract quiz and generators to app.quiz.js"
```

---

## Task 5: Extract visualization → `app.viz.js`

Move vector visualization (canvas/svg draw) into `LA.viz`.

**Files:**
- Modify: `app.viz.js` (fill), `app.js` (remove + re-point)

**Interfaces:**
- Produces: `LA.viz.renderVisualization(lesson)`, `LA.viz.setupVisualizations()`, `LA.viz.redrawVisualizations()`.
- Consumes: `LA.math.*` if it uses math helpers, DOM elements via `getElementById` (keep as-is, viz reads its own canvas elements).

- [ ] **Step 1: Identify viz functions**

```bash
grep -nE "^\s*function (renderVisualization|setupVisualizations|redrawVisualizations)" app.js
```
Note internal helpers (`readVec`, `readScalar`, `draw`, `arrow`, `toPx`) — these are nested closures inside `setupVisualizations`; move them with the parent function verbatim, do not extract separately.

- [ ] **Step 2: Move into `app.viz.js`**

Cut and paste as `LA.viz.foo = function(...) {...}` with nested closures preserved. Replace any `state` → `LA.state`.

- [ ] **Step 3: Re-point callers**

```bash
grep -nE "renderVisualization|setupVisualizations|redrawVisualizations" app.js
```
Prefix `LA.viz.`.

- [ ] **Step 4: Syntax-check**

```bash
node --check app.js app.viz.js
```

- [ ] **Step 5: Runtime smoke — visualization**

```bash
python3 -m http.server 8080
```
Open a lesson with vector visualization (e.g. dot product / linear combination). Adjust input vectors, verify arrows redraw. Resize window, confirm `redrawVisualizations` keeps canvas aligned.

- [ ] **Step 6: Commit**

```bash
git add app.js app.viz.js
git commit -m "refactor: extract vector visualization to app.viz.js"
```

---

## Task 6: Extract render functions → `app.render.js` (final structural split)

Move all `render*`, FAQ/JSON-LD, and `renderMath` into `LA.render`. This is the largest move — `render()` orchestration stays in core, but the body functions leave.

**Files:**
- Modify: `app.render.js` (fill), `app.js` (remove + re-point)

**Interfaces:**
- Produces: `LA.render.renderModuleList()`, `LA.render.renderLessonDetail()`, `LA.render.renderQuiz(lesson, userAnswer, hasAnswer, isCorrect, quizButtonHtml)`, `LA.render.renderReferences(lesson)`, `LA.render.buildLessonFAQ(lesson)`, `LA.render.renderFAQBlock(lesson)`, `LA.render.renderModelSolution(lesson)`, `LA.render.updateLessonFAQJsonLd(lesson)`, `LA.render.renderMath(scope)`, `LA.render.renderProgressSummary()`, `LA.render.renderReviewBanner()`, `LA.render.renderShareBanner()`.
- Consumes: `LA.state`, `LA.escapeHtml`, `LA.math.*`, `LA.quiz.*` (render calls quiz helpers?), `LA.progress.computeMastery` etc., `window.LEARNING_PATH`, `window.LEARNING_REFERENCES`, `t` (i18n — expose `LA.t = t`), `elements` (expose `LA.elements = elements`).

- [ ] **Step 1: Expose shared core refs render needs**

In `app.js` core add: `LA.t = t;`, `LA.elements = elements;`, `LA.showStatus = showStatus;` (after each is defined). Render code uses `LA.t(...)`, `LA.elements.lessonDetail`, etc.

- [ ] **Step 2: Identify render functions**

```bash
grep -nE "^\s*function (render|buildLessonFAQ|updateLessonFAQJsonLd|renderMath)" app.js
```

- [ ] **Step 3: Move into `app.render.js`**

Cut each, paste as `LA.render.foo = function(...) {...}`. Replace internal: `state` → `LA.state`, `escapeHtml` → `LA.escapeHtml`, `t(` → `LA.t(`, `elements.` → `LA.elements.`, math → `LA.math.*`, quiz → `LA.quiz.*`, progress → `LA.progress.*`, `LEARNING_PATH`/`LEARNING_REFERENCES` stay global (no prefix). `updateLessonFAQJsonLd` writes to `<script id="dynamic-faq-jsonld">` — keep `document.getElementById` as-is.

- [ ] **Step 4: Replace core `render()` body to call LA.render**

In `app.js` core `render()` (line ~407), keep the orchestrator but delegate:
```js
function render() {
  LA.render.renderModuleList();
  LA.render.renderLessonDetail();
}
```
Remove the inline `renderMath()` call at line ~411 (scoped render comes in Task 7). For now core `render()` calls `LA.render.renderMath(LA.elements.lessonDetail)` if renderLessonDetail doesn't already — check renderLessonDetail internals (line 558 already calls `renderMath(elements.lessonDetail)`; ensure that becomes `LA.render.renderMath(LA.elements.lessonDetail)`).

- [ ] **Step 5: Re-point remaining callers**

```bash
grep -nE "renderModuleList|renderLessonDetail|renderQuiz|renderReferences|renderFAQBlock|renderModelSolution|updateLessonFAQJsonLd|renderMath|renderProgressSummary|renderReviewBanner|renderShareBanner|buildLessonFAQ" app.js app.quiz.js app.progress.js app.viz.js
```
Prefix all cross-file calls with `LA.render.`.

- [ ] **Step 6: Syntax-check all**

```bash
node --check app.js app.render.js app.quiz.js app.progress.js app.viz.js app.math.js
```

- [ ] **Step 7: Full runtime smoke**

```bash
python3 -m http.server 8080
```
Navigate module list → lesson → quiz → next lesson → back. Verify FAQ renders, JSON-LD updates (DevTools → view `<script id="dynamic-faq-jsonld">` text changes per lesson), model solution shows, references show, progress summary updates, share/review banners appear. Math renders (KaTeX). No console errors.

- [ ] **Step 8: Verify JSON-LD still valid**

In console:
```js
JSON.parse(document.getElementById('dynamic-faq-jsonld').textContent)
```
Expected: valid object, no throw.

- [ ] **Step 9: Commit**

```bash
git add app.js app.render.js app.quiz.js app.progress.js app.viz.js
git commit -m "refactor: extract render layer to app.render.js"
```

---

## Task 7: Render memoization + scoped KaTeX (performance)

Now that structure is split, optimize the hot path: cache the module list, scope `renderMath`, debounce `render`.

**Files:**
- Modify: `app.render.js` (`renderModuleList`, `renderMath`, render orchestration), `app.js` (`render` debounce)

**Interfaces:**
- Produces: `LA.render.moduleListRendered` (internal flag), `LA.render.renderQueued` flag + rAF debounce in core `render()`.
- Consumes: `LA.state`.

- [ ] **Step 1: Cache module list — render once, then patch**

In `LA.render.renderModuleList`, add a module-scope flag `let moduleListRendered = false;` at top of `app.render.js`. Restructure:
```js
LA.render.moduleListRendered = false;
LA.render.renderModuleList = function() {
  if (LA.render.moduleListRendered) {
    // patch: update completion classes/stars on existing cards instead of full innerHTML
    LA.render._patchModuleCompletion();
    return;
  }
  // ... existing full innerHTML build ...
  LA.render.moduleListRendered = true;
};
LA.render._patchModuleCompletion = function() {
  document.querySelectorAll('[data-lesson-id]').forEach((card) => {
    const id = card.getAttribute('data-lesson-id');
    const done = LA.state.progress.lessons && LA.state.progress.lessons[id] && LA.state.progress.lessons[id].completed;
    card.classList.toggle('is-completed', !!done);
    // update star count if present
  });
};
```
Keep the existing full-build body verbatim inside the `if (!moduleListRendered)` branch. Inspect the current completion-marking code in the full build and mirror it in `_patchModuleCompletion` (same class names, same star markup).

- [ ] **Step 2: Reset cache on resetProgress / import**

In `app.progress.resetProgress` and `importSavegame`, after state changes, set `LA.render.moduleListRendered = false;` so the next render rebuilds. Find these in `app.progress.js` and add the reset line.

- [ ] **Step 3: Scope `renderMath` to lesson detail, not body**

In `app.js` core, find the bare `renderMath()` call (line ~411, no-arg = scans `document.body`). Change to `LA.render.renderMath(LA.elements.lessonDetail);`. Confirm `renderLessonDetail` (now in `app.render.js`) already calls `renderMath(LA.elements.lessonDetail)` at line ~558 — if both call it, remove the core one and keep only the renderLessonDetail-internal call to avoid double scan.

- [ ] **Step 4: Debounce `render()` with rAF**

In `app.js` core, replace `render()`:
```js
let renderQueued = false;
function render() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    LA.render.renderModuleList();
    LA.render.renderLessonDetail();
  });
}
```
Expose a synchronous variant for cases that must render immediately (e.g. before scroll). Audit call sites: `grep -n "render()" app.js app.quiz.js app.progress.js` — any call followed by `scrollIntoView`/`scrollTo` that needs the DOM updated synchronously should call `LA.renderNow()` instead. Add `LA.renderNow = function(){ renderQueued = false; LA.render.renderModuleList(); LA.render.renderLessonDetail(); };` and use it at those sites.

- [ ] **Step 5: Syntax-check**

```bash
node --check app.js app.render.js app.progress.js
```

- [ ] **Step 6: Runtime smoke — memoization correctness**

```bash
python3 -m http.server 8080
```
Complete a lesson → module list card updates (completion class/star) WITHOUT full rebuild (DevTools: set a breakpoint or log in `_patchModuleCompletion` to confirm patch path). Reset progress → list rebuilds (flag reset). Import savegame → list reflects imported state. Navigate lessons → KaTeX renders only in detail panel. Rapid quiz submit → no duplicate renders (log count in rAF callback). No layout shift.

- [ ] **Step 7: Commit**

```bash
git add app.js app.render.js app.progress.js
git commit -m "perf: memoize module list, scope KaTeX render, debounce render()"
```

---

## Task 8: CSS audit — remove unused selectors

**Files:**
- Modify: `styles.css`

**Interfaces:** none.

- [ ] **Step 1: Extract class/id selectors from `styles.css`**

```bash
grep -oE "\.[a-zA-Z][a-zA-Z0-9_-]+|#[a-zA-Z][a-zA-Z0-9_-]+" styles.css | sort -u > /tmp/css-selectors.txt
wc -l /tmp/css-selectors.txt
```

- [ ] **Step 2: Find selectors with no usage in JS/HTML/data**

For each candidate (sample-batch via a loop), grep across `app.js app.math.js app.progress.js app.quiz.js app.viz.js app.render.js index.html data/learningPath.js`:
```bash
while read sel; do
  name="${sel#[#.]}"
  if ! grep -rqE "class=\"[^\"]*\b$name\b|class='[^']*\b$name\b|id=\"$name\"|id='$name'|getElementById\(['\"]$name|querySelector.*$sel|data-[a-z-]*=\"$name\"" app.js app.math.js app.progress.js app.quiz.js app.viz.js app.render.js index.html data/learningPath.js 2>/dev/null; then
    echo "UNUSED: $sel"
  fi
done < /tmp/css-selectors.txt > /tmp/unused-css.txt
wc -l /tmp/unused-css.txt
```
Review `/tmp/unused-css.txt` manually — exclude any selector used dynamically (string-built class names, KaTeX-injected classes like `.katex`, `:root`, `[data-theme]`, pseudo-states). Do NOT remove token-block selectors or state classes toggled by JS (`is-active`, `is-completed`, `is-open`).

- [ ] **Step 3: Remove confirmed-unused rules**

Edit `styles.css`: delete each confirmed-unused rule block (selector + its declarations). Keep `:root` and `[data-theme="light"]` blocks untouched (DESIGN.md).

- [ ] **Step 4: Verify no broken styles**

```bash
python3 -m http.server 8080
```
Visually diff every major view: module list, lesson detail, quiz, warmup, certificate, theme toggle (dark+light), mobile breakpoint (DevTools 640px / 1024px). Confirm nothing lost styling.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "chore: remove unused CSS selectors"
```

---

## Task 9: a11y + Core Web Vitals pass

**Files:**
- Modify: `styles.css` (focus, contrast), `index.html` (meta, lazy icons, dimensions), `app.render.js`/`app.viz.js` (aria-live, dimensions, labels)

**Interfaces:** none new.

- [ ] **Step 1: Add visible focus styles**

In `styles.css`, ensure a global focus rule exists (if not, add):
```css
:focus-visible {
  outline: 2px solid var(--color-action, #38bdf8);
  outline-offset: 2px;
}
```
Use the existing action token — check `:root` for the blue token name (Graph Community 3: blue=action). Replace `--color-action` with the real token.

- [ ] **Step 2: Add aria-live to quiz feedback**

In `LA.render.renderQuiz` (app.render.js), the result/feedback region needs `aria-live="polite"`. Find the element that shows correct/incorrect feedback and add the attribute in the innerHTML string, e.g. `<div class="quiz-feedback" aria-live="polite" role="status">`.

- [ ] **Step 3: aria-labels on icon buttons**

In `app.js` `bindEvents` / `index.html`, ensure theme toggle, reset, next/prev lesson buttons have `aria-label` (German): e.g. `aria-label="Design wechseln"`, `aria-label="Fortschritt zurücksetzen"`, `aria-label="Nächste Lektion"`, `aria-label="Vorherige Lektion"`. Add missing ones in the innerHTML templates (app.render.js) or directly in index.html for static buttons.

- [ ] **Step 4: Lazy-load non-critical icons, fixed dimensions on viz**

In `index.html`, icons referenced for PWA manifest (icon-192/512) are not in DOM `<img>` — skip. For any `<img>` in templates (app.render.js), add `loading="lazy" decoding="async"`. For visualization canvas/svg containers in `app.viz.js` / `styles.css`, add fixed `aspect-ratio` or width/height to prevent CLS:
```css
.viz-canvas, .viz-svg {
  aspect-ratio: 4 / 3;
  width: 100%;
}
```
Use the real class names from `app.viz.js`.

- [ ] **Step 5: font-display + preload KaTeX font (if self-hosted) / fetchpriority**

Check how KaTeX fonts load (CDN CSS). Add `font-display: swap` only if a self-hosted `@font-face` exists in `styles.css` — KaTeX from CDN already handles this; skip if CDN-only. Add `fetchpriority="high"` to the KaTeX script tag in `index.html:74` if it's render-critical (it is, for math). Actually KaTeX is defer — leave as-is unless Lighthouse flags. Verify `theme-color` meta exists in `index.html` head; add if missing:
```html
<meta name="theme-color" content="#0b1220">
```
(dark navy from Graph Community 7 — verify token/value).

- [ ] **Step 6: Contrast check**

Manually check text/background pairs against tokens (DevTools → pick color → contrast ratio ≥ 4.5 for body text, ≥ 3 for large). Fix any failing pair in `styles.css` using tokens only. If a token itself fails, note it but do NOT change token values without DESIGN.md consultation — flag in commit message instead.

- [ ] **Step 7: SEO/Reach validation**

Validate `manifest.webmanifest` JSON, confirm `og:image` has width/height meta, `lang="de"` present, all 5 JSON-LD blocks valid:
```bash
node -e "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8'))"
```
In browser console: `JSON.parse` each JSON-LD block. Regenerate llms files if content changed (it shouldn't have): `node tools/gen-llms.js`.

- [ ] **Step 8: Syntax-check + smoke**

```bash
node --check app.js app.render.js app.viz.js
node --check service-worker.js
```
```bash
python3 -m http.server 8080
```
Tab through the app keyboard-only — every interactive element reachable, focus visible. Screen-reader spot-check quiz feedback announced. Theme toggle labeled. No CLS on lesson open.

- [ ] **Step 9: Commit**

```bash
git add styles.css index.html app.render.js app.viz.js app.js
git commit -m "feat: a11y and core-web-vitals pass (focus, aria-live, contrast, CLS)"
```

---

## Task 10: Final verification + SW cache confirm

**Files:** none modified (verification only), possibly `tools/gen-llms.js` rerun.

- [ ] **Step 1: Full CI gate**

```bash
node --check app.js app.math.js app.progress.js app.quiz.js app.viz.js app.render.js
node --check service-worker.js
node --check data/learningPath.js
node --check tools/gen-llms.js
node -e "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8'))"
```
All pass with no output.

- [ ] **Step 2: Offline cache test**

```bash
python3 -m http.server 8080
```
Open app, DevTools → Application → Service Workers → confirm v20 registered. Application → Cache Storage → `lineare-algebra-cache-v20` contains all 5 new `app.*.js` files. Toggle offline (DevTools → Network → Offline), reload — app works fully offline. Confirm old `v19` cache purged.

- [ ] **Step 3: Savegame compatibility**

With existing `lineare-algebra-savegame-v1` in localStorage (from before refactor), load app — progress restores without error. `SAVEGAME_VERSION` in payload still `1`.

- [ ] **Step 4: llms regen (if any content drift)**

```bash
node tools/gen-llms.js
git diff --stat llms.txt llms-full.txt
```
If changed, commit; if not, skip.

- [ ] **Step 5: Final commit (if llms changed)**

```bash
git add llms.txt llms-full.txt
git commit -m "docs: regenerate llms files"
```

---

## Self-Review

**Spec coverage:**
- Sektion 1 (Struktur-Split): Tasks 1–6 ✓ (scaffold + 5 extracts).
- Sektion 2 (Render-Memoization & Perf): Task 7 ✓ (module list cache, scoped renderMath, rAF debounce).
- Sektion 3 (CSS-Audit + a11y + CWV): Tasks 8–9 ✓; SEO validation folded into Task 9 Step 7 + Task 10.
- Verification (Spec): Task 10 ✓.
- Risk ordering (Split → Perf → CSS/a11y): Tasks sequenced 1–6 → 7 → 8–9 → 10 ✓.

**Placeholder scan:** Steps contain actual code/grep commands. No "TBD"/"implement later". Some steps say "use the real token/class name" where the exact name must be read from the file at execution time — this is intentional (plan cannot hardcode unknown token names without reading `:root`); the step tells the implementer exactly where to read it.

**Type consistency:** `LA.math`, `LA.progress`, `LA.quiz`, `LA.viz`, `LA.render`, `LA.state`, `LA.elements`, `LA.t`, `LA.escapeHtml`, `LA.randInt`, `LA.renderFn`, `LA.renderNow` — used consistently across tasks. `LA.renderFn` (Task 3) vs `LA.renderNow` (Task 7): `renderFn` is the simple alias used before render moves; `renderNow` is the synchronous variant after debounce. After Task 7, audit and replace any remaining `LA.renderFn()` with `LA.renderNow()` where synchronous render is needed — noted in Task 7 Step 4.
