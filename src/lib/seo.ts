// src/lib/seo.ts
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.brainbloom.ch'

export function absUrl(path = '/') {
  try {
    return new URL(path, SITE_URL).toString()
  } catch {
    return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
  }
}

// Falls noch nicht vorhanden:
export const DEFAULT_OG = {
  url: '/og', // wir verweisen ab jetzt auf unsere dynamische /og Route
  width: 1200,
  height: 630,
  alt: 'Brainbloom – OG Image',
}

// ✨ Hier kommt euer Spruch zentral hin (oder via Env überschreiben)
export const SITE_TAGLINE =
  process.env.NEXT_PUBLIC_TAGLINE ||
  'Texte, Blog und Einblicke – minimal, schnell, zugänglich.'
export const ogTemplate = (title: string, subtitle: string = SITE_TAGLINE) =>
  absUrl(`/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`)

