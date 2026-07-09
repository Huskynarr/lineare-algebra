// app.viz.js
window.LA = window.LA || {};
LA.viz = LA.viz || {};

LA.viz.renderVisualization = function (lesson) {
  const v = lesson.visualization;
  if (!v || v.type !== "vector-plot") return "";
  const mode = v.mode || "static";
  const id = lesson.id;
  let controls = "";
  const config = { vectors: v.vectors || null, u: v.u || null, v: v.v || null };
  if (mode === "addition") {
    const u = v.u || [2, 1], vv = v.v || [1, 2];
    controls = `
        <div class="vec-input"><span>u = (</span>
          <input type="number" class="vec-num" data-vec="u" data-axis="0" value="${u[0]}" step="0.5" aria-label="u x-Komponente">
          <input type="number" class="vec-num" data-vec="u" data-axis="1" value="${u[1]}" step="0.5" aria-label="u y-Komponente">
          <span>)</span></div>
        <div class="vec-input"><span>v = (</span>
          <input type="number" class="vec-num" data-vec="v" data-axis="0" value="${vv[0]}" step="0.5" aria-label="v x-Komponente">
          <input type="number" class="vec-num" data-vec="v" data-axis="1" value="${vv[1]}" step="0.5" aria-label="v y-Komponente">
          <span>)</span></div>`;
  } else if (mode === "linear-combination") {
    const u = v.u || [1, 0], vv = v.v || [0, 1];
    controls = `
        <div class="vec-slider"><label for="lc-a-${id}">a · u</label>
          <input type="range" id="lc-a-${id}" data-vec="a" min="-3" max="3" step="0.5" value="1">
          <span class="vec-val" data-val="a">1</span></div>
        <div class="vec-slider"><label for="lc-b-${id}">b · v</label>
          <input type="range" id="lc-b-${id}" data-vec="b" min="-3" max="3" step="0.5" value="1">
          <span class="vec-val" data-val="b">1</span></div>
        <p class="vec-basis">Basis: u = (${u[0]}, ${u[1]}), v = (${vv[0]}, ${vv[1]})</p>`;
  } else if (mode === "dot") {
    const u = v.u || [2, 1], vv = v.v || [1, 2];
    controls = `
        <div class="vec-input"><span>u = (</span>
          <input type="number" class="vec-num" data-vec="u" data-axis="0" value="${u[0]}" step="0.5" aria-label="u x-Komponente">
          <input type="number" class="vec-num" data-vec="u" data-axis="1" value="${u[1]}" step="0.5" aria-label="u y-Komponente">
          <span>)</span></div>
        <div class="vec-input"><span>v = (</span>
          <input type="number" class="vec-num" data-vec="v" data-axis="0" value="${vv[0]}" step="0.5" aria-label="v x-Komponente">
          <input type="number" class="vec-num" data-vec="v" data-axis="1" value="${vv[1]}" step="0.5" aria-label="v y-Komponente">
          <span>)</span></div>`;
  }
  return `
      <section class="lesson-section visualization" aria-label="Interaktive Visualisierung">
        <h3>Visualisierung</h3>
        <div class="vector-plot" data-mode="${mode}" data-lesson="${id}" data-config='${JSON.stringify(config)}'>
          <canvas class="vector-canvas" id="vec-canvas-${id}" aria-label="Vektor-Diagramm"></canvas>
          <div class="vector-controls">${controls}</div>
        </div>
      </section>`;
};

