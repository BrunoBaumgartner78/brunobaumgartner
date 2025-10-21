import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { getPostBySlug, getAllPosts } from '../../lib/queries'     // ggf. ../../../lib/queries
import { urlFor } from '../../lib/sanity.image'                    // ggf. ../../../lib/sanity.image

export const revalidate = 300
type Params = { slug: string }

export async function generateStaticParams() {
  const posts = await getAllPosts().catch(() => [])
  return posts.map((p: any) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const post = await getPostBySlug(params.slug).catch(() => null)
  if (!post) return { title: 'Beitrag nicht gefunden', alternates: { canonical: `/blog/${params.slug}` } }

  const title = post.title
  const desc = post.excerpt || 'Blogbeitrag von Bruno Baumgartner'
  const og = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url() : `${site}/og.png`

  return {
    title,
    description: desc,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: { type: 'article', url: `${site}/blog/${params.slug}`, title, description: desc, images: [{ url: og, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [og] },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const post = await getPostBySlug(params.slug).catch(() => null)
  if (!post) return notFound()

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const ogImg = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url() : undefined

  return (
    <article className="wrap prose" aria-labelledby="post-title">
      <h1 id="post-title">{post.title}</h1>

      {post.publishedAt && (
        <p className="text-sm text-muted" style={{ marginTop: 0 }}>
          {new Date(post.publishedAt).toLocaleDateString('de-CH')}
        </p>
      )}

      {post.mainImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlFor(post.mainImage).width(1200).height(600).fit('max').url()}
          alt={post.mainImage.alt || post.title}
          className="rounded-xl"
          loading="eager"
        />
      )}

      <PortableText value={post.body || []} />

      {/* JSON-LD: BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.publishedAt,
            description: post.excerpt || '',
            image: ogImg,
            author: { '@type': 'Person', name: 'Bruno Baumgartner' },
            mainEntityOfPage: `${site}/blog/${post.slug}`,
          }),
        }}
      />
      {/* JSON-LD: Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Blog', item: `${site}/blog` },
              { '@type': 'ListItem', position: 2, name: post.title, item: `${site}/blog/${post.slug}` },
            ],
          }),
        }}
      />
    </article>
  )
}
