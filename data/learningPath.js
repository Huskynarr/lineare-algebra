window.LEARNING_PATH = Object.freeze([
  {
    id: "mod-0",
    title: "Vorab: Komplexe Zahlen",
    level: "Einsteiger",
    targetHours: 6,
    goals: [
      "Komplexe Zahlen verstehen und darstellen",
      "Mit komplexen Zahlen rechnen",
      "Verbindung zu Eigenweten herstellen"
    ],
    lessons: [
      {
        id: "m0-l1",
        title: "Was sind komplexe Zahlen?",
        difficulty: "Einsteiger",
        estimatedMinutes: 40,
        theory: [
          "Manche Gleichungen haben keine normale Lösung, z.B. $x^2 = -1$. Keine echte Zahl ergibt -1 wenn man sie quadriert.",
          "Deshalb erfinden Mathematiker die Zahl $i$ mit der Eigenschaft $i^2 = -1$. Das ist die 'imaginäre Einheit'.",
          "Eine komplexe Zahl hat die Form $z = a + bi$, wobei $a$ und $b$ normale Zahlen sind. $a$ heißt der Realteil, $b$ der Imaginärteil.",
          "Stell dir ein Koordinatensystem vor: Die x-Achse ist der Realteil, die y-Achse der Imaginärteil. Jede komplexe Zahl ist ein Punkt darin."
        ],
        example: "$z = 3 + 4i$ ist eine komplexe Zahl. Realteil = 3, Imaginärteil = 4. In der komplexen Ebene liegt dieser Punkt bei (3, 4).",
        exercise: "Schreibe die komplexe Zahl $z = 5 - 2i$ in der Form $a + bi$ auf. Was ist Realteil, was ist Imaginärteil?",
        hint: "Realteil ist die Zahl vor dem $i$, Imaginärteil die Zahl dahinter (mit Vorzeichen).",
        quiz: {
          inputType: "text",
          question: "Was ist der Imaginärteil von $z = 7 - 3i$?",
          correctAnswer: "-3",
          acceptAnswers: ["-3", "-3i"],
          placeholder: "Zahl eingeben...",
          explanation: "Der Imaginärteil ist die Zahl vor dem $i$, also -3.",
          solution: "Bei $z = a + bi$ ist $a$ der Realteil und $b$ der Imaginärteil. Hier: $a = 7$, $b = -3$. Also ist der Imaginärteil $-3$."
        }
      },
      {
        id: "m0-l2",
        title: "Mit komplexen Zahlen rechnen",
        difficulty: "Einsteiger",
        estimatedMinutes: 50,
        theory: [
          "Addition: Realteile und Imaginärteile werden einzeln addiert. $(a + bi) + (c + di) = (a+c) + (b+d)i$.",
          "Multiplikation: Wie bei Klammern ausmultiplizieren, dabei $i^2 = -1$ verwenden. $(a+bi)(c+di) = (ac - bd) + (ad + bc)i$.",
          "Die 'konjugiert komplexe Zahl' von $z = a + bi$ ist $\\bar{z} = a - bi$. Damit kann man Division durchführen."
        ],
        example: "$(2 + 3i) + (1 - i) = 3 + 2i$. Und $(2 + 3i)(1 - i) = 2 - 2i + 3i - 3i^2 = 2 + i + 3 = 5 + i$.",
        exercise: "Berechne $(1 + 2i) \\cdot (3 - i)$.",
        hint: "Klammern ausmultiplizieren und $i^2 = -1$ einsetzen.",
        quiz: {
          inputType: "text",
          question: "Berechne $(1 + 2i) \\cdot (3 - i)$. Gib das Ergebnis in der Form $a + bi$ ein.",
          correctAnswer: "5 + 5i",
          acceptAnswers: ["5+5i", "5 + 5i"],
          placeholder: "z.B. 3 + 4i",
          explanation: "Ausmultiplizieren: $1 \\cdot 3 + 1 \\cdot (-i) + 2i \\cdot 3 + 2i \\cdot (-i) = 3 - i + 6i - 2i^2 = 3 + 5i + 2 = 5 + 5i$.",
          solution: "Schritt 1: Klammer ausmultiplizieren: $1 \\cdot 3 = 3$, $1 \\cdot (-i) = -i$, $2i \\cdot 3 = 6i$, $2i \\cdot (-i) = -2i^2 = +2$.\\nSchritt 2: Zusammenfassen: $3 + 2 + (-i + 6i) = 5 + 5i$."
        }
      },
      {
        id: "m0-l3",
        title: "Warum braucht man komplexe Zahlen in der Linearen Algebra?",
        difficulty: "Einsteiger",
        estimatedMinutes: 35,
        theory: [
          "Einige Matrizen haben keine reellen Eigenwerte, sondern komplexe. Zum Beispiel Drehungen in der Ebene.",
          "Das charakteristische Polynom $\\det(A - \\lambda I) = 0$ kann komplexe Nullstellen haben — die dann die Eigenwerte sind.",
          "Auch wenn die Eingangsmatrix reell ist, können komplexe Eigenwerte auftreten. Das ist normal und kein Fehler."
        ],
        example: "Die Drehmatrix $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$ hat die Eigenwerte $\\lambda = \\pm i$. Diese sind komplex, obwohl die Matrix nur reelle Zahlen enthält.",
        exercise: "Warum ist es wichtig, komplexe Zahlen zu kennen, bevor man Eigenwerte lernt?",
        hint: "Denk an das charakteristische Polynom — nicht immer hat es reelle Nullstellen.",
        quiz: {
          question: "Können reelle Matrizen komplexe Eigenwerte haben?",
          options: ["Nein, niemals", "Ja, das kommt häufig vor (z.B. bei Drehungen)", "Nur wenn die Matrix null ist", "Nur bei sehr großen Matrizen"],
          answerIndex: 1,
          explanation: "Ja! Auch reelle Matrizen können komplexe Eigenwerte haben. Das ist ganz normal — z.B. bei Drehmatrizen."
        }
      }
    ]
  },
  {
    id: "mod-1",
    title: "Start: Mathe-Basics auffrischen",
    level: "Einsteiger",
    targetHours: 8,
    goals: [
      "Zahlen und Rechnen sicher beherrschen",
      "Mit Klammern und Termen umgehen können",
      "Erste Beweise verstehen"
    ],
    lessons: [
      {
        id: "m1-l1",
        title: "Zahlen, Terme und Klammern",
        difficulty: "Einsteiger",
        estimatedMinutes: 45,
        theory: [
          "Es gibt verschiedene Zahlenarten: normale Zahlen (1, 2, 3 ...), negative Zahlen (-1, -2 ...), Brüche (½, ¾) und Kommazahlen (3,14).",
          "Beim Rechnen gibt es wichtige Regeln: Tauschgesetz (3+5 = 5+3), Klammergesetz ((2·3)·4 = 2·(3·4)) und Verteilungsgesetz (a·(b+c) = a·b + a·c).",
          "Das Verteilungsgesetz bedeutet: Wenn du eine Zahl vor einer Klammer hast, multiplizierst du sie mit jedem Teil in der Klammer."
        ],
        example: "Rechne 3·(4 + 2) aus. Statt erst zu addieren, kannst du auch rechnen: 3·4 + 3·2 = 12 + 6 = 18. Beides gibt 18!",
        exercise: "Vereinfache den Ausdruck 2·(x + 3) + 4·(x - 1) und finde x, wenn das Ergebnis 14 sein soll.",
        hint: "Multipliziere zuerst die Zahlen vor den Klammern in die Klammern hinein.",
        quiz: {
          question: "Was bedeutet das Verteilungsgesetz a·(b + c) = a·b + a·c?",
          options: ["Man darf Klammern weglassen", "Man multipliziert die Zahl vor der Klammer mit jedem Teil darin", "Man addiert zuerst", "Man dividiert alles"],
          answerIndex: 1,
          explanation: "Die Zahl vor der Klammer wird mit jedem Teil in der Klammer multipliziert."
        }
      },
      {
        id: "m1-l2",
        title: "Gleichungen und Funktionen",
        difficulty: "Einsteiger",
        estimatedMinutes: 50,
        theory: [
          "Eine Gleichung ist wie eine Waage: Links und rechts muss das Gleiche rauskommen. Beispiel: 2x + 3 = 11 bedeutet: Welche Zahl für x macht beide Seiten gleich?",
          "Eine Funktion ist wie eine Maschine: Du steckst eine Zahl rein (x) und bekommst eine andere raus (y). Beispiel: f(x) = 3x bedeutet, jede Zahl wird verdreifacht.",
          "Wenn du eine Funktion als Bild zeichnest, entsteht bei einfachen Funktionen eine Gerade (wie ein Diagramm auf Millimeterpapier)."
        ],
        example: "f(x) = 2x + 1. Steckst du x=3 rein, kommt raus: 2·3+1 = 7. Die Maschine macht aus 3 die Zahl 7.",
        exercise: "Finde heraus, bei welchem x die Funktion f(x) = -3x + 12 den Wert 0 hat (also die Nullstelle).",
        hint: "Setze f(x) = 0 und löse nach x auf: -3x + 12 = 0.",
        quiz: {
          question: "Was ist eine Funktion?",
          options: ["Eine sehr schwierige Rechnung", "Eine Maschine, die aus einer Eingabe eine Ausgabe macht", "Eine Gleichung mit x", "Ein Diagramm"],
          answerIndex: 1,
          explanation: "Eine Funktion nimmt eine Zahl (x) und gibt eine andere Zahl zurück — wie eine Maschine."
        }
      },
      {
        id: "m1-l3",
        title: "Summenzeichen und Beweise",
        difficulty: "Einsteiger",
        estimatedMinutes: 55,
        theory: [
          "Das Summenzeichen Σ (großes griechisches Sigma) ist eine Abkürzung für 'addiere viele Zahlen'. Statt 1+2+3+4+5 zu schreiben, kann man Σ verwenden.",
          "Ein Beweis ist wie eine Erklärung, warum etwas stimmt. Man zeigt Schritt für Schritt, dass eine Behauptung richtig ist.",
          "Es gibt verschiedene Beweisarten: Man kann direkt zeigen, dass etwas stimmt. Oder man nimmt an, es stimmt nicht, und zeigt, dass das einen Widerspruch ergibt."
        ],
        example: "Statt 1+2+3+4+5 = 15 zu schreiben, schreibt man Σ und meint: 'Addiere alle Zahlen von 1 bis 5'. Das Ergebnis ist 15.",
        exercise: "Addiere die Zahlen 3 + 6 + 9 + 12 + 15. Erkläre, wie du vorgegangen bist.",
        hint: "Du kannst einfach der Reihe nach addieren oder schauen, ob es ein Muster gibt.",
        quiz: {
          question: "Wofür steht das Summenzeichen Σ?",
          options: ["Subtrahieren", "Addieren vieler Zahlen", "Multiplizieren", "Eine schwere Rechnung"],
          answerIndex: 1,
          explanation: "Σ ist die Abkürzung für 'addiere alle diese Zahlen'."
        }
      }
    ]
  },
  {
    id: "mod-2",
    title: "Vektoren: Pfeile im Raum",
    level: "Einsteiger",
    targetHours: 10,
    goals: [
      "Verstehen, was ein Vektor ist",
      "Mit Vektoren rechnen können",
      "Linearkombinationen kennenlernen"
    ],
    lessons: [
      {
        id: "m2-l1",
        title: "Was ist ein Vektor?",
        difficulty: "Einsteiger",
        estimatedMinutes: 45,
        theory: [
          "Ein Vektor ist ein Pfeil. Er hat eine Richtung und eine Länge. Stell dir vor, jemand sagt dir: 'Geh 3 Schritte nach rechts und 2 nach vorne' — das ist ein Vektor!",
          "Man schreibt Vektoren als Zahlen in Klammern: (3, 2) bedeutet 3 nach rechts, 2 nach oben.",
          "Vektoren kann man sich wie Wegbeschreibungen vorstellen: Der Startpunkt ist egal, wichtig ist nur die Richtung und wie weit man geht."
        ],
        example: "Der Vektor (2, 1) bedeutet: Geh 2 Schritte nach rechts und 1 Schritt nach oben. Der Vektor (-1, 3) bedeutet: 1 Schritt nach links und 3 nach oben.",
        exercise: "Zeichne die Vektoren (2, 1), (-1, 2) und (1, -2) in ein Koordinatensystem. Starte immer bei (0, 0).",
        hint: "Die erste Zahl ist immer nach rechts/links, die zweite nach oben/unten.",
        quiz: {
          question: "Was beschreibt ein Vektor?",
          options: ["Nur eine Zahl", "Eine Richtung und eine Länge (wie ein Pfeil)", "Eine Farbe", "Nur eine Position"],
          answerIndex: 1,
          explanation: "Ein Vektor ist wie ein Pfeil: Er hat eine Richtung und eine Länge. Der Startpunkt ist egal."
        }
      },
      {
        id: "m2-l2",
        title: "Mit Vektoren rechnen",
        difficulty: "Einsteiger",
        estimatedMinutes: 60,
        theory: [
          "Vektoren addiert man, indem man die Zahlen einzeln zusammenzählt: (1, 2) + (3, 4) = (4, 6). Stell dir vor, du gehst erst einen Weg und dann noch einen.",
          "Eine Zahl vor einem Vektor multipliziert jede Zahl im Vektor: 3·(1, 2) = (3, 6). Das bedeutet: Du gehst dreimal so weit in dieselbe Richtung.",
          "Die Länge eines Vektors berechnet man mit dem Satz des Pythagoras: Länge von (a, b) = √(a² + b²). Das ist die Entfernung vom Start bis zum Ziel."
        ],
        example: "u = (1, 2, 3) und v = (2, 0, 1). Dann ist u+v = (3, 2, 4) und 2·u = (2, 4, 6). Die Länge von u ist √(1+4+9) = √14 ≈ 3,7.",
        exercise: "Berechne u+v und 3·u für u = (1, 1, 0) und v = (1, 0, 1). Berechne auch die Länge von v.",
        hint: "Addiere jede Zahl einzeln. Für die Länge: Quadrate addieren und dann die Wurzel ziehen.",
        quiz: {
          question: "Wie rechnet man (2, 3) + (4, 1)?",
          options: ["(6, 3)", "(6, 4)", "(2, 4)", "(8, 3)"],
          answerIndex: 1,
          explanation: "Man addiert die Zahlen einzeln: 2+4=6 und 3+1=4, also (6, 4)."
        }
      },
      {
        id: "m2-l3",
        title: "Vektoren mischen: Linearkombination",
        difficulty: "Einsteiger",
        estimatedMinutes: 65,
        theory: [
          "Eine Linearkombination ist, wenn man Vektoren mit Zahlen multipliziert und dann addiert. Beispiel: 2·(1,0) + 3·(0,1) = (2, 3).",
          "Stell dir vor, du hast eine Sammlung von Wegbeschreibungen. Durch Mischen (Linearkombinationen) kannst du viele verschiedene Ziele erreichen.",
          "Vektoren sind 'linear unabhängig', wenn man keinen von ihnen durch Mischen der anderen herstellen kann. Wie Bausteine, die alle unterschiedlich sind."
        ],
        example: "(3, 3) kann man aus (1, 1) und (2, 2) bauen: (3, 3) = (1, 1) + (2, 2). Also sind diese drei Vektoren voneinander abhängig.",
        exercise: "Kannst du (1, 0, 1) aus (0, 1, 1) und (1, 1, 2) herstellen? Versuche es mit Zahlen davor.",
        hint: "Probiere: a·(1,0,1) + b·(0,1,1) + c·(1,1,2) = (0,0,0). Wenn nur a=b=c=0 geht, sind sie unabhängig.",
        quiz: {
          question: "Was bedeutet 'linear unabhängig'?",
          options: ["Alle Vektoren sind gleich lang", "Keinen Vektor kann man aus den anderen bauen", "Alle Vektoren zeigen nach oben", "Es gibt unendlich viele"],
          answerIndex: 1,
          explanation: "Linear unabhängig bedeutet: Keinen der Vektoren kann man durch Mischen der anderen herstellen."
        }
      }
    ]
  },
  {
    id: "mod-3",
    title: "Matrizen: Zahlentabellen",
    level: "Einsteiger → Aufbau",
    targetHours: 11,
    goals: [
      "Verstehen, was eine Matrix ist",
      "Matrizen addieren und multiplizieren",
      "Inverse Matrizen kennenlernen"
    ],
    lessons: [
      {
        id: "m3-l1",
        title: "Was ist eine Matrix?",
        difficulty: "Aufbau",
        estimatedMinutes: 50,
        theory: [
          "Eine Matrix ist einfach eine Tabelle voller Zahlen. Wie eine Excel-Tabelle hat sie Zeilen (waagerecht) und Spalten (senkrecht).",
          "Die Zahl ganz oben links ist in Zeile 1, Spalte 1. Die Zahl daneben in Zeile 1, Spalte 2 — und so weiter.",
          "Besondere Matrizen: Eine Matrix mit lauter Nullen heißt Nullmatrix. Eine Matrix mit Einsen auf der Diagonalen und sonst Nullen heißt Einheitsmatrix (wie die Zahl 1 bei Matrizen)."
        ],
        example: "Die Matrix [[1, 2], [0, 1]] hat 2 Zeilen und 2 Spalten. Die Zahl 1 oben links steht in Zeile 1, Spalte 1.",
        exercise: "Schreibe eine Matrix mit 3 Zeilen und 2 Spalten auf. Notiere bei jeder Zahl, in welcher Zeile und Spalte sie steht.",
        hint: "Zeile zuerst, Spalte danach: Die Zahl in Zeile 2, Spalte 1 ist die erste Zahl in der zweiten Reihe.",
        quiz: {
          question: "Wann kann man zwei Matrizen addieren?",
          options: ["Immer", "Wenn beide gleich viele Zeilen und Spalten haben", "Nur bei quadratischen Matrizen", "Nie"],
          answerIndex: 1,
          explanation: "Matrizen müssen gleich groß sein (gleiche Zeilen und Spalten), damit man sie Zahl für Zahl addieren kann."
        }
      },
      {
        id: "m3-l2",
        title: "Matrizen multiplizieren",
        difficulty: "Aufbau",
        estimatedMinutes: 65,
        theory: [
          "Matrizen multipliziert man anders als normale Zahlen. Man darf nicht einfach jede Zahl mit jeder multiplizieren.",
          "Die Regel: Die Zahl in Zeile i der ersten Matrix wird mit der Zahl in Spalte j der zweiten Matrix kombiniert (malnehmen und aufaddieren).",
          "Wichtig: Die Reihenfolge macht einen Unterschied! A·B ist nicht dasselbe wie B·A. Das ist anders als bei normalen Zahlen (3·4 = 4·3)."
        ],
        example: "Wenn A 2 Zeilen und 3 Spalten hat und B 3 Zeilen und 2 Spalten, dann hat A·B 2 Zeilen und 2 Spalten.",
        exercise: "Berechne A·B für A = [[1, 0], [2, 3]] und B = [[4, 1], [0, 2]].",
        hint: "Nimm jede Zeile von A und kombiniere sie mit jeder Spalte von B: malnehmen und aufaddieren.",
        quiz: {
          question: "Stimmt A·B = B·A bei Matrizen?",
          options: ["Ja, immer", "Nein, die Reihenfolge macht einen Unterschied", "Nur bei Nullmatrizen", "Nur bei Einheitsmatrizen"],
          answerIndex: 1,
          explanation: "Bei Matrizen ist die Reihenfolge wichtig: A·B und B·A können unterschiedlich sein."
        }
      },
      {
        id: "m3-l3",
        title: "Die inverse Matrix",
        difficulty: "Aufbau",
        estimatedMinutes: 70,
        theory: [
          "Die inverse Matrix ist wie der Kehrwert bei normalen Zahlen. Bei Zahlen ist 2 · ½ = 1. Bei Matrizen ist A · A⁻¹ = I (die Einheitsmatrix).",
          "Nicht jede Matrix hat eine inverse. Wenn die Determinante 0 ist, gibt es keine inverse (dazu kommen wir später).",
          "Mit der inversen Matrix kann man Gleichungen lösen: Statt A·x = b rechnet man x = A⁻¹·b."
        ],
        example: "A = [[2, 1], [1, 1]] hat die inverse Matrix A⁻¹ = [[1, -1], [-1, 2]]. Probe: A·A⁻¹ = [[1, 0], [0, 1]] = I.",
        exercise: "Berechne die inverse Matrix von [[4, 7], [2, 6]] und prüfe das Ergebnis durch Multiplikation.",
        hint: "Für eine 2x2-Matrix [[a,b],[c,d]] ist die inverse: (1/(ad-bc)) · [[d, -b], [-c, a]].",
        quiz: {
          question: "Wann hat eine Matrix keine inverse?",
          options: ["Wenn sie quadratisch ist", "Wenn die Determinante 0 ist", "Wenn sie nur positive Zahlen hat", "Nie, jede Matrix hat eine"],
          answerIndex: 1,
          explanation: "Wenn die Determinante 0 ist, kann man keine inverse Matrix berechnen."
        }
      }
    ]
  },
  {
    id: "mod-4",
    title: "Gleichungssysteme lösen",
    level: "Aufbau",
    targetHours: 12,
    goals: [
      "Gleichungssysteme aufstellen",
      "Das Gauss-Verfahren anwenden",
      "Verstehen, wann es Lösungen gibt"
    ],
    lessons: [
      {
        id: "m4-l1",
        title: "Was ist ein Gleichungssystem?",
        difficulty: "Aufbau",
        estimatedMinutes: 50,
        theory: [
          "Ein Gleichungssystem ist wie ein Rätsel mit mehreren Gleichungen. Beispiel: 2 Äpfel und 1 Birne kosten 5€. 1 Apfel und 1 Birne kosten 3€. Wie viel kostet每种?",
          "Man schreibt das als Tabelle (Matrix) auf: Die Zahlen vor den Variablen kommen in eine Tabelle, die Ergebnisse daneben.",
          "Wenn die rechte Seite null ist (also alles gratis), dann gibt es immer die Lösung 'alles null' (triviale Lösung)."
        ],
        example: "2x + y = 1 und x - y = 3 schreibt man als Tabelle: [[2, 1 | 1], [1, -1 | 3]].",
        exercise: "Schreibe folgendes als Tabelle auf: 3x + 2y - z = 7, x - y + 2z = 1, 2x + y - z = 4.",
        hint: "Jede Gleichung wird eine Zeile. Die Zahlen vor x, y, z kommen vor den Strich, die Ergebnisse dahinter.",
        quiz: {
          question: "Was gilt immer für ein Gleichungssystem, bei dem die rechte Seite null ist?",
          options: ["Es gibt keine Lösung", "Es gibt immer die Lösung 'alles null'", "Es gibt genau eine Lösung", "Es gibt unendlich viele"],
          answerIndex: 1,
          explanation: "Wenn alle Zahlen rechts null sind, ist 'alles null' immer eine Lösung (die sogenannte triviale Lösung)."
        }
      },
      {
        id: "m4-l2",
        title: "Das Gauss-Verfahren",
        difficulty: "Aufbau",
        estimatedMinutes: 75,
        theory: [
          "Das Gauss-Verfahren ist wie Aufräumen: Man bringt die Tabelle Schritt für Schritt in eine einfachere Form, bis man die Lösung ablesen kann.",
          "Dabei darf man: Zeilen vertauschen, eine Zeile mit einer Zahl multiplizieren (nicht null!), und ein Vielfaches einer Zeile zu einer anderen dazuaddieren.",
          "Das Ziel ist eine Treppenform: Unten links sollen lauter Nullen stehen, sodass man von unten nach oben die Lösungen ablesen kann."
        ],
        example: "Wenn in der untersten Zeile '0 0 1 | 5' steht, weiß man sofort: z = 5. Damit geht man eine Zeile nach oben und findet y, dann x.",
        exercise: "Löse dieses System mit dem Gauss-Verfahren: x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2.",
        hint: "Arbeite spaltenweise von links nach rechts. Erstelle unterhalb der ersten Zahl Nullen, dann unter der zweiten.",
        quiz: {
          question: "Welche Operation ist beim Gauss-Verfahren NICHT erlaubt?",
          options: ["Zwei Zeilen vertauschen", "Eine Zeile mit 0 multiplizieren", "Ein Vielfaches einer Zeile zu einer anderen addieren", "Eine Zeile mit 3 multiplizieren"],
          answerIndex: 1,
          explanation: "Mit 0 multiplizieren zerstört die ganze Zeile — das ist nicht erlaubt, weil man Information verliert."
        }
      },
      {
        id: "m4-l3",
        title: "Wann gibt es Lösungen?",
        difficulty: "Aufbau",
        estimatedMinutes: 65,
        theory: [
          "Der Rang einer Matrix ist die Anzahl der Zeilen, die nach dem Gauss-Verfahren nicht nur aus Nullen bestehen.",
          "Eine Lösung gibt es genau dann, wenn die Matrix und die erweiterte Matrix (mit Ergebnissen) denselben Rang haben.",
          "Wenn der Rang kleiner ist als die Anzahl der Variablen, gibt es freie Variablen — das bedeutet unendlich viele Lösungen."
        ],
        example: "Ein System mit 4 Variablen und Rang 3 hat einen Freiheitsgrad: Eine Variable ist frei wählbar, die anderen hängen davon ab.",
        exercise: "Bestimme den Rang der Matrix und der erweiterten Matrix für: x + y = 2, 2x + 2y = 4. Was fällt auf?",
        hint: "Wende Gauss an. Wenn eine Zeile nur aus Nullen wird, zählt sie nicht mehr zum Rang.",
        quiz: {
          question: "Wann hat ein Gleichungssystem unendlich viele Lösungen?",
          options: ["Wenn es genauso viele Gleichungen wie Variablen gibt", "Wenn der Rang kleiner ist als die Anzahl der Variablen und es lösbar ist", "Wenn alle Zahlen gleich sind", "Nie"],
          answerIndex: 1,
          explanation: "Wenn es lösbar ist, aber der Rang kleiner als die Anzahl der Variablen, dann gibt es freie Variablen und damit unendlich viele Lösungen."
        }
      }
    ]
  },
  {
    id: "mod-5",
    title: "Determinanten: Der Stempel",
    level: "Aufbau",
    targetHours: 8,
    goals: [
      "Determinanten berechnen können",
      "Regeln für Determinanten kennen",
      "Verstehen, was Determinanten bedeuten"
    ],
    lessons: [
      {
        id: "m5-l1",
        title: "Was ist eine Determinante?",
        difficulty: "Aufbau",
        estimatedMinutes: 55,
        theory: [
          "Eine Determinante ist eine einzige Zahl, die man aus einer quadratischen Matrix berechnet. Sie sagt uns wichtige Dinge über die Matrix.",
          "Für eine 2x2-Matrix [[a, b], [c, d]] ist die Determinante einfach: a·d - b·c.",
          "Für 3x3-Matrizen gibt es verschiedene Wege (z.B. die Regel von Sarrus), aber das Prinzip bleibt gleich."
        ],
        example: "det([[3, 1], [2, 4]]) = 3·4 - 1·2 = 12 - 2 = 10.",
        exercise: "Berechne die Determinante von [[5, 2], [3, 7]].",
        hint: "Für 2x2: Oben links mal unten rechts, minus oben rechts mal unten links.",
        quiz: {
          question: "Wie berechnet man die Determinante von [[a, b], [c, d]]?",
          options: ["a + b + c + d", "a·d - b·c", "a·b - c·d", "a·c - b·d"],
          answerIndex: 1,
          explanation: "Die Formel ist: Oben links mal unten rechts, minus oben rechts mal unten links = a·d - b·c."
        }
      },
      {
        id: "m5-l2",
        title: "Regeln für Determinanten",
        difficulty: "Aufbau",
        estimatedMinutes: 60,
        theory: [
          "Wenn man zwei Zeilen vertauscht, ändert sich das Vorzeichen der Determinante (aus + wird -, aus - wird +).",
          "Wenn man eine Zeile mit einer Zahl multipliziert, wird auch die Determinante mit dieser Zahl multipliziert.",
          "Wenn man ein Vielfaches einer Zeile zu einer anderen addiert, bleibt die Determinante gleich."
        ],
        example: "Wenn det(A) = 5 und man tauscht zwei Zeilen, dann ist die neue Determinante -5.",
        exercise: "Eine Matrix hat det = 7. Was passiert, wenn man Zeile 1 mit 3 multipliziert?",
        hint: "Die Determinante wird auch mit 3 multipliziert.",
        quiz: {
          question: "Was passiert mit der Determinante, wenn man zwei Zeilen vertauscht?",
          options: ["Sie bleibt gleich", "Sie wird 0", "Das Vorzeichen ändert sich (+ wird -, - wird +)", "Sie wird verdoppelt"],
          answerIndex: 2,
          explanation: "Ein Zeilentausch ändert das Vorzeichen: Aus +5 wird -5, aus -3 wird +3."
        }
      },
      {
        id: "m5-l3",
        title: "Determinante als Flächenmaß",
        difficulty: "Aufbau",
        estimatedMinutes: 45,
        theory: [
          "Die Determinante sagt uns, wie viel eine Matrix Flächen oder Volumen vergrößert oder verkleinert.",
          "Eine Determinante von 2 bedeutet: Flächen werden doppelt so groß. Eine Determinante von 1: Alles bleibt gleich groß.",
          "Eine Determinante von 0 bedeutet: Alles wird zu einer Linie oder einem Punkt zusammengequetscht. Die Matrix hat dann keine inverse."
        ],
        example: "Eine Matrix mit det = 3 macht jede Fläche dreimal so groß. Eine Matrix mit det = -1 spiegelt und die Fläche bleibt gleich groß.",
        exercise: "Erkläre in eigenen Worten, was det = 0, det = 2 und det = -3 für die Fläche bedeuten.",
        hint: "Betrag = Vergrößerung, Vorzeichen = Spiegelung, 0 = Zusammenquetschen.",
        quiz: {
          question: "Was bedeutet eine Determinante von 0?",
          options: ["Die Fläche wird gespiegelt", "Die Fläche bleibt gleich", "Alles wird zusammengequetscht — keine inverse möglich", "Die Matrix ist sehr groß"],
          answerIndex: 2,
          explanation: "det = 0 bedeutet: Alles wird auf eine niedrigere Dimension gequetscht. Die Matrix hat dann keine inverse."
        }
      }
    ]
  },
  {
    id: "mod-6",
    title: "Vektorräume: Die Welt der Vektoren",
    level: "Aufbau",
    targetHours: 12,
    goals: [
      "Verstehen, was ein Vektorraum ist",
      "Basen und Dimensionen kennenlernen",
      "Mit Unterräumen umgehen"
    ],
    lessons: [
      {
        id: "m6-l1",
        title: "Was ist ein Vektorraum?",
        difficulty: "Aufbau",
        estimatedMinutes: 60,
        theory: [
          "Ein Vektorraum ist wie ein Spielplatz für Vektoren. Dort darf man Vektoren addieren und mit Zahlen multiplizieren — und es entstehen wieder Vektoren.",
          "Beispiele: Die Ebene (2D) ist ein Vektorraum. Der Raum (3D) auch. Aber auch alle möglichen Listen mit 5 Zahlen bilden einen Vektorraum.",
          "Ein Unterraum ist ein kleinererer Spielplatz innerhalb des großen. Wie eine Ebene, die im 3D-Raum liegt."
        ],
        example: "Die xy-Ebene (alle Punkte mit z=0) ist ein Unterraum des 3D-Raums. Man kann Vektoren darin addieren — das Ergebnis bleibt in der Ebene.",
        exercise: "Ist die Menge aller Punkte (x, y) mit x > 0 ein Unterraum? Was passiert, wenn man mit -1 multipliziert?",
        hint: "Wenn man (3, 1) mit -1 multipliziert, bekommt man (-3, -1). Ist das noch in der Menge?",
        quiz: {
          question: "Was braucht ein Unterraum unbedingt?",
          options: ["Er muss den Nullvektor enthalten", "Er muss unendlich groß sein", "Er muss aus senkrechten Vektoren bestehen", "Er muss nur ganze Zahlen haben"],
          answerIndex: 0,
          explanation: "Jeder Unterraum muss den Nullvektor (0, 0, ...) enthalten — sonst ist es kein Unterraum."
        }
      },
      {
        id: "m6-l2",
        title: "Basis: Die Bausteine",
        difficulty: "Aufbau",
        estimatedMinutes: 70,
        theory: [
          "Eine Basis ist ein Satz von Vektoren, mit denen man jeden anderen Vektor im Raum bauen kann — und die nicht überflüssig sind.",
          "Stell dir Lego-Steine vor: Eine Basis sind die Grundbausteine. Damit kannst du alles bauen, und kein Stein ist unnötig.",
          "Im 2D reicht ein Pärchen: z.B. (1, 0) und (0, 1). Damit kann man jeden Vektor (a, b) als a·(1,0) + b·(0,1) bauen."
        ],
        example: "Im 2D sind (1, 0) und (0, 1) eine Basis. Aber auch (1, 1) und (1, -1) sind eine Basis — es gibt viele verschiedene!",
        exercise: "Sind (1, 0, 0), (0, 1, 0) und (1, 1, 0) eine Basis des 3D-Raums? Prüfe, ob man damit (0, 0, 1) bauen kann.",
        hint: "Die dritte Komponente (z) ist bei allen drei Vektoren null. Kann man damit jemals etwas mit z ≠ 0 bauen?",
        quiz: {
          question: "Was ist eine Basis?",
          options: ["Die größten Vektoren im Raum", "Ein Satz von Vektoren, mit denen man alles bauen kann und die nicht überflüssig sind", "Alle Vektoren, die es gibt", "Vektoren, die gleich lang sind"],
          answerIndex: 1,
          explanation: "Eine Basis ist ein minimaler Satz Bausteine: Damit kann man jeden Vektor bauen, und keiner ist überflüssig."
        }
      },
      {
        id: "m6-l3",
        title: "Dimension: Wie viele Bausteine?",
        difficulty: "Aufbau",
        estimatedMinutes: 65,
        theory: [
          "Die Dimension ist einfach die Anzahl der Basisvektoren. Im 2D braucht man 2, im 3D braucht man 3.",
          "Man kann die Basis wechseln (andere Bausteine nehmen), aber die Anzahl bleibt immer gleich — das ist die Dimension.",
          "Bei einem Basiswechsel bleiben die Vektoren dieselben, nur die Beschreibung (die Koordinaten) ändert sich."
        ],
        example: "Der Vektor (3, 5) hat in der normalen Basis die Koordinaten (3, 5). In einer anderen Basis könnte derselbe Vektor die Koordinaten (4, 1) haben — er ist derselbe, nur anders beschrieben.",
        exercise: "Wie viele Vektoren braucht man für eine Basis im 4D-Raum (also bei Listen mit 4 Zahlen)?",
        hint: "Die Dimension entspricht der Anzahl der Zahlen in den Vektoren.",
        quiz: {
          question: "Was ändert sich, wenn man die Basis wechselt?",
          options: ["Die Vektoren ändern sich", "Nur die Beschreibung (Koordinaten) ändert sich, der Vektor bleibt derselbe", "Der Raum wird kleiner", "Gar nichts"],
          answerIndex: 1,
          explanation: "Der Vektor bleibt derselbe — nur die Zahlen, mit denen man ihn beschreibt, ändern sich."
        }
      }
    ]
  },
  {
    id: "mod-7",
    title: "Lineare Abbildungen: Vektor-Maschinen",
    level: "Aufbau → Fortgeschritten",
    targetHours: 10,
    goals: [
      "Verstehen, was eine lineare Abbildung ist",
      "Kern und Bild bestimmen",
      "Den Rang-Nullitätssatz anwenden"
    ],
    lessons: [
      {
        id: "m7-l1",
        title: "Was ist eine lineare Abbildung?",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 50,
        theory: [
          "Eine lineare Abbildung ist eine Maschine, die Vektoren reinwirft und neue Vektoren ausspuckt. Dabei gelten zwei Regeln:",
          "Regel 1: Wenn du zwei Vektoren zusammen reinsteckst, ist das Ergebnis dasselbe, als würdest du sie einzeln reinstecken und dann addieren.",
          "Regel 2: Wenn du einen Vektor mit einer Zahl multiplizierst und dann reinsteckst, ist das Ergebnis dasselbe wie wenn du ihn erst reinsteckst und dann mit der Zahl multiplizierst."
        ],
        example: "Die Maschine T(x, y) = (2x, 3y) ist linear: Sie verdoppelt die x-Richtung und verdreifacht die y-Richtung. T(x, y) = (x+1, y) ist NICHT linear, weil die +1 die Regeln verletzt.",
        exercise: "Prüfe, ob T(x, y) = (2x + y, x - y) eine lineare Abbildung ist.",
        hint: "Teste die zwei Regeln: Was passiert bei Addition und bei Multiplikation mit einer Zahl?",
        quiz: {
          question: "Welche Abbildung ist linear?",
          options: ["T(x) = x + 5 (Verschiebung)", "T(x) = x² (Quadrieren)", "T(x, y) = (3x, 3y) (Strecken)", "T(x) = |x| (Betrag)"],
          answerIndex: 2,
          explanation: "Nur das Strecken T(x, y) = (3x, 3y) befolgt beide Regeln einer linearen Abbildung."
        }
      },
      {
        id: "m7-l2",
        title: "Kern und Bild",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 70,
        theory: [
          "Der Kern ist alles, was die Maschine zu null macht. Wenn man einen Vektor in die Maschine steckt und null herauskommt, gehört er zum Kern.",
          "Das Bild ist alles, was die Maschine herstellen kann. Es ist die Menge aller möglichen Ergebnisse.",
          "Der Kern zeigt, was verloren geht. Das Bild zeigt, was herauskommen kann."
        ],
        example: "Eine Maschine, die alles auf die x-Achse projiziert: Kern = die y-Achse (alles, was auf der y-Achse liegt, wird zu null). Bild = die x-Achse (nur x-Werte kommen raus).",
        exercise: "Finde Kern und Bild der Abbildung T(x, y, z) = (x, x, x). Was kommt raus, was wird zu null?",
        hint: "Für den Kern: Wann ist (x, x, x) = (0, 0, 0)? Für das Bild: Was kann alles rauskommen?",
        quiz: {
          question: "Was bedeutet es, wenn der Kern nur aus dem Nullvektor besteht?",
          options: ["Die Maschine funktioniert nicht", "Nichts geht verloren — die Maschine ist eindeutig (injektiv)", "Alles wird zu null", "Die Maschine ist sehr groß"],
          answerIndex: 1,
          explanation: "Wenn nur null zu null wird, geht keine Information verloren. Jede Eingabe gibt ein anderes Ergebnis."
        }
      },
      {
        id: "m7-l3",
        title: "Der Rang-Nullitätssatz",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 60,
        theory: [
          "Der Satz sagt etwas Einfaches: Was reingeht muss auch rauskommen. Die Dimension der Eingabe = Dimension des Kernels + Dimension des Bildes.",
          "Stell dir vor: Du hast 5 Dimensionen Eingabe. Wenn der Kern 2 Dimensionen hat (das geht verloren), dann hat das Bild 3 Dimensionen.",
          "Das ist wie ein Trichter: Was oben reingeht muss unten rauskommen — was im Kern verschwindet, fehlt beim Bild."
        ],
        example: "Wenn die Eingabe 7 Dimensionen hat und der Kern 2 Dimensionen, dann hat das Bild 7 - 2 = 5 Dimensionen.",
        exercise: "Die Eingabe hat 6 Dimensionen, das Bild hat 4. Wie viele Dimensionen hat der Kern?",
        hint: "Eingabe = Kern + Bild, also Kern = Eingabe - Bild.",
        quiz: {
          question: "Die Eingabe hat 7 Dimensionen, der Kern hat 2. Wie groß ist das Bild?",
          options: ["9", "5", "2", "14"],
          answerIndex: 1,
          explanation: "7 = 2 + Bild, also hat das Bild 7 - 2 = 5 Dimensionen."
        }
      }
    ]
  },
  {
    id: "mod-8",
    title: "Eigenwerte: Besondere Richtungen",
    level: "Fortgeschritten",
    targetHours: 13,
    goals: [
      "Verstehen, was Eigenwerte und Eigenvektoren sind",
      "Das charakteristische Polynom nutzen",
      "Diagonalisierbarkeit prüfen"
    ],
    lessons: [
      {
        id: "m8-l1",
        title: "Was sind Eigenwerte?",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 65,
        theory: [
          "Stell dir vor, eine Matrix ist eine Verzerrung — sie zieht und streckt Dinge. In den meisten Richtungen ändert sich auch die Richtung. Aber in einigen besonderen Richtungen wird nur gestreckt — die Richtung bleibt gleich!",
          "Diese besonderen Richtungen heißen Eigenvektoren. Der Streckfaktor heißt Eigenwert.",
          "Die Formel lautet: A·v = λ·v. Das bedeutet: Die Matrix A angewendet auf den Vektor v gibt dasselbe wie v mit dem Faktor λ multipliziert."
        ],
        example: "Die Matrix [[2, 0], [0, 3]] hat die Eigenwerte 2 und 3. Der Vektor (1, 0) ist ein Eigenvektor, weil A·(1,0) = (2,0) = 2·(1,0). Die Richtung bleibt gleich, nur gestreckt um Faktor 2.",
        exercise: "Prüfe: Ist (1, 1) ein Eigenvektor der Matrix [[3, 0], [0, 3]? Welcher Eigenwert gehört dazu?",
        hint: "Rechne A·(1, 1) aus und schau, ob das Ergebnis ein Vielfaches von (1, 1) ist.",
        quiz: {
          question: "Warum darf ein Eigenvektor nicht der Nullvektor (0, 0) sein?",
          options: ["Weil Nullvektoren zu lang sind", "Weil sonst jede Zahl ein Eigenwert wäre (A·0 = λ·0 ist immer wahr)", "Weil nur positive Zahlen erlaubt sind", "Weil der Nullvektor keine Richtung hat"],
          answerIndex: 1,
          explanation: "Wenn man 0 einsetzt, ist A·0 = λ·0 für jedes λ wahr. Das wäre nicht sinnvoll — jede Zahl wäre ein Eigenwert."
        }
      },
      {
        id: "m8-l2",
        title: "Das charakteristische Polynom",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 70,
        theory: [
          "Um die Eigenwerte zu finden, löst man eine Gleichung: det(A - λ·I) = 0. Das ist das 'charakteristische Polynom'.",
          "Die Nullstellen dieses Polynoms sind die Eigenwerte. Wie bei einer normalen Gleichung sucht man die Werte für λ, die Null ergeben.",
          "Manchmal sind Eigenwerte komplexe Zahlen (mit i). Das kann selbst bei ganz normalen Matrizen passieren — zum Beispiel bei Drehungen."
        ],
        example: "Für A = [[4, 0], [0, 5]] ist das Polynom (4-λ)(5-λ) = 0. Die Eigenwerte sind λ = 4 und λ = 5.",
        exercise: "Finde die Eigenwerte der Matrix [[2, 1], [0, 3]].",
        hint: "Berechne det(A - λI) = (2-λ)(3-λ) - 0 = 0 und löse nach λ.",
        quiz: {
          question: "Wie findet man die Eigenwerte einer Matrix?",
          options: ["Man berechnet die Determinante", "Man löst det(A - λI) = 0 (das charakteristische Polynom)", "Man addiert alle Zahlen", "Man dividiert durch die Einheitsmatrix"],
          answerIndex: 1,
          explanation: "Man setzt det(A - λI) = 0 und sucht die Nullstellen. Diese sind die Eigenwerte."
        }
      },
      {
        id: "m8-l3",
        title: "Diagonalisierbarkeit",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 70,
        theory: [
          "Eine Matrix ist diagonalisierbar, wenn man genug Eigenvektoren findet, um eine Basis zu bauen.",
          "Wenn alle Eigenwerte verschieden sind, ist die Matrix automatisch diagonalisierbar.",
          "Diagonalisierbar sein bedeutet: Man kann die Matrix in einer Form schreiben, wo nur die Diagonale Zahlen hat und sonst alles null ist. Das macht Rechnen viel einfacher."
        ],
        example: "Eine 3x3-Matrix mit drei verschiedenen Eigenwerten ist diagonalisierbar. Eine 2x2-Matrix mit nur einem Eigenwert ist es oft nicht (wenn der Eigenraum zu klein ist).",
        exercise: "Eine 2x2-Matrix hat zwei verschiedene Eigenwerte. Ist sie diagonalisierbar?",
        hint: "Verschiedene Eigenwerte bedeuten automatisch: genug Eigenvektoren für eine Basis.",
        quiz: {
          question: "Wann ist eine Matrix sicher diagonalisierbar?",
          options: ["Wenn die Determinante 1 ist", "Wenn alle Eigenwerte verschieden sind", "Wenn die Matrix nur positive Zahlen hat", "Wenn sie quadratisch ist"],
          answerIndex: 1,
          explanation: "Wenn alle n Eigenwerte verschieden sind, hat man automatisch n unabhängige Eigenvektoren — genug für eine Basis."
        }
      }
    ]
  },
  {
    id: "mod-9",
    title: "Skalarprodukt und Winkel",
    level: "Fortgeschritten",
    targetHours: 10,
    goals: [
      "Verstehen, was ein Skalarprodukt ist",
      "Projektionen berechnen",
      "Gram-Schmidt und QR kennenlernen"
    ],
    lessons: [
      {
        id: "m9-l1",
        title: "Das Skalarprodukt",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 55,
        theory: [
          "Das Skalarprodukt ist eine Art 'Ähnlichkeitsmessung' zwischen zwei Vektoren. Man multipliziert die Zahlen paarweise und addiert alles.",
          "Beispiel: (1, 2) · (3, 4) = 1·3 + 2·4 = 3 + 8 = 11.",
          "Wenn das Skalarprodukt null ist, stehen die Vektoren im rechten Winkel zueinander (orthogonal). Wie die x- und y-Achse."
        ],
        example: "(1, 0) · (0, 1) = 1·0 + 0·1 = 0. Die Vektoren stehen senkrecht aufeinander — das Skalarprodukt ist null.",
        exercise: "Berechne das Skalarprodukt von (2, 3) und (4, -1). Stehen sie senkrecht aufeinander?",
        hint: "Zahlen paarweise multiplizieren und addieren: 2·4 + 3·(-1). Wenn das Ergebnis 0 ist, sind sie orthogonal.",
        quiz: {
          question: "Wann stehen zwei Vektoren im rechten Winkel (orthogonal) zueinander?",
          options: ["Wenn sie gleich lang sind", "Wenn ihr Skalarprodukt null ist", "Wenn sie identisch sind", "Wenn beide positiv sind"],
          answerIndex: 1,
          explanation: "Ein Skalarprodukt von null bedeutet: Die Vektoren stehen im 90-Grad-Winkel aufeinander — sie sind orthogonal."
        }
      },
      {
        id: "m9-l2",
        title: "Projektion: Schatten werfen",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 65,
        theory: [
          "Eine Projektion ist wie ein Schatten: Man 'wirft' einen Vektor auf eine Linie oder Ebene, wie die Sonne einen Schatten wirft.",
          "Die orthogonale Projektion findet den nächsten Punkt auf dieser Linie/Ebene. Der 'Fehler' (Abstand) steht dabei senkrecht darauf.",
          "Die Formel für die Projektion von v auf einen Vektor u: proj = (v·u / u·u) · u."
        ],
        example: "Stell dir vor, die Sonne scheint von der Seite. Der Schatten eines schrägen Vektors auf dem Boden ist seine Projektion auf die x-Achse.",
        exercise: "Projiziere den Vektor (3, 1) auf den Vektor (1, 0) (also die x-Achse).",
        hint: "Nutze die Formel: (v·u / u·u) · u. Hier: (3·1 + 1·0) / (1·1 + 0·0) · (1, 0).",
        quiz: {
          question: "Was ist eine Projektion?",
          options: ["Eine Spiegelung", "Wie ein Schatten — man wirft einen Vektor auf eine Linie oder Ebene", "Eine Drehung", "Eine Vergrößerung"],
          answerIndex: 1,
          explanation: "Eine Projektion ist wie ein Schatten: Man wirft den Vektor auf eine Linie oder Ebene und findet den nächstgelegenen Punkt."
        }
      },
      {
        id: "m9-l3",
        title: "Gram-Schmidt: Senkrechte Basen bauen",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 70,
        theory: [
          "Das Gram-Schmidt-Verfahren macht aus beliebigen Vektoren senkrechte (orthogonale) Vektoren. Wie als würde man krumme Stäbe geradebiegen.",
          "Wenn alle Vektoren senkrecht aufeinander stehen und die Länge 1 haben, nennt man das orthonormal. Das macht Rechnen viel einfacher.",
          "Die QR-Zerlegung teilt eine Matrix in zwei Teile: Q (senkrechte Vektoren) und R (eine Dreiecksmatrix)."
        ],
        example: "Aus den Vektoren (1, 1) und (1, 0) macht Gram-Schmidt zwei senkrechte Vektoren: (1, 1) bleibt, und der zweite wird korrigiert, bis er senkrecht zum ersten steht.",
        exercise: "Wende Gram-Schmidt auf (1, 0) und (1, 1) an, um zwei senkrechte Vektoren zu erhalten.",
        hint: "Der erste Vektor bleibt. Beim zweiten: Ziehe die Projektion des zweiten auf den ersten ab.",
        quiz: {
          question: "Was bedeutet 'orthonormal'?",
          options: ["Alle Vektoren sind gleich lang", "Vektoren stehen senkrecht aufeinander und haben Länge 1", "Es gibt nur zwei Vektoren", "Die Determinante ist 1"],
          answerIndex: 1,
          explanation: "Orthonormal = orthogonal (senkrecht aufeinander) + normiert (jeder hat die Länge 1)."
        }
      }
    ]
  },
  {
    id: "mod-10",
    title: "SVD und Datenanalyse",
    level: "Fortgeschritten → Profi",
    targetHours: 12,
    goals: [
      "Den Spektralsatz verstehen",
      "Die SVD (Singulärwertzerlegung) kennenlernen",
      "Ausgleichsrechnung verstehen"
    ],
    lessons: [
      {
        id: "m10-l1",
        title: "Der Spektralsatz",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Der Spektralsatz ist eine gute Nachricht: Bei symmetrischen Matrizen (oben rechts = unten links) sind die Eigenwerte immer reelle Zahlen und die Eigenvektoren stehen senkrecht aufeinander.",
          "Das bedeutet: Man kann eine symmetrische Matrix besonders einfach zerlegen — in senkrechte Richtungen mit Streckfaktoren.",
          "Das ist nützlich für viele Anwendungen, zum Beispiel wenn man das 'wichtigste' Merkmal von Daten finden will."
        ],
        example: "Die symmetrische Matrix [[2, 1], [1, 2]] hat die Eigenwerte 3 und 1. Die Eigenvektoren (1, 1) und (1, -1) stehen senkrecht aufeinander.",
        exercise: "Prüfe, ob die Eigenvektoren von [[3, 1], [1, 3]] senkrecht aufeinander stehen.",
        hint: "Berechne das Skalarprodukt der Eigenvektoren. Wenn es null ist, stehen sie senkrecht.",
        quiz: {
          question: "Für welche Matrizen gilt der Spektralsatz (Eigenwerte sind reell, Eigenvektoren senkrecht)?",
          options: ["Für alle Matrizen", "Für symmetrische Matrizen (oben rechts = unten links)", "Nur für Diagonalmatrizen", "Nur für Nullmatrizen"],
          answerIndex: 1,
          explanation: "Der Spektralsatz gilt für symmetrische Matrizen: Die Eigenwerte sind reell und die Eigenvektoren stehen senkrecht aufeinander."
        }
      },
      {
        id: "m10-l2",
        title: "SVD: Matrizen zerlegen",
        difficulty: "Profi",
        estimatedMinutes: 75,
        theory: [
          "SVD (Singulärwertzerlegung) zerlegt jede Matrix in drei Teile: A = U · Σ · Vᵀ. Das geht für JEDEN Matrix, nicht nur für symmetrische!",
          "Σ enthält die 'Singulärwerte' — sie sagen, wie wichtig die einzelnen Richtungen sind. Große Werte = wichtig, kleine = unwichtig.",
          "SVD wird viel in Datenanalyse und Bildkomprimierung verwendet: Man behält nur die wichtigsten Richtungen und wirft den Rest weg."
        ],
        example: "Stell dir ein Bild vor. SVD findet die 'wichtigsten' Muster. Wenn man nur die wichtigsten 10 behält, sieht das Bild immer noch ähnlich aus, braucht aber viel weniger Speicher.",
        exercise: "Erkläre in eigenen Worten, warum große Singulärwerte 'wichtiger' sind als kleine.",
        hint: "Denk an ein Foto: Die Hauptsache (große Singulärwerte) zeigt das Motiv, die Details (kleine) kann man oft weglassen.",
        quiz: {
          question: "Für welche Matrizen gibt es eine SVD?",
          options: ["Nur für quadratische Matrizen", "Für jede reelle Matrix", "Nur für symmetrische Matrizen", "Nur für invertierbare Matrizen"],
          answerIndex: 1,
          explanation: "Die SVD funktioniert für jede reelle Matrix — egal welche Form. Das ist ihre große Stärke."
        }
      },
      {
        id: "m10-l3",
        title: "Ausgleichsrechnung (Least Squares)",
        difficulty: "Profi",
        estimatedMinutes: 70,
        theory: [
          "Manchmal hat man mehr Gleichungen als Unbekannte — und keine exakte Lösung. Least Squares findet dann die bestmögliche Näherung.",
          "Es minimiert den Fehler: Die Differenz zwischen Vorhersage und echten Werten wird so klein wie möglich gemacht.",
          "Das ist genau das, was Excel macht, wenn du eine 'Trendlinie' in ein Diagramm einfügst!"
        ],
        example: "Du hast 5 Messpunkte und willst eine Gerade durchlegen, die am besten passt. Least Squares findet diese Gerade — sie geht vielleicht durch keinen Punkt genau, aber der Gesamtabstand ist minimal.",
        exercise: "Du hast die Punkte (0, 1), (1, 2), (2, 3). Welche Gerade y = a·x + b passt am besten?",
        hint: "Die Punkte liegen fast auf der Geraden y = x + 1. Die Least-Squares-Lösung findet diese.",
        quiz: {
          question: "Was macht die Least-Squares-Methode?",
          options: ["Sie findet die exakte Lösung", "Sie findet die bestmögliche Näherung, wenn es keine exakte Lösung gibt", "Sie teilt durch null", "Sie zeichnet ein Bild"],
          answerIndex: 1,
          explanation: "Least Squares findet die Lösung mit dem kleinsten möglichen Fehler — die bestmögliche Näherung."
        }
      }
    ]
  },
  {
    id: "mod-11",
    title: "Prüfungsvorbereitung und Tipps",
    level: "Profi",
    targetHours: 10,
    goals: [
      "Wissen verknüpfen statt auswendig lernen",
      "Häufige Fehler vermeiden",
      "Strategien für die Prüfung entwickeln"
    ],
    lessons: [
      {
        id: "m11-l1",
        title: "Wenn Matrizen nicht diagonalisierbar sind",
        difficulty: "Profi",
        estimatedMinutes: 65,
        theory: [
          "Nicht jede Matrix ist diagonalisierbar. Manchmal fehlen Eigenvektoren. Die Jordan-Normalform ist eine Möglichkeit, auch diese Matrizen zu vereinfachen.",
          "Statt echter Eigenvektoren verwendet man 'verallgemeinerte Eigenvektoren'. Das ist wie ein Ersatzbaustein, wenn der echte fehlt.",
          "Für die meisten Anwendungen reicht es zu wissen, dass dieser Fall existiert — die Details lernt man, wenn man sie braucht."
        ],
        example: "Die Matrix [[1, 1], [0, 1]] hat nur einen Eigenwert (1) und nur einen Eigenvektor. Sie lässt sich nicht diagonalisieren — aber man kann die Jordan-Form verwenden.",
        exercise: "Erkläre in eigenen Worten, warum eine Matrix nicht diagonalisierbar sein kann.",
        hint: "Es hat mit zu wenigen Eigenvektoren zu tun — nicht genug Bausteine für eine Basis.",
        quiz: {
          question: "Wann ist eine Matrix 'defekt' (nicht diagonalisierbar)?",
          options: ["Wenn die Determinante 1 ist", "Wenn es zu wenige unabhängige Eigenvektoren gibt", "Wenn alle Eigenwerte verschieden sind", "Wenn die Matrix symmetrisch ist"],
          answerIndex: 1,
          explanation: "Wenn es nicht genug unabhängige Eigenvektoren für eine Basis gibt, ist die Matrix defekt — sie lässt sich nicht diagonalisieren."
        }
      },
      {
        id: "m11-l2",
        title: "Rundungsfehler und Stabilität",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Computer können nicht unendlich genau rechnen — es gibt immer kleine Rundungsfehler. Bei manchen Rechnungen werden diese Fehler groß, bei anderen klein.",
          "Die 'Konditionszahl' sagt, wie empfindlich eine Rechnung ist. Eine hohe Konditionszahl bedeutet: Kleine Änderungen in den Daten können große Änderungen im Ergebnis bewirken.",
          "Mit guten Verfahren (wie Pivotisierung beim Gauss-Verfahren) kann man Rundungsfehler klein halten."
        ],
        example: "Wenn eine Matrix fast eine Determinante von 0 hat, sind die Lösungen sehr empfindlich. Eine winzige Änderung der Eingabe kann das Ergebnis komplett verändern.",
        exercise: "Erkläre, warum man beim Gauss-Verfahren die Zeile mit der größten Zahl als erste wählen sollte (Pivotisierung).",
        hint: "Wenn man durch eine sehr kleine Zahl teilt, werden Rundungsfehler groß. Größere Zahlen sind sicherer.",
        quiz: {
          question: "Was sagt die Konditionszahl aus?",
          options: ["Wie schnell der Computer rechnet", "Wie empfindlich das Ergebnis auf kleine Änderungen reagiert", "Wie viele Nullen die Matrix hat", "Wie groß die Determinante ist"],
          answerIndex: 1,
          explanation: "Die Konditionszahl zeigt, wie stark kleine Störungen in den Daten das Ergebnis beeinflussen."
        }
      },
      {
        id: "m11-l3",
        title: "Tipps für die Prüfung",
        difficulty: "Profi",
        estimatedMinutes: 55,
        theory: [
          "Fang mit den Aufgaben an, die du sofort verstehst. Das gibt Sicherheit und Punkte.",
          "Schreib jeden Zwischenschritt auf. Auch wenn das Endergebnis falsch ist, gibt es für richtige Zwischenschritte Punkte.",
          "Prüfe am Ende: Stimmen die Dimensionen? Ist das Ergebnis plausibel? Ein schneller Dimensionscheck findet viele Flüchtigkeitsfehler."
        ],
        example: "Wenn du eine 2x2-Matrix mit einer 3x2-Matrix multiplizierst und das Ergebnis eine 3x3-Matrix sein soll — das kann nicht stimmen! Ein Dimensionscheck entdeckt das sofort.",
        exercise: "Stell dir vor, du hast 90 Minuten Zeit für 4 Aufgaben. Wie teilst du die Zeit ein?",
        hint: "Ungefähr 20 Minuten pro Aufgabe und 10 Minuten am Ende für Kontrolle.",
        quiz: {
          question: "Was ist der schnellste Plausibilitätscheck in einer Prüfung?",
          options: ["Alle Rechnungen neu rechnen", "Prüfen, ob die Dimensionen (Zeilen/Spalten) bei jeder Rechnung zusammenpassen", "Nur das Vorzeichen kontrollieren", "Das Ergebnis abschätzen"],
          answerIndex: 1,
          explanation: "Ein Dimensionscheck ist schnell und findet sofort viele Fehler — wenn die Dimensionen nicht passen, ist etwas falsch."
        }
      }
    ]
  }
]);
