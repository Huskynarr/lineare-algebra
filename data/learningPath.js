window.LEARNING_PATH = Object.freeze([
  {
    id: "mod-0",
    title: "Start: Rechnen & Terme auffrischen",
    level: "Einsteiger",
    targetHours: 8,
    goals: [
      "Sicher mit Vorzeichen, Brüchen und Dezimalzahlen rechnen",
      "Terme zusammenfassen und Klammern auflösen",
      "Binomische Formeln anwenden"
    ],
    lessons: [
      {
        id: "m0-l1",
        title: "Zahlen und Vorzeichen",
        difficulty: "Einsteiger",
        estimatedMinutes: 35,
        theory: [
          "Wir rechnen mit ganzen Zahlen, Brüchen und Dezimalzahlen. Wichtig sind die Vorzeichen: eine negative Zahl hat ein Minus davor, zum Beispiel $-3$.",
          "Beim Addieren gilt: gleichnamige Vorzeichen werden addiert, unterschiedliche voneinander abgezogen. $(-5)+(-3)=-8$, aber $(-5)+3=-2$.",
          "Beim Multiplizieren gilt die Vorzeichenregel: minus mal minus gibt plus. $(-4)\\cdot(-3)=12$, dagegen $(-4)\\cdot 3=-12$.",
          "Der Betrag $|a|$ macht jede Zahl positiv: $|-7|=7$ und $|7|=7$."
        ],
        example: "$(-2)+5-(-3)=-2+5+3=6$. Schritt für Schritt: erst $-2+5=3$, dann $3-(-3)=3+3=6$.",
        exercise: "Berechne $(-7)\\cdot(-2)+(-3)$.",
        hint: "Erst multiplizieren (minus mal minus gibt plus), dann addieren.",
        solution: "Schritt 1 — Multiplikation: $(-7)\\cdot(-2)=14$.\nSchritt 2 — Addition: $14+(-3)=11$.\nErgebnis: $11$.",
        visualization: {
          type: "number-line",
          start: -2,
          delta: 5
        },
        quiz: {
          question: "Was ergibt $(-6)\\cdot(-4)$?",
          options: ["$-24$", "$24$", "$-10$", "$10$"],
          answerIndex: 1,
          explanation: "Minus mal minus gibt plus: $(-6)\\cdot(-4)=24$."
        }
      },
      {
        id: "m0-l2",
        title: "Brüche und Dezimalzahlen",
        difficulty: "Einsteiger",
        estimatedMinutes: 45,
        theory: [
          "Ein Bruch $\\tfrac{a}{b}$ besteht aus Zähler $a$ und Nenner $b$. Erweitern heißt Zähler und Nenner mit derselben Zahl multiplizieren, Kürzen heißt durch dieselbe Zahl teilen.",
          "Brüche werden addiert, indem man sie auf einen gemeinsamen Nenner bringt: $\\tfrac{1}{2}+\\tfrac{1}{3}=\\tfrac{3}{6}+\\tfrac{2}{6}=\\tfrac{5}{6}$.",
          "Multipliziert wird Zähler mal Zähler, Nenner mal Nenner: $\\tfrac{2}{3}\\cdot\\tfrac{4}{5}=\\tfrac{8}{15}$. Division durch einen Bruch ist Multiplikation mit dem Kehrwert: $\\tfrac{a}{b}:\\tfrac{c}{d}=\\tfrac{a}{b}\\cdot\\tfrac{d}{c}$.",
          "Eine Dezimalzahl wie $0{,}75$ ist derselbe Wert wie der Bruch $\\tfrac{3}{4}$. Periodische Dezimalzahlen (z. B. $0{,}\\overline{3}=\\tfrac{1}{3}$) entsprechen stets einem Bruch."
        ],
        example: "$\\tfrac{2}{5}+\\tfrac{1}{4}=\\tfrac{8}{20}+\\tfrac{5}{20}=\\tfrac{13}{20}$. Gemeinsamer Nenner ist $20$, da $20=5\\cdot 4$.",
        exercise: "Berechne $\\tfrac{3}{4}\\cdot\\tfrac{2}{9}$ und kürze das Ergebnis.",
        hint: "Zähler mal Zähler, Nenner mal Nenner, dann kürzen: $\\tfrac{6}{36}$.",
        solution: "$\\tfrac{3}{4}\\cdot\\tfrac{2}{9}=\\tfrac{3\\cdot 2}{4\\cdot 9}=\\tfrac{6}{36}=\\tfrac{1}{6}$.\nProbe: $\\tfrac{1}{6}\\approx 0{,}1\\overline{6}$ und $\\tfrac{3}{4}\\cdot\\tfrac{2}{9}=0{,}75\\cdot 0{,}\\overline{2}\\approx 0{,}1\\overline{6}$.",
        quiz: {
          question: "Wie teilt man $\\tfrac{2}{3}$ durch $\\tfrac{4}{5}$?",
          options: ["$\\tfrac{8}{15}$", "$\\tfrac{5}{6}$", "$\\tfrac{2}{5}$", "$\\tfrac{4}{3}$"],
          answerIndex: 1,
          explanation: "Division durch einen Bruch ist Multiplikation mit dem Kehrwert: $\\tfrac{2}{3}\\cdot\\tfrac{5}{4}=\\tfrac{10}{12}=\\tfrac{5}{6}$."
        }
      },
      {
        id: "m0-l3",
        title: "Terme, Klammern und binomische Formeln",
        difficulty: "Einsteiger",
        estimatedMinutes: 50,
        theory: [
          "Ein Term ist ein Rechenausdruck mit Variablen, z. B. $3x+2$. Gleichartige Terme fasst man zusammen: $5x+3x=8x$, aber $5x+3$ lässt sich nicht weiter zusammenfassen.",
          "Eine Klammer wird ausmultipliziert: $a(b+c)=ab+ac$. Bei $-(b+c)$ dreht sich jedes Vorzeichen um: $-(b+c)=-b-c$.",
          "Die drei binomischen Formeln lauten: $(a+b)^2=a^2+2ab+b^2$, $(a-b)^2=a^2-2ab+b^2$ und $(a+b)(a-b)=a^2-b^2$.",
          "Die dritte Formel ist besonders nützlich, weil sie ein Produkt aus Summe und Differenz zu einer Differenz der Quadrate macht."
        ],
        example: "$(x+3)(x-3)=x^2-9$ mit der dritten binomischen Formel. Geht auch ohne schrittweises Ausmultiplizieren.",
        exercise: "Vereinfache $(2x+1)^2-(2x-1)(2x+1)$.",
        hint: "Erste Klammer: erste binomische Formel. Zweite Klammer: dritte binomische Formel. Dann abziehen.",
        solution: "Schritt 1 — $(2x+1)^2=4x^2+4x+1$ (erste binomische Formel).\nSchritt 2 — $(2x-1)(2x+1)=(2x)^2-1^2=4x^2-1$ (dritte binomische Formel).\nSchritt 3 — abziehen: $(4x^2+4x+1)-(4x^2-1)=4x^2+4x+1-4x^2+1=4x+2$.",
        quiz: {
          question: "Welche binomische Formel steckt in $(a+b)(a-b)$?",
          options: ["$(a+b)^2$", "$(a-b)^2$", "Dritte binomische Formel: $a^2-b^2$", "Gar keine"],
          answerIndex: 2,
          explanation: "Das ist die dritte binomische Formel: Summe mal Differenz ergibt die Differenz der Quadrate, $a^2-b^2$."
        }
      }
    ]
  },
  {
    id: "mod-1",
    title: "Gleichungen, Mengen und Beweise",
    level: "Einsteiger",
    targetHours: 10,
    goals: [
      "Lineare und quadratische Gleichungen lösen",
      "Mengen, Abbildungen und logische Quantoren verstehen",
      "Beweise per Summenzeichen und vollständiger Induktion führen"
    ],
    lessons: [
      {
        id: "m1-l1",
        title: "Gleichungen lösen",
        difficulty: "Einsteiger",
        estimatedMinutes: 45,
        theory: [
          "Eine lineare Gleichung hat die Form $ax+b=0$. Man isoliert $x$: $ax+b=0\\Rightarrow ax=-b\\Rightarrow x=-\\tfrac{b}{a}$ (für $a\\neq 0$).",
          "Eine quadratische Gleichung $x^2+px+q=0$ löst man mit der pq-Formel: $x_{1,2}=-\\tfrac{p}{2}\\pm\\sqrt{\\tfrac{p^2}{4}-q}$. Die Zahl unter der Wurzel heißt Diskriminante; ist sie negativ, gibt es keine reelle Lösung.",
          "Allgemeiner: $ax^2+bx+c=0$ mit $x_{1,2}=\\tfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$ für $a\\neq 0$.",
          "Wichtig: jede Umformung muss auf beiden Seiten gleichzeitig erfolgen. Eine Gleichung bleibt wahr, wenn man beide Seiten mit derselben Zahl addiert, subtrahiert, multipliziert oder durch dieselbe von null verschiedene Zahl teilt."
        ],
        example: "$x^2-5x+6=0$. Mit $p=-5$, $q=6$: $x_{1,2}=\\tfrac{5}{2}\\pm\\sqrt{\\tfrac{25}{4}-6}=\\tfrac{5}{2}\\pm\\sqrt{\\tfrac{1}{4}}=\\tfrac{5}{2}\\pm\\tfrac{1}{2}$, also $x_1=3$, $x_2=2$.",
        exercise: "Löse $2x^2-4x+2=0$.",
        hint: "Erst durch $2$ teilen, dann pq-Formel anwenden.",
        solution: "Durch $2$ teilen: $x^2-2x+1=0$, also $p=-2$, $q=1$.\n$x_{1,2}=1\\pm\\sqrt{1-1}=1\\pm 0=1$.\nEs gibt genau eine (doppelte) Lösung: $x=1$.",
        quiz: {
          question: "Was bedeutet eine negative Diskriminante bei einer quadratischen Gleichung mit reellen Koeffizienten?",
          options: ["Zwei reelle Lösungen", "Genau eine Lösung", "Keine reelle Lösung", "Unendlich viele Lösungen"],
          answerIndex: 2,
          explanation: "Ist die Diskriminante negativ, wird die Wurzel imaginär — es gibt keine reelle Lösung."
        }
      },
      {
        id: "m1-l2",
        title: "Mengen, Abbildungen und Logik",
        difficulty: "Einsteiger",
        estimatedMinutes: 50,
        theory: [
          "Eine Menge ist eine Zusammenfassung von Elementen, geschrieben als $\{a,b,c\}$. Die leere Menge heißt $\\emptyset$. Die Notation $x\\in M$ bedeutet „$x$ ist Element von $M$“.",
          "Eine Abbildung (Funktion) $f:A\\to B$ ordnet jedem Element von $A$ (Definitionsbereich) genau ein Element von $B$ (Zielbereich) zu. Sie heißt injektiv, wenn verschiedene Elemente verschiedene Bilder haben, surjektiv, wenn das Ziel ganz getroffen wird, und bijektiv, wenn beides gilt.",
          "In der Mathematik formuliert man Aussagen mit Quantoren: $\\forall$ (für alle) und $\\exists$ (es existiert). „Für alle $x$ existiert ein $y$“ heißt $\\forall x\\;\\exists y$.",
          "Der Beweis durch Kontraposition nutzt: die Aussage „Aus $A$ folgt $B$“ ist äquivalent zu „Aus $\\neg B$ folgt $\\neg A$“."
        ],
        example: "$f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=x^2$ ist nicht injektiv (denn $f(2)=f(-2)=4$) und nicht surjektiv (negativen Zahlen werden nie getroffen). Dagegen ist $g:\\mathbb{R}\\to[0,\\infty)$, $g(x)=x^2$ surjektiv.",
        exercise: "Ist $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=2x+1$ bijektiv? Begründe.",
        hint: "Prüfe Injektivität (verschiedene Eingaben $\\Rightarrow$ verschiedene Ausgaben) und Surjektivität (kann man jedes $y$ erreichen?).",
        solution: "Injektiv: $2x_1+1=2x_2+1\\Rightarrow 2x_1=2x_2\\Rightarrow x_1=x_2$. Also injektiv.\nSurjektiv: Zu jedem $y\\in\\mathbb{R}$ wähle $x=\\tfrac{y-1}{2}$, dann $f(x)=y$. Also surjektiv.\nDa $f$ injektiv und surjektiv ist, ist $f$ bijektiv.",
        quiz: {
          question: "Wann heißt eine Abbildung $f:A\\to B$ bijektiv?",
          options: ["Wenn sie injektiv oder surjektiv ist", "Wenn sie injektiv und surjektiv ist", "Wenn $A=B$ ist", "Wenn sie linear ist"],
          answerIndex: 1,
          explanation: "Bijektiv bedeutet injektiv (verschiedene Elemente haben verschiedene Bilder) und surjektiv (das Ziel wird vollständig getroffen) zugleich."
        }
      },
      {
        id: "m1-l3",
        title: "Summenzeichen und vollständige Induktion",
        difficulty: "Einsteiger",
        estimatedMinutes: 55,
        theory: [
          "Das Summenzeichen fasst eine Summe zusammen: $\\sum_{i=1}^{n} a_i=a_1+a_2+\\dots+a_n$. Der Index $i$ läuft von $1$ bis $n$.",
          "Ein wichtiger Spezialfall ist die Gaußsche Summe: $\\sum_{i=1}^{n} i=\\tfrac{n(n+1)}{2}$, also $1+2+\\dots+n$.",
          "Die vollständige Induktion beweist eine Aussage $A(n)$ für alle $n\\geq n_0$ in zwei Schritten: Induktionsanfang (IA) zeige $A(n_0)$, Induktionsschluss (IS) zeige: gilt $A(n)$, so gilt auch $A(n+1)$.",
          "Die Annahme „$A(n)$ gilt“ heißt Induktionsvoraussetzung (IV). Im Schluss nutzt man IV, um von $n$ auf $n+1$ zu kommen."
        ],
        example: "Gaußsche Summe für $n=4$: $\\sum_{i=1}^{4} i=1+2+3+4=10=\\tfrac{4\\cdot 5}{2}=10$.",
        exercise: "Zeige per Induktion: $\\sum_{i=1}^{n} i=\\tfrac{n(n+1)}{2}$ für alle $n\\geq 1$.",
        hint: "IA: $n=1$. IS: schreibe $\\sum_{i=1}^{n+1} i = \\sum_{i=1}^{n} i + (n+1)$ und nutze die IV.",
        solution: "Induktionsanfang ($n=1$): $\\sum_{i=1}^{1} i=1=\\tfrac{1\\cdot 2}{2}=1$. ✓\nInduktionsvoraussetzung: es gelte $\\sum_{i=1}^{n} i=\\tfrac{n(n+1)}{2}$.\nInduktionsschluss ($n\\to n+1$):\n$\\sum_{i=1}^{n+1} i = \\sum_{i=1}^{n} i + (n+1) = \\tfrac{n(n+1)}{2} + (n+1) = \\tfrac{n(n+1)+2(n+1)}{2} = \\tfrac{(n+1)(n+2)}{2}$.\nDas ist genau die Formel mit $n+1$ statt $n$. Also gilt die Aussage für alle $n\\geq 1$.",
        quiz: {
          question: "Was ist die Induktionsvoraussetzung (IV)?",
          options: ["Die Aussage für $n=1$", "Die Annahme, dass $A(n)$ gilt, um $A(n+1)$ zu zeigen", "Das Resultat am Ende", "Die zu beweisende Formel"],
          answerIndex: 1,
          explanation: "Die IV ist die Annahme, dass die Aussage für ein festes $n$ schon gilt; mit ihr zeigt man den Schritt auf $n+1$."
        }
      }
    ]
  },
  {
    id: "mod-2",
    title: "Komplexe Zahlen",
    level: "Einsteiger → Aufbau",
    targetHours: 9,
    goals: [
      "Komplexe Zahlen definieren und in der Gaußschen Ebene darstellen",
      "Mit komplexen Zahlen rechnen",
      "Polarkoordinaten und den Fundamentalsatz der Algebra kennen"
    ],
    lessons: [
      {
        id: "m2-l1",
        title: "Die imaginäre Einheit",
        difficulty: "Einsteiger",
        estimatedMinutes: 40,
        theory: [
          "Manche Gleichungen haben keine reelle Lösung, z. B. $x^2=-1$, da Quadrate reeller Zahlen nie negativ sind.",
          "Deshalb erweitert man die reellen Zahlen um die imaginäre Einheit $i$ mit der Eigenschaft $i^2=-1$.",
          "Eine komplexe Zahl hat die Form $z=a+bi$ mit $a,b\\in\\mathbb{R}$. Dabei heißt $a=\\operatorname{Re}(z)$ der Realteil und $b=\\operatorname{Im}(z)$ der Imaginärteil.",
          "Die Menge aller komplexen Zahlen heißt $\\mathbb{C}$. In der Gaußschen Ebene wird $z=a+bi$ als Punkt $(a,b)$ dargestellt: die $x$-Achse ist der Realteil, die $y$-Achse der Imaginärteil."
        ],
        example: "$z=3+4i$ hat Realteil $3$ und Imaginärteil $4$ und liegt in der Gaußschen Ebene bei $(3,4)$.",
        exercise: "Bestimme Real- und Imaginärteil von $z=5-2i$.",
        hint: "Realteil ist die Zahl ohne $i$, Imaginärteil die Zahl vor dem $i$ (mit Vorzeichen).",
        solution: "$z=5-2i=5+(-2)i$, also $a=5$, $b=-2$.\nRealteil: $\\operatorname{Re}(z)=5$.\nImaginärteil: $\\operatorname{Im}(z)=-2$.",
        quiz: {
          inputType: "text",
          question: "Was ist der Imaginärteil von $z=7-3i$?",
          correctAnswer: "-3",
          acceptAnswers: ["-3", "-3i"],
          placeholder: "Zahl eingeben…",
          explanation: "Der Imaginärteil ist die Zahl vor dem $i$, also $-3$.",
          solution: "Bei $z=a+bi$ ist $b$ der Imaginärteil. Hier ist $b=-3$."
        }
      },
      {
        id: "m2-l2",
        title: "Rechnen mit komplexen Zahlen",
        difficulty: "Aufbau",
        estimatedMinutes: 50,
        theory: [
          "Addition und Subtraktion erfolgen komponentenweise: $(a+bi)\\pm(c+di)=(a\\pm c)+(b\\pm d)i$.",
          "Multiplikation: Klammern ausmultiplizieren und $i^2=-1$ verwenden. $(a+bi)(c+di)=(ac-bd)+(ad+bc)i$.",
          "Die konjugiert komplexe Zahl zu $z=a+bi$ ist $\\bar z=a-bi$. Es gilt $z\\bar z=a^2+b^2\\in\\mathbb{R}$.",
          "Division: den Bruch mit $\\bar z$ erweitern, damit der Nenner reell wird: $\\tfrac{w}{z}=\\tfrac{w\\bar z}{z\\bar z}$."
        ],
        example: "$(2+3i)(1-i)=2-2i+3i-3i^2=2+i+3=5+i$. Der Realteil entsteht aus $2-3i^2=2+3=5$.",
        exercise: "Berechne $(1+2i)(3-i)$.",
        hint: "Klammern ausmultiplizieren und $i^2=-1$ einsetzen.",
        solution: "$(1+2i)(3-i)=1\\cdot 3+1\\cdot(-i)+2i\\cdot 3+2i\\cdot(-i)=3-i+6i-2i^2$.\nMit $i^2=-1$: $3+5i+2=5+5i$.",
        quiz: {
          inputType: "text",
          question: "Berechne $(1+2i)(3-i)$ in der Form $a+bi$.",
          correctAnswer: "5 + 5i",
          acceptAnswers: ["5+5i", "5 + 5i"],
          placeholder: "z. B. 3 + 4i",
          explanation: "Ausmultiplizieren ergibt $3-i+6i-2i^2=3+5i+2=5+5i$.",
          solution: "Klammern ausmultiplizieren: $3-i+6i-2i^2$. Mit $i^2=-1$ wird $-2i^2=+2$. Also $3+2+5i=5+5i$."
        }
      },
      {
        id: "m2-l3",
        title: "Polardarstellung und Fundamentalsatz",
        difficulty: "Aufbau",
        estimatedMinutes: 55,
        theory: [
          "Statt Koordinaten $(a,b)$ kann man $z$ durch Betrag $r=|z|=\\sqrt{a^2+b^2}$ und Winkel $\\varphi$ beschreiben: $z=r(\\cos\\varphi+i\\sin\\varphi)$. Der Winkel $\\varphi$ heißt Argument.",
          "Dank der Eulerschen Formel $e^{i\\varphi}=\\cos\\varphi+i\\sin\\varphi$ schreibt man $z=r\\,e^{i\\varphi}$.",
          "In Polardarstellung wird Multiplikation einfach: $r_1 e^{i\\varphi_1}\\cdot r_2 e^{i\\varphi_2}=r_1 r_2\\,e^{i(\\varphi_1+\\varphi_2)}$ — Beträge multiplizieren, Argumente addieren.",
          "Der Fundamentalsatz der Algebra besagt: jedes nichtkonstante Polynom hat in $\\mathbb{C}$ eine Nullstelle. Damit zerfällt jedes Polynom vom Grad $n$ über $\\mathbb{C}$ in $n$ Linearfaktoren. Das ist der Grund, warum wir komplexe Zahlen für Eigenwerte brauchen."
        ],
        example: "Die Drehmatrix $\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$ hat das charakteristische Polynom $\\lambda^2+1$ mit Nullstellen $\\lambda=\\pm i$. Diese sind komplex, obwohl die Matrix reell ist.",
        exercise: "Gib $z=1+i$ in Polardarstellung $r\\,e^{i\\varphi}$ an (Betrags- und Winkelwert).",
        hint: "Betrag $r=\\sqrt{1^2+1^2}$, Winkel $\\varphi$ so, dass $\\cos\\varphi=\\tfrac{a}{r}$, $\\sin\\varphi=\\tfrac{b}{r}$.",
        solution: "Betrag: $r=\\sqrt{1^2+1^2}=\\sqrt{2}$.\nWinkel: $\\varphi=\\tfrac{\\pi}{4}$ (45°), denn $\\cos\\tfrac{\\pi}{4}=\\sin\\tfrac{\\pi}{4}=\\tfrac{1}{\\sqrt{2}}$.\nAlso $z=\\sqrt{2}\\,e^{i\\pi/4}$.",
        quiz: {
          question: "Was besagt der Fundamentalsatz der Algebra?",
          options: ["Jedes Polynom hat nur reelle Nullstellen", "Jedes nichtkonstante Polynom hat in $\\mathbb{C}$ eine Nullstelle", "Es gibt unendlich viele Primzahlen", "Jede Matrix ist diagonalisierbar"],
          answerIndex: 1,
          explanation: "Über $\\mathbb{C}$ hat jedes nichtkonstante Polynom mindestens eine Nullstelle, zerfällt also in Linearfaktoren."
        }
      }
    ]
  },
  {
    id: "mod-3",
    title: "Vektoren im R^n",
    level: "Einsteiger → Aufbau",
    targetHours: 10,
    goals: [
      "Vektoren als Pfeile und als Zahlentupel auffassen",
      "Addition und skalare Vielfache berechnen",
      "Linearkombinationen und den Spann verstehen"
    ],
    lessons: [
      {
        id: "m3-l1",
        title: "Was ist ein Vektor?",
        difficulty: "Einsteiger",
        estimatedMinutes: 40,
        theory: [
          "Ein Vektor hat eine Länge und eine Richtung. Man schreibt ihn als Spalte $\\vec v=\\begin{pmatrix}v_1\\\\v_2\\\\\\vdots\\\\v_n\\end{pmatrix}$; die Einträge $v_i$ heißen Komponenten.",
          "Im $\\mathbb{R}^2$ ist $\\vec v=\\begin{pmatrix}3\\\\2\\end{pmatrix}$ der Pfeil vom Ursprung zum Punkt $(3,2)$. Im $\\mathbb{R}^3$ kommt eine dritte Komponente hinzu.",
          "Der Nullvektor $\\vec 0$ hat nur Nullen als Komponenten. Vektoren vergleicht man komponentenweise: gleich heißt, alle Komponenten stimmen überein.",
          "Die Länge (Norm) ist $\\lVert\\vec v\\rVert=\\sqrt{v_1^2+\\dots+v_n^2}$, also der Satz des Pythagoras verallgemeinert."
        ],
        example: "Die Länge von $\\vec v=\\begin{pmatrix}3\\\\4\\end{pmatrix}$ ist $\\sqrt{3^2+4^2}=\\sqrt{25}=5$.",
        exercise: "Berechne die Länge von $\\vec v=\\begin{pmatrix}1\\\\2\\\\2\\end{pmatrix}$.",
        hint: "Quadrate addieren und die Wurzel ziehen: $\\sqrt{1^2+2^2+2^2}$.",
        solution: "$\\lVert\\vec v\\rVert=\\sqrt{1^2+2^2+2^2}=\\sqrt{1+4+4}=\\sqrt{9}=3$.",
        visualization: {
          type: "vector-plot",
          mode: "default",
          u: [3, 2]
        },
        quiz: {
          inputType: "text",
          question: "Wie lang ist $\\begin{pmatrix}6\\\\8\\end{pmatrix}$?",
          correctAnswer: "10",
          acceptAnswers: ["10"],
          placeholder: "Zahl eingeben…",
          explanation: "Die Länge ist $\\sqrt{6^2+8^2}=\\sqrt{36+64}=\\sqrt{100}=10$.",
          solution: "Quadrate addieren: $6^2+8^2=100$, also Länge $\\sqrt{100}=10$."
        }
      },
      {
        id: "m3-l2",
        title: "Addition und skalare Vielfache",
        difficulty: "Aufbau",
        estimatedMinutes: 45,
        theory: [
          "Vektoren werden komponentenweise addiert: $\\begin{pmatrix}a_1\\\\a_2\\end{pmatrix}+\\begin{pmatrix}b_1\\\\b_2\\end{pmatrix}=\\begin{pmatrix}a_1+b_1\\\\a_2+b_2\\end{pmatrix}$. Geometrisch: Pfeile aneinanderlegen.",
          "Ein skalares Vielfaches: $\\lambda\\vec v$ multipliziert jede Komponente mit $\\lambda$. Für $\\lambda>0$ bleibt die Richtung, für $\\lambda<0$ kehrt sie sich um; die Länge wird mit $|\\lambda|$ skaliert.",
          "Der Gegenvektor ist $-\\vec v=(-1)\\vec v$. Damit ist Subtraktion $\\vec a-\\vec b=\\vec a+(-\\vec b)$.",
          "Diese Operationen erfüllen vertraute Regeln: Kommutativität $\\vec a+\\vec b=\\vec b+\\vec a$, Distributivität $\\lambda(\\vec a+\\vec b)=\\lambda\\vec a+\\lambda\\vec b$."
        ],
        example: "$2\\begin{pmatrix}1\\\\3\\end{pmatrix}+\\begin{pmatrix}2\\\\-1\\end{pmatrix}=\\begin{pmatrix}2\\\\6\\end{pmatrix}+\\begin{pmatrix}2\\\\-1\\end{pmatrix}=\\begin{pmatrix}4\\\\5\\end{pmatrix}$.",
        exercise: "Berechne $3\\begin{pmatrix}1\\\\2\\end{pmatrix}-2\\begin{pmatrix}2\\\\1\\end{pmatrix}$.",
        hint: "Erst die skalaren Vielfachen, dann komponentenweise subtrahieren.",
        solution: "$3\\begin{pmatrix}1\\\\2\\end{pmatrix}=\\begin{pmatrix}3\\\\6\\end{pmatrix}$, $2\\begin{pmatrix}2\\\\1\\end{pmatrix}=\\begin{pmatrix}4\\\\2\\end{pmatrix}$.\nDifferenz: $\\begin{pmatrix}3\\\\6\\end{pmatrix}-\\begin{pmatrix}4\\\\2\\end{pmatrix}=\\begin{pmatrix}-1\\\\4\\end{pmatrix}$.",
        visualization: {
          type: "vector-plot",
          mode: "add",
          u: [1, 2],
          v: [2, 1]
        },
        quiz: {
          question: "Was bewirkt ein negatives skalares Vielfaches $\\lambda\\vec v$ mit $\\lambda<0$?",
          options: ["Nichts", "Der Vektor wird länger, Richtung bleibt", "Richtung kehrt sich um", "Vektor wird null"],
          answerIndex: 2,
          explanation: "Ein negativer Skalar dreht die Richtung um und skaliert die Länge mit $|\\lambda|$."
        }
      },
      {
        id: "m3-l3",
        title: "Linearkombination und Spann",
        difficulty: "Aufbau",
        estimatedMinutes: 55,
        theory: [
          "Eine Linearkombination von Vektoren $\\vec v_1,\\dots,\\vec v_k$ ist $\\lambda_1\\vec v_1+\\dots+\\lambda_k\\vec v_k$ mit Koeffizienten $\\lambda_i\\in\\mathbb{R}$.",
          "Der Spann (Erzeugendensystem) ist die Menge aller Linearkombinationen: $\\operatorname{span}(\\vec v_1,\\dots,\\vec v_k)=\{\\lambda_1\\vec v_1+\\dots+\\lambda_k\\vec v_k\}$.",
          "Im $\\mathbb{R}^2$ spannen zwei nichtparallele Vektoren die ganze Ebene auf; im $\\mathbb{R}^3$ spannen drei nicht in einer Ebene liegende Vektoren den ganzen Raum auf.",
          "Ist ein Vektor schon eine Linearkombination der anderen, liefert er nichts Neues — der Spann bleibt dann gleich."
        ],
        example: "Ist $\\begin{pmatrix}1\\\\2\\end{pmatrix}$ in $\\operatorname{span}\\!\\left(\\begin{pmatrix}1\\\\0\\end{pmatrix},\\begin{pmatrix}0\\\\1\\end{pmatrix}\\right)$? Ja: $\\begin{pmatrix}1\\\\2\\end{pmatrix}=1\\begin{pmatrix}1\\\\0\\end{pmatrix}+2\\begin{pmatrix}0\\\\1\\end{pmatrix}$.",
        exercise: "Lässt sich $\\begin{pmatrix}4\\\\6\\end{pmatrix}$ als Linearkombination von $\\vec v_1=\\begin{pmatrix}1\\\\1\\end{pmatrix}$ und $\\vec v_2=\\begin{pmatrix}1\\\\2\\end{pmatrix}$ schreiben? Bestimme die Koeffizienten.",
        hint: "Löse $\\lambda_1\\begin{pmatrix}1\\\\1\\end{pmatrix}+\\lambda_2\\begin{pmatrix}1\\\\2\\end{pmatrix}=\\begin{pmatrix}4\\\\6\\end{pmatrix}$, also $\\lambda_1+\\lambda_2=4$ und $\\lambda_1+2\\lambda_2=6$.",
        solution: "System: $\\lambda_1+\\lambda_2=4$, $\\lambda_1+2\\lambda_2=6$. Subtrahieren liefert $\\lambda_2=2$, dann $\\lambda_1=2$.\nProbe: $2\\begin{pmatrix}1\\\\1\\end{pmatrix}+2\\begin{pmatrix}1\\\\2\\end{pmatrix}=\\begin{pmatrix}2\\\\2\\end{pmatrix}+\\begin{pmatrix}2\\\\4\\end{pmatrix}=\\begin{pmatrix}4\\\\6\\end{pmatrix}$. ✓",
        visualization: {
          type: "vector-plot",
          mode: "linear-combination",
          u: [1, 1],
          v: [1, 2]
        },
        quiz: {
          question: "Was ist der Spann $\\operatorname{span}(\\vec v_1,\\dots,\\vec v_k)$?",
          options: ["Die Menge aller Vielfachen eines Vektors", "Die Menge aller Linearkombinationen der Vektoren", "Die Länge der Vektoren", "Der Schnitt der Vektoren"],
          answerIndex: 1,
          explanation: "Der Spann umfasst alle Linearkombinationen $\\lambda_1\\vec v_1+\\dots+\\lambda_k\\vec v_k$."
        }
      }
    ]
  },
  {
    id: "mod-4",
    title: "Matrizen",
    level: "Aufbau",
    targetHours: 11,
    goals: [
      "Matrizen als Tabellen anordnen",
      "Matrizen multiplizieren",
      "Die inverse Matrix und elementare Zeilenoperationen nutzen"
    ],
    lessons: [
      {
        id: "m4-l1",
        title: "Was ist eine Matrix?",
        difficulty: "Aufbau",
        estimatedMinutes: 40,
        theory: [
          "Eine Matrix ist ein rechteckiges Zahlenschema. Eine $m\\times n$-Matrix hat $m$ Zeilen und $n$ Spalten: $A=(a_{ij})$ mit Eintrag $a_{ij}$ in Zeile $i$, Spalte $j$.",
          "Ein Vektor $\\vec v\\in\\mathbb{R}^n$ ist eine $n\\times 1$-Matrix (Spaltenvektor); die Transponierte $\\vec v^{\\,T}$ ist ein Zeilenvektor.",
          "Die Transponierte $A^{\\,T}$ entsteht durch Spiegeln an der Hauptdiagonalen: $(A^{\\,T})_{ij}=a_{ji}$. Eine quadratische Matrix mit $A^{\\,T}=A$ heißt symmetrisch.",
          "Matrizen werden komponentenweise addiert; ein Skalar multipliziert jeden Eintrag."
        ],
        example: "Für $A=\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$ ist $A^{\\,T}=\\begin{pmatrix}1&3\\\\2&4\\end{pmatrix}$ und $2A=\\begin{pmatrix}2&4\\\\6&8\\end{pmatrix}$.",
        exercise: "Bestimme $A^{\\,T}$ für $A=\\begin{pmatrix}1&0&2\\\\3&1&4\\end{pmatrix}$.",
        hint: "Zeilen werden zu Spalten und umgekehrt; die Transponierte ist $3\\times 2$.",
        solution: "$A$ ist $2\\times 3$, also wird $A^{\\,T}$ eine $3\\times 2$-Matrix:\n$A^{\\,T}=\\begin{pmatrix}1&3\\\\0&1\\\\2&4\\end{pmatrix}$.",
        quiz: {
          question: "Was bedeutet $A^{\\,T}=A$ für eine quadratische Matrix?",
          options: ["Sie ist invertierbar", "Sie ist symmetrisch", "Sie ist die Nullmatrix", "Sie hat Determinante 1"],
          answerIndex: 1,
          explanation: "Eine Matrix mit $A^{\\,T}=A$ heißt symmetrisch — sie ist an der Hauptdiagonalen gespiegelt."
        }
      },
      {
        id: "m4-l2",
        title: "Matrizen multiplizieren",
        difficulty: "Aufbau",
        estimatedMinutes: 55,
        theory: [
          "Das Produkt $AB$ ist nur definiert, wenn die Spaltenzahl von $A$ gleich der Zeilenzahl von $B$ ist. Ist $A$ eine $m\\times n$- und $B$ eine $n\\times p$-Matrix, so ist $AB$ eine $m\\times p$-Matrix.",
          "Der Eintrag $(AB)_{ij}$ ist das Skalarprodukt der $i$-ten Zeile von $A$ mit der $j$-ten Spalte von $B$: $(AB)_{ij}=\\sum_k a_{ik}b_{kj}$.",
          "Die Matrizenmultiplikation ist assoziativ $(AB)C=A(BC)$ und distributiv, aber im Allgemeinen nicht kommutativ: $AB\\neq BA$.",
          "Die Einheitsmatrix $I_n$ hat Einsen auf der Diagonalen und Nullen sonst; sie ist neutral: $AI=IA=A$."
        ],
        example: "$\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}\\begin{pmatrix}5\\\\6\\end{pmatrix}=\\begin{pmatrix}1\\cdot 5+2\\cdot 6\\\\3\\cdot 5+4\\cdot 6\\end{pmatrix}=\\begin{pmatrix}17\\\\39\\end{pmatrix}$.",
        exercise: "Berechne $\\begin{pmatrix}1&2\\\\0&3\\end{pmatrix}\\begin{pmatrix}4&0\\\\1&2\\end{pmatrix}$.",
        hint: "Zeile mal Spalte: $(1,4)=(1\\cdot4+2\\cdot1)$, dann die weiteren Einträge.",
        solution: "Eintrag $(1,1)$: $1\\cdot4+2\\cdot1=6$.\n$(1,2)$: $1\\cdot0+2\\cdot2=4$.\n$(2,1)$: $0\\cdot4+3\\cdot1=3$.\n$(2,2)$: $0\\cdot0+3\\cdot2=6$.\nErgebnis: $\\begin{pmatrix}6&4\\\\3&6\\end{pmatrix}$.",
        visualization: {
          type: "matrix-transform",
          matrix: [[1, 0.5], [0, 1]]
        },
        quiz: {
          question: "Wann ist das Matrizenprodukt $AB$ definiert?",
          options: ["Wenn beide quadratisch sind", "Wenn Spaltenzahl von $A$ gleich Zeilenzahl von $B$", "Wenn $A=B$", "Immer"],
          answerIndex: 1,
          explanation: "$AB$ existiert genau dann, wenn die Anzahl der Spalten von $A$ mit der Anzahl der Zeilen von $B$ übereinstimmt."
        }
      },
      {
        id: "m4-l3",
        title: "Inverse Matrix und Zeilenoperationen",
        difficulty: "Aufbau",
        estimatedMinutes: 55,
        theory: [
          "Eine quadratische Matrix $A$ heißt invertierbar, wenn eine Matrix $A^{-1}$ existiert mit $AA^{-1}=A^{-1}A=I$. Sonst heißt $A$ singulär.",
          "Elementare Zeilenoperationen: (1) eine Zeile mit einem Skalar $\\neq 0$ multiplizieren, (2) ein Vielfaches einer Zeile zu einer anderen addieren, (3) zwei Zeilen vertauschen.",
          "Man invertiert $A$, indem man $(A\\mid I)$ durch Zeilenoperationen auf $(I\\mid A^{-1})$ bringt. Klappt das nicht, ist $A$ singulär.",
          "Für $2\\times2$-Matrizen gilt explizit: ist $A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ mit $\\det A=ad-bc\\neq 0$, so ist $A^{-1}=\\tfrac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$."
        ],
        example: "Zu $A=\\begin{pmatrix}1&2\\\\3&5\\end{pmatrix}$: $\\det A=1\\cdot5-2\\cdot3=-1$, also $A^{-1}=\\tfrac{1}{-1}\\begin{pmatrix}5&-2\\\\-3&1\\end{pmatrix}=\\begin{pmatrix}-5&2\\\\3&-1\\end{pmatrix}$.",
        exercise: "Bestimme $A^{-1}$ für $A=\\begin{pmatrix}2&1\\\\1&1\\end{pmatrix}$ und prüfe $AA^{-1}=I$.",
        hint: "Determinante $ad-bc$ berechnen, dann die Formel anwenden.",
        solution: "$\\det A=2\\cdot1-1\\cdot1=1\\neq 0$.\n$A^{-1}=\\tfrac{1}{1}\\begin{pmatrix}1&-1\\\\-1&2\\end{pmatrix}=\\begin{pmatrix}1&-1\\\\-1&2\\end{pmatrix}$.\nProbe: $AA^{-1}=\\begin{pmatrix}2&1\\\\1&1\\end{pmatrix}\\begin{pmatrix}1&-1\\\\-1&2\\end{pmatrix}=\\begin{pmatrix}2\\cdot1+1\\cdot(-1)&2\\cdot(-1)+1\\cdot2\\\\1\\cdot1+1\\cdot(-1)&1\\cdot(-1)+1\\cdot2\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}=I$. ✓",
        quiz: {
          question: "Wann ist eine $2\\times2$-Matrix invertierbar?",
          options: ["Immer", "Wenn ihre Determinante von null verschieden ist", "Wenn sie symmetrisch ist", "Wenn alle Einträge positiv sind"],
          answerIndex: 1,
          explanation: "Genau dann, wenn $\\det A\\neq 0$; dann liefert die explizite Formel die Inverse."
        }
      }
    ]
  },
  {
    id: "mod-5",
    title: "Lineare Gleichungssysteme",
    level: "Aufbau",
    targetHours: 10,
    goals: [
      "Ein LGS als Matrix schreiben",
      "Das Gauß-Verfahren sicher anwenden",
      "Lösbarkeit über den Rang entscheiden"
    ],
    lessons: [
      {
        id: "m5-l1",
        title: "Vom LGS zur Matrix",
        difficulty: "Aufbau",
        estimatedMinutes: 40,
        theory: [
          "Ein lineares Gleichungssystem (LGS) hat die Form $A\\vec x=\\vec b$ mit Koeffizientenmatrix $A$, Unbekanntenvektor $\\vec x$ und rechter Seite $\\vec b$.",
          "Man schreibt die erweiterte Koeffizientenmatrix $(A\\mid\\vec b)$ und arbeitet nur noch mit Zeilenoperationen.",
          "Eine Lösung ist ein Vektor $\\vec x$, der alle Gleichungen gleichzeitig erfüllt.",
          "Die Lösungsmenge kann leer sein (unlösbar), genau ein Vektor (eindeutig) oder unendlich groß (unterbestimmt) sein."
        ],
        example: "Das System $x+y=3$, $x-y=1$ wird zu $(A\\mid\\vec b)=\\left(\\begin{array}{cc|c}1&1&3\\\\1&-1&1\\end{array}\\right)$. Lösung: $x=2$, $y=1$.",
        exercise: "Schreibe das LGS $2x+3y=8$, $x-y=1$ als erweiterte Matrix auf.",
        hint: "Jede Gleichung wird eine Zeile; Unbekannte in fester Reihenfolge, dann die rechte Seite.",
        solution: "$\\left(\\begin{array}{cc|c}2&3&8\\\\1&-1&1\\end{array}\\right)$. Zwei Gleichungen, zwei Unbekannte $x,y$ in dieser Reihenfolge.",
        quiz: {
          question: "Wie kann die Lösungsmenge eines LGS aussehen?",
          options: ["Nur eindeutig", "Leer, genau eine Lösung oder unendlich viele", "Immer unendlich viele", "Niemals leer"],
          answerIndex: 1,
          explanation: "Ein LGS ist unlösbar, eindeutig lösbar oder hat unendlich viele Lösungen — diese drei Fälle treten auf."
        }
      },
      {
        id: "m5-l2",
        title: "Das Gauß-Verfahren",
        difficulty: "Aufbau",
        estimatedMinutes: 55,
        theory: [
          "Das Gauß-Verfahren bringt $(A\\mid\\vec b)$ durch Zeilenoperationen auf Zeilenstufenform: unter jeder führenden Eins (Pivot) stehen nur Nullen.",
          "Dann löst man von unten nach oben zurück (Rücksubstitution).",
          "Noch weiter reduziert ergibt die reduzierte Zeilenstufenform, in der über jedem Pivot ebenfalls nur Nullen stehen — die Lösung kann dann direkt abgelesen werden.",
          "Eine Spalte ohne Pivot entspricht einer freien Variablen, die beliebig wählbar ist — Grundlage für unendlich viele Lösungen."
        ],
        example: "$\\left(\\begin{array}{cc|c}1&1&3\\\\1&-1&1\\end{array}\\right)\\xrightarrow{Z_2-Z_1}\\left(\\begin{array}{cc|c}1&1&3\\\\0&-2&-2\\end{array}\\right)\\xrightarrow{Z_2/(-2)}\\left(\\begin{array}{cc|c}1&1&3\\\\0&1&1\\end{array}\\right)$. Rücksubstitution: $y=1$, $x=3-1=2$.",
        exercise: "Löse per Gauß: $\\left(\\begin{array}{cc|c}1&2&5\\\\2&3&8\\end{array}\\right)$.",
        hint: "Erzeuge in der zweiten Zeile eine Null unter dem Pivot: $Z_2-2Z_1$.",
        solution: "$Z_2-2Z_1$: $\\left(\\begin{array}{cc|c}1&2&5\\\\0&-1&-2\\end{array}\\right)$.\n$Z_2/(-1)$: $\\left(\\begin{array}{cc|c}1&2&5\\\\0&1&2\\end{array}\\right)$.\nRücksubstitution: $y=2$, $x=5-2\\cdot2=1$.\nLösung: $\\vec x=\\begin{pmatrix}1\\\\2\\end{pmatrix}$.",
        quiz: {
          question: "Was bedeutet eine Spalte ohne Pivot-Element?",
          options: ["Das System ist unlösbar", "Es gibt eine freie Variable", "Die Lösung ist eindeutig", "Die Matrix ist invertierbar"],
          answerIndex: 1,
          explanation: "Eine Spalte ohne Pivot gehört zu einer freien Variablen, die beliebig wählbar ist — es gibt unendlich viele Lösungen."
        }
      },
      {
        id: "m5-l3",
        title: "Rang und Lösbarkeit",
        difficulty: "Aufbau",
        estimatedMinutes: 50,
        theory: [
          "Der Rang $\\operatorname{rang}(A)$ ist die Anzahl der Pivot-Elemente in der Zeilenstufenform — also die Anzahl linear unabhängiger Zeilen.",
          "Der LGS-Satz (Kronecker-Capelli) besagt: $A\\vec x=\\vec b$ ist genau dann lösbar, wenn $\\operatorname{rang}(A)=\\operatorname{rang}(A\\mid\\vec b)$.",
          "Ist das System lösbar, so ist es genau dann eindeutig lösbar, wenn $\\operatorname{rang}(A)=n$ (Anzahl der Unbekannten) gilt.",
          "Der homogene Fall $\\vec b=\\vec 0$ ist stets lösbar (nämlich $\\vec x=\\vec 0$); er hat nichttriviale Lösungen genau dann, wenn $\\operatorname{rang}(A)<n$."
        ],
        example: "Hat $\\begin{pmatrix}1&2\\\\2&4\\end{pmatrix}\\vec x=\\begin{pmatrix}3\\\\7\\end{pmatrix}$ eine Lösung? Zeile 2 ist das Doppelte von Zeile 1, aber $7\\neq 2\\cdot 3$, also $\\operatorname{rang}(A)=1<\\operatorname{rang}(A\\mid\\vec b)=2$ — unlösbar.",
        exercise: "Bestimme den Rang von $A=\\begin{pmatrix}1&2&3\\\\2&4&6\\\\1&1&1\\end{pmatrix}$.",
        hint: "Zeile 2 ist $2\\cdot$ Zeile 1. Bringe auf Stufenform und zähle die Pivots.",
        solution: "$Z_2-2Z_1$ und $Z_3-Z_1$:\n$\\begin{pmatrix}1&2&3\\\\0&0&0\\\\0&-1&-2\\end{pmatrix}\\xrightarrow{\\text{tauschen}}\\begin{pmatrix}1&2&3\\\\0&-1&-2\\\\0&0&0\\end{pmatrix}$.\nZwei Pivots, also $\\operatorname{rang}(A)=2$.",
        quiz: {
          question: "Wann ist ein LGS $A\\vec x=\\vec b$ lösbar?",
          options: ["Wenn $\\det A\\neq0$", "Wenn $\\operatorname{rang}(A)=\\operatorname{rang}(A\\mid\\vec b)$", "Immer", "Wenn $A$ quadratisch ist"],
          answerIndex: 1,
          explanation: "Nach dem LGS-Satz ist das System genau dann lösbar, wenn Rang der Koeffizientenmatrix und Rang der erweiterten Matrix übereinstimmen."
        }
      }
    ]
  },
  {
    id: "mod-6",
    title: "Determinanten",
    level: "Aufbau",
    targetHours: 9,
    goals: [
      "Die Determinante definieren und berechnen",
      "Rechenregeln für Determinanten anwenden",
      "Determinante als Volumen (Orientierung) verstehen"
    ],
    lessons: [
      {
        id: "m6-l1",
        title: "Was ist eine Determinante?",
        difficulty: "Aufbau",
        estimatedMinutes: 45,
        theory: [
          "Die Determinante $\\det A$ ist einer quadratischen Matrix $A$ zugeordnet und ist eine einzige Zahl. Sie misst, wie $A$ den Raum streckt und ob er umklappt.",
          "Für $2\\times2$ gilt $\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}=ad-bc$.",
          "Für $3\\times3$ entwickelt man nach einer Zeile, z. B. der ersten: $\\det A=a_{11}A_{11}+a_{12}A_{12}+a_{13}A_{13}$, wobei $A_{ij}$ die Kofaktoren sind (Unterdeterminante mit Vorzeichen $(-1)^{i+j}$).",
          "Die Determinante ist genau dann null, wenn $A$ nicht invertierbar ist — dann ist das Bild kleiner als der ganze Raum."
        ],
        example: "$\\det\\begin{pmatrix}3&1\\\\2&4\\end{pmatrix}=3\\cdot4-1\\cdot2=12-2=10\\neq0$, also ist die Matrix invertierbar.",
        exercise: "Berechne $\\det\\begin{pmatrix}1&2&3\\\\0&1&4\\\\0&0&2\\end{pmatrix}$.",
        hint: "Bei einer Dreiecksmatrix ist die Determinante das Produkt der Diagonaleinträge.",
        solution: "Die Matrix ist obere Dreiecksmatrix. Für Dreiecksmatrizen gilt $\\det A=$ Produkt der Diagonale.\n$\\det A=1\\cdot1\\cdot2=2$.",
        quiz: {
          question: "Wann ist eine Matrix nicht invertierbar?",
          options: ["Wenn $\\det A=0$", "Wenn $\\det A>0$", "Wenn $\\det A=1$", "Wenn alle Einträge null sind"],
          answerIndex: 0,
          explanation: "Genau bei $\\det A=0$ ist die Matrix singulär und besitzt keine Inverse."
        }
      },
      {
        id: "m6-l2",
        title: "Rechenregeln für Determinanten",
        difficulty: "Aufbau",
        estimatedMinutes: 50,
        theory: [
          "Multipliziert man eine Zeile mit $\\lambda$, so wird die Determinante mit $\\lambda$ multipliziert: $\\det(\\lambda A)=\\lambda^n\\det A$ für $n\\times n$-Matrizen.",
          "Addiert man ein Vielfaches einer Zeile zu einer anderen, ändert sich die Determinante nicht — das ist die Grundlage des Gauß-Verfahrens.",
          "Vertauscht man zwei Zeilen, wechselt die Determinante das Vorzeichen.",
          "Der Multiplikationssatz lautet $\\det(AB)=\\det A\\cdot\\det B$, und $\\det(A^{-1})=\\tfrac{1}{\\det A}$."
        ],
        example: "Aus $\\det\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}=-2$ folgt $\\det\\begin{pmatrix}2&4\\\\3&4\\end{pmatrix}=2\\cdot(-2)=-4$ (Zeile 1 verdoppelt) und $\\det\\begin{pmatrix}3&4\\\\1&2\\end{pmatrix}=+2$ (Zeilen vertauscht).",
        exercise: "Es sei $\\det A=3$ und $A$ eine $3\\times3$-Matrix. Bestimme $\\det(2A)$.",
        hint: "Jede der drei Zeilen wird mit $2$ multipliziert, also $\\det(2A)=2^3\\det A$.",
        solution: "$\\det(2A)=2^3\\cdot\\det A=8\\cdot3=24$.\nJede Zeile wird mit $2$ skaliert, und bei drei Zeilen trägt jeder Faktor bei.",
        quiz: {
          question: "Was bewirkt das Vertauschen zweier Zeilen auf $\\det A$?",
          options: ["Nichts", "Vorzeichenwechsel", "Determinante wird null", "Determinante verdoppelt sich"],
          answerIndex: 1,
          explanation: "Ein Zeilentausch wechselt das Vorzeichen der Determinante."
        }
      },
      {
        id: "m6-l3",
        title: "Determinante als Volumen",
        difficulty: "Aufbau → Fortgeschritten",
        estimatedMinutes: 50,
        theory: [
          "Geometrisch ist $|\\det A|$ das Volumen des Parallelotops, das die Spalten von $A$ aufspannen. Im $\\mathbb{R}^2$ ist es die Fläche der Parallelogramms.",
          "Ist $\\det A=0$, liegen die Spalten in einem echten Unterraum — das Volumen kollabiert, die Matrix ist nicht invertierbar.",
          "Das Vorzeichen der Determinante gibt die Orientierung an: $\\det A>0$ erhält, $\\det A<0$ kehrt die Orientierung um.",
          "Damit erklärt sich $\\det(AB)=\\det A\\det B$: zwei Abbildungen hintereinander multiplizieren ihre Volumenskalierungen."
        ],
        example: "Die Spalten $\\begin{pmatrix}1\\\\0\\end{pmatrix}$, $\\begin{pmatrix}0\\\\1\\end{pmatrix}$ spannen das Einheitsquadrat der Fläche $1$ auf; $\\det I=1$. Mit $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, $\\begin{pmatrix}0\\\\1\\end{pmatrix}$ ist die Fläche $2$ und $\\det=2$.",
        exercise: "Welche Fläche spannen $\\begin{pmatrix}3\\\\0\\end{pmatrix}$ und $\\begin{pmatrix}1\\\\2\\end{pmatrix}$ auf?",
        hint: "Fläche $=|\\det|$ der Matrix mit diesen Spalten.",
        solution: "$A=\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix}$, $\\det A=3\\cdot2-1\\cdot0=6$.\nFläche $=|\\det A|=6$.",
        quiz: {
          question: "Was bedeutet geometrisch $\\det A=0$?",
          options: ["Das Volumen ist null, die Spalten sind linear abhängig", "Die Abbildung vergrößert alles", "Die Matrix ist die Einheitsmatrix", "Die Spalten sind orthogonal"],
          answerIndex: 0,
          explanation: "Determinante null heißt, das aufgespannte Volumen kollabiert — die Spalten liegen in einem echten Unterraum."
        }
      },
      {
        id: "m6-l4",
        title: "Vom Pfeil zum Axiom: warum abstrahieren?",
        difficulty: "Aufbau → Fortgeschritten",
        estimatedMinutes: 50,
        theory: [
          "Bislang waren Vektoren Pfeile mit Komponenten. Doch dieselben Rechenregeln gelten auch für Objekte, die gar keine Pfeile sind: Polynome, Funktionen, Lösungen von Differentialgleichungen.",
          "Beispiel: Polynome kann man addieren ($x^2+3x = x^2+3x$) und mit Zahlen vielfachen ($2\\cdot(x^2+1)=2x^2+2$) — genau wie Vektoren. Die „Komponenten“ sind hier die Koeffizienten.",
          "Statt jeden Typ einzeln zu behandeln, fasst man alle zusammen, die sich gleich verhalten: ein Vektorraum ist jede Menge mit Addition und skalaren Vielfachen, die die vertrauten Regeln erfüllen.",
          "Der Gewinn ist enorm: ein einziger Beweis für alle Vektorräume zugleich. Sätze über Basen, Dimension und lineare Abbildungen gelten dann automatisch für Pfeile, Polynome und Funktionen.",
          "Dieser Schritt — vom konkreten Objekt zur axiomatischen Struktur — ist der Kern universitärer Mathematik. Wer ihn einmal verstanden hat, sieht überall Vektorräume."
        ],
        example: "Die drei Vektoren $\\vec e_1,\\vec e_2,\\vec e_3$ bilden eine Basis des $\\mathbb{R}^3$; die Monome $1,x,x^2$ bilden eine Basis der quadratischen Polynome. Beide Räume haben Dimension $3$ — derselbe Satz, zwei völlig verschiedene Objekte.",
        exercise: "Nenne zwei Vektorräume, die keine Pfeile sind, und gib jeweils eine Basis an.",
        hint: "Denk an Polynome und Funktionen; die „Basis“ besteht aus den Bausteinen, aus denen sich alles zusammensetzt.",
        solution: "Beispiel 1: Der Raum der Polynome vom Grad $\\leq2$ mit Basis $\{1,x,x^2\}$ (Dimension $3$).\nBeispiel 2: Der Raum der stetigen Funktionen $C^0(\\mathbb{R})$ — hier ist keine endliche Basis vorhanden, der Raum ist unendlichdimensional; eine „Basis“ (Hamel-Basis) existiert nur mit dem Auswahlaxiom.\nBeide sind Vektorräume, obwohl ihre Elemente keine Pfeile sind.",
        quiz: {
          question: "Warum abstrahieren wir vom konkreten Pfeil zum axiomatischen Vektorraum?",
          options: ["Weil Pfeile unpraktisch sind", "Weil ein Beweis dann für Pfeile, Polynome und Funktionen zugleich gilt", "Weil man sonst nicht rechnen kann", "Weil es Vorschrift ist"],
          answerIndex: 1,
          explanation: "Abstraktion fasst alle Objekte mit denselben Rechenregeln zusammen — ein Satz gilt dann automatisch für Pfeile, Polynome und Funktionen."
        }
      }
    ]
  },
  {
    id: "mod-7",
    title: "Vektorräume (axiomatisch)",
    level: "Fortgeschritten",
    targetHours: 11,
    goals: [
      "Körper und die Vektorraumaxiome kennen",
      "Unterräume erkennen und nachweisen",
      "Beispiele wie Funktionen- und Polynomräume einordnen"
    ],
    lessons: [
      {
        id: "m7-l1",
        title: "Körper und Vektorraumaxiome",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 55,
        theory: [
          "Ein Körper $K$ (z. B. $\\mathbb{Q},\\mathbb{R},\\mathbb{C}$) ist eine Menge mit Addition und Multiplikation, die die vertrauten Regeln erfüllen: Assoziativität, Kommutativität, Distributivität, neutrale und inverse Elemente.",
          "Ein $K$-Vektorraum ist eine Menge $V$ mit Addition $\\vec u+\\vec v$ und skalarer Multiplikation $\\lambda\\vec v$ ($\\lambda\\in K$), die die Axiome erfüllen: $\\vec u+\\vec v=\\vec v+\\vec u$, $\\lambda(\\vec u+\\vec v)=\\lambda\\vec u+\\lambda\\vec v$, $(\\lambda+\\mu)\\vec v=\\lambda\\vec v+\\mu\\vec v$ und $1\\cdot\\vec v=\\vec v$.",
          "Diese Axiome sind nicht Willkür, sondern fassen die Rechenregeln zusammen, die wir schon bei $\\mathbb{R}^n$ genutzt haben — jetzt aber für beliebige Objekte.",
          "Der Nullvektor $\\vec 0$ ist eindeutig durch $\\vec v+\\vec 0=\\vec v$ festgelegt, ebenso der Gegenvektor $-\\vec v$.",
          "Dieser Schritt — vom konkreten Pfeil zum axiomatischen Vektorraum — ist ein klassischer Schwerpunkt der Linearen Algebra 1 an der Universität Freiburg; die Axiome und der sichere Umgang mit ihnen stehen regelmäßig am Anfang von Klausuren (siehe Altklausuren der Fachschaft Mathematik)."
        ],
        example: "$\\mathbb{R}^n$ über $\\mathbb{R}$ ist ein Vektorraum. Auch $\\mathbb{C}$ ist ein $\\mathbb{R}$-Vektorraum (Skalare reell) und ein $\\mathbb{C}$-Vektorraum (Skalare komplex).",
        exercise: "Zeige: in jedem Vektorraum gilt $\\lambda\\vec 0=\\vec 0$ für alle $\\lambda\\in K$.",
        hint: "Nutze $\\vec 0=\\vec 0+\\vec 0$ und die Distributivität.",
        solution: "Es gilt $\\vec 0=\\vec 0+\\vec 0$. Multipliziere mit $\\lambda$:\n$\\lambda\\vec 0=\\lambda(\\vec 0+\\vec 0)=\\lambda\\vec 0+\\lambda\\vec 0$.\nSubtrahiere $\\lambda\\vec 0$ auf beiden Seiten: $\\vec 0=\\lambda\\vec 0$.",
        quiz: {
          question: "Welche Axiome definieren einen Vektorraum?",
          options: ["Nur Addition von Vektoren", "Addition und skalare Multiplikation mit Rechenregeln wie Distributivität", "Multiplikation von Vektoren", "Existenz einer Norm"],
          answerIndex: 1,
          explanation: "Ein Vektorraum braucht Addition und skalare Multiplikation, die Assoziativität, Kommutativität und Distributivität erfüllen, mit $1\\cdot\\vec v=\\vec v$."
        }
      },
      {
        id: "m7-l2",
        title: "Unterräume",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 50,
        theory: [
          "Eine Teilmenge $U\\subseteq V$ heißt Unterraum, wenn sie selbst ein Vektorraum ist. Es reicht zu prüfen: $U\\neq\\emptyset$ und mit $\\vec u,\\vec w\\in U$ liegt auch $\\lambda\\vec u+\\mu\\vec w\\in U$ für alle $\\lambda,\\mu\\in K$ (Unterraumkriterium).",
          "Äquivalent: $\\vec 0\\in U$ und $U$ ist abgeschlossen unter Addition und skalaren Vielfachen.",
          "Beispiele: jeder Vektorraum ist sein eigener Unterraum; $\{\\vec 0\}$ ist der Nullraum; eine Gerade/Ebene durch den Ursprung im $\\mathbb{R}^3$ ist ein Unterraum.",
          "Eine Menge, die den Nullvektor nicht enthält, kann kein Unterraum sein — der erste Schnelltest."
        ],
        example: "Im $\\mathbb{R}^2$ ist $U=\{\\begin{pmatrix}x\\\\y\\end{pmatrix}:y=2x\}$ ein Unterraum (eine Ursprungsgerade). Dagegen ist $\{\\vec v:\\lVert\\vec v\\rVert=1\}$ (Einheitskreis) keiner, da Addition die Länge ändert.",
        exercise: "Ist $U=\{\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}\\in\\mathbb{R}^3: x+y+z=0\}$ ein Unterraum?",
        hint: "Prüfe, ob $\\vec 0$ dabei liegt und ob mit zwei Lösungen auch jede Linearkombination Lösung ist.",
        solution: "$\\vec 0$ erfüllt $0+0+0=0$ ✓. Seien $\\vec u,\\vec w\\in U$ mit $u_1+u_2+u_3=0$ und $w_1+w_2+w_3=0$. Dann für $\\lambda\\vec u+\\mu\\vec w$:\n$(\\lambda u_1+\\mu w_1)+(\\lambda u_2+\\mu w_2)+(\\lambda u_3+\\mu w_3)=\\lambda\\cdot0+\\mu\\cdot0=0$.\nAlso liegt die Linearkombination in $U$. $U$ ist Unterraum.",
        quiz: {
          question: "Was ist der schnellste Test, ob eine Menge kein Unterraum ist?",
          options: ["Sie enthält $\\vec 0$ nicht", "Sie hat mehr als zwei Elemente", "Sie ist nicht quadratisch", "Sie hat Determinante null"],
          answerIndex: 0,
          explanation: "Ohne den Nullvektor kann eine Menge kein Unterraum sein — das ist der einfachste Ausschluss-Test."
        }
      },
      {
        id: "m7-l3",
        title: "Funktionen- und Polynomräume",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 55,
        theory: [
          "Vektorräume sind nicht nur Pfeile. Die Menge aller Funktionen $f:\\mathbb{R}\\to\\mathbb{R}$ mit punktweiser Addition $(f+g)(x)=f(x)+g(x)$ und $(\\lambda f)(x)=\\lambda f(x)$ ist ein Vektorraum.",
          "Die Polynome $K[x]$ in einer Variablen bilden einen Vektorraum; die Monome $1,x,x^2,\\dots$ sind ein natürliches Erzeugendensystem.",
          "Die stetigen Funktionen, die differenzierbaren Funktionen und die $k$-mal stetig differenzierbaren Funktionen $C^k(\\mathbb{R})$ sind jeweils Unterräume des Funktionenraums.",
          "Diese Beispiele zeigen, dass Vektorräume unendlichdimensional sein können — der Begriff „Dimension“ muss später verallgemeinert werden.",
          "Für die Lineare Algebra sind Polynomräume zentral: Differentialoperatoren und charakteristische Polynome leben hier."
        ],
        example: "Sind $f(x)=x^2$ und $g(x)=\\sin x$ im Funktionenraum, so ist $3f-2g$ die Funktion $x\\mapsto 3x^2-2\\sin x$ — wieder eine Funktion, also abgeschlossen.",
        exercise: "Ist die Menge $U=\{f\\in\\mathbb{R}[x]:f(0)=0\}$ ein Unterraum von $\\mathbb{R}[x]$?",
        hint: "Prüfe $\\vec 0$ (die Nullfunktion) und die Abgeschlossenheit unter Linearkombinationen über den Funktionswert an $0$.",
        solution: "Nullfunktion $f\\equiv0$ erfüllt $f(0)=0$ ✓. Seien $f,g\\in U$ mit $f(0)=g(0)=0$. Für $\\lambda f+\\mu g$ gilt an der Stelle $0$:\n$(\\lambda f+\\mu g)(0)=\\lambda f(0)+\\mu g(0)=\\lambda\\cdot0+\\mu\\cdot0=0$.\nAlso $\\lambda f+\\mu g\\in U$. $U$ ist Unterraum.",
        quiz: {
          question: "Warum sind Polynome ein Vektorraum?",
          options: ["Weil sie einen Grad haben", "Weil Addition und skalare Multiplikation wieder Polynome liefern und die Axiome erfüllen", "Weil sie nullstellbar sind", "Weil sie stetig sind"],
          answerIndex: 1,
          explanation: "Summe und skalares Vielfaches von Polynomen sind wieder Polynome, und die Vektorraumaxiome gelten punktweise."
        }
      }
    ]
  },
  {
    id: "mod-8",
    title: "Basis und Dimension",
    level: "Fortgeschritten",
    targetHours: 12,
    goals: [
      "Erzeugendensystem und lineare Unabhängigkeit definieren",
      "Basen erkennen und das Austauschlemma anwenden",
      "Den Dimensionsbegriff und endlichdimensionale Räume beherrschen"
    ],
    lessons: [
      {
        id: "m8-l1",
        title: "Erzeugendensystem und lineare Unabhängigkeit",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 55,
        theory: [
          "Eine Menge $E\\subseteq V$ heißt Erzeugendensystem, wenn jeder Vektor als Linearkombination von $E$ geschrieben werden kann, also $\\operatorname{span}(E)=V$.",
          "Vektoren $\\vec v_1,\\dots,\\vec v_k$ heißen linear unabhängig, wenn $\\lambda_1\\vec v_1+\\dots+\\lambda_k\\vec v_k=\\vec 0$ nur die triviale Lösung $\\lambda_1=\\dots=\\lambda_k=0$ hat. Sonst sind sie linear abhängig.",
          "Linear abhängig heißt: ein Vektor ist Linearkombination der anderen.",
          "Im $\\mathbb{R}^n$ sind höchstens $n$ Vektoren linear unabhängig. Mehr als $n$ sind automatisch abhängig."
        ],
        example: "Sind $\\begin{pmatrix}1\\\\0\\end{pmatrix},\\begin{pmatrix}0\\\\1\\end{pmatrix},\\begin{pmatrix}1\\\\1\\end{pmatrix}$ unabhängig? Nein: $\\begin{pmatrix}1\\\\1\\end{pmatrix}=\\begin{pmatrix}1\\\\0\\end{pmatrix}+\\begin{pmatrix}0\\\\1\\end{pmatrix}$, also abhängig.",
        exercise: "Sind $\\begin{pmatrix}1\\\\2\\\\3\\end{pmatrix},\\begin{pmatrix}2\\\\3\\\\4\\end{pmatrix},\\begin{pmatrix}3\\\\5\\\\7\\end{pmatrix}$ linear unabhängig?",
        hint: "Löse $\\lambda_1\\vec v_1+\\lambda_2\\vec v_2+\\lambda_3\\vec v_3=\\vec 0$ als homogenes LGS.",
        solution: "Homogenes System $\\begin{pmatrix}1&2&3\\\\2&3&5\\\\3&4&7\\end{pmatrix}\\vec\\lambda=\\vec 0$.\nGauß: $Z_2-2Z_1$, $Z_3-3Z_1$ liefert $\\begin{pmatrix}1&2&3\\\\0&-1&-1\\\\0&-2&-2\\end{pmatrix}$, weiter $Z_3-2Z_2$: $\\begin{pmatrix}1&2&3\\\\0&-1&-1\\\\0&0&0\\end{pmatrix}$.\nDritte Spalte ohne Pivot $\\Rightarrow$ freie Variable $\\Rightarrow$ nichttriviale Lösung, z. B. $\\lambda_3=1$, $\\lambda_2=-1$, $\\lambda_1=1$.\nAlso linear abhängig.",
        quiz: {
          question: "Wann heißen Vektoren linear unabhängig?",
          options: ["Wenn ihre Determinante null ist", "Wenn die Nullgleichung nur trivial lösbar ist", "Wenn sie gleich lang sind", "Wenn sie paarweise orthogonal sind"],
          answerIndex: 1,
          explanation: "Linear unabhängig bedeutet: $\\lambda_1\\vec v_1+\\dots+\\lambda_k\\vec v_k=\\vec 0$ hat nur die Lösung $\\lambda_i=0$."
        }
      },
      {
        id: "m8-l2",
        title: "Basis und Austauschlemma",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 60,
        theory: [
          "Eine Basis ist ein Erzeugendensystem, das zugleich linear unabhängig ist. Die Standardbasis des $\\mathbb{R}^n$ ist $\\vec e_1,\\dots,\\vec e_n$.",
          "Basisaustauschlemma (Steinitz): Ist $\{\\vec v_1,\\dots,\\vec v_n\}$ eine Basis und $\\vec w=\\sum\\mu_i\\vec v_i$ mit $\\mu_j\\neq0$, so erhält man eine neue Basis, indem man $\\vec v_j$ durch $\\vec w$ ersetzt.",
          "Daraus folgt der Basisergänzungssatz: jedes linear unabhängige System kann zu einer Basis ergänzt werden; jedes Erzeugendensystem enthält eine Basis.",
          "Insbesondere haben je zwei Basen desselben Vektorraums gleich viele Elemente — das motiviert die Dimension."
        ],
        example: "Im $\\mathbb{R}^2$ ist $\{\\vec e_1,\\vec e_2\}$ eine Basis. Mit $\\vec w=\\vec e_1+\\vec e_2$ (Koeffizient von $\\vec e_2$ ist $1\\neq0$) ist auch $\{\\vec e_1,\\vec e_1+\\vec e_2\}$ eine Basis.",
        exercise: "Begründe, dass $\{\\vec e_1,\\vec e_1+\\vec e_2\}$ eine Basis des $\\mathbb{R}^2$ ist.",
        hint: "Prüfe lineare Unabhängigkeit und dass jeder Vektor als Linearkombination geschrieben werden kann.",
        solution: "Unabhängigkeit: $\\lambda_1\\vec e_1+\\lambda_2(\\vec e_1+\\vec e_2)=\\vec 0$ heißt $(\\lambda_1+\\lambda_2)\\vec e_1+\\lambda_2\\vec e_2=\\vec 0$, also $\\lambda_2=0$ und $\\lambda_1=0$. ✓\nErzeugend: zu $\\begin{pmatrix}a\\\\b\\end{pmatrix}$ wähle $\\lambda_2=b$ und $\\lambda_1=a-b$, dann $\\lambda_1\\vec e_1+\\lambda_2(\\vec e_1+\\vec e_2)=\\begin{pmatrix}a\\\\b\\end{pmatrix}$.\nAlso Basis.",
        quiz: {
          question: "Was ist eine Basis?",
          options: ["Ein Erzeugendensystem", "Ein linear unabhängiges Erzeugendensystem", "Die längsten Vektoren", "Eine orthogonale Menge"],
          answerIndex: 1,
          explanation: "Eine Basis ist gleichzeitig Erzeugendensystem und linear unabhängig — minimal erzeugend, maximal unabhängig."
        }
      },
      {
        id: "m8-l3",
        title: "Dimension endlichdimensionaler Räume",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 55,
        theory: [
          "Die Dimension $\\dim V$ ist die Anzahl der Vektoren in einer (und damit jeder) Basis. Der $\\mathbb{R}^n$ hat Dimension $n$.",
          "Für jeden Unterraum $U\\subseteq V$ gilt $\\dim U\\leq\\dim V$; Gleichheit liegt genau vor, wenn $U=V$.",
          "Der Ergänzungssatz liefert: zu jedem Unterraum $U$ gibt es einen Komplementärraum $W$ mit $V=U\\oplus W$ und $\\dim V=\\dim U+\\dim W$.",
          "Unendlichdimensionale Räume (wie $K[x]$) haben keine endliche Basis; ihre „Dimension“ wird später über Kardinalitäten von Hamel-Basen gefasst."
        ],
        example: "Im $\\mathbb{R}^3$ hat die $xy$-Ebene $U=\{z=0\}$ Dimension $2$; ein Komplementärraum ist die $z$-Achse mit Dimension $1$, und $2+1=3$.",
        exercise: "Bestimme die Dimension von $U=\{\\begin{pmatrix}x\\\\y\\\\z\\end{pmatrix}:x+y+z=0\}\\subseteq\\mathbb{R}^3$.",
        hint: "Löse $z=-x-y$, also zwei freie Parameter; gib eine Basis an.",
        solution: "Aus $x+y+z=0$ folgt $z=-x-y$. Jeder Vektor hat die Form $\\begin{pmatrix}x\\\\y\\\\-x-y\\end{pmatrix}=x\\begin{pmatrix}1\\\\0\\\\-1\\end{pmatrix}+y\\begin{pmatrix}0\\\\1\\\\-1\\end{pmatrix}$.\nDie zwei Vektoren sind linear unabhängig, bilden also eine Basis. Damit $\\dim U=2$.",
        quiz: {
          question: "Was ist die Dimension eines Vektorraums?",
          options: ["Die Anzahl der Vektoren darin", "Die Anzahl der Vektoren in einer Basis", "Die Länge des längsten Vektors", "Die Determinante"],
          answerIndex: 1,
          explanation: "Die Dimension ist die Anzahl der Basisvektoren — wohldefiniert, da alle Basen gleich lang sind."
        }
      }
    ]
  },
  {
    id: "mod-9",
    title: "Lineare Abbildungen",
    level: "Fortgeschritten",
    targetHours: 12,
    goals: [
      "Lineare Abbildungen definieren und Kern/Bild berechnen",
      "Den Rang-Nullitätssatz anwenden",
      "Darstellungsmatrix und Basiswechsel beherrschen"
    ],
    lessons: [
      {
        id: "m9-l1",
        title: "Definition, Kern und Bild",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 55,
        theory: [
          "Eine Abbildung $f:V\\to W$ heißt linear, wenn $f(\\vec u+\\vec v)=f(\\vec u)+f(\\vec v)$ und $f(\\lambda\\vec v)=\\lambda f(\\vec v)$ gelten — kurz $f(\\lambda\\vec u+\\mu\\vec v)=\\lambda f(\\vec u)+\\mu f(\\vec v)$.",
          "Folge: $f(\\vec 0)=\\vec 0$. Eine lineare Abbildung ist vollständig durch die Bilder einer Basis festgelegt.",
          "Der Kern $\\ker f=\{\\vec v\\in V:f(\\vec v)=\\vec 0\}$ ist ein Unterraum von $V$; er misst, wie viel „verschwindet“.",
          "Das Bild $\\operatorname{im} f=\{f(\\vec v):\\vec v\\in V\}$ ist ein Unterraum von $W$; es misst, wie viel „ankommt“."
        ],
        example: "Die Projektion $f(x,y)=(x,0)$ ist linear. Ihr Kern ist die $y$-Achse $\{(0,y)\}$, ihr Bild die $x$-Achse $\{(x,0)\}$.",
        exercise: "Bestimme Kern und Bild von $f:\\mathbb{R}^2\\to\\mathbb{R}^2$, $f(x,y)=(x+y,\\,x+y)$.",
        hint: "Kern: $f(x,y)=\\vec 0$ lösen. Bild: welche Vektoren entstehen als $(x+y,x+y)$?",
        solution: "Kern: $x+y=0\\Rightarrow y=-x$, also $\\ker f=\{(t,-t):t\\in\\mathbb{R}\}$, eine Gerade.\nBild: jeder Bildvektor hat die Form $(c,c)$ mit $c=x+y$, also $\\operatorname{im} f=\{(c,c):c\\in\\mathbb{R}\}$, ebenfalls eine Gerade.",
        quiz: {
          question: "Was ist der Kern einer linearen Abbildung?",
          options: ["Die Menge aller Bilder", "Die Menge der Vektoren, die auf $\\vec 0$ abgebildet werden", "Die Determinante", "Die Länge des Bildes"],
          answerIndex: 1,
          explanation: "Der Kern $\\ker f=\{\\vec v:f(\\vec v)=\\vec 0\}$ ist ein Unterraum des Definitionsbereichs."
        }
      },
      {
        id: "m9-l2",
        title: "Rang-Nullitätssatz",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 50,
        theory: [
          "Der Rang $\\operatorname{rang}(f)=\\dim\\operatorname{im} f$ und die Nullität $\\operatorname{null}(f)=\\dim\\ker f$.",
          "Rang-Nullitätssatz: für lineares $f:V\\to W$ mit $\\dim V<\\infty$ gilt $\\dim V=\\dim\\ker f+\\dim\\operatorname{im} f$.",
          "Anschaulich: was im Kern verschwindet, fehlt im Bild; beides zusammen ergibt den Ausgangsraum.",
          "Folgerung: ist $\\dim V=\\dim W$ und $f$ injektiv, so ist $f$ auch surjektiv (und umgekehrt) — bei gleichem Dimension ein zentraler Test."
        ],
        example: "Für $f(x,y)=(x+y,x+y)$ (vorher) ist $\\dim\\ker f=1$ und $\\dim\\operatorname{im} f=1$, Summe $2=\\dim\\mathbb{R}^2$. ✓",
        exercise: "Sei $f:\\mathbb{R}^3\\to\\mathbb{R}^2$ linear mit $\\dim\\operatorname{im} f=2$. Bestimme $\\dim\\ker f$.",
        hint: "Rang-Nullitätssatz: $\\dim V=\\dim\\ker f+\\dim\\operatorname{im} f$.",
        solution: "$\\dim\\ker f=\\dim\\mathbb{R}^3-\\dim\\operatorname{im} f=3-2=1$.\nDer Kern ist eine Gerade.",
        quiz: {
          question: "Was besagt der Rang-Nullitätssatz?",
          options: ["$\\dim V=\\dim\\ker f+\\dim\\operatorname{im} f$", "$\\det(f)=0$", "Kern und Bild sind gleich", "$f$ ist immer bijektiv"],
          answerIndex: 0,
          explanation: "Die Dimension des Ausgangsraums teilt sich auf in Kern und Bild: $\\dim V=\\dim\\ker f+\\dim\\operatorname{im} f$."
        }
      },
      {
        id: "m9-l3",
        title: "Darstellungsmatrix und Basiswechsel",
        difficulty: "Fortgeschritten → Profi",
        estimatedMinutes: 65,
        theory: [
          "Ist $B$ eine Basis von $V$ und $C$ eine Basis von $W$, so wird jede lineare Abbildung $f:V\\to W$ durch eine Matrix $M_C^B(f)$ beschrieben: ihre $j$-te Spalte ist die Koordinatendarstellung von $f(\\vec b_j)$ bezüglich $C$.",
          "Wechselt man die Basis in $V$ von $B$ nach $B'$, so transformiert sich die Matrix durch $M_C^{B'}(f)=M_C^B(f)\\cdot S_{B'\\to B}$, wobei $S$ die Basiswechselmatrix ist.",
          "Bei Endomorphismen ($V=W$, $C=B$) lautet die Transformationsregel $A'=S^{-1}AS$ — ähnliche Matrizen beschreiben dieselbe Abbildung in verschiedenen Basen.",
          "Ein Isomorphismus ist eine bijektive lineare Abbildung; endliche Vektorräume gleicher Dimension sind isomorph."
        ],
        example: "Ist $A=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$ in der Standardbasis und $S=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ die Basiswechselmatrix, so ist $A'=S^{-1}AS=\\begin{pmatrix}2&1\\\\0&3\\end{pmatrix}$ ähnlich zu $A$.",
        exercise: "Prüfe: sind $A=\\begin{pmatrix}1&0\\\\0&4\\end{pmatrix}$ und $B=\\begin{pmatrix}1&3\\\\0&4\\end{pmatrix}$ ähnlich? Hinweis: $S=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$.",
        hint: "Berechne $S^{-1}AS$ und vergleiche mit $B$.",
        solution: "$S^{-1}=\\begin{pmatrix}1&-1\\\\0&1\\end{pmatrix}$.\n$S^{-1}AS=\\begin{pmatrix}1&-1\\\\0&1\\end{pmatrix}\\begin{pmatrix}1&0\\\\0&4\\end{pmatrix}\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}=\\begin{pmatrix}1&-1\\\\0&1\\end{pmatrix}\\begin{pmatrix}1&1\\\\0&4\\end{pmatrix}=\\begin{pmatrix}1&-3\\\\0&4\\end{pmatrix}$.\nDas ist nicht $B$. Mit $S=\\begin{pmatrix}1&-1\\\\0&1\\end{pmatrix}$ erhält man $S^{-1}AS=\\begin{pmatrix}1&3\\\\0&4\\end{pmatrix}=B$. Also sind $A$ und $B$ ähnlich.",
        quiz: {
          question: "Wann heißen zwei Matrizen $A$ und $A'$ ähnlich?",
          options: ["Wenn $\\det A=\\det A'$", "Wenn es invertierbares $S$ gibt mit $A'=S^{-1}AS$", "Wenn sie gleich groß sind", "Wenn beide symmetrisch sind"],
          answerIndex: 1,
          explanation: "Ähnliche Matrizen beschreiben dieselbe lineare Abbildung in verschiedenen Basen: $A'=S^{-1}AS$."
        }
      }
    ]
  },
  {
    id: "mod-10",
    title: "Eigenwerte",
    level: "Profi",
    targetHours: 12,
    goals: [
      "Eigenwerte und Eigenvektoren definieren und berechnen",
      "Das charakteristische Polynom nutzen",
      "Diagonalisierbarkeit und Vielfachheiten beurteilen"
    ],
    lessons: [
      {
        id: "m10-l1",
        title: "Eigenwerte und Eigenvektoren",
        difficulty: "Profi",
        estimatedMinutes: 55,
        theory: [
          "Eine Zahl $\\lambda\\in K$ heißt Eigenwert eines Endomorphismus $f:V\\to V$, wenn ein Vektor $\\vec v\\neq\\vec 0$ existiert mit $f(\\vec v)=\\lambda\\vec v$. Dieser $\\vec v$ heißt Eigenvektor.",
          "Der Eigenraum zu $\\lambda$ ist $E_\\lambda=\\ker(f-\\lambda\\,\\mathrm{id})=\{\\vec v:f(\\vec v)=\\lambda\\vec v\}$ — ein Unterraum, der alle Eigenvektoren zu $\\lambda$ (und $\\vec 0$) enthält.",
          "Eigenvektoren sind Richtungen, die unter $f$ nur gestreckt, nicht gedreht werden; der Skalar $\\lambda$ ist der Streckfaktor.",
          "Eigenwerte stehen in Freiburger LA1-Klausuren häufig im Zentrum — sicheres Berechnen des charakteristischen Polynoms und der Eigenräume ist Klausurstandard (siehe Altklausuren der Fachschaft Mathematik).",
          "Sind $\\lambda_1,\\dots,\\lambda_k$ paarweise verschiedene Eigenwerte, so sind zugehörige Eigenvektoren linear unabhängig."
        ],
        example: "Für $A=\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$ ist $\\vec e_1$ Eigenvektor zum Eigenwert $2$ und $\\vec e_2$ zum Eigenwert $3$, da $A\\vec e_1=2\\vec e_1$ und $A\\vec e_2=3\\vec e_2$.",
        exercise: "Bestimme Eigenwerte und einen Eigenvektor von $A=\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$.",
        hint: "Löse $\\det(A-\\lambda I)=0$; dann pro Eigenwert $(A-\\lambda I)\\vec v=\\vec 0$.",
        solution: "$\\det(A-\\lambda I)=(1-\\lambda)^2-4=\\lambda^2-2\\lambda-3=(\\lambda-3)(\\lambda+1)$.\nEigenwerte: $\\lambda_1=3$, $\\lambda_2=-1$.\nZu $\\lambda_1=3$: $(A-3I)\\vec v=\\vec 0$ heißt $\\begin{pmatrix}-2&2\\\\2&-2\\end{pmatrix}\\vec v=\\vec 0$, also $\\vec v=\\begin{pmatrix}1\\\\1\\end{pmatrix}$ (Eigenvektor).",
        quiz: {
          question: "Was ist ein Eigenvektor von $A$ zum Eigenwert $\\lambda$?",
          options: ["Ein Vektor mit $A\\vec v=\\vec v$", "Ein Vektor $\\vec v\\neq\\vec 0$ mit $A\\vec v=\\lambda\\vec v$", "Ein Vektor der Länge $\\lambda$", "Die Determinante von $A$"],
          answerIndex: 1,
          explanation: "Ein Eigenvektor wird durch $A$ nur um den Faktor $\\lambda$ gestreckt: $A\\vec v=\\lambda\\vec v$, $\\vec v\\neq\\vec 0$."
        }
      },
      {
        id: "m10-l2",
        title: "Charakteristisches Polynom",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Das charakteristische Polynom ist $\\chi_A(\\lambda)=\\det(A-\\lambda I)$. Seine Nullstellen sind genau die Eigenwerte.",
          "Der Grad von $\\chi_A$ ist $n$ bei einer $n\\times n$-Matrix; über $\\mathbb{C}$ gibt es also genau $n$ Eigenwerte (mit Vielfachheit).",
          "Die algebraische Vielfachheit eines Eigenwerts ist seine Vielfachheit als Nullstelle von $\\chi_A$.",
          "Spur und Determinante liest man ab: $\\operatorname{tr}(A)=\\sum\\lambda_i$ und $\\det A=\\prod\\lambda_i$ (Summe bzw. Produkt über alle Eigenwerte mit Vielfachheit)."
        ],
        example: "$A=\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$: $\\chi_A=\\lambda^2-2\\lambda-3$, Spur $=2=3+(-1)$, $\\det=-3=3\\cdot(-1)$ — beides passt zu den Eigenwerten $3$ und $-1$.",
        exercise: "Bestimme Eigenwerte, Spur und Determinante von $A=\\begin{pmatrix}4&1\\\\2&3\\end{pmatrix}$ über das charakteristische Polynom.",
        hint: "$\\chi_A=(4-\\lambda)(3-\\lambda)-2$; Spur $=a+d$, $\\det=ad-bc$.",
        solution: "$\\chi_A=(4-\\lambda)(3-\\lambda)-2=\\lambda^2-7\\lambda+10=(\\lambda-5)(\\lambda-2)$.\nEigenwerte: $5$ und $2$.\nSpur $=4+3=7=5+2$ ✓. Determinante $=4\\cdot3-1\\cdot2=10=5\\cdot2$ ✓.",
        quiz: {
          question: "Wie findet man die Eigenwerte einer Matrix?",
          options: ["Als Nullstellen des charakteristischen Polynoms $\\det(A-\\lambda I)$", "Als Zeilensummen", "Als Diagonaleinträge", "Als Rang"],
          answerIndex: 0,
          explanation: "Die Eigenwerte sind genau die Nullstellen von $\\chi_A(\\lambda)=\\det(A-\\lambda I)$."
        }
      },
      {
        id: "m10-l3",
        title: "Diagonalisierbarkeit und Vielfachheiten",
        difficulty: "Profi",
        estimatedMinutes: 65,
        theory: [
          "Eine Matrix $A$ heißt diagonalisierbar, wenn es eine invertierbare Matrix $S$ gibt mit $S^{-1}AS=D$ diagonal. Die Diagonaleinträge von $D$ sind die Eigenwerte.",
          "Die geometrische Vielfachheit eines Eigenwerts ist $\\dim E_\\lambda$. Es gilt stets $\\dim E_\\lambda\\leq$ algebraische Vielfachheit.",
          "Satz: $A$ ist genau dann diagonalisierbar, wenn für jeden Eigenwert geometrische und algebraische Vielfachheit übereinstimmen.",
          "Über $\\mathbb{C}$ ist jede Matrix mit $n$ paarweise verschiedenen Eigenwerten diagonalisierbar. Allgemeiner: ist $\\chi_A$ in LA1 zerlegbar und fallen alle Vielfachheiten zusammen, so ist $A$ diagonalisierbar; sonst braucht man LA2 (Trigonalisierung, Jordan-Form)."
        ],
        example: "$A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ hat $\\chi_A=(1-\\lambda)^2$, also Eigenwert $1$ mit algebraischer Vielfachheit $2$. Aber $E_1=\\ker(A-I)=\{\\begin{pmatrix}t\\\\0\\end{pmatrix}\}$ hat Dimension $1$. Also nicht diagonalisierbar.",
        exercise: "Ist $A=\\begin{pmatrix}2&0&0\\\\0&2&0\\\\0&0&3\\end{pmatrix}$ diagonalisierbar?",
        hint: "Eigenwerte ablesen, dann geometrische Vielfachheiten bestimmen.",
        solution: "Eigenwerte: $2$ (alg. Vielfachheit $2$) und $3$ (alg. Vielfachheit $1$).\n$E_2=\\ker(A-2I)$: $A-2I=\\begin{pmatrix}0&0&0\\\\0&0&0\\\\0&0&1\\end{pmatrix}$, also $\\dim E_2=2$. ✓\n$E_3=\\ker(A-3I)$: $\\dim E_3=1$. ✓\nAlle Vielfachheiten stimmen überein, also ist $A$ diagonalisierbar (sie ist bereits diagonal).",
        quiz: {
          question: "Wann ist eine Matrix diagonalisierbar?",
          options: ["Wenn $\\det A\\neq0$", "Wenn geometrische und algebraische Vielfachheit jedes Eigenwerts übereinstimmen", "Wenn sie symmetrisch ist", "Wenn sie den Rang $n$ hat"],
          answerIndex: 1,
          explanation: "Diagonalisierbarkeit liegt genau vor, wenn für jeden Eigenwert $\\dim E_\\lambda$ gleich der algebraischen Vielfachheit ist."
        }
      }
    ]
  },
  {
    id: "mod-11",
    title: "Skalarprodukt und Orthogonalität",
    level: "Profi",
    targetHours: 11,
    goals: [
      "Skalarprodukte definieren und Cauchy-Schwarz anwenden",
      "Orthogonale Projektionen und Gram-Schmidt berechnen",
      "QR-Zerlegung und orthogonale Matrizen nutzen"
    ],
    lessons: [
      {
        id: "m11-l1",
        title: "Skalarprodukt und Cauchy-Schwarz",
        difficulty: "Profi",
        estimatedMinutes: 55,
        theory: [
          "Das Standardskalarprodukt auf $\\mathbb{R}^n$ ist $\\langle\\vec u,\\vec v\\rangle=\\sum_{i=1}^n u_iv_i$. Es liefert eine Zahl (Skalar), keinen Vektor.",
          "Eigenschaften: symmetrisch $\\langle\\vec u,\\vec v\\rangle=\\langle\\vec v,\\vec u\\rangle$, linear im ersten Argument, positiv definit $\\langle\\vec v,\\vec v\\rangle\\geq0$ mit Gleichheit nur für $\\vec v=\\vec 0$.",
          "Die Norm ist $\\lVert\\vec v\\rVert=\\sqrt{\\langle\\vec v,\\vec v\\rangle}$. Zwei Vektoren heißen orthogonal, wenn $\\langle\\vec u,\\vec v\\rangle=0$.",
          "Die Cauchy-Schwarzsche Ungleichung besagt $|\\langle\\vec u,\\vec v\\rangle|\\leq\\lVert\\vec u\\rVert\\,\\lVert\\vec v\\rVert$; damit ist der Winkel $\\cos\\varphi=\\tfrac{\\langle\\vec u,\\vec v\\rangle}{\\lVert\\vec u\\rVert\\lVert\\vec v\\rVert}$ wohldefiniert."
        ],
        example: "$\\langle(1,2),(3,4)\\rangle=1\\cdot3+2\\cdot4=11$. Die Normen sind $\\sqrt5$ und $5$, also ist $11\\leq\\sqrt5\\cdot5\\approx11{,}18$ (Cauchy-Schwarz).",
        exercise: "Berechne $\\langle(2,3),(4,-1)\\rangle$ und prüfe Orthogonalität.",
        hint: "Paarweise multiplizieren und addieren; null bedeutet orthogonal.",
        solution: "$\\langle(2,3),(4,-1)\\rangle=2\\cdot4+3\\cdot(-1)=8-3=5$.\nDa $5\\neq0$, sind die Vektoren nicht orthogonal.",
        quiz: {
          question: "Wann stehen zwei Vektoren orthogonal zueinander?",
          options: ["Wenn sie gleich lang sind", "Wenn ihr Skalarprodukt null ist", "Wenn sie parallel sind", "Wenn ihre Summe null ist"],
          answerIndex: 1,
          explanation: "Orthogonalität heißt $\\langle\\vec u,\\vec v\\rangle=0$ — ein verschwindendes Skalarprodukt."
        }
      },
      {
        id: "m11-l2",
        title: "Projektion und Gram-Schmidt",
        difficulty: "Profi",
        estimatedMinutes: 65,
        theory: [
          "Die orthogonale Projektion von $\\vec v$ auf $\\vec u\\neq\\vec 0$ ist $\\operatorname{proj}_{\\vec u}(\\vec v)=\\tfrac{\\langle\\vec v,\\vec u\\rangle}{\\langle\\vec u,\\vec u\\rangle}\\vec u$. Der Rest $\\vec v-\\operatorname{proj}_{\\vec u}(\\vec v)$ steht senkrecht auf $\\vec u$.",
          "Das Gram-Schmidt-Verfahren macht aus einer Basis $\\vec v_1,\\dots,\\vec v_n$ eine orthogonale Basis $\\vec u_1,\\dots,\\vec u_n$ durch schrittweises Abziehen der Projektionen: $\\vec u_k=\\vec v_k-\\sum_{i<k}\\operatorname{proj}_{\\vec u_i}(\\vec v_k)$.",
          "Normiert man die $\\vec u_i$ noch, erhält man eine Orthonormalbasis $\\vec q_i=\\vec u_i/\\lVert\\vec u_i\\rVert$.",
          "Eine Orthonormalbasis vereinfacht Rechnungen: Koeffizienten sind Skalarprodukte $c_i=\\langle\\vec v,\\vec q_i\\rangle$."
        ],
        example: "Gram-Schmidt auf $(1,0),(1,1)$: $\\vec u_1=(1,0)$; $\\vec u_2=(1,1)-\\operatorname{proj}_{\\vec u_1}(1,1)=(1,1)-(1,0)=(0,1)$. Schon orthonormal.",
        exercise: "Wende Gram-Schmidt auf $\\vec v_1=(1,1)$, $\\vec v_2=(2,0)$ an.",
        hint: "$\\vec u_1=\\vec v_1$; dann $\\vec u_2=\\vec v_2-\\operatorname{proj}_{\\vec u_1}\\vec v_2$.",
        solution: "$\\vec u_1=(1,1)$.\n$\\operatorname{proj}_{\\vec u_1}\\vec v_2=\\tfrac{\\langle(2,0),(1,1)\\rangle}{\\langle(1,1),(1,1)\\rangle}(1,1)=\\tfrac{2}{2}(1,1)=(1,1)$.\n$\\vec u_2=(2,0)-(1,1)=(1,-1)$.\nProbe: $\\langle(1,1),(1,-1)\\rangle=1-1=0$ — orthogonal. ✓\nOrthonormalbasis nach Normierung: $\\tfrac{1}{\\sqrt2}(1,1)$, $\\tfrac{1}{\\sqrt2}(1,-1)$.",
        visualization: {
          type: "vector-plot",
          mode: "dot",
          u: [1, 1],
          v: [2, 0]
        },
        quiz: {
          question: "Was leistet das Gram-Schmidt-Verfahren?",
          options: ["Es diagonalisiert eine Matrix", "Es macht aus einer Basis eine orthogonale Basis", "Es berechnet die Determinante", "Es invertiert eine Matrix"],
          answerIndex: 1,
          explanation: "Gram-Schmidt orthogonalisiert eine Basis durch schrittweises Abziehen der Projektionen."
        }
      },
      {
        id: "m11-l3",
        title: "QR-Zerlegung und orthogonale Matrizen",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Eine Matrix $Q$ mit orthonormalen Spalten heißt orthogonal; es gilt $Q^{\\,T}Q=I$ und damit $Q^{-1}=Q^{\\,T}$.",
          "Die QR-Zerlegung schreibt eine Matrix $A$ (voller Spaltenrang) als $A=QR$ mit orthonormalem $Q$ und oberer Dreiecksmatrix $R$; sie entsteht direkt aus Gram-Schmidt.",
          "Orthogonale Abbildungen erhalten Längen und Winkel: $\\lVert Q\\vec v\\rVert=\\lVert\\vec v\\rVert$ und $\\det Q=\\pm1$.",
          "In $\\mathbb{C}$ ersetzt man Transposition durch Adjungierung $A^*=\\overline{A^{\\,T}}$ und spricht von unitären Matrizen ($U^*U=I$)."
        ],
        example: "Mit $\\vec q_1=\\tfrac{1}{\\sqrt2}(1,1)$, $\\vec q_2=\\tfrac{1}{\\sqrt2}(1,-1)$ ist $Q=\\tfrac{1}{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$ orthogonal, denn $Q^{\\,T}Q=I$.",
        exercise: "Es sei $A=\\begin{pmatrix}1&2\\\\1&0\\end{pmatrix}$. Gib eine QR-Zerlegung an, ausgehend von der orthonormalen Basis $\\vec q_1=\\tfrac{1}{\\sqrt2}(1,1)$, $\\vec q_2=\\tfrac{1}{\\sqrt2}(1,-1)$.",
        hint: "Spalten von $Q$ sind $\\vec q_1,\\vec q_2$; $R=Q^{\\,T}A$.",
        solution: "$Q=\\tfrac{1}{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$.\n$R=Q^{\\,T}A=\\tfrac{1}{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}\\begin{pmatrix}1&2\\\\1&0\\end{pmatrix}=\\tfrac{1}{\\sqrt2}\\begin{pmatrix}2&2\\\\0&2\\end{pmatrix}=\\begin{pmatrix}\\sqrt2&\\sqrt2\\\\0&\\sqrt2\\end{pmatrix}$.\nProbe: $QR=A$. ✓",
        quiz: {
          question: "Was zeichnet eine orthogonale Matrix $Q$ aus?",
          options: ["$Q^{\\,T}Q=I$", "$\\det Q=0$", "$Q$ ist symmetrisch", "$Q$ hat nur positive Einträge"],
          answerIndex: 0,
          explanation: "Ortogonale Matrizen haben $Q^{\\,T}Q=I$, also ist $Q^{-1}=Q^{\\,T}$ — sie erhalten Längen und Winkel."
        }
      }
    ]
  },
  {
    id: "mod-12",
    title: "Struktur von Vektorräumen (LA2)",
    level: "Profi",
    targetHours: 12,
    goals: [
      "Direkte Summen und Quotientenräume bilden",
      "Dualraum und Dualabbildung verstehen",
      "Den Annihilator einsetzen"
    ],
    lessons: [
      {
        id: "m12-l1",
        title: "Direkte Summen und Komplemente",
        difficulty: "Profi",
        estimatedMinutes: 55,
        theory: [
          "Die Summe $U+W=\{\\vec u+\\vec w:\\vec u\\in U,\\vec w\\in W\}$ zweier Unterräume ist wieder ein Unterraum.",
          "Die Summe heißt direkt ($U\\oplus W$), wenn $U\\cap W=\{\\vec 0\}$. Dann ist jeder Vektor eindeutig als $\\vec u+\\vec w$ zerlegbar und $\\dim(U\\oplus W)=\\dim U+\\dim W$.",
          "Ein Komplementärraum $W$ zu $U\\subseteq V$ erfüllt $V=U\\oplus W$. Über Körpern existiert stets ein Komplement (per Basisergänzung); es ist im Allgemeinen nicht eindeutig.",
          "Die Dimensionsformel für beliebige Summen lautet $\\dim(U+W)=\\dim U+\\dim W-\\dim(U\\cap W)$."
        ],
        example: "Im $\\mathbb{R}^3$ mit $U=\{z=0\}$ (Ebene) und $W=\{(0,0,z)\}$ ($z$-Achse) gilt $U\\cap W=\{\\vec0\}$ und $\\mathbb{R}^3=U\\oplus W$.",
        exercise: "Sei $U=\\operatorname{span}\\!\\left(\\begin{pmatrix}1\\\\1\\\\0\\end{pmatrix}\\right)\\subseteq\\mathbb{R}^3$. Gib einen Komplementärraum $W$ an mit $\\mathbb{R}^3=U\\oplus W$.",
        hint: "Ergänze $\\begin{pmatrix}1\\\\1\\\\0\\end{pmatrix}$ zu einer Basis des $\\mathbb{R}^3$; die beiden neuen Vektoren spannen $W$ auf.",
        solution: "Wähle $\\vec e_2'=\\begin{pmatrix}0\\\\1\\\\0\\end{pmatrix}$ und $\\vec e_3=\\begin{pmatrix}0\\\\0\\\\1\\end{pmatrix}$. Die Matrix $\\begin{pmatrix}1&0&0\\\\1&1&0\\\\0&0&1\\end{pmatrix}$ hat Determinante $1\\neq0$, also sind die drei Vektoren eine Basis.\n$W=\\operatorname{span}\\!\\left(\\begin{pmatrix}0\\\\1\\\\0\\end{pmatrix},\\begin{pmatrix}0\\\\0\\\\1\\end{pmatrix}\\right)$ und $\\mathbb{R}^3=U\\oplus W$ (denn $U\\cap W=\{\\vec0\}$, Dimensionen $1+2=3$).",
        quiz: {
          question: "Wann heißt eine Summe $U+W$ direkt?",
          options: ["Wenn $U=W$", "Wenn $U\\cap W=\{\\vec 0\}$", "Wenn $\\dim U=\\dim W$", "Wenn beide null sind"],
          answerIndex: 1,
          explanation: "Direktheit heißt $U\\cap W=\{\\vec 0\}$; dann ist die Zerlegung eindeutig und die Dimensionen addieren sich."
        }
      },
      {
        id: "m12-l2",
        title: "Quotientenräume",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Für einen Unterraum $U\\subseteq V$ definieren wir die Nebenklasse $\\vec v+U=\{\\vec v+\\vec u:\\vec u\\in U\}$. Man rechnet mit Nebenklassen wie mit Vektoren: $(\\vec v+U)+(\\vec w+U)=(\\vec v+\\vec w)+U$ und $\\lambda(\\vec v+U)=\\lambda\\vec v+U$.",
          "Der Quotientenraum $V/U$ ist die Menge aller Nebenklassen; er ist selbst ein Vektorraum mit $\\dim(V/U)=\\dim V-\\dim U$ (für $\\dim V<\\infty$).",
          "Die Quotientenabbildung $\\pi:V\\to V/U$, $\\vec v\\mapsto\\vec v+U$, ist linear und surjektiv mit $\\ker\\pi=U$.",
          "Quotientenräume erlauben es, Information „modulo $U$“ zu betrachten — ein zentrales Werkzeug für die Konstruktion von Normalformen."
        ],
        example: "Ist $V=\\mathbb{R}^2$ und $U$ die $x$-Achse, so fasst $V/U$ Vektoren zusammen, die sich nur in der $y$-Komponente unterscheiden. Jede Nebenklasse ist eine horizontale Gerade; $\\dim(V/U)=1$.",
        exercise: "Bestimme $\\dim(\\mathbb{R}^4/U)$ für $U=\{\\vec x\\in\\mathbb{R}^4:x_1=x_2=x_3=x_4\}$.",
        hint: "Bestimme $\\dim U$ (eine Ursprungsgerade) und nutze $\\dim(V/U)=\\dim V-\\dim U$.",
        solution: "$U=\{\\vec x:t(1,1,1,1):t\\in\\mathbb{R}\}$ ist eine Ursprungsgerade, also $\\dim U=1$.\n$\\dim(\\mathbb{R}^4/U)=4-1=3$.",
        quiz: {
          question: "Was ist $V/U$?",
          options: ["Der Schnitt von $V$ und $U$", "Die Menge der Nebenklassen $\\vec v+U$, ein Vektorraum", "Das Komplement von $U$", "Die Determinante modulo $U$"],
          answerIndex: 1,
          explanation: "$V/U$ besteht aus den Nebenklassen $\\vec v+U$ und ist ein Vektorraum mit $\\dim V-\\dim U$ (endlichdimensional)."
        }
      },
      {
        id: "m12-l3",
        title: "Dualraum und Dualabbildung",
        difficulty: "Profi",
        estimatedMinutes: 65,
        theory: [
          "Der Dualraum $V^*=\\operatorname{Hom}(V,K)$ ist die Menge aller linearen Abbildungen $\\varphi:V\\to K$ (Linearformen). Er ist selbst ein Vektorraum.",
          "Ist $B=(\\vec b_1,\\dots,\\vec b_n)$ eine Basis, so ist die duale Basis $B^*=(\\vec b_1^*,\\dots,\\vec b_n^*)$ definiert durch $\\vec b_i^*(\\vec b_j)=\\delta_{ij}$. Damit ist $\\dim V^*=\\dim V$ (endlichdimensional).",
          "Zu linearem $f:V\\to W$ ist die Dualabbildung $f^*:W^*\\to V^*$ definiert durch $f^*(\\varphi)=\\varphi\\circ f$. Sie kehrt die Richtung um.",
          "Der Annihilator einer Menge $M\\subseteq V$ ist $M^\\circ=\{\\varphi\\in V^*:\\varphi(\\vec v)=0\\;\\forall\\vec v\\in M\}$ — ein Unterraum von $V^*$ mit $\\dim M^\\circ=\\dim V-\\dim\\operatorname{span}(M)$."
        ],
        example: "Zur Standardbasis $\\vec e_1,\\vec e_2$ des $\\mathbb{R}^2$ ist $\\vec e_1^*(x,y)=x$ und $\\vec e_2^*(x,y)=y$ — die Projektionen auf die Koordinaten.",
        exercise: "Sei $V=\\mathbb{R}^2$ und $\\varphi(x,y)=2x-y\\in V^*$. Gib $\\varphi$ als Linearkombination der dualen Standardbasis an.",
        hint: "Die duale Standardbasis ist $\\vec e_1^*(x,y)=x$, $\\vec e_2^*(x,y)=y$.",
        solution: "$\\varphi(x,y)=2x-y=2\\,\\vec e_1^*(x,y)-1\\,\\vec e_2^*(x,y)$.\nAlso $\\varphi=2\\vec e_1^*-\\vec e_2^*$ in der dualen Standardbasis.",
        quiz: {
          question: "Was ist der Dualraum $V^*$?",
          options: ["Die Menge der Vektoren in $V$", "Die Menge der linearen Abbildungen $V\\to K$", "Das Komplement von $V$", "Die Inverse von $V$"],
          answerIndex: 1,
          explanation: "$V^*=\\operatorname{Hom}(V,K)$ umfasst alle Linearformen auf $V$; endlichdimensional ist $\\dim V^*=\\dim V$."
        }
      }
    ]
  },
  {
    id: "mod-13",
    title: "Normalformen von Endomorphismen (LA2)",
    level: "Profi",
    targetHours: 14,
    goals: [
      "Invariante Unterräume und Cayley-Hamilton nutzen",
      "Minimalpolynom und seine Beziehung zum charakteristischen Polynom",
      "Jordan-Normalform und rationale Normalform bestimmen"
    ],
    lessons: [
      {
        id: "m13-l1",
        title: "Invariante Unterräume und Cayley-Hamilton",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Ein Unterraum $U\\subseteq V$ heißt $f$-invariant, wenn $f(U)\\subseteq U$. Dann restrictiert $f$ zu einem Endomorphismus $f|_U:U\\to U$.",
          "Eigenräume sind invariant; allgemeiner sind die Haupträume $\\ker(f-\\lambda\\,\\mathrm{id})^k$ invariant und wachsen mit $k$ bis zur algebraischen Vielfachheit.",
          "Satz von Cayley-Hamilton: jedes Endomorphismus erfüllt sein charakteristisches Polynom, d. h. $\\chi_A(A)=0$ als Matrixgleichung.",
          "Folgerung: das Minimalpolynom $m_A$ teilt das charakteristische Polynom $\\chi_A$, und beide haben dieselben Nullstellen (dieselben Eigenwerte).",
          "Beweis-Skizze (über $\\mathbb{C}$, bei diagonalisierbarem $A$): ist $A=SDS^{-1}$ mit $D=\\operatorname{diag}(\\lambda_1,\\dots,\\lambda_n)$, so ist $\\chi_A(A)=S\\,\\chi_A(D)\\,S^{-1}$. Da $\\chi_A(D)=\\operatorname{diag}(\\chi_A(\\lambda_1),\\dots,\\chi_A(\\lambda_n))=0$ (jeder Eigenwert nullt sein eigenes Polynom), folgt $\\chi_A(A)=0$. Den allgemeinen Fall erhält man durch Dichtheit der diagonalisierbaren Matrizen oder über Triangularisierung: $A=TDT^{-1}$ obere Dreiecksmatrix, dann steht $\\chi_A(A)$ selbst in Dreiecksgestalt mit Null-Diagonale, ist also nilpotent und insgesamt null.",
          "Kürzer: das Polynom $t\\mapsto\\chi_A(t)$ annulliert $A$ per Definition des Minimalpolynoms — Cayley-Hamilton besagt, dass $\\chi_A$ ein annullierendes Polynom ist, also $m_A\\mid\\chi_A$."
        ],
        example: "Für $A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ ist $\\chi_A=(\\lambda-1)^2$ und $\\chi_A(A)=(A-I)^2=\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}^2=0$. Cayley-Hamilton bestätigt.",
        exercise: "Bestätige Cayley-Hamilton für $A=\\begin{pmatrix}2&1\\\\0&3\\end{pmatrix}$.",
        hint: "Berechne $\\chi_A(\\lambda)=(2-\\lambda)(3-\\lambda)$ und werte $\\chi_A(A)=(2I-A)(3I-A)$ aus.",
        solution: "$\\chi_A=(2-\\lambda)(3-\\lambda)=\\lambda^2-5\\lambda+6$.\n$A^2=\\begin{pmatrix}2&1\\\\0&3\\end{pmatrix}^2=\\begin{pmatrix}4&5\\\\0&9\\end{pmatrix}$.\n$\\chi_A(A)=A^2-5A+6I=\\begin{pmatrix}4&5\\\\0&9\\end{pmatrix}-5\\begin{pmatrix}2&1\\\\0&3\\end{pmatrix}+6\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}=\\begin{pmatrix}4-10+6&5-5+0\\\\0&9-15+6\\end{pmatrix}=\\begin{pmatrix}0&0\\\\0&0\\end{pmatrix}$. ✓",
        quiz: {
          question: "Was besagt der Satz von Cayley-Hamilton?",
          options: ["$\\det A=0$", "Jede Matrix erfüllt ihr charakteristisches Polynom: $\\chi_A(A)=0$", "$A$ ist diagonalisierbar", "Das Minimalpolynom ist konstant"],
          answerIndex: 1,
          explanation: "Setzt man die Matrix $A$ in ihr eigenes charakteristisches Polynom ein, so erhält man die Nullmatrix."
        }
      },
      {
        id: "m13-l2",
        title: "Minimalpolynom",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Das Minimalpolynom $m_A$ ist das normierte Polynom kleinsten Grades mit $m_A(A)=0$. Es teilt jedes Polynom $p$ mit $p(A)=0$, insbesondere $\\chi_A$.",
          "Eigenwerte sind genau die Nullstellen von $m_A$, und die Vielfachheit von $\\lambda$ in $m_A$ ist die Größe des größten Jordan-Kästchens zu $\\lambda$.",
          "Kriterium: $A$ ist genau dann diagonalisierbar, wenn $m_A$ in paarweise verschiedene Linearfaktoren zerfällt.",
          "Teilen sich $\\chi_A$ und $m_A$ die Vielfachheiten, so heißt $A$ zyklisch; dann ist die rationale Normalform besonders einfach."
        ],
        example: "Für $A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ ist $\\chi_A=(\\lambda-1)^2$ und $m_A=(\\lambda-1)^2$ (denn $A-I\\neq0$). Da $m_A$ einen mehrfachen Faktor hat, ist $A$ nicht diagonalisierbar.",
        exercise: "Bestimme Minimal- und charakteristisches Polynom von $A=\\begin{pmatrix}2&0&0\\\\0&2&1\\\\0&0&2\\end{pmatrix}$ und entscheide über Diagonalisierbarkeit.",
        hint: "Eigenwert $2$; prüfe $(A-2I)$ und $(A-2I)^2$.",
        solution: "Eigenwert: $\\lambda=2$ mit algebraischer Vielfachheit $3$.\n$A-2I=\\begin{pmatrix}0&0&0\\\\0&0&1\\\\0&0&0\\end{pmatrix}\\neq0$, also $m_A\\neq(\\lambda-2)$.\n$(A-2I)^2=0$, also $m_A=(\\lambda-2)^2$.\n$\\chi_A=(\\lambda-2)^3$.\nDa $m_A$ einen mehrfachen Linearfaktor hat, ist $A$ nicht diagonalisierbar.",
        quiz: {
          question: "Wann ist $A$ diagonalisierbar (über das Minimalpolynom formuliert)?",
          options: ["Wenn $m_A$ konstant ist", "Wenn $m_A$ in paarweise verschiedene Linearfaktoren zerfällt", "Wenn $\\deg m_A=n$", "Wenn $m_A=\\chi_A$"],
          answerIndex: 1,
          explanation: "Diagonalisierbarkeit ist äquivalent dazu, dass das Minimalpolynom nur einfache Linearfaktoren hat."
        }
      },
      {
        id: "m13-l3",
        title: "Jordan-Normalform und rationale Normalform",
        difficulty: "Profi",
        estimatedMinutes: 70,
        theory: [
          "Die Jordan-Normalform ist ein zentrales Thema der Linearen Algebra 2 in Freiburg; typische Klausuraufgaben (siehe LA2-Altklausuren der Fachschaft) verlangen, aus charakteristischem und Minimalpolynom die Kästchenstruktur abzulesen.",
          "Über einem algebraisch abgeschlossenen Körper (z. B. $\\mathbb{C}$) ist jede Matrix ähnlich zu einer Blockdiagonalmatrix aus Jordan-Kästchen $J_k(\\lambda)=\\begin{pmatrix}\\lambda&1&&\\\\&\\lambda&\\ddots&\\\\&&\\ddots&1\\\\&&&\\lambda\\end{pmatrix}$ — der Jordan-Normalform.",
          "Pro Eigenwert $\\lambda$ gibt es so viele Jordan-Kästchen wie die geometrische Vielfachheit $\\dim E_\\lambda$; die Summe der Kästchengrößen ist die algebraische Vielfachheit.",
          "Das größte Kästchen zu $\\lambda$ hat die Größe gleich der Vielfachheit von $\\lambda$ im Minimalpolynom.",
          "Ist der Körper nicht algebraisch abgeschlossen (oder will man rein rational arbeiten), liefert die rationale (Frobenius-)Normalform Begleitmatrizen der irreduziblen Faktoren — sie existiert über jedem Körper."
        ],
        example: "$A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ ist schon ein Jordan-Kästchen $J_2(1)$. Die Jordan-Normalform ist $A$ selbst.",
        exercise: "Gib die Jordan-Normalform einer $3\\times3$-Matrix mit Eigenwert $\\lambda=5$, algebraischer Vielfachheit $3$ und geometrischer Vielfachheit $2$ an.",
        hint: "Anzahl Kästchen $=$ geometrische Vielfachheit $=2$; ihre Größen summieren sich zur algebraischen Vielfachheit $3$. Welche zwei positiven Zahlen summieren sich zu $3$?",
        solution: "Anzahl Jordan-Kästchen $=$ geometrische Vielfachheit $=2$. Ihre Größen summieren sich zur algebraischen Vielfachheit $3$. Die einzige Möglichkeit mit zwei positiven Kästchengrößen ist $2+1$.\nJordan-Normalform: $J=\\begin{pmatrix}5&1&0\\\\0&5&0\\\\0&0&5\\end{pmatrix}$ (ein $J_2(5)$ und ein $J_1(5)$).\nAm Rande: das größte Kästchen hat Größe $2$, daher wäre die Vielfachheit von $5$ im (hier nicht gegebenen) Minimalpolynom ebenfalls $2$.",
        quiz: {
          question: "Wie viele Jordan-Kästchen gehören zu einem Eigenwert $\\lambda$?",
          options: ["Die algebraische Vielfachheit", "Die geometrische Vielfachheit $\\dim E_\\lambda$", "Den Rang", "Die Determinante"],
          answerIndex: 1,
          explanation: "Die Anzahl der Jordan-Kästchen zu $\\lambda$ ist die geometrische Vielfachheit; ihre Größen summieren sich zur algebraischen."
        }
      }
    ]
  },
  {
    id: "mod-14",
    title: "Bilinearformen und Geometrie (LA2)",
    level: "Profi",
    targetHours: 13,
    goals: [
      "Bilinear- und Sesquilinearformen mit Darstellungsmatrix beschreiben",
      "Symmetrische Formen, Signatur und den Satz von Sylvester anwenden",
      "Orthogonale, unitäre und symplektische Gruppen einordnen"
    ],
    lessons: [
      {
        id: "m14-l1",
        title: "Bilinear- und Sesquilinearformen",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Eine Bilinearform auf $V$ ist eine Abbildung $b:V\\times V\\to K$, die in jedem Argument linear ist: $b(\\lambda\\vec u+\\mu\\vec v,\\vec w)=\\lambda b(\\vec u,\\vec w)+\\mu b(\\vec v,\\vec w)$ und entsprechend im zweiten.",
          "Ist $B$ eine Basis, so ist $A=(b(\\vec b_i,\\vec b_j))$ die Darstellungsmatrix, und $b(\\vec x,\\vec y)=\\vec x^{\\,T}A\\vec y$ in Koordinaten. Bei Basiswechsel transformiert sich $A\\mapsto S^{\\,T}AS$.",
          "Eine Sesquilinearform über $\\mathbb{C}$ ist im ersten Argument semilinear (komplex-konjugiert linear) und im zweiten linear; ihre Darstellung ist $b(\\vec x,\\vec y)=\\vec x^*A\\vec y$.",
          "Die Form heißt symmetrisch (bzw. hermitesch), wenn $b(\\vec x,\\vec y)=b(\\vec y,\\vec x)$ (bzw. $=\\overline{b(\\vec y,\\vec x)}$); dann ist $A=A^{\\,T}$ (bzw. $A=A^*$)."
        ],
        example: "Das Standardskalarprodukt auf $\\mathbb{R}^n$ ist die Bilinearform mit Darstellungsmatrix $I$. Auf $\\mathbb{C}^n$ ist das Standardskalarprodukt hermitesch mit $A=I$.",
        exercise: "Bestimme die Darstellungsmatrix von $b(\\vec x,\\vec y)=2x_1y_1+x_1y_2+x_2y_1+3x_2y_2$ bezüglich der Standardbasis.",
        hint: "Eintrag $a_{ij}=b(\\vec e_i,\\vec e_j)$.",
        solution: "$a_{11}=b(\\vec e_1,\\vec e_1)=2$, $a_{12}=b(\\vec e_1,\\vec e_2)=1$, $a_{21}=b(\\vec e_2,\\vec e_1)=1$, $a_{22}=b(\\vec e_2,\\vec e_2)=3$.\n$A=\\begin{pmatrix}2&1\\\\1&3\\end{pmatrix}$. Symmetrisch, da $a_{12}=a_{21}$.",
        quiz: {
          question: "Wie transformiert sich die Darstellungsmatrix $A$ einer Bilinearform bei Basiswechsel $S$?",
          options: ["$A\\mapsto S^{-1}AS$", "$A\\mapsto S^{\\,T}AS$", "$A\\mapsto SAS^{-1}$", "$A\\mapsto A$"],
          answerIndex: 1,
          explanation: "Bilinearformen transformieren kongruent: $A\\mapsto S^{\\,T}AS$ (im Gegensatz zur Ähnlichkeit $S^{-1}AS$)."
        }
      },
      {
        id: "m14-l2",
        title: "Signatur und Satz von Sylvester",
        difficulty: "Profi",
        estimatedMinutes: 65,
        theory: [
          "Eine symmetrische Bilinearform kann man diagonalisieren: es gibt eine Basis mit $b(\\vec x,\\vec y)=\\lambda_1 x_1y_1+\\dots+\\lambda_nx_ny_n$.",
          "Sylvesterscher Trägheitssatz: die Anzahlen $p$ positiver, $q$ negativer und $r$ null-freier Diagonalkoeffizienten sind invariant — unabhängig von der Diagonalisierung.",
          "Das Tripel $(p,q,r)$ heißt Signatur; $(p,q)$ kennzeichnet die Form bis auf Kongruenz. Rang $=p+q$.",
          "Eine Form ist positiv definit, wenn $q=0$ und $r=0$ — dann ist sie ein Skalarprodukt. Das Hauptachsenverfahren diagonalisiert reellsymmetrische Matrizen orthogonal.",
          "Bilinearformen und der Trägheitssatz gehören zum Kern von Lineare Algebra 2; in Freiburger Klausuren (siehe LA2-Altklausuren der Fachschaft) werden häufig Signatur und Diagonalisierung einer Form verlangt.",
          "Beweis-Skizze des Trägheitssatzes: sei $V=V_+\\oplus V_-\\oplus V_0$ eine Diagonalisierung mit $\\dim V_+=p$, $\\dim V_-=q$ ($b$ positiv/negativ definit auf den Summanden) und $V_0$ dem Radikal. Für eine andere Diagonalisierung mit $p'$ gilt $p\\leq p'$: auf $V_+\\oplus V_+'$ ist $b$ positiv semidefinit, und $V_+\\cap(V_+'\\oplus V_0')=\{0\}$ liefert $\\dim V_+\\leq\\dim V_+'$. Symmetrie ergibt $p=p'$, analog $q=q'$, und $r=n-p-q$."
        ],
        example: "$A=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$ hat Signatur $(1,1,0)$: ein positiver, ein negativer Koeffizient. Das ist die Minkowski-Form der speziellen Relativitätstheorie.",
        exercise: "Bestimme die Signatur von $b$ mit Darstellungsmatrix $A=\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$.",
        hint: "Diagonalisiere per Vervollständigung des Quadrats oder konkretes Kongruenzverfahren.",
        solution: "Vervollständige das Quadrat: $x_1^2+4x_1x_2+x_2^2=(x_1+2x_2)^2-3x_2^2$.\nAlso Diagonaldarstellung mit Koeffizienten $1$ und $-3$: ein positives, ein negatives.\nSignatur $(1,1,0)$, Rang $2$.",
        quiz: {
          question: "Was besagt der Satz von Sylvester (Trägheitssatz)?",
          options: ["Die Determinante ist invariant", "Die Anzahlen positiver/negativer/null-freier Diagonalkoeffizienten sind invariant", "Jede Matrix ist diagonalisierbar", "Der Rang ist null"],
          answerIndex: 1,
          explanation: "Die Signatur $(p,q,r)$ ist unabhängig von der gewählten Diagonalisierung — das macht sie zur Kongruenz-Invariante."
        }
      },
      {
        id: "m14-l3",
        title: "Klassische Gruppen und selbstadjungierte Operatoren",
        difficulty: "Profi",
        estimatedMinutes: 65,
        theory: [
          "Die orthogonale Gruppe $O_n=\{Q\\in\\mathbb{R}^{n\\times n}:Q^{\\,T}Q=I\}$ erhält das Standardskalarprodukt; $\\det Q=\\pm1$. Die $SO_n$ hat Determinante $1$.",
          "Die unitäre Gruppe $U_n=\{U\\in\\mathbb{C}^{n\\times n}:U^*U=I\}$ erhält das hermitesche Skalarprodukt. Die symplektische Gruppe $Sp_{2n}$ erhält eine nicht-ausgeartete schiefe Form.",
          "Zu einem Endomorphismus $f$ auf einem Skalarproduktraum ist der Adjungierte $f^*$ durch $\\langle f\\vec x,\\vec y\\rangle=\\langle\\vec x,f^*\\vec y\\rangle$ definiert; in Orthonormalbasis ist die Matrix die Adjungierte (transponiert/konjugiert).",
          "Ein Operator heißt selbstadjungiert ($f=f^*$, hermitesch) bzw. normal ($ff^*=f^*f$). Der Spektralsatz: selbstadjungierte Operatoren sind orthonormal diagonalisierbar mit reellen Eigenwerten."
        ],
        example: "Eine reelle symmetrische Matrix ist selbstadjungiert; nach dem Spektralsatz gibt es ein orthogonales $Q$ mit $Q^{\\,T}AQ=D$ diagonal. Etwa $A=\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$ hat Eigenwerte $3,-1$ und orthonormale Eigenvektoren $\\tfrac{1}{\\sqrt2}(1,1)$, $\\tfrac{1}{\\sqrt2}(1,-1)$.",
        exercise: "Ist $A=\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$ normal? Begründe über $AA^{\\,T}$ und $A^{\\,T}A$.",
        hint: "Berechne $A^{\\,T}=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$ und vergleiche $AA^{\\,T}$ mit $A^{\\,T}A$.",
        solution: "$AA^{\\,T}=\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}$.\n$A^{\\,T}A=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}$.\nEs gilt $AA^{\\,T}=A^{\\,T}A=I$, also ist $A$ normal (sogar orthogonal).",
        quiz: {
          question: "Was besagt der Spektralsatz für selbstadjungierte Operatoren?",
          options: ["Sie sind nie diagonalisierbar", "Sie sind orthonormal diagonalisierbar mit reellen Eigenwerten", "Sie haben nur komplexe Eigenwerte", "Ihre Determinante ist null"],
          answerIndex: 1,
          explanation: "Selbstadjungierte (hermitesche) Operatoren lassen sich orthonormal diagonalisieren; alle Eigenwerte sind reell."
        }
      }
    ]
  },
  {
    id: "mod-15",
    title: "Moduln über Hauptidealringen (LA2)",
    level: "Profi",
    targetHours: 13,
    goals: [
      "Ringe, Ideale und Moduln als Verallgemeinerung von Vektorräumen verstehen",
      "Freie Moduln und den Struktursatz über Hauptidealringen anwenden",
      "Normalformen als Modul-Quotient über $K[x]$ interpretieren"
    ],
    lessons: [
      {
        id: "m15-l1",
        title: "Ringe und Ideale",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Ein Ring $R$ ist eine Menge mit Addition und Multiplikation, wobei die Addition eine abelsche Gruppe bildet, die Multiplikation assoziativ ist und das Distributivgesetz gilt. Besitzt die Multiplikation ein Einselement, heißt $R$ Ring mit Eins.",
          "Beispiele: $\\mathbb{Z}$, $K[x]$ (Polynomring über einem Körper), $\\mathbb{Z}/n\\mathbb{Z}$. Ein Körper ist ein Ring, in dem jedes von null verschiedene Element invertierbar ist.",
          "Ein Ideal $I\\subseteq R$ ist eine additive Untergruppe mit $rI\\subseteq I$ für alle $r\\in R$. Das von $a$ erzeugte Hauptideal ist $(a)=aR$.",
          "Ein Integritätsring heißt Hauptidealring (HIR), wenn jedes Ideal ein Hauptideal ist. $\\mathbb{Z}$ und $K[x]$ sind Hauptidealringe; in ihnen gibt es eine Division mit Rest."
        ],
        example: "In $R=\\mathbb{Z}$ ist $(6)=6\\mathbb{Z}=\{\\dots,-12,-6,0,6,12,\\dots\}$ ein Hauptideal. In $K[x]$ ist $(x^2+1)$ das Ideal aller Vielfachen von $x^2+1$.",
        exercise: "Begründe, warum $I=\{2a+3b:a,b\\in\\mathbb{Z}\}$ ein Hauptideal in $\\mathbb{Z}$ ist.",
        hint: "Zeige $I=(d)$ für einen Erzeuger $d=\\operatorname{ggT}(2,3)$.",
        solution: "$I$ ist die Menge aller Linearkombinationen von $2$ und $3$. Da $\\operatorname{ggT}(2,3)=1$ und sich $1$ als $2\\cdot(-1)+3\\cdot1=1$ schreiben lässt, ist $1\\in I$, also $I=\\mathbb{Z}=(1)$.\nDaher ist $I$ das Hauptideal $(1)$.",
        quiz: {
          question: "Was ist ein Hauptidealring?",
          options: ["Ein Ring, in dem jedes Ideal ein Hauptideal ist", "Ein Ring ohne Eins", "Ein Körper", "Ein Ring mit nur einem Element"],
          answerIndex: 0,
          explanation: "In einem Hauptidealring ist jedes Ideal von einem einzigen Element erzeugt, z. B. $\\mathbb{Z}$ oder $K[x]$."
        }
      },
      {
        id: "m15-l2",
        title: "Moduln und der Struktursatz",
        difficulty: "Profi",
        estimatedMinutes: 65,
        theory: [
          "Ein $R$-Modul $M$ verallgemeinert den Vektorraum: die Skalare stammen aus einem Ring $R$ statt aus einem Körper. Damit entfallen Divisionen — Moduln sind deutlich flexibler.",
          "Beispiel: $\\mathbb{Z}^n$ ist ein $\\mathbb{Z}$-Modul; jedes $\\mathbb{Z}$-Modul ist eine abelsche Gruppe. Ein freier Modul hat eine Basis (wie ein Vektorraum).",
          "Struktursatz über Hauptidealringen: jeder endlich erzeugte Modul über einem HIR ist isomorph zu $R^r\\oplus R/(d_1)\\oplus\\dots\\oplus R/(d_k)$ mit $d_1\\mid d_2\\mid\\dots\\mid d_k$.",
          "Die $d_i$ heißen Elementarteiler; sie sind bis auf Einheiten eindeutig. Dieser Satz vereint die Klassifikation endlich erzeugter abelscher Gruppen und die Normalformen-Sätze der Linearen Algebra.",
          "Beweis-Skizze: Wähle eine surjektive Abbildung $\\varphi:R^n\\to M$ (möglich, da $M$ endlich erzeugt). Ihr Kern $\\ker\\varphi$ ist ein Untermodul von $R^n$; über einem HIR ist jeder Untermodul von $R^n$ endlich erzeugt, etwa $\\ker\\varphi=A\\cdot R^m$. Mit dem Elementarteiler-Satz (Smith-Algorithmus: Zeilen-/Spaltenoperationen via ggT) bringt man die Matrix $A$ in Diagonalform $\\operatorname{diag}(d_1,\\dots,d_k,0,\\dots,0)$ mit $d_1\\mid\\dots\\mid d_k$. Der Isomorphiesatz liefert $M\\cong R^n/\\operatorname{Bild}(A)\\cong R^r\\oplus R/(d_1)\\oplus\\dots\\oplus R/(d_k)$. Die Eindeutigkeit folgt aus der Invarianz der Determinantenideale $(d_1\\cdots d_j)$."
        ],
        example: "Endlich erzeugte abelsche Gruppen sind $\\mathbb{Z}$-Moduln. Der chinesische Restsatz zerlegt $\\mathbb{Z}/6\\mathbb{Z}\\cong\\mathbb{Z}/2\\mathbb{Z}\\oplus\\mathbb{Z}/3\\mathbb{Z}$, weil $6=2\\cdot3$ mit teilerfremden Faktoren. In invariant-Faktor-Form ($d_1\\mid d_2$) ist $\\mathbb{Z}/6\\mathbb{Z}$ hingegen bereits zyklisch mit $d_1=6$ — zwei verschiedene Normalformen derselben Gruppe.",
        exercise: "Zerlege $\\mathbb{Z}/12\\mathbb{Z}$ nach dem chinesischen Restsatz in eine direkte Summe und gib zusätzlich die invariant-Faktor-Form an.",
        hint: "CRT: $12=4\\cdot3$ mit $\\operatorname{ggT}(4,3)=1$. Invariant-Faktor-Form: ein einzelner Teiler $d_1$.",
        solution: "Chinesischer Restsatz (Primteiler-Zerlegung in teilerfremde Faktoren): da $12=4\\cdot3$ mit $\\operatorname{ggT}(4,3)=1$, gilt\n$\\mathbb{Z}/12\\mathbb{Z}\\cong\\mathbb{Z}/4\\mathbb{Z}\\oplus\\mathbb{Z}/3\\mathbb{Z}$.\nInvariant-Faktor-Form ($d_1\\mid d_2\\mid\\dots$): $\\mathbb{Z}/12\\mathbb{Z}$ ist zyklisch, hat also nur einen invarianten Faktor $d_1=12$.\nBeide Beschreibungen sind korrekt — sie sind nur verschiedene Normalformen derselben Gruppe. Die CRT-Form nutzt teilerfremde Zerlegung (Prim potenz-Anteile), die invariant-Faktor-Form die Teilbarkeitskette.",
        quiz: {
          question: "Was verallgemeinert der Begriff „Modul“ gegenüber dem Vektorraum?",
          options: ["Die Skalare stammen aus einem Ring statt einem Körper", "Es gibt keine Addition", "Es gibt nur endlich viele Vektoren", "Es gibt keine Null"],
          answerIndex: 0,
          explanation: "Ein Modul ist wie ein Vektorraum, aber mit Skalaren aus einem Ring — damit entfällt die Division."
        }
      },
      {
        id: "m15-l3",
        title: "Normalformen als Modul über K[x]",
        difficulty: "Profi",
        estimatedMinutes: 70,
        theory: [
          "Fixiert ein Endomorphismus $f$ auf $V$ die Wirkung von $x$, so wird $V$ zu einem $K[x]$-Modul mit $x\\cdot\\vec v=f(\\vec v)$. Da $K[x]$ ein Hauptidealring ist, greift der Struktursatz.",
          "Die Elementarteiler dieses $K[x]$-Moduls sind genau die invarianten Teiler von $f$; aus ihnen liest man die rationale Normalform ab.",
          "Zerlegt man stattdessen in Prim potenz-Anteile (Elementarteiler $p(x)^e$), so erhält man die Jordan-Normalform (für $p(x)=x-\\lambda$).",
          "Damit werden Jordan- und rationale Normalform zu Spezialfällen eines einzigen Satzes — ein Höhepunkt der Linearen Algebra, der LA1 und LA2 verbindet."
        ],
        example: "Ist $\\chi_A=(x-\\lambda_1)^2(x-\\lambda_2)$ mit Minimalpolynom $(x-\\lambda_1)^2(x-\\lambda_2)$, so ist der $K[x]$-Modul $V\\cong K[x]/((x-\\lambda_1)^2)\\oplus K[x]/(x-\\lambda_2)$ — ein $J_2(\\lambda_1)$-Kästchen und ein $J_1(\\lambda_2)$-Kästchen.",
        exercise: "Ein $3\\times3$-Endomorphismus habe Minimalpolynom $(x-2)^2$ und charakteristisches Polynom $(x-2)^3$. Welche Jordan-Normalform entspricht dem $K[x]$-Modul?",
        hint: "Ein Elementarteiler $(x-2)^2$ und einer $(x-2)^1$; Kästchengrößen $2$ und $1$.",
        solution: "Aus $m_A=(x-2)^2$ und $\\chi_A=(x-2)^3$ folgen die Elementarteiler $(x-2)^2$ und $(x-2)^1$.\nAls $K[x]$-Modul: $V\\cong K[x]/((x-2)^2)\\oplus K[x]/(x-2)$.\nJordan-Normalform: ein Kästchen $J_2(2)$ und ein Kästchen $J_1(2)$, also $J=\\begin{pmatrix}2&1&0\\\\0&2&0\\\\0&0&2\\end{pmatrix}$.",
        quiz: {
          question: "Welcher Satz vereinheitlicht Jordan- und rationale Normalform?",
          options: ["Der Satz von Sylvester", "Der Struktursatz für Moduln über Hauptidealringen", "Der Rang-Nullitätssatz", "Der Fundamentalsatz der Algebra"],
          answerIndex: 1,
          explanation: "Über $K[x]$ als Hauptidealring liefert der Struktursatz die invarianten Teiler (rationale Form) bzw. Elementarteiler (Jordan-Form) in einem Abwaschgang."
        }
      }
    ]
  },
  {
    id: "mod-16",
    title: "Freiburg: Klausurtraining",
    level: "Profi",
    targetHours: 12,
    goals: [
      "Typische LA1-Klausuraufgaben sicher erkennen",
      "Typische LA2-Klausuraufgaben lösen",
      "Prüfungsstrategie und Freiburg-Dozentenbezug nutzen"
    ],
    lessons: [
      {
        id: "m16-l1",
        title: "Typische LA1-Aufgaben",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Lineare Algebra 1 in Freiburg prüft klassisch: Gauß-Verfahren auf einem LGS, Bestimmung von Rang und Lösbarkeit, lineare (Un-)Abhängigkeit und Basen.",
          "Häufig sind Endomorphismen gegeben mit den Aufgaben: Eigenwerte berechnen, Diagonalisierbarkeit prüfen, gegebenenfalls eine Basis wechseln.",
          "Determinantenaufgaben verlangen oft Kofaktorentwicklung und Rechenregeln; Skalarprodukt-Aufgaben testen Projektion, Gram-Schmidt und orthogonale Matrizen.",
          "Strategie: zuerst Übersicht verschaffen, welche Konzepte verlangt sind; dann Standardschritte (charakteristisches Polynom, Gauß, Basiswechsel) der Reihe nach aufschreiben. Saubere Notation bewahrt Punkte."
        ],
        example: "Ein LA1-Klassiker: zu $A=\\begin{pmatrix}2&1\\\\0&2\\end{pmatrix}$ Eigenwerte, Eigenräume und Diagonalisierbarkeit bestimmen. Lösung: Eigenwert $2$ (alg. Vielfachheit $2$), Eigenraum $E_2=\\operatorname{span}(1,0)^{\\,T}$, geometrische Vielfachheit $1<2$, also nicht diagonalisierbar.",
        exercise: "Gegeben $A=\\begin{pmatrix}3&1\\\\0&3\\end{pmatrix}$. Bestimme Eigenwerte, Eigenräume und entscheide über Diagonalisierbarkeit wie in einer Klausur.",
        hint: "Charakteristisches Polynom, dann $(A-\\lambda I)\\vec v=\\vec 0$ lösen und Vielfachheiten vergleichen.",
        solution: "$\\chi_A=(3-\\lambda)^2$, Eigenwert $\\lambda=3$ (algebraische Vielfachheit $2$).\n$A-3I=\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}$, also $E_3=\\ker(A-3I)=\\operatorname{span}\\!\\begin{pmatrix}1\\\\0\\end{pmatrix}$, geometrische Vielfachheit $1$.\nDa $1<2$, ist $A$ nicht diagonalisierbar. (Jordan-Normalform: $J_2(3)$.)",
        quiz: {
          question: "Was ist ein typischer erster Schritt in einer LA1-Eigenwertaufgabe?",
          options: ["Determinante aller Einträge berechnen", "Das charakteristische Polynom $\\det(A-\\lambda I)$ aufstellen", "Die Inverse berechnen", "Gauß auf der rechten Seite"],
          answerIndex: 1,
          explanation: "Eigenwerte sind die Nullstellen von $\\chi_A(\\lambda)=\\det(A-\\lambda I)$ — das ist der Standardstart."
        }
      },
      {
        id: "m16-l2",
        title: "Typische LA2-Aufgaben",
        difficulty: "Profi",
        estimatedMinutes: 65,
        theory: [
          "Lineare Algebra 2 in Freiburg prüft: Jordan-Normalform (Kästchen bestimmen, Minimalpolynom ablesen), rationale Normalform, invariante Unterräume.",
          "Bilinearformen-Aufgaben verlangen: Darstellungsmatrix, Signatur nach Sylvester, Diagonalisierung der Form, Klassifikation (positiv definit?).",
          "Moduln und Dualraum: Quotientenräume berechnen, Dualabbildung angeben, Annihilator bestimmen, endlich erzeugte Moduln über Hauptidealringen klassifizieren.",
          "Strategie: zuerst das Minimalpolynom bestimmen — es liefert Kästchengrößen und Vielfachheiten auf einen Blick. Bei Bilinearformen die Signatur als invarianten Fingerabdruck nutzen."
        ],
        example: "Eine LA2-Aufgabe: zu $A$ mit $\\chi_A=(x-1)^3(x-2)$ und $m_A=(x-1)^2(x-2)$ die Jordan-Normalform angeben. Lösung: zum Eigenwert $1$ ein $J_2(1)$ und ein $J_1(1)$, zum Eigenwert $2$ ein $J_1(2)$.",
        exercise: "Bestimme die Jordan-Normalform eines $4\\times4$-Endomorphismus mit $\\chi_A=(x-1)^3(x-2)$ und $m_A=(x-1)^2(x-2)$.",
        hint: "Eigenwert $1$: alg. Vielfachheit $3$, größtes Kästchen Größe $2$ (aus $m_A$). Eigenwert $2$: alg. Vielfachheit $1$.",
        solution: "Eigenwert $1$: algebraische Vielfachheit $3$, größtes Kästchen Größe $2$ (Vielfachheit in $m_A$). Also Kästchen $J_2(1)$ und $J_1(1)$.\nEigenwert $2$: algebraische Vielfachheit $1$, also ein Kästchen $J_1(2)$.\nJordan-Normalform:\n$J=\\begin{pmatrix}1&1&0&0\\\\0&1&0&0\\\\0&0&1&0\\\\0&0&0&2\\end{pmatrix}$.",
        quiz: {
          question: "Was liefert das Minimalpolynom für die Jordan-Normalform?",
          options: ["Die Determinante", "Die Größe des größten Jordan-Kästchens pro Eigenwert", "Den Rang", "Die Spur"],
          answerIndex: 1,
          explanation: "Die Vielfachheit von $\\lambda$ im Minimalpolynom ist die Größe des größten Jordan-Kästchens zu $\\lambda$."
        }
      },
      {
        id: "m16-l3",
        title: "Prüfungsstrategie und Freiburg-Dozenten",
        difficulty: "Profi",
        estimatedMinutes: 55,
        theory: [
          "Die Freiburger Fachschaft sammelt Altklausuren (LA1: über 60, LA2: 9) — das beste Training. Rechnen Sie mehrere Klausuren vollständig durch, nicht nur Aufgabenränder.",
          "Dozenten-Schwerpunkte (orientiert an Freiburger Prüfenden): Kebekus und Huber-Klawitter betonen oft saubere Beweisführung und Struktur; Goette und Wendland stellen gerne geometrische und formenbezogene Aufgaben; Mildenberger und Soergel prüfen oft Normalformen und Moduln.",
          "Zeitmanagement: in 90 Minuten Klausur pro Aufgabe ~20 Minuten. Erst Lösbare vollständig, dann Rest. Teilpunkte durch saubere Teilschritte sichern.",
          "Hilfsmittel absichern: welche Sätze man ohne Beweis nutzen darf, variiert — in der Klausur explizit klären. Beweise, die im Skript verlangt wurden, können drankommen."
        ],
        example: "Eine typische Strategie: bei einer Eigenwert-Aufgabe erst $\\chi_A$ und $m_A$ vollständig ausschreiben, Vielfachheiten vergleichen, dann Jordan-Form — das sichert selbst bei Rechenfehlern Strukturpunkte.",
        exercise: "Du hast $\\chi_A=(x-3)^4$ und $m_A=(x-3)^2$ mit $\\dim E_3=2$. Bestimme die Jordan-Normalform.",
        hint: "Algebraische Vielfachheit $4$, geometrische Vielfachheit $2$ (Anzahl Kästchen), größtes Kästchen Größe $2$ (aus $m_A$).",
        solution: "Eigenwert $3$: algebraische Vielfachheit $4$, Anzahl Kästchen $=\\dim E_3=2$, größtes Kästchen Größe $2$.\nMögliche Kästchengrößen, die sich zu $4$ ergänzen mit Maximum $2$ und zwei Kästchen: $2+2$.\nJordan-Normalform: $J_2(3)\\oplus J_2(3)=\\begin{pmatrix}3&1&0&0\\\\0&3&0&0\\\\0&0&3&1\\\\0&0&0&3\\end{pmatrix}$.",
        quiz: {
          question: "Was ist die effektivste Klausurvorbereitung laut Fachschaft?",
          options: ["Nur Theorie lesen", "Mehrere Altklausuren vollständig rechnen", "Nur Videos schauen", "Formeln auswendig lernen"],
          answerIndex: 1,
          explanation: "Die Freiburger Altklausuren sind das beste Training — vollständig gerechnet, nicht nur überflogen."
        }
      }
    ]
  }
]);

