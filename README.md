# Marco Ladeira — portfolio

Live: https://marcoladeira.github.io/MarcoLadeiraWebsite/

A hand-built static site. Pages are generated from structured data by a small, dependency-free Node script and committed to the repository root, which GitHub Pages serves from `master`. No framework, no client-side rendering, no trackers.

## Structure

```text
src/
  build.mjs           renders every page, sitemap, feed, manifest, minified CSS
  data/               single source of truth: site.mjs, experience.mjs, projects.mjs, writing.mjs, media.json
  pages/              page templates (home, work + case studies, profile, writing, lab, cv, misc)
  components/         schematic, media, work plates, architecture diagram, contact, icons
  content/            essay and note bodies (HTML)
assets/
  css/site.css        the whole design system (site.min.css is generated)
  js/site.js          progressive enhancement: theme, nav, reveals, schematic, copy, TOC, video
  js/lab-model.js     Capacity Lab maths (pure, unit-tested)  ·  js/lab.js  its UI
  fonts/ img/         self-hosted fonts; real project screenshots and footage
  marco-ladeira-cv.pdf  generated CV (also copied to assets/cv.pdf for old links)
scripts/
  serve.mjs           local server that mimics GitHub Pages (base path + 404)
  render-assets.py    prints the CV PDF, social images and PNG icons with headless Chrome
  prepare-media.py    converts project screenshots into responsive WebP + media.json
tests/
  unit/               node --test: Lab model, links, metadata, headings, factual guards
  e2e/                Playwright + axe: every page, navigation, theme, menu, Lab, legacy URLs
docs/                 audit, design system, roadmap, quality review, testing report, handoff
```

Generated output (`index.html`, `work/`, `experience/`, … `sitemap.xml`, `feed.xml`) is committed on purpose: Pages serves the branch root, so there is no deploy step to break.

## Commands

```bash
npm install                  # dev-only: Playwright + axe
npm run build                # regenerate all pages from src/
npm run assets               # CV PDF, OG images, icons (needs Python Playwright + Chrome)
npm run serve                # http://localhost:4173/MarcoLadeiraWebsite/
npm run test:unit
CHROME_PATH=/usr/bin/google-chrome npm run test:e2e    # ALL_BROWSERS=1 adds Firefox + WebKit
```

## Editing content

- Role, contact details, links → `src/data/site.mjs`
- Jobs, education, certification → `src/data/experience.mjs`
- Projects and case studies → `src/data/projects.mjs` (every number must be traceable to the project's own repo)
- Essays/notes → `src/data/writing.mjs` + `src/content/<slug>.html`

Then `npm run build && npm run assets && npm run test:unit`, commit everything, push to `master`.

## Deployment

GitHub Pages ("Deploy from a branch", `master`, `/`). `.nojekyll` serves files as-is.
