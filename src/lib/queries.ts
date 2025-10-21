// src/lib/queries.ts
import sanityClient from '@/lib/sanity.client'

// ---------- Blog ----------

/** Neueste Blogposts (für Startseite / Übersichtsseiten) */
export async function getRecentPosts(limit = 5) {
  const query = `
    *[_type == "post"] | order(publishedAt desc)[0...$limit]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      publishedAt,
      _updatedAt
    }
  `
  return sanityClient.fetch(query, { limit })
}

/** Alle Posts (für Feed/Sitemap o.ä.) */
export async function getAllPosts() {
  const query = `
    *[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      publishedAt,
      _updatedAt
    }
  `
  return sanityClient.fetch(query)
}

/** Einzelner Post per Slug (für /blog/[slug]) */
export async function getPost(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      body,
      publishedAt,
      _updatedAt
    }
  `
  return sanityClient.fetch(query, { slug })
}

/** Nur Slugs aller Posts (für generateStaticParams) */
export async function getPostSlugs() {
  const query = `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
  return sanityClient.fetch<{ slug: string }[]>(query)
}

// ---------- Bücher ----------

/** Bücherliste (limitierbar – für Startseite/Übersicht) */
export async function getBooks(limit = 12) {
  const query = `
    *[_type == "book"] | order(coalesce(year, _updatedAt) desc)[0...$limit]{
      _id,
      title,
      subtitle,
      "slug": slug.current,
      year,
      cover,            // erwartet: {asset, alt?}
      tags,
      _updatedAt
    }
  `
  return sanityClient.fetch(query, { limit })
}

/** Ein Buch per Slug (Detailseite /buecher/[slug]) */
export async function getBook(slug: string) {
  const query = `
    *[_type == "book" && slug.current == $slug][0]{
      _id,
      title,
      subtitle,
      "slug": slug.current,
      year,
      pages,
      isbn,
      language,
      publisher,
      description,       // kurze Beschreibung
      longDescription,   // ausführlich (Portable Text)
      buyLinks[]{label, url},
      tags,
      cover,
      _updatedAt
    }
  `
  return sanityClient.fetch(query, { slug })
}

/** Alle Bücher (für Sitemap/Feed) */
export async function getAllBooks() {
  const query = `
    *[_type == "book"] | order(coalesce(year, _updatedAt) desc){
      _id,
      title,
      "slug": slug.current,
      year,
      _updatedAt
    }
  `
  return sanityClient.fetch(query)
}

/** Nur Slugs aller Bücher (für generateStaticParams) */
export async function getBookSlugs() {
  const query = `*[_type == "book" && defined(slug.current)]{ "slug": slug.current }`
  return sanityClient.fetch<{ slug: string }[]>(query)
}

// ---------- Galerie ----------

/** Galerie-Items (für Übersichtsseite) */
export async function getGallery(limit = 24) {
  const query = `
    *[_type == "galleryImage"] | order(_createdAt desc)[0...$limit]{
      _id,
      title,
      "slug": slug.current,
      image,
      alt,
      _updatedAt
    }
  `
  return sanityClient.fetch(query, { limit })
}

/** Einzelnes Galerie-Item per Slug */
export async function getGalleryItem(slug: string) {
  const query = `
    *[_type == "galleryImage" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      image,
      alt,
      caption,
      body,        // falls es Portable Text gibt
      _updatedAt
    }
  `
  return sanityClient.fetch(query, { slug })
}

/** Nur Slugs aller Galerie-Items (für generateStaticParams) */
export async function getGallerySlugs() {
  const query = `*[_type == "galleryImage" && defined(slug.current)]{ "slug": slug.current }`
  return sanityClient.fetch<{ slug: string }[]>(query)
}

// ---------- Hilfen für Sitemap/Feeds ----------

/**
 * Einfache Hilfsfunktion, um eine ISO-Lastmod zu liefern.
 * (Viele deiner Routen nutzen publishedAt/_updatedAt.)
 */
export function pickLastmod(input: { publishedAt?: string; _updatedAt?: string }) {
  const date = input.publishedAt || input._updatedAt
  return date ? new Date(date).toISOString() : undefined
}
