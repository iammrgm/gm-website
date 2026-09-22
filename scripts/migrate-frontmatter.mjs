// One-off migration: category (string) -> categories (array),
// client (string) -> clients (array of {name, url}). Preserves the
// existing single value, just reshapes it — no content changes.
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const SKIP = new Set(["crocs-kasina.md"]); // hand-built prototype, migrated separately

const dir = "src/content/work";
const files = (await readdir(dir)).filter((f) => f.endsWith(".md") && !SKIP.has(f));

for (const file of files) {
  const full = path.join(dir, file);
  let text = await readFile(full, "utf-8");

  const catMatch = text.match(/^category:\s*"((?:[^"\\]|\\.)*)"$/m);
  const clientMatch = text.match(/^client:\s*"((?:[^"\\]|\\.)*)"$/m);
  if (!catMatch || !clientMatch) {
    console.warn(`skip ${file}: couldn't find category/client`);
    continue;
  }

  const category = catMatch[1];
  const client = clientMatch[1];

  text = text.replace(catMatch[0], `categories:\n  - ${JSON.stringify(category)}`);
  text = text.replace(clientMatch[0], `clients:\n  - name: ${JSON.stringify(client)}\n    url: ""`);

  await writeFile(full, text, "utf-8");
  console.log(`migrated ${file}`);
}
