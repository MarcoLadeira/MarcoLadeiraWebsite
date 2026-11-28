# Portfolio handoff

Phase 2 starts from the merge of [PR #2](https://github.com/MarcoLadeira/MarcoLadeiraWebsite/pull/2), commit `3fbb359`. The public site keeps the same `/MarcoLadeiraWebsite/` base URL and legacy redirects.

- Edit content and templates in `src/`. Keep generated output and both CV URLs in sync.
- `npm ci`, `npm run build` and `npm run serve` produce and preview the site.
- `npm run assets` regenerates the CV, social cards and favicons using Python Playwright. Set `CHROME` to the path to Chromium or Chrome. The two CV files are identical.
- `npm run test:unit` and `npm run test:e2e` run the regression suites. Set `ALL_BROWSERS=1` for Firefox and WebKit alongside Chromium.
- `npm run stage:pages` stages the generated site plus runtime assets in `dist/pages`. `node scripts/serve.mjs 4344 dist/pages` previews that exact output.
- The Portfolio Pages workflow verifies a PR and publishes the staged output on the default branch after a successful build. Its production environment is `github-pages`.

The promotion year is 2026. Use a month only with a dated source. Employer work is described at the level supported by the portfolio, the profile and Marco’s brief. The old CV remains in Git history.
