# DESIGN.md

Design-System und visuelle Sprache des Lineare-Algebra-Trainers. Verbindliche Referenz vor jeder Änderung an Farben, Layout, Komponenten oder Typografie.

## Grundprinzipien

1. **Dark-first, Light optional** — `:root` definiert das Dark-Theme, `[data-theme="light"]` überschreibt nur die nötigen Token. Neue Token immer in beiden Blöcken anlegen.
2. **Design-Token, keine Magiewerte** — Farben, Radien, Schatten als CSS-Variablen in `:root`. In Komponenten nur `var(--…)`, nie rote Hex-Werte.
3. **Eine Typfamilie** — Inter (mit System-Fallbacks). Keine zweite Schrift.
4. **Mobile-first, responsive** — Layout bricht bei `1024px` und `640px` um (siehe Breakpoints).
5. **Barrierefreiheit** — Mindest-Touch-Ziel `2.75rem`, `:focus-visible`-Outline via `--accent`, `safe-area-inset`-Padding in der Topbar.
6. **Kein Build, kein Framework** — reines CSS, kein Preprocessor, keine Utility-Library.

## Design-Token

Alle Token leben in `styles.css`. Dark-Theme in `:root` (Zeile 1), Light-Theme in `[data-theme="light"]` (Zeile 36).

### Farben

| Token | Dark | Light | Verwendung |
|---|---|---|---|
| `--bg` | `#0b1220` | `#f1f5f9` | Seitenhintergrund (radialer Verlauf mit `--grad-top`) |
| `--panel` | `#111a2e` | `#ffffff` | Haupt-Panel-Hintergrund |
| `--panel-soft` | `#17223b` | `#f8fafc` | Sekundäre Panel-Flächen |
| `--surface` | `#0f1a30` | `#ffffff` | Eingaben, Karten |
| `--surface-2` | `#0d1528` | `#f1f5f9` | Inputs, tiefer liegende Flächen |
| `--text` | `#e5e7eb` | `#0f172a` | Haupttext |
| `--text-soft` | `#cbd5e1` | `#475569` | Sekundärer Text, Beschreibungen |
| `--accent` | `#38bdf8` | `#0284c7` | Primärakzent, Links, Buttons |
| `--accent-2` | `#22c55e` | `#16a34a` | Sekundärakzent |
| `--forest` | `#22c55e` | `#16a34a` | "Erledigt"-Farbe |
| `--warning` | `#f59e0b` | `#d97706` | Ruhiges Warn-/"Falsch"-Feedback |
| `--viz-result` | `#c084fc` | `#7c3aed` | Neutrale Resultate in Visualisierungen |
| `--border` | `#243151` | `#cbd5e1` | Standardrahmen |
| `--border-soft` | `#2d4368` | `#e2e8f0` | Dezente Rahmen |
| `--input-border` | `#314165` | `#cbd5e1` | Eingaberahmen |
| `--ghost-border` | `#465781` | `#cbd5e1` | Ghost-Button-Rahmen |
| `--done-border` | `#2faa6c` | `#16a34a` | Bearbeitet-Markierung |
| `--track` | `#243152` | `#e2e8f0` | Fortschrittsbalken-Hintergrund |
| `--line` | `#2d3f65` | `#e2e8f0` | Trennlinien |
| `--badge-bg` | `#364b72` | `#e2e8f0` | Lektions-Badge |
| `--badge-done-bg` | `#11673a` | `#bbf7d0` | Erledigt-Badge |
| `--grad-top` | `#1a2650` | `#e0f2fe` | Verlauf-Spitze (Background) |
| `--topbar-bg` | `rgba(11,18,32,.92)` | `rgba(255,255,255,.9)` | Topbar-Hintergrund (mit Blur) |
| `--btn-text` | `#0f172a` | `#ffffff` | Text auf Primary-Buttons |
| `--output-text` | `#bae6fd` | `#0369a1` | Tool-Ergebnisausgabe |
| `--success-text` | `#86efac` | `#15803d` | "Richtig"-Feedback |
| `--error-text` | `#fbbf24` | `#92400e` | "Falsch"-Feedback ohne Alarmrot |
| `--status-text` | `#bbf7d0` | `#15803d` | Statusmeldungen |

### Effekte & Geometrie

| Token | Wert | Verwendung |
|---|---|---|
| `--shadow` | `0 10px 28px rgb(0 0 0 / 28%)` | Panel-Schatten (Light: `0 10px 28px rgb(15 23 42 / 8%)`) |
| `--hover-overlay` | `rgba(255,255,255,.08)` | Hover-Overlay (Light: `rgba(15,23,42,.06)`) |
| `--radius` | `0.8rem` | Standard-Radius für Panels/Karten |

Button-Radius ist fest `0.6rem` (nicht via Token) — bewusst etwas enger als Panel-Radius.

## Typografie

