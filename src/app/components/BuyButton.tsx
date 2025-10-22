// src/app/components/BuyButton.tsx
'use client'
import * as React from 'react'

export default function BuyButton({
  label = 'Jetzt als PDF kaufen',
  productId,
}: {
  label?: string
  productId?: string
}) {
  const [loading, setLoading] = React.useState(false)

  const buy = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      const ct = r.headers.get('content-type') || ''

      // Fehlerfälle lesbar machen
      if (!r.ok) {
        const msg = ct.includes('application/json')
          ? (await r.json().catch(() => ({})))?.error
          : (await r.text().catch(() => ''))
        throw new Error(msg || `HTTP ${r.status}`)
      }

      // Erwartet: JSON mit { url }
      if (ct.includes('application/json')) {
        const data = await r.json().catch(() => ({}))
        if (data?.url) {
          window.location.href = data.url
          return
        }
        throw new Error('Antwort ohne URL')
      }

      // Fallbacks: (sollte eigentlich nicht passieren)
      if (r.redirected && r.url) {
        window.location.href = r.url
        return
      }
      const text = await r.text()
      const m = text.match(/https?:\/\/\S+/)
      if (m) {
        window.location.href = m[0]
        return
      }

      throw new Error('Unerwartete Antwort vom Server.')
    } catch (e: any) {
      alert(`Checkout fehlgeschlagen: ${e?.message || e}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={buy}
      disabled={loading}
      style={{
        padding: '0.9rem 1.2rem',
        borderRadius: 10,
        border: '1px solid var(--color-border,#e5e7eb)',
        background: 'var(--color-card,#f7f7f7)',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        minWidth: 220,
      }}
    >
      {loading ? 'Weiterleiten…' : label}
    </button>
  )
}
