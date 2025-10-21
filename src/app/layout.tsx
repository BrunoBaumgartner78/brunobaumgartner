// src/app/layout.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, absUrl, DEFAULT_OG } from '@/lib/seo'
import './base.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Bruno Baumgartner – Autor',
    template: '%s | Bruno Baumgartner',
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

        {/* ----- Header / Navigation ----- */}
        <header
          role="banner"
          className="border-b"
          style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
        >
          <div
            className="wrap"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '0.875rem 0',
            }}
          >
            <Link
              href="/"
              className="no-underline hover:underline"
              aria-label="Startseite Bruno Baumgartner"
            >
              <strong>Bruno Baumgartner</strong>
            </Link>

            <nav aria-label="Hauptnavigation">
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                <li>
                  <Link className="underline hover:no-underline" href="/blog">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link className="underline hover:no-underline" href="/buecher">
                    Bücher
                  </Link>
                </li>
                <li>
                  <Link className="underline hover:no-underline" href="/galerie">
                    Galerie
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* ----- Hauptinhalt ----- */}
        <main id="hauptinhalt">{children}</main>

        {/* ----- Optionaler Footer ----- */}
        <footer
          className="border-t"
          style={{
            borderColor: 'var(--color-border, #e5e7eb)',
            marginTop: '4rem',
          }}
        >
          <div
            className="wrap"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 0',
              fontSize: '0.875rem',
              opacity: 0.8,
            }}
          >
            <span>© {new Date().getFullYear()} Bruno Baumgartner</span>
            <nav aria-label="Footer">
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                <li>
                  <Link className="underline hover:no-underline" href="/impressum">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link className="underline hover:no-underline" href="/datenschutz">
                    Datenschutz
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  )
}
