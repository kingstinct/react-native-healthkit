import {
  Button,
  CircularProgress,
  Host,
  HStack,
  Text,
  VStack,
} from '@expo/ui/swift-ui'
import {
  getRequestStatusForAuthorization,
  requestAuthorization,
} from '@kingstinct/react-native-healthkit'
import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit/types/Auth'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
  AllObjectTypesInApp,
  AllSampleTypesInApp,
} from '@/constants/AllUsedIdentifiersInApp'
import { enumKeyLookup } from '@/utils/enumKeyLookup'

const authEnumLookup = enumKeyLookup(AuthorizationRequestStatus)

export default function AuthScreen() {
  const requestAuth = useCallback(async () => {
    try {
      const res = await requestAuthorization({
        toRead: AllObjectTypesInApp,
        toShare: AllSampleTypesInApp,
      })
      alert(`response: ${res}`)

      router.replace('/')
    } catch (error) {
      console.error('Error requesting authorization:', error)
    }
  }, [])

  const [status, setStatus] = useState<AuthorizationRequestStatus | null>(null)

  useEffect(() => {
    const updateStatus = async () => {
      try {
        const status = await getRequestStatusForAuthorization({
          toShare: AllSampleTypesInApp,
          toRead: AllObjectTypesInApp,
        })
        setStatus(status)
      } catch (error) {
        setStatus(AuthorizationRequestStatus.unknown)
        const err = error as Error
        if ('message' in err) {
          alert(err.message)
        } else {
          alert(error)
        }
      }
    }

    // Check the authorization status when the component mounts
    updateStatus()
  }, [])

  return (
    <Host style={{ paddingTop: 40 }}>
      <VStack>
        <HStack spacing={32}>
          {status ? (
            <Text weight="bold">{authEnumLookup[status] as string}</Text>
          ) : (
            <CircularProgress />
          )}
        </HStack>
        <HStack spacing={32}>
          <Button onPress={requestAuth} variant="borderedProminent">
            Request Permissions
          </Button>
        </HStack>
      </VStack>
    </Host>
  )
}
