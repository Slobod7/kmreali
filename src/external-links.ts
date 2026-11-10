// Links to other sites open in a new tab, so the reader keeps the article open.
// rel="noopener" stops the new tab from reaching back into this one. No nofollow: these are sources we cite.
import type { HastPluginDefinition } from 'satteri';
import { site } from './site.ts';

/** True for an http(s) address on another site. */
export function isExternal(href: string) {
  if (!/^https?:\/\//i.test(href)) return false;
  const host = new URL(href).hostname.replace(/^www\./, '');
  return host !== site.domain;
}

/** The attributes an external link gets, for HTML built as text (widgets, cover credit). */
export const externalAttributes = 'target="_blank" rel="noopener"';

export const externalLinksPlugin: HastPluginDefinition = {
  name: 'kmreali-external-links',
  element: {
    filter: ['a'],
    visit(link, ctx) {
      if (!isExternal(String(link.properties?.href ?? ''))) return;
      ctx.setProperty(link, 'target', '_blank');
      ctx.setProperty(link, 'rel', ['noopener']);
    },
  },
};
