

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// sanity/galleryImage.ts â€” Galerieâ€‘Eintrag mit Altâ€‘Pflicht
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { defineField, defineType } from 'sanity'


export default defineType({
name: 'galleryImage',
title: 'Galerieâ€‘Bild',
type: 'document',
fields: [
defineField({ name: 'title', type: 'string', title: 'Titel', validation: Rule => Rule.required() }),
defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() }),
defineField({ name: 'image', type: 'image', title: 'Bild', options: { hotspot: true }, fields: [ defineField({ name: 'alt', type: 'string', title: 'Altâ€‘Text', validation: Rule => Rule.required().min(5) }) ] }),
defineField({ name: 'caption', type: 'string', title: 'Bildbeschreibung (Caption)' }),
defineField({ name: 'publishedAt', type: 'datetime', title: 'VerÃ¶ffentlicht am', initialValue: () => new Date().toISOString() })
]
})

