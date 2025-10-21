// src/lib/redis.ts
import { Redis } from '@upstash/redis'

const url =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ??
  process.env.KV_REST_API_TOKEN ??
  process.env.KV_REST_API_READ_ONLY_TOKEN

if (!url || !token) {
  throw new Error(
    'Missing Redis/KV env: set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN'
  )
}

export const redis = new Redis({ url, token })     // für Server Components
export function getRedis() { return new Redis({ url, token }) } // für Edge-Routes
