

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// components/Portable.tsx â€” Portable Text Renderer mit A11y
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'


const components: PortableTextComponents = {
types: {
image: ({value}) => {
const alt: string = value?.alt || ''
const src = urlFor(value).width(1200).fit('max').url()
return (
<figure>
{/* next/image fÃ¼r LCPâ€‘freundliches Lazyâ€‘Loading */}
<Image src={src} width={1200} height={800} alt={alt} sizes="(min-width: 960px) 960px, 100vw" />
{value?.caption && <figcaption className="text-sm text-muted mt-2">{value.caption}</figcaption>}
</figure>
)
}
}
}


export function PortableBody({value}:{value:any}){
return <PortableText value={value} components={components} />
}

