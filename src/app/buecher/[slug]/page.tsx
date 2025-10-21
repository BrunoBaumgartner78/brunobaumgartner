import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllBooks, getBookBySlug } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'

export const revalidate = 600
type Params = { slug: string }

export async function generateStaticParams() {
  const books = await getAllBooks().catch(() => [])
  return books.map((b:any) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const b = await getBookBySlug(params.slug).catch(()=>null)
  if(!b) return { title: 'Buch nicht gefunden', alternates: { canonical: `/buecher/${params.slug}` } }
  const title = `${b.title} – Buch von Bruno Baumgartner`
  const desc = b.description || 'Buch von Bruno Baumgartner'
  const og = b.cover ? urlFor(b.cover).width(1200).height(630).fit('crop').url() : `${site}/og.png`
  return {
    title, description: desc, alternates: { canonical: `/buecher/${b.slug}` },
    openGraph: { type: 'book', url: `${site}/buecher/${b.slug}`, title, description: desc, images:[{url:og,width:1200,height:630,alt:title}] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [og] },
  }
}

export default async function BookPage({ params }: { params: Params }) {
  const b = await getBookBySlug(params.slug).catch(()=>null)
  if(!b) return notFound()

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const cover = b.cover ? urlFor(b.cover).width(1200).height(1600).fit('max').url() : undefined

  return (
    <article className="wrap site-main" aria-labelledby="book-title" style={{ display:'grid', gap:'1rem' }}>
      <h1 id="book-title">{b.title}</h1>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={b.cover.alt || b.title} style={{ maxWidth: 420, borderRadius: 12 }} />
      )}

      {b.publishedAt && (
        <p style={{ margin: 0, fontSize: 14, opacity: 0.75 }}>
          Erscheinungsdatum: {new Date(b.publishedAt).toLocaleDateString('de-CH')}
        </p>
      )}

      {b.isbn && <p style={{ margin: 0, fontSize: 14 }}>ISBN: {b.isbn}</p>}

      {b.description && <p style={{ marginTop: 8, maxWidth: 800 }}>{b.description}</p>}

      {b.buyUrl && (
        <p style={{ marginTop: 8 }}>
          <a className="button" href={b.buyUrl} target="_blank" rel="noopener noreferrer">Zum Buch / Verlag</a>
        </p>
      )}

      {/* JSON-LD: Book */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: b.title,
            isbn: b.isbn,
            image: cover,
            author: { '@type': 'Person', name: 'Bruno Baumgartner' },
            url: `${site}/buecher/${b.slug}`,
          }),
        }}
      />
    </article>
  )
}