- **Schriftfamilie:** `Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- **Grundlinie:** `line-height: 1.55` (body), `1.2` (Überschriften)
- **Überschriften:** `h1, h2, h3` mit `margin: 0 0 0.5rem`, keine eigene Schriftgröße im Reset — Größen werden kontextuell in Komponenten gesetzt.
- **Mathematik:** gerendert via KaTeX (CDN, deferred). Keine manuellen MathML-Styles.

## Layout

### Hauptstruktur

```text
body[data-view]
├── .topbar + .app-nav (Start / Lernen / Werkzeuge / Fortschritt)
├── .home-view         (nur Start)
├── .layout            (pro Ansicht gezielt reduziert)
│   ├── .sidebar-left  (Lernpfad oder Lernplan)
│   ├── .content       (aktive Lektion oder Warmup)
│   └── .sidebar-right (nur Werkzeuge)
├── #progress-panel    (nur Fortschritt)
└── .footer
```

### Breakpoints

| Breakpoint | Verhalten |
|---|---|
| `> 760px` | Lernansicht zweispaltig, andere Ansichten einspaltig bzw. Tool-Grid |
| `≤ 760px` | Einspaltig, kompakte Hauptnavigation, Lernpfad klappt nach Auswahl zu |
| `≤ 640px` | Reduzierte Padding-Werte und einspaltige Karten |
| `641–1024px` | Übergangsregeln für mittlere Viewports |

### Safe Areas

Die Topbar nutzt `env(safe-area-inset-*)` für Notch-kompatibles Padding. Bei neuen fixierten Elementen ebenso verfahren.

## Komponenten

### Buttons

- **Primary:** `background: var(--accent)`, `color: var(--btn-text)`, `font-weight: 600`, `min-height: 2.75rem`
- **Ghost:** `.ghost` — transparenter Hintergrund, `1px solid var(--ghost-border)`, `color: var(--text)`
- **Hover:** `filter: brightness(1.06)`, `transform: translateY(-1px)`
- **Focus:** `outline: 2px solid var(--accent); outline-offset: 2px`
- **Share-Buttons** (`.share-btn--wa/x/fb/copy`): nutzen fixe Markenfarben, kein Token.

### Panels & Karten

- `.panel` / `.module-card` / `.plan-card` / `.tool`: `background: var(--panel)`, `border: 1px solid var(--border)`, `border-radius: var(--radius)`.
- `.panel-soft` / `.surface` für eingebettete Flächen.

### Badges

- `.badge` — klein, `background: var(--badge-bg)`, rund.
- Erledigt-Badge nutzt `--badge-done-bg` + `--done-border`.

### Fortschrittsbalken

- `.progress-bar` — `background: var(--track)`, Füllung `background: var(--accent)` (oder `--forest` für Modulabschluss). Inline `style="width: N%"` steuert die Füllung.

### Quiz

- `.quiz` — Panel mit Options-Liste.
- `.quiz-feedback` — grün/amber je nach Antwort (`--success-text` / `--error-text`).
- `.quiz-solution` / `.quiz-solution__body` — ausklappbare Lösung.

### Referenzen & FAQ (neu)

- `.reference-list` — Liste von Quelllinks mit `rel="noopener noreferrer nofollow"`, `target="_blank"`.
- `.reference-source` — kleines Label (Wikipedia / MIT OCW / 3Blue1Brown).
- `.faq-item` — `<details>`-Element, klappbare Q&A-Sektion.
- `.faq-answer` — Antwort-Body.

### Tools (Rechenwerkzeuge)

- `.tool` — klappbare Karte (`.tool__summary` / `.tool__body`).
- `.tool__output` — Ergebnisfeld mit `--output-text` und monospaced `font-family`.

### Warmup / Spielmodus

- `.warmup-*` — Week-0-Warmup-Phase mit Fragen und Sternen.
- `.lesson-game` / `.game-btn` — Lektions-Spielmodus.
- `.lesson-stars` — Sterne-Rating.
- `.certificate-banner` — Zertifikats-Anzeige ab 80 % Lernstand.

## Visuelle Sprache

- **Ton:** ruhig, akademisch, aber freundlich. Emojis nur sparsam zur Orientierung oder in Bannern einsetzen.
- **Farbsemantik:** Blau = Akzent/Aktion, Grün = Erfolg/Erledigt, Amber = Hinweis oder Fehlerfeedback. Diese Zuordnung nicht mischen.
- **Dichte:** großzügiges Padding, klare Trennlinien (`--line`/`--border`), keine Schatten-Hierarchie über mehrere Ebenen (nur eine Shadow-Ebene auf Top-Level-Panels).
- **Animationen:** dezent, ≤ `0.15s` für Hover/Übergänge. Keine Page-Transitions.

## Dark/Light-Wechsel

- Theme wird via `data-theme="light"` auf `<html>` gesetzt (Toggler in Sidebar).
- Präferenz wird in `localStorage` unter `lineare-algebra-theme` gespeichert.
- Standard ist Dark (`:root` ohne `data-theme`).
- `color-scheme` wird passend gesetzt (`dark`/`light`), damit native Controls (Scrollbars, Form-Controls) thematisch passen.

## Druck

`@media print` (Zeile 1489) blendet Topbar, Sidebars, Footer und interaktive Controls aus — nur der Lektionsinhalt wird gedruckt. Bei neuen UI-Elementen prüfen, ob sie im Druck ausgeblendet werden müssen.

## Was NICHT tun

- Keine neuen Schriftarten laden.
- Keine CSS-Frameworks (Tailwind, Bootstrap, …) einführen.
- Keine roten Hex-Werte in Komponenten — immer Token.
- Keine neue Token-Gruppe anlegen, ohne sie in beiden Themes zu definieren.
- Keine `z-index`-Werte > `100` (Topbar-Höhe). Overlays nutzen `90`/`80`.
- Keine fixen Pixel-Breiten für Hauptlayout — Grid + `fr` + `minmax()` verwenden.
- Keine `position: fixed` für neue Panels — `sticky` oder Grid-Platzierung bevorzugen.
