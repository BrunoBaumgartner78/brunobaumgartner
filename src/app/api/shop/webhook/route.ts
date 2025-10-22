// src/app/api/shop/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { redis } from '@/lib/redis'
import crypto from 'node:crypto'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature') as string
  const raw = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const fileKey = session.metadata?.fileKey
    const email = session.customer_details?.email || session.customer_email || ''
    if (fileKey) {
      const token = crypto.randomUUID()
      await redis.hmset(`dl:${token}`, {
        fileKey,
        email,
        remaining: 5,                                  // 5 Downloads
        exp: String(Date.now() + 24 * 60 * 60 * 1000), // 24h
      })
      await redis.expire(`dl:${token}`, 24 * 60 * 60)
      // Optional: E-Mail mit dem Link senden
      // const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/shop/download/${token}`
    }
  }

  return NextResponse.json({ received: true })
}
