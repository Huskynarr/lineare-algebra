// app.progress.js
// Savegame / Fortschritt / Lernstand — liest und schreibt localStorage und LA.state,
// führt kein DOM-Rendering aus. Render-Aufrufe erfolgen über LA.renderFn().
window.LA = window.LA || {};
LA.progress = LA.progress || {};

// Höchste erreichbare Zertifikatsstufe: "la2" (gesamter Pfad) > "la1" > null.
LA.progress.defaultProgress = function () {
  const now = new Date().toISOString();
  return {
    version: LA.SAVEGAME_VERSION,
    startedAt: now,
    updatedAt: now,
    warmupCompleted: false,
    completedLessons: {},
    quizAnswers: {},
    quizTextAnswers: {},
    quizTextChecked: {},
    reviewQueue: [],
    lessonGames: {},
    certificate: { unlocked: false, name: "", shownAt: null, stages: { la1: false, la2: false } }
  };
};

LA.progress.isObject = function (value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

LA.progress.loadProgress = function () {
  let raw = null;
  try {
    raw = localStorage.getItem(LA.STORAGE_KEY);
  } catch (_error) {
    return LA.progress.defaultProgress();
  }
  if (!raw) {
    return LA.progress.defaultProgress();
  }
  try {
    const parsed = JSON.parse(raw);
    return LA.progress.sanitizeProgress(parsed);
  } catch (_error) {
    return LA.progress.defaultProgress();
  }
};

LA.progress.sanitizeProgress = function (source) {
  if (!LA.progress.isObject(source)) {
    return LA.progress.defaultProgress();
  }

  const candidate = LA.progress.isObject(source.progress) ? source.progress : source;
  // Der Lernpfad wurde für LA1+LA2 vollständig neu aufgebaut (SAVEGAME_VERSION 2).
  // Alte v1-Fortschritte beziehen sich auf andere Lektionen/Inhalte und werden
  // verworfen — es gibt keine sinnvolle ID-Korrespondenz für eine Migration.
  const incomingVersion = typeof candidate.version === "number" ? candidate.version : 0;
  if (incomingVersion < LA.SAVEGAME_VERSION) {
    return LA.progress.defaultProgress();
  }
  const base = LA.progress.defaultProgress();
  const sanitized = {
    version: LA.SAVEGAME_VERSION,
    startedAt: typeof candidate.startedAt === "string" ? candidate.startedAt : base.startedAt,
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : base.updatedAt,
    warmupCompleted: candidate.warmupCompleted === true,
    completedLessons: {},
    quizAnswers: {},
    quizTextAnswers: {},
    quizTextChecked: {},
    reviewQueue: Array.isArray(candidate.reviewQueue)
      ? [...new Set(candidate.reviewQueue.filter((id) => typeof id === "string" && LA.lessonById.has(id)))]
      : [],
    lessonGames: {},
    certificate: LA.progress.sanitizeCertificate(candidate.certificate)
  };

  if (LA.progress.isObject(candidate.completedLessons)) {
    for (const lessonId of Object.keys(candidate.completedLessons)) {
      if (LA.lessonById.has(lessonId) && candidate.completedLessons[lessonId] === true) {
        sanitized.completedLessons[lessonId] = true;
      }
    }
  }

  if (LA.progress.isObject(candidate.quizAnswers)) {
    for (const lessonId of Object.keys(candidate.quizAnswers)) {
      const answer = candidate.quizAnswers[lessonId];
      const lesson = LA.lessonById.get(lessonId);
      if (
        lesson &&
        Array.isArray(lesson.quiz.options) &&
        Number.isInteger(answer) &&
        answer >= 0 &&
        answer < lesson.quiz.options.length
      ) {
        sanitized.quizAnswers[lessonId] = answer;
      }
    }
  }

  if (LA.progress.isObject(candidate.quizTextAnswers)) {
    for (const lessonId of Object.keys(candidate.quizTextAnswers)) {
      const lesson = LA.lessonById.get(lessonId);
      const answer = candidate.quizTextAnswers[lessonId];
      if (lesson?.quiz?.inputType === "text" && typeof answer === "string") {
        sanitized.quizTextAnswers[lessonId] = answer.slice(0, 500);
        sanitized.quizTextChecked[lessonId] = candidate.quizTextChecked?.[lessonId] === true;
      }
    }
  }

  if (LA.progress.isObject(candidate.lessonGames)) {
    for (const lessonId of Object.keys(candidate.lessonGames)) {
      if (!LA.lessonById.has(lessonId)) continue;
      const g = candidate.lessonGames[lessonId];
      if (!LA.progress.isObject(g)) continue;
      sanitized.lessonGames[lessonId] = {
        bestPct: typeof g.bestPct === "number" && isFinite(g.bestPct) ? Math.max(0, Math.min(100, Math.round(g.bestPct))) : 0,
        bestStars: typeof g.bestStars === "number" && isFinite(g.bestStars) ? Math.max(0, Math.min(3, Math.round(g.bestStars))) : 0,
        attempts: typeof g.attempts === "number" && isFinite(g.attempts) ? Math.max(0, Math.round(g.attempts)) : 0
      };
    }
  }

  return sanitized;
};

LA.progress.sanitizeCertificate = function (source) {
  if (!LA.progress.isObject(source)) {
    return { unlocked: false, name: "", shownAt: null, stages: { la1: false, la2: false } };
  }
  const stagesIn = LA.progress.isObject(source.stages) ? source.stages : {};
  return {
    unlocked: source.unlocked === true,
    name: typeof source.name === "string" ? source.name.slice(0, 80) : "",
    shownAt: typeof source.shownAt === "string" ? source.shownAt : null,
    stages: {
      la1: stagesIn.la1 === true,
      la2: stagesIn.la2 === true
    }
  };
};

LA.progress.persistProgress = function () {
  LA.state.progress.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(LA.STORAGE_KEY, JSON.stringify(LA.state.progress));
    return true;
  } catch (_error) {
    if (typeof LA.showStatus === "function") {
      LA.showStatus("Fortschritt konnte in diesem Browser nicht gespeichert werden.", true);
    }
    return false;
  }
};

