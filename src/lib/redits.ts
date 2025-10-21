// src/lib/redis.ts
import { Redis } from '@upstash/redis'

/**
 * Unterstützt beide Varianten:
 * - Upstash Redis:    UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 * - Vercel KV Legacy: KV_REST_API_URL / KV_REST_API_TOKEN
 */
const url =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL

const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN

if (!url || !token) {
  throw new Error(
    'Missing Redis env. Set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN (oder KV_REST_API_URL/KV_REST_API_TOKEN).'
  )
}

export const redis = new Redis({ url, token })
export type RedisClient = typeof redis
