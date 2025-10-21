// src/app/layout.tsx
import type { Metadata } from 'next'
import { SITE_URL, absUrl, SITE_TAGLINE } from '@/lib/seo'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import MetricsBeacon from './components/MeticsBeacon'
import './base.css'

// Einheitliches OG-Bild (sandfarben) mit Tagline aus seo.ts
const DEFAULT_OG_URL = absUrl(
  `/og?title=${encodeURIComponent('Bruno Baumgartner – Autor')}` +
  `&subtitle=${encodeURIComponent(SITE_TAGLINE)}`
)

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Bruno Baumgartner – Autor',
    template: '%s | Bruno Baumgartner',
  },
  description:
    'Offizielle Seite von Bruno Baumgartner: Blog, Texte und Einblicke in Arbeit, Themen und Projekte.',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'Brainbloom RSS' }],
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Brainbloom',
    url: absUrl('/'),
    title: 'Bruno Baumgartner – Autor',
    description:
      'Texte, Blog und Einblicke von Bruno Baumgartner. Minimal, schnell und zugänglich.',
    images: [DEFAULT_OG_URL],
    locale: 'de_CH',
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_URL],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {/* Skip-Link für Screenreader / Tastatur */}
        <a
          href="#hauptinhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded"
        >
          Direkt zum Inhalt
        </a>

        <Header />
        <main id="hauptinhalt">{children}</main>
        <Footer />
        <MetricsBeacon />
      </body>
    </html>
  )
}
