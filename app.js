(function () {
  "use strict";

  const learningPath = Array.isArray(window.LEARNING_PATH) ? window.LEARNING_PATH : [];
  const allLessons = learningPath.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title
    }))
  );
  const lessonById = new Map(allLessons.map((lesson) => [lesson.id, lesson]));
  const STORAGE_KEY = "lineare-algebra-savegame-v1";
  const SAVEGAME_VERSION = 1;
  const SW_VERSION = 4;

  const elements = {
    moduleList: document.getElementById("module-list"),
    lessonDetail: document.getElementById("lesson-detail"),
    completedLessons: document.getElementById("completed-lessons"),
    progressPercent: document.getElementById("progress-percent"),
    masteryScore: document.getElementById("mastery-score"),
    progressBarFill: document.getElementById("progress-bar-fill"),
    statusMessage: document.getElementById("status-message"),
    exportProgress: document.getElementById("export-progress"),
    importProgress: document.getElementById("import-progress"),
    resetProgress: document.getElementById("reset-progress"),
    vectorA: document.getElementById("vector-a"),
    vectorB: document.getElementById("vector-b"),
    calcDot: document.getElementById("calc-dot"),
    dotOutput: document.getElementById("dot-output"),
    matrix2x2: document.getElementById("matrix-2x2"),
    calcDet: document.getElementById("calc-det"),
    detOutput: document.getElementById("det-output")
  };

  const state = {
    selectedLessonId: allLessons[0]?.id || null,
    progress: loadProgress()
  };

  init();

  function init() {
    if (!allLessons.length) {
      elements.lessonDetail.innerHTML = "<h2>Keine Inhalte gefunden</h2><p>Bitte prüfe data/learningPath.js.</p>";
      return;
    }

    if (!lessonById.has(state.selectedLessonId)) {
      state.selectedLessonId = allLessons[0].id;
    }

    render();
    bindEvents();
    registerServiceWorker();
  }

  function bindEvents() {
    elements.moduleList.addEventListener("click", (event) => {
      const target = event.target.closest("[data-lesson-id]");
      if (!target) {
        return;
      }
      state.selectedLessonId = target.getAttribute("data-lesson-id");
      const navToggle = document.getElementById("nav-toggle");
      if (navToggle) {
        navToggle.checked = false;
      }
      render();
    });

    elements.lessonDetail.addEventListener("click", (event) => {
      const nextButton = event.target.closest("#next-lesson");
      if (nextButton) {
        selectNeighborLesson(1);
        return;
      }

      const previousButton = event.target.closest("#prev-lesson");
      if (previousButton) {
        selectNeighborLesson(-1);
        return;
      }

      const checkQuizButton = event.target.closest("#check-quiz");
      if (checkQuizButton) {
        evaluateQuiz();
        return;
      }

      const nextQuizButton = event.target.closest("#next-quiz");
      if (nextQuizButton) {
        advanceFromQuiz();
        return;
      }
    });

    elements.exportProgress.addEventListener("click", exportSavegame);
    elements.importProgress.addEventListener("change", importSavegame);
    elements.resetProgress.addEventListener("click", resetProgress);

    elements.calcDot.addEventListener("click", calculateDotProduct);
    elements.calcDet.addEventListener("click", calculateDeterminant2x2);
  }

  function render() {
    renderModuleList();
    renderLessonDetail();
    renderProgressSummary();
  }

  function renderModuleList() {
    const html = learningPath
      .map((module) => {
        const doneInModule = module.lessons.filter((lesson) => isCompleted(lesson.id)).length;
        const moduleProgress = Math.round((doneInModule / module.lessons.length) * 100);
        const lessonsHtml = module.lessons
          .map((lesson, lessonIndex) => {
            const done = isCompleted(lesson.id);
            const active = lesson.id === state.selectedLessonId;
            return `
              <button
                type="button"
                class="lesson-link${active ? " is-active" : ""}${done ? " is-done" : ""}"
                data-lesson-id="${escapeHtml(lesson.id)}"
              >
                <span>
                  ${escapeHtml(lesson.title)}
                  <small>· ${escapeHtml(lesson.estimatedMinutes.toString())} min</small>
                </span>
                <span class="badge ${done ? "done" : ""}">${done ? "✓" : lessonIndex + 1}</span>
              </button>
            `;
          })
          .join("");

        return `
          <article class="module-card">
            <h3>${escapeHtml(module.title)}</h3>
            <div class="module-meta">
              <span>Level: ${escapeHtml(module.level)}</span>
              <span>Zielzeit: ${escapeHtml(module.targetHours.toString())} h</span>
              <span>Modulfortschritt: ${moduleProgress}%</span>
            </div>
            <div class="module-lessons">${lessonsHtml}</div>
          </article>
        `;
      })
      .join("");

    elements.moduleList.innerHTML = html;
  }

  function renderLessonDetail() {
    const lesson = lessonById.get(state.selectedLessonId);
    if (!lesson) {
      elements.lessonDetail.innerHTML = "<h2>Lektion nicht gefunden</h2>";
      return;
    }

    const module = learningPath.find((entry) => entry.id === lesson.moduleId);
    const userAnswer = state.progress.quizAnswers[lesson.id];
    const hasAnswer = typeof userAnswer === "number";
    const isCorrect = hasAnswer && userAnswer === lesson.quiz.answerIndex;
    const previousText =
      getNeighborLesson(-1) !== null ? `<button id="prev-lesson" type="button" class="ghost">Vorherige Lektion</button>` : "";
    const hasNext = getNeighborLesson(1) !== null;
    const quizButtonHtml = hasAnswer
      ? `<button id="next-quiz" type="button">${hasNext ? "Weiter" : "Abschließen"}</button>`
      : `<button id="check-quiz" type="button">Antwort prüfen</button>`;

    elements.lessonDetail.innerHTML = `
      <h2 id="lesson-title">${escapeHtml(lesson.title)}</h2>
      <p><strong>Modul:</strong> ${escapeHtml(module?.title || "")}</p>
      <p><strong>Schwierigkeit:</strong> ${escapeHtml(lesson.difficulty)} · <strong>Empfohlene Zeit:</strong> ${escapeHtml(
      lesson.estimatedMinutes.toString()
    )} Minuten</p>

      <div class="lesson-actions">
        ${previousText}
      </div>

      <section class="lesson-section">
        <h3>Theorie kompakt</h3>
        ${lesson.theory.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}
      </section>

      <section class="lesson-section">
        <h3>Beispiel</h3>
        <p>${escapeHtml(lesson.example)}</p>
      </section>

      <section class="lesson-section">
        <h3>Übungsaufgabe</h3>
        <p>${escapeHtml(lesson.exercise)}</p>
        <p><strong>Tipp:</strong> ${escapeHtml(lesson.hint)}</p>
      </section>

      <section class="lesson-section quiz">
        <h3>Mini-Quiz</h3>
        <p>${escapeHtml(lesson.quiz.question)}</p>
        ${lesson.quiz.options
          .map(
            (option, index) => `
              <label>
                <input type="radio" name="quiz-answer" value="${index}" ${userAnswer === index ? "checked" : ""}>
                ${escapeHtml(option)}
              </label>
            `
          )
          .join("")}
        ${quizButtonHtml}
        <p class="quiz-feedback ${hasAnswer ? (isCorrect ? "success" : "error") : ""}">
          ${
            hasAnswer
              ? isCorrect
                ? "Richtig. " + escapeHtml(lesson.quiz.explanation)
                : "Noch nicht korrekt. " + escapeHtml(lesson.quiz.explanation)
              : "Noch keine Antwort abgegeben."
          }
        </p>
      </section>
    `;
  }

  function renderProgressSummary() {
    const total = allLessons.length;
    const completed = allLessons.filter((lesson) => isCompleted(lesson.id)).length;
    const completionRate = total > 0 ? completed / total : 0;
    const quizCorrectCount = allLessons.reduce((count, lesson) => {
      const answer = state.progress.quizAnswers[lesson.id];
      if (typeof answer === "number" && answer === lesson.quiz.answerIndex) {
        return count + 1;
      }
      return count;
    }, 0);
    const quizRate = total > 0 ? quizCorrectCount / total : 0;
    const mastery = Math.round((completionRate * 0.7 + quizRate * 0.3) * 100);
    const percent = Math.round(completionRate * 100);

    elements.completedLessons.textContent = `${completed} / ${total}`;
    elements.progressPercent.textContent = `${percent} %`;
    elements.masteryScore.textContent = `${mastery} %`;
    elements.progressBarFill.style.width = `${percent}%`;
  }

  function toggleCompletion(lessonId) {
    if (!lessonById.has(lessonId)) {
      return;
    }
    if (isCompleted(lessonId)) {
      delete state.progress.completedLessons[lessonId];
      showStatus("Lektion als offen markiert.");
    } else {
      state.progress.completedLessons[lessonId] = true;
      showStatus("Lektion als erledigt markiert.");
    }
    persistProgress();
    render();
  }

  function evaluateQuiz() {
    const lesson = lessonById.get(state.selectedLessonId);
    if (!lesson) {
      return;
    }
    const selected = document.querySelector('input[name="quiz-answer"]:checked');
    if (!selected) {
      showStatus("Bitte zuerst eine Antwort auswählen.", true);
      return;
    }
    const answer = Number(selected.value);
    state.progress.quizAnswers[lesson.id] = answer;
    persistProgress();
    renderLessonDetail();
    renderProgressSummary();
    if (answer === lesson.quiz.answerIndex) {
      showStatus("Richtig! Stark.");
    } else {
      showStatus("Nicht ganz. Erklärung beachten und erneut probieren.", true);
    }
  }

  function advanceFromQuiz() {
    const lesson = lessonById.get(state.selectedLessonId);
    if (lesson && !isCompleted(lesson.id)) {
      state.progress.completedLessons[lesson.id] = true;
      persistProgress();
    }
    const next = getNeighborLesson(1);
    if (next) {
      state.selectedLessonId = next.id;
      render();
    } else {
      renderLessonDetail();
      renderProgressSummary();
      renderModuleList();
      showStatus("Glückwunsch! Du hast alle Lektionen abgeschlossen.");
    }
  }

  function selectNeighborLesson(step) {
    const currentIndex = allLessons.findIndex((lesson) => lesson.id === state.selectedLessonId);
    if (currentIndex < 0) {
      return;
    }
    const nextIndex = currentIndex + step;
    if (nextIndex < 0 || nextIndex >= allLessons.length) {
      return;
    }
    state.selectedLessonId = allLessons[nextIndex].id;
    render();
  }

  function getNeighborLesson(step) {
    const currentIndex = allLessons.findIndex((lesson) => lesson.id === state.selectedLessonId);
    if (currentIndex < 0) {
      return null;
    }
    const candidate = allLessons[currentIndex + step];
    return candidate || null;
  }

  function isCompleted(lessonId) {
    return Boolean(state.progress.completedLessons[lessonId]);
  }

  function defaultProgress() {
    const now = new Date().toISOString();
    return {
      version: SAVEGAME_VERSION,
      startedAt: now,
      updatedAt: now,
      completedLessons: {},
      quizAnswers: {}
    };
  }

  function loadProgress() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultProgress();
    }
    try {
      const parsed = JSON.parse(raw);
      return sanitizeProgress(parsed);
    } catch (_error) {
      return defaultProgress();
    }
  }

  function sanitizeProgress(source) {
    if (!isObject(source)) {
      return defaultProgress();
    }

    const candidate = isObject(source.progress) ? source.progress : source;
    const base = defaultProgress();
    const sanitized = {
      version: SAVEGAME_VERSION,
      startedAt: typeof candidate.startedAt === "string" ? candidate.startedAt : base.startedAt,
      updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : base.updatedAt,
      completedLessons: {},
      quizAnswers: {}
    };

    if (isObject(candidate.completedLessons)) {
      for (const lessonId of Object.keys(candidate.completedLessons)) {
        if (lessonById.has(lessonId) && candidate.completedLessons[lessonId] === true) {
          sanitized.completedLessons[lessonId] = true;
        }
      }
    }

    if (isObject(candidate.quizAnswers)) {
      for (const lessonId of Object.keys(candidate.quizAnswers)) {
        const answer = candidate.quizAnswers[lessonId];
        const lesson = lessonById.get(lessonId);
        if (
          lesson &&
          Number.isInteger(answer) &&
          answer >= 0 &&
          answer < lesson.quiz.options.length
        ) {
          sanitized.quizAnswers[lessonId] = answer;
        }
      }
    }

    return sanitized;
  }

  function persistProgress() {
    state.progress.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  }

  function exportSavegame() {
    const payload = {
      app: "lineare-algebra-trainer",
      version: SAVEGAME_VERSION,
      exportedAt: new Date().toISOString(),
      progress: state.progress
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
    showStatus("Savegame wurde heruntergeladen.");
  }

  function importSavegame(event) {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const parsed = JSON.parse(text);
        state.progress = sanitizeProgress(parsed);
        persistProgress();
        render();
        showStatus("Savegame erfolgreich geladen.");
      } catch (_error) {
        showStatus("Import fehlgeschlagen: Datei ist kein gültiges Savegame.", true);
      } finally {
        elements.importProgress.value = "";
      }
    };

    reader.readAsText(file, "utf-8");
  }

  function resetProgress() {
    const accepted = window.confirm("Möchtest du den gesamten Fortschritt wirklich löschen?");
    if (!accepted) {
      return;
    }
    state.progress = defaultProgress();
    persistProgress();
    render();
    showStatus("Fortschritt zurückgesetzt.");
  }

  function calculateDotProduct() {
    try {
      const vectorA = parseVector(elements.vectorA.value);
      const vectorB = parseVector(elements.vectorB.value);
      if (vectorA.length !== vectorB.length) {
        throw new Error("Die Vektoren müssen gleich viele Komponenten haben.");
      }
      const dot = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
      const normA = Math.sqrt(vectorA.reduce((sum, value) => sum + value ** 2, 0));
      const normB = Math.sqrt(vectorB.reduce((sum, value) => sum + value ** 2, 0));
      const cosine = normA > 0 && normB > 0 ? dot / (normA * normB) : 0;
      const clamped = Math.max(-1, Math.min(1, cosine));
      const angle = Math.acos(clamped) * (180 / Math.PI);
      elements.dotOutput.textContent = `a·b = ${dot}, Winkel ≈ ${angle.toFixed(2)}°`;
    } catch (error) {
      elements.dotOutput.textContent = error.message;
    }
  }

  function calculateDeterminant2x2() {
    try {
      const matrix = parse2x2Matrix(elements.matrix2x2.value);
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      elements.detOutput.textContent = `det(A) = ${det}`;
    } catch (error) {
      elements.detOutput.textContent = error.message;
    }
  }

  function parseVector(input) {
    const parts = input
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
    if (parts.length === 0) {
      throw new Error("Bitte Vektor als kommagetrennte Zahlen eingeben, z. B. 1,2,3.");
    }
    const values = parts.map((value) => Number(value));
    if (values.some((value) => !Number.isFinite(value))) {
      throw new Error("Ungültiger Vektor. Bitte nur Zahlen verwenden.");
    }
    return values;
  }

  function parse2x2Matrix(input) {
    const rows = input.split(";").map((row) => row.trim());
    if (rows.length !== 2) {
      throw new Error("Bitte genau zwei Zeilen mit ';' trennen.");
    }
    const matrix = rows.map((row) => row.split(",").map((value) => Number(value.trim())));
    if (matrix.some((row) => row.length !== 2 || row.some((value) => !Number.isFinite(value)))) {
      throw new Error("Format ungültig. Bitte a,b;c,d verwenden.");
    }
    return matrix;
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`./service-worker.js?v=${SW_VERSION}`)
        .then(() => {
          showStatus("Offline-Cache ist aktiv.");
        })
        .catch(() => {
          showStatus("Service Worker konnte nicht registriert werden.", true);
        });
    });
  }

  function showStatus(message, isError) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.style.color = isError ? "#fecaca" : "#bbf7d0";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
})();
