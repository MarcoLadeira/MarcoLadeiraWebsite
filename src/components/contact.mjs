import { html, raw } from "../lib/html.mjs";
import { site, url } from "../data/site.mjs";
import { icon } from "./icons.mjs";

export function contactBlock({ heading, id = "contact", level = 2 } = {}) {
  const H = `h${level}`;
  return html`<section class="closer" id="${id}" aria-labelledby="${id}-title">
  <div class="wrap closer__grid">
    <p class="eyebrow" data-reveal>Contact</p>
    ${raw(`<${H} class="closer__title" id="${id}-title" data-reveal>${heading}</${H}>`)}
    <p class="closer__text" data-reveal>Engineering, AI systems, products — I'm always happy to talk. Email is quickest; I usually reply within two working days.</p>
    <div class="closer__email" data-reveal>
      <a class="closer__address" href="mailto:${site.email}">${site.email}</a>
      <button class="btn btn--ghost copy" type="button" data-copy="${site.email}" hidden>
        <span class="copy__icon" aria-hidden="true">${raw(icon("copy"))}</span>
        <span class="copy__label">Copy address</span>
      </button>
      <span class="visually-hidden" role="status" aria-live="polite" data-copy-status></span>
    </div>
    <ul class="closer__links" data-reveal>
      <li><a class="btn" href="${site.linkedin}" rel="me noopener">LinkedIn ${raw(icon("arrow-ne"))}</a></li>
      <li><a class="btn" href="${site.github}" rel="me noopener">GitHub ${raw(icon("arrow-ne"))}</a></li>
      <li><a class="btn" href="${url(site.cv)}" download>${raw(icon("download"))} CV (PDF)</a></li>
    </ul>
  </div>
</section>`;
}
