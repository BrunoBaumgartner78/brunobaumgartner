import { Redis } from '@upstash/redis'

/**
 * Unterstützt beide Varianten:
 * - Vercel KV:        KV_REST_API_URL / KV_REST_API_TOKEN (optional: KV_REST_API_READ_ONLY_TOKEN)
 * - Upstash Redis:    UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 */
const url =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL

const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  process.env.KV_REST_API_READ_ONLY_TOKEN

if (!url || !token) {
  throw new Error(
    'Missing Redis/KV env: set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN'
  )
}

export const redis = new Redis({ url, token })
