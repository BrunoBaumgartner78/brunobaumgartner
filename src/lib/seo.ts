// src/lib/seo.ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.brainbloom.ch';

export const absUrl = (path: string) =>
  path?.startsWith('http') ? path : new URL(path || '/', SITE_URL).toString();

export const DEFAULT_OG = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Bruno Baumgartner – Autor',
};
