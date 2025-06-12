import { List } from "@expo/ui/swift-ui";
import { enumKeyLookup } from "@/utils/enumKeyLookup";
import { useLocalSearchParams } from "expo-router";
import { Section } from "@expo/ui/swift-ui-primitives";
import { ListItem } from "@/components/SwiftListItem";
import { Workouts } from "@kingstinct/react-native-healthkit";
import { useEffect, useState } from "react";
import {
	WorkoutActivityType,
	WorkoutEventType,
	type WorkoutRoute,
} from "@kingstinct/react-native-healthkit/types/Workouts";
import type { WorkoutProxy } from "@kingstinct/react-native-healthkit/specs/WorkoutProxy.nitro";

const workoutActivityTypeStrings = enumKeyLookup(WorkoutActivityType);

const workoutEventTypeStrings = enumKeyLookup(WorkoutEventType);

export default function WorkoutDetails() {
	const { workoutId } = useLocalSearchParams<{ workoutId?: string }>();

	const [workout, setWorkout] = useState<WorkoutProxy | null>(null);

	const [routes, setRoutes] = useState<readonly WorkoutRoute[]>([]);

	const [queryTime, setQueryTime] = useState<number>();
	const [routesQueryTime, setRoutesQueryTime] = useState<number>();

	useEffect(() => {
		if (!workoutId) {
			return;
		}

		const startedAt = Date.now();

		Workouts.queryWorkoutByUUID(workoutId)
			.then((w) => {
				setWorkout(w);
				setQueryTime(Date.now() - startedAt);
				const routeStartedAt = Date.now();
				w?.getWorkoutRoutes()
					.then((r) => {
						setRoutes(r);
						setRoutesQueryTime(Date.now() - routeStartedAt);
					})
					.catch(console.error);
			})
			.catch(console.error);
	}, [workoutId]);

	if (!workout) {
		return (
			<List>
				<ListItem title="Loading workout details..." />
			</List>
		);
	}

	return (
		<List scrollEnabled>
			{queryTime ? (
				<Section title="Query Information">
					<ListItem title="Query Time" subtitle={queryTime + "ms"} />
					{routesQueryTime ? (
						<ListItem
							title="Routes Query Time"
							subtitle={routesQueryTime + "ms"}
						/>
					) : null}
				</Section>
			) : null}
			<Section>
				<ListItem
					title="Workout Type"
					subtitle={
						workoutActivityTypeStrings[workout.sample.workoutActivityType]
					}
				/>
				<ListItem
					title="Started"
					subtitle={workout.sample.start.toLocaleString()}
				/>
				<ListItem
					title="Ended"
					subtitle={workout.sample.end.toLocaleString()}
				/>
				<ListItem
					title="Duration"
					subtitle={`${Math.round((workout.sample.end.valueOf() - workout.sample.start.valueOf()) / 60 / 1000)} minutes`}
				/>
				{workout.sample.totalDistance ? (
					<ListItem
						title="Total Distance"
						subtitle={`${Math.round(workout.sample.totalDistance.quantity)} ${workout.sample.totalDistance.unit}`}
					/>
				) : null}
				{workout.sample.totalEnergyBurned ? (
					<ListItem
						title="Total Energy Burned"
						subtitle={`${Math.round(workout.sample.totalEnergyBurned.quantity)} ${workout.sample.totalEnergyBurned.unit}`}
					/>
				) : null}
				{workout.sample.totalFlightsClimbed ? (
					<ListItem
						title="Total Flights Climbed"
						subtitle={`${Math.round(workout.sample.totalFlightsClimbed.quantity)} ${workout.sample.totalFlightsClimbed.unit}`}
					/>
				) : null}
				{workout.sample.totalSwimmingStrokeCount ? (
					<ListItem
						title="Total Swimming Stroke Count"
						subtitle={`${Math.round(workout.sample.totalSwimmingStrokeCount.quantity)} ${workout.sample.totalSwimmingStrokeCount.unit}`}
					/>
				) : null}
			</Section>
			{workout.sample.device ? (
				<Section title="Device">
					{workout.sample.device.name ? (
						<ListItem title="Name" subtitle={workout.sample.device.name} />
					) : null}
					{workout.sample.device.model ? (
						<ListItem title="Model" subtitle={workout.sample.device.model} />
					) : null}
					{workout.sample.device.manufacturer ? (
						<ListItem
							title="Manufacturer"
							subtitle={workout.sample.device.manufacturer}
						/>
					) : null}
					{workout.sample.device.hardwareVersion ? (
						<ListItem
							title="Hardware Version"
							subtitle={workout.sample.device.hardwareVersion}
						/>
					) : null}
					{workout.sample.device.softwareVersion ? (
						<ListItem
							title="Software Version"
							subtitle={workout.sample.device.softwareVersion}
						/>
					) : null}
				</Section>
			) : null}

			{workout.sample.metadata &&
				Object.keys(workout.sample.metadata).length > 0 && (
					<Section title="Metadata">
						{Object.entries(workout.sample.metadata).map(([key, value]) => (
							<ListItem
								key={key}
								title={key}
								subtitle={
									typeof value === "string" ? value : JSON.stringify(value)
								}
							/>
						))}
					</Section>
				)}

			{workout.sample.events && workout.sample.events.length > 0 && (
				<Section title="Events">
					{workout.sample.events.map((event, index) => (
						<ListItem
							key={index}
							title={`Event ${index + 1}`}
							subtitle={`Type: ${workoutEventTypeStrings[event.type]}, Timestamp: ${event.start.toLocaleString()}`}
						/>
					))}
				</Section>
			)}
			{workout.sample.activities && workout.sample.activities.length > 0 && (
				<Section title="Activities">
					{workout.sample.activities.map((activity, index) => (
						<ListItem
							key={index}
							title={`Activity ${index + 1}`}
							subtitle={`Duration: ${Math.round(activity.duration / 60)} minutes, Start: ${activity.start.toLocaleString()}`}
						/>
					))}
				</Section>
			)}
			{routes && routes.length > 0 && (
				<Section title="Routes">
					{routes.map((route, index) => (
						<ListItem
							key={index}
							title={`Route ${index + 1}`}
							subtitle={`Locations: ${Math.round(route.locations.length)}`}
						/>
					))}
				</Section>
			)}
		</List>
	);
}
