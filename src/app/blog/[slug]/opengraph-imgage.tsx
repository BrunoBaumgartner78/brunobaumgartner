import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/queries'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug).catch(() => null)
  const title = post?.title || 'Blog'
  return new ImageResponse(
    (
      <div style={{
        width:'100%', height:'100%', display:'flex',
        alignItems:'center', justifyContent:'center',
        background:'#0b1220', color:'#eef2ff', padding: 64, textAlign:'center'
      }}>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
      </div>
    ),
    { ...size }
  )
}
