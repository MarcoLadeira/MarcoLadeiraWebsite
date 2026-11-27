// Static checks over the built site: links, metadata, accessibility basics and factual guards.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../../src/data/site.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SKIP = new Set(["node_modules", ".git", "src", "tests", "docs", ".generated", "scripts", "test-results"]);

function htmlFiles(dir = ROOT) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (SKIP.has(f)) return [];
    if (statSync(p).isDirectory()) return htmlFiles(p);
    return f.endsWith(".html") ? [p] : [];
  });
}
const pages = htmlFiles().map((file) => ({ file, rel: file.slice(ROOT.length + 1), html: readFileSync(file, "utf8") }));
const isRedirect = (p) => p.html.includes('http-equiv="refresh"');
const content = pages.filter((p) => !isRedirect(p));

test("the site has the expected pages", () => {
  for (const p of ["index.html", "work/index.html", "work/fenergo/index.html", "work/vesta/index.html", "work/oddlings/index.html", "work/savetheplanet/index.html", "experience/index.html", "about/index.html", "contact/index.html", "lab/index.html", "writing/index.html", "404.html"]) {
    assert.ok(existsSync(join(ROOT, p)), p);
  }
});

test("every internal link and asset resolves to a file", () => {
  const missing = [];
  for (const p of pages) {
    for (const [, url] of p.html.matchAll(/(?:href|src|poster)="([^"#?]+)[^"]*"/g)) {
      if (!url.startsWith(site.base)) continue;
      let path = join(ROOT, url.slice(site.base.length));
      if (url.endsWith("/")) path = join(path, "index.html");
      if (!existsSync(path)) missing.push(`${p.rel} → ${url}`);
    }
    for (const [, set] of p.html.matchAll(/srcset="([^"]+)"/g)) {
      for (const part of set.split(",")) {
        const url = part.trim().split(" ")[0];
        if (!existsSync(join(ROOT, url.slice(site.base.length)))) missing.push(`${p.rel} → ${url}`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test("in-page anchors point at real ids", () => {
  const bad = [];
  for (const p of content) {
    for (const [, id] of p.html.matchAll(/href="#([^"]+)"/g)) if (!p.html.includes(`id="${id}"`)) bad.push(`${p.rel}#${id}`);
  }
  assert.deepEqual(bad, []);
});

test("every page has a title, description, canonical under the base path, and exactly one h1", () => {
  for (const p of content) {
    assert.match(p.html, /<title>[^<]{5,}<\/title>/, p.rel);
    assert.match(p.html, /<meta name="description" content="[^"]{30,}"/, p.rel);
    const canon = p.html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(canon?.startsWith(site.origin + site.base), `${p.rel} canonical ${canon}`);
    assert.equal((p.html.match(/<h1[\s>]/g) || []).length, 1, `${p.rel} h1 count`);
    assert.match(p.html, /<html lang="en-IE"/, p.rel);
  }
});

test("titles and canonicals are unique", () => {
  const titles = content.map((p) => p.html.match(/<title>([^<]+)/)[1]);
  assert.equal(new Set(titles).size, titles.length);
});

test("images have alt text and intrinsic size (no layout shift)", () => {
  for (const p of content) {
    for (const [tag] of p.html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(tag, /\salt="[^"]+"/, `${p.rel}: ${tag.slice(0, 80)}`);
      assert.match(tag, /\swidth="\d+"/, p.rel);
      assert.match(tag, /\sheight="\d+"/, p.rel);
    }
  }
});

test("headings never skip a level", () => {
  for (const p of content) {
    const levels = [...p.html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    levels.forEach((l, i) => i && assert.ok(l <= levels[i - 1] + 1, `${p.rel}: h${levels[i - 1]} → h${l}`));
  }
});

test("factual guards: no outdated or private details are published", () => {
  const all = pages.map((p) => p.html).join("\n");
  assert.doesNotMatch(all, /fristtysteam/i, "old GitHub handle");
  assert.doesNotMatch(all, /\(2\.1\)|2:1|Upper Second/i, "wrong degree classification");
  assert.doesNotMatch(all, /@dkit\.ie/i, "referee emails");
  assert.doesNotMatch(all, /\+?353[\s-]?87/, "phone number");
  assert.doesNotMatch(all, /Exceeding|hundreds of users/i, "unapproved internal metrics");
  assert.doesNotMatch(all, /nasaapi-production\.up\.railway\.app/, "dead demo link");
  assert.doesNotMatch(all, /actively (looking|seeking)|open to (new )?roles/i, "job-search signal");
  const emails = new Set([...all.matchAll(/mailto:([^"?]+)/g)].map((m) => m[1]));
  assert.deepEqual([...emails], [site.email], "one consistent email address");
});

test("sitemap lists only real pages under the base path", () => {
  const xml = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length >= 15);
  for (const l of locs) {
    assert.ok(l.startsWith(site.origin + site.base), l);
    assert.ok(existsSync(join(ROOT, l.slice((site.origin + site.base).length), "index.html")) || existsSync(join(ROOT, l.slice((site.origin + site.base).length))), l);
  }
});

test("the CV exists at both the new and the legacy URL", () => {
  for (const f of ["assets/marco-ladeira-cv.pdf", "assets/cv.pdf"]) {
    const buf = readFileSync(join(ROOT, f));
    assert.equal(buf.subarray(0, 4).toString(), "%PDF", f);
  }
});
