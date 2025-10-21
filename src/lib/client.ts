// src/sanity/lib/client.ts
import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../env'

// in case ../env kein useCdn exportiert:
const useCdn = process.env.NODE_ENV === 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: apiVersion || '2024-10-01',
  useCdn,
  perspective: 'published',
})

// Alias – falls irgendwo noch "sanityClient" importiert wird
export const sanityClient = client
