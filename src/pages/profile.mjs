import { html, raw } from "../lib/html.mjs";
import { layout, personJsonLd } from "../lib/layout.mjs";
import { site, url } from "../data/site.mjs";
import { roles, education, training, languages, recognition } from "../data/experience.mjs";
import { icon } from "../components/icons.mjs";

const pageHead = (lines, lede) => html`<section class="page-head">
  <div class="wrap">
    <h1 class="page-head__title" data-split>${lines.map((l) => html`<span class="line"><span>${raw(l)}</span></span>`)}</h1>
    ${lede ? html`<p class="page-head__lede" data-reveal>${lede}</p>` : ""}
  </div>
</section>`;

export function experience() {
  const body = html`
${pageHead(["Experience"], "My roles, responsibilities and progression, from freelance development to engineering at Fenergo.")}
<section class="section section--tight" aria-labelledby="xp-work">
  <div class="wrap xp">
    <h2 class="xp__heading" id="xp-work">Professional</h2>
    <ol class="xp__list">
      ${roles.map(
        (r, i) => html`<li class="xp__item" ${i === 0 ? "" : raw("data-reveal")}>
        <div class="xp__when"><p>${r.period}</p></div>
        <div class="xp__body">
          <h3 class="xp__title">${r.title}<span class="xp__org"> · ${r.org}</span></h3>
          <p class="xp__place">${r.place}</p>
          <p>${r.summary}</p>
          ${r.points.length ? html`<ul class="ticks">${r.points.map((x) => html`<li>${x}</li>`)}</ul>` : ""}
          ${r.link ? html`<p><a class="link-arrow" href="${url(r.link)}">Read the Fenergo case study ${raw(icon("arrow-right"))}</a></p>` : ""}
        </div>
      </li>`
      )}
    </ol>
  </div>
</section>
<section class="section section--tight" aria-labelledby="xp-lead">
  <div class="wrap xp">
    <h2 class="xp__heading" id="xp-lead" data-reveal>Leadership</h2>
    <ol class="xp__list">
      ${recognition.map(
        (r) => html`<li class="xp__item" data-reveal>
        <div class="xp__when"><p>${r.period}</p></div>
        <div class="xp__body"><h3 class="xp__title">${r.title}</h3><p>${r.detail}</p><p><a class="link-arrow" href="${url(r.link)}">Case study ${raw(icon("arrow-right"))}</a></p></div>
      </li>`
      )}
    </ol>
  </div>
</section>
<section class="section section--tight" aria-labelledby="xp-edu">
  <div class="wrap xp">
    <h2 class="xp__heading" id="xp-edu" data-reveal>Education</h2>
    <ol class="xp__list">
      ${education.map(
        (e) => html`<li class="xp__item" data-reveal>
        <div class="xp__when"><p>${e.period}</p></div>
        <div class="xp__body"><h3 class="xp__title">${e.title}<span class="xp__org"> · ${e.org}</span></h3><p class="xp__place">${e.detail}</p><p>${e.notes}</p></div>
      </li>`
      )}
    </ol>
  </div>
</section>
<section class="section section--tight" aria-labelledby="xp-cert">
  <div class="wrap xp">
    <h2 class="xp__heading" id="xp-cert" data-reveal>Selected training</h2>
    <ol class="xp__list xp__list--training">
      ${training.map(
        (c) => html`<li class="xp__item" data-reveal>

        <div class="xp__body"><h3 class="xp__title">${c.title}</h3><p class="xp__place">${c.issuer}</p></div>
      </li>`
      )}
    </ol>
  </div>
</section>
<section class="section section--tight">
  <div class="wrap cv-callout" data-reveal>
    <p class="cv-callout__text">Download a one-page summary of my experience.</p>
    <a class="btn btn--primary" href="${url(site.cv)}" download>${raw(icon("download"))} Download CV (PDF)</a>
  </div>
</section>`;
  return layout({
    path: "experience/",
    section: "experience/",
    title: "Experience",
    description: "Marco Ladeira's experience: Associate Software Engineer at Fenergo (promoted from Graduate), hackathon team lead, and BSc (Hons) Software Development from DkIT.",
    body,
    jsonLd: [personJsonLd()],
  });
}

