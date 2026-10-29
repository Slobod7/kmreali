import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articole = defineCollection({
  // One folder per article: src/content/articole/<slug>/index.md plus its photos.
  loader: glob({ pattern: '*/index.md', base: './src/content/articole', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.enum(['recenzii', 'ghiduri', 'topuri']),
      cover: image(),
      coverAlt: z.string(),
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
