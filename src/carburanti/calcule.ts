// The sums and wording of „100 de lei prin Europa”, shared by the pages and their script.
// No data is imported here, so the script that runs in the browser stays small.

export type Carburant = 'petrol' | 'diesel';

/** One country, one fuel, one week, as scripts/carburanti/refresh.py writes it. Prices are euro per 1.000 l. */
export interface Observatie {
  gross: number | null;
  net: number | null;
  ron: number | null;
  fxDate: string | null;
  localRate: number | null;
  localFxDate: string | null;
}

export interface Editie {
  week: string;
  revision: string;
  retrieved: string;
  sources: Record<string, string>;
  hashes: Record<string, string>;
  countries: Record<string, { name: string; currency: string }>;
  observations: Record<string, Record<string, Record<Carburant, Observatie>>>;
}

export const BUGET = 100;
export const CONSUM_REFERINTA = 6.5;
export const carburanti: Record<Carburant, string> = { petrol: 'Benzină 95', diesel: 'Motorină' };

/** "Țările de Jos" → "tarile-de-jos". The country pages live at these addresses. */
export const slug = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');

type Poate = Observatie | null | undefined;

export const pretLei = (o: Poate) => (o?.gross && o.ron ? (o.gross / 1000) * o.ron : null);
export const pretLocal = (o: Poate) => (o?.gross && o.localRate ? (o.gross / 1000) * o.localRate : null);
export const distanta = (o: Poate, consum = CONSUM_REFERINTA) => {
  const pret = pretLei(o);
  return pret ? (BUGET / pret) * (100 / consum) : null;
};
/** The share of the pump price that is tax, only when both prices are there and make sense. */
export const taxe = (o: Poate) => (o?.gross && o.net && o.net <= o.gross ? (o.gross - o.net) / o.gross : null);

export const numar = (value: number, digits = 0) =>
  value.toLocaleString('ro-RO', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const zi = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });

export const moneda = (code: string) => ({ RON: 'lei', EUR: '€' })[code] ?? code;

/** "+16 km", "−8 km", "0 km": rounded before the sign, so nothing reads "+0 km". */
export const diferentaKm = (km: number) => {
  const r = Math.round(km);
  return r > 0 ? `+${r} km` : r < 0 ? `−${-r} km` : '0 km';
};

// The text both the built page and the script write, so they never say different things.

/** The short answer on a country page: always benzina 95 at the reference consumption. */
export const raspunsPeScurt = (tara: string, week: string, o: Poate) => {
  const km = distanta(o);
  return km
    ? `În ${tara}, în săptămâna de ${zi(week)}, 100 de lei ajungeau pentru aproximativ ${Math.round(km)} km cu benzină 95, la un consum de 6,5 l/100 km.`
    : `Pentru ${tara} nu există un preț verificat la benzina 95 în săptămâna de ${zi(week)}.`;
};

export const provenienta = (o: Poate) => {
  const lei = pretLei(o);
  return lei && o?.gross && o.ron && o.fxDate
    ? `Prețul mediu raportat de Comisia Europeană: ${numar(lei, 2)} lei pe litru (${numar(o.gross / 1000, 3)} € pe litru), la cursul BCE de ${numar(o.ron, 4)} lei pentru un euro din ${zi(o.fxDate)}.`
    : '';
};

/** Rows of the week's price table. Countries that pay in lei get no second currency column. */
export const randuriPreturi = (row: Partial<Record<Carburant, Observatie>> | undefined, currency: string) =>
  (Object.keys(carburanti) as Carburant[])
    .map((fuel) => {
      const o = row?.[fuel];
      const lei = pretLei(o);
      const local = pretLocal(o);
      const km = distanta(o);
      const cells = [
        lei ? `${numar(lei, 2)} lei` : 'Fără date',
        ...(currency === 'RON' ? [] : [local ? `${numar(local, 2)} ${moneda(currency)}` : '—']),
        km ? `${Math.round(km)} km` : '—',
      ];
      return `<tr><th scope="row">${carburanti[fuel]}</th>${cells.map((c) => `<td class="numeric">${c}</td>`).join('')}</tr>`;
    })
    .join('');

/** Reads a number the way it is written in Romanian ("6,5", "1.000", "1.234,5") and also "6.5". */
export const citesteNumar = (text: string | null | undefined) => {
  let s = String(text ?? '').trim().replace(/\s/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  return s === '' ? NaN : Number(s);
};
