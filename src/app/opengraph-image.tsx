import { ImageResponse } from 'next/og'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0b1220', color: '#eef2ff'
      }}>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>
          Bruno Baumgartner – Autor
        </div>
      </div>
    ),
    { ...size }
  )
}
