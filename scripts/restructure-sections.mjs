// One-off: merge the old 4-section body (Situation / What we built /
// What changed / Outcome) down to 3 (Brief / What We Built / Outcome),
// folding "What changed" in as the closing beat of Outcome. Pure
// reorganization of existing text — no content is added or removed.
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const SKIP = new Set(["crocs-kasina.md", "novelist-tours.md", "mercedes-benz.md"]);

const dir = "src/content/work";
const files = (await readdir(dir)).filter((f) => f.endsWith(".md") && !SKIP.has(f));

function extractSection(body, heading, nextHeadings) {
  const start = body.indexOf(`## ${heading}`);
  if (start === -1) return null;
  const afterHeading = start + `## ${heading}`.length;
  let end = body.length;
  for (const h of nextHeadings) {
    const idx = body.indexOf(`## ${h}`, afterHeading);
    if (idx !== -1 && idx < end) end = idx;
  }
  return body.slice(afterHeading, end).trim();
}

for (const file of files) {
  const full = path.join(dir, file);
  const text = await readFile(full, "utf-8");

  const fmEnd = text.indexOf("---", 3) + 3;
  const frontmatter = text.slice(0, fmEnd);
  const body = text.slice(fmEnd);

  const situation = extractSection(body, "Situation", ["What we built", "What changed", "Outcome"]);
  const whatWeBuilt = extractSection(body, "What we built", ["What changed", "Outcome"]);
  const whatChanged = extractSection(body, "What changed", ["Outcome"]);
  const outcome = extractSection(body, "Outcome", []);

  if (situation === null || whatWeBuilt === null || whatChanged === null || outcome === null) {
    console.warn(`skip ${file}: couldn't find all 4 sections`);
    continue;
  }

  const mergedOutcome = [whatChanged, outcome].filter(Boolean).join("\n\n");

  const newBody = `\n\n## Brief\n\n${situation}\n\n## What We Built\n\n${whatWeBuilt}\n\n## Outcome\n\n${mergedOutcome}\n`;

  await writeFile(full, frontmatter + newBody, "utf-8");
  console.log(`restructured ${file}`);
}
