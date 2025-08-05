'use client'

import { Container, Box, Image, Button, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

type Props = {
  params: { artworkId: string }
}

export default function ArtworkPage({ params }: Props) {
  const router = useRouter()
  const artworkNumber = params.artworkId.replace('artwork-', '')

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} align="stretch">
        {/* Full-width artwork at top */}
        <Box w="100%">
          <Image
            src="/huangshan.png"
            alt={`Artwork #${artworkNumber}`}
            width="100%"
            height="auto"
            objectFit="cover"
            borderRadius="lg"
            userSelect="none"
            draggable="false"
          />
        </Box>
      </VStack>
    </Container>
  )
}
