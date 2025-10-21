export const metadata = {
  title: 'Datenschutz',
  description: 'Informationen zur Verarbeitung personenbezogener Daten',
  alternates: { canonical: '/datenschutz' },
}

export default function DatenschutzPage() {
  return (
    <article className="wrap prose" aria-labelledby="ds-title">
      <h1 id="ds-title">Datenschutz</h1>
      <p>Diese Website verarbeitet personenbezogene Daten nur, soweit dies zur Bereitstellung
        einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.</p>

      <h2>Verantwortliche Stelle</h2>
      <p><strong>Bruno Baumgartner</strong><br/>Le pré-aux-boeufes 222, 2615 Sonvilier, Schweiz<br/>
      E-Mail: <a href="mailto:bruno@brainbloom.ch">bruno@brainbloom.ch</a></p>

      <h2>Hosting & Zugriffsdaten</h2>
      <p>Beim Aufruf der Website werden automatisch Server-Logfiles (IP-Adresse, Datum/Zeit,
        User-Agent, Referrer) verarbeitet. Rechtsgrundlage: berechtigtes Interesse an stabiler 
        Bereitstellung der Website.</p>

      <h2>Kontakt</h2>
      <p>Wenn du per E-Mail Kontakt aufnimmst, verarbeiten wir die Angaben zur Bearbeitung der Anfrage.</p>

      <h2>Rechte betroffener Personen</h2>
      <ul>
        <li>Auskunft, Berichtigung, Löschung, Einschränkung</li>
        <li>Widerspruch (soweit rechtlich möglich), Datenübertragbarkeit</li>
      </ul>

      <h2>Aufbewahrung</h2>
      <p>Wir verarbeiten Daten nur so lange, wie es der Zweck erfordert bzw. gesetzliche Pflichten bestehen.</p>

      <p className="text-muted text-sm">Hinweis: Diese Vorlage ist allgemein und ersetzt keine Rechtsberatung.</p>
    </article>
  )
}
