# KM Reali

The kmreali.ro website: a static site built with [Astro](https://astro.build) and published on GitHub Pages.

## Where things are

| What | Where |
| --- | --- |
| Articles (text + photos) | `src/content/articole/<slug>/index.md` |
| Site name, tagline, author, contact email | `src/site.ts` |
| Colors and fonts | `src/styles/global.css` |
| Header, footer, cards, car spec box | `src/components/` |
| Pages (home, sections, Despre, Contact) | `src/pages/` |

## Adding an article

1. Make a folder in `src/content/articole/` named like the address you want, e.g. `dacia-duster-2022-pareri-proprietar`.
2. Put the photos in that folder, plus an `index.md` (copy the Skoda one as a starting point).
3. Fill in the block at the top (title, description, category, cover photo, car details).
4. Keep `draft: true` while writing. Drafts show in the local preview but not on the live site.
5. Set `draft: false` to publish.

Photos go in the text as `![alt text](./photo-name.webp)`.

For the FAQ, add a `## Întrebări frecvente` section and write each question as its own paragraph: the question in bold, then the answer on the same line, e.g. `**Cât consumă?** 9–10 l/100 km pe drum lung.` On the page each question opens its answer when clicked, and the site turns them into FAQ data for search engines automatically.

In reviews, the **Pe scurt** list near the top feeds the review data for search engines (the score, likes and dislikes) together with the car details at the top. Keep its `**Îmi place:**`, `**Nu îmi place:**` and `**Nota mea:** 7,8/10` lines, and separate the likes and dislikes with commas or semicolons.

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
