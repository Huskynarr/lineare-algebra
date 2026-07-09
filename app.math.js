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

// Nullstellen eines Polynoms (Grad 1–3 exakt, Grad 4 numerisch per Bisektion/Newton über reeller Suche).
LA.math.polyRoots = function (coeffs) {
  const deg = coeffs.length - 1;
  const roots = [];
  const tol = 1e-7;
  if (deg === 1) {
    roots.push(-coeffs[0] / coeffs[1]);
    return roots;
  }
  if (deg === 2) {
    const a = coeffs[2], b = coeffs[1], c = coeffs[0];
    const disc = b * b - 4 * a * c;
    if (disc < -tol) return roots; // komplexe Eigenwerte
    const sq = Math.sqrt(Math.max(0, disc));
    const r1 = (-b + sq) / (2 * a);
    const r2 = (-b - sq) / (2 * a);
    roots.push(r1);
    // Bei Doppelwurzel (disc ≈ 0) beide zählen, sonst die zweite nur wenn verschieden.
    if (sq > tol) roots.push(r2);
    else roots.push(r1);
    return roots;
  }
  if (deg === 3) {
    // Kubik: trigonometrische Formel (drei reelle Wurzeln) für D ≥ 0, sonst Cardano-Einzelwurzel + Deflation.
    const a = coeffs[3];
    const p = coeffs[2] / a, q = coeffs[1] / a, r = coeffs[0] / a;
    const p3 = p / 3;
    const Q = (p * p - 3 * q) / 9;
    const R = (2 * p * p * p - 9 * p * q + 27 * r) / 54;
    const D = Q * Q * Q - R * R;
    if (D >= -tol) {
      // Drei reelle Wurzeln (auch bei Mehrfachwurzeln numerisch stabil).
      const Qc = Math.max(Q, 0);
      const Rc = Math.max(-1, Math.min(1, R / Math.sqrt(Qc * Qc * Qc || 1)));
      const th = Math.acos(Rc);
      const sqrtQ = Math.sqrt(Qc);
      for (let k = 0; k < 3; k++) {
        roots.push(-2 * sqrtQ * Math.cos((th + 2 * Math.PI * k) / 3) - p3);
      }
      return roots;
    }
    // Einer reelle Wurzel via Cardano, dann Deflation + quadratisch.
    const s = Math.cbrt(R + Math.sqrt(-D));
    const t = Math.cbrt(R - Math.sqrt(-D));
    const x1 = s + t - p3;
    roots.push(x1);
    const b2 = a;
    const b1 = coeffs[2] + b2 * x1;
    const b0 = coeffs[1] + b1 * x1;
    const quad = [b0, b1, b2];
    LA.math.polyRoots(quad).forEach((rt) => roots.push(rt));
    return roots;
  }
  // Grad 4: numerische reelle Nullstellen-Suche über Intervall-Scan + Newton.
  const bound = 1 + Math.max(...coeffs.slice(0, deg).map((c) => Math.abs(c) / Math.abs(coeffs[deg])));
  const step = bound / 1000;
  let prev = LA.math.polyEval(coeffs, -bound);
  for (let x = -bound + step; x <= bound; x += step) {
    const cur = LA.math.polyEval(coeffs, x);
    if (prev === 0) { roots.push(x - step); }
    else if (prev * cur < 0) {
      let lo = x - step, hi = x;
      for (let it = 0; it < 60; it++) {
        const mid = (lo + hi) / 2;
        const fm = LA.math.polyEval(coeffs, mid);
        if (Math.abs(fm) < tol) { lo = hi = mid; break; }
        if (LA.math.polyEval(coeffs, lo) * fm < 0) hi = mid; else lo = mid;
      }
      roots.push((lo + hi) / 2);
    }
    prev = cur;
  }
  return roots;
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
