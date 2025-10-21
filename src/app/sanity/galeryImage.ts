import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'galleryImage',
  title: 'Galerie Bild',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titel', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt-Text', type: 'string' }],
    }),
    defineField({ name: 'caption', title: 'Bildunterschrift', type: 'text' }),
    defineField({ name: 'publishedAt', title: 'Datum', type: 'datetime' }),
  ],
  preview: { select: { title: 'title', media: 'image' } },
})
