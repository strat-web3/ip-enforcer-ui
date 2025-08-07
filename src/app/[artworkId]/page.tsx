'use client'

import {
  Container,
  Box,
  Image,
  Button,
  VStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Divider,
  HStack,
  Icon,
  Center,
  useColorModeValue,
  Checkbox,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react'
import { AttachmentIcon, CheckIcon, InfoIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
// Import the AppKit hooks for wallet connection
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'

type Props = {
  params: Promise<{ artworkId: string }>
}

export default function ArtworkPage({ params }: Props) {
  const router = useRouter()
  const [artworkNumber, setArtworkNumber] = useState<string>('')

  // AppKit hooks for wallet connection
  const { open } = useAppKit()
  const { isConnected, address } = useAppKitAccount()

  const [similarityScore] = useState(0.83) // Placeholder value
  const [checkboxes, setCheckboxes] = useState({
    imagesSimilar: similarityScore > 0.8, // Auto-check if similarity > 0.80
    isInfringement: false,
    lacksAuthorization: false,
    publisherSolvent: false,
    publisherContactable: false,
  })

  // Blinking effect state
  const [shouldBlink, setShouldBlink] = useState(false)

  // Modal controls
  const { isOpen, onOpen, onClose } = useDisclosure()

  // AI Recap state
  const [isLoadingRecap, setIsLoadingRecap] = useState(false)
  const [showRecap, setShowRecap] = useState(false)

  // State for form inputs
  const [reportUrl, setReportUrl] = useState('http://leonard0davinci.com/my-super-opus-magnum')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New states for the loader and Kleros functionality
  const [isLoading, setIsLoading] = useState(false)
  const [showKlerosButton, setShowKlerosButton] = useState(false)

  // New state for success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleCheckboxChange = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Resolve params asynchronously
  useEffect(() => {
    params.then(resolvedParams => {
      setArtworkNumber(resolvedParams.artworkId.replace('artwork-', ''))
    })
  }, [params])

  // Blinking effect for similarity score > 0.80 (first 3 seconds when Kleros button is shown)
  useEffect(() => {
    if (similarityScore > 0.8 && showKlerosButton) {
      setShouldBlink(true)
      const timer = setTimeout(() => {
        setShouldBlink(false)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setShouldBlink(false)
    }
  }, [similarityScore, showKlerosButton])

  const toast = useToast()

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleReport = async () => {
    if (!reportUrl && !selectedFile) {
      toast({
        title: 'Error',
        description: 'Please provide either a URL or upload a file to report IP infringement.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    // Start the loading process
    setIsLoading(true)
    setShowKlerosButton(false)

    // Show loader for 3 seconds
    setTimeout(() => {
      setIsLoading(false)
      setShowKlerosButton(true)
    }, 3000)
  }

  const handleTriggerKleros = async () => {
    // Check if user is connected first
    if (!isConnected) {
      toast({
        title: 'Please login',
        description: 'Your wallet address will be the recipient of the reward.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })

      // Open the wallet connection modal
      try {
        open({ view: 'Connect' })
      } catch (error) {
        console.error('Error opening wallet connection:', error)
        toast({
          title: 'Connection Error',
          description: 'There was an error opening the wallet connection. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
      return
    }

    // Proceed with Kleros submission if user is connected
    setIsSubmitting(true)

    try {
      // Here you would typically send the data to your backend API
      // For now, we'll just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: 'Sent!',
        description: `Thank you for reporting an infringement on Artwork #${artworkNumber}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Instead of resetting everything, show success message
      setShowSuccessMessage(true)
      setShowKlerosButton(false)
    } catch (error) {
      toast({
        title: 'Kleros trigger failed',
        description: 'There was an error triggering Kleros. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIRecap = () => {
    setIsLoadingRecap(true)
    setShowRecap(false)

    // Show loader for 3 seconds
    setTimeout(() => {
      setIsLoadingRecap(false)
      setShowRecap(true)
    }, 3000)
  }

  const handleModalClose = () => {
    onClose()
    // Reset AI Recap state when modal closes
    setIsLoadingRecap(false)
    setShowRecap(false)
  }

  return (
    <Container maxW="container.md" py={20}>
      <style jsx>{`
        @keyframes blink-red {
          0%,
          50% {
            opacity: 1;
            color: #e53e3e;
          }
          25%,
          75% {
            opacity: 0.3;
            color: #fc8181;
          }
        }
        .blink-red {
          animation: blink-red 0.3s infinite;
        }
      `}</style>

      <VStack spacing={8} align="stretch">
        {/* Full-width artwork at top */}
        <Box w="100%" mb={30}>
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

        {/* IP Infringement Reporting Section */}
        <VStack spacing={3}>
          {/* Show loader when isLoading is true */}
          {isLoading ? (
            <VStack spacing={1} align="center" py={2}>
              <Image
                src="/loader.svg"
                alt="Loading..."
                width="280px"
                height="280px"
                objectFit="contain"
              />
              <Text fontSize="lg" color="gray.400">
                Assessing images similarity...
              </Text>
            </VStack>
          ) : showSuccessMessage ? (
            // Show success message instead of resetting
            <VStack spacing={6} align="center" py={8}>
              <Box
                bg="green.900"
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor="green.600"
              >
                <Text fontSize="lg" fontWeight="bold" color="green.200" mb={3}>
                  Case Submitted Successfully
                </Text>
                <Text fontSize="md" color="green.100" lineHeight="tall">
                  The case will be submitted to the Kleros Court in the coming hours. Thank you for
                  reporting this infringement. If it is confirmed by the court, you will receive a
                  significant reward at <strong>{address}</strong>.
                </Text>
              </Box>
            </VStack>
          ) : showKlerosButton ? (
            // Show Kleros ready state
            <VStack spacing={6} align="center" py={8}>
              <VStack spacing={10} align="center" py={8}>
                <Text fontSize="xl" fontWeight="bold" textAlign="center">
                  Similarity score:{' '}
                  <span
                    style={{
                      color: similarityScore > 0.8 ? '#e53e3e' : 'inherit',
                    }}
                    className={similarityScore > 0.8 && shouldBlink ? 'blink-red' : ''}
                  >
                    {similarityScore.toFixed(2)}
                  </span>
                </Text>

                <VStack spacing={3} align="start" w="100%">
                  <Checkbox
                    isChecked={checkboxes.imagesSimilar}
                    onChange={() => handleCheckboxChange('imagesSimilar')}
                    colorScheme="blue"
                  >
                    Substantial similarity exists between the protected work and the alleged
                    infringing material
                  </Checkbox>

                  <HStack spacing={2} align="center">
                    <Checkbox
                      isChecked={checkboxes.isInfringement}
                      onChange={() => handleCheckboxChange('isInfringement')}
                      colorScheme="blue"
                    >
                      The unauthorized publication constitutes IP infringement under applicable law
                    </Checkbox>
                    <Tooltip
                      label="Read the original legal contract"
                      placement="top"
                      hasArrow
                      bg="gray.700"
                      color="white"
                    >
                      <IconButton
                        aria-label="Legal contract information"
                        icon={<InfoIcon />}
                        size="xs"
                        variant="ghost"
                        color="gray.400"
                        _hover={{ color: 'blue.400' }}
                        onClick={onOpen}
                      />
                    </Tooltip>
                  </HStack>

                  <Checkbox
                    isChecked={checkboxes.lacksAuthorization}
                    onChange={() => handleCheckboxChange('lacksAuthorization')}
                    colorScheme="blue"
                  >
                    The publisher lacks valid authorization or licensing agreement with the IP
                    rights holder
                  </Checkbox>

                  <Checkbox
                    isChecked={checkboxes.publisherSolvent}
                    onChange={() => handleCheckboxChange('publisherSolvent')}
                    colorScheme="blue"
                  >
                    The infringing party possesses sufficient assets to satisfy potential damages
                    award
                  </Checkbox>

                  <Checkbox
                    isChecked={checkboxes.publisherContactable}
                    onChange={() => handleCheckboxChange('publisherContactable')}
                    colorScheme="blue"
                  >
                    The infringing party is identifiable and subject to legal process within
                    competent jurisdiction
                  </Checkbox>
                </VStack>

                <Button
                  onClick={handleTriggerKleros}
                  isLoading={isSubmitting}
                  loadingText="Triggering Kleros..."
                  bg="blue.600"
                  color="white"
                  _hover={{ bg: 'blue.700' }}
                  _disabled={{ bg: 'blue.600', cursor: 'not-allowed' }}
                  size="lg"
                  w="100%"
                  maxW="300px"
                >
                  {/* Show login status in button text if needed */}
                  {!isConnected ? 'Login & Trigger Kleros' : 'Trigger Kleros'}
                </Button>
              </VStack>
            </VStack>
          ) : (
            // Show original form
            <>
              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                Report IP infringement
              </Text>

              <FormControl>
                <FormLabel htmlFor="report-url">Report from URL</FormLabel>
                <Input
                  id="report-url"
                  type="url"
                  placeholder="http://leonard0davinci.com/my-super-opus-magnum"
                  value={reportUrl}
                  onChange={e => setReportUrl(e.target.value)}
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #4299e1' }}
                />
              </FormControl>

              <Center>
                <Text fontSize="sm" color="gray.400" fontStyle="italic">
                  or
                </Text>
              </Center>
              <FormControl>
                <FormLabel htmlFor="file-upload">Upload evidence file</FormLabel>
                <Box position="relative">
                  <Input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    position="absolute"
                    opacity={0}
                    width="100%"
                    height="100%"
                    cursor="pointer"
                    zIndex={1}
                  />

                  <Box
                    border="2px dashed"
                    borderColor={selectedFile ? 'green.400' : 'whiteAlpha.300'}
                    borderRadius="md"
                    p={6}
                    bg={selectedFile ? 'green.50' : 'whiteAlpha.50'}
                    _hover={{
                      borderColor: selectedFile ? 'green.500' : 'blue.400',
                      bg: selectedFile ? 'green.100' : 'whiteAlpha.100',
                    }}
                    transition="all 0.2s"
                    cursor="pointer"
                  >
                    <Center>
                      <VStack spacing={2}>
                        <Icon
                          as={selectedFile ? CheckIcon : AttachmentIcon}
                          boxSize={8}
                          color={selectedFile ? 'green.500' : 'gray.400'}
                        />
                        {selectedFile ? (
                          <VStack spacing={1}>
                            <Text fontWeight="medium" color="green.600">
                              File selected
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {selectedFile.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              Click to change file
                            </Text>
                          </VStack>
                        ) : (
                          <VStack spacing={1}>
                            <Text fontWeight="medium">Click to upload file</Text>
                            <Text fontSize="sm" color="gray.400">
                              or drag and drop
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              PNG, JPG, PDF, DOC up to 10MB
                            </Text>
                          </VStack>
                        )}
                      </VStack>
                    </Center>
                  </Box>
                </Box>
              </FormControl>

              <Button
                onClick={handleReport}
                bg="blue.600"
                color="white"
                _hover={{ bg: 'blue.700' }}
                _disabled={{ bg: 'gray.600', cursor: 'not-allowed' }}
                size="lg"
                w="100%"
              >
                Report
              </Button>
            </>
          )}
        </VStack>
      </VStack>

      {/* Legal Contract Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Legal Contract</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box maxHeight="400px" overflowY="auto" pr={2}>
                <VStack spacing={4} align="stretch">
                  <Text fontWeight="bold" fontSize="lg">
                    TERMS AND CONDITIONS OF SALE OF VISUAL ART NFT (INCLUDING A LICENCE TO USE)
                  </Text>

                  <Text fontWeight="semibold">Preamble:</Text>
                  <Text fontSize="sm">
                    These Terms and Conditions of Sale for NFT and Rights Licensing
                    (&quot;TCNFT&quot;) define the contractual relationship between the
                    &quot;PARTIES&quot;:
                  </Text>
                  <Text fontSize="sm">
                    On the one hand the &quot;SELLER&quot;, Artist&apos;s name: Leonardo Da Vinci,
                    Email address: leonardo@strat.cc Holder of the address
                    0xbeb7cc844f9d21e53ab4632ba6df6459b9f2a078 on the Polygon public blockchain
                    shared electronic recording device.
                  </Text>
                  <Text fontSize="sm">
                    And on the other hand, the &quot;ACQUIRER&quot;, Customer with full legal
                    capacity and having called the smart contract of the non-fungible token
                    (&quot;NFT&quot;) issuance to acquire the NFT on the Polygon blockchain.
                  </Text>

                  <Text fontWeight="semibold">Article 1. Purpose of the contract</Text>
                  <Text fontSize="sm">
                    <strong>1.1. Description</strong>
                    <br />
                    The WORK, of which the SELLER has the entirety of the copyrights, which is the
                    subject of the present TCNFT, is described as follows: - Title: Ode - Size:
                    23095879 Bytes - Date of realization: 2022-04-01 - Detailed description: A 16
                    seconds video loop of Ode, a digital sculpture made inside Virtual Reality.
                    Materials: marble, resin and steel mesh. The NFT redeems a single video edition
                    on black background of the sculpture.
                  </Text>

                  <Text fontSize="sm">
                    <strong>1.2. Technical identification</strong>
                    <br />
                    The WORK is recorded on a computer file in mp4 format accessible on IPFS storage
                    service referred to in the metadata of the smart contract of the NFT of address
                    0xbeb7cc844f9d21e53ab4632ba6df6459b9f2a078, on the public Polygon blockchain.
                    The NFT complies with the ERC-721 standard.
                  </Text>

                  <Text fontSize="sm">
                    <strong>1.3. Purpose</strong>
                    <br />
                    The SELLER grants to the ACQUIRER, who accepts it: - full ownership of the
                    single NFT - the rights of use referred to in Article 2.
                  </Text>

                  <Text fontWeight="semibold">
                    Article 2. Scope of the license of rights of use
                  </Text>
                  <Text fontSize="sm">
                    <strong>2.1. Exclusivity</strong>
                    <br />
                    This ASSIGNMENT includes the grant of exclusive (compatible only with the sale
                    of single NFT) rights to use the WORK.
                  </Text>
                  <Text fontSize="sm">
                    <strong>2.2. Territorial scope</strong>
                    <br />
                    The rights of use are granted for the whole world.
                  </Text>
                  <Text fontSize="sm">
                    <strong>2.3. Duration</strong>
                    <br />
                    The rights of use are granted for the duration of 70 years from the issuance of
                    the non-fungible token (&quot;NFT&quot;) of address
                    0xbeb7cc844f9d21e53ab4632ba6df6459b9f2a078 on the Polygon public blockchain.
                  </Text>
                  <Text fontSize="sm">
                    <strong>
                      2.4. Scope of the rights granted to the NFT holder under the associated user
                      license
                    </strong>
                    <br />
                    The rights of use granted include the following rights: - The right to use,
                    reproduce, archive, modify and display the WORK in any physical or digital
                    medium, existing or future, in a strictly private setting, for personal and
                    non-commercial use. - The right to reproduce and represent the WORK in a public
                    setting for the strict purpose of reselling the NFT, on any existing or future
                    physical or digital media, in particular social networks, the ACQUIRER&apos;s
                    personal or professional websites, online galleries or metaverse.
                  </Text>

                  <Text fontWeight="semibold">Article 3. Price of the transfer</Text>
                  <Text fontSize="sm">
                    In consideration of the NFT relating to the WORK and the associated rights of
                    use, the ACQUIRER undertakes to pay the SELLER a remuneration of a lump sum
                    which will be determined at the time of the meeting of wills formalized by the
                    validation of the ACQUIRER&apos;s price offer by the SELLER and the execution of
                    the smart contract transferring the NFT between two public addresses on the
                    Polygon public blockchain.
                  </Text>

                  <Text fontWeight="semibold">Article 4. Guarantees</Text>
                  <Text fontSize="sm">
                    <strong>4.1. Guarantee of copyright ownership</strong>
                    <br />
                    The SELLER declares that he is the sole owner of the copyrights, of the related
                    rights and, in general, that he holds all the authorizations necessary for the
                    exploitation of the WORKS and guarantees to the ACQUIRER the quiet and full
                    enjoyment of all easements of the rights that are the subject of the contract,
                    against all disturbances, claims and evictions of any kind.
                  </Text>

                  <Text fontWeight="semibold">Article 8. Resale</Text>
                  <Text fontSize="sm">
                    <strong>8.1. Conditions for resale</strong>
                    <br />
                    The ACQUIRER is authorized to resell the NFT with the associated rights of use
                    and secondary rights as stipulated in these TCNFT to any third party of his
                    choice without prior agreement from the SELLER.
                  </Text>
                  <Text fontSize="sm">
                    <strong>8.2. Contractual resale right</strong>
                    <br />
                    The ACQUIRER shall ensure that in the event of resale of the NFT to a third
                    party by way of a smart contract or by way of transfer of ownership of a
                    decentralized, centralized, digital or physical electronic portfolio that a
                    percentage of 10% of the resale will normally be paid automatically or, in the
                    event that this is not possible, will be paid back to the SELLER within a
                    maximum period of 14 days.
                  </Text>

                  <Text fontWeight="semibold">Article 9. Applicable law</Text>
                  <Text fontSize="sm">The present TCNFT are governed by French law.</Text>

                  <Text fontWeight="semibold">Article 10. Dispute resolution</Text>
                  <Text fontSize="sm">
                    The Parties shall attempt to settle any dispute arising from the interpretation
                    or execution of these TCNFT amicably. Failing that, any dispute will be
                    submitted to the jurisdiction of the Paris Court of Appeal.
                  </Text>
                </VStack>
              </Box>

              {isLoadingRecap && (
                <Box textAlign="center" py={4}>
                  <Image
                    src="/loader.svg"
                    alt="Loading AI Recap..."
                    width="80px"
                    height="80px"
                    objectFit="contain"
                    mx="auto"
                  />
                  <Text fontSize="sm" color="gray.400" mt={2}>
                    Generating AI recap...
                  </Text>
                </Box>
              )}

              {showRecap && (
                <Box
                  bg="blue.900"
                  p={4}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="blue.600"
                >
                  <Text fontSize="sm" color="blue.200" fontWeight="bold" mb={2}>
                    AI Recap
                  </Text>
                  <Text>This is the legal contract recap</Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={handleAIRecap}
                isLoading={isLoadingRecap}
                loadingText="Generating..."
                isDisabled={showRecap}
              >
                AI Recap
              </Button>
              <Button colorScheme="blue" onClick={handleModalClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}
