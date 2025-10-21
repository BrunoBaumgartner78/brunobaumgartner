import { NextResponse } from 'next/server'
import { redis } from '../../../../lib/redits' // <-- Upstash REST-Client verwenden

export const runtime = 'edge'

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

export async function GET() {
  try {
    const now = new Date()
    const kTotal = 'metrics:total'
    const kMonth = `metrics:month:${ym(now)}`
    const kDay   = `metrics:day:${ymd(now)}`
    const zOnline = 'metrics:online:z'

    // Werte lesen (fehlende => 0)
    const [totalRaw, monthRaw, dayRaw, onlineCount] = await Promise.all([
      redis.get<number>(kTotal),
      redis.get<number>(kMonth),
      redis.get<number>(kDay),
      redis.zcard(zOnline),
    ])

    const total = Number(totalRaw ?? 0)
    const month = Number(monthRaw ?? 0)
    const day   = Number(dayRaw ?? 0)
    const online = Number(onlineCount ?? 0)

    return NextResponse.json({ ok: true, total, month, day, online })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'unknown error' },
      { status: 500 },
    )
  }
}
