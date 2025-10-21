// Server Component – kein "use client"
import { redis } from '@/lib/redis'
import s from './MetricsWidget.module.css'

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

  return (
    <div className={s.grid} aria-label="Seiten-Metriken">
      <div className={s.item}>
        <span className={s.label}>Besuche gesamt:</span>
        <span className={s.num}>{fmt(total)}</span>
      </div>
      <div className={s.item}>
        <span className={s.label}>Diesen Monat:</span>
        <span className={s.num}>{fmt(month)}</span>
      </div>
      <div className={s.item}>
        <span className={s.label}>Heute:</span>
        <span className={s.num}>{fmt(day)}</span>
      </div>
      <div className={s.item}>
        <span className={s.label}>Online:</span>
        <span className={s.num}>{fmt(online)}</span>
      </div>
    </div>
  )
}
