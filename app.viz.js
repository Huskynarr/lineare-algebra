(function () {
  "use strict";
  window.LA = window.LA || {};
  LA.viz = LA.viz || {};

  const SIZE = 340;

  function slider(name, label, value, min, max, step) {
    return `
      <label class="vec-slider">
        <span>${label}</span>
        <input type="range" data-vec="${name}" min="${min}" max="${max}" step="${step}" value="${value}">
        <output class="vec-val" data-val="${name}">${value}</output>
      </label>`;
  }

  LA.viz.renderVisualization = function (lesson) {
    const visualization = lesson.visualization;
    if (!visualization) return "";
    const id = LA.escapeHtml(lesson.id);
    let mode = visualization.mode || "static";
    if (mode === "default") mode = "static";
    if (mode === "add") mode = "addition";
    let controls = "";
    let description = "Verändere die Werte und beobachte direkt, was passiert.";
    const config = {
      type: visualization.type,
      vectors: visualization.vectors || (visualization.u ? [visualization.u] : null),
      u: visualization.u || null,
      v: visualization.v || null,
      matrix: visualization.matrix || null
    };

    if (visualization.type === "vector-plot") {
      if (mode === "addition" || mode === "dot") {
        const vectorU = visualization.u || [2, 1];
        const vectorV = visualization.v || [1, 2];
        controls = `
          <div class="vec-input"><span>u = (</span>
            <input type="number" class="vec-num" data-vec="u" data-axis="0" value="${vectorU[0]}" step="0.5" aria-label="u, x-Komponente">
            <input type="number" class="vec-num" data-vec="u" data-axis="1" value="${vectorU[1]}" step="0.5" aria-label="u, y-Komponente">
            <span>)</span></div>
          <div class="vec-input"><span>v = (</span>
            <input type="number" class="vec-num" data-vec="v" data-axis="0" value="${vectorV[0]}" step="0.5" aria-label="v, x-Komponente">
            <input type="number" class="vec-num" data-vec="v" data-axis="1" value="${vectorV[1]}" step="0.5" aria-label="v, y-Komponente">
            <span>)</span></div>`;
      } else if (mode === "linear-combination") {
        controls = `${slider("a", "a · u", 1, -3, 3, 0.5)}${slider("b", "b · v", 1, -3, 3, 0.5)}`;
      }
    } else if (visualization.type === "number-line") {
      mode = "number-line";
      const start = visualization.start ?? -2;
      const delta = visualization.delta ?? 5;
      controls = `${slider("start", "Startzahl", start, -10, 10, 1)}${slider("delta", "Änderung", delta, -10, 10, 1)}<p class="visual-result" data-number-result></p>`;
      description = "Bewege die Regler: nach rechts bedeutet plus, nach links minus.";
    } else if (visualization.type === "matrix-transform") {
      mode = "matrix-transform";
      const matrix = visualization.matrix || [[1, 0], [0, 1]];
      controls = `
        <p class="vec-basis">Matrix A verändern</p>
        <div class="matrix-controls">
          ${slider("m00", "a₁₁", matrix[0][0], -2, 2, 0.25)}
          ${slider("m01", "a₁₂", matrix[0][1], -2, 2, 0.25)}
          ${slider("m10", "a₂₁", matrix[1][0], -2, 2, 0.25)}
          ${slider("m11", "a₂₂", matrix[1][1], -2, 2, 0.25)}
        </div>
        <p class="visual-result" data-matrix-result></p>`;
      description = "Die blauen Gitterlinien zeigen, wie die Matrix die Ebene verformt.";
    } else {
      return "";
    }

    return `
      <section class="lesson-section visualization" aria-label="Interaktive Visualisierung">
        <h3>Ausprobieren &amp; verstehen</h3>
        <p class="visualization__hint">${description}</p>
        <div class="visual-plot" data-mode="${mode}" data-config='${JSON.stringify(config)}'>
          <canvas class="visual-canvas" id="visual-canvas-${id}" aria-label="Interaktives mathematisches Diagramm"></canvas>
          <div class="visual-controls">${controls}</div>
        </div>
      </section>`;
  };

  LA.viz.setupVisualizations = function () {
    document.querySelectorAll(".visual-plot").forEach((plot) => {
      const mode = plot.getAttribute("data-mode");
      const canvas = plot.querySelector(".visual-canvas");
      if (!canvas || canvas.dataset.ready === "1") return;
      canvas.dataset.ready = "1";
      let config = {};
      try {
        config = JSON.parse(plot.getAttribute("data-config") || "{}");
      } catch (_error) {
        return;
      }
      const deviceScale = window.devicePixelRatio || 1;
      canvas.width = SIZE * deviceScale;
      canvas.height = SIZE * deviceScale;
      canvas.style.width = `${SIZE}px`;
      canvas.style.height = `${SIZE}px`;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(deviceScale, deviceScale);

      const readVector = (name) => {
        const x = plot.querySelector(`input[data-vec="${name}"][data-axis="0"]`);
        const y = plot.querySelector(`input[data-vec="${name}"][data-axis="1"]`);
        return x && y ? [Number(x.value) || 0, Number(y.value) || 0] : null;
      };
      const readScalar = (name) => Number(plot.querySelector(`input[data-vec="${name}"]`)?.value || 0);

      const draw = () => {
        const tokens = getComputedStyle(document.documentElement);
        const token = (name) => tokens.getPropertyValue(name).trim();
        const colors = {
          background: token("--surface-2"),
          grid: token("--track"),
          axis: token("--text-soft"),
          first: token("--accent"),
          second: token("--accent-2"),
          result: token("--viz-result"),
          text: token("--text")
        };
        context.clearRect(0, 0, SIZE, SIZE);
        context.fillStyle = colors.background;
        context.fillRect(0, 0, SIZE, SIZE);
        if (mode === "number-line") drawNumberLine(context, colors, readScalar, plot);
        else if (mode === "matrix-transform") drawMatrixTransform(context, colors, readScalar, plot);
        else drawVectors(context, colors, mode, config, readVector, readScalar);
      };

      plot.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", () => {
          const output = plot.querySelector(`.vec-val[data-val="${input.getAttribute("data-vec")}"]`);
          if (output) output.textContent = input.value;
          draw();
        });
      });
      plot._redraw = draw;
      draw();
    });
  };

  function drawAxes(context, colors, scale, originX, originY) {
    context.strokeStyle = colors.grid;
    context.lineWidth = 1;
    for (let index = -5; index <= 5; index++) {
      context.beginPath(); context.moveTo(originX + index * scale, 0); context.lineTo(originX + index * scale, SIZE); context.stroke();
      context.beginPath(); context.moveTo(0, originY + index * scale); context.lineTo(SIZE, originY + index * scale); context.stroke();
    }
    context.strokeStyle = colors.axis;
    context.lineWidth = 1.5;
    context.beginPath(); context.moveTo(0, originY); context.lineTo(SIZE, originY); context.stroke();
    context.beginPath(); context.moveTo(originX, 0); context.lineTo(originX, SIZE); context.stroke();
  }

  function drawArrow(context, startX, startY, endX, endY, color, label, textColor) {
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 2.5;
    context.beginPath(); context.moveTo(startX, startY); context.lineTo(endX, endY); context.stroke();
    const angle = Math.atan2(endY - startY, endX - startX);
    context.beginPath();
    context.moveTo(endX, endY);
    context.lineTo(endX - 9 * Math.cos(angle - 0.4), endY - 9 * Math.sin(angle - 0.4));
    context.lineTo(endX - 9 * Math.cos(angle + 0.4), endY - 9 * Math.sin(angle + 0.4));
    context.closePath(); context.fill();
    if (label) {
      context.fillStyle = textColor;
      context.font = "13px system-ui, sans-serif";
      context.fillText(label, endX + 7, endY - 7);
    }
  }

  function drawVectors(context, colors, mode, config, readVector, readScalar) {
    const scale = 36;
    const originX = SIZE / 2;
    const originY = SIZE / 2;
    const toPixel = (x, y) => [originX + x * scale, originY - y * scale];
    drawAxes(context, colors, scale, originX, originY);
    if (mode === "static") {
      (config.vectors || []).forEach((vector) => {
        const point = toPixel(vector[0], vector[1]);
        drawArrow(context, originX, originY, point[0], point[1], colors.first, `(${vector[0]}, ${vector[1]})`, colors.text);
      });
      return;
    }
    const vectorU = readVector("u") || config.u || [1, 0];
    const vectorV = readVector("v") || config.v || [0, 1];
    if (mode === "linear-combination") {
      const a = readScalar("a");
      const b = readScalar("b");
      const result = [a * vectorU[0] + b * vectorV[0], a * vectorU[1] + b * vectorV[1]];
      const pointU = toPixel(vectorU[0], vectorU[1]);
      const pointV = toPixel(vectorV[0], vectorV[1]);
      const pointResult = toPixel(result[0], result[1]);
      context.globalAlpha = 0.4;
      drawArrow(context, originX, originY, pointU[0], pointU[1], colors.first, "u", colors.text);
      drawArrow(context, originX, originY, pointV[0], pointV[1], colors.second, "v", colors.text);
      context.globalAlpha = 1;
      drawArrow(context, originX, originY, pointResult[0], pointResult[1], colors.result, `${a}u+${b}v`, colors.text);
      return;
    }
    const pointU = toPixel(vectorU[0], vectorU[1]);
    const pointV = toPixel(vectorV[0], vectorV[1]);
    drawArrow(context, originX, originY, pointU[0], pointU[1], colors.first, "u", colors.text);
    drawArrow(context, originX, originY, pointV[0], pointV[1], colors.second, "v", colors.text);
    if (mode === "addition") {
      const sum = [vectorU[0] + vectorV[0], vectorU[1] + vectorV[1]];
      const pointSum = toPixel(sum[0], sum[1]);
      context.setLineDash([5, 4]);
      context.strokeStyle = colors.grid;
      context.beginPath(); context.moveTo(pointU[0], pointU[1]); context.lineTo(pointSum[0], pointSum[1]); context.stroke();
      context.beginPath(); context.moveTo(pointV[0], pointV[1]); context.lineTo(pointSum[0], pointSum[1]); context.stroke();
      context.setLineDash([]);
      drawArrow(context, originX, originY, pointSum[0], pointSum[1], colors.result, "u+v", colors.text);
    } else if (mode === "dot") {
      const normSquared = vectorU[0] ** 2 + vectorU[1] ** 2;
      if (normSquared > 1e-12) {
        const factor = (vectorU[0] * vectorV[0] + vectorU[1] * vectorV[1]) / normSquared;
        const projection = toPixel(factor * vectorU[0], factor * vectorU[1]);
        context.setLineDash([5, 4]);
        context.strokeStyle = colors.result;
        context.beginPath(); context.moveTo(pointV[0], pointV[1]); context.lineTo(projection[0], projection[1]); context.stroke();
        context.setLineDash([]);
        drawArrow(context, originX, originY, projection[0], projection[1], colors.result, "Projektion", colors.text);
      }
    }
  }

  function drawNumberLine(context, colors, readScalar, plot) {
    const y = SIZE / 2;
    const scale = 10;
    const originX = SIZE / 2;
    const start = readScalar("start");
    const delta = readScalar("delta");
    const result = start + delta;
    context.strokeStyle = colors.axis;
    context.lineWidth = 2;
    context.beginPath(); context.moveTo(15, y); context.lineTo(SIZE - 15, y); context.stroke();
    context.font = "12px system-ui, sans-serif";
    context.textAlign = "center";
    for (let value = -15; value <= 15; value++) {
      const x = originX + value * scale;
      context.beginPath(); context.moveTo(x, y - 5); context.lineTo(x, y + 5); context.stroke();
      if (value % 3 === 0) {
        context.fillStyle = colors.text;
        context.fillText(String(value), x, y + 22);
      }
    }
    drawArrow(context, originX, y - 36, originX + start * scale, y - 36, colors.first, `Start ${start}`, colors.text);
    drawArrow(context, originX + start * scale, y + 42, originX + result * scale, y + 42, colors.result, `${delta >= 0 ? "+" : ""}${delta}`, colors.text);
    const resultNode = plot.querySelector("[data-number-result]");
    if (resultNode) resultNode.textContent = `${start} ${delta >= 0 ? "+" : "−"} ${Math.abs(delta)} = ${result}`;
  }

  function drawMatrixTransform(context, colors, readScalar, plot) {
    const matrix = [[readScalar("m00"), readScalar("m01")], [readScalar("m10"), readScalar("m11")]];
    const scale = 34;
    const origin = SIZE / 2;
    const point = (x, y) => [origin + x * scale, origin - y * scale];
    const transform = (x, y) => [matrix[0][0] * x + matrix[0][1] * y, matrix[1][0] * x + matrix[1][1] * y];
    drawAxes(context, colors, scale, origin, origin);
    context.strokeStyle = colors.first;
    context.globalAlpha = 0.58;
    context.lineWidth = 1.4;
    for (let value = -4; value <= 4; value++) {
      [[transform(value, -4), transform(value, 4)], [transform(-4, value), transform(4, value)]].forEach(([start, end]) => {
        const from = point(start[0], start[1]);
        const to = point(end[0], end[1]);
        context.beginPath(); context.moveTo(from[0], from[1]); context.lineTo(to[0], to[1]); context.stroke();
      });
    }
    context.globalAlpha = 1;
    const basisX = point(matrix[0][0], matrix[1][0]);
    const basisY = point(matrix[0][1], matrix[1][1]);
    drawArrow(context, origin, origin, basisX[0], basisX[1], colors.result, "A·e₁", colors.text);
    drawArrow(context, origin, origin, basisY[0], basisY[1], colors.second, "A·e₂", colors.text);
    const determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    const resultNode = plot.querySelector("[data-matrix-result]");
    if (resultNode) resultNode.textContent = `det(A) = ${LA.math.formatNum(determinant)} · Flächenfaktor ${LA.math.formatNum(Math.abs(determinant))}`;
  }

  LA.viz.redrawVisualizations = function () {
    document.querySelectorAll(".visual-plot").forEach((plot) => {
      if (typeof plot._redraw === "function") plot._redraw();
    });
  };
})();
