# Lineare Algebra Trainer

[![Deploy to GitHub Pages](https://github.com/Huskynarr/lineare-algebra/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Huskynarr/lineare-algebra/actions/workflows/deploy-pages.yml)
[![CI](https://github.com/Huskynarr/lineare-algebra/actions/workflows/ci.yml/badge.svg)](https://github.com/Huskynarr/lineare-algebra/actions/workflows/ci.yml)

Interaktive Lernplattform für Mathematik und Lineare Algebra — verständlich ab Hauptschulniveau bis zum fortgeschrittenen Bachelor-Niveau.

**Live:** <https://huskynarr.is-a.dev/lineare-algebra/>

**Zielgruppe:** Schülerinnen, Schüler und Studierende, die passend zu ihrem Vorwissen einsteigen und systematisch Bachelor-Niveau erreichen wollen.

## Features

- **17 Module, 52 Lektionen** (Einsteiger → Profi): Schul-Basics & Beweise, komplexe Zahlen, Vektoren, Matrizen, LGS, Determinanten, Vektorräume, lineare Abbildungen, Eigenwerte, Skalarprodukt — und in **Lineare Algebra 2**: abstrakte Vektorräume, Jordan-/rationale Normalform, Bilinearformen, Moduln über Hauptidealringen, Freiburg-Klausurtraining
- **Pro Lektion:** Theorie, Beispiel, Übungsaufgabe mit Tipp, Mini-Quiz (Multiple-Choice oder Freitext), Spielmodus
- **Drei Einstiegsrouten** für Grundlagencheck, vollständigen Aufbau oder direkten LA1-Start
- **Klarer App-Flow** mit getrennten Ansichten für Start, Lernen, Werkzeuge und Fortschritt
- **Interaktive Visualisierungen** für Zahlenstrahl, Vektoren, Linearkombinationen, Projektionen und Matrixabbildungen
- **Fortschrittsanzeige** + Lernstand (70 % Bearbeitung + 30 % Quiz korrekt)
- **Savegame-System:** Fortschritt lokal speichern, als JSON exportieren/importieren
- **Offline-Lernen** via Service Worker + Cache API
- **Rechenwerkzeuge:** Skalarprodukt & Winkel, Determinante 2×2, Matrix-Multiplikation, Inverse 2×2, Gauß-Verfahren 2×2 — sowie für LA2: Eigenwert-Rechner (char. Polynom + Eigenwerte bis 4×4), Jordan-Normalform-Rechner (Kästchen & Minimalpolynom), Bilinearform-Rechner (Rang, Signatur, Klassifikation)
- **Quellen & Referenzen** pro Lektion (Wikipedia, historische Mathematiker-Artikel, Freiburger Altklausuren der Fachschaft Mathematik)
- **Dark / Light Theme** umschaltbar
- **Zertifikat** ab 80 % Lernstand

## Lokale Nutzung

Einfach `index.html` im Browser öffnen. Für Service Worker wird `http://` benötigt (nicht `file://`):

```bash
python3 -m http.server 8080
# dann http://localhost:8080 öffnen
```

## SEO, Social & GEO

Die App ist für Suchmaschinen, Social-Media-Preview und LLM-Crawler optimiert:

- **SEO:** vollständige Meta-Tags, `canonical`, `hreflang`, erweiterte `robots`/`googlebot`-Direktiven
- **OpenGraph & Twitter Cards:** `summary_large_image` mit eigenem `og-image.svg` (1200×630)
- **Schema.org / JSON-LD:** `EducationalOrganization`, `WebSite`, `Course` (mit `teaches`, `hasCourseInstance`, `about.sameAs` auf Wikipedia), `FAQPage`, pro Lektion dynamisches `Question`-Schema
- **GEO (LLM-Optimierung):**
  - [`llms.txt`](llms.txt) — Kurzfassung nach [llmstxt.org](https://llmstxt.org)-Format
  - [`llms-full.txt`](llms-full.txt) — vollständiger Inhalt als Markdown für LLM-Crawler
  - [`robots.txt`](robots.txt) erlaubt explizit GPTBot, ClaudeBot, PerplexityBot, Google-Extended u. a.
  - Pro Lektion: sichtbarer Q&A-`<details>`-Block + dynamisches `Question`-JSON-LD

Die `llms.*`-Dateien werden aus `data/learningPath.js` generiert:

```bash
node tools/gen-llms.js   # aktualisiert llms.txt + llms-full.txt
```

Das Skript hat keine externen Abhängigkeiten (nur Node-Builtins) und ist nicht Teil des Deploys.

## Deployment auf GitHub Pages

Dieses Repository ist auf **GitHub Pages via GitHub Actions** ausgelegt.

Nach Push auf `main` deployt der Workflow automatisch.

Ziel-URL: <https://huskynarr.is-a.dev/lineare-algebra/>

### Benötigte GitHub-Einstellungen

1. In GitHub: **Settings → Pages**
2. Source auf **GitHub Actions** setzen
3. Danach einmal auf `main` pushen

## Struktur

```text
.
├── .github/workflows/
│   ├── ci.yml                 # Syntax-, Inhalts- und Metadatenprüfung
│   └── deploy-pages.yml       # rsync -> site/ -> GitHub Pages
├── data/learningPath.js        # Lernpfad + LEARNING_REFERENCES (Inhalts-Quelle)
├── tools/gen-llms.js           # Generator für llms.txt / llms-full.txt (nicht deployed)
├── tools/validate-content.js   # Schema- und LaTeX-Inhaltsprüfung
├── app.js                      # Start, Zustand und UI-Orchestrierung
├── app.math.js                 # Mathematische Kernfunktionen
├── app.tools.js                # Interaktive Rechenwerkzeuge
├── app.quiz.js                 # Quiz, Warmup und Spielmodus
├── app.progress.js             # Savegame und Lernstand
├── app.render.js               # HTML-Renderer
├── app.viz.js                  # Canvas-Visualisierungen
├── index.html                  # SEO, OG, JSON-LD, HTML-Gerüst
├── service-worker.js           # Offline-Caching (cache-then-network)
├── styles.css                  # Design-Token, Layout, Komponenten
├── manifest.webmanifest        # PWA-Manifest
├── og-image.svg                # OpenGraph-Vorschaubild (1200×630)
├── favicon.svg
├── icon-192.png / icon-512.png
├── robots.txt                  # inkl. AI-Bot-Allow-Regeln
├── sitemap.xml
├── llms.txt / llms-full.txt    # maschinenlesbarer Inhalt für LLMs
├── AGENTS.md                   # Build- & Architektur-Regeln für Agenten
├── DESIGN.md                   # Design-System & visuelle Sprache
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

## Mitmachen

Siehe [`CONTRIBUTING.md`](CONTRIBUTING.md). Sicherheitslücken bitte nicht öffentlich melden; der Ablauf steht in [`SECURITY.md`](SECURITY.md).

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Details in [`LICENSE`](LICENSE).
