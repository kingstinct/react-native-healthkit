
import { Workouts } from "react-native-healthkit";
import { List } from "@expo/ui/swift-ui";
import { useCallback, useEffect, useState } from "react";
import { ListItem } from "@/components/SwiftListItem";
import { enumKeyLookup } from "@/utils/enumKeyLookup";
import { router } from "expo-router";
import { View } from "react-native";
import { WorkoutActivityType, WorkoutSample } from "react-native-healthkit/types/Workouts";
import { QueryInfo } from "@/components/QueryInfo";

const workoutActivityTypeStrings = enumKeyLookup(WorkoutActivityType);

export default function WorkoutsScreen() {
    const [workouts, setWorkouts] = useState<readonly WorkoutSample[]>([])
    const [queryTime, setQueryTime] = useState<number>();
    const [anchor, setAnchor] = useState<string>();
    const [deletedSamples, setDeletedSamples] = useState<readonly string[]>([]);

    const queryWorkoutSamples = useCallback(async (anchor?: string) => {
        try {
            const startedAt = Date.now();
            const { workouts, deletedSamples, newAnchor } = await Workouts.queryWorkoutSamplesWithAnchor({ anchor })
            setQueryTime(Date.now() - startedAt);
            setWorkouts(workouts.map(w => w.sample));
            setAnchor(newAnchor);
            setDeletedSamples(deletedSamples.map(d => d.uuid));
        }
        catch (error) {
            console.error('Error querying workouts:', error);
        }
    }, []);

    useEffect(() => {
        queryWorkoutSamples(anchor);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <QueryInfo
                queryTime={queryTime} 
                anchor={anchor} 
                deletedSamples={deletedSamples}
                onFetchMore={() => queryWorkoutSamples(anchor)} />

            <List
                scrollEnabled>
                {
                    workouts.map((item) => (
                        <ListItem
                            key={item.uuid}
                            title={workoutActivityTypeStrings[item.workoutActivityType] || 'Unknown'}
                            subtitle={item.start.toLocaleString()}
                            onPress={() => router.push(`/workouts/details?workoutId=${item.uuid}`)}
                        />
                    ))
                }
            </List>
        </View>
    );
}
