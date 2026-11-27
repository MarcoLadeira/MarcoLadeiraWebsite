// Static site build. No dependencies: `node src/build.mjs`.
// Renders every page from src/data into the repository root, which GitHub Pages serves.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site, absUrl } from "./data/site.mjs";
import { flagship } from "./data/projects.mjs";
import { essays, notes } from "./data/writing.mjs";
import { home } from "./pages/home.mjs";
import { workIndex, caseStudy } from "./pages/work.mjs";
import { experience, about, contact } from "./pages/profile.mjs";
import { writingIndex, updatesIndex, article } from "./pages/writing.mjs";
import { lab } from "./pages/lab.mjs";
import { redirect, notFound } from "./pages/misc.mjs";
import { rfc822 } from "./lib/dates.mjs";
import { escape } from "./lib/html.mjs";
import { cvHtml, ogHtml } from "./pages/cv.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const written = [];

function out(path, content) {
  const file = join(ROOT, path.endsWith("/") || path === "" ? join(path, "index.html") : path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content.endsWith("\n") ? content : content + "\n");
  written.push(path);
}

const pages = [];
const page = (path, render, { priority = 0.6, index = true } = {}) => {
  out(path, render());
  if (index) pages.push({ path, priority });
};

page("", home, { priority: 1 });
page("work/", workIndex, { priority: 0.9 });
flagship.forEach((p, i) => page(`work/${p.slug}/`, () => caseStudy(p, i), { priority: 0.8 }));
page("experience/", experience, { priority: 0.9 });
page("about/", about, { priority: 0.7 });
page("contact/", contact, { priority: 0.7 });
page("lab/", lab, { priority: 0.5 });
page("writing/", writingIndex, { priority: 0.6 });
essays.forEach((e) => page(e.path, () => article(e, "Essay"), { priority: 0.5 }));
page("updates/", updatesIndex, { priority: 0.3 });
notes.forEach((e) => page(e.path, () => article(e, "Note"), { priority: 0.4 }));

// Preserved legacy URLs.
out("now/", redirect("now/", "about/#now", "About — Now"));
out("updates/portfolio-redesign-march-2026/", redirect("updates/portfolio-redesign-march-2026/", "writing/", "Writing"));
out("404.html", notFound());

// Sitemap, robots, feed, manifest.
out(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${absUrl(p.path)}</loc><lastmod>${site.updated}</lastmod><priority>${p.priority.toFixed(1)}</priority></url>`).join("\n")}
</urlset>`
);
out("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${absUrl("sitemap.xml")}\n`);
const feedItems = [...essays, ...notes].sort((a, b) => (a.date < b.date ? 1 : -1));
out(
  "feed.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escape(site.name)} — Writing</title>
  <link>${absUrl("writing/")}</link>
  <description>Essays and notes on software engineering and AI systems.</description>
  <language>en-ie</language>
  <atom:link href="${absUrl("feed.xml")}" rel="self" type="application/rss+xml"/>
${feedItems
  .map(
    (e) => `  <item>
    <title>${escape(e.title)}</title>
    <link>${absUrl(e.path)}</link>
    <guid>${absUrl(e.path)}</guid>
    <pubDate>${rfc822(e.date)}</pubDate>
    <description>${escape(e.summary)}</description>
  </item>`
  )
  .join("\n")}
</channel>
</rss>`
);
out(
  "manifest.json",
  JSON.stringify(
    {
      name: site.name,
      short_name: "Marco Ladeira",
      start_url: site.base,
      scope: site.base,
      display: "browser",
      background_color: "#f2efe7",
      theme_color: "#15140f",
      icons: [
        { src: `${site.base}icon-192.png`, sizes: "192x192", type: "image/png" },
        { src: `${site.base}icon-512.png`, sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2
  )
);


// Sources for rendered assets (CV PDF, social images). Printed by scripts/render-assets.py.
const GEN = ".generated/";
out(`${GEN}cv.html`, cvHtml());
out(`${GEN}og-default.html`, ogHtml({ eyebrow: "Software engineer · Dublin", title: "Software that shows its <em>working.</em>", sub: "Associate Software Engineer at Fenergo. Builder of Vesta and ONE Oddlings." }));
const ogAccent = { fenergo: "#15140f", vesta: "#3b6fd8", oddlings: "#d99a00", savetheplanet: "#1f7a55" };
flagship.forEach((p, i) => out(`${GEN}og-${p.slug}.html`, ogHtml({ eyebrow: "Case study", title: p.name, sub: p.card, accent: ogAccent[p.slug], on: i })));

console.log(`Built ${written.length} files.`);
