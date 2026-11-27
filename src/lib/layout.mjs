import { html, raw } from "./html.mjs";
import { site, nav, url, absUrl } from "../data/site.mjs";
import { icon } from "../components/icons.mjs";

const ASSET_VERSION = "20261127";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: absUrl(""),
    jobTitle: site.role,
    worksFor: { "@type": "Organization", name: site.employer, url: site.employerUrl },
    address: { "@type": "PostalAddress", addressLocality: "Dublin", addressCountry: "IE" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Dundalk Institute of Technology" },
    email: `mailto:${site.email}`,
    sameAs: [site.linkedin, site.github],
    knowsAbout: ["Software engineering", "C#", ".NET", "TypeScript", "Python", "LLM integration", "AI systems", "Event-driven architecture"],
  };
}

/**
 * Wrap page content in the full document.
 * @param {object} p
 * @param {string} p.path      site-relative path, e.g. "work/vesta/"
 * @param {string} p.title     page title (without the site name)
 * @param {string} p.description
 * @param {any}    p.body      html() result
 * @param {string} [p.section] nav item to mark current
 * @param {string} [p.ogImage] site-relative image path
 * @param {string} [p.ogType]
 * @param {object[]} [p.jsonLd]
 * @param {string[]} [p.scripts] extra site-relative scripts (module)
 * @param {string[]} [p.styles]  extra site-relative stylesheets
 * @param {boolean} [p.noindex]
 * @param {string} [p.bodyClass]
 */
export function layout(p) {
  const fullTitle = p.path === "" ? `${site.name} — Software Engineer` : `${p.title} — ${site.name}`;
  const canonical = absUrl(p.path);
  const og = absUrl(p.ogImage || "assets/img/og/default.png");
  const ld = [...(p.jsonLd || [])];
  const current = (href) => (p.section && href.startsWith(p.section) ? raw(' aria-current="page"') : "");

  return `<!doctype html>
${html`<html lang="${site.lang}" data-theme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${p.description}">
<link rel="canonical" href="${canonical}">
${p.noindex ? raw('<meta name="robots" content="noindex">') : ""}
<meta name="author" content="${site.name}">
<meta property="og:type" content="${p.ogType || "website"}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${site.name} — ${site.tagline}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.description}">
<meta name="twitter:image" content="${og}">
<meta name="theme-color" content="#f2efe7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#11100d" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${url("favicon.svg")}" type="image/svg+xml">
<link rel="icon" href="${url("favicon-32.png")}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${url("apple-touch-icon.png")}">
<link rel="manifest" href="${url("manifest.json")}">
<link rel="alternate" type="application/rss+xml" title="${site.name} — Writing" href="${url("feed.xml")}">
<link rel="preload" href="${url("assets/fonts/newsreader-latin-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${url("assets/fonts/ibm-plex-sans-latin-400-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<script>${raw(
    `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}var d=document.documentElement;d.classList.add("js");setTimeout(function(){if(!d.hasAttribute("data-ready"))d.classList.remove("js")},2500)})();`
  )}</script>
<link rel="stylesheet" href="${url(`assets/css/site.css?v=${ASSET_VERSION}`)}">
${(p.styles || []).map((s) => html`<link rel="stylesheet" href="${url(`${s}?v=${ASSET_VERSION}`)}">`)}
<script type="module" src="${url(`assets/js/site.js?v=${ASSET_VERSION}`)}"></script>
${(p.scripts || []).map((s) => html`<script type="module" src="${url(`${s}?v=${ASSET_VERSION}`)}"></script>`)}
${ld.map((o) => html`<script type="application/ld+json">${raw(JSON.stringify(o).replace(/</g, "\\u003c"))}</script>`)}
</head>
<body class="${p.bodyClass || ""}">
<a class="skip" href="#main">Skip to content</a>
<header class="masthead" data-masthead>
  <div class="masthead__inner">
    <a class="brand" href="${url("")}" aria-label="${site.name}, home">
      <span class="brand__mark" aria-hidden="true">${raw(icon("mark"))}</span>
      <span class="brand__name">${site.name}</span>
    </a>
    <nav class="nav" aria-label="Main">
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-list" data-nav-toggle>
        <span class="nav__toggle-label">Menu</span>
        <span class="nav__toggle-icon" aria-hidden="true"></span>
      </button>
      <ul class="nav__list" id="nav-list">
        ${nav.map((n) => html`<li><a href="${url(n.href)}"${current(n.href)}>${n.label}</a></li>`)}
        <li class="nav__cv"><a class="btn btn--small" href="${url(site.cv)}" download>${raw(icon("download"))}<span>CV</span></a></li>
      </ul>
    </nav>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark theme">
      <span class="theme-toggle__icon" aria-hidden="true"></span>
    </button>
  </div>
</header>
<main id="main" tabindex="-1">
${p.body}
</main>
<footer class="colophon">
  <div class="colophon__inner">
    <div class="colophon__cta">
      <p class="eyebrow">Contact</p>
      <p class="colophon__line">Have something worth building?<br><a href="mailto:${site.email}">${site.email}</a></p>
    </div>
    <ul class="colophon__links">
      <li><a href="${site.linkedin}" rel="me noopener">LinkedIn ${raw(icon("arrow-ne"))}</a></li>
      <li><a href="${site.github}" rel="me noopener">GitHub ${raw(icon("arrow-ne"))}</a></li>
      <li><a href="${url(site.cv)}" download>CV (PDF)</a></li>
      <li><a href="${url("feed.xml")}">RSS</a></li>
    </ul>
    <div class="colophon__meta">
      <p>Dublin, Ireland · Hand-built static site · No trackers · <a href="https://github.com/MarcoLadeira/MarcoLadeiraWebsite" rel="noopener">Source</a></p>
      <p>Updated <time datetime="${site.updated}">November 2026</time></p>
    </div>
  </div>
</footer>
</body>
</html>`}`;
}
