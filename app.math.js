// app.math.js
// Pure math helpers extracted from app.js (no DOM, no state).
// Loaded before app.js (see index.html script order). Functions are attached
// to LA.math and referenced from app.js as LA.math.<name>.
window.LA = window.LA || {};
LA.math = LA.math || {};

LA.math.parseMatrix = function (input) {
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
};

LA.math.formatMatrix = function (m) {
  return "[" + m.map((row) => row.join(", ")).join("; ") + "]";
};

// ---- Lineare Algebra 2: Eigenwerte, Jordan-Normalform, Bilinearformen ----

// Determinante einer n×n-Matrix (Laplace-Entwicklung).
LA.math.detNxN = function (m) {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let sum = 0;
  for (let j = 0; j < n; j++) {
    const minor = m.slice(1).map((row) => row.filter((_, c) => c !== j));
    sum += (j % 2 === 0 ? 1 : -1) * m[0][j] * LA.math.detNxN(minor);
  }
  return sum;
};

// Spur einer quadratischen Matrix.
LA.math.traceM = function (m) {
  let t = 0;
  for (let i = 0; i < m.length; i++) t += m[i][i];
  return t;
};

// Summe aller 2×2-Hauptminoren (für n=3 char. Polynom: e2).
LA.math.sumPrincipal2Minors = function (m) {
  const n = m.length;
  let s = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      s += m[i][i] * m[j][j] - m[i][j] * m[j][i];
    }
  }
  return s;
};

// Summe aller 3×3-Hauptminoren (für n=4 char. Polynom: e3).
LA.math.sumPrincipal3Minors = function (m) {
  const n = m.length;
  let s = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const sub = [
          [m[i][i], m[i][j], m[i][k]],
          [m[j][i], m[j][j], m[j][k]],
          [m[k][i], m[k][j], m[k][k]]
        ];
        s += LA.math.detNxN(sub);
      }
    }
  }
  return s;
};

// Koeffizienten des charakteristischen Polynoms chi_A(lambda) = lambda^n - e1 lambda^{n-1} + e2 ... + (-1)^n det
// Rückgabe als Array [c0, c1, ..., cn] mit chi = sum c_k lambda^k (c_n = 1).
LA.math.charPolynomialCoeffs = function (m) {
  const n = m.length;
  const e1 = LA.math.traceM(m);
  const det = LA.math.detNxN(m);
  const coeffs = new Array(n + 1).fill(0);
  coeffs[n] = 1;
  if (n === 1) {
    coeffs[0] = -det;
    return coeffs;
  }
  if (n === 2) {
    const e2 = det;
    coeffs[1] = -e1;
    coeffs[0] = e2;
    return coeffs;
  }
  if (n === 3) {
    const e2 = LA.math.sumPrincipal2Minors(m);
    coeffs[2] = -e1;
    coeffs[1] = e2;
    coeffs[0] = -det;
    return coeffs;
  }
  if (n === 4) {
    const e2 = LA.math.sumPrincipal2Minors(m);
    const e3 = LA.math.sumPrincipal3Minors(m);
    const e4 = det;
    coeffs[3] = -e1;
    coeffs[2] = e2;
    coeffs[1] = -e3;
    coeffs[0] = e4;
    return coeffs;
  }
  throw new Error("Charakteristisches Polynom nur bis 4×4 unterstützt.");
};

LA.math.polyEval = function (coeffs, x) {
  let v = 0;
  for (let k = coeffs.length - 1; k >= 0; k--) v = v * x + coeffs[k];
  return v;
};

