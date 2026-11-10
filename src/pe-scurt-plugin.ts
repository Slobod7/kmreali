// The "Pe scurt" line above an article's summary list gets the highlighter (.evidentiat in global.css).
// It only touches a paragraph that is nothing but that bold label.
import type { HastPluginDefinition } from 'satteri';

export const peScurtPlugin: HastPluginDefinition = {
  name: 'kmreali-pe-scurt',
  element: {
    filter: ['p'],
    visit(paragraph, ctx) {
      const [label, ...rest] = paragraph.children;
      if (rest.length > 0 || label?.type !== 'element' || label.tagName !== 'strong') return;
      const [text] = label.children;
      if (label.children.length !== 1 || text.type !== 'text' || text.value.trim() !== 'Pe scurt') return;

      ctx.replaceNode(paragraph, {
        ...paragraph,
        children: [{ ...label, properties: { ...label.properties, className: ['evidentiat'] } }],
      });
    },
  },
};
