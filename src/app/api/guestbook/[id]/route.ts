// src/app/api/guestbook/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { redis } from '../../../../lib/redis'

export const runtime = 'edge'

const LIST_KEY = 'guestbook:current'
const ADMIN_KEY = process.env.GUESTBOOK_ADMIN_KEY || process.env.ADMIN_KEY

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!ADMIN_KEY) {
      return NextResponse.json({ error: 'admin_key_not_configured' }, { status: 500 })
    }
    // Header prüfen
    const provided = _req.headers.get('x-admin-key') || ''
    if (provided !== ADMIN_KEY) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const id = params.id
    if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 })

    const itemKey = `guestbook:item:${id}`
    const exists = await redis.exists(itemKey)
    if (!exists) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    // Aus Liste entfernen & Hash löschen
    await redis.lrem(LIST_KEY, 0, itemKey)
    await redis.del(itemKey)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('DELETE /api/guestbook/[id] failed', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
