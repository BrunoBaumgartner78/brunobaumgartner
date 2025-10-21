"use client"
import { useState } from "react"

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
      // Liste auffrischen (event-basiert)
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
    <form onSubmit={submit} className="grid gap-3" aria-label="Gästebuch Formular">
      <label className="grid gap-1">
        <span>Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="grid gap-1">
        <span>Nachricht</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          maxLength={500}
          className="border rounded px-3 py-2"
        />
        <small className="opacity-60">{message.length}/500</small>
      </label>

      <div className="flex items-center gap-3">
        <button
          disabled={pending}
          className="border rounded px-4 py-2 bg-black text-white disabled:opacity-50"
        >
          {pending ? "Senden…" : "Eintragen"}
        </button>
        {ok && <span className="text-green-600">Danke! Eintrag gespeichert.</span>}
        {error && <span className="text-red-600">{error}</span>}
      </div>
    </form>
  )
}