LA.progress.exportSavegame = function () {
  const payload = {
    app: "lineare-algebra-trainer",
    version: LA.SAVEGAME_VERSION,
    exportedAt: new Date().toISOString(),
    progress: LA.state.progress
  };
  const data = JSON.stringify(payload, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `lineare-algebra-savegame-${stamp}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  LA.showStatus("Savegame wurde heruntergeladen.");
};

LA.progress.importSavegame = function (event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = String(reader.result || "");
      const parsed = JSON.parse(text);
      LA.state.progress = LA.progress.sanitizeProgress(parsed);
      LA.progress.persistProgress();
      // Import kann beliebige Abschluss-Sterne/Klassen ändern — Liste neu aufbauen.
      if (LA.render) LA.render.moduleListRendered = false;
      LA.renderFn();
      LA.showStatus("Savegame erfolgreich geladen.");
    } catch (_error) {
      LA.showStatus("Import fehlgeschlagen: Datei ist kein gültiges Savegame.", true);
    } finally {
      LA.elements.importProgress.value = "";
    }
  };

  reader.readAsText(file, "utf-8");
};

LA.progress.resetProgress = function () {
  const accepted = window.confirm("Möchtest du den gesamten Fortschritt wirklich löschen?");
  if (!accepted) {
    return;
  }
  LA.state.progress = LA.progress.defaultProgress();
  LA.progress.persistProgress();
  // Nach Reset soll die Liste beim nächsten Render neu aufgebaut werden
  // (window.location.reload() lädt ohnehin neu, aber defensiv gesetzt).
  if (LA.render) LA.render.moduleListRendered = false;
  window.location.reload();
};

LA.progress.computeMasteryFor = function (lessons) {
  if (!lessons.length) return 0;
  const total = lessons.length;
  const completed = lessons.filter((l) => LA.isCompleted(l.id)).length;
  const completionRate = completed / total;
  const quizCorrect = lessons.filter((lesson) => LA.progress.isQuizCorrect(lesson)).length;
  const quizRate = quizCorrect / total;
  return Math.round((completionRate * 0.7 + quizRate * 0.3) * 100);
};

LA.progress.isQuizCorrect = function (lesson) {
  if (!lesson?.quiz) return false;
  if (lesson.quiz.inputType === "text") {
    if (LA.state.progress.quizTextChecked?.[lesson.id] !== true) return false;
    const answer = LA.state.progress.quizTextAnswers?.[lesson.id];
    const accepted = lesson.quiz.acceptAnswers || [lesson.quiz.correctAnswer];
    const normalize = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ").replace(",", ".");
    return accepted.some((value) => normalize(answer) === normalize(value));
  }
  return LA.state.progress.quizAnswers[lesson.id] === lesson.quiz.answerIndex;
};

// Höchste erreichbare Zertifikatsstufe: "la2" (gesamter Pfad) > "la1" > null.
LA.progress.certificateStage = function () {
  const all = LA.allLessons;
  if (LA.allLessonsDone(all) && LA.progress.computeMasteryFor(all) >= LA.CERTIFICATE_MASTERY_THRESHOLD) return "la2";
  const la1 = LA.lessonsOfModules(LA.LA1_MODULE_IDS);
  if (LA.allLessonsDone(la1) && LA.progress.computeMasteryFor(la1) >= LA.CERTIFICATE_MASTERY_THRESHOLD) return "la1";
  return null;
};

LA.progress.certificateAvailable = function () {
  return LA.progress.certificateStage() !== null;
};

LA.progress.computeMastery = function () {
  return LA.progress.computeMasteryFor(LA.allLessons);
};
