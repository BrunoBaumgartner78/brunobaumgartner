// src/app/shop/success/page.tsx
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[]; err?: string | string[] }>
}) {
  const sp = await searchParams
  const sessionId = Array.isArray(sp.session_id) ? sp.session_id[0] : (sp.session_id ?? '')
  const err = Array.isArray(sp.err) ? sp.err[0] : sp.err

  return (
    <section className="wrap" style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      <h1 className="h1" style={{ margin: 0 }}>Danke für deinen Kauf!</h1>

      <p style={{ margin: 0 }}>
        Dein Download ist bereit. Der Link ist aus Sicherheitsgründen zeitlich begrenzt.
      </p>

      {err && (
        <p role="alert" style={{ margin: 0, color: 'var(--red, #b00020)' }}>
          Fehler: {decodeURIComponent(err)}
        </p>
      )}

      <form method="post" action="/api/shop/download-link" style={{ marginTop: 8 }}>
        <input type="hidden" name="session_id" value={sessionId} />
        <button
          type="submit"
          disabled={!sessionId}
          style={{
            padding: '0.8rem 1.1rem',
            borderRadius: 10,
            border: '1px solid var(--color-border, #e5e7eb)',
            background: 'var(--color-card, #f7f7f7)',
            fontWeight: 600,
            cursor: !sessionId ? 'not-allowed' : 'pointer',
          }}
        >
          {sessionId ? 'PDF herunterladen' : 'Warte auf Bestätigung…'}
        </button>
      </form>
    </section>
  )
}
