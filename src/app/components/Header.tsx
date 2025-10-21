// src/app/components/Header.tsx
import Link from 'next/link'

export default function Header() {
  return (
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
  )
}
