#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dataFile = path.join(root, "data", "learningPath.js");
const source = fs.readFileSync(dataFile, "utf8");
const latexCommands = [
  "approx", "Rightarrow", "tfrac", "neq", "pm", "sqrt", "emptyset", "in", "to", "forall", "exists",
  "neg", "mathbb", "infty", "sum", "dots", "vdots", "geq", "operatorname", "bar", "varphi", "cos",
  "sin", "begin", "end", "lambda", "pi", "vec", "lVert", "rVert", "left", "right", "times", "mid",
  "det", "text", "leq", "mu", "subseteq", "mapsto", "equiv", "dim", "oplus", "ker", "mathrm", "chi",
  "prod", "langle", "rangle", "overline", "cap", "delta", "circ", "deg", "ddots", "cong", "cdots", "cdot"
];
const unsafeLatex = new RegExp(String.raw`(?<!\\)\\(?=(?:${latexCommands.join("|")})(?![A-Za-z])|[,;!])`, "g");
const unsafeMatches = [...source.matchAll(unsafeLatex)];
if (unsafeMatches.length > 0) {
  const lines = unsafeMatches.slice(0, 10).map((match) => source.slice(0, match.index).split("\n").length);
  throw new Error(`Nicht escapete LaTeX-Befehle in data/learningPath.js, Zeilen: ${lines.join(", ")}`);
}

const sandbox = { window: {} };
new Function("window", source).call(sandbox, sandbox.window);
const learningPath = sandbox.window.LEARNING_PATH;
const references = sandbox.window.LEARNING_REFERENCES;
if (!Array.isArray(learningPath) || learningPath.length === 0) throw new Error("LEARNING_PATH fehlt oder ist leer.");
if (!references || typeof references !== "object") throw new Error("LEARNING_REFERENCES fehlt.");

const lessonIds = new Set();
for (const module of learningPath) {
  if (!module.id || !Array.isArray(module.lessons) || module.lessons.length === 0) throw new Error(`Ungültiges Modul: ${module.id || "ohne ID"}`);
  for (const lesson of module.lessons) {
    if (!lesson.id || lessonIds.has(lesson.id)) throw new Error(`Doppelte oder fehlende Lektions-ID: ${lesson.id || "ohne ID"}`);
    lessonIds.add(lesson.id);
    for (const field of ["title", "example", "exercise", "hint", "solution"]) {
      if (typeof lesson[field] !== "string" || lesson[field].trim() === "") throw new Error(`${lesson.id}: Feld ${field} fehlt.`);
    }
    if (!Array.isArray(lesson.theory) || lesson.theory.length === 0) throw new Error(`${lesson.id}: Theorie fehlt.`);
    if (!lesson.quiz || typeof lesson.quiz.question !== "string") throw new Error(`${lesson.id}: Quiz fehlt.`);
    if (lesson.quiz.inputType === "text") {
      if (typeof lesson.quiz.correctAnswer !== "string") throw new Error(`${lesson.id}: Freitextlösung fehlt.`);
    } else if (!Array.isArray(lesson.quiz.options) || !Number.isInteger(lesson.quiz.answerIndex) || lesson.quiz.options[lesson.quiz.answerIndex] == null) {
      throw new Error(`${lesson.id}: Multiple-Choice-Quiz ist ungültig.`);
    }
    const strings = [...lesson.theory, lesson.example, lesson.exercise, lesson.hint, lesson.solution, lesson.quiz.question, lesson.quiz.explanation || ""];
    for (const value of strings) {
      if (/[\u0008\u0009\u000b\u000c\u000d]/.test(value)) throw new Error(`${lesson.id}: unsichtbares Steuerzeichen im Inhalt.`);
      if ((value.match(/\$/g) || []).length % 2 !== 0) throw new Error(`${lesson.id}: ungerade Anzahl an $-Trennzeichen.`);
    }
    if (!Array.isArray(references[lesson.id]) || references[lesson.id].length === 0) throw new Error(`${lesson.id}: Referenzen fehlen.`);
  }
}

const orphanReferences = Object.keys(references).filter((lessonId) => !lessonIds.has(lessonId));
if (orphanReferences.length > 0) throw new Error(`Verwaiste Referenzen: ${orphanReferences.join(", ")}`);
console.log(`Content gültig: ${learningPath.length} Module, ${lessonIds.size} Lektionen.`);
