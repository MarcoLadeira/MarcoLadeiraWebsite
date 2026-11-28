import { html, raw } from "../lib/html.mjs";
import { img } from "./media.mjs";
import { icon } from "./icons.mjs";

export function statusPill(p) {
  return html`<span class="status status--${p.statusTone}"><span class="status__dot" aria-hidden="true"></span>${p.status}</span>`;
}

/** Each flagship gets its own visual treatment within the shared system. */
export function featureVisual(p, { eager = false, wide = false } = {}) {
  // Rendered widths: the plate is ~56vw beside text on the home/work pages, or
  // full-bleed (max 86rem) in a case-study header; windows sit inside it.
  const col = wide ? "min(92vw, 80rem)" : "(min-width: 961px) 52vw, 92vw";
  const within = (f) => (wide ? `calc(min(92vw, 80rem) * ${f})` : `(min-width: 961px) calc(52vw * ${f}), calc(92vw * ${f})`);
  switch (p.slug) {
    case "fenergo":
      return html`<figure class="plate plate--ledger" aria-label="What this case study covers publicly, and what stays confidential">
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
    <ul aria-hidden="true">
      <li><span class="bar" style="--w:78%"></span></li>
      <li><span class="bar" style="--w:62%"></span></li>
      <li><span class="bar" style="--w:86%"></span></li>
      <li><span class="bar" style="--w:54%"></span></li>
    </ul>
    <p class="plate__note">Architecture, metrics, screens and clients.</p>
  </div>
</figure>`;
    case "vesta":
      return html`<div class="plate plate--vesta">
  <div class="plate__window">${img("vesta/chat-dark", { alt: "Vesta's chat view after a finished run, showing passed checks and changed files", sizes: within(0.72), eager })}</div>
  <div class="plate__float">${img("vesta/usage", { alt: "Vesta's usage settings with today's spend, monthly spend and savings", sizes: within(0.52) })}</div>
</div>`;
    case "oddlings":
      return html`<div class="plate plate--oddlings">
  <div class="plate__window">${img("oddlings/run", { alt: "A ONE Oddlings run: a 3×3 board of cartoon shapes, a timer and the goal card 'Row buddies'", sizes: within(0.82), eager })}</div>
  <div class="plate__phone">${img("oddlings/run-phone", { alt: "The same run on a phone", sizes: within(0.22) })}</div>
</div>`;
    case "savetheplanet":
      return html`<div class="plate plate--stp">
  <div class="plate__window">${img("savetheplanet/dashboard", { alt: "SaveThePlanet dashboard: renewable energy at risk, why, and how much flexible EV charging could use", sizes: col, eager })}</div>
</div>`;
    default:
      return "";
  }
}
