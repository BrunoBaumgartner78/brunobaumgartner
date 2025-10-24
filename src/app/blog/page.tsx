// src/app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostsPage } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import { absUrl, SITE_TAGLINE } from '@/lib/seo' // ✅ SEO-Helper

export const revalidate = 600

type SP = Record<string, string | string[] | undefined>

function parsePage(sp: SP) {
  const raw = Array.isArray(sp?.page) ? sp.page[0] : sp?.page
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
}

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<SP> }
): Promise<Metadata> {
  const sp = await searchParams
  const page = parsePage(sp)

  const title = page > 1 ? `Blog – Seite ${page}` : 'Blog'
  const canonicalPath = page > 1 ? `/blog?page=${page}` : '/blog'

  const ogImageUrl = absUrl(
    `/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(SITE_TAGLINE)}`
  )

  const description =
    'Aktuelle Beiträge, kurze Texte und Einblicke – schnell und zugänglich.'

  return {
    title,
    description,
    // 👉 relative Canonical; wird über metadataBase absolut gemacht
    alternates: { canonical: canonicalPath },
    // 👉 konsistente OG-URL + eigenes OG-Bild
    openGraph: {
      type: 'website',
      url: absUrl(canonicalPath),
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: 'Blog – Brainbloom',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function BlogPage(
  { searchParams }: { searchParams: Promise<SP> }
) {
  const sp = await searchParams
  const page = parsePage(sp)
  const perPage = 9

  // Daten holen
  const { items: posts, total } = await getPostsPage(page, perPage)
  const pageCount = Math.max(1, Math.ceil(total / perPage))

  // Ungültige Seite -> 404
  if (page > pageCount && total > 0) {
    return notFound()
  }

  const pageHref = (p: number) => (p === 1 ? '/blog' : `/blog?page=${p}`)

  // Hilfsfunktion: kompakte Pagination (Fenster um aktuelle Seite)
  const windowPages = (() => {
    const span = 2 // 2 nach links/rechts
    const start = Math.max(1, page - span)
    const end = Math.min(pageCount, page + span)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })()

  return (
    <div className="wrap" style={{ display: 'grid', gap: '1.25rem' }}>
      <header style={{ margin: '0 0 .25rem' }}>
        <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Blog</h1>
        <p style={{ margin: '0.25rem 0 0', opacity: 0.7 }}>
          {total} Beiträge • Seite {Math.min(page, pageCount)} von {pageCount}
        </p>
      </header>

      {/* Grid */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {posts.map((post) => (
          <li
            key={post._id}
            style={{
              border: '1px solid var(--color-border, #e5e7eb)',
              borderRadius: 12,
              background: 'var(--card-bg, var(--surface, #fff))',
              padding: 14,
            }}
          >
            <article>
              {post.mainImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(post.mainImage).width(800).height(420).fit('crop').url()}
                  alt={post.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 10,
                    marginBottom: 10,
                    display: 'block',
                  }}
                />
              )}

              <h2 style={{ fontSize: '1.1rem', margin: '0 0 4px' }}>
                <Link href={`/blog/${post.slug}`} className="no-underline hover:underline">
                  {post.title}
                </Link>
              </h2>

              {post.publishedAt && (
                <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
                  {new Date(post.publishedAt).toLocaleDateString('de-CH')}
                </p>
              )}

              {post.excerpt && (
                <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.5 }}>
                  {post.excerpt}
                </p>
              )}
            </article>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {total > perPage && (
        <nav
          aria-label="Seiten"
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginTop: 4,
            flexWrap: 'wrap',
          }}
        >
          {/* Zurück */}
          <Link
            href={page > 1 ? pageHref(page - 1) : '#'}
            aria-disabled={page <= 1}
            className="underline"
            style={{
              opacity: page <= 1 ? 0.4 : 1,
              pointerEvents: page <= 1 ? ('none' as const) : 'auto',
            }}
          >
            ← Zurück
          </Link>

          {/* Erste Seite + Ellipse */}
          {windowPages[0] > 1 && (
            <>
              <Link
                href={pageHref(1)}
                className="no-underline"
                aria-label="Seite 1"
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border, #e5e7eb)',
                }}
              >
                1
              </Link>
              {windowPages[0] > 2 && <span style={{ opacity: 0.6 }}>…</span>}
            </>
          )}

          {/* Fenster um aktuelle Seite */}
          <ul style={{ listStyle: 'none', display: 'flex', gap: 6, margin: 0, padding: 0 }}>
            {windowPages.map((p) => {
              const active = p === page
              return (
                <li key={p}>
                  <Link
                    href={pageHref(p)}
                    aria-current={active ? 'page' : undefined}
                    className="no-underline"
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border, #e5e7eb)',
                      background: active ? 'var(--muted, #f5f5f5)' : 'transparent',
                    }}
                  >
                    {p}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Ellipse + letzte Seite */}
          {windowPages[windowPages.length - 1] < pageCount && (
            <>
              {windowPages[windowPages.length - 1] < pageCount - 1 && (
                <span style={{ opacity: 0.6 }}>…</span>
              )}
              <Link
                href={pageHref(pageCount)}
                className="no-underline"
                aria-label={`Seite ${pageCount}`}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border, #e5e7eb)',
                }}
              >
                {pageCount}
              </Link>
            </>
          )}

          {/* Weiter */}
          <Link
            href={page < pageCount ? pageHref(page + 1) : '#'}
            aria-disabled={page >= pageCount}
            className="underline"
            style={{
              opacity: page >= pageCount ? 0.4 : 1,
              pointerEvents: page >= pageCount ? ('none' as const) : 'auto',
            }}
          >
            Weiter →
          </Link>
        </nav>
      )}
    </div>
  )
}
