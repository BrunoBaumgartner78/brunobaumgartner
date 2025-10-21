export const metadata = {
  title: 'Impressum',
  description: 'Rechtliche Anbieterkennzeichnung von Bruno Baumgartner',
  alternates: { canonical: '/impressum' },
}

export default function ImpressumPage() {
  // Änder’ das Datum bei Updates
  const updated = new Date('2025-10-20')

  return (
    <article className="wrap prose" aria-labelledby="impressum-title">
      <h1 id="impressum-title">Impressum</h1>

      <section aria-labelledby="anbieter">
        <h2 id="anbieter">Anbieter</h2>
        <address>
          <strong>Bruno Baumgartner</strong><br />
          {/* ⬇️ Bitte anpassen */}
          Le pré-aux-boeufes 222<br />
          2615 Sonvilier<br />
          Schweiz
        </address>

        <dl>
          <dt>E-Mail</dt>
          <dd><a href="mailto:bruno@brainbloom.ch">bruno@brainbloom.ch</a></dd>

          <dt>Telefon</dt>
          <dd><a href="tel:+41790000000">+41 78 243 72 27</a></dd>


        </dl>
      </section>

      <section aria-labelledby="verantwortlich">
        <h2 id="verantwortlich">Verantwortlich für den Inhalt</h2>
        <p>Bruno Baumgartner (Anschrift wie oben)</p>
      </section>

      <section aria-labelledby="haftung">
        <h2 id="haftung">Haftungsausschluss</h2>
        <p>
          Alle Inhalte wurden mit grösster Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und
          Aktualität wird keine Gewähr übernommen. Externe Links führen zu Inhalten Dritter; dafür
          sind ausschliesslich deren Betreiber verantwortlich.
        </p>
      </section>

      <section aria-labelledby="urheberrecht">
        <h2 id="urheberrecht">Urheberrecht</h2>
        <p>
          Texte, Bilder und sonstige Inhalte auf dieser Website unterliegen dem Urheberrecht.
          Jede Verwertung bedarf der vorherigen Zustimmung der Rechteinhaber, sofern nicht anders
          gekennzeichnet.
        </p>
      </section>

      {/* Optional: Bildnachweise
      <section aria-labelledby="bildnachweise">
        <h2 id="bildnachweise">Bildnachweise</h2>
        <ul>
          <li>Foto «XYZ» – © Bruno Baumgartner</li>
        </ul>
      </section>
      */}

      <p className="text-muted text-sm">Stand: {updated.toLocaleDateString('de-CH')}</p>

      {/* Strukturierte Daten (SEO). Domain/E-Mail/Tel/Adresse bitte anpassen. */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Bruno Baumgartner',
          url: 'https://brainbloom.ch',
          email: 'mailto:bruno@brainbloom.ch',
          telephone: '+41782437227',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Le pré-aux-boeufes 222',
            postalCode: '2615',
            addressLocality: 'Sonvilier',
            addressCountry: 'CH',
          },
        })}
      </script>
    </article>
  )
}
