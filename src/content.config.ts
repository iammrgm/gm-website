import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const galleryImage = z.object({ image: z.string(), alt: z.string() });

const work = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    categories: z.array(z.string()),
    capacity: z.enum(["departmnt", "personal"]),
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
    departmnt: z
      .object({
        labsSlug: z.string().default(""),
        headline: z.string().default(""),
        status: z.enum(["live", "completed", "opening"]).default("completed"),
        tagsUsed: z.array(z.string()).default([]),
        learned: z.string().default(""),
        next: z.string().optional(),
        room: z.array(galleryImage).default([]),
        tags: z.array(galleryImage).default([]),
        portal: z.array(galleryImage).default([]),
        core: z.array(galleryImage).default([]),
      })
      .optional(),
  }),
});

const thoughts = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/thoughts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    carousel: z.array(z.string()).default([]),
    reel: z.string().optional(),
    video: z.string().optional(),
  }),
});

export const collections = { work, thoughts };
