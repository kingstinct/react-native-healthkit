import { Stack } from "expo-router";


export default function WorkoutsLayout() {
    return <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Workouts" }} />
        <Stack.Screen name="details" options={{ title: "Workout Details" }} />
    </Stack>
}