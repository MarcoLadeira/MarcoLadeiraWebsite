import { html, raw } from "../lib/html.mjs";
import { site, absUrl } from "../data/site.mjs";
import { roles, education, certifications } from "../data/experience.mjs";
import { readFileSync } from "node:fs";

// The CV is generated from the same data as the site, then printed to PDF by
// scripts/render-assets.py. No phone number or referee details are published.

const font = (f) => `url(data:font/woff2;base64,${readFileSync(new URL(`../../assets/fonts/${f}`, import.meta.url)).toString("base64")})`;

const projects = [
  ["Vesta — AI coding workspace (private alpha)", "2026 — now", "Sole developer of a local-first desktop app and CLI (Python, PySide6, JavaScript) that routes coding tasks to the cheapest capable model, streams live activity, cancels whole process trees on Stop and records a cost ledger. ~126k lines of Python; ~7,900 pytest functions and ~1,360 Vitest/Playwright cases; 550+ merged PRs."],
  ["ONE Oddlings — browser puzzle game (in development)", "2026 — now", "Sole developer (TypeScript, React, Vite). Seeded board generator with an independent verifier (20,000 boards re-checked, zero failures), an on-device Glicko-style adaptive difficulty model, daily runs, streaks and versioned replay links. ~1,100 tests across the ONE codebase."],
  ["SaveThePlanet — Hack the Climate 2026, Dublin", "Sep 2026", "Product Owner and Technical Lead of a four-person team at an energy-industry hackathon. Prototype linking real Irish grid data and 30-minute-ahead curtailment forecasts to a constraint-aware EV charging plan and incentive model; evidence ledger separating real from simulated figures; 475 documented automated tests."],
];

const skills = [
  ["Languages", "C#, TypeScript, JavaScript, Python, Java, SQL, Swift"],
  ["Frameworks", ".NET, React, Node.js / Express, Vite, PySide6"],
  ["Data & cloud", "AWS, DynamoDB, EventStoreDB, PostgreSQL, MySQL, SQLite, Docker"],
  ["AI", "LLM integration, agent workflows, model routing, MCP tooling"],
  ["Quality & delivery", "Playwright, Vitest, pytest, CI with GitHub Actions and Azure DevOps, Git"],
];

