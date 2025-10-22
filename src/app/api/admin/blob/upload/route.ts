// Lädt eine Datei von einer öffentlichen URL in deinen Vercel-Blob-Store (privat)
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const ADMIN_KEY = process.env.ADMIN_KEY
  if (!ADMIN_KEY || req.headers.get('x-admin-key') !== ADMIN_KEY) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  // Body: { url: "https://…/quelle.pdf", path: "pdf/Complexus_Immunitas_Mentis.pdf" }
  const { url, path, access } = await req.json().catch(() => ({}))
  if (!url || !path) {
    return NextResponse.json({ error: 'url & path required' }, { status: 400 })
  }

  const res = await fetch(url)
  if (!res.ok) {
    return NextResponse.json({ error: `fetch failed ${res.status}` }, { status: 502 })
  }

  const buf = Buffer.from(await res.arrayBuffer())
  const { url: blobUrl } = await put(path, buf, {
    access: access === 'public' ? 'public' : 'private',
    contentType: 'application/pdf',
    addRandomSuffix: false,
  })

  return NextResponse.json({ url: blobUrl })

  
}
