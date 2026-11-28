# Quality review

Three independent reviewers (separate agents that had not seen the implementation reasoning) assessed the running site, screenshots and source. Their scores are recorded as given, before fixes; the fixes made in response are listed under each.

## Initial scores (before review fixes)

Design / motion reviewer (1–10):

| Page | Visual | Originality | Type | Layout | Spacing | Hierarchy | Motion | Mobile | Memorability |
|---|---|---|---|---|---|---|---|---|---|
| Home | 7 | 6 | 7 | 6 | 5 | 6 | 4 | 5 | 6 |
| Work | 6 | 4 | 7 | 6 | 5 | 6 | 4 | 6 | 4 |
| Fenergo | 5 | 4 | 7 | 5 | 5 | 6 | 3 | 6 | 3 |
| Vesta | 7 | 5 | 7 | 6 | 6 | 6 | 3 | 6 | 5 |
| Oddlings | 7 | 5 | 7 | 6 | 6 | 6 | 4 | 6 | 6 |
| SaveThePlanet | 7 | 5 | 7 | 6 | 6 | 6 | 3 | 6 | 5 |
| Experience | 6 | 3 | 7 | 5 | 5 | 6 | 3 | 6 | 3 |
| About | 5 | 3 | 7 | 5 | 6 | 6 | 3 | 6 | 3 |
| Contact | 4 | 3 | 7 | 4 | 4 | 4 | 3 | 6 | 3 |
| Lab | 7 | 7 | 6 | 6 | 6 | 6 | 6 | 4 | 7 |
| Writing | 6 | 4 | 6 | 6 | 6 | 6 | 3 | 7 | 4 |

Recruiter / fact-check reviewer (Professionalism / Content / Authenticity / Engineering credibility / Recruiter effectiveness):

| Page | Prof | Content | Auth | Eng | Recruiter |
|---|---|---|---|---|---|
| Home | 8 | 6 | 6 | 7 | 7 |
| Work | 8 | 7 | 7 | 7 | 6 |
| Fenergo | 8 | 4 | 7 | 4 | 6 |
| Vesta | 8 | 8 | 5 | 8 | 5 |
| Oddlings | 8 | 8 | 5 | 8 | 5 |
| SaveThePlanet | 8 | 8 | 6 | 7 | 6 |
| Experience | 8 | 7 | 7 | 6 | 7 |
| About | 8 | 7 | 8 | 6 | 6 |
| Contact | 7 | 5 | 7 | – | 7 |
| Writing | 6 | 4 | 4 | 4 | 3 |
| Lab | 7 | 6 | 7 | 6 | 3 |
| CV | 8 | 7 | 6 | 7 | 7 |

## Findings acted on

**Accuracy (all fixed)**
- Vesta "660+ merged PRs" → 550+ (GitHub search: 554; PR and issue numbers are shared).
- ONE "1,100+ tests" was presented as Oddlings-only → attributed to the whole ONE codebase.
- SaveThePlanet: team size wording, shared forecasting/battery/EV work, re-published repo noted; "wrote" → "led" the evidence ledger.
- Oddlings art: now states the characters were created with AI image generation under Marco's direction and that rights are still being recorded.
- CV: "ships products" → "two are in private preview"; "References available on request" removed.
- US spellings in essays corrected.

**Design and motion (fixed)**
- Schematic moved up the page and drawn when it scrolls into view rather than off-screen at load.
- Highlighted pulses no longer vanish on hover; one station pulses at a time instead of twelve random dashes; single riser per station with junction dots.
- Mobile gets its own signature: a project × capability pin matrix.
- Italic-tail headline formula removed from section titles (kept only in the hero and closer); "proof/evidence/receipts" vocabulary cut back.
- Duplicate facts band and homepage writing list removed; capabilities no longer duplicated on Experience.
- Section rhythm tightened; pill buttons → drafting-style 3 px corners; status dots without halos; dark-mode signal deepened.
- Fenergo redaction bars hatched (read as redactions in dark mode too).
- Case-study prose measure narrowed; essays set in the serif at 20 px.
- Contact rebuilt: no stacked duplicate headings; timezone and response time added.
- Lab: failure toggles moved to the top, results panel sticky on desktop and first on mobile, overload shown hatched, custom select.
- New bespoke artefact: an interactive Oddlings rules demo backed by a port of the game's independent checker.

**Not acted on**
- *Replace the hero line with a plain job title.* Kept "Software that shows its working." as the signature line, but the H1 now leads with the name and the role sits directly beside it.
- *Individual Fenergo contributions and Vesta routing evaluations* — need owner input / don't exist yet; listed in `HANDOFF.md`.

## Engineering & accessibility review

Lighthouse (mobile preset, local, uncompressed) measured by the reviewer after the LCP fix: Home 100/100/100/100 (LCP 1.1 s, CLS 0.004), Vesta case study 100/100/100/100 (LCP 1.1 s), Lab 100/100/100/100 (LCP 1.1 s, TBT 30 ms). Before that fix: Home 93 (LCP 3.1 s).

Initial scores (Accessibility / Performance / Technical / Error handling): Home 7/9/7/6 · Case studies 8/9/8/6 · Lab 6/9/7/5 · Writing/About/Contact 8/9/8/7 · 404/redirects 8/10/6/7.

Fixed:
- Dark-theme contrast on the inverted contact band (new `--on-ink-accent` token); "Copied" label contrast; primary-button hover contrast in dark mode; form-control and switch borders now ≥ 3:1 (WCAG 1.4.11).
- WCAG 2.2.2: ambient schematic pulses and Lab flow lines now stop after a few cycles.
- `site.js` runs every feature in isolation; if any throws, content is revealed immediately and the no-JS fallback still works.
- Lab: debounced screen-reader announcements, `aria-invalid` + error message on bad fields, results dimmed and marked busy while input is invalid, `step="any"` so decimals are accepted, large node counts formatted, "0" and "under a second" edge cases.
- Schematic skills now reach screen readers on desktop too; Fenergo plate is a real figure with a list instead of `role="img"`.
- Video respects a viewer's pause; mobile menu closes when focus leaves it.
- 404 page no longer has a canonical/og:url; `/now/#x` redirects keep a single hash.
- `md()` only allows https/mailto/relative links; dev server returns 400 on malformed URLs.
- Build removes stale generated pages via a manifest; asset URLs are content-hashed; fragile regex CSS minifier removed; Content-Security-Policy meta with a hash for the one inline script.
- Plex Sans 600 dropped (−24 KB); image `sizes` now match rendered widths.

Recorded, not changed:
- GitHub Pages serves the whole repository root, so `/docs`, `/src` and `/tests` are publicly reachable (as they already are on GitHub). Moving to a `dist/` + Actions deploy would hide them; not done to avoid depending on Actions.
- `robots.txt` under a project path is ignored by crawlers; submit the sitemap in Search Console instead.
- The previous CV (with a phone number) remains in git history; removing it needs a history rewrite, which is the owner's call.
