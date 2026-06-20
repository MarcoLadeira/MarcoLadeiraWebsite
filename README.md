# Marco Ladeira Portfolio

Static personal portfolio for Marco Ladeira, focused on software engineering work, writing, updates, contact paths, and resume access.

Live site: https://marcoladeira.github.io/MarcoLadeiraWebsite/

## What It Shows

- Current positioning as a full-stack software engineer.
- Selected work across enterprise software, NASA Space Explorer, mobile, and game experiments.
- Writing and update pages covering engineering workflows, AI tooling, and career milestones.
- Contact page with email, LinkedIn, GitHub, and resume download links.
- SEO and social sharing metadata for the main pages.

## Tech Stack

- HTML
- CSS
- JavaScript
- GitHub Pages
- RSS, sitemap, robots.txt, and static metadata

## Structure

```text
.
|-- index.html
|-- about/
|-- work/
|-- contact/
|-- writing/
|-- updates/
|-- assets/
|-- images/
|-- styles.css
|-- script.js
|-- sitemap.xml
|-- robots.txt
`-- feed.xml
```

## Run Locally

No build step is required. Serve the folder with any static file server:

```bash
npx serve .
```

Then open the local URL printed by the server.

## Deployment

The site is deployed with GitHub Pages from the `master` branch.

```bash
git add .
git commit -m "docs: update portfolio documentation"
git push origin master
```

## Quality Notes

- Keep project links, contact links, and resume paths current.
- Keep page titles and meta descriptions aligned with the current role narrative.
- Prefer concise project writeups over long marketing copy.
- When adding new work, update the homepage, work page, sitemap, and feed if relevant.
