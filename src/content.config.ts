import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    category: z.string(),
    client: z.string(),
    duration: z.string(),
    location: z.string(),
    liveUrl: z.string().optional().default(""),
    cover: z.string(),
    images: z.array(z.string()).default([]),
  }),
});

export const collections = { work };
