// src/app/components/Footer.tsx
import Link from 'next/link'
import MetricsWidget from './MetricsWidget'

const FB  = process.env.NEXT_PUBLIC_FACEBOOK_URL || ''   // z.B. https://www.facebook.com/deinprofil
const YT  = process.env.NEXT_PUBLIC_YOUTUBE_URL  || ''   // z.B. https://www.youtube.com/@deinkanal
const RSS = '/feed.xml'

export default function Footer() {
  return (
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
          gap: '1rem',
          padding: '1rem 0',
          fontSize: '0.875rem',
          opacity: 0.9,
        }}
      >
        {/* Left: Copyright + Legal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span>© {new Date().getFullYear()} Bruno Baumgartner</span>
          <nav aria-label="Rechtliches">
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
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

        {/* Right: Socials */}
        <nav aria-label="Social Media">
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            {FB && (
              <li>
                <a
                  href={FB}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="no-underline hover:underline"
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H8.08v-2.91h2.36V9.41c0-2.33 1.39-3.62 3.52-3.62.99 0 2.03.18 2.03.18v2.24h-1.14c-1.12 0-1.47.7-1.47 1.42v1.71h2.5l-.4 2.91h-2.1v7.03C18.34 21.21 22 17.06 22 12.06z"/>
                  </svg>
                </a>
              </li>
            )}
            {YT && (
              <li>
                <a
                  href={YT}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="YouTube"
                  className="no-underline hover:underline"
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M23.5 7.2s-.23-1.64-.95-2.36c-.9-.95-1.91-.96-2.37-1.02C16.8 3.5 12 3.5 12 3.5h0s-4.8 0-8.18.32c-.46.06-1.47.07-2.37 1.02C.73 5.56.5 7.2.5 7.2S.27 9.13.27 11.05v1.89c0 1.92.23 3.85.23 3.85s.23 1.64.95 2.36c.9.95 2.08.92 2.61 1.02 1.89.18 8 .31 8 .31s4.8 0 8.18-.32c.46-.06 1.47-.07 2.37-1.02.72-.72.95-2.36.95-2.36s.23-1.92.23-3.85v-1.89c0-1.92-.23-3.85-.23-3.85zM9.75 14.75V7.9l6.37 3.43-6.37 3.42z"/>
                  </svg>
                </a>
              </li>
            )}
            <li>
               
  <Link className="underline hover:no-underline" href="/subscribe">
    RSS <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M6.18 17.82a2.18 2.18 0 1 1 0-4.36 2.18 2.18 0 0 1 0 4.36zM4 4.75a15.25 15.25 0 0 1 15.25 15.25h-3A12.25 12.25 0 0 0 4 7.75v-3zM4 10.5A9.5 9.5 0 0 1 13.5 20h-3A6.5 6.5 0 0 0 4 13.5v-3z"/>
                </svg>
  </Link>
</li>

           <MetricsWidget />
          </ul>
        </nav>
      </div>
    </footer>
  )
}
