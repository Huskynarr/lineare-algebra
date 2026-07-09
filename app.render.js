// app.render.js
window.LA = window.LA || {};
LA.render = LA.render || {};

// Memoisierung: nachdem die Modulliste einmal vollständig gerendert wurde,
// aktualisieren spätere Renders nur noch Abschluss-Klassen/Sterne auf den
// bestehenden Karten (patch), statt das gesamte innerHTML neu aufzubauen.
// Zurückgesetzt wird das Flag bei reset/import (siehe app.progress.js), damit
// die Liste die neue Savegame-Realität vollständig neu aufbaut.
LA.render.moduleListRendered = false;

// Render-lokale Helfer (nicht Teil der öffentlichen LA.render-API).
function starString(stars) {
  return [0, 1, 2].map((i) => (i < stars ? "&#9733;" : "&#9734;")).join(" ");
}

LA.render.renderMath = function (scope) {
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
};

LA.render.renderModuleList = function () {
  if (LA.render.moduleListRendered) {
    LA.render._patchModuleCompletion();
    return;
  }
  const html = LA.learningPath
    .map((module) => {
      const doneInModule = module.lessons.filter((lesson) => LA.isCompleted(lesson.id)).length;
      const moduleProgress = Math.round((doneInModule / module.lessons.length) * 100);
      const lessonsHtml = module.lessons
        .map((lesson, lessonIndex) => {
          const done = LA.isCompleted(lesson.id);
          const active = lesson.id === LA.state.selectedLessonId;
          return `
              <button
                type="button"
                class="lesson-link${active ? " is-active" : ""}${done ? " is-done" : ""}"
                data-lesson-id="${LA.escapeHtml(lesson.id)}"
              >
                <span>
                  ${LA.escapeHtml(lesson.title)}
                  <small>· ${LA.escapeHtml(lesson.estimatedMinutes.toString())} min</small>
                  ${LA.render.renderLessonGameStars(lesson.id)}
                </span>
                <span class="badge ${done ? "done" : ""}">${done ? "✓" : lessonIndex + 1}</span>
              </button>
            `;
        })
        .join("");

      return `
          <article class="module-card">
            <h3>${LA.escapeHtml(module.title)}</h3>
            <div class="module-meta">
              <span>Level: ${LA.escapeHtml(module.level)}</span>
              <span>Zielzeit: ${LA.escapeHtml(module.targetHours.toString())} h</span>
              <span>Modulfortschritt: ${moduleProgress}%</span>
            </div>
            <div class="module-lessons">${lessonsHtml}</div>
          </article>
        `;
    })
    .join("");

  LA.elements.moduleList.innerHTML = html;
  LA.render.moduleListRendered = true;
};

