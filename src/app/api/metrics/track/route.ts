// src/app/api/metrics/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '../../../../lib/redis'

export const runtime = 'edge' // bei Bedarf: 'nodejs'

const ONLINE_WINDOW_MS = 5 * 60 * 1000 // 5 Min

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
function sessionId(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    // @ts-ignore – Next lokal:
    (req as any).ip ||
    '0.0.0.0'
  const ua = req.headers.get('user-agent') || ''
  // leicht gehashte, kurze ID
  return `${ip}|${ua.slice(0, 40)}`
}

async function track(req: NextRequest) {
  // sowohl GET als auch POST akzeptieren
  if (req.method !== 'GET' && req.method !== 'POST') {
    return NextResponse.json({ ok: false, error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const redis = getRedis()
    const now = Date.now()

    // Zähler-Schlüssel
    const kTotal = 'metrics:total'
    const kMonth = `metrics:month:${ym(new Date())}`
    const kDay = `metrics:day:${ymd(new Date())}`

    // Online als Sorted Set
    const kOnlineZ = 'metrics:online:z'
    const kOnlineN = 'metrics:online'

    // Inkremente (fire-and-forget parallel)
    await Promise.all([
      redis.incr(kTotal),
      redis.incr(kMonth),
      redis.incr(kDay),
    ])

    // Anwesenheit markieren
    const sid = sessionId(req)
    await redis.zadd(kOnlineZ, { score: now, member: sid })
    await redis.zremrangebyscore(kOnlineZ, 0, now - ONLINE_WINDOW_MS)
    const online = (await redis.zcard(kOnlineZ)) ?? 0
    await redis.set(kOnlineN, online)

    return NextResponse.json({ ok: true })
  } catch (err) {
    // In DEV ruhig Meldung lassen, in PROD still sein
    console.error('metrics/track error:', err)
    // kein harter Fehler an den Client – verhindert 500 im Frontend
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}

export { track as GET, track as POST }
