import { List } from "@expo/ui/swift-ui";
import { WorkoutActivityType, WorkoutEventType } from "react-native-healthkit/specs/WorkoutsModule.nitro";
import { WorkoutSample } from "react-native-healthkit/specs/WorkoutsModule.nitro";
import { enumKeyLookup } from "@/utils/enumKeyLookup";
import { useLocalSearchParams } from "expo-router";
import { Section } from "@expo/ui/swift-ui-primitives";
import { ListItem } from "@/components/SwiftListItem";
import { Workouts } from "react-native-healthkit";
import { useEffect, useState } from "react";


const workoutActivityTypeStrings = enumKeyLookup(WorkoutActivityType);

const workoutEventTypeStrings = enumKeyLookup(WorkoutEventType);

export default function WorkoutDetails() {
    const { workoutId } = useLocalSearchParams<{ workoutId?: string }>();

    const [workout, setWorkout] = useState<WorkoutSample | null>(null);

    useEffect(() => {
        if (!workoutId) {
            return;
        }

        Workouts.queryWorkoutByUUID(workoutId).then(setWorkout).catch(console.error);
    }, [workoutId]);

    console.log('workout', JSON.stringify(workout?.workoutActivityType, null, 2));

    if (!workout) {
        return <List><ListItem title="Loading workout details..." /></List>;
    }

    return (
        <List scrollEnabled>
            <Section>
                <ListItem
                    title='Workout Type'
                    subtitle={workoutActivityTypeStrings[workout.workoutActivityType]} />
                <ListItem
                    title='Started'
                    subtitle={workout.start.toLocaleDateString()} />
                <ListItem
                    title='Ended'
                    subtitle={workout.end.toLocaleDateString()} />
                <ListItem
                    title='Duration'
                    subtitle={`${Math.round((workout.end.valueOf() - workout.start.valueOf()) / 60 / 1000)} minutes`} />
                { workout.totalDistance ? <ListItem
                    title='Total Distance'
                    subtitle={`${Math.round(workout.totalDistance.quantity)} ${workout.totalDistance.unit}`} /> : null }
                { workout.totalEnergyBurned ? <ListItem
                    title='Total Energy Burned'
                    subtitle={`${Math.round(workout.totalEnergyBurned.quantity)} ${workout.totalEnergyBurned.unit}`} /> : null }
                { workout.totalFlightsClimbed ? <ListItem
                    title='Total Flights Climbed'
                    subtitle={`${Math.round(workout.totalFlightsClimbed.quantity)} ${workout.totalFlightsClimbed.unit}`} /> : null }
                { workout.totalSwimmingStrokeCount ? <ListItem
                    title='Total Swimming Stroke Count'
                    subtitle={`${Math.round(workout.totalSwimmingStrokeCount.quantity)} ${workout.totalSwimmingStrokeCount.unit}`} /> : null }

            </Section>
            { workout.device ? <Section title='Device'>
                { workout.device.name ? <ListItem
                    title='Name'
                    subtitle={workout.device.name} /> : null }
                { workout.device.model ? <ListItem
                    title='Model'
                    subtitle={workout.device.model} /> : null }
                { workout.device.manufacturer ? <ListItem
                    title='Manufacturer'
                    subtitle={workout.device.manufacturer} /> : null }
                { workout.device.hardwareVersion ? <ListItem
                    title='Hardware Version'
                    subtitle={workout.device.hardwareVersion} /> : null }
                { workout.device.softwareVersion ? <ListItem
                    title='Software Version'
                    subtitle={workout.device.softwareVersion} /> : null }
            </Section> : null}

            { workout.metadata && Object.keys(workout.metadata).length > 0 && <Section title='Metadata'>
                { Object.entries(workout.metadata).map(([key, value]) => (
                    <ListItem
                        key={key}
                        title={key}
                        subtitle={typeof value === 'string' ? value : JSON.stringify(value)} />
                )) }
            </Section>}

            {
                workout.events && workout.events.length > 0 && <Section title='Events'>
                    {workout.events.map((event, index) => (
                        <ListItem
                            key={index}
                            title={`Event ${index + 1}`}
                            subtitle={`Type: ${workoutEventTypeStrings[event.type]}, Timestamp: ${event.start.toLocaleDateString()}`} />
                    ))}
                </Section>
                
            }
            {
                workout.activities && workout.activities.length > 0 && <Section title='Activities'>
                    {workout.activities.map((activity, index) => (
                        <ListItem
                            key={index}
                            title={`Activity ${index + 1}`}
                            subtitle={`Duration: ${Math.round(activity.duration / 60 / 1000)} minutes, Start: ${activity.start.toLocaleDateString()}`} />
                    ))}
                </Section>
            }
        </List>
    );
}