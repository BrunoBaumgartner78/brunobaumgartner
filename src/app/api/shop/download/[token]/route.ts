// src/app/api/shop/download/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export const runtime = 'nodejs'

// --- S3 Setup ---
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const S3_BUCKET = process.env.S3_BUCKET
const s3 = S3_BUCKET
  ? new S3Client({
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })
  : null

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const key = `dl:${params.token}`
  const data = await redis.hgetall<Record<string, string>>(key)
  if (!data?.fileKey) return NextResponse.json({ error: 'Invalid token' }, { status: 400 })

  const exp = Number(data.exp || '0')
  const remaining = Number(data.remaining || '0')
  if (Date.now() > exp || remaining <= 0) return NextResponse.json({ error: 'Token expired/used up' }, { status: 403 })

  await redis.hincrby(key, 'remaining', -1)

  if (s3 && S3_BUCKET) {
    const cmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: data.fileKey, ResponseContentDisposition: 'attachment' })
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 })
    return NextResponse.redirect(url, 302)
  }

  return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
}
