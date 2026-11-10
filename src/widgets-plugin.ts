// Builds an article's widgets from the date.json next to its index.md.
// In the text, <div data-widget="cautator"></div> becomes the search by budget and
// <div data-widget="matrice"></div> the table of what each source says about each car.
// Both come out as plain HTML; src/components/Widgeturi.astro styles them and makes the search work.
import { readFileSync } from 'node:fs';
import type { HastPluginDefinition } from 'satteri';
import { externalAttributes } from './external-links.ts';

type Level = 'bun' | 'mediu' | 'slab';
type Note = [Level, string] | null;
type Group = 'lista' | 'rezerve' | 'slabe';

interface Model {
  nume: string;
  generatie: string;
  grup: Group;
  sectiune: string;
  surse: Record<SourceId, Note>;
  atentie: string;
  foto?: string;
}

/** A card photo: public/foto/<article>/<fisier>, 400×225, with its credit. */
interface Photo {
  fisier: string;
  alt: string;
  autor: string;
  pagina: string;
  licenta: string;
  licentaUrl: string;
}

interface Offer {
  model?: string;
  nume?: string;
  generatie?: string;
  grup?: Group;
  stare: 'folosita' | 'noua';
  tip: 'mica' | 'compacta' | 'suv';
  motor: string[];
  pret: number;
  pretDeLa?: number;
  pretNota?: string;
  km?: number;
  anunturi?: number;
  ani?: string;
  deCe?: string;
  atentie?: string;
  foto?: string;
  link: string;
}

interface Data {
  actualizat: string;
  modele: Record<string, Model>;
  oferte: Offer[];
  fotografii: Record<string, Photo>;
  /** Where the card photos are served from; set by the plugin, not in date.json. */
  folderFoto: string;
}

const sources = { tuv: 'TÜV', adac: 'ADAC', whatcar: 'What Car?', driverpower: 'Driver Power' } as const;
type SourceId = keyof typeof sources;

const groups: Record<Group, string> = { lista: 'În listă', rezerve: 'Cu rezerve', slabe: 'Populare, dar slabe' };

const widgets: Record<string, (data: Data) => string> = { cautator: finder, matrice: matrix };

export const widgetsPlugin: HastPluginDefinition = {
  name: 'kmreali-widgets',
  raw(node, ctx) {
    const name = node.value.match(/^\s*<div data-widget="([a-z-]+)"><\/div>\s*$/)?.[1];
    if (!name || !ctx.fileURL) return;

    const widget = widgets[name];
    if (!widget) {
      ctx.report({ message: `Unknown widget "${name}"`, node, severity: 'warning' });
      return;
    }
    const data = JSON.parse(readFileSync(new URL('date.json', ctx.fileURL), 'utf8')) as Data;
    // Card photos live in public/foto/<article folder>/, under the site's base path.
    const article = new URL('.', ctx.fileURL).pathname.split('/').filter(Boolean).pop();
    data.folderFoto = `${(process.env.BASE_PATH || '/').replace(/\/?$/, '/')}foto/${article}/`;
    ctx.replaceNode(node, { type: 'raw', value: widget(data) });
  },
};

/** The table of what each source says, grouped as in the article. */
function matrix({ modele, actualizat }: Data) {
  const rows = (Object.keys(groups) as Group[]).map((group) => {
    const models = Object.values(modele).filter((model) => model.grup === group);
    return `
      <tr class="matrice__grup"><th colspan="5" scope="colgroup">${groups[group]}</th></tr>
      ${models
        .map(
          (model) => `
        <tr>
          <th scope="row"><a href="#${esc(model.sectiune)}">${esc(model.nume)}</a><span>${esc(model.generatie)}</span></th>
          ${(Object.keys(sources) as SourceId[]).map((source) => `<td>${pill(model.surse[source])}</td>`).join('')}
        </tr>`,
        )
        .join('')}`;
  });

  return `
<figure class="matrice">
  <div class="matrice__derulare">
    <table class="matrice__tabel">
      <thead>
        <tr><th scope="col">Model</th>${Object.values(sources).map((name) => `<th scope="col">${name}</th>`).join('')}</tr>
      </thead>
      <tbody>${rows.join('')}</tbody>
    </table>
  </div>
  <figcaption>
    <span class="nivel nivel--bun">verde</span> printre cele mai bune,
    <span class="nivel nivel--mediu">gri</span> la mijloc,
    <span class="nivel nivel--slab">roșu</span> printre cele mai slabe,
    <span class="nivel">–</span> fără date pe model sau nici în top, nici la coadă.
    TÜV: defecte la inspecție. ADAC: pane la 1.000 de mașini. What Car?: nota de la proprietari, verde de la 95%, roșu sub 88%.
    Driver Power: doar marca, din primele și ultimele 10. Actualizat pe ${esc(dateRo(actualizat))}.
  </figcaption>
</figure>`;
}

