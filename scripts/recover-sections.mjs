// Recovers Brief / What We Built / Outcome body text from the live
// source site for pages where the original extraction left sections
// empty. Root cause: not every source page has a literal "Situation"
// heading — some just open straight into the intro paragraph — so the
// original between("Situation", "What we built") lookup returned
// nothing. This re-derives the same three blocks more robustly.
import * as cheerio from "cheerio";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://garethmatthews.framer.website";

const TARGETS = [
  "ab-inbev-bees",
  "boogle-asia-tour",
  "coca-cola-piccadilly",
  "e-gucewicz-genesis",
  "g-shock-who-eats-art",
  "genesys",
  "mulaa-joans-atlantic",
  "national-lottery",
  "navinder-nangla",
  "novelist-boiler-room-o2",
  "novelist-casio-g-shock",
  "novelist-new-era",
  "novelist-rinse-kfc",
  "novelist-uniqlo",
  "you-studio",
];

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

// Find a heading line by exact match against a set of accepted phrasings.
function findHeadingIndex(lines, phrasings, fromIndex = 0) {
  for (let i = fromIndex; i < lines.length; i++) {
    if (phrasings.some((p) => lines[i].toLowerCase() === p.toLowerCase())) return i;
  }
  return -1;
}

async function recoverOne(slug) {
  const html = await fetch(`${BASE}/work/${slug}`).then((r) => r.text());
  const $ = cheerio.load(html);
  const text = innerText($, $("body")[0]);
  const lines = text.split("\n");

  const catIdx = findHeadingIndex(lines, ["Category:"]);
  const scopeEnd = catIdx === -1 ? lines.length : catIdx;

  // Find the start: first line after the "<Title> /" and date line.
  const dateLineIdx = lines.findIndex((l) => /^[A-Z][a-z]+day, /.test(l));
  const startIdx = dateLineIdx === -1 ? 0 : dateLineIdx + 1;

  const builtIdx = findHeadingIndex(lines, ["What we built", "What I did"], startIdx);
  const changedIdx = findHeadingIndex(lines, ["What changed"], builtIdx === -1 ? startIdx : builtIdx);
  const outcomeIdx = findHeadingIndex(lines, ["Outcome"], startIdx);

  if (builtIdx === -1 || outcomeIdx === -1) {
    console.warn(`  ${slug}: couldn't locate section headings reliably, skipping`);
    return null;
  }

  let briefLines = lines.slice(startIdx, builtIdx);
  if (briefLines[0]?.toLowerCase() === "situation") briefLines = briefLines.slice(1);
  const brief = briefLines.join("\n").trim();

  const builtEnd = changedIdx !== -1 ? changedIdx : outcomeIdx;
  const whatWeBuilt = lines.slice(builtIdx + 1, builtEnd).join("\n").trim();

  const whatChanged = changedIdx !== -1 ? lines.slice(changedIdx + 1, outcomeIdx).join("\n").trim() : "";
  const outcomeRaw = lines.slice(outcomeIdx + 1, scopeEnd).join("\n").trim();
  const outcome = [whatChanged, outcomeRaw].filter(Boolean).join("\n\n");

  return { brief, whatWeBuilt, outcome };
}

for (const slug of TARGETS) {
  const file = path.join("src/content/work", `${slug}.md`);
  const current = await readFile(file, "utf-8");
  const fmEnd = current.indexOf("---", 3) + 3;
  const frontmatter = current.slice(0, fmEnd);

  try {
    const recovered = await recoverOne(slug);
    if (!recovered) continue;
    const { brief, whatWeBuilt, outcome } = recovered;
    if (!brief || !whatWeBuilt || !outcome) {
      console.warn(`  ${slug}: recovered but one section still empty (brief=${!!brief} built=${!!whatWeBuilt} outcome=${!!outcome})`);
    }
    const newBody = `\n\n## Brief\n\n${brief}\n\n## What We Built\n\n${whatWeBuilt}\n\n## Outcome\n\n${outcome}\n`;
    await writeFile(file, frontmatter + newBody, "utf-8");
    console.log(`recovered ${slug}`);
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`);
  }
}
