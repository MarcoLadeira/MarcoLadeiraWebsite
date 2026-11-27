import { html, raw, md } from "../lib/html.mjs";
import { layout, personJsonLd } from "../lib/layout.mjs";
import { site, url } from "../data/site.mjs";
import { flagship, archive } from "../data/projects.mjs";
import { roles, education } from "../data/experience.mjs";
import { schematic } from "../components/schematic.mjs";
import { featureVisual, statusPill } from "../components/work.mjs";
import { icon } from "../components/icons.mjs";
import { contactBlock } from "../components/contact.mjs";
import { capabilityRows } from "../components/capabilities.mjs";

export function home() {
  const body = html`
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero__grid">
    <p class="eyebrow hero__eyebrow" data-reveal>
      <span>Software engineer</span>
      <span class="hero__sep" aria-hidden="true">/</span>
      <span>Dublin, Ireland</span>
    </p>
    <h1 class="hero__title" id="hero-title" data-split>
      <span class="hero__name">Marco Ladeira<span class="visually-hidden">: </span></span>
      <span class="line"><span>Software that</span></span>
      <span class="line"><span>shows its <em>working.</em></span></span>
    </h1>
    <div class="hero__intro" data-reveal>
      <p class="lead">I'm Marco, an <strong>Associate Software Engineer at <a href="${site.employerUrl}" rel="noopener">Fenergo</a></strong>, where I help build enterprise AI for financial-services compliance. In my own time I build products — an AI coding workspace and a puzzle game — and I like every one of them to prove what it claims.</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="${url("work/")}">See the work ${raw(icon("arrow-right"))}</a>
        <a class="btn" href="${url(site.cv)}" download>${raw(icon("download"))} Download CV</a>
      </div>
      <p class="hero__meta">At Fenergo since September 2025 · BSc (Hons) Software Development, DkIT, 2025</p>
      <ul class="hero__links" aria-label="Elsewhere">
        <li><a href="${site.linkedin}" rel="me noopener">LinkedIn ${raw(icon("arrow-ne"))}</a></li>
        <li><a href="${site.github}" rel="me noopener">GitHub ${raw(icon("arrow-ne"))}</a></li>
        <li><a href="mailto:${site.email}">Email</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap hero__schematic" data-reveal>
    <p class="hero__note"><span>Fig. 1</span><span>Four pieces of work and the skills each one shows.</span></p>
    ${schematic()}
  </div>
</section>

<section class="section work-index" aria-labelledby="work-title">
  <div class="wrap">
    <header class="section__head">
      <p class="eyebrow" data-reveal>Selected work</p>
      <h2 class="section__title" id="work-title" data-reveal>One professional project, two products of my own and a team I led.</h2>
      <p class="section__lede" data-reveal>Each has a full case study: the problem, my role, the architecture, the hard parts and what I'd do differently.</p>
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
      <h2 class="section__title" id="cap-title" data-reveal>What I do, and where you can see it.</h2>
    </header>
    ${capabilityRows()}
  </div>
</section>

<section class="section path" aria-labelledby="path-title">
  <div class="wrap path__grid">
    <header class="section__head section__head--side">
      <p class="eyebrow" data-reveal>Experience</p>
      <h2 class="section__title" id="path-title" data-reveal>Career so far</h2>
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

${contactBlock({ heading: "Let's <em>talk.</em>" })}
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
