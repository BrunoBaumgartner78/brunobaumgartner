import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBook, getBookSlugs } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import s from './page.module.css'

export const revalidate = 600

export async function generateStaticParams() {
  const slugs = await getBookSlugs()
  return slugs?.map((s: { slug: string }) => ({ slug: s.slug })) ?? []
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const book = await getBook(slug)
  const title = book?.title ? `${book.title} – Buch` : 'Buch'
  const desc = book?.description?.slice(0, 160)
  const og = book?.cover
    ? [urlFor(book.cover).width(1200).height(630).fit('crop').url()]
    : undefined

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: og },
    alternates: { canonical: `/buecher/${slug}` },
  }
}

export default async function BookPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const book = await getBook(slug)
  if (!book) return notFound()

  const imgSrc = book.cover
    ? urlFor(book.cover).width(900).height(1200).fit('min').quality(80).url()
    : null

  const shopUrl: string | undefined =
    (book as any).shopUrl || book.buyLinks?.find((b: any) => !!b?.url)?.url

  return (
    <article className={`wrap ${s.page}`}>
      <nav aria-label="Breadcrumb" className={s.crumbs}>
        <Link href="/buecher" className={s.link}>Bücher</Link>
        <span aria-hidden="true"> / </span>
        <span className={s.muted}>{book.title}</span>
      </nav>

      <header className={s.head}>
        <h1 className={s.title}>{book.title}</h1>
        {book.subtitle && <p className={s.subtitle}>{book.subtitle}</p>}
      </header>

      <section className={s.detail}>
        <div className={s.cover}>
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={(book as any)?.cover?.alt || book.title}
              loading="lazy"
            />
          ) : (
            <div className={s.coverFallback}>Kein Cover</div>
          )}
        </div>

        <div className={s.content}>
          {book.description && <p className={s.desc}>{book.description}</p>}

          <div className={s.cta}>
            {shopUrl && (
              <a
                href={shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.btn} ${s.btnPrimary}`}
              >
                Zum Shop
              </a>
            )}
            {Array.isArray(book.buyLinks) && book.buyLinks.length > 0 && (
              <div className={s.more}>
                {book.buyLinks
                  .filter((b: any) => b?.url && (!shopUrl || b.url !== shopUrl))
                  .map((b: any) => (
                    <a
                      key={`${b.label}-${b.url}`}
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${s.btn} ${s.btnGhost}`}
                    >
                      {b.label || 'Weitere Händler'}
                    </a>
                  ))}
              </div>
            )}
          </div>

          {(book.isbn || book.publisher || book.year || book.pages || book.language) && (
            <dl className={s.meta}>
              {book.isbn && (<><dt>ISBN</dt><dd>{book.isbn}</dd></>)}
              {book.publisher && (<><dt>Verlag</dt><dd>{book.publisher}</dd></>)}
              {book.year && (<><dt>Jahr</dt><dd>{book.year}</dd></>)}
              {book.pages && (<><dt>Seiten</dt><dd>{book.pages}</dd></>)}
              {book.language && (<><dt>Sprache</dt><dd>{book.language}</dd></>)}
            </dl>
          )}

          {Array.isArray(book.tags) && book.tags.length > 0 && (
            <ul className={s.tags}>
              {book.tags.map((t: string) => (
                <li key={t} className={s.tag}>{t}</li>
              ))}
            </ul>
          )}

          <div className={s.back}>
            <Link href="/buecher" className={s.link}>← Zur Übersicht</Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: book.title,
            url: `/buecher/${book.slug}`,
            image: imgSrc || undefined,
            isbn: book.isbn || undefined,
            inLanguage: book.language || undefined,
            numberOfPages: book.pages || undefined,
            datePublished: book.year || undefined,
            publisher: book.publisher
              ? { '@type': 'Organization', name: book.publisher }
              : undefined,
            offers: shopUrl
              ? { '@type': 'Offer', url: shopUrl, availability: 'https://schema.org/InStock' }
              : undefined,
            description: book.description || undefined,
          }),
        }}
      />
    </article>
  )
}
