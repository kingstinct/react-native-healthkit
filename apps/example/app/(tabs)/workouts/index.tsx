import { StyleSheet } from "react-native";

import { Workouts } from "react-native-healthkit";
import { List } from "@expo/ui/swift-ui";
import { useEffect, useState } from "react";
import { WorkoutActivityType } from "react-native-healthkit/specs/Workout.nitro";
import { WorkoutSample } from "react-native-healthkit/types/WorkoutSample";
import { ListItem } from "@/components/SwiftListItem";
import { enumKeyLookup } from "@/utils/enumKeyLookup";


const workoutActivityTypeStrings = enumKeyLookup(WorkoutActivityType);

export default function WorkoutsScreen() {
    const [workouts, setWorkouts] = useState<readonly WorkoutSample[]>([])

    useEffect(() => {
        const queryWorkoutSamples = async () => {
            const workouts = await Workouts.queryWorkoutSamplesWithAnchor('kcal', 'm', (Date.now() - 1000 * 60 * 60 * 24 * 7) / 1000, 0, 10)
            setWorkouts(workouts.samples)
        }
        queryWorkoutSamples();
    }, []);

    return (
        <List 
            scrollEnabled 
            editModeEnabled 
            selectEnabled 
            onSelectionChange={(items) => alert(`indexes of selected items: ${items.join(', ')}`)}  
            listStyle='insetGrouped'>
            {
                workouts.map((item) => (
                    <ListItem
                        key={item.uuid}
                        title={workoutActivityTypeStrings[item.workoutActivityType]}
                        subtitle={timestampToDate(item.startTimestamp)}
                    />
                ))
            }
        </List>
    );
}

const padNumber = (num: number) => num.toString().padStart(2, '0');

const timestampToDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())} ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
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