// Patch-Pfad: aktualisiert Abschluss-Klasse, Badge-Text/Klasse und Sterne auf
// den bestehenden Karten, ohne das Listen-innerHTML neu aufzubauen. Spiegelt
// exakt die Markup-Logik des vollständigen Builds (gleiche Klassen/Texte).
LA.render._patchModuleCompletion = function () {
  // Lektions-Index je id bestimmen. Der Vollbuild nutzt lessonIndex aus
  // module.lessons.map((lesson, lessonIndex) => …) — also pro Modul ab 0.
  const indexById = {};
  LA.learningPath.forEach((module) => {
    module.lessons.forEach((lesson, lessonIndex) => {
      indexById[lesson.id] = lessonIndex;
    });
  });

  const cards = document.querySelectorAll("[data-lesson-id]");
  cards.forEach((card) => {
    const id = card.getAttribute("data-lesson-id");
    const done = LA.isCompleted(id);
    const active = id === LA.state.selectedLessonId;

    // Klassen exakt wie im Vollbuild: is-active + is-done.
    card.classList.toggle("is-active", active);
    card.classList.toggle("is-done", done);

    // Badge: <span class="badge[ done]">{✓ | index+1}</span>
    const badge = card.querySelector(".badge");
    if (badge) {
      badge.classList.toggle("done", done);
      badge.textContent = done ? "✓" : String(indexById[id] + 1);
    }

    // Sterne innerhalb des ersten <span> aktualisieren.
    // Vollbuild bettet renderLessonGameStars(lesson.id) als direktes Kind des
    // Titel-<span> ein (ein <span class="lesson-stars">…</span> oder "").
    const labelSpan = card.querySelector("span:not(.badge)");
    if (labelSpan) {
      const existingStars = labelSpan.querySelector(".lesson-stars");
      const starsHtml = LA.render.renderLessonGameStars(id);
      if (starsHtml) {
        const tmp = document.createElement("template");
        tmp.innerHTML = starsHtml.trim();
        const newNode = tmp.content.firstChild;
        if (existingStars) {
          existingStars.replaceWith(newNode);
        } else {
          labelSpan.appendChild(newNode);
        }
      } else if (existingStars) {
        existingStars.remove();
      }
    }
  });

  // Modulfortschritt pro Modul aktualisieren. Der Vollbuild bettet in jedes
  // <article class="module-card"> ein <div class="module-meta"> mit drei
  // <span>s ein; das dritte ist "Modulfortschritt: X%". Die Karten werden in
  // LA.learningPath-Reihenfolge ausgegeben, sodass die N-te .module-card zum
  // Modul LA.learningPath[N] gehört (die Karte trägt kein data-Attribut).
  const moduleCards = document.querySelectorAll(".module-card");
  moduleCards.forEach((card, moduleIndex) => {
    const module = LA.learningPath[moduleIndex];
    if (!module || !Array.isArray(module.lessons)) return;
    const meta = card.querySelector(".module-meta");
    if (!meta) return;
    const spans = meta.querySelectorAll("span");
    if (spans.length < 3) return;
    const total = module.lessons.length;
    const doneCount = total > 0
      ? module.lessons.filter((lesson) => LA.isCompleted(lesson.id)).length
      : 0;
    const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    spans[2].textContent = `Modulfortschritt: ${pct}%`;
  });
};

