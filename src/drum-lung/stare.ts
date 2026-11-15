// The road-trip checklist's saved state and the sums the page shows from it.
// No DOM here, so `node --test scripts/drum-lung/check.test.mjs` can check it directly.

export type Engine = 'petrol' | 'diesel' | 'hybrid' | 'phev' | 'ev';
export type Condition = 'combustion' | 'diesel' | 'plug' | 'winter' | 'children' | 'trailer';
export type Answer = 'ok' | 'issue' | 'na';

export interface CustomTask { id: string; title: string; done: boolean }

export interface State {
  version: 1;
  engine: Engine;
  /** Departure day as YYYY-MM-DD, or ''. */
  date: string;
  countries: string[];
  winter: boolean;
  children: boolean;
  trailer: boolean;
  answers: Record<string, Answer>;
  countryReviews: Record<string, true>;
  custom: CustomTask[];
}

/** What the sums need to know about a check. */
export interface CheckRef { id: string; title: string; condition?: Condition }

export interface Summary { ok: number; na: number; issues: string[]; total: number; pending: number }

export const engines: Engine[] = ['petrol', 'diesel', 'hybrid', 'phev', 'ev'];
const answers: Answer[] = ['ok', 'issue', 'na'];
export const maxCustom = 100;
export const maxTitle = 150;

export const initial = (): State => ({
  version: 1,
  engine: 'petrol',
  date: '',
  countries: ['ro'],
  winter: false,
  children: false,
  trailer: false,
  answers: {},
  countryReviews: {},
  custom: [],
});

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

/** Keeps only what the page knows how to show; anything else in storage is dropped. */
export function clean(raw: unknown, checkIds: string[], countryIds: string[]): State {
  const state = initial();
  if (!isObject(raw) || raw.version !== 1) return state;

  if (engines.includes(raw.engine as Engine)) state.engine = raw.engine as Engine;
  if (typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date) && !Number.isNaN(Date.parse(raw.date))) state.date = raw.date;
  if (Array.isArray(raw.countries)) state.countries = [...new Set(raw.countries.filter((id): id is string => countryIds.includes(id)))];
  for (const key of ['winter', 'children', 'trailer'] as const) state[key] = raw[key] === true;

  const savedAnswers = isObject(raw.answers) ? raw.answers : {};
  for (const id of checkIds) if (Object.hasOwn(savedAnswers, id) && answers.includes(savedAnswers[id] as Answer)) state.answers[id] = savedAnswers[id] as Answer;

  const savedReviews = isObject(raw.countryReviews) ? raw.countryReviews : {};
  for (const id of countryIds) if (Object.hasOwn(savedReviews, id) && savedReviews[id] === true) state.countryReviews[id] = true;

  if (Array.isArray(raw.custom)) {
    state.custom = raw.custom
      .filter((task): task is CustomTask => isObject(task) && typeof task.id === 'string' && /^custom-[a-z0-9-]+$/.test(task.id) && typeof task.title === 'string' && task.title.trim() !== '')
      .slice(0, maxCustom)
      .map((task) => ({ id: task.id, title: task.title.trim().slice(0, maxTitle), done: task.done === true }));
  }
  return state;
}

/** Whether a check applies to the car and the trip. */
export function isVisible(check: Pick<CheckRef, 'condition'>, state: State) {
  switch (check.condition) {
    case undefined: return true;
    case 'combustion': return state.engine !== 'ev';
    case 'diesel': return state.engine === 'diesel';
    case 'plug': return state.engine === 'ev' || state.engine === 'phev';
    default: return state[check.condition];
  }
}

/** Counts checks, personal tasks and the rules of each country on the route. „Nu se aplică” leaves the total. */
export function summarize(state: State, checks: CheckRef[]): Summary {
  const visible = checks.filter((check) => isVisible(check, state));
  const ok = visible.filter((check) => state.answers[check.id] === 'ok').length
    + state.custom.filter((task) => task.done).length
    + state.countries.filter((id) => state.countryReviews[id]).length;
  const na = visible.filter((check) => state.answers[check.id] === 'na').length;
  const issues = visible.filter((check) => state.answers[check.id] === 'issue').map((check) => check.title);
  const total = visible.length - na + state.custom.length + state.countries.length;
  return { ok, na, issues, total, pending: total - ok - issues.length };
}

/** Whole days from today to the departure day (0 = today), or null without a date. */
export function daysUntil(date: string, today: Date) {
  if (!date) return null;
  const [year, month, day] = date.split('-').map(Number);
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((Date.UTC(year, month - 1, day) - start) / 86_400_000);
}
