import Link from 'next/link'
import { getAllBooks } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'

export const revalidate = 600

export default async function BooksIndex() {
  const books = await getAllBooks()
  return (
    <div className="wrap site-main" style={{ display: 'grid', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem' }}>Bücher</h1>
      <ul
        style={{
          listStyle: 'none', padding: 0,
          display: 'grid', gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        }}
      >
        {books.map((b) => (
          <li key={b._id} className="card" style={{ border: '1px solid var(--color-border,#e5e7eb)', borderRadius: 12, padding: 16 }}>
            <Link href={`/buecher/${b.slug}`} className="no-underline">
              {b.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(b.cover).width(720).height(1080).fit('cover').url()}
                  alt={b.cover.alt || b.title}
                  style={{ width: '100%', height: 'auto', borderRadius: 10, marginBottom: 8 }}
                  loading="lazy"
                />
              )}
              <h2 style={{ fontSize: '1.125rem', margin: '0 0 4px' }}>{b.title}</h2>
              {b.publishedAt && (
                <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
                  {new Date(b.publishedAt).toLocaleDateString('de-CH')}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
