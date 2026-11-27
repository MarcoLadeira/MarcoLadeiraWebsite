import { html, raw } from "../lib/html.mjs";
import { url } from "../data/site.mjs";
import { icon } from "./icons.mjs";

// The homepage signature: a circuit-style schematic that wires each piece of
// work to the capabilities it proves. The SVG is decorative (aria-hidden); the
// same information is carried by the HTML list of stations below it, which is
// what keyboard and screen-reader users interact with.

export const capabilities = [
  { id: "ai", label: "AI systems" },
  { id: "ent", label: "Enterprise SaaS" },
  { id: "fs", label: "Full-stack" },
  { id: "algo", label: "Algorithms" },
  { id: "product", label: "Product" },
  { id: "lead", label: "Leadership" },
];

export const stations = [
  {
    id: "fenergo",
    href: "work/fenergo/",
    kind: "At work",
    name: "Fenergo",
    proof: "Enterprise AI with a person in control",
    caps: ["ai", "ent", "fs"],
  },
  {
    id: "vesta",
    href: "work/vesta/",
    kind: "Own product",
    name: "Vesta",
    proof: "Every model call costed, receipted, stoppable",
    caps: ["ai", "fs", "product"],
  },
  {
    id: "oddlings",
    href: "work/oddlings/",
    kind: "Own product",
    name: "ONE Oddlings",
    proof: "20,000 generated boards, every one verified",
    caps: ["fs", "algo", "product"],
  },
  {
    id: "savetheplanet",
    href: "work/savetheplanet/",
    kind: "Team lead",
    name: "SaveThePlanet",
    proof: "Every number labelled real or simulated",
    caps: ["ai", "algo", "lead"],
  },
];

const W = 1200;
const H = 300;
const CAP_Y = 44;
const BUS_Y = 292;
const capX = (i) => 100 + i * 200;
const stationX = (i) => 150 + i * 300;
const R = 10; // corner radius

function trace(sx, cx, lane, dx) {
  // Up from the station, across on its lane, up into the capability pin.
  const x0 = sx + dx;
  const x1 = cx + dx;
  if (Math.abs(x1 - x0) < 1) return `M${x0} ${BUS_Y} V${CAP_Y + 16}`;
  const dir = x1 > x0 ? 1 : -1;
  return [
    `M${x0} ${BUS_Y}`,
    `V${lane + R}`,
    `Q${x0} ${lane} ${x0 + dir * R} ${lane}`,
    `H${x1 - dir * R}`,
    `Q${x1} ${lane} ${x1} ${lane - R}`,
    `V${CAP_Y + 16}`,
  ].join(" ");
}

export function schematic() {
  const lanes = [236, 206, 176, 146];
  const offsets = [-9, -3, 3, 9];
  const paths = [];
  stations.forEach((s, si) => {
    s.caps.forEach((c) => {
      const ci = capabilities.findIndex((k) => k.id === c);
      paths.push({ station: s.id, cap: c, d: trace(stationX(si), capX(ci), lanes[si], offsets[si]) });
    });
  });

  const svg = `<svg class="schematic__svg" viewBox="0 0 ${W} ${H + 8}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
  <g class="schematic__caps">
    ${capabilities
      .map(
        (c, i) => `<g class="cap" data-cap="${c.id}" transform="translate(${capX(i)} ${CAP_Y})">
      <rect class="cap__pad" x="-86" y="-22" width="172" height="38" rx="2"/>
      <text class="cap__label" text-anchor="middle" y="2">${c.label}</text>
      <line class="cap__pin" x1="-12" x2="12" y1="16" y2="16"/>
    </g>`
      )
      .join("")}
  </g>
  <g class="schematic__traces">
    ${paths.map((t) => `<path class="trace" data-station="${t.station}" data-cap="${t.cap}" d="${t.d}" pathLength="1000"/>`).join("")}
  </g>
  <g class="schematic__signals">
    ${paths
      .map(
        (t, i) =>
          `<path class="signal" data-station="${t.station}" data-cap="${t.cap}" d="${t.d}" pathLength="1000" style="--i:${i}"/>`
      )
      .join("")}
  </g>
  <g class="schematic__nodes">
    ${stations.map((s, i) => `<circle class="node" data-station="${s.id}" cx="${stationX(i)}" cy="${BUS_Y}" r="5"/>`).join("")}
  </g>
</svg>`;

  return html`<div class="schematic" data-schematic>
  <div class="schematic__drawing">${raw(svg)}</div>
  <ol class="stations" aria-label="Selected work, and what each proves">
    ${stations.map(
      (s, i) => html`<li class="station" data-station="${s.id}">
      <a href="${url(s.href)}" class="station__link">
        <span class="station__index" aria-hidden="true">0${i + 1}</span>
        <span class="station__kind">${s.kind}</span>
        <span class="station__name">${s.name}</span>
        <span class="station__proof">${s.proof}</span>
        <span class="station__caps"><span class="visually-hidden">Shows: </span>${s.caps
          .map((c) => capabilities.find((k) => k.id === c).label)
          .join(" · ")}</span>
        <span class="station__go" aria-hidden="true">${raw(icon("arrow-right"))}</span>
      </a>
    </li>`
    )}
  </ol>
</div>`;
}
