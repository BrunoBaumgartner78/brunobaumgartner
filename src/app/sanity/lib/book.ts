import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'book',
  title: 'Buch',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titel', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'cover',
      title: 'Cover',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt-Text', type: 'string' }],
    }),
    defineField({ name: 'description', title: 'Beschreibung', type: 'text' }),
    defineField({ name: 'publishedAt', title: 'Veröffentlicht am', type: 'date' }),
    defineField({ name: 'isbn', title: 'ISBN', type: 'string' }),
    defineField({ name: 'buyUrl', title: 'Kauf-Link', type: 'url' }),
  ],
  preview: { select: { title: 'title', media: 'cover' } },
})
