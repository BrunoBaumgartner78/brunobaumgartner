// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Portable } from '@/app/components/Portable'
import { getPostBySlug, getAllPosts } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'

export const revalidate = 300

// Next 15: params/searchParams sind Promises
type Props = {
  params: Promise<{ slug: string }>
}

// Static params für SSG
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Beitrag nicht gefunden' }

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const ogImg =
    post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
      : `${site}/og.png`

  return {
    title: post.title,
    description: post.excerpt || '',
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt || '',
      images: [ogImg],
    },
    twitter: { card: 'summary_large_image', images: [ogImg] },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return notFound()

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const cover =
    post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url()
      : null

  return (
    <article className="wrap grid gap-6" aria-labelledby="t">
      <header>
        <h1 id="t" className="h1" style={{ marginBottom: 6 }}>{post.title}</h1>
        {post.publishedAt && (
          <p className="text-muted" style={{ margin: 0 }}>
            {new Date(post.publishedAt).toLocaleDateString('de-CH')}
          </p>
        )}
        {post.excerpt && (
          <p style={{ marginTop: 8, maxWidth: 820 }}>{post.excerpt}</p>
        )}
      </header>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={post.mainImage?.alt || post.title}
          width={1200}
          height={630}
          style={{ width: '100%', height: 'auto', borderRadius: 12 }}
        />
      )}

      <Portable value={post.body} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.publishedAt,
            description: post.excerpt || '',
            image: cover || undefined,
            author: { '@type': 'Person', name: 'Bruno Baumgartner' },
            mainEntityOfPage: `${site}/blog/${post.slug}`,
          }),
        }}
      />
    </article>
  )
}
