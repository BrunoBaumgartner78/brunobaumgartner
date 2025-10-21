// src/app/galerie/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGalleryItem, getGallery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import Portable from '@/app/components/Portable'
import { absUrl, SITE_TAGLINE } from '@/lib/seo'

type Params = { slug: string }

export const revalidate = 600

export async function generateStaticParams() {
  const items = await getGallery(50)
  return items.map(it => ({ slug: it.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const item = await getGalleryItem(slug)

  const title = item?.title ? `${item.title} – Galerie` : 'Galerie'
  const desc =
    (item?.image?.alt as string | undefined) ||
    item?.title ||
    'Bild aus der Galerie'

  // Einheitlicher sandfarbener OG mit Tagline
  const ogUrl = absUrl(
    `/og?title=${encodeURIComponent(item?.title || 'Galerie')}` +
    `&subtitle=${encodeURIComponent(SITE_TAGLINE)}`
  )

  return {
    title,
    description: desc,
    alternates: { canonical: `/galerie/${slug}` },
    openGraph: {
      type: 'article',
      url: absUrl(`/galerie/${slug}`),
      title,
      description: desc,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: `${item?.title || 'Galerie'} – Brainbloom` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogUrl],
    },
  }
}

export default async function GalerieItemPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const item = await getGalleryItem(slug)
  if (!item) return notFound()

  const img =
    item.image
      ? urlFor(item.image).width(1600).height(1200).fit('max').url()
      : undefined

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

      {/* JSON-LD: Bild/CreativeWork */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageObject',
            name: item.title,
            url: absUrl(`/galerie/${slug}`),
            contentUrl: img || undefined,
            caption: (item.image?.alt as string | undefined) || item.title,
          }),
        }}
      />
    </article>
  )
}
