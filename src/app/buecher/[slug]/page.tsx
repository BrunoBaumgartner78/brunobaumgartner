// src/app/buecher/[slug]/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBook, getBookSlugs } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'

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
    ? urlFor(book.cover).width(1200).height(1600).fit('min').quality(80).url()
    : null

  const shopUrl: string | undefined =
    book.shopUrl ||
    book.buyLinks?.find((b: any) => !!b?.url)?.url

  return (
    <article className="wrap grid gap-6 md:gap-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm opacity-75">
        <Link href="/buecher" className="underline hover:no-underline">
          Bücher
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{book.title}</span>
      </nav>

      {/* Titelbereich */}
      <header className="grid gap-2">
        <h1 className="h1 m-0">{book.title}</h1>
        {book.subtitle && <p className="text-muted m-0">{book.subtitle}</p>}

        {/* Meta-Zeile */}
        <p className="m-0 text-sm opacity-75 flex flex-wrap gap-x-4 gap-y-1">
          {book.year && <span>Jahr: {book.year}</span>}
          {book.pages && <span>Seiten: {book.pages}</span>}
          {book.isbn && <span>ISBN: {book.isbn}</span>}
          {book.publisher && <span>Verlag: {book.publisher}</span>}
          {book.language && <span>Sprache: {book.language}</span>}
        </p>
      </header>

      {/* Layout: mobil untereinander, ab md nebeneinander mit schmalem Bild */}
      <section className="grid gap-6 md:flex md:items-start md:gap-10">
        {/* Cover (mobil: vor Text; desktop: schmal) */}
        <div className="w-full md:w-[36%] lg:w-[32%] xl:w-[28%]">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={book.cover?.alt || book.title}
              className="block w-full h-auto rounded-xl shadow-sm border object-cover"
              loading="lazy"
            />
          ) : (
            <div className="aspect-[3/4] w-full rounded-xl border grid place-items-center text-sm opacity-60">
              Kein Cover vorhanden
            </div>
          )}
        </div>

        {/* Text + Aktionen (nimmt restliche Breite) */}
        <div className="grid gap-5 md:flex-1">
          {/* Beschreibung – genau einmal */}
          {book.description && (
            <div className="prose max-w-none">
              <p>{book.description}</p>
            </div>
          )}

          {/* Shop / CTA */}
          <div className="flex flex-wrap gap-3">
            {shopUrl && (
              <a
                href={shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md px-4 py-2 border bg-black text-white hover:bg-neutral-800 transition"
                aria-label="Zum Shop (extern)"
              >
                Zum Shop
              </a>
            )}
            {Array.isArray(book.buyLinks) && book.buyLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.buyLinks
                  .filter((b: any) => b?.url && (!shopUrl || b.url !== shopUrl))
                  .map((b: any) => (
                    <a
                      key={`${b.label}-${b.url}`}
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md px-3 py-1.5 border hover:bg-neutral-50 transition"
                      aria-label={`Kaufen bei ${b.label || 'weiterer Händler'} (extern)`}
                    >
                      {b.label || 'Weitere Händler'}
                    </a>
                  ))}
              </div>
            )}
          </div>

          {/* Tags */}
          {Array.isArray(book.tags) && book.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
              {book.tags.map((t: string) => (
                <li
                  key={t}
                  className="text-xs rounded-full px-2 py-1 border bg-neutral-50"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Strukturierte Daten */}
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
              ? {
                  '@type': 'Offer',
                  url: shopUrl,
                  availability: 'https://schema.org/InStock',
                }
              : undefined,
            description: book.description || undefined,
          }),
        }}
      />
    </article>
  )
}
