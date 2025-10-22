// src/app/api/admin/secure-example/route.ts
import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs' // optional

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_KEY || req.headers.get('x-admin-key') !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  // ...deine Logik
  return NextResponse.json({ ok: true })
}
