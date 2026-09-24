import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const work = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    categories: z.array(z.string()),
    market: z.enum(["departmnt", "personal"]),
    clients: z.array(z.object({ name: z.string(), url: z.string().optional().default("") })),
    role: z.string().optional(),
    duration: z.string(),
    location: z.string(),
    liveUrl: z.string().optional().default(""),
    cover: z.string(),
    images: z.array(z.string()).default([]),
    reel: z.string().optional(),
    video: z.string().optional(),
    order: z.number(),
    pullQuote: z.object({ text: z.string(), source: z.string() }).optional(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  }),
});

const thoughts = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/thoughts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    carousel: z.array(z.string()).default([]),
    reel: z.string().optional(),
    video: z.string().optional(),
  }),
});

export const collections = { work, thoughts };
