import { createClient } from 'next-sanity' // falls nicht vorhanden: npm i next-sanity

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
  // Dev: live-Daten, Prod: CDN für Speed
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
  // Falls Dataset privat ist:
  // token: process.env.SANITY_READ_TOKEN,
  // useCdn: false,
})
