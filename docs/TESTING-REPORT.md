# Phase 2 testing report

## Automated coverage

- Unit tests cover the static routes, canonical URLs, unique titles, internal links, aliases, image sizes and alternative text, credential wording, Capacity Lab calculations and the independent puzzle verifier.
- Playwright exercises 17 content routes with axe in light and dark mode, 320 px overflow, theme persistence, focus, downloads, legacy paths, no-JavaScript reading, reduced motion, puzzle controls and Lab interaction. Configurations include Chromium desktop and mobile, Firefox, and Playwright WebKit using an iPhone viewport. They are browser emulations.
- Staged production returned 404 for documentation, source, tests and package metadata. The click-to-play recording was activated and observed playing. A range request for its MP4 returned 206 with the requested byte count.
- The CV rendered as one tagged A4 page. Text extraction followed the intended section order with no replacement characters. The new and legacy links return a PDF, and the mobile download emitted the expected filename.

## Visual and performance checks

Before and after screenshots include 17 routes at 1440, 768 and 390 px. Independent reviews exercised theme, navigation, case contents, the Lab and the Oddlings interaction. The corrected SaveThePlanet desktop title was checked at 1080, 1280, 1440 and 1920 px.

Mobile Lighthouse lab scores on a local staged build are shown below. These are a sampled measurement and can vary with throttling and machine load. The video is loaded on demand.

| Page | Performance | Accessibility | Best practices | SEO | LCP |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 95 | 100 | 100 | 100 | 2.84 s |
| Work | 94 | 100 | 100 | 100 | 2.86 s |
| Vesta | 93 | 100 | 96 | 100 | 2.93 s |
| ONE Oddlings | 87 | 100 | 96 | 100 | 3.68 s |
| Capacity Lab | 93 | 100 | 100 | 100 | 2.71 s |

This run was slower than the Phase 1 report. Layout shift was below 0.001 on all sampled pages. A separate reviewer’s throttled Chromium run measured 1.13–1.53 s on four pages, with zero measured CLS. No physical-device or native Safari run was performed.
