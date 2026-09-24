// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';

import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

// Keystatic (the /keystatic CMS admin) ships in both dev and production —
// production uses GitHub-backed storage (see keystatic.config.ts), which
// only needs fetch() calls to GitHub's API, so it runs fine under the
// Cloudflare adapter. Local dev still uses "local" storage (writes straight
// to disk), which needs real filesystem access the Cloudflare adapter's
// workerd runtime emulation doesn't provide (it sandboxes Node APIs the
// same way production Workers do) — so dev runs on the plain Node adapter
// instead, and only the production build uses the Cloudflare adapter.
// `astro dev` vs `astro build` is read straight off argv since defineConfig
// doesn't take a function here.
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://www.garethmatthews.uk',
  integrations: [sitemap(), react(), keystatic(), markdoc()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: isDev ? node({ mode: 'standalone' }) : cloudflare()
});