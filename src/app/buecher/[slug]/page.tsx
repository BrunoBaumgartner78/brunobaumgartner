// src/app/buecher/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBook, getBooks } from '@/lib/queries'          // ggf. ../../lib/queries
import { urlFor } from '@/lib/sanity.image'                // ggf. ../../lib/sanity.image

export const revalidate = 600
export const dynamic = 'force-static' // vermeidet serverseitige Überraschungen

type RouteParams = { slug: string }

function safeCoverUrl(img: any, w: number, h: number, fit: 'crop' | 'min' | 'max' = 'crop', q = 85) {
  try {
    if (!img) return ''
    // nur bauen, wenn ein Asset vorhanden ist
    if (!img.asset && !img._ref && !(img as any).asset?._ref) return ''
    return urlFor(img).width(w).height(h).fit(fit).quality(q).url()
  } catch {
    return ''
  }
}

export async function generateStaticParams() {
  const list = await getBooks(100).catch(() => [] as any[])
  return (list || [])
    .map((b: any) => (typeof b.slug === 'string' ? b.slug : b.slug?.current))
    .filter(Boolean)
    .map((slug: string) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<RouteParams> }
): Promise<Metadata> {
  try {
    const { slug } = await params
    const book = await getBook(slug).catch(() => null as any)
    const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.brainbloom.ch'
    const canonical = `${site}/buecher/${encodeURIComponent(slug)}`
    if (!book) {
      return {
        title: 'Buch nicht gefunden – Bruno Baumgartner',
        alternates: { canonical },
      }
    }
    const og = safeCoverUrl(book.cover, 1200, 630, 'crop', 85) || `${site}/og.png`
    const desc = book.description || book.subtitle || 'Buch von Bruno Baumgartner'
    return {
      title: `${book.title} – Buch`,
      description: desc,
      alternates: { canonical },
      openGraph: { url: canonical, title: `${book.title} – Buch`, description: desc, images: [og], type: 'book' },
      twitter: { card: 'summary_large_image', images: [og] },
    }
  } catch {
    return { title: 'Buch – Bruno Baumgartner' }
  }
}

