// src/sanity/lib/live.ts
import React from 'react'
import { client } from './client'

type FetchArgs<TParams extends Record<string, unknown> = Record<string, unknown>> = {
  query: string
  params?: TParams
  tags?: string[]
  revalidate?: number
}

// Ersatz für "defineLive" aus next-sanity/live
export async function sanityFetch<T = unknown>({
  query,
  params = {} as Record<string, unknown>,
  tags = [],
  revalidate = 300,
}: FetchArgs) {
  return client.fetch<T>(query, params, { next: { revalidate, tags } })
}

// No-op Komponente – kann in layout.tsx gerendert bleiben
export function SanityLive() {
  return null
}
