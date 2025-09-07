import type { Metadata, Viewport } from 'next'

import '@/styles/globals.css'

import localFont from 'next/font/local'

import Analytics from '@/components/analytics'
import { env } from '@/env'
import { cn } from '@/utils/cn'

type LayoutProps = {
  children: React.ReactNode
}

const SFMono = localFont({
  src: [
    {
      path: '../../public/fonts/SF-Mono-Regular.otf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SF-Mono-Bold.otf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SF-Mono-Medium.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SF-Mono-Semibold.otf',
      weight: '600',
      style: 'normal'
    }
  ],
  variable: '--font-sf-mono'
})

const SFPro = localFont({
  src: [
    {
      path: '../../public/fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SF-Pro-Display-Semibold.otf',
      weight: '600',
      style: 'normal'
    }
  ],
  variable: '--font-sf-pro'
})

const MY_NAME = 'Nelson Lai'
const SITE_URL = env.NEXT_PUBLIC_SITE_URL
const SITE_DESCRIPTION =
  'Experience the power of Zsh on the web. Zsh Web is a simulation of the Zsh shell, allowing you to try shell commands in a browser-based environment.'
const SITE_TITLE = 'Zsh Web'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  authors: {
    name: MY_NAME,
    url: 'https://nelsonlai.dev'
  },
  manifest: '/site.webmanifest',
  twitter: {
    card: 'summary_large_image',
    title: MY_NAME,
    description: SITE_DESCRIPTION,
    site: '@nelsonlaidev',
    siteId: '1152256803746377730',
    creator: '@nelsonlaidev',
    creatorId: '1152256803746377730',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_DESCRIPTION
      }
    ]
  },
  alternates: {
    canonical: SITE_URL
  },
  keywords: ['zsh', 'zsh web', 'shell'],
  creator: 'nelsonlaidev',
  openGraph: {
    url: SITE_URL,
    type: 'website',
    title: SITE_TITLE,
    siteName: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en-US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_DESCRIPTION,
        type: 'image/png'
      }
    ]
  },
  icons: {
    icon: {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon.ico'
    },
    apple: [
      {
        type: 'image/png',
        url: '/apple-touch-icon.png',
        sizes: '180x180'
      }
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/favicon.svg',
        sizes: 'any'
      },
      {
        rel: 'icon',
        type: 'image/png',
        url: '/favicon-16x16.png',
        sizes: '16x16'
      },
      {
        rel: 'icon',
        type: 'image/png',
        url: '/favicon-32x32.png',
        sizes: '32x32'
      }
    ]
  }
}

export const viewport: Viewport = {
  themeColor: {
    color: '#000000'
  }
}

const Layout = (props: LayoutProps) => {
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

export default Layout
