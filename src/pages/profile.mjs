import { html, raw, md } from "../lib/html.mjs";
import { layout, personJsonLd } from "../lib/layout.mjs";
import { site, url } from "../data/site.mjs";
import { roles, education, certifications, recognition } from "../data/experience.mjs";
import { icon } from "../components/icons.mjs";
import { contactBlock } from "../components/contact.mjs";

const pageHead = (eyebrow, lines, lede) => html`<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-reveal>${eyebrow}</p>
    <h1 class="page-head__title" data-split>${lines.map((l) => html`<span class="line"><span>${raw(l)}</span></span>`)}</h1>
    ${lede ? html`<p class="page-head__lede" data-reveal>${lede}</p>` : ""}
  </div>
</section>`;

export function experience() {
  const body = html`
${pageHead("Career", ["Experience"], "Graduate to Associate Software Engineer at Fenergo, a hackathon team I led, and two products of my own in private preview.")}
<section class="section section--tight" aria-labelledby="xp-work">
  <div class="wrap xp">
    <h2 class="xp__heading" id="xp-work" data-reveal>Professional</h2>
    <ol class="xp__list">
      ${roles.map(
        (r) => html`<li class="xp__item" data-reveal>
        <div class="xp__when"><p>${r.period}</p><p class="xp__kind">${r.kind}</p></div>
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
    <h2 class="xp__heading" id="xp-cert" data-reveal>Certification</h2>
    <ol class="xp__list">
      ${certifications.map(
        (c) => html`<li class="xp__item" data-reveal>
        <div class="xp__when"><p>${c.year}</p></div>
        <div class="xp__body"><h3 class="xp__title">${c.title}</h3><p class="xp__place">${c.issuer}</p></div>
      </li>`
      )}
    </ol>
  </div>
</section>
<section class="section section--tight">
  <div class="wrap cv-callout" data-reveal>
    <p class="cv-callout__text">The same information, on one page.</p>
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
${pageHead("Marco Ladeira", ["About"])}
<section class="section section--tight">
  <div class="wrap about">
    <div class="about__main prose">
      <p class="lead" data-reveal>I'm Marco Ladeira, a software engineer in Dublin. At work I build enterprise AI for financial-services compliance at Fenergo. In my own time I build products from the ground up — at the moment, an AI coding workspace called Vesta and a puzzle game called ONE Oddlings.</p>
      <h2 data-reveal>How I got here</h2>
      <p data-reveal>I studied at Dundalk Institute of Technology from 2021, first for a BSc in Computing and then an honours degree in Software Development, which I finished in 2025. I worked hospitality shifts through the first years of college, took on freelance development for a start-up in my final year, and was the sole developer of the patient app in our final-year smart pill-dispenser project.</p>
      <p data-reveal>I joined Fenergo as a Graduate Software Engineer in September 2025, on event-driven backend work for client lifecycle management software. A few months later I was selected for the company's first AI initiative, and I've since helped build an enterprise AI application from scratch to a beta release as one of a three-person engineering team. Along the way I was promoted to Associate Software Engineer.</p>
      <h2 data-reveal>How I work</h2>
      <dl class="principles">
        <div data-reveal><dt>Show the working</dt><dd>If a system makes a claim — a cost, a forecast, a fix — it should be able to show where the claim comes from. I'd rather label an estimate than oversell it.</dd></div>
        <div data-reveal><dt>Design the failure path</dt><dd>Stop buttons that stop, fallbacks that keep a demo alive, retries that can't double-charge. The unhappy path deserves as much care as the happy one.</dd></div>
        <div data-reveal><dt>Test at more than one layer</dt><dd>Unit tests, end-to-end tests, visual snapshots and — where content is generated — an independent checker that shares no code with the generator.</dd></div>
        <div data-reveal><dt>Care about the last 10%</dt><dd>Copy, motion, keyboard support, reduced motion and the first ten seconds of use are where people decide whether to trust software.</dd></div>
      </dl>
      <h2 id="now" data-reveal>Now <span class="now-date">— November 2026</span></h2>
      <ul class="ticks" data-reveal>
        <li>At Fenergo: enterprise AI work as an Associate Software Engineer, in a regulated KYC/AML product.</li>
        <li>ONE Oddlings: working through the last release gates — real-player tests, art paperwork and a launch plan.</li>
        <li>Vesta: consolidating every run onto one journal before the first verified public release.</li>
        <li>This site: rebuilt from scratch in November 2026 — static HTML, no framework, no trackers.</li>
      </ul>
    </div>
    <aside class="about__side" data-reveal>
      <dl class="side-facts">
        <div><dt>Role</dt><dd>${site.role}, ${site.employer}</dd></div>
        <div><dt>Based in</dt><dd>${site.location}</dd></div>
        <div><dt>Education</dt><dd>BSc (Hons) Software Development, DkIT, 2025</dd></div>
        <div><dt>Works in</dt><dd>C#, .NET, TypeScript, React, Python, LLM integration</dd></div>
      </dl>
      <p><a class="btn" href="${url(site.cv)}" download>${raw(icon("download"))} CV (PDF)</a></p>
      <p><a class="link-arrow" href="${url("experience/")}">Full experience ${raw(icon("arrow-right"))}</a></p>
    </aside>
  </div>
</section>
${contactBlock({ heading: "Say <em>hello.</em>" })}`;
  return layout({
    path: "about/",
    section: "about/",
    title: "About",
    description: "About Marco Ladeira: how he got into software, how he works, and what he's focused on now.",
    body,
    jsonLd: [personJsonLd()],
  });
}

export function contact() {
  const body = html`
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow" data-reveal>Contact</p>
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
      <div><dt>Based in</dt><dd>Dublin, Ireland (Irish time, GMT/IST)</dd></div>
      <div><dt>Replies</dt><dd>Usually within two working days</dd></div>
      <div><dt>Happy to talk about</dt><dd>Engineering, AI systems in regulated software, developer tools, games and products</dd></div>
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
