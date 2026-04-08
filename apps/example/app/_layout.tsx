import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, usePathname, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { readLaunchCommand } from '@/contracts/launchCommand'
import { useColorScheme } from '@/hooks/useColorScheme'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const pathname = usePathname()
  const router = useRouter()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (!loaded) {
      return
    }

    const launchCommand = readLaunchCommand()
    if (!launchCommand) {
      return
    }

    if (
      launchCommand.route === 'contracts' &&
      pathname !== '/contracts' &&
      pathname !== '/auth'
    ) {
      router.replace({
        pathname: '/contracts',
        params: {
          autorun: launchCommand.autorun,
          scenario: launchCommand.scenario,
        },
      })
    }
  }, [loaded, pathname, router])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="contracts"
            options={{
              title: 'HealthKit Contracts',
            }}
          />
          <Stack.Screen
            name="auth"
            options={{
              title: 'HealthKit Authorization',
              presentation: 'modal',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
