// src/app/galerie/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// Verwende RELATIVE Importe, um Alias-Probleme zu vermeiden:
import { getGalleryItem, getGallerySlugs } from '../../lib/queries'
import { urlFor } from '../../lib/sanity.image'

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getGallerySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const item = await getGalleryItem(params.slug)
  if (!item) return { title: 'Bild nicht gefunden' }

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const og = item.image ? urlFor(item.image).width(1200).height(630).fit('crop').url() : '/og.png'

  return {
    title: item.title || 'Galerie',
    description: item.caption || 'Bild aus der Galerie',
    alternates: { canonical: `/galerie/${params.slug}` },
    openGraph: {
      type: 'article',
      url: `${site}/galerie/${params.slug}`,
      title: item.title || 'Galerie',
      description: item.caption || 'Bild aus der Galerie',
      images: [og],
    },
  }
}

export default async function GalerieItemPage({ params }: { params: { slug: string } }) {
  const item = await getGalleryItem(params.slug)
  if (!item) return notFound()

  return (
    <article className="grid gap-4" aria-labelledby="t">
      <nav aria-label="Brotkrumen" className="text-sm opacity-80">
        <Link className="underline" href="/galerie">Galerie</Link> /{' '}
        <span>{item.title || 'Bild'}</span>
      </nav>

      <h1 id="t" style={{ fontSize: '1.5rem', margin: 0 }}>{item.title || 'Bild'}</h1>

      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlFor(item.image).width(1600).height(2200).fit('crop').url()}
          alt={(item as any)?.image?.alt || item.title || 'Galeriebild'}
          style={{ width: '100%', height: 'auto', borderRadius: 12 }}
          loading="lazy"
        />
      )}

      {item.caption && (
        <p style={{ marginTop: 8, opacity: .85 }}>{item.caption}</p>
      )}
    </article>
  )
}
