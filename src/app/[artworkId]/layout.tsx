import { Metadata } from 'next'

type Props = {
  params: Promise<{ artworkId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const artworkNumber = resolvedParams.artworkId.replace('artwork-', '')

  return {
    title: `Artwork #${artworkNumber} | IP Enforcer`,
    description: `View Artwork #${artworkNumber} in full resolution`,
    openGraph: {
      title: `Artwork #${artworkNumber} | IP Enforcer`,
      description: `View Artwork #${artworkNumber} in full resolution`,
      url: `https://ip-enforcer.netlify.app/${resolvedParams.artworkId}`,
      siteName: 'IP Enforcer',
      images: [
        {
          url: '/huangshan.png',
          width: 1200,
          height: 630,
          alt: `Artwork #${artworkNumber}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Artwork #${artworkNumber} | IP Enforcer`,
      description: `View Artwork #${artworkNumber} in full resolution`,
      images: ['/huangshan.png'],
    },
  }
}

export default function ArtworkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
