// src/app/api/shop/mode/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const key = process.env.STRIPE_SECRET_KEY || ''
    const priceId = process.env.STRIPE_PRICE_ID || ''
    const stripe = new Stripe(key, { apiVersion: '2024-06-20' })

    let price: Stripe.Price | null = null
    if (priceId) {
      try { price = await stripe.prices.retrieve(priceId) } catch {}
    }

    return NextResponse.json({
      mode:
        key.startsWith('sk_live_') ? 'LIVE' :
        key.startsWith('sk_test_') ? 'TEST' :
        'UNKNOWN',
      priceId,
      priceFound: !!price,
      priceLivemode: price ? price.livemode : null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 })
  }
}
