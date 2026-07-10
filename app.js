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
  const SW_VERSION = 30;
  const WARMUP_COUNT = 10;
  const LESSON_GAME_COUNT = 5;
  const LESSON_GAME_PASS_PCT = 60;
  const CERTIFICATE_MASTERY_THRESHOLD = 80;
  const APP_VIEWS = new Set(["start", "lernen", "werkzeuge", "fortschritt"]);
  const VIEW_META = {
    start: { title: "Lineare Algebra Trainer — von Schulmathe bis Bachelor", target: "#home-view" },
    lernen: { title: "Lernen | Lineare Algebra Trainer", target: "#main-content" },
    werkzeuge: { title: "Rechenwerkzeuge | Lineare Algebra Trainer", target: "#tools-panel" },
    fortschritt: { title: "Fortschritt | Lineare Algebra Trainer", target: "#progress-panel" }
  };

  // Konstanten/Daten, die das Fortschritts-Modul schon beim Aufbau von `state`
  // (loadProgress -> sanitizeProgress) benötigt — daher vor `state` exponieren.
  LA.allLessons = allLessons;
  LA.lessonById = lessonById;
  LA.learningPath = learningPath;
  LA.learningReferences = LEARNING_REFERENCES;
  LA.STORAGE_KEY = STORAGE_KEY;
  LA.SAVEGAME_VERSION = SAVEGAME_VERSION;
  LA.CERTIFICATE_MASTERY_THRESHOLD = CERTIFICATE_MASTERY_THRESHOLD;

  const WARMUP_TYPES = ["simplify", "equation", "fraction", "decimal"];

  const I18N = {
    de: {
      "app.title": "Lineare Algebra",
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
  LA.t = t;

  const elements = {
    moduleList: document.getElementById("module-list"),
    lessonDetail: document.getElementById("lesson-detail"),
    progressViewCompleted: document.getElementById("progress-view-completed"),
    progressViewPercent: document.getElementById("progress-view-percent"),
    progressViewMastery: document.getElementById("progress-view-mastery"),
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
    themeLight: document.getElementById("theme-light"),
    skipLink: document.querySelector(".skip-link"),
    homeView: document.getElementById("home-view"),
    mainContent: document.getElementById("main-content"),
    toolsPanel: document.getElementById("tools-panel"),
    progressPanel: document.getElementById("progress-panel")
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
    initNavigation();
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
    LA.viz.redrawVisualizations();
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

  function currentView() {
    const requested = window.location.hash.slice(1);
    return APP_VIEWS.has(requested) ? requested : "start";
  }

  function applyView() {
    const view = currentView();
    document.body.dataset.view = view;
    if (view !== "start") document.body.classList.remove("show-warmup");
    document.querySelectorAll("[data-view-link]").forEach((link) => {
      const active = link.getAttribute("data-view-link") === view;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    const showingWarmup = view === "start" && document.body.classList.contains("show-warmup");
    const viewMeta = VIEW_META[view];
    if (elements.homeView) elements.homeView.hidden = view !== "start" || showingWarmup;
    if (elements.mainContent) elements.mainContent.hidden = view !== "lernen" && !showingWarmup;
    [elements.toolsPanel, elements.progressPanel].forEach((panel) => panel?.removeAttribute("role"));
    if (view === "werkzeuge") elements.toolsPanel?.setAttribute("role", "main");
    if (view === "fortschritt") elements.progressPanel?.setAttribute("role", "main");
    document.title = viewMeta.title;
    if (elements.skipLink) elements.skipLink.href = showingWarmup ? "#warmup-panel" : viewMeta.target;
    if (view === "lernen") LA.render.renderMath(elements.lessonDetail);
    if (showingWarmup) LA.render.renderMath(elements.warmupArea);
  }

  function navigateTo(view) {
    const target = APP_VIEWS.has(view) ? view : "start";
    if (window.location.hash === `#${target}`) applyView();
    else window.location.hash = target;
  }

  function initNavigation() {
    window.addEventListener("hashchange", applyView);
    if (!APP_VIEWS.has(window.location.hash.slice(1))) {
      window.history.replaceState(null, "", "#start");
    }
    applyView();
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
      navigateTo("lernen");
      if (window.matchMedia("(max-width: 760px)").matches) {
        const pathPanel = document.querySelector(".panel--path");
        if (pathPanel) pathPanel.open = false;
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

    LA.tools.bind(elements);

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
        LA.renderNow();
        navigateTo("lernen");
        const lessonEl = document.querySelector(".panel--lesson");
        if (lessonEl) {
          lessonEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });

    document.addEventListener("click", (event) => {
      const viewTarget = event.target.closest("[data-view-target]");
      if (viewTarget) {
        navigateTo(viewTarget.getAttribute("data-view-target"));
        return;
      }

      const jumpWarmup = event.target.closest("#jump-warmup");
      if (jumpWarmup) {
        navigateTo("start");
        document.body.classList.add("show-warmup");
        applyView();
        requestAnimationFrame(() => document.querySelector(".panel--warmup")?.scrollIntoView({ behavior: "smooth", block: "start" }));
        return;
      }

      const startRoute = event.target.closest("[data-start-lesson]");
      if (startRoute) {
        const lessonId = startRoute.getAttribute("data-start-lesson");
        if (lessonById.has(lessonId)) state.selectedLessonId = lessonId;
        state.lessonStarted = true;
        LA.renderNow();
        navigateTo("lernen");
        return;
      }

      const continueLearning = event.target.closest("#continue-learning");
      if (continueLearning) {
        const nextLesson = allLessons.find((lesson) => !isCompleted(lesson.id)) || allLessons[allLessons.length - 1];
        if (nextLesson) state.selectedLessonId = nextLesson.id;
        state.lessonStarted = true;
        LA.renderNow();
        navigateTo("lernen");
        return;
      }

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

      const certCloseBtn = event.target.closest("[data-certificate-close]");
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
          state.lessonStarted = true;
          LA.renderNow();
          navigateTo("lernen");
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && state.certificateOpen) {
        const focusable = [...document.querySelectorAll("#certificate-modal button, #certificate-modal input")];
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
        return;
      }
      if (event.key !== "Escape") return;
      if (state.certificateOpen) closeCertificate();
    });
  }

  // Render-Orchestrierung, entprellt über requestAnimationFrame: mehrere
  // schnell aufeinanderfolgende render()-Aufrufe (z.B. Quiz + Status) werden
  // zu einem einzigen Rahmen gebündelt. renderNow() erzwingt eine synchrone
  // Ausführung für Aufrufstellen, die den DOM sofort benötigen (z.B. vor
  // einem nachfolgenden scrollIntoView auf ein dynamisches Element).
  let renderQueued = false;
  function runRenderSteps() {
    LA.render.renderModuleList();
    LA.render.renderLessonDetail();
    LA.render.renderProgressSummary();
    // renderMath ist auf lessonDetail begrenzt: renderLessonDetail() ruft es
    // bereits intern mit LA.elements.lessonDetail auf, daher hier kein zweiter
    // body-weiter Scan (vermeidet doppeltes KaTeX-Durchlaufen).
    LA.viz.setupVisualizations();
    LA.render.renderReviewBanner();
    LA.render.renderShareBanner();
    LA.render.renderCertificateBanner();
  }
  function render() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      runRenderSteps();
    });
  }
  LA.renderNow = function () {
    renderQueued = false;
    runRenderSteps();
  };

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

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`./service-worker.js?v=${SW_VERSION}`)
        .catch(() => {
          showStatus("Service Worker konnte nicht registriert werden.", true);
        });
    });
  }

  let statusTimer = null;
  function showStatus(message, isError) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.toggle("is-error", Boolean(isError));
    elements.statusMessage.classList.add("is-visible");
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => elements.statusMessage.classList.remove("is-visible"), 6000);
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
      elements.warmupArea.innerHTML = LA.render.renderWarmupSummary();
      elements.warmupArea.closest(".panel--warmup")?.classList.add("is-done");
      return;
    }
    state.warmup.questions = LA.quiz.generateWarmupQuestions();
    state.warmup.currentIndex = 0;
    state.warmup.answers = [];
    state.warmup.finished = false;
    state.lessonStarted = false;
    elements.warmupArea.closest(".panel--warmup")?.classList.remove("is-done");
    LA.render.renderWarmup();
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
    LA.render.renderWarmup();
  }

  function advanceWarmup() {
    const idx = state.warmup.currentIndex;
    if (idx >= WARMUP_COUNT - 1) {
      state.warmup.finished = true;
      state.progress.warmupCompleted = true;
      state.lessonStarted = true;
      LA.progress.persistProgress();
      LA.render.renderWarmup();
      LA.renderNow();
      navigateTo("lernen");
      showStatus("Warmup abgeschlossen — viel Erfolg bei der Linearen Algebra!");
      const lessonEl = document.querySelector(".panel--lesson");
      if (lessonEl) {
        setTimeout(() => lessonEl.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    } else {
      state.warmup.currentIndex++;
      LA.render.renderWarmup();
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
    LA.render.renderLessonDetail();
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
    LA.render.renderLessonDetail();
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
  function lessonsOfModules(ids) {
    const set = new Set(ids);
    return allLessons.filter((l) => set.has(l.moduleId));
  }

  function allLessonsDone(lessons) {
    return lessons.length > 0 && lessons.every((l) => isCompleted(l.id));
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
    LA.render.renderCertificateModal();
    document.querySelectorAll(".topbar, .sidebar, .layout, .footer").forEach((element) => element.setAttribute("inert", ""));
    document.querySelector("[data-certificate-close]")?.focus();
  }

  function closeCertificate() {
    state.certificateOpen = false;
    const modal = document.getElementById("certificate-modal");
    if (modal) modal.remove();
    document.querySelectorAll(".topbar, .sidebar, .layout, .footer").forEach((element) => element.removeAttribute("inert"));
    document.getElementById("certificate-open")?.focus();
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
    LA.render.renderCertificateModal();
    document.querySelector("[data-certificate-close]")?.focus();
  }

  // Vom Fortschritts-Modul genutzte Core-Helfer (Functions sind gehoben, LA1_MODULE_IDS
  // ist weiter oben als const definiert). render bleibt in Core als Orchestrator und
  // delegiert an LA.render.* (Task 6).
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
  LA.finishLessonGame = finishLessonGame;
  LA.computeStars = computeStars;
  LA.WARMUP_COUNT = WARMUP_COUNT;
  LA.WARMUP_TYPES = WARMUP_TYPES;
  LA.LESSON_GAME_COUNT = LESSON_GAME_COUNT;
  LA.LESSON_GAME_PASS_PCT = LESSON_GAME_PASS_PCT;

  // init() bewusst ans Ende der IIFE: die LA.*-Helfer (shuffle, randInt, …)
  // müssen zugewiesen sein, bevor init → initWarmup → LA.quiz.generateWarmupQuestions
  // sie aufruft. defer stellt DOM-Readiness ohnehin sicher.
  init();
})();
