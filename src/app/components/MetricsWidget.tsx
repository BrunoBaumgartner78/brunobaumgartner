// src/app/components/MetricsWidget.tsx
import { getRedis } from '../../lib/redits'

// in src/app/components/MetricsWidget.tsx (nur Stil der Zahl)
const numStyle: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.3px',
  fontWeight: 600,
  textAlign: 'right',
  minWidth: '14ch',      // <- etwas breiter als zuvor
  display: 'inline-block',
  whiteSpace: 'nowrap',
}


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

function toNum(v: unknown) {
  if (v == null) return 0
  if (typeof v === 'number') return v
  if (typeof v === 'string') return Number.parseInt(v, 10) || 0
  return 0
}

export default async function MetricsWidget() {
  // Server Component – kein "use client" hier!
  let total = 0, month = 0, day = 0, online = 0

  try {
    const redis = getRedis()

    const now = new Date()
    const kTotal = 'metrics:total'
    const kMonth = `metrics:month:${ym(now)}`
    const kDay = `metrics:day:${ymd(now)}`
    const kOnline = 'metrics:online'

    const [t, m, d, o] = await redis.mget<Array<string | number | null>>(
      kTotal, kMonth, kDay, kOnline
    )

    total  = toNum(t)
    month  = toNum(m)
    day    = toNum(d)
    online = toNum(o)
  } catch {
    // ENV fehlt o.ä. -> stiller Fallback auf 0
  }

  const fmt = (n: number) => n.toLocaleString('de-CH')

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '0.75rem',
        fontSize: '0.9rem',
        opacity: 0.9,
      }}
    >
      <div><strong>Besuche gesamt:</strong> {fmt(total)}</div>
      <div><strong>Diesen Monat:</strong> {fmt(month)}</div>
      <div><strong>Heute:</strong> {fmt(day)}</div>
      <div><strong>Online:</strong> {fmt(online)}</div>
    </div>
  )
}