LA.viz.setupVisualizations = function () {
  document.querySelectorAll(".vector-plot").forEach((plot) => {
    const mode = plot.getAttribute("data-mode");
    const canvas = plot.querySelector(".vector-canvas");
    if (!canvas || canvas.dataset.ready === "1") return;
    canvas.dataset.ready = "1";
    const config = JSON.parse(plot.getAttribute("data-config") || "{}");
    const dpr = window.devicePixelRatio || 1;
    const SIZE = 320;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const readVec = (name) => {
      const x = plot.querySelector(`input[data-vec="${name}"][data-axis="0"]`);
      const y = plot.querySelector(`input[data-vec="${name}"][data-axis="1"]`);
      if (!x || !y) return null;
      return [Number(x.value) || 0, Number(y.value) || 0];
    };
    const readScalar = (name) => {
      const el = plot.querySelector(`input[data-vec="${name}"]`);
      return el ? Number(el.value) : 0;
    };

    const draw = () => {
      const light = document.documentElement.getAttribute("data-theme") === "light";
      const C = {
        bg: light ? "#ffffff" : "#0d1528",
        grid: light ? "#e2e8f0" : "#243152",
        axis: light ? "#475569" : "#94a3b8",
        u: light ? "#0284c7" : "#38bdf8",
        v: light ? "#16a34a" : "#22c55e",
        sum: light ? "#e11d48" : "#fb7185",
        proj: light ? "#a16207" : "#fbbf24",
        text: light ? "#0f172a" : "#e5e7eb"
      };
      const W = SIZE, H = SIZE, scale = 36, ox = W / 2, oy = H / 2;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = C.grid;
      ctx.lineWidth = 1;
      for (let i = -5; i <= 5; i++) {
        ctx.beginPath(); ctx.moveTo(ox + i * scale, 0); ctx.lineTo(ox + i * scale, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, oy + i * scale); ctx.lineTo(W, oy + i * scale); ctx.stroke();
      }
      ctx.strokeStyle = C.axis; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
      const toPx = (vx, vy) => [ox + vx * scale, oy - vy * scale];
      const arrow = (x1, y1, x2, y2, color, label) => {
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        const ang = Math.atan2(y2 - y1, x2 - x1), ah = 8;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - ah * Math.cos(ang - 0.4), y2 - ah * Math.sin(ang - 0.4));
        ctx.lineTo(x2 - ah * Math.cos(ang + 0.4), y2 - ah * Math.sin(ang + 0.4));
        ctx.closePath(); ctx.fill();
        if (label) {
          ctx.fillStyle = C.text;
          ctx.font = "12px Inter, sans-serif";
          const tx = x2 + 6 * Math.cos(ang), ty = y2 + 6 * Math.sin(ang) - 4;
          ctx.fillText(label, tx, ty);
        }
      };
      if (mode === "static") {
        (config.vectors || []).forEach((vec) => {
          const [px, py] = toPx(vec[0], vec[1]);
          arrow(ox, oy, px, py, C.u, `(${vec[0]}, ${vec[1]})`);
        });
      } else if (mode === "addition") {
        const u = readVec("u") || [0, 0], vv = readVec("v") || [0, 0];
        const s = [u[0] + vv[0], u[1] + vv[1]];
        const [ux, uy] = toPx(u[0], u[1]);
        const [vx, vy] = toPx(vv[0], vv[1]);
        const [sx, sy] = toPx(s[0], s[1]);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(ux, uy); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.setLineDash([]);
        arrow(ox, oy, ux, uy, C.u, "u");
        arrow(ox, oy, vx, vy, C.v, "v");
        arrow(ox, oy, sx, sy, C.sum, `u+v=(${s[0]},${s[1]})`);
      } else if (mode === "linear-combination") {
        const a = readScalar("a"), b = readScalar("b");
        const u = config.u || [1, 0], vv = config.v || [0, 1];
        const result = [a * u[0] + b * vv[0], a * u[1] + b * vv[1]];
        const [ux, uy] = toPx(u[0], u[1]);
        const [vx, vy] = toPx(vv[0], vv[1]);
        ctx.globalAlpha = 0.35;
        arrow(ox, oy, ux, uy, C.u, "u");
        arrow(ox, oy, vx, vy, C.v, "v");
        ctx.globalAlpha = 1;
        const [rx, ry] = toPx(result[0], result[1]);
        arrow(ox, oy, rx, ry, C.sum, `${a}u+${b}v`);
      } else if (mode === "dot") {
        const u = readVec("u") || [0, 0], vv = readVec("v") || [0, 0];
        const lu = Math.hypot(u[0], u[1]) || 1;
        const dot = u[0] * vv[0] + u[1] * vv[1];
        const proj = [dot / lu * u[0] / lu, dot / lu * u[1] / lu];
        const [px, py] = toPx(proj[0], proj[1]);
        const [vx, vy] = toPx(vv[0], vv[1]);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = C.proj; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(px, py); ctx.stroke();
        ctx.setLineDash([]);
        arrow(ox, oy, px, py, C.proj, "Projektion");
        arrow(ox, oy, vx, vy, C.v, "v");
        arrow(ox, oy, toPx(u[0], u[1])[0], toPx(u[0], u[1])[1], C.u, "u");
      }
    };

    plot.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        const valSpan = plot.querySelector(`.vec-val[data-val="${input.getAttribute("data-vec")}"]`);
        if (valSpan) valSpan.textContent = input.value;
        draw();
      });
    });
    draw();
    plot._redraw = draw;
  });
};

LA.viz.redrawVisualizations = function () {
  document.querySelectorAll(".vector-plot").forEach((plot) => {
    if (typeof plot._redraw === "function") plot._redraw();
  });
};
