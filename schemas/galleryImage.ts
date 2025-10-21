import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'galleryImage',
  title: 'Galerie-Bild',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titel', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({
      name: 'image', title: 'Bild', type: 'image', options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt-Text', type: 'string', validation: r => r.required().min(5) })]
    }),
    defineField({ name: 'caption', title: 'Bildbeschreibung', type: 'string' }),
    defineField({ name: 'publishedAt', title: 'Veröffentlicht am', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
})
