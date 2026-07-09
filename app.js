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
  LA.learningPath = learningPath;
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
  LA.t = t;

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
    LA.render.renderModuleList();
    LA.render.renderLessonDetail();
    LA.render.renderProgressSummary();
    LA.render.renderMath();
    LA.viz.setupVisualizations();
    LA.render.renderReviewBanner();
    LA.render.renderShareBanner();
    LA.render.renderCertificateBanner();
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
      render();
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
  const LA2_MODULE_IDS = ["mod-12","mod-13","mod-14","mod-15","mod-16"];

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
    LA.render.renderCertificateModal();
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
})();
