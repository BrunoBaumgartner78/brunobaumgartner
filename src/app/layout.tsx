// src/app/layout.tsx
import type { Metadata } from 'next'
import { SITE_URL, absUrl, SITE_TAGLINE } from '@/lib/seo'

// ✅ saubere, konsistente Pfade (achten auf Dateinamen & Groß/Kleinschreibung)
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import MetricsBeacon from '@/app/components/MetricsBeacon'
import MobileTabbar from '@/app/components/MobileTabbar'

import './base.css'

// Fonts (setzen CSS-Variablen für base.css)
import { Inter, Oxanium } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

// Einheitliches OG-Bild (sandfarben) via dynamischer /og-Route
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
    canonical: '/', // wird mit metadataBase absolut gemacht
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'Brainbloom RSS' }],
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Brainbloom',
    url: new URL('/', SITE_URL).toString(),
    title: 'Bruno Baumgartner – Autor',
    description: 'Texte, Blog und Einblicke …',
    images: [
      {
        url: DEFAULT_OG_URL,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Bruno Baumgartner – Autor',
      },
    ],
    locale: 'de_CH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bruno Baumgartner – Autor',
    description: 'Texte, Blog und Einblicke …',
    images: [DEFAULT_OG_URL],
  },
  robots: { index: true, follow: true },

  // ❌ NICHT hier setzen:
  // other: { 'fb:app_id': '1322031815591336' },
  // Das erzeugt <meta name="fb:app_id"> und wird vom Facebook Debugger ignoriert.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${oxanium.variable}`}>
      <head>
        {/* ✅ Korrekt für Facebook: property, nicht name */}
        <meta property="fb:app_id" content="1322031815591336" />
      </head>
      <body>
        {/* Skip-Link für Screenreader / Tastatur */}
        <a
          href="#hauptinhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded"
        >
          Direkt zum Inhalt
        </a>

        <Header />
        <MobileTabbar />
        <main id="hauptinhalt">{children}</main>
        <Footer />
        <MetricsBeacon />
      </body>
    </html>
  )
}
