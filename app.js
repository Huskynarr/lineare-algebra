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
  const SW_VERSION = 8;
  const WARMUP_COUNT = 10;

  const WARMUP_TYPES = ["simplify", "equation", "fraction", "decimal"];

  const I18N = {
    de: {
      "app.title": "Lineare Algebra",
      "stat.progress": "Fortschritt",
      "stat.mastery": "Mastery",
      "warmup.title": "Aufwärmen: Algebra-Basics",
      "warmup.description": "10 zufällige Aufgaben zum Reinkommen — Terme, Gleichungen, Brüche und Zahlen.",
      "warmup.task": "Aufgabe",
      "warmup.of": "von",
      "warmup.check": "Antwort prüfen",
      "warmup.next": "Weiter",
      "warmup.finish": "Abschließen",
      "warmup.done": "Geschafft!",
      "warmup.selectAnswer": "Bitte zuerst eine Antwort auswählen.",
      "lesson.prev": "Vorherige Lektion",
      "lesson.complete": "Abschließen",
      "quiz.check": "Antwort prüfen"
    }
  };

  function t(key) {
    return (I18N[document.documentElement.lang] || I18N.de)[key] || key;
  }

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
    detOutput: document.getElementById("det-output"),
    warmupArea: document.getElementById("warmup-area")
  };

  const state = {
    selectedLessonId: allLessons[0]?.id || null,
    progress: loadProgress(),
    warmup: {
      questions: [],
      currentIndex: 0,
      answers: [],
      finished: false
    }
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

    applyI18n();
    initWarmup();
    render();
    bindEvents();
    registerServiceWorker();
  }

  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (val) {
        el.textContent = val;
      }
    });
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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

    elements.warmupArea.addEventListener("click", (event) => {
      const checkBtn = event.target.closest("#warmup-check");
      if (checkBtn) {
        evaluateWarmup();
        return;
      }
      const nextBtn = event.target.closest("#warmup-next");
      if (nextBtn) {
        advanceWarmup();
      }
    });

    const burger = document.querySelector(".topbar__burger");
    if (burger) {
      burger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          document.getElementById("nav-toggle").checked = !document.getElementById("nav-toggle").checked;
          burger.setAttribute("aria-expanded", document.getElementById("nav-toggle").checked);
        }
      });
    }

    const navToggle = document.getElementById("nav-toggle");
    if (navToggle) {
      navToggle.addEventListener("change", () => {
        const burgerEl = document.querySelector(".topbar__burger");
        if (burgerEl) {
          burgerEl.setAttribute("aria-expanded", navToggle.checked);
        }
        if (navToggle.checked) {
          const firstLink = document.querySelector(".sidebar .lesson-link");
          if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
          }
        }
      });
    }
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
    const bar = elements.progressBarFill.closest(".progress-bar");
    if (bar) {
      bar.setAttribute("aria-valuenow", String(percent));
    }
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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      warmupCompleted: false,
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
      warmupCompleted: candidate.warmupCompleted === true,
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

  /* ===================== Warmup: Algebra-Basics ===================== */

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function generateWarmupQuestions() {
    const questions = [];
    for (let i = 0; i < WARMUP_COUNT; i++) {
      const level = i + 1;
      const type = WARMUP_TYPES[i % WARMUP_TYPES.length];
      questions.push(generateQuestion(type, level));
    }
    return shuffle(questions);
  }

  function generateQuestion(type, level) {
    switch (type) {
      case "simplify":
        return genSimplify(level);
      case "equation":
        return genEquation(level);
      case "fraction":
        return genFraction(level);
      case "decimal":
        return genDecimal(level);
      default:
        return genSimplify(level);
    }
  }

  function genSimplify(level) {
    const a = randInt(1, 3 + level);
    const b = randInt(1, 3 + level);
    const c = randInt(1, 5 + level * 2);
    const sign = level <= 3 ? "+" : pick(["+", "-"]);
    const expr = `${a}x ${sign} ${b}x ${level <= 5 ? "+ " + c : "- " + c}`;
    let answer;
    if (sign === "+") {
      answer = `${a + b}x ${level <= 5 ? "+ " + c : "- " + c}`;
    } else {
      answer = `${a - b}x ${level <= 5 ? "+ " + c : "- " + c}`;
    }
    const wrong1 = `${a + b + randInt(1, 3)}x ${level <= 5 ? "+ " + c : "- " + c}`;
    const wrong2 = `${a + b}x ${level <= 5 ? "+ " + (c + randInt(1, 3)) : "- " + (c + randInt(1, 3))}`;
    const wrong3 = `${a + b}x`;
    const options = shuffle([answer, wrong1, wrong2, wrong3]);
    return {
      type: "simplify",
      question: `Vereinfache den Term: ${expr}`,
      options: options,
      answerIndex: options.indexOf(answer),
      correctAnswer: answer,
      explanation: `Fasse die x-Glieder zusammen: ${a}x ${sign} ${b}x = ${answer.split(" ")[0]}. Die Zahl bleibt unverändert.`
    };
  }

  function genEquation(level) {
    const solution = randInt(1, 3 + level);
    const factor = randInt(2, 3 + Math.floor(level / 2));
    const addend = randInt(1, 5 + level);
    const result = factor * solution + addend;
    const question = `Löse die Gleichung: ${factor}x + ${addend} = ${result}`;
    const answer = `x = ${solution}`;
    const wrong1 = `x = ${solution + randInt(1, 3)}`;
    const wrong2 = `x = ${Math.max(1, solution - randInt(1, 3))}`;
    const wrong3 = `x = ${factor + addend}`;
    const options = shuffle([answer, wrong1, wrong2, wrong3]);
    return {
      type: "equation",
      question: question,
      options: options,
      answerIndex: options.indexOf(answer),
      correctAnswer: answer,
      explanation: `Ziehe ${addend} ab: ${factor}x = ${result - addend}. Dann teile durch ${factor}: x = ${solution}.`
    };
  }

  function genFraction(level) {
    if (level <= 5) {
      const denom = pick([2, 3, 4, 5, 6]);
      const a = randInt(1, denom - 1);
      const b = randInt(1, denom - 1);
      const numSum = a * denom + b * denom;
      const question = `Berechne: ${a}/${denom} + ${b}/${denom}`;
      const answer = `${a + b}/${denom}`;
      const wrong1 = `${a + b}/${denom * 2}`;
      const wrong2 = `${a * b}/${denom}`;
      const wrong3 = `${a + b + 1}/${denom}`;
      const options = shuffle([answer, wrong1, wrong2, wrong3]);
      return {
        type: "fraction",
        question: question,
        options: options,
        answerIndex: options.indexOf(answer),
        correctAnswer: answer,
        explanation: `Gleicher Nenner — einfach Zähler addieren: ${a} + ${b} = ${a + b}. Ergebnis: ${a + b}/${denom}.`
      };
    } else {
      const d1 = pick([2, 3, 4]);
      const d2 = pick([3, 4, 5, 6]);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);
      const lcm = (d1 * d2) / gcd(d1, d2);
      const resultNum = n1 * (lcm / d1) + n2 * (lcm / d2);
      const question = `Berechne: ${n1}/${d1} + ${n2}/${d2}`;
      const answer = `${resultNum}/${lcm}`;
      const wrong1 = `${n1 + n2}/${d1 + d2}`;
      const wrong2 = `${resultNum + 1}/${lcm}`;
      const wrong3 = `${n1 + n2}/${lcm}`;
      const options = shuffle([answer, wrong1, wrong2, wrong3]);
      return {
        type: "fraction",
        question: question,
        options: options,
        answerIndex: options.indexOf(answer),
        correctAnswer: answer,
        explanation: `Hauptnenner ist ${lcm}. Umgerechnet: ${n1 * (lcm / d1)}/${lcm} + ${n2 * (lcm / d2)}/${lcm} = ${resultNum}/${lcm}.`
      };
    }
  }

  function gcd(a, b) {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  function genDecimal(level) {
    const formats = [
      () => {
        const num = Math.round(Math.random() * Math.pow(10, 3 + Math.floor(level / 3))) / 100;
        const places = level <= 4 ? 1 : level <= 7 ? 2 : 3;
        const rounded = Number(num.toFixed(places));
        return {
          q: `Runde ${num.toString().replace(".", ",")} auf ${places} Nachkommastelle${places > 1 ? "n" : ""}.`,
          a: rounded.toString().replace(".", ","),
          wrongs: [
            num.toFixed(places + 1).replace(".", ","),
            num.toFixed(Math.max(0, places - 1)).replace(".", ","),
            (rounded + 0.1).toFixed(places).replace(".", ",")
          ],
          exp: `Schau auf die Stelle nach der gewünschten Genauigkeit und runde entsprechend.`
        };
      },
      () => {
        const a = randInt(1, 5 + level);
        const b = randInt(1, 5 + level);
        const op = level <= 4 ? "+" : "-";
        const result = op === "+" ? a + b : Math.abs(a - b);
        const decA = (a / 10).toString().replace(".", ",");
        const decB = (b / 10).toString().replace(".", ",");
        return {
          q: `Berechne: ${decA} ${op} ${decB}`,
          a: (result / 10).toString().replace(".", ","),
          wrongs: [
            ((result + 1) / 10).toString().replace(".", ","),
            ((result - 1) / 10).toString().replace(".", ","),
            (result / 100).toString().replace(".", ",")
          ],
          exp: `${op === "+" ? "Addiere" : "Subtrahiere"} die Zahlen wie gehabt, das Komma bleibt an derselben Stelle.`
        };
      },
      () => {
        const whole = randInt(1, 10 + level);
        const dec = randInt(1, 99);
        const num = parseFloat(`${whole}.${dec}`);
        const smaller = randInt(1, 10 + level) + Math.random();
        const bigger = num + randInt(1, 5);
        return {
          q: `Welche Zahl ist größer: ${num.toString().replace(".", ",")} oder ${smaller.toFixed(2).replace(".", ",")}?`,
          a: num > smaller ? `${num.toString().replace(".", ",")}` : `${smaller.toFixed(2).replace(".", ",")}`,
          wrongs: [
            num > smaller ? `${smaller.toFixed(2).replace(".", ",")}` : `${num.toString().replace(".", ",")}`,
            "Beide gleich",
            "Keine der beiden"
          ],
          exp: `Vergleiche erst die ganzen Zahlen, dann die Nachkommastellen von links nach rechts.`
        };
      }
    ];
    const gen = formats[randInt(0, formats.length - 1)]();
    const options = shuffle([gen.a, ...gen.wrongs]);
    return {
      type: "decimal",
      question: gen.q,
      options: options,
      answerIndex: options.indexOf(gen.a),
      correctAnswer: gen.a,
      explanation: gen.exp
    };
  }

  function initWarmup() {
    if (state.progress.warmupCompleted) {
      state.warmup.finished = true;
      elements.warmupArea.innerHTML = renderWarmupSummary();
      return;
    }
    state.warmup.questions = generateWarmupQuestions();
    state.warmup.currentIndex = 0;
    state.warmup.answers = [];
    state.warmup.finished = false;
    renderWarmup();
  }

  function renderWarmup() {
    if (state.warmup.finished) {
      elements.warmupArea.innerHTML = renderWarmupSummary();
      return;
    }

    const idx = state.warmup.currentIndex;
    const q = state.warmup.questions[idx];
    if (!q) {
      return;
    }
    const answered = state.warmup.answers[idx];
    const hasAnswered = typeof answered === "number";
    const isCorrect = hasAnswered && answered === q.answerIndex;
    const total = WARMUP_COUNT;
    const progressPct = Math.round((idx / total) * 100);

    let buttonHtml;
    if (hasAnswered) {
      const isLast = idx >= total - 1;
      buttonHtml = `<button id="warmup-next" type="button">${isLast ? "Abschließen" : "Weiter"}</button>`;
    } else {
      buttonHtml = `<button id="warmup-check" type="button">Antwort prüfen</button>`;
    }

    let feedbackHtml = "";
    if (hasAnswered) {
      feedbackHtml = `<p class="quiz-feedback ${isCorrect ? "success" : "error"}">${
        isCorrect ? "Richtig! " : "Leider falsch. "
      }${escapeHtml(q.explanation)}</p>`;
    }

    elements.warmupArea.innerHTML = `
      <div class="warmup-progress">
        <span>Aufgabe ${idx + 1} von ${total}</span>
        <div class="progress-bar"><span style="width: ${progressPct}%"></span></div>
      </div>
      <div class="warmup-question">
        <p class="warmup-task">${escapeHtml(q.question)}</p>
        <div class="warmup-options">
          ${q.options
            .map(
              (opt, i) => `
              <label class="${hasAnswered && i === q.answerIndex ? "is-correct" : ""}${hasAnswered && i === answered && i !== q.answerIndex ? "is-wrong" : ""}">
                <input type="radio" name="warmup-answer" value="${i}" ${answered === i ? "checked" : ""} ${hasAnswered ? "disabled" : ""}>
                ${escapeHtml(opt)}
              </label>
            `
            )
            .join("")}
        </div>
        ${buttonHtml}
        ${feedbackHtml}
      </div>
    `;
  }

  function renderWarmupSummary() {
    const correct = state.warmup.answers.filter((ans, i) => ans === state.warmup.questions[i]?.answerIndex).length;
    const pct = Math.round((correct / WARMUP_COUNT) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
    const starHtml = [0, 1, 2].map((i) => i < stars ? "&#9733;" : "&#9734;").join(" ");
    return `
      <div class="warmup-done">
        <div class="warmup-stars" aria-label="${stars} von 3 Sternen">${starHtml}</div>
        <p><strong>Geschafft!</strong> Du hast ${correct} von ${WARMUP_COUNT} Aufgaben richtig (${pct}&nbsp;%).</p>
        <p>Jetzt geht es mit der Linearen Algebra weiter — wähle links eine Lektion aus dem Lernpfad.</p>
      </div>
    `;
  }

  function evaluateWarmup() {
    const idx = state.warmup.currentIndex;
    const q = state.warmup.questions[idx];
    if (!q) {
      return;
    }
    const selected = document.querySelector('input[name="warmup-answer"]:checked');
    if (!selected) {
      showStatus("Bitte zuerst eine Antwort auswählen.", true);
      return;
    }
    state.warmup.answers[idx] = Number(selected.value);
    renderWarmup();
  }

  function advanceWarmup() {
    const idx = state.warmup.currentIndex;
    if (idx >= WARMUP_COUNT - 1) {
      state.warmup.finished = true;
      state.progress.warmupCompleted = true;
      persistProgress();
      renderWarmup();
      showStatus("Warmup abgeschlossen — viel Erfolg bei der Linearen Algebra!");
    } else {
      state.warmup.currentIndex++;
      renderWarmup();
    }
  }
})();
