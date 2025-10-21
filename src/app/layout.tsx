import './base.css'
import type { ReactNode } from 'react'
import { SiteHeader } from './components/SiteHeader' // ggf. Pfad anpassen

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'),
  title: { default: 'Bruno Baumgartner – Autor', template: '%s – Bruno Baumgartner' },
  description: 'Offizielle Autoren-Website mit Blog & Galerie. Schnell, zugänglich, fokussiert.',
  openGraph: { type: 'website', url: '/', siteName: 'Bruno Baumgartner – Autor', locale: 'de-CH', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de-CH">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main">Zum Inhalt springen</a>
        <SiteHeader />
       <main id="main" role="main" className="wrap site-main">
  {children}
</main>
<footer className="wrap site-footer text-sm text-muted border-t border-default">
  © {new Date().getFullYear()} Bruno Baumgartner · <a className="underline" href="/impressum">Impressum</a> · <a className="underline" href="/datenschutz">Datenschutz</a>
</footer>

        {/* Consent Mode v2 Defaults + GA4 (nur wenn ID gesetzt) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    ad_storage: 'denied',
                    analytics_storage: 'denied',
                    functionality_storage: 'granted',
                    security_storage: 'granted',
                    personalization_storage: 'denied',
                    wait_for_update: 500
                  });
                `,
              }}
            />
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
