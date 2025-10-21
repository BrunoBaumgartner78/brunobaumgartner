// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getPostBySlug, getAllPosts } from '@/lib/queries'
import { absUrl, ogTemplate } from '@/lib/seo'

// Next 15: params als Promise typisieren
type Params = { slug: string }

export const revalidate = 300

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p: { slug: string }) => ({ slug: p.slug }))
}

export default async function BlogPostPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return notFound()

  return (
    <article className="wrap grid gap-6" aria-labelledby="t">
      <header className="grid gap-2">
        <h1 id="t" className="h1" style={{ margin: 0 }}>{post.title}</h1>

        {post.publishedAt && (
          <p className="text-muted" style={{ margin: 0 }}>
            {new Date(post.publishedAt).toLocaleDateString('de-CH')}
          </p>
        )}

        {post.excerpt && (
          <p style={{ margin: 0, maxWidth: 820 }}>{post.excerpt}</p>
        )}
      </header>

      {/* Hauptbild (optional). Für OG verwenden wir unten bewusst das Brand-OG. */}
      {post.mainImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={
            // 1280×720 für Content-Ansicht, nicht OG
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore – urlFor wird projektweit bereitgestellt
            (await import('@/lib/sanity.image')).urlFor(post.mainImage)
              .width(1280).height(720).fit('crop').url()
          }
          alt={post.mainImage?.alt || post.title}
          style={{ width: '100%', height: 'auto', borderRadius: 12 }}
          loading="lazy"
        />
      )}

      <div className="prose">
        <PortableText value={post.body} />
      </div>

      {/* JSON-LD für SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.publishedAt || undefined,
            description: post.excerpt || undefined,
            // Einheitliches Brand-OG mit Claim:
            image: ogTemplate(post.title),
            author: { '@type': 'Person', name: 'Bruno Baumgartner' },
            mainEntityOfPage: absUrl(`/blog/${post.slug}`),
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
  const post = await getPostBySlug(slug)
  if (!post) {
    return {
      title: 'Beitrag nicht gefunden',
      robots: { index: false, follow: false },
    }
  }

  const title = post.title
  const description = post.excerpt || undefined
  const canonical = `/blog/${post.slug}`
  const og = ogTemplate(post.title) // sandfarbener Hintergrund + Claim

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: absUrl(canonical),
      title,
      description,
      images: [{ url: og, width: 1200, height: 630, alt: `${title} – Brainbloom` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [og],
    },
  }
}
