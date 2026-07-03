# Lineare Algebra Trainer

Interaktive Lernplattform für den Wiedereinstieg in die Lineare Algebra – von den absoluten Grundlagen bis zum fortgeschrittenen Bachelor-Niveau.

**Zielgruppe:** Studierende, die bei Null starten und systematisch auf Prüfungsniveau kommen wollen.

## Features

- Vollständiger Lernpfad in 11 Modulen (Einsteiger bis Profi)
- Theorie, Beispiele, Übungsaufgaben und Quiz pro Lektion
- Fortschrittsanzeige + Mastery-Score
- Savegame-System:
  - Fortschritt lokal speichern
  - Als JSON exportieren (Download)
  - Später wieder importieren (Upload)
- Offline-Lernen via HTML5 Cache (Service Worker + Cache API)
- Rechenwerkzeuge für schnelle Selbstkontrolle

## Lokale Nutzung

Einfach `index.html` im Browser öffnen.

Für eine lokale Server-Umgebung (empfohlen für Service Worker):

```bash
python3 -m http.server 8080
```

Dann aufrufen:

```text
http://localhost:8080
```

## Deployment auf GitHub Pages

Dieses Repository ist auf **GitHub Pages via GitHub Actions** ausgelegt.

Nach Push auf `main` deployt der Workflow automatisch.

Ziel-URL:

```text
https://huskynarr.is-a.dev/lineare-algebra/
```

### Benötigte GitHub-Einstellungen

1. In GitHub: **Settings → Pages**
2. Source auf **GitHub Actions** setzen
3. Danach einmal auf `main` pushen

## Struktur

```text
.
├── .github/workflows/
│   ├── ci.yml
│   └── deploy-pages.yml
├── data/learningPath.js
├── app.js
├── index.html
├── service-worker.js
├── styles.css
├── manifest.webmanifest
├── CONTRIBUTING.md
└── LICENSE
```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Details in `LICENSE`.
