// The road-trip checklist in the browser: the car and route choices, the ticks, the summary and printing.
// Every check and country sheet is already in the HTML; this only shows, hides and labels them.
import { clean, daysUntil, initial, isVisible, maxCustom, summarize, type Answer, type CheckRef, type Condition, type Engine, type State } from '../drum-lung/stare.ts';

const storageKey = 'kmreali-drum-lung-v1';
const statusLabel = { ok: 'În regulă', issue: 'De rezolvat', na: 'Nu se aplică', pending: 'Neverificat' };
const statusIcon = { ok: '✓', issue: '!', na: '−', pending: '' };
type Status = keyof typeof statusLabel;

/** Romanian puts „de” between a number and its noun from 20 up: „19 verificări”, „23 de verificări”. */
const withDe = (count: number, noun: string) => (count % 100 >= 20 || (count >= 100 && count % 100 === 0) ? `de ${noun}` : noun);

export function initDrumLung(root: HTMLElement) {
  const one = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const all = <T extends Element = HTMLElement>(selector: string) => [...root.querySelectorAll<T>(selector)];

  const articles = all('[data-check]');
  const checks: CheckRef[] = articles.map((article) => ({
    id: article.dataset.check!,
    title: article.querySelector('h4')!.textContent!.trim(),
    condition: article.dataset.condition as Condition | undefined,
  }));
  const checkById = new Map(checks.map((check) => [check.id, check]));
  const countryButtons = all<HTMLButtonElement>('[data-country]');
  const countryCards = all<HTMLDetailsElement>('[data-country-card]');
  const countryIds = countryButtons.map((button) => button.dataset.country!);
  const countryNames = new Map(countryButtons.map((button) => [button.dataset.country!, button.dataset.name!]));

  let state: State = initial();
  let storageWorks = true;
  try {
    state = clean(JSON.parse(localStorage.getItem(storageKey) ?? 'null'), checks.map((check) => check.id), countryIds);
  } catch {
    storageWorks = false;
  }
  let tab = 'car';
  let onlyOpen = false;
  let printing = false;

  function showStorage(message?: string) {
    one('[data-storage]').textContent = message ?? (storageWorks
      ? 'Fișa se salvează automat în acest browser. Poți reveni la ea de pe același dispozitiv.'
      : 'Browserul nu permite salvarea. Poți folosi lista și o poți imprima înainte să închizi pagina.');
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      storageWorks = true;
    } catch {
      storageWorks = false;
    }
    showStorage();
  }

  function renderChecks() {
    let shown = 0;
    for (const group of all('[data-group]')) {
      let shownInGroup = 0;
      for (const article of group.querySelectorAll<HTMLElement>('[data-check]')) {
        const check = checkById.get(article.dataset.check!)!;
        const status: Status = state.answers[check.id] ?? 'pending';
        article.dataset.status = status;
        article.querySelector('.rt-check-icon')!.textContent = statusIcon[status];
        article.querySelector('[data-print-status]')!.textContent = `Stare: ${statusLabel[status]}`;
        for (const button of article.querySelectorAll<HTMLButtonElement>('[data-answer]')) button.setAttribute('aria-pressed', String(button.dataset.answer === status));

        const inTab = tab === 'all' || group.dataset.group === tab;
        const open = status === 'pending' || status === 'issue';
        const show = isVisible(check, state) && (printing || (inTab && (!onlyOpen || open)));
        article.hidden = !show;
        if (show) shownInGroup++;
      }
      group.hidden = shownInGroup === 0;
      shown += shownInGroup;
    }
    one('[data-empty]').hidden = shown > 0;
  }

  function renderVignetteHint() {
    const hint = root.querySelector<HTMLElement>('[data-vignette-hint]');
    if (!hint) return;
    const days = daysUntil(state.date, new Date());
    // ASFINAG: an annual or 2-month digital vignette bought online is valid from the 18th day after purchase.
    const show = state.countries.includes('at') && days !== null && days >= 0 && days < 18;
    hint.hidden = !show;
    if (show) {
      const when = days === 0 ? 'Pleci azi' : days === 1 ? 'Pleci mâine' : `Pleci peste ${days} zile`;
      hint.textContent = `${when}: o vinietă anuală sau de 2 luni cumpărată acum online nu va fi valabilă la plecare. Ia una de 1 sau 10 zile, ori de la un punct de vânzare.`;
    }
  }

  function renderCountries() {
    for (const button of countryButtons) button.setAttribute('aria-pressed', String(state.countries.includes(button.dataset.country!)));
    for (const card of countryCards) {
      const id = card.dataset.countryCard!;
      const position = state.countries.indexOf(id);
      const reviewed = state.countryReviews[id] === true;
      card.hidden = position === -1;
      // Cards follow the order the countries were picked in, which is usually the route.
      card.style.order = String(position);
      card.querySelector('[data-review-label]')!.textContent = reviewed ? '✓ Verificat' : 'De verificat';
      card.querySelector<HTMLInputElement>('[data-review]')!.checked = reviewed;
      card.querySelector('[data-review-print]')!.textContent = `Reguli: ${reviewed ? 'verificate' : 'de verificat'}`;
    }
    const count = state.countries.length;
    one('[data-country-count]').textContent = `${count} ${count === 1 ? 'țară' : 'țări'}`;
    one('[data-no-countries]').hidden = count > 0;
    renderVignetteHint();
  }

  function renderSummary() {
    const summary = summarize(state, checks);
    one('[data-done]').textContent = String(summary.ok);
    one('[data-total]').textContent = String(summary.total);
    one('[data-total-unit]').textContent = summary.total === 1 ? 'verificare' : withDe(summary.total, 'verificări');
    const progress = one<HTMLProgressElement>('[data-progress]');
    progress.max = summary.total || 1;
    progress.value = summary.ok;

    const issues = document.createElement('b');
    issues.textContent = `De rezolvat: ${summary.issues.length}`;
    one('[data-stats]').replaceChildren(`Rămase: ${summary.pending} · `, issues, summary.na ? ` · Nu se aplică: ${summary.na}` : '');
    one('[data-issues]').replaceChildren(...summary.issues.map((title) => Object.assign(document.createElement('li'), { textContent: title })));

    const route = state.countries.map((id) => countryNames.get(id)).join(' · ');
    const date = state.date ? new Date(`${state.date}T12:00:00`).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    one('[data-trip]').textContent = [route || 'Traseu nespecificat', date].filter(Boolean).join(' / ');
  }

  function renderPersonal() {
    one('[data-personal]').replaceChildren(...state.custom.map((task) => {
      const row = Object.assign(document.createElement('li'), { className: 'rt-personal-row' });
      const box = Object.assign(document.createElement('input'), { type: 'checkbox', checked: task.done });
      box.dataset.custom = task.id;
      const label = document.createElement('label');
      label.append(box, ` ${task.title}`);
      const remove = Object.assign(document.createElement('button'), { type: 'button', textContent: '×' });
      remove.dataset.delete = task.id;
      remove.setAttribute('aria-label', `Șterge: ${task.title}`);
      const print = Object.assign(document.createElement('span'), { className: 'rt-print-status', textContent: task.done ? 'În regulă' : 'De verificat' });
      row.append(label, remove, print);
      return row;
    }));
  }

  function render() {
    renderChecks();
    renderCountries();
    renderSummary();
    renderPersonal();
  }

  /** With „Doar ce a rămas” on, a ticked check disappears; keep the keyboard on the next one instead of losing focus. */
  function keepFocusAfter(article: HTMLElement) {
    if (!article.hidden) return;
    const next = articles.slice(articles.indexOf(article) + 1).find((candidate) => !candidate.hidden && !candidate.closest<HTMLElement>('[data-group]')!.hidden);
    (next?.querySelector<HTMLButtonElement>('[data-answer]') ?? one<HTMLInputElement>('[data-only-open]')).focus();
  }

  const engine = one<HTMLSelectElement>('[data-field="engine"]');
  engine.value = state.engine;
  engine.addEventListener('change', () => {
    state.engine = engine.value as Engine;
    save();
    render();
  });

  const date = one<HTMLInputElement>('[data-field="date"]');
  date.value = state.date;
  date.addEventListener('change', () => {
    state.date = /^\d{4}-\d{2}-\d{2}$/.test(date.value) ? date.value : '';
    save();
    renderCountries();
    renderSummary();
  });

  for (const box of all<HTMLInputElement>('[data-option]')) {
    const key = box.dataset.option as 'winter' | 'children' | 'trailer';
    box.checked = state[key];
    box.addEventListener('change', () => {
      state[key] = box.checked;
      save();
      render();
    });
  }

  root.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button');
    if (!button || !root.contains(button)) return;
    const { country, answer, tab: nextTab, delete: removeId } = button.dataset;

    if (country) {
      state.countries = state.countries.includes(country) ? state.countries.filter((id) => id !== country) : [...state.countries, country];
      save();
      renderCountries();
      renderSummary();
    } else if (answer) {
      const article = button.closest<HTMLElement>('[data-check]')!;
      const id = article.dataset.check!;
      if (state.answers[id] === answer) delete state.answers[id];
      else state.answers[id] = answer as Answer;
      save();
      renderChecks();
      renderSummary();
      keepFocusAfter(article);
    } else if (nextTab) {
      tab = nextTab;
      for (const other of all('[data-tab]')) other.setAttribute('aria-pressed', String(other.dataset.tab === tab));
      renderChecks();
    } else if (removeId) {
      state.custom = state.custom.filter((task) => task.id !== removeId);
      save();
      renderPersonal();
      renderSummary();
      one<HTMLInputElement>('[data-new-task]').focus();
    } else if (button.hasAttribute('data-print')) {
      window.print();
    } else if (button.hasAttribute('data-reset')) {
      if (!confirm('Ștergi toate bifele și verificările personale? Mașina și traseul rămân cum le-ai ales.')) return;
      state = { ...state, answers: {}, countryReviews: {}, custom: [] };
      save();
      render();
    }
  });

  root.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.dataset.review) {
      if (input.checked) state.countryReviews[input.dataset.review] = true;
      else delete state.countryReviews[input.dataset.review];
      save();
      renderCountries();
      renderSummary();
    } else if (input.dataset.custom) {
      const task = state.custom.find((candidate) => candidate.id === input.dataset.custom);
      if (!task) return;
      task.done = input.checked;
      save();
      renderPersonal();
      renderSummary();
      root.querySelector<HTMLInputElement>(`[data-custom="${task.id}"]`)?.focus();
    } else if (input.hasAttribute('data-only-open')) {
      onlyOpen = input.checked;
      renderChecks();
    }
  });

  one<HTMLFormElement>('[data-add-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const field = one<HTMLInputElement>('[data-new-task]');
    const title = field.value.trim();
    if (!title) return;
    if (state.custom.length >= maxCustom) {
      showStorage(`Ai ajuns la ${maxCustom} de verificări personale. Șterge una ca să adaugi alta.`);
      return;
    }
    state.custom.push({ id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, title, done: false });
    field.value = '';
    save();
    renderPersonal();
    renderSummary();
    field.focus();
  });

  // The printed sheet lists every check that applies, with its steps and status, whatever the tab or filter.
  const openBeforePrint = new Map<HTMLDetailsElement, boolean>();
  addEventListener('beforeprint', () => {
    printing = true;
    renderChecks();
    for (const details of all<HTMLDetailsElement>('details')) {
      openBeforePrint.set(details, details.open);
      details.open = true;
    }
  });
  addEventListener('afterprint', () => {
    printing = false;
    renderChecks();
    openBeforePrint.forEach((open, details) => { details.open = open; });
    openBeforePrint.clear();
  });

  // The browser may restore this box after a reload or going back; the list starts unfiltered, so the box does too.
  one<HTMLInputElement>('[data-only-open]').checked = false;

  for (const element of all('[data-js]')) element.hidden = false;
  root.classList.add('is-ready');
  showStorage();
  render();
}
