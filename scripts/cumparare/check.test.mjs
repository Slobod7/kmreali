import test from 'node:test';
import assert from 'node:assert/strict';
import { models, serviceChecks, haldex } from '../../src/data/cumparare/catalog.mjs';
import { defaultVehicle, covered, checksFor, dueStatus, budget, encodeState, decodeState } from '../../src/scripts/cumparare-core.mjs';
const now = new Date('2026-11-15T12:00:00Z');
const vehicle = { ...defaultVehicle(), km: '180000' };
const oil = serviceChecks[0];

test('specific advice never crosses unresearched generations, fuels, years or Superb drivetrains', () => {
  for (const model of models.slice(0, 10)) {
    const v = { ...vehicle, model: model.id, gearbox: 'auto' };
    assert.ok(covered(v));
    assert.ok(checksFor(v).some(c => c.id === model.checks[0].id));
    for (const change of [{ generation: 'other' }, { fuel: 'other' }, { year: '1900' }]) {
      assert.equal(covered({ ...v, ...change }), false);
      assert.ok(!checksFor({ ...v, ...change }).some(c => model.checks.some(m => m.id === c.id)));
    }
    assert.ok(checksFor(v).every(c => c.source));
  }
  const superb = { ...vehicle, model: 'skoda-superb', gearbox: 'auto', drive: 'awd' };
  assert.ok(checksFor(superb).some(c => c.id === 'haldex'));
  assert.ok(!checksFor({ ...superb, drive: 'two' }).some(c => c.id === 'haldex'));
  assert.ok(!checksFor({ ...vehicle, model: 'vw-golf', gearbox: 'manual' }).some(c => c.id === 'g7-dsg'));
});
test('mileage and calendar use the first due limit, including exact thresholds', () => {
  assert.equal(dueStatus(oil, { intervalKm: '15000', lastKm: '165000' }, vehicle, now).state, 'due');
  assert.equal(dueStatus(oil, { intervalKm: '15000', lastKm: '170000' }, vehicle, now).state, 'planned');
  assert.equal(dueStatus(haldex, { lastDate: '2023-11-15' }, vehicle, now).state, 'due');
  assert.equal(dueStatus(oil, { intervalKm: '15000', lastKm: '175000', intervalMonths: '12', lastDate: '2025-10-10' }, vehicle, now).state, 'due');
  assert.equal(dueStatus(oil, {}, vehicle, now).state, 'unknown');
});
test('date and mileage errors cannot imply a valid service interval', () => {
  assert.equal(dueStatus(oil, { lastKm: '190000', intervalKm: '15000' }, vehicle, now).state, 'invalid');
  assert.equal(dueStatus(oil, { lastDate: '2027-01-01', intervalMonths: '12' }, vehicle, now).state, 'invalid');
  assert.equal(dueStatus(oil, { lastDate: '2025-02-31', intervalMonths: '12' }, vehicle, now).state, 'invalid');
  assert.equal(dueStatus(oil, { lastDate: '2024-02-29', intervalMonths: '12' }, vehicle, new Date('2025-02-28T12:00:00Z')).state, 'due');
});
test('a possible fault or unchecked maintenance never adds money automatically', () => {
  const checks = checksFor(vehicle);
  const a = { 'b3-suspensie': { status: 'unknown', include: true, quote: '2000' }, ulei: { status: 'unknown', quote: '500' } };
  assert.equal(budget(checks, a, vehicle, now).total, 0);
  assert.equal(budget(checks, a, vehicle, now).items.length, 0);
  a['b3-suspensie'].status = 'issue';
  assert.equal(budget(checks, a, vehicle, now).total, 2000);
});
test('unknown costs are counted, not represented as free; not-applicable and completed jobs excluded', () => {
  const checks = checksFor(vehicle);
  const answers = { ulei: { include: true }, distributie: { include: true, status: 'na', quote: '3000' }, 'b3-suspensie': { status: 'issue', include: true, quote: '123.45' } };
  const b = budget(checks, answers, vehicle, now);
  assert.equal(b.unpriced, 1); assert.equal(b.total, 123.45);
  answers.ulei = { include: true, status: 'ok', quote: '500' };
  assert.equal(budget(checks, answers, vehicle, now).total, 123.45);
  answers.ulei = { include: true, status: 'ok', quote: '500', intervalKm: '10000', lastKm: '160000' };
  assert.equal(budget(checks, answers, vehicle, now).total, 623.45);
});
test('share roundtrip includes configuration, answers and costs but strips personal and arbitrary data', () => {
  const state = { v: 1, vehicle: { ...vehicle, trim: 'comfort', vin: 'PRIVATE' }, notes: 'SECRET', answers: { 'extra-confort': { status: 'issue', include: true, quote: '1200', notes: 'PRIVATE' }, ulei: { status: 'ok', lastKm: '170000', intervalKm: '15000' }, foreign: { status: 'issue' } } };
  const encoded = encodeState(state), decoded = decodeState(encoded);
  assert.ok(!encoded.includes('SECRET') && !encoded.includes('PRIVATE'));
  assert.equal(decoded.answers['extra-confort'].quote, '1200');
  assert.equal(decoded.answers.ulei.lastKm, '170000');
  assert.equal(decoded.answers.foreign, undefined);
});
test('malformed and future-version shared state is rejected', () => {
  assert.throws(() => decodeState('%broken'));
  assert.throws(() => decodeState(encodeURIComponent(JSON.stringify({ v: 2, vehicle }))));
  assert.throws(() => decodeState('x'.repeat(30001)));
  assert.throws(() => decodeState(encodeURIComponent(JSON.stringify({ v: 1, vehicle: { ...vehicle, model: 'unknown' } }))));
});
