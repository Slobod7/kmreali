// The <lastmod> dates for the sitemap: `updated`, or `date` if the article was never updated.
// astro:content isn't available in astro.config.mjs, so this reads the articles' frontmatter directly.
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const articlesDir = new URL('./content/articole/', import.meta.url);

function field(frontmatter: string, name: string) {
  return frontmatter.match(new RegExp(`^${name}:\\s*["']?([^"'#\\s]+)`, 'm'))?.[1];
}

/** Published articles only, by address, e.g. /recenzii/<slug>/ -> 2026-10-29T00:00:00.000Z. */
export function articleLastmods(base = '/') {
  const lastmods = new Map<string, string>();

  for (const entry of readdirSync(articlesDir, { withFileTypes: true })) {
    const file = new URL(`${entry.name}/index.md`, articlesDir);
    if (!entry.isDirectory() || !existsSync(file)) continue;

    const [, frontmatter = ''] = readFileSync(file, 'utf8').split(/^---\s*$/m);
    if (field(frontmatter, 'draft') === 'true') continue;

    const modified = new Date(field(frontmatter, 'updated') ?? field(frontmatter, 'date') ?? NaN);
    if (Number.isNaN(modified.getTime())) throw new Error(`${entry.name}: no valid date for the sitemap`);

    lastmods.set(`${base.replace(/\/$/, '')}/${field(frontmatter, 'category')}/${entry.name}/`, modified.toISOString());
  }

  return lastmods;
}
