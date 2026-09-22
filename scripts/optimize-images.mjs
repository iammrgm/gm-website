// Re-encodes every work/about image as WebP at a size that matches how it's
// actually displayed (small cover thumbnails, a 2-col gallery grid — nothing
// on the site renders these above ~1400px wide even at 2x). Converts PNG/JPG
// source files to .webp in place and prints an old-path -> new-path map so
// content frontmatter can be updated to match.
import sharp from "sharp";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import path from "node:path";

const ROOTS = [
  { dir: "public/images/work", maxWidth: 1400 },
  { dir: "public/images/about", maxWidth: 1200 },
];

const IMG_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let totalBefore = 0;
let totalAfter = 0;
const renames = [];

for (const { dir, maxWidth } of ROOTS) {
  for await (const file of walk(dir)) {
    const ext = path.extname(file).toLowerCase();
    if (!IMG_EXT.has(ext)) continue;

    const before = (await stat(file)).size;
    const target = file.slice(0, -ext.length) + ".webp";

    await sharp(file)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(target + ".tmp");
    await rename(target + ".tmp", target);
    if (target !== file) await unlink(file);

    const after = (await stat(target)).size;
    totalBefore += before;
    totalAfter += after;
    if (target !== file) renames.push([file, target]);
    console.log(
      `${file}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${target}: ${(after / 1024 / 1024).toFixed(2)}MB`
    );
  }
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
);
console.log(`\n${renames.length} files renamed:`);
for (const [from, to] of renames) console.log(`${from} -> ${to}`);
