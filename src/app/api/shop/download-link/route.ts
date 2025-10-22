// src/app/api/shop/download-link/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs' // Stripe braucht Node (kein Edge)

const SK = process.env.STRIPE_SECRET_KEY
if (!SK) {
  // Hart failen, damit der Fehler im Log sofort sichtbar ist
  throw new Error('Missing STRIPE_SECRET_KEY')
}
const stripe = new Stripe(SK, { apiVersion: '2024-06-20' })

const PRICE_ID = process.env.STRIPE_PRICE_ID || ''      // live/test je nach Umgebung
const PRODUCT_ID = process.env.STRIPE_PRODUCT_ID || ''  // optional
const BLOB_PDF_URL = process.env.BLOB_PDF_URL || ''     // unbedingt absoluter HTTPS-Link

function isAbsoluteUrl(u: string) {
  try {
    const { protocol } = new URL(u)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const { origin } = new URL(req.url)

  // 1) session_id aus FormData ODER JSON holen
  let sessionId = ''
  try {
    const ct = req.headers.get('content-type') || ''
    if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const form = await req.formData()
      sessionId = String(form.get('session_id') || '')
    } else if (ct.includes('application/json')) {
      const body = await req.json().catch(() => ({}))
      sessionId = typeof body?.session_id === 'string' ? body.session_id : ''
    }
  } catch {
    // ignorieren – unten wird sauber umgeleitet
  }

  if (!sessionId) {
    return NextResponse.redirect(
      `${origin}/shop/success?err=${encodeURIComponent('Missing session_id')}`,
      { status: 303 }
    )
  }

  // 2) Stripe-Session holen (+ Line Items expanden)
  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    })
  } catch (e: any) {
    console.error('download-link: session retrieve failed', e)
    return NextResponse.redirect(
      `${origin}/shop/success?session_id=${encodeURIComponent(sessionId)}&err=${encodeURIComponent(e?.message || 'Session lookup failed')}`,
      { status: 303 }
    )
  }

  // 3) Nur bezahlte, abgeschlossene Sessions zulassen
  if (session.payment_status !== 'paid' || session.status !== 'complete') {
    return NextResponse.redirect(
      `${origin}/shop/success?session_id=${encodeURIComponent(sessionId)}&err=${encodeURIComponent('Payment not completed')}`,
      { status: 303 }
    )
  }

  // 4) Produkt/Preis matchen (Preis-ID ODER Produkt-ID)
  const ok = (session.line_items?.data || []).some((li: any) => {
    const p = li?.price
    return (PRICE_ID && p?.id === PRICE_ID) || (PRODUCT_ID && p?.product === PRODUCT_ID)
  })
  if (!ok) {
    return NextResponse.redirect(
      `${origin}/shop/success?session_id=${encodeURIComponent(sessionId)}&err=${encodeURIComponent('Wrong item')}`,
      { status: 303 }
    )
  }

  // 5) Download-URL prüfen (muss absolut sein)
  if (!BLOB_PDF_URL || !isAbsoluteUrl(BLOB_PDF_URL)) {
    return NextResponse.redirect(
      `${origin}/shop/success?session_id=${encodeURIComponent(sessionId)}&err=${encodeURIComponent('Download URL missing or not absolute')}`,
      { status: 303 }
    )
  }

  // 6) Weiterleiten zur Datei (302)
  return NextResponse.redirect(BLOB_PDF_URL, { status: 302 })
}
