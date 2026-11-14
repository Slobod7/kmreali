interface Configuration { id: string; brand: string; model: string; generation: string }
const normalized = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('ro').replace(/ș/g, 's').replace(/ț/g, 't');

export function initWarningFinder(root: HTMLElement) {
  const configurations: Configuration[] = JSON.parse(root.querySelector('[data-configs]')!.textContent!);
  const brand = root.querySelector<HTMLSelectElement>('[data-brand]')!;
  const model = root.querySelector<HTMLSelectElement>('[data-model]')!;
  const generation = root.querySelector<HTMLSelectElement>('[data-generation]')!;
  const sections = [...root.querySelectorAll<HTMLElement>('[data-vehicle]')];
  const unsupported = root.querySelector<HTMLElement>('[data-unsupported]')!;
  const resetters = new Map<string, () => void>();
  const openers = new Map<string, (id: string) => boolean>();
  let current: Configuration | undefined;

  function options(select: HTMLSelectElement, values: { value: string; label: string }[], selected?: string) {
    select.replaceChildren(...values.map(value => new Option(value.label, value.value)));
    if (selected !== undefined) select.value = selected;
    select.disabled = !values.length;
  }
  options(brand, [
    ...[...new Set(configurations.map(config => config.brand))].map(value => ({ value, label: value })),
    { value: '', label: 'Mașina mea nu este în listă' },
  ]);

  function syncModels(selected?: Configuration) {
    options(model, [...new Set(configurations.filter(config => config.brand === brand.value).map(config => config.model))].map(value => ({ value, label: value })), selected?.model);
    syncGenerations(selected);
  }
  function syncGenerations(selected?: Configuration) {
    options(generation, configurations.filter(config => config.brand === brand.value && config.model === model.value).map(config => ({ value: config.id, label: config.generation })), selected?.id);
  }
  function showVehicle(id: string | undefined) {
    current = configurations.find(config => config.id === id);
    sections.forEach(section => { section.hidden = section.dataset.vehicle !== current?.id; });
    unsupported.hidden = Boolean(current);
    if (current) resetters.get(current.id)?.();
  }
  function updateUrl(anchor?: string) {
    const next = new URL(location.href);
    if (current) next.searchParams.set('vehicul', current.id);
    else next.searchParams.set('vehicul', 'neacoperit');
    next.hash = anchor ?? '';
    history.pushState(null, '', next);
  }

  for (const section of sections) {
    const search = section.querySelector<HTMLInputElement>('[data-search]')!;
    const radios = [...section.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
    const buttons = [...section.querySelectorAll<HTMLButtonElement>('[data-symbol]')];
    const info = section.querySelector<HTMLElement>('[data-info]')!;
    const mode = section.querySelector<HTMLElement>('[data-preview-mode]')!;
    const close = section.querySelector<HTMLButtonElement>('[data-close]')!;
    const announcement = section.querySelector<HTMLElement>('[data-announcement]')!;
    const placeholder = [...info.childNodes].map(node => node.cloneNode(true));
    let pinned: string | undefined;
    let active: string | undefined;
    let dismissed: string | undefined;
    let suppressFocus = false;

    function clearInfo(restoreFocus = false) {
      const previous = active;
      dismissed = restoreFocus ? previous : undefined;
      pinned = undefined;
      active = undefined;
      info.replaceChildren(...placeholder.map(node => node.cloneNode(true)));
      close.hidden = true;
      mode.textContent = 'EXPLICAȚIE';
      buttons.forEach(button => {
        button.removeAttribute('data-active');
        button.setAttribute('aria-pressed', 'false');
      });
      announcement.textContent = '';
      if (restoreFocus && previous) {
        suppressFocus = true;
        const button = buttons.find(button => button.dataset.symbol === previous);
        button?.focus({ preventScroll: true });
        if (matchMedia('(max-width: 46rem)').matches) button?.scrollIntoView({ block: 'center', behavior: 'instant' });
        suppressFocus = false;
      }
    }

    function showInfo(id: string, keep: boolean) {
      if (pinned && !keep) return;
      if (!keep && dismissed === id) return;
      dismissed = undefined;
      const template = [...section.querySelectorAll<HTMLTemplateElement>('template[data-preview]')].find(item => item.dataset.preview === id);
      if (!template) return;
      if (keep) section.querySelector<HTMLElement>('[data-missing]')!.hidden = true;
      if (active !== id) info.replaceChildren(template.content.cloneNode(true));
      active = id;
      if (keep) pinned = id;
      if (keep) dismissed = undefined;
      mode.textContent = pinned ? 'EXPLICAȚIE FIXATĂ' : 'PREVIZUALIZARE';
      close.hidden = false;
      buttons.forEach(button => {
        button.toggleAttribute('data-active', button.dataset.symbol === id);
        button.setAttribute('aria-pressed', String(button.dataset.symbol === pinned));
      });
      announcement.textContent = `${info.querySelector('h3')!.textContent}. ${info.querySelector('.info-meaning')!.textContent} ${info.querySelector('.info-action p')!.textContent}`;
    }

    function applyFilters() {
      const stopWords = new Set(['de', 'cu', 'un', 'o', 'in', 'pe', 'la', 'si', 'a', 'al', 'din']);
      const terms = normalized(search.value).trim().split(/\s+/).filter(term => term && !stopWords.has(term));
      const color = radios.find(radio => radio.checked)!.value;
      let count = 0;
      for (const button of buttons) {
        const matches = (!color || button.dataset.color === color) && terms.every(term => normalized(button.dataset.searchText!).includes(term));
        button.hidden = !matches;
        if (matches) count++;
      }
      // An old result must not remain as advice for a newly filtered set.
      clearInfo();
      section.querySelector('[data-count]')!.textContent = `${count} / ${buttons.length} simboluri`;
      section.querySelector<HTMLElement>('[data-empty]')!.hidden = count !== 0;
      section.querySelector<HTMLElement>('[data-missing]')!.hidden = true;
      announcement.textContent = `${count} simboluri găsite.`;
    }
    function resetFilters() {
      search.value = '';
      radios[0].checked = true;
      applyFilters();
    }
    resetters.set(section.dataset.vehicle!, resetFilters);
    openers.set(section.dataset.vehicle!, anchor => {
      const button = buttons.find(item => item.id === anchor);
      if (!button) return false;
      resetFilters();
      showInfo(button.dataset.symbol!, true);
      return true;
    });

    buttons.forEach(button => {
      const id = button.dataset.symbol!;
      button.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse' && matchMedia('(hover: hover) and (min-width: 46.001rem)').matches) showInfo(id, false);
      });
      button.addEventListener('focus', () => {
        if (!suppressFocus) showInfo(id, false);
      });
      button.addEventListener('click', () => {
        showInfo(id, true);
        updateUrl(button.id);
        if (matchMedia('(max-width: 46rem)').matches) {
          section.querySelector<HTMLElement>('.light-info')!.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
      });
    });
    close.addEventListener('click', () => { clearInfo(true); });
    section.addEventListener('keydown', event => {
      if (event.key === 'Escape' && active) { event.preventDefault(); clearInfo(true); }
    });
    search.addEventListener('input', applyFilters);
    radios.forEach(radio => radio.addEventListener('change', applyFilters));
    section.querySelector('[data-reset]')!.addEventListener('click', () => { resetFilters(); search.focus(); });
    section.addEventListener('click', event => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-direct]');
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const button = buttons.find(item => item.id === link.hash.slice(1));
      if (!button) return;
      event.preventDefault();
      showInfo(button.dataset.symbol!, true);
      updateUrl(button.id);
      announcement.textContent = 'Linkul direct este în bara de adrese. Îl poți copia sau distribui.';
    });
  }

  function restoreLocation() {
    const requested = new URL(location.href).searchParams.get('vehicul');
    const selected = requested === null ? configurations[0] : configurations.find(config => config.id === requested);
    brand.value = selected?.brand ?? '';
    syncModels(selected);
    showVehicle(selected?.id);
    if (selected && location.hash.startsWith('#martor-')) {
      const found = openers.get(selected.id)?.(location.hash.slice(1));
      if (!found) {
        sections.find(section => section.dataset.vehicle === selected.id)!.querySelector<HTMLElement>('[data-missing]')!.hidden = false;
      } else if (matchMedia('(max-width: 46rem)').matches) {
        requestAnimationFrame(() => sections.find(section => section.dataset.vehicle === selected.id)!.querySelector<HTMLElement>('.light-info')!.scrollIntoView({ block: 'start', behavior: 'instant' }));
      }
    }
  }
  brand.addEventListener('change', () => { syncModels(); showVehicle(generation.value); updateUrl(); });
  model.addEventListener('change', () => { syncGenerations(); showVehicle(generation.value); updateUrl(); });
  generation.addEventListener('change', () => { showVehicle(generation.value); updateUrl(); });
  root.querySelector('[data-default]')!.addEventListener('click', () => {
    const selected = configurations[0];
    brand.value = selected.brand;
    syncModels(selected);
    showVehicle(selected.id);
    updateUrl();
    brand.focus();
  });
  window.addEventListener('popstate', restoreLocation);
  window.addEventListener('hashchange', restoreLocation);
  root.querySelector<HTMLElement>('[data-controls]')!.hidden = false;
  root.querySelectorAll<HTMLElement>('[data-interactive]').forEach(element => { element.hidden = false; });
  restoreLocation();
}