LA.render.renderLessonDetail = function () {
  const lesson = LA.lessonById.get(LA.state.selectedLessonId);
  if (!lesson) {
    LA.elements.lessonDetail.innerHTML = "<h2>Lektion nicht gefunden</h2>";
    return;
  }

  if (!LA.state.lessonStarted) {
    LA.elements.lessonDetail.innerHTML = `
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

  const module = LA.learningPath.find((entry) => entry.id === lesson.moduleId);
  const userAnswer = LA.state.progress.quizAnswers[lesson.id];
  const hasAnswer = typeof userAnswer === "number";
  const isCorrect = hasAnswer && userAnswer === lesson.quiz.answerIndex;
  const isTextQuiz = (lesson.quiz.inputType || "mc") === "text";
  const textChecked = LA.state.progress.quizTextChecked?.[lesson.id] === true;
  const quizAnswered = isTextQuiz ? textChecked : hasAnswer;
  const previousText =
    LA.getNeighborLesson(-1) !== null ? `<button id="prev-lesson" type="button" class="ghost">Vorherige Lektion</button>` : "";
  const hasNext = LA.getNeighborLesson(1) !== null;
  const quizButtonHtml = quizAnswered
    ? `<button id="next-quiz" type="button">${hasNext ? "Weiter" : "Abschließen"}</button>`
    : `<button id="check-quiz" type="button">Antwort prüfen</button>`;

  LA.elements.lessonDetail.innerHTML = `
      <h2 id="lesson-title">${LA.escapeHtml(lesson.title)}</h2>
      <p><strong>Modul:</strong> ${LA.escapeHtml(module?.title || "")}</p>
      <p><strong>Schwierigkeit:</strong> ${LA.escapeHtml(lesson.difficulty)} · <strong>Empfohlene Zeit:</strong> ${LA.escapeHtml(
      lesson.estimatedMinutes.toString()
    )} Minuten</p>

      <div class="lesson-actions">
        ${previousText}
      </div>

      <section class="lesson-section">
        <h3>Theorie kompakt</h3>
        ${lesson.theory.map((text) => `<p>${LA.escapeHtml(text)}</p>`).join("")}
      </section>

      ${LA.viz.renderVisualization(lesson)}

      <section class="lesson-section">
        <h3>Beispiel</h3>
        <p>${LA.escapeHtml(lesson.example)}</p>
      </section>

      <section class="lesson-section">
        <h3>Übungsaufgabe</h3>
        <p>${LA.escapeHtml(lesson.exercise)}</p>
        <p><strong>Tipp:</strong> ${LA.escapeHtml(lesson.hint)}</p>
        ${LA.render.renderModelSolution(lesson)}
      </section>

      <section class="lesson-section quiz">
        <h3>Mini-Quiz</h3>
        ${LA.render.renderQuiz(lesson, userAnswer, hasAnswer, isCorrect, quizButtonHtml)}
      </section>

      <details class="lesson-more">
        <summary>Mehr zu dieser Lektion — Quellen, FAQ &amp; Spielmodus</summary>
        ${LA.render.renderReferences(lesson)}
        ${LA.render.renderFAQBlock(lesson)}
        <section class="lesson-section lesson-game" id="lesson-game-section">
          <h3>Spielmodus</h3>
          ${LA.render.renderLessonGameSection(lesson)}
        </section>
      </details>
    `;
  LA.render.updateLessonFAQJsonLd(lesson);
  LA.render.renderMath(LA.elements.lessonDetail);
};

LA.render.renderReferences = function (lesson) {
  const refs = Array.isArray(lesson.references) && lesson.references.length > 0
    ? lesson.references
    : (Array.isArray(LEARNING_REFERENCES[lesson.id]) ? LEARNING_REFERENCES[lesson.id] : []);
  if (refs.length === 0) return "";
  const items = refs.map((ref) => {
    const url = LA.escapeHtml(ref.url || "");
    const label = LA.escapeHtml(ref.label || ref.url || "");
    const source = ref.source ? ` <small class="reference-source">${LA.escapeHtml(ref.source)}</small>` : "";
    return `<li><a href="${url}" target="_blank" rel="noopener noreferrer nofollow">${label}</a>${source}</li>`;
  }).join("");
  return `
      <section class="lesson-section lesson-references" aria-labelledby="references-title">
        <h3 id="references-title">Quellen &amp; weiterführende Links</h3>
        <ul class="reference-list">${items}</ul>
      </section>`;
};

LA.render.buildLessonFAQ = function (lesson) {
  const quiz = lesson.quiz;
  if (!quiz || !quiz.question) return null;
  let answer = "";
  if (quiz.inputType !== "text" && Array.isArray(quiz.options) && typeof quiz.answerIndex === "number" && quiz.options[quiz.answerIndex] != null) {
    answer = `Richtig ist: ${quiz.options[quiz.answerIndex]}. `;
  }
  if (quiz.explanation) answer += quiz.explanation;
  if (quiz.solution) answer += ` Lösungsweg: ${quiz.solution}`;
  return { question: quiz.question, answer: answer.trim() };
};

LA.render.renderFAQBlock = function (lesson) {
  const faq = LA.render.buildLessonFAQ(lesson);
  if (!faq) return "";
  return `
      <section class="lesson-section lesson-faq" aria-labelledby="faq-title">
        <h3 id="faq-title">Häufige Frage zu dieser Lektion</h3>
        <details class="faq-item">
          <summary>${LA.escapeHtml(faq.question)}</summary>
          <div class="faq-answer">${LA.escapeHtml(faq.answer)}</div>
        </details>
      </section>`;
};

LA.render.renderModelSolution = function (lesson) {
  if (!lesson.solution) return "";
  return `
      <details class="model-solution">
        <summary>Modelllösung anzeigen</summary>
        <div class="model-solution__body">${LA.escapeHtml(lesson.solution)}</div>
      </details>`;
};

LA.render.updateLessonFAQJsonLd = function (lesson) {
  const node = document.getElementById("dynamic-faq-jsonld");
  if (!node) return;
  const faq = LA.render.buildLessonFAQ(lesson);
  if (!faq) { node.textContent = "{}"; return; }
  const payload = {
    "@context": "https://schema.org",
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
  };
  node.textContent = JSON.stringify(payload);
};

LA.render.renderQuiz = function (lesson, userAnswer, hasAnswer, isCorrect, quizButtonHtml) {
  const quiz = lesson.quiz;
  const inputType = quiz.inputType || "mc";

  if (inputType === "text") {
    const textAnswer = LA.state.progress.quizTextAnswers?.[lesson.id];
    const hasTextAnswer = typeof textAnswer === "string" && textAnswer.length > 0;
    const textChecked = LA.state.progress.quizTextChecked?.[lesson.id] === true;
    let feedback = "";
    if (textChecked) {
      const accept = quiz.acceptAnswers || [quiz.correctAnswer];
      const isTextCorrect = accept.some((a) => LA.quiz.normalizeAnswer(textAnswer) === LA.quiz.normalizeAnswer(a));
      feedback = `<p class="quiz-feedback ${isTextCorrect ? "success" : "error"}">${
        isTextCorrect ? "Richtig! " : "Leider falsch. "
      }${LA.escapeHtml(quiz.explanation)}</p>`;
      if (!isTextCorrect && quiz.solution) {
        feedback += `<details class="quiz-solution"><summary>Lösungsweg anzeigen</summary><div class="quiz-solution__body">${LA.escapeHtml(quiz.solution)}</div></details>`;
      }
    }
    const textButton = textChecked
      ? quizButtonHtml
      : `<button id="check-quiz-text" type="button">Antwort prüfen</button>`;
    return `
        <p>${LA.escapeHtml(quiz.question)}</p>
        <input type="text" id="quiz-text-input" placeholder="${LA.escapeHtml(quiz.placeholder || "Deine Antwort...")}" value="${LA.escapeHtml(textAnswer || "")}" ${textChecked ? "disabled" : ""}>
        ${textButton}
        ${feedback}
      `;
  }

  return `
      <p>${LA.escapeHtml(quiz.question)}</p>
      ${quiz.options
        .map(
          (option, index) => `
            <label>
              <input type="radio" name="quiz-answer" value="${index}" ${userAnswer === index ? "checked" : ""}>
              ${LA.escapeHtml(option)}
            </label>
          `
        )
        .join("")}
      ${quizButtonHtml}
      <p class="quiz-feedback ${hasAnswer ? (isCorrect ? "success" : "error") : ""}">
        ${
          hasAnswer
            ? isCorrect
              ? "Richtig. " + LA.escapeHtml(quiz.explanation)
              : "Noch nicht korrekt. " + LA.escapeHtml(quiz.explanation)
            : "Noch keine Antwort abgegeben."
        }
      </p>
    `;
};

LA.render.renderProgressSummary = function () {
  const total = LA.allLessons.length;
  const completed = LA.allLessons.filter((lesson) => LA.isCompleted(lesson.id)).length;
  const completionRate = total > 0 ? completed / total : 0;
  const quizCorrectCount = LA.allLessons.reduce((count, lesson) => {
    const answer = LA.state.progress.quizAnswers[lesson.id];
    if (typeof answer === "number" && answer === lesson.quiz.answerIndex) {
      return count + 1;
    }
    return count;
  }, 0);
  const quizRate = total > 0 ? quizCorrectCount / total : 0;
  const mastery = Math.round((completionRate * 0.7 + quizRate * 0.3) * 100);
  const percent = Math.round(completionRate * 100);

  LA.elements.completedLessons.textContent = `${completed} / ${total}`;
  LA.elements.progressPercent.textContent = `${percent} %`;
  LA.elements.masteryScore.textContent = `${mastery} %`;
  LA.elements.progressBarFill.style.width = `${percent}%`;
  const bar = LA.elements.progressBarFill.closest(".progress-bar");
  if (bar) {
    bar.setAttribute("aria-valuenow", String(percent));
  }
};

LA.render.renderReviewBanner = function () {
  const queue = LA.state.progress.reviewQueue || [];
  if (queue.length === 0) {
    return;
  }
  const firstReviewId = queue[0];
  const lesson = LA.lessonById.get(firstReviewId);
  if (!lesson) {
    return;
  }
  const banner = document.createElement("div");
  banner.className = "review-banner";
  banner.innerHTML = `
      <p><strong>Wiederholung:</strong> Du hast ${queue.length} Lektion${queue.length > 1 ? "en" : ""} zum Wiederholen — z.B. <em>${LA.escapeHtml(lesson.title)}</em></p>
      <button id="review-go" type="button">Jetzt wiederholen</button>
    `;
  const content = document.querySelector(".content");
  if (content && content.firstChild) {
    content.insertBefore(banner, content.firstChild);
  }
};

LA.render.renderShareBanner = function () {
  if (!LA.state.shareModuleId) return;
  const module = LA.learningPath.find((entry) => entry.id === LA.state.shareModuleId);
  if (!module) {
    LA.state.shareModuleId = null;
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
      <p class="share-banner__text">Du hast <strong>${LA.escapeHtml(module.title)}</strong> abgeschlossen. Teile deinen Erfolg:</p>
      <p class="share-banner__quote" id="share-quote">${LA.escapeHtml(shareText)}</p>
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
};

LA.render.renderWarmup = function () {
  if (LA.state.warmup.finished) {
    LA.elements.warmupArea.innerHTML = LA.render.renderWarmupSummary();
    return;
  }

  const idx = LA.state.warmup.currentIndex;
  const q = LA.state.warmup.questions[idx];
  if (!q) {
    return;
  }
  const answered = LA.state.warmup.answers[idx];
  const hasAnswered = typeof answered === "number";
  const isCorrect = hasAnswered && answered === q.answerIndex;
  const total = LA.WARMUP_COUNT;
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
    }${LA.escapeHtml(q.explanation)}</p>`;
  }

  LA.elements.warmupArea.innerHTML = `
      <div class="warmup-progress">
        <span>Aufgabe ${idx + 1} von ${total}</span>
        <div class="progress-bar"><span style="width: ${progressPct}%"></span></div>
      </div>
      <div class="warmup-question">
        <p class="warmup-task">${LA.escapeHtml(q.question)}</p>
        <div class="warmup-options">
          ${q.options
            .map(
              (opt, i) => `
              <label class="${hasAnswered && i === q.answerIndex ? "is-correct" : ""}${hasAnswered && i === answered && i !== q.answerIndex ? "is-wrong" : ""}">
                <input type="radio" name="warmup-answer" value="${i}" ${answered === i ? "checked" : ""} ${hasAnswered ? "disabled" : ""}>
                ${LA.escapeHtml(opt)}
              </label>
            `
            )
            .join("")}
        </div>
        ${buttonHtml}
        ${feedbackHtml}
      </div>
    `;
  LA.render.renderMath(LA.elements.warmupArea);
};

