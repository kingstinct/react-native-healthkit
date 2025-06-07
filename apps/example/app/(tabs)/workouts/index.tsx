
import { Workouts } from "react-native-healthkit";
import { Host, List } from "@expo/ui/swift-ui";
import { useEffect, useState } from "react";
import { ListItem } from "@/components/SwiftListItem";
import { enumKeyLookup } from "@/utils/enumKeyLookup";
import { router } from "expo-router";
import { View } from "react-native";
import { Text } from "@expo/ui/swift-ui-primitives";
import { WorkoutActivityType, WorkoutSample } from "react-native-healthkit/types/Workouts";

const workoutActivityTypeStrings = enumKeyLookup(WorkoutActivityType);

export default function WorkoutsScreen() {
    const [workouts, setWorkouts] = useState<readonly WorkoutSample[]>([])
    const [queryTime, setQueryTime] = useState<null | number>();

    useEffect(() => {
        const queryWorkoutSamples = async () => {
            const startedAt = Date.now();
            const workouts = await Workouts.queryWorkoutSamplesWithAnchor({})
            setQueryTime(Date.now() - startedAt);
            setWorkouts(workouts.samples)
        }
        queryWorkoutSamples();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Host style={{ padding: 16 }}>
                <Text>{queryTime !== null ? `Query time: ${queryTime}ms` : 'Loading...'}</Text>
            </Host>
            <List 
                scrollEnabled>
                {
                    workouts.map((item) => (
                        <ListItem
                            key={item.uuid}
                            title={workoutActivityTypeStrings[item.workoutActivityType]}
                            subtitle={item.start.toLocaleString()}
                            onPress={() => router.push(`/workouts/details?workoutId=${item.uuid}`)}
                        />
                    ))
                }
            </List>
        </View>
    );
}
