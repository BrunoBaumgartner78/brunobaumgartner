// src/app/galerie/page.tsx
import Link from 'next/link'
import { getGallery } from '../../lib/queries'
import { urlFor } from '../../lib/sanity.image'

export const revalidate = 600

export default async function Galerie() {
  const items = await getGallery(36).catch(() => [])

  return (
    <section className="wrap" aria-labelledby="galerie-title" style={{ display: 'grid', gap: '1.5rem' }}>
      <h1 id="galerie-title" className="h1" style={{ margin: 0 }}>Galerie</h1>

      {(!items || items.length === 0) && (
        <p className="text-muted">Noch keine Bilder.</p>
      )}

      <ul
        style={{
          listStyle: 'none',   // keine Bullet-Points
          margin: 0,
          padding: 0,
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        {items.map((it) => {
          const alt =
            // bevorzugt Alt von Asset, sonst Titel, sonst generisch
            (it as any)?.image?.alt || it.title || 'Galeriebild'

          return (
            <li
              key={it._id}
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                background: 'var(--card-bg, #fff)',
                border: '1px solid var(--color-border, #e5e7eb)',
              }}
            >
              <Link
                href={`/galerie/${it.slug}`}
                aria-label={`${it.title ?? 'Bild'} öffnen`}
                className="block"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                }}
              >
                {/* Wir geben nur eine Breite mit – Höhe bleibt natürlich (volle Größe im Kachelbereich) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlFor(it.image).width(1200).quality(80).url()}
                  alt={alt}
                  loading="lazy"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    verticalAlign: 'middle',
                    transition: 'transform .2s ease',
                  }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Optionaler Titel-Balken – sehr dezent */}
                {it.title && (
                  <div
                    style={{
                      padding: '8px 10px',
                      fontSize: 13,
                      lineHeight: 1.3,
                      color: 'var(--muted-fg, #374151)',
                      background: 'var(--card-bg, #fff)',
                      borderTop: '1px solid var(--color-border, #e5e7eb)',
                    }}
                  >
                    {it.title}
                  </div>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
