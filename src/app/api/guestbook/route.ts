// src/app/api/guestbook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { redis } from '../../../lib/redis'

export const runtime = 'edge'

// Keys
const LIST_KEY = 'guestbook:current'

// Hilfsfunktionen
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

async function readBody(req: NextRequest) {
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    return await req.json().catch(() => ({}))
  }
  const txt = await req.text()
  try { return JSON.parse(txt) } catch { return {} }
}

// GET /api/guestbook?offset=0&limit=10
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const offset = clamp(parseInt(searchParams.get('offset') || '0', 10), 0, 10_000)
    const limit = clamp(parseInt(searchParams.get('limit') || '10', 10), 1, 100)

    const total = await redis.llen(LIST_KEY)
    // neueste zuerst: wir speichern am Ende, also holen wir von "total-1" rückwärts
    const start = Math.max(total - offset - limit, 0)
    const end = Math.max(total - offset - 1, -1)
    const range = start <= end
      ? await redis.lrange<string[]>(LIST_KEY, start, end)
      : []

    // Items lesen
    const items = (await Promise.all(
      range.map(key => redis.hgetall<Record<string, string>>(key))
    ))
      .filter(Boolean)
      // neueste oben
      .sort((a: any, b: any) => (Number(b.createdAt) - Number(a.createdAt)))

    return NextResponse.json({ items, total })
  } catch (e) {
    console.error('GET /api/guestbook failed', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

// POST { name, message }
export async function POST(req: NextRequest) {
  try {
    const body = await readBody(req)
    const name = (body?.name || '').toString().trim()
    const message = (body?.message || '').toString().trim()

    if (!name || !message) {
      return NextResponse.json({ error: 'name_and_message_required' }, { status: 400 })
    }

    const id = crypto.randomUUID()
    const key = `guestbook:item:${id}`
    const createdAt = Date.now().toString()

    await redis.hmset(key, { id, name, message, createdAt })
    await redis.rpush(LIST_KEY, key)

    return NextResponse.json({ ok: true, id }, { status: 201 })
  } catch (e) {
    console.error('POST /api/guestbook failed', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
