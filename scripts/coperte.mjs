// Draws the article covers: flat illustrations in the site's colours and fonts, 1600×900.
// Each cover is an HTML page rendered by headless Chrome, then saved as WebP next to the article.
//   node scripts/coperte.mjs            all covers
//   node scripts/coperte.mjs masini-fiabile
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const articole = join(root, 'src/content/articole');
const fonts = pathToFileURL(join(root, 'src/assets/fonts')).href;
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const c = {
  hartie: '#f4f1ea',
  carbune: '#15171a',
  rosu: '#c8321e',
  nisip: '#e4dfd4',
  grafit: '#2e3137',
  gri: '#55595f',
  alb: '#ffffff',
  evidentiator: '#ffd60a',
};

// ---------- Pieces ----------

// Side views of a car in a 600×200 box, wheels on the ground at y = 186.
const caroserii = {
  liftback: {
    body: 'M24 168 L24 128 Q26 112 50 107 L150 98 Q208 56 262 44 Q300 38 368 40 Q418 44 462 90 L552 102 Q580 108 584 128 L584 162 Q584 170 576 170 L32 170 Q24 170 24 168 Z',
    geam: 'M176 98 Q220 64 266 55 Q300 50 346 51 L374 53 Q402 58 432 92 Z',
    stalp: 312,
    roti: [140, 474],
  },
  suv: {
    body: 'M34 168 L34 72 Q36 50 60 46 L104 40 Q138 6 186 4 L404 4 Q438 6 478 60 L550 72 Q578 78 582 100 L582 162 Q582 170 574 170 L42 170 Q34 170 34 168 Z',
    geam: 'M118 44 Q148 18 190 16 L398 16 Q424 18 454 62 Z',
    stalp: 300,
    roti: [138, 470],
  },
  hatch: {
    body: 'M52 168 L52 82 Q54 58 84 48 Q124 34 196 32 L326 32 Q366 36 410 80 L498 92 Q526 98 530 120 L530 162 Q530 170 522 170 L60 170 Q52 170 52 168 Z',
    geam: 'M86 74 Q108 48 192 43 L322 43 Q350 47 384 82 Z',
    stalp: 250,
    roti: [140, 432],
  },
};

let nrMasina = 0;
/** One car standing on the ground line `sol`, its left end at `x`. Wheels touch the ground at y = 206 of 600. */
function masina({ tip, x, sol, w = 600, culoare = c.carbune, geam = c.grafit, jante = c.gri }) {
  const m = caroserii[tip];
  const id = `geam${nrMasina++}`;
  const k = w / 600;
  const roti = m.roti
    .map(
      (cx) => `
      <circle cx="${cx}" cy="168" r="38" fill="${c.carbune}"/>
      <circle cx="${cx}" cy="168" r="17" fill="${jante}"/>`,
    )
    .join('');
  return `<g transform="translate(${x} ${sol - 206 * k}) scale(${k})">
    <clipPath id="${id}"><path d="${m.geam}"/></clipPath>
    <path d="${m.body}" fill="${culoare}"/>
    <path d="${m.geam}" fill="${geam}"/>
    <rect x="${m.stalp - 7}" y="0" width="14" height="120" fill="${culoare}" clip-path="url(#${id})"/>
    ${roti}
  </g>`;
}

/** The km marker from the logo: red cap, white body, dark outline. */
function borna({ x, y, w, km, cap = 'KM' }) {
  const h = w * 1.25;
  const r = w / 2;
  return `<g transform="translate(${x} ${y})">
    <path d="M0 ${r} A${r} ${r} 0 0 1 ${w} ${r} L${w} ${h - 8} Q${w} ${h} ${w - 8} ${h} L8 ${h} Q0 ${h} 0 ${h - 8} Z" fill="${c.alb}"/>
    <path d="M0 ${r} A${r} ${r} 0 0 1 ${w} ${r} L${w} ${r * 1.05} L0 ${r * 1.05} Z" fill="${c.rosu}"/>
    <path d="M0 ${r} A${r} ${r} 0 0 1 ${w} ${r} L${w} ${h - 8} Q${w} ${h} ${w - 8} ${h} L8 ${h} Q0 ${h} 0 ${h - 8} Z" fill="none" stroke="${c.carbune}" stroke-width="${w * 0.045}"/>
    <text x="${w / 2}" y="${r * 0.86}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="${w * 0.2}" letter-spacing="${w * 0.012}" fill="${c.alb}">${cap}</text>
    <text x="${w / 2}" y="${r * 1.05 + (h - r * 1.05) / 2 + w * 0.085}" text-anchor="middle" font-family="Barlow Condensed" font-weight="800" font-size="${w * 0.25}" fill="${c.carbune}">${km}</text>
  </g>`;
}

