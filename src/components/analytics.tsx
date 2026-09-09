import Script from 'next/script'

import { env } from '@/env'

export function Analytics() {
  if (!env.NEXT_PUBLIC_UMAMI_URL || !env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return null

  return (
    <Script async data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID} src={`${env.NEXT_PUBLIC_UMAMI_URL}/script.js`} />
  )
}
