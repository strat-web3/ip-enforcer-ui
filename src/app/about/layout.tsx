import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | IP Enforcer',
  description: 'Learn more about the IP Enforcer',

  openGraph: {
    title: 'About | IP Enforcer',
    description: 'Learn more about the IP Enforcer',
    url: 'https://ip-enforcer.netlify.app/about',
    siteName: 'Genji',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Genji Web3 Application - About Page',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'About | IP Enforcer',
    description: 'Learn more about the IP Enforcer',
    images: ['/huangshan.png'],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