function pagina(fond, svg) {
  const face = (family, weight, file) =>
    `@font-face{font-family:'${family}';font-weight:${weight};src:url('${fonts}/${file}') format('woff2');}`;
  return `<!doctype html><meta charset="utf-8"><style>
    ${face('Barlow Condensed', 700, 'barlow-condensed-latin-700-normal.woff2')}
    ${face('Barlow Condensed', 700, 'barlow-condensed-latin-ext-700-normal.woff2')}
    ${face('Barlow Condensed', 800, 'barlow-condensed-latin-800-normal.woff2')}
    ${face('Barlow Condensed', 800, 'barlow-condensed-latin-ext-800-normal.woff2')}
    html,body{margin:0;width:1600px;height:900px;overflow:hidden;background:${fond}}
    svg{display:block}
  </style><svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">${svg}</svg>`;
}

const text = (x, y, size, str, { culoare = c.carbune, weight = 800, anchor = 'start', spacing = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="Barlow Condensed" font-weight="${weight}" font-size="${size}" fill="${culoare}" text-anchor="${anchor}" letter-spacing="${spacing}">${str}</text>`;

// ---------- Covers ----------

const coperte = {
  // Top: a row of ordinary cars, one picked out with the logo's check mark, and the budget on the highlighter.
  'masini-fiabile': {
    fisier: 'coperta-masini-fiabile.webp',
    html: () => {
      const fond = c.hartie;
      const sol = 660;
      return pagina(
        fond,
        `
        <rect x="0" y="${sol}" width="1600" height="${900 - sol}" fill="${c.nisip}"/>
        ${masina({ tip: 'hatch', x: -60, sol, w: 500, culoare: c.gri })}
        ${masina({ tip: 'liftback', x: 1150, sol, w: 520, culoare: c.gri })}
        ${masina({ tip: 'suv', x: 470, sol, w: 680, culoare: c.rosu })}
        <g transform="translate(810 160)">
          <circle r="92" fill="${c.alb}" stroke="${c.carbune}" stroke-width="10"/>
          <path d="M-40 2 L-12 30 L42 -28" fill="none" stroke="${c.carbune}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <rect x="510" y="708" width="580" height="140" fill="${c.evidentiator}"/>
        ${text(800, 818, 136, 'sub 30.000 €', { anchor: 'middle' })}
      `,
      );
    },
  },

  // Guide: the three trims side by side, the way you compare them.
  'skoda-superb-sportline-vs-laurin-klement-vs-style': {
    fisier: 'coperta-superb-echipari.webp',
    html: () => {
      const fond = c.carbune;
      const eticheta = (cx, nume, activ) => {
        const w = 390;
        return `<g transform="translate(${cx - w / 2} 300)">
          <rect width="${w}" height="300" rx="20" fill="${activ ? c.alb : 'none'}" stroke="${c.alb}" stroke-width="8"/>
          ${text(w / 2, 196, nume.length > 6 ? 96 : 150, nume, { anchor: 'middle', culoare: activ ? c.carbune : c.alb })}
        </g>`;
      };
      return pagina(
        fond,
        `
        ${eticheta(285, 'Style')}
        ${text(552, 476, 64, 'vs', { anchor: 'middle', culoare: c.rosu, weight: 700 })}
        ${eticheta(800, 'Sportline')}
        ${text(1048, 476, 64, 'vs', { anchor: 'middle', culoare: c.rosu, weight: 700 })}
        ${eticheta(1315, 'L&amp;K', true)}
        ${text(800, 200, 60, 'SKODA SUPERB 3 FACELIFT', { anchor: 'middle', culoare: c.gri, weight: 700, spacing: 6 })}
        <rect x="1120" y="640" width="390" height="18" fill="${c.evidentiator}"/>
      `,
      );
    },
  },

  // Review: the owner's own kilometres, from the marker at purchase to the one now.
  'skoda-superb-2020-pareri-proprietar': {
    fisier: 'coperta-superb-2020-proprietar.webp',
    html: () => {
      const fond = c.hartie;
      const sol = 700;
      return pagina(
        fond,
        `
        <rect x="0" y="${sol}" width="1600" height="200" fill="${c.carbune}"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${40 + i * 200}" y="${sol + 92}" width="110" height="14" fill="${c.hartie}"/>`).join('')}
        ${borna({ x: 470, y: sol - 300, w: 240, km: '80.000' })}
        ${borna({ x: 1310, y: sol - 300, w: 240, km: '120.000' })}
        ${masina({ tip: 'liftback', x: 720, sol, w: 600, culoare: c.carbune })}
        <rect x="730" y="140" width="520" height="130" fill="${c.evidentiator}"/>
        ${text(990, 248, 124, '+40.000 km', { anchor: 'middle' })}
      `,
      );
    },
  },

  // Guide: the warning lights themselves, a few lit on a dark panel.
  'martori-bord-skoda': {
    fisier: 'coperta-martori-bord.webp',
    html: () => {
      const dir = join(articole, 'martori-bord-skoda');
      const aprinse = ['motor', 'presiune-ulei', 'abs', 'airbag', 'epc', 'lichid-racire', 'frana', 'presiune-anvelope'];
      const stinse = ['faza-lunga', 'esc', 'centura', 'service', 'filtru-particule', 'semnalizare', 'preincalzire', 'rezerva'];
      const ordine = [
        stinse[0], aprinse[0], stinse[1], aprinse[1], stinse[2], aprinse[2],
        aprinse[3], stinse[3], aprinse[4], stinse[4], aprinse[5], stinse[5],
      ];
      const cols = 6;
      const size = 210;
      const gap = 36;
      const x0 = (1600 - (cols * size + (cols - 1) * gap)) / 2;
      const y0 = (900 - (2 * size + gap)) / 2;
      const icoane = ordine
        .map((nume, i) => {
          const svg = readFileSync(join(dir, `martor-${nume}.svg`), 'utf8')
            .replace(/^<svg[^>]*>/, '')
            .replace(/<\/svg>\s*$/, '')
            .replace(/<rect width="200" height="200" rx="40" fill="#15171a"\/>/, '');
          const x = x0 + (i % cols) * (size + gap);
          const y = y0 + Math.floor(i / cols) * (size + gap);
          const lit = aprinse.includes(nume);
          return `<g transform="translate(${x} ${y})" opacity="${lit ? 1 : 0.16}">
            <rect width="${size}" height="${size}" rx="30" fill="${c.grafit}"/>
            <svg x="0" y="0" width="${size}" height="${size}" viewBox="0 0 200 200">${lit ? svg : svg.replace(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g, c.alb)}</svg>
          </g>`;
        })
        .join('');
      return pagina(c.carbune, icoane);
    },
  },
};

// ---------- Render ----------

const tmp = mkdtempSync(join(tmpdir(), 'coperte-'));
const alese = process.argv.slice(2);
for (const [slug, { fisier, html }] of Object.entries(coperte)) {
  if (alese.length && !alese.includes(slug)) continue;
  const page = join(tmp, `${slug}.html`);
  const png = join(tmp, `${slug}.png`);
  writeFileSync(page, html());
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--allow-file-access-from-files', '--virtual-time-budget=2000',
    '--window-size=1600,900', `--screenshot=${png}`, pathToFileURL(page).href,
  ], { stdio: 'ignore' });
  const out = join(articole, slug, fisier);
  await sharp(png).resize(1600, 900, { fit: 'cover', position: 'top' }).webp({ quality: 90 }).toFile(out);
  console.log(out.replace(root + '/', ''));
}
