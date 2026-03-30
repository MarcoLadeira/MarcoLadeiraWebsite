#!/usr/bin/env node
/**
 * Blog Post / Update Generator
 * 
 * Usage:
 *   node new-post.js --type essay --title "My new essay"
 *   node new-post.js --type update --title "Quick update on work"
 *   node new-post.js --list
 * 
 * Options:
 *   --type      "essay" or "update" (default: update)
 *   --title     Title of the post (required for new posts)
 *   --summary   Short summary/description
 *   --date      Date in YYYY-MM-DD format (default: today)
 *   --list      List all existing posts
 *   --help      Show help
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const WRITING_DIR = path.join(ROOT, "writing");
const UPDATES_DIR = path.join(ROOT, "updates");
const WRITING_INDEX = path.join(WRITING_DIR, "index.html");
const UPDATES_INDEX = path.join(UPDATES_DIR, "index.html");
const HOME_INDEX = path.join(ROOT, "index.html");
const FEED_PATH = path.join(ROOT, "feed.xml");

// ── Parse CLI args ──

const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
        const key = args[i].slice(2);
        if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
            flags[key] = args[++i];
        } else {
            flags[key] = true;
        }
    }
}

if (flags.help) {
    console.log(`
Blog Post / Update Generator
────────────────────────────
Usage:
  node new-post.js --type essay --title "My new essay" --summary "A deep dive into..."
  node new-post.js --type update --title "Quick update"
  node new-post.js --list

Options:
  --type      "essay" or "update" (default: update)
  --title     Title of the post (required)
  --summary   Short summary/description (optional, auto-generated if omitted)
  --date      Date in YYYY-MM-DD (default: today)
  --list      List all existing posts
  --help      Show this help
`);
    process.exit(0);
}

if (flags.list) {
    listPosts();
    process.exit(0);
}

if (!flags.title) {
    console.error("Error: --title is required. Use --help for usage.");
    process.exit(1);
}

const type = flags.type || "update";
const title = flags.title;
const summary = flags.summary || title;
const dateStr = flags.date || new Date().toISOString().slice(0, 10);

if (!["essay", "update"].includes(type)) {
    console.error('Error: --type must be "essay" or "update"');
    process.exit(1);
}

// ── Helpers ──

function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function formatDate(dateString) {
    const d = new Date(dateString + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatRssDate(dateString) {
    const d = new Date(dateString + "T00:00:00Z");
    return d.toUTCString();
}

function sanitize(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Generate post ──

const slug = slugify(title);
const baseDir = type === "essay" ? WRITING_DIR : UPDATES_DIR;
const postDir = path.join(baseDir, slug);
const humanDate = formatDate(dateStr);

if (fs.existsSync(postDir)) {
    console.error(`Error: Post directory already exists: ${postDir}`);
    process.exit(1);
}

// Create the article HTML
const articleLabel = type === "essay" ? "Essay" : "Update";
const parentHref = type === "essay" ? "../" : "../../writing/";
const backLabel = type === "essay" ? "Writing" : "Updates";
const backHref = type === "essay" ? "../" : "../";
const baseUrl = "https://marcoladeira.github.io";
const canonicalUrl = type === "essay"
    ? `${baseUrl}/writing/${slug}/`
    : `${baseUrl}/updates/${slug}/`;

const postHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sanitize(title)} | Marco Ladeira</title>
    <meta name="description" content="${sanitize(summary)}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${sanitize(title)} | Marco Ladeira">
    <meta property="og:description" content="${sanitize(summary)}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:image" content="${baseUrl}/images/facecardicon.jpg">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${sanitize(title)} | Marco Ladeira">
    <meta name="twitter:description" content="${sanitize(summary)}">
    <link rel="icon" href="../../images/facecardicon.jpg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="manifest" href="../../manifest.json">
    <meta name="theme-color" content="#1a1a1a">
    <link rel="stylesheet" href="../../styles.css">
</head>
<body data-page="writing" data-article="${type === "essay" ? "essay" : "update"}">
    <a class="skip-link" href="#main-content">Skip to content</a>

    <header class="site-header" id="site-header">
        <div class="site-header__inner">
            <a class="brand" href="../../">Marco Ladeira</a>

            <nav class="site-nav" aria-label="Primary">
                <button class="site-nav__toggle" type="button" aria-expanded="false" aria-controls="site-nav-list" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                </button>

                <div class="site-nav__list" id="site-nav-list">
                    <a class="site-nav__link" data-nav="work" href="../../work/">Work</a>
                    <a class="site-nav__link" data-nav="writing" href="${type === "essay" ? "../" : "../../writing/"}">Writing</a>
                    <a class="site-nav__link" data-nav="about" href="../../about/">About</a>
                    <a class="site-nav__link" data-nav="now" href="../../now/">Now</a>
                    <a class="site-nav__link" data-nav="contact" href="../../contact/">Contact</a>
                </div>
            </nav>

            <button class="terminal-toggle" type="button" aria-label="Open terminal"><span class="terminal-toggle__icon">&gt;_</span><span class="terminal-toggle__label">Terminal</span></button>
            <button class="theme-toggle" type="button" aria-pressed="false" aria-label="Toggle theme">Mode</button>
        </div>
    </header>

    <main class="site-main" id="main-content" tabindex="-1">
        <section class="page-hero page-hero--entry reveal">
            <div class="page-hero__copy">
                <p class="section-kicker">${articleLabel}</p>
                <h1>${sanitize(title)}</h1>
                <p class="page-hero__summary">
                    ${sanitize(summary)}
                </p>
            </div>

            <div class="page-hero__meta">
                <p>${humanDate}</p>
            </div>
        </section>

        <article class="section section--article">
            <div class="article-shell${type === "essay" ? "" : "--page"}">
                ${type === "essay" ? `<aside class="article-aside">
                    <nav class="article-note">
                        <p class="article-note__label">Contents</p>
                        <div class="article-toc" data-toc hidden></div>
                    </nav>
                </aside>` : ""}

                <div class="article-body">
                    <!-- Write your content here -->
                    <p>
                        Start writing your ${type} here. Use standard HTML: &lt;h2&gt; for sections,
                        &lt;p&gt; for paragraphs, &lt;ul&gt;/&lt;ol&gt; for lists.
                    </p>

                    <h2>First section</h2>
                    <p>
                        Your content goes here.
                    </p>
                </div>
            </div>

            <nav class="article-pagination reveal" aria-label="More ${type === "essay" ? "essays" : "updates"}">
                <a class="article-pagination__link article-pagination__link--prev" href="${backHref}">
                    <span class="article-pagination__label">Back to ${backLabel.toLowerCase()}</span>
                    <span class="article-pagination__title">All ${backLabel.toLowerCase()}</span>
                </a>
            </nav>
        </article>
    </main>

    <footer class="site-footer">
        <div class="site-footer__inner">
            <p class="site-footer__year" data-year></p>
            <div class="site-footer__links">
                <a href="../../">Home</a>
                <a href="${type === "essay" ? "../" : "../../writing/"}">Writing</a>
                <a href="${type === "essay" ? "../../updates/" : "../"}">Updates</a>
                <a href="../../about/">About</a>
                <a href="../../contact/">Contact</a>
            </div>
        </div>
    </footer>

    <script src="../../script.js"></script>
    <script src="../../interactive.js"></script>
</body>
</html>`;

fs.mkdirSync(postDir, { recursive: true });
fs.writeFileSync(path.join(postDir, "index.html"), postHtml);

console.log(`\n  Created: ${path.relative(ROOT, postDir)}/index.html`);

// ── Update listing page ──

const listingPath = type === "essay" ? WRITING_INDEX : UPDATES_INDEX;
const listingHtml = fs.readFileSync(listingPath, "utf8");

if (type === "essay") {
    // Insert new essay into the feature-list, after the opening div
    const marker = '<div class="feature-list">';
    const newEntry = `<div class="feature-list">
                <article class="feature-row feature-row--featured reveal">
                    <div class="feature-row__meta">
                        <span>Essay</span>
                        <span>${humanDate}</span>
                    </div>
                    <div class="feature-row__content">
                        <h3>${sanitize(title)}</h3>
                        <p>
                            ${sanitize(summary)}
                        </p>
                    </div>
                    <div class="feature-row__links">
                        <a class="text-link" href="${slug}/">Read essay</a>
                    </div>
                </article>`;
    fs.writeFileSync(listingPath, listingHtml.replace(marker, newEntry));
    console.log(`  Updated: writing/index.html (added listing)`);
} else {
    // Insert new update entry at top of entry-list
    const marker = '<div class="entry-list">';
    const firstOccurrence = listingHtml.indexOf(marker);
    if (firstOccurrence !== -1) {
        const newEntry = `<div class="entry-list">
                <article class="entry-row reveal">
                    <p class="entry-row__meta">${humanDate}</p>
                    <h3>${sanitize(title)}</h3>
                    <p>${sanitize(summary)}</p>
                    <a class="text-link" href="${slug}/">Read update</a>
                </article>`;
        const updated = listingHtml.slice(0, firstOccurrence) +
            newEntry +
            listingHtml.slice(firstOccurrence + marker.length);
        fs.writeFileSync(listingPath, updated);
        console.log(`  Updated: updates/index.html (added listing)`);
    }
}

// ── Update RSS feed ──

if (fs.existsSync(FEED_PATH)) {
    let feed = fs.readFileSync(FEED_PATH, "utf8");
    const rssItem = `
        <item>
            <title>${sanitize(title)}</title>
            <description>${sanitize(summary)}</description>
            <link>${canonicalUrl}</link>
            <guid>${canonicalUrl}</guid>
            <pubDate>${formatRssDate(dateStr)}</pubDate>
        </item>`;

    // Insert after the lastBuildDate tag, before the first <item>
    const firstItem = feed.indexOf("<item>");
    if (firstItem !== -1) {
        feed = feed.slice(0, firstItem) + rssItem.trim() + "\n\n        " + feed.slice(firstItem);
    }

    // Update lastBuildDate
    feed = feed.replace(
        /<lastBuildDate>.*?<\/lastBuildDate>/,
        `<lastBuildDate>${formatRssDate(dateStr)}</lastBuildDate>`
    );

    fs.writeFileSync(FEED_PATH, feed);
    console.log(`  Updated: feed.xml (added RSS entry)`);
}

// ── Update sitemap ──

const sitemapPath = path.join(ROOT, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
    let sitemap = fs.readFileSync(sitemapPath, "utf8");
    const newUrl = `    <url>
        <loc>${canonicalUrl}</loc>
        <changefreq>monthly</changefreq>
        <priority>${type === "essay" ? "0.8" : "0.6"}</priority>
    </url>`;
    sitemap = sitemap.replace("</urlset>", newUrl + "\n</urlset>");
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`  Updated: sitemap.xml`);
}

console.log(`\n  Done! Edit ${path.relative(ROOT, postDir)}/index.html to write your content.\n`);

// ── List posts ──

function listPosts() {
    console.log("\n  Essays:");
    console.log("  ────────");
    const essayDirs = fs.readdirSync(WRITING_DIR).filter(d =>
        fs.statSync(path.join(WRITING_DIR, d)).isDirectory()
    );
    if (essayDirs.length === 0) console.log("  (none)");
    essayDirs.forEach(d => console.log(`  - writing/${d}/`));

    console.log("\n  Updates:");
    console.log("  ────────");
    const updateDirs = fs.readdirSync(UPDATES_DIR).filter(d =>
        fs.statSync(path.join(UPDATES_DIR, d)).isDirectory()
    );
    if (updateDirs.length === 0) console.log("  (none)");
    updateDirs.forEach(d => console.log(`  - updates/${d}/`));
    console.log();
}
