# 07 — Implementation Roadmap

> A prioritized, phase-by-phase execution plan with dependencies, scope estimates, and verification criteria. Designed for a solo developer working in focused blocks between full-time commitments.

---

## Table of Contents

- [Overview](#overview)
- [Priority Logic](#priority-logic)
- [Phase 1 — Quick Wins](#phase-1--quick-wins-hours)
- [Phase 2 — Accessibility Fixes](#phase-2--accessibility-fixes-1-day)
- [Phase 3 — Case Studies](#phase-3--case-studies-2-4-days)
- [Phase 4 — Performance Build Pipeline](#phase-4--performance-build-pipeline-1-2-days)
- [Phase 5 — New Content Pages](#phase-5--new-content-pages-2-3-days)
- [Phase 6 — Polish and SEO](#phase-6--polish-and-seo-1-day)
- [Phase 7 — Content Cadence](#phase-7--content-cadence-ongoing)
- [Dependency Map](#dependency-map)
- [Verification Matrix](#verification-matrix)

---

## Overview

| Phase | Focus | Scope | Lighthouse Impact |
|-------|-------|-------|------------------|
| 1 | Quick wins (content updates, stale fixes) | Hours | +2-3 SEO |
| 2 | Accessibility fixes (a11y gaps) | 1 day | +8-10 A11y |
| 3 | Case study pages (4 project deep-dives) | 2-4 days | +20 perceived quality |
| 4 | Performance build pipeline | 1-2 days | +10-15 Perf |
| 5 | New content pages (/uses, /craft) | 2-3 days | +10 SEO, +quality |
| 6 | Polish, SEO, schema | 1 day | +3-5 SEO |
| 7 | Ongoing content cadence | Ongoing | Compounding |

**Do phases in order.** Quick wins ship fast and reduce cognitive overhead before tackling larger structural work.

---

## Priority Logic

Highest ROI actions given this is a GitHub Pages static site with a solo developer:

1. **Content freshness** — stale content (Now page, "outdated" resume badge) actively signals neglect to visitors
2. **Accessibility** — Lighthouse 100 is a technical signal; terminal+chat AT experience reflects engineering level
3. **Case studies** — the single biggest portfolio gap; projects without detail pages are invisible to evaluators
4. **Performance** — CSS/JS unminified is the fastest performance improvement with no design risk
5. **New pages** — `/uses` and `/craft` add depth and differentiation, but only after core is solid
6. **Polish** — meaningful but low urgency

---

## Phase 1 — Quick Wins (Hours)

No dependencies. Can be done in one focused session.

### 1.1 Update the Now Page

**File:** `now/index.html`

The Now page was last updated July 2025. It is the first signal of whether a site is actively maintained.

```
Tasks:
  [ ] Update the "last updated" date to current month/year
  [ ] Refresh "Currently working on" section with current projects/focus
  [ ] Update "Currently reading" with recent books
  [ ] Update "Currently learning" with actual 2026 learnings (AI tooling, etc.)
  [ ] Remove or update anything from July 2025 that is no longer accurate
  [ ] Set a calendar reminder to update this every month
```

### 1.2 Fix the Contact Page Resume Badge

**File:** `contact/index.html`

The resume is marked "outdated" on the contact page. This needs to either be updated or the badge removed.

```
Tasks:
  [ ] Update the CV file with current role (Fenergo) and recent experience
  [ ] Remove "outdated" badge from resume download link
  [ ] Verify resume PDF link is not broken
```

### 1.3 Update Sitemap

**File:** `sitemap.xml`

```
Tasks:
  [ ] Update lastmod dates to current date for all pages
  [ ] Add any missing pages (check all index.html paths vs sitemap entries)
  [ ] Verify canonical URLs match site URLs
```

### 1.4 Add Missing OG Images Fallback

**File:** All `index.html` files

Currently, the og:image may be using a global fallback. Before per-page images are created:

```
Tasks:
  [ ] Verify og:image tag exists on all pages
  [ ] If missing on a page, add a reference to the global og-image
  [ ] Add og:image:width and og:image:height attributes (1200/630)
```

---

## Phase 2 — Accessibility Fixes (1 Day)

Reference: `docs/06-ACCESSIBILITY-DEEP-DIVE.md` for full details on each fix.

### 2.1 Add `.sr-only` Utility Class

**File:** `styles.css`

```
Tasks:
  [ ] Add .sr-only CSS class if not present
  [ ] Add scroll-padding-top to html element for sticky header offset
  [ ] Verify focus ring styles in both light and dark themes
  [ ] Verify --muted colors pass 4.5:1 contrast; adjust if needed
```

### 2.2 SVG Alt Text Audit and Fix

**Files:** All `.html` files, `interactive.js`

```
Tasks:
  [ ] Run: Get-ChildItem -Recurse -Filter "*.html" | Select-String -Pattern '<svg'
  [ ] For every SVG: determine decorative vs. functional
  [ ] Add aria-hidden="true" focusable="false" to decorative SVGs
  [ ] Add aria-label to icon-only buttons and links
  [ ] Add aria-label with "(opens in new tab)" to external linked icon SVGs
```

### 2.3 Terminal ARIA Improvements

**File:** `interactive.js`

```
Tasks:
  [ ] Add role="log" aria-live="polite" aria-relevant="additions" to terminal output container
  [ ] Add aria-modal="true" to terminal dialog element
  [ ] Add aria-labelledby pointing to a hidden h2 "Terminal" inside the dialog
  [ ] Add aria-describedby pointing to a hidden p with usage instructions
  [ ] Implement announceStatus() utility function
  [ ] Call announceStatus('Terminal opened. Type help for commands.') on open
  [ ] Call announceStatus('Terminal closed.') on close
  [ ] Save trigger element before opening; restore focus on close
```

### 2.4 Chat ARIA Improvements

**File:** `interactive.js`

```
Tasks:
  [ ] Add role="log" aria-live="polite" to chat messages container
  [ ] Add aria-modal="true" to chat dialog
  [ ] Announce message arrival: update aria-label with message count
  [ ] Save trigger element; restore focus on close
```

### 2.5 Command Palette ARIA

**File:** `interactive.js`

```
Tasks:
  [ ] Verify role="listbox" and role="option" are correct
  [ ] aria-activedescendant on input points to currently highlighted option
  [ ] Announce result count: "5 results" via status region
  [ ] Verify focus is on search input when palette opens
```

### 2.6 Keyboard Shortcut Compliance (WCAG 2.1.4)

**File:** `interactive.js`

```
Tasks:
  [ ] Add shortcutsEnabled variable defaulting to localStorage or true
  [ ] Gate all single-key shortcut handlers (T, backtick, /) on shortcutsEnabled
  [ ] Add "Disable keyboard shortcuts" command to command palette
  [ ] Add "Enable keyboard shortcuts" command to command palette
  [ ] Persist preference to localStorage
```

### 2.7 Heading Hierarchy Audit

**Files:** All `index.html` files

```
Tasks:
  [ ] Run heading audit console script on every page
  [ ] Fix any skipped heading levels
  [ ] Verify exactly one h1 per page
```

### 2.8 Focus Management Verification

**Files:** `interactive.js`, `script.js`

```
Tasks:
  [ ] Open each overlay (terminal, chat, palette) via keyboard
  [ ] Verify focus moves into overlay on open
  [ ] Verify Tab/Shift+Tab cycle within overlay only
  [ ] Verify Escape closes and returns focus to trigger
  [ ] Verify sticky header does not obscure focused elements (scroll-padding-top)
```

### Acceptance

- Lighthouse Accessibility = 100 on homepage
- axe DevTools = 0 violations on homepage
- Terminal navigable by NVDA+Chrome: open, type command, output announced, close

---

## Phase 3 — Case Studies (2–4 Days)

The most impactful work in the roadmap. Projects without detail pages are just names on a list.

References: `docs/03-CONTENT-STRATEGY.md` for content templates, `docs/04-DESIGN-AND-UX-IMPROVEMENTS.md` for visual specs.

### 3.1 Fenergo AI Initiative Case Study

**New file:** `work/fenergo-ai-initiative/index.html`

```
Content to prepare:
  [ ] Write case study using the template from docs/03-CONTENT-STRATEGY.md
  [ ] Create anonymized architecture diagram (event flow, no proprietary data)
  [ ] Gather non-sensitive before/after metrics
  [ ] Draft the "What I learned" reflection section

Build the page:
  [ ] Create work/fenergo-ai-initiative/ directory
  [ ] Copy case-study base template
  [ ] Implement case study header component (title, role, year, tech stack pills)
  [ ] Implement outcome block with metrics
  [ ] Implement decision log section
  [ ] Add architecture diagram image
  [ ] Add breadcrumb JSON-LD schema
  [ ] Link from work/index.html project card
```

### 3.2 NASA Space Explorer Case Study

**New file:** `work/nasa-space-explorer/index.html`

```
Content to prepare:
  [ ] Write case study — focus on NASA APOD API integration and live data approach
  [ ] Capture screenshots of running application (it's live)
  [ ] Record short screen capture as animated WebP if possible

Build the page:
  [ ] Create work/nasa-space-explorer/ directory
  [ ] Implement case study page with real screenshots
  [ ] Link from work/index.html project card
  [ ] Update project card on work/index.html: replace CSS placeholder with real screenshot
```

### 3.3 Achievr Case Study

**New file:** `work/achievr/index.html`

```
Content to prepare:
  [ ] Write case study — focus on product thinking, user research, metrics definition
  [ ] Capture screenshots or create annotated UI mockup

Build the page:
  [ ] Create work/achievr/ directory
  [ ] Implement case study page
  [ ] Link from work/index.html project card
```

### 3.4 Explorer VR Case Study

**New file:** `work/explorer-vr/index.html`

```
Content to prepare:
  [ ] Write case study — focus on WebXR constraints and creative problem-solving
  [ ] Create diagram of VR interaction model (can be CSS-based)

Build the page:
  [ ] Create work/explorer-vr/ directory
  [ ] Implement case study page
  [ ] Link from work/index.html project card
```

### 3.5 Update work/index.html

```
Tasks:
  [ ] Replace all 4 CSS placeholder visuals with real screenshots (WebP, 16:9 aspect)
  [ ] Add "View Case Study" links to each project card
  [ ] Ensure all project cards have descriptive alt text on their images
```

### 3.6 Update Homepage

```
Tasks:
  [ ] Homepage featured projects section (if present) links to case study pages
  [ ] Consider adding a "recent work" preview with one real screenshot
```

---

## Phase 4 — Performance Build Pipeline (1–2 Days)

Reference: `docs/05-PERFORMANCE-AND-TECHNICAL.md` for full implementation details.

### 4.1 Initialize Build Infrastructure

```
Tasks:
  [ ] npm init -y (dev dependencies only — nothing ships to browser)
  [ ] npm install --save-dev lightningcss terser sharp
  [ ] Create src/ directory for source files
  [ ] Create dist/ directory for build output (add to .gitignore during dev, remove after)
  [ ] Move styles.css to src/styles.css
  [ ] Move script.js to src/script.js
  [ ] Move interactive.js to src/interactive.js
  [ ] Write build.js (see docs/05-PERFORMANCE-AND-TECHNICAL.md for full script)
```

### 4.2 CSS Build

```
Tasks:
  [ ] Test: node build.js — verify minified CSS outputs to dist/
  [ ] Verify visual output matches original (spot-check light/dark theme)
  [ ] Measure size reduction (target: ~180KB → ~90KB)
  [ ] Update all HTML files to reference dist/styles.css
```

### 4.3 JavaScript Build

```
Tasks:
  [ ] Test: Terser minification applied to script.js and interactive.js
  [ ] Verify both files work correctly after minification
  [ ] Enable lazy-loading for interactive.js: load only on first terminal/palette activation
  [ ] Measure: interactive.js ~80KB → target ~40KB minified
  [ ] Update all HTML files to reference dist/script.js and dist/interactive.js
  [ ] Add defer attribute to script tags if not already present
```

### 4.4 Image Optimization

```
Tasks:
  [ ] Create images/ directory in src/
  [ ] Install sharp pipeline for WebP conversion
  [ ] Process all existing images through the pipeline
  [ ] Update all <img> tags with:
      - width and height attributes (to prevent CLS)
      - srcset for responsive images
      - loading="lazy" for below-fold images
      - WebP src with JPEG fallback
  [ ] Target: every image < 100KB, hero images at 40KB WebP
```

### 4.5 Font Self-Hosting

```
Tasks:
  [ ] Download Inter and Inter Tight from Google Fonts or fontsource
  [ ] Subset to characters actually used (Latin + Extended-Latin)
  [ ] Convert to WOFF2 format
  [ ] Add to src/fonts/
  [ ] Update styles.css @font-face to reference local fonts
  [ ] Remove Google Fonts <link> tags from all HTML files
  [ ] Verify fonts load correctly in both themes
  [ ] Measure: removes a 2-3 render-blocking requests
```

### 4.6 Service Worker

```
Tasks:
  [ ] Create sw.js at root (see docs/05-PERFORMANCE-AND-TECHNICAL.md for full implementation)
  [ ] Create offline.html page
  [ ] Register service worker in script.js
  [ ] Test offline mode: disconnect network, navigate — offline.html appears
  [ ] Test cache invalidation: update a CSS file, verify old cache busted
```

### 4.7 GitHub Actions Build Step

```
Tasks:
  [ ] Update .github/workflows/ to run node build.js before deploy
  [ ] Verify dist/ output is what gets deployed to Pages
  [ ] Test: push a commit, verify deployed site uses minified assets
```

### Acceptance

- Lighthouse Performance >= 95 on homepage
- LCP < 2.5s on simulated 4G
- CLS < 0.01
- No unminified CSS/JS in production
- Service worker caches assets

---

## Phase 5 — New Content Pages (2–3 Days)

Reference: `docs/04-DESIGN-AND-UX-IMPROVEMENTS.md` for design specs.

### 5.1 /uses Page

**New file:** `uses/index.html`

```
Content to write:
  [ ] Hardware section: laptop model, monitor, peripherals
  [ ] Development environment: IDE (VS Code), key extensions, terminal
  [ ] Languages and frameworks: TypeScript, Node.js, Python, etc.
  [ ] AI tooling: GitHub Copilot, models used, MCP configuration
  [ ] Hosting and infra: GitHub Pages, current cloud setup
  [ ] Learning and productivity: resources, workflows

Build the page:
  [ ] Create uses/ directory
  [ ] Implement page with section-based layout
  [ ] Tech stack pill components reused from about/ page
  [ ] Add to navigation (or accessible via command palette only)
  [ ] Add to sitemap.xml
```

### 5.2 /craft Page

**New file:** `craft/index.html`

This page showcases the interactive features as intentional design artifacts, not just novelties.

```
Content sections:
  [ ] Terminal emulator — explain the 55+ commands, show a few examples
  [ ] Command palette — explain the Ctrl+K shortcut, list categories
  [ ] Page transitions — explain the smooth navigation transitions
  [ ] Easter eggs — hint at their existence
  [ ] Design system — show the color tokens, type scale, spacing scale
  [ ] View Transitions API usage

Build the page:
  [ ] Create craft/ directory
  [ ] Implement as an interactive page (can have embedded demos)
  [ ] Link from about/ page and command palette
  [ ] Add to sitemap.xml
```

### 5.3 Expand Now Page Format

**File:** `now/index.html`

```
Tasks:
  [ ] Add archived monthly logs as collapsible sections or linked sub-pages
  [ ] Format: current month at top (always fresh), older months collapsed below
  [ ] This creates a living log that demonstrates consistent energy
```

### 5.4 Add /colophon or Expand About Page

```
Tasks:
  [ ] Add "How this site is built" section to about/ or new colophon page
  [ ] List: pure HTML/CSS/JS, GitHub Pages, fonts, build pipeline, performance targets
  [ ] This positions the site as a craft piece, not just a landing page
```

---

## Phase 6 — Polish and SEO (1 Day)

### 6.1 Breadcrumb JSON-LD Schema

**Files:** All sub-pages (work, writing, updates, about, contact, uses, craft)

```html
<!-- Add to every sub-page <head> -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://marcoladeira.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Work",
      "item": "https://marcoladeira.com/work/"
    }
  ]
}
</script>
```

```
Tasks:
  [ ] Add breadcrumb JSON-LD to work/index.html
  [ ] Add breadcrumb JSON-LD to each case study page
  [ ] Add breadcrumb JSON-LD to writing/index.html and each article
  [ ] Add breadcrumb JSON-LD to about/index.html
  [ ] Verify in Rich Results Test (search.google.com/test/rich-results)
```

### 6.2 Unique OG Images Per Page

```
Tasks:
  [ ] Create og-image-gen.js script that generates unique OG images per page
  [ ] Use HTML Canvas or SVG + sharp to render title text on branded background
  [ ] Output to images/og/ as PNG files
  [ ] Update each page's og:image meta tag
  [ ] Verify 1200x630px dimensions
```

### 6.3 Article Reading Experience Improvements

**Files:** All writing article pages

```
Tasks:
  [ ] Add sticky table of contents on desktop (right side rail)
  [ ] Verify estimated reading time is accurate and displayed
  [ ] Add "last updated" date to articles where relevant
  [ ] Verify code blocks have syntax highlighting if used
```

### 6.4 Print Stylesheet

**File:** `styles.css`

```css
@media print {
  /* Hide: nav, footer, interactive widgets, social sharing, reading progress */
  /* Ensure: body text is black on white, full-width, no max-width constraints */
  /* Show: URLs after external links */
}
```

```
Tasks:
  [ ] Add @media print block to styles.css
  [ ] Test: File > Print on homepage, work page, a writing article
  [ ] Verify articles readable and minimal on paper
```

---

## Phase 7 — Content Cadence (Ongoing)

Reference: `docs/03-CONTENT-STRATEGY.md` for full cadence plan and templates.

### Monthly Commitments

```
Monthly:
  [ ] Update Now page — 15 min, first day of new month
  [ ] Publish at least 1 TIL micro-post to /updates/

Quarterly:
  [ ] Review all pages for stale content
  [ ] Publish at least 1 longer essay to /writing/
  [ ] Add new craft experiments to /craft/ if built
```

### TIL Micro-Post Template

Each TIL lives in `updates/til-{slug}/index.html` and follows the same update format but with a "TIL:" prefix and is kept short (150-300 words):

```
Title: TIL: [What you learned]
Type: TIL
Date: [Date]
Body:
  - What: what you learned
  - Context: how you discovered it (debugging, reading docs, pair programming)
  - Application: how you used it or will use it
  - Link: to source/docs if external
```

---

## Dependency Map

```
Phase 1 (Quick Wins)
  └── No dependencies. Start here.

Phase 2 (Accessibility)
  └── No dependencies (but complete Phase 1 first for clean commit baseline)

Phase 3 (Case Studies)
  ├── Requires: case study content written (do alongside development)
  └── No code dependencies

Phase 4 (Build Pipeline)
  ├── Should come after Phase 3 so screenshots run through the image pipeline
  └── Requires: Node.js available locally

Phase 5 (New Pages)
  ├── /craft requires Phase 4 (so it can describe the build pipeline)
  └── /uses has no dependencies

Phase 6 (Polish/SEO)
  ├── Breadcrumbs: requires all pages to exist (after Phase 3 and 5)
  ├── OG images: requires Node.js/Sharp from Phase 4
  └── Print stylesheet: no dependencies

Phase 7 (Content)
  └── Ongoing. Start with Now page in Phase 1.
```

---

## Verification Matrix

| Phase | Done When |
|-------|-----------|
| Phase 1 | Now page has current month/year; resume badge removed; sitemap updated |
| Phase 2 | Lighthouse Accessibility = 100 on every page; axe = 0 violations |
| Phase 3 | All 4 project cards link to case study pages; real screenshots visible on work/ |
| Phase 4 | Lighthouse Performance >= 95; minified CSS/JS in production; service worker installed |
| Phase 5 | /uses and /craft return 200; both linked from command palette |
| Phase 6 | Rich Results Test shows valid breadcrumbs; unique OG images on all pages |
| Phase 7 | Now page updated monthly; at least 1 TIL per month for 3 consecutive months |

---

## Top 10 Highest-Impact Changes (TL;DR)

For when time is short, these deliver the most return:

1. **Update the Now page** — signals the site is alive (15 min)
2. **Fix the resume badge** — remove "outdated" label or upload updated CV (30 min)
3. **Add `role="log" aria-live="polite"` to terminal output** — biggest a11y gap (30 min)
4. **Disable shortcuts via command palette** — WCAG 2.1.4 compliance (1 hr)
5. **Write and publish the Fenergo AI case study** — highest-signal missing content (1 day)
6. **Replace CSS placeholders with real screenshots** on work page (2 hrs)
7. **Add LightningCSS + Terser build step** — ~40% smaller CSS/JS (2 hrs)
8. **Self-host fonts and remove Google Fonts CDN** — removes 2 render-blocking requests (1 hr)
9. **Launch /uses page** — low-effort, high SEO + personality signal (2 hrs)
10. **Publish 2 TILs per month** — keeps the site alive and indexed (15 min/month)
