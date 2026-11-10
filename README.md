# KM Reali

The kmreali.ro website: a static site built with [Astro](https://astro.build) and published on GitHub Pages.

## Where things are

| What | Where |
| --- | --- |
| Articles (text + photos) | `src/content/articole/<slug>/index.md` |
| Site name, tagline, author and photo, contact email, analytics token | `src/site.ts` |
| Colors and fonts | `src/styles/global.css` |
| Header, footer, cards, car spec box | `src/components/` |
| Pages (home, sections, Despre, Contact) | `src/pages/` |

## Adding an article

1. Make a folder in `src/content/articole/` named like the address you want, e.g. `dacia-duster-2022-pareri-proprietar`. The article goes under its section, e.g. `kmreali.ro/recenzii/dacia-duster-2022-pareri-proprietar/`.
2. Put the photos in that folder, plus an `index.md` (copy the Skoda one as a starting point).
3. Fill in the block at the top (title, description, category, cover photo, car details).
4. Keep `draft: true` while writing. Drafts show in the local preview but not on the live site.
5. Set `draft: false` to publish.

Photos go in the text as `![alt text](./photo-name.webp)`.

For the FAQ, add a `## Întrebări frecvente` section and write each question as its own paragraph: the question in bold, then the answer on the same line, e.g. `**Cât consumă?** 9–10 l/100 km pe drum lung.` On the page each question opens its answer when clicked, and the site turns them into FAQ data for search engines automatically.

In reviews, the **Pe scurt** list near the top feeds the review data for search engines (the score, likes and dislikes) together with the car details at the top. Keep its `**Îmi place:**`, `**Nu îmi place:**` and `**Nota mea:** 7,8/10` lines, and separate the likes and dislikes with commas or semicolons.

## Widgets in an article

An article can have a search by budget and a table of what each reliability source says about each car (see `masini-fiabile`). Their data lives in a `date.json` next to the article's `index.md`, and a line in the text marks where each one goes:

```html
<div data-widget="cautator"></div>
```

```html
<div data-widget="matrice"></div>
```

When the site is built, `src/widgets-plugin.ts` turns each line into plain HTML from `date.json`; `src/components/Widgeturi.astro` styles them and makes the search work. Without JavaScript the search stays hidden and the table still shows. The small photos on the search cards are in `public/foto/<article folder>/` (400×225 WebP), because the widget's HTML doesn't go through Astro's image processing; their author and licence are listed under `fotografii` in `date.json` and shown on each card. To change a price or a source, edit `date.json`. In the local preview, save `index.md` once afterwards so the page picks up the change. After a change to `src/widgets-plugin.ts` itself, restart `npm run dev`.

## Running it on your Mac

Node.js is installed in `~/.local/node`. In a terminal, from this folder:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

```bash
npm run dev
```

Then open http://localhost:4321. `npm run build` makes the final site in `dist/`.

## Publishing

Every push to the `main` branch on GitHub rebuilds the site and publishes it (see `.github/workflows/deploy.yml`).

## Search Console data

`scripts/gsc.mjs` reads the site's Google Search Console data with a read-only service account (`kmreali-reader@km-reali.iam.gserviceaccount.com`, a Restricted user on the `kmreali.ro` Domain property). Its key lives outside this folder, in `~/.config/google/kmreali-key.json`, and must never be committed. With Node on the PATH (see above), from this folder:

```bash
node scripts/gsc.mjs query                         # top searches, last 28 days
node scripts/gsc.mjs query --dims page             # top pages
node scripts/gsc.mjs query --dims date             # clicks and impressions per day
node scripts/gsc.mjs sitemaps                      # submitted sitemaps
node scripts/gsc.mjs inspect https://kmreali.ro/   # is a page indexed, and why not
```

The comment at the top of `scripts/gsc.mjs` lists every option. The account can only read: submitting sitemaps and asking Google to index a page are done in Search Console itself.
