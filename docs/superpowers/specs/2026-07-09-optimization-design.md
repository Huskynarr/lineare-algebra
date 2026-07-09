# Optimization Design — Incremental (no build step)

Date: 2026-07-09
Approach: A (inkrementell, risikoarm, respektiert "no build step / no framework" aus CLAUDE.md)

## Kontext / Befund

- `app.js` = 2990 Zeilen, 120 Funktionen, 1 IIFE. Graphify: niedrige Cohesion in größten Communities (Projektarchitektur 0.08, App-Kern 0.12, Fortschritt/Quiz 0.14).
- `render()` baut bei jeder Aktion Modulliste + Detail neu, `renderMath` (Zeile 411) scannt `document.body` statt Detail-Scope.
- 49× `getElementById`, 12× `innerHTML`, kein Render-Caching, kein Batching.
- `styles.css` 1856 Zeilen / 252 Selektoren — vermutlich tote Selektoren.
- a11y / Core Web Vitals unaudited.

## Ziele

- Wartbarkeit: `app.js` in logische Namespaced-Dateien, isoliert verständlich.
- Performance: Modulliste cachen, Render scope-restricten, Render-Batching.
- CSS schlank, a11y- + CWV-Pass.

Nicht-Ziele: kein Build-Step, kein Framework, keine ES-Module (`type="module"`), kein Bundler.

## Sektion 1 — Struktur-Split

`app.js` splitten in Namespaced-Dateien via `<script defer>` in fester Reihenfolge. Globaler Namespace `window.LA = {}`. IIFE bleibt Einstieg in `app.js`.

Dateien:
- `app.math.js` — reine Funktionen: `calculateDotProduct`, `calculateDeterminant2x2`, `parseMatrix`, `formatMatrix`, `calculateMatrixMultiply`, `calculateInverse2x2`, `calculateGauss`, `detNxN`, `traceM`, `calculateBilinearForm`, `calculateEigenvalues`, `calculateJordanForm`, `charPolynomialCoeffs`, `partitionBlocks`, `formatNum`, `gcd`, `fmtComplex`.
- `app.progress.js` — `defaultProgress`, `isObject`, `loadProgress`, `sanitizeProgress`, `sanitizeCertificate`, `persistProgress`, `exportSavegame`, `importSavegame`, `resetProgress`, `computeMastery`, `computeMasteryFor`, `certificateAvailable`, `certificateStage`.
- `app.quiz.js` — `evaluateQuiz`, `evaluateTextQuiz`, `normalizeAnswer`, `addToReviewQueue`, `removeFromReviewQueue`, `advanceFromQuiz`, `generateLessonGameQuestions`, `advanceLessonGame`, `mcq`, `quizAnswer`.
- `app.viz.js` — `renderVisualization`, `setupVisualizations`, `redrawVisualizations`, `draw`/`arrow`/`toPx`-Helfer.
- `app.render.js` — `renderModuleList`, `renderLessonDetail`, `renderQuiz`, `renderReferences`, `buildLessonFAQ`, `renderFAQBlock`, `renderModelSolution`, `updateLessonFAQJsonLd`, `renderMath`, `renderProgressSummary`, `renderReviewBanner`, `renderShareBanner`, `generateWarmupQuestions`/`gen*`-Generatoren (Aufgaben-Generatoren, Community 4).
- `app.js` (core) — IIFE-Boot: `elements`-Cache, `state`, `init`, `initTheme`, `applyTheme`, `applyI18n`, `t`, `bindEvents`, `render`-Orchestrierung, `showStatus`, `escapeHtml`, `randInt`, Helfer.

Lade-Reihenfolge `defer` in `index.html`:
1. `data/learningPath.js` (bleibt erste — load-bearing, setzt `window.LEARNING_PATH`)
2. `app.math.js`
3. `app.progress.js`
4. `app.quiz.js`
5. `app.viz.js`
6. `app.render.js`
7. `app.js` (core, init läuft nach DOM-ready via defer)

Jede Datei beginnt mit `window.LA = window.LA || {};` und hängt Funktionen an, z.B. `LA.math = LA.math || {}; LA.math.parseMatrix = function(...) {...};`. Kein IIFE-Wrapper nötig — `defer` garantiert Lade-/Ausführreihenfolge.

