
import { Workouts } from "react-native-healthkit";
import { Button, Host, List, TextInput } from "@expo/ui/swift-ui";
import { useCallback, useEffect, useState } from "react";
import { ListItem } from "@/components/SwiftListItem";
import { enumKeyLookup } from "@/utils/enumKeyLookup";
import { router } from "expo-router";
import { View } from "react-native";
import { Text, VStack } from "@expo/ui/swift-ui-primitives";
import { WorkoutActivityType, WorkoutSample } from "react-native-healthkit/types/Workouts";

const workoutActivityTypeStrings = enumKeyLookup(WorkoutActivityType);

export default function WorkoutsScreen() {
    const [workouts, setWorkouts] = useState<readonly WorkoutSample[]>([])
    const [queryTime, setQueryTime] = useState<null | number>();
    const [anchor, setAnchor] = useState<string | undefined>(undefined);
    const [deletedSamples, setDeletedSamples] = useState<readonly string[]>([]);

    const queryWorkoutSamples = useCallback(async (anchor?: string) => {
        const startedAt = Date.now();
        const {workouts, deletedSamples, newAnchor} = await Workouts.queryWorkoutSamplesWithAnchor({ anchor })
        setQueryTime(Date.now() - startedAt);
        setWorkouts(workouts.map(w => w.sample));
        setAnchor(newAnchor);
        setDeletedSamples(deletedSamples.map(d => d.uuid));
    }, []);

    useEffect(() => {
        queryWorkoutSamples();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Host style={{ padding: 16 }}>
                <VStack>
                    <Text>{queryTime !== null ? `Query time: ${queryTime}ms` : 'Loading...'}</Text>
                    { deletedSamples.length > 0 ? <Text>{`Deleted samples: ${deletedSamples.length}`}</Text> : null }
                    { anchor ?  <Text>{ `Anchor: ${anchor}`}</Text> : null }
                    { anchor ? <Button
                        onPress={() => {
                            queryWorkoutSamples(anchor);
                        }
                    }>
                        Next page
                    </Button> : null }
                </VStack>
            </Host>
            
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
