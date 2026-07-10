(function () {
  "use strict";
  window.LA = window.LA || {};
  LA.tools = LA.tools || {};

  const EPSILON = 1e-10;
  let elements = null;

  function formatPolynomial(coeffs) {
    const terms = [];
    for (let power = coeffs.length - 1; power >= 0; power--) {
      const coefficient = Math.abs(coeffs[power]) < EPSILON ? 0 : coeffs[power];
      if (coefficient === 0) continue;
      const magnitude = Math.abs(coefficient);
      const coefficientText = power > 0 && Math.abs(magnitude - 1) < EPSILON ? "" : LA.math.formatNum(magnitude);
      const variable = power === 0 ? "" : power === 1 ? "λ" : `λ^${power}`;
      const sign = coefficient < 0 ? "−" : terms.length ? "+" : "";
      terms.push(`${sign}${coefficientText}${variable}`);
    }
    return terms.join(" ") || "0";
  }

  LA.tools.calculateDotProduct = function () {
    try {
      const vectorA = LA.math.parseVector(elements.vectorA.value);
      const vectorB = LA.math.parseVector(elements.vectorB.value);
      if (vectorA.length !== vectorB.length) throw new Error("Die Vektoren müssen gleich viele Komponenten haben.");
      const dot = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
      const normA = Math.hypot(...vectorA);
      const normB = Math.hypot(...vectorB);
      if (normA < EPSILON || normB < EPSILON) {
        elements.dotOutput.textContent = `a·b = ${dot}. Ein Winkel mit dem Nullvektor ist nicht definiert.`;
        return;
      }
      const cosine = Math.max(-1, Math.min(1, dot / (normA * normB)));
      const angle = Math.acos(cosine) * (180 / Math.PI);
      elements.dotOutput.textContent = `a·b = ${dot}, Winkel ≈ ${angle.toFixed(2)}°`;
    } catch (error) {
      elements.dotOutput.textContent = error.message;
    }
  };

  LA.tools.calculateDeterminant2x2 = function () {
    try {
      const matrix = LA.math.parse2x2Matrix(elements.matrix2x2.value);
      elements.detOutput.textContent = `det(A) = ${matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]}`;
    } catch (error) {
      elements.detOutput.textContent = error.message;
    }
  };

  LA.tools.calculateMatrixMultiply = function () {
    try {
      const matrixA = LA.math.parseMatrix(elements.matrixA.value);
      const matrixB = LA.math.parseMatrix(elements.matrixB2.value);
      if (matrixA[0].length !== matrixB.length) {
        throw new Error(`Spalten von A (${matrixA[0].length}) müssen Zeilen von B (${matrixB.length}) entsprechen.`);
      }
      elements.mulOutput.textContent = `A · B = ${LA.math.formatMatrix(LA.math.matMul(matrixA, matrixB))}`;
    } catch (error) {
      elements.mulOutput.textContent = error.message;
    }
  };

  LA.tools.calculateInverse2x2 = function () {
    try {
      const matrix = LA.math.parse2x2Matrix(elements.matrixInv.value);
      const determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      if (Math.abs(determinant) < EPSILON) throw new Error("Matrix ist nicht invertierbar (det ≈ 0).");
      const inverse = [
        [matrix[1][1] / determinant, -matrix[0][1] / determinant],
        [-matrix[1][0] / determinant, matrix[0][0] / determinant]
      ];
      elements.invOutput.textContent = `A⁻¹ = ${LA.math.formatMatrix(inverse.map((row) => row.map((value) => Number(value.toFixed(3)))))}`;
    } catch (error) {
      elements.invOutput.textContent = error.message;
    }
  };

  LA.tools.calculateGauss = function () {
    try {
      const parts = elements.gaussInput.value.split("|");
      if (parts.length !== 2) throw new Error("Format: a,b;c,d|e,f (Matrix|Vektor)");
      const matrix = LA.math.parseMatrix(parts[0]);
      const resultVector = parts[1].split(",").map((value) => Number(value.trim()));
      const size = matrix.length;
      if (matrix.some((row) => row.length !== size)) throw new Error("Die Koeffizientenmatrix muss quadratisch sein.");
      if (resultVector.length !== size || resultVector.some((value) => !Number.isFinite(value))) {
        throw new Error("Der Ergebnisvektor muss genau eine Zahl pro Matrixzeile enthalten.");
      }
      const augmented = matrix.map((row, index) => [...row, resultVector[index]]);
      for (let column = 0; column < size; column++) {
        let pivotRow = column;
        for (let row = column + 1; row < size; row++) {
          if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivotRow][column])) pivotRow = row;
        }
        [augmented[column], augmented[pivotRow]] = [augmented[pivotRow], augmented[column]];
        const pivot = augmented[column][column];
        if (Math.abs(pivot) < EPSILON) throw new Error("System ist nicht eindeutig lösbar (kein eindeutiger Pivot).");
        for (let row = column + 1; row < size; row++) {
          const factor = augmented[row][column] / pivot;
          for (let current = column; current <= size; current++) augmented[row][current] -= factor * augmented[column][current];
        }
      }
      const solution = new Array(size);
      for (let row = size - 1; row >= 0; row--) {
        solution[row] = augmented[row][size];
        for (let column = row + 1; column < size; column++) solution[row] -= augmented[row][column] * solution[column];
        solution[row] /= augmented[row][row];
      }
      elements.gaussOutput.textContent = `x = (${solution.map((value) => LA.math.formatNum(value)).join(", ")})`;
    } catch (error) {
      elements.gaussOutput.textContent = error.message;
    }
  };

  LA.tools.calculateEigenvalues = function () {
    try {
      const matrix = LA.math.parseMatrix(elements.eigInput.value);
      const size = matrix.length;
      if (size < 1 || size > 4 || matrix.some((row) => row.length !== size)) throw new Error("Bitte quadratische Matrix bis 4×4 eingeben.");
      const coeffs = LA.math.charPolynomialCoeffs(matrix);
      const roots = LA.math.polyRoots(coeffs).map(LA.math.formatNum);
      const complexCount = size - roots.length;
      let output = `χ_A(λ) = ${formatPolynomial(coeffs)}\n`;
      output += `Spur = ${LA.math.formatNum(LA.math.traceM(matrix))}, det = ${LA.math.formatNum(LA.math.detNxN(matrix))}\n`;
      output += roots.length ? `Reelle Eigenwerte: ${roots.join(", ")}` : "Keine reellen Eigenwerte.";
      if (complexCount > 0) output += ` (${complexCount} komplexe Nullstelle${complexCount === 1 ? "" : "n"} nicht numerisch ausgegeben.)`;
      elements.eigOutput.textContent = output;
    } catch (error) {
      elements.eigOutput.textContent = error.message;
    }
  };

  LA.tools.calculateJordanForm = function () {
    try {
      const matrix = LA.math.parseMatrix(elements.jordanInput.value);
      const size = matrix.length;
      if (size < 1 || size > 4 || matrix.some((row) => row.length !== size)) throw new Error("Bitte quadratische Matrix bis 4×4 eingeben.");
      const roots = LA.math.polyRoots(LA.math.charPolynomialCoeffs(matrix)).sort((a, b) => a - b);
      if (roots.length !== size) throw new Error("Die reelle Jordan-Struktur ist nicht vollständig bestimmbar, weil komplexe Eigenwerte auftreten.");
      const eigenvalues = [];
      roots.forEach((root) => {
        const previous = eigenvalues[eigenvalues.length - 1];
        if (previous && Math.abs(previous.value - root) < 1e-5) previous.multiplicity++;
        else eigenvalues.push({ value: root, multiplicity: 1 });
      });
      const descriptions = [];
      const minimalFactors = [];
      eigenvalues.forEach((entry) => {
        const shifted = LA.math.subtractLambdaI(matrix, entry.value);
        const geometric = size - LA.math.rankM(shifted);
        let maxBlock = 1;
        let power = shifted;
        while (LA.math.rankM(power) > size - entry.multiplicity && maxBlock <= size) {
          power = LA.math.matMul(power, shifted);
          maxBlock++;
        }
        const blocks = LA.math.partitionBlocks(entry.multiplicity, geometric, maxBlock);
        descriptions.push(`λ=${LA.math.formatNum(entry.value)}: algebraisch ${entry.multiplicity}, geometrisch ${geometric}, Blöcke ${blocks.join("+")}`);
        minimalFactors.push(`(λ−${LA.math.formatNum(entry.value)})^${maxBlock}`);
      });
      elements.jordanOutput.textContent = `${descriptions.join("\n")}\nMinimalpolynom: ${minimalFactors.join("·")}`;
    } catch (error) {
      elements.jordanOutput.textContent = error.message;
    }
  };

  LA.tools.calculateBilinearForm = function () {
    try {
      const matrix = LA.math.parseMatrix(elements.bilfInput.value);
      const size = matrix.length;
      if (size < 1 || size > 4 || matrix.some((row) => row.length !== size)) throw new Error("Bitte quadratische Matrix bis 4×4 eingeben.");
      const symmetric = matrix.every((row, i) => row.every((value, j) => Math.abs(value - matrix[j][i]) < EPSILON));
      if (!symmetric) throw new Error("Die Signatur ist nur für symmetrische reelle Matrizen definiert.");
      const roots = LA.math.polyRoots(LA.math.charPolynomialCoeffs(matrix));
      if (roots.length !== size) throw new Error("Die Eigenwerte konnten numerisch nicht zuverlässig bestimmt werden.");
      const positive = roots.filter((root) => root > 1e-6).length;
      const negative = roots.filter((root) => root < -1e-6).length;
      const zero = size - positive - negative;
      const classification = positive === size ? "positiv definit"
        : negative === size ? "negativ definit"
          : zero > 0 && negative === 0 ? "positiv semidefinit"
            : zero > 0 && positive === 0 ? "negativ semidefinit"
              : "indefinit";
      elements.bilfOutput.textContent = `Rang = ${LA.math.rankM(matrix)}\nSignatur (p, q, r) = (${positive}, ${negative}, ${zero})\nKlassifikation: ${classification}`;
    } catch (error) {
      elements.bilfOutput.textContent = error.message;
    }
  };

  LA.tools.bind = function (domElements) {
    elements = domElements;
    const bindings = [
      [elements.calcDot, LA.tools.calculateDotProduct],
      [elements.calcDet, LA.tools.calculateDeterminant2x2],
      [elements.calcMul, LA.tools.calculateMatrixMultiply],
      [elements.calcInv, LA.tools.calculateInverse2x2],
      [elements.calcGauss, LA.tools.calculateGauss],
      [elements.calcEig, LA.tools.calculateEigenvalues],
      [elements.calcJordan, LA.tools.calculateJordanForm],
      [elements.calcBilf, LA.tools.calculateBilinearForm]
    ];
    bindings.forEach(([button, handler]) => button?.addEventListener("click", handler));
  };
})();
