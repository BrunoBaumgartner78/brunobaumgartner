// src/app/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

import { getRecentPosts, getGallery, getBooks } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import BooksStrip from '@/app/components/BooksStrip'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Bruno Baumgartner – Autor',
  description:
    'Offizielle Seite von Bruno Baumgartner: Blog, Texte und Einblicke in Arbeit, Themen und Projekte. Schnell, zugänglich, fokussiert.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Bruno Baumgartner – Autor',
    description:
      'Texte, Blog und Einblicke von Bruno Baumgartner. Minimal, schnell und zugänglich.',
    images: ['/og.png'],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
}

export default async function Home() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainbloom.ch'

  const [posts, gallery, books] = await Promise.all([
    getRecentPosts(5).catch(() => []),
    getGallery(6).catch(() => []),
    getBooks(5).catch(() => []),
  ])

  // JSON-LD für Bücher (ItemList)
  const booksJsonLd =
    books && books.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: books.map((b: any, i: number) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${site}/buecher/${b.slug}`,
            name: b.title,
          })),
        }
      : null

  return (
    <div
      className="wrap site-main"
      style={{ display: 'grid', gap: '3rem', paddingTop: '3rem', paddingBottom: '4rem' }}
    >
      {/* ===== Hero / SEO-Intro ===== */}
      <section aria-labelledby="hero" style={{ display: 'grid', gap: '0.75rem' }}>
        <h1 id="hero" style={{ fontSize: '2rem', lineHeight: 1.2, margin: 0 }}>
          Bruno Baumgartner – Autor
        </h1>
        <p style={{ margin: 0, maxWidth: 820 }}>
          Willkommen auf <strong>brainbloom.ch</strong>, der offiziellen Website von{' '}
          <strong>Bruno Baumgartner</strong>. Hier erscheinen Blogbeiträge, kurze Texte, Leseproben
          und Einblicke in laufende Projekte – bewusst schlank umgesetzt, damit Inhalte schnell und
          barrierearm erreichbar sind.
        </p>
        <p style={{ margin: 0, maxWidth: 820 }}>
          Thematisch zwischen <em>Beobachtung</em> und <em>Reflexion</em>: Schreiben im Alltag,
          Denkwege, Fundstücke aus Literatur, Gesellschaft und Praxis. Im{' '}
          <Link className="underline" href="/blog">
            Blog
          </Link>{' '}
          gibt es laufend Neues, ausgewählte Bilder liegen in der{' '}
          <Link className="underline" href="/galerie">
            Galerie
          </Link>
          .
        </p>
      </section>

      {/* ===== Über / Schwerpunkte ===== */}
      <section aria-labelledby="ueber" style={{ display: 'grid', gap: '0.5rem' }}>
        <h2 id="ueber" style={{ fontSize: '1.5rem', margin: 0 }}>
          Über Bruno Baumgartner
        </h2>
        <p style={{ margin: 0, maxWidth: 820 }}>
          Bruno Baumgartner schreibt kurze Formen – Notate, Essays, Miniaturen. Im Fokus:
          <strong> Sprache als Werkzeug</strong>, aufmerksame Wahrnehmung und Schnittstellen von{' '}
          <strong>Alltag, Denken und Gestaltung</strong>. Diese Seite dokumentiert laufende Arbeit
          in einer ruhigen, ablenkungsarmen Umgebung.
        </p>

        <h3 style={{ fontSize: '1.125rem', margin: '0.75rem 0 0.25rem' }}>Schwerpunkte</h3>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', maxWidth: 820 }}>
          <li>Schreiben & Arbeitsprozess: kleine Methoden, große Wirkung</li>
          <li>Beobachtung & Gesellschaft: präzise Sprache für Alltägliches</li>
          <li>Textexperimente: Formen zwischen Notiz, Essay und Miniatur</li>
        </ul>
      </section>

      {/* ===== Bücher (5 Karten) ===== */}
      <BooksStrip books={books} />

      {/* ===== Blog: nur 5 neueste ===== */}
      <section aria-labelledby="blog-heading">
        <h2 id="blog-heading" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          Neu im Blog
        </h2>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gap: '1.25rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          {posts.map((post: any) => (
            <li
              key={post._id}
              className="card"
              style={{
                border: '1px solid var(--color-border, #e5e7eb)',
                borderRadius: 12,
                padding: 16,
                background: 'var(--card-bg, #fff)',
              }}
            >
              <article>
                {post.mainImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(post.mainImage).width(800).height(420).fit('crop').url()}
                    alt={post.mainImage.alt || post.title}
                    style={{ width: '100%', height: 'auto', borderRadius: 10, marginBottom: 12 }}
                    loading="lazy"
                  />
                )}

                <h3 style={{ fontSize: '1.125rem', margin: '0 0 6px' }}>
                  <Link href={`/blog/${post.slug}`} className="no-underline hover:underline">
                    {post.title}
                  </Link>
                </h3>

                {post.publishedAt && (
                  <p style={{ margin: '0 0 8px', fontSize: 12, opacity: 0.7 }}>
                    {new Date(post.publishedAt).toLocaleDateString('de-CH')}
                  </p>
                )}

                {post.excerpt && (
                  <p className="clamp-2" style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                    {post.excerpt}
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 16 }}>
          <Link href="/blog" className="underline">
            Alle Beiträge ansehen
          </Link>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section aria-labelledby="faq" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 id="faq" style={{ fontSize: '1.5rem', margin: 0 }}>
          Häufige Fragen
        </h2>

        <details>
          <summary>
            <strong>Wer ist Bruno Baumgartner?</strong>
          </summary>
          <div>
            Autor kurzer Formen – von Notaten bis Miniaturen – über Wahrnehmung, Sprache und
            Alltag. Neue Texte erscheinen fortlaufend im{' '}
            <Link href="/blog" className="underline">
              Blog
            </Link>
            .
          </div>
        </details>

        <details>
          <summary>
            <strong>Was finde ich auf brainbloom.ch?</strong>
          </summary>
          <div>
            Eine kuratierte Sammlung aktueller Beiträge, Leseproben und Bilder in der{' '}
            <Link href="/galerie" className="underline">
              Galerie
            </Link>{' '}
            – bewusst schnell und zugänglich umgesetzt.
          </div>
        </details>

        <details>
          <summary>
            <strong>Wie kann ich Kontakt aufnehmen?</strong>
          </summary>
          <div>
            Rechtliche Angaben und Kontakt im{' '}
            <Link href="/impressum" className="underline">
              Impressum
            </Link>
            .
          </div>
        </details>
      </section>

      {/* ===== JSON-LD: Person / Website / Bücher-ItemList / FAQ ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Bruno Baumgartner',
            url: site,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Brainbloom',
            url: site,
          }),
        }}
      />
      {booksJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(booksJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Wer ist Bruno Baumgartner?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Autor kurzer Formen – Notate, Miniaturen, Essays – über Wahrnehmung, Sprache und Alltag.',
                },
              },
              {
                '@type': 'Question',
                name: 'Was finde ich auf brainbloom.ch?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Aktuelle Beiträge, Leseproben und Bilder – bewusst schnell und zugänglich.',
                },
              },
              {
                '@type': 'Question',
                name: 'Wie kann ich Kontakt aufnehmen?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Impressum: brainbloom.ch/impressum.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}
