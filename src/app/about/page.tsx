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
            <Box bg="whiteAlpha.100" p={6} borderRadius="lg">
              <Heading as="h2" size="lg" mb={4}>
                What is IP Enforcer?
              </Heading>
              <Text mb={4}>Content content content content content content</Text>
            </Box>
          </section>
        </VStack>
      </Container>
    </main>
  )
}
