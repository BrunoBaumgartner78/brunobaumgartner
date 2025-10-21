// src/app/studio/[[...tool]]/page.tsx
// Server-Komponente: leitet /studio auf das gehostete Sanity Studio um

import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic' // stellt sicher, dass die Redirect-Logik immer ausgeführt wird

export default function StudioRedirectPage() {
  const target =
    process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||
    'https://iv7qlw2l.sanity.studio'

  redirect(target)
}
