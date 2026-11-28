// Local static preview with the same base path and 404 page as GitHub Pages.
// Usage: node scripts/serve.mjs [port] [root]
import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(process.argv[3] || fileURLToPath(new URL("../", import.meta.url)));
const BASE = "/MarcoLadeiraWebsite/";
const PORT = Number(process.argv[2] || process.env.PORT || 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".pdf": "application/pdf",
  ".mp4": "video/mp4", ".webm": "video/webm", ".ico": "image/x-icon",
};

async function publicFile(relative, pathname) {
  let file = resolve(ROOT, relative);
  if (file !== ROOT && !file.startsWith(ROOT + sep)) return null;
  try {
    let info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith("/")) return { redirect: pathname + "/" };
      file = resolve(file, "index.html");
      info = await stat(file);
    }
    return info.isFile() ? { file, size: info.size } : null;
  } catch {
    return null;
  }
}

function byteRange(value, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!m || (!m[1] && !m[2])) return null;
  const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
  const end = m[1] && m[2] ? Math.min(size - 1, Number(m[2])) : size - 1;
  return start <= end ? { start, end } : null;
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Bad request");
  }
  if (url.pathname === "/" || url.pathname === BASE.slice(0, -1)) {
    res.writeHead(301, { Location: BASE });
    return res.end();
  }
  const found = pathname.startsWith(BASE) ? await publicFile(pathname.slice(BASE.length), url.pathname) : null;
  if (!found) {
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    return res.end(await readFile(resolve(ROOT, "404.html")));
  }
  if (found.redirect) {
    res.writeHead(301, { Location: found.redirect });
    return res.end();
  }
  const { file, size } = found;
  const headers = {
    "Content-Type": TYPES[extname(file)] || "application/octet-stream",
    "Cache-Control": "no-cache",
    "Accept-Ranges": "bytes",
    "Content-Length": size,
  };
  const range = req.headers.range ? byteRange(req.headers.range, size) : undefined;
  if (range === null) {
    res.writeHead(416, { "Content-Range": `bytes */${size}` });
    return res.end();
  }
  if (range) {
    headers["Content-Length"] = range.end - range.start + 1;
    headers["Content-Range"] = `bytes ${range.start}-${range.end}/${size}`;
  }
  res.writeHead(range ? 206 : 200, headers);
  if (req.method === "HEAD") return res.end();
  const stream = createReadStream(file, range);
  res.on("close", () => stream.destroy());
  stream.on("error", (error) => res.destroy(error));
  stream.pipe(res);
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}${BASE}`));
