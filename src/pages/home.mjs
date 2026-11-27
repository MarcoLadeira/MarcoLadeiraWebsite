import { html, raw, md } from "../lib/html.mjs";
import { layout, personJsonLd } from "../lib/layout.mjs";
import { site, url } from "../data/site.mjs";
import { flagship, archive } from "../data/projects.mjs";
import { roles, education } from "../data/experience.mjs";
import { essays } from "../data/writing.mjs";
import { schematic } from "../components/schematic.mjs";
import { featureVisual, statusPill } from "../components/work.mjs";
import { icon } from "../components/icons.mjs";
import { contactBlock } from "../components/contact.mjs";
import { capabilityRows } from "../components/capabilities.mjs";
import { formatDate } from "../lib/dates.mjs";

export function home() {
  const body = html`
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero__grid">
    <p class="eyebrow hero__eyebrow" data-reveal>
      <span>${site.name}</span>
      <span class="hero__sep" aria-hidden="true">/</span>
      <span>Software engineer</span>
      <span class="hero__sep" aria-hidden="true">/</span>
      <span>Dublin, Ireland</span>
    </p>
    <h1 class="hero__title" id="hero-title" data-split>
      <span class="line"><span>Software that</span></span>
      <span class="line"><span>shows its <em>working.</em></span></span>
    </h1>
    <p class="hero__note" data-reveal><span>Fig. 1</span><span>Selected work, wired to the capabilities it proves. Hover or tab through to trace each one.</span></p>
    <div class="hero__intro" data-reveal>
      <p class="lead">I'm Marco, an <strong>Associate Software Engineer at <a href="${site.employerUrl}" rel="noopener">Fenergo</a></strong>, where I help build enterprise AI for financial-services compliance. In my own time I build products — an AI coding workspace and a puzzle game — and I like every one of them to prove what it claims.</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="${url("work/")}">See the work ${raw(icon("arrow-right"))}</a>
        <a class="btn" href="${url(site.cv)}" download>${raw(icon("download"))} Download CV</a>
      </div>
      <ul class="hero__links" aria-label="Elsewhere">
        <li><a href="${site.linkedin}" rel="me noopener">LinkedIn ${raw(icon("arrow-ne"))}</a></li>
        <li><a href="${site.github}" rel="me noopener">GitHub ${raw(icon("arrow-ne"))}</a></li>
        <li><a href="mailto:${site.email}">Email</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap hero__schematic" data-reveal>
    ${schematic()}
  </div>
</section>

<section class="facts" aria-label="At a glance">
  <div class="wrap">
    <dl class="facts__grid">
      <div class="fact" data-reveal>
        <dt>Now</dt>
        <dd><strong>Associate Software Engineer, Fenergo</strong><span>Promoted from Graduate Software Engineer · Dublin · since Sep 2025</span></dd>
      </div>
      <div class="fact" data-reveal>
        <dt>Shipped</dt>
        <dd><strong>An enterprise AI application, built from scratch to beta</strong><span>One of a three-person engineering team · C#/.NET, TypeScript, LLMs</span></dd>
      </div>
      <div class="fact" data-reveal>
        <dt>Building</dt>
        <dd><strong>Vesta and ONE Oddlings</strong><span>Two independent products, each backed by over a thousand automated tests</span></dd>
      </div>
      <div class="fact" data-reveal>
        <dt>Studied</dt>
        <dd><strong>BSc (Hons) Software Development</strong><span>Dundalk Institute of Technology · 2025</span></dd>
      </div>
    </dl>
  </div>
</section>

<section class="section work-index" aria-labelledby="work-title">
  <div class="wrap">
    <header class="section__head">
      <p class="eyebrow" data-reveal>Selected work</p>
      <h2 class="section__title" id="work-title" data-reveal>Four projects, <em>four kinds of proof.</em></h2>
      <p class="section__lede" data-reveal>One professional, two products of my own, one team I led. Each links to a full case study: the problem, my role, the architecture, the hard parts and what I'd do differently.</p>
    </header>
    ${flagship.map(
      (p, i) => html`<article class="feature feature--${p.accent}" aria-labelledby="f-${p.slug}">
      <div class="feature__text" data-reveal>
        <p class="feature__meta"><span class="feature__num">0${i + 1}</span><span>${p.kind}</span><span>${p.year}</span></p>
        <h3 class="feature__name" id="f-${p.slug}"><a href="${url(`work/${p.slug}/`)}">${p.name}</a></h3>
        <p class="feature__lede">${p.card}</p>
        <dl class="proof">
          ${p.proof.map(([n, l]) => html`<div><dt>${l}</dt><dd>${n}</dd></div>`)}
        </dl>
        <p class="feature__role"><span class="visually-hidden">Role: </span>${p.role}</p>
        <p class="feature__foot">${statusPill(p)}<a class="link-arrow" href="${url(`work/${p.slug}/`)}" aria-describedby="f-${p.slug}">Case study ${raw(icon("arrow-right"))}</a></p>
      </div>
      <div class="feature__visual" data-reveal="rise">
        ${featureVisual(p)}
      </div>
    </article>`
    )}
    <div class="also" data-reveal>
      <h3 class="also__title">Earlier work</h3>
      <ul class="also__list">
        ${archive.map(
          (a) => html`<li><span class="also__name">${a.name}</span><span class="also__kind">${a.kind} · ${a.year}</span>${a.links.map(
            ([l, h]) => html`<a href="${h}" rel="noopener">${l} ${raw(icon("arrow-ne"))}<span class="visually-hidden"> for ${a.name}</span></a>`
          )}</li>`
        )}
      </ul>
      <a class="link-arrow" href="${url("work/")}">All work ${raw(icon("arrow-right"))}</a>
    </div>
  </div>
</section>

<section class="section capabilities" aria-labelledby="cap-title">
  <div class="wrap">
    <header class="section__head">
      <p class="eyebrow" data-reveal>Capabilities</p>
      <h2 class="section__title" id="cap-title" data-reveal>What I bring, <em>and where to check.</em></h2>
    </header>
    ${capabilityRows()}
  </div>
</section>

<section class="section path" aria-labelledby="path-title">
  <div class="wrap path__grid">
    <header class="section__head section__head--side">
      <p class="eyebrow" data-reveal>Experience</p>
      <h2 class="section__title" id="path-title" data-reveal>The path <em>so far.</em></h2>
      <p data-reveal><a class="link-arrow" href="${url("experience/")}">Full experience ${raw(icon("arrow-right"))}</a></p>
    </header>
    <ol class="trail">
      ${roles.map(
        (r) => html`<li class="trail__item trail__item--work" data-reveal>
        <p class="trail__when">${r.period}</p>
        <div><p class="trail__what"><strong>${r.title}</strong> · ${r.org}</p><p class="trail__note">${r.summary}</p></div>
      </li>`
      )}
      ${education.map(
        (e) => html`<li class="trail__item trail__item--edu" data-reveal>
        <p class="trail__when">${e.period}</p>
        <div><p class="trail__what"><strong>${e.title}</strong> · ${e.org}</p><p class="trail__note">${e.detail}</p></div>
      </li>`
      )}
    </ol>
  </div>
</section>

<section class="section writing-teaser" aria-labelledby="writing-title">
  <div class="wrap">
    <header class="section__head">
      <p class="eyebrow" data-reveal>Writing</p>
      <h2 class="section__title" id="writing-title" data-reveal>Notes on building <em>with AI.</em></h2>
    </header>
    <ul class="posts">
      ${essays.map(
        (e) => html`<li class="post" data-reveal>
        <a href="${url(e.path)}">
          <time datetime="${e.date}">${formatDate(e.date)}</time>
          <span class="post__title">${e.title}</span>
          <span class="post__summary">${e.summary}</span>
        </a>
      </li>`
      )}
    </ul>
    <p data-reveal><a class="link-arrow" href="${url("writing/")}">All writing ${raw(icon("arrow-right"))}</a></p>
  </div>
</section>

${contactBlock({ heading: "Let's talk about something <em>worth building.</em>" })}
`;

  return layout({
    path: "",
    title: `${site.name} — Software Engineer`,
    description: site.description,
    body,
    bodyClass: "page-home",
    jsonLd: [personJsonLd(), { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: "https://marcoladeira.github.io/MarcoLadeiraWebsite/" }],
  });
}