window.LEARNING_REFERENCES = Object.freeze({
  "m0-l1": [
    { label: "Ganze Zahl — Wikipedia", url: "https://de.wikipedia.org/wiki/Ganze_Zahl", source: "Wikipedia" },
    { label: "Betrag (Mathematik) — Wikipedia", url: "https://de.wikipedia.org/wiki/Betragsfunktion", source: "Wikipedia" }
  ],
  "m0-l2": [
    { label: "Bruchrechnung — Wikipedia", url: "https://de.wikipedia.org/wiki/Bruchrechnung", source: "Wikipedia" },
    { label: "Dezimalzahl — Wikipedia", url: "https://de.wikipedia.org/wiki/Dezimalzahl", source: "Wikipedia" }
  ],
  "m0-l3": [
    { label: "Binomische Formeln — Wikipedia", url: "https://de.wikipedia.org/wiki/Binomische_Formeln", source: "Wikipedia" },
    { label: "Distributivgesetz — Wikipedia", url: "https://de.wikipedia.org/wiki/Distributivgesetz", source: "Wikipedia" }
  ],
  "m1-l1": [
    { label: "Quadratische Gleichung — Wikipedia", url: "https://de.wikipedia.org/wiki/Quadratische_Gleichung", source: "Wikipedia" },
    { label: "Lineare Gleichung — Wikipedia", url: "https://de.wikipedia.org/wiki/Lineare_Gleichung", source: "Wikipedia" }
  ],
  "m1-l2": [
    { label: "Menge (Mathematik) — Wikipedia", url: "https://de.wikipedia.org/wiki/Menge_(Mathematik)", source: "Wikipedia" },
    { label: "Bijektive Funktion — Wikipedia", url: "https://de.wikipedia.org/wiki/Bijektion", source: "Wikipedia" },
    { label: "Quantor — Wikipedia", url: "https://de.wikipedia.org/wiki/Quantor", source: "Wikipedia" }
  ],
  "m1-l3": [
    { label: "Summenzeichen — Wikipedia", url: "https://de.wikipedia.org/wiki/Summenzeichen", source: "Wikipedia" },
    { label: "Vollständige Induktion — Wikipedia", url: "https://de.wikipedia.org/wiki/Vollst%C3%A4ndige_Induktion", source: "Wikipedia" },
    { label: "Gaußsche Summenformel — Wikipedia", url: "https://de.wikipedia.org/wiki/Gau%C3%9Fsche_Summenformel", source: "Wikipedia" }
  ],
  "m2-l1": [
    { label: "Komplexe Zahlen — Wikipedia", url: "https://de.wikipedia.org/wiki/Komplexe_Zahl", source: "Wikipedia" },
    { label: "Imaginäre Einheit — Wikipedia", url: "https://de.wikipedia.org/wiki/Imagin%C3%A4re_Einheit", source: "Wikipedia" },
    { label: "Carl Friedrich Gauß — Wikipedia", url: "https://de.wikipedia.org/wiki/Carl_Friedrich_Gau%C3%9F", source: "Universität Göttingen" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
  ],
  "m2-l2": [
    { label: "Komplexe Zahlen — Rechenregeln — Wikipedia", url: "https://de.wikipedia.org/wiki/Komplexe_Zahl", source: "Wikipedia" },
    { label: "Komplexe Konjugation — Wikipedia", url: "https://de.wikipedia.org/wiki/Komplexe_Konjugation", source: "Wikipedia" }
  ],
  "m2-l3": [
    { label: "Polarkoordinaten komplexer Zahlen — Wikipedia", url: "https://de.wikipedia.org/wiki/Polarkoordinaten", source: "Wikipedia" },
    { label: "Eulersche Formel — Wikipedia", url: "https://de.wikipedia.org/wiki/Eulersche_Formel", source: "Wikipedia" },
    { label: "Fundamentalsatz der Algebra — Wikipedia", url: "https://de.wikipedia.org/wiki/Fundamentalsatz_der_Algebra", source: "Wikipedia" },
    { label: "Leonhard Euler — Wikipedia", url: "https://de.wikipedia.org/wiki/Leonhard_Euler", source: "Universität Sankt Petersburg" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
  ],
  "m3-l1": [
    { label: "Vektor — Wikipedia", url: "https://de.wikipedia.org/wiki/Vektor", source: "Wikipedia" },
    { label: "Euklidische Norm — Wikipedia", url: "https://de.wikipedia.org/wiki/Euklidische_Norm", source: "Wikipedia" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
  ],
  "m3-l2": [
    { label: "Vektorraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Vektorraum", source: "Wikipedia" },
    { label: "Skalarmultiplikation — Wikipedia", url: "https://de.wikipedia.org/wiki/Skalarmultiplikation", source: "Wikipedia" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
  ],
  "m3-l3": [
    { label: "Linearkombination — Wikipedia", url: "https://de.wikipedia.org/wiki/Linearkombination", source: "Wikipedia" },
    { label: "Lineare Hülle — Wikipedia", url: "https://de.wikipedia.org/wiki/Lineare_H%C3%BClle", source: "Wikipedia" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m4-l1": [
    { label: "Matrix (Mathematik) — Wikipedia", url: "https://de.wikipedia.org/wiki/Matrix_(Mathematik)", source: "Wikipedia" },
    { label: "Transponierte Matrix — Wikipedia", url: "https://de.wikipedia.org/wiki/Transponierte_Matrix", source: "Wikipedia" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m4-l2": [
    { label: "Matrizenmultiplikation — Wikipedia", url: "https://de.wikipedia.org/wiki/Matrizenmultiplikation", source: "Wikipedia" },
    { label: "Einheitsmatrix — Wikipedia", url: "https://de.wikipedia.org/wiki/Einheitsmatrix", source: "Wikipedia" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m4-l3": [
    { label: "Inverse Matrix — Wikipedia", url: "https://de.wikipedia.org/wiki/Regul%C3%A4re_Matrix", source: "Wikipedia" },
    { label: "Elementarmatrix — Wikipedia", url: "https://de.wikipedia.org/wiki/Elementarmatrix", source: "Wikipedia" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m5-l1": [
    { label: "Lineares Gleichungssystem — Wikipedia", url: "https://de.wikipedia.org/wiki/Lineares_Gleichungssystem", source: "Wikipedia" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m5-l2": [
    { label: "Gaußsches Eliminationsverfahren — Wikipedia", url: "https://de.wikipedia.org/wiki/Gau%C3%9Fsches_Eliminationsverfahren", source: "Wikipedia" },
    { label: "Carl Friedrich Gauß — Wikipedia", url: "https://de.wikipedia.org/wiki/Carl_Friedrich_Gau%C3%9F", source: "Universität Göttingen" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m5-l3": [
    { label: "Rang (Lineare Algebra) — Wikipedia", url: "https://de.wikipedia.org/wiki/Rang_(Lineare_Algebra)", source: "Wikipedia" },
    { label: "Satz von Kronecker-Capelli — Wikipedia", url: "https://de.wikipedia.org/wiki/Satz_von_Kronecker-Capelli", source: "Wikipedia" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m6-l1": [
    { label: "Determinante — Wikipedia", url: "https://de.wikipedia.org/wiki/Determinante", source: "Wikipedia" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m6-l2": [
    { label: "Determinante — Rechenregeln — Wikipedia", url: "https://de.wikipedia.org/wiki/Determinante", source: "Wikipedia" },
    { label: "Multiplikationssatz der Determinante — Wikipedia", url: "https://de.wikipedia.org/wiki/Determinante", source: "Wikipedia" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m6-l3": [
    { label: "Determinante als Volumen — Wikipedia", url: "https://de.wikipedia.org/wiki/Determinante", source: "Wikipedia" },
    { label: "Orientierung (Mathematik) — Wikipedia", url: "https://de.wikipedia.org/wiki/Orientierung_(Mathematik)", source: "Wikipedia" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m6-l4": [
    { label: "Vektorraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Vektorraum", source: "Wikipedia" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
  ],
  "m7-l1": [
    { label: "Vektorraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Vektorraum", source: "Wikipedia" },
    { label: "Körper (Algebra) — Wikipedia", url: "https://de.wikipedia.org/wiki/K%C3%B6rper_(Algebra)", source: "Wikipedia" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
  ],
  "m7-l2": [
    { label: "Unterraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Unterraum", source: "Wikipedia" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m7-l3": [
    { label: "Polynomring — Wikipedia", url: "https://de.wikipedia.org/wiki/Polynomring", source: "Wikipedia" },
    { label: "Funktionenraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Funktionenraum", source: "Wikipedia" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m8-l1": [
    { label: "Lineare Unabhängigkeit — Wikipedia", url: "https://de.wikipedia.org/wiki/Lineare_Unabh%C3%A4ngigkeit", source: "Wikipedia" },
    { label: "Erzeugendensystem — Wikipedia", url: "https://de.wikipedia.org/wiki/Erzeugendensystem", source: "Wikipedia" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m8-l2": [
    { label: "Basis (Vektorraum) — Wikipedia", url: "https://de.wikipedia.org/wiki/Basis_(Vektorraum)", source: "Wikipedia" },
    { label: "Austauschsatz von Steinitz — Wikipedia", url: "https://de.wikipedia.org/wiki/Austauschsatz_von_Steinitz", source: "Wikipedia" },
    { label: "Ernst Steinitz — Wikipedia", url: "https://de.wikipedia.org/wiki/Ernst_Steinitz", source: "Universität Kiel" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m8-l3": [
    { label: "Dimension (Vektorraum) — Wikipedia", url: "https://de.wikipedia.org/wiki/Dimension_(Vektorraum)", source: "Wikipedia" },
    { label: "Direkte Summe — Wikipedia", url: "https://de.wikipedia.org/wiki/Direkte_Summe", source: "Wikipedia" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m9-l1": [
    { label: "Lineare Abbildung — Wikipedia", url: "https://de.wikipedia.org/wiki/Lineare_Abbildung", source: "Wikipedia" },
    { label: "Kern (Algebra) — Wikipedia", url: "https://de.wikipedia.org/wiki/Kern_(Algebra)", source: "Wikipedia" },
    { label: "Bild (Mathematik) — Wikipedia", url: "https://de.wikipedia.org/wiki/Bildmenge", source: "Wikipedia" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
  ],
  "m9-l2": [
    { label: "Rang-Defekt-Satz — Wikipedia", url: "https://de.wikipedia.org/wiki/Rangsatz", source: "Wikipedia" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m9-l3": [
    { label: "Darstellungsmatrix — Wikipedia", url: "https://de.wikipedia.org/wiki/Darstellungsmatrix", source: "Wikipedia" },
    { label: "Basiswechsel — Wikipedia", url: "https://de.wikipedia.org/wiki/Basiswechselmatrix", source: "Wikipedia" },
    { label: "Ähnliche Matrizen — Wikipedia", url: "https://de.wikipedia.org/wiki/%C3%84hnlichkeit_(Matrix)", source: "Wikipedia" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m10-l1": [
    { label: "Eigenwert — Wikipedia", url: "https://de.wikipedia.org/wiki/Eigenwertproblem", source: "Wikipedia" },
    { label: "Eigenraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Eigenraum", source: "Wikipedia" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m10-l2": [
    { label: "Charakteristisches Polynom — Wikipedia", url: "https://de.wikipedia.org/wiki/Charakteristisches_Polynom", source: "Wikipedia" },
    { label: "Spur (Mathematik) — Wikipedia", url: "https://de.wikipedia.org/wiki/Spur_(Mathematik)", source: "Wikipedia" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m10-l3": [
    { label: "Diagonalisierbarkeit — Wikipedia", url: "https://de.wikipedia.org/wiki/Diagonalisierbarkeit", source: "Wikipedia" },
    { label: "Algebraische und geometrische Vielfachheit — Wikipedia", url: "https://de.wikipedia.org/wiki/Algebraische_Vielfachheit", source: "Wikipedia" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m11-l1": [
    { label: "Skalarprodukt — Wikipedia", url: "https://de.wikipedia.org/wiki/Skalarprodukt", source: "Wikipedia" },
    { label: "Cauchy-Schwarzsche Ungleichung — Wikipedia", url: "https://de.wikipedia.org/wiki/Cauchy-Schwarzsche_Ungleichung", source: "Wikipedia" },
    { label: "Augustin-Louis Cauchy — Wikipedia", url: "https://de.wikipedia.org/wiki/Augustin-Louis_Cauchy", source: "École Polytechnique" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m11-l2": [
    { label: "Orthogonale Projektion — Wikipedia", url: "https://de.wikipedia.org/wiki/Orthogonale_Projektion", source: "Wikipedia" },
    { label: "Gram-Schmidtsches Orthogonalisierungsverfahren — Wikipedia", url: "https://de.wikipedia.org/wiki/Gram-Schmidtsches_Orthogonalisierungsverfahren", source: "Wikipedia" },
    { label: "Jørgen Pedersen Gram — Wikipedia", url: "https://de.wikipedia.org/wiki/J%C3%B8rgen_Pedersen_Gram", source: "Wikipedia" },
    { label: "Erhard Schmidt — Wikipedia", url: "https://de.wikipedia.org/wiki/Erhard_Schmidt_(Mathematiker)", source: "Universität Berlin" },
    { label: "Essence of Linear Algebra — 3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "Grant Sanderson, 3Blue1Brown" },
    { label: "MIT OCW 18.06sc — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m11-l3": [
    { label: "QR-Zerlegung — Wikipedia", url: "https://de.wikipedia.org/wiki/QR-Zerlegung", source: "Wikipedia" },
    { label: "Orthogonale Matrix — Wikipedia", url: "https://de.wikipedia.org/wiki/Orthogonale_Matrix", source: "Wikipedia" },
    { label: "Unitäre Matrix — Wikipedia", url: "https://de.wikipedia.org/wiki/Unit%C3%A4re_Matrix", source: "Wikipedia" },
    { label: "MIT OCW 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "Prof. Gilbert Strang, MIT" },
  ],
  "m12-l1": [
    { label: "Direkte Summe — Wikipedia", url: "https://de.wikipedia.org/wiki/Direkte_Summe", source: "Wikipedia" },
    { label: "Komplementärraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Komplement%C3%A4rraum", source: "Wikipedia" }
  ],
  "m12-l2": [
    { label: "Quotientenraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Quotientenraum", source: "Wikipedia" },
    { label: "Nebenklasse — Wikipedia", url: "https://de.wikipedia.org/wiki/Nebenklasse", source: "Wikipedia" }
  ],
  "m12-l3": [
    { label: "Dualraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Dualraum", source: "Wikipedia" },
    { label: "Duale Abbildung — Wikipedia", url: "https://de.wikipedia.org/wiki/Duale_Abbildung", source: "Wikipedia" },
    { label: "Annihilator (Algebra) — Wikipedia", url: "https://de.wikipedia.org/wiki/Annihilator_(Mathematik)", source: "Wikipedia" }
  ],
  "m13-l1": [
    { label: "Invarianter Unterraum — Wikipedia", url: "https://de.wikipedia.org/wiki/Invarianter_Unterraum", source: "Wikipedia" },
    { label: "Satz von Cayley-Hamilton — Wikipedia", url: "https://de.wikipedia.org/wiki/Satz_von_Cayley-Hamilton", source: "Wikipedia" },
    { label: "Arthur Cayley — Wikipedia", url: "https://de.wikipedia.org/wiki/Arthur_Cayley", source: "Universität Cambridge" },
    { label: "William Rowan Hamilton — Wikipedia", url: "https://de.wikipedia.org/wiki/William_Rowan_Hamilton", source: "Universität Dublin" }
  ],
  "m13-l2": [
    { label: "Minimalpolynom — Wikipedia", url: "https://de.wikipedia.org/wiki/Minimalpolynom", source: "Wikipedia" }
  ],
  "m13-l3": [
    { label: "Jordan-Normalform — Wikipedia", url: "https://de.wikipedia.org/wiki/Jordan-Normalform", source: "Wikipedia" },
    { label: "Rationale Normalform — Wikipedia", url: "https://de.wikipedia.org/wiki/Rationale_Normalform", source: "Wikipedia" },
    { label: "Camille Jordan — Wikipedia", url: "https://de.wikipedia.org/wiki/Camille_Jordan", source: "Universität Lyon" },
    { label: "Ferdinand Georg Frobenius — Wikipedia", url: "https://de.wikipedia.org/wiki/Ferdinand_Georg_Frobenius", source: "Universität Berlin" }
  ],
  "m14-l1": [
    { label: "Bilinearform — Wikipedia", url: "https://de.wikipedia.org/wiki/Bilinearform", source: "Wikipedia" },
    { label: "Sesquilinearform — Wikipedia", url: "https://de.wikipedia.org/wiki/Sesquilinearform", source: "Wikipedia" }
  ],
  "m14-l2": [
    { label: "Trägheitssatz von Sylvester — Wikipedia", url: "https://de.wikipedia.org/wiki/Tr%C3%A4gheitssatz_von_Sylvester", source: "Wikipedia" },
    { label: "Quadratische Form — Wikipedia", url: "https://de.wikipedia.org/wiki/Quadratische_Form", source: "Wikipedia" },
    { label: "James Joseph Sylvester — Wikipedia", url: "https://de.wikipedia.org/wiki/James_Joseph_Sylvester", source: "Universität Oxford" }
  ],
  "m14-l3": [
    { label: "Orthogonale Gruppe — Wikipedia", url: "https://de.wikipedia.org/wiki/Orthogonale_Gruppe", source: "Wikipedia" },
    { label: "Unitäre Gruppe — Wikipedia", url: "https://de.wikipedia.org/wiki/Unit%C3%A4re_Gruppe", source: "Wikipedia" },
    { label: "Symplektische Gruppe — Wikipedia", url: "https://de.wikipedia.org/wiki/Symplektische_Gruppe", source: "Wikipedia" },
    { label: "Spektralsatz — Wikipedia", url: "https://de.wikipedia.org/wiki/Spektralsatz", source: "Wikipedia" }
  ],
  "m15-l1": [
    { label: "Ring (Algebra) — Wikipedia", url: "https://de.wikipedia.org/wiki/Ring_(Algebra)", source: "Wikipedia" },
    { label: "Ideal (Ringtheorie) — Wikipedia", url: "https://de.wikipedia.org/wiki/Ideal_(Ringtheorie)", source: "Wikipedia" },
    { label: "Hauptidealring — Wikipedia", url: "https://de.wikipedia.org/wiki/Hauptidealring", source: "Wikipedia" }
  ],
  "m15-l2": [
    { label: "Modul (Mathematik) — Wikipedia", url: "https://de.wikipedia.org/wiki/Modul_(Mathematik)", source: "Wikipedia" },
    { label: "Smith-Normalform — Wikipedia", url: "https://de.wikipedia.org/wiki/Smith-Normalform", source: "Wikipedia" }
  ],
  "m15-l3": [
    { label: "Frobenius-Normalform — Wikipedia", url: "https://de.wikipedia.org/wiki/Rationale_Normalform", source: "Wikipedia" },
    { label: "Modul (Mathematik) — Wikipedia", url: "https://de.wikipedia.org/wiki/Modul_(Mathematik)", source: "Wikipedia" }
  ],
  "m16-l1": [
    { label: "Altklausuren Lineare Algebra I — Uni Freiburg", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/k/s/la1.html", source: "Fachschaft Mathematik, Universität Freiburg" },
    { label: "Klausur LA I, WS 21/22 (Mildenberger) — PDF", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/data/2022/023.pdf", source: "Prof. Dr. Heike Mildenberger, Universität Freiburg" },
    { label: "Klausur LA I, WS 20/21 (Kebekus) — PDF", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/data/2020/003.pdf", source: "Prof. Dr. Stefan Kebekus, Universität Freiburg" },
    { label: "Klausur LA I, WS 18/19 (Huber-Klawitter) — PDF", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/data/2019/003.pdf", source: "Prof. Dr. Annette Huber-Klawitter, Universität Freiburg" }
  ],
  "m16-l2": [
    { label: "Altklausuren Lineare Algebra II — Uni Freiburg", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/k/s/la2.html", source: "Fachschaft Mathematik, Universität Freiburg" },
    { label: "Klausur LA II (Goette) — PDF", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/data/2017/046.pdf", source: "Prof. Dr. Sebastian Goette, Universität Freiburg" },
    { label: "Klausur LA II (Mildenberger) — PDF", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/data/2022/003.pdf", source: "Prof. Dr. Heike Mildenberger, Universität Freiburg" },
    { label: "Klausur LA II (Wendland) — PDF", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/data/2011/006.pdf", source: "Prof. Dr. Katrin Wendland, Universität Freiburg" }
  ],
  "m16-l3": [
    { label: "Altklausuren Lineare Algebra I — Uni Freiburg", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/k/s/la1.html", source: "Fachschaft Mathematik, Universität Freiburg" },
    { label: "Altklausuren Lineare Algebra II — Uni Freiburg", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/k/s/la2.html", source: "Fachschaft Mathematik, Universität Freiburg" },
    { label: "Fachschaft Mathematik Freiburg — Protokolle", url: "https://fachschaft.mathematik.uni-freiburg.de/protokolle/", source: "Fachschaft Mathematik, Universität Freiburg" },
    { label: "Mathematisches Institut Freiburg — Lehre", url: "https://www.math.uni-freiburg.de/", source: "Universität Freiburg" }
  ]
});
