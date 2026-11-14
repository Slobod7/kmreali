// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { site } from './src/site.ts';
import { faqPlugin } from './src/faq-plugin.ts';
import { peScurtPlugin } from './src/pe-scurt-plugin.ts';
import { widgetsPlugin } from './src/widgets-plugin.ts';
import { externalLinksPlugin } from './src/external-links.ts';
import { articleLastmods } from './src/sitemap-lastmod.ts';

const lastmods = articleLastmods(process.env.BASE_PATH);

// SITE_URL and BASE_PATH are set by the GitHub Pages workflow. While the site is
// tested at <user>.github.io/<repo>, BASE_PATH is "/<repo>"; on kmreali.ro it is empty.
export default defineConfig({
  // GitHub reports http:// until HTTPS is enforced; the site is always served over https.
  site: (process.env.SITE_URL || 'https://kmreali.ro').replace(/^http:/, 'https:'),
  base: process.env.BASE_PATH || '/',
  // The Superb review was first published at the root; old links and search results land on its new address.
  redirects: {
    '/skoda-superb-2020-pareri-proprietar/': '/recenzii/skoda-superb-2020-pareri-proprietar/',
  },
  integrations: [
    sitemap({
      // The contact page stays out of Google until it has an address.
      // The fuel chart for other sites' iframes is not a page of its own.
      filter: (page) =>
        (site.contactEmail !== '' || !page.endsWith('/contact/')) && !page.endsWith('/preturi-carburanti-europa/embed/'),
      // Articles get the date from their frontmatter, never the build date. Other pages get none.
      serialize: (item) => {
        const lastmod = lastmods.get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  markdown: {
    processor: satteri({
      hastPlugins: [faqPlugin, peScurtPlugin, widgetsPlugin, externalLinksPlugin],
      // Romanian uses „…” quotes; keep whatever the author typed.
      features: { smartPunctuation: false },
    }),
  },
});
