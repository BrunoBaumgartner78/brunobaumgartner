

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// sanity/post.ts â€” Blogpost Schema (WCAG: Altâ€‘Pflicht bei Titelbild)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { defineField, defineType } from 'sanity'


export default defineType({
name: 'post',
title: 'Post',
type: 'document',
fields: [
defineField({ name: 'title', type: 'string', title: 'Titel', validation: Rule => Rule.required() }),
defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
defineField({ name: 'excerpt', type: 'text', title: 'Teaser', rows: 3 }),
defineField({
name: 'mainImage', type: 'image', title: 'Titelbild',
options: { hotspot: true },
fields: [ defineField({ name: 'alt', type: 'string', title: 'Altâ€‘Text', validation: Rule => Rule.required().min(5) }) ]
}),
defineField({ name: 'publishedAt', type: 'datetime', title: 'VerÃ¶ffentlicht am', initialValue: () => new Date().toISOString() }),
defineField({ name: 'body', type: 'array', title: 'Inhalt', of: [ { type: 'block' }, { type: 'image', options: { hotspot: true }, fields: [ { name: 'alt', type: 'string', title: 'Altâ€‘Text', validation: Rule => Rule.required().min(5) }, { name: 'caption', type: 'string', title: 'Beschriftung' } ] } ] })
]
})

