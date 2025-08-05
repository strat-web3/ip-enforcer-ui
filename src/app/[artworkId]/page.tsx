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
} from '@chakra-ui/react'
import { AttachmentIcon, CheckIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

type Props = {
  params: Promise<{ artworkId: string }>
}

export default function ArtworkPage({ params }: Props) {
  const router = useRouter()
  const [artworkNumber, setArtworkNumber] = useState<string>('')

  // Resolve params asynchronously
  useEffect(() => {
    params.then(resolvedParams => {
      setArtworkNumber(resolvedParams.artworkId.replace('artwork-', ''))
    })
  }, [params])
  const toast = useToast()

  // State for form inputs
  const [reportUrl, setReportUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    setIsSubmitting(true)

    try {
      // Here you would typically send the data to your backend API
      // For now, we'll just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: 'Report submitted',
        description: `IP infringement report for Artwork #${artworkNumber} has been submitted successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Reset form
      setReportUrl('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your report. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

        <Divider />

        {/* IP Infringement Reporting Section */}
        <VStack spacing={6} align="stretch">
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            Report IP infringement
          </Text>

          <FormControl>
            <FormLabel htmlFor="report-url">Report from URL</FormLabel>
            <Input
              id="report-url"
              type="url"
              placeholder="https://example.com/infringing-content"
              value={reportUrl}
              onChange={e => setReportUrl(e.target.value)}
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.300"
              _hover={{ borderColor: 'whiteAlpha.400' }}
              _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #4299e1' }}
            />
          </FormControl>

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
            isLoading={isSubmitting}
            loadingText="Submitting report..."
            bg="blue.600"
            color="white"
            _hover={{ bg: 'blue.700' }}
            _disabled={{ bg: 'gray.600', cursor: 'not-allowed' }}
            size="lg"
            w="100%"
          >
            Report
          </Button>
        </VStack>
      </VStack>
    </Container>
  )
}
