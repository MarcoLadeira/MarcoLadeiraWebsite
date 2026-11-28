import { html, raw } from "../lib/html.mjs";
import { url } from "../data/site.mjs";
import { readFileSync } from "node:fs";

const media = JSON.parse(readFileSync(new URL("../data/media.json", import.meta.url), "utf8"));

/**
 * Responsive <img> for a prepared screenshot.
 * @param {string} key  e.g. "vesta/chat"
 * @param {object} o
 * @param {string} o.alt
 * @param {string} [o.sizes]
 * @param {boolean} [o.eager]
 * @param {string} [o.className]
 */
export function img(key, { alt, sizes = "(min-width: 1100px) 60vw, 100vw", eager = false, className = "" } = {}) {
  const m = media[key];
  if (!m) throw new Error(`Unknown media key: ${key}`);
  const largest = m.variants[m.variants.length - 1];
  const srcset = m.variants.map((v) => `${url(v.src)} ${v.w}w`).join(", ");
  return html`<img class="${className}" src="${url(largest.src)}" srcset="${srcset}" sizes="${sizes}" width="${largest.w}" height="${largest.h}" alt="${alt}" ${raw(eager ? 'fetchpriority="high"' : 'loading="lazy"')} decoding="async">`;
}

export function figure(key, { caption, alt, sizes, frame = "browser", className = "" }) {
  return html`<figure class="shot shot--${frame} ${className}">
  <div class="shot__frame">${img(key, { alt: alt || caption, sizes })}</div>
  ${caption ? html`<figcaption>${caption}</figcaption>` : ""}
</figure>`;
}

export function video(v, { label }) {
  return html`<figure class="shot shot--video">
  <div class="shot__frame">
    <video class="clip" src="${url(v.src)}" poster="${url(v.poster)}" width="${v.w}" height="${v.h}" muted playsinline loop preload="none" controls aria-label="${label}" data-autoplay-when-visible></video>
  </div>
  <figcaption>${v.caption}</figcaption>
</figure>`;
}

export const mediaInfo = (key) => media[key];
