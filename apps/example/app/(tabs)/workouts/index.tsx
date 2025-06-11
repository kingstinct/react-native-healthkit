
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
    const [anchor, setAnchor] = useState<string | undefined>('YnBsaXN0MDDUAQIDBAUGBwpYJHZlcnNpb25ZJGFyY2hpdmVyVCR0b3BYJG9iamVjdHMSAAGGoF8QD05TS2V5ZWRBcmNoaXZlctEICVRyb290gAGkCwwTFFUkbnVsbNMNDg8QERJVcm93aWRWJGNsYXNzW2NsaWVudFRva2VuEgRQyRWAA4ACXxCAOTZhYTVkMjQwY2IzYzBiNmE0MjAzYTM0NDExMjlmNDViYzViZWUyOWExMjAwMTI2ZGE0OWUyMmZhMjJiNjU5MjQyMTM3ZDc5NTBlNDljMDU5Nzg4OWZiZTYwNDUzNDM2ODJhYWJlYjI3NDg4N2Q1ZDEwNzRkN2FjMjkwZDNlOTjSFRYXGFokY2xhc3NuYW1lWCRjbGFzc2VzXUhLUXVlcnlBbmNob3KiGRpdSEtRdWVyeUFuY2hvclhOU09iamVjdAAIABEAGgAkACkAMgA3AEkATABRAFMAWABeAGUAawByAH4AgwCFAIcBCgEPARoBIwExATQBQgAAAAAAAAIBAAAAAAAAABsAAAAAAAAAAAAAAAAAAAFL');
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
            <Host style={{ padding: 16 }}>
                <VStack>
                    <Text>{queryTime !== null ? `Query time: ${queryTime}ms` : 'Loading...'}</Text>
                    {deletedSamples.length > 0 ? <Text>{`Deleted samples: ${deletedSamples.length}`}</Text> : null}
                    {anchor ? <Text>{`Anchor: ${anchor}`}</Text> : null}
                    {anchor ? <Button
                        onPress={() => {
                            queryWorkoutSamples(anchor);
                        }
                        }>
                        Next page
                    </Button> : null}
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
