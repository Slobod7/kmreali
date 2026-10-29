import type { APIContext } from 'astro';
import { url } from '../site';

export function GET({ site }: APIContext) {
  const sitemap = new URL(url('sitemap-index.xml'), site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
