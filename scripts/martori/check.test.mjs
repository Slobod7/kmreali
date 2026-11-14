import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const catalog = JSON.parse(read('src/data/martori/symbols.json'));
const files = readdirSync(new URL('src/data/martori/', root)).filter(name => name !== 'symbols.json' && name.endsWith('.json'));
const vehicles = files.map(file => JSON.parse(read(`src/data/martori/${file}`)));
const validId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

test('vehicle records have distinct identities, documented scope and a dated primary source', () => {
  assert.equal(new Set(vehicles.map(vehicle => vehicle.id)).size, vehicles.length);
  for (const vehicle of vehicles) {
    assert.match(vehicle.id, validId);
    for (const key of ['brand', 'model', 'generation', 'scope', 'notCovered']) assert.ok(vehicle[key]?.trim(), `${vehicle.id}: missing ${key}`);
    assert.equal(typeof vehicle.verified, 'boolean');
    assert.ok(vehicle.source.documentId);
    if (vehicle.source.format === 'web') assert.deepEqual(vehicle.source.overviewPages, []);
    else assert.ok(vehicle.source.overviewPages.length && vehicle.source.overviewPages.every(page => Number.isInteger(page) && page > 0));
    assert.match(vehicle.source.url, /^https:\/\//);
    assert.match(vehicle.source.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Number.isInteger(vehicle.source.pdfPageOffset));
    assert.ok(vehicle.lights.length);
  }
});

test('all vehicle variations resolve to real assets and include actions, conditions and page citations', () => {
  for (const vehicle of vehicles) {
    assert.equal(new Set(vehicle.lights.map(light => light.id)).size, vehicle.lights.length);
    for (const light of vehicle.lights) {
      assert.match(light.id, validId);
      const symbol = catalog[light.symbol];
      assert.ok(symbol, `${vehicle.id}/${light.id}: missing shared symbol`);
      assert.ok(symbol.name && symbol.shape);
      assert.ok(existsSync(new URL(`src/content/articole/martori-bord-skoda/${symbol.asset}`, root)));
      assert.ok(['rosu', 'galben', 'verde', 'albastru', 'alb'].includes(light.color));
      assert.ok(light.meaning && light.action && light.detail);
      assert.ok(light.states.length && light.states.every(state => state.label && state.text));
      if (vehicle.source.format === 'web') assert.deepEqual(light.pages, []);
      else assert.ok(light.pages.length && light.pages.every(page => Number.isInteger(page) && page > 0));
    }
  }
});

test('the shared catalog contains no driving advice or implied cross-vehicle compatibility', () => {
  for (const symbol of Object.values(catalog)) assert.deepEqual(Object.keys(symbol).sort(), ['asset', 'name', 'shape']);
});

test('the Superb advice preserves stopping exceptions and explicitly unverified flashing-engine coverage', () => {
  const superb = vehicles.find(vehicle => vehicle.id === 'skoda-superb-3v-2018-11');
  const light = id => superb.lights.find(item => item.id === id);
  assert.match(light('anvelope').action, /Oprește/);
  assert.match(light('nivel-ulei').action, /oprește/);
  assert.match(light('nivel-ulei').states.map(state => state.text).join(' '), /nu continua/);
  assert.match(light('presiune-ulei').action, /nu continua.*ralanti/);
  assert.match(light('abs').action, /roșu.*nu continua/);
  assert.match(light('racire').action, /Nu deschide.*cald/);
  assert.match(light('motor').states[0].label, /neverificată/);
  assert.match(light('motor').states[0].text, /Nu extrapola/);
});

test('the production finder contains explanation templates and resolves every dashboard anchor', () => {
  const html = read('dist/martori-bord/index.html');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'duplicate HTML IDs');
  for (const vehicle of vehicles.filter(vehicle => vehicle.verified)) {
    for (const light of vehicle.lights) {
      const anchor = `martor-${vehicle.id}-${light.id}`;
      assert.ok(ids.includes(anchor), `missing ${anchor}`);
      assert.ok(html.includes(`#${anchor}"`));
      assert.ok(html.includes(light.meaning));
      assert.ok(html.includes(light.action));
      const sourceLink = light.sourceUrl ?? (vehicle.source.format === "web" ? vehicle.source.url : `${vehicle.source.url}#page=${light.pages[0] + vehicle.source.pdfPageOffset}`);
      assert.ok(html.includes(sourceLink), `missing source ${vehicle.id}/${light.id}`);
    }
  }
  for (const [, asset] of html.matchAll(/\b(?:src|href)="([^"#?]+\.(?:svg|js|css))(?:[?#][^"]*)?"/g)) {
    if (/^https?:/.test(asset)) continue;
    // Also works when built with BASE_PATH=/some-prefix.
    const relative = asset.slice(asset.indexOf('/_astro/') + 1);
    if (!relative.startsWith('_astro/')) continue;
    assert.ok(existsSync(new URL(`dist/${relative}`, root)), `broken built asset: ${asset}`);
  }
  assert.ok(html.includes('<noscript>'));
  assert.match(html, /Panou ilustrativ/);
  assert.match(html, /Mai întâi, oprește în siguranță/);
  assert.ok(!html.includes('class="warning-list"'));
  assert.ok(!html.includes('data-entry='));
  assert.ok(!html.includes('data-more'));
  const footers = [...html.matchAll(/<footer[^>]*class="finder-sources"[^>]*>[\s\S]*?<\/footer>/g)].map(match => match[0]);
  for (const vehicle of vehicles.filter(vehicle => vehicle.verified)) {
    const footer = footers.find(content => content.includes(`id="sources-${vehicle.id}"`));
    assert.ok(footer && footer.includes(vehicle.scope), `${vehicle.id}: coverage must be in the page footer`);
    assert.ok(footer.includes(vehicle.source.url));
  }
});

test('new models retain their independently verified differences', () => {
  const octavia = vehicles.find(vehicle => vehicle.id === 'skoda-octavia-5e-2018-11');
  const fabia = vehicles.find(vehicle => vehicle.id === 'skoda-fabia-nj-2018-11');
  assert.equal(octavia.source.documentId, '5E0012714AQ');
  assert.equal(fabia.source.documentId, '6V0012714AK');
  assert.match(fabia.lights.find(light => light.id === 'rezerva').meaning, /7 litri/);
  assert.match(octavia.lights.find(light => light.id === 'rezerva').meaning, /6 litri/);
  assert.match(fabia.lights.find(light => light.id === 'frana').action, /nu continua/);
  assert.match(fabia.lights.find(light => light.id === 'nivel-ulei').states.map(state => state.text).join(' '), /216.*interzice continuarea/);
  assert.ok(!octavia.lights.some(light => light.id === 'auto-hold'));
  assert.ok(!fabia.lights.some(light => ['auto-hold', 'lane-assist', 'preincalzire', 'apa-motorina'].includes(light.id)));
  for (const car of [octavia, fabia]) {
    const parking = car.lights.find(light => light.id === 'parcare');
    assert.match(parking.meaning, /Frâna de mână/);
    assert.match(parking.states[0].label, /5 km\/h/);
  }
});

test('discovery and draft links respect production visibility', () => {
  const html = read('dist/martori-bord/index.html');
  const guide = read('src/content/articole/martori-bord-skoda/index.md');
  if (/^draft: true$/m.test(guide)) assert.ok(!html.includes('/ghiduri/martori-bord-skoda/'));
  assert.ok(read('dist/ghiduri/index.html').includes('/martori-bord/'));
  assert.ok(read('dist/sitemap-0.xml').includes('/martori-bord/'));
});


test('the multi-brand catalogue preserves model-specific instructions and source formats', () => {
  const brands = new Set(vehicles.map(vehicle => vehicle.brand));
  for (const brand of ['Audi', 'BMW', 'Mercedes-Benz', 'Dacia', 'Renault', 'Volkswagen', 'Ford', 'Opel', 'SEAT', 'Peugeot', 'Citroën', 'Toyota', 'Nissan', 'Honda', 'Hyundai', 'Kia', 'Mazda', 'Suzuki', 'Fiat', 'Volvo', 'Tesla', 'Škoda']) assert.ok(brands.has(brand), `missing brand ${brand}`);
  const find = (brand, id) => vehicles.find(vehicle => vehicle.brand === brand).lights.find(light => light.id === id);
  assert.match(find('Honda', 'incarcare').states[0].text, /să nu oprești motorul/);
  assert.match(find('Opel', 'incarcare').action, /oprește motorul/);
  assert.match(find('Audi', 'racire').action, /mesaj.*ralanti/);
  assert.match(find('Nissan', 'motor').action, /tractare.*70 km/);
  assert.match(find('Suzuki', 'racire-rece').states[0].text, /Clipire albastră/);
  assert.match(find('Volvo', 'presiune-ulei').states[0].text, /Unele variante/);
  for (const vehicle of vehicles) {
    if (vehicle.source.format === 'web') {
      for (const light of vehicle.lights) assert.match(light.sourceUrl ?? vehicle.source.url, /^https:\/\//);
    } else {
      assert.ok(!vehicle.source.pageNumbering || vehicle.source.pageNumbering === 'pdf');
    }
  }
});
