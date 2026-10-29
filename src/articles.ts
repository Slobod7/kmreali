import { getCollection, type CollectionEntry } from 'astro:content';
import { isFaqHeading } from './faq-plugin';
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
  const section = body.split(/^## /m).find((part) => isFaqHeading(part.split('\n')[0]));
  if (!section) return [];

  return section
    .split(/\n\s*\n/)
    .slice(1)
    .map((paragraph) => paragraph.trim().match(/^\*\*(.+?)\*\*\s+([\s\S]+)$/))
    .filter((match) => match !== null)
    .map(([, question, answer]) => ({ question: question.trim(), answer: markdownToText(answer) }));
}

/**
 * The score, likes and dislikes from a review's "Pe scurt" list, for the Review schema:
 * `- **Îmi place:** ...`, `- **Nu îmi place:** ...` and `- **Nota mea:** 7,8/10`.
 */
export function reviewSummary(body = '') {
  const [, rest = ''] = body.split(/^(?:\*\*Pe scurt\*\*|#{2,3} Pe scurt)\s*$/m);
  const list = rest.trimStart().split(/\n\s*\n/)[0];
  const fields = new Map(
    list
      .split('\n')
      .map((line) => line.match(/^[-*]\s+\*\*(.+?):?\*\*:?\s*(.+)$/))
      .filter((match) => match !== null)
      .map(([, label, value]) => [normalized(label), markdownToText(value)] as const),
  );
  const score = fields.get('nota mea')?.match(/(\d+(?:[.,]\d+)?)\s*\/\s*(\d+)/);

  return {
    rating: score ? { value: Number(score[1].replace(',', '.')), best: Number(score[2]) } : undefined,
    pros: splitList(fields.get('imi place') ?? ''),
    cons: splitList(fields.get('nu imi place') ?? ''),
  };
}

/** Lowercase, without diacritics, so "Îmi place" and "Imi place" match. */
function normalized(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase();
}

/** "a, b; c (d, e)" becomes a, b and "c (d, e)". Commas inside brackets or numbers (9,5) don't split. */
function splitList(text: string) {
  return text
    .split(/[;,](?!\d)(?![^(]*\))/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function markdownToText(markdown: string) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|\*|`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
