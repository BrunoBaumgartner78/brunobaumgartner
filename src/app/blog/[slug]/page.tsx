import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getPostBySlug, getAllPosts } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'

// Next 15: params als Promise typisieren
type Params = { slug: string }

export const revalidate = 300

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export default async function BlogPostPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return notFound()

  const og = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
    : undefined

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

      {post.mainImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlFor(post.mainImage).width(1280).height(720).fit('crop').url()}
          alt={post.mainImage.alt || post.title}
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
            datePublished: post.publishedAt,
            description: post.excerpt || '',
            image: og,
            author: { '@type': 'Person', name: 'Bruno Baumgartner' },
            mainEntityOfPage: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'}/blog/${post.slug}`,
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
  if (!post) return { title: 'Beitrag nicht gefunden' }

  const og = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt || undefined,
      images: og ? [og] : undefined,
    },
  }
}
