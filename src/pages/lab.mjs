import { html, raw } from "../lib/html.mjs";
import { layout } from "../lib/layout.mjs";
import { url } from "../data/site.mjs";
import { PRESETS, DEFAULT_CAPACITY, compute, fmt, pct } from "../../assets/js/lab-model.js";

const field = (id, label, value, { min, max, unit = "", hint = "" } = {}) => html`<div class="field">
  <label for="${id}">${label}${unit ? html` <span class="field__unit">(${unit})</span>` : ""}</label>
  <input id="${id}" name="${id}" type="number" inputmode="decimal" value="${value}" min="${min}" max="${max}" step="any" ${raw(hint ? `aria-describedby="${id}-hint"` : "")} required>
  ${hint ? html`<p class="field__hint" id="${id}-hint">${hint}</p>` : ""}
</div>`;

export function lab() {
  const preset = PRESETS["social-feed"];
  const r = compute(preset);
  const body = html`
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-reveal>Lab · Experiment 01</p>
    <h1 class="page-head__title" data-split><span class="line"><span>Capacity Lab</span></span></h1>
    <p class="page-head__lede" data-reveal>Back-of-the-envelope system sizing, with the maths showing. Give it traffic and per-node assumptions; it sizes each tier, shows where load lands, and lets you break things to see what fails first.</p>
    <p class="lab-disclaimer" data-reveal><strong>What this is not:</strong> it doesn't design systems from a sentence, and it isn't a benchmark. It's the first hour of a design review, made interactive. Every formula is listed at the bottom and every default can be changed.</p>
  </div>
</section>

<section class="section section--tight lab" aria-label="Capacity Lab">
  <div class="wrap lab__grid">
    <form class="lab__controls" data-lab-form novalidate>
      <fieldset class="lab__failures">
        <legend>Break something</legend>
        <label class="switch"><input type="checkbox" name="cacheCold"><span>Cache goes cold</span></label>
        <label class="switch"><input type="checkbox" name="loseAppNode"><span>Lose an app instance</span></label>
        <label class="switch"><input type="checkbox" name="primaryFailover"><span>Database primary fails over</span></label>
      </fieldset>
      <fieldset>
        <legend>Workload</legend>
        <div class="field">
          <label for="preset">Starting point</label>
          <select id="preset" name="preset">
            ${Object.entries(PRESETS).map(([k, v]) => html`<option value="${k}"${raw(k === "social-feed" ? " selected" : "")}>${v.label}</option>`)}
          </select>
          <p class="field__hint">Illustrative figures to start from — not real company data.</p>
        </div>
        ${field("dau", "Daily active users", preset.dau, { min: 1, max: 5e9, step: 1 })}
        ${field("rpu", "Requests per user per day", preset.rpu, { min: 1, max: 100000 })}
        ${field("readShare", "Reads", preset.readShare, { min: 0, max: 100, unit: "% of requests" })}
        ${field("peak", "Peak-to-average ratio", preset.peak, { min: 1, max: 50, step: 0.5, hint: "Busiest second compared with the daily average." })}
        ${field("cacheHit", "Cache hit rate", preset.cacheHit, { min: 0, max: 100, unit: "%" })}
        ${field("respKb", "Average response", preset.respKb, { min: 0.1, max: 100000, step: 0.1, unit: "KB" })}
        ${field("writeKb", "Average stored write", preset.writeKb, { min: 0.01, max: 100000, step: 0.01, unit: "KB" })}
      </fieldset>
      <details class="lab__assumptions">
        <summary>Per-node assumptions</summary>
        <fieldset>
          <legend class="visually-hidden">Per-node assumptions</legend>
          ${field("appRps", "App instance", DEFAULT_CAPACITY.appRps, { min: 1, max: 1e6, unit: "requests/s" })}
          ${field("cacheOps", "Cache node", DEFAULT_CAPACITY.cacheOps, { min: 1, max: 1e7, unit: "ops/s" })}
          ${field("replicaRps", "Read replica", DEFAULT_CAPACITY.replicaRps, { min: 1, max: 1e7, unit: "reads/s" })}
          ${field("primaryWps", "Database primary", DEFAULT_CAPACITY.primaryWps, { min: 1, max: 1e7, unit: "writes/s" })}
          ${field("headroom", "Target utilisation at peak", DEFAULT_CAPACITY.headroom, { min: 10, max: 100, unit: "%" })}
          ${field("replication", "Stored copies", DEFAULT_CAPACITY.replication, { min: 1, max: 9 })}
          ${field("failoverSeconds", "Failover pause", DEFAULT_CAPACITY.failoverSeconds, { min: 1, max: 3600, unit: "seconds" })}
        </fieldset>
      </details>

      <p class="field__error" id="lab-error" data-lab-error hidden></p>
    </form>

    <div class="lab__output" data-lab-output>
      <p class="lab__verdict" data-lab-verdict>${r.verdict}</p>
      <p class="visually-hidden" role="status" aria-live="polite" data-lab-announce></p>
      <div class="lab__diagram" data-lab-diagram aria-hidden="true"></div>
      <dl class="lab__numbers">
        <div><dt>Average load</dt><dd><span class="n" data-out="avgRps">${fmt(r.avgRps)}</span><span class="u">requests/s</span></dd></div>
        <div><dt>Peak load</dt><dd><span class="n" data-out="peakRps">${fmt(r.peakRps)}</span><span class="u">requests/s</span></dd></div>
        <div><dt>Peak writes</dt><dd><span class="n" data-out="peakWrites">${fmt(r.peakWrites)}</span><span class="u">writes/s</span></dd></div>
        <div><dt>Database reads</dt><dd><span class="n" data-out="dbReads">${fmt(r.dbReads)}</span><span class="u">reads/s after cache</span></dd></div>
        <div><dt>New data</dt><dd><span class="n" data-out="storageTbYear">${r.storageTbYear.toFixed(1)}</span><span class="u">TB / year, all copies</span></dd></div>
        <div><dt>Egress</dt><dd><span class="n" data-out="egressTbMonth">${r.egressTbMonth.toFixed(1)}</span><span class="u">TB / month</span></dd></div>
      </dl>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Sizing by tier">
        <table class="lab__table">
          <caption class="visually-hidden">Sizing and peak utilisation by tier</caption>
          <thead><tr><th scope="col">Tier</th><th scope="col">Nodes</th><th scope="col">Peak utilisation</th><th scope="col">Note</th></tr></thead>
          <tbody data-lab-tiers>
            ${r.tiers.map(
              (t) => html`<tr data-tier="${t.id}"><th scope="row">${t.label}</th><td>${t.count}</td><td><span class="meter" style="--u:${Math.min(1, t.util)}"><span></span></span> ${pct(t.util)}</td><td>${t.note}</td></tr>`
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap wrap--narrow prose">
    <h2>The maths</h2>
    <ol class="formulas">
      <li><code>average rps = daily users × requests per user ÷ 86,400</code></li>
      <li><code>peak rps = average rps × peak-to-average</code>, split into reads and writes by the read share</li>
      <li><code>app instances = ⌈peak rps ÷ (instance rps × target utilisation)⌉ + 1</code> — the +1 is a spare so losing one is survivable</li>
      <li><code>database reads = peak reads × (1 − cache hit rate)</code>; replicas are sized at the normal hit rate, so a cold cache shows how far over they'd go</li>
      <li><code>shards = ⌈peak writes ÷ (primary writes/s × target utilisation)⌉</code></li>
      <li><code>queued writes = peak writes × failover pause</code>; they drain at the primaries' spare capacity</li>
      <li><code>storage per year = daily writes × write size × 365 × copies</code>; egress uses average, not peak, traffic</li>
    </ol>
    <p>Real systems are messier: hot keys, uneven shards, connection limits, garbage-collection pauses and cross-region latency all bite before the averages say they should. The point of the lab is to make the first-order shape of a design visible — and to show why a cold cache is a database problem.</p>
  </div>
</section>`;
  return layout({
    path: "lab/",
    section: "lab/",
    title: "Capacity Lab",
    description: "An interactive back-of-the-envelope capacity calculator: size app, cache and database tiers from traffic assumptions, then simulate a cold cache, a lost node or a database failover.",
    body,
    scripts: ["assets/js/lab.js"],
  });
}
