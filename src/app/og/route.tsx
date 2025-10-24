// src/app/og/route.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'

const size = { width: 1200, height: 630 }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Bruno Baumgartner – Autor'
  const subtitle =
    searchParams.get('subtitle') ||
    'Texte, Blog & Projekte. Minimal, schnell, zugänglich.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background: '#EFE7DB',
          color: '#0b0d0e',
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ marginTop: 18, fontSize: 28, fontWeight: 500, opacity: 0.9, maxWidth: 1000 }}>
          {subtitle}
        </div>
        <div
          style={{
            position: 'absolute', bottom: 40, left: 64, right: 64,
            display: 'flex', justifyContent: 'space-between', fontSize: 22, opacity: 0.9,
          }}
        >
          <span>brainbloom.ch</span>
          <span>© {new Date().getFullYear()} Bruno Baumgartner</span>
        </div>
      </div>
    ),
    size
  )
}
