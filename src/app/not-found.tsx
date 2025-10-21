import Link from 'next/link'
export default function NotFound(){
  return (
    <section className="wrap prose" aria-labelledby="nf">
      <h1 id="nf">Seite nicht gefunden</h1>
      <p>Die angeforderte Seite existiert nicht (mehr).</p>
      <p><Link href="/" className="underline">Zurück zur Startseite</Link></p>
    </section>
  )
}
