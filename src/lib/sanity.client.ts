// src/app/lib/sanity.client.ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,      // z.B. "iv7qlw2l"
  dataset: process.env.SANITY_DATASET!,           // z.B. "production"
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})
