import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGalleryItem, getGallery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'

// Wichtig: Default-Import statt { Portable }
import Portable from '@/app/components/Portable'

type Params = { slug: string }

export const revalidate = 600

export async function generateStaticParams() {
  const items = await getGallery(50)
  return items.map(it => ({ slug: it.slug }))
}

export default async function GalerieItemPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const item = await getGalleryItem(slug)
  if (!item) return notFound()

  const img = item.image ? urlFor(item.image).width(1600).height(1200).fit('max').url() : undefined

  return (
    <article className="wrap grid gap-4" aria-labelledby="t">
      <header>
        <h1 id="t" className="h1" style={{ margin: 0 }}>{item.title}</h1>
      </header>

      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={item.image?.alt || item.title}
          style={{ width: '100%', height: 'auto', borderRadius: 12 }}
          loading="lazy"
        />
      )}

      {item.caption && (
        <div className="prose">
          <Portable value={item.caption} />
        </div>
      )}

      <p>
        <Link href="/galerie" className="underline">← Zur Galerie</Link>
      </p>
    </article>
  )
}
