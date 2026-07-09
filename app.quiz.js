// app.quiz.js
// Quiz-Auswertung, Wiederholungsqueue, Lektions-Spiel und Aufgaben-Generatoren.
// Wird nach app.math.js / app.progress.js und vor app.js geladen.
(function () {
  "use strict";
  window.LA = window.LA || {};
  LA.quiz = LA.quiz || {};

  // ---- Antwort-Normalisierung ----

  LA.quiz.normalizeAnswer = function (str) {
    return String(str || "").trim().toLowerCase().replace(/\s+/g, " ").replace(",", ".");
  };

  // ---- Quiz-Auswertung ----

  LA.quiz.evaluateQuiz = function () {
    const state = LA.state;
    const lesson = LA.lessonById.get(state.selectedLessonId);
    if (!lesson) {
      return;
    }
    const selected = document.querySelector('input[name="quiz-answer"]:checked');
    if (!selected) {
      LA.showStatus("Bitte zuerst eine Antwort auswählen.", true);
      return;
    }
    const answer = Number(selected.value);
    state.progress.quizAnswers[lesson.id] = answer;
    if (answer === lesson.quiz.answerIndex) {
      LA.quiz.removeFromReviewQueue(lesson.id);
      LA.showStatus("Richtig! Stark.");
    } else {
      LA.quiz.addToReviewQueue(lesson.id);
      LA.showStatus("Nicht ganz. Erklärung beachten und erneut probieren.", true);
    }
    LA.progress.persistProgress();
    LA.renderFn();
    if (answer === lesson.quiz.answerIndex) {
      LA.showStatus("Richtig! Stark.");
    } else {
      LA.showStatus("Nicht ganz. Erklärung beachten und erneut probieren.", true);
    }
  };

  LA.quiz.evaluateTextQuiz = function () {
    const state = LA.state;
    const lesson = LA.lessonById.get(state.selectedLessonId);
    if (!lesson || !lesson.quiz || lesson.quiz.inputType !== "text") {
      return;
    }
    const input = document.getElementById("quiz-text-input");
    if (!input || !input.value.trim()) {
      LA.showStatus("Bitte zuerst eine Antwort eingeben.", true);
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
    const correct = accept.some((a) => LA.quiz.normalizeAnswer(input.value) === LA.quiz.normalizeAnswer(a));
    if (correct) {
      LA.quiz.removeFromReviewQueue(lesson.id);
      LA.showStatus("Richtig! Stark.");
    } else {
      LA.quiz.addToReviewQueue(lesson.id);
      LA.showStatus("Nicht ganz. Erklärung beachten und erneut probieren.", true);
    }
    LA.progress.persistProgress();
    LA.renderFn();
  };

  // ---- Wiederholungs-Queue ----

  LA.quiz.addToReviewQueue = function (lessonId) {
    const state = LA.state;
    if (!state.progress.reviewQueue) {
      state.progress.reviewQueue = [];
    }
    if (!state.progress.reviewQueue.includes(lessonId)) {
      state.progress.reviewQueue.push(lessonId);
    }
  };

  LA.quiz.removeFromReviewQueue = function (lessonId) {
    const state = LA.state;
    if (!state.progress.reviewQueue) {
      return;
    }
    state.progress.reviewQueue = state.progress.reviewQueue.filter((id) => id !== lessonId);
  };

  // ---- Weiter nach Quiz ----

  LA.quiz.advanceFromQuiz = function () {
    const state = LA.state;
    const lesson = LA.lessonById.get(state.selectedLessonId);
    if (lesson && !LA.isCompleted(lesson.id)) {
      state.progress.completedLessons[lesson.id] = true;
      LA.progress.persistProgress();
      LA.checkModuleCompletion(lesson.moduleId);
    }
    const next = LA.getNeighborLesson(1);
    if (next) {
      state.selectedLessonId = next.id;
      LA.renderFn();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      LA.renderFn();
      LA.showStatus("Glückwunsch! Du hast alle Lektionen abgeschlossen.");
    }
  };

  // ---- Warmup-Aufgaben-Generatoren ----

  LA.quiz.generateWarmupQuestions = function () {
    const questions = [];
    for (let i = 0; i < LA.WARMUP_COUNT; i++) {
      const level = i + 1;
      const type = LA.WARMUP_TYPES[i % LA.WARMUP_TYPES.length];
      questions.push(LA.quiz.generateQuestion(type, level));
    }
    return LA.shuffle(questions);
  };

  LA.quiz.generateQuestion = function (type, level) {
    switch (type) {
      case "simplify":
        return LA.quiz.genSimplify(level);
      case "equation":
        return LA.quiz.genEquation(level);
      case "fraction":
        return LA.quiz.genFraction(level);
      case "decimal":
        return LA.quiz.genDecimal(level);
      default:
        return LA.quiz.genSimplify(level);
    }
  };

  LA.quiz.genSimplify = function (level) {
    const randInt = LA.randInt;
    const a = randInt(1, 3 + level);
    const b = randInt(1, 3 + level);
    const c = randInt(1, 5 + level * 2);
    const sign = level <= 3 ? "+" : LA.pick(["+", "-"]);
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
    const options = LA.shuffle([answer, wrong1, wrong2, wrong3]);
    return {
      type: "simplify",
      question: `Vereinfache den Term: ${expr}`,
      options: options,
      answerIndex: options.indexOf(answer),
      correctAnswer: answer,
      explanation: `Fasse die x-Glieder zusammen: ${a}x ${sign} ${b}x = ${answer.split(" ")[0]}. Die Zahl bleibt unverändert.`
    };
  };

  LA.quiz.genEquation = function (level) {
    const randInt = LA.randInt;
    const solution = randInt(1, 3 + level);
    const factor = randInt(2, 3 + Math.floor(level / 2));
    const addend = randInt(1, 5 + level);
    const result = factor * solution + addend;
    const question = `Löse die Gleichung: ${factor}x + ${addend} = ${result}`;
    const answer = `x = ${solution}`;
    const wrong1 = `x = ${solution + randInt(1, 3)}`;
    const wrong2 = `x = ${Math.max(1, solution - randInt(1, 3))}`;
    const wrong3 = `x = ${factor + addend}`;
    const options = LA.shuffle([answer, wrong1, wrong2, wrong3]);
    return {
      type: "equation",
      question: question,
      options: options,
      answerIndex: options.indexOf(answer),
      correctAnswer: answer,
      explanation: `Ziehe ${addend} ab: ${factor}x = ${result - addend}. Dann teile durch ${factor}: x = ${solution}.`
    };
  };

  LA.quiz.genFraction = function (level) {
    const randInt = LA.randInt;
    const pick = LA.pick;
    if (level <= 5) {
      const denom = pick([2, 3, 4, 5, 6]);
      const a = randInt(1, denom - 1);
      const b = randInt(1, denom - 1);
      const question = `Berechne: ${a}/${denom} + ${b}/${denom}`;
      const answer = `${a + b}/${denom}`;
      const wrong1 = `${a + b}/${denom * 2}`;
      const wrong2 = `${a * b}/${denom}`;
      const wrong3 = `${a + b + 1}/${denom}`;
      const options = LA.shuffle([answer, wrong1, wrong2, wrong3]);
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
      const lcm = (d1 * d2) / LA.math.gcd(d1, d2);
      const resultNum = n1 * (lcm / d1) + n2 * (lcm / d2);
      const question = `Berechne: ${n1}/${d1} + ${n2}/${d2}`;
      const answer = `${resultNum}/${lcm}`;
      const wrong1 = `${n1 + n2}/${d1 + d2}`;
      const wrong2 = `${resultNum + 1}/${lcm}`;
      const wrong3 = `${n1 + n2}/${lcm}`;
      const options = LA.shuffle([answer, wrong1, wrong2, wrong3]);
      return {
        type: "fraction",
        question: question,
        options: options,
        answerIndex: options.indexOf(answer),
        correctAnswer: answer,
        explanation: `Hauptnenner ist ${lcm}. Umgerechnet: ${n1 * (lcm / d1)}/${lcm} + ${n2 * (lcm / d2)}/${lcm} = ${resultNum}/${lcm}.`
      };
    }
  };

  LA.quiz.genDecimal = function (level) {
    const randInt = LA.randInt;
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
    const options = LA.shuffle([gen.a, ...gen.wrongs]);
    return {
      type: "decimal",
      question: gen.q,
      options: options,
      answerIndex: options.indexOf(gen.a),
      correctAnswer: gen.a,
      explanation: gen.exp
    };
  };

  // ---- MC-Helfer ----

  LA.quiz.mcq = function (question, answer, wrongs, explanation) {
    const set = [answer];
    for (const w of wrongs) {
      if (w !== answer && !set.includes(w)) set.push(w);
    }
    const opts = LA.shuffle(set);
    return {
      question: question,
      options: opts,
      answerIndex: opts.indexOf(answer),
      correctAnswer: answer,
      explanation: explanation
    };
  };

  // ---- Lektions-Spiel-Generatoren ----

  LA.quiz.genComplex = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
    const subtype = randInt(0, 4);
    if (subtype === 0) {
      const a = randInt(-9, 9);
      const b = randInt(-9, 9);
      return mcq(
        `Was ist der Realteil von $z = ${LA.math.fmtComplex(a, b)}$?`,
        String(a),
        [String(a + randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1)), String(b), String(a - 1)],
        `Der Realteil ist die Zahl ohne $i$: also ${a}.`
      );
    }
    if (subtype === 1) {
      const a = randInt(-9, 9);
      const b = randInt(-9, 9);
      return mcq(
        `Was ist der Imaginärteil von $z = ${LA.math.fmtComplex(a, b)}$?`,
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
        `Berechne $(${LA.math.fmtComplex(a, b)}) + (${LA.math.fmtComplex(c, d)})$.`,
        LA.math.fmtComplex(re, im),
        [LA.math.fmtComplex(a + d, b + c), LA.math.fmtComplex(re + 1, im), LA.math.fmtComplex(re, im + 1)],
        `Realteile und Imaginärteile einzeln addieren: ${a}+${c}=${re}, ${b}+${d}=${im}.`
      );
    }
    if (subtype === 3) {
      const a = randInt(-3, 3), b = randInt(-3, 3);
      const c = randInt(-3, 3), d = randInt(-3, 3);
      const re = a * c - b * d, im = a * d + b * c;
      return mcq(
        `Berechne $(${LA.math.fmtComplex(a, b)}) \\cdot (${LA.math.fmtComplex(c, d)})$.`,
        LA.math.fmtComplex(re, im),
        [LA.math.fmtComplex(a * c + b * d, a * d - b * c), LA.math.fmtComplex(re + 1, im), LA.math.fmtComplex(re, im + 1)],
        `Ausmultiplizieren mit $i^2 = -1$: Real ${a}·${c}-${b}·${d}=${re}, Imag ${a}·${d}+${b}·${c}=${im}.`
      );
    }
    const a = randInt(-6, 6), b = randInt(-6, 6);
    return mcq(
      `Wie lautet die konjugiert komplexe Zahl zu $z = ${LA.math.fmtComplex(a, b)}$?`,
      LA.math.fmtComplex(a, -b),
      [LA.math.fmtComplex(-a, b), LA.math.fmtComplex(-a, -b), LA.math.fmtComplex(a + 1, b)],
      `Konjugiert bedeutet: das Vorzeichen des Imaginärteils umdrehen.`
    );
  };

  LA.quiz.genBasics = function () {
    const gen = LA.pick([LA.quiz.genSimplify, LA.quiz.genEquation, LA.quiz.genFraction, LA.quiz.genDecimal]);
    return gen(LA.randInt(1, 9));
  };

  LA.quiz.genVectors = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
    const pick = LA.pick;
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
    return mcq(
      `Ist $(${a}, ${b}) + (${c}, ${d})$ gleich $(${a + c}, ${b + d})$?`,
      "Ja, Komponenten werden einzeln addiert.",
      ["Nein, man muss die Vektoren multiplizieren", "Nur wenn beide Vektoren gleich lang sind", "Nur wenn alle Zahlen positiv sind"],
      `Vektoraddition: komponentenweise. Hier: (${a + c}, ${b + d}).`
    );
  };

  LA.quiz.genMatrices = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
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
  };

  LA.quiz.genLGS = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
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
        "Welche Operation ist beim Gauß-Verfahren NICHT erlaubt?",
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
  };

  LA.quiz.genDeterminant = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
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
  };

  LA.quiz.genVectorSpace = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
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
      ["Die Vektoren ändert sich", "Der Raum wird kleiner", "Gar nichts, auch Koordinaten nicht"],
        "Der Vektor bleibt, nur seine Beschreibung durch Koordinaten ändert sich."
    );
  };

  LA.quiz.genLinearMap = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
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
  };

  LA.quiz.genEigen = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
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
  };

  LA.quiz.genDot = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
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
  };

  LA.quiz.genSVD = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
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
  };

  LA.quiz.genExam = function () {
    const randInt = LA.randInt;
    const mcq = LA.quiz.mcq;
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
  };

  // ---- Lektions-Spiel ----

  LA.quiz.LESSON_GAME_GENERATORS = {
    "mod-0": LA.quiz.genComplex,
    "mod-1": LA.quiz.genBasics,
    "mod-2": LA.quiz.genVectors,
    "mod-3": LA.quiz.genMatrices,
    "mod-4": LA.quiz.genLGS,
    "mod-5": LA.quiz.genDeterminant,
    "mod-6": LA.quiz.genVectorSpace,
    "mod-7": LA.quiz.genLinearMap,
    "mod-8": LA.quiz.genEigen,
    "mod-9": LA.quiz.genDot,
    "mod-10": LA.quiz.genSVD,
    "mod-11": LA.quiz.genExam
  };

  LA.quiz.generateLessonGameQuestions = function (moduleId) {
    const gen = LA.quiz.LESSON_GAME_GENERATORS[moduleId] || LA.quiz.genBasics;
    const questions = [];
    const seen = new Set();
    let guard = 0;
    while (questions.length < LA.LESSON_GAME_COUNT && guard < 80) {
      guard++;
      const q = gen();
      if (!q || seen.has(q.question)) continue;
      seen.add(q.question);
      questions.push(q);
    }
    return questions;
  };

  LA.quiz.advanceLessonGame = function () {
    const game = LA.state.lessonGame;
    const idx = game.currentIndex;
    if (idx >= game.questions.length - 1) {
      // finishLessonGame bleibt in app.js (greift auf Core-Render/State).
      LA.finishLessonGame();
    } else {
      game.currentIndex++;
      LA.renderFn();
    }
  };
})();
