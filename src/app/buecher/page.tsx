// src/app/buecher/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'
import { getBooks } from '@/lib/queries'                // falls kein @-Alias: ../../lib/queries
import { urlFor } from '@/lib/sanity.image'             // falls kein @-Alias: ../../lib/sanity.image
import type { Book } from '@/lib/types'                 // optional – kannst du entfernen, falls nicht vorhanden

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Bücher – Bruno Baumgartner',
  description:
    'Übersicht der Bücher und Projekte von Bruno Baumgartner: Cover, Kurzbeschreibung und Detailseiten.',
  alternates: { canonical: '/buecher' },
}

export default async function BuecherPage() {
  const books: Book[] = await getBooks(24).catch(() => []) as any

  return (
    <section className="wrap" aria-labelledby="page-title" style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Hero */}
      <header style={{ display: 'grid', gap: '0.5rem' }}>
        <h1 id="page-title" className="h1" style={{ margin: 0 }}>Bücher</h1>
        <p style={{ margin: 0, maxWidth: 820, opacity: 0.9 }}>
          Veröffentlichte und entstehende Arbeiten. Große Cover, kurze Zusammenfassung – Klick führt zur Detailansicht.
        </p>
      </header>

      {/* Grid */}
      {(!books || books.length === 0) ? (
        <p className="text-muted">Noch keine Bücher eingetragen.</p>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '1.25rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
          aria-label="Buchliste"
        >
          {books.map((b) => (
            <li key={b._id}>
              <article
                className="card"
                style={{
                  border: '1px solid var(--color-border, #e5e7eb)',
                  borderRadius: 14,
                  background: 'var(--card-bg, #fff)',
                  padding: 14,
                  height: '100%',
                  display: 'grid',
                  gap: 12,
                  transition: 'box-shadow .2s ease, transform .2s ease',
                }}
              >
                <Link
                  href={`/buecher/${b.slug}`}
                  className="no-underline"
                  style={{ display: 'grid', gap: 10 }}
                  aria-label={`${b.title} öffnen`}
                >
                  {/* Cover */}
                  {b.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={urlFor(b.cover).width(700).height(1000).fit('crop').quality(80).url()}
                      alt={b.cover.alt || b.title}
                      width={700}
                      height={1000}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 12,
                        display: 'block',
                      }}
                    />
                  )}

                  {/* Meta */}
                  <div style={{ display: 'grid', gap: 6 }}>
                    <h2
                      style={{
                        fontSize: '1.05rem',
                        lineHeight: 1.35,
                        margin: 0,
                        letterSpacing: '.2px',
                      }}
                    >
                      {b.title}
                    </h2>

                    {b.subtitle && (
                      <p style={{ margin: 0, fontSize: '.95rem', opacity: 0.8 }}>
                        {b.subtitle}
                      </p>
                    )}

                    {b.description && (
                      <p
                        className="clamp-3"
                        style={{
                          margin: '2px 0 0',
                          fontSize: '.95rem',
                          lineHeight: 1.55,
                          opacity: 0.9,
                        }}
                      >
                        {b.description}
                      </p>
                    )}

                    <span
                      aria-hidden
                      style={{
                        marginTop: 4,
                        fontSize: '.9rem',
                        textDecoration: 'underline',
                        textUnderlineOffset: 3,
                      }}
                    >
                      Mehr lesen →
                    </span>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}

      {/* Kleine CSS-Verbesserung nur für diese Seite */}
      <style>{`
        .card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.07); transform: translateY(-2px); }
        .clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}
