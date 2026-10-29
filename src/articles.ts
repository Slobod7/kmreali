import { getCollection, type CollectionEntry } from 'astro:content';
import type { CategoryId } from './site';

export type Article = CollectionEntry<'articole'>;

/** Newest first. Drafts are included only in the local preview (`npm run dev`). */
export async function getArticles(category?: CategoryId) {
  const all = await getCollection('articole', ({ data }) => import.meta.env.DEV || !data.draft);
  return all
    .filter((a) => !category || a.data.category === category)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function readingMinutes(body = '') {
  const words = body.replace(/!\[[^\]]*\]\([^)]*\)/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
