// src/app/components/GuestbookForm.tsx
"use client"

import { useState } from "react"
import s from "./GuestbookForm.module.css"

export default function GuestbookForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setOk(false)

    const n = name.trim()
    const m = message.trim()
    if (!n || !m) {
      setError("Bitte Name und Nachricht eingeben.")
      return
    }

    setPending(true)
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, message: m }),
      })
      if (!res.ok) throw new Error(await res.text())
      setOk(true)
      setMessage("")
      onCreated?.()
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("guestbook:new"))
      }
    } catch {
      setError("Speichern fehlgeschlagen.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className={s.form} aria-label="Gästebuch Formular">
      <div className={s.row}>
        <label className={s.label} htmlFor="gb-name">Name</label>
        <input
          id="gb-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={s.field}
          placeholder="Dein Name"
        />
      </div>

      <div className={s.row}>
        <label className={s.label} htmlFor="gb-msg">Nachricht</label>
        <textarea
          id="gb-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          maxLength={500}
          className={`${s.field} ${s.textarea}`}
          placeholder="Schreib etwas Nettes …"
        />
        <small className={s.counter}>{message.length}/500</small>
      </div>

      <div className={s.actions}>
        <button
          type="submit"
          disabled={pending}
          className={s.button}
          aria-busy={pending || undefined}
        >
          {pending ? "Senden…" : "Eintragen"}
        </button>

        <div className={s.status}>
          {ok && <span className={s.ok}>Danke! Eintrag gespeichert.</span>}
          {error && <span className={s.err}>{error}</span>}
        </div>
      </div>
    </form>
  )
}
