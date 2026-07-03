window.LEARNING_PATH = Object.freeze([
  {
    id: "mod-1",
    title: "Fundament: Mathe-Basics reaktivieren",
    level: "Einsteiger",
    targetHours: 8,
    goals: [
      "Sichere Notation (Mengen, Intervalle, Summen, Indizes)",
      "Rechnen mit Brüchen, Potenzen und Klammern",
      "Logisches Argumentieren mit einfachen Beweisen"
    ],
    lessons: [
      {
        id: "m1-l1",
        title: "Zahlenmengen, Terme, Umformen",
        difficulty: "Einsteiger",
        estimatedMinutes: 45,
        theory: [
          "Lineare Algebra nutzt präzise Sprache: natürliche, ganze, rationale und reelle Zahlen treten in Beweisen gezielt auf.",
          "Termumformungen folgen Rechengesetzen (Kommutativ-, Assoziativ-, Distributivgesetz). Fehler hier wirken später wie Kettenreaktionen.",
          "Gewöhne dir an, jeden Rechenschritt kurz zu begründen: das erleichtert Debugging in längeren Herleitungen."
        ],
        example: "Vereinfache 3(x - 2) - 2(x + 5) = x - 16. So erkennst du später Strukturen in Matrixgleichungen schneller.",
        exercise: "Forme 4(2x - 3) + 5(1 - x) um und bestimme x für den Wert 7.",
        hint: "Erst ausmultiplizieren, dann gleichartige Terme zusammenfassen.",
        quiz: {
          question: "Welches Gesetz beschreibt a(b + c) = ab + ac?",
          options: ["Assoziativgesetz", "Distributivgesetz", "Kommutativgesetz", "Neutralitätsgesetz"],
          answerIndex: 1,
          explanation: "Das Distributivgesetz verteilt Multiplikation über Addition."
        }
      },
      {
        id: "m1-l2",
        title: "Gleichungen, Funktionen, Graphen",
        difficulty: "Einsteiger",
        estimatedMinutes: 50,
        theory: [
          "Eine lineare Gleichung hat die Form ax + b = 0. In mehreren Variablen wird daraus ein lineares Gleichungssystem.",
          "Funktionen beschreiben Zuordnungen; lineare Funktionen sind Vorstufe zu linearen Abbildungen.",
          "Interpretation über Graphen hilft beim Verständnis von Lösungsmengen."
        ],
        example: "f(x) = 2x - 1 ist linear-affin. Der Ausdruck ohne Konstante (2x) entspricht einer linearen Abbildung.",
        exercise: "Bestimme die Nullstelle von f(x) = -3x + 12 und deute sie grafisch.",
        hint: "Setze f(x)=0 und löse nach x auf.",
        quiz: {
          question: "Wann ist eine Funktion f linear im strengen Sinn der Linearen Algebra?",
          options: [
            "Wenn sie die Form ax + b hat",
            "Wenn f(u+v)=f(u)+f(v) und f(λu)=λf(u)",
            "Wenn ihr Graph eine Gerade ist",
            "Wenn b = 1 gilt"
          ],
          answerIndex: 1,
          explanation: "Linearität in der Algebra ist über Additivität und Homogenität definiert."
        }
      },
      {
        id: "m1-l3",
        title: "Summenzeichen und Beweisideen",
        difficulty: "Einsteiger",
        estimatedMinutes: 55,
        theory: [
          "Sigma-Notation komprimiert lange Summen und taucht in vielen Matrix- und Vektorformeln auf.",
          "Wichtige Beweismethoden: direkter Beweis, Widerspruch, vollständige Induktion.",
          "Ziel ist nicht auswendig lernen, sondern zu verstehen, welche Struktur ein Beweis benötigt."
        ],
        example: "Die i-te Komponente eines Matrix-Vektor-Produkts lautet (Ax)_i = Σ a_ij x_j.",
        exercise: "Schreibe 2 + 5 + 8 + ... + 29 als Sigma-Ausdruck und bestimme den Wert.",
        hint: "Erkenne die arithmetische Folge und die Anzahl der Summanden.",
        quiz: {
          question: "Welche Methode ist typisch, um Aussagen für alle n in N zu zeigen?",
          options: ["Widerspruch", "Induktion", "Substitution", "Regression"],
          answerIndex: 1,
          explanation: "Die vollständige Induktion ist Standard für Aussagen über natürliche Zahlen."
        }
      }
    ]
  },
  {
    id: "mod-2",
    title: "Vektoren in R^n",
    level: "Einsteiger",
    targetHours: 10,
    goals: [
      "Vektoren geometrisch und algebraisch deuten",
      "Rechnen mit Normen, Skalarmultiplikation und Linearkombinationen",
      "Linear unabhängige Mengen erkennen"
    ],
    lessons: [
      {
        id: "m2-l1",
        title: "Vektoren verstehen und darstellen",
        difficulty: "Einsteiger",
        estimatedMinutes: 45,
        theory: [
          "Ein Vektor ist ein geordnetes Tupel von Zahlen, z. B. (x1, x2, ..., xn).",
          "Geometrisch im R2/R3: Pfeil mit Richtung und Länge.",
          "In höheren Dimensionen bleibt die Rechenstruktur gleich, auch ohne direkte Zeichnung."
        ],
        example: "(3, -1, 2) kann Position, Geschwindigkeit oder Datensatz repräsentieren.",
        exercise: "Zeichne im R2 die Vektoren (2,1), (-1,2), (1,-2).",
        hint: "Starte jeweils im Ursprung und trage Komponenten entlang der Achsen auf.",
        quiz: {
          question: "Was bleibt bei einem Vektor unabhängig vom Startpunkt erhalten?",
          options: ["Nur die x-Koordinate", "Richtung und Länge", "Nur die y-Koordinate", "Die Farbe im Koordinatensystem"],
          answerIndex: 1,
          explanation: "Freie Vektoren sind über Richtung und Betrag bestimmt."
        }
      },
      {
        id: "m2-l2",
        title: "Rechenregeln für Vektoren",
        difficulty: "Einsteiger",
        estimatedMinutes: 60,
        theory: [
          "Vektoraddition und Skalarmultiplikation erfolgen komponentenweise.",
          "Die Norm ||v|| misst Länge; für den euklidischen Fall ||v|| = sqrt(v·v).",
          "Das Skalarprodukt verbindet Algebra und Geometrie (Winkel, Orthogonalität)."
        ],
        example: "u=(1,2,3), v=(2,0,1) => u·v = 5 und ||u|| = sqrt(14).",
        exercise: "Berechne u+v, 3u, ||v|| und den Winkel zwischen u=(1,1,0), v=(1,0,1).",
        hint: "Nutze cos(phi)= (u·v)/(||u|| ||v||).",
        quiz: {
          question: "Wann sind zwei Vektoren orthogonal?",
          options: ["Wenn ihre Norm gleich ist", "Wenn u·v = 0", "Wenn u = v", "Wenn beide positiv sind"],
          answerIndex: 1,
          explanation: "Orthogonalität entspricht Null-Skalarprodukt."
        }
      },
      {
        id: "m2-l3",
        title: "Linearkombination, Spann, Unabhängigkeit",
        difficulty: "Einsteiger",
        estimatedMinutes: 65,
        theory: [
          "Linearkombinationen haben Form Σ λ_i v_i.",
          "Der Spann ist die Menge aller Linearkombinationen gegebener Vektoren.",
          "Linear unabhängig heißt: nur die triviale Kombination ergibt den Nullvektor."
        ],
        example: "v3=(3,3) ist von v1=(1,1), v2=(2,2) abhängig, weil v3=v1+v2.",
        exercise: "Prüfe auf Unabhängigkeit: (1,0,1), (0,1,1), (1,1,2).",
        hint: "Setze λ1v1+λ2v2+λ3v3=0 und löse das entstehende System.",
        quiz: {
          question: "Was bedeutet linear unabhängig?",
          options: [
            "Alle Vektoren haben dieselbe Länge",
            "Es gibt unendlich viele Kombinationen",
            "Nur die Koeffizienten λ_i = 0 liefern den Nullvektor",
            "Die Vektoren liegen auf einer Geraden"
          ],
          answerIndex: 2,
          explanation: "Genau diese Eigenschaft definiert lineare Unabhängigkeit."
        }
      }
    ]
  },
  {
    id: "mod-3",
    title: "Matrizen und Rechenoperationen",
    level: "Einsteiger → Aufbau",
    targetHours: 11,
    goals: [
      "Matrizen als lineare Operatoren interpretieren",
      "Sicher addieren, multiplizieren und transponieren",
      "Inversen verstehen und berechnen"
    ],
    lessons: [
      {
        id: "m3-l1",
        title: "Matrizen-Grundlagen",
        difficulty: "Aufbau",
        estimatedMinutes: 50,
        theory: [
          "Eine Matrix A in R^(m x n) beschreibt eine lineare Abbildung von R^n nach R^m.",
          "Element a_ij liegt in Zeile i, Spalte j.",
          "Typische Spezialfälle: Diagonal-, Dreiecks-, Einheits- und Nullmatrix."
        ],
        example: "A=[[1,2],[0,1]] streckt und schert Punkte in der Ebene.",
        exercise: "Identifiziere Form und Dimension von A in R^(3x2) und B in R^(2x3).",
        hint: "Dimension m x n immer explizit notieren.",
        quiz: {
          question: "Für welche Matrizen ist Addition A + B definiert?",
          options: [
            "Wenn A und B dieselbe Anzahl Zeilen haben",
            "Wenn A und B quadratisch sind",
            "Wenn A und B dieselbe Dimension haben",
            "Immer"
          ],
          answerIndex: 2,
          explanation: "Addition ist komponentenweise, daher braucht man gleiche Form."
        }
      },
      {
        id: "m3-l2",
        title: "Matrixmultiplikation strukturiert lernen",
        difficulty: "Aufbau",
        estimatedMinutes: 65,
        theory: [
          "AB ist nur definiert, wenn Spaltenzahl(A) = Zeilenzahl(B).",
          "Die Multiplikation ist im Allgemeinen nicht kommutativ: AB != BA.",
          "Interpretation: erst B anwenden, dann A."
        ],
        example: "Für A(2x3), B(3x2) ergibt AB eine 2x2-Matrix, BA eine 3x3-Matrix.",
        exercise: "Berechne AB mit A=[[1,0,2],[-1,3,1]], B=[[3,1],[2,1],[1,0]].",
        hint: "Jeder Eintrag ist ein Skalarprodukt aus Zeile und Spalte.",
        quiz: {
          question: "Welche Aussage ist korrekt?",
          options: ["AB = BA für alle quadratischen Matrizen", "AB kann existieren, BA aber nicht", "AB ist immer symmetrisch", "AB ist immer invertierbar"],
          answerIndex: 1,
          explanation: "Definition hängt von den Dimensionen ab; BA muss nicht definiert sein."
        }
      },
      {
        id: "m3-l3",
        title: "Inverse Matrix und Rechenbedeutung",
        difficulty: "Aufbau",
        estimatedMinutes: 70,
        theory: [
          "A ist invertierbar, wenn es A^-1 mit A A^-1 = I gibt.",
          "Nicht jede Matrix ist invertierbar; singuläre Matrizen haben det(A)=0.",
          "Inversen lösen lineare Gleichungen x = A^-1 b, wenn A regulär ist."
        ],
        example: "A=[[2,1],[1,1]] hat A^-1=[[1,-1],[-1,2]].",
        exercise: "Berechne die Inverse von [[4,7],[2,6]] und prüfe durch Multiplikation.",
        hint: "Für 2x2: A^-1 = (1/det(A)) [[d,-b],[-c,a]].",
        quiz: {
          question: "Wann ist eine Matrix nicht invertierbar?",
          options: ["Wenn det(A)=0", "Wenn A quadratisch ist", "Wenn A transponiert wird", "Wenn A positive Einträge hat"],
          answerIndex: 0,
          explanation: "det(A)=0 ist das Kriterium für Singularität."
        }
      }
    ]
  },
  {
    id: "mod-4",
    title: "Lineare Gleichungssysteme & Gauss",
    level: "Aufbau",
    targetHours: 12,
    goals: [
      "Erweiterte Matrix sauber aufstellen",
      "Gauss-Algorithmus fehlerfrei anwenden",
      "Lösungsstruktur über Rang interpretieren"
    ],
    lessons: [
      {
        id: "m4-l1",
        title: "LGS in Matrixform",
        difficulty: "Aufbau",
        estimatedMinutes: 50,
        theory: [
          "Ein LGS Ax=b besteht aus Koeffizientenmatrix A, Unbekanntenvektor x und rechter Seite b.",
          "Die erweiterte Matrix [A|b] ist Grundlage für algorithmische Lösung.",
          "Homogene Systeme (b=0) besitzen immer die triviale Lösung."
        ],
        example: "2x+y=1, x-y=3 wird zu [[2,1|1],[1,-1|3]].",
        exercise: "Überführe ein 3x3-LGS in die erweiterte Matrix.",
        hint: "Achte auf einheitliche Variablenreihenfolge in jeder Zeile.",
        quiz: {
          question: "Was gilt immer für ein homogenes System Ax=0?",
          options: ["Keine Lösung", "Genau eine Lösung", "Mindestens die triviale Lösung", "Immer unendlich viele Lösungen"],
          answerIndex: 2,
          explanation: "x=0 erfüllt Ax=0 immer."
        }
      },
      {
        id: "m4-l2",
        title: "Gauss-Elimination mit Pivotstrategie",
        difficulty: "Aufbau",
        estimatedMinutes: 75,
        theory: [
          "Erlaubte Zeilenumformungen: Zeilen tauschen, skalieren (mit !=0), Vielfaches addieren.",
          "Ziel ist Zeilenstufenform oder reduzierte Zeilenstufenform.",
          "Partielle Pivotisierung verbessert numerische Stabilität."
        ],
        example: "Bei kleinem Pivot wird mit darunterliegender Zeile getauscht, um Rundungsfehler zu reduzieren.",
        exercise: "Löse ein 3x3-System per Gauss und gib die Rücksubstitution explizit an.",
        hint: "Arbeite spaltenweise und markiere Pivotelemente.",
        quiz: {
          question: "Welche Zeilenoperation ist NICHT erlaubt?",
          options: [
            "Zwei Zeilen vertauschen",
            "Eine Zeile mit 0 multiplizieren",
            "Vielfaches einer Zeile zu anderer addieren",
            "Eine Zeile mit 5 multiplizieren"
          ],
          answerIndex: 1,
          explanation: "Multiplikation mit 0 zerstört Information und ist keine äquivalente Umformung."
        }
      },
      {
        id: "m4-l3",
        title: "Rang, Freiheitsgrade, Lösbarkeit",
        difficulty: "Aufbau",
        estimatedMinutes: 65,
        theory: [
          "Rang(A) = Anzahl linear unabhängiger Zeilen/Spalten.",
          "Kriterium: Ein System ist lösbar genau dann, wenn Rang(A)=Rang([A|b]).",
          "Ist Rang(A)<Anzahl Variablen, entstehen freie Variablen."
        ],
        example: "Ein 3x4-System mit Rang 3 hat genau einen Freiheitsgrad.",
        exercise: "Bestimme Rang(A), Rang([A|b]) und klassifiziere die Lösungsmenge.",
        hint: "Nutze die Stufenform zur schnellen Rangbestimmung.",
        quiz: {
          question: "Wann hat ein konsistentes System unendlich viele Lösungen?",
          options: [
            "Wenn Rang(A)=n",
            "Wenn Rang(A)<n und Rang(A)=Rang([A|b])",
            "Wenn Rang([A|b])>Rang(A)",
            "Wenn det(A)!=0"
          ],
          answerIndex: 1,
          explanation: "Dann existieren freie Variablen bei gleichzeitigem Konsistenzkriterium."
        }
      }
    ]
  },
  {
    id: "mod-5",
    title: "Determinanten",
    level: "Aufbau",
    targetHours: 8,
    goals: [
      "Determinanten berechnen (2x2, 3x3, Entwicklung)",
      "Rechenregeln sicher nutzen",
      "Geometrische und algebraische Bedeutung verknüpfen"
    ],
    lessons: [
      {
        id: "m5-l1",
        title: "Definition und Rechenwege",
        difficulty: "Aufbau",
        estimatedMinutes: 55,
        theory: [
          "Für 2x2 gilt det([[a,b],[c,d]]) = ad - bc.",
          "Für 3x3: Sarrus oder Laplace-Entwicklung.",
          "Für größere Matrizen ist Gauß-basierte Berechnung oft effizienter."
        ],
        example: "det([[1,2,3],[0,1,4],[5,6,0]]) = 1.",
        exercise: "Berechne die Determinante einer 3x3-Matrix mit zwei Methoden.",
        hint: "Vergleiche Ergebnis als Plausibilitätscheck.",
        quiz: {
          question: "Welche Aussage ist korrekt?",
          options: [
            "det(A+B)=det(A)+det(B) gilt immer",
            "det(AB)=det(A)det(B)",
            "det(A^T)=0 für alle A",
            "det(I)=0"
          ],
          answerIndex: 1,
          explanation: "Multiplikativität ist eine zentrale Determinantenregel."
        }
      },
      {
        id: "m5-l2",
        title: "Determinantenregeln gezielt anwenden",
        difficulty: "Aufbau",
        estimatedMinutes: 60,
        theory: [
          "Zeilentausch ändert das Vorzeichen der Determinante.",
          "Multiplikation einer Zeile mit λ skaliert det um λ.",
          "Addieren eines Vielfachen einer Zeile zu einer anderen lässt det unverändert."
        ],
        example: "Mit Zeilenumformungen auf Dreiecksform reduzieren und Diagonalprodukt nutzen.",
        exercise: "Führe Umformungen durch und verfolge det-Änderungen explizit.",
        hint: "Notiere nach jeder Umformung den Korrekturfaktor.",
        quiz: {
          question: "Was bewirkt ein Zeilentausch?",
          options: ["Determinante bleibt gleich", "Determinante wird quadriert", "Vorzeichenwechsel", "Determinante wird 0"],
          answerIndex: 2,
          explanation: "Ein einzelner Tausch multipliziert det mit -1."
        }
      },
      {
        id: "m5-l3",
        title: "Determinante als Volumenfaktor",
        difficulty: "Aufbau",
        estimatedMinutes: 45,
        theory: [
          "det(A) misst orientierten Volumenfaktor der linearen Abbildung A.",
          "|det(A)| skaliert Flächen/Volumen; negatives Vorzeichen bedeutet Orientierungswechsel.",
          "det(A)=0 bedeutet Zusammenklappen in niedrigere Dimension."
        ],
        example: "Eine Matrix mit det=3 vergrößert Flächen im R2 um Faktor 3.",
        exercise: "Interpretiere geometrisch die Determinantenwerte 2, -1/2 und 0.",
        hint: "Trenne Betrag (Skalierung) und Vorzeichen (Orientierung).",
        quiz: {
          question: "Was bedeutet det(A)=0 geometrisch?",
          options: [
            "Die Abbildung spiegelt",
            "Volumen bleibt erhalten",
            "Die Abbildung ist nicht invertierbar",
            "Die Matrix ist orthogonal"
          ],
          answerIndex: 2,
          explanation: "det=0 impliziert Singularität und Volumenverlust."
        }
      }
    ]
  },
  {
    id: "mod-6",
    title: "Vektorräume, Unterräume, Basis, Dimension",
    level: "Aufbau",
    targetHours: 12,
    goals: [
      "Axiome eines Vektorraums verstehen",
      "Unterräume über Spann und Gleichungssysteme charakterisieren",
      "Basen konstruieren und Dimension bestimmen"
    ],
    lessons: [
      {
        id: "m6-l1",
        title: "Vektorraum-Axiome in der Praxis",
        difficulty: "Aufbau",
        estimatedMinutes: 60,
        theory: [
          "Ein Vektorraum braucht zwei Verknüpfungen (Addition, Skalarmultiplikation) und Axiome.",
          "Beispiele: R^n, Polynome, Matrizenräume, Funktionenräume.",
          "Nicht-Beispiele helfen beim Verständnis (fehlende Abgeschlossenheit, fehlendes Nullelement)."
        ],
        example: "Alle Polynome bis Grad <=2 bilden einen 3-dimensionalen Vektorraum.",
        exercise: "Prüfe, ob die Menge {(x,y) in R2 | x>0} ein Unterraum ist.",
        hint: "Teste Abgeschlossenheit unter Addition und Skalarmultiplikation mit negativen Skalaren.",
        quiz: {
          question: "Welche Eigenschaft ist für Unterräume zwingend?",
          options: ["Enthält das Nullelement", "Ist endlich", "Besteht aus orthogonalen Vektoren", "Hat nur ganze Zahlen"],
          answerIndex: 0,
          explanation: "Ohne Nullvektor kann keine Unterraumstruktur vorliegen."
        }
      },
      {
        id: "m6-l2",
        title: "Spann, Erzeugendensystem, Basis",
        difficulty: "Aufbau",
        estimatedMinutes: 70,
        theory: [
          "Ein Erzeugendensystem spannt den Raum auf; eine Basis ist zusätzlich linear unabhängig.",
          "Jeder Vektor im Raum hat bezüglich einer Basis eine eindeutige Koordinatendarstellung.",
          "Basen sind nicht eindeutig, die Dimension aber schon."
        ],
        example: "Im R2 sind (1,0),(0,1) und (1,1),(1,-1) unterschiedliche Basen.",
        exercise: "Entferne aus einem gegebenen Erzeugendensystem alle abhängigen Vektoren.",
        hint: "Gauss hilft beim Erkennen redundanter Vektoren.",
        quiz: {
          question: "Was ist eine Basis?",
          options: [
            "Eine möglichst große Vektormenge",
            "Ein linear unabhängiges Erzeugendensystem",
            "Jede orthogonale Menge",
            "Eine Menge mit Rang 1"
          ],
          answerIndex: 1,
          explanation: "Beide Bedingungen sind nötig: Erzeugung + Unabhängigkeit."
        }
      },
      {
        id: "m6-l3",
        title: "Dimension und Basiswechsel",
        difficulty: "Aufbau",
        estimatedMinutes: 65,
        theory: [
          "Die Dimension ist die Anzahl von Basisvektoren.",
          "Beim Basiswechsel ändern sich Koordinaten, der Vektor bleibt identisch.",
          "Die Basiswechselmatrix verknüpft alte und neue Koordinaten."
        ],
        example: "In der Standardbasis und in einer Eigenbasis hat derselbe Vektor unterschiedliche Koordinaten.",
        exercise: "Bestimme die Koordinaten eines Vektors in einer neuen Basis.",
        hint: "Löse B*c=v nach den neuen Koordinaten c.",
        quiz: {
          question: "Was bleibt bei einem Basiswechsel unverändert?",
          options: ["Koordinaten", "Darstellungsmatrix jeder Abbildung", "Der geometrische Vektor", "Dimension des Koordinatenvektors"],
          answerIndex: 2,
          explanation: "Nur die Repräsentation ändert sich, nicht das Objekt."
        }
      }
    ]
  },
  {
    id: "mod-7",
    title: "Lineare Abbildungen",
    level: "Aufbau → Fortgeschritten",
    targetHours: 10,
    goals: [
      "Linearitätskriterien sicher anwenden",
      "Kern und Bild bestimmen",
      "Rang-Nullität interpretieren"
    ],
    lessons: [
      {
        id: "m7-l1",
        title: "Definition und Beispiele",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 50,
        theory: [
          "Lineare Abbildungen erfüllen T(u+v)=T(u)+T(v) und T(λu)=λT(u).",
          "Jede Matrix A definiert T(x)=Ax.",
          "Ableitung ist linear, Translationen sind im Allgemeinen nicht linear."
        ],
        example: "T(x,y)=(2x-y, x+3y) ist linear, T(x,y)=(x+1,y) nicht.",
        exercise: "Prüfe drei gegebene Abbildungen auf Linearität.",
        hint: "Teste direkt beide Linearitätsbedingungen.",
        quiz: {
          question: "Welche Abbildung ist linear?",
          options: ["T(x)=x+2", "T(x,y)=(x^2,y)", "T(x,y)=(3x,3y)", "T(x)=|x|"],
          answerIndex: 2,
          explanation: "Nur die skalare Streckung erfüllt beide Bedingungen."
        }
      },
      {
        id: "m7-l2",
        title: "Kern und Bild",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 70,
        theory: [
          "Kern(T) = {v | T(v)=0} ist Unterraum des Definitionsraums.",
          "Bild(T) = {T(v)} ist Unterraum des Zielraums.",
          "Kern misst Informationsverlust, Bild die erreichbaren Richtungen."
        ],
        example: "Bei Projektion auf x-Achse ist Kern die y-Achse, Bild die x-Achse.",
        exercise: "Bestimme Kern und Bild einer 3x3-Matrix per Gauss.",
        hint: "Für Kern löse Ax=0, für Bild nutze Pivotspalten.",
        quiz: {
          question: "Was bedeutet Kern(T)={0}?",
          options: ["T ist nicht linear", "T ist injektiv", "T ist surjektiv", "T ist Nullabbildung"],
          answerIndex: 1,
          explanation: "Trivialer Kern ist äquivalent zu Injektivität."
        }
      },
      {
        id: "m7-l3",
        title: "Rang-Nullitätssatz",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 60,
        theory: [
          "Für T:V→W gilt dim(V)=dim(Kern(T))+dim(Bild(T)).",
          "Der Satz verbindet Freiheitsgrade und Informationsverlust.",
          "Praktisch: schnelle Plausibilitätsprüfung von Rechnungen."
        ],
        example: "Bei dim(V)=5 und Rang=3 folgt Nullität=2.",
        exercise: "Nutze Rang-Nullität, um fehlende Größe in Aufgaben zu bestimmen.",
        hint: "Formel direkt einsetzen und nach Unbekannter auflösen.",
        quiz: {
          question: "Wenn dim(V)=7 und dim(Kern)=2, wie groß ist dim(Bild)?",
          options: ["9", "5", "2", "14"],
          answerIndex: 1,
          explanation: "7 = 2 + dim(Bild) -> dim(Bild)=5."
        }
      }
    ]
  },
  {
    id: "mod-8",
    title: "Eigenwerte, Eigenvektoren, Diagonalisierung",
    level: "Fortgeschritten",
    targetHours: 13,
    goals: [
      "Eigenproblem systematisch lösen",
      "Charakteristisches Polynom richtig einsetzen",
      "Diagonaliserbarkeit beurteilen"
    ],
    lessons: [
      {
        id: "m8-l1",
        title: "Eigenwerte und Eigenvektoren",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 65,
        theory: [
          "Eigenvektor v erfüllt Av=λv mit v!=0.",
          "Eigenwerte geben natürliche Streckfaktoren der Abbildung an.",
          "Viele Dynamik- und Stabilitätsfragen führen auf Eigenanalysen."
        ],
        example: "A=[[2,0],[0,3]] hat Eigenwerte 2 und 3 mit Standardbasis-Eigenvektoren.",
        exercise: "Bestimme Eigenwerte und Eigenvektoren einer 2x2-Matrix.",
        hint: "Löse det(A-λI)=0 und danach (A-λI)v=0.",
        quiz: {
          question: "Warum darf der Eigenvektor nicht der Nullvektor sein?",
          options: [
            "Weil sonst jede Zahl Eigenwert wäre",
            "Weil det dann negativ wird",
            "Weil nur quadratische Matrizen erlaubt sind",
            "Weil Nullvektoren nicht in Vektorräumen liegen"
          ],
          answerIndex: 0,
          explanation: "Mit v=0 wäre Av=λv trivial für jedes λ."
        }
      },
      {
        id: "m8-l2",
        title: "Charakteristisches Polynom",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 70,
        theory: [
          "Eigenwerte sind Nullstellen von p_A(λ)=det(A-λI).",
          "Algebraische Vielfachheit kommt aus dem Polynom, geometrische aus dem Eigenraum.",
          "Komplexe Eigenwerte können selbst bei reellen Matrizen auftreten."
        ],
        example: "Rotation in R2 hat komplexe Eigenwerte e^{±iφ}.",
        exercise: "Finde alle Eigenwerte (inkl. Vielfachheiten) für eine 3x3-Matrix.",
        hint: "Achte auf faktorisierbare Ausdrücke und rationale Nullstellen.",
        quiz: {
          question: "Was ist die algebraische Vielfachheit?",
          options: [
            "Dimension des Eigenraums",
            "Anzahl der gleichen Nullstellen im charakteristischen Polynom",
            "Rang der Matrix",
            "Anzahl verschiedener Eigenwerte"
          ],
          answerIndex: 1,
          explanation: "Sie zählt, wie oft λ als Nullstelle im Polynom vorkommt."
        }
      },
      {
        id: "m8-l3",
        title: "Diagonaliserbarkeit prüfen",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 70,
        theory: [
          "A ist diagonalisierbar, wenn eine Basis aus Eigenvektoren existiert.",
          "Hinreichend: n paarweise verschiedene Eigenwerte für n x n-Matrix.",
          "Notwendig: Summe der Dimensionen der Eigenräume = n."
        ],
        example: "Defekte Matrizen besitzen zu wenige unabhängige Eigenvektoren und sind nicht diagonalisierbar.",
        exercise: "Prüfe für gegebene Matrix, ob P^-1AP diagonal wird.",
        hint: "Bestimme Eigenraumdimensionen statt nur Eigenwerte zu zählen.",
        quiz: {
          question: "Welche Bedingung garantiert Diagonalisierbarkeit einer n x n-Matrix?",
          options: [
            "det(A)=1",
            "n verschiedene Eigenwerte",
            "A ist symmetrisch nur im R2",
            "A hat nur positive Einträge"
          ],
          answerIndex: 1,
          explanation: "n verschiedene Eigenwerte liefern automatisch n linear unabhängige Eigenvektoren."
        }
      }
    ]
  },
  {
    id: "mod-9",
    title: "Skalarprodukt, Orthogonalität, QR",
    level: "Fortgeschritten",
    targetHours: 10,
    goals: [
      "Normen und Winkel sicher nutzen",
      "Orthogonale Projektionen berechnen",
      "Gram-Schmidt und QR-Zerlegung verstehen"
    ],
    lessons: [
      {
        id: "m9-l1",
        title: "Skalarprodukt-Räume",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 55,
        theory: [
          "Ein Skalarprodukt erfüllt Positivität, Symmetrie (oder Hermitesch) und Linearität.",
          "Norm und Abstand folgen direkt daraus.",
          "Orthogonale Basen vereinfachen Rechnungen massiv."
        ],
        example: "In orthonormaler Basis sind Koordinaten direkt Projektionen auf Basisvektoren.",
        exercise: "Prüfe, ob eine gegebene Vorschrift ein Skalarprodukt definiert.",
        hint: "Teste alle Axiome systematisch.",
        quiz: {
          question: "Wann ist eine Basis orthonormal?",
          options: [
            "Wenn alle Vektoren dieselbe Länge haben",
            "Wenn Vektoren paarweise orthogonal und normiert sind",
            "Wenn nur zwei Vektoren orthogonal sind",
            "Wenn ihre Determinante 1 ist"
          ],
          answerIndex: 1,
          explanation: "Orthogonalität plus Norm 1 für jeden Basisvektor."
        }
      },
      {
        id: "m9-l2",
        title: "Orthogonale Projektionen",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 65,
        theory: [
          "Die orthogonale Projektion minimiert den Fehlerabstand zum Unterraum.",
          "Für normierten Richtungsvektor u gilt proj_u(v)=(v·u)u.",
          "Auf Unterräume mit Matrix Q (orthonormale Spalten): proj(v)=QQ^Tv."
        ],
        example: "Best Approximation ist Grundlage der Ausgleichsrechnung.",
        exercise: "Projiziere v=(3,1,2) auf den von u=(1,1,0) erzeugten Unterraum.",
        hint: "u zuerst normieren oder Formel mit u·u im Nenner verwenden.",
        quiz: {
          question: "Welche Eigenschaft hat der Fehler v - proj(v)?",
          options: [
            "Er liegt im Unterraum",
            "Er ist orthogonal zum Unterraum",
            "Er ist immer der Nullvektor",
            "Er hat immer Norm 1"
          ],
          answerIndex: 1,
          explanation: "Genau diese Orthogonalität charakterisiert die Projektion."
        }
      },
      {
        id: "m9-l3",
        title: "Gram-Schmidt und QR-Zerlegung",
        difficulty: "Fortgeschritten",
        estimatedMinutes: 70,
        theory: [
          "Gram-Schmidt macht aus unabhängigen Vektoren eine orthonormale Basis.",
          "Mit Q orthonormal und R oberdreieckig gilt A=QR.",
          "QR ist numerisch stabil und wichtig für Ausgleichs- und Eigenwertverfahren."
        ],
        example: "Löse Ax≈b über QR statt Normalgleichungen für bessere Stabilität.",
        exercise: "Führe Gram-Schmidt für zwei bis drei Vektoren von Hand durch.",
        hint: "Nach jedem Schritt normieren und Rundungsfehler im Blick behalten.",
        quiz: {
          question: "Welche Matrixeigenschaft hat Q bei der QR-Zerlegung?",
          options: ["Q^TQ = I", "Q ist diagonal", "Q ist immer symmetrisch", "Q hat nur Einsen"],
          answerIndex: 0,
          explanation: "Q hat orthonormale Spalten, also Q^TQ=I."
        }
      }
    ]
  },
  {
    id: "mod-10",
    title: "Spektralsatz, SVD, Ausgleichsrechnung",
    level: "Fortgeschritten → Profi",
    targetHours: 12,
    goals: [
      "Symmetrische Matrizen spektral zerlegen",
      "Singulärwertzerlegung konzeptionell verstehen",
      "Least-Squares-Probleme sauber lösen"
    ],
    lessons: [
      {
        id: "m10-l1",
        title: "Spektralsatz",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Reelle symmetrische Matrizen sind orthogonal diagonalisierbar.",
          "Eigenwerte sind reell, Eigenvektoren verschiedener Eigenwerte orthogonal.",
          "Das vereinfacht viele Optimierungs- und Geometrieprobleme."
        ],
        example: "Quadratische Formen lassen sich in Hauptachsen transformieren.",
        exercise: "Diagonalisiere eine symmetrische 3x3-Matrix orthogonal.",
        hint: "Normiere Eigenvektoren und bilde Q aus diesen Spalten.",
        quiz: {
          question: "Für welche Matrizen gilt der reelle Spektralsatz?",
          options: ["Beliebige quadratische Matrizen", "Symmetrische reelle Matrizen", "Nur Diagonalmatrizen", "Nur invertierbare Matrizen"],
          answerIndex: 1,
          explanation: "Symmetrie ist die entscheidende Voraussetzung."
        }
      },
      {
        id: "m10-l2",
        title: "Singulärwertzerlegung (SVD)",
        difficulty: "Profi",
        estimatedMinutes: 75,
        theory: [
          "Jede Matrix A besitzt A = UΣV^T mit orthogonalen U,V und diagonalem Σ.",
          "Singulärwerte sind Wurzeln der Eigenwerte von A^TA.",
          "SVD liefert Rang, Kondition und beste Niedrigrang-Approximationen."
        ],
        example: "In Datenanalyse/PCA entspricht SVD zentralen Hauptachseninformationen.",
        exercise: "Bestimme Rang und Konditionszahl aus gegebenen Singulärwerten.",
        hint: "Konditionszahl = σ_max / σ_min (bei invertierbarer Matrix).",
        quiz: {
          question: "Welche Aussage ist richtig?",
          options: [
            "SVD existiert nur für quadratische Matrizen",
            "SVD existiert für jede reelle Matrix",
            "SVD und Eigenwertzerlegung sind identisch",
            "SVD benötigt keine Orthogonalität"
          ],
          answerIndex: 1,
          explanation: "Die Existenz der SVD ist sehr allgemein."
        }
      },
      {
        id: "m10-l3",
        title: "Least Squares und Normalgleichungen",
        difficulty: "Profi",
        estimatedMinutes: 70,
        theory: [
          "Für überbestimmte Systeme Ax≈b minimiert man ||Ax-b||^2.",
          "Normalgleichung: A^TAx = A^Tb; numerisch oft besser per QR/SVD lösen.",
          "Interpretation: Projektion von b auf den Spaltenraum von A."
        ],
        example: "Lineare Regression ist ein typischer Least-Squares-Fall.",
        exercise: "Löse ein kleines Ausgleichsproblem und vergleiche Restnormen.",
        hint: "Prüfe, ob A volle Spaltenrang besitzt.",
        quiz: {
          question: "Was minimiert die Least-Squares-Lösung?",
          options: ["det(A)", "||Ax-b||^2", "Rang(A)", "Anzahl Unbekannter"],
          answerIndex: 1,
          explanation: "Gesucht ist der kleinste quadratische Fehler."
        }
      }
    ]
  },
  {
    id: "mod-11",
    title: "Profi-Vertiefung & Prüfungspraxis",
    level: "Profi",
    targetHours: 10,
    goals: [
      "Konzepte verknüpfen statt isoliert lernen",
      "Numerische und theoretische Grenzen verstehen",
      "Klausurstrategie und Fehlermanagement trainieren"
    ],
    lessons: [
      {
        id: "m11-l1",
        title: "Jordan-Idee und defekte Matrizen",
        difficulty: "Profi",
        estimatedMinutes: 65,
        theory: [
          "Nicht jede Matrix ist diagonalisierbar; Jordan-Normalform beschreibt den Restfall.",
          "Verallgemeinerte Eigenvektoren schließen Lücken fehlender Eigenvektoren.",
          "In vielen Bachelor-Kursen reicht das konzeptionelle Verständnis."
        ],
        example: "A=[[1,1],[0,1]] hat nur einen Eigenvektor, ist aber nicht diagonal.",
        exercise: "Erkläre, warum algebraische und geometrische Vielfachheit differieren können.",
        hint: "Vergleiche Polynomvielfachheit mit Eigenraumdimension.",
        quiz: {
          question: "Wann ist eine Matrix defekt?",
          options: [
            "Wenn det(A)=1",
            "Wenn sie weniger unabhängige Eigenvektoren als nötig besitzt",
            "Wenn alle Eigenwerte verschieden sind",
            "Wenn sie symmetrisch ist"
          ],
          answerIndex: 1,
          explanation: "Defekte Matrizen sind genau die nicht diagonalisierbaren Fälle."
        }
      },
      {
        id: "m11-l2",
        title: "Numerische Stabilität und Kondition",
        difficulty: "Profi",
        estimatedMinutes: 60,
        theory: [
          "Konditionszahl misst Empfindlichkeit gegenüber Datenstörungen.",
          "Algorithmische Stabilität betrifft Rundungsfehler im Rechenverfahren.",
          "Gauss mit Pivotisierung ist robuster als naive Elimination."
        ],
        example: "Nahe singuläre Matrizen führen trotz korrekter Formel zu großen Fehlern.",
        exercise: "Bewerte, welches Verfahren für ein schlecht konditioniertes Problem sinnvoller ist.",
        hint: "Nutze QR/SVD bei heiklen numerischen Situationen.",
        quiz: {
          question: "Was beschreibt die Konditionszahl einer Matrix?",
          options: [
            "Die Rechenzeit eines Algorithmus",
            "Die Sensitivität der Lösung gegenüber Störungen",
            "Die Anzahl der Nullzeilen",
            "Die Größe der Determinante allein"
          ],
          answerIndex: 1,
          explanation: "Sie quantifiziert Fehlerverstärkung durch das Problem selbst."
        }
      },
      {
        id: "m11-l3",
        title: "Klausurmodus: Strategien für Bestleistung",
        difficulty: "Profi",
        estimatedMinutes: 55,
        theory: [
          "Beginne mit Aufgaben, deren Struktur du sofort erkennst (z. B. Gauss, Rang, Eigenwerte).",
          "Schreibe Zwischenschritte sauber; Teilerfolge bringen oft viele Punkte.",
          "Am Ende systematisch prüfen: Dimensionen, Plausibilität, Sonderfälle."
        ],
        example: "Ein nicht passender Dimensionscheck entdeckt viele Flüchtigkeitsfehler frühzeitig.",
        exercise: "Simuliere eine 90-Minuten-Klausur mit Zeitbudget pro Aufgabentyp.",
        hint: "Plane 10 % der Zeit für Endkontrolle und Korrektur.",
        quiz: {
          question: "Was ist in einer Klausur oft der schnellste Plausibilitätscheck?",
          options: [
            "Nur Ergebnis abschreiben",
            "Dimensions-/Formprüfung jeder Gleichung",
            "Alle Rechnungen neu rechnen",
            "Nur auf das Vorzeichen achten"
          ],
          answerIndex: 1,
          explanation: "Unpassende Dimensionen entlarven sofort inkonsistente Schritte."
        }
      }
    ]
  }
]);
