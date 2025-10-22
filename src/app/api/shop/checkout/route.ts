// src/app/api/shop/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const ID = process.env.STRIPE_PRICE_ID || process.env.STRIPE_PRODUCT_ID

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
    if (!ID) return NextResponse.json({ error: 'Missing STRIPE_PRICE_ID or STRIPE_PRODUCT_ID' }, { status: 500 })

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    let lineItem: Stripe.Checkout.SessionCreateParams.LineItem
    if (ID.startsWith('price_')) {
      lineItem = { price: ID, quantity: 1 }
    } else if (ID.startsWith('prod_')) {
      const prices = await stripe.prices.list({ product: ID, active: true, limit: 1 })
      const first = prices.data[0]
      if (!first) return NextResponse.json({ error: 'No active price for this product' }, { status: 400 })
      lineItem = { price: first.id, quantity: 1 }
    } else {
      return NextResponse.json({ error: 'Bad ID' }, { status: 500 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      allow_promotion_codes: true,
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (e:any) {
    console.error('checkout error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Checkout error' }, { status: 500 })
  }
}