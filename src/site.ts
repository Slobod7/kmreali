// Everything about the site that is not an article lives here.

export const site = {
  name: 'KM Reali',
  domain: 'kmreali.ro',
  tagline: 'Păreri reale de la proprietari de mașini',
  description:
    'Recenzii, ghiduri și topuri scrise de oameni care chiar conduc mașinile despre care scriu: consum real, probleme reale, costuri reale.',
  footerText:
    'Păreri reale de la proprietari de mașini: consum real, probleme reale, costuri reale. Scris de oameni care conduc mașinile despre care scriu.',
  author: {
    name: 'Bogdan Slobodzean',
    bio: 'Scrie despre mașinile pe care le conduce zi de zi.',
  },
  // Leave empty to hide the Contact page and link until there is an address.
  contactEmail: '',
};

export const categories = {
  recenzii: {
    title: 'Recenzii',
    singular: 'Recenzie',
    description: 'Mașini testate de proprietarii lor, după mii de kilometri: consum, probleme, costuri.',
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
    description: 'Clasamente făcute pe date de la proprietari, nu pe broșuri.',
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
