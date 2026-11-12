# Portfolio Improvement Documentation

> **Comprehensive plan to elevate marcoladeira.github.io from strong to elite.**
>
> Benchmarked against the best software engineer portfolios of 2026 — Brittany Chiang, Josh Comeau, Lee Robinson, Rauno Freiberg, Cassidy Williams, and Awwwards winners.
>
> Supersedes `IMPROVEMENT-PLAN.md` at project root (many items from that file are already completed).

---

## Documents

| # | Document | Purpose |
|---|----------|---------|
| 01 | [Current Audit](01-CURRENT-AUDIT.md) | Complete inventory of everything the site does today — features, tech stack, design system, SEO, accessibility, performance, content freshness |
| 02 | [Elite Portfolio Analysis](02-ELITE-PORTFOLIO-ANALYSIS.md) | What makes the best portfolios god-tier — patterns, principles, and concrete takeaways organized by category |
| 03 | [Content Strategy](03-CONTENT-STRATEGY.md) | Case study templates, writing cadence, new content types, AI-era positioning for a 2026 software engineer |
| 04 | [Design & UX Improvements](04-DESIGN-AND-UX-IMPROVEMENTS.md) | Visual upgrades, new pages, interaction patterns, mobile fixes, micro-interaction inspiration |
| 05 | [Performance & Technical](05-PERFORMANCE-AND-TECHNICAL.md) | Build pipeline, minification, image optimization, service worker, Core Web Vitals targets, security headers |
| 06 | [Accessibility Deep Dive](06-ACCESSIBILITY-DEEP-DIVE.md) | WCAG 2.2 AA compliance audit with specific remediation steps for every gap |
| 07 | [Implementation Roadmap](07-IMPLEMENTATION-ROADMAP.md) | 6-phase prioritized plan with dependencies, verification criteria, and estimated scope |

---

## Constraints (preserved from original)

- **Static GitHub Pages only** — no server-side processing
- **Zero runtime dependencies** — build/dev scripts are fine, but nothing ships to the browser that isn't hand-written
- **Current design language preserved** — warm beige/dark theme, Inter + Inter Tight typography
- **Personality-first** — the terminal, chat assistant, command palette, and easter eggs stay and get better

## How to Use These Docs

1. **Start with 01** to understand current state
2. **Read 02** to calibrate what "elite" looks like in 2026
3. **Skim 03-06** for the specific areas you want to tackle
4. **Use 07** as your implementation checklist — work phase by phase

## Quick Reference: Top 10 Highest-Impact Changes

1. Create deep-dive case study pages for each project (`/work/fenergo/`, `/work/nasa/`, etc.)
2. Replace CSS placeholder visuals on `/work/` with real screenshots and architecture diagrams
3. Update the Now page (stale since July 2025)
4. Update and un-badge the resume on `/contact/`
5. Add a build step for CSS/JS minification (40-50% file size reduction)
6. Add a `/uses` page (tools, setup, daily stack)
7. Create an image optimization pipeline (WebP, lazy loading, blur-up)
8. Add a service worker for offline reading
9. Add a `/craft` or `/experiments` page showcasing micro-interactions
10. Start a lightweight content cadence (1 update or TIL per month minimum)
