// src/app/layout.tsx
import type { Metadata } from 'next'
import { SITE_URL, absUrl, DEFAULT_OG } from '@/lib/seo'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import MetricsBeacon from './components/MeticsBeacon'
import './base.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Bruno Baumgartner – Autor',
    template: '%s | Bruno Baumgartner',
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'Brainbloom RSS' }],
    },
  },
  description:
    'Offizielle Seite von Bruno Baumgartner: Blog, Texte und Einblicke in Arbeit, Themen und Projekte.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Brainbloom',
    url: absUrl('/'),
    title: 'Bruno Baumgartner – Autor',
    description:
      'Texte, Blog und Einblicke von Bruno Baumgartner. Minimal, schnell und zugänglich.',
    images: [
      {
        url: absUrl(DEFAULT_OG.url),
        width: DEFAULT_OG.width,
        height: DEFAULT_OG.height,
        alt: DEFAULT_OG.alt,
      },
    ],
    locale: 'de_CH',
  },
  twitter: { card: 'summary_large_image', images: [absUrl(DEFAULT_OG.url)] },
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
