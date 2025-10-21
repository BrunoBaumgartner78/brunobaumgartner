import { type SchemaTypeDefinition } from 'sanity'
import post from './post'
import galleryImage from './galleryImage'
import book from './book'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, galleryImage, book],
}
