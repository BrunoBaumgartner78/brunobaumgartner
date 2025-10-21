import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titel', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({ name: 'excerpt', title: 'Vorschau-Text', type: 'text' }),
    defineField({
      name: 'mainImage',
      title: 'Hauptbild',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt-Text', type: 'string' }],
    }),
    defineField({
      name: 'body',
      title: 'Inhalt',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', fields: [{ name: 'alt', title: 'Alt-Text', type: 'string' }] },
      ],
    }),
    defineField({ name: 'publishedAt', title: 'Veröffentlicht am', type: 'datetime' }),
  ],
  preview: { select: { title: 'title', media: 'mainImage' } },
})
