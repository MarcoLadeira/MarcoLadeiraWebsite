# 05 — Performance & Technical

> Build pipeline, optimization targets, Core Web Vitals goals, security improvements, and service worker strategy — all within the zero-dependency, static GitHub Pages constraint.

---

## Table of Contents

- [Performance Goals](#performance-goals)
- [Current Baseline](#current-baseline)
- [Build Pipeline](#build-pipeline)
- [CSS Optimization](#css-optimization)
- [JavaScript Optimization](#javascript-optimization)
- [Image Optimization Pipeline](#image-optimization-pipeline)
- [Font Loading Strategy](#font-loading-strategy)
- [Core Web Vitals Targets](#core-web-vitals-targets)
- [Service Worker and Offline](#service-worker-and-offline)
- [Security Headers](#security-headers)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Progressive Enhancement Audit](#progressive-enhancement-audit)
- [Implementation Tasks by File](#implementation-tasks-by-file)

---

## Performance Goals

### Lighthouse Targets (all pages)

| Metric | Target | Reason |
|--------|--------|--------|
| Performance | 95+ | Top-tier portfolio must be fast |
| Accessibility | 100 | Non-negotiable for a site with this much a11y investment |
| Best Practices | 100 | No security, deprecation, or browser-compat warnings |
| SEO | 100 | All the infrastructure is there — finish it |

### Core Web Vitals Targets (75th percentile)

| Metric | Target | Excellent | What It Measures |
|--------|--------|-----------|-----------------|
| LCP (Largest Contentful Paint) | < 1.5s | < 2.5s | Loading performance |
| INP (Interaction to Next Paint) | < 100ms | < 200ms | Responsiveness |
| CLS (Cumulative Layout Shift) | 0.0 | < 0.1 | Visual stability |

### Network Budget

| Asset Type | Current | Target |
|------------|---------|--------|
| CSS (total, compressed) | ~40KB | < 20KB |
| JS (total, compressed) | ~25KB | < 15KB |
| Fonts (WOFF2, subset) | ~40KB | < 30KB |
| Images (per page) | varies | < 100KB (total critical path) |
| Total critical path | ~150KB | < 80KB |

*GitHub Pages enables Gzip automatically — unminified files still benefit from compression, but minification further reduces size significantly.*

---

## Current Baseline

### File Sizes (estimated, uncompressed)

| File | Size | Issue |
|------|------|-------|
| `styles.css` | ~180KB | 6,000+ lines, unminified |
| `script.js` | ~30KB | Core functions, unminified |
| `interactive.js` | ~80KB | Terminal KB + chat KB hardcoded inline |
| HTML (per page average) | ~10KB | Acceptable |
| Fonts (Google Fonts) | ~120KB | Over-fetching weights not used everywhere |

### Known Bottlenecks

1. `interactive.js` bundles terminal command definitions AND chat knowledge base inline — splits poorly
2. `styles.css` has legacy/unused rules that accumulated across redesigns
3. No image optimization pipeline — images added at whatever resolution
4. Google Fonts loads 8 weight variants unconditionally (some pages only use 3)
5. No critical CSS inlining — first paint blocked by full stylesheet download

---

## Build Pipeline

### Strategy

Add a lightweight build step using Node.js scripts (no npm runtime dependencies for the browser). The output still ships pure HTML/CSS/JS — just minified.

### Proposed Structure

```
project root/
├── src/
│   ├── styles.css          (source, unminified)
│   ├── script.js           (source, unminified)
│   ├── interactive.js      (source, unminified)
│   └── data/
│       ├── terminal-kb.js  (extracted terminal commands)
│       └── chat-kb.js      (extracted chat knowledge base)
├── dist/                   (gitignored, generated)
│   ├── styles.min.css
│   ├── script.min.js
│   └── interactive.min.js
├── build.js                (build script — runs minification)
└── package.json            (dev-only deps: lightningcss, terser)
```

### package.json (dev-only)

```json
{
  "name": "marcoladeira-website",
  "private": true,
  "scripts": {
    "build": "node build.js",
    "build:css": "node build.js --css-only",
    "build:js": "node build.js --js-only",
    "watch": "node build.js --watch"
  },
  "devDependencies": {
    "lightningcss": "^1.25.0",
    "terser": "^5.30.0"
  }
}
```

*Note: these are entirely dev-time tools — nothing ships to the browser from npm. The output is still hand-written HTML with minified CSS/JS files.*

### build.js (core logic)

```javascript
import { transform } from 'lightningcss';
import { minify } from 'terser';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const ROOT = process.cwd();
const SRC = resolve(ROOT, 'src');
const DIST = resolve(ROOT, 'dist');

mkdirSync(DIST, { recursive: true });

// CSS
const cssInput = readFileSync(resolve(SRC, 'styles.css'));
const { code: cssOutput } = transform({
  filename: 'styles.css',
  code: cssInput,
  minify: true,
  targets: { chrome: 105, firefox: 105, safari: 16 }
});
writeFileSync(resolve(DIST, 'styles.min.css'), cssOutput);

// JS
for (const file of ['script.js', 'interactive.js']) {
  const input = readFileSync(resolve(SRC, file), 'utf8');
  const { code } = await minify(input, {
    compress: { drop_console: false }, // keep console greeting
    mangle: true
  });
  writeFileSync(resolve(DIST, `${file.replace('.js', '.min.js')}`), code);
}

console.log('Build complete');
```

### HTML files: update asset references

After build, HTML files should reference `/dist/styles.min.css` and `/dist/script.min.js` in production. In development, reference the source files directly.

Use a simple flag approach: set `window.DEV = true` in a dev-only helper or use a comment marker that the build script swaps.

Alternative (simpler): Run the build script before every push. HTML always references `dist/` versions. Develop against source and build before committing.

---

## CSS Optimization

### 1) Minification via LightningCSS

LightningCSS is a Rust-based CSS processor — the fastest available, supports modern CSS, handles vendor prefixes, and produces tightly minified output.

Expected size reduction of `styles.css`: ~60-65% (180KB → ~60KB uncompressed, ~15KB compressed).

### 2) Audit and Remove Unused Rules

Tools: Chrome DevTools Coverage panel, or PurgeCSS (but careful — PurgeCSS requires careful configuration for dynamically-added classes).

**Manual audit first:** Search for class names in styles.css that do not appear in any HTML file:

```powershell
# Find CSS class definitions
Select-String -Path styles.css -Pattern '^\.[a-z-]+\s*\{' | 
Select-Object -ExpandProperty Matches

# Then cross-reference with all HTML files
Get-ChildItem -Recurse -Filter '*.html' | 
Select-String -Pattern 'class="' | 
ForEach-Object { $_.Line -replace '.*class="([^"]+)".*', '$1' }
```

### 3) Extract Critical CSS

Critical CSS = styles needed for above-the-fold rendering on the homepage.

Approach:
1. Use `critical` npm package (dev-only) to extract critical CSS
2. Inline the critical CSS in each page's `<head>`
3. Defer the full stylesheet asynchronously

```html
<!-- Inline critical CSS -->
<style>
  /* critical path styles, ~5KB */
</style>

<!-- Defer full stylesheet -->
<link rel="preload" href="/dist/styles.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/dist/styles.min.css"></noscript>
```

**Impact on LCP:** Significant — eliminates render-blocking stylesheet.

### 4) CSS Custom Properties

Already excellent. No changes needed.

---

## JavaScript Optimization

### 1) Minification via Terser

Terser is the industry standard — produces near-optimal minification with tree shaking via manual module refactoring.

Expected size reductions:
- `script.js`: ~30KB → ~10KB
- `interactive.js`: ~80KB → ~28KB

### 2) Split interactive.js into modules (source-level only)

`interactive.js` mixes terminal rendering, chat knowledge base content, command definitions, command palette logic, and easter eggs in 2,000+ lines. This makes it hard to maintain and update.

Source-level split (still concatenated/minified into one file for production):

```
src/
├── interactive.js          (main entry, orchestrates all modules)
├── interactive/
│   ├── terminal.js         (terminal engine: input, output, history, autocomplete)
│   ├── terminal-commands.js (all 55+ command definitions)
│   ├── chat.js             (chat engine)
│   ├── chat-kb.js          (knowledge base entries)
│   ├── palette.js          (command palette)
│   └── easter-eggs.js      (konami, matrix, console greeting)
```

**Build output:** All six files concatenated then minified into `interactive.min.js`. No change to users.

**Benefits for development:**
- Edit chat responses in `chat-kb.js` without touching terminal code
- Add terminal commands in `terminal-commands.js` without risk of breaking chat
- Easier code review, easier to update knowledge base monthly

### 3) Defer non-critical interactive.js

`script.js` is necessary for navigation, theme, and reveals. `interactive.js` is for the terminal, chat, and command palette — none of which are needed on first paint.

```html
<!-- In every page's <head> -->
<script src="/dist/script.min.js" defer></script>
<script src="/dist/interactive.min.js" defer></script>
```

Both files should already be deferred. The build step ensures this is consistent.

### 4) Code splitting: terminal (lazy load)

The terminal is only needed when the user activates it. Consider lazy loading `interactive.js` on first terminal/palette invocation:

```javascript
// In script.js
document.addEventListener('keydown', (e) => {
  if (e.key === '`' || (e.ctrlKey && e.key === 'k')) {
    if (!window.__interactiveLoaded) {
      const script = document.createElement('script');
      script.src = '/dist/interactive.min.js';
      script.onload = () => { window.__interactiveLoaded = true; };
      document.head.appendChild(script);
    }
  }
});
```

**Impact on initial load:** Removes ~28KB compressed from critical path for users who never open terminal.

---

## Image Optimization Pipeline

### The Problem

Currently images are added at whatever native resolution and format. The single `facecardicon.jpg` is used for every page's OG image — which looks poor when shared on LinkedIn or Twitter.

### Tools (dev-only)

- `sharp` — fastest Node.js image processing
- `imagemin` + `imagemin-webp` — batch WebP conversion

Add to `build.js`:

```javascript
import sharp from 'sharp';
import { glob } from 'glob';

const sourceImages = await glob('images/**/*.{jpg,jpeg,png}');

for (const src of sourceImages) {
  const base = src.replace(/\.(jpg|jpeg|png)$/, '');
  
  // WebP
  await sharp(src).webp({ quality: 85 }).toFile(`${base}.webp`);
  
  // Responsive sizes
  for (const width of [400, 800, 1200]) {
    await sharp(src).resize(width).webp({ quality: 85 }).toFile(`${base}-${width}w.webp`);
  }
}
```

### HTML implementation

For every project image/screenshot:

```html
<picture>
  <source
    type="image/webp"
    srcset="/images/nasa-ui-400w.webp 400w, /images/nasa-ui-800w.webp 800w, /images/nasa-ui-1200w.webp 1200w"
    sizes="(max-width: 720px) 100vw, 800px"
  >
  <img
    src="/images/nasa-ui.jpg"
    alt="NASA Space Explorer showing APOD viewer with Mars Rover gallery in the background"
    width="1200"
    height="675"
    loading="lazy"
    decoding="async"
  >
</picture>
```

**Always specify `width` and `height` on images** — this eliminates CLS from image load.

### OG Images per Page

Each page needs a unique 1200×630 OG image. Use a script to generate these with consistent branding:

```javascript
// og-image-gen.js — generates branded social card
import sharp from 'sharp';
import { createCanvas } from 'canvas';

function generateOgImage({ title, description, output }) {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  
  // Warm beige background
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, 1200, 630);
  
  // Name line
  ctx.fillStyle = '#111318';
  ctx.font = 'bold 28px Inter';
  ctx.fillText('Marco Ladeira', 64, 64);
  
  // Title (large)
  ctx.font = 'bold 56px Inter';
  const lines = wrapText(ctx, title, 1200 - 128);
  lines.forEach((line, i) => ctx.fillText(line, 64, 140 + i * 72));
  
  // Description
  ctx.font = '24px Inter';
  ctx.fillStyle = '#494e5b';
  ctx.fillText(description, 64, 500);
  
  // Domain
  ctx.font = '22px Inter';
  ctx.fillStyle = '#7c8190';
  ctx.fillText('marcoladeira.github.io', 64, 566);
  
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
  writeFileSync(output, buffer);
}
```

---

## Font Loading Strategy

### Current

Two `@import` calls to Google Fonts, loading Inter (400, 500, 600, 700, 800) and Inter Tight (500, 600, 700, 800). This totals 8 weight variants fetched from an external CDN.

### Improvements

#### 1) Use self-hosted fonts

Download Inter and Inter Tight WOFF2 files directly from [rsms.me/inter](https://rsms.me/inter/) and serve from your own host.

Benefits:
- No DNS lookup to fonts.googleapis.com
- No external request blocking first paint
- Subsetting possible
- GDPR-friendly (no third-party font tracking)

Directory structure:

```
assets/
├── fonts/
│   ├── inter-regular.woff2
│   ├── inter-medium.woff2
│   ├── inter-semibold.woff2
│   ├── inter-bold.woff2
│   ├── inter-extrabold.woff2
│   ├── inter-tight-medium.woff2
│   ├── inter-tight-bold.woff2
│   └── inter-tight-extrabold.woff2
```

#### 2) Subset fonts

Use `pyftsubset` (from fonttools) to reduce each WOFF2 to only include characters you actually use:

```bash
# Latin charset + punctuation used on the site
pyftsubset inter-bold.ttf \
  --output-file=inter-bold-subset.woff2 \
  --flavor=woff2 \
  --layout-features='kern,liga,calt' \
  --unicodes='U+0020-007E,U+00A0-00FF,U+2018,U+2019,U+201C,U+201D,U+2013,U+2014'
```

Expected reduction per weight: ~40% smaller.

#### 3) Preload critical fonts

In `<head>` of every page:

```html
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-regular.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-bold.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-tight-bold.woff2" crossorigin>
```

Only preload the weights visibly used above the fold on that specific page.

#### 4) font-display: optional

For non-critical font weights: `font-display: optional` — uses the font if it loads within the first render, otherwise fallback. Eliminates CLS from font-swap and layout shifts.

---

## Core Web Vitals Targets

### LCP (Largest Contentful Paint)

The LCP element on the homepage is likely the hero heading text block.

Actions:
- Inline critical CSS to unblock first paint
- Preload headline font weights
- Ensure the hero `<h1>` renders with the correct fallback font metrics to avoid layout shift on font swap

### INP (Interaction to Next Paint)

Current risk areas:
- Terminal command execution (some commands render complex HTML synchronously)
- Chat response rendering (could block main thread for longer responses)

Actions:
- Move complex terminal command outputs to `requestAnimationFrame` to avoid blocking
- Use `setTimeout(fn, 0)` to defer heavy chat HTML rendering after acknowledging input

### CLS (Cumulative Layout Shift)

Known risk areas:
- Images without explicit `width`/`height` attributes
- Fonts causing layout shifts on load

Actions:
- Add `width` + `height` to all `<img>` tags
- Use `font-display: optional` or `swap` with `size-adjust` fallback metrics

### Monitoring

Add the `web-vitals` library via inline script on the homepage only:

```html
<script type="module">
  import { onLCP, onINP, onCLS } from 'https://unpkg.com/web-vitals@4/dist/web-vitals.attribution.js';
  const log = (m) => console.info(`[vitals] ${m.name}: ${m.value.toFixed(1)}`);
  onLCP(log); onINP(log); onCLS(log);
</script>
```

This is dev-only monitoring. Remove before production unless connecting to an analytics endpoint.

---

## Service Worker and Offline

### Strategy

Implement a service worker that provides:
1. Cache-first for static assets (CSS, JS, fonts)
2. Stale-while-revalidate for HTML pages
3. Offline fallback page for when navigation fails

### sw.js

```javascript
const CACHE_NAME = 'marcoladeira-v1';
const STATIC_ASSETS = [
  '/',
  '/dist/styles.min.css',
  '/dist/script.min.js',
  '/dist/interactive.min.js',
  '/assets/fonts/inter-regular.woff2',
  '/assets/fonts/inter-bold.woff2',
  '/assets/fonts/inter-tight-bold.woff2',
  '/offline.html'
];

// Install: cache static assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for assets, stale-while-revalidate for HTML
self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/offline.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fresh = fetch(e.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return response;
      });
      return cached || fresh;
    })
  );
});
```

### Registration in script.js

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
```

### Offline page

Create `/offline.html` — a simple in-brand page saying the user is offline with links to cached content.

---

## Security Headers

GitHub Pages does not support `_headers` files (unlike Netlify/Vercel). However, a meta-tag based CSP can be added:

### Content Security Policy (via meta tag)

Add to `<head>` of every page:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'nonce-GENERATED_NONCE';
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  img-src 'self' data:;
  connect-src 'none';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
">
```

*Note: After self-hosting fonts, remove `fonts.googleapis.com` and `fonts.gstatic.com` from `style-src` and `font-src`.*

*Note: If inline scripts are needed (current pattern), use `unsafe-inline` as a fallback but prefer moving all JS to external files.*

### Other Security Meta Tags

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
<meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()">
```

---

## GitHub Actions CI/CD

### Extend existing workflow

Add a build step before deployment:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - run: npm ci
      
      - run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

---

## Progressive Enhancement Audit

The site should work at every level:

| Feature | Without JS | With JS (no interactive.js) | Full |
|---------|-----------|----------------------------|------|
| Navigation | ✅ links work | ✅ mobile nav works | ✅ page transitions |
| Content | ✅ readable | ✅ reveals animate | ✅ reading progress |
| Theme | ✅ OS default | ✅ persisted preference | ✅ keyboard shortcut |
| Terminal | ✅ not visible | ✅ available | ✅ full 55+ commands |
| Chat | ✅ not visible | ✅ available | ✅ full KB |
| Reading time | ❌ missing | ✅ calculated | ✅ displayed |
| TOC | ✅ headings navigable | ✅ TOC generated | ✅ active tracking |

Action: Add `<noscript>` CSS fallback that shows reading time as static text from a `data-` attribute set server-side (or via `new-post.js` during generation).

---

## Implementation Tasks by File

- `build.js` — new: core build script
- `package.json` — new: dev deps only (lightningcss, terser, sharp)
- `src/styles.css` — move source CSS here; HTML references `dist/styles.min.css`
- `src/script.js` — move source JS here
- `src/interactive.js` — move + split into modules in `src/interactive/`
- `sw.js` — new: service worker
- `offline.html` — new: offline fallback page
- `assets/fonts/` — new: self-hosted WOFF2 files
- `og-images/` — new: generated social preview images per page
- Every HTML file — update font refs, OG image refs, add security meta tags, add `width`/`height` to all images
- `.github/workflows/deploy.yml` — update: add build step
