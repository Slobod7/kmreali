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
