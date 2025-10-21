// src/app/buecher/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBook, getBooks } from '@/lib/queries'      // falls kein @-Alias: ../../lib/queries
import { urlFor } from '@/lib/sanity.image'            // falls kein @-Alias: ../../lib/sanity.image'

export const revalidate = 600

type RouteParams = { slug: string }

export async function generateMetadata(
  { params }: { params: Promise<RouteParams> }
): Promise<Metadata> {
  const { slug } = await params
  const book = await getBook(slug).catch(() => null as any)
  if (!book) {
    return { title: 'Buch nicht gefunden – Bruno Baumgartner' }
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const canonical = `${site}/buecher/${book.slug}`
  const image = book.cover ? urlFor(book.cover).width(1200).height(630).fit('crop').url() : `${site}/og.png`

  return {
    title: `${book.title} – Buch`,
    description: book.description || book.subtitle || 'Buch von Bruno Baumgartner',
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: `${book.title} – Buch`,
      description: book.description || book.subtitle || 'Buch von Bruno Baumgartner',
      images: [image],
      type: 'book',
    },
    twitter: { card: 'summary_large_image', images: [image] },
  }
}

export default async function BookPage(
  { params }: { params: Promise<RouteParams> }
) {
  const { slug } = await params
  const b = await getBook(slug).catch(() => null as any)
  if (!b) return notFound()

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const pageUrl = `${site}/buecher/${b.slug}`

  // „Verwandte“: nimm die ersten 3 anderen Bücher
  const all = await getBooks(12).catch(() => [] as any[])
  const related = (all || []).filter((x) => x.slug !== b.slug).slice(0, 3)

  return (
    <article className="wrap" aria-labelledby="book-title" style={{ display: 'grid', gap: '2rem' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Brotkrumen" className="breadcrumbs">
        <ol>
          <li><Link href="/">Start</Link></li>
          <li><Link href="/buecher">Bücher</Link></li>
          <li aria-current="page">{b.title}</li>
        </ol>
      </nav>

      {/* Hero: Cover + Meta */}
      <header className="book-hero">
        <div className="book-cover">
          {b.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlFor(b.cover).width(900).height(1300).fit('crop').quality(85).url()}
              alt={b.cover.alt || b.title}
              width={900}
              height={1300}
              loading="eager"
            />
          )}
        </div>

        <div className="book-meta">
          <h1 id="book-title" className="h1">{b.title}</h1>
          {b.subtitle && <p className="subtitle">{b.subtitle}</p>}

          {/* Chips */}
          <div className="chips">
            {b.year && <span className="chip" aria-label="Erscheinungsjahr">{b.year}</span>}
            {b.pages && <span className="chip" aria-label="Seitenzahl">{b.pages} S.</span>}
            {b.isbn && <span className="chip" aria-label="ISBN">ISBN {b.isbn}</span>}
          </div>

          {/* Kurzbeschreibung */}
          {b.description && <p className="lead">{b.description}</p>}

          {/* Kauf-/Externe Links (wenn vorhanden) */}
          {!!(Array.isArray(b.buyLinks) && b.buyLinks.length) && (
            <div className="buy">
              {b.buyLinks.map((l: any, i: number) => (
                <a key={i} className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.label || 'Jetzt kaufen'}
                </a>
              ))}
            </div>
          )}

          {/* Teilen */}
          <div className="share">
            <span>Teilen:</span>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(b.title)}`}
              target="_blank" rel="noopener noreferrer"
            >X/Twitter</a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
              target="_blank" rel="noopener noreferrer"
            >Facebook</a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
              target="_blank" rel="noopener noreferrer"
            >LinkedIn</a>
          </div>
        </div>
      </header>

      {/* Inhalt */}
      <section className="book-body" aria-labelledby="inhalt">
        <h2 id="inhalt" className="visually-hidden">Inhalt</h2>

        {/* Leseprobe / Langtext (sofern vorhanden) */}
        {b.longDescription ? (
          <div className="prose">{b.longDescription}</div>
        ) : (
          b.description && <div className="prose"><p>{b.description}</p></div>
        )}

        {/* Inhaltsverzeichnis (optional) */}
        {!!(Array.isArray(b.toc) && b.toc.length) && (
          <div className="toc">
            <h3>Inhaltsverzeichnis</h3>
            <ol>
              {b.toc.map((t: any, i: number) => <li key={i}>{t}</li>)}
            </ol>
          </div>
        )}

        {/* Zusatz-Metadaten */}
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

      {/* Verwandte Bücher */}
      {!!related.length && (
        <section aria-labelledby="related">
          <h2 id="related" className="h2">Verwandte Bücher</h2>
          <ul className="related-grid" aria-label="Weitere Bücher">
            {related.map((r: any) => (
              <li key={r._id}>
                <Link href={`/buecher/${r.slug}`} className="related-card" aria-label={`${r.title} öffnen`}>
                  {r.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={urlFor(r.cover).width(600).height(850).fit('crop').quality(80).url()}
                      alt={r.cover.alt || r.title}
                      width={600} height={850} loading="lazy"
                    />
                  )}
                  <div className="related-meta">
                    <strong>{r.title}</strong>
                    {r.subtitle && <span>{r.subtitle}</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* JSON-LD für Book */}
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
            image: b.cover ? urlFor(b.cover).width(1200).height(1600).fit('crop').url() : undefined,
            url: pageUrl,
            author: { '@type': 'Person', name: 'Bruno Baumgartner' },
            publisher: b.publisher ? { '@type': 'Organization', name: b.publisher } : undefined,
          }),
        }}
      />

      {/* Seite-spezifisches CSS */}
      <style>{`
        .breadcrumbs ol {
          list-style: none; padding: 0; margin: 0; display: flex; gap: .5rem; flex-wrap: wrap; font-size: .9rem;
        }
        .breadcrumbs li + li::before { content: "›"; opacity: .6; margin: 0 .25rem; }

        .book-hero {
          display: grid; gap: 1.25rem;
          grid-template-columns: 1fr;
        }
        .book-cover img {
          width: 100%; height: auto; border-radius: 14px; display: block; box-shadow: 0 8px 30px rgba(0,0,0,.08);
        }
        .book-meta { display: grid; gap: .75rem; align-content: start; }
        .subtitle { margin: 0; opacity: .85; font-size: 1.05rem; }
        .chips { display: flex; flex-wrap: wrap; gap: .5rem; }
        .chip {
          padding: .3rem .55rem; border: 1px solid var(--color-border, #e5e7eb);
          border-radius: 999px; font-size: .85rem; background: var(--chip-bg, #fff);
        }
        .lead { margin-top: .25rem; font-size: 1.05rem; line-height: 1.6; }
        .buy { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: .25rem; }
        .btn {
          display: inline-block; padding: .55rem .8rem; border-radius: 10px;
          border: 1px solid var(--color-border, #e5e7eb); text-decoration: none;
          transition: .2s ease; background: #fff;
        }
        .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0,0,0,.06); }

        .share { display: flex; align-items: center; gap: .6rem; font-size: .9rem; opacity: .9; }
        .share a { text-decoration: underline; text-underline-offset: 3px; }

        .book-body { display: grid; gap: 1.5rem; }
        .prose p { margin: 0 0 .9rem 0; line-height: 1.75; }
        .toc { border-top: 1px solid var(--color-border, #e5e7eb); padding-top: 1rem; }
        .toc ol { padding-left: 1.1rem; }
        .details {
          display: grid; grid-template-columns: max-content 1fr; gap: .4rem 1rem;
          border-top: 1px solid var(--color-border, #e5e7eb); padding-top: 1rem;
        }
        .details dt { opacity: .7; }
        .details .tags { display: flex; gap: .4rem; flex-wrap: wrap; }
        .tag {
          background: #f3f4f6; color: #111827; padding: .25rem .5rem; border-radius: .5rem; font-size: .85rem;
        }

        .related-grid {
          list-style: none; padding: 0; margin: .5rem 0 0 0;
          display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        .related-card {
          display: grid; gap: .5rem; text-decoration: none; color: inherit;
          border: 1px solid var(--color-border, #e5e7eb); border-radius: 12px; padding: .6rem;
          transition: .2s ease; background: #fff;
        }
        .related-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.07); }
        .related-card img { width: 100%; height: auto; border-radius: 8px; display: block; }
        .related-meta { display: grid; gap: .1rem; }
        .related-meta span { opacity: .75; font-size: .9rem; }

        /* Desktop: Cover sticky links, Text rechts */
        @media (min-width: 980px) {
          .book-hero {
            grid-template-columns: 360px 1fr; align-items: start;
          }
          .book-cover { position: sticky; top: 6rem; }
        }
      `}</style>
    </article>
  )
}