// Reelle Nullstellen eines Polynoms bis Grad 4, mit algebraischer Vielfachheit.
// Durand-Kerner berechnet zunächst alle komplexen Nullstellen gleichzeitig;
// anschließend werden numerisch reelle Ergebnisse gefiltert und stabilisiert.
LA.math.polyRoots = function (coeffs) {
  const values = coeffs.slice();
  while (values.length > 1 && Math.abs(values[values.length - 1]) < 1e-14) values.pop();
  const degree = values.length - 1;
  if (degree < 1 || degree > 4) return [];
  if (degree === 1) return [-values[0] / values[1]];
  if (degree === 2) {
    const [constant, linear, quadratic] = values;
    const discriminant = linear * linear - 4 * quadratic * constant;
    if (discriminant < -1e-12) return [];
    const root = Math.sqrt(Math.max(0, discriminant));
    return [(-linear - root) / (2 * quadratic), (-linear + root) / (2 * quadratic)];
  }

  const leading = values[degree];
  const monic = values.map((value) => value / leading);
  const bound = 1 + Math.max(...monic.slice(0, degree).map(Math.abs));
  const multiply = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
  const divide = (a, b) => {
    const denominator = b.re * b.re + b.im * b.im;
    return {
      re: (a.re * b.re + a.im * b.im) / denominator,
      im: (a.im * b.re - a.re * b.im) / denominator
    };
  };
  const evaluate = (root) => {
    let result = { re: monic[degree], im: 0 };
    for (let power = degree - 1; power >= 0; power--) {
      result = multiply(result, root);
      result.re += monic[power];
    }
    return result;
  };

  let roots = Array.from({ length: degree }, (_, index) => {
    const angle = (2 * Math.PI * index) / degree + 0.37;
    const radius = bound * (1 + index * 0.01);
    return { re: radius * Math.cos(angle), im: radius * Math.sin(angle) };
  });

  for (let iteration = 0; iteration < 10000; iteration++) {
    let maxChange = 0;
    const next = roots.map((root, index) => {
      let denominator = { re: 1, im: 0 };
      roots.forEach((other, otherIndex) => {
        if (index !== otherIndex) {
          denominator = multiply(denominator, { re: root.re - other.re, im: root.im - other.im });
        }
      });
      const correction = divide(evaluate(root), denominator);
      maxChange = Math.max(maxChange, Math.hypot(correction.re, correction.im));
      return { re: root.re - correction.re, im: root.im - correction.im };
    });
    roots = next;
    if (maxChange < 1e-12) break;
  }

  const realRoots = roots
    .filter((root) =>
      Math.abs(root.im) <= 1e-5 * Math.max(1, Math.abs(root.re)) ||
      (Math.abs(root.im) < 1e-2 && Math.abs(LA.math.polyEval(values, root.re)) < 1e-8)
    )
    .map((root) => root.re)
    .sort((a, b) => a - b);
  for (let index = 0; index < realRoots.length;) {
    let end = index + 1;
    while (end < realRoots.length && Math.abs(realRoots[end] - realRoots[index]) < 1e-4) end++;
    const average = realRoots.slice(index, end).reduce((sum, value) => sum + value, 0) / (end - index);
    for (let current = index; current < end; current++) realRoots[current] = average;
    index = end;
  }

  const derivativeOf = (polynomial) => polynomial.slice(1).map((coefficient, index) => coefficient * (index + 1));
  const derivative = derivativeOf(values);
  const scale = Math.max(1, values.reduce((sum, value) => sum + Math.abs(value), 0));
  const criticalRoots = LA.math.polyRoots(derivative).filter((value, index, list) => index === 0 || Math.abs(value - list[index - 1]) > 1e-5);
  criticalRoots.forEach((candidate) => {
    if (Math.abs(LA.math.polyEval(values, candidate)) > 1e-8 * scale) return;
    let multiplicity = 1;
    let currentDerivative = derivative;
    while (currentDerivative.length > 1 && Math.abs(LA.math.polyEval(currentDerivative, candidate)) <= 1e-7 * scale) {
      multiplicity++;
      currentDerivative = derivativeOf(currentDerivative);
    }
    for (let index = realRoots.length - 1; index >= 0; index--) {
      if (Math.abs(realRoots[index] - candidate) < 1e-2) realRoots.splice(index, 1);
    }
    for (let count = 0; count < multiplicity; count++) realRoots.push(candidate);
  });
  realRoots.sort((a, b) => a - b);
  return realRoots;
};

LA.math.formatNum = function (n) {
  const r = Math.round(n * 1000) / 1000;
  return Number.isInteger(r) ? String(r) : String(r);
};

// Rang einer Matrix über Gauß.
LA.math.rankM = function (m) {
  const A = m.map((row) => row.slice());
  const rows = A.length, cols = A[0].length;
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let piv = -1;
    for (let i = r; i < rows; i++) if (Math.abs(A[i][c]) > 1e-9) { piv = i; break; }
    if (piv < 0) continue;
    [A[r], A[piv]] = [A[piv], A[r]];
    for (let i = 0; i < rows; i++) {
      if (i === r) continue;
      const f = A[i][c] / A[r][c];
      for (let j = c; j < cols; j++) A[i][j] -= f * A[r][j];
    }
    r++;
  }
  return r;
};

// (A - lambda I) für ganzzahlige Matrix und reelles lambda.
LA.math.subtractLambdaI = function (A, lambda) {
  return A.map((row, i) => row.map((v, j) => v - (i === j ? lambda : 0)));
};

// Partition von `alg` in `geom` Kästchen mit Maximalkästchen `maxBlock`.
LA.math.partitionBlocks = function (alg, geom, maxBlock) {
  const blocks = [];
  let remaining = alg;
  let count = geom;
  // Greedy: größte Kästchen zuerst, beschränkt durch maxBlock und Restbedarf.
  let size = maxBlock;
  while (remaining > 0 && count > 0) {
    const take = Math.min(size, remaining - (count - 1)); // mindestens 1 für restliche Kästchen
    const s = Math.max(1, take);
    blocks.push(s);
    remaining -= s;
    count--;
    size = Math.min(size, s);
  }
  return blocks.sort((a, b) => b - a);
};

LA.math.matMul = function (A, B) {
  const n = A.length, m = B[0].length, p = B.length;
  const R = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++)
      for (let k = 0; k < p; k++) R[i][j] += A[i][k] * B[k][j];
  return R;
};

LA.math.parseVector = function (input) {
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
};

LA.math.parse2x2Matrix = function (input) {
  const rows = input.split(";").map((row) => row.trim());
  if (rows.length !== 2) {
    throw new Error("Bitte genau zwei Zeilen mit ';' trennen.");
  }
  const matrix = rows.map((row) => row.split(",").map((value) => Number(value.trim())));
  if (matrix.some((row) => row.length !== 2 || row.some((value) => !Number.isFinite(value)))) {
    throw new Error("Format ungültig. Bitte a,b;c,d verwenden.");
  }
  return matrix;
};

LA.math.gcd = function (a, b) {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

LA.math.fmtComplex = function (a, b) {
  if (a === 0 && b === 0) return "0";
  const imPart = (val) => (val === 1 ? "i" : val === -1 ? "-i" : val + "i");
  if (a === 0) return imPart(b);
  if (b === 0) return String(a);
  return b > 0 ? `${a} + ${imPart(b)}` : `${a} - ${imPart(-b)}`;
};
