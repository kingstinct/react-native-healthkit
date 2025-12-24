import { getRequestStatusForAuthorization } from '@kingstinct/react-native-healthkit'
import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit/types/Auth'
import { Redirect, Tabs } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, Platform } from 'react-native'
import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import {
  AllObjectTypesInApp,
  AllSampleTypesInApp,
} from '@/constants/AllUsedIdentifiersInApp'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { enumKeyLookup } from '@/utils/enumKeyLookup'

const statusEnum = enumKeyLookup(AuthorizationRequestStatus)

export default function TabLayout() {
  const colorScheme = useColorScheme()

  const [authStatus, setAuthStatus] =
    React.useState<AuthorizationRequestStatus | null>(null)

  useEffect(() => {
    try {
      getRequestStatusForAuthorization({
        toRead: AllObjectTypesInApp,
        toShare: AllSampleTypesInApp,
      })
        .then((status) => {
          console.log('Authorization Status:', statusEnum[status])
          setAuthStatus(status)
        })
        .catch((error) => {
          console.error('Error getting authorization status:', error)
          setAuthStatus(AuthorizationRequestStatus.shouldRequest)
        })
    } catch (error) {
      console.error('Error in useEffect:', error)
      setAuthStatus(AuthorizationRequestStatus.shouldRequest)
    }
  }, [])

  if (authStatus === null) {
    // If the auth status is still loading, you can show a loading state or return null
    return (
      <ActivityIndicator
        size="large"
        color={Colors[colorScheme ?? 'light'].tint}
      />
    )
  }

  if (authStatus !== AuthorizationRequestStatus.unnecessary) {
    // If the user has not granted permissions, redirect to the auth screen
    return <Redirect href="../auth" relativeToDirectory />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Core',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'person.fill' : 'person'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="correlations"
        options={{
          title: 'Correlations',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'person.fill' : 'person'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'medications',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'person.fill' : 'person'}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="quantityTypes"
        options={{
          title: 'Quantities',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'chart.bar.fill' : 'chart.bar'}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={
                focused
                  ? 'figure.run.square.stack.fill'
                  : 'figure.run.square.stack'
              }
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="heartbeats"
        options={{
          title: 'Heartbeats',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'heart.fill' : 'heart'}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="electrocardiograms"
        options={{
          title: 'ECGs',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={
                focused
                  ? 'waveform.path.ecg.rectangle.fill'
                  : 'waveform.path.ecg.rectangle'
              }
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="subscriptions"
        options={{
          title: 'Subscriptions',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'bell.fill' : 'bell'}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="mindfulSessions"
        options={{
          title: 'Mindful',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? 'brain.head.profile.fill' : 'brain.head.profile'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
