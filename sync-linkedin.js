#!/usr/bin/env node
/**
 * LinkedIn Post → Portfolio Sync Tool
 *
 * Since LinkedIn has no public API for post content, this tool
 * lets you paste a LinkedIn post and generates a portfolio update.
 *
 * Usage:
 *   node sync-linkedin.js
 *   node sync-linkedin.js --type update
 *   node sync-linkedin.js --type essay
 *   node sync-linkedin.js --check
 *   node sync-linkedin.js --help
 *
 * Workflow:
 *   1. Copy your LinkedIn post text
 *   2. Run this tool
 *   3. Paste the content when prompted
 *   4. Tool generates title, summary, slug, HTML page
 *   5. Auto-updates index pages and RSS feed
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ROOT = __dirname;
const WRITING_DIR = path.join(ROOT, "writing");
const UPDATES_DIR = path.join(ROOT, "updates");
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
LinkedIn Post → Portfolio Sync
──────────────────────────────
Usage:
  node sync-linkedin.js              Interactive mode (prompts for content)
  node sync-linkedin.js --type update   Create as update (default)
  node sync-linkedin.js --type essay    Create as writing/essay
  node sync-linkedin.js --check         Show sync status
  node sync-linkedin.js --help          Show this help

Workflow:
  1. Copy your LinkedIn post text
  2. Run this tool
  3. Paste content, press Enter then Ctrl+D (or type END on a new line)
  4. Confirm generated title and summary
  5. Tool creates HTML page and updates all index files
`);
    process.exit(0);
}

if (flags.check) {
    showSyncStatus();
    process.exit(0);
}

// ── Main flow ──

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

function readMultiline(prompt) {
    return new Promise(resolve => {
        console.log(prompt);
        console.log("  (Paste content, then type END on a new line and press Enter)\n");
        const lines = [];
        const lineHandler = line => {
            if (line.trim() === "END") {
                rl.removeListener("line", lineHandler);
                resolve(lines.join("\n"));
            } else {
                lines.push(line);
            }
        };
        rl.on("line", lineHandler);
    });
}

(async function main() {
    console.log("\n  ╔══════════════════════════════════════╗");
    console.log("  ║  LinkedIn → Portfolio Sync Tool      ║");
    console.log("  ╚══════════════════════════════════════╝\n");

    const type = flags.type || await ask("  Post type (update/essay) [update]: ") || "update";
    const isEssay = type.toLowerCase().startsWith("e");

    const content = await readMultiline("  Paste your LinkedIn post content:");

    if (!content.trim()) {
        console.log("\n  ✗ No content provided. Aborting.\n");
        rl.close();
        process.exit(1);
    }

    // Generate title from first line or sentence
    const firstLine = content.split("\n").find(l => l.trim().length > 0) || "";
    const autoTitle = firstLine.length > 80 ? firstLine.substring(0, 77) + "..." : firstLine;
    const title = await ask(`\n  Title [${autoTitle}]: `) || autoTitle;

    // Generate summary from first ~200 chars
    const cleanContent = content.replace(/\n+/g, " ").trim();
    const autoSummary = cleanContent.length > 180 ? cleanContent.substring(0, 177) + "..." : cleanContent;
    const summary = await ask(`  Summary [${autoSummary.substring(0, 60)}...]: `) || autoSummary;

    const dateStr = await ask(`  Date (YYYY-MM-DD) [${today()}]: `) || today();

    const slug = slugify(title);
    const dir = isEssay ? WRITING_DIR : UPDATES_DIR;
    const postDir = path.join(dir, slug);
    const postFile = path.join(postDir, "index.html");

    if (fs.existsSync(postDir)) {
        console.log(`\n  ✗ Directory already exists: ${slug}/`);
        console.log("  Choose a different title or delete the existing post.\n");
        rl.close();
        process.exit(1);
    }

    // Generate HTML content from LinkedIn post
    const htmlContent = convertToHtml(content);
    const displayDate = formatDate(dateStr);

    // Create post directory and file
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(postFile, buildPostHtml({
        title, summary, dateStr, displayDate, htmlContent, isEssay
    }));

    console.log(`\n  ✓ Created ${isEssay ? "writing" : "updates"}/${slug}/index.html`);

    // Update listing page
    const listingPath = path.join(dir, "index.html");
    if (fs.existsSync(listingPath)) {
        updateListingPage(listingPath, { title, summary, dateStr: displayDate, slug, isEssay });
        console.log(`  ✓ Updated ${isEssay ? "writing" : "updates"}/index.html`);
    }

    // Update homepage
    if (fs.existsSync(HOME_INDEX)) {
        updateHomepage({ title, summary, dateStr: displayDate, slug, isEssay });
        console.log("  ✓ Updated index.html (homepage)");
    }

    // Update RSS feed
    if (fs.existsSync(FEED_PATH)) {
        updateFeed({ title, summary, dateStr, slug, isEssay });
        console.log("  ✓ Updated feed.xml");
    }

    console.log(`\n  Done! Your LinkedIn post is now live as a portfolio ${isEssay ? "essay" : "update"}.`);
    console.log(`  URL: /${isEssay ? "writing" : "updates"}/${slug}/\n`);

    rl.close();
})();

// ── Helpers ──

function today() {
    return new Date().toISOString().split("T")[0];
}

function formatDate(str) {
    const d = new Date(str + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 60);
}

function convertToHtml(text) {
    // Split into paragraphs on double newlines
    const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    return paragraphs.map(p => {
        // Convert single newlines to <br>
        const lines = p.split("\n").map(l => l.trim()).join("<br>\n                        ");
        return `                        <p>${lines}</p>`;
    }).join("\n\n");
}

function buildPostHtml({ title, summary, dateStr, displayDate, htmlContent, isEssay }) {
    const safeTitle = escapeHtml(title);
    const safeSummary = escapeHtml(summary);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} | Marco Ladeira</title>
    <meta name="description" content="${safeSummary}">
    <link rel="canonical" href="https://marcoladeira.github.io/${isEssay ? "writing" : "updates"}/${slugify(title)}/">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeSummary}">
    <meta property="og:url" content="https://marcoladeira.github.io/${isEssay ? "writing" : "updates"}/${slugify(title)}/">
    <meta property="og:image" content="https://marcoladeira.github.io/images/facecardicon.jpg">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeSummary}">
    <link rel="icon" href="../../images/facecardicon.jpg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link rel="manifest" href="../../manifest.json">
    <meta name="theme-color" content="#1a1a1a">
    <link rel="stylesheet" href="../../styles.css">
</head>
<body data-page="writing" data-article>
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
                    <a class="site-nav__link" data-nav="writing" href="../../writing/">Writing</a>
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
        <article class="article-shell article-shell--page">
            <header class="page-hero reveal">
                <div class="page-hero__copy">
                    <p class="section-kicker">${isEssay ? "Essay" : "Update"}</p>
                    <h1>${safeTitle}</h1>
                    <div class="page-hero__meta">
                        <p>${displayDate}</p>
                    </div>
                </div>
            </header>

            <div class="article-body reveal">
                <section>
${htmlContent}
                </section>

                <hr>
                <p><em>Originally shared on <a href="https://www.linkedin.com/in/marco-ladeira/" target="_blank" rel="noopener">LinkedIn</a>.</em></p>
            </div>
        </article>
    </main>

    <footer class="site-footer">
        <div class="site-footer__inner">
            <p class="site-footer__year" data-year></p>
            <div class="site-footer__links">
                <a href="../../">Home</a>
                <a href="../../work/">Work</a>
                <a href="../../writing/">Writing</a>
                <a href="../../about/">About</a>
                <a href="../../contact/">Contact</a>
            </div>
        </div>
    </footer>

    <script src="../../script.js"></script>
    <script src="../../interactive.js"></script>
</body>
</html>`;
}

function updateListingPage(filePath, { title, summary, dateStr, slug, isEssay }) {
    let html = fs.readFileSync(filePath, "utf8");
    const entryHtml = `
                <article class="entry-row reveal">
                    <p class="entry-row__meta">${dateStr}</p>
                    <h3>${escapeHtml(title)}</h3>
                    <p>${escapeHtml(summary)}</p>
                    <a class="text-link" href="${slug}/">${isEssay ? "Read essay" : "Read update"}</a>
                </article>`;

    // Insert after the first <div class="entry-list">
    const marker = '<div class="entry-list">';
    const idx = html.indexOf(marker);
    if (idx !== -1) {
        const insertAt = idx + marker.length;
        html = html.substring(0, insertAt) + entryHtml + html.substring(insertAt);
        fs.writeFileSync(filePath, html);
    }
}

function updateHomepage({ title, summary, dateStr, slug, isEssay }) {
    let html = fs.readFileSync(HOME_INDEX, "utf8");
    const section = isEssay ? "writing" : "updates";
    const linkText = isEssay ? "Read essay" : "Read update";
    const prefix = isEssay ? "writing/" : "updates/";

    const entryHtml = `
                        <article class="entry-row">
                            <p class="entry-row__meta">${dateStr}</p>
                            <h3>${escapeHtml(title)}</h3>
                            <p>${escapeHtml(summary)}</p>
                            <a class="text-link" href="${prefix}${slug}/">${linkText}</a>
                        </article>`;

    // Find the right entry-list (writing is first, updates is second on homepage)
    const entryListMarker = '<div class="entry-list">';
    let searchFrom = 0;

    if (!isEssay) {
        // Updates is the second entry-list
        const firstIdx = html.indexOf(entryListMarker);
        if (firstIdx !== -1) searchFrom = firstIdx + entryListMarker.length;
    }

    const idx = html.indexOf(entryListMarker, searchFrom);
    if (idx !== -1) {
        const insertAt = idx + entryListMarker.length;
        html = html.substring(0, insertAt) + entryHtml + html.substring(insertAt);
        fs.writeFileSync(HOME_INDEX, html);
    }
}

function updateFeed({ title, summary, dateStr, slug, isEssay }) {
    let xml = fs.readFileSync(FEED_PATH, "utf8");
    const prefix = isEssay ? "writing" : "updates";
    const url = `https://marcoladeira.github.io/${prefix}/${slug}/`;
    const pubDate = new Date(dateStr + "T12:00:00Z").toUTCString();

    const itemXml = `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(summary)}</description>
    </item>`;

    const channelClose = "</channel>";
    const idx = xml.indexOf(channelClose);
    if (idx !== -1) {
        xml = xml.substring(0, idx) + itemXml + "\n  " + xml.substring(idx);
        fs.writeFileSync(FEED_PATH, xml);
    }
}

function showSyncStatus() {
    console.log("\n  LinkedIn → Portfolio Sync Status");
    console.log("  ────────────────────────────────\n");

    const updates = fs.existsSync(UPDATES_DIR) ?
        fs.readdirSync(UPDATES_DIR).filter(f => f !== "index.html" && fs.statSync(path.join(UPDATES_DIR, f)).isDirectory()) : [];
    const essays = fs.existsSync(WRITING_DIR) ?
        fs.readdirSync(WRITING_DIR).filter(f => f !== "index.html" && fs.statSync(path.join(WRITING_DIR, f)).isDirectory()) : [];

    console.log(`  Updates: ${updates.length}`);
    updates.forEach(u => console.log(`    • ${u}`));
    console.log(`\n  Essays:  ${essays.length}`);
    essays.forEach(e => console.log(`    • ${e}`));
    console.log("");
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeXml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
