import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: 'Invalid token' }, { status: 401 })
  }
  const tag = req.nextUrl.searchParams.get('tag') || 'posts'
  revalidateTag(tag)
  return NextResponse.json({ ok: true, tag, at: Date.now() })
}
