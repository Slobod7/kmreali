import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { articleUrl, getArticles } from '../articles';
import { site } from '../site';

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
      link: articleUrl(article),
    })),
    customData: '<language>ro-RO</language>',
  });
}
