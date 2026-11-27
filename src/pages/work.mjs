import { html, raw, md } from "../lib/html.mjs";
import { layout } from "../lib/layout.mjs";
import { site, url, absUrl } from "../data/site.mjs";
import { flagship, archive } from "../data/projects.mjs";
import { featureVisual, statusPill } from "../components/work.mjs";
import { figure, video } from "../components/media.mjs";
import { icon } from "../components/icons.mjs";
import { architectureDiagram } from "../components/diagram.mjs";
import { contactBlock } from "../components/contact.mjs";

export function workIndex() {
  const groups = [
    ["Professional", flagship.filter((p) => p.kind === "Professional")],
    ["Independent products", flagship.filter((p) => p.kind === "Independent product")],
    ["Team leadership", flagship.filter((p) => p.kind.startsWith("Hackathon"))],
  ];
  const body = html`
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-reveal>Case studies</p>
    <h1 class="page-head__title" data-split><span class="line"><span>Work</span></span></h1>
    <p class="page-head__lede" data-reveal>Professional work comes first, then products I build on my own, then a team I led. Every status line says exactly where a project stands today.</p>
  </div>
</section>
${groups.map(
  ([label, items]) => html`<section class="section section--tight work-group" aria-label="${label}">
  <div class="wrap">
    <h2 class="work-group__title" data-reveal>${label}</h2>
    ${items.map(
      (p) => html`<article class="feature feature--${p.accent}" aria-labelledby="w-${p.slug}">
      <div class="feature__text" data-reveal>
        <p class="feature__meta"><span>${p.kind}</span><span>${p.year}</span></p>
        <h3 class="feature__name" id="w-${p.slug}"><a href="${url(`work/${p.slug}/`)}">${p.name}</a></h3>
        <p class="feature__lede">${p.lede}</p>
        <p class="feature__role"><span class="visually-hidden">Role: </span>${p.role}</p>
        <ul class="tags" aria-label="Technologies">${p.stack.slice(0, 6).map((s) => html`<li>${s}</li>`)}</ul>
        <p class="feature__foot">${statusPill(p)}<a class="link-arrow" href="${url(`work/${p.slug}/`)}" aria-describedby="w-${p.slug}">Case study ${raw(icon("arrow-right"))}</a></p>
      </div>
      <div class="feature__visual" data-reveal="rise">${featureVisual(p)}</div>
    </article>`
    )}
  </div>
</section>`
)}
<section class="section section--tight" id="earlier" aria-labelledby="earlier-title">
  <div class="wrap">
    <h2 class="work-group__title" id="earlier-title" data-reveal>Earlier work</h2>
    <p class="work-group__note" data-reveal>Smaller university-era projects, kept for range. Archived from this list: a Unity VR prototype whose source is no longer public.</p>
    <ul class="archive">
      ${archive.map(
        (a) => html`<li class="archive__item" data-reveal>
        <p class="archive__meta">${a.kind} · ${a.year}</p>
        <h3 class="archive__name">${a.name}</h3>
        <p class="archive__text">${a.text}</p>
        <ul class="tags" aria-label="Technologies">${a.stack.map((s) => html`<li>${s}</li>`)}</ul>
        <p>${a.links.map(([l, h]) => html`<a class="link-arrow" href="${h}" rel="noopener">${l} ${raw(icon("arrow-ne"))}<span class="visually-hidden"> — ${a.name}</span></a>`)}</p>
      </li>`
      )}
    </ul>
  </div>
</section>
${contactBlock({ heading: "Questions about <em>any of this?</em>" })}`;
  return layout({
    path: "work/",
    section: "work/",
    title: "Work",
    description: "Case studies from Marco Ladeira: enterprise AI at Fenergo, the Vesta AI coding workspace, the ONE Oddlings puzzle game and the SaveThePlanet climate prototype.",
    body,
  });
}

