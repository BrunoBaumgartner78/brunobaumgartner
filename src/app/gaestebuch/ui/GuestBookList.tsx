"use client"
import { useEffect, useState } from "react"

type Entry = { id: string; name: string; message: string; createdAt: number }

export default function GuestbookList() {
  const [items, setItems] = useState<Entry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const limit = 10

  async function load(reset = false) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/guestbook?offset=${reset ? 0 : offset}&limit=${limit}`, {
        cache: "no-store",
      })
      if (!res.ok) throw new Error(await res.text())
      const data = (await res.json()) as { items: Entry[]; total: number }

      if (reset) {
        setItems(data.items || [])
        setOffset((data.items || []).length)
      } else {
        setItems((prev) => [...prev, ...(data.items || [])])
        setOffset((prev) => prev + (data.items?.length || 0))
      }
      setTotal(data.total || 0)
    } catch {
      setError("Konnte Einträge nicht laden.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(true)
  }, [])

  useEffect(() => {
    const handler = () => load(true)
    window.addEventListener("guestbook:new", handler)
    return () => window.removeEventListener("guestbook:new", handler)
  }, [])

  const hasMore = offset < total

  return (
    <section className="grid gap-3">
      {items.length === 0 && !loading && <p>Keine Einträge vorhanden.</p>}

      {items.map((it) => (
        <article key={it.id} className="border rounded-lg p-3">
          <div className="text-sm opacity-70">
            {new Date(it.createdAt).toLocaleString("de-CH")}
          </div>
          <h3 className="m-0">{it.name}</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{it.message}</p>
        </article>
      ))}

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex items-center justify-center">
        {hasMore && (
          <button onClick={() => load(false)} disabled={loading} className="border rounded px-4 py-2">
            {loading ? "Laden…" : "Mehr laden"}
          </button>
        )}
      </div>
    </section>
  )
}
