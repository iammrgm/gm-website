import { config, fields, collection } from "@keystatic/core";

const marketOptions = [
  { label: "DEPARTMNT", value: "departmnt" },
  { label: "Personal / Agency-Era", value: "personal" },
];

// Local dev writes straight to disk (fast, no commits for every keystroke).
// The deployed site has no filesystem to write to, so it goes through
// GitHub instead: every save there becomes a real commit + push, which
// triggers the normal Cloudflare deploy.
// This file is bundled for BOTH the server and the client-side CMS UI, so
// the dev/prod check has to be something safe in a browser bundle too —
// process.argv doesn't exist there and crashes the app on load.
// import.meta.env.DEV is Vite's own flag and works in both contexts.
const isDev = import.meta.env.DEV;

export default config({
  storage: isDev ? { kind: "local" } : { kind: "github", repo: { owner: "iammrgm", name: "gm-website" } },
  collections: {
    work: collection({
      label: "Work",
      slugField: "title",
      path: "src/content/work/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title", validation: { isRequired: true } } }),
        description: fields.text({
          label: "Description",
          description: "Used for the browser tab preview and search results.",
          multiline: true,
          validation: { isRequired: true },
        }),
        categories: fields.array(fields.text({ label: "Category" }), {
          label: "Categories",
          itemLabel: (props) => props.value || "Category",
          validation: { length: { min: 1 } },
        }),
        market: fields.select({ label: "Market", options: marketOptions, defaultValue: "departmnt" }),
        clients: fields.array(
          fields.object({
            name: fields.text({ label: "Name", validation: { isRequired: true } }),
            url: fields.text({ label: "URL", defaultValue: "" }),
          }),
          { label: "Clients", itemLabel: (props) => props.fields.name.value || "Client" }
        ),
        role: fields.text({ label: "Role", description: "Optional — only for personal/agency-era work." }),
        duration: fields.text({ label: "Duration", validation: { isRequired: true } }),
        location: fields.text({ label: "Location", validation: { isRequired: true } }),
        liveUrl: fields.text({ label: "Live URL", defaultValue: "" }),
        cover: fields.image({
          label: "Hero Image",
          description: "Used as the case study cover and gallery lead image.",
          directory: "public/images/work",
          publicPath: "/images/work/",
          validation: { isRequired: true },
        }),
        images: fields.array(
          fields.image({ label: "Image", directory: "public/images/work", publicPath: "/images/work/" }),
          { label: "Carousel", itemLabel: (props) => props.value?.filename ?? "Image" }
        ),
        reel: fields.file({
          label: "Reel",
          description: "Optional short vertical video (9:16).",
          directory: "public/videos/work",
          publicPath: "/videos/work/",
        }),
        video: fields.file({
          label: "Video",
          description: "Optional standard video (16:9).",
          directory: "public/videos/work",
          publicPath: "/videos/work/",
        }),
        order: fields.integer({ label: "Order", description: "Sort position across the Work index.", defaultValue: 0 }),
        pullQuote: fields.conditional(fields.checkbox({ label: "Include a pull quote?", defaultValue: false }), {
          true: fields.object({
            text: fields.text({ label: "Quote", multiline: true }),
            source: fields.text({ label: "Source" }),
          }),
          false: fields.empty(),
        }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: "Value" }),
            label: fields.text({ label: "Label" }),
          }),
          { label: "Stats", itemLabel: (props) => props.fields.value.value || "Stat" }
        ),
        content: fields.markdoc({ label: "Content", extension: "md" }),
      },
    }),
    thoughts: collection({
      label: "Thoughts",
      slugField: "title",
      path: "src/content/thoughts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title", validation: { isRequired: true } } }),
        description: fields.text({
          label: "Description",
          description: "Used for the listing excerpt and browser preview.",
          multiline: true,
          validation: { isRequired: true },
        }),
        date: fields.date({ label: "Date", validation: { isRequired: true } }),
        cover: fields.image({
          label: "Hero Image",
          description: "Optional. Shown at the top of the article.",
          directory: "public/images/thoughts",
          publicPath: "/images/thoughts/",
        }),
        carousel: fields.array(
          fields.image({ label: "Image", directory: "public/images/thoughts", publicPath: "/images/thoughts/" }),
          { label: "Carousel", itemLabel: (props) => props.value?.filename ?? "Image" }
        ),
        reel: fields.file({
          label: "Reel",
          description: "Optional short vertical video (9:16).",
          directory: "public/videos/thoughts",
          publicPath: "/videos/thoughts/",
        }),
        video: fields.file({
          label: "Video",
          description: "Optional standard video (16:9).",
          directory: "public/videos/thoughts",
          publicPath: "/videos/thoughts/",
        }),
        content: fields.markdoc({ label: "Content", extension: "md" }),
      },
    }),
  },
});
