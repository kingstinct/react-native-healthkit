import { Core, QuantityTypes } from "@kingstinct/react-native-healthkit";
import {
	Button,
	ContextMenu,
	DateTimePicker,
	List,
	Picker,
} from "@expo/ui/swift-ui";
import { useCallback, useEffect, useState } from "react";
import { ListItem } from "@/components/SwiftListItem";
import type { QuantitySample } from "@kingstinct/react-native-healthkit/types/QuantitySample";
import { View } from "react-native";
import type { QuantityTypeIdentifier } from "@kingstinct/react-native-healthkit/types/QuantityTypeIdentifier";
import { AllQuantityTypeIdentifierInApp } from "@/constants/AllUsedIdentifiersInApp";
import { QueryInfo } from "@/components/QueryInfo";

const transformQuantityIdentifierToName = (
	identifier: QuantityTypeIdentifier,
) => {
	return identifier
		.replace("HKQuantityTypeIdentifier", "")
		.replace(/([A-Z])/g, " $1")
		.trim();
};

const PICKER_OPTIONS: ["Descending", "Ascending", "Anchor"] = [
	"Descending",
	"Ascending",
	"Anchor",
];

export default function QuantitiesScreen() {
	const [quantitySamples, setQuantitySamples] = useState<
		readonly QuantitySample[]
	>([]);

	console.log("samples", JSON.stringify(quantitySamples, null, 2));

	const [fromDate, setFromDate] = useState<Date>(
		new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6),
	);
	const [toDate, setToDate] = useState<Date>(new Date());

	const [selectedQuantityType, setSelectedQuantityType] =
		useState<QuantityTypeIdentifier>(
			"HKQuantityTypeIdentifierActiveEnergyBurned",
		);

	const [selectedOption, setSelectedOption] =
		useState<(typeof PICKER_OPTIONS)[number]>("Descending");

	const [anchor, setAnchor] = useState<string | undefined>(undefined);

	const [queryTime, setQueryTime] = useState<number>();

	const queryQuantitySamples = useCallback(async () => {
		const startedAt = Date.now();
		if (selectedOption === "Anchor") {
			QuantityTypes.queryQuantitySamplesWithAnchor(selectedQuantityType, {
				filter: {
					startDate: fromDate,
					endDate: toDate,
				},
				anchor: anchor,
			})
				.then((result) => {
					setQuantitySamples(result.samples);
					setAnchor(result.newAnchor);
					setQueryTime(Date.now() - startedAt);
				})
				.catch((error) => {
					console.error("Error querying quantity samples with anchor:", error);
				});
		} else {
			setAnchor(undefined);
			const samples = await QuantityTypes.queryQuantitySamples(
				selectedQuantityType,
				{
					filter: {
						startDate: fromDate,
						endDate: toDate,
					},
					ascending: selectedOption === "Ascending",
				},
			);
			setQueryTime(Date.now() - startedAt);

			setQuantitySamples(samples);
		}
	}, [selectedQuantityType, selectedOption, fromDate, toDate, anchor]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		queryQuantitySamples();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={{ marginHorizontal: 16, marginTop: 16 }}>
				<DateTimePicker
					onDateSelected={(date) => {
						setFromDate(date);
					}}
					displayedComponents="dateAndTime"
					initialDate={fromDate.toISOString()}
					variant="automatic"
					title="From"
				/>
			</View>
			<View style={{ marginHorizontal: 16 }}>
				<DateTimePicker
					onDateSelected={(date) => {
						setToDate(date);
					}}
					displayedComponents="dateAndTime"
					initialDate={toDate.toISOString()}
					variant="automatic"
					title="To"
					style={{ marginTop: 16 }}
				/>
			</View>
			<View style={{ marginHorizontal: 16, marginTop: 16 }}>
				<Picker
					options={PICKER_OPTIONS}
					selectedIndex={PICKER_OPTIONS.indexOf(selectedOption)}
					onOptionSelected={({ nativeEvent: { index } }) => {
						setSelectedOption(PICKER_OPTIONS[index]!);
					}}
					variant="segmented"
				/>
			</View>
			<QueryInfo
				queryTime={queryTime}
				anchor={anchor}
				onFetchMore={queryQuantitySamples}
			/>
			<View>
				<ContextMenu style={{ margin: 16 }}>
					<ContextMenu.Items>
						{AllQuantityTypeIdentifierInApp.map((quantityType) => (
							<Button
								key={quantityType}
								variant="bordered"
								systemImage={
									quantityType === selectedQuantityType
										? "checkmark.circle"
										: undefined
								}
								onPress={() => {
									setSelectedQuantityType(quantityType);
								}}
							>
								{transformQuantityIdentifierToName(quantityType)}
							</Button>
						))}
					</ContextMenu.Items>
					<ContextMenu.Trigger>
						<Button variant="bordered" style={{ width: 200, height: 10 }}>
							{transformQuantityIdentifierToName(selectedQuantityType)}
						</Button>
					</ContextMenu.Trigger>
				</ContextMenu>
			</View>
			<List scrollEnabled>
				{quantitySamples.map((item) => {
					const quantityStr = item.quantity
						? `${Math.round(item.quantity * 100) / 100} ${item.unit}`
						: "Unknown Quantity";
					console.log("quantityStr", quantityStr);
					return (
						<ListItem
							key={item.uuid}
							title={quantityStr}
							subtitle={item.startDate.toLocaleString()}
						/>
					);
				})}
				<View style={{ height: 100 }} />
			</List>
		</View>
	);
}
