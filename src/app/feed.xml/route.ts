import { getAllPosts } from '../../lib/queries'

export const revalidate = 600

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const posts = await getAllPosts().catch(() => [])

  const items = posts.map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${site}/blog/${p.slug}</link>
      <guid isPermaLink="true">${site}/blog/${p.slug}</guid>
      <pubDate>${p.publishedAt ? new Date(p.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt || ''}]]></description>
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>brainbloom.ch – Blog</title>
      <link>${site}</link>
      <description>Neue Beiträge von Bruno Baumgartner</description>
      ${items}
    </channel>
  </rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
