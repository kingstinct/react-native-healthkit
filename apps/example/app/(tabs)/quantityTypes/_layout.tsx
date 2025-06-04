import { Stack } from "expo-router";

export default function WorkoutsLayout() {
    return <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Quantities" }} />
        {/* <Stack.Screen name="details" options={{ title: "Workout Details" }} /> */}
    </Stack>
}