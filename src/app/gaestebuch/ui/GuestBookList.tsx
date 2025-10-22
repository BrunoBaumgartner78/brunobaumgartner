// src/app/components/GuestbookList.tsx
"use client"

import { useEffect, useState } from "react"
import s from "./GuestBookList.module.css"

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

  useEffect(() => { load(true) }, [])
  useEffect(() => {
    const handler = () => load(true)
    window.addEventListener("guestbook:new", handler)
    return () => window.removeEventListener("guestbook:new", handler)
  }, [])

  const hasMore = offset < total

  return (
    <section className={s.list} aria-busy={loading || undefined}>
      {items.length === 0 && !loading && (
        <div className={s.card}>
          <p className={s.empty}>Keine Einträge vorhanden.</p>
        </div>
      )}

      {items.map((it) => (
        <article key={it.id} className={s.card}>
          <div className={s.meta}>
            {new Date(it.createdAt).toLocaleString("de-CH")}
          </div>
          <h3 className={s.title}>{it.name}</h3>
          <p className={s.message}>{it.message}</p>
        </article>
      ))}

      {error && <p className={s.err}>{error}</p>}

      <div className={s.actions}>
        {hasMore && (
          <button onClick={() => load(false)} disabled={loading} className={s.button}>
            {loading ? "Laden…" : "Mehr laden"}
          </button>
        )}
      </div>
    </section>
  )
}
