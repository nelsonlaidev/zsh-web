import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'

import { cn } from 'cn'
import localFont from 'next/font/local'

import { Analytics } from '@/components/analytics'
import { MY_NAME, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, TWITTER_USER_ID, TWITTER_USERNAME } from '@/constants/site'

const SFMono = localFont({
  src: [
    {
      path: '../../public/fonts/SF-Mono-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Mono-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Mono-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Mono-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-sf-mono',
})

const SFPro = localFont({
  src: [
    {
      path: '../../public/fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-sf-pro',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  creator: 'nelsonlaidev',
  manifest: '/site.webmanifest',
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: {
    name: MY_NAME,
    url: 'https://nelsonlai.dev',
  },
  openGraph: {
    url: SITE_URL,
    siteName: SITE_TITLE,
    type: 'website',
    locale: 'en-US',
    images: {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: SITE_DESCRIPTION,
      type: 'image/png',
    },
  },
  twitter: {
    card: 'summary_large_image',
    siteId: TWITTER_USER_ID,
    creatorId: TWITTER_USER_ID,
    site: `@${TWITTER_USERNAME}`,
    creator: `@${TWITTER_USERNAME}`,
  },
  icons: {
    icon: {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon.ico',
    },
    apple: [
      {
        type: 'image/png',
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/favicon.svg',
        sizes: 'any',
      },
      {
        rel: 'icon',
        type: 'image/png',
        url: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        rel: 'icon',
        type: 'image/png',
        url: '/favicon-32x32.png',
        sizes: '32x32',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: {
    color: '#000000',
  },
}

export default function Layout(props: LayoutProps<'/'>) {
  const { children } = props

  return (
    <html lang='en-US' className={cn(SFMono.variable, SFPro.variable)}>
      <body className='bg-[#1e1e1e] font-sans text-white'>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
