// src/app/feed.xml/route.ts
import { NextRequest } from 'next/server'
import { sanityClient } from '@/lib/sanity.client'
import { SITE_URL } from '@/lib/seo'

export const revalidate = 600;            // alle 10 Minuten neu generieren
export const dynamic = 'force-static';    // SSG

type FeedPost = {
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  _updatedAt?: string
}

const FEED_LIMIT = 50

const escapeXml = (s = '') =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const toRfc822 = (d?: string) =>
  d ? new Date(d).toUTCString() : new Date().toUTCString()

export async function GET(_req: NextRequest) {
  // Hole die letzten N Posts aus Sanity
  const query = `
    *[_type == "post"] | order(publishedAt desc) [0...$limit]{
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      _updatedAt
    }
  `
  const posts: FeedPost[] = await sanityClient.fetch(query, { limit: FEED_LIMIT })

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`
      const title = escapeXml(p.title || 'Beitrag')
      const desc = escapeXml(p.excerpt || '')
      const pub = toRfc822(p.publishedAt)
      const upd = toRfc822(p._updatedAt)

      return `
        <item>
          <title>${title}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${pub}</pubDate>
          <description>${desc}</description>
          <lastBuildDate>${upd}</lastBuildDate>
        </item>`
    })
    .join('\n')

  const now = new Date().toUTCString()
  const channel = `
    <channel>
      <title>Bruno Baumgartner – Blog</title>
      <link>${SITE_URL}</link>
      <description>Neue Beiträge von brainbloom.ch</description>
      <language>de-CH</language>
      <lastBuildDate>${now}</lastBuildDate>
      <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
      ${items}
    </channel>`

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    ${channel}
  </rss>`

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // ordentliche Caching-Header; Vercel kann das zusätzlich cachen
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
    },
  })
}
