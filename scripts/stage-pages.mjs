import { cpSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist", "pages");
if (!output.startsWith(resolve(root, "dist") + sep)) throw new Error("Invalid Pages output folder");

const generated = JSON.parse(readFileSync(join(root, "src/.build-manifest.json"), "utf8"));
const publicFiles = [
  ".nojekyll",
  "apple-touch-icon.png",
  "favicon.svg",
  "favicon-32.png",
  "icon-192.png",
  "icon-512.png",
  ...generated,
];
const valid = /^(?:(?:[a-z0-9-]+\/)*(?:index|404)\.html|(?:sitemap|feed)\.xml|robots\.txt|manifest\.json|\.nojekyll|favicon\.svg|(?:favicon-32|apple-touch-icon|icon-192|icon-512)\.png)$/;

for (const file of publicFiles) {
  if (!valid.test(file)) throw new Error(`Unexpected public file: ${file}`);
}
rmSync(output, { recursive: true, force: true });
for (const file of publicFiles) {
  const destination = join(output, file);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(join(root, file), destination);
}
cpSync(join(root, "assets"), join(output, "assets"), { recursive: true });
console.log(`Staged ${publicFiles.length} public files and runtime assets in ${output}`);
