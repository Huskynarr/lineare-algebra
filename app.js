(function () {
  "use strict";
  window.LA = window.LA || {};

  const learningPath = Array.isArray(window.LEARNING_PATH) ? window.LEARNING_PATH : [];
  const allLessons = learningPath.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title
    }))
  );
  const lessonById = new Map(allLessons.map((lesson) => [lesson.id, lesson]));
  const LEARNING_REFERENCES = (window.LEARNING_REFERENCES && typeof window.LEARNING_REFERENCES === "object") ? window.LEARNING_REFERENCES : {};
  const STORAGE_KEY = "lineare-algebra-savegame-v1";
  const SAVEGAME_VERSION = 2;
  const SW_VERSION = 20;
  const WARMUP_COUNT = 10;
  const LESSON_GAME_COUNT = 5;
  const LESSON_GAME_PASS_PCT = 60;
  const CERTIFICATE_MASTERY_THRESHOLD = 80;

  // Konstanten/Daten, die das Fortschritts-Modul schon beim Aufbau von `state`
  // (loadProgress -> sanitizeProgress) benötigt — daher vor `state` exponieren.
  LA.allLessons = allLessons;
  LA.lessonById = lessonById;
  LA.STORAGE_KEY = STORAGE_KEY;
  LA.SAVEGAME_VERSION = SAVEGAME_VERSION;
  LA.CERTIFICATE_MASTERY_THRESHOLD = CERTIFICATE_MASTERY_THRESHOLD;

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
    matrixA: document.getElementById("matrix-a"),
    matrixB2: document.getElementById("matrix-b2"),
    calcMul: document.getElementById("calc-mul"),
    mulOutput: document.getElementById("mul-output"),
    matrixInv: document.getElementById("matrix-inv"),
    calcInv: document.getElementById("calc-inv"),
    invOutput: document.getElementById("inv-output"),
    gaussInput: document.getElementById("gauss-input"),
    calcGauss: document.getElementById("calc-gauss"),
    gaussOutput: document.getElementById("gauss-output"),
    eigInput: document.getElementById("eig-input"),
    calcEig: document.getElementById("calc-eig"),
    eigOutput: document.getElementById("eig-output"),
    jordanInput: document.getElementById("jordan-input"),
    calcJordan: document.getElementById("calc-jordan"),
    jordanOutput: document.getElementById("jordan-output"),
    bilfInput: document.getElementById("bilf-input"),
    calcBilf: document.getElementById("calc-bilf"),
    bilfOutput: document.getElementById("bilf-output"),
    warmupArea: document.getElementById("warmup-area"),
    themeDark: document.getElementById("theme-dark"),
    themeLight: document.getElementById("theme-light")
  };

  const state = {
    selectedLessonId: allLessons[0]?.id || null,
    lessonStarted: false,
    progress: LA.progress.loadProgress(),
    warmup: {
      questions: [],
      currentIndex: 0,
      answers: [],
      finished: false
    },
    lessonGame: {
      lessonId: null,
      questions: [],
      currentIndex: 0,
      answers: [],
      finished: false
    },
    certificateOpen: false,
    shareModuleId: null
  };

  // Fortschritts-Modul (app.progress.js) greift über LA auf Core-State/Konstanten zu.
  LA.state = state;
  LA.elements = elements;

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
    initTheme();
    initWarmup();
    render();
    bindEvents();
    registerServiceWorker();
  }

  function initTheme() {
    const stored = (() => {
      try { return localStorage.getItem("lineare-algebra-theme"); } catch (e) { return null; }
    })();
    const current = stored === "light" ? "light" : "dark";
    applyTheme(current);

    if (elements.themeDark) {
      elements.themeDark.addEventListener("click", () => applyTheme("dark"));
    }
    if (elements.themeLight) {
      elements.themeLight.addEventListener("click", () => applyTheme("light"));
    }
  }

  function applyTheme(theme) {
    const isLight = theme === "light";
    if (isLight) {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try { localStorage.setItem("lineare-algebra-theme", theme); } catch (e) {}
    if (elements.themeDark) {
      elements.themeDark.classList.toggle("is-active", !isLight);
      elements.themeDark.setAttribute("aria-pressed", String(!isLight));
    }
    if (elements.themeLight) {
      elements.themeLight.classList.toggle("is-active", isLight);
      elements.themeLight.setAttribute("aria-pressed", String(isLight));
    }
    redrawVisualizations();
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
      state.lessonStarted = true;
      state.shareModuleId = null;
      const navToggle = document.getElementById("nav-toggle");
      if (navToggle) {
        navToggle.checked = false;
      }
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    elements.lessonDetail.addEventListener("click", (event) => {
      const jumpWarmup = event.target.closest("#jump-warmup");
      if (jumpWarmup) {
        const warmupEl = document.querySelector(".panel--warmup");
        if (warmupEl) warmupEl.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const startFirst = event.target.closest("#start-first-lesson");
      if (startFirst) {
        state.lessonStarted = true;
        render();
        const lessonEl = document.querySelector(".panel--lesson");
        if (lessonEl) lessonEl.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

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
        LA.quiz.evaluateQuiz();
        return;
      }

      const checkQuizTextButton = event.target.closest("#check-quiz-text");
      if (checkQuizTextButton) {
        LA.quiz.evaluateTextQuiz();
        return;
      }

      const nextQuizButton = event.target.closest("#next-quiz");
      if (nextQuizButton) {
        LA.quiz.advanceFromQuiz();
        return;
      }

      const gameStartBtn = event.target.closest("#game-start");
      if (gameStartBtn) {
        startLessonGame(state.selectedLessonId);
        return;
      }

      const gameRestartBtn = event.target.closest("#game-restart");
      if (gameRestartBtn) {
        startLessonGame(state.selectedLessonId);
        return;
      }

      const gameCheckBtn = event.target.closest("#game-check");
      if (gameCheckBtn) {
        evaluateLessonGame();
        return;
      }

      const gameNextBtn = event.target.closest("#game-next");
      if (gameNextBtn) {
        LA.quiz.advanceLessonGame();
        return;
      }
    });

    elements.exportProgress.addEventListener("click", LA.progress.exportSavegame);
    elements.importProgress.addEventListener("change", LA.progress.importSavegame);
    elements.resetProgress.addEventListener("click", LA.progress.resetProgress);

    elements.calcDot.addEventListener("click", calculateDotProduct);
    elements.calcDet.addEventListener("click", calculateDeterminant2x2);
    elements.calcMul.addEventListener("click", calculateMatrixMultiply);
    elements.calcInv.addEventListener("click", calculateInverse2x2);
    elements.calcGauss.addEventListener("click", calculateGauss);
    elements.calcEig.addEventListener("click", calculateEigenvalues);
    elements.calcJordan.addEventListener("click", calculateJordanForm);
    elements.calcBilf.addEventListener("click", calculateBilinearForm);

    elements.warmupArea.addEventListener("click", (event) => {
      const checkBtn = event.target.closest("#warmup-check");
      if (checkBtn) {
        evaluateWarmup();
        return;
      }
      const nextBtn = event.target.closest("#warmup-next");
      if (nextBtn) {
        advanceWarmup();
        return;
      }
      const startBtn = event.target.closest("#warmup-start-lesson");
      if (startBtn) {
        state.selectedLessonId = allLessons[0]?.id || null;
        state.lessonStarted = true;
        render();
        const lessonEl = document.querySelector(".panel--lesson");
        if (lessonEl) {
          lessonEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });

    document.addEventListener("click", (event) => {
      const certOpenBtn = event.target.closest("#certificate-open");
      if (certOpenBtn) {
        openCertificate();
        return;
      }

      const certBannerClose = event.target.closest("#certificate-banner-close");
      if (certBannerClose) {
        const banner = document.querySelector(".certificate-banner");
        if (banner) banner.remove();
        return;
      }

      const certCloseBtn = event.target.closest("#certificate-close");
      if (certCloseBtn) {
        closeCertificate();
        return;
      }

      const certPrintBtn = event.target.closest("#certificate-print");
      if (certPrintBtn) {
        window.print();
        return;
      }

      const certSaveNameBtn = event.target.closest("#certificate-save-name");
      if (certSaveNameBtn) {
        saveCertificateName();
        return;
      }

      const reviewBtn = event.target.closest("#review-go");
      if (reviewBtn) {
        const queue = state.progress.reviewQueue || [];
        if (queue.length > 0) {
          state.selectedLessonId = queue[0];
          render();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      const shareCloseBtn = event.target.closest(".share-banner__close");
      if (shareCloseBtn) {
        const moduleId = state.shareModuleId;
        state.shareModuleId = null;
        if (moduleId) {
          try {
            const key = "lineare-algebra-shared-modules";
            const list = JSON.parse(localStorage.getItem(key) || "[]");
            if (!list.includes(moduleId)) {
              list.push(moduleId);
              localStorage.setItem(key, JSON.stringify(list));
            }
          } catch (e) {}
        }
        const banner = document.querySelector(".share-banner");
        if (banner) banner.remove();
        return;
      }

      const copyBtn = event.target.closest("#share-copy-link");
      if (copyBtn) {
        const quoteEl = document.getElementById("share-quote");
        const text = quoteEl ? quoteEl.textContent + " https://huskynarr.is-a.dev/lineare-algebra/" : "https://huskynarr.is-a.dev/lineare-algebra/";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showStatus("Link in die Zwischenablage kopiert!");
          }).catch(() => {
            showStatus("Kopieren nicht möglich — bitte manuell markieren.", true);
          });
        } else {
          showStatus("Kopieren wird in diesem Browser nicht unterstützt.", true);
        }
        return;
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
          const firstControl = document.querySelector(".sidebar .theme-switch__btn");
          if (firstControl) {
            setTimeout(() => firstControl.focus(), 300);
          }
        }
      });
    }
  }

  function render() {
    renderModuleList();
    renderLessonDetail();
    renderProgressSummary();
    renderMath();
    setupVisualizations();
    renderReviewBanner();
    renderShareBanner();
    renderCertificateBanner();
  }

  function renderMath(scope) {
    if (typeof renderMathInElement !== "function") {
      return;
    }
    const root = scope || document.querySelector(".content") || document.body;
    renderMathInElement(root, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false,
      ignoredTags: ["script", "noscript", "style", "textarea", "code", "pre"]
    });
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
                  ${renderLessonGameStars(lesson.id)}
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

    if (!state.lessonStarted) {
      elements.lessonDetail.innerHTML = `
        <h2>Willkommen beim Lineare-Algebra-Trainer</h2>
        <p>Du möchtest Lineare Algebra lernen — super! Damit es sanft startet,
        wärmen wir uns erst mit ein paar Mathe-Basics auf: Terme, Gleichungen,
        Brüche und Zahlen. Wenn du bereit bist, starte das Aufwärmen oben.</p>
        <p><strong>Tipp:</strong> Alternativ kannst du direkt eine Lektion aus dem
        Lernpfad in der Seitenleiste auswählen.</p>
        <p class="lesson-actions">
          <button id="jump-warmup" type="button" class="ghost">Zum Aufwärmen springen</button>
          <button id="start-first-lesson" type="button">Lektion 1 direkt öffnen</button>
        </p>`;
      return;
    }

    const module = learningPath.find((entry) => entry.id === lesson.moduleId);
    const userAnswer = state.progress.quizAnswers[lesson.id];
    const hasAnswer = typeof userAnswer === "number";
    const isCorrect = hasAnswer && userAnswer === lesson.quiz.answerIndex;
    const isTextQuiz = (lesson.quiz.inputType || "mc") === "text";
    const textChecked = state.progress.quizTextChecked?.[lesson.id] === true;
    const quizAnswered = isTextQuiz ? textChecked : hasAnswer;
    const previousText =
      getNeighborLesson(-1) !== null ? `<button id="prev-lesson" type="button" class="ghost">Vorherige Lektion</button>` : "";
    const hasNext = getNeighborLesson(1) !== null;
    const quizButtonHtml = quizAnswered
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

      ${renderVisualization(lesson)}

      <section class="lesson-section">
        <h3>Beispiel</h3>
        <p>${escapeHtml(lesson.example)}</p>
      </section>

      <section class="lesson-section">
        <h3>Übungsaufgabe</h3>
        <p>${escapeHtml(lesson.exercise)}</p>
        <p><strong>Tipp:</strong> ${escapeHtml(lesson.hint)}</p>
        ${renderModelSolution(lesson)}
      </section>

      <section class="lesson-section quiz">
        <h3>Mini-Quiz</h3>
        ${renderQuiz(lesson, userAnswer, hasAnswer, isCorrect, quizButtonHtml)}
      </section>

      <details class="lesson-more">
        <summary>Mehr zu dieser Lektion — Quellen, FAQ &amp; Spielmodus</summary>
        ${renderReferences(lesson)}
        ${renderFAQBlock(lesson)}
        <section class="lesson-section lesson-game" id="lesson-game-section">
          <h3>Spielmodus</h3>
          ${renderLessonGameSection(lesson)}
        </section>
      </details>
    `;
    updateLessonFAQJsonLd(lesson);
    renderMath(elements.lessonDetail);
  }

  function renderReferences(lesson) {
    const refs = Array.isArray(lesson.references) && lesson.references.length > 0
      ? lesson.references
      : (Array.isArray(LEARNING_REFERENCES[lesson.id]) ? LEARNING_REFERENCES[lesson.id] : []);
    if (refs.length === 0) return "";
    const items = refs.map((ref) => {
      const url = escapeHtml(ref.url || "");
      const label = escapeHtml(ref.label || ref.url || "");
      const source = ref.source ? ` <small class="reference-source">${escapeHtml(ref.source)}</small>` : "";
      return `<li><a href="${url}" target="_blank" rel="noopener noreferrer nofollow">${label}</a>${source}</li>`;
    }).join("");
    return `
      <section class="lesson-section lesson-references" aria-labelledby="references-title">
        <h3 id="references-title">Quellen &amp; weiterführende Links</h3>
        <ul class="reference-list">${items}</ul>
      </section>`;
  }

  function buildLessonFAQ(lesson) {
    const quiz = lesson.quiz;
    if (!quiz || !quiz.question) return null;
    let answer = "";
    if (quiz.inputType !== "text" && Array.isArray(quiz.options) && typeof quiz.answerIndex === "number" && quiz.options[quiz.answerIndex] != null) {
      answer = `Richtig ist: ${quiz.options[quiz.answerIndex]}. `;
    }
    if (quiz.explanation) answer += quiz.explanation;
    if (quiz.solution) answer += ` Lösungsweg: ${quiz.solution}`;
    return { question: quiz.question, answer: answer.trim() };
  }

  function renderFAQBlock(lesson) {
    const faq = buildLessonFAQ(lesson);
    if (!faq) return "";
    return `
      <section class="lesson-section lesson-faq" aria-labelledby="faq-title">
        <h3 id="faq-title">Häufige Frage zu dieser Lektion</h3>
        <details class="faq-item">
          <summary>${escapeHtml(faq.question)}</summary>
          <div class="faq-answer">${escapeHtml(faq.answer)}</div>
        </details>
      </section>`;
  }

  function renderModelSolution(lesson) {
    if (!lesson.solution) return "";
    return `
      <details class="model-solution">
        <summary>Modelllösung anzeigen</summary>
        <div class="model-solution__body">${escapeHtml(lesson.solution)}</div>
      </details>`;
  }

  function updateLessonFAQJsonLd(lesson) {
    const node = document.getElementById("dynamic-faq-jsonld");
    if (!node) return;
    const faq = buildLessonFAQ(lesson);
    if (!faq) { node.textContent = "{}"; return; }
    const payload = {
      "@context": "https://schema.org",
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    };
    node.textContent = JSON.stringify(payload);
  }

  /* ===================== Vektor-Visualisierung ===================== */

  function renderVisualization(lesson) {
    const v = lesson.visualization;
    if (!v || v.type !== "vector-plot") return "";
    const mode = v.mode || "static";
    const id = lesson.id;
    let controls = "";
    const config = { vectors: v.vectors || null, u: v.u || null, v: v.v || null };
    if (mode === "addition") {
      const u = v.u || [2, 1], vv = v.v || [1, 2];
      controls = `
        <div class="vec-input"><span>u = (</span>
          <input type="number" class="vec-num" data-vec="u" data-axis="0" value="${u[0]}" step="0.5" aria-label="u x-Komponente">
          <input type="number" class="vec-num" data-vec="u" data-axis="1" value="${u[1]}" step="0.5" aria-label="u y-Komponente">
          <span>)</span></div>
        <div class="vec-input"><span>v = (</span>
          <input type="number" class="vec-num" data-vec="v" data-axis="0" value="${vv[0]}" step="0.5" aria-label="v x-Komponente">
          <input type="number" class="vec-num" data-vec="v" data-axis="1" value="${vv[1]}" step="0.5" aria-label="v y-Komponente">
          <span>)</span></div>`;
    } else if (mode === "linear-combination") {
      const u = v.u || [1, 0], vv = v.v || [0, 1];
      controls = `
        <div class="vec-slider"><label for="lc-a-${id}">a · u</label>
          <input type="range" id="lc-a-${id}" data-vec="a" min="-3" max="3" step="0.5" value="1">
          <span class="vec-val" data-val="a">1</span></div>
        <div class="vec-slider"><label for="lc-b-${id}">b · v</label>
          <input type="range" id="lc-b-${id}" data-vec="b" min="-3" max="3" step="0.5" value="1">
          <span class="vec-val" data-val="b">1</span></div>
        <p class="vec-basis">Basis: u = (${u[0]}, ${u[1]}), v = (${vv[0]}, ${vv[1]})</p>`;
    } else if (mode === "dot") {
      const u = v.u || [2, 1], vv = v.v || [1, 2];
      controls = `
        <div class="vec-input"><span>u = (</span>
          <input type="number" class="vec-num" data-vec="u" data-axis="0" value="${u[0]}" step="0.5" aria-label="u x-Komponente">
          <input type="number" class="vec-num" data-vec="u" data-axis="1" value="${u[1]}" step="0.5" aria-label="u y-Komponente">
          <span>)</span></div>
        <div class="vec-input"><span>v = (</span>
          <input type="number" class="vec-num" data-vec="v" data-axis="0" value="${vv[0]}" step="0.5" aria-label="v x-Komponente">
          <input type="number" class="vec-num" data-vec="v" data-axis="1" value="${vv[1]}" step="0.5" aria-label="v y-Komponente">
          <span>)</span></div>`;
    }
    return `
      <section class="lesson-section visualization" aria-label="Interaktive Visualisierung">
        <h3>Visualisierung</h3>
        <div class="vector-plot" data-mode="${mode}" data-lesson="${id}" data-config='${JSON.stringify(config)}'>
          <canvas class="vector-canvas" id="vec-canvas-${id}" aria-label="Vektor-Diagramm"></canvas>
          <div class="vector-controls">${controls}</div>
        </div>
      </section>`;
  }

  function setupVisualizations() {
    document.querySelectorAll(".vector-plot").forEach((plot) => {
      const mode = plot.getAttribute("data-mode");
      const canvas = plot.querySelector(".vector-canvas");
      if (!canvas || canvas.dataset.ready === "1") return;
      canvas.dataset.ready = "1";
      const config = JSON.parse(plot.getAttribute("data-config") || "{}");
      const dpr = window.devicePixelRatio || 1;
      const SIZE = 320;
      canvas.width = SIZE * dpr;
      canvas.height = SIZE * dpr;
      canvas.style.width = SIZE + "px";
      canvas.style.height = SIZE + "px";
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      const readVec = (name) => {
        const x = plot.querySelector(`input[data-vec="${name}"][data-axis="0"]`);
        const y = plot.querySelector(`input[data-vec="${name}"][data-axis="1"]`);
        if (!x || !y) return null;
        return [Number(x.value) || 0, Number(y.value) || 0];
      };
      const readScalar = (name) => {
        const el = plot.querySelector(`input[data-vec="${name}"]`);
        return el ? Number(el.value) : 0;
      };

      const draw = () => {
        const light = document.documentElement.getAttribute("data-theme") === "light";
        const C = {
          bg: light ? "#ffffff" : "#0d1528",
          grid: light ? "#e2e8f0" : "#243152",
          axis: light ? "#475569" : "#94a3b8",
          u: light ? "#0284c7" : "#38bdf8",
          v: light ? "#16a34a" : "#22c55e",
          sum: light ? "#e11d48" : "#fb7185",
          proj: light ? "#a16207" : "#fbbf24",
          text: light ? "#0f172a" : "#e5e7eb"
        };
        const W = SIZE, H = SIZE, scale = 36, ox = W / 2, oy = H / 2;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = C.grid;
        ctx.lineWidth = 1;
        for (let i = -5; i <= 5; i++) {
          ctx.beginPath(); ctx.moveTo(ox + i * scale, 0); ctx.lineTo(ox + i * scale, H); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, oy + i * scale); ctx.lineTo(W, oy + i * scale); ctx.stroke();
        }
        ctx.strokeStyle = C.axis; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
        const toPx = (vx, vy) => [ox + vx * scale, oy - vy * scale];
        const arrow = (x1, y1, x2, y2, color, label) => {
          ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          const ang = Math.atan2(y2 - y1, x2 - x1), ah = 8;
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x2 - ah * Math.cos(ang - 0.4), y2 - ah * Math.sin(ang - 0.4));
          ctx.lineTo(x2 - ah * Math.cos(ang + 0.4), y2 - ah * Math.sin(ang + 0.4));
          ctx.closePath(); ctx.fill();
          if (label) {
            ctx.fillStyle = C.text;
            ctx.font = "12px Inter, sans-serif";
            const tx = x2 + 6 * Math.cos(ang), ty = y2 + 6 * Math.sin(ang) - 4;
            ctx.fillText(label, tx, ty);
          }
        };
        if (mode === "static") {
          (config.vectors || []).forEach((vec) => {
            const [px, py] = toPx(vec[0], vec[1]);
            arrow(ox, oy, px, py, C.u, `(${vec[0]}, ${vec[1]})`);
          });
        } else if (mode === "addition") {
          const u = readVec("u") || [0, 0], vv = readVec("v") || [0, 0];
          const s = [u[0] + vv[0], u[1] + vv[1]];
          const [ux, uy] = toPx(u[0], u[1]);
          const [vx, vy] = toPx(vv[0], vv[1]);
          const [sx, sy] = toPx(s[0], s[1]);
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(ux, uy); ctx.lineTo(sx, sy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(sx, sy); ctx.stroke();
          ctx.setLineDash([]);
          arrow(ox, oy, ux, uy, C.u, "u");
          arrow(ox, oy, vx, vy, C.v, "v");
          arrow(ox, oy, sx, sy, C.sum, `u+v=(${s[0]},${s[1]})`);
        } else if (mode === "linear-combination") {
          const a = readScalar("a"), b = readScalar("b");
          const u = config.u || [1, 0], vv = config.v || [0, 1];
          const result = [a * u[0] + b * vv[0], a * u[1] + b * vv[1]];
          const [ux, uy] = toPx(u[0], u[1]);
          const [vx, vy] = toPx(vv[0], vv[1]);
          ctx.globalAlpha = 0.35;
          arrow(ox, oy, ux, uy, C.u, "u");
          arrow(ox, oy, vx, vy, C.v, "v");
          ctx.globalAlpha = 1;
          const [rx, ry] = toPx(result[0], result[1]);
          arrow(ox, oy, rx, ry, C.sum, `${a}u+${b}v`);
        } else if (mode === "dot") {
          const u = readVec("u") || [0, 0], vv = readVec("v") || [0, 0];
          const lu = Math.hypot(u[0], u[1]) || 1;
          const dot = u[0] * vv[0] + u[1] * vv[1];
          const proj = [dot / lu * u[0] / lu, dot / lu * u[1] / lu];
          const [px, py] = toPx(proj[0], proj[1]);
          const [vx, vy] = toPx(vv[0], vv[1]);
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = C.proj; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(px, py); ctx.stroke();
          ctx.setLineDash([]);
          arrow(ox, oy, px, py, C.proj, "Projektion");
          arrow(ox, oy, vx, vy, C.v, "v");
          arrow(ox, oy, toPx(u[0], u[1])[0], toPx(u[0], u[1])[1], C.u, "u");
        }
      };

      plot.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
          const valSpan = plot.querySelector(`.vec-val[data-val="${input.getAttribute("data-vec")}"]`);
          if (valSpan) valSpan.textContent = input.value;
          draw();
        });
      });
      draw();
      plot._redraw = draw;
    });
  }

  function redrawVisualizations() {
    document.querySelectorAll(".vector-plot").forEach((plot) => {
      if (typeof plot._redraw === "function") plot._redraw();
    });
  }

  function renderQuiz(lesson, userAnswer, hasAnswer, isCorrect, quizButtonHtml) {
    const quiz = lesson.quiz;
    const inputType = quiz.inputType || "mc";

    if (inputType === "text") {
      const textAnswer = state.progress.quizTextAnswers?.[lesson.id];
      const hasTextAnswer = typeof textAnswer === "string" && textAnswer.length > 0;
      const textChecked = state.progress.quizTextChecked?.[lesson.id] === true;
      let feedback = "";
      if (textChecked) {
        const accept = quiz.acceptAnswers || [quiz.correctAnswer];
        const isTextCorrect = accept.some((a) => LA.quiz.normalizeAnswer(textAnswer) === LA.quiz.normalizeAnswer(a));
        feedback = `<p class="quiz-feedback ${isTextCorrect ? "success" : "error"}">${
          isTextCorrect ? "Richtig! " : "Leider falsch. "
        }${escapeHtml(quiz.explanation)}</p>`;
        if (!isTextCorrect && quiz.solution) {
          feedback += `<details class="quiz-solution"><summary>Lösungsweg anzeigen</summary><div class="quiz-solution__body">${escapeHtml(quiz.solution)}</div></details>`;
        }
      }
      const textButton = textChecked
        ? quizButtonHtml
        : `<button id="check-quiz-text" type="button">Antwort prüfen</button>`;
      return `
        <p>${escapeHtml(quiz.question)}</p>
        <input type="text" id="quiz-text-input" placeholder="${escapeHtml(quiz.placeholder || "Deine Antwort...")}" value="${escapeHtml(textAnswer || "")}" ${textChecked ? "disabled" : ""}>
        ${textButton}
        ${feedback}
      `;
    }

    return `
      <p>${escapeHtml(quiz.question)}</p>
      ${quiz.options
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
              ? "Richtig. " + escapeHtml(quiz.explanation)
              : "Noch nicht korrekt. " + escapeHtml(quiz.explanation)
            : "Noch keine Antwort abgegeben."
        }
      </p>
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
    LA.progress.persistProgress();
    render();
  }

  function renderReviewBanner() {
    const queue = state.progress.reviewQueue || [];
    if (queue.length === 0) {
      return;
    }
    const firstReviewId = queue[0];
    const lesson = lessonById.get(firstReviewId);
    if (!lesson) {
      return;
    }
    const banner = document.createElement("div");
    banner.className = "review-banner";
    banner.innerHTML = `
      <p><strong>Wiederholung:</strong> Du hast ${queue.length} Lektion${queue.length > 1 ? "en" : ""} zum Wiederholen — z.B. <em>${escapeHtml(lesson.title)}</em></p>
      <button id="review-go" type="button">Jetzt wiederholen</button>
    `;
    const content = document.querySelector(".content");
    if (content && content.firstChild) {
      content.insertBefore(banner, content.firstChild);
    }
  }

  function renderShareBanner() {
    if (!state.shareModuleId) return;
    const module = learningPath.find((entry) => entry.id === state.shareModuleId);
    if (!module) {
      state.shareModuleId = null;
      return;
    }
    const shareText = `Ich habe das Modul "${module.title}" im Lineare Algebra Trainer geschafft! 🎉 Willst du mit mir lernen?`;
    const shareUrl = "https://huskynarr.is-a.dev/lineare-algebra/";
    const fullText = `${shareText} ${shareUrl}`;
    const encoded = encodeURIComponent(fullText);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedQuote = encodeURIComponent(shareText);

    const banner = document.createElement("div");
    banner.className = "share-banner";
    banner.innerHTML = `
      <button type="button" class="share-banner__close" aria-label="Teilen-Fenster schließen">✕</button>
      <div class="share-banner__emoji" aria-hidden="true">🎉</div>
      <h2 class="share-banner__title">Modul geschafft!</h2>
      <p class="share-banner__text">Du hast <strong>${escapeHtml(module.title)}</strong> abgeschlossen. Teile deinen Erfolg:</p>
      <p class="share-banner__quote" id="share-quote">${escapeHtml(shareText)}</p>
      <div class="share-banner__actions">
        <a class="share-btn share-btn--wa" href="https://wa.me/?text=${encoded}" target="_blank" rel="noopener noreferrer" aria-label="Über WhatsApp teilen">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.043zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>
          <span>WhatsApp</span>
        </a>
        <a class="share-btn share-btn--x" href="https://twitter.com/intent/tweet?text=${encoded}" target="_blank" rel="noopener noreferrer" aria-label="Über X teilen">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          <span>X</span>
        </a>
        <a class="share-btn share-btn--fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedQuote}" target="_blank" rel="noopener noreferrer" aria-label="Über Facebook teilen">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          <span>Facebook</span>
        </a>
        <button type="button" class="share-btn share-btn--copy" id="share-copy-link" aria-label="Link kopieren">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Kopieren</span>
        </button>
      </div>
    `;
    const content = document.querySelector(".content");
    if (content && content.firstChild) {
      content.insertBefore(banner, content.firstChild);
    }
  }

  function checkModuleCompletion(moduleId) {
    if (!moduleId) return;
    const module = learningPath.find((entry) => entry.id === moduleId);
    if (!module) return;
    const allDone = module.lessons.every((lesson) => isCompleted(lesson.id));
    if (allDone) {
      const key = "lineare-algebra-shared-modules";
      const alreadyShared = (() => {
        try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; }
      })();
      if (!alreadyShared.includes(moduleId)) {
        state.shareModuleId = moduleId;
      }
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
    state.shareModuleId = null;
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

  function calculateDotProduct() {
    try {
      const vectorA = LA.math.parseVector(elements.vectorA.value);
      const vectorB = LA.math.parseVector(elements.vectorB.value);
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
      const matrix = LA.math.parse2x2Matrix(elements.matrix2x2.value);
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      elements.detOutput.textContent = `det(A) = ${det}`;
    } catch (error) {
      elements.detOutput.textContent = error.message;
    }
  }

  function calculateMatrixMultiply() {
    try {
      const A = LA.math.parseMatrix(elements.matrixA.value);
      const B = LA.math.parseMatrix(elements.matrixB2.value);
      if (A[0].length !== B.length) {
        throw new Error(`Spalten von A (${A[0].length}) müssen Zeilen von B (${B.length}) entsprechen.`);
      }
      const result = A.map((row) =>
        B[0].map((_, j) => row.reduce((sum, val, i) => sum + val * B[i][j], 0))
      );
      elements.mulOutput.textContent = `A · B = ${LA.math.formatMatrix(result)}`;
    } catch (error) {
      elements.mulOutput.textContent = error.message;
    }
  }

  function calculateInverse2x2() {
    try {
      const m = LA.math.parse2x2Matrix(elements.matrixInv.value);
      const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      if (det === 0) {
        elements.invOutput.textContent = "Matrix ist nicht invertierbar (det = 0).";
        return;
      }
      const inv = [
        [m[1][1] / det, -m[0][1] / det],
        [-m[1][0] / det, m[0][0] / det]
      ];
      const fmt = (n) => Math.round(n * 1000) / 1000;
      elements.invOutput.textContent = `A⁻¹ = [${fmt(inv[0][0])}, ${fmt(inv[0][1])}; ${fmt(inv[1][0])}, ${fmt(inv[1][1])}]`;
    } catch (error) {
      elements.invOutput.textContent = error.message;
    }
  }

  function calculateGauss() {
    try {
      const parts = elements.gaussInput.value.split("|");
      if (parts.length !== 2) {
        throw new Error("Format: a,b;c,d|e,f (Matrix|Vektor)");
      }
      const A = LA.math.parseMatrix(parts[0]);
      const b = parts[1].split(",").map((v) => Number(v.trim()));
      if (A.length !== b.length) {
        throw new Error("Anzahl Zeilen muss Anzahl Ergebnisse entsprechen.");
      }
      const n = A.length;
      const aug = A.map((row, i) => [...row, b[i]]);
      for (let col = 0; col < n; col++) {
        let maxRow = col;
        for (let r = col + 1; r < n; r++) {
          if (Math.abs(aug[r][col]) > Math.abs(aug[maxRow][col])) {
            maxRow = r;
          }
        }
        [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
        const pivot = aug[col][col];
        if (pivot === 0) {
          elements.gaussOutput.textContent = "System nicht eindeutig lösbar (Pivot = 0).";
          return;
        }
        for (let r = col + 1; r < n; r++) {
          const factor = aug[r][col] / pivot;
          for (let c = col; c <= n; c++) {
            aug[r][c] -= factor * aug[col][c];
          }
        }
      }
      const x = new Array(n);
      for (let i = n - 1; i >= 0; i--) {
        x[i] = aug[i][n];
        for (let j = i + 1; j < n; j++) {
          x[i] -= aug[i][j] * x[j];
        }
        x[i] /= aug[i][i];
      }
      const fmt = (n2) => Math.round(n2 * 1000) / 1000;
      elements.gaussOutput.textContent = `x = (${x.map(fmt).join(", ")})`;
    } catch (error) {
      elements.gaussOutput.textContent = error.message;
    }
  }


  function calculateEigenvalues() {
    try {
      const A = LA.math.parseMatrix(elements.eigInput.value);
      const n = A.length;
      if (n < 1 || n > 4 || A.some((row) => row.length !== n)) {
        throw new Error("Bitte quadratische Matrix bis 4×4 eingeben.");
      }
      const coeffs = LA.math.charPolynomialCoeffs(A);
      const polyStr = coeffs.map((c, k) => {
        if (c === 0) return "";
        const sign = c < 0 ? "−" : "+";
        const mag = LA.math.formatNum(Math.abs(c));
        if (k === 0) return `${sign}${mag}`;
        if (k === 1) return `${sign}${mag}λ`;
        return `${sign}${mag}λ^${k}`;
      }).filter(Boolean).reverse().join("");
      const roots = LA.math.polyRoots(coeffs).map(LA.math.formatNum);
      const det = LA.math.detNxN(A);
      const tr = LA.math.traceM(A);
      let out = `χ_A(λ) = λ^${n} ${polyStr}\n`;
      out += `Spur = ${LA.math.formatNum(tr)}, det = ${LA.math.formatNum(det)}\n`;
      out += roots.length ? `Eigenwerte (reell): ${roots.join(", ")}` : "Keine reellen Eigenwerte (komplex).";
      elements.eigOutput.textContent = out;
    } catch (error) {
      elements.eigOutput.textContent = error.message;
    }
  }

  function calculateJordanForm() {
    try {
      const A = LA.math.parseMatrix(elements.jordanInput.value);
      const n = A.length;
      if (n < 1 || n > 4 || A.some((row) => row.length !== n)) {
        throw new Error("Bitte quadratische Matrix bis 4×4 eingeben.");
      }
      const coeffs = LA.math.charPolynomialCoeffs(A);
      const roots = LA.math.polyRoots(coeffs);
      if (!roots.length) {
        elements.jordanOutput.textContent = "Keine reellen Eigenwerte — Jordan-Form über ℝ nicht vorhanden (gebrauche ℂ).";
        return;
      }
      // Eigenwerte mit algebraischer Vielfachheit bündeln.
      const evs = [];
      roots.sort((a, b) => a - b);
      roots.forEach((r) => {
        const last = evs[evs.length - 1];
        if (last && Math.abs(last.value - r) < 1e-6) last.alg++;
        else evs.push({ value: r, alg: 1 });
      });
      // Geometrische Vielfachheit = n - rang(A - lambda I).
      let parts = [];
      let minimalFactors = [];
      evs.forEach((ev) => {
        const geom = n - LA.math.rankM(LA.math.subtractLambdaI(A, ev.value));
        ev.geom = geom;
        // Größtes Jordan-Kästchen = kleinste k mit rang((A-lambda I)^k) = n - alg.
        let k = 1;
        let power = LA.math.subtractLambdaI(A, ev.value);
        while (LA.math.rankM(power) > n - ev.alg && k <= n) {
          power = LA.math.matMul(power, LA.math.subtractLambdaI(A, ev.value));
          k++;
        }
        ev.maxBlock = k;
        minimalFactors.push(`(λ−${LA.math.formatNum(ev.value)})^${k}`);
        // Partition der Kästchen: alg = geom*? — Verteilung mit maxBlock als größtem Kästchen.
        const blocks = LA.math.partitionBlocks(ev.alg, ev.geom, ev.maxBlock);
        parts.push(`λ=${LA.math.formatNum(ev.value)}: alg=${ev.alg}, geom=${ev.geom}, Kästchen ${blocks.join("+") || "—"}, maxBlock=${ev.maxBlock}`);
      });
      let out = `Eigenwerte: ${evs.map((e) => LA.math.formatNum(e.value)).join(", ")}\n`;
      out += parts.join("\n") + "\n";
      out += `Minimalpolynom: ${minimalFactors.join("·")}`;
      elements.jordanOutput.textContent = out;
    } catch (error) {
      elements.jordanOutput.textContent = error.message;
    }
  }

  function calculateBilinearForm() {
    try {
      const A = LA.math.parseMatrix(elements.bilfInput.value);
      const n = A.length;
      if (n < 1 || n > 4 || A.some((row) => row.length !== n)) {
        throw new Error("Bitte quadratische Matrix bis 4×4 eingeben.");
      }
      // Symmetrie prüfen (für Signatur relevant).
      const sym = A.every((row, i) => row.every((v, j) => Math.abs(v - A[j][i]) < 1e-9));
      const rang = LA.math.rankM(A);
      // Eigenwerte bestimmen (symmetrisch ⇒ reell); über char. Polynom.
      const coeffs = LA.math.charPolynomialCoeffs(A);
      const roots = LA.math.polyRoots(coeffs);
      let p = 0, q = 0;
      roots.forEach((r) => {
        if (r > 1e-6) p++;
        else if (r < -1e-6) q++;
      });
      const r = n - p - q;
      let out = `Rang = ${rang}\n`;
      out += `Symmetrisch: ${sym ? "ja" : "nein — Signatur nur für symmetrische Formen definiert"}\n`;
      if (sym) {
        out += `Signatur (p, q, r) = (${p}, ${q}, ${r})\n`;
        out += `Klassifikation: ${q === 0 && r === 0 ? "positiv definit (Skalarprodukt)" : q === n ? "negativ definit" : "indefinit oder semidefinit"}`;
      }
      elements.bilfOutput.textContent = out;
    } catch (error) {
      elements.bilfOutput.textContent = error.message;
    }
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

  function initWarmup() {
    if (state.progress.warmupCompleted) {
      state.warmup.finished = true;
      state.lessonStarted = true;
      elements.warmupArea.innerHTML = renderWarmupSummary();
      elements.warmupArea.closest(".panel--warmup")?.classList.add("is-done");
      return;
    }
    state.warmup.questions = LA.quiz.generateWarmupQuestions();
    state.warmup.currentIndex = 0;
    state.warmup.answers = [];
    state.warmup.finished = false;
    state.lessonStarted = false;
    elements.warmupArea.closest(".panel--warmup")?.classList.remove("is-done");
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
    renderMath(elements.warmupArea);
  }

  function renderWarmupSummary() {
    const correct = state.warmup.answers.filter((ans, i) => ans === state.warmup.questions[i]?.answerIndex).length;
    const pct = Math.round((correct / WARMUP_COUNT) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
    const starHtml = [0, 1, 2].map((i) => i < stars ? "&#9733;" : "&#9734;").join(" ");
    return `
      <details class="warmup-done">
        <summary>
          <span class="warmup-done__badge">&#10003; Aufwärmen erledigt</span>
          <span class="warmup-stars" aria-label="${stars} von 3 Sternen">${starHtml}</span>
          <span class="warmup-done__score">${correct} / ${WARMUP_COUNT} richtig</span>
        </summary>
        <div class="warmup-done__body">
          <p>Jetzt geht es mit der Linearen Algebra weiter.</p>
          <button id="warmup-start-lesson" type="button" class="warmup-continue">Zur ersten Lektion</button>
        </div>
      </details>
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
      state.lessonStarted = true;
      LA.progress.persistProgress();
      renderWarmup();
      render();
      showStatus("Warmup abgeschlossen — viel Erfolg bei der Linearen Algebra!");
      const lessonEl = document.querySelector(".panel--lesson");
      if (lessonEl) {
        setTimeout(() => lessonEl.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    } else {
      state.warmup.currentIndex++;
      renderWarmup();
    }
  }

  /* ===================== Spielmodus pro Lektion ===================== */

  function computeStars(pct) {
    if (pct >= 90) return 3;
    if (pct >= 60) return 2;
    if (pct >= 30) return 1;
    return 0;
  }


  function startLessonGame(lessonId) {
    const lesson = lessonById.get(lessonId);
    if (!lesson) return;
    state.lessonGame = {
      lessonId: lessonId,
      questions: LA.quiz.generateLessonGameQuestions(lesson.moduleId),
      currentIndex: 0,
      answers: [],
      finished: false
    };
    renderLessonDetail();
  }

  function renderLessonGameSection(lesson) {
    const game = state.lessonGame;
    const isActive = game.lessonId === lesson.id && !game.finished && game.questions.length > 0;
    const isSummary = game.lessonId === lesson.id && game.finished;
    const best = state.progress.lessonGames?.[lesson.id];

    if (isActive) {
      return renderLessonGameActive(game);
    }
    if (isSummary) {
      return renderLessonGameSummary(lesson, game, best);
    }
    const bestHtml = best && best.attempts > 0
      ? `<p class="game-best">Dein bestes Ergebnis: <strong>${best.bestPct}%</strong> ${starString(best.bestStars)} (in ${best.attempts} Versuch${best.attempts === 1 ? "" : "en"})</p>`
      : `<p class="game-best">Noch nicht gespielt — starte dein erstes Spiel!</p>`;
    return `
      <p class="game-intro">Spiele ${LESSON_GAME_COUNT} zufällige Aufgaben zum Thema «${escapeHtml(lesson.title)}» und sammle Sterne. Mindestens ${LESSON_GAME_PASS_PCT}% richtig schließt die Lektion ab.</p>
      ${bestHtml}
      <button id="game-start" type="button" class="game-btn">Spiel starten</button>
    `;
  }

  function starString(stars) {
    return [0, 1, 2].map((i) => (i < stars ? "&#9733;" : "&#9734;")).join(" ");
  }

  function renderLessonGameActive(game) {
    const idx = game.currentIndex;
    const q = game.questions[idx];
    if (!q) return "";
    const answered = game.answers[idx];
    const hasAnswered = typeof answered === "number";
    const isCorrect = hasAnswered && answered === q.answerIndex;
    const total = game.questions.length;
    const progressPct = Math.round((idx / total) * 100);

    let buttonHtml;
    if (hasAnswered) {
      const isLast = idx >= total - 1;
      buttonHtml = `<button id="game-next" type="button">${isLast ? "Ergebnis anzeigen" : "Weiter"}</button>`;
    } else {
      buttonHtml = `<button id="game-check" type="button">Antwort prüfen</button>`;
    }

    let feedbackHtml = "";
    if (hasAnswered) {
      feedbackHtml = `<p class="quiz-feedback ${isCorrect ? "success" : "error"}">${
        isCorrect ? "Richtig! " : "Leider falsch. "
      }${escapeHtml(q.explanation)}</p>`;
    }

    return `
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
                <input type="radio" name="game-answer" value="${i}" ${answered === i ? "checked" : ""} ${hasAnswered ? "disabled" : ""}>
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

  function renderLessonGameSummary(lesson, game, best) {
    const correct = game.answers.filter((ans, i) => ans === game.questions[i]?.answerIndex).length;
    const total = game.questions.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const stars = computeStars(pct);
    const passed = pct >= LESSON_GAME_PASS_PCT;
    return `
      <div class="warmup-done">
        <div class="warmup-stars" aria-label="${stars} von 3 Sternen">${starString(stars)}</div>
        <p><strong>${passed ? "Geschafft!" : "Üben hilft!"}</strong> Du hast ${correct} von ${total} Aufgaben richtig (${pct}&nbsp;%).</p>
        ${passed ? `<p>Die Lektion «${escapeHtml(lesson.title)}» gilt damit als erledigt.</p>` : `<p>Ab ${LESSON_GAME_PASS_PCT}% gilt die Lektion als erledigt — versuch es noch einmal.</p>`}
        <div class="game-summary-actions">
          <button id="game-restart" type="button" class="game-btn">Nochmal spielen</button>
        </div>
      </div>
    `;
  }

  function evaluateLessonGame() {
    const game = state.lessonGame;
    const idx = game.currentIndex;
    const q = game.questions[idx];
    if (!q) return;
    const selected = document.querySelector('input[name="game-answer"]:checked');
    if (!selected) {
      showStatus("Bitte zuerst eine Antwort auswählen.", true);
      return;
    }
    game.answers[idx] = Number(selected.value);
    renderLessonDetail();
  }

  function finishLessonGame() {
    const game = state.lessonGame;
    const lesson = lessonById.get(game.lessonId);
    if (!lesson) return;
    const correct = game.answers.filter((ans, i) => ans === game.questions[i]?.answerIndex).length;
    const total = game.questions.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const stars = computeStars(pct);

    if (!state.progress.lessonGames) state.progress.lessonGames = {};
    const prev = state.progress.lessonGames[lesson.id] || { bestPct: 0, bestStars: 0, attempts: 0 };
    state.progress.lessonGames[lesson.id] = {
      bestPct: Math.max(prev.bestPct, pct),
      bestStars: Math.max(prev.bestStars, stars),
      attempts: prev.attempts + 1
    };

    if (pct >= LESSON_GAME_PASS_PCT && !isCompleted(lesson.id)) {
      state.progress.completedLessons[lesson.id] = true;
      checkModuleCompletion(lesson.moduleId);
    }
    if (pct >= LESSON_GAME_PASS_PCT) {
      LA.quiz.removeFromReviewQueue(lesson.id);
    } else {
      LA.quiz.addToReviewQueue(lesson.id);
    }

    LA.progress.persistProgress();
    game.finished = true;
    render();
    showStatus(
      pct >= LESSON_GAME_PASS_PCT
        ? `Spiel geschafft — ${correct}/${total} richtig, ${stars} Sterne!`
        : `${correct}/${total} richtig. Nochmal probieren für ${LESSON_GAME_PASS_PCT}%.`,
      pct < LESSON_GAME_PASS_PCT
    );
  }

  /* ===================== Zertifikat ===================== */

  // Lernpfad-Phasen: LA1 = mod-0 … mod-11, LA2 = mod-12 … mod-16.
  // mod-6 enthält die optionale Brücken-Lektion m6-l4 und gehört zu LA1.
  const LA1_MODULE_IDS = ["mod-0","mod-1","mod-2","mod-3","mod-4","mod-5","mod-6","mod-7","mod-8","mod-9","mod-10","mod-11"];
  const LA2_MODULE_IDS = ["mod-12","mod-13","mod-14","mod-15","mod-16"];

  function lessonsOfModules(ids) {
    const set = new Set(ids);
    return allLessons.filter((l) => set.has(l.moduleId));
  }

  function allLessonsDone(lessons) {
    return lessons.length > 0 && lessons.every((l) => isCompleted(l.id));
  }

  function renderCertificateBanner() {
    const stage = LA.progress.certificateStage();
    if (!stage) return;
    if (document.querySelector(".certificate-banner")) return;
    const content = document.querySelector(".content");
    if (!content) return;
    const isLa2 = stage === "la2";
    const headline = isLa2 ? "LA2-Zertifikat freigeschaltet!" : "LA1-Zertifikat freigeschaltet!";
    const text = isLa2
      ? `Du hast den gesamten Lernpfad (LA1 + LA2) abgeschlossen und ${CERTIFICATE_MASTERY_THRESHOLD}% Mastery erreicht. Hol dir dein Abschluss-Zertifikat.`
      : `Du hast Lineare Algebra 1 (Modul 0–11) abgeschlossen und ${CERTIFICATE_MASTERY_THRESHOLD}% Mastery erreicht. Hol dir dein LA1-Zertifikat — LA2 geht weiter.`;
    const banner = document.createElement("div");
    banner.className = "certificate-banner";
    banner.innerHTML = `
      <div class="certificate-banner__emoji" aria-hidden="true">🎓</div>
      <div class="certificate-banner__body">
        <h2>${headline}</h2>
        <p>${text}</p>
      </div>
      <div class="certificate-banner__actions">
        <button id="certificate-open" type="button">Zertifikat anzeigen</button>
        <button id="certificate-banner-close" type="button" class="ghost" aria-label="Hinweis schließen">✕</button>
      </div>
    `;
    content.insertBefore(banner, content.firstChild);
  }

  function openCertificate() {
    const stage = LA.progress.certificateStage();
    if (!stage) {
      showStatus("Zertifikat ist noch nicht freigeschaltet.", true);
      return;
    }
    if (!state.progress.certificate) state.progress.certificate = { unlocked: false, name: "", shownAt: null, stages: { la1: false, la2: false } };
    if (!state.progress.certificate.stages) state.progress.certificate.stages = { la1: false, la2: false };
    state.progress.certificate.stages[stage] = true;
    state.progress.certificate.unlocked = true;
    state.progress.certificate.shownAt = new Date().toISOString();
    LA.progress.persistProgress();
    state.certificateOpen = stage;
    renderCertificateModal();
  }

  function closeCertificate() {
    state.certificateOpen = false;
    const modal = document.getElementById("certificate-modal");
    if (modal) modal.remove();
  }

  function saveCertificateName() {
    const input = document.getElementById("certificate-name-input");
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      showStatus("Bitte einen Namen eingeben.", true);
      return;
    }
    if (!state.progress.certificate) state.progress.certificate = { unlocked: false, name: "", shownAt: null, stages: { la1: false, la2: false } };
    state.progress.certificate.name = name;
    LA.progress.persistProgress();
    renderCertificateModal();
  }

  function renderCertificateModal() {
    const existing = document.getElementById("certificate-modal");
    if (existing) existing.remove();
    const stage = state.certificateOpen;
    if (!stage) return;

    const isLa2 = stage === "la2";
    const stageLessons = isLa2 ? allLessons : lessonsOfModules(LA1_MODULE_IDS);
    const mastery = LA.progress.computeMasteryFor(stageLessons);
    const completed = stageLessons.filter((l) => isCompleted(l.id)).length;
    const total = stageLessons.length;
    const name = state.progress.certificate?.name || "";
    const date = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
    const nameHtml = name
      ? `<div class="cert-name">${escapeHtml(name)}</div>`
      : `<div class="cert-name-entry"><label for="certificate-name-input">Dein Name:</label><input type="text" id="certificate-name-input" placeholder="Vor- und Nachname" maxlength="80"><button id="certificate-save-name" type="button">Speichern</button></div>`;

    const title = isLa2 ? "Abschluss-Zertifikat LA1 + LA2" : "Zertifikat Lineare Algebra 1";
    const eyebrow = isLa2 ? "Lineare Algebra 1 + 2" : "Lineare Algebra 1";
    const bodyText = isLa2
      ? `hat erfolgreich alle ${total} Lektionen des gesamten Lernpfads abgeschlossen und damit Lineare Algebra 1 und 2 durchlaufen.`
      : `hat erfolgreich alle ${total} Lektionen von Lineare Algebra 1 (Modul 0–11) abgeschlossen und damit die LA1-Phase durchlaufen.`;

    const modal = document.createElement("div");
    modal.id = "certificate-modal";
    modal.className = "certificate-modal";
    modal.innerHTML = `
      <div class="certificate-modal__backdrop" id="certificate-close" aria-hidden="true"></div>
      <div class="certificate-sheet" role="dialog" aria-modal="true" aria-label="Zertifikat">
        <button id="certificate-close" type="button" class="certificate-close" aria-label="Zertifikat schließen">✕</button>
        <div class="certificate-sheet__inner">
          <div class="certificate-sheet__seal">🏆</div>
          <p class="certificate-sheet__eyebrow">${eyebrow}</p>
          <h2 class="certificate-sheet__title">${title}</h2>
          ${nameHtml}
          <p class="certificate-sheet__text">${bodyText}</p>
          <div class="certificate-sheet__stats">
            <div><strong>${completed}/${total}</strong><span>Lektionen</span></div>
            <div><strong>${mastery}%</strong><span>Mastery</span></div>
          </div>
          <p class="certificate-sheet__date">Ausgestellt am ${date}</p>
          <div class="certificate-sheet__signature">
            <span>Lineare Algebra Trainer</span>
            <span class="certificate-sheet__line"></span>
          </div>
          <div class="certificate-sheet__actions">
            <button id="certificate-print" type="button">Drucken / als PDF</button>
            <button id="certificate-close" type="button" class="ghost">Schließen</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function renderLessonGameStars(lessonId) {
    const best = state.progress.lessonGames?.[lessonId];
    if (!best || best.bestStars <= 0) return "";
    return ` <span class="lesson-stars" aria-label="${best.bestStars} Sterne">${starString(best.bestStars)}</span>`;
  }

  // Vom Fortschritts-Modul genutzte Core-Helfer (Functions sind gehoben, LA1_MODULE_IDS
  // ist weiter oben als const definiert). render bleibt in Core bis Task 6.
  LA.isCompleted = isCompleted;
  LA.allLessonsDone = allLessonsDone;
  LA.lessonsOfModules = lessonsOfModules;
  LA.LA1_MODULE_IDS = LA1_MODULE_IDS;
  LA.showStatus = showStatus;
  LA.renderFn = render;
  // Vom Quiz-Modul genutzte Core-Helfer (Functions gehoben, consts oben definiert).
  LA.escapeHtml = escapeHtml;
  LA.randInt = randInt;
  LA.pick = pick;
  LA.shuffle = shuffle;
  LA.getNeighborLesson = getNeighborLesson;
  LA.checkModuleCompletion = checkModuleCompletion;
  LA.computeStars = computeStars;
  LA.finishLessonGame = finishLessonGame;
  LA.WARMUP_COUNT = WARMUP_COUNT;
  LA.WARMUP_TYPES = WARMUP_TYPES;
  LA.LESSON_GAME_COUNT = LESSON_GAME_COUNT;
  LA.LESSON_GAME_PASS_PCT = LESSON_GAME_PASS_PCT;
})();
