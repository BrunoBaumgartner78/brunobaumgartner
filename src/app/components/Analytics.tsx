'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_ID
    if (!id || typeof window === 'undefined') return
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    // @ts-ignore
    window.gtag?.('config', id, { page_path: url })
  }, [pathname, searchParams])
  return null
}
