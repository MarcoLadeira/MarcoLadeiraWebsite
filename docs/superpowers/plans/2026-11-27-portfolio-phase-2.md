# Portfolio Phase 2 implementation plan

**Goal**
Make the portfolio a clearer account of Marco Ladeira’s work and give each project current, authentic media.

**Architecture**
Use the existing static generator, data modules, base path, browser interactions and routes. Rebuild the editorial layer and render the CV and social assets from the same source. Package public output separately for GitHub Pages.

**Brief**
Phase 2 in the Claude conversation “Portfolio website update”, plus the user’s request to use current project builds and suitable LinkedIn photos.

## Work

- Reproduce the baseline at the merged commit. Record desktop and mobile views and inventory repetitions across the generated pages.
- Reconcile the profile and CV against the brief and the public evidence. Represent different Fenergo teams and work domains without assigning unverified names or technologies. Record courses as training. Simplify navigation and keep links and both CV URLs.
- Compare a portrait-led composition, an oversized name with product chapters, and a screenshot contact sheet. Build the oversized name direction with a neutral type-led shell and individual product treatments. Place the workplace first. Make the homepage short enough for a recruiter to scan.
- Capture Vesta, Oddlings and SaveThePlanet from verified source refs. Preserve intrinsic sizes, genuine captions and a static fallback. Keep the Oddlings rules demo and Capacity Lab.
- Package only generated pages, runtime assets and approved root files for Pages. Exercise the output and verify private-build paths are excluded.
- Retest on desktop and mobile engines, do independent page and interaction reviews, fix findings, regenerate assets, open a PR and verify the deployment.

## Regression checks

- Browser homepage checks identify Marco’s current role and find the primary work and CV links.
- Unit checks prohibit the incorrect standalone AWS credential and ensure internal references resolve.
- Browser checks cover the mobile menu, theme persistence, legacy URLs, downloads, the lab, the puzzle, reduced motion and no-JavaScript reading.
- The publishing workflow stages an allowlist. Deployment checks confirm the homepage, legacy CV, and excluded build paths.
