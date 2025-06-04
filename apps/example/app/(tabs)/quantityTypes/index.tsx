
import { Core, QuantityType } from "react-native-healthkit";
import { Button, ContextMenu, DateTimePicker, LabelPrimitive, List, Picker, Section } from "@expo/ui/swift-ui";
import { useEffect, useState } from "react";
import { WorkoutActivityType } from "react-native-healthkit/specs/Workout.nitro";
import { WorkoutSample } from "react-native-healthkit/types/WorkoutSample";
import { ListItem } from "@/components/SwiftListItem";
import { enumKeyLookup } from "@/utils/enumKeyLookup";
import { QuantitySampleRaw } from "react-native-healthkit/types/QuantitySampleRaw";
import { timestampToDate } from "@/utils/timestampToDate";
import { View } from "react-native";
import { QuantityTypeIdentifier } from "react-native-healthkit/types/QuantityTypeIdentifier";
import { AllQuantityTypeIdentifierInApp } from "@/constants/AllUsedIdentifiersInApp";


const transformQuantityIdentifierToName = (identifier: QuantityTypeIdentifier) => {
    return identifier.replace('HKQuantityTypeIdentifier', '').replace(/([A-Z])/g, ' $1').trim();
}

export default function QuantitiesScreen() {
    const [quantitySamples, setQuantitySamples] = useState<readonly QuantitySampleRaw[]>([])

    console.log('samples', JSON.stringify(quantitySamples, null, 2));

    const [fromDate, setFromDate] = useState<Date>(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6));
    const [toDate, setToDate] = useState<Date>(new Date());

    const [selectedQuantityType, setSelectedQuantityType] = useState<QuantityTypeIdentifier>('HKQuantityTypeIdentifierActiveEnergyBurned');

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const queryQuantitySamples = async () => {
            const unit = await Core.getPreferredUnits([selectedQuantityType]) || 'kcal';

            const samples = await QuantityType.queryQuantitySamples(selectedQuantityType, unit[0].unit, fromDate.valueOf() / 1000, toDate.valueOf() / 1000, 10, selectedIndex === 1);

            setQuantitySamples(samples)
        }
        queryQuantitySamples();
    }, [selectedQuantityType, selectedIndex, fromDate, toDate]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginHorizontal: 16, marginTop: 16 }}>
                <DateTimePicker
                    onDateSelected={date => {
                        setFromDate(date);
                    }}
                    displayedComponents='dateAndTime'
                    initialDate={fromDate.toISOString()}
                    variant='automatic'
                    title="From"
                />
            </View>
            <View style={{ marginHorizontal: 16 }}>
                <DateTimePicker
                    onDateSelected={date => {
                        setToDate(date);
                    }}
                    displayedComponents='dateAndTime'
                    initialDate={toDate.toISOString()}
                    variant='automatic'
                    title="To"
                    style={{ marginTop: 16 }}
                />
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 16 }}>
            <Picker
                options={['Descending', 'Ascending']}
                selectedIndex={selectedIndex}
                onOptionSelected={({ nativeEvent: { index } }) => {
                setSelectedIndex(index);
                }}
                variant="segmented"
            />
            </View>
            <View>
                <ContextMenu style={{ margin: 16 }} >
                <ContextMenu.Items>
                    {
                        AllQuantityTypeIdentifierInApp.map((quantityType) => (
                            <Button
                                key={quantityType}
                                variant="bordered"
                                systemImage={quantityType === selectedQuantityType ? "checkmark.circle" : undefined}
                                onPress={() => {
                                    setSelectedQuantityType(quantityType);
                                }}>
                                {transformQuantityIdentifierToName(quantityType)}
                            </Button>
                        ))
                    }
                </ContextMenu.Items>
                <ContextMenu.Trigger>

                        <Button variant="bordered" style={{ width: 200, height: 10 }}>
                        {transformQuantityIdentifierToName(selectedQuantityType)}
                    </Button>
                </ContextMenu.Trigger>
            </ContextMenu>
            </View>
            <List
                scrollEnabled
            >
                {quantitySamples.map((item) => {
                    const quantityStr = item.quantity ? `${Math.round(item.quantity * 100) / 100} ${item.unit}` : 'Unknown Quantity';
                    console.log('quantityStr', quantityStr);
                    return (
                        <ListItem
                            key={item.uuid}
                            title={quantityStr}
                            subtitle={timestampToDate(item.startTimestamp)}
                        />
                    )
                })}
                <View style={{ height: 100 }} />
            </List>

        </View>
    );
}
