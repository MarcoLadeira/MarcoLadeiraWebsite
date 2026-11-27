import { html, raw } from "../lib/html.mjs";
import { layout } from "../lib/layout.mjs";
import { site, url, absUrl } from "../data/site.mjs";
import { icon } from "../components/icons.mjs";

/** A lightweight redirect page that preserves an old URL. */
export function redirect(from, to, label) {
  const target = url(to);
  return `<!doctype html>
<html lang="${site.lang}"><head><meta charset="utf-8">
<title>Moved — ${site.name}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${absUrl(to)}">
<meta http-equiv="refresh" content="0; url=${target}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font:16px/1.5 system-ui,sans-serif;margin:4rem auto;max-width:32rem;padding:0 1.5rem;color:#15140f;background:#f2efe7}a{color:inherit}</style>
</head><body><p>This page has moved to <a href="${target}">${label}</a>.</p>
<script>location.replace(${JSON.stringify(target.split("#")[0])} + (location.hash || ${JSON.stringify(target.includes("#") ? "#" + target.split("#")[1] : "")}))</script></body></html>`;
}

export function notFound() {
  const body = html`<section class="page-head notfound">
  <div class="wrap">
    <p class="eyebrow">404 · Not found</p>
    <h1 class="page-head__title"><span class="line"><span>That page isn't</span></span><span class="line"><span><em>here any more.</em></span></span></h1>
    <p class="page-head__lede">The site was rebuilt in November 2026 and a few addresses changed. These are probably what you were after:</p>
    <ul class="notfound__links">
      <li><a class="link-arrow" href="${url("")}">Home ${raw(icon("arrow-right"))}</a></li>
      <li><a class="link-arrow" href="${url("work/")}">Work & case studies ${raw(icon("arrow-right"))}</a></li>
      <li><a class="link-arrow" href="${url("experience/")}">Experience ${raw(icon("arrow-right"))}</a></li>
      <li><a class="link-arrow" href="${url("contact/")}">Contact ${raw(icon("arrow-right"))}</a></li>
      <li><a class="link-arrow" href="${url(site.cv)}" download>Download CV ${raw(icon("download"))}</a></li>
    </ul>
  </div>
</section>`;
  // 404.html is served from arbitrary depths, so every URL in it must be root-absolute (url() already is).
  return layout({ path: "404.html", title: "Page not found", description: "This page could not be found. Try the work, experience or contact pages instead.", body, noindex: true });
}
