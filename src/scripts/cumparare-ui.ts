import { models, groups, generalSource, serviceSource } from '../data/cumparare/catalog.mjs';
import { defaultVehicle, checksFor, covered, dueStatus, budget, cleanState, encodeState, decodeState } from './cumparare-core.mjs';

const root = document.querySelector<HTMLElement>('#buying-app');
if (root) {
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const form = $('vehicle-form') as HTMLFormElement;
  const storageKey = 'kmreali-cumparare-v1';
  const format = (n: number) => n.toLocaleString('ro-RO', { maximumFractionDigits: 2 });
  const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
  const href = (s: string) => s.startsWith('/') ? `${(root.dataset.base || '/').replace(/\/$/, '')}${s}` : s;
  const sheetKey = (v: any) => [v.model, v.generation, v.fuel, v.gearbox, v.drive, v.trim].join('|');
  let state: any = { v: 1, vehicle: defaultVehicle(), answers: {} };
  let sheets: Record<string, any> = {};
  let notes = '';
  let persistent = true;
  let message = '';
  let filtering = false;
  const selectionLabels: Record<string, string> = { unknown: 'De verificat', ok: 'În regulă', issue: 'Problemă observată', na: 'Nu se aplică' };
  function sourceLabel(source: string) {
    if (source.startsWith('/')) return 'Sursa: articolul KM Reali';
    if (source.includes('skoda-auto')) return 'Sursa: planul Škoda, p. 4';
    if (source.includes('rarom')) return 'Sursa: Registrul Auto Român';
    if (source === generalSource) return 'Sursa: checklistul ADAC (germană)';
    if (source === serviceSource) return 'Sursa: ADAC, contractul de vânzare (germană)';
    return 'Sursa: raportul ADAC pentru model (germană)';
  }
  function labels(c: any) { return c.kind === 'service' ? { unknown: 'Fără dovadă', ok: 'Am dovada', issue: 'De făcut', na: 'Nu se aplică' } : selectionLabels; }
  function allChecks() { return checksFor(state.vehicle); }
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (stored?.sheets && typeof stored.sheets === 'object' && !Array.isArray(stored.sheets)) sheets = stored.sheets;
    if (stored?.state) { state = cleanState(stored.state); notes = typeof stored.notes === 'string' ? stored.notes.slice(0, 4000) : ''; }
  } catch { persistent = false; message = 'Datele salvate nu sunt disponibile. Fișa funcționează în această pagină.'; }
  const hash = location.hash;
  if (hash.startsWith('#fisa=')) {
    try { state = decodeState(hash.slice(6)); notes = typeof sheets[sheetKey(state.vehicle)]?.notes === 'string' ? sheets[sheetKey(state.vehicle)].notes.slice(0, 4000) : ''; message = 'Fișă deschisă din link. Notele existente în acest browser se păstrează; nu provin din link.'; }
    catch { state = { v: 1, vehicle: defaultVehicle(), answers: {} }; notes = ''; message = 'Linkul nu poate fi citit. Am deschis o fișă nouă; nu am importat răspunsuri.'; }
  } else if (hash) message = 'Ancora din link nu identifică o fișă. Folosește butonul „Copiază linkul fișei”.';

  function persist() {
    sheets[sheetKey(state.vehicle)] = { vehicle: state.vehicle, answers: state.answers, notes };
    try { localStorage.setItem(storageKey, JSON.stringify({ state, notes, sheets })); }
    catch { persistent = false; }
    $('storage-status').textContent = !persistent ? 'Salvarea în browser nu este disponibilă. Păstrează fișa prin link sau PDF; notele nu sunt salvate.' : message || 'Salvat automat în acest browser · câte o fișă pentru fiecare configurație. Schimbarea modelului păstrează fișa anterioară.';
  }
  function fillForm() {
    const m = models.find(m => m.id === state.vehicle.model)!;
    $('buy-generation').innerHTML = `<option value="covered">${esc(m.generation)}</option><option value="other">Altă generație / nu știu</option>`;
    $('buy-fuel').innerHTML = `<option value="covered">${esc(m.fuel)} · acoperire parțială</option><option value="other">Alt motor / nu știu</option>`;
    for (const [key, val] of Object.entries(state.vehicle)) { const el = form.elements.namedItem(key) as HTMLInputElement; if (el) el.value = String(val); }
    ($('private-notes') as HTMLTextAreaElement).value = notes;
    $('delete-notes').dataset.confirm = ''; $('delete-notes').textContent = 'Șterge notele acestei configurații';
  }
  function updateCoverage() {
    const model = models.find(m => m.id === state.vehicle.model)!;
    const count = allChecks().filter(c => model.checks.some(s => s.id === c.id)).length;
    $('coverage').textContent = covered(state.vehicle)
      ? `${count} ${count === 1 ? 'punct specific modelului' : 'puncte specifice modelului'}, plus verificări generale. Acoperire parțială: nu este un plan complet de service. ${state.vehicle.gearbox === 'unknown' ? 'Alege cutia pentru verificările dedicate.' : ''}`
      : model.id === 'skoda-superb' && state.vehicle.generation === 'covered' && state.vehicle.fuel === 'covered' && (state.vehicle.gearbox !== 'auto' || state.vehicle.drive !== 'awd')
        ? 'Fișa Superb acoperă versiunea 2.0 TSI de 272 CP, care are numai cutie automată DSG și 4x4. Alege-le mai sus pentru verificările specifice; până atunci rămâne lista generală.'
        : 'Pentru această combinație nu avem încă verificări specifice. Mai jos rămâne numai lista generală; nu transferăm recomandările altui motor sau altei generații.';
    $('print-coverage').textContent = $('coverage').textContent;
  }
  function renderChecklist() {
    const checks = allChecks();
    $('checklist').innerHTML = groups.map(([group, step, title]) => {
      const list = checks.filter(c => c.group === group).sort((a, b) => Number(dueStatus(b, state.answers[b.id], state.vehicle).state === 'due') - Number(dueStatus(a, state.answers[a.id], state.vehicle).state === 'due'));
      if (!list.length) return '';
      return `<section class="check-group" data-group="${group}"><div class="group-heading"><span>${step}</span><h3>${title}</h3></div>${list.map(c => {
        const a = state.answers[c.id] || {}, status = a.status || 'unknown';
        const due = dueStatus(c, a, state.vehicle), choices = labels(c);
        const eligible = c.kind === 'service' ? status !== 'na' && (status !== 'ok' || due.state === 'due') : status === 'issue';
        const input = (key: string, title: string, type = 'number', max = '2000000', value: any = a[key] ?? '') => `<label>${title}<input data-answer="${key}" type="${type}" ${type === 'number' ? `min="0" max="${max}" step="1" inputmode="numeric"` : `max="${new Date().toISOString().slice(0, 10)}"`} value="${esc(value)}" /></label>`;
        return `<article class="check-card" data-check="${c.id}" data-status="${status}"><h4>${esc(c.title)}</h4><p>${esc(c.text)}</p><a class="check-source" href="${esc(href(c.source))}" target="_blank" rel="noopener noreferrer">${sourceLabel(c.source)} ↗</a>
          <div class="answer-row" role="group" aria-label="${esc(c.title)}">${Object.entries(choices).map(([value, label]) => `<button type="button" data-status="${value}" aria-pressed="${status === value}">${label}</button>`).join('')}</div>
          <span class="due-label" data-state="${due.state}">${esc(due.label)}</span>
          ${c.kind === 'service' ? `<details class="service-plan"><summary>Calculează scadența din carnet și facturi</summary><p>Completează limitele aplicabile (km și/sau timp). Prima limită atinsă are prioritate. Câmpurile goale nu înseamnă „nu e scadent”.</p><div class="plan-grid">${input('intervalKm', 'Interval confirmat · km', 'number', '500000')}${input('lastKm', 'Ultima lucrare · km')}${input('intervalMonths', 'Interval confirmat · luni', 'number', '240', a.intervalMonths ?? c.intervalMonths ?? '')}${input('lastDate', 'Data ultimei lucrări', 'date')}</div></details>` : ''}
          ${c.id === 'cutie' && covered(state.vehicle) && state.vehicle.model === 'skoda-superb' ? `<p class="price-reference">Reper al autorului, în Moldova: schimbul de ulei la cutia DQ381, cu kit ZF și manoperă, <strong>5.900 MDL (≈295 €)</strong>. Nu intră în totalul în lei. <a href="${esc(href('/recenzii/skoda-superb-2020-pareri-proprietar/'))}">Vezi articolul</a>; cere un deviz local.</p>` : ''}
          <div class="quote-box" ${eligible ? '' : 'hidden'}><label><input type="checkbox" data-answer="include" ${a.include ? 'checked' : ''} /> Include lucrarea în bugetul de discutat</label><label class="quote-input" ${a.include ? '' : 'hidden'}>Devizul tău · lei, cu manoperă<input data-answer="quote" type="number" min="0" max="1000000" step="0.01" inputmode="decimal" value="${esc(a.quote ?? '')}" placeholder="Cost neestimat" /></label></div>
          <p class="print-answer">Răspuns: ${choices[status]}</p><p class="print-quote"></p>
        </article>`;
      }).join('')}</section>`;
    }).join('');
    applyFilter(); updateCoverage(); updateSummary();
  }
  function applyFilter() {
    for (const card of $('checklist').querySelectorAll<HTMLElement>('[data-check]')) {
      const c = allChecks().find(c => c.id === card.dataset.check)!;
      card.hidden = filtering && ['ok', 'na'].includes(card.dataset.status!) && dueStatus(c, state.answers[c.id], state.vehicle).state !== 'due';
    }
    for (const section of $('checklist').querySelectorAll<HTMLElement>('.check-group')) {
      section.querySelector('.empty-checks')?.remove();
      if (!section.querySelector('.check-card:not([hidden])')) { const p = document.createElement('p'); p.className = 'empty-checks'; p.textContent = 'Nimic de clarificat în această secțiune.'; section.append(p); }
    }
  }
  function updateSummary() {
    const checks = allChecks(), b = budget(checks, state.answers, state.vehicle);
    const completed = checks.filter(c => ['ok', 'issue', 'na'].includes(state.answers[c.id]?.status)).length;
    const problems = checks.filter(c => state.answers[c.id]?.status === 'issue').length;
    $('budget-total').textContent = b.items.length ? format(b.total) : '—';
    $('budget-caption').textContent = b.unpriced ? `Total parțial · ${b.unpriced} ${b.unpriced === 1 ? 'lucrare fără preț' : 'lucrări fără preț'}.` : b.items.length ? `${b.items.length} ${b.items.length === 1 ? 'lucrare inclusă' : 'lucrări incluse'} · estimări introduse de tine.` : 'Nicio lucrare inclusă. Selectează ce trebuie bugetat.';
    $('budget-items').innerHTML = b.items.map(i => `<li><span>${esc(i.title)}</span><strong>${i.quote === null ? 'Neestimat' : `${format(i.quote)} lei`}</strong></li>`).join('');
    $('progress-label').textContent = `${completed} / ${checks.length} răspunsuri`;
    $('issue-count').textContent = problems ? `${problems} de discutat` : '';
    const progress = $('check-progress') as HTMLProgressElement; progress.value = completed; progress.max = checks.length;
    const m = models.find(m => m.id === state.vehicle.model)!;
    $('vehicle-summary').textContent = [m.name, state.vehicle.generation === 'covered' ? m.generation : 'Altă generație', state.vehicle.fuel === 'covered' ? m.fuel : 'Alt motor', state.vehicle.gearbox === 'auto' ? 'automată' : state.vehicle.gearbox === 'manual' ? 'manuală' : 'cutie neprecizată', state.vehicle.drive === 'awd' ? '4x4' : state.vehicle.drive === 'two' ? '2 roți motrice' : 'tracțiune neprecizată', state.vehicle.km !== '' ? `${format(+state.vehicle.km)} km` : 'km neprecizați', state.vehicle.year ? `an ${state.vehicle.year}` : ''].filter(Boolean).join(' · ');
    for (const c of checks) {
      const card = $('checklist').querySelector<HTMLElement>(`[data-check="${c.id}"]`); if (!card) continue;
      const a = state.answers[c.id] || {}, due = dueStatus(c, a, state.vehicle);
      const label = card.querySelector<HTMLElement>('.due-label')!; label.textContent = due.label; label.dataset.state = due.state;
      const eligible = c.kind === 'service' ? a.status !== 'na' && (a.status !== 'ok' || due.state === 'due') : a.status === 'issue';
      card.querySelector<HTMLElement>('.quote-box')!.hidden = !eligible;
      card.querySelector<HTMLElement>('.quote-input')!.hidden = !a.include;
      const item = b.items.find(i => i.id === c.id);
      card.querySelector<HTMLElement>('.print-quote')!.textContent = item ? `Inclus în buget: ${item.quote === null ? 'cost neestimat' : `${format(item.quote)} lei`}` : '';
    }
  }
  function changed() {
    message = ''; $('action-status').textContent = ''; $('manual-link-label').hidden = true;
    $('reset-checklist').dataset.confirm = ''; $('reset-checklist').textContent = 'Resetează răspunsurile acestei fișe';
    if (location.hash.startsWith('#fisa=')) history.replaceState(null, '', `${location.pathname}${location.search}#fisa=${encodeState(state)}`);
    persist();
  }
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('input', e => {
    const el = e.target as HTMLInputElement;
    if (el.name !== 'km' && el.name !== 'year') return;
    const wasCovered = covered(state.vehicle);
    state.vehicle[el.name] = el.checkValidity() ? el.value : '';
    if (wasCovered !== covered(state.vehicle)) renderChecklist();
    else { updateSummary(); updateCoverage(); }
    changed();
  });
  form.addEventListener('change', e => {
    const target = e.target as HTMLInputElement;
    if (!target.checkValidity()) { target.reportValidity(); return; }
    const oldKey = sheetKey(state.vehicle);
    sheets[oldKey] = { vehicle: { ...state.vehicle }, answers: state.answers, notes };
    if (target.name === 'model') {
      const previous = Object.values(sheets).reverse().find(s => s.vehicle?.model === target.value);
      state.vehicle = previous ? cleanState({ v: 1, vehicle: previous.vehicle, answers: {} }).vehicle : { ...defaultVehicle(), model: target.value };
    }
    else state.vehicle[target.name] = target.value;
    const key = sheetKey(state.vehicle);
    if (key !== oldKey) { state.answers = cleanState({ v: 1, vehicle: state.vehicle, answers: sheets[key]?.answers || {} }).answers; notes = typeof sheets[key]?.notes === 'string' ? sheets[key].notes.slice(0, 4000) : ''; }
    fillForm(); renderChecklist(); changed();
  });
  $('checklist').addEventListener('click', e => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-status]'); if (!button) return;
    const id = button.closest<HTMLElement>('[data-check]')!.dataset.check!;
    state.answers[id] = { ...state.answers[id], status: button.dataset.status };
    const card = button.closest<HTMLElement>('[data-check]')!; card.dataset.status = button.dataset.status;
    for (const b of card.querySelectorAll<HTMLButtonElement>('button[data-status]')) b.setAttribute('aria-pressed', String(b === button));
    card.querySelector('.print-answer')!.textContent = `Răspuns: ${button.textContent}`;
    updateSummary(); changed(); applyFilter();
    if (card.hidden) ($('checklist').querySelector<HTMLButtonElement>('.check-card:not([hidden]) button') || $('only-open')).focus();
  });
  $('checklist').addEventListener('input', e => {
    const el = e.target as HTMLInputElement, key = el.dataset.answer; if (!key) return;
    const id = el.closest<HTMLElement>('[data-check]')!.dataset.check!;
    state.answers[id] = { ...state.answers[id], [key]: el.type === 'checkbox' ? el.checked : el.value };
    updateSummary(); changed();
  });
  $('only-open').addEventListener('change', e => { filtering = (e.target as HTMLInputElement).checked; applyFilter(); });
  $('private-notes').addEventListener('input', e => { notes = (e.target as HTMLTextAreaElement).value; $('delete-notes').dataset.confirm = ''; $('delete-notes').textContent = 'Șterge notele acestei configurații'; persist(); });
  $('delete-notes').addEventListener('click', () => {
    const button = $('delete-notes');
    if (notes && button.dataset.confirm !== sheetKey(state.vehicle)) { button.dataset.confirm = sheetKey(state.vehicle); button.textContent = 'Confirmă ștergerea notelor · apasă încă o dată'; return; }
    notes = ''; ($('private-notes') as HTMLTextAreaElement).value = ''; button.dataset.confirm = ''; button.textContent = 'Șterge notele acestei configurații'; persist();
  });
  $('reset-checklist').addEventListener('click', () => {
    const button = $('reset-checklist');
    if (button.dataset.confirm !== 'yes') { button.dataset.confirm = 'yes'; button.textContent = 'Confirmă resetarea răspunsurilor și sumelor'; $('action-status').textContent = 'Apasă încă o dată pentru resetare. Notele personale se păstrează.'; return; }
    state.answers = {}; renderChecklist(); changed();
  });
  $('share-checklist').addEventListener('click', async () => {
    if (!form.reportValidity() || !Array.from($('checklist').querySelectorAll<HTMLInputElement>('input')).every(el => el.reportValidity())) return;
    const link = new URL(location.href); link.search = ''; link.hash = `fisa=${encodeState(state)}`;
    try { await navigator.clipboard.writeText(link.href); $('action-status').textContent = 'Link copiat. Oricine îl primește poate vedea răspunsurile și sumele, fără notele tale.'; }
    catch { $('manual-link-label').hidden = false; const input = $('manual-link') as HTMLInputElement; input.value = link.href; input.focus(); input.select(); $('action-status').textContent = 'Copiază manual linkul de mai jos.'; }
  });
  let printFilter = false;
  window.addEventListener('beforeprint', () => { printFilter = filtering; filtering = false; applyFilter(); });
  window.addEventListener('afterprint', () => { filtering = printFilter; applyFilter(); });
  $('print-checklist').addEventListener('click', () => { if (form.reportValidity() && Array.from($('checklist').querySelectorAll<HTMLInputElement>('input')).every(el => el.reportValidity())) window.print(); });
  window.addEventListener('hashchange', () => {
    if (!location.hash.startsWith('#fisa=')) return;
    try {
      state = decodeState(location.hash.slice(6));
      notes = typeof sheets[sheetKey(state.vehicle)]?.notes === 'string' ? sheets[sheetKey(state.vehicle)].notes.slice(0, 4000) : '';
      message = 'Fișă deschisă din link. Notele existente în acest browser se păstrează; nu provin din link.';
      fillForm(); renderChecklist(); persist();
    } catch { $('action-status').textContent = 'Linkul nu poate fi citit. Fișa curentă a fost păstrată.'; }
  });
  fillForm(); renderChecklist(); persist(); $('buying-interactive').hidden = false;
}
