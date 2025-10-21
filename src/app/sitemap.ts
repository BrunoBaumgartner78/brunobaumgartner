import type { MetadataRoute } from 'next'
import { getAllPosts, getAllBooks } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  const items: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${site}/blog`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${site}/galerie`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${site}/buecher`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${site}/impressum`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site}/datenschutz`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const [posts, books] = await Promise.all([
    getAllPosts().catch(()=>[]),
    getAllBooks().catch(()=>[]),
  ])

  posts.forEach((p:any)=> items.push({
    url: `${site}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  books.forEach((b:any)=> items.push({
    url: `${site}/buecher/${b.slug}`,
    lastModified: b.publishedAt ? new Date(b.publishedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return items
}
