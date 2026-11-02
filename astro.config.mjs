// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
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

// The Thoughts index stays out of the sitemap (and is noindexed) until a piece is published, so
// Google doesn't index an empty "Coming soon" page.
const hasPublishedThoughts = readdirSync('src/content/thoughts')
  .filter((f) => f.endsWith('.mdoc'))
  .some((f) => !/^draft:\s*true\s*$/m.test(readFileSync(`src/content/thoughts/${f}`, 'utf8')));

// https://astro.build/config
export default defineConfig({
  site: 'https://www.garethmatthews.uk',
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        if (/\/(cms|keystatic)(\/|$)/.test(path)) return false;
        if (!hasPublishedThoughts && path.startsWith('/thoughts')) return false;
        return true;
      },
    }), react(), keystatic(), markdoc()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: isDev ? node({ mode: 'standalone' }) : cloudflare()
});