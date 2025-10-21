'use client'

import { useState } from 'react'

export default function SubscribeBox({ feedUrl }: { feedUrl: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // no-op
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 8,
        maxWidth: 720,
        border: '1px solid var(--color-border, #e5e7eb)',
        borderRadius: 12,
        padding: 12,
        background: 'var(--card-bg, #fff)',
      }}
    >
      <label htmlFor="feedurl" style={{ fontSize: 12, opacity: 0.7 }}>
        Feed-Adresse
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          id="feedurl"
          readOnly
          value={feedUrl}
          onFocus={(e) => e.currentTarget.select()}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid var(--color-border, #e5e7eb)',
            background: 'var(--bg, #fff)',
          }}
        />
        <button
          type="button"
          onClick={copy}
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid var(--color-border, #e5e7eb)',
            background: 'var(--btn-bg, #f5f5f5)',
          }}
        >
          {copied ? 'Kopiert' : 'Kopieren'}
        </button>
      </div>
      <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
        Tipp: Adresse kopieren und in deiner Lieblings-RSS-App einfügen.
      </p>
    </div>
  )
}
