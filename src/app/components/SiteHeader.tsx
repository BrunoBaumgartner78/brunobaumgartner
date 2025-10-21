import Link from 'next/link'

export function SiteHeader(){
  return (
    <header role="banner" className="border-b border-default bg-white/70 dark:bg-transparent backdrop-blur-sm">
      <div className="wrap flex items-center justify-between py-4">
        <Link href="/" className="font-semibold text-lg no-underline hover:opacity-90" aria-label="Startseite Bruno Baumgartner">
          Bruno&nbsp;Baumgartner
        </Link>
       <nav aria-label="Hauptnavigation">
  <ul className="nav">
    <li><Link href="/blog">Blog</Link></li>
    <li><Link href="/galerie">Galerie</Link></li>
  </ul>
</nav>

      </div>
    </header>
  )
}
