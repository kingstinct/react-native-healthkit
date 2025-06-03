import { StyleSheet } from "react-native";

import { Workouts } from "react-native-healthkit";
import { List } from "@expo/ui/swift-ui";
import { useEffect, useState } from "react";
import { WorkoutActivityType } from "react-native-healthkit/specs/Workout.nitro";
import { WorkoutSample } from "react-native-healthkit/types/WorkoutSample";
import { ListItem } from "@/components/SwiftListItem";
import { enumKeyLookup } from "@/utils/enumKeyLookup";
import { useLocalSearchParams } from "expo-router";
import { Text } from "@expo/ui/swift-ui-primitives";


const workoutActivityTypeStrings = enumKeyLookup(WorkoutActivityType);

type WorkoutDetailsProps = Readonly<{
    workout: WorkoutSample;
}>

export default function WorkoutDetails() {
    const { workout } = useLocalSearchParams<WorkoutDetailsProps>();

    return (
        <List scrollEnabled selectEnabled onSelectionChange={(items) => alert(`indexes of selected items: ${items.join(', ')}`)} style={{ flex: 1 }} listStyle='insetGrouped'>
           <Text>{workoutActivityTypeStrings[workout.workoutActivityType]}</Text>
           <Text>{timestampToDate(workout.startTimestamp)}</Text>
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
