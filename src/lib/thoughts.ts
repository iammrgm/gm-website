import { getCollection } from "astro:content";

// Drafts render locally (with a Draft badge) for review, and never in a production build.
export async function getVisibleThoughts() {
  const all = await getCollection("thoughts", ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
