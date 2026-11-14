// The verified edition the pages are built from. scripts/carburanti/refresh.py replaces data/carburanti/current.json;
// the next build picks it up. Only the build reads this file: pages carry the slice they need.
import current from '../../data/carburanti/current.json';
import { slug, type Editie } from './calcule';

export const editie = current as unknown as Editie;

export const tari = Object.entries(editie.countries)
  .map(([cod, tara]) => ({ cod, ...tara, slug: slug(tara.name) }))
  .sort((a, b) => a.name.localeCompare(b.name, 'ro'));

export const saptamani = Object.keys(editie.observations).sort().reverse();

/** The edition with only these weeks and countries, small enough to put in the page. */
export function felie({ weeks = saptamani, countries }: { weeks?: string[]; countries?: string[] }): Editie & { partial: true } {
  const observations: Editie['observations'] = {};
  for (const week of weeks) {
    const all = editie.observations[week];
    observations[week] = countries ? Object.fromEntries(countries.map((code) => [code, all[code]])) : all;
  }
  const { sources, hashes, ...rest } = editie;
  return { ...rest, sources: {}, hashes: {}, observations, partial: true };
}
