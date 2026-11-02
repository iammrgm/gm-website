// Small copies of images that are shown much smaller than their source.
// Runs before dev and build, so covers added through the CMS get theirs too.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
// Each source maps to [width, suffix]. "-thumb" copies are small previews; "-800" copies are the
// card-size versions the work grid and feature strip serve through srcset.
const outPath = (p, suffix) => p.replace(/\.(webp|jpe?g|png)$/i, `${suffix}.webp`);

const sources = new Map();
const workDir = join(root, "src/content/work");
for (const f of readdirSync(workDir).filter((f) => f.endsWith(".mdoc"))) {
  const cover = readFileSync(join(workDir, f), "utf8").match(/^cover:\s*"?([^"\n]+)"?/m)?.[1];
  if (cover) sources.set(cover, [384, "-thumb"]);
  // DEPARTMNT card photos: the first room image of each project.
  const room = readFileSync(join(workDir, f), "utf8").match(/^\s*room:\s*\n\s*-\s*image:\s*"?([^"\n]+)"?/m)?.[1];
  if (room) sources.set(room, [800, "-800"]);
}
for (const f of readdirSync(join(root, "public/images/work/crocs-kasina"))) {
  if (/^feature-[^.]+\.webp$/.test(f) && !/-800\.webp$/.test(f)) sources.set(`/images/work/crocs-kasina/${f}`, [800, "-800"]);
}
for (const f of readdirSync(join(root, "public/images/about"))) {
  if (/\.(webp|jpe?g|png)$/i.test(f) && !f.includes("-thumb")) sources.set(`/images/about/${f}`, [720, "-thumb"]);
}

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("thumbs: sharp unavailable, skipping (committed thumbs are used)");
  process.exit(0);
}

let made = 0;
for (const [publicPath, [width, suffix]] of sources) {
  const src = join(root, "public", publicPath);
  const out = join(root, "public", outPath(publicPath, suffix));
  if (!existsSync(src)) continue;
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
  await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  made++;
}
console.log(`thumbs: ${made} made, ${sources.size} checked`);
