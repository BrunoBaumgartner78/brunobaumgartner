'use client'
import { useState } from 'react'

export default function SuccessActions({ sessionId }: { sessionId: string | null }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!sessionId) return
    setLoading(true); setErr(null)
    try {
      const res = await fetch('/api/shop/download-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Fehler beim Erstellen des Links')
      // Download starten
      window.location.href = data.downloadUrl
    } catch (e: any) {
      setErr(e.message || 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <button
        onClick={handleDownload}
        disabled={loading || !sessionId}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: 10,
          border: '1px solid var(--color-border, #e5e7eb)',
          background: 'var(--color-card, #f7f7f7)',
          cursor: loading || !sessionId ? 'not-allowed' : 'pointer',
          fontWeight: 600,
        }}
      >
        {loading ? 'Bereite Download vor…' : 'PDF herunterladen'}
      </button>
      {err && <p style={{ color: 'crimson', margin: 0 }}>{err}</p>}
    </div>
  )
}
