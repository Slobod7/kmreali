// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/site.ts';

// SITE_URL and BASE_PATH are set by the GitHub Pages workflow. While the site is
// tested at <user>.github.io/<repo>, BASE_PATH is "/<repo>"; on kmreali.ro it is empty.
export default defineConfig({
  site: process.env.SITE_URL || 'https://kmreali.ro',
  base: process.env.BASE_PATH || '/',
  integrations: [
    sitemap({
      // The contact page stays out of Google until it has an address.
      filter: (page) => site.contactEmail !== '' || !page.endsWith('/contact/'),
    }),
  ],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  markdown: {
    // Romanian uses „…” quotes; keep whatever the author typed.
    smartypants: false,
  },
});
