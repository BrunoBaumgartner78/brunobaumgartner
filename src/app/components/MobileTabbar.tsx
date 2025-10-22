// src/app/components/MobileTabbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import s from './MobileTabbar.module.css'

type Tab = { href: string; label: string; icon: JSX.Element; iconFilled: JSX.Element }



/* Icons wie bei dir – gekürzt für Platz. Belasse deine aktuellen SVGs */
const HomeIcon = <svg viewBox="0 0 24 24" aria-hidden="true"><g strokeWidth="2" fill="none"><circle cx="12" cy="12" r="11"/></g></svg>
const HomeIconFilled = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12,0C5.38,0,0,5.38,0,12s5.38,12,12,12s12-5.38,12-12S18.62,0,12,0z"/></svg>
const FilesIcon = <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" strokeWidth="2"><rect x="2" y="1" width="20" height="22"/></g></svg>
const FilesIconFilled = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22,0H2V24H15V17h7V0z"/></svg>
const BookIcon = <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" strokeWidth="2"><path d="M4 3h10v16H7a3 3 0 0 1-3-3z"/><path d="M17 6h3v13h-9"/></g></svg>
const BookIconFilled = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2h10a4 4 0 0 1 4 4v14H7a4 4 0 0 1-4-4V2z"/></svg>
const CameraIcon = <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" strokeWidth="2"><rect x="1" y="5" width="22" height="17"/></g></svg>
const CameraIconFilled = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23,4H1V23H23V4z"/></svg>
const UserIcon = <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" strokeWidth="2"><circle cx="12" cy="7" r="5"/><path d="M2 23c0-4.42 4.48-7 10-7s10 2.58 10 7"/></g></svg>
const UserIconFilled = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12,13c3.31,0,6-2.69,6-6S15.31,1,12,1S6,3.69,6,7S8.69,13,12,13z M2,24v-2.2C2,18,6.48,16,12,16s10,2,10,5.8V24H2z"/></svg>

/* Tabs: Home, Blog, Bücher, Galerie, Gäste */
const TABS: Tab[] = [
  { href: '/',          label: 'Home',   icon: HomeIcon,  iconFilled: HomeIconFilled },
  { href: '/blog',      label: 'Blog',   icon: FilesIcon, iconFilled: FilesIconFilled },
  { href: '/buecher',   label: 'Bücher', icon: BookIcon,  iconFilled: BookIconFilled },
  { href: '/galerie',   label: 'Galerie',icon: CameraIcon,iconFilled: CameraIconFilled },
  { href: '/gaestebuch',label: 'Gäste',  icon: UserIcon,  iconFilled: UserIconFilled },
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
      // CSS-Variable als Zahl, CSS hängt “px” dran
      style={{ ['--offset' as any]: offset ?? 0 }}
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