// src/lib/queries.ts
import groq from 'groq'
import { sanityClient } from './sanity.client'

/* ----------------------------- Typdefinitionen ----------------------------- */

export type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  mainImage?: any
  body?: any
  publishedAt?: string
}

export type GalleryItem = {
  _id: string
  title?: string
  slug?: string
  image?: any
  caption?: string
  publishedAt?: string
}

export type Book = {
  _id: string
  title: string
  slug: string
  cover?: any
  description?: string
  publishedAt?: string
  isbn?: string
  buyUrl?: string
}

/* --------------------------------- BLOG ---------------------------------- */

export async function getRecentPosts(limit = 5): Promise<Post[]> {
  const q = groq`*[_type == "post" && defined(slug.current)]
    | order(coalesce(publishedAt, _createdAt) desc)[0...$limit]{
      _id, title, "slug": slug.current, excerpt, mainImage, body, publishedAt
    }`
  return sanityClient.fetch(q, { limit }, { next: { revalidate: 600, tags: ['posts'] } })
}

export async function getAllPosts(): Promise<Post[]> {
  const q = groq`*[_type == "post" && defined(slug.current)]
    | order(coalesce(publishedAt, _createdAt) desc){
      _id, title, "slug": slug.current, excerpt, mainImage, body, publishedAt
    }`
  return sanityClient.fetch(q, {}, { next: { revalidate: 600, tags: ['posts'] } })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = groq`*[_type == "post" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, excerpt, mainImage{..., asset->}, body, publishedAt
  }`
  return sanityClient.fetch(q, { slug }, { next: { revalidate: 600, tags: ['posts'] } })
}

/* -------------------------------- GALERIE -------------------------------- */

export async function getGallery(limit = 6): Promise<GalleryItem[]> {
  const q = groq`*[_type == "galleryImage"]
    | order(coalesce(publishedAt, _createdAt) desc)[0...$limit]{
      _id, title, "slug": slug.current, image{..., asset->}, caption, publishedAt
    }`
  return sanityClient.fetch(q, { limit }, { next: { revalidate: 600, tags: ['gallery'] } })
}

// NEU: Einzelnes Galerie-Item per Slug
export async function getGalleryItem(slug: string): Promise<GalleryItem | null> {
  const q = groq`*[_type == "galleryImage" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, image{..., asset->}, caption, publishedAt
  }`
  return sanityClient.fetch(q, { slug }, { next: { revalidate: 600, tags: ['gallery'] } })
}

// NEU: Nur Slugs (für generateStaticParams)
export async function getGallerySlugs(): Promise<string[]> {
  const q = groq`*[_type == "galleryImage" && defined(slug.current)][].slug.current`
  return sanityClient.fetch(q, {}, { next: { revalidate: 600, tags: ['gallery'] } })
}

/* --------------------------------- BÜCHER -------------------------------- */

export async function getBooks(limit = 5): Promise<Book[]> {
  const q = groq`*[_type == "book" && defined(slug.current)]
    | order(coalesce(publishedAt, _createdAt) desc)[0...$limit]{
      _id, title, "slug": slug.current, cover{..., asset->}, description, publishedAt, isbn, buyUrl
    }`
  return sanityClient.fetch(q, { limit }, { next: { revalidate: 600, tags: ['books'] } })
}

export async function getAllBooks(): Promise<Book[]> {
  const q = groq`*[_type == "book" && defined(slug.current)]
    | order(coalesce(publishedAt, _createdAt) desc){
      _id, title, "slug": slug.current, cover{..., asset->}, description, publishedAt, isbn, buyUrl
    }`
  return sanityClient.fetch(q, {}, { next: { revalidate: 600, tags: ['books'] } })
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const q = groq`*[_type == "book" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, cover{..., asset->}, description, publishedAt, isbn, buyUrl
  }`
  return sanityClient.fetch(q, { slug }, { next: { revalidate: 600, tags: ['books'] } })
}
