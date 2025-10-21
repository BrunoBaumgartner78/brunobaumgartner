'use client'

import { useState } from 'react'

export default function GuestbookForm() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, message }),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Fehler')
      setMessage('')
      // Event, damit die Liste refresht
      window.dispatchEvent(new CustomEvent('guestbook:posted'))
    } catch (e: any) {
      setErr(e?.message ?? 'Fehler beim Senden')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{
      border: '1px solid var(--color-border, #e5e7eb)',
      borderRadius: 12, padding: 16, display: 'grid', gap: 12, maxWidth: 720,
      background: 'var(--card-bg, #fff)'
    }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="gb_name" style={{ fontSize: 13, opacity: 0.8 }}>Name</label>
        <input
          id="gb_name"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={80}
          required
          placeholder="Dein Name"
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border,#e5e7eb)' }}
        />
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="gb_msg" style={{ fontSize: 13, opacity: 0.8 }}>Nachricht</label>
        <textarea
          id="gb_msg"
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={1000}
          required
          rows={4}
          placeholder="Kurze Nachricht …"
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border,#e5e7eb)' }}
        />
      </div>

      {err && <p style={{ color: 'crimson', margin: 0 }}>{err}</p>}

      <div>
        <button
          type="submit"
          disabled={busy}
          style={{
            borderRadius: 10, padding: '10px 14px', border: '1px solid #000',
            background: '#000', color: '#fff', cursor: 'pointer', opacity: busy ? 0.7 : 1
          }}
        >
          {busy ? 'Senden …' : 'Eintragen'}
        </button>
      </div>
    </form>
  )
}