export function caseStudy(p, index) {
  const c = p.caseStudy;
  const next = flagship[(index + 1) % flagship.length];
  const toc = [
    ["overview", "Overview"],
    ["problem", "Problem"],
    ["role", "My role"],
    c.media || c.video ? ["product", "The product"] : null,
    c.demo ? ["try", "Try the rules"] : null,
    c.architecture ? ["architecture", "Architecture"] : null,
    c.challenges ? ["challenges", "Hard problems"] : null,
    c.principles ? ["principles", "How I work here"] : null,
    c.decisions ? ["decisions", "Decisions & trade-offs"] : null,
    c.testing ? ["testing", "Testing"] : null,
    c.results ? ["results", "Results"] : null,
    ["lessons", "Lessons"],
    ["status", "Status"],
  ].filter(Boolean);

  const body = html`
<article class="case case--${p.accent}">
  <header class="case__head">
    <div class="wrap">
      <p class="eyebrow" data-reveal><a href="${url("work/")}">Work</a> <span aria-hidden="true">/</span> ${p.kind}</p>
      <h1 class="case__title" data-split><span class="line"><span>${p.name}</span></span></h1>
      <p class="case__lede" data-reveal>${p.lede}</p>
      <dl class="case__facts" data-reveal>
        <div><dt>Role</dt><dd>${p.role}</dd></div>
        <div><dt>When</dt><dd>${p.year}</dd></div>
        <div><dt>Team</dt><dd>${p.team}</dd></div>
        <div><dt>Status</dt><dd>${statusPill(p)}</dd></div>
        <div class="case__stack"><dt>Stack</dt><dd><ul class="tags">${p.stack.map((s) => html`<li>${s}</li>`)}</ul></dd></div>
      </dl>
    </div>
    <div class="wrap case__hero" data-reveal="rise">${featureVisual(p, { eager: true })}</div>
  </header>

  <div class="wrap case__body">
    <nav class="case__toc" aria-label="On this page">
      <p class="eyebrow">On this page</p>
      <ol>${toc.map(([id, l]) => html`<li><a href="#${id}">${l}</a></li>`)}</ol>
    </nav>
    <div class="case__content prose">
      ${c.confidential ? html`<aside class="callout" data-reveal><p class="callout__title">${raw(icon("lock"))} Confidential by design</p><p>This is professional work for an employer. It describes my role and approach at the level that is public, and leaves out internal architecture, metrics, screenshots and client details.</p></aside>` : ""}
      <section id="overview" aria-labelledby="h-overview"><h2 id="h-overview">Overview</h2><p>${md(c.overview)}</p></section>
      <section id="problem" aria-labelledby="h-problem"><h2 id="h-problem">The problem</h2><p>${md(c.problem)}</p><h3>Why it mattered to me</h3><p>${md(c.motivation)}</p></section>
      <section id="role" aria-labelledby="h-role"><h2 id="h-role">My role</h2><ul class="ticks">${c.responsibilities.map((r) => html`<li>${md(r)}</li>`)}</ul></section>
      ${c.media || c.video
        ? html`<section id="product" class="bleed" aria-labelledby="h-product"><h2 id="h-product">The product</h2>
        ${c.video ? video(c.video, { label: `${p.name} gameplay recording` }) : ""}
        <div class="gallery">${(c.media || []).map((m) => figure(m.key, { caption: m.caption, sizes: "(min-width: 1100px) 70vw, 100vw" }))}</div>
      </section>`
        : ""}
      ${c.demo === "verifier"
        ? html`<section id="try" aria-labelledby="h-try"><h2 id="h-try">Try the rules</h2>
        <p>A simplified version of the game's board rules, using plain shapes instead of the characters. Each board is generated broken; the checker — a direct port of the game's independent verifier — counts the fixing swaps and judges yours. Tap or press two pieces to swap them.</p>
        <p class="vf-fallback" data-vf-fallback>This interactive demo needs JavaScript.</p>
        <div class="vf" data-verifier hidden>
          <p class="vf__goal" data-vf-goal></p>
          <div class="vf__board" data-vf-board role="group" aria-label="Puzzle board, three by three"></div>
          <p class="vf__out" data-vf-out></p>
          <p class="visually-hidden" role="status" aria-live="polite" data-vf-status></p>
          <div class="vf__actions"><button class="btn btn--small" type="button" data-vf-hint>Show a fix</button><button class="btn btn--small" type="button" data-vf-next>Next goal ${raw(icon("arrow-right"))}</button></div>
        </div>
      </section>`
        : ""}
      ${c.architecture
        ? html`<section id="architecture" aria-labelledby="h-arch"><h2 id="h-arch">Architecture</h2>${architectureDiagram(c.architecture, p.name)}</section>`
        : ""}
      ${c.challenges
        ? html`<section id="challenges" aria-labelledby="h-challenges"><h2 id="h-challenges">Hard problems</h2>
        ${c.challenges.map(
          (ch, i) => html`<div class="challenge" data-reveal>
          <h3><span class="challenge__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>${ch.title}</h3>
          <p>${md(ch.body)}</p>
          ${ch.code ? html`<figure class="code"><figcaption>${ch.code.label}</figcaption><pre tabindex="0"><code class="lang-${ch.code.lang}">${ch.code.text}</code></pre></figure>` : ""}
        </div>`
        )}</section>`
        : ""}
      ${c.principles
        ? html`<section id="principles" aria-labelledby="h-principles"><h2 id="h-principles">How I work in this domain</h2>
        <dl class="principles">${c.principles.map(([t, d]) => html`<div data-reveal><dt>${t}</dt><dd>${d}</dd></div>`)}</dl></section>`
        : ""}
      ${c.decisions
        ? html`<section id="decisions" aria-labelledby="h-decisions"><h2 id="h-decisions">Decisions & trade-offs</h2>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Decisions and trade-offs table">
        <table class="decisions"><thead><tr><th scope="col">Decision</th><th scope="col">Chose</th><th scope="col">Considered</th><th scope="col">Trade-off</th></tr></thead>
        <tbody>${c.decisions.map(([a, b, d, e]) => html`<tr><th scope="row">${a}</th><td>${b}</td><td>${d}</td><td>${e}</td></tr>`)}</tbody></table></div></section>`
        : ""}
      ${c.testing ? html`<section id="testing" aria-labelledby="h-testing"><h2 id="h-testing">Testing & reliability</h2><p>${md(c.testing)}</p></section>` : ""}
      ${c.results ? html`<section id="results" aria-labelledby="h-results"><h2 id="h-results">Results</h2><ul class="ticks">${c.results.map((r) => html`<li>${md(r)}</li>`)}</ul></section>` : ""}
      <section id="lessons" aria-labelledby="h-lessons"><h2 id="h-lessons">Lessons</h2><ol class="lessons">${c.lessons.map((l) => html`<li>${md(l)}</li>`)}</ol></section>
      <section id="status" aria-labelledby="h-status"><h2 id="h-status">Status</h2><p>${statusPill(p)}</p><p>${md(c.statusText)}</p>
        ${c.links.length ? html`<ul class="link-list">${c.links.map(([l, h]) => html`<li><a class="link-arrow" href="${h}" rel="noopener">${l} ${raw(icon("arrow-ne"))}</a></li>`)}</ul>` : ""}
      </section>
    </div>
  </div>

  <nav class="next-case" aria-label="Next case study">
    <div class="wrap">
      <a href="${url(`work/${next.slug}/`)}" class="next-case__link">
        <span class="eyebrow">Next case study</span>
        <span class="next-case__name">${next.name} ${raw(icon("arrow-right"))}</span>
      </a>
    </div>
  </nav>
</article>`;

  return layout({
    path: `work/${p.slug}/`,
    section: "work/",
    title: `${p.name} — case study`,
    description: p.lede,
    body,
    ogImage: `assets/img/og/${p.slug}.png`,
    ogType: "article",
    scripts: c.demo === "verifier" ? ["assets/js/verifier.js"] : [],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: p.name,
        description: p.lede,
        author: { "@type": "Person", name: site.name, url: absUrl("") },
        url: absUrl(`work/${p.slug}/`),
        keywords: p.stack.join(", "),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Work", item: absUrl("work/") },
          { "@type": "ListItem", position: 2, name: p.name, item: absUrl(`work/${p.slug}/`) },
        ],
      },
    ],
  });
}
