#!/usr/bin/env node
/*
 * llms-Generator (keine externen Abhängigkeiten, nur Node-Builtins).
 *
 * Erzeugt aus data/learningPath.js zwei Dateien für LLM-Crawler (GEO):
 *   - llms.txt         : Kurzfassung im llmstxt.org-Format
 *   - llms-full.txt    : Vollständiger Inhalt als Markdown
 *
 * Aufruf:  node tools/gen-llms.js
 *
 * Das ist KEIN Build-Step im CI-Sinne — die generierten Dateien sind
 * eingecheckt. Skript nur ausführen, wenn sich der Lernpfad ändert.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "data", "learningPath.js");

const BASE_URL = "https://huskynarr.is-a.dev/lineare-algebra/";

function loadLearningPath() {
  const sandbox = { window: {} };
  const src = fs.readFileSync(DATA, "utf8");
  // learningPath.js weist window.LEARNING_PATH zu — im Sandbox-Objekt ausführen.
  // eslint-disable-next-line no-new-func
  new Function("window", src).call(sandbox, sandbox.window);
  return {
    learningPath: sandbox.window.LEARNING_PATH || [],
    references: sandbox.window.LEARNING_REFERENCES || {}
  };
}

function formatContent(s) {
  if (typeof s !== "string") return "";
  // LaTeX bleibt erhalten, damit Formeln und Matrizen maschinenlesbar sind.
  return s.replace(/\r?\n/g, " ").replace(/\s{2,}/g, " ").trim();
}

function quizAnswer(quiz) {
  if (!quiz) return "";
  let a = "";
  if (quiz.inputType !== "text" && Array.isArray(quiz.options) && typeof quiz.answerIndex === "number" && quiz.options[quiz.answerIndex] != null) {
    a = `Richtig ist: ${quiz.options[quiz.answerIndex]}. `;
  }
  if (quiz.explanation) a += quiz.explanation;
  if (quiz.solution) a += ` Lösungsweg: ${quiz.solution}`;
  return a.trim();
}

function refList(refs) {
  if (!Array.isArray(refs) || refs.length === 0) return "";
  return refs.map((r) => `- [${r.label || r.url}](${r.url || ""})${r.source ? ` — ${r.source}` : ""}`).join("\n");
}

function buildShort(lp) {
  const lines = [];
  lines.push("# Lineare Algebra Trainer");
  lines.push("");
  lines.push(`> Kostenloser, interaktiver Lineare-Algebra-Trainer (deutsch, offline-fähig, keine Registrierung, keine Werbung). 17 Module, 52 Lektionen von Schul-Basics über Lineare Algebra 1 bis Lineare Algebra 2 (Normalformen, Bilinearformen, Moduln) mit Theorie, Beispielen, Übungen, Mini-Quiz und Spielfortschritt. Inklusive Rechenwerkzeugen für Vektoren, Matrizen, Determinanten, Gauß-Verfahren und Eigenwerte. Zielgruppe: Anfänger bis Klausur-Kandidaten, orientiert an der Uni Freiburg.`);
  lines.push("");
  lines.push("## Wichtigste Links");
  lines.push("");
  lines.push(`- [App (Startseite)](${BASE_URL})`);
  lines.push(`- [Vollständiger Inhalt für LLMs](${BASE_URL}llms-full.txt)`);
  lines.push(`- [Sitemap](${BASE_URL}sitemap.xml)`);
  lines.push(`- [Quellcode auf GitHub](https://github.com/Huskynarr/lineare-algebra)`);
  lines.push("");
  lines.push("## Module");
  lines.push("");
  lp.forEach((mod) => {
    lines.push(`### ${mod.title}`);
    lines.push("");
    if (Array.isArray(mod.goals) && mod.goals.length) {
      lines.push(`Lernziele: ${mod.goals.join("; ")}.`);
      lines.push("");
    }
    lines.push("Lektionen:");
    lines.push("");
    mod.lessons.forEach((l) => {
      lines.push(`- ${l.title} (${l.difficulty}, ~${l.estimatedMinutes} min)`);
    });
    lines.push("");
  });
  return lines.join("\n") + "\n";
}

function buildFull(lp, refs) {
  const lines = [];
  lines.push("# Lineare Algebra Trainer — Vollständiger Inhalt");
  lines.push("");
  lines.push("> Kostenloser, interaktiver Lineare-Algebra-Trainer (deutsch, offline-fähig). Quelle: " + BASE_URL);
  lines.push("");
  lines.push("Dieser Text ist eine maschinenlesbare Inhaltsübersicht für LLM-Crawler und Suchmaschinen. Für die interaktive Version siehe die Web-App.");
  lines.push("");
  lines.push("---");
  lines.push("");

  lp.forEach((mod, mi) => {
    lines.push(`## Modul ${mi}: ${mod.title}`);
    lines.push("");
    lines.push(`- Level: ${mod.level || "—"}`);
    lines.push(`- Zielzeit: ${mod.targetHours || "—"} Stunden`);
    if (Array.isArray(mod.goals) && mod.goals.length) {
      lines.push(`- Lernziele: ${mod.goals.join("; ")}`);
    }
    lines.push("");

    mod.lessons.forEach((l) => {
      lines.push(`### Lektion: ${l.title}`);
      lines.push("");
      lines.push(`- Schwierigkeit: ${l.difficulty || "—"}`);
      lines.push(`- Empfohlene Zeit: ${l.estimatedMinutes || "—"} Minuten`);
      lines.push("");

      if (Array.isArray(l.theory) && l.theory.length) {
        lines.push("#### Theorie");
        lines.push("");
        l.theory.forEach((t) => lines.push(`- ${formatContent(t)}`));
        lines.push("");
      }

      if (l.example) {
        lines.push("#### Beispiel");
        lines.push("");
        lines.push(formatContent(l.example));
        lines.push("");
      }

      if (l.exercise) {
        lines.push("#### Übungsaufgabe");
        lines.push("");
        lines.push(formatContent(l.exercise));
        if (l.hint) lines.push(`\n*Tipp: ${formatContent(l.hint)}*`);
        lines.push("");
      }

      if (l.quiz) {
        const ans = quizAnswer(l.quiz);
        lines.push("#### Mini-Quiz (Q&A)");
        lines.push("");
        lines.push(`**F:** ${formatContent(l.quiz.question)}`);
        lines.push("");
        lines.push(`**A:** ${formatContent(ans)}`);
        lines.push("");
      }

      const r = refs[l.id];
      if (r && r.length) {
        lines.push("#### Quellen & weiterführende Links");
        lines.push("");
        lines.push(refList(r));
        lines.push("");
      }

      lines.push("---");
      lines.push("");
    });
  });

  lines.push("## Rechenwerkzeuge");
  lines.push("");
  lines.push("- Skalarprodukt & Winkel zwischen zwei Vektoren");
  lines.push("- Determinante einer 2x2-Matrix");
  lines.push("- Matrix mal Matrix");
  lines.push("- Inverse einer 2x2-Matrix");
  lines.push("- Gauß-Verfahren für 2x2-Systeme");
  lines.push("- Eigenwerte: charakteristisches Polynom und Eigenwerte (bis 4x4)");
  lines.push("- Jordan-Normalform: Kästchenstruktur und Minimalpolynom");
  lines.push("- Bilinearform: Rang, Signatur (Sylvester) und Klassifikation");
  lines.push("");

  return lines.join("\n");
}

function main() {
  const { learningPath, references } = loadLearningPath();
  if (!learningPath.length) {
    console.error("Konnte LEARNING_PATH nicht laden.");
    process.exit(1);
  }
  const shortTxt = buildShort(learningPath);
  const fullTxt = buildFull(learningPath, references);
  fs.writeFileSync(path.join(ROOT, "llms.txt"), shortTxt, "utf8");
  fs.writeFileSync(path.join(ROOT, "llms-full.txt"), fullTxt, "utf8");
  const lessonCount = learningPath.reduce((n, m) => n + (m.lessons ? m.lessons.length : 0), 0);
  console.log(`llms.txt + llms-full.txt geschrieben (${learningPath.length} Module, ${lessonCount} Lektionen).`);
}

main();
