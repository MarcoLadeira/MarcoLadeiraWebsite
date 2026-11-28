import { html, raw } from "../lib/html.mjs";
import { layout } from "../lib/layout.mjs";
import { site, url, absUrl } from "../data/site.mjs";
import { essays, notes } from "../data/writing.mjs";
import { formatDate } from "../lib/dates.mjs";
import { icon } from "../components/icons.mjs";
import { readFileSync } from "node:fs";

const content = (slug) => readFileSync(new URL(`../content/${slug}.html`, import.meta.url), "utf8");

const list = (items) => html`<ul class="posts">
  ${items.map(
    (e) => html`<li class="post" data-reveal>
    <a href="${url(e.path)}">
      <time datetime="${e.date}">${formatDate(e.date)}</time>
      <span class="post__title">${e.title}</span>
      <span class="post__summary">${e.summary}</span>
    </a>
  </li>`
  )}
</ul>`;

export function writingIndex() {
  const body = html`
<section class="page-head">
  <div class="wrap">
    <h1 class="page-head__title" data-split><span class="line"><span>Writing</span></span></h1>
    <p class="page-head__lede" data-reveal>Essays on using AI in software development and shorter notes from work. For an example of how I put these ideas into practice, see <a href="${url("work/vesta/")}">Vesta</a>.</p>
  </div>
</section>
<section class="section section--tight" aria-labelledby="essays"><div class="wrap"><h2 class="work-group__title" id="essays" data-reveal>Essays</h2>${list(essays)}</div></section>
<section class="section section--tight" aria-labelledby="notes"><div class="wrap"><h2 class="work-group__title" id="notes" data-reveal>Notes</h2>${list(notes)}</div></section>`;
  return layout({
    path: "writing/",
    section: "writing/",
    title: "Writing",
    description: "Essays and notes by Marco Ladeira on AI-assisted software engineering, systems judgment and enterprise AI.",
    body,
  });
}

export function updatesIndex() {
  const body = html`
<section class="page-head"><div class="wrap">
  <p class="eyebrow" data-reveal><a href="${url("writing/")}">Writing</a> / Notes</p>
  <h1 class="page-head__title" data-split><span class="line"><span>Notes</span></span></h1>
  <p class="page-head__lede" data-reveal>Short checkpoints from work. Essays are on the <a href="${url("writing/")}">writing page</a>.</p>
</div></section>
<section class="section section--tight"><div class="wrap">${list(notes)}</div></section>`;
  return layout({ path: "updates/", section: "writing/", title: "Notes", description: "Short notes from Marco Ladeira's work at Fenergo and on AI systems.", body });
}

export function article(e, kind) {
  const all = kind === "Essay" ? essays : notes;
  const i = all.indexOf(e);
  const other = all[(i + 1) % all.length];
  const body = html`
<article class="article">
  <header class="page-head page-head--article">
    <div class="wrap wrap--narrow">
      <p class="eyebrow" data-reveal><a href="${url("writing/")}">Writing</a> / ${kind}</p>
      <h1 class="article__title" data-reveal>${e.title}</h1>
      <p class="page-head__lede" data-reveal>${e.summary}</p>
      <p class="article__meta" data-reveal><time datetime="${e.date}">${formatDate(e.date)}</time> · ${e.minutes} min read · ${site.name}</p>
    </div>
  </header>
  <div class="wrap wrap--narrow prose article__body" data-reveal>
    ${raw(content(e.slug))}
  </div>
  <nav class="wrap wrap--narrow article__next" aria-label="More writing">
    <a class="next-case__link" href="${url(other.path)}"><span class="eyebrow">Next ${kind.toLowerCase()}</span><span class="next-case__name">${other.title} ${raw(icon("arrow-right"))}</span></a>
  </nav>
</article>`;
  return layout({
    path: e.path,
    section: "writing/",
    title: e.title,
    description: e.summary,
    body,
    ogType: "article",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": kind === "Essay" ? "BlogPosting" : "Article",
        headline: e.title,
        description: e.summary,
        datePublished: e.date,
        author: { "@type": "Person", name: site.name, url: absUrl("") },
        mainEntityOfPage: absUrl(e.path),
      },
    ],
  });
}
