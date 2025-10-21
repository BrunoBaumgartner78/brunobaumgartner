// src/app/api/metrics/stats/route.ts
import { NextResponse } from 'next/server'
import { getRedis } from '../../../../lib/redis'

export const runtime = 'edge'

function ym(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}
function ymd(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const da = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${da}`
}
const toNum = (v: unknown) =>
  typeof v === 'number' ? v : typeof v === 'string' ? parseInt(v, 10) || 0 : 0

export async function GET() {
  try {
    const redis = getRedis()
    const now = new Date()

    const [t, m, d, o] = await redis.mget(
      'metrics:total',
      `metrics:month:${ym(now)}`,
      `metrics:day:${ymd(now)}`,
      'metrics:online',
    )
    return NextResponse.json({
      total: toNum(t),
      month: toNum(m),
      day: toNum(d),
      online: toNum(o),
    })
  } catch {
    return NextResponse.json({ total: 0, month: 0, day: 0, online: 0 })
  }
}
