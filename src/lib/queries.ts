// src/lib/queries.ts
import { sanityClient } from '@/lib/sanity.client'

// ---------- POSTS ----------

export async function getRecentPosts(limit = 5) {
  const query = /* groq */ `
    *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
      | order(coalesce(publishedAt, _createdAt) desc) [0...$limit]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage,
        publishedAt
      }
  `
  return sanityClient.fetch(query, { limit })
}

/**
 * Pagination: liefert items + total in einem Request.
 * page: 1-basiert; perPage: Anzahl pro Seite
 */
export async function getPostsPage(page = 1, perPage = 9): Promise<{
  items: Array<{
    _id: string
    title: string
    slug: string
    excerpt?: string
    mainImage?: any
    publishedAt?: string
  }>
  total: number
}> {
  const start = Math.max(0, (page - 1) * perPage)
  const end = start + perPage
  const query = /* groq */ `
  {
    "items": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
      | order(coalesce(publishedAt, _createdAt) desc) [$start...$end]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        mainImage,
        publishedAt
      },
    "total": count(*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))])
  }`
  return sanityClient.fetch(query, { start, end })
}

export async function getPostBySlug(slug: string) {
  const query = /* groq */ `
    *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      body,
      mainImage,
      publishedAt
    }
  `
  return sanityClient.fetch(query, { slug })
}

export async function getAllPosts() {
  const query = /* groq */ `
    *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
      | order(coalesce(publishedAt, _createdAt) desc){
        "slug": slug.current,
        publishedAt,
        _updatedAt
      }
  `
  return sanityClient.fetch(query)
}

// ---------- GALLERY ----------

export async function getGallery(limit = 12) {
  const query = /* groq */ `
    *[_type == "galleryImage"] | order(_createdAt desc) [0...$limit]{
      _id,
      title,
      "slug": slug.current,
      image,
      alt
    }
  `
  return sanityClient.fetch(query, { limit })
}

export async function getGalleryItem(slug: string) {
  const query = /* groq */ `
    *[_type == "galleryImage" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      image,
      alt,
      description
    }
  `
  return sanityClient.fetch(query, { slug })
}

// ---------- BOOKS ----------

// Einheitliches Shop-Feld: mappe verbreitete Feldnamen -> "shopUrl"
const SHOP_URL_COALESCE = `
  coalesce(buyUrl, shopUrl, shopURL, shop, storeUrl, storeURL, externalUrl, url)
`

export async function getBooks(limit = 12) {
  const query = /* groq */ `
    *[_type == "book"] | order(_createdAt desc) [0...$limit]{
      _id,
      title,
      subtitle,
      "slug": slug.current,
      cover,
      description,
      tags,
      "shopUrl": ${SHOP_URL_COALESCE},
      buyLinks[] {
        label,
        "url": coalesce(url, href, link)
      }
    }
  `
  return sanityClient.fetch(query, { limit })
}

export async function getBook(slug: string) {
  const query = /* groq */ `
    *[_type == "book" && slug.current == $slug][0]{
      _id,
      title,
      subtitle,
      "slug": slug.current,
      cover,
      description,
      longDescription,
      year,
      pages,
      isbn,
      language,
      publisher,
      tags,
      "shopUrl": ${SHOP_URL_COALESCE},
      buyLinks[] {
        label,
        "url": coalesce(url, href, link)
      }
    }
  `
  return sanityClient.fetch(query, { slug })
}

export async function getBookSlugs() {
  const query = /* groq */ `
    *[_type == "book" && defined(slug.current)]{
      "slug": slug.current
    }
  `
  return sanityClient.fetch(query)
}

export async function getAllBooks() {
  const query = /* groq */ `
    *[_type == "book" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt,
      _createdAt
    }
  `
  return sanityClient.fetch(query)
}
