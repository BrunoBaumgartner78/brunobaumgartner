// src/app/components/Footer.tsx
import Link from 'next/link'
import MetricsWidget from './MetricsWidget'

const FB  = process.env.NEXT_PUBLIC_FACEBOOK_URL || ''
const YT  = process.env.NEXT_PUBLIC_YOUTUBE_URL  || ''
const RSS = '/subscribe'

function Icon({
  title,
  children,
  size = 22,
}: { title: string; children: React.ReactNode; size?: number }) {
  return (
    <span
      className="footer-neo__icon"
      style={{
        display: 'inline-flex',
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label={title}
      title={title}
    >
      <svg aria-hidden="true" role="img" focusable="false" width={size} height={size}
           viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
        {children}
      </svg>
    </span>
  )
}

export default function Footer() {
  return (
    <footer
      className="footer-neo border-t"
      style={{ borderColor: 'var(--color-border, #e5e7eb)', marginTop: '3rem' }}
    >
      {/* CTA-Bar im Neumorphism-Panel */}
      <div className="wrap" style={{ paddingBlock: '0.9rem' }}>
        <div
          className="footer-neo__panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.9rem 1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontWeight: 700, letterSpacing: '.2px', padding: 5 }}>
            Jetzt neu: <em>Complexus&nbsp;Immunitas&nbsp;Mentis</em> als PDF – perfekt für die Weiterarbeit mit ChatGPT.
          </div>

          {/* Shop-Button unverändert lassen */}
          <Link href="/shop" className="ctaBtn ctaBtn--prime" aria-label="Zum Shop (PDF kaufen)">
            <span className="ctaBtn__text">Zum Shop</span>
            <svg className="ctaBtn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6L13 5z"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer-Content */}
      <div
        className="wrap"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem 1.25rem',
          padding: '1.25rem 0',
          fontSize: '0.935rem',
        }}
      >
        {/* Links: Copyright + Rechtliches */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem 1rem', minWidth: 260 }}>
          <span style={{ opacity: 0.8, whiteSpace: 'nowrap' }}>
            © {new Date().getFullYear()} Bruno Baumgartner
          </span>
          <nav aria-label="Rechtliches">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
              <li><Link className="underline hover:no-underline" href="/impressum">Impressum</Link></li>
              <li><Link className="underline hover:no-underline" href="/datenschutz">Datenschutz</Link></li>
            </ul>
          </nav>
        </div>

        {/* Mitte: Metrics – leicht „eingedrückt“ */}
        <div style={{ flex: '1 1 420px', minWidth: 330, display: 'flex', justifyContent: 'center' }}>
          <div className="footer-neo__inset" style={{ padding: 12, width: '100%', borderRadius: 12 }}>
            <MetricsWidget />
          </div>
        </div>

        {/* Rechts: Social */}
        <div aria-label="Social Media" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 260, justifyContent: 'flex-end', paddingBottom: 20 }}>
          <Link href={RSS} className="no-underline hover:underline" aria-label="RSS-Feed">
            <Icon title="RSS">
              <path d="M6.18 17.82a2.18 2.18 0 1 1 0-4.36 2.18 2.18 0 0 1 0 4.36zM4 4.75A15.25 15.25 0 0 1 19.25 20h-3A12.25 12.25 0 0 0 4 7.75v-3zM4 10.5A9.5 9.5 0 0 1 13.5 20h-3A6.5 6.5 0 0 0 4 13.5v-3z" />
            </Icon>
          </Link>
          {FB && (
            <a href={FB} target="_blank" rel="me noopener noreferrer" className="no-underline hover:underline" aria-label="Facebook">
              <Icon title="Facebook" size={20}>
                <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H8.08v-2.91h2.36V9.41c0-2.33 1.39-3.62 3.52-3.62.99 0 2.03.18 2.03.18v2.24h-1.14c-1.12 0-1.47.7-1.47 1.42v1.71h2.5l-.4 2.91h-2.1v7.03C18.34 21.21 22 17.06 22 12.06z" />
              </Icon>
            </a>
          )}
          {YT && (
            <a href={YT} target="_blank" rel="me noopener noreferrer" className="no-underline hover:underline" aria-label="YouTube">
              <Icon title="YouTube">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.58A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.58a3 3 0 0 0 2.1-2.12c.35-1.9.5-3.8.5-5.8s-.15-3.9-.5-5.8ZM9.75 15.5v-7l6 3.5-6 3.5Z" />
              </Icon>
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
