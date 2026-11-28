# Handoff

## Where things are

- Branch: `redesign/2026-portfolio` → merged to `master` via pull request (see the PR for the exact merge commit).
- Live: https://marcoladeira.github.io/MarcoLadeiraWebsite/ (GitHub Pages, `master`, repository root).
- Generated output is committed; `src/` is the source of truth. Always run `npm run build` after editing `src/` or `assets/css|js`.

## Commands

```bash
npm install
npm run build                 # pages, sitemap, feed, manifest; removes stale generated pages
npm run assets                # CV PDF, OG images, icons (Python Playwright + Chrome)
npm run serve                 # http://localhost:4173/MarcoLadeiraWebsite/
npm run test:unit
CHROME_PATH=/usr/bin/google-chrome npm run test:e2e
python3 scripts/prepare-media.py   # only when replacing screenshots (needs local clones of the project repos)
```

## Decisions worth knowing

- No framework: a ~100-line generator with an escaping `html` template. Rationale in `REDESIGN-ROADMAP.md`.
- GitHub Pages serves the branch root, so no Actions are needed to deploy. The old `deploy.yml` (gh-pages copy) and the failing `sync-linkedin.yml` were removed.
- Above-the-fold text is never hidden by animation (LCP). Ambient animations stop after a few cycles (WCAG 2.2.2).
- Every number on the site must trace to a source; `docs/PORTFOLIO-AUDIT.md` lists them. Unit tests guard against known-wrong or private facts.

## Waiting on Marco (factual confirmations)

1. ~~Which email is current~~ — confirmed by Marco 27 Nov 2026: `marcoladeirawork@gmail.com` (site, CV, structured data).
2. Month of the promotion to Associate Software Engineer (shown as "2026"). Change in `src/data/experience.mjs`.
3. AWS Certified Machine Learning – Specialty confirmed by Marco 27 Nov 2026; a Credly link would still help.
4. Whether to keep ONE Oddlings screenshots public before the game launches.
5. Optional: two or three specific, employer-safe contributions for the Fenergo case study.
6. Optional: a professional headshot for About.

## Known limitations

- Tested in Chromium only (see `TESTING-REPORT.md`).
- `/docs`, `/src`, `/tests` are publicly reachable on Pages (they are public on GitHub anyway).
- The previous CV with a phone number remains in git history; removing it requires a history rewrite.
- `robots.txt` in a project site is ignored by crawlers; submit `sitemap.xml` in Google Search Console.

## Next step

Get the confirmations above, update the two data files, run `npm run build && npm run assets && npm run test:unit`, and push to `master`.
