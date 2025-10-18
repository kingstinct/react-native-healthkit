import { Stack } from 'expo-router'

export default function ElectrocardiogramsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'ECGs' }} />
    </Stack>
  )
}
