import type { Metadata } from 'next'
import Link from 'next/link'
import SubscribeBox from './SubscribeBox'

const FEED_URL = 'https://www.brainbloom.ch/feed.xml'

export const metadata: Metadata = {
  title: 'RSS abonnieren',
  description:
    'Abonniere neue Beiträge von brainbloom.ch per RSS – kompatibel mit Feedly, NewsBlur, NetNewsWire u.v.m.',
  alternates: {
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'Brainbloom RSS' }] },
  },
}

export default function SubscribePage() {
  return (
    <div className="wrap" style={{ display: 'grid', gap: '1.25rem', padding: '2rem 0' }}>
      <h1 style={{ margin: 0 }}>RSS abonnieren</h1>
      <p style={{ margin: 0, maxWidth: 720 }}>
        RSS ist ein offener Standard. Du abonnierst den Feed in einer RSS-App (z. B. Feedly,
        NetNewsWire, NewsBlur). Alternativ kannst du die Feed-Adresse kopieren.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <a
          href={`https://feedly.com/i/subscription/feed/${encodeURIComponent(FEED_URL)}`}
          className="underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          In Feedly öffnen
        </a>
        <span aria-hidden>·</span>
        <a
          href={`https://www.newsblur.com/?url=${encodeURIComponent(FEED_URL)}`}
          className="underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          In NewsBlur öffnen
        </a>
        <span aria-hidden>·</span>
        <a href={`feed://${FEED_URL.replace(/^https?:\/\//, '')}`} className="underline">
          In RSS-App öffnen
        </a>
        <span aria-hidden>·</span>
        <a href="/feed.xml" className="underline">
          Roh-Feed ansehen
        </a>
      </div>

      {/* Interaktives Feld (Client Component) */}
      <SubscribeBox feedUrl={FEED_URL} />

      <p style={{ marginTop: 8 }}>
        Lieber E-Mail statt RSS? Nutze einen Dienst wie{' '}
        <a href="https://blogtrottr.com/" target="_blank" rel="noopener noreferrer" className="underline">
          Blogtrottr
        </a>{' '}
        – der schickt RSS-Feeds als E-Mails.
      </p>

      <p>
        <Link href="/" className="underline">← Zurück zur Startseite</Link>
      </p>
    </div>
  )
}
