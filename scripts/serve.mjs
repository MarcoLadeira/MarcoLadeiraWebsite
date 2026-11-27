// Local static server that mimics GitHub Pages for this repo:
// serves the repo root under /MarcoLadeiraWebsite/, resolves directory indexes,
// and returns 404.html with a 404 status for anything missing.
// Usage: node scripts/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const BASE = "/MarcoLadeiraWebsite/";
const PORT = Number(process.argv[2] || process.env.PORT || 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".pdf": "application/pdf",
  ".mp4": "video/mp4", ".ico": "image/x-icon",
};

async function resolve(pathname) {
  let p = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(ROOT, p);
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!pathname.endsWith("/")) return { redirect: pathname + "/" };
      file = join(file, "index.html");
      await stat(file);
    }
    return { file };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Bad request");
  }
  if (url.pathname === "/" || url.pathname === BASE.slice(0, -1)) {
    res.writeHead(301, { Location: BASE });
    return res.end();
  }
  if (!url.pathname.startsWith(BASE)) {
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    return res.end(await readFile(join(ROOT, "404.html")));
  }
  const r = await resolve(url.pathname.slice(BASE.length - 1));
  if (r?.redirect) {
    res.writeHead(301, { Location: BASE.slice(0, -1) + r.redirect });
    return res.end();
  }
  if (!r) {
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    return res.end(await readFile(join(ROOT, "404.html")));
  }
  const body = await readFile(r.file);
  res.writeHead(200, { "Content-Type": TYPES[extname(r.file)] || "application/octet-stream", "Cache-Control": "no-cache" });
  res.end(body);
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}${BASE}`));
