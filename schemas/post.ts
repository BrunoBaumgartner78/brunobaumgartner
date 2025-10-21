import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titel', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'excerpt', title: 'Teaser', type: 'text' }),
    defineField({ name: 'publishedAt', title: 'Veröffentlicht am', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'body', title: 'Inhalt', type: 'array', of: [{ type: 'block' }] }),
  ],
})
