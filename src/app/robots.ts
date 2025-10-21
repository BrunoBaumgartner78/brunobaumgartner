﻿import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/studio', '/studio/*'] }],
    sitemap: `${site}/sitemap.xml`,
  }
}
