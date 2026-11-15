import { models, commonChecks, serviceChecks, haldex, serviceSource } from '../data/cumparare/catalog.mjs';
export const statuses = ['unknown', 'ok', 'issue', 'na'];
export const defaultVehicle = () => ({ model: 'bmw-3', generation: 'covered', fuel: 'covered', gearbox: 'unknown', drive: 'unknown', km: '', year: '', trim: '' });
const number = (v, max) => v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= max ? Number(v) : null;
export function covered(v) {
  const m = models.find(m => m.id === v.model);
  return !!m && v.generation === 'covered' && v.fuel === 'covered' && (!v.year || (+v.year >= m.minYear && +v.year <= m.maxYear)) && (m.id !== 'skoda-superb' || (v.gearbox === 'auto' && v.drive === 'awd'));
}
export function checksFor(v) {
  const m = models.find(m => m.id === v.model) || models[0];
  const matches = c => (!c.gearbox || c.gearbox === v.gearbox) && (!c.drive || c.drive === v.drive);
  const extra = v.trim === 'comfort' ? [{ id: 'extra-confort', title: 'Scaunele și hayonul electric, dacă există', text: 'Probează reglajele, încălzirea sau ventilația scaunelor și deschiderea hayonului. Bifează doar după verificarea dotărilor efectiv prezente.', kind: 'inspection', group: 'inspection', source: serviceSource }] : v.trim === 'sport' ? [{ id: 'extra-sport', title: 'Suspensia reglabilă, dacă există', text: 'Cere demonstrarea modurilor disponibile și verificarea amortizoarelor la service. O emblemă sport nu dovedește prezența suspensiei adaptive.', kind: 'inspection', group: 'inspection', source: serviceSource }] : [];
  return [...commonChecks, ...serviceChecks, ...(covered(v) ? m.checks.map(c => ({ source: m.source, ...c })) : []), ...(covered(v) && m.id === 'skoda-superb' ? [haldex] : []), ...extra].filter(matches);
}
export function dueStatus(check, answer = {}, vehicle, now = new Date()) {
  if (check.kind !== 'service' || answer.status === 'na') return { state: 'none', label: '' };
  if (answer.status === 'issue') return { state: 'due', label: 'Lucrare de bugetat · declarată de tine' };
  const km = number(vehicle.km, 2000000), last = number(answer.lastKm, 2000000), interval = number(answer.intervalKm, 500000);
  const months = number(answer.intervalMonths ?? check.intervalMonths, 240);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(answer.lastDate || '') ? new Date(`${answer.lastDate}T00:00:00Z`) : null;
  if ((last !== null && km !== null && last > km) || (date && (!Number.isFinite(+date) || date > now || date.toISOString().slice(0, 10) !== answer.lastDate))) return { state: 'invalid', label: 'Verifică data sau kilometrajul ultimei lucrări' };
  let remainingKm = null, deadline = null;
  if (km !== null && last !== null && interval > 0) remainingKm = last + interval - km;
  if (date && months > 0) { deadline = new Date(date); const day = deadline.getUTCDate(); deadline.setUTCDate(1); deadline.setUTCMonth(deadline.getUTCMonth() + months); const end = new Date(Date.UTC(deadline.getUTCFullYear(), deadline.getUTCMonth() + 1, 0)).getUTCDate(); deadline.setUTCDate(Math.min(day, end)); }
  if ((remainingKm !== null && remainingKm <= 0) || (deadline && deadline <= now)) return { state: 'due', label: 'Scadentă conform intervalului introdus' };
  if (remainingKm !== null || deadline) return { state: 'planned', label: [remainingKm !== null ? `În ${remainingKm.toLocaleString('ro-RO')} km` : '', deadline ? `până la ${deadline.toLocaleDateString('ro-RO', { timeZone: 'UTC' })}` : ''].filter(Boolean).join(' · ') + ' · pentru limitele completate' };
  return { state: 'unknown', label: answer.status === 'ok' ? 'Dovadă bifată · scadență necalculată' : 'De clarificat · interval sau istoric incomplet' };
}
export function budget(checks, answers, vehicle, now = new Date()) {
  let total = 0, unpriced = 0;
  const items = [];
  for (const check of checks) {
    const a = answers[check.id] || {};
    if (a.status === 'na') continue;
    const due = dueStatus(check, a, vehicle, now);
    const eligible = check.kind === 'service' ? a.status !== 'ok' || due.state === 'due' : a.status === 'issue';
    if (!eligible || !a.include) continue;
    const quote = number(a.quote, 1000000);
    if (quote === null) unpriced++; else total += Math.round(quote * 100);
    items.push({ id: check.id, title: check.title, quote });
  }
  return { total: total / 100, unpriced, items };
}
export function cleanState(raw) {
  if (!raw || raw.v !== 1 || !models.some(m => m.id === raw.vehicle?.model)) throw new Error('Link necunoscut sau versiune incompatibilă.');
  const v = raw.vehicle, vehicle = defaultVehicle();
  vehicle.model = v.model;
  for (const key of ['generation', 'fuel']) if (['covered', 'other'].includes(v[key])) vehicle[key] = v[key];
  if (['auto', 'manual', 'unknown'].includes(v.gearbox)) vehicle.gearbox = v.gearbox;
  if (['awd', 'two', 'unknown'].includes(v.drive)) vehicle.drive = v.drive;
  if (number(v.km, 2000000) !== null) vehicle.km = String(v.km);
  if (number(v.year, new Date().getFullYear() + 1) >= 1900) vehicle.year = String(v.year);
  if (['standard', 'sport', 'comfort', 'unknown', ''].includes(v.trim)) vehicle.trim = v.trim;
  const answers = {};
  for (const c of checksFor(vehicle)) {
    const a = raw.answers?.[c.id]; if (!a || typeof a !== 'object') continue;
    const result = { status: statuses.includes(a.status) ? a.status : 'unknown', include: a.include === true };
    for (const [key, max] of [['quote', 1000000], ['lastKm', 2000000], ['intervalKm', 500000], ['intervalMonths', 240]]) if (number(a[key], max) !== null) result[key] = String(a[key]);
    if (/^\d{4}-\d{2}-\d{2}$/.test(a.lastDate || '') && !Number.isNaN(Date.parse(a.lastDate))) result.lastDate = a.lastDate;
    answers[c.id] = result;
  }
  return { v: 1, vehicle, answers };
}
export function encodeState(state) { return encodeURIComponent(JSON.stringify(cleanState(state))); }
export function decodeState(encoded) { if (encoded.length > 30000) throw new Error('Link prea lung.'); return cleanState(JSON.parse(decodeURIComponent(encoded))); }
