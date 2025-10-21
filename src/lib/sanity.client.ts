import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,     // z.B. "iv7qlw2l"
  dataset: process.env.SANITY_DATASET!,          // z.B. "production"
  apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
  // token: process.env.SANITY_READ_TOKEN, // nur nötig, wenn du privat lesen willst
})
