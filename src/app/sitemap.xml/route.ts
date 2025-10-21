// app/sitemap.xml/route.ts
import { NextRequest } from 'next/server'
import { getAllPosts, getAllBooks, getGallery } from '@/lib/queries' // <-- Alias!

export const revalidate = 600
export const dynamic = 'force-static'

type UrlItem = { loc: string; lastmod?: string | Date }

export async function GET(_req: NextRequest) {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
    'https://brunobaumgartner.vercel.app'

  const [posts, books, gallery] = await Promise.all([
    getAllPosts().catch(() => [] as any[]),
    getAllBooks?.().catch?.(() => [] as any[]) ?? Promise.resolve([] as any[]),
    getGallery(100).catch(() => [] as any[]),
  ])

  const urls: UrlItem[] = [
    { loc: `${site}/` },
    { loc: `${site}/blog` },
    { loc: `${site}/buecher` },
    { loc: `${site}/galerie` },
    { loc: `${site}/impressum` },
    { loc: `${site}/datenschutz` },
  ]

  for (const p of posts ?? []) {
    if (!p?.slug) continue
    urls.push({ loc: `${site}/blog/${p.slug}`, lastmod: p.publishedAt || p._updatedAt || p._createdAt })
  }
  for (const b of books ?? []) {
    if (!b?.slug) continue
    urls.push({ loc: `${site}/buecher/${b.slug}`, lastmod: b.publishedAt || b._updatedAt || b._createdAt })
  }
  for (const g of gallery ?? []) {
    if (!g?.slug) continue
    urls.push({ loc: `${site}/galerie/${g.slug}`, lastmod: g.publishedAt || g._updatedAt || g._createdAt })
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const last = u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''
        return `<url><loc>${u.loc}</loc>${last}</url>`
      })
      .join('\n') +
    `\n</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=86400',
    },
  })
}
