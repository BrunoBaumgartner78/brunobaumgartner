// src/app/shop/page.tsx
import type { Metadata } from 'next'
import BuyButton from '@/app/components/BuyButton'
import { absUrl, SITE_TAGLINE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Shop – Complexus Immunitas Mentis (PDF)',
  description: 'Einmaliger Kauf, sofortiger Download. PDF optimiert für Suche & Copy/Paste – ideal für die Weiterarbeit mit ChatGPT.',
  openGraph: {
    title: 'Shop – Complexus Immunitas Mentis (PDF)',
    description: 'Einmaliger Kauf, sofortiger Download. PDF optimiert für ChatGPT-Workflows.',
    images: [{ url: absUrl(`/og?title=${encodeURIComponent('Shop')}&subtitle=${encodeURIComponent(SITE_TAGLINE)}`), width: 1200, height: 630 }],
    url: absUrl('/shop'),
    type: 'website',
  },
  alternates: { canonical: '/shop' },
}

export default function ShopPage() {
  return (
    <section className="wrap" style={{ display: 'grid', gap: '1rem', padding: '2rem 0' }}>
      <header>
        <h1 className="h1" style={{ margin: 0 }}>Complexus Immunitas Mentis – PDF</h1>
        <p style={{ margin: '.25rem 0 0', opacity: .9 }}>
          Einmaliger Preis · Sofort-Download · Privatnutzung · ChatGPT-geeignet
        </p>
      </header>

      <div style={{ display: 'grid', gap: '.75rem', maxWidth: 820 }}>
        <p>
          Du erhältst das vollständige Dokument als <strong>durchsuchbares PDF</strong> (Copy/Paste-freundlich) –
          optimal, um Abschnitte in ChatGPT zu referenzieren, zu zitieren oder zusammenfassen zu lassen.
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          <li>Einmalpreis (Stripe Checkout)</li>
          <li>Sofortiger Download-Link nach Zahlung</li>
          <li>Link ist <strong>24 h gültig</strong> und erlaubt bis zu <strong>1 Downloads</strong></li>
          <li>Datei: PDF (geeignet für Suche & Weiterverarbeitung mit ChatGPT)</li>
          <li>Nutzung: privat, kein Weitervertrieb</li>
        </ul>
        <p>
          Du erhältst das volle Wissen aus 10 Jahren Recherche über die biologische Ursache von Schizophrenie –
          darin enthalten:
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          <li>Neue und ganzheitliche Sicht auf Körper und Schizophrenie</li>
          <li>Neue Denkimpulse</li>
          <li>458 Seiten die das HCIM Modell erklären und veranschaulichen</li>
        </ul>
        <p>
          Deine Vorteile durch den Download:
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.1rem'}}>
        <li>Du sparst dir mit hochladen der PDF auf deine KI Monate, 
          wenn nicht Jahre, an Eigenrecherche und kommts direkt zum Punkt aktueller Forschung</li>
          <li>Die PDF ist kein Medizinischer Ratschlag, sondern eine Unabhängige Zusammenfassung von über 5000 Studien</li>
          </ul>

          <p>
         Dieses Wissen findest du nicht in Büchern, da es zu speziell und der Absatzmarkt 
         für solche Bücher zu klein für eine Produktion durch einen Verlag ist.
        </p>
        <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', marginTop: '.5rem' }}>
          <BuyButton productId="cim-pdf" label="Jetzt als PDF kaufen" />
          <span style={{ opacity: .8 }}>CHF&nbsp;380.–</span>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '.95rem', opacity: .9 }}>
          Nach dem Checkout erhältst du einen persönlichen Download-Link.
          Wenn du Hilfe brauchst, antworte einfach auf die Bestell-Mail.
        </p>
      </div>
    </section>
  )
}
