# Contributing

Danke für Beiträge zum Projekt.

## Schnellstart

1. Repository forken
2. Feature-Branch erstellen (`feature/mein-feature`)
3. Änderungen umsetzen
4. Pull Request öffnen

## Richtlinien

- Fokus auf verständliche Didaktik (Hauptschulniveau bis Bachelor)
- Neue Konzepte zuerst anschaulich, dann formal erklären; interaktive Beispiele bevorzugen
- Keine unnötige Komplexität in UI/Code
- Texte in sauberem, gut verständlichem Deutsch
- Bei fachlichen Änderungen möglichst ein Mini-Quiz pro Lektion ergänzen/anpassen

## Vor PR prüfen

- Führe `node --check` für alle `app*.js`, `service-worker.js`, `data/learningPath.js` und `tools/*.js` aus.
- Prüfe Lerninhalte mit `node tools/validate-content.js`.
- Prüfe `manifest.webmanifest` und die JSON-LD-Blöcke in `index.html` auf gültiges JSON.
- Führe bei Inhaltsänderungen `node tools/gen-llms.js` aus und committe `llms.txt` sowie `llms-full.txt` gemeinsam.
- Teste die Seite über `python3 -m http.server 8080` ohne Konsolenfehler.
- Funktioniert Savegame Export/Import?
- Bleibt Offline-Caching funktionsfähig?

Pull Requests brauchen eine kurze Problembeschreibung, nachvollziehbare Testschritte und bei sichtbaren UI-Änderungen einen Screenshot. Verlinke zugehörige Issues mit `Closes #123`.

## Technische Leitplanken

- Keine Build- oder Laufzeitabhängigkeiten ohne klaren Mehrwert ergänzen.
- Die Script-Reihenfolge in `index.html` beibehalten; `data/learningPath.js` muss vor `app.js` laden.
- Neue UI-Texte auf Deutsch und verständlich für Einsteiger formulieren.
- Bei neuen Cache-Assets `CACHE_NAME` und `SW_VERSION` gemeinsam erhöhen.

## Commit-Empfehlung

Nutze aussagekräftige Commits, z. B.:

```text
feat: erweitere modul 8 um diagonalisierungsübungen
fix: korrigiere quiz-auswertung in m4-l2
docs: ergänze beitragsrichtlinien
```
