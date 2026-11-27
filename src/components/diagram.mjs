import { html, md } from "../lib/html.mjs";

// Layered architecture diagram built from real HTML lists, so it is readable by
// screen readers, reflows on mobile and needs no image. CSS draws the wiring.
export function architectureDiagram(arch, name) {
  return html`<figure class="arch" data-reveal>
  <ol class="arch__layers" aria-label="${name} architecture, top to bottom">
    ${arch.layers.map(
      ([label, parts], i) => html`<li class="arch__layer" style="--i:${i}">
      <p class="arch__label"><span aria-hidden="true">${String.fromCharCode(65 + i)}</span>${label}</p>
      <ul class="arch__parts">${parts.map((x) => html`<li>${md(x)}</li>`)}</ul>
    </li>`
    )}
  </ol>
  <figcaption>${arch.caption}</figcaption>
</figure>`;
}
