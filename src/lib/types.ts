export type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  mainImage?: any
  body: any
  publishedAt: string
}

export type GalleryItem = {
  _id: string
  title: string
  slug: string
  image: any
  alt: string
  caption?: string
  publishedAt: string
}
