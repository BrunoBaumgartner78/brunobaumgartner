import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/queries'

export const revalidate = 600

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const posts = await getAllPosts().catch(() => [])
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Bruno Baumgartner – Blog</title>
  <link>${site}</link>
  <description>Neueste Beiträge</description>
  ${posts.map((p:any)=>`
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site}/blog/${p.slug}</link>
      <guid>${site}/blog/${p.slug}</guid>
      <pubDate>${p.publishedAt ? new Date(p.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt || ''}]]></description>
    </item>`).join('')}
</channel>
</rss>`
  return new NextResponse(rss, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}

function escapeXml(s:string){return s?.replace(/[<>&'"]/g,c=>({ '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;' }[c] as string)) ?? '' }
