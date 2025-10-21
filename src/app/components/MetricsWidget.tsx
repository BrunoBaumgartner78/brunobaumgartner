// src/app/components/MetricsWidget.tsx
// Server Component – KEIN "use client"
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

  // --- Styles (alles inline) ---
  const wrapStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px 14px',
    width: '100%',
    maxWidth: '100%',
    fontSize: '0.92rem',
    opacity: 0.9,
  }

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    padding: '8px 10px',
    border: '1px solid var(--color-border, #e5e7eb)',
    borderRadius: 10,
    background: 'var(--color-card, transparent)',
    // responsive ohne Media-Query:
    // Mindestens ~220px, darf wachsen und wrappt automatisch.
    flex: '1 1 220px',
    minWidth: 220,
    maxWidth: '100%',
    lineHeight: 1.2,
  }

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0, // wichtig, damit der Text schrumpfen darf
  }

  const numStyle: React.CSSProperties = {
    marginLeft: 'auto',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.3px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.2,
  }

  return (
    <div style={wrapStyle} role="group" aria-label="Seiten-Metriken">
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
