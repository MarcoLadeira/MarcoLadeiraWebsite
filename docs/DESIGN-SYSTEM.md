# Design system

The site's idea is **"Software that shows its working."** Every piece of work on it proves a claim — a verifier, an evidence ledger, a cost receipt, a human in the loop — so the visual language borrows from engineering drawings and editorial print: ink on paper, hairline rules, figure captions, one signal colour for the thing that matters.

## Creative directions considered

| Direction | Idea | Why not / why |
|---|---|---|
| A. Living network | Animated graph of disciplines with floating nodes | Reads as a generic AI-portfolio trope (particles, glow); hard to make accessible; says nothing specific. Rejected. |
| B. Execution trace | Hero as a terminal-style run log of a request through an AI system | Strong engineering signal but drifts into "fake code screenshot"; risks implying internal Fenergo detail. Rejected. |
| C. **Schematic + editorial** | A circuit-style schematic wiring the four real projects to the capabilities they evidence, set in a high-contrast editorial layout | Specific to Marco (real projects, real proofs), works as static SVG without JS, collapses to a readable list on mobile, and the "show your working" idea runs through every page. **Chosen.** |

## Tokens (`assets/css/site.css`, `:root`)

**Colour** — light / dark

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#f2efe7` | `#11100d` | Page background |
| `--paper-2` | `#e9e5da` | `#1a1915` | Raised surfaces, hovers, table heads |
| `--ink` | `#15140f` | `#eeeae0` | Primary text, rules that matter |
| `--ink-2` | `#45423a` | `#c0baad` | Secondary text |
| `--ink-3` | `#625e55` | `#9a9487` | Metadata, captions (≥ 4.5:1 on paper) |
| `--signal` / `--signal-ink` | `#c23c17` / `#a8320f` | `#ff6b3d` / `#ff8a63` | The one accent: numbering, italic emphasis, focus rings, live signals |
| `--rule`, `--rule-strong` | ink at 14% / 30% | paper at 13% / 28% | Hairlines |

No gradients on UI chrome, no glows, no glass. Per-project "plates" are the only place other colours appear, and they come from each product's own identity (Vesta's near-black UI, Oddlings' warm yellow, SaveThePlanet's deep green, Fenergo as plain ink on paper because it is confidential).

**Type** — self-hosted, Latin subset, `font-display: swap`, metric-matched fallbacks.

- *Newsreader* (variable, optical size pinned at 48, weight 300–600): display and headings. Italic is used for one emphasised phrase per heading, in the signal colour.
- *IBM Plex Sans* 400/500/600: body and UI.
- *IBM Plex Mono* 400/500: eyebrows, metadata, numbering, figures — the "annotation" voice.
- Fluid scale `--step--1` … `--step-5` (`clamp()`), body 16–17 px / 1.6.

**Space & grid** — 12-column grid, `--max: 86rem`, fluid gutters `clamp(1.25rem … 3.5rem)`, section rhythm `--section: clamp(4.5rem … 10rem)`. Below 960 px every grid collapses to one track.

**Geometry** — radius 3 px (controls) and 8 px (media); pills only for buttons and status. Rules, not cards: content is separated by hairlines rather than boxed.

**Motion** — `--ease-out: cubic-bezier(.16,1,.3,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`; durations 160 / 320 / 700 / 1100 ms.

- Headlines settle 0.18 em into place and the italic accent warms from ink to signal; they are never hidden, so LCP isn't delayed.
- Below-the-fold blocks fade/rise once on entry, staggered 70 ms within a batch.
- Homepage schematic: traces draw in (1.6 s), then a signal pulse travels each trace; hovering or focusing a station isolates its traces. Pauses off-screen and in background tabs.
- Capacity Lab: flow dashes move faster on busier edges; failed paths pause.
- Cross-document view transitions where supported.
- `prefers-reduced-motion: reduce` removes all movement and the pulses; nothing depends on animation to be read.

**Components** — masthead, buttons (`.btn`, `--primary`, `--small`, `--ghost`), `.link-arrow`, `.eyebrow`, status pill, tags, stations, facts band, feature block, plates, proof stats, capabilities table, trail (timeline), posts list, closer (contact), case-study header/facts/TOC, callout, gallery shots, code figure, decisions table, layered architecture diagram, Lab form controls and switches.

**Images** — real screenshots only, converted to WebP at 640/1080/1600 px with `srcset`/`sizes`, explicit width/height, lazy below the fold. Video: muted, `preload="none"`, poster, plays only while visible and never with reduced motion.