/** The search by budget: every car as a card; the page's script hides the ones that don't match. */
function finder({ modele, oferte, fotografii, folderFoto }: Data) {
  const order: Group[] = ['lista', 'rezerve', 'slabe'];
  const offers = oferte
    .map((offer) => ({ offer, model: offer.model ? modele[offer.model] : undefined }))
    .sort(
      (a, b) =>
        order.indexOf(a.offer.grup ?? a.model?.grup ?? 'lista') - order.indexOf(b.offer.grup ?? b.model?.grup ?? 'lista') ||
        a.offer.pret - b.offer.pret,
    );

  return `
<div class="cautator" data-cautator hidden>
  <form class="cautator__filtre">
    <div class="cautator__buget">
      <label for="cautator-buget">Buget maxim</label>
      <output for="cautator-buget" data-buget>15.000 €</output>
      <input type="range" id="cautator-buget" name="buget" min="5000" max="30000" step="500" value="15000">
    </div>
    ${choice('stare', 'Mașina', { folosita: 'Second hand', noua: 'Nouă' })}
    ${choice('tip', 'Tip', { mica: 'Mică', compacta: 'Compactă', suv: 'SUV' })}
    ${choice('motor', 'Motor', { benzina: 'Benzină', diesel: 'Diesel', hibrid: 'Hibrid' })}
  </form>
  <p class="cautator__numar" aria-live="polite" data-numar></p>
  <ul class="cautator__lista">${offers
    .map(({ offer, model }) => {
      const photo = fotografii[offer.foto ?? model?.foto ?? ''];
      return card(offer, model, photo && { ...photo, fisier: folderFoto + photo.fisier });
    })
    .join('')}</ul>
  <button type="button" class="cautator__mai-mult" data-mai-mult hidden></button>
  <p class="cautator__gol" data-gol hidden>Nicio mașină din listă nu se potrivește. Mărește bugetul sau alege „Oricare”.</p>
</div>
<p class="cautator-fara-js">Căutarea are nevoie de JavaScript. Modelele sunt descrise mai jos, pe bugete.</p>`;
}

function choice(name: string, legend: string, options: Record<string, string>) {
  const radios = Object.entries({ '': 'Oricare', ...options }).map(
    ([value, label]) =>
      `<label><input type="radio" name="${name}" value="${value}"${value === '' ? ' checked' : ''}><span>${label}</span></label>`,
  );
  return `<fieldset><legend>${legend}</legend><div class="cautator__optiuni">${radios.join('')}</div></fieldset>`;
}

function card(offer: Offer, model?: Model, photo?: Photo) {
  const name = offer.nume ?? model?.nume ?? '';
  const generation = offer.generatie ?? model?.generatie ?? '';
  const group = offer.grup ?? model?.grup ?? 'lista';
  const used = offer.stare === 'folosita';
  const warning = offer.atentie ?? model?.atentie;

  const price = used
    ? `<strong>în jur de ${euro(offer.pret)}</strong> pe Autovit · ${esc(offer.ani ?? '')} · ${number(offer.km ?? 0)} km · ${count(offer.anunturi ?? 0, 'anunț', 'anunțuri')}`
    : `<strong>de la ${euro(offer.pret)}</strong> nouă, cu TVA${offer.pretNota ? ` · ${esc(offer.pretNota)}` : ''}`;

  const notes = model
    ? `<ul class="masina__surse">${(Object.keys(sources) as SourceId[])
        .filter((source) => model.surse[source])
        .map((source) => `<li>${pill(model.surse[source], `${sources[source]}: `)}</li>`)
        .join('')}</ul>`
    : '';

  const links = [
    `<a href="#${esc(used && model ? model.sectiune : 'mașini-noi-sub-30000-')}">Detalii în articol</a>`,
    `<a href="${esc(offer.link)}" ${externalAttributes}>${used ? 'Anunțuri pe Autovit' : 'Site-ul oficial'}</a>`,
  ];

  return `
    <li class="masina" data-grup="${group}" data-stare="${offer.stare}" data-tip="${offer.tip}" data-motor="${offer.motor.join(' ')}" data-pret="${offer.pret}" data-pret-de-la="${offer.pretDeLa ?? offer.pret}"${used && (offer.anunturi ?? 0) < 12 ? ' data-rar' : ''}>
      <div class="masina__cap">
        ${photo ? `<img class="masina__foto" src="${esc(photo.fisier)}" alt="${esc(photo.alt)}" width="400" height="225" loading="lazy" decoding="async">` : ''}
        <div class="masina__titlu">
          <p class="masina__nume">${esc(name)} <span>${esc(generation)}</span></p>
          <span class="masina__eticheta masina__eticheta--${group}">${groups[group]}</span>
        </div>
      </div>
      <p class="masina__pret">${price}</p>
      ${used ? `<p class="masina__nota" data-peste-buget hidden>Cele mai multe anunțuri sunt peste bugetul tău; uită-te la cele mai ieftine.</p>` : ''}
      ${notes}
      ${offer.deCe ? `<p><strong>De ce:</strong> ${esc(offer.deCe)}</p>` : ''}
      ${warning ? `<p><strong>Atenție la:</strong> ${esc(warning)}</p>` : ''}
      <p class="masina__linkuri">${links.join('')}</p>
      ${photo ? `<p class="masina__credit">Foto: ${esc(photo.autor)}, <a href="${esc(photo.pagina)}" ${externalAttributes}>Wikimedia Commons</a>, <a href="${esc(photo.licentaUrl)}" ${externalAttributes}>${esc(photo.licenta)}</a>, decupată și redimensionată</p>` : ''}
    </li>`;
}

function pill(note: Note, prefix = '') {
  return note ? `<span class="nivel nivel--${note[0]}">${esc(prefix + note[1])}</span>` : '<span class="nivel">–</span>';
}

const number = (value: number) => new Intl.NumberFormat('ro-RO').format(value);
const euro = (value: number) => `${number(value)} €`;

/** Romanian counts: 1 anunț, 19 anunțuri, 20 de anunțuri, 116 anunțuri. */
function count(n: number, one: string, many: string) {
  if (n === 1) return `1 ${one}`;
  return n % 100 === 0 || n % 100 >= 20 ? `${number(n)} de ${many}` : `${number(n)} ${many}`;
}

function dateRo(iso: string) {
  return new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

function esc(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
