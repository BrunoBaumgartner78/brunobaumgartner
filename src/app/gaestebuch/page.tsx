import type { Metadata } from 'next'
import GuestbookForm from './ui/GuestBookForm'
import GuestbookList from './ui/GuestBookList'

export const metadata: Metadata = {
  title: 'Gästebuch',
  description: 'Hinterlasse eine kurze Nachricht.',
}

export default function GuestbookPage() {
  return (
    <div className="wrap" style={{ display: 'grid', gap: '1.5rem', padding: '1rem 0' }}>
      <header style={{ display: 'grid', gap: '0.25rem' }}>
        <h1 style={{ margin: 0 }}>Gästebuch</h1>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Danke für deinen Eintrag. Bitte bleib respektvoll und kurz.
        </p>
      </header>

      <GuestbookForm />

      <GuestbookList />
    </div>
  )
}
