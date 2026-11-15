// Checks for the road-trip checklist: the saved state, the sums and the data behind /pregatire-drum-lung/.
// Run with: node --test scripts/drum-lung/check.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { clean, daysUntil, initial, isVisible, maxCustom, maxTitle, summarize } from '../../src/drum-lung/stare.ts';
import { categories, checks, conditionLabels, countries, reviewed, sources } from '../../src/drum-lung/date.ts';

const checkIds = checks.map((check) => check.id);
const countryIds = countries.map((country) => country.id);
const state = (changes = {}) => ({ ...initial(), ...changes });

test('the data has unique ids, known categories and sources, and https links', () => {
  assert.equal(new Set(checkIds).size, checks.length);
  assert.equal(new Set(countryIds).size, countries.length);
  assert.equal(new Set(countries.map((country) => country.code)).size, countries.length);
  assert.match(reviewed, /^\d{4}-\d{2}-\d{2}$/);
  for (const check of checks) {
    assert.ok(categories.some((category) => category.id === check.cat), `${check.id}: unknown category`);
    if (check.source) assert.ok(check.source in sources, `${check.id}: unknown source ${check.source}`);
    if (check.condition && check.condition !== 'combustion') assert.ok(conditionLabels[check.condition], `${check.id}: condition without a label`);
    assert.ok(check.title && check.short && check.when && check.steps.length, `${check.id}: missing text`);
  }
  for (const category of categories) assert.ok(checks.some((check) => check.cat === category.id), `${category.id}: empty`);
  const links = [
    ...Object.values(sources).map((link) => link.url),
    ...countries.flatMap((country) => [country.rules, country.taxLink.url, country.gearLink?.url, ...(country.tipLinks ?? []).map((link) => link.url)]).filter(Boolean),
  ];
  for (const link of links) assert.match(link, /^https:\/\//);
});

test('a missing, broken or older saved state starts fresh', () => {
  for (const raw of [null, 'text', [], { version: 2, engine: 'diesel' }, {}]) assert.deepEqual(clean(raw, checkIds, countryIds), initial());
});

test('a saved state keeps only values the page knows', () => {
  const restored = clean({
    version: 1,
    engine: 'rocket',
    date: '2026-13-45',
    countries: ['ro', 'at', 'xx', 'ro'],
    winter: 'yes',
    children: true,
    answers: { oil: 'ok', brakes: 'maybe', unknown: 'ok', __proto__: { lights: 'ok' } },
    countryReviews: { at: true, hu: 'true', xx: true },
    custom: [
      { id: 'custom-a1', title: '  Cutia de plafon  ', done: true },
      { id: 'bad id', title: 'x' },
      { id: 'custom-b2', title: '   ' },
      { id: 'custom-c3', title: 'x'.repeat(400) },
    ],
  }, checkIds, countryIds);
  assert.equal(restored.engine, 'petrol');
  assert.equal(restored.date, '');
  assert.deepEqual(restored.countries, ['ro', 'at']);
  assert.equal(restored.winter, false);
  assert.equal(restored.children, true);
  assert.deepEqual(restored.answers, { oil: 'ok' });
  assert.deepEqual(restored.countryReviews, { at: true });
  assert.deepEqual(restored.custom.map((task) => task.id), ['custom-a1', 'custom-c3']);
  assert.equal(restored.custom[0].title, 'Cutia de plafon');
  assert.equal(restored.custom[1].title.length, maxTitle);
  assert.equal(clean({ version: 1, date: '2026-12-03' }, checkIds, countryIds).date, '2026-12-03');
  const many = Array.from({ length: maxCustom + 20 }, (_, index) => ({ id: `custom-${index}`, title: 'x' }));
  assert.equal(clean({ version: 1, custom: many }, checkIds, countryIds).custom.length, maxCustom);
});

test('checks follow the engine and the trip options', () => {
  const visible = (changes) => checks.filter((check) => isVisible(check, state(changes))).map((check) => check.id);
  assert.ok(visible({ engine: 'petrol' }).includes('oil'));
  assert.ok(!visible({ engine: 'ev' }).includes('oil'));
  assert.ok(visible({ engine: 'diesel' }).includes('adblue'));
  assert.ok(!visible({ engine: 'hybrid' }).includes('adblue'));
  assert.ok(visible({ engine: 'phev' }).includes('charge') && visible({ engine: 'phev' }).includes('oil'));
  assert.ok(!visible({ engine: 'hybrid' }).includes('charge'));
  for (const option of ['winter', 'children', 'trailer']) {
    assert.ok(!visible({}).includes(option));
    assert.ok(visible({ [option]: true }).includes(option));
  }
});

test('the summary counts checks, personal tasks and countries; „nu se aplică” leaves the total', () => {
  const refs = checks.map(({ id, title, condition }) => ({ id, title, condition }));
  const base = summarize(state(), refs);
  const visibleCount = checks.filter((check) => isVisible(check, state())).length;
  assert.equal(base.total, visibleCount + 1); // + România
  assert.equal(base.ok, 0);
  assert.equal(base.pending, base.total);

  const s = summarize(state({
    countries: ['ro', 'hu'],
    countryReviews: { hu: true, at: true },
    answers: { oil: 'ok', brakes: 'issue', wipers: 'na', adblue: 'ok' },
    custom: [{ id: 'custom-a', title: 'A', done: true }, { id: 'custom-b', title: 'B', done: false }],
  }), refs);
  assert.equal(s.total, visibleCount - 1 + 2 + 2);
  assert.equal(s.ok, 1 + 1 + 1); // oil, custom A, Ungaria; AdBlue is hidden for petrol, Austria is not on the route
  assert.equal(s.na, 1);
  assert.deepEqual(s.issues, ['Frânele și lichidul de frână']);
  assert.equal(s.pending, s.total - s.ok - 1);
});

test('days until departure count calendar days', () => {
  const today = new Date(2026, 10, 15, 23, 30);
  assert.equal(daysUntil('', today), null);
  assert.equal(daysUntil('2026-11-15', today), 0);
  assert.equal(daysUntil('2026-11-16', today), 1);
  assert.equal(daysUntil('2026-12-03', today), 18);
  assert.equal(daysUntil('2026-11-10', today), -5);
  assert.equal(daysUntil('2027-03-29', new Date(2027, 2, 27, 12)), 2); // across the clock change
});
