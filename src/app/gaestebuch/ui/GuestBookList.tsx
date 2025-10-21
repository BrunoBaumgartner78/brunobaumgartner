'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import DeleteButton from './DeleteButton'

type Entry = {
  id: string
  name: string
  message: string
  ts: number
}

export default function GuestbookList() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const sp = useSearchParams()
  const isAdmin = useMemo(() => sp.get('admin') === '1', [sp])

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/guestbook?offset=0&limit=10', { cache: 'no-store' })
    const data = await res.json()
    setEntries(data.items || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <p>Lade…</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {entries.map((e) => (
        <li
          key={e.id}
          style={{
            border: '1px solid var(--color-border, #e5e7eb)',
            borderRadius: 10,
            padding: '0.75rem 0.9rem',
            marginBottom: '0.7rem',
            background: 'var(--color-card, transparent)',
            display: 'grid',
            gridTemplateColumns: isAdmin ? '1fr auto' : '1fr',
            gap: '0.6rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{e.name}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{e.message}</div>
          </div>

          {isAdmin && (
            <DeleteButton
              id={e.id}
              onDeleted={() => {
                // lokal entfernen ohne kompletten Reload
                setEntries((prev) => prev.filter((x) => x.id !== e.id))
              }}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
