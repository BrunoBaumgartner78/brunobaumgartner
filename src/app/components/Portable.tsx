import { PortableText, type PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  /* hier ggf. eigene Block/Mark-Renderer */
}

export default function Portable({ value }: { value: any }) {
  return <PortableText value={value} components={components} />
}
