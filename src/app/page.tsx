'use client'

import {
  Container,
  Text,
  useToast,
  Button,
  Tooltip,
  Grid,
  Box,
  Image,
  VStack,
} from '@chakra-ui/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, parseEther, formatEther } from 'ethers'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useRouter } from 'next/navigation'

const testAddress = '0x502fb0dFf6A2adbF43468C9888D1A26943eAC6D1' // You can change the test address

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [balance, setBalance] = useState<string>('0')

  const { address, isConnected } = useAppKitAccount()
  const { caipNetwork, chainId } = useAppKitNetwork()
  const { walletProvider } = useAppKitProvider('eip155')
  const toast = useToast()
  const t = useTranslation()
  const router = useRouter()

  // Only check balance when user is actually connected (not on page load)
  useEffect(() => {
    const checkBalance = async () => {
      // Only proceed if user is connected AND we have a provider
      if (!isConnected || !address || !walletProvider) {
        setBalance('0')
        return
      }

      try {
        const provider = new BrowserProvider(walletProvider as any)
        const balance = await provider.getBalance(address)
        setBalance(formatEther(balance))
      } catch (error) {
        console.error('Error fetching balance:', error)
        // Don't show error toast on page load, just log it
        setBalance('0')
      }
    }

    // Add a small delay to ensure connection is fully established
    if (isConnected && address && walletProvider) {
      const timeoutId = setTimeout(checkBalance, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [address, walletProvider, chainId, isConnected])

  const handleSend = async () => {
    setTxHash('')
    setTxLink('')

    if (!address || !walletProvider) {
      toast({
        title: t.common.error,
        description: t.home.notConnected,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    console.log('Current network:', caipNetwork, 'Chain ID:', chainId)

    setIsLoading(true)
    try {
      const provider = new BrowserProvider(walletProvider as any)

      const network = await provider.getNetwork()
      console.log('Provider network:', network)

      const signer = await provider.getSigner()
      console.log('Signer address:', await signer.getAddress())

      const tx = await signer.sendTransaction({
        to: testAddress,
        value: parseEther('0.00001'),
      })

      const receipt = await tx.wait(1)

      setTxHash(receipt?.hash)

      let explorerUrl = 'https://sepolia.etherscan.io/tx/'
      if (chainId === 11155420) {
        // OP Sepolia
        explorerUrl = 'https://sepolia-optimism.etherscan.io/tx/'
      } else if (chainId === 84532) {
        // Base Sepolia
        explorerUrl = 'https://sepolia.basescan.org/tx/'
      }

      setTxLink(explorerUrl + receipt?.hash)

      toast({
        title: t.common.success,
        description: `${t.home.transactionSuccess}: 0.00001 ETH to ${testAddress}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error: any) {
      console.error('Transaction failed:', error)

      let errorMessage = 'Unknown error occurred'
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.reason) {
        errorMessage = error.reason
      } else if (error?.code) {
        errorMessage = `Error code: ${error.code}`
      }

      toast({
        title: t.home.transactionFailed,
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleArtworkClick = (artworkNumber: number) => {
    router.push(`/artwork-${artworkNumber}`)
  }

  const hasEnoughBalance = Number(balance) >= 0.00001

  return (
    <Container maxW="container.lg" py={20}>
      <VStack spacing={8} align="stretch">
        {/* Image Gallery */}
        <Box>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {Array.from({ length: 9 }, (_, index) => {
              const artworkNumber = index + 1
              return (
                <Box
                  key={index}
                  position="relative"
                  overflow="hidden"
                  borderRadius="lg"
                  bg="gray.800"
                  transition="all 0.3s ease-in-out"
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleArtworkClick(artworkNumber)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleArtworkClick(artworkNumber)
                    }
                  }}
                  aria-label={`View Artwork #${artworkNumber} in full size`}
                >
                  <Image
                    src="/huangshan.png"
                    alt={`Artwork ${artworkNumber}`}
                    width="100%"
                    height="200px"
                    objectFit="cover"
                    borderRadius="lg"
                    userSelect="none"
                    draggable="false"
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bg="blackAlpha.700"
                    color="white"
                    p={2}
                    borderBottomRadius="lg"
                    transition="background-color 0.3s ease-in-out"
                    _groupHover={{ bg: 'blackAlpha.800' }}
                  >
                    <Text fontSize="sm" textAlign="center" fontWeight="medium">
                      Artwork #{artworkNumber}
                    </Text>
                  </Box>
                </Box>
              )
            })}
          </Grid>
        </Box>

        {/* Debug info - only show when connected */}
        {isConnected && (
          <VStack spacing={2} align="start" bg="gray.900" p={4} borderRadius="md">
            <Text fontSize="sm" color="gray.400">
              Network: {caipNetwork?.name || 'Unknown'} (Chain ID: {chainId})
            </Text>

            <Text fontSize="sm" color="gray.400">
              Connected wallet address: <strong>{address}</strong>
            </Text>

            <Text fontSize="sm" color="gray.400">
              Balance: {parseFloat(balance).toFixed(5)} ETH
            </Text>

            <Text fontSize="sm" color="gray.400">
              Recipient address: <strong>{testAddress}</strong>
            </Text>
          </VStack>
        )}

        {/* Only show send button when connected */}
        {isConnected && (
          <Box textAlign="center">
            <Tooltip
              label={!hasEnoughBalance ? t.home.insufficientBalance : ''}
              isDisabled={hasEnoughBalance}
              hasArrow
              bg="black"
              color="white"
              borderWidth="1px"
              borderColor="red.500"
              borderRadius="md"
              p={2}
            >
              <Button
                onClick={handleSend}
                isLoading={isLoading}
                loadingText={t.common.loading}
                bg="#45a2f8"
                color="white"
                _hover={{
                  bg: '#3182ce',
                }}
                isDisabled={!hasEnoughBalance}
              >
                {t.home.sendEth}
              </Button>
            </Tooltip>
          </Box>
        )}

        {/* Transaction result - only show when there's a transaction */}
        {txHash && isConnected && (
          <Text py={4} fontSize="14px" color="#45a2f8" textAlign="center">
            <Link target="_blank" rel="noopener noreferrer" href={txLink ? txLink : ''}>
              {txHash}
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  )
}
