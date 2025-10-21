// src/app/components/MetricsBeacon.tsx
'use client'
import { useEffect } from 'react'

export default function MetricsBeacon() {
  useEffect(() => {
    // leise – Fehler ignorieren
    fetch('/api/metrics/track', {
      method: 'POST',
      keepalive: true,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ t: Date.now() }),
    }).catch(() => {})
  }, [])
  return null
}
