'use client'

export default function DeleteButton({ id, onDeleted }: { id: string; onDeleted?: () => void }) {
  const handleDelete = async () => {
    const key = window.prompt('Admin-Key eingeben:')
    if (!key) return

    const res = await fetch(`/api/guestbook/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': key },
    })

    if (res.ok) {
      onDeleted?.()
    } else {
      const data = await res.json().catch(() => ({}))
      alert(`Löschen fehlgeschlagen: ${data?.error || res.statusText}`)
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        border: '1px solid var(--color-border, #ddd)',
        background: 'transparent',
        padding: '0.25rem 0.5rem',
        borderRadius: 6,
        fontSize: '0.8rem',
        cursor: 'pointer',
      }}
      aria-label="Eintrag löschen"
      title="Eintrag löschen"
    >
      Löschen
    </button>
  )
}
