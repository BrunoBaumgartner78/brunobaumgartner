// src/app/sanity/lib/live.ts
import React from 'react'
import { sanityClient } from '@/lib/sanity.client'

type FetchArgs = {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
  revalidate?: number
}

export async function sanityFetch<T = unknown>({
  query,
  params = {},
  tags = [],
  revalidate = 300,
}: FetchArgs): Promise<T> {
  return sanityClient.fetch<T>(query, params, { next: { revalidate, tags } })
}

// No-op, darf in layout.tsx stehen bleiben
export function SanityLive() {
  return null
}
