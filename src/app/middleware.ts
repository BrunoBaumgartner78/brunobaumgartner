import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { redis } from '@/lib/redis'

export const config = {
  // Alle HTML-Pages, aber keine Assets/API/Studio
  matcher: ['/((?!api|_next|studio|.*\\..*).*)'],
}

export async function middleware(req: NextRequest) {
  if (req.method !== 'GET') return NextResponse.next()

  const url = new URL(req.url)
  // Nur echte Seiten (kein Prefetch von Next Router mit 'only=1', etc.)
  if (url.searchParams.get('only') === '1') return NextResponse.next()

  const now = new Date()
  const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
  const ymd = `${ym}-${String(now.getUTCDate()).padStart(2, '0')}`

  const kTotal = 'metrics:total'
  const kMonth = `metrics:month:${ym}`
  const kDay   = `metrics:day:${ymd}`

  // Zähler hochzählen + sinnvolle TTLs für Tages/Monats-Keys
  await Promise.all([
    redis.incr(kTotal),
    redis.incr(kMonth).then(() => redis.expire(kMonth, 60 * 60 * 24 * 62)), // ~2 Monate
    redis.incr(kDay).then(() => redis.expire(kDay, 60 * 60 * 24 * 35)),     // ~35 Tage
  ])

  // "Online" (Approx.): IP erhält 2-min TTL; Anzahl aktiver IPs in metrics:online speichern
  const ip = req.ip ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ipKey = `online:${ip}`
  await redis.set(ipKey, '1', { ex: 120 })

  // Anzahl aktiver online:* Keys via SCAN bestimmen (Upstash unterstützt SCAN)
  try {
    const { keys } = await redis.scan(0, { match: 'online:*', count: 1000 })
    await redis.set('metrics:online', keys.length, { ex: 120 })
  } catch {
    // SCAN kann bei sehr vielen Keys teuer werden – dann online einfach auslassen
  }

  return NextResponse.next()
}
