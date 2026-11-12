# 01 — Current Site Audit

> Snapshot of marcoladeira.github.io as of March 2026. Everything the site does, how it's built, and where the gaps are.

---

## Table of Contents

- [Feature Inventory](#feature-inventory)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Content Structure](#content-structure)
- [SEO Status](#seo-status)
- [Performance Baseline](#performance-baseline)
- [Accessibility Status](#accessibility-status)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Content Freshness](#content-freshness)
- [Known Issues](#known-issues)

---

## Feature Inventory

### Pages (12 total)

| Page | Path | Purpose |
|------|------|---------|
| Home | `/` | Hero splash, featured work (3), writing preview, about teaser, contact CTA |
| Work | `/work/` | 4 project cards: Fenergo, NASA Space Explorer, Achievr, Explorer VR |
| Writing | `/writing/` | 2 featured essays + 4 recent updates |
| Updates | `/updates/` | Chronological list of 4 short-form updates |
| About | `/about/` | Bio, philosophy, tech stack pills, role/location facts |
| Now | `/now/` | Current focus areas, active projects, reading list |
| Contact | `/contact/` | Email, LinkedIn, GitHub, resume download |
| 404 | `/404.html` | Playful error page with ASCII terminal simulation |

### Article Sub-Pages (6 total)

| Article | Path | Type | Date |
|---------|------|------|------|
| Hybrid Workflow: CLI + MCP + Agents | `/writing/hybrid-workflow-cli-mcp-agents/` | Essay | Mar 18, 2026 |
| Software Engineering in the Age of AI | `/writing/software-engineering-in-the-age-of-ai/` | Essay | Dec 24, 2025 |
| Portfolio Redesign March 2026 | `/updates/portfolio-redesign-march-2026/` | Update | Mar 30, 2026 |
| AWS ML Specialty & AI Focus | `/updates/aws-ml-specialty-and-current-ai-focus/` | Update | Mar 14, 2026 |
| Fenergo AI Initiative | `/updates/fenergo-ai-initiative/` | Update | Jan 12, 2026 |
| First Months at Fenergo | `/updates/first-months-at-fenergo/` | Update | Oct 31, 2025 |

### Interactive Systems

| System | Trigger | Key Features |
|--------|---------|--------------|
| **Terminal** | Backtick (`) or `>_` button | 55+ commands across 7 categories, tab autocomplete, history, boot sequence animation |
| **Command Palette** | Ctrl+K / Cmd+K | 12 commands, fuzzy filter, keyboard navigation, grouped actions |
| **AI Chat Assistant** | Chat button | 30+ topic keyword-based KB, multi-turn context, follow-up suggestions, HTML responses |
| **Theme Toggle** | `T` key or button | Light/dark with localStorage persistence, system preference detection |
| **Reading Progress** | Scroll on articles | Smooth interpolated progress bar in header with glow effect |
| **Table of Contents** | Auto-generated on articles | H2-based TOC with active heading tracking via IntersectionObserver |
| **Page Transitions** | Link clicks | View Transitions API with fade between local pages |

### Easter Eggs

- **Konami Code** (↑↑↓↓←→←→BA) → overlay message
- **Console Greeting** → styled developer console welcome
- **Matrix Rain** → `matrix` terminal command, full-screen canvas animation (15s or key/click stop)

---

## Tech Stack

### Runtime (ships to browser)
- **HTML5** — semantic, hand-written, one file per page
- **CSS3** — single `styles.css` file (~6000 lines), CSS custom properties, `clamp()` fluid typography
- **JavaScript ES6** — two files: `script.js` (core) + `interactive.js` (optional enhancements)
- **Google Fonts** — Inter (400-800) + Inter Tight (500-800)
- **Zero dependencies** — no npm, no bundler, no framework

### Build / Dev Tools
- `generate-images.js` — image generation utility
- `new-post.js` — content scaffolding script
- `sync-linkedin.js` — automated LinkedIn sync via GitHub Actions
- Playwright audit configs in `/output/playwright/`

### Infrastructure
- **Hosting**: GitHub Pages (static, HTTPS, auto-compression)
- **Repo**: github.com/MarcoLadeira/MarcoLadeira.github.io
- **CI/CD**: GitHub Actions (LinkedIn sync)
- **Domain**: marcoladeira.github.io (no custom domain)

---

## Design System

### Color Tokens

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#f5f0e8` (warm beige) | `#0b0d11` (deep black) |
| `--text` | `#111318` (near-black) | `#f1f3f7` (off-white) |
| `--text-secondary` | `#494e5b` (slate) | adapted via opacity |
| `--accent` | `#1a1a1a` (dark) | `#e4e4e7` (light gray) |
| `--muted` | `#7c8190` | `#8a91a3` |
| `--border` | rgba-based | rgba-based with opacity shift |

### Typography Scale

| Element | Font | Weight | Size | Letter-spacing |
|---------|------|--------|------|----------------|
| Hero title | Inter Tight | 800 | `clamp(3.2rem, 8.5vw, 5.8rem)` | -5% |
| Page heading | Inter Tight | 700 | `clamp(2.5rem, 6vw, 4.8rem)` | -4.5% |
| Section heading | Inter Tight | 700 | 2.4rem | -3.5% |
| Subsection | Inter Tight | 700 | 2rem | — |
| Body | Inter | 400-600 | 16px (1rem) | normal |
| Small/Meta | Inter | 600 | 0.72–0.88rem | varies |

### Spacing & Layout

| Token | Value |
|-------|-------|
| `--max-width` | 1120px |
| `--reading-width` | 720px |
| `--nav-height` | 64px |
| `--radius` | 16px |
| `--radius-sm` | 10px |
| Section padding | `clamp(88px, 11vw, 128px)` vertical |

### Animation Curves

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary exit curve |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `--ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Bouncy effects |
| `--t-fast` | 160ms | Micro-interactions |
| `--t-normal` | 240ms | Standard transitions |
| `--t-slow` | 400ms | Emphasized motion |

### Component Inventory

- **Buttons**: Primary (filled) + Ghost (outline)
- **Text Links**: Inline with arrow + hover translate
- **Cards** (case-study): Hover background tint + shadow, no scale transform
- **Meta Pills**: Border badges with hover background shift
- **Detail Lists**: Bordered items with label/value pairs
- **Entry Rows**: Grid layout (meta | content | links) with padding + border
- **Prose Blocks**: Section-kicker + heading + body pattern
- **Page Hero**: Kicker + H1 + summary paragraph
- **Reading Progress Bar**: Fixed header element with width transition + glow

---

## Content Structure

### Content Types

| Type | Count | Location | Metadata |
|------|-------|----------|----------|
| Essays | 2 | `/writing/[slug]/index.html` | Title, description, date, reading time (auto), OG tags, JSON-LD Article schema |
| Updates | 4 | `/updates/[slug]/index.html` | Title, description, date, reading time (auto), OG tags |
| Projects | 4 | `/work/` (inline, no sub-pages) | Title, date range, description, tech pills, CSS placeholder visual |
| Pages | 8 | Root-level or `/[section]/` | Title, description, canonical, OG tags |

### Project Details

| Project | Type | Period | Stack | Has Deep Dive? | Has Real Visuals? |
|---------|------|--------|-------|----------------|-------------------|
| Fenergo | Enterprise SaaS | 2025–present | C#, .NET, EventStoreDB, DynamoDB, TS | ❌ No | ❌ CSS placeholder (`system-frame`) |
| NASA Space Explorer | Web Platform | 2025 | React, TS, Node.js, REST APIs | ❌ No | ❌ CSS placeholder (`editorial-grid`) |
| Achievr | iOS Mobile App | 2025 | Swift, UIKit, SQLite, GRDB | ❌ No | ❌ CSS placeholder (`device-frame`) |
| Explorer | VR Game | Legacy | Unity, C#, Oculus SDK, Photon | ❌ No | ❌ CSS placeholder (`terrain-frame`) |

**Critical gap: zero projects have individual detail pages or real screenshots/demos.**

---

## SEO Status

### Checklist

| Item | Status | Notes |
|------|--------|-------|
| Meta charset + viewport | ✅ | All pages |
| `<title>` tags | ✅ | Descriptive, unique per page |
| Meta descriptions | ✅ | Unique per page |
| Canonical URLs | ✅ | All pages |
| Open Graph tags | ✅ | og:type, og:title, og:description, og:url, og:image |
| Twitter Card tags | ✅ | summary card on all pages |
| JSON-LD Person schema | ✅ | Homepage |
| JSON-LD Website schema | ✅ | Homepage |
| JSON-LD Article schema | ✅ | Essays |
| `robots.txt` | ✅ | Standard allow-all with sitemap reference |
| `sitemap.xml` | ✅ | 12 pages listed |
| RSS feed (`feed.xml`) | ✅ | 5 items |
| PWA manifest | ✅ | `manifest.json` with basic app info |
| Theme color meta | ✅ | `#1a1a1a` |
| Skip link | ✅ | First element on every page |
| `lang="en"` | ✅ | All pages |
| Breadcrumb schema | ❌ | Missing — would help sub-page SEO |
| Project-specific structured data | ❌ | Missing — no CreativeWork or SoftwareApplication schema for projects |
| Unique OG images per page | ❌ | Same `facecardicon.jpg` reused everywhere |
| `hreflang` tags | ❌ | N/A (single language site) |

### Social Preview Quality

**Problem:** Every page shares the same 192x192 JPEG as OG image. When shared on LinkedIn/Twitter, this appears as a tiny, generic square. Elite portfolios use custom preview images per page with titles baked in.

---

## Performance Baseline

### What Ships (estimated uncompressed sizes)

| File | Approx Size | Notes |
|------|-------------|-------|
| `styles.css` | ~180KB | Unminified, 6000+ lines |
| `script.js` | ~30KB | Unminified, core functionality |
| `interactive.js` | ~80KB | Unminified, terminal + chat + palette + easter eggs |
| HTML per page | ~8-15KB | Inline content, no lazy loading concerns |
| Fonts (Inter family) | ~120KB | Two families, 8 weights total via Google Fonts |
| Images | <50KB total | Minimal — one JPEG icon reused |

### Current Optimizations

- ✅ Zero npm dependencies (nothing to bundle)
- ✅ Passive scroll listeners
- ✅ RAF-throttled scroll handler
- ✅ IntersectionObserver for lazy reveals
- ✅ Lazy terminal/palette initialization (built on first use)
- ✅ Google Fonts preconnect
- ✅ GitHub Pages auto-compression (gzip/brotli)

### Missing Optimizations

- ❌ **No CSS/JS minification** — could save 40-50% wire size
- ❌ **No critical CSS inlining** — render-blocking stylesheet
- ❌ **No font subsetting** — loading full Inter character set for Latin-only content
- ❌ **No image optimization pipeline** — no WebP, no responsive images, no lazy loading
- ❌ **No service worker** — no offline capability, no cache strategy
- ❌ **No code splitting** — `interactive.js` (terminal, chat, palette) loads on every page even if unused
- ❌ **No resource hints beyond preconnect** — missing preload for critical fonts/CSS
- ❌ **No `<link rel="modulepreload">`** — JS files are synchronous `<script>` tags at end of body

### Core Web Vitals Estimates (without measurement)

| Metric | Likely Status | Reasoning |
|--------|---------------|-----------|
| LCP | 🟢 Good (<2.5s) | Light HTML, no hero images, fast text render |
| INP | 🟢 Good (<200ms) | Minimal JS on page load, most interactivity is user-initiated |
| CLS | 🟢 Good (<0.1) | No dynamic content insertion, font-display swap might cause minor shift |

**Note:** Actual Lighthouse and CrUX data should be collected to validate these estimates.

---

## Accessibility Status

### What's Done Well

- ✅ Semantic HTML throughout (`<main>`, `<section>`, `<nav>`, `<footer>`, `<article>`)
- ✅ Skip link on every page
- ✅ ARIA labels on all interactive elements (buttons, dialogs, nav)
- ✅ `aria-expanded`/`aria-controls` for mobile nav toggle
- ✅ `aria-current="page"` for active nav link
- ✅ `aria-hidden="true"` on decorative visuals (case study CSS art)
- ✅ `role="dialog"` for terminal and palette overlays
- ✅ `role="progressbar"` for reading progress
- ✅ Keyboard navigation: Tab, Shift+Tab, Enter, Arrow keys, Escape
- ✅ Focus management: auto-focus input on palette/terminal open
- ✅ `prefers-reduced-motion`: animations disabled, reveals instant
- ✅ Color contrast: text passes WCAG AA in both themes

### Gaps

| Issue | Severity | WCAG Criterion | Location |
|-------|----------|----------------|----------|
| SVG icons missing `alt` or `aria-label` | Medium | 1.1.1 Non-text Content | Footer social icons, inline SVGs |
| Terminal output not in `aria-live` region | High | 4.1.3 Status Messages | `interactive.js` terminal output container |
| Chat responses not announced to screen readers | High | 4.1.3 Status Messages | `interactive.js` chat container |
| Heading hierarchy inconsistent | Low | 1.3.1 Info and Relationships | Some pages skip from H1 to H3 |
| Keyboard shortcut `T` for theme toggle without modifier | Medium | 2.1.4 Character Key Shortcuts | `script.js` — single-letter shortcut could conflict with AT |
| Keyboard shortcut backtick for terminal without modifier | Medium | 2.1.4 Character Key Shortcuts | `script.js` |
| No mechanism to disable/remap keyboard shortcuts | Medium | 2.1.4 Character Key Shortcuts | Global |
| Terminal history text colors hardcoded | Low | 1.4.3 Contrast (Minimum) | Some terminal accent colors may not meet 4.5:1 ratio |
| Matrix animation could trigger seizure concerns | Low | 2.3.1 Three Flashes | `interactive.js` matrix command |
| No `aria-label` on decorative pseudo-elements | Low | 1.1.1 | CSS `::before`/`::after` content |

---

## Mobile Responsiveness

### Strategy

- **Breakpoint**: 720px (single breakpoint, mobile-first)
- **Fluid typography**: `clamp()` functions for all heading sizes
- **Grid collapse**: Multi-column grids → single column on mobile
- **Touch targets**: Buttons sized ≥44px
- **Hamburger nav**: Replaces inline nav below 720px

### Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| Terminal overlay on small screens | Medium | Fixed position terminal may overlap content, cramped on <375px screens |
| Command palette width | Low | May be too narrow on small screens, no max-width constraint for mobile |
| Case study CSS visuals | Low | Abstract CSS art may not communicate project type on small devices |
| No tablet-specific optimization | Low | Fluid scaling handles it, but no explicit tablet layout (768-1024px) |

---

## Content Freshness

| Content | Last Updated | Status |
|---------|-------------|--------|
| Now page | **July 2025** | 🔴 **9 months stale** — should reflect current state |
| Resume on Contact page | Unknown | 🔴 **Marked "outdated"** — badge literally says "(outdated)" |
| Sitemap lastmod dates | Varies | 🟡 May not reflect actual edit dates |
| About page | ~Mar 2026 | 🟢 Current |
| Essays | Dec 2025 – Mar 2026 | 🟢 Current |
| Updates | Oct 2025 – Mar 2026 | 🟢 Current |
| Homepage | ~Mar 2026 | 🟢 Current |

---

## Known Issues (Full List)

### Critical

1. **No project detail pages** — Work section has summaries only, no deep dives
2. **CSS placeholder visuals instead of real screenshots** — `system-frame`, `editorial-grid`, `device-frame`, `terrain-frame` are decorative CSS, not real project imagery
3. **Now page 9 months stale** — "Last updated July 2025"
4. **Resume explicitly marked "outdated"** on Contact page

### High Priority

5. **No minification** — ~290KB total JS+CSS ships uncompressed
6. **Chat knowledge base hardcoded** — ~2000 lines of KB data in `interactive.js`
7. **Terminal output inaccessible to screen readers** — no `aria-live` region
8. **Same OG image on every page** — no unique social preview per section
9. **No service worker** — no offline capability

### Medium Priority

10. **Single-letter keyboard shortcuts** without modifier keys (T, backtick) — WCAG 2.1.4 concern
11. **No build pipeline** — all minification, optimization, generation is manual
12. **No analytics** — can't measure engagement or performance regressions
13. **Google Fonts full character set** — loading unused glyphs
14. **No print stylesheet** — articles should be printable

### Low Priority

15. **SVG alt text missing** in footer and inline icons
16. **Heading hierarchy** occasionally skips levels
17. **No breadcrumb schema** on sub-pages
18. **No related content** suggestions at end of articles
19. **No "uses" or "tools" page** — common on top portfolios
20. **No content tagging system** — essays and updates lack taxonomy
