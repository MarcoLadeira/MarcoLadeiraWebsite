/**
 * LinkedIn Post Sync Script
 * 
 * This script fetches LinkedIn posts and writes them as JSON to content/posts/.
 * It then injects the latest posts into index.html as a "LinkedIn" section.
 * 
 * --- HOW TO SET UP ---
 * 
 * Since LinkedIn's API requires OAuth and is complex to set up for personal use,
 * this script supports multiple data source strategies:
 * 
 * OPTION A: Manual JSON feed (simplest)
 *   1. Create a JSON file hosted anywhere (GitHub Gist, S3, etc.)
 *   2. Format: [{ "text": "...", "date": "2026-03-29", "url": "https://linkedin.com/..." }]
 *   3. Set LINKEDIN_POSTS_URL secret in your repo to point to that raw JSON URL
 *   4. When you make a LinkedIn post, update the JSON file — GitHub Actions does the rest
 * 
 * OPTION B: RSS bridge (automated, no OAuth)
 *   1. Use a service like rss.app, feedspot, or a self-hosted RSS bridge
 *      that converts your LinkedIn public profile into an RSS/JSON feed
 *   2. Set LINKEDIN_POSTS_URL to the RSS/JSON feed URL
 *   3. Posts sync automatically every 6 hours
 * 
 * OPTION C: LinkedIn API with OAuth (most complex, fully automated)
 *   1. Create a LinkedIn app at https://developer.linkedin.com/
 *   2. Obtain long-lived access token  
 *   3. Set LINKEDIN_ACCESS_TOKEN secret in your repo
 *   4. Uncomment the LinkedIn API section below and comment out the URL fetch
 * 
 * --- REPO SECRETS NEEDED ---
 *   LINKEDIN_POSTS_URL - URL to a JSON feed of your LinkedIn posts (Options A/B)
 *   or
 *   LINKEDIN_ACCESS_TOKEN - LinkedIn OAuth token (Option C)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const POSTS_DIR = path.join(__dirname, '..', '..', 'content', 'posts');
const INDEX_PATH = path.join(__dirname, '..', '..', 'index.html');

function fetch(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetch(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
                }
            });
            res.on('error', reject);
        }).on('error', reject);
    });
}

function sanitize(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

async function main() {
    const postsUrl = process.env.LINKEDIN_POSTS_URL;

    if (!postsUrl) {
        console.log('LINKEDIN_POSTS_URL not set. Skipping sync.');
        console.log('See .github/scripts/sync-linkedin.js for setup instructions.');
        process.exit(0);
    }

    console.log('Fetching LinkedIn posts...');
    let rawData;
    try {
        rawData = await fetch(postsUrl);
    } catch (err) {
        console.error('Failed to fetch posts:', err.message);
        process.exit(1);
    }

    let posts;
    try {
        posts = JSON.parse(rawData);
    } catch {
        console.error('Failed to parse JSON response');
        process.exit(1);
    }

    if (!Array.isArray(posts)) {
        console.error('Expected an array of posts');
        process.exit(1);
    }

    // Validate and normalize post structure
    posts = posts
        .filter(p => p && typeof p.text === 'string' && typeof p.date === 'string')
        .map(p => ({
            text: p.text.slice(0, 500),
            date: p.date,
            url: p.url || null
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10); // Keep latest 10

    // Write posts to content/posts/
    if (!fs.existsSync(POSTS_DIR)) {
        fs.mkdirSync(POSTS_DIR, { recursive: true });
    }

    fs.writeFileSync(
        path.join(POSTS_DIR, 'linkedin.json'),
        JSON.stringify(posts, null, 2)
    );

    console.log(`Wrote ${posts.length} posts to content/posts/linkedin.json`);

    // Generate HTML snippet for the latest 3 posts
    const latestPosts = posts.slice(0, 3);
    if (latestPosts.length === 0) {
        console.log('No posts to inject');
        return;
    }

    const postsHtml = latestPosts.map(post => {
        const dateObj = new Date(post.date);
        const dateStr = dateObj.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        const excerpt = sanitize(post.text.length > 180 ? post.text.slice(0, 177) + '...' : post.text);
        const linkHtml = post.url
            ? `\n                            <a class="text-link" href="${sanitize(post.url)}" target="_blank" rel="noopener">View on LinkedIn</a>`
            : '';

        return `                        <article class="entry-row">
                            <p class="entry-row__meta">${sanitize(dateStr)}</p>
                            <p>${excerpt}</p>${linkHtml}
                        </article>`;
    }).join('\n\n');

    // Read index.html and inject/replace LinkedIn section
    let indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');

    const sectionHtml = `<!-- LINKEDIN-POSTS-START -->
        <section class="section reveal" id="linkedin">
            <div class="section-heading section-heading--inline">
                <div>
                    <p class="section-kicker">LinkedIn</p>
                    <h2>Recent posts.</h2>
                </div>
                <a class="text-link" href="https://www.linkedin.com/in/marco-ladeira/" target="_blank" rel="noopener">Follow on LinkedIn</a>
            </div>

            <div class="entry-list">
${postsHtml}
                    </div>
        </section>
        <!-- LINKEDIN-POSTS-END -->`;

    // Check if markers already exist
    const startMarker = '<!-- LINKEDIN-POSTS-START -->';
    const endMarker = '<!-- LINKEDIN-POSTS-END -->';

    if (indexHtml.includes(startMarker)) {
        // Replace existing section
        const regex = new RegExp(
            startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            '[\\s\\S]*?' +
            endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );
        indexHtml = indexHtml.replace(regex, sectionHtml);
        console.log('Updated existing LinkedIn section in index.html');
    } else {
        // Insert before the contact section
        const contactAnchor = '<section class="section section--contact';
        if (indexHtml.includes(contactAnchor)) {
            indexHtml = indexHtml.replace(
                contactAnchor,
                sectionHtml + '\n\n        ' + contactAnchor
            );
            console.log('Inserted LinkedIn section before contact in index.html');
        } else {
            console.log('Could not find contact section to insert LinkedIn posts before');
        }
    }

    fs.writeFileSync(INDEX_PATH, indexHtml);
    console.log('Done.');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
