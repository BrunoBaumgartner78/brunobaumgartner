import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBookBySlug, getAllBooks } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'

type Params = { slug: string }

export const revalidate = 600

export async function generateStaticParams() {
  const books = await getAllBooks()
  return books.map(b => ({ slug: b.slug }))
}

export default async function BookPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) return notFound()

  const cover =
    book.cover ? urlFor(book.cover).width(1200).height(1600).fit('crop').url() : undefined

  return (
    <article className="wrap grid gap-6" aria-labelledby="t">
      <header className="grid gap-2">
        <h1 id="t" className="h1" style={{ margin: 0 }}>{book.title}</h1>
        {book.publishedAt && (
          <p className="text-muted" style={{ margin: 0 }}>
            {new Date(book.publishedAt).toLocaleDateString('de-CH')}
          </p>
        )}
      </header>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={book.cover?.alt || book.title}
          style={{ width: '100%', height: 'auto', borderRadius: 12 }}
          loading="lazy"
        />
      )}

      {book.description && (
        <p style={{ margin: 0, maxWidth: 820 }}>{book.description}</p>
      )}

      <div className="grid gap-2">
        {book.isbn && <p style={{ margin: 0 }}><strong>ISBN:</strong> {book.isbn}</p>}
        {book.buyUrl && (
          <p style={{ margin: 0 }}>
            <a className="underline" href={book.buyUrl} target="_blank" rel="noopener noreferrer">
              Buch kaufen
            </a>
          </p>
        )}
      </div>

      <p>
        <Link href="/buecher" className="underline">← Alle Bücher</Link>
      </p>

      {/* JSON-LD für SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: book.title,
            datePublished: book.publishedAt,
            image: cover,
            isbn: book.isbn,
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'}/buecher/${book.slug}`,
            author: { '@type': 'Person', name: 'Bruno Baumgartner' },
          }),
        }}
      />
    </article>
  )
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) return { title: 'Buch nicht gefunden' }

  const cover =
    book.cover ? urlFor(book.cover).width(1200).height(630).fit('crop').url() : undefined

  return {
    title: book.title,
    description: book.description || undefined,
    alternates: { canonical: `/buecher/${book.slug}` },
    openGraph: {
      type: 'book',
      url: `/buecher/${book.slug}`,
      title: book.title,
      description: book.description || undefined,
      images: cover ? [cover] : undefined,
    },
  }
}
