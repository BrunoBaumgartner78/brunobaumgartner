// src/lib/queries.ts
import { sanityClient } from '@/lib/sanity.client'

/* -------------------- POSTS -------------------- */

export async function getRecentPosts(limit = 5) {
  const query = `
    *[_type == "post"] | order(publishedAt desc) [0...$limit]{
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

export async function getPostBySlug(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
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
  const query = `
    *[_type == "post"] | order(publishedAt desc){
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }
  `
  return sanityClient.fetch(query)
}

/* ------------------- GALLERY ------------------- */

export async function getGallery(limit = 12) {
  const query = `
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
  const query = `
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

/* -------------------- BOOKS -------------------- */

/**
 * Einheitliches Shop-Feld: mappe diverse mögliche Feldnamen -> "shopUrl".
 * WICHTIG: Deins heißt in Sanity "buyUrl", deshalb steht es als erstes.
 */
const SHOP_URL_COALESCE = `
  coalesce(buyUrl, shopUrl, shopURL, shop, storeUrl, storeURL, externalUrl, url)
`

export async function getBooks(limit = 12) {
  const query = `
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
  const query = `
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
  const query = `
    *[_type == "book" && defined(slug.current)]{
      "slug": slug.current
    }
  `
  return sanityClient.fetch(query)
}

export async function getAllBooks() {
  const query = `
    *[_type == "book"]{
      "slug": slug.current,
      _updatedAt,
      _createdAt
    }
  `
  return sanityClient.fetch(query)
}
