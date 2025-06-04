
import { Workouts } from "react-native-healthkit";
import { List } from "@expo/ui/swift-ui";
import { useEffect, useState } from "react";
import { WorkoutActivityType } from "react-native-healthkit/specs/Workout.nitro";
import { WorkoutSample } from "react-native-healthkit/types/WorkoutSample";
import { ListItem } from "@/components/SwiftListItem";
import { enumKeyLookup } from "@/utils/enumKeyLookup";
import { timestampToDate } from "@/utils/timestampToDate";


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
            scrollEnabled>
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
