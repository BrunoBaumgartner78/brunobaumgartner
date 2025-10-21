// src/app/buecher/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBook, getBookSlugs } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import { PortableText } from '@portabletext/react'

export const revalidate = 600
export const dynamic = 'force-static'

// ---- Static params for SSG ----
export async function generateStaticParams() {
  const slugs = await getBookSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

// ---- SEO ----
type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const book = await getBook(slug)
  if (!book) return { title: 'Buch nicht gefunden' }

  const title = book.title + (book.subtitle ? ` – ${book.subtitle}` : '')
  const description = book.description || undefined
  const ogImage =
    book.cover ? urlFor(book.cover).width(1200).height(630).fit('crop').url() : '/og.png'

  return {
    title,
    description,
    alternates: { canonical: `/buecher/${slug}` },
    openGraph: { type: 'article', title, description, images: ogImage ? [ogImage] : undefined },
    twitter: { card: 'summary_large_image', images: ogImage ? [ogImage] : undefined },
  }
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params
  const book = await getBook(slug)
  if (!book) notFound()

  const {
    title,
    subtitle,
    year,
    pages,
    isbn,
    language,
    publisher,
    description,      // kurz (nur hier im Hero – einmalig)
    longDescription,  // lang (unten als PortableText)
    buyLinks,
    cover,
    tags,
    shopUrl,          // NUR dieser Link wird für "Zum Shop" genutzt
  } = book as any

  const isExternal = (url: string) => /^https?:\/\//i.test(url)

  return (
    <div className="wrap site-main" style={{ display: 'grid', gap: '2rem' }}>
      {/* ===== Hero ===== */}
      <section aria-labelledby="book-title" style={{ display: 'grid', gap: '1.25rem' }}>
        <div
          className="card"
          style={{
            display: 'grid',
            gap: '1.25rem',
            border: '1px solid var(--color-border, #e5e7eb)',
            borderRadius: 14,
            padding: 16,
            background: 'var(--card-bg, #fff)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: '160px 1fr',
              alignItems: 'start',
            }}
          >
            {/* Cover */}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {cover ? (
                <img
                  src={urlFor(cover).width(800).height(1100).fit('fill').url()}
                  alt={cover.alt || title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 10,
                    objectFit: 'cover',
                    boxShadow: '0 4px 24px rgba(0,0,0,.08)',
                  }}
                  loading="eager"
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    borderRadius: 10,
                    background: '#f3f4f6',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#9ca3af',
                    fontSize: 12,
                  }}
                >
                  Kein Cover
                </div>
              )}
            </div>

            {/* Titel, Meta & Kurzbeschreibung */}
            <div style={{ display: 'grid', gap: 8 }}>
              <h1 id="book-title" style={{ margin: 0, lineHeight: 1.2 }}>{title}</h1>
              {subtitle && <p style={{ margin: 0, opacity: 0.8, fontSize: 16 }}>{subtitle}</p>}

              {/* Meta-Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {year && <Chip label={String(year)} />}
                {pages && <Chip label={`${pages} Seiten`} />}
                {language && <Chip label={language} />}
                {publisher && <Chip label={publisher} />}
                {isbn && <Chip label={`ISBN ${isbn}`} />}
              </div>

              {/* Kurzbeschreibung – EINMALIG hier */}
              {description && (
                <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6 }}>{description}</p>
              )}

              {/* Kauf-Links + (nur) Sanity-Shoplink */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                {Array.isArray(buyLinks) &&
                  buyLinks.map((b: any, i: number) =>
                    b?.url ? (
                      <a
                        key={`${b.url}-${i}`}
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 14,
                          border: '1px solid var(--color-border, #e5e7eb)',
                          borderRadius: 999,
                          padding: '8px 12px',
                          textDecoration: 'none',
                          background: 'var(--btn-bg, #111827)',
                          color: '#fff',
                        }}
                        aria-label={b.label ? `Kaufen: ${b.label}` : 'Kaufen'}
                      >
                        {b.label || 'Kaufen'}
                      </a>
                    ) : null
                  )}

                {/* Zum Shop – nur wenn in Sanity gesetzt */}
                {shopUrl && (
                  <a
                    href={shopUrl}
                    {...(isExternal(shopUrl)
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    style={{
                      fontSize: 14,
                      border: '1px solid var(--color-border, #e5e7eb)',
                      borderRadius: 999,
                      padding: '8px 12px',
                      textDecoration: 'none',
                      background: '#fff',
                      color: 'var(--text, #111827)',
                    }}
                    aria-label="Zum Shop"
                  >
                    Zum Shop
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {!!(tags && tags.length) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tags.map((t: string, i: number) => (
                <span
                  key={`${t}-${i}`}
                  style={{
                    fontSize: 12,
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: '1px solid var(--color-border, #e5e7eb)',
                    background: '#fafafa',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Über das Buch (nur wenn longDescription vorhanden) ===== */}
      {longDescription && Array.isArray(longDescription) && longDescription.length > 0 && (
        <section aria-labelledby="about" style={{ display: 'grid', gap: '0.75rem' }}>
          <h2 id="about" style={{ fontSize: '1.25rem', margin: 0 }}>Über das Buch</h2>
          <PortableText value={longDescription} />
        </section>
      )}
    </div>
  )
}

// Kleine Hilfskomponente für Meta-Chips
function Chip({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 12,
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid var(--color-border, #e5e7eb)',
        background: '#fafafa',
      }}
    >
      {label}
    </span>
  )
}
