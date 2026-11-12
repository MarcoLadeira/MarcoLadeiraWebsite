# 04 - Design and UX Improvements

> Detailed design and interaction plan to move the site from "well-crafted" to "top-tier memorable" while preserving your current visual identity.

---

## Table of Contents

- [Design Direction for 2026](#design-direction-for-2026)
- [Page-by-Page Upgrade Plan](#page-by-page-upgrade-plan)
- [New Pages to Add](#new-pages-to-add)
- [Interaction and Motion Upgrades](#interaction-and-motion-upgrades)
- [Mobile UX Repairs](#mobile-ux-repairs)
- [Visual Proof of Work Strategy](#visual-proof-of-work-strategy)
- [Component Specs](#component-specs)
- [Implementation Tasks by File](#implementation-tasks-by-file)
- [Acceptance Criteria](#acceptance-criteria)

---

## Design Direction for 2026

### Keep

- Warm light theme + deep dark theme (core brand identity)
- Inter + Inter Tight typography
- Restraint-first aesthetic (you are not trying to look like a design agency)
- Keyboard-first interactions (terminal, palette, shortcuts)

### Upgrade

1. Replace abstract project placeholders with real product evidence
2. Shift from "portfolio sections" to "narrative journeys"
3. Surface hidden engineering craft as first-class content
4. Improve mobile ergonomics for all overlays and interactive layers
5. Add visual hierarchy depth in case studies (diagram + screenshot + outcome blocks)

### Avoid

- Replacing the site with an over-animated template aesthetic
- Introducing novelty interactions that do not support content
- Adding visual complexity that hurts readability

---

## Page-by-Page Upgrade Plan

## Home (/)

### Current

Strong hero and composition, but featured work cards do not prove outcomes or depth.

### Target

- Keep current hero structure
- Upgrade featured work cards to include:
  - outcome stat line ("selected for first AI initiative", "live product", "native iOS shipped")
  - one visual thumb per project (real screenshot or architecture crop)
  - explicit "Read case study" CTA

### Additions

- "What I am optimizing for in 2026" mini-block (3 bullets)
- "Recent technical notes" strip (latest 3 TIL/update links)

---

## Work (/work/)

### Current

Excellent copy, but visuals are CSS abstractions (`system-frame`, `editorial-grid`, `device-frame`, `terrain-frame`) and there are no deep pages.

### Target

- Keep Work index as overview
- Add four detail pages:
  - `/work/fenergo/`
  - `/work/nasa-space-explorer/`
  - `/work/achievr/`
  - `/work/explorer-vr/`

### Card redesign

Each project row should include:
- proof block (image/diagram)
- one hard signal (metric, selection, impact)
- role clarity
- primary CTA (case study)
- secondary CTA (repo/demo if public)

---

## Writing (/writing/ + article pages)

### Current

Writing quality is high. Volume and interaction depth are low.

### Target

- Add tags/chips to every writing item (AI, architecture, workflow, systems)
- Add "Read next" at article bottom (2-3 contextual links)
- Add in-article visual blocks for technical writing:
  - architecture diagrams
  - before/after workflow diagrams
  - callout summaries

### Article layout upgrades

- Add a sticky side rail on desktop for:
  - reading progress
  - table of contents
  - share links
- Keep current top progress bar for continuity

---

## About (/about/)

### Current

Good baseline bio with stack pills.

### Target

- Add "Engineering Principles" section (5 principles max)
- Add "How I work with AI agents" section (short, concrete)
- Add timeline strip (career sequence with 1-line milestones)

---

## Now (/now/)

### Current

Stale timestamp and static structure.

### Target

- Monthly update format with explicit date
- Add sections:
  - "Currently shipping"
  - "Currently learning"
  - "Currently rethinking"
- Add "Change log" list inside the page (last 5 updates)

---

## Contact (/contact/)

### Current

Simple and clear. Resume marked outdated.

### Target

- Remove outdated badge once CV is updated
- Add short response expectation text ("Best channel: email, usually reply in X days")
- Add optional booking link only if you can maintain it

---

## 404 (/404.html)

### Current

Playful and in-brand.

### Target

- Keep style
- Add smart links:
  - latest essay
  - latest update
  - top case study

---

## New Pages to Add

## 1) Craft / Experiments page

Path: `/craft/` or `/experiments/`

Purpose: showcase your hidden interaction engineering as portfolio artifacts.

Suggested sections:
- Command palette architecture
- Terminal interaction model
- Reading progress interpolation behavior
- Theme synchronization logic
- Konami/matrix easter egg implementation notes

Each entry should have:
- short context
- gif/video or still
- "why this detail matters"
- implementation notes

## 2) Uses page

Path: `/uses/`

Purpose: show your day-to-day engineering environment in 2026.

Sections:
- hardware
- software
- editor and extensions
- AI stack (Copilot, MCP, agent workflow)
- how this website is built

## 3) Beliefs / Principles page

Path: `/beliefs/` or section inside `/about/`

Purpose: thought leadership and values alignment.

Structure:
- 6-10 concise belief statements
- each with 2-4 sentence rationale

---

## Interaction and Motion Upgrades

## Motion principles

- Keep motion meaningful and short
- Move from generic reveal to context-aware reveal
- Respect reduced motion fully

## Upgrades

1. Stagger tuning
- current: fixed stagger index behavior
- upgrade: per-section rhythm presets (`tight`, `normal`, `slow`)

2. Route transition continuity
- keep View Transitions API
- add fallback class-based fades for non-supporting browsers

3. Project media interactions
- image zoom on click (lightbox) with keyboard support
- side-by-side compare slider for "before/after"

4. Reading comfort
- optional "focus mode" toggle in article pages (narrower width + muted surrounding UI)

---

## Mobile UX Repairs

## Terminal

Current risk: cramped viewport and overlap on small screens.

Fixes:
- convert to bottom sheet on <= 720px
- use 85vh max height with drag handle visual
- lock body scroll while open
- ensure keyboard does not hide input on mobile browsers

## Command palette

Fixes:
- full-width sheet on mobile with top margin
- larger touch targets (min 44px)
- sticky search input

## Navigation

Fixes:
- ensure clear focus state in mobile menu
- improve close affordance and hit area

## Forms/links

Fixes:
- ensure all interactive targets are >= 24x24 minimum, 44x44 preferred

---

## Visual Proof of Work Strategy

## Priority order for project visuals

1. Real screenshots (best)
2. Architecture diagrams (good for NDA-sensitive work)
3. Annotated interface captures
4. Short loop videos (5-15 seconds)

## Per-project visual plan

- Fenergo: anonymized event flow diagrams + architecture cards
- NASA: live UI screenshots + API flow diagram
- Achievr: iOS screen sequence (goal create -> progress -> completion)
- Explorer VR: environment stills + system topology diagram

## Asset standards

- Hero image ratio: 16:9
- Card thumb ratio: 4:3
- WebP primary, JPEG fallback
- max width variants: 640, 960, 1280

---

## Component Specs

## Case study header

- Eyebrow: project type + date
- H1: project title
- Subhead: one-line value statement
- Meta row: role, stack, duration
- CTA row: live/demo/repo links

## Outcome block

A reusable block near top and bottom of case studies:
- KPI 1
- KPI 2
- KPI 3
- short interpretation sentence

## Decision log block

Use in case studies to show engineering judgment:
- Decision
- Alternative considered
- Why chosen
- Trade-off accepted

## Reflection block

- "What I would change in v2"
- "What this project changed in how I build"

---

## Implementation Tasks by File

## Existing files to update

- `work/index.html`
  - convert project cards into deep-link entries
  - replace placeholder visuals with real media thumbnails

- `index.html`
  - update featured work section with case study links and proof lines

- `writing/index.html`
  - add tag chips and better article metadata

- `now/index.html`
  - convert to monthly-log structure

- `contact/index.html`
  - update resume status and contact expectations

- `styles.css`
  - add styles for case study media blocks, outcome blocks, decision logs, mobile terminal sheet mode

- `script.js`
  - add mobile overlay ergonomics, lightbox behavior, optional focus mode toggle

- `interactive.js`
  - terminal responsive behavior improvements for mobile

## New files to add

- `/work/fenergo/index.html`
- `/work/nasa-space-explorer/index.html`
- `/work/achievr/index.html`
- `/work/explorer-vr/index.html`
- `/craft/index.html`
- `/uses/index.html`

---

## Acceptance Criteria

Design and UX phase is complete when:

1. Work page links to four deep case studies
2. Placeholder project visuals are fully removed
3. Every case study includes:
- context
- constraints
- approach
- outcome
- reflection

4. Terminal and command palette are comfortable on mobile
5. Now page is converted into a living monthly-updated format
6. At least one new "craft" or "uses" page is live
7. No regression in readability in light/dark themes
8. Reduced-motion experience remains clean and complete
