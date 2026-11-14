// „100 de lei prin Europa”: the calculator and map on the hub, the reader's own sums on a country page, and the
// embeddable chart. Each page carries the data it needs in #date-carburanti; a dated link (?rev=…&week=…) or the
// embed loads a full edition instead.
import {
  carburanti,
  citesteNumar,
  CONSUM_REFERINTA,
  diferentaKm,
  distanta,
  moneda,
  numar,
  pretLei,
  pretLocal,
  provenienta,
  raspunsPeScurt,
  randuriPreturi,
  slug,
  taxe,
  zi,
  type Carburant,
  type Editie,
  type Observatie,
} from '../carburanti/calcule';

const radacina = document.querySelector<HTMLElement>('.carburanti[data-pagina]');
const baza = import.meta.env.BASE_URL.replace(/\/?$/, '/');
const adresa = (cale: string) => baza + cale.replace(/^\//, '');
const params = new URLSearchParams(location.search);
const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;

type DateCarburanti = Editie & { partial?: boolean };

/** A line above the page when a link asked for something the data does not have. */
function aviz(text: string) {
  const box = document.createElement('div');
  box.className = 'container';
  box.innerHTML = `<p class="card aviz" role="status"></p>`;
  box.querySelector('p')!.textContent = text;
  radacina!.prepend(box);
}

async function json(cale: string): Promise<DateCarburanti> {
  const response = await fetch(adresa(cale));
  if (!response.ok) throw new Error(`${response.status} ${cale}`);
  return response.json();
}

async function incarca(): Promise<DateCarburanti | null> {
  const inline = document.getElementById('date-carburanti');
  const proprii: DateCarburanti | null = inline ? JSON.parse(inline.textContent ?? 'null') : null;
  const rev = params.get('rev');
  const week = params.get('week');
  try {
    if (rev && rev !== proprii?.revision) {
      if (!/^[a-f0-9]{12}$/.test(rev)) throw new Error('rev');
      return await json(`carburanti/data/editions/${rev}.json`);
    }
    if (!proprii || (week && proprii.partial && !proprii.observations[week])) return await json('carburanti/data/current.json');
  } catch {
    aviz('Ediția de date din link nu mai este disponibilă. Vezi mai jos cifrele cele mai noi.');
    return proprii ?? (await json('carburanti/data/current.json').catch(() => null));
  }
  return proprii;
}

if (radacina) incarca().then((data) => data && porneste(radacina, data));

function porneste(radacina: HTMLElement, data: DateCarburanti) {
  // What the reader chose, from the link first.
  const ceruta = params.get('week');
  let week = ceruta && data.observations[ceruta] ? ceruta : data.week;
  if (ceruta && week !== ceruta) aviz(`Nu avem date pentru săptămâna de ${/^\d{4}-\d{2}-\d{2}$/.test(ceruta) ? zi(ceruta) : 'din link'}. Vezi mai jos ultima săptămână.`);
  let fuel: Carburant = params.get('fuel') === 'diesel' ? 'diesel' : 'petrol';
  const consumCerut = citesteNumar(params.get('consumption'));
  let consum = consumCerut > 0 && consumCerut < 100 ? consumCerut : CONSUM_REFERINTA;

  const obs = (code: string, w = week, f = fuel): Observatie | undefined => data.observations[w]?.[code]?.[f];
  const km = (code: string, w = week, f = fuel) => distanta(obs(code, w, f), consum);
  const nume = (code: string) => data.countries[code].name;
  const numeCarburant = () => carburanti[fuel].toLowerCase();
  const scrieConsum = (v: number) => numar(v, Number.isInteger(v) ? 0 : 1);

  /** A country page with the reader's settings. A dated link also pins the week and this edition of the data. */
  const linkTara = (code: string, datat = false) => {
    const p = new URLSearchParams();
    if (datat || week !== data.week) p.set('week', week);
    if (fuel !== 'petrol') p.set('fuel', fuel);
    if (consum !== CONSUM_REFERINTA) p.set('consumption', String(consum));
    if (datat || params.has('rev')) p.set('rev', data.revision);
    const query = p.toString();
    return `${location.origin}${adresa(`preturi-carburanti-europa/${slug(nume(code))}/`)}${query ? `?${query}` : ''}`;
  };

  async function copiaza(text: string, buton: HTMLElement) {
    try {
      await navigator.clipboard.writeText(text);
      const inainte = buton.textContent;
      buton.textContent = 'Copiat!';
      setTimeout(() => (buton.textContent = inainte), 2000);
    } catch {
      window.prompt('Copiază textul:', text);
    }
  }

  /** The weekly line chart: drawn at the size it is shown, so the labels stay readable on a phone. */
  function grafic(svg: SVGSVGElement, puncte: { week: string; v: number | null }[], unitate: string, zecimale: number) {
    const valide = puncte.filter((p) => p.v !== null) as { week: string; v: number }[];
    const W = Math.max(280, Math.round(svg.getBoundingClientRect().width));
    const H = Math.max(180, Math.round(svg.getBoundingClientRect().height));
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    if (!valide.length) {
      svg.innerHTML = `<text x="0" y="24">Nu avem date pentru această perioadă.</text>`;
      return;
    }
    // Round steps for the grid: 1, 2, 2,5 or 5 times a power of ten.
    let lo = Math.min(...valide.map((p) => p.v));
    let hi = Math.max(...valide.map((p) => p.v));
    const brut = (hi - lo || hi * 0.1 || 1) / 3;
    const ordin = 10 ** Math.floor(Math.log10(brut));
    const pas = [1, 2, 2.5, 5, 10].map((m) => m * ordin).find((s) => s >= brut)!;
    lo = Math.floor(lo / pas) * pas;
    hi = Math.ceil(hi / pas) * pas;
    if (hi === lo) hi = lo + pas;
    const zecimaleAxa = pas >= 1 ? 0 : pas >= 0.1 ? 1 : 2;
    // The axis labels get their own column on the left, so the line never runs through them.
    const eticheta = (v: number) => `${numar(v, zecimaleAxa)} ${unitate}`;
    const stanga = Math.max(eticheta(lo).length, eticheta(hi).length) * 7.5 + 12;
    const sus = 26, jos = H - 30, dreapta = W - 6;
    const x = (i: number) => stanga + (puncte.length > 1 ? (i / (puncte.length - 1)) * (dreapta - stanga) : (dreapta - stanga) / 2);
    const y = (v: number) => jos - ((v - lo) / (hi - lo)) * (jos - sus);
    let grila = '';
    for (let v = lo; v <= hi + pas / 2; v += pas) {
      grila += `<line x1="${stanga}" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="var(--nisip)" />`;
      grila += `<text x="${stanga - 10}" y="${y(v) + 4}" text-anchor="end">${eticheta(v)}</text>`;
    }
    // A gap in the data stays a gap in the line.
    const linii: string[] = [];
    let linie: string[] = [];
    puncte.forEach((p, i) => {
      if (p.v === null) {
        if (linie.length) linii.push(linie.join(' '));
        linie = [];
      } else linie.push(`${x(i).toFixed(1)},${y(p.v).toFixed(1)}`);
    });
    if (linie.length) linii.push(linie.join(' '));
    const ultim = puncte.length - 1 - [...puncte].reverse().findIndex((p) => p.v !== null);
    const valoare = puncte[ultim].v!;
    svg.innerHTML = `${grila}
      ${linii.map((l) => `<polyline points="${l}" fill="none" stroke="var(--rosu)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />`).join('')}
      <circle cx="${x(ultim)}" cy="${y(valoare)}" r="5" fill="var(--rosu)" stroke="var(--alb)" stroke-width="2" />
      <text class="grafic__valoare" x="${x(ultim) - 8}" y="${y(valoare) - 12}" text-anchor="end">${numar(valoare, zecimale)} ${unitate}</text>
      <text x="${stanga}" y="${H - 6}">${zi(puncte[0].week)}</text>
      <text x="${W}" y="${H - 6}" text-anchor="end">${zi(puncte.at(-1)!.week)}</text>`;
  }

  /** The last 52 weeks up to the chosen one. */
  const ultimulAn = () =>
    Object.keys(data.observations)
      .filter((w) => w <= week)
      .sort()
      .slice(-52);

  const redesenare = (svg: SVGSVGElement, draw: () => void) => {
    let latime = 0;
    new ResizeObserver(([entry]) => {
      if (Math.round(entry.contentRect.width) === latime) return;
      latime = Math.round(entry.contentRect.width);
      draw();
    }).observe(svg);
  };

  if (radacina.dataset.pagina === 'hub') hub();
  if (radacina.dataset.pagina === 'tara') paginaTara(radacina.dataset.tara!);
  if (radacina.dataset.pagina === 'embed') embed();

  function hub() {
    const form = $<HTMLFormElement>('#calcul');
    const input = $<HTMLInputElement>('#consum');
    const eroare = $('#consum-eroare');
    const rezultate = $('#rezultate');
    const harta = $('#harta');
    const fisa = $('#fisa-tara');
    const alege = $<HTMLInputElement>('#alege-tara');
    let tara = 'RO';
    let crescator = false;

    input.value = scrieConsum(consum);
    (form.elements.namedItem('carburant') as RadioNodeList).value = fuel;

    // Fewer km: pale yellow; more km: dark green. Lightness only goes one way, so it reads without colour vision too.
    const opriri = [[241, 211, 124], [159, 194, 122], [36, 97, 63]];
    const culoare = (t: number) => {
      const [a, b, f] = t < 0.5 ? [opriri[0], opriri[1], t * 2] : [opriri[1], opriri[2], (t - 0.5) * 2];
      return `rgb(${a.map((c, i) => Math.round(c + (b[i] - c) * f)).join(',')})`;
    };
    $('#legenda-scala').style.background = `linear-gradient(90deg, ${opriri.map((c) => `rgb(${c})`).join(', ')})`;

    const tari = () => Object.keys(data.countries);
    const fara = (s: string) => s.toLocaleLowerCase('ro').normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

    const hartaGata = fetch(adresa('carburanti/map.svg'))
      .then((r) => r.text())
      .then((svg) => {
        harta.innerHTML = svg;
        harta.querySelectorAll<SVGPathElement>('.country').forEach((path) => {
          const code = path.dataset.code!;
          path.setAttribute('aria-label', nume(code));
          path.addEventListener('click', () => alegeTara(code));
          path.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              alegeTara(code);
            }
          });
        });
      })
      .catch(() => (harta.innerHTML = '<p class="discret">Harta nu s-a încărcat. Rezultatele sunt în tabelul de mai jos.</p>'));

    function alegeTara(code: string) {
      tara = code;
      alege.value = nume(code);
      deseneaza();
    }

    function deseneaza() {
      $('#saptamana').textContent = `Săptămâna de ${zi(week)}`;
      const valori = tari().map((c) => km(c)).filter((v): v is number => v !== null);
      const min = Math.min(...valori), max = Math.max(...valori);
      $('#legenda-min').textContent = `${Math.round(min)} km`;
      $('#legenda-max').textContent = `${Math.round(max)} km`;
      harta.querySelectorAll<SVGPathElement>('.country').forEach((path) => {
        const k = km(path.dataset.code!);
        path.style.fill = k ? culoare((k - min) / (max - min || 1)) : 'var(--gri-deschis)';
        path.classList.toggle('selected', path.dataset.code === tara);
        path.setAttribute('aria-pressed', String(path.dataset.code === tara));
      });

      const o = obs(tara), k = km(tara), pret = pretLei(o), ro = km('RO');
      const valuta = moneda(data.countries[tara].currency);
      fisa.innerHTML = `
        <div class="fisa-tara__cap"><span>Țara aleasă</span><span>${tara}</span></div>
        <h3>${nume(tara)}</h3>
        ${
          k && pret
            ? `<p class="fisa-tara__km">${Math.round(k)} <small>km</small></p><p>cu 100 de lei · ${numeCarburant()} · ${scrieConsum(consum)} l/100 km</p>
               <dl>
                 <div><dt>Litri cumpărați</dt><dd>${numar(100 / pret, 2)} l</dd></div>
                 <div><dt>Preț mediu</dt><dd>${numar(pret, 2)} lei/l</dd></div>
                 ${tara !== 'RO' && ro ? `<div><dt>Față de România</dt><dd>${diferentaKm(k - ro)}</dd></div>` : ''}
               </dl>`
            : `<p class="discret" style="margin-block:1rem">Comisia Europeană nu are un preț pentru ${numeCarburant()} în ${nume(tara)} în această săptămână.</p>`
        }
        <a class="buton buton--lat" href="${linkTara(tara)}">Vezi ${nume(tara)} <span aria-hidden="true">→</span></a>
        ${
          o?.localRate && o.ron && k
            ? `<details class="statie"><summary>Ai prețul de la benzinăria ta?</summary>
                 <div class="camp"><label for="pret-statie">Prețul pe litru, în ${valuta}</label>
                 <div class="cu-unitate"><input id="pret-statie" inputmode="decimal" placeholder="0,00" autocomplete="off"><span>${valuta}/l</span></div></div>
                 <output id="rezultat-statie" for="pret-statie"></output></details>`
            : ''
        }
        <button class="legatura" id="copiaza-tara" type="button">Copiază linkul</button>`;
      fisa.querySelector<HTMLElement>('#copiaza-tara')!.onclick = (e) => copiaza(linkTara(tara), e.currentTarget as HTMLElement);
      const statie = fisa.querySelector<HTMLInputElement>('#pret-statie');
      if (statie && o?.localRate && o.ron && k) {
        const iesire = fisa.querySelector('#rezultat-statie')!;
        statie.oninput = () => {
          const v = citesteNumar(statie.value);
          const ok = Number.isFinite(v) && v > 0;
          statie.setAttribute('aria-invalid', String(!ok && statie.value.trim() !== ''));
          iesire.innerHTML = ok
            ? `La benzinăria ta faci <strong>${Math.round((100 / ((v / o.localRate!) * o.ron!)) * (100 / consum))} km</strong> cu 100 de lei, față de ${Math.round(k)} km la media națională.`
            : 'Scrie un preț mai mare decât zero.';
        };
      }

      const randuri = tari().sort((a, b) => {
        const x = km(a), y = km(b);
        if (x === null) return 1;
        if (y === null) return -1;
        return crescator ? x - y : y - x;
      });
      $('#clasament').innerHTML = randuri
        .map((code) => {
          const k = km(code), p = pretLei(obs(code));
          return `<tr><th scope="row"><a href="${linkTara(code)}">${nume(code)}</a></th>
            <td class="numeric">${k ? `${Math.round(k)} km` : 'Fără date'}</td>
            <td class="numeric">${p ? `${numar(p, 2)} lei` : '—'}</td>
            <td class="numeric">${code === 'RO' ? '—' : k && ro ? diferentaKm(k - ro) : '—'}</td></tr>`;
        })
        .join('');
    }

    function arata(scroll: boolean) {
      const v = citesteNumar(input.value);
      if (!(v > 0 && v < 100)) {
        eroare.textContent = 'Scrie consumul în litri la 100 km, de exemplu 6,5.';
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }
      eroare.textContent = '';
      input.removeAttribute('aria-invalid');
      consum = v;
      fuel = (form.elements.namedItem('carburant') as RadioNodeList).value as Carburant;
      rezultate.hidden = false;
      deseneaza();
      hartaGata.then(deseneaza);
      if (scroll) rezultate.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      arata(true);
    });
    // Once the results are open, they follow every change in the form.
    form.addEventListener('change', () => {
      if (!rezultate.hidden && citesteNumar(input.value) > 0) arata(false);
    });
    alege.addEventListener('input', () => {
      const gasit = tari().find((c) => fara(nume(c)) === fara(alege.value));
      if (gasit) alegeTara(gasit);
    });
    $('#sorteaza').addEventListener('click', (e) => {
      crescator = !crescator;
      (e.currentTarget as HTMLElement).textContent = `Sortează după distanță ${crescator ? '↑' : '↓'}`;
      deseneaza();
    });
    // A link that already carries the reader's settings opens on the results.
    if (params.has('consumption') || params.has('fuel') || params.has('week')) arata(false);
  }

  function paginaTara(cod: string) {
    const esteRomania = cod === 'RO';
    const valuta = data.countries[cod].currency;
    const form = $<HTMLFormElement>('#setari');
    const consumInput = $<HTMLInputElement>('#setari-consum');
    const saptamana = $<HTMLSelectElement>('#setari-saptamana');
    const drum = $<HTMLInputElement>('#drum');
    const svg = $<SVGSVGElement>('#grafic');
    let modGrafic: 'km' | 'pret' = 'km';

    consumInput.value = scrieConsum(consum);
    (form.elements.namedItem('carburant') as RadioNodeList).value = fuel;
    // The list comes from the data, so a dated link shows the weeks of its own edition.
    saptamana.innerHTML = Object.keys(data.observations)
      .sort()
      .reverse()
      .map((w) => `<option value="${w}">${zi(w)}</option>`)
      .join('');
    saptamana.value = week;

    /** The parts the build wrote for the current week, rewritten for another week. */
    function saptamanaPublicata() {
      const benzina = data.observations[week]?.[cod]?.petrol;
      $('#saptamana-antet').textContent = `Săptămâna de ${zi(week)} · Weekly Oil Bulletin, Comisia Europeană`;
      $('#pe-scurt').textContent = raspunsPeScurt(nume(cod), week, benzina);
      const roKm = distanta(data.observations[week]?.RO?.petrol);
      const romania = document.getElementById('pe-scurt-romania');
      if (romania) romania.textContent = roKm ? `În România, în aceeași săptămână, faci ${Math.round(roKm)} km cu aceiași bani.` : '';
      $('#pe-scurt-sursa').textContent = `${provenienta(benzina)} Formula: 100 ÷ prețul în lei pe litru × 100 ÷ consum.`;
      $('#preturi-saptamana').textContent = `Media națională · săptămâna de ${zi(week)}`;
      $('#tabel-preturi').innerHTML = randuriPreturi(data.observations[week]?.[cod], valuta);
    }

    function actualizeaza() {
      const o = obs(cod), pret = pretLei(o), k = km(cod);
      $('#rezultat-personal').textContent = k
        ? `Cu 100 de lei faci ${Math.round(k)} km în ${nume(cod)}: ${numeCarburant()}, ${scrieConsum(consum)} l/100 km, săptămâna de ${zi(week)}.`
        : `Nu avem prețul la ${numeCarburant()} în ${nume(cod)} pentru săptămâna de ${zi(week)}.`;

      // Trip cost
      const d = citesteNumar(drum.value);
      document.querySelectorAll<HTMLButtonElement>('[data-drum]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.drum) === d)));
      const cost = $('#cost-drum');
      if (!(d > 0)) cost.innerHTML = '<p class="discret">Scrie distanța în kilometri.</p>';
      else if (!pret) cost.innerHTML = '<p class="discret">Nu avem prețul pentru această săptămână.</p>';
      else {
        const litri = (d * consum) / 100;
        const lei = litri * pret;
        const local = pretLocal(o);
        const pretRo = pretLei(obs('RO'));
        const detalii = [`${numar(litri, 1)} l de ${numeCarburant()}`, ...(valuta !== 'RON' && local ? [`${numar(litri * local, 2)} ${moneda(valuta)}`] : [])];
        let comparatie = '';
        if (!esteRomania && pretRo) {
          const dif = lei - litri * pretRo;
          comparatie = `<p>Același drum în România: <strong>${numar(litri * pretRo, 2)} lei</strong>${
            Math.abs(dif) >= 0.5 ? `, deci în ${nume(cod)} plătești cu ${numar(Math.abs(dif), 0)} lei ${dif > 0 ? 'mai mult' : 'mai puțin'}.` : ', aproape la fel.'
          }</p>`;
        }
        cost.innerHTML = `<p class="raspuns__cifra">${numar(lei, 2)} lei<small>${detalii.join(' · ')}</small></p>${comparatie}`;
      }

      // Tax share, here and in Romania
      const bara = (code: string) => {
        const t = taxe(obs(code));
        return t === null
          ? `<div class="bara"><div class="bara__rand"><span>${nume(code)}</span><span class="discret">Fără date</span></div></div>`
          : `<div class="bara"><div class="bara__rand"><span>${nume(code)}</span><strong>${numar(100 * t, 1)} lei taxe</strong></div>
             <div class="bara__fundal"><i style="width:${(100 * t).toFixed(1)}%"></i></div></div>`;
      };
      const t = taxe(o);
      $('#taxe').innerHTML = `${bara(cod)}${esteRomania ? '' : bara('RO')}
        <p class="discret">${t === null ? 'Comisia nu are ambele prețuri, cu și fără taxe, pentru această săptămână.' : `Restul de ${numar(100 - 100 * t, 1)} lei din 100 este prețul carburantului fără taxe.`} ${carburanti[fuel]}, săptămâna de ${zi(week)}.</p>`;

      deseneazaGrafic();
      history.replaceState(null, '', linkTara(cod));
    }

    function deseneazaGrafic() {
      const weeks = ultimulAn();
      const puncte = weeks.map((w) => ({ week: w, o: obs(cod, w) }));
      const valori = puncte.map(({ week: w, o }) => ({ week: w, v: modGrafic === 'km' ? distanta(o, consum) : pretLei(o) }));
      grafic(svg, valori, modGrafic === 'km' ? 'km' : 'lei', modGrafic === 'km' ? 0 : 2);
      const numarate = valori.filter((p) => p.v !== null).length;
      $('#grafic-descriere').textContent = `${modGrafic === 'km' ? 'Km cu 100 de lei' : 'Lei pe litru'} în ${nume(cod)}, ${numeCarburant()}${
        modGrafic === 'km' ? `, ${scrieConsum(consum)} l/100 km` : ''
      }: ${numarate}${numarate % 100 >= 20 || numarate % 100 === 0 ? ' de' : ''} ${numarate === 1 ? 'săptămână' : 'săptămâni'}, de la ${zi(weeks[0])} la ${zi(weeks.at(-1)!)}.`;
      $('#tabel-istoric').innerHTML = `<thead><tr><th scope="col">Săptămâna</th><th scope="col" class="numeric">Lei pe litru</th><th scope="col" class="numeric">Km cu 100 de lei</th></tr></thead><tbody>${[...puncte]
        .reverse()
        .map(({ week: w, o }) => {
          const p = pretLei(o), k = distanta(o, consum);
          return `<tr><td>${zi(w)}</td><td class="numeric">${p ? numar(p, 3) : 'Fără date'}</td><td class="numeric">${k ? numar(k, 1) : 'Fără date'}</td></tr>`;
        })
        .join('')}</tbody>`;
      const csv = ['Săptămâna;Lei pe litru;Km cu 100 de lei', ...puncte.map(({ week: w, o }) => {
        const p = pretLei(o), k = distanta(o, consum);
        return `${w};${p ? numar(p, 3) : ''};${k ? numar(k, 1) : ''}`;
      })].join('\n');
      const link = $<HTMLAnchorElement>('#descarca-csv');
      link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(`﻿${csv}`)}`;
      link.download = `carburanti-${slug(nume(cod))}-${fuel === 'petrol' ? 'benzina' : 'motorina'}.csv`;
    }

    if (week !== data.week || params.has('rev')) saptamanaPublicata();

    consumInput.addEventListener('input', () => {
      const v = citesteNumar(consumInput.value);
      const ok = v > 0 && v < 100;
      consumInput.setAttribute('aria-invalid', String(!ok));
      if (ok) {
        consum = v;
        actualizeaza();
      }
    });
    form.addEventListener('change', (e) => {
      if (e.target === saptamana) {
        week = saptamana.value;
        saptamanaPublicata();
      } else if ((e.target as HTMLInputElement).name === 'carburant') fuel = (e.target as HTMLInputElement).value as Carburant;
      actualizeaza();
    });
    form.addEventListener('submit', (e) => e.preventDefault());
    drum.addEventListener('input', actualizeaza);
    document.querySelectorAll<HTMLButtonElement>('[data-drum]').forEach((b) =>
      b.addEventListener('click', () => {
        drum.value = b.dataset.drum!;
        actualizeaza();
      }),
    );
    document.querySelectorAll<HTMLButtonElement>('[data-grafic]').forEach((b) =>
      b.addEventListener('click', () => {
        modGrafic = b.dataset.grafic as 'km' | 'pret';
        document.querySelectorAll('[data-grafic]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        deseneazaGrafic();
      }),
    );

    const citat = () => {
      const k = km(cod);
      const text = k
        ? `În ${nume(cod)}, în săptămâna de ${zi(week)}, 100 de lei ajungeau pentru aproximativ ${Math.round(k)} km cu ${numeCarburant()}, la un consum de ${scrieConsum(consum)} l/100 km.`
        : raspunsPeScurt(nume(cod), week, obs(cod, week, 'petrol'));
      return `${text} Sursa: Comisia Europeană și BCE, calcul KM Reali. ${linkTara(cod, true)}`;
    };
    $('#copiaza-citat').addEventListener('click', (e) => copiaza(citat(), e.currentTarget as HTMLElement));
    $('#copiaza-link').addEventListener('click', (e) => copiaza(linkTara(cod), e.currentTarget as HTMLElement));
    $('#copiaza-link-datat').addEventListener('click', (e) => copiaza(linkTara(cod, true), e.currentTarget as HTMLElement));
    $('#copiaza-embed').addEventListener('click', (e) => {
      const src = `${location.origin}${adresa('preturi-carburanti-europa/embed/')}?${new URLSearchParams({ country: cod, fuel })}`;
      copiaza(`<iframe src="${src}" title="Prețul carburanților în ${nume(cod)}, KM Reali" width="100%" height="420" style="border:0" loading="lazy"></iframe>`, e.currentTarget as HTMLElement);
    });

    actualizeaza();
    redesenare(svg, deseneazaGrafic);
  }

  function embed() {
    const cerut = params.get('country')?.toUpperCase() ?? '';
    const cod = data.countries[cerut] ? cerut : 'RO';
    week = data.week;
    $('#embed-titlu').textContent = `Prețul ${fuel === 'petrol' ? 'benzinei 95' : 'motorinei'} în ${nume(cod)}`;
    $<HTMLAnchorElement>('#embed-link').href = adresa(`preturi-carburanti-europa/${slug(nume(cod))}/`);
    const svg = $<SVGSVGElement>('#grafic');
    const draw = () => {
      const weeks = ultimulAn();
      grafic(svg, weeks.map((w) => ({ week: w, v: pretLei(obs(cod, w)) })), 'lei', 2);
      $('#grafic-descriere').textContent = `Lei pe litru, media națională, săptămânal, de la ${zi(weeks[0])} la ${zi(weeks.at(-1)!)}.`;
    };
    draw();
    redesenare(svg, draw);
  }
}