LA.render.renderWarmupSummary = function () {
  const correct = LA.state.warmup.answers.filter((ans, i) => ans === LA.state.warmup.questions[i]?.answerIndex).length;
  const pct = Math.round((correct / LA.WARMUP_COUNT) * 100);
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
  const starHtml = [0, 1, 2].map((i) => i < stars ? "&#9733;" : "&#9734;").join(" ");
  return `
      <details class="warmup-done">
        <summary>
          <span class="warmup-done__badge">&#10003; Aufwärmen erledigt</span>
          <span class="warmup-stars" aria-label="${stars} von 3 Sternen">${starHtml}</span>
          <span class="warmup-done__score">${correct} / ${LA.WARMUP_COUNT} richtig</span>
        </summary>
        <div class="warmup-done__body">
          <p>Jetzt geht es mit der Linearen Algebra weiter.</p>
          <button id="warmup-start-lesson" type="button" class="warmup-continue">Zur ersten Lektion</button>
        </div>
      </details>
    `;
};

LA.render.renderLessonGameSection = function (lesson) {
  const game = LA.state.lessonGame;
  const isActive = game.lessonId === lesson.id && !game.finished && game.questions.length > 0;
  const isSummary = game.lessonId === lesson.id && game.finished;
  const best = LA.state.progress.lessonGames?.[lesson.id];

  if (isActive) {
    return LA.render.renderLessonGameActive(game);
  }
  if (isSummary) {
    return LA.render.renderLessonGameSummary(lesson, game, best);
  }
  const bestHtml = best && best.attempts > 0
    ? `<p class="game-best">Dein bestes Ergebnis: <strong>${best.bestPct}%</strong> ${starString(best.bestStars)} (in ${best.attempts} Versuch${best.attempts === 1 ? "" : "en"})</p>`
    : `<p class="game-best">Noch nicht gespielt — starte dein erstes Spiel!</p>`;
  return `
      <p class="game-intro">Spiele ${LA.LESSON_GAME_COUNT} zufällige Aufgaben zum Thema «${LA.escapeHtml(lesson.title)}» und sammle Sterne. Mindestens ${LA.LESSON_GAME_PASS_PCT}% richtig schließt die Lektion ab.</p>
      ${bestHtml}
      <button id="game-start" type="button" class="game-btn">Spiel starten</button>
    `;
};

