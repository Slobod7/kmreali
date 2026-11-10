// Reads kmreali.ro's Google Search Console data. Run it from the project folder:
//
//   node scripts/gsc.mjs sites                                  properties the key can read
//   node scripts/gsc.mjs query                                  top searches, last 28 days
//   node scripts/gsc.mjs query --dims page --days 7             top pages, last 7 days
//   node scripts/gsc.mjs query --dims query,page --filter page~/recenzii/
//   node scripts/gsc.mjs query --dims date                      clicks and impressions per day
//   node scripts/gsc.mjs query --dims none                      totals only
//   node scripts/gsc.mjs sitemaps                               submitted sitemaps and their status
//   node scripts/gsc.mjs inspect https://kmreali.ro/despre/     is this page indexed, and why not
//
// Filters: page~text (contains), page=text (equals), query!~text (does not contain).
// Other options: --start/--end YYYY-MM-DD, --type web|image|video|news|discover, --limit 50, --site, --json.
import { parseArgs } from 'node:util';
import { getAccessToken } from './google-auth.mjs';

const API = 'https://searchconsole.googleapis.com';

const { positionals, values: opts } = parseArgs({
  allowPositionals: true,
  options: {
    site: { type: 'string', default: process.env.GSC_SITE ?? 'sc-domain:kmreali.ro' },
    days: { type: 'string', default: '28' },
    start: { type: 'string' },
    end: { type: 'string' },
    dims: { type: 'string', default: 'query' },
    filter: { type: 'string', multiple: true, default: [] },
    type: { type: 'string', default: 'web' },
    limit: { type: 'string', default: '50' },
    json: { type: 'boolean', default: false },
  },
});
const [command = 'query', ...args] = positionals;
const sitePath = `/webmasters/v3/sites/${encodeURIComponent(opts.site)}`;

const token = await getAccessToken(['https://www.googleapis.com/auth/webmasters.readonly']).catch(fail);

async function call(path, body) {
  const res = await fetch(API + path, {
    method: body ? 'POST' : 'GET',
    headers: { authorization: `Bearer ${token}`, ...(body && { 'content-type': 'application/json' }) },
    body: body && JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data.error?.message ?? res.statusText;
    let hint = '';
    if (/has not been used|is disabled/i.test(message)) {
      hint = '\nTurn on the "Google Search Console API" in the km-reali Cloud project.';
    } else if (res.status === 403) {
      hint = `\nAdd the service account as a user of ${opts.site} in Search Console (Settings → Users and permissions).`;
    }
    fail(new Error(`Search Console said ${res.status}: ${message}${hint}`));
  }
  return data;
}

function fail(error) {
  console.error(error.message);
  process.exit(1);
}

function print(data, render) {
  if (opts.json) console.log(JSON.stringify(data, null, 2));
  else render(data);
}

function table(rows) {
  if (!rows.length) return console.log('(no rows)');
  const widths = rows[0].map((_, i) => Math.max(...rows.map((row) => String(row[i]).length)));
  for (const row of rows) {
    console.log(row.map((cell, i) => (typeof cell === 'number' ? String(cell).padStart(widths[i]) : String(cell).padEnd(widths[i]))).join('  '));
  }
}

const day = (date) => date.toISOString().slice(0, 10);
// Shortens https://kmreali.ro/... to /...; other hosts (www, http) stay in full so they stand out.
const shortUrl = (value) => value.replace(/^https:\/\/kmreali\.ro(?=\/)/, '');
const clip = (text, max = 70) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

function parseFilter(text) {
  const match = text.match(/^(\w+)(!~|~|!=|=)(.*)$/);
  if (!match) fail(new Error(`Filter "${text}" should look like page~/recenzii/ or query=skoda superb`));
  const [, dimension, op, expression] = match;
  const operator = { '~': 'contains', '!~': 'notContains', '=': 'equals', '!=': 'notEquals' }[op];
  return { dimension, operator, expression };
}

const commands = {
  async sites() {
    const data = await call('/webmasters/v3/sites');
    print(data, ({ siteEntry = [] }) => {
      if (!siteEntry.length) console.log('The key can read no properties yet. Add the service account as a user in Search Console.');
      table(siteEntry.map((entry) => [entry.siteUrl, entry.permissionLevel]));
    });
  },

  async query() {
    const end = opts.end ?? day(new Date());
    const start = opts.start ?? day(new Date(Date.parse(end) - (Number(opts.days) - 1) * 86_400_000));
    const dimensions = opts.dims === 'none' ? [] : opts.dims.split(',');
    const filters = opts.filter.map(parseFilter);
    const data = await call(`${sitePath}/searchAnalytics/query`, {
      startDate: start,
      endDate: end,
      dimensions,
      type: opts.type,
      rowLimit: Number(opts.limit),
      dataState: 'all',
      ...(filters.length && { dimensionFilterGroups: [{ filters }] }),
    });
    print(data, ({ rows = [] }) => {
      console.log(`${opts.site}, ${start} → ${end}, ${opts.type}${filters.length ? `, ${opts.filter.join(' ')}` : ''}\n`);
      table([
        [...dimensions, 'clicks', 'impressions', 'ctr', 'position'],
        ...rows.map((row) => [
          ...(row.keys ?? []).map((key, i) => clip(dimensions[i] === 'page' ? shortUrl(key) : key)),
          row.clicks,
          row.impressions,
          `${(row.ctr * 100).toFixed(1)}%`,
          Number(row.position.toFixed(1)),
        ]),
      ]);
    });
  },

  async sitemaps() {
    const data = await call(`${sitePath}/sitemaps`);
    print(data, ({ sitemap = [] }) => {
      table([
        ['sitemap', 'submitted', 'last read', 'errors', 'warnings', 'urls'],
        ...sitemap.map((s) => [
          s.path,
          s.lastSubmitted?.slice(0, 10) ?? '-',
          s.lastDownloaded?.slice(0, 10) ?? '-',
          Number(s.errors ?? 0),
          Number(s.warnings ?? 0),
          (s.contents ?? []).map((c) => `${c.type} ${c.submitted}`).join(', ') || '-',
        ]),
      ]);
    });
  },

  async inspect() {
    if (!args.length) fail(new Error('Give one or more page addresses, e.g. inspect https://kmreali.ro/despre/'));
    for (const inspectionUrl of args) {
      const data = await call('/v1/urlInspection/index:inspect', { inspectionUrl, siteUrl: opts.site });
      print(data, ({ inspectionResult: { indexStatusResult: index = {}, richResultsResult: rich } }) => {
        console.log(inspectionUrl);
        table(
          [
            ['verdict', index.verdict],
            ['coverage', index.coverageState],
            ['last crawl', index.lastCrawlTime ?? '-'],
            ['crawled as', index.crawledAs ?? '-'],
            ['fetch', index.pageFetchState ?? '-'],
            ['robots.txt', index.robotsTxtState ?? '-'],
            ['indexing allowed', index.indexingState ?? '-'],
            ['your canonical', index.userCanonical ?? '-'],
            ['Google canonical', index.googleCanonical ?? '-'],
            ['rich results', rich ? `${rich.verdict}: ${(rich.detectedItems ?? []).map((item) => item.richResultType).join(', ')}` : '-'],
          ].map(([label, value]) => [`  ${label}`, value ?? '-']),
        );
        console.log();
      });
    }
  },
};

if (!commands[command]) fail(new Error(`Unknown command "${command}". Use sites, query, sitemaps or inspect.`));
await commands[command]();
