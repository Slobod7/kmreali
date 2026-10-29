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

/**
 * Questions from the article's "## Întrebări frecvente" section, for the FAQPage schema.
 * Each question is one paragraph: the question in bold, then the answer, e.g.
 * `**Cât consumă?** 9–10 l/100 km pe drum lung.`
 */
export function faq(body = '') {
  const plain = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase();
  const section = body.split(/^## /m).find((part) => plain(part.split('\n')[0]) === 'intrebari frecvente');
  if (!section) return [];

  return section
    .split(/\n\s*\n/)
    .slice(1)
    .map((paragraph) => paragraph.trim().match(/^\*\*(.+?)\*\*\s+([\s\S]+)$/))
    .filter((match) => match !== null)
    .map(([, question, answer]) => ({ question: question.trim(), answer: markdownToText(answer) }));
}

function markdownToText(markdown: string) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|\*|`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
