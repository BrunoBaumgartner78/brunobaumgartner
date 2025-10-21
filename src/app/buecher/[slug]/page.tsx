import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBookBySlug, getAllBooks } from '../../../lib/queries'
import { urlFor } from '../../../lib/sanity.image'

export const revalidate = 600

export async function generateStaticParams() {
  const all = await getAllBooks().catch(() => [])
  return all.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const book = await getBookBySlug(params.slug).catch(() => null)
  const title = book?.title ?? 'Buch'
  const img = book?.cover ? urlFor(book.cover).width(1200).height(630).fit('crop').url() : '/og.png'
  return {
    title: `${title} – Buch`,
    openGraph: { images: [img] },
    alternates: { canonical: `/buecher/${params.slug}` },
  }
}

export default async function BookPage({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug)
  if (!book) return notFound()

  return (
    <article className="wrap grid gap-6" aria-labelledby="t">
      <nav aria-label="Brotkrumen">
        <Link className="underline" href="/buecher">← Alle Bücher</Link>
      </nav>

      <header>
        <h1 id="t" className="h1">{book.title}</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-[280px,1fr]">
        {book.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={urlFor(book.cover).width(800).height(1200).fit('crop').url()}
            alt={book.title}
            className="rounded w-full h-auto"
          />
        )}

        <div className="grid gap-3">
          {book.publishedAt && <p className="text-sm text-muted">Erschienen: {new Date(book.publishedAt).toLocaleDateString('de-CH')}</p>}
          {book.isbn && <p className="text-sm">ISBN: {book.isbn}</p>}
          {book.description && <p>{book.description}</p>}
          {book.buyUrl && (
            <p>
              <a className="btn" href={book.buyUrl} target="_blank" rel="noreferrer">Jetzt kaufen</a>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
