// src/app/components/BookStrip.tsx
import Link from 'next/link'
import { urlFor } from '../lib/sanity.image'
import type { Book } from '../lib/queries'

type Props = { books: Book[] }

/**
 * Zeigt bis zu 5 Bücher als Karten (Cover + Titel).
 * - Fix: Sanity-Image-Builder nutzt fit('crop') statt 'cover'
 * - Fallbacks: fehlendes Cover → Platzhalter
 * - Link: bevorzugt buyUrl, sonst /books/[slug]
 */
function BooksStrip({ books }: Props) {
  if (!books?.length) return null

  return (
    <section aria-labelledby="books-heading">
      <h2 id="books-heading" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
        Bücher
      </h2>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        {books.map((b) => {
          const href = b.buyUrl || `/books/${b.slug}`
          const hasCover = Boolean(b.cover && b.cover.asset)
          const alt = (b as any)?.cover?.alt || b.title

          return (
            <li
              key={b._id}
              style={{
                border: '1px solid var(--color-border, #e5e7eb)',
                borderRadius: 12,
                padding: 12,
                background: 'var(--card-bg, #fff)',
              }}
            >
              <Link href={href} className="no-underline hover:underline" prefetch={false}>
                {hasCover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(b.cover).width(600).height(900).fit('crop').url()}
                    alt={alt}
                    style={{
                      width: '100%',
                      height: 'auto',
                      aspectRatio: '2 / 3',
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginBottom: 8,
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div
                    aria-hidden
                    style={{
                      width: '100%',
                      aspectRatio: '2 / 3',
                      borderRadius: 8,
                      marginBottom: 8,
                      background:
                        'linear-gradient(135deg, rgba(0,0,0,.06), rgba(0,0,0,.02))',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'rgba(0,0,0,.5)',
                      fontSize: 12,
                    }}
                  >
                    Kein Cover
                  </div>
                )}

                <div style={{ fontSize: 14, lineHeight: 1.4 }}>{b.title}</div>
              </Link>
            </li>
          )
        })}
      </ul>

      <div style={{ marginTop: 12 }}>
        <Link href="/books" className="underline">
          Alle Bücher
        </Link>
      </div>
    </section>
  )
}

export default BooksStrip
export { BooksStrip }
export const BookStrip = BooksStrip
