import { NextRequest, NextResponse } from 'next/server'
import { redis } from '../../../../lib/redits' // <-- Upstash-Client statt '@vercel/kv'

export const runtime = 'edge' // Upstash-REST funktioniert am Edge

const ONLINE_WINDOW_MS = 5 * 60 * 1000 // 5 Minuten

function ym(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}
function ymd(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function GET(req: NextRequest) {
  try {
    const now = new Date()
    const kTotal = 'metrics:total'
    const kMonth = `metrics:month:${ym(now)}`
    const kDay   = `metrics:day:${ymd(now)}`
    const zOnline = 'metrics:online:z' // Sorted Set für "online"-Fenster

    // Zähler hochzählen + TTLs für Tages/Monats-Keys
    await Promise.all([
      redis.incr(kTotal),
      redis.incr(kMonth).then(() => redis.expire(kMonth, 60 * 60 * 24 * 62)), // ~2 Monate
      redis.incr(kDay).then(() => redis.expire(kDay, 60 * 60 * 24 * 35)),     // ~35 Tage
    ])

    // Online-User (approx) via Sorted Set mit Timestamp
    const ip =
      req.ip ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown'

    const nowMs = Date.now()
    await redis.zadd(zOnline, { score: nowMs, member: ip })
    await redis.zremrangebyscore(zOnline, 0, nowMs - ONLINE_WINDOW_MS)
    const online = await redis.zcard(zOnline)

    // optional: Kompatibilitäts-Key für Widgets
    await redis.set('metrics:online', online, { ex: 120 })

    return NextResponse.json({ ok: true, online })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'unknown error' },
      { status: 500 }
    )
  }
}
