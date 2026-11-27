// Capacity Lab UI. All maths lives in lab-model.js (unit-tested).
import { PRESETS, DEFAULT_CAPACITY, compute, fmt, pct } from "./lab-model.js";

const form = document.querySelector("[data-lab-form]");
if (form) init();

function level(u) {
  return u > 1 ? "over" : u > 0.85 ? "warn" : "ok";
}

function read() {
  const v = (name) => Number(form.elements[name].value);
  const load = { dau: v("dau"), rpu: v("rpu"), readShare: v("readShare"), peak: v("peak"), cacheHit: v("cacheHit"), respKb: v("respKb"), writeKb: v("writeKb") };
  const cap = { ...DEFAULT_CAPACITY };
  for (const k of Object.keys(cap)) cap[k] = v(k);
  const fail = { cacheCold: form.elements.cacheCold.checked, loseAppNode: form.elements.loseAppNode.checked, primaryFailover: form.elements.primaryFailover.checked };
  return { load, cap, fail };
}

function invalidFields() {
  return [...form.querySelectorAll("input[type=number]")].filter((i) => !i.checkValidity() || i.value === "");
}

function render() {
  const bad = invalidFields();
  const err = form.querySelector("[data-lab-error]");
  if (bad.length) {
    err.hidden = false;
    err.textContent = `Check ${bad.map((i) => form.querySelector(`label[for="${i.id}"]`).firstChild.textContent.trim()).join(", ")} — the value is missing or out of range.`;
    return;
  }
  err.hidden = true;
  const { load, cap, fail } = read();
  const r = compute(load, cap, fail);

  const verdict = document.querySelector("[data-lab-verdict]");
  verdict.textContent = r.verdict;
  verdict.dataset.level = fail.primaryFailover && !Number.isFinite(r.drainSeconds) ? "over" : level(r.hottest.util);

  const set = (k, v) => {
    const el = document.querySelector(`[data-out="${k}"]`);
    if (el) el.textContent = v;
  };
  set("avgRps", fmt(r.avgRps));
  set("peakRps", fmt(r.peakRps));
  set("peakWrites", fmt(r.peakWrites));
  set("dbReads", fmt(r.dbReads));
  set("storageTbYear", r.storageTbYear < 10 ? r.storageTbYear.toFixed(1) : fmt(r.storageTbYear));
  set("egressTbMonth", r.egressTbMonth < 10 ? r.egressTbMonth.toFixed(1) : fmt(r.egressTbMonth));

  document.querySelector("[data-lab-tiers]").innerHTML = r.tiers
    .map(
      (t) => `<tr data-tier="${t.id}" data-level="${level(t.util)}"><th scope="row">${t.label}</th><td>${t.count}</td><td><span class="meter" style="--u:${Math.min(1, t.util)}"><span></span></span> ${pct(t.util)}</td><td>${t.note}</td></tr>`
    )
    .join("");

  document.querySelector("[data-lab-diagram]").innerHTML = drawDiagram(r, fail);
}

function drawDiagram(r, fail) {
  const W = 760, H = 320, BW = 136, BH = 78;
  const maxRps = Math.max(r.peakRps, 1);
  const w = (rps) => (1.2 + 9 * Math.sqrt(Math.min(1, rps / maxRps))).toFixed(1);
  const flow = (rps) => `${Math.max(0.45, 2.6 - 2.1 * Math.min(1, rps / maxRps)).toFixed(2)}s`;
  const t = Object.fromEntries(r.tiers.map((x) => [x.id, x]));
  const box = (x, y, label, count, note, lv = "ok") => `<g class="ld-tier" data-level="${lv}" transform="translate(${x} ${y})">
      <rect class="ld-box" width="${BW}" height="${BH}" rx="4"/>
      <text class="ld-label" x="12" y="23">${label}</text>
      <text class="ld-count" x="12" y="58">${count}</text>
      <text class="ld-util" x="${BW - 12}" y="58" text-anchor="end">${note}</text>
    </g>`;
  const edge = (d, rps, down = false) =>
    `<g class="${down ? "ld-down" : ""}"><path class="ld-edge" d="${d}" stroke-width="${w(rps)}"/><path class="ld-flow" d="${d}" stroke-width="2" style="--flow:${flow(rps)}"/></g>`;
  const midY = 121;
  const appLabel = r.appActive !== r.appNodes ? `${r.appActive}/${r.appNodes}` : String(r.appNodes);
  const vw = fail.primaryFailover ? W : 556;
  return `<svg viewBox="-8 0 ${vw + 16} ${H}" preserveAspectRatio="xMidYMid meet" focusable="false">
    ${edge(`M${BW} ${midY + BH / 2} H${200}`, r.peakRps)}
    ${edge(`M${200 + BW} ${midY + BH / 2} C ${380} ${midY + BH / 2} ${380} ${20 + BH / 2} ${420} ${20 + BH / 2}`, r.peakReads + r.peakWrites, fail.cacheCold)}
    ${edge(`M${200 + BW} ${midY + BH / 2} C ${380} ${midY + BH / 2} ${380} ${midY + BH / 2} ${420} ${midY + BH / 2}`, r.dbReads)}
    ${edge(`M${200 + BW} ${midY + BH / 2} C ${380} ${midY + BH / 2} ${380} ${222 + BH / 2} ${420} ${222 + BH / 2}`, r.peakWrites, fail.primaryFailover)}
    ${box(0, midY, "Clients", fmt(r.peakRps), "rps")}
    ${box(200, midY, "App", appLabel, pct(t.app.util), level(t.app.util))}
    ${box(420, 20, "Cache", r.cacheNodes, fail.cacheCold ? "cold" : pct(t.cache.util), fail.cacheCold ? "warn" : level(t.cache.util))}
    ${box(420, midY, "Replicas", r.replicas, pct(t.replica.util), level(t.replica.util))}
    ${box(420, 222, r.shards > 1 ? "Shards" : "Primary", r.shards, fail.primaryFailover ? "failover" : pct(t.primary.util), fail.primaryFailover ? "over" : level(t.primary.util))}
    ${fail.primaryFailover ? `<g transform="translate(600 222)"><rect class="ld-box" width="150" height="${BH}" rx="4"/><text class="ld-label" x="12" y="23">Write queue</text><text class="ld-count" x="12" y="58">${fmt(r.queued)}</text></g>` : ""}
  </svg>`;
}

function init() {
  const preset = form.elements.preset;
  preset.addEventListener("change", () => {
    const p = PRESETS[preset.value];
    for (const k of ["dau", "rpu", "readShare", "peak", "cacheHit", "respKb", "writeKb"]) form.elements[k].value = p[k];
    render();
  });
  let raf;
  form.addEventListener("input", (e) => {
    if (e.target === preset) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(render);
  });
  form.addEventListener("submit", (e) => e.preventDefault());
  render();
}
