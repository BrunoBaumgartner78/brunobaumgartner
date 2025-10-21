// src/app/api/kv-test/route.ts
export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { redis } from '../../../lib/redis'

export async function GET() {
  const pong = await redis.ping()
  return NextResponse.json({ pong })
}