export function about() {
  const body = html`
${pageHead(["About"])}
<section class="section section--tight">
  <div class="wrap about">
    <div class="about__main prose">
      <p class="lead">I’m Marco, a software engineer based in Dublin. I studied at Dundalk Institute of Technology, where I built software with other students and represented my final-year class.</p>
      <h2>From college to Fenergo</h2>
      <p>I worked in hospitality during my first years at college, then took on freelance development in my final year. Seeing our ORO team demonstrate a working pill dispenser at the Computing Expo was a highlight of the degree.</p>
      <p>I joined Fenergo in September 2025. I started on the client lifecycle platform and have since worked with different teams across back-end services, full-stack development and AI.</p>
      <h2 id="now">What I’m building</h2>
      <p>Outside work I make Vesta, a workspace for AI-assisted coding, and ONE Oddlings, a puzzle game. They let me work on things I don’t get to do every day, from designing how a coding tool reports its progress to getting a game to feel right on a phone.</p>
      <p><a class="link-arrow" href="${url("work/")}">See my work ${raw(icon("arrow-right"))}</a></p>
    </div>
    <aside class="about__side">
      <figure class="portrait">
        <img src="${url("assets/img/marco-ladeira.webp")}" alt="Marco Ladeira" width="460" height="460" decoding="async">
        <figcaption>Marco Ladeira</figcaption>
      </figure>
      <h2>Languages</h2>
      <dl class="side-facts">
        ${languages.map(([language, level]) => html`<div><dt>${language}</dt><dd>${level}</dd></div>`)}
      </dl>
    </aside>
  </div>
</section>`;
  return layout({
    path: "about/",
    section: "about/",
    title: "About",
    description: "Meet Marco Ladeira, a Dublin-based software engineer and independent product builder.",
    body,
    jsonLd: [personJsonLd()],
  });
}

export function contact() {
  const body = html`
<section class="page-head">
  <div class="wrap">
    <h1 class="page-head__title" data-split><span class="line"><span>Get in touch</span></span></h1>
  </div>
</section>
<section class="section section--tight contact-page">
  <div class="wrap contact-page__grid">
    <div class="contact-page__main" data-reveal>
      <p class="eyebrow">Email — quickest</p>
      <p class="closer__email contact-page__email"><a class="closer__address" href="mailto:${site.email}">${site.email}</a>
        <button class="btn btn--ghost copy" type="button" data-copy="${site.email}" hidden><span class="copy__icon" aria-hidden="true">${raw(icon("copy"))}</span><span class="copy__label">Copy address</span></button>
        <span class="visually-hidden" role="status" aria-live="polite" data-copy-status></span></p>
      <ul class="contact-page__links">
        <li><a href="${site.linkedin}" rel="me noopener"><span>LinkedIn</span><span class="contact-page__handle">in/marco-ladeira</span>${raw(icon("arrow-ne"))}</a></li>
        <li><a href="${site.github}" rel="me noopener"><span>GitHub</span><span class="contact-page__handle">MarcoLadeira</span>${raw(icon("arrow-ne"))}</a></li>
        <li><a href="${url(site.cv)}" download><span>CV</span><span class="contact-page__handle">PDF, one page</span>${raw(icon("download"))}</a></li>
      </ul>
    </div>
    <dl class="side-facts contact-page__facts" data-reveal>
      <div><dt>Based in</dt><dd>Dublin, Ireland · GMT/IST</dd></div>
    </dl>
  </div>
</section>`;
  return layout({
    path: "contact/",
    section: "contact/",
    title: "Contact",
    description: "Contact Marco Ladeira by email or LinkedIn, see his GitHub, or download his CV.",
    body,
    bodyClass: "page-contact",
  });
}
