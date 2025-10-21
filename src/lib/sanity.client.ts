// src/lib/sanity.client.ts
import { createClient } from '@sanity/client'

const projectId =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset =
  process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2024-05-01'
const useCdn = process.env.NODE_ENV === 'production'

// Fallback-Stub, damit Build/SSR nicht abstürzt, wenn ENV fehlt
const stubClient = {
  fetch: async <T = unknown>(_q: string, _p?: Record<string, unknown>): Promise<T> => {
    return [] as unknown as T
  },
  config: () => ({ projectId: projectId ?? '', dataset }),
}

export const sanityClient =
  projectId
    ? createClient({ projectId, dataset, apiVersion, useCdn, perspective: 'published' })
    : (stubClient as unknown as ReturnType<typeof createClient>)
