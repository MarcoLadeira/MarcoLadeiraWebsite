# Testing report — 27 November 2026

Environment: Linux sandbox, Node 22, Google Chrome (headless) via Playwright 1.65, axe-core 4.10, Lighthouse 13.6. **Only Chromium was available**: Playwright's Firefox/WebKit downloads are blocked in this environment, and no physical devices or real Safari were used. Mobile results are Chromium device emulation (Pixel 7) plus fixed viewports.

## Automated tests

| Suite | Command | Result |
|---|---|---|
| Unit (Lab model, Oddlings demo checker, build output: pages, links, srcsets, anchors, metadata, CSP, headings, image alt/size, sitemap, CV, factual guards) | `npm run test:unit` | 19 / 19 pass |
| End-to-end (13 URLs × desktop + mobile: clean console/network, no overflow, axe WCAG 2.2 AA; identity above the fold; schematic focus; theme persistence; mobile menu + Escape; CV download (new + legacy URL); legacy redirects + 404; back/forward; Lab recompute + failure toggles + validation; skip link; reduced motion; no-JS; 320 px overflow on all pages; Oddlings demo; dark-theme axe on all pages) | `CHROME_PATH=/usr/bin/google-chrome npm run test:e2e` | 49 pass, 2 skipped by design (desktop-only / mobile-only cases) |

The factual guards fail the build if the old GitHub handle, a 2.1 classification, referee emails, a phone number, internal ratings/user counts, the dead NASA demo URL or job-seeking language ever appear, and if more than one email address is published.

## Lighthouse (mobile preset, local server without compression — lab data, not field data)

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home | 100 | 100 | 100 | 100 | 1.1 s | 0.002 | 0 ms |
| Work | 100 | 100 | 100 | 100 | 1.1 s | 0 | 0 ms |
| Fenergo | 100 | 100 | 100 | 100 | 1.1 s | 0 | 0 ms |
| Vesta | 100 | 100 | 100 | 100 | 1.1 s | 0.001 | 0 ms |
| ONE Oddlings | 100 | 100 | 100 | 100 | 1.1 s | 0 | 50 ms |
| SaveThePlanet | 100 | 100 | 100 | 100 | 1.1 s | 0.002 | 0 ms |
| Experience | 100 | 100 | 100 | 100 | 1.1 s | 0 | 0 ms |
| About | 100 | 100 | 100 | 100 | 1.1 s | 0 | 0 ms |
| Contact | 100 | 100 | 100 | 100 | 1.1 s | 0 | 0 ms |
| Lab | 100 | 100 | 100 | 100 | 1.1 s | 0.001 | 40 ms |
| Writing | 100 | 100 | 100 | 100 | 1.1 s | 0.003 | 0 ms |
| Home (desktop preset) | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |

Baseline for comparison (old site, same method): Home 96 / 96 / 100 / 100, LCP 2.3 s — measured with Google Fonts blocked by the sandbox, so the old site's real-world LCP was likely worse. INP could not be measured in the lab; TBT is the proxy. Field data (CrUX) will only exist once the site has enough real traffic.

## Manual / visual checks

- Full-page screenshots reviewed at 1440, 768, 390 and 320 px in light and dark themes; independent reviewers also reviewed them (see `QUALITY-REVIEW.md`).
- Keyboard walkthrough of every page: skip link, nav, schematic stations, case-study contents, Lab form and toggles, Oddlings demo, theme toggle.
- Reduced motion: all movement removed, content immediately visible. No-JS: all content visible, navigation works.
- Motion checked with frame captures: schematic draw-in on view, station-by-station pulses, hover isolation, reveal staggering under fast scroll.
- Reflow at 200% and 400% zoom (640 / 320 CSS px): no horizontal scrolling.

## Not verified here

- Real Safari, Firefox and physical phones.
- The deployed GitHub Pages URL from this sandbox (the shell cannot reach github.io); see `HANDOFF.md` for how it was checked.
- What LinkedIn's crawler renders for the social card (OG tags and the 1200×630 image are in place; LinkedIn's Post Inspector needs a signed-in browser).
