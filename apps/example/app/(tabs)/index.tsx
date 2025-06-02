import { Image } from "expo-image";
import { Button, Platform, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Auth, Core, Workouts } from "react-native-healthkit";

const result = 12

export default function HomeScreen() {
	const hello = async () => {
		const hey = Auth.authorizationStatusFor('HKWorkoutTypeIdentifier')
		console.log('authorizationStatusFor', hey)
		
		const hey2 = Core.isHealthDataAvailable()
		console.log('isHealthDataAvailable', hey2)

		const hey3 = Core.getPreferredUnits([
			'HKQuantityTypeIdentifierStepCount',
			'HKQuantityTypeIdentifierDistanceWalkingRunning',
			'HKQuantityTypeIdentifierDistanceCycling',
			'HKQuantityTypeIdentifierActiveEnergyBurned',
			'HKQuantityTypeIdentifierBasalEnergyBurned',
		]).then(units => {
			console.log('getPreferredUnits', units)
			return units
		})

		const hey4 = Core.isProtectedDataAvailable()
		console.log('isProtectedDataAvailable', hey4)
	}
	hello()

	const saveWorkoutRoute = async () => {
		const hey = await Workouts.saveWorkoutRoute('123', [
			{
				latitude: 37.774929,
				longitude: -122.419416,
				altitude: 100,
				horizontalAccuracy: 10,
				verticalAccuracy: 10,
				course: 100,
				speed: 100,
				timestamp: Date.now(),
			}
		]).catch(err => {
			console.log('saveWorkoutRoute error', err)
		})
	}

	const queryWorkoutSamples = async () => {
		const hey = await Workouts.queryWorkoutSamplesWithAnchor('kcal', 'm', 0, 0, 10)
		console.log('queryWorkoutSamples', hey)
		// console.log('queryWorkoutSamples', JSON.stringify(hey, null, 2))
		const firstWorkout = hey.samples[0]
		const routes = await Workouts.getWorkoutRoutes(firstWorkout.uuid).catch(err => {
			console.log('getWorkoutRoutes error', err)
		})
		console.log(JSON.stringify(routes, null, 2))
	}

	const requestAuth = async () => {
		const hey = await Auth.requestAuthorization([
			'HKWorkoutTypeIdentifier',
			'HKWorkoutRouteTypeIdentifier',
		], [
			'HKWorkoutTypeIdentifier',
			'HKWorkoutRouteTypeIdentifier',
		])

		console.log('requestAuth', hey)
	}

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
			headerImage={
				<Image
					source={require("@/assets/images/partial-react-logo.png")}
					style={styles.reactLogo}
				/>
			}
		>
			<Button onPress={requestAuth} title="Request Auth" />
			<Button onPress={saveWorkoutRoute} title="Save Workout Samples" />
			<Button onPress={queryWorkoutSamples} title="Query Workout Samples" />
			<ThemedText>{ result }</ThemedText>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Welcome!</ThemedText>
				<HelloWave />
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 1: Try it</ThemedText>
				<ThemedText>
					Edit{" "}
					<ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
					to see changes. Press{" "}
					<ThemedText type="defaultSemiBold">
						{Platform.select({
							ios: "cmd + d",
							android: "cmd + m",
							web: "F12",
						})}
					</ThemedText>{" "}
					to open developer tools.
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 2: Explore</ThemedText>
				<ThemedText>
					{`Tap the Explore tab to learn more about what's included in this starter app.`}
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.stepContainer}>
				<ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
				<ThemedText>
					{`When you're ready, run `}
					<ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
					to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
					directory. This will move the current{" "}
					<ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
					<ThemedText type="defaultSemiBold">app-example</ThemedText>.
				</ThemedText>
			</ThemedView>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
});
