import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const blobUrl = await redis.get<string>(`dl:${token}`)
    if (!blobUrl) {
      return NextResponse.json({ error: 'Link expired or invalid' }, { status: 410 })
    }

    // Optional: Einmaliger Abruf → Token direkt löschen (oder TTL abwarten)
    await redis.del(`dl:${token}`)

    // PDF holen und an den Client ausliefern
    const upstream = await fetch(blobUrl)
    if (!upstream.ok) throw new Error(`Fetch failed: ${upstream.status}`)

    const body = await upstream.arrayBuffer()
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Complexus-Immunitas-Mentis.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('file route error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
