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
  const LEARNING_REFERENCES = (window.LEARNING_REFERENCES && typeof window.LEARNING_REFERENCES === "object") ? window.LEARNING_REFERENCES : {};
  const STORAGE_KEY = "lineare-algebra-savegame-v1";
  const SAVEGAME_VERSION = 1;
  const SW_VERSION = 15;
  const WARMUP_COUNT = 10;
  const LESSON_GAME_COUNT = 5;
  const LESSON_GAME_PASS_PCT = 60;
  const CERTIFICATE_MASTERY_THRESHOLD = 80;

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
    warmupArea: document.getElementById("warmup-area"),
    themeDark: document.getElementById("theme-dark"),
    themeLight: document.getElementById("theme-light")
  };

  const state = {
    selectedLessonId: allLessons[0]?.id || null,
    progress: loadProgress(),
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
      state.shareModuleId = null;
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

      const checkQuizTextButton = event.target.closest("#check-quiz-text");
      if (checkQuizTextButton) {
        evaluateTextQuiz();
        return;
      }

      const nextQuizButton = event.target.closest("#next-quiz");
      if (nextQuizButton) {
        advanceFromQuiz();
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
        advanceLessonGame();
        return;
      }
    });

    elements.exportProgress.addEventListener("click", exportSavegame);
    elements.importProgress.addEventListener("change", importSavegame);
    elements.resetProgress.addEventListener("click", resetProgress);

    elements.calcDot.addEventListener("click", calculateDotProduct);
    elements.calcDet.addEventListener("click", calculateDeterminant2x2);
    elements.calcMul.addEventListener("click", calculateMatrixMultiply);
    elements.calcInv.addEventListener("click", calculateInverse2x2);
    elements.calcGauss.addEventListener("click", calculateGauss);

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
        ${renderQuiz(lesson, userAnswer, hasAnswer, isCorrect, quizButtonHtml)}
      </section>

      ${renderReferences(lesson)}

      ${renderFAQBlock(lesson)}

      <section class="lesson-section lesson-game" id="lesson-game-section">
        <h3>Spielmodus</h3>
        ${renderLessonGameSection(lesson)}
      </section>
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
        const isTextCorrect = accept.some((a) => normalizeAnswer(textAnswer) === normalizeAnswer(a));
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

  function normalizeAnswer(str) {
    return String(str || "").trim().toLowerCase().replace(/\s+/g, " ").replace(",", ".");
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
    if (answer === lesson.quiz.answerIndex) {
      removeFromReviewQueue(lesson.id);
      showStatus("Richtig! Stark.");
    } else {
      addToReviewQueue(lesson.id);
      showStatus("Nicht ganz. Erklärung beachten und erneut probieren.", true);
    }
    persistProgress();
    renderLessonDetail();
    renderProgressSummary();
    if (answer === lesson.quiz.answerIndex) {
      showStatus("Richtig! Stark.");
    } else {
      showStatus("Nicht ganz. Erklärung beachten und erneut probieren.", true);
    }
  }

  function evaluateTextQuiz() {
    const lesson = lessonById.get(state.selectedLessonId);
    if (!lesson || !lesson.quiz || lesson.quiz.inputType !== "text") {
      return;
    }
    const input = document.getElementById("quiz-text-input");
    if (!input || !input.value.trim()) {
      showStatus("Bitte zuerst eine Antwort eingeben.", true);
      return;
    }
    if (!state.progress.quizTextAnswers) {
      state.progress.quizTextAnswers = {};
    }
    if (!state.progress.quizTextChecked) {
      state.progress.quizTextChecked = {};
    }
    state.progress.quizTextAnswers[lesson.id] = input.value;
    state.progress.quizTextChecked[lesson.id] = true;
    const accept = lesson.quiz.acceptAnswers || [lesson.quiz.correctAnswer];
    const correct = accept.some((a) => normalizeAnswer(input.value) === normalizeAnswer(a));
    if (correct) {
      removeFromReviewQueue(lesson.id);
      showStatus("Richtig! Stark.");
    } else {
      addToReviewQueue(lesson.id);
      showStatus("Nicht ganz. Erklärung beachten und erneut probieren.", true);
    }
    persistProgress();
    renderLessonDetail();
    renderProgressSummary();
  }

  function addToReviewQueue(lessonId) {
    if (!state.progress.reviewQueue) {
      state.progress.reviewQueue = [];
    }
    if (!state.progress.reviewQueue.includes(lessonId)) {
      state.progress.reviewQueue.push(lessonId);
    }
  }

  function removeFromReviewQueue(lessonId) {
    if (!state.progress.reviewQueue) {
      return;
    }
    state.progress.reviewQueue = state.progress.reviewQueue.filter((id) => id !== lessonId);
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

  function advanceFromQuiz() {
    const lesson = lessonById.get(state.selectedLessonId);
    if (lesson && !isCompleted(lesson.id)) {
      state.progress.completedLessons[lesson.id] = true;
      persistProgress();
      checkModuleCompletion(lesson.moduleId);
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

  function defaultProgress() {
    const now = new Date().toISOString();
    return {
      version: SAVEGAME_VERSION,
      startedAt: now,
      updatedAt: now,
      warmupCompleted: false,
      completedLessons: {},
      quizAnswers: {},
      quizTextAnswers: {},
      quizTextChecked: {},
      reviewQueue: [],
      lessonGames: {},
      certificate: { unlocked: false, name: "", shownAt: null }
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
      quizAnswers: {},
      quizTextAnswers: {},
      quizTextChecked: {},
      reviewQueue: Array.isArray(candidate.reviewQueue) ? candidate.reviewQueue.filter((id) => typeof id === "string") : [],
      lessonGames: {},
      certificate: sanitizeCertificate(candidate.certificate)
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

    if (isObject(candidate.lessonGames)) {
      for (const lessonId of Object.keys(candidate.lessonGames)) {
        if (!lessonById.has(lessonId)) continue;
        const g = candidate.lessonGames[lessonId];
        if (!isObject(g)) continue;
        sanitized.lessonGames[lessonId] = {
          bestPct: typeof g.bestPct === "number" && isFinite(g.bestPct) ? Math.max(0, Math.round(g.bestPct)) : 0,
          bestStars: typeof g.bestStars === "number" && isFinite(g.bestStars) ? Math.max(0, Math.min(3, Math.round(g.bestStars))) : 0,
          attempts: typeof g.attempts === "number" && isFinite(g.attempts) ? Math.max(0, Math.round(g.attempts)) : 0
        };
      }
    }

    return sanitized;
  }

  function sanitizeCertificate(source) {
    if (!isObject(source)) {
      return { unlocked: false, name: "", shownAt: null };
    }
    return {
      unlocked: source.unlocked === true,
      name: typeof source.name === "string" ? source.name.slice(0, 80) : "",
      shownAt: typeof source.shownAt === "string" ? source.shownAt : null
    };
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
    window.location.reload();
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

  function parseMatrix(input) {
    const rows = input.split(";").map((r) => r.trim()).filter((r) => r.length > 0);
    if (rows.length === 0) {
      throw new Error("Bitte Matrix eingeben, Zeilen mit ';' trennen.");
    }
    const matrix = rows.map((row) => row.split(",").map((v) => Number(v.trim())));
    const cols = matrix[0].length;
    if (matrix.some((row) => row.length !== cols || row.some((v) => !Number.isFinite(v)))) {
      throw new Error("Matrix ungültig. Zahlen mit Komma, Zeilen mit Semikolon trennen.");
    }
    return matrix;
  }

  function formatMatrix(m) {
    return "[" + m.map((row) => row.join(", ")).join("; ") + "]";
  }

  function calculateMatrixMultiply() {
    try {
      const A = parseMatrix(elements.matrixA.value);
      const B = parseMatrix(elements.matrixB2.value);
      if (A[0].length !== B.length) {
        throw new Error(`Spalten von A (${A[0].length}) müssen Zeilen von B (${B.length}) entsprechen.`);
      }
      const result = A.map((row) =>
        B[0].map((_, j) => row.reduce((sum, val, i) => sum + val * B[i][j], 0))
      );
      elements.mulOutput.textContent = `A · B = ${formatMatrix(result)}`;
    } catch (error) {
      elements.mulOutput.textContent = error.message;
    }
  }

  function calculateInverse2x2() {
    try {
      const m = parse2x2Matrix(elements.matrixInv.value);
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
      const A = parseMatrix(parts[0]);
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
    renderMath(elements.warmupArea);
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
        <p>Jetzt geht es mit der Linearen Algebra weiter.</p>
        <button id="warmup-start-lesson" type="button" class="warmup-continue">Zur ersten Lektion</button>
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

  /* ===================== Spielmodus pro Lektion ===================== */

  function computeStars(pct) {
    if (pct >= 90) return 3;
    if (pct >= 60) return 2;
    if (pct >= 30) return 1;
    return 0;
  }

  function mcq(question, answer, wrongs, explanation) {
    const set = [answer];
    for (const w of wrongs) {
      if (w !== answer && !set.includes(w)) set.push(w);
    }
    const opts = shuffle(set);
    return {
      question: question,
      options: opts,
      answerIndex: opts.indexOf(answer),
      correctAnswer: answer,
      explanation: explanation
    };
  }

  function fmtComplex(a, b) {
    if (a === 0 && b === 0) return "0";
    const imPart = (val) => (val === 1 ? "i" : val === -1 ? "-i" : val + "i");
    if (a === 0) return imPart(b);
    if (b === 0) return String(a);
    return b > 0 ? `${a} + ${imPart(b)}` : `${a} - ${imPart(-b)}`;
  }

  function genComplex() {
    const subtype = randInt(0, 4);
    if (subtype === 0) {
      const a = randInt(-9, 9);
      const b = randInt(-9, 9);
      return mcq(
        `Was ist der Realteil von $z = ${fmtComplex(a, b)}$?`,
        String(a),
        [String(a + randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1)), String(b), String(a - 1)],
        `Der Realteil ist die Zahl ohne $i$: also ${a}.`
      );
    }
    if (subtype === 1) {
      const a = randInt(-9, 9);
      const b = randInt(-9, 9);
      return mcq(
        `Was ist der Imaginärteil von $z = ${fmtComplex(a, b)}$?`,
        String(b),
        [String(b + randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1)), String(a), String(-b)],
        `Der Imaginärteil ist die Zahl vor dem $i$ (mit Vorzeichen): also ${b}.`
      );
    }
    if (subtype === 2) {
      const a = randInt(-4, 4), b = randInt(-4, 4);
      const c = randInt(-4, 4), d = randInt(-4, 4);
      const re = a + c, im = b + d;
      return mcq(
        `Berechne $(${fmtComplex(a, b)}) + (${fmtComplex(c, d)})$.`,
        fmtComplex(re, im),
        [fmtComplex(a + d, b + c), fmtComplex(re + 1, im), fmtComplex(re, im + 1)],
        `Realteile und Imaginärteile einzeln addieren: ${a}+${c}=${re}, ${b}+${d}=${im}.`
      );
    }
    if (subtype === 3) {
      const a = randInt(-3, 3), b = randInt(-3, 3);
      const c = randInt(-3, 3), d = randInt(-3, 3);
      const re = a * c - b * d, im = a * d + b * c;
      return mcq(
        `Berechne $(${fmtComplex(a, b)}) \\cdot (${fmtComplex(c, d)})$.`,
        fmtComplex(re, im),
        [fmtComplex(a * c + b * d, a * d - b * c), fmtComplex(re + 1, im), fmtComplex(re, im + 1)],
        `Ausmultiplizieren mit $i^2 = -1$: Real ${a}·${c}-${b}·${d}=${re}, Imag ${a}·${d}+${b}·${c}=${im}.`
      );
    }
    const a = randInt(-6, 6), b = randInt(-6, 6);
    return mcq(
      `Wie lautet die konjugiert komplexe Zahl zu $z = ${fmtComplex(a, b)}$?`,
      fmtComplex(a, -b),
      [fmtComplex(-a, b), fmtComplex(-a, -b), fmtComplex(a + 1, b)],
      `Konjugiert bedeutet: das Vorzeichen des Imaginärteils umdrehen.`
    );
  }

  function genBasics() {
    const gen = pick([genSimplify, genEquation, genFraction, genDecimal]);
    return gen(randInt(1, 9));
  }

  function genVectors() {
    const subtype = randInt(0, 4);
    if (subtype === 0) {
      const a = randInt(-6, 6), b = randInt(-6, 6), c = randInt(-6, 6), d = randInt(-6, 6);
      return mcq(
        `Berechne $(${a}, ${b}) + (${c}, ${d})$.`,
        `${a + c}, ${b + d}`,
        [`${a + c}, ${b - d}`, `${a + d}, ${b + c}`, `${a + c + 1}, ${b + d}`],
        `Komponenten einzeln addieren: ${a}+${c}=${a + c}, ${b}+${d}=${b + d}.`
      );
    }
    if (subtype === 1) {
      const k = randInt(2, 6);
      const a = randInt(-4, 4), b = randInt(-4, 4), c = randInt(-4, 4);
      return mcq(
        `Berechne $${k} \\cdot (${a}, ${b}, ${c})$.`,
        `${k * a}, ${k * b}, ${k * c}`,
        [`${k + a}, ${k + b}, ${k + c}`, `${k * a + 1}, ${k * b}, ${k * c}`, `${a + k}, ${b + k}, ${c + k}`],
        `Jede Komponente mit ${k} multiplizieren.`
      );
    }
    if (subtype === 2) {
      const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]];
      const [a, b, len] = pick(triples);
      const sign = pick([1, -1]);
      return mcq(
        `Wie lang ist der Vektor $(${sign * a}, ${b})$?`,
        `${len}`,
        [`${a + b}`, `${len + 1}`, `${a * b}`],
        `Länge $= \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a*a} + ${b*b}} = ${len}$.`
      );
    }
    if (subtype === 3) {
      const a = randInt(-6, 6), b = randInt(-6, 6);
      return mcq(
        `Welche x-Komponente hat der Vektor $(${a}, ${b})$?`,
        `${a}`,
        [`${b}`, `${a + 1}`, `${-a}`],
        `Die erste Zahl ist die x-Komponente: ${a}.`
      );
    }
    const a = randInt(-6, 6), b = randInt(-6, 6), c = randInt(-6, 6), d = randInt(-6, 6);
    const sum = (a + c) ** 2 + (b + d) ** 2;
    return mcq(
      `Ist $(${a}, ${b}) + (${c}, ${d})$ gleich $(${a + c}, ${b + d})$?`,
      "Ja, Komponenten werden einzeln addiert.",
      ["Nein, man muss die Vektoren multiplizieren", "Nur wenn beide Vektoren gleich lang sind", "Nur wenn alle Zahlen positiv sind"],
      `Vektoraddition: komponentenweise. Hier: (${a + c}, ${b + d}).`
    );
  }

  function genMatrices() {
    const subtype = randInt(0, 4);
    if (subtype === 0) {
      const ra = randInt(2, 4), ca = randInt(2, 4);
      const rb = ca, cb = randInt(2, 4);
      return mcq(
        `Matrix $A$ ist ${ra}×${ca}, Matrix $B$ ist ${rb}×${cb}. Welche Form hat $A \\cdot B$?`,
        `${ra}×${cb}`,
        [`${ca}×${rb}`, `${ra}×${ca}`, `${rb}×${cb}`],
        `Bei $A \\cdot B$ bleiben die Zeilen von A und die Spalten von B: ${ra}×${cb}.`
      );
    }
    if (subtype === 1) {
      return mcq(
        "Wie heißt eine quadratische Matrix mit Einsen auf der Diagonalen und sonst nur Nullen?",
        "Einheitsmatrix",
        ["Nullmatrix", "Diagonalmatrix (allgemein)", "Spaltenmatrix"],
        "Das ist die Einheitsmatrix $I$ — sie verhält sich wie die 1 bei Zahlen."
      );
    }
    if (subtype === 2) {
      return mcq(
        "Wann darf man zwei Matrizen addieren?",
        "Wenn beide gleich viele Zeilen und Spalten haben.",
        ["Immer", "Nur wenn beide quadratisch sind", "Nur wenn die Determinante gleich ist"],
        "Matrizenaddition geht nur bei gleicher Form (gleiche Zeilen- und Spaltenzahl)."
      );
    }
    if (subtype === 3) {
      return mcq(
        "Stimmt $A \\cdot B = B \\cdot A$ bei Matrizen?",
        "Nein, die Reihenfolge macht einen Unterschied.",
        ["Ja, immer", "Nur bei Nullmatrizen", "Nur wenn beide Diagonalmatrizen sind"],
        "Im Gegensatz zu Zahlen ist die Matrixmultiplikation nicht kommutativ."
      );
    }
    return mcq(
      "Wie heißt eine Matrix, die nur aus Nullen besteht?",
      "Nullmatrix",
      ["Einheitsmatrix", "Inverse", "Spaltenvektor"],
      "Eine Matrix lauter Nullen heißt Nullmatrix."
    );
  }

  function genLGS() {
    const subtype = randInt(0, 4);
    if (subtype === 0) {
      return mcq(
        "Was gilt immer für ein Gleichungssystem $A \\vec{x} = \\vec{0}$?",
        "Es gibt immer die triviale Lösung $\\vec{x} = \\vec{0}$.",
        ["Es gibt keine Lösung", "Es gibt genau eine nicht-triviale Lösung", "Es gibt nur Lösungen, wenn A invertierbar ist"],
        "Bei rechter Seite null ist der Nullvektor immer eine Lösung."
      );
    }
    if (subtype === 1) {
      const vars = randInt(2, 5), rang = randInt(1, vars - 1);
      const frei = vars - rang;
      return mcq(
        `Ein System hat ${vars} Variablen und Rang ${rang}. Wie viele freie Variablen gibt es (falls lösbar)?`,
        `${frei}`,
        [`${vars + rang}`, `${rang}`, `${vars}`],
        `Freiheitsgrad = Variablen − Rang = ${vars} − ${rang} = ${frei}.`
      );
    }
    if (subtype === 2) {
      return mcq(
        "Welche Operation ist beim Gauss-Verfahren NICHT erlaubt?",
        "Eine Zeile mit 0 multiplizieren.",
        ["Zwei Zeilen vertauschen", "Ein Vielfaches einer Zeile zu einer anderen addieren", "Eine Zeile mit 3 multiplizieren"],
        "Mit 0 multiplizieren zerstört die Zeile — Information geht verloren."
      );
    }
    if (subtype === 3) {
      return mcq(
        "Wann hat ein lösbares Gleichungssystem unendlich viele Lösungen?",
        "Wenn der Rang kleiner ist als die Anzahl der Variablen.",
        ["Wenn es genauso viele Gleichungen wie Variablen gibt", "Wenn alle Zahlen gleich sind", "Wenn die Determinante 1 ist"],
        "Bei Rang < Variablen gibt es freie Variablen → unendlich viele Lösungen."
      );
    }
    return mcq(
      "Wann hat ein Gleichungssystem genau eine Lösung?",
      "Wenn Rang = Anzahl der Variablen und das System lösbar ist.",
      ["Wenn es mehr Gleichungen als Variablen gibt", "Wenn die Determinante 0 ist", "Immer bei quadratischen Matrizen"],
      "Voller Rang (Rang = Variablen) und Lösbarkeit → eindeutige Lösung."
    );
  }

  function genDeterminant() {
    const subtype = randInt(0, 3);
    if (subtype === 0) {
      const a = randInt(-5, 5), b = randInt(-5, 5), c = randInt(-5, 5), d = randInt(-5, 5);
      const det = a * d - b * c;
      return mcq(
        `Berechne die Determinante von $\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$.`,
        `${det}`,
        [`${a * d + b * c}`, `${a * c - b * d}`, `${det + 1}`],
        `Formel: $ad - bc = ${a}·${d} - ${b}·${c} = ${det}$.`
      );
    }
    if (subtype === 1) {
      return mcq(
        "Was passiert mit der Determinante, wenn man zwei Zeilen vertauscht?",
        "Das Vorzeichen ändert sich (+ wird -, - wird +).",
        ["Sie bleibt gleich", "Sie wird 0", "Sie wird verdoppelt"],
        "Ein Zeilentausch wechselt das Vorzeichen der Determinante."
      );
    }
    if (subtype === 2) {
      return mcq(
        "Was bedeutet $\\det(A) = 0$?",
        "Alles wird zusammengequetscht — A hat keine inverse.",
        ["Die Fläche wird gespiegelt", "Die Fläche bleibt gleich", "A ist die Einheitsmatrix"],
        "det = 0 bedeutet die Abbildung ist nicht invertierbar."
      );
    }
    return mcq(
      "Wenn man eine Zeile einer Matrix mit 3 multipliziert, was passiert mit der Determinante?",
      "Sie wird mit 3 multipliziert.",
      ["Sie bleibt gleich", "Sie wird 0", "Sie wird mit 9 multipliziert"],
        "Zeilenfaktor multipliziert auch die Determinante."
    );
  }

  function genVectorSpace() {
    const subtype = randInt(0, 3);
    if (subtype === 0) {
      return mcq(
        "Was muss jeder Unterraum unbedingt enthalten?",
        "Den Nullvektor.",
        ["Unendlich viele Vektoren", "Nur senkrechte Vektoren", "Nur ganze Zahlen"],
        "Ohne den Nullvektor ist es kein Unterraum."
      );
    }
    if (subtype === 1) {
      const dim = randInt(2, 6);
      return mcq(
        `Wie viele Basisvektoren braucht eine Basis im ${dim}-dimensionalen Raum?`,
        `${dim}`,
        [`${dim - 1}`, `${dim + 1}`, `${dim * 2}`],
        `Die Dimension ist genau die Anzahl der Basisvektoren: ${dim}.`
      );
    }
    if (subtype === 2) {
      return mcq(
        "Was beschreibt eine Basis?",
        "Ein minimaler Satz Bausteine, mit dem man jeden Vektor bauen kann.",
        ["Die längsten Vektoren", "Alle Vektoren des Raumes", "Vektoren gleicher Länge"],
        "Eine Basis ist erzeugend und linear unabhängig — minimal und vollständig."
      );
    }
    return mcq(
      "Was ändert sich bei einem Basiswechsel?",
      "Nur die Koordinaten ändern sich, der Vektor bleibt derselbe.",
      ["Die Vektoren ändern sich", "Der Raum wird kleiner", "Gar nichts, auch Koordinaten nicht"],
        "Der Vektor bleibt, nur seine Beschreibung durch Koordinaten ändert sich."
    );
  }

  function genLinearMap() {
    const subtype = randInt(0, 3);
    if (subtype === 0) {
      return mcq(
        "Welche Abbildung ist linear?",
        "$T(x, y) = (3x, 3y)$ (Strecken)",
        ["$T(x) = x + 5$", "$T(x) = x^2$", "$T(x) = |x|$"],
        "Nur Strecken erfüllt beide Linearitätsregeln (Addition und Vielfaches)."
      );
    }
    if (subtype === 1) {
      return mcq(
        "Was bedeutet es, wenn der Kern einer Abbildung nur aus dem Nullvektor besteht?",
        "Nichts geht verloren — die Abbildung ist injektiv.",
        ["Die Maschine funktioniert nicht", "Alles wird zu null", "Das Bild ist leer"],
        "Nur null → null bedeutet: verschiedene Eingaben geben verschiedene Ausgaben."
      );
    }
    if (subtype === 2) {
      const ein = randInt(3, 9), kern = randInt(0, ein - 1);
      const bild = ein - kern;
      return mcq(
        `Die Eingabe hat ${ein} Dimensionen, der Kern ${kern}. Wie groß ist das Bild?`,
        `${bild}`,
        [`${ein + kern}`, `${kern}`, `${ein}`],
        `Rang-Nullitätssatz: Eingabe = Kern + Bild → Bild = ${ein} − ${kern} = ${bild}.`
      );
    }
    return mcq(
      "Was ist das Bild einer linearen Abbildung?",
      "Die Menge aller möglichen Ausgaben.",
      ["Die Menge der Eingaben, die null werden", "Der Nullvektor", "Die Determinante"],
        "Das Bild = alle Vektoren, die als Ergebnis herauskommen können."
    );
  }

  function genEigen() {
    const subtype = randInt(0, 3);
    if (subtype === 0) {
      const a = randInt(2, 9), b = randInt(2, 9);
      return mcq(
        `Bestimme die Eigenwerte von $\\begin{pmatrix} ${a} & 0 \\\\ 0 & ${b} \\end{pmatrix}$.`,
        `${a} und ${b}`,
        [`${a + b} und ${a - b}`, `${a * b} und 0`, `1 und ${a}`],
        "Bei einer Diagonalmatrix sind die Eigenwerte genau die Diagonaleinträge."
      );
    }
    if (subtype === 1) {
      const lam = randInt(2, 6);
      return mcq(
        `Ist $\\vec{v} = (1, 0)$ ein Eigenvektor von $\\begin{pmatrix} ${lam} & 0 \\\\ 0 & ${lam + 1} \\end{pmatrix}$? Welcher Eigenwert?`,
        `Ja, Eigenwert ${lam}`,
        [`Ja, Eigenwert ${lam + 1}`, "Nein", "Ja, Eigenwert 0"],
        `A·(1,0) = (${lam}, 0) = ${lam}·(1,0) → Eigenwert ${lam}.`
      );
    }
    if (subtype === 2) {
      return mcq(
        "Wie findet man die Eigenwerte einer Matrix?",
        "Man löst $\\det(A - \\lambda I) = 0$ (charakteristisches Polynom).",
        ["Man berechnet die Determinante von A", "Man addiert alle Einträge", "Man invertiert A"],
        "Nullstellen des charakteristischen Polynoms = Eigenwerte."
      );
    }
    return mcq(
      "Warum darf ein Eigenvektor nicht der Nullvektor sein?",
      "Weil sonst jede Zahl ein Eigenwert wäre ($A·0 = \\lambda·0$ ist immer wahr).",
      ["Weil der Nullvektor zu lang ist", "Weil nur positive Zahlen erlaubt sind", "Weil der Nullvektor keine Länge hat"],
        "Mit dem Nullvektor wäre die Definition sinnlos — jedes λ würde passen."
    );
  }

  function genDot() {
    const subtype = randInt(0, 3);
    if (subtype === 0) {
      const a = randInt(-5, 5), b = randInt(-5, 5), c = randInt(-5, 5), d = randInt(-5, 5);
      const dot = a * c + b * d;
      return mcq(
        `Berechne das Skalarprodukt von $(${a}, ${b})$ und $(${c}, ${d})$.`,
        `${dot}`,
        [`${a * c - b * d}`, `${a + b + c + d}`, `${dot + 1}`],
        `Paarweise multiplizieren und addieren: ${a}·${c} + ${b}·${d} = ${dot}.`
      );
    }
    if (subtype === 1) {
      return mcq(
        "Wann stehen zwei Vektoren senkrecht (orthogonal) aufeinander?",
        "Wenn ihr Skalarprodukt null ist.",
        ["Wenn sie gleich lang sind", "Wenn sie identisch sind", "Wenn beide positiv sind"],
        "Skalarprodukt = 0 bedeutet 90°-Winkel."
      );
    }
    if (subtype === 2) {
      return mcq(
        "Was bedeutet 'orthonormal'?",
        "Vektoren stehen senkrecht aufeinander und haben Länge 1.",
        ["Alle Vektoren sind gleich lang", "Es gibt genau zwei Vektoren", "Die Determinante ist 1"],
        "Orthonormal = orthogonal + normiert (Länge 1)."
      );
    }
    return mcq(
      "Was ist eine orthogonale Projektion?",
      "Wie ein Schatten — man wirft einen Vektor auf eine Linie oder Ebene.",
      ["Eine Spiegelung", "Eine Drehung", "Eine Vergrößerung"],
        "Projektion = nächstgelegener Punkt auf einer Linie/Ebene, Fehler steht senkrecht."
    );
  }

  function genSVD() {
    const subtype = randInt(0, 2);
    if (subtype === 0) {
      return mcq(
        "Für welche Matrizen gilt der Spektralsatz (reelle Eigenwerte, senkrechte Eigenvektoren)?",
        "Für symmetrische Matrizen.",
        ["Für alle Matrizen", "Nur für Nullmatrizen", "Nur für Diagonalmatrizen"],
        "Symmetrische Matrizen haben reelle Eigenwerte und orthogonale Eigenvektoren."
      );
    }
    if (subtype === 1) {
      return mcq(
        "Für welche Matrizen existiert eine Singulärwertzerlegung (SVD)?",
        "Für jede reelle Matrix.",
        ["Nur für quadratische Matrizen", "Nur für symmetrische Matrizen", "Nur für invertierbare Matrizen"],
        "Die SVD funktioniert für jede Matrix — egal welche Form."
      );
    }
    return mcq(
      "Was macht die Least-Squares-Methode?",
      "Sie findet die bestmögliche Näherung, wenn es keine exakte Lösung gibt.",
      ["Sie findet die exakte Lösung", "Sie teilt durch null", "Sie zeichnet ein Bild"],
        "Least Squares minimiert den Fehler — die bestmögliche Näherung."
    );
  }

  function genExam() {
    const subtype = randInt(0, 2);
    if (subtype === 0) {
      return mcq(
        "Was ist der schnellste Plausibilitätscheck in einer Prüfung?",
        "Prüfen, ob die Dimensionen bei jeder Rechnung zusammenpassen.",
        ["Alle Rechnungen neu rechnen", "Nur das Vorzeichen kontrollieren", "Das Ergebnis abschätzen"],
        "Ein Dimensionscheck ist schnell und findet sofort viele Fehler."
      );
    }
    if (subtype === 1) {
      return mcq(
        "Was sagt die Konditionszahl aus?",
        "Wie empfindlich das Ergebnis auf kleine Änderungen reagiert.",
        ["Wie schnell der Computer rechnet", "Wie viele Nullen die Matrix hat", "Wie groß die Determinante ist"],
        "Hohe Konditionszahl = kleine Störungen → große Ergebnisänderung."
      );
    }
    return mcq(
      "Wann ist eine Matrix 'defekt' (nicht diagonalisierbar)?",
      "Wenn es zu wenige unabhängige Eigenvektoren gibt.",
      ["Wenn die Determinante 1 ist", "Wenn alle Eigenwerte verschieden sind", "Wenn die Matrix symmetrisch ist"],
        "Zu wenige Eigenvektoren → keine Basis → nicht diagonalisierbar (Jordan-Form hilft)."
    );
  }

  const LESSON_GAME_GENERATORS = {
    "mod-0": genComplex,
    "mod-1": genBasics,
    "mod-2": genVectors,
    "mod-3": genMatrices,
    "mod-4": genLGS,
    "mod-5": genDeterminant,
    "mod-6": genVectorSpace,
    "mod-7": genLinearMap,
    "mod-8": genEigen,
    "mod-9": genDot,
    "mod-10": genSVD,
    "mod-11": genExam
  };

  function generateLessonGameQuestions(moduleId) {
    const gen = LESSON_GAME_GENERATORS[moduleId] || genBasics;
    const questions = [];
    const seen = new Set();
    let guard = 0;
    while (questions.length < LESSON_GAME_COUNT && guard < 80) {
      guard++;
      const q = gen();
      if (!q || seen.has(q.question)) continue;
      seen.add(q.question);
      questions.push(q);
    }
    return questions;
  }

  function startLessonGame(lessonId) {
    const lesson = lessonById.get(lessonId);
    if (!lesson) return;
    state.lessonGame = {
      lessonId: lessonId,
      questions: generateLessonGameQuestions(lesson.moduleId),
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

  function advanceLessonGame() {
    const game = state.lessonGame;
    const idx = game.currentIndex;
    if (idx >= game.questions.length - 1) {
      finishLessonGame();
    } else {
      game.currentIndex++;
      renderLessonDetail();
    }
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
      removeFromReviewQueue(lesson.id);
    } else {
      addToReviewQueue(lesson.id);
    }

    persistProgress();
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

  function certificateAvailable() {
    const allDone = allLessons.length > 0 && allLessons.every((l) => isCompleted(l.id));
    if (!allDone) return false;
    return computeMastery() >= CERTIFICATE_MASTERY_THRESHOLD;
  }

  function computeMastery() {
    const total = allLessons.length;
    const completed = allLessons.filter((l) => isCompleted(l.id)).length;
    const completionRate = total > 0 ? completed / total : 0;
    const quizCorrect = allLessons.reduce((count, l) => {
      const a = state.progress.quizAnswers[l.id];
      if (typeof a === "number" && a === l.quiz.answerIndex) return count + 1;
      return count;
    }, 0);
    const quizRate = total > 0 ? quizCorrect / total : 0;
    return Math.round((completionRate * 0.7 + quizRate * 0.3) * 100);
  }

  function renderCertificateBanner() {
    if (!certificateAvailable()) return;
    if (document.querySelector(".certificate-banner")) return;
    const content = document.querySelector(".content");
    if (!content) return;
    const banner = document.createElement("div");
    banner.className = "certificate-banner";
    banner.innerHTML = `
      <div class="certificate-banner__emoji" aria-hidden="true">🎓</div>
      <div class="certificate-banner__body">
        <h2>Zertifikat freigeschaltet!</h2>
        <p>Du hast alle Lektionen abgeschlossen und ${CERTIFICATE_MASTERY_THRESHOLD}% Mastery erreicht. Hol dir dein Zertifikat.</p>
      </div>
      <div class="certificate-banner__actions">
        <button id="certificate-open" type="button">Zertifikat anzeigen</button>
        <button id="certificate-banner-close" type="button" class="ghost" aria-label="Hinweis schließen">✕</button>
      </div>
    `;
    content.insertBefore(banner, content.firstChild);
  }

  function openCertificate() {
    if (!certificateAvailable()) {
      showStatus("Zertifikat ist noch nicht freigeschaltet.", true);
      return;
    }
    if (!state.progress.certificate) state.progress.certificate = { unlocked: false, name: "", shownAt: null };
    state.progress.certificate.unlocked = true;
    state.progress.certificate.shownAt = new Date().toISOString();
    persistProgress();
    state.certificateOpen = true;
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
    if (!state.progress.certificate) state.progress.certificate = { unlocked: false, name: "", shownAt: null };
    state.progress.certificate.name = name;
    persistProgress();
    renderCertificateModal();
  }

  function renderCertificateModal() {
    const existing = document.getElementById("certificate-modal");
    if (existing) existing.remove();
    if (!state.certificateOpen) return;

    const mastery = computeMastery();
    const completed = allLessons.filter((l) => isCompleted(l.id)).length;
    const total = allLessons.length;
    const name = state.progress.certificate?.name || "";
    const date = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
    const nameHtml = name
      ? `<div class="cert-name">${escapeHtml(name)}</div>`
      : `<div class="cert-name-entry"><label for="certificate-name-input">Dein Name:</label><input type="text" id="certificate-name-input" placeholder="Vor- und Nachname" maxlength="80"><button id="certificate-save-name" type="button">Speichern</button></div>`;

    const modal = document.createElement("div");
    modal.id = "certificate-modal";
    modal.className = "certificate-modal";
    modal.innerHTML = `
      <div class="certificate-modal__backdrop" id="certificate-close" aria-hidden="true"></div>
      <div class="certificate-sheet" role="dialog" aria-modal="true" aria-label="Zertifikat">
        <button id="certificate-close" type="button" class="certificate-close" aria-label="Zertifikat schließen">✕</button>
        <div class="certificate-sheet__inner">
          <div class="certificate-sheet__seal">🏆</div>
          <p class="certificate-sheet__eyebrow">Lineare Algebra Trainer</p>
          <h2 class="certificate-sheet__title">Zertifikat</h2>
          ${nameHtml}
          <p class="certificate-sheet__text">hat erfolgreich alle ${total} Lektionen abgeschlossen und damit den Lernpfad zur Linearen Algebra durchlaufen.</p>
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
})();
