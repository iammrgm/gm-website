// One-off pass to shrink the extracted images down to sane web sizes.
// Keeps original filenames/extensions (so content frontmatter doesn't need
// to change) — just resizes and recompresses in place.
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOTS = [
  { dir: "public/images/work", maxWidth: 1800 },
  { dir: "public/images/about", maxWidth: 1600 },
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

for (const { dir, maxWidth } of ROOTS) {
  for await (const file of walk(dir)) {
    const ext = path.extname(file).toLowerCase();
    if (!IMG_EXT.has(ext)) continue;

    const before = (await stat(file)).size;
    const buf = await sharp(file)
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .toBuffer();

    let out = sharp(buf);
    if (ext === ".png") out = out.png({ compressionLevel: 9, quality: 82 });
    else if (ext === ".webp") out = out.webp({ quality: 82 });
    else out = out.jpeg({ quality: 82, mozjpeg: true });

    const finalBuf = await out.toBuffer();
    await sharp(finalBuf).toFile(file + ".tmp");
    await import("node:fs/promises").then((fs) => fs.rename(file + ".tmp", file));

    const after = (await stat(file)).size;
    totalBefore += before;
    totalAfter += after;
    console.log(
      `${file}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`
    );
  }
}

console.log(
  `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
);
