import Link from 'next/link'
import { getAllBooks } from '../../lib/queries'
import { urlFor } from '../../lib/sanity.image'

export const revalidate = 600

export default async function BooksPage() {
  const books = await getAllBooks().catch(() => [])
  return (
    <section className="wrap grid gap-6" aria-labelledby="t">
      <h1 id="t" className="h1">Bücher</h1>

      {!books?.length && <p className="text-muted">Noch keine Bücher veröffentlicht.</p>}

      <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {books.map((b) => (
          <li key={b._id} className="card p-3">
            <Link href={`/buecher/${b.slug}`} className="block no-underline hover:underline">
              {b.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(b.cover).width(600).height(900).fit('crop').url()}
                  alt={b.title}
                  className="w-full h-auto rounded mb-2"
                  loading="lazy"
                />
              )}
              <div className="text-sm font-medium">{b.title}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
