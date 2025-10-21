// src/app/og/route.tsx
import { ImageResponse } from 'next/og'
import { SITE_TAGLINE } from '@/lib/seo'

export const runtime = 'edge'
export const revalidate = 3600 // 1h

const SAND = '#F3E9D2'         // sandfarbener Hintergrund
const INK  = '#1F2937'         // dunkelgraue Schrift
const MUTED= '#6B7280'         // Unterzeile

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Bruno Baumgartner'
  const subtitle = searchParams.get('subtitle') || SITE_TAGLINE

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: SAND,
          padding: '64px',
        }}
      >
        {/* Kopfzeile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 14, height: 14, borderRadius: 9999, background: INK, opacity: 0.9,
            }}
          />
          <div style={{ fontSize: 24, color: INK, letterSpacing: 0.5 }}>Brainbloom</div>
        </div>

        {/* Titelblock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 700,
              color: INK,
              letterSpacing: -1,
              maxWidth: 980,
              textWrap: 'balance' as any,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 32,
                lineHeight: 1.25,
                color: MUTED,
                maxWidth: 980,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Fußzeile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: MUTED }}>
          <div style={{ fontSize: 22 }}>brunobaumgartner.ch</div>
          <div
            style={{
              fontSize: 18,
              border: `2px solid ${MUTED}`,
              padding: '8px 14px',
              borderRadius: 9999,
            }}
          >
            © {new Date().getFullYear()} Bruno Baumgartner
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
