'use client'
import { useEffect } from 'react'

export default function MetricsBeacon() {
  useEffect(() => {
    // Nur einmal pro Pageview
    fetch('/api/metrics/track', { method: 'GET', cache: 'no-store' }).catch(() => {})
  }, [])
  return null
}
