'use client'

import { Container, Heading, Text, Box, VStack, HStack, Badge } from '@chakra-ui/react'
import { useAppKitAccount } from '@reown/appkit/react'

export default function AboutPage() {
  const { isConnected } = useAppKitAccount()

  return (
    <main>
      <Container maxW="container.md" py={20}>
        <VStack spacing={8} align="stretch">
          <section aria-label="What is Genji">
            <Heading as="h2" size="lg" mb={4}>
              What is IP Enforcer?
            </Heading>
            <Text mb={4}>IP actually matters.</Text>
          </section>
        </VStack>
      </Container>
    </main>
  )
}