Service-Worker: neue Dateien in `APP_ASSETS` aufnehmen. `CACHE_NAME` (`lineare-algebra-cache-v18`) und `SW_VERSION` (`18`) in lockstep bumpen.

Übergangs-Constraint: Funktionen, die sich gegenseitig aufrufen (z.B. `render` → `LA.render.renderLessonDetail`), referenzieren über `LA.*`-Pfade statt Closure. Da alle `defer` vor core-init geladen, sind Aufrufe zur Laufzeit sicher.

## Sektion 2 — Render-Memoization & Perf

- **Modulliste cachen:** `renderModuleList()` einmal beim Boot rendern, innerHTML zwischenspeichern. Bei Completion-Änderung nur betroffene Karte updaten (class toggle `is-completed`/Sterne), kein full innerHTML. Detail-Navigation ruft nur `renderLessonDetail()` auf.
- **`renderMath` scopen:** Zeile 411 `renderMath()` (body-Scan) → `renderMath(elements.lessonDetail)`. Warmup-Aufruf (2102) bleibt scoped.
- **Render-Batching:** `requestAnimationFrame`-Entprellung. Flag `renderQueued`; `render()` setzt Flag, rAF führt einen geplanten Render aus. Wiederholte synchrone `render()`-Aufrufe (Quiz → persist → advance) koaleszieren.
- **`getElementById`-Cache:** zentrale `elements`-Map (Core), überall referenziert statt 49× Neu-Lookup.
- **KaTeX-Lazy (niedriges Risiko):** `renderMathInElement` nur auf sichtbaren Panel-Scope; Theorie/Beispiel mit `$$` erst rendern wenn Panel aktiv. Optionaler Hebel, falls Messung Profit zeigt.

## Sektion 3 — CSS-Audit + a11y + Core Web Vitals

- **CSS-Audit:** Selektorliste aus `styles.css` extrahieren, gegen `app.js`/`index.html`/`data/learningPath.js` grep. Trefferlose Klassen entfernen. Design-Tokens (`:root`/`[data-theme="light"]`) unangetastet (DESIGN.md).
- **a11y:**
  - Quiz-Buttons/Lektionskarten `tabindex`/`role`, sichtbarer Fokus.
  - `aria-live="polite"` auf Quiz-Ergebnis-Region.
  - Kontrast-Check gegen Tokens (blau=action, grün=success, rot=error).
  - `aria-label` an Icon-Buttons (Theme-Toggle, Reset, Next/Prev).
- **Core Web Vitals:**
  - `font-display: swap` / KaTeX-Font preload prüfen.
  - `icon-192/512`: `loading=lazy`/`decoding="async"`; og-image nicht lazy (above-fold).
  - `fetchpriority` für kritische Assets.
  - CLS: feste Dimensionen an Visualisierungs-Canvas/SVG-Containern (`renderVisualization`).
- **SEO/Reach:** `manifest`/metas validieren, `og:image`-Dimensionen, `theme-color`, Sitemap/`lastmod`. llms.txt + JSON-LD bleiben gepflegt (nur Validierung).

## Verification

CI-Check pro Datei (CLAUDE.md):
```bash
node --check app.js app.math.js app.progress.js app.quiz.js app.viz.js app.render.js
node --check service-worker.js
node --check data/learningPath.js
node --check tools/gen-llms.js
node -e "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8'))"
```
Runtime-Test (Service Worker braucht HTTP):
```bash
python3 -m http.server 8080   # http://localhost:8080
```
Manuelle Checks: Fortschritt persistiert (Savegame v1 kompatibel — keine Migration), Quiz evaluiert, KaTeX rendert, Visualisierung zeichnet, Offline-Cache der neuen Dateien.

## Risiko / Reihenfolge

1. Struktur-Split zuerst (größtes Risiko, größter Wartbarkeitsgewinn) — Funktion-für-Funktion verschieben, nach jeder Datei `node --check` + Runtime-Smoke.
2. Render-Memoization — nach Split, isoliert testbar.
3. CSS-Audit + a11y/CWV — last, lowest risk.

Risiko-Fallback: Split kann pro Datei revertiert werden (git). Savegame-Format (`lineare-algebra-savegame-v1`) wird nicht berührt — `SAVEGAME_VERSION` bleibt 1.
