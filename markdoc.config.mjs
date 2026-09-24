import { defineMarkdocConfig, component } from "@astrojs/markdoc/config";

// Matches the block components registered in keystatic.config.ts — both
// sides have to agree on the tag name and attribute shape, since Keystatic
// writes these tags into the .mdoc file and this config tells Astro how to
// render them back out.
export default defineMarkdocConfig({
  tags: {
    video: {
      render: component("./src/components/markdoc/VideoBlock.astro"),
      attributes: {
        video: { type: String },
      },
    },
    reel: {
      render: component("./src/components/markdoc/ReelBlock.astro"),
      attributes: {
        video: { type: String },
      },
    },
    gallery: {
      render: component("./src/components/markdoc/GalleryBlock.astro"),
      attributes: {
        images: { type: Array },
      },
    },
  },
});
