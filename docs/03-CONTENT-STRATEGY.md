# 03 — Content Strategy

> How to transform Marco's portfolio from a project showcase into a thought leadership platform for a software engineer in 2026.

---

## Table of Contents

- [Content Philosophy](#content-philosophy)
- [Case Study Template](#case-study-template)
- [Case Study Outlines for Each Project](#case-study-outlines-for-each-project)
- [New Content Types](#new-content-types)
- [Writing Cadence](#writing-cadence)
- [AI-Era Positioning](#ai-era-positioning)
- [Content Freshness System](#content-freshness-system)

---

## Content Philosophy

### The Core Thesis

In 2026, every software engineer has access to the same AI tools. The differentiator is no longer "can you code X?" but "can you think clearly about systems, trade-offs, and human impact?" A portfolio should demonstrate **judgment**, not just output.

### Three Pillars

1. **Systems Thinking** — Show how you reason about architecture, not just what you built
2. **Engineering Craft** — Show the micro-decisions (naming, API design, interaction timing) that separate good from great
3. **Honest Reflection** — Show what you learned, what you'd change, what surprised you

### What This Means in Practice

- Every project page should answer "What did I learn?" not just "What did I build?"
- Every essay should have a clear thesis you could disagree with (not "AI is changing things" but "The best AI workflow is hybrid and here's why")
- Every update should teach something, even if small

---

## Case Study Template

Use this structure for each project detail page (`/work/[slug]/index.html`):

```
HERO
├── Project name
├── One-line tagline (not description — a hook)
├── Date range
├── Role
└── Tech stack pills

CONTEXT
├── What was the business/user need?
├── Why was this project necessary?
└── What existed before? (or: what problem hadn't been solved?)

CONSTRAINTS
├── What made this technically challenging?
├── Team size / timeline / resource limitations
├── Regulatory or compliance requirements (if applicable)
└── Technical constraints (platform limitations, legacy systems, etc.)

APPROACH
├── Architecture decisions and why
│   ├── Diagram: system topology / data flow / event flow
│   └── Key trade-offs considered (what you chose and what you rejected)
├── Key technical decisions
│   ├── Why this database/framework/pattern?
│   └── What alternatives were evaluated?
└── Process decisions
    ├── How did you break the problem down?
    └── How did you validate assumptions?

CRAFT
├── Screenshot(s) or video demo
│   ├── For NDA work: architecture diagrams, anonymized system flows
│   └── For personal projects: real UI captures with annotations
├── Code highlight (optional)
│   └── One interesting snippet that shows how you think, with explanation
└── Detail spotlight
    └── One micro-decision that shows craft (e.g., "why we chose EventStoreDB over Kafka")

OUTCOME
├── What shipped?
├── Measurable impact (performance numbers, team velocity, user metrics)
│   ├── For NDA work: anonymized or approximate ("reduced X by ~40%")
│   └── For personal projects: stars, downloads, feedback, personal growth
└── Team/stakeholder response

REFLECTION
├── What would you do differently?
├── What surprised you?
├── What did this project teach you about engineering?
└── How did this change how you approach future work?

RELATED
├── Link to relevant essay or update
├── Link to GitHub repo (if public)
└── Link to live demo (if available)
```

### HTML Structure

Each case study page follows the same HTML template as existing essay pages — `<article>` with `page-hero`, `article-body`, and auto-generated TOC from H2 headings. This ensures reading time, progress bar, and TOC all work automatically via `script.js`.

---

## Case Study Outlines for Each Project

### 1. Fenergo — `/work/fenergo/index.html`

**Tagline:** "Building enterprise systems where reliability isn't optional."

**Context:**
- Enterprise SaaS for financial institutions — compliance, KYC, onboarding workflows
- Joined as Software Engineer in September 2025
- Backend delivery, platform reliability, event-driven systems

**Constraints:**
- Regulated industry — financial compliance requirements shape every decision
- Existing large codebase with CQRS and event sourcing patterns
- Production systems under real load serving financial institutions
- NDA limitations — can't show UI or proprietary implementations

**Approach (what can be shared):**
- Event-driven architecture with EventStoreDB
- CQRS pattern: separate read/write models for different consistency needs
- DynamoDB for specific data access patterns
- TypeScript for frontend tooling alongside C#/.NET backend
- Selection for Fenergo's first AI initiative — MCP tooling for developer workflows

**Architecture diagram opportunity:**
- Generic CQRS + Event Sourcing flow diagram (command → aggregate → event → projection → read model)
- MCP server architecture diagram (local tools → MCP protocol → IDE integration)
- Event-driven system topology (producers → event store → consumers → projections)

**Outcome:**
- Selected for first AI initiative (signal of trust and technical breadth)
- Contributed to platform reliability for production financial systems
- Deepened understanding of event sourcing at enterprise scale

**Reflection prompts:**
- What's different about building for financial institutions vs startups?
- How does event sourcing change how you think about state?
- What did the AI initiative selection teach you about showing initiative?

---

### 2. NASA Space Explorer — `/work/nasa-space-explorer/index.html`

**Tagline:** "Treating a coding challenge like a product, not a demo."

**Context:**
- Built as a technical challenge solving a real problem: NASA has incredible public APIs but no unified exploration interface
- Goal: one interface for APOD, Mars Rover, EPIC, NEO, and media search

**Constraints:**
- Multiple NASA APIs with different response shapes, rate limits, and data formats
- Had to make dense scientific data approachable without dumbing it down
- Needed to feel like a product, not a homework assignment

**Approach:**
- React + TypeScript frontend with strong type safety for diverse API responses
- Node.js backend for API orchestration, caching, and rate limit management
- Information hierarchy design: progressive disclosure of dense data
- Visual storytelling: letting NASA imagery lead, with data supporting the narrative

**Screenshot/demo opportunities:**
- Live site exists at nasaapi-production.up.railway.app — capture screenshots
- Show the APOD viewer, Mars Rover gallery, NEO visualization
- Architecture diagram: Frontend → Node.js API layer → NASA APIs (with caching layer)

**Outcome:**
- Live, working product accessible on the web
- Demonstrates full-stack thinking: API orchestration, data modeling, visual hierarchy
- Shows product instinct: turned a coding exercise into something you'd actually use

**Reflection:**
- How do you make dense scientific data approachable?
- What API orchestration patterns emerged from dealing with NASA's varied endpoints?
- Why did you choose to treat this as a product rather than a technical demo?

---

### 3. Achievr — `/work/achievr/index.html`

**Tagline:** "An iOS app where UX decisions directly affect human motivation."

**Context:**
- Goal-setting app built around momentum, clarity, and personal interaction
- Explored how small UX decisions impact whether people actually use a productivity tool

**Constraints:**
- Native iOS (Swift + UIKit) — no cross-platform shortcuts
- Local persistence with SQLite/GRDB — had to be reliable offline
- Designing for motivation is inherently subjective — had to test assumptions against real usage

**Approach:**
- Swift with UIKit for precise control over interactions
- SQLite with GRDB for local persistence — chose reliability over cloud sync
- Flexible goal types: not just "done/not done" but progress tracking, streaks, flexible targets
- Focused on "feel" — how does tapping "complete" feel? How does progress visualization affect motivation?

**Screenshot/demo opportunities:**
- iOS app screenshots from Xcode simulator or real device
- Goal creation flow, progress tracking view, streak visualization
- Side-by-side of early vs final UI (if available) showing iteration

**Outcome:**
- Working iOS app demonstrating native development capability
- Refined understanding of how UX micro-decisions affect user behavior
- Source code available on GitHub

**Reflection:**
- What did you learn about designing for human motivation?
- How did building natively in Swift change your approach vs web development?
- What would you prioritize differently if building a v2?

---

### 4. Explorer VR — `/work/explorer/index.html`

**Tagline:** "Making graphics, networking, UX, and world design work as one system."

**Context:**
- VR adventure game focused on presence, interactive environments, and systems thinking
- Explored historical environments with spatial interaction and gameplay systems

**Constraints:**
- Unity + C# — real-time 3D rendering with VR performance requirements (90fps minimum)
- Oculus SDK integration — hardware-specific interaction patterns
- Multiplayer with Photon — networking adds complexity to every game system
- VR UX is fundamentally different from 2D — spatial, embodied, motion-sensitive

**Approach:**
- Unity game engine with C# scripting
- Oculus SDK for VR-specific input and rendering
- Photon for multiplayer networking concepts
- Historical environments requiring research + artistic interpretation
- Systems design: every feature (graphics, networking, UX, world design) had to work together

**Visual opportunities:**
- In-game screenshots or video captures
- System architecture diagram (game loop → rendering → networking → input → world state)
- Before/after of environment design iterations

**Outcome:**
- Working VR experience demonstrating cross-disciplinary engineering
- Forced integration thinking: graphics + networking + UX + world design as one system
- Legacy project but still representative of ambitious, systems-level work

**Reflection:**
- What does building for VR teach you about performance that web doesn't?
- How does multiplayer change every system design decision?
- Why is this project still relevant to your engineering identity?

---

## New Content Types

### 1. TIL (Today I Learned) — `/til/` or inline in `/updates/`

**Format:** 100-300 word micro-posts. One specific thing learned, with code or context.

**Examples:**
- "TIL: EventStoreDB subscriptions can use catch-up mode for rebuilding read models"
- "TIL: CSS `clamp()` works for padding too, not just font sizes"
- "TIL: MCP tool definitions need precise JSON Schema — no `additionalProperties` by default"

**Cadence:** 2-4 per month. Low friction, high frequency.

**Implementation:** Same HTML template as updates. Add to `/updates/` with a "TIL" kicker instead of "Update".

---

### 2. Uses Page — `/uses/index.html`

**What it is:** A detailed list of tools, hardware, software, and setup. Popularized by Wes Bos (uses.tech), now standard on elite portfolios.

**Sections:**
```
Hardware
├── Laptop / desktop specs
├── Monitor(s)
├── Keyboard + mouse
├── Headphones
└── Desk / chair / setup photos (optional)

Development
├── Editor: VS Code (+ key extensions)
├── Terminal: Windows Terminal / PowerShell
├── Version control: Git + GitHub
├── AI tools: Copilot, Claude, MCP servers
├── Languages: C#, TypeScript, Swift, JavaScript, Python
└── Key frameworks: .NET, React, UIKit

Software
├── Browser: [primary]
├── Design: Figma (if applicable)
├── Notes: [tool]
├── Music: Spotify (or equivalent)
└── Communication tools

This Website
├── Stack: HTML, CSS, JavaScript (zero dependencies)
├── Hosting: GitHub Pages
├── Fonts: Inter + Inter Tight (Google Fonts)
├── Design: Custom, hand-built
└── Features: Terminal (55+ commands), command palette, AI chat, easter eggs
```

---

### 3. Reading Log — Expand `/now/` or create `/reading/`

**Current state:** Now page has "On the shelf" with 2 books listed.

**Improvement:** Expand to a proper reading log with short reactions.

**Format per entry:**
```
Book Title — Author
Status: Reading / Finished / Abandoned
One-paragraph reaction or key takeaway
Date finished (if applicable)
```

---

### 4. Colophon — Footer section or `/colophon/`

**What it is:** How the site was built, what tools were used, design decisions.

**Why it matters:** For a zero-dependency, hand-built site, the colophon IS a portfolio piece. Most developers reach for Next.js or Astro — building from scratch in 2026 with this level of quality is a statement.

**Content:**
- Built with vanilla HTML, CSS, and JavaScript — zero npm dependencies
- Hosted on GitHub Pages
- Typography: Inter + Inter Tight via Google Fonts
- Design system: CSS custom properties, clamp() fluid type, single breakpoint at 720px
- Interactive: Terminal (55+ commands), command palette (Ctrl+K), AI chat assistant
- Total shipping weight: ~300KB uncompressed (target: ~150KB after optimization)
- Accessibility: WCAG 2.2 AA target, skip links, ARIA, keyboard-first
- Source: github.com/MarcoLadeira/MarcoLadeira.github.io

---

### 5. Changelog — `/changelog/` or section in footer

**What it is:** A visible log of site changes, like a product changelog.

**Format:**
```
March 30, 2026 — Portfolio v2 refresh (visual noise removed, animations simplified)
March 18, 2026 — Published "The best AI workflow is hybrid"
March 14, 2026 — Published AWS ML Specialty update
January 12, 2026 — Published Fenergo AI Initiative update
...
```

**Alternative:** The existing `/updates/` section partially serves this purpose. Consider adding a "Site" tag to distinguish site updates from career updates.

---

## Writing Cadence

### Minimum Viable Cadence

| Content Type | Frequency | Effort Level |
|-------------|-----------|-------------|
| TIL / micro-post | 2× per month | Low (15-30 min) |
| Update | 1× per month | Medium (1-2 hours) |
| Essay | 1× per quarter | High (4-8 hours) |
| Now page refresh | 1× per month | Low (15 min) |
| Case study (one-time) | 4 total, then done | High (3-5 hours each) |

### Annual Content Target

- **24 TILs** (2/month)
- **12 Updates** (1/month)
- **4 Essays** (1/quarter)
- **4 Case studies** (one-time project)
- **12 Now page refreshes** (monthly)

This produces ~56 pieces of content per year — enough to signal active engagement without becoming a full-time job.

---

## AI-Era Positioning

### The 2026 Software Engineer's Dilemma

Every engineer now has access to AI coding agents, but most use them as autocomplete. The differentiator is engineers who understand:
- When to use AI and when to think manually
- How to architect systems that AI tools can work within
- How to evaluate AI-generated code for correctness, security, and maintainability
- How to build AI-powered tools (not just consume them)

### How Marco Is Already Positioned

Marco has strong AI-era credibility:
- ✅ Essay on hybrid AI workflows (CLI + MCP + Agents)
- ✅ Essay on systems judgment in the age of AI
- ✅ AWS ML Specialty certification
- ✅ Selected for Fenergo's first AI initiative
- ✅ MCP tooling experience (building tools, not just using them)

### Content Opportunities to Strengthen This Position

1. **"How I actually use AI at work"** — concrete daily workflow, not theory. What tools, what prompts, what fails, what succeeds.
2. **"Building MCP servers for enterprise"** — technical deep-dive on the Fenergo AI initiative work (what can be shared publicly)
3. **"AI code review: what I check that the agent missed"** — show the human verification layer
4. **"Event sourcing patterns that AI tools get wrong"** — domain-specific expertise that LLMs can't replicate from training data
5. **"My AI tool stack in 2026"** — what changed from 2025, what stuck, what was hype

### Positioning Statement (for About page or beliefs page)

Draft: *"I believe the best software engineers in the AI era aren't the ones who prompt the fastest — they're the ones who know what to build, why it matters, and how to verify it works. AI is a tool in my workflow, not a replacement for judgment."*

---

## Content Freshness System

### The Problem

The Now page says "Last updated July 2025" — 9 months stale. The resume is marked "(outdated)". These are trust destroyers. A visitor doesn't know if the rest of the site is current either.

### The Fix: Freshness Checklist (Monthly)

Run this checklist on the 1st of each month:

```
□ Now page — update current focus, active projects, reading list
□ Now page — update "Last updated [Month Year]" timestamp
□ Resume — verify it reflects current role and skills
□ Sitemap — update lastmod dates for changed pages
□ Homepage — verify featured work and writing are still the best selections
□ Contact page — verify all links work (email, LinkedIn, GitHub, resume)
□ Terminal KB — any new projects or info that should be in terminal responses?
□ Chat KB — any new topics that should be in the AI assistant?
```

### Automating Freshness Signals

- Add `<meta name="last-modified" content="2026-04-01">` to pages and update on edit
- Consider a build script that auto-updates sitemap lastmod based on file modification dates
- The `new-post.js` script could be extended to bump the sitemap when creating new content

### Visual Freshness Indicators

- Show "Last updated [date]" on every page footer (not just Now page)
- On the Now page, show a "days since last update" counter — public accountability
- Consider a "Recently updated" badge on pages changed in the last 30 days
