import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articole = defineCollection({
  // One folder per article: src/content/articole/<slug>/index.md plus its photos.
  // Articles are rendered when their page is built, not cached by the loader, so a change to an
  // article's date.json (its widgets, see src/widgets-plugin.ts) shows up in the next build.
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/articole',
    generateId: ({ entry }) => entry.split('/')[0],
    deferRender: true,
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.enum(['recenzii', 'ghiduri', 'topuri']),
      cover: image(),
      coverAlt: z.string(),
      // Small caption under the cover. Links are written like in the text: [Wikimedia Commons](https://...).
      coverCredit: z.string().optional(),
      // Replaces the title in <title> only; the H1, address, og:title and JSON-LD keep `title`.
      // The site name is added after it, so keep it to about 54 characters.
      seoTitle: z.string().optional(),
      // Drafts show up in the local preview only, never on the live site.
      draft: z.boolean().default(false),
      // The car the article is about. Every field is optional; empty ones are not shown.
      masina: z
        .object({
          model: z.string(),
          an: z.number().optional(),
          motor: z.string().optional(),
          tractiune: z.string().optional(),
          cutie: z.string().optional(),
          caroserie: z.string().optional(),
          kilometraj: z.number().optional(),
          consum: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { articole };
