import { html, raw } from "../lib/html.mjs";
import { url } from "../data/site.mjs";

// Capabilities are claims; each row links to the evidence.
export const capabilityData = [
  ["Enterprise software", "C# and .NET services, event-driven backends (CQRS, EventStoreDB, DynamoDB), regulated KYC/AML SaaS.", [["Fenergo", "work/fenergo/"]]],
  ["AI engineering", "LLM integrations and workflows with human oversight; model routing, cost control and cancellation for coding agents.", [["Fenergo", "work/fenergo/"], ["Vesta", "work/vesta/"]]],
  ["Full-stack development", "TypeScript, React and Vite front ends; Python and Node back ends; desktop apps with PySide6.", [["Oddlings", "work/oddlings/"], ["Vesta", "work/vesta/"], ["NASA Explorer", "work/#earlier"]]],
  ["Software architecture", "Clear boundaries, one source of truth, deterministic fallbacks, versioned data that never changes what it replays.", [["Vesta", "work/vesta/#architecture"], ["Lab", "lab/"]]],
  ["Product engineering", "Taking ideas from blank page to shipped: rules, flows, copy, motion and the details that make people stay.", [["Oddlings", "work/oddlings/"], ["Vesta", "work/vesta/"]]],
  ["Engineering quality", "Tests at several layers, generated-content verification, visual regression, accessibility and reduced motion.", [["Oddlings", "work/oddlings/#testing"], ["Vesta", "work/vesta/#testing"]]],
  ["Communication & leadership", "Led a four-person hackathon team as product owner and tech lead; writes decision logs and evidence ledgers.", [["SaveThePlanet", "work/savetheplanet/"], ["Writing", "writing/"]]],
];

export function capabilityRows() {
  return html`<ul class="caps">
  ${capabilityData.map(
    ([title, text, links], i) => html`<li class="caps__row" data-reveal>
    <span class="caps__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
    <h3 class="caps__title">${title}</h3>
    <p class="caps__text">${text}</p>
    <p class="caps__proof"><span class="visually-hidden">Evidence: </span>${links.map(([l, h], j) => html`${j ? ", " : ""}<a href="${url(h)}">${l}</a>`)}</p>
  </li>`
  )}
</ul>`;
}
