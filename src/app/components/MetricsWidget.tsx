// Server Component
import { redis } from '../../lib/redits'

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

export default async function MetricsWidget() {
  const now = new Date()
  const kTotal = 'metrics:total'
  const kMonth = `metrics:month:${ym(now)}`
  const kDay   = `metrics:day:${ymd(now)}`
  const kOnline = 'metrics:online'

  const [total, month, day, online] = await redis.mget<number[]>(kTotal, kMonth, kDay, kOnline)

  const fmt = (n?: number) => (typeof n === 'number' ? n.toLocaleString('de-CH') : '0')

  return (
    <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',fontSize:14,opacity:.9}}>
      <span>Besuche gesamt: <strong>{fmt(total)}</strong></span>
      <span>dieser Monat: <strong>{fmt(month)}</strong></span>
      <span>heute: <strong>{fmt(day)}</strong></span>
      <span>online: <strong>{fmt(online)}</strong></span>
    </div>
  )
}