LA.render.renderLessonGameActive = function (game) {
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
    }${LA.escapeHtml(q.explanation)}</p>`;
  }

  return `
      <div class="warmup-progress">
        <span>Aufgabe ${idx + 1} von ${total}</span>
        <div class="progress-bar"><span style="width: ${progressPct}%"></span></div>
      </div>
      <div class="warmup-question">
        <p class="warmup-task">${LA.escapeHtml(q.question)}</p>
        <div class="warmup-options">
          ${q.options
            .map(
              (opt, i) => `
              <label class="${hasAnswered && i === q.answerIndex ? "is-correct" : ""}${hasAnswered && i === answered && i !== q.answerIndex ? "is-wrong" : ""}">
                <input type="radio" name="game-answer" value="${i}" ${answered === i ? "checked" : ""} ${hasAnswered ? "disabled" : ""}>
                ${LA.escapeHtml(opt)}
              </label>
            `
            )
            .join("")}
        </div>
        ${buttonHtml}
        ${feedbackHtml}
      </div>
    `;
};

LA.render.renderLessonGameSummary = function (lesson, game, best) {
  const correct = game.answers.filter((ans, i) => ans === game.questions[i]?.answerIndex).length;
  const total = game.questions.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = LA.computeStars(pct);
  const passed = pct >= LA.LESSON_GAME_PASS_PCT;
  return `
      <div class="warmup-done">
        <div class="warmup-stars" aria-label="${stars} von 3 Sternen">${starString(stars)}</div>
        <p><strong>${passed ? "Geschafft!" : "Üben hilft!"}</strong> Du hast ${correct} von ${total} Aufgaben richtig (${pct}&nbsp;%).</p>
        ${passed ? `<p>Die Lektion «${LA.escapeHtml(lesson.title)}» gilt damit als erledigt.</p>` : `<p>Ab ${LA.LESSON_GAME_PASS_PCT}% gilt die Lektion als erledigt — versuch es noch einmal.</p>`}
        <div class="game-summary-actions">
          <button id="game-restart" type="button" class="game-btn">Nochmal spielen</button>
        </div>
      </div>
    `;
};

LA.render.renderCertificateBanner = function () {
  const stage = LA.progress.certificateStage();
  if (!stage) return;
  if (document.querySelector(".certificate-banner")) return;
  const content = document.querySelector(".content");
  if (!content) return;
  const isLa2 = stage === "la2";
  const headline = isLa2 ? "LA2-Zertifikat freigeschaltet!" : "LA1-Zertifikat freigeschaltet!";
  const text = isLa2
    ? `Du hast den gesamten Lernpfad (LA1 + LA2) abgeschlossen und ${LA.CERTIFICATE_MASTERY_THRESHOLD}% Mastery erreicht. Hol dir dein Abschluss-Zertifikat.`
    : `Du hast Lineare Algebra 1 (Modul 0–11) abgeschlossen und ${LA.CERTIFICATE_MASTERY_THRESHOLD}% Mastery erreicht. Hol dir dein LA1-Zertifikat — LA2 geht weiter.`;
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
};

LA.render.renderCertificateModal = function () {
  const existing = document.getElementById("certificate-modal");
  if (existing) existing.remove();
  const stage = LA.state.certificateOpen;
  if (!stage) return;

  const isLa2 = stage === "la2";
  const stageLessons = isLa2 ? LA.allLessons : LA.lessonsOfModules(LA.LA1_MODULE_IDS);
  const mastery = LA.progress.computeMasteryFor(stageLessons);
  const completed = stageLessons.filter((l) => LA.isCompleted(l.id)).length;
  const total = stageLessons.length;
  const name = LA.state.progress.certificate?.name || "";
  const date = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
  const nameHtml = name
    ? `<div class="cert-name">${LA.escapeHtml(name)}</div>`
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
};

LA.render.renderLessonGameStars = function (lessonId) {
  const best = LA.state.progress.lessonGames?.[lessonId];
  if (!best || best.bestStars <= 0) return "";
  return ` <span class="lesson-stars" aria-label="${best.bestStars} Sterne">${starString(best.bestStars)}</span>`;
};
