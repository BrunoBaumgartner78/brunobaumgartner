// src/app/components/MetricsWidget.tsx
// Server Component – kein "use client"
import type React from 'react'
import { redis } from '@/lib/redis'

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

// im MetricsWidget: gridStyle
const gridStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.75rem',
  fontSize: '0.9rem',
  opacity: 0.9,
  gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))', // <- kein min-width
}


const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '0.5rem',
  minWidth: 0,// Schrumpfen innerhalb des Grids erlauben
}

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  flex: '0 1 auto',
}

const numStyle: React.CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.3px',
  fontWeight: 600,
  textAlign: 'right',
  whiteSpace: 'nowrap',
  flex: '1 1 auto',
  minWidth: 0, // wichtig, damit lange Zahlen nicht überlaufen
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
    // ENV/Netzwerk fehlt -> bleibt 0
  }

  const fmt = (n: number) => n.toLocaleString('de-CH')

  return (
    <div style={gridStyle} aria-label="Seiten-Metriken">
      <div style={itemStyle}>
        <span style={labelStyle}>Besuche gesamt:</span>
        <span style={numStyle}>{fmt(total)}</span>
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>Diesen Monat:</span>
        <span style={numStyle}>{fmt(month)}</span>
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>Heute:</span>
        <span style={numStyle}>{fmt(day)}</span>
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>Online:</span>
        <span style={numStyle}>{fmt(online)}</span>
      </div>
    </div>
  )
}
