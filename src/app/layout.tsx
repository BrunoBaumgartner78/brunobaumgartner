// src/app/layout.tsx
import type { Metadata } from 'next'
import { SITE_URL, absUrl, SITE_TAGLINE } from '@/lib/seo'
import Header from './components/Header'
import Footer from './components/Footer'
import MetricsBeacon from '../app/components/MeticsBeacon'
import MobileTabbar from '../app/components/MobileTabar'
import './base.css'

// Fonts (self-hosted) – setzen CSS-Variablen für base.css
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

// Einheitliches OG-Bild (sandfarben) mit Tagline
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
  url: SITE_URL,
  title: 'Bruno Baumgartner – Autor',
  description: 'Texte, Blog und Einblicke …',
  images: [`${SITE_URL}/opengraph-image`], // 👈 dynamisch gerendertes PNG
  locale: 'de_CH',
},
twitter: {
  card: 'summary_large_image',
  title: 'Bruno Baumgartner – Autor',
  description: 'Texte, Blog und Einblicke …',
  images: [`${SITE_URL}/opengraph-image`], // 👈 dieselbe Route
},

  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${oxanium.variable}`}>
      <head>
        <meta property="fb:app_id" content="1322031815591336" />
        {/* optional: Admin-Fallback */}
        {/* <meta property="fb:admins" content="DEINE_NUMMERISCHE_FB_USER_ID" /> */}
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
