import Link from 'next/link'
import { getAllPosts } from '../../lib/queries' // alternativ: '../../lib/queries'
import { urlFor } from '../../lib/sanity.image' // alternativ: '../../lib/sanity.image'

export const revalidate = 600

export default async function BlogIndex() {
  const posts = await getAllPosts()

  return (
    <div className="wrap" style={{ display: 'grid', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem' }}>Blog</h1>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {posts.map((post) => (
          <li key={post._id} style={{ border: '1px solid var(--color-border, #e5e7eb)', borderRadius: 12, padding: 16 }}>
            <article>
              {post.mainImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={urlFor(post.mainImage).width(800).height(420).fit('crop').url()}
                  alt={post.mainImage.alt || post.title}
                  style={{ width: '100%', height: 'auto', borderRadius: 10, marginBottom: 12 }}
                  loading="lazy"
                />
              )}
              <h2 style={{ fontSize: '1.125rem', margin: '0 0 6px' }}>
                <Link href={`/blog/${post.slug}`} className="no-underline">
                  {post.title}
                </Link>
              </h2>
              {post.publishedAt && (
                <p style={{ margin: '0 0 8px', fontSize: 12, opacity: 0.7 }}>
                  {new Date(post.publishedAt).toLocaleDateString('de-CH')}
                </p>
              )}
              {post.excerpt && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{post.excerpt}</p>}
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
