// Every published edition stays at its own address, so a dated link shows the numbers it was shared with.
import type { APIContext } from 'astro';
import type { Editie } from '../../../../carburanti/calcule';

export function getStaticPaths() {
  const files = import.meta.glob<Editie>('../../../../../data/carburanti/editions/*.json', { eager: true, import: 'default' });
  return Object.values(files).map((edition) => ({ params: { rev: edition.revision }, props: { edition } }));
}

export const GET = ({ props }: APIContext<{ edition: Editie }>) =>
  new Response(JSON.stringify(props.edition), { headers: { 'Content-Type': 'application/json' } });
