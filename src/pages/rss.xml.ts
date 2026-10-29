import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles } from '../articles';
import { site, url } from '../site';

export async function GET(context: APIContext) {
  const articles = await getArticles();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      link: url(`${article.id}/`),
    })),
    customData: '<language>ro-RO</language>',
  });
}
