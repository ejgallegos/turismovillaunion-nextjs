'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'

export const GoogleAnalytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const gaTrackingId = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    if (gaTrackingId && process.env.NODE_ENV === 'production') {
        const url = pathname + searchParams.toString()
        window.gtag('config', gaTrackingId, {
            page_path: url,
        })
    }
  }, [pathname, searchParams, gaTrackingId])

  if (process.env.NODE_ENV !== 'production' || !gaTrackingId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaTrackingId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
