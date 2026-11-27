import { html, raw } from "../lib/html.mjs";
import { img } from "./media.mjs";
import { icon } from "./icons.mjs";

export function statusPill(p) {
  return html`<span class="status status--${p.statusTone}"><span class="status__dot" aria-hidden="true"></span>${p.status}</span>`;
}

/** Each flagship gets its own visual treatment within the shared system. */
export function featureVisual(p, { eager = false } = {}) {
  const sizes = "(min-width: 1100px) 56vw, 100vw";
  switch (p.slug) {
    case "fenergo":
      return html`<div class="plate plate--ledger" role="img" aria-label="What this case study covers publicly, and what stays confidential">
  <div class="plate__col">
    <p class="plate__head">Public</p>
    <ul>
      <li>Role, team size and scope</li>
      <li>Domain: KYC / AML client lifecycle</li>
      <li>Stack and engineering practices</li>
      <li>Principles for AI in a regulated product</li>
    </ul>
  </div>
  <div class="plate__col plate__col--private">
    <p class="plate__head">${raw(icon("lock"))} Stays private</p>
    <ul>
      <li><span class="bar" style="--w:78%"></span></li>
      <li><span class="bar" style="--w:62%"></span></li>
      <li><span class="bar" style="--w:86%"></span></li>
      <li><span class="bar" style="--w:54%"></span></li>
    </ul>
    <p class="plate__note">Architecture, metrics, screens and clients.</p>
  </div>
</div>`;
    case "vesta":
      return html`<div class="plate plate--vesta">
  <div class="plate__window">${img("vesta/chat-dark", { alt: "Vesta's chat view after a finished run, showing passed checks and a code diff", sizes, eager })}</div>
  <div class="plate__float">${img("vesta/usage", { alt: "Vesta's usage settings with today's spend, monthly spend and savings", sizes: "(min-width: 1100px) 30vw, 60vw" })}</div>
</div>`;
    case "oddlings":
      return html`<div class="plate plate--oddlings">
  <div class="plate__window">${img("oddlings/run", { alt: "A ONE Oddlings run: a 3×3 board of cartoon shapes, a timer and the goal card 'Row buddies'", sizes, eager })}</div>
  <div class="plate__phone">${img("oddlings/run-phone", { alt: "The same run on a phone", sizes: "(min-width: 1100px) 12vw, 30vw" })}</div>
</div>`;
    case "savetheplanet":
      return html`<div class="plate plate--stp">
  <div class="plate__window">${img("savetheplanet/dashboard", { alt: "SaveThePlanet dashboard: renewable energy at risk, why, and how much flexible EV charging could use", sizes, eager })}</div>
</div>`;
    default:
      return "";
  }
}
