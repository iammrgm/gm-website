// One-time migration script: pulls content + images from the live Framer site
// into src/content/work/*.md + public/images/work/<slug>/*.
// Not part of the runtime app — safe to delete once migration is verified.
import * as cheerio from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://garethmatthews.framer.website";

const SLUGS = [
  "crocs-kasina",
  "hlls-10k-projects",
  "mulaa-joans-atlantic",
  "you-studio",
  "g-shock-who-eats-art",
  "navinder-nangla",
  "genesys",
  "boogle-asia-tour",
  "e-gucewicz-genesis",
  "novelist-uniqlo",
  "novelist-casio-g-shock",
  "novelist-rinse-kfc",
  "novelist-boiler-room-o2",
  "novelist-new-era",
  "novelist-tours",
  "mercedes-benz",
  "ab-inbev-bees",
  "national-lottery",
  "coca-cola-piccadilly",
];

// Approximate innerText: block-level tags become line breaks.
function innerText($, root) {
  const BLOCK = new Set([
    "div", "p", "section", "article", "li", "h1", "h2", "h3", "h4", "h5", "h6", "br", "header", "footer",
  ]);
  let out = "";
  (function walk(node) {
    if (node.type === "text") {
      out += node.data;
      return;
    }
    if (node.type === "tag") {
      if (["script", "style", "noscript", "svg"].includes(node.tagName)) return;
      for (const child of node.children || []) walk(child);
      if (BLOCK.has(node.tagName)) out += "\n";
    }
  })(root);
  return out
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function between(text, startMarker, endMarker) {
  const s = text.indexOf(startMarker);
  if (s === -1) return "";
  const from = s + startMarker.length;
  const e = endMarker ? text.indexOf(endMarker, from) : -1;
  return (e === -1 ? text.slice(from) : text.slice(from, e)).trim();
}

function fieldAfter(text, label) {
  const idx = text.indexOf(label);
  if (idx === -1) return "";
  const rest = text.slice(idx + label.length).split("\n").filter(Boolean);
  return (rest[0] || "").trim();
}

async function downloadImage(url, destDir, name) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = path.extname(new URL(url).pathname) || ".jpg";
  const file = path.join(destDir, `${name}${ext}`);
  await writeFile(file, buf);
  return path.relative(path.join(process.cwd(), "public"), file);
}

async function extractOne(slug, order) {
  const url = `${BASE}/work/${slug}`;
  const html = await fetch(url).then((r) => r.text());
  const $ = cheerio.load(html);

  const title = $("title").text().replace(/\s*—\s*Gareth Matthews.*/, "").trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";

  const text = innerText($, $("body")[0]);

  const situation = between(text, "Situation\n", "\nWhat we built");
  const whatWeBuilt = between(text, "What we built\n", "\nWhat changed");
  const whatChanged = between(text, "What changed\n", "\nOutcome");
  const outcome = between(text, "Outcome\n", "\nCategory:");

  const category = fieldAfter(text, "Category:");
  const client = fieldAfter(text, "Client:");
  const duration = fieldAfter(text, "Duration:");
  const location = fieldAfter(text, "Location:");

  const EXCLUDED_HOSTS = [
    "instagram.com",
    "linkedin.com",
    "framer.com",
    "framer.link",
    "x.com",
    "twitter.com",
  ];
  let liveWebsite = "";
  $('a[target="_blank"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    if (!href || href.startsWith("mailto:")) return;
    if (EXCLUDED_HOSTS.some((h) => href.includes(h))) return;
    if (!liveWebsite) liveWebsite = href;
  });

  // Gallery images: scope to the region between the CMS field labels and the
  // "More Works" section, which is where this project's own gallery sits
  // (text content lives between "Situation" and "Category:", with no images).
  const mainHtml = between(html, "Category:", "More Works");
  const $$ = cheerio.load(`<div>${mainHtml}</div>`);
  const seen = new Set();
  const imageUrls = [];
  $$("img").each((_, el) => {
    const src = $$(el).attr("src");
    if (!src || !src.includes("framerusercontent.com/images/")) return;
    const clean = src.split("?")[0];
    if (seen.has(clean)) return;
    seen.add(clean);
    imageUrls.push(clean);
  });

  const destDir = path.join(process.cwd(), "public", "images", "work", slug);
  await mkdir(destDir, { recursive: true });

  const localImages = [];
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const rel = await downloadImage(imageUrls[i], destDir, `${i}`);
      localImages.push(`/${rel}`);
    } catch (e) {
      console.warn(`  image failed: ${imageUrls[i]} (${e.message})`);
    }
  }

  // Note: og:image is a single sitewide fallback (the author's portrait) on
  // this site, not a per-project image — use the project's own first gallery
  // image as its cover instead.
  const coverLocal = localImages[0] || "";

  const frontmatter = {
    title,
    slug,
    description: metaDescription,
    category,
    client,
    duration,
    location,
    liveUrl: liveWebsite,
    cover: coverLocal,
    images: localImages,
    order,
  };

  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        if (v.length === 0) return `${k}: []`;
        return `${k}:\n${v.map((x) => `  - ${JSON.stringify(x)}`).join("\n")}`;
      }
      return `${k}: ${JSON.stringify(v)}`;
    })
    .join("\n");

  const body = `## Situation\n\n${situation}\n\n## What we built\n\n${whatWeBuilt}\n\n## What changed\n\n${whatChanged}\n\n## Outcome\n\n${outcome}\n`;

  const md = `---\n${yaml}\n---\n\n${body}`;
  const contentDir = path.join(process.cwd(), "src", "content", "work");
  await mkdir(contentDir, { recursive: true });
  await writeFile(path.join(contentDir, `${slug}.md`), md, "utf-8");

  console.log(`✓ ${slug} (${localImages.length} images)`);
}

for (let i = 0; i < SLUGS.length; i++) {
  const slug = SLUGS[i];
  try {
    await extractOne(slug, i + 1);
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`);
  }
}
