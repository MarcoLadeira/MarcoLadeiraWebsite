import { html } from "../lib/html.mjs";
import { img } from "./media.mjs";

export function statusPill(p) {
  return html`<span class="status">${p.status}</span>`;
}

export function featureVisual(p, { eager = false, wide = false } = {}) {
  const sizes = wide ? "(min-width: 1380px) 1280px, 92vw" : "(min-width: 960px) 56vw, 92vw";
  if (p.slug === "fenergo") {
    return html`<div class="plate plate--career">
      <p>Fenergo</p>
      <ul><li>Client lifecycle management</li><li>Event-driven back-end development</li><li>Full-stack development and AI</li></ul>
    </div>`;
  }
  const alt = {
    vesta: "Vesta workspace showing a completed change, checks and spend with sample data.",
    oddlings: "The current ONE Oddlings menu with the character cast and Daily play option.",
    savetheplanet: "SaveThePlanet dashboard showing a simulated curtailment and flexible EV charging scenario.",
  };
  return html`<div class="plate product-plate product-plate--${p.accent}">
    ${img(p.hero, { alt: alt[p.slug], sizes, eager })}
  </div>`;
}
