// src/app/components/MetricsWidget.tsx
import { redis } from '@/lib/redis'
import type React from 'react'

const numStyle: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.3px',
  fontWeight: 600,
  textAlign: 'right',
  minWidth: '14ch',
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
  let total = 0, month = 0, day = 0, online = 0

  try {
    const now = new Date()
    const [t, m, d, o] = await redis.mget<string | number | null>(
      'metrics:total',
      `metrics:month:${ym(now)}`,
      `metrics:day:${ymd(now)}`,
      'metrics:online',
    )
    total  = toNum(t)
    month  = toNum(m)
    day    = toNum(d)
    online = toNum(o)
  } catch {
    // ENV / Netzwerk fehlt -> Fallback auf 0
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
      <div><strong>Besuche gesamt:</strong> <span style={numStyle}>{fmt(total)}</span></div>
      <div><strong>Diesen Monat:</strong> <span style={numStyle}>{fmt(month)}</span></div>
      <div><strong>Heute:</strong> <span style={numStyle}>{fmt(day)}</span></div>
      <div><strong>Online:</strong> <span style={numStyle}>{fmt(online)}</span></div>
    </div>
  )
}
