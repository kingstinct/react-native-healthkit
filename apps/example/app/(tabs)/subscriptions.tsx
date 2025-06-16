import { ListItem } from "@/components/SwiftListItem";
import { AllSampleTypesInApp } from "@/constants/AllUsedIdentifiersInApp";
import { List } from "@expo/ui/swift-ui";
import { Section, Text } from "@expo/ui/swift-ui-primitives";
import { useEffect, useState } from "react";
import {
	Core,
	enableBackgroundDelivery,
} from "@kingstinct/react-native-healthkit";
import type { SampleTypeIdentifier } from "@kingstinct/react-native-healthkit/types/Shared";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { UpdateFrequency } from "@kingstinct/react-native-healthkit/types/Background";

const transformIdentifierToName = (identifier: SampleTypeIdentifier) => {
	return identifier
		.replace("HKQuantityTypeIdentifier", "")
		.replace("HK", "")
		.replace(/([A-Z])/g, " $1")
		.trim();
};

const Subscriptions = () => {
	const [events, setEvents] = useState<
		{ sampleTypeIdentifier: SampleTypeIdentifier; timestamp: Date }[]
	>([]);

	useEffect(() => {
		let subscriptionIds: string[] = [];
		const init = async () => {
			const response = await Notifications.requestPermissionsAsync({
				ios: {
					provideAppNotificationSettings: true,
					allowAlert: true,
					allowSound: true,
					allowBadge: true,
				},
			});

			subscriptionIds = AllSampleTypesInApp.map((sampleType) => {
				enableBackgroundDelivery(sampleType, UpdateFrequency.immediate);

				return Core.subscribeToObserverQuery(sampleType, (args) => {
					if (args.errorMessage) {
						if (AppState.currentState === "active") {
							alert(
								`Error in observer query for ${sampleType}: ${args.errorMessage}`,
							);
						} else {
							Notifications.scheduleNotificationAsync({
								content: {
									title: "Error in observer query!",
									body: sampleType,
								},
								trigger: null,
							});
						}
						return;
					}
					if (AppState.currentState === "active") {
						impactAsync(ImpactFeedbackStyle.Light);
					} else {
						Notifications.scheduleNotificationAsync({
							content: {
								title: "Got a new event!",
								body: sampleType,
							},
							trigger: null,
						});
					}

					setEvents((prevEvents) => [
						{
							sampleTypeIdentifier: args.typeIdentifier,
							timestamp: new Date(),
						},
						...prevEvents,
					]);
				});
			});
		};
		void init();

		return () => {
			Core.unsubscribeQueries(subscriptionIds);
		};
	}, []);

	return (
		<List scrollEnabled>
			<Text>Listening for new events..</Text>
			<Section title="Events">
				{events.map((event, index) => (
					<ListItem
						key={
							event.sampleTypeIdentifier + event.timestamp.toLocaleTimeString()
						}
						title={transformIdentifierToName(event.sampleTypeIdentifier)}
						subtitle={`${event.timestamp.toLocaleTimeString()}`}
					/>
				))}
			</Section>
		</List>
	);
};

export default Subscriptions;
