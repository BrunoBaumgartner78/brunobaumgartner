import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs' // Zugriff auf process.env

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_KEY
  const got = req.headers.get('x-admin-key') ?? ''
  if (!adminKey || got !== adminKey) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  return NextResponse.json({ ok: true, time: new Date().toISOString() })
}