export default async function BookPage(
  { params }: { params: Promise<RouteParams> }
) {
  const { slug } = await params
  const b = await getBook(slug).catch(() => null as any)
  if (!b) return notFound()

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.brainbloom.ch'
  const pageUrl = `${site}/buecher/${encodeURIComponent(slug)}`
  const cover = safeCoverUrl(b.cover, 900, 1300)

  const all = await getBooks(12).catch(() => [] as any[])
  const related = (all || [])
    .filter((x: any) => (typeof x.slug === 'string' ? x.slug : x.slug?.current) !== (b.slug ?? b.slug?.current))
    .slice(0, 3)

  const getSlug = (s: any) => (typeof s === 'string' ? s : s?.current)

  return (
    <article className="wrap" aria-labelledby="book-title" style={{ display: 'grid', gap: '2rem' }}>
      <nav aria-label="Brotkrumen" className="breadcrumbs">
        <ol>
          <li><Link href="/">Start</Link></li>
          <li><Link href="/buecher">Bücher</Link></li>
          <li aria-current="page">{b.title}</li>
        </ol>
      </nav>

      <header className="book-hero">
        <div className="book-cover">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={b.cover?.alt || b.title} width={900} height={1300} loading="eager" />
          ) : (
            <div aria-hidden className="cover-fallback">Kein Cover</div>
          )}
        </div>

        <div className="book-meta">
          <h1 id="book-title" className="h1">{b.title}</h1>
          {b.subtitle && <p className="subtitle">{b.subtitle}</p>}

          <div className="chips">
            {b.year && <span className="chip">{b.year}</span>}
            {b.pages && <span className="chip">{b.pages} S.</span>}
            {b.isbn && <span className="chip">ISBN {b.isbn}</span>}
          </div>

          {b.description && <p className="lead">{b.description}</p>}

          {!!(Array.isArray(b.buyLinks) && b.buyLinks.length) && (
            <div className="buy">
              {b.buyLinks.map((l: any, i: number) => (
                <a key={i} className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.label || 'Jetzt kaufen'}
                </a>
              ))}
            </div>
          )}

          <div className="share">
            <span>Teilen:</span>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(b.title)}`} target="_blank" rel="noopener noreferrer">X/Twitter</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </header>

      <section className="book-body" aria-labelledby="inhalt">
        <h2 id="inhalt" className="visually-hidden">Inhalt</h2>
        {b.longDescription ? (
          <div className="prose">{b.longDescription}</div>
        ) : (
          b.description && <div className="prose"><p>{b.description}</p></div>
        )}

        {!!(Array.isArray(b.toc) && b.toc.length) && (
          <div className="toc">
            <h3>Inhaltsverzeichnis</h3>
            <ol>
              {b.toc.map((t: any, i: number) => <li key={i}>{t}</li>)}
            </ol>
          </div>
        )}

        <dl className="details">
          {b.publisher && (<><dt>Verlag</dt><dd>{b.publisher}</dd></>)}
          {b.edition && (<><dt>Auflage</dt><dd>{b.edition}</dd></>)}
          {b.language && (<><dt>Sprache</dt><dd>{b.language}</dd></>)}
          {Array.isArray(b.tags) && b.tags.length > 0 && (
            <>
              <dt>Tags</dt>
              <dd className="tags">
                {b.tags.map((t: string, i: number) => <span key={i} className="tag">{t}</span>)}
              </dd>
            </>
          )}
        </dl>
      </section>

      {!!related.length && (
        <section aria-labelledby="related">
          <h2 id="related" className="h2">Verwandte Bücher</h2>
          <ul className="related-grid" aria-label="Weitere Bücher">
            {related.map((r: any) => {
              const rSlug = getSlug(r.slug)
              const rCover = safeCoverUrl(r.cover, 600, 850)
              return (
                <li key={r._id}>
                  <Link href={`/buecher/${rSlug}`} className="related-card" aria-label={`${r.title} öffnen`}>
                    {rCover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rCover} alt={r.cover?.alt || r.title} width={600} height={850} loading="lazy" />
                    )}
                    <div className="related-meta">
                      <strong>{r.title}</strong>
                      {r.subtitle && <span>{r.subtitle}</span>}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: b.title,
            alternateName: b.subtitle || undefined,
            datePublished: b.year || undefined,
            inLanguage: b.language || 'de',
            numberOfPages: b.pages || undefined,
            isbn: b.isbn || undefined,
            image: cover || undefined,
            url: pageUrl,
            author: { '@type': 'Person', name: 'Bruno Baumgartner' },
            publisher: b.publisher ? { '@type': 'Organization', name: b.publisher } : undefined,
          }),
        }}
      />

      <style>{`
        .breadcrumbs ol { list-style: none; padding: 0; margin: 0; display: flex; gap: .5rem; flex-wrap: wrap; font-size: .9rem; }
        .breadcrumbs li + li::before { content: "›"; opacity: .6; margin: 0 .25rem; }

        .book-hero { display: grid; gap: 1.25rem; grid-template-columns: 1fr; }
        .book-cover img { width: 100%; height: auto; border-radius: 14px; display: block; box-shadow: 0 8px 30px rgba(0,0,0,.08); }
        .cover-fallback { height: 520px; border: 1px dashed #ddd; border-radius: 14px; display: grid; place-items: center; color: #666; background: #fafafa; }

        .book-meta { display: grid; gap: .75rem; align-content: start; }
        .subtitle { margin: 0; opacity: .85; font-size: 1.05rem; }
        .chips { display: flex; flex-wrap: wrap; gap: .5rem; }
        .chip { padding: .3rem .55rem; border: 1px solid var(--color-border, #e5e7eb); border-radius: 999px; font-size: .85rem; background: var(--chip-bg, #fff); }
        .lead { margin-top: .25rem; font-size: 1.05rem; line-height: 1.6; }
        .buy { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: .25rem; }
        .btn { display: inline-block; padding: .55rem .8rem; border-radius: 10px; border: 1px solid var(--color-border, #e5e7eb); text-decoration: none; transition: .2s ease; background: #fff; }
        .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0,0,0,.06); }
        .share { display: flex; align-items: center; gap: .6rem; font-size: .9rem; opacity: .9; }
        .share a { text-decoration: underline; text-underline-offset: 3px; }

        .book-body { display: grid; gap: 1.5rem; }
        .prose p { margin: 0 0 .9rem 0; line-height: 1.75; }
        .toc { border-top: 1px solid var(--color-border, #e5e7eb); padding-top: 1rem; }
        .toc ol { padding-left: 1.1rem; }
        .details { display: grid; grid-template-columns: max-content 1fr; gap: .4rem 1rem; border-top: 1px solid var(--color-border, #e5e7eb); padding-top: 1rem; }
        .details dt { opacity: .7; }
        .details .tags { display: flex; gap: .4rem; flex-wrap: wrap; }
        .tag { background: #f3f4f6; color: #111827; padding: .25rem .5rem; border-radius: .5rem; font-size: .85rem; }

        .related-grid { list-style: none; padding: 0; margin: .5rem 0 0 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .related-card { display: grid; gap: .5rem; text-decoration: none; color: inherit; border: 1px solid var(--color-border, #e5e7eb); border-radius: 12px; padding: .6rem; transition: .2s ease; background: #fff; }
        .related-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.07); }
        .related-card img { width: 100%; height: auto; border-radius: 8px; display: block; }
        .related-meta { display: grid; gap: .1rem; }
        .related-meta span { opacity: .75; font-size: .9rem; }

        @media (min-width: 980px) {
          .book-hero { grid-template-columns: 360px 1fr; align-items: start; }
          .book-cover { position: sticky; top: 6rem; }
        }
      `}</style>
    </article>
  )
}
