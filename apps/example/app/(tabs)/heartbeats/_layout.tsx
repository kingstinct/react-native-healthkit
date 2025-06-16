import { Stack } from 'expo-router'

export default function HeartbeatsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Heartbeat Series' }} />
      <Stack.Screen
        name="details"
        options={{ title: 'Heartbeat Series Details' }}
      />
    </Stack>
  )
}
