// Draws the one-picture overview of dashboard warning lights, grouped by colour,
// for the guide „Martorii de bord – ce înseamnă fiecare culoare”.
// The icons are the martor-*.svg files of the Škoda guide (the same ones the finder uses).
//   node scripts/plansa-martori.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const icons = join(root, 'src/content/articole/martori-bord-skoda');
const out = join(root, 'src/content/articole/semnificatie-martori-bord/martori-bord-pe-culori.webp');
const fonts = pathToFileURL(join(root, 'src/assets/fonts')).href;
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const grupuri = [
  {
    titlu: 'Roșu',
    sub: 'oprește în siguranță sau nu pleca',
    culoare: '#ff3b30',
    martori: [
      ['frana', 'Frâna'],
      ['frana-de-parcare', 'Frâna de parcare'],
      ['presiune-ulei', 'Presiunea uleiului'],
      ['lichid-racire', 'Temperatura motorului'],
      ['alternator', 'Încărcarea bateriei'],
      ['centura', 'Centura'],
      ['airbag-rosu', 'Airbag'],
      ['servodirectie-rosu', 'Servodirecția'],
      ['cutie-rosu', 'Cutia automată'],
      ['stop', 'STOP'],
    ],
  },
  {
    titlu: 'Galben',
    sub: 'verifică repede; unele cer oprire',
    culoare: '#ffb000',
    martori: [
      ['motor', 'Motor (check engine)'],
      ['epc', 'EPC'],
      ['abs', 'ABS'],
      ['esc', 'ESP / ESC'],
      ['esc-off', 'ESP oprit'],
      ['presiune-anvelope', 'Presiunea în anvelope'],
      ['rezerva', 'Rezervă'],
      ['nivel-ulei', 'Nivelul uleiului'],
      ['preincalzire', 'Preîncălzire (diesel)'],
      ['filtru-particule', 'Filtru de particule'],
      ['apa-motorina', 'Apă în motorină'],
      ['placute-frana', 'Plăcuțe de frână'],
      ['airbag', 'Airbag (la unele mărci)'],
      ['servodirectie-galben', 'Servodirecția'],
      ['parcare-galben', 'Frâna de parcare defectă'],
      ['triunghi', 'Avertizare generală'],
      ['lichid-parbriz', 'Lichid de parbriz'],
      ['lampa-ceata-spate', 'Ceață spate aprinsă'],
    ],
  },
  {
    titlu: 'Verde, albastru, alb',
    sub: 'un sistem e pornit sau îți cere ceva',
    culoare: '#34c759',
    martori: [
      ['semnalizare', 'Semnalizare'],
      ['faza-lunga', 'Faza lungă'],
      ['proiectoare-ceata', 'Proiectoare de ceață'],
      ['racire-albastru', 'Motor rece'],
      ['pilot-automat', 'Pilot automat'],
      ['pedala-frana', 'Apasă frâna'],
      ['auto-hold', 'Auto Hold'],
      ['lane-assist', 'Asistent de bandă'],
      ['asistent-faza-lunga', 'Faza lungă automată'],
      ['start-stop', 'Start-Stop'],
      ['fulg', 'Risc de polei'],
      ['service', 'Revizie'],
    ],
  },
];

const W = 1200;
const icon = (nume) =>
  readFileSync(join(icons, `martor-${nume}.svg`), 'utf8').replace(/ width="48" height="48"/, ' width="132" height="132"')
    .replace('fill="#15171a"', 'fill="#2e3137"');

const face = (family, weight, file) =>
  `@font-face{font-family:'${family}';font-weight:${weight};src:url('${fonts}/${file}') format('woff2');}`;

const html = `<!doctype html><meta charset="utf-8"><style>
  ${face('Barlow Condensed', 800, 'barlow-condensed-latin-800-normal.woff2')}
  ${face('Barlow Condensed', 800, 'barlow-condensed-latin-ext-800-normal.woff2')}
  ${face('Barlow', 600, 'barlow-latin-600-normal.woff2')}
  ${face('Barlow', 600, 'barlow-latin-ext-600-normal.woff2')}
  ${face('Barlow', 400, 'barlow-latin-400-normal.woff2')}
  ${face('Barlow', 400, 'barlow-latin-ext-400-normal.woff2')}
  html,body{margin:0;background:#15171a;color:#f4f1ea;width:${W}px}
  main{padding:56px 48px 40px}
  h1{font:800 64px/1 'Barlow Condensed';margin:0 0 8px;letter-spacing:.5px}
  .lead{font:400 24px/1.3 Barlow;margin:0 0 36px;color:#c9c5bb}
  section{margin-bottom:34px}
  h2{display:flex;align-items:baseline;gap:16px;margin:0 0 20px;padding-top:14px;border-top:8px solid var(--c)}
  h2 b{font:800 44px/1 'Barlow Condensed';color:var(--c);text-transform:uppercase;letter-spacing:1px}
  h2 span{font:400 26px/1.2 Barlow;color:#f4f1ea}
  ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(6,1fr);gap:22px 12px}
  li{display:flex;flex-direction:column;align-items:center;text-align:center}
  li svg{display:block;border-radius:26px;background:#2e3137}
  li p{font:600 21px/1.15 Barlow;margin:10px 0 0;max-width:170px}
  footer{font:400 19px/1.3 Barlow;color:#9a968d;border-top:1px solid #2e3137;padding-top:16px}
</style><main>
  <h1>Martorii de bord, pe culori</h1>
  <p class="lead">Culoarea îți spune cât de grav e. Mesajul de pe bord și manualul îți spun ce faci.</p>
  ${grupuri
    .map(
      (g) => `<section style="--c:${g.culoare}"><h2><b>${g.titlu}</b><span>${g.sub}</span></h2><ul>${g.martori
        .map(([nume, eticheta]) => `<li>${icon(nume)}<p>${eticheta}</p></li>`)
        .join('')}</ul></section>`,
    )
    .join('')}
  <footer>kmreali.ro · Simboluri orientative, colorate ca în manuale. Forma și culoarea pot diferi de la o mașină la alta.</footer>
</main>`;

const tmp = mkdtempSync(join(tmpdir(), 'plansa-'));
const page = join(tmp, 'plansa.html');
const png = join(tmp, 'plansa.png');
writeFileSync(page, html);
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--allow-file-access-from-files', '--virtual-time-budget=2000',
  `--window-size=${W},3000`, `--screenshot=${png}`, pathToFileURL(page).href,
], { stdio: 'ignore' });
// The window is taller than the page: cut the empty background at the bottom.
const { info } = await sharp(png).trim({ background: '#15171a', threshold: 4 }).toBuffer({ resolveWithObject: true });
const height = (info.trimOffsetTop ?? 0) * -1 + info.height + 40;
await sharp(png).extract({ left: 0, top: 0, width: W, height }).webp({ quality: 88 }).toFile(out);
console.log(out.replace(root + '/', ''), `${W}×${height}`);
