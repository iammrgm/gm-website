// Small copies of images that are shown much smaller than their source.
// Runs before dev and build, so covers added through the CMS get theirs too.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const thumbPath = (p) => p.replace(/\.(webp|jpe?g|png)$/i, "-thumb.webp");

const sources = new Map();
const workDir = join(root, "src/content/work");
for (const f of readdirSync(workDir).filter((f) => f.endsWith(".mdoc"))) {
  const cover = readFileSync(join(workDir, f), "utf8").match(/^cover:\s*"?([^"\n]+)"?/m)?.[1];
  if (cover) sources.set(cover, 384);
}
for (const f of readdirSync(join(root, "public/images/about"))) {
  if (/\.(webp|jpe?g|png)$/i.test(f) && !f.includes("-thumb")) sources.set(`/images/about/${f}`, 720);
}

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("thumbs: sharp unavailable, skipping (committed thumbs are used)");
  process.exit(0);
}

let made = 0;
for (const [publicPath, width] of sources) {
  const src = join(root, "public", publicPath);
  const out = join(root, "public", thumbPath(publicPath));
  if (!existsSync(src)) continue;
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
  await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  made++;
}
console.log(`thumbs: ${made} made, ${sources.size} checked`);
