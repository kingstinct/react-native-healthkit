import {
  AllObjectTypesInApp,
  AllSampleTypesInApp,
} from '@/constants/AllUsedIdentifiersInApp'
import { enumKeyLookup } from '@/utils/enumKeyLookup'
import { Button, CircularProgress, Host } from '@expo/ui/swift-ui'
import { HStack, Text, VStack } from '@expo/ui/swift-ui-primitives'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'

import {
  getRequestStatusForAuthorization,
  requestAuthorization,
} from '@kingstinct/react-native-healthkit'
import {
  AuthorizationRequestStatus,
  AuthorizationStatus,
} from '@kingstinct/react-native-healthkit/types/Auth'

const authEnumLookup = enumKeyLookup(AuthorizationStatus)

export default function AuthScreen() {
  const requestAuth = useCallback(async () => {
    try {
      const res = await requestAuthorization(
        AllSampleTypesInApp,
        AllObjectTypesInApp,
      )

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
        const status = await getRequestStatusForAuthorization(
          AllSampleTypesInApp,
          AllObjectTypesInApp,
        )
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
    <Host>
      <VStack>
        <HStack spacing={16}>
          {status ? (
            <Text weight="bold">{authEnumLookup[status] as string}</Text>
          ) : (
            <CircularProgress />
          )}
        </HStack>
        <HStack spacing={16}>
          <Button onPress={requestAuth} variant="borderedProminent">
            Request Permissions
          </Button>
        </HStack>
      </VStack>
    </Host>
  )
}
