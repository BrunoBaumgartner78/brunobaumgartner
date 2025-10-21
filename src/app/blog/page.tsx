import Link from 'next/link'
import { getRecentPosts } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import s from './page.module.css'

export const revalidate = 600

export default async function BlogPage(){
  const posts = await getRecentPosts(12)

  return (
    <div className="wrap">
      <h1 className="h1" style={{marginBottom: '1rem'}}>Blog</h1>

      <ul className={s.grid} style={{listStyle:'none', padding:0, margin:0}}>
        {posts.map((post:any) => {
          const img = post?.mainImage
            ? urlFor(post.mainImage).width(800).height(420).fit('crop').url()
            : null

          return (
            <li key={post._id} className={s.card}>
              <article>
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={post.mainImage?.alt || post.title} className={s.thumb} loading="lazy" />
                )}

                <h2 className={s.title}>
                  <Link href={`/blog/${post.slug}`} style={{textDecoration:'none'}}>
                    {post.title || 'Ohne Titel'}
                  </Link>
                </h2>

                {post.publishedAt && (
                  <p className={s.meta}>
                    {new Date(post.publishedAt).toLocaleDateString('de-CH')}
                  </p>
                )}

                {post.excerpt && (
                  <p className={s.excerpt}>{post.excerpt}</p>
                )}
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
