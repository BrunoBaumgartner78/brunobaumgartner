export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

function ymd(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function ym(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export async function GET() {
  const now = Date.now()
  const total = Number(await kv.get('hits:total')) || 0
  const day = Number(await kv.get(`hits:day:${ymd()}`)) || 0
  const month = Number(await kv.get(`hits:month:${ym()}`)) || 0

  // Online frisch trimmen und zählen
  const onlineKey = 'online:z'
  await kv.zremrangebyscore(onlineKey, 0, now - 5 * 60 * 1000)
  const online = await kv.zcard(onlineKey)

  const res = NextResponse.json({ total, month, day, online })
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('Access-Control-Allow-Origin', '*')
  return res
}
