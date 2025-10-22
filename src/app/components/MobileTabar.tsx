// src/app/components/MobileTabbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import s from './MobileTabbar.module.css'

type Tab = { href: string; label: string; icon: JSX.Element; iconFilled: JSX.Element }



/* ===== Neue, klarere Icons (Outline + Filled) ===== */

/* HOME */
const HomeIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5" />
      <path d="M9 22v-6a3 3 0 0 1 6 0v6" />
    </g>
  </svg>
)
const HomeIconFilled = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12 2.25 1.75 10.5a1 1 0 0 0 .63 1.8H4.5V20a2.5 2.5 0 0 0 2.5 2.5h10A2.5 2.5 0 0 0 19.5 20v-7.7h2.12a1 1 0 0 0 .63-1.8L12 2.25Z" />
    <path fill="currentColor" d="M9.25 22.5v-5a2.75 2.75 0 0 1 5.5 0v5h-5.5Z" />
  </svg>
)

/* BLOG (Dokument) */
const BlogIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M8 12h8M8 16h8" />
    </g>
  </svg>
)
const BlogIconFilled = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M14 3h.01L20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h8Z" />
    <path fill="currentColor" d="M14 3v5h5" />
    <path fill="currentColor" d="M8 12h8a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2Zm0 4h8a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2Z" />
  </svg>
)

/* BÜCHER (Aufgeschlagenes Buch) */
const BookIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v16" />
      <path d="M12 4H6.5A3.5 3.5 0 0 0 3 7.5V18a2 2 0 0 0 2 2H12" />
      <path d="M12 4h5.5A3.5 3.5 0 0 1 21 7.5V18a2 2 0 0 1-2 2H12" />
      <path d="M6 8.5h4M14 8.5h4" />
    </g>
  </svg>
)
const BookIconFilled = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M6.5 2A4.5 4.5 0 0 0 2 6.5V18a3 3 0 0 0 3 3h7V2H6.5Z" />
    <path fill="currentColor" d="M17.5 2A4.5 4.5 0 0 1 22 6.5V18a3 3 0 0 1-3 3h-7V2h5.5Z" />
  </svg>
)

/* GALERIE (Kamera) */
const GalleryIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h3l2-2h6l2 2h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="4" />
      <path d="M19 9h0" />
    </g>
  </svg>
)
const GalleryIconFilled = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M9 5h6l2 2h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h3l2-2Z" />
    <circle fill="currentColor" cx="12" cy="13" r="4.5" />
  </svg>
)

/* GÄSTE (Sprechblase = Gästebuch) */
const GuestsIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H9l-5 4v-4a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z" />
      <path d="M7.5 9.5h7M7.5 13h4.5" />
    </g>
  </svg>
)
const GuestsIconFilled = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M4 3h12a5 5 0 0 1 5 5v5a5 5 0 0 1-5 5H9.2L4 22.5V18A5 5 0 0 1 0 13V8a5 5 0 0 1 5-5Z" />
    <path fill="currentColor" d="M7.2 9.3h7.6a1 1 0 1 1 0 2H7.2a1 1 0 0 1 0-2Zm0 3.5h5a1 1 0 1 1 0 2h-5a1 1 0 1 1 0-2Z" />
  </svg>
)

/* Tabs: Home, Blog, Bücher, Galerie, Gäste */
const TABS: Tab[] = [
  { href: '/',          label: 'Home',   icon: HomeIcon,    iconFilled: HomeIconFilled },
  { href: '/blog',      label: 'Blog',   icon: BlogIcon,    iconFilled: BlogIconFilled },
  { href: '/buecher',   label: 'Bücher', icon: BookIcon,    iconFilled: BookIconFilled },
  { href: '/galerie',   label: 'Galerie',icon: GalleryIcon, iconFilled: GalleryIconFilled },
  { href: '/gaestebuch',label: 'Gäste',  icon: GuestsIcon,  iconFilled: GuestsIconFilled },
]

// … deine Icons & TABS wie gehabt …

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export default function MobileTabbar() {
  const pathname = usePathname() || '/'
  const ulRef = useRef<HTMLUListElement>(null)

  // offset in px; null = noch nicht gemessen
  const [offset, setOffset] = useState<number | null>(null)
  const [ready, setReady] = useState(false)

  const activeIndex = useMemo(
    () => Math.max(0, TABS.findIndex(t => isActive(pathname, t.href))),
    [pathname]
  )

  const recalc = () => {
    const ul = ulRef.current
    if (!ul) return
    const li = ul.children[activeIndex] as HTMLElement | undefined
    if (!li) return

    // Exakter Mittelpunkt relativ zur umgebenden <nav> (.tabbar)
    const liRect = li.getBoundingClientRect()
    const nav = ul.closest('nav') as HTMLElement | null
    const baseRect = (nav ?? ul).getBoundingClientRect()
    const centerX = liRect.left + liRect.width / 2 - baseRect.left

    setOffset(centerX)
  }

  // Vor dem ersten Paint messen → kein sichtbarer Sprung
  useLayoutEffect(() => {
    recalc()
    setReady(true)
  }, [activeIndex])

  // Bei Resize/Fonts nachmessen
  useEffect(() => {
    const onResize = () => recalc()
    window.addEventListener('resize', onResize)
    // @ts-ignore
    if (document?.fonts?.ready) (document as any).fonts.ready.then(recalc)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIndex])

  return (
   <nav
  className={s.tabbar}
  aria-label="Hauptnavigation (mobil)"
  style={{ ['--offset' as any]: `${offset ?? 0}px` }} // << px hinzugefügt
  data-ready={ready ? 'true' : 'false'}
>

      <ul ref={ulRef}>
        {TABS.map((t, i) => {
          const active = i === activeIndex
          return (
            <li key={t.href} className={active ? s.active : undefined}>
              <Link href={t.href} aria-current={active ? 'page' : undefined}>
                <div className={s.iconWrap}>
                  <span className={s.iconDefault} aria-hidden>{t.icon}</span>
                  <span className={s.iconActive} aria-hidden>{t.iconFilled}</span>
                </div>
                <strong className={s.label}>{t.label}</strong>
              </Link>
            </li>
          )
        })}
      </ul>
      <em className={s.cursor} aria-hidden />
    </nav>
  )
}