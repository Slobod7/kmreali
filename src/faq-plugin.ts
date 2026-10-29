// Turns an article's "Întrebări frecvente" section into questions that open on click.
// A paragraph that starts with a bold question becomes <details><summary>question</summary><p>answer</p></details>.
import type { ElementContent, RootContent } from 'hast';
import type { HastPluginDefinition } from 'satteri';

export function isFaqHeading(text: string) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase() === 'intrebari frecvente';
}

export const faqPlugin: HastPluginDefinition = {
  name: 'kmreali-faq',
  element: {
    filter: ['p'],
    visit(paragraph, ctx) {
      const parent = ctx.parent(paragraph);
      const index = ctx.indexOf(paragraph);
      if (parent.type !== 'root' || index === undefined) return;
      const heading = parent.children.slice(0, index).findLast((node) => node.type === 'element' && node.tagName === 'h2');
      if (!heading || !isFaqHeading(textOf(heading))) return;

      const [question, ...answer] = paragraph.children;
      if (question?.type !== 'element' || question.tagName !== 'strong') return;
      if (answer[0]?.type === 'text') answer[0] = { ...answer[0], value: answer[0].value.trimStart() };

      ctx.replaceNode(paragraph, {
        type: 'element',
        tagName: 'details',
        properties: { className: ['intrebare'] },
        children: [
          { type: 'element', tagName: 'summary', properties: {}, children: question.children },
          { type: 'element', tagName: 'p', properties: {}, children: answer },
        ],
      });
    },
  },
};

function textOf(node: RootContent | ElementContent): string {
  if (node.type === 'text') return node.value;
  return node.type === 'element' ? node.children.map(textOf).join('') : '';
}
