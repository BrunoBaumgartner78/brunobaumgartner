// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server'
import groq from 'groq'
import { sanityClient } from '@/lib/sanity.client'

export const revalidate = 600

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'

  const urls: Array<{ loc: string; lastmod?: string }> = []

  try {
    const posts = await sanityClient.fetch<Array<{ slug: { current: string }, _updatedAt?: string }>>(
      groq`*[_type == "post" && defined(slug.current)]{ "slug": slug, _updatedAt }`
    )
    posts?.forEach(p => {
      if (p?.slug?.current) {
        urls.push({ loc: `${site}/blog/${p.slug.current}`, lastmod: p._updatedAt })
      }
    })

    const books = await sanityClient.fetch<Array<{ slug: { current: string }, _updatedAt?: string }>>(
      groq`*[_type == "book" && defined(slug.current)]{ "slug": slug, _updatedAt }`
    )
    books?.forEach(b => {
      if (b?.slug?.current) {
        urls.push({ loc: `${site}/buecher/${b.slug.current}`, lastmod: b._updatedAt })
      }
    })

    const gallery = await sanityClient.fetch<Array<{ slug: { current: string }, _updatedAt?: string }>>(
      groq`*[_type == "galleryImage" && defined(slug.current)]{ "slug": slug, _updatedAt }`
    )
    gallery?.forEach(g => {
      if (g?.slug?.current) {
        urls.push({ loc: `${site}/galerie/${g.slug.current}`, lastmod: g._updatedAt })
      }
    })
  } catch (e) {
    // Falls ENV fehlt oder Sanity down ist → wir liefern nur die statischen Routen
    console.warn('sitemap fallback (no Sanity data):', e)
  }

  const staticRoutes = ['', '/blog', '/buecher', '/galerie', '/impressum'].map(p => ({
    loc: `${site}${p}`,
  }))

  const all = [...staticRoutes, ...urls]

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    all
      .map(
        u =>
          `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}</url>`
      )
      .join('\n') +
    `\n</urlset>`

  return new NextResponse(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  })
}
