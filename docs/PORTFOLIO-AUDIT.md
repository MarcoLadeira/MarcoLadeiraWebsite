# Portfolio audit — baseline (27 Nov 2026)

Baseline commit: `3e2f1de` on `master`. Audited locally (static server, headless Chrome 1440×900 and 390×844) and by reading every page and script. Screenshots of the old site are kept outside the repo for the before/after comparison in the final report.

## How the site is built and deployed

- Hand-written static HTML across 15 pages; header, footer and nav duplicated in every file.
- GitHub Pages serves **`master` from the repository root** (the "pages build and deployment" run fires on every push to `master`). The separate `deploy.yml` workflow also copies the whole repo to a `gh-pages` branch, which Pages does not serve — redundant.
- `sync-linkedin.yml` runs every six hours and fails: it expects a `content/posts/` folder that does not exist.
- `interactive.js` is 146 KB unminified (command palette, terminal, "matrix rain", typing effects, easter eggs, a 1,000-line rule-based chatbot with hard-coded facts that go stale).
- Google Fonts are loaded render-blocking on every page.

## Verified defects

| # | Severity | Finding | Evidence |
|---|---|---|---|
| 1 | Critical | Downloadable CV (`assets/cv.pdf`) is from before Fenergo: "Recent graduate… seeking a role", wrong classification (2.1 — actual result is 2.2), old GitHub handle `github.com/fristtysteam`, personal phone number, and three lecturers' email addresses published as references. | `pdftotext assets/cv.pdf` |
| 2 | Critical | Two different email addresses: CV `marcoladeirawork@gmail.com`, site `marcoladeiraworkemail@gmail.com`. | CV vs `contact/index.html` |
| 3 | High | Job title inconsistent: "Fullstack Software Engineer" (home), "Software Engineer" (about/now). Promotion to Associate Software Engineer not shown anywhere. | All pages |
| 4 | High | NASA Space Explorer links to `nasaapi-production.up.railway.app`; the project's own README says that deployment is down. | `NasaAPI/README.md` |
| 5 | High | "Explorer" VR is described as "source available on GitHub" but its repo (`VirtualTechnologies`) contains only a README. | GitHub |
| 6 | High | Oddlings (the most visual, most product-like work) is missing entirely. | — |
| 7 | High | Canonical / `og:url` tags point to `https://marcoladeira.github.io/...` (no `/MarcoLadeiraWebsite/` base path), i.e. URLs that 404. Same for sitemap and feed. | `<link rel="canonical">`, `sitemap.xml` |
| 8 | High | Lab claims "System architecture, generated" from free text; in reality it keyword-matches one of six hand-written templates. | `lab/lab.js` `PATTERNS` |
| 9 | Medium | Homepage spends the whole first viewport on a black "Marco Ladeira" splash; role, evidence and contact are below the fold. | Screenshot |
| 10 | Medium | Now page last updated April 2026; lists a portfolio redesign and a LinkedIn sync tool as "currently building". | `now/index.html` |
| 11 | Medium | Project cards have no imagery, no role statements, no status; Vesta/SaveThePlanet link out to GitHub rather than case studies. | `work/index.html` |
| 12 | Medium | Lighthouse a11y 96: colour-contrast failures and a label/name mismatch. | Lighthouse (mobile, local) |
| 13 | Low | `generate-images.js`, `new-post.js`, `sync-linkedin.js`, `IMPROVEMENT-PLAN.md`, and 3.3 MB of unused GIFs in `images/` sit in the published root. | `ls` |

## Baseline measurements (local, lab data, Lighthouse 13.6 mobile preset)

| Page | Perf | A11y | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Home | 96 | 96 | 100 | 100 | 2.3 s | 0 |

Caveat: the sandbox blocks Google Fonts, so the old site rendered with fallback fonts during measurement — real-world LCP is likely worse because of the render-blocking font CSS (Lighthouse estimated 1.5 s of render-blocking savings).

## Content facts verified for the redesign

| Fact | Source |
|---|---|
| Fenergo since Sep 2025; Graduate → Associate Software Engineer | Owner brief; existing site |
| BSc (Hons) Software Development, Level 8, DkIT, 2025, **2.2** | Owner brief (corrects CV) |
| BSc in Computing, Level 7, DkIT, 2021–2024 | Old CV |
| Vesta: v0.2.1 Alpha.1, not publicly released; ~126k lines of Python, ~7,900 pytest functions, ~1,360 Vitest/Playwright cases, ~554 merged PRs (GitHub search; issue and PR numbers are shared, so the #1099 numbering overstates PRs) | `MarcoLadeira/Vesta` README, `docs/`, test tree |
| ONE / Oddlings: two games on `main`; not public; 20,000-board verifier run; adaptive Glicko-style skill model; art rights unrecorded (#85) | `MarcoLadeira/ONE` `docs/ODDLINGS.md`, `docs/ADAPTIVE.md` |
| SaveThePlanet: Hack the Climate 2026, four-person team, Product Owner & Technical Lead, 475 documented tests, evidence ledger | `SaveThePlanet/README.md`, `docs/demo/evidence-ledger.md` |
| AWS Certified Machine Learning – Specialty | Existing site only — **owner to confirm** |

Not published by design: performance rating, user counts, internal architecture, client details.
