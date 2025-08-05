import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://ip-enforcer.netlify.app'),

  title: 'IP Enforcer',
  description: 'Protect your artwork in the most efficient way.',

  keywords: ['Web3', 'Next.js', 'Ethereum', 'DApp', 'Blockchain', 'IP', 'AI'],
  authors: [{ name: 'Julien', url: 'https://github.com/julienbrg' }],

  openGraph: {
    title: 'IP Enforcer',
    description: 'Protect your artwork in the most efficient way.',
    url: 'https://ip-enforcer.netlify.app',
    siteName: 'IP Enforcer',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'IP Enforcer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'IP Enforcer',
    description: 'Protect your artwork in the most efficient way.',
    images: ['/huangshan.png'],
    creator: '@julienbrg',
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

  verification: {
    google: 'your-google-site-verification',
  },
}
