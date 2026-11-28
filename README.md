# Marco Ladeira — portfolio

[Live portfolio](https://marcoladeira.github.io/MarcoLadeiraWebsite/)

The site is generated from structured data by a dependency-free Node script. GitHub Actions publishes the generated pages and runtime assets to GitHub Pages.

## Run locally

```sh
npm ci
npm run build
npm run serve       # http://localhost:4173/MarcoLadeiraWebsite/
npm run test:unit
npm run test:e2e    # install browser binaries with npx playwright install
```

Set `ALL_BROWSERS=1` to test Firefox and WebKit as well as Chromium. Set `CHROME_PATH` to use an installed Chrome.

## Edit or publish

- Update career, training and project facts under `src/data/`.
- Edit layouts under `src/pages/` and `src/components/`. Essay and note bodies live in `src/content/`.
- Run `npm run build` after changing source. For CV or social assets, run `npm run assets` with Python Playwright and `CHROME` set to a browser executable.
- Run `npm run stage:pages` to package the generated site into `dist/pages`. Preview it with `node scripts/serve.mjs 4344 dist/pages`.
- Open a PR against `master`. The Portfolio Pages workflow verifies the changes and publishes only the staged files after merge.

See the [handoff](docs/HANDOFF.md), [design system](docs/DESIGN-SYSTEM.md), [portfolio audit](docs/PORTFOLIO-AUDIT.md) and [testing report](docs/TESTING-REPORT.md).