export function cvHtml() {
  return `<!doctype html>${html`<html lang="en-IE"><head><meta charset="utf-8"><title>Marco Ladeira — CV</title>
<style>
@font-face{font-family:"Newsreader";src:${raw(font("newsreader-latin-normal.woff2"))} format("woff2");font-weight:300 600}
@font-face{font-family:"Newsreader";src:${raw(font("newsreader-latin-italic.woff2"))} format("woff2");font-weight:300 600;font-style:italic}
@font-face{font-family:"Plex";src:${raw(font("ibm-plex-sans-latin-400-normal.woff2"))} format("woff2");font-weight:400}
@font-face{font-family:"Plex";src:${raw(font("ibm-plex-sans-latin-600-normal.woff2"))} format("woff2");font-weight:600}
@font-face{font-family:"PlexMono";src:${raw(font("ibm-plex-mono-latin-500-normal.woff2"))} format("woff2");font-weight:500}
@page{size:A4;margin:11mm 13mm 10mm}
*{box-sizing:border-box}
body{margin:0;font:400 8.5pt/1.38 Plex,Arial,sans-serif;color:#15140f}
a{color:inherit;text-decoration:none}
header{display:grid;grid-template-columns:1fr auto;gap:2mm 8mm;align-items:end;padding-bottom:3.2mm;border-bottom:1.2pt solid #15140f}
h1{margin:0;font:400 25pt/1 Newsreader,Georgia,serif;letter-spacing:-.02em}
.role{margin:1.4mm 0 0;font:400 11.5pt/1.2 Newsreader,Georgia,serif}
.role em{color:#a8320f}
.contact{text-align:right;font-size:8.3pt;line-height:1.55}
h2{font:500 7.2pt/1 PlexMono,monospace;letter-spacing:.08em;text-transform:uppercase;color:#a8320f;margin:3.6mm 0 1.7mm;padding-bottom:1mm;border-bottom:.5pt solid #c9c3b4}
.summary{margin:2.8mm 0 0;font-size:8.9pt}
.item{display:grid;grid-template-columns:1fr auto;gap:0 4mm;margin-bottom:2mm;break-inside:avoid}
.item h3{margin:0;font:600 9.2pt/1.3 Plex,sans-serif}
.item h3 span{font-weight:400;color:#45423a}
.when{font:500 7.6pt/1.6 PlexMono,monospace;color:#45423a;white-space:nowrap}
.item p,.item ul{grid-column:1/-1;margin:.6mm 0 0}
ul{padding-left:3.6mm}
li{margin:.4mm 0}
li::marker{color:#a8320f}
.skills{display:grid;grid-template-columns:30mm 1fr;gap:1mm 4mm}
.skills dt{font-weight:600}
.skills dd{margin:0}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:0 8mm}
footer{margin-top:3mm;font-size:7.6pt;color:#45423a}
</style></head><body>
<header>
  <div><h1>${site.name}</h1><p class="role">${site.role} · <em>${site.employer}</em></p></div>
  <div class="contact">${site.location}<br><a href="mailto:${site.email}">${site.email}</a><br><a href="${site.linkedin}">linkedin.com/in/marco-ladeira</a><br><a href="${site.github}">github.com/MarcoLadeira</a><br><a href="${absUrl("")}">marcoladeira.github.io/MarcoLadeiraWebsite</a></div>
</header>
<p class="summary">Software engineer in Dublin building enterprise AI for financial-services compliance at Fenergo — promoted from Graduate to Associate Software Engineer, and one of a three-person team that built an enterprise AI application from scratch to beta. Builds his own products end to end — two are in private preview — with a focus on reliability, human oversight and honest measurement.</p>
<h2>Experience</h2>
${roles.map(
  (r) => html`<div class="item"><h3>${r.title} <span>· ${r.org}, ${r.place}</span></h3><span class="when">${r.period}</span>
  <p>${r.summary}</p>${r.points.length ? html`<ul>${r.points.map((x) => html`<li>${x}</li>`)}</ul>` : ""}</div>`
)}
<h2>Selected projects</h2>
${projects.map(([t, w, d]) => html`<div class="item"><h3>${t}</h3><span class="when">${w}</span><p>${d}</p></div>`)}
<div class="cols">
<div>
<h2>Education</h2>
${education.map((e) => html`<div class="item"><h3>${e.title} <span>· ${e.org}</span></h3><span class="when">${e.period}</span><p>${e.detail}</p></div>`)}
<h2>Certification</h2>
${certifications.map((c) => html`<div class="item"><h3>${c.title}</h3><span class="when">${c.year}</span></div>`)}
</div>
<div>
<h2>Skills</h2>
<dl class="skills">${skills.map(([k, v]) => html`<dt>${k}</dt><dd>${v}</dd>`)}</dl>
</div>
</div>
<footer>Case studies and source: ${absUrl("work/")}</footer>
</body></html>`}`;
}

export function ogHtml({ eyebrow, title, sub, accent = "#c23c17", on = 0 }) {
  return `<!doctype html>${html`<html><head><meta charset="utf-8"><style>
@font-face{font-family:"Newsreader";src:${raw(font("newsreader-latin-normal.woff2"))} format("woff2");font-weight:300 600}
@font-face{font-family:"Newsreader";src:${raw(font("newsreader-latin-italic.woff2"))} format("woff2");font-weight:300 600;font-style:italic}
@font-face{font-family:"PlexMono";src:${raw(font("ibm-plex-mono-latin-500-normal.woff2"))} format("woff2");font-weight:500}
@font-face{font-family:"Plex";src:${raw(font("ibm-plex-sans-latin-400-normal.woff2"))} format("woff2")}
html,body{margin:0;width:1200px;height:630px;background:#f2efe7;color:#15140f}
body{display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px 120px;box-sizing:border-box;position:relative;overflow:hidden}
.top{display:flex;justify-content:space-between;font:500 20px PlexMono,monospace;letter-spacing:.06em;text-transform:uppercase;color:#625e55}
.top b{color:${raw(accent)};font-weight:500}
h1{margin:0;font:380 96px/0.95 Newsreader,serif;letter-spacing:-.035em;max-width:980px}
h1 em{color:#a8320f}
p{margin:22px 0 0;font:400 28px/1.35 Plex,sans-serif;color:#45423a;max-width:900px}
.bus{position:absolute;left:72px;right:72px;bottom:56px;height:2px;background:#15140f}
.bus i{position:absolute;top:-6px;width:10px;height:10px;border-radius:50%;background:#f2efe7;border:2px solid #15140f}
.bus i.on{background:${raw(accent)};border-color:${raw(accent)}}
</style></head><body>
<div class="top"><span>Marco Ladeira</span><b>${eyebrow}</b></div>
<div><h1>${raw(title)}</h1>${sub ? html`<p>${sub}</p>` : ""}</div>
<div class="bus">${[12, 37, 62, 87].map((x, i) => raw(`<i style="left:${x}%"${i === on ? ' class="on"' : ""}></i>`))}</div>
</body></html>`}`;
}
