// src/app/shop/cancel/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zahlung abgebrochen',
}

export default function Cancel() {
  return (
    <section className="wrap" style={{ padding: '2rem 0' }}>
      <h1 className="h1" style={{ marginTop: 0 }}>Zahlung abgebrochen</h1>
      <p>
        Du hast den Checkout abgebrochen. Kein Problem – du kannst es jederzeit
        erneut versuchen.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <Link href="/shop" className="btn">Erneut versuchen</Link>
        <Link href="/" className="btn btn-ghost">Zur Startseite</Link>
      </div>
    </section>
  )
}
