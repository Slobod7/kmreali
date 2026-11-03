// Everything about the site that is not an article lives here.

export const site = {
  name: 'KM Reali',
  domain: 'kmreali.ro',
  tagline: 'Păreri reale de la proprietari de mașini',
  description:
    'Recenzii scrise de proprietar, ghiduri și topuri făcute pe date publice și păreri de la proprietari, cu surse: consum real, probleme reale, costuri reale.',
  footerText:
    'Păreri reale de la proprietari de mașini: consum real, probleme reale, costuri reale. Recenziile sunt scrise de proprietar; ghidurile și topurile se bazează pe date publice și păreri de la proprietari, cu surse.',
  author: {
    name: 'Bogdan Slobodzean',
    bio: 'Conduce zi de zi un Skoda Superb din 2020 și scrie despre mașini din perspectiva proprietarului.',
    // Photo on the Despre page: put a square image in public/foto/ and set its path here, e.g. 'foto/autor.webp'.
    photo: '',
  },
  // Leave empty to hide the Contact page and link until there is an address.
  contactEmail: '',
  // Cloudflare Web Analytics token. Leave empty to load no analytics.
  // The beacon only renders in production builds on the live domain (see src/layouts/Base.astro).
  cloudflareAnalyticsToken: '002124604d5b487e9bd062b8f06f11e7',
};

export const categories = {
  recenzii: {
    title: 'Recenzii',
    singular: 'Recenzie',
    description: 'Recenzii scrise de proprietar, după mii de kilometri: consum, probleme, costuri.',
    empty: 'Primele recenzii apar în curând.',
  },
  ghiduri: {
    title: 'Ghiduri',
    singular: 'Ghid',
    description: 'Explicații practice pentru întreținere, cumpărare și drumurile de zi cu zi.',
    empty: 'Primele ghiduri apar în curând.',
  },
  topuri: {
    title: 'Topuri',
    singular: 'Top',
    description: 'Clasamente făcute pe date publice și păreri de la proprietari, cu surse, nu pe broșuri.',
    empty: 'Primele topuri apar în curând.',
  },
} as const;

export type CategoryId = keyof typeof categories;

export const nav = [
  { label: 'Recenzii', href: 'recenzii/' },
  { label: 'Ghiduri', href: 'ghiduri/' },
  { label: 'Topuri', href: 'topuri/' },
  { label: 'Despre', href: 'despre/' },
];

/** Prefixes a site path with the base path, so links work on github.io and on kmreali.ro. */
export function url(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function formatKm(km: number) {
  return new Intl.NumberFormat('ro-RO').format(km);
}
