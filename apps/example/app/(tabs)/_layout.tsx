import { Redirect, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Core } from "react-native-healthkit";
import { AllObjectTypesInApp, AllSampleTypesInApp } from "@/constants/AllUsedIdentifiersInApp";
import { AuthorizationRequestStatus } from "react-native-healthkit/types/Auth";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	const [authStatus, setAuthStatus] = React.useState<AuthorizationRequestStatus | null>(null);

	useEffect(() => {
		try {
			console.log('checking auth status for', AllSampleTypesInApp);
			Core.getRequestStatusForAuthorization(AllSampleTypesInApp, AllObjectTypesInApp)
			.then((status) => {
				console.log("Authorization Status:", status);
				setAuthStatus(status);
			}).catch((error) => {
				console.error("Error getting authorization status:", error);
				setAuthStatus(AuthorizationRequestStatus.shouldRequest);
			});
		} catch (error) {
			console.error("Error in useEffect:", error);
			setAuthStatus(AuthorizationRequestStatus.shouldRequest);
		}
	}, [])

	if (authStatus === AuthorizationRequestStatus.shouldRequest) {
		// If the user has not granted permissions, redirect to the auth screen
		return <Redirect href="../auth" relativeToDirectory />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: true,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: "absolute",
					},
					default: {},
				}),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="auth"
				options={{
					title: "Auth",
					tabBarIcon: ({ color, focused }) => (
						<IconSymbol size={28} name={focused ? "lock.fill" : "lock"} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="core"
				options={{
					title: "Core",
					tabBarIcon: ({ color, focused }) => (
						<IconSymbol size={28} name={focused ? 'person.fill' : 'person'} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="quantityTypes"
				options={{
					title: "Quantities",
					tabBarIcon: ({ color, focused }) => (
						<IconSymbol size={28} name={focused ? "chart.bar.fill" : "chart.bar"} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="workouts"
				options={{
					title: "Workouts",
					tabBarIcon: ({ color, focused }) => (
						<IconSymbol size={28} name={focused ? "figure.run.square.stack.fill" : "figure.run.square.stack"} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="heartbeats"
				options={{
					title: "Heartbeats",
					tabBarIcon: ({ color, focused }) => (
						<IconSymbol size={28} name={focused ? "heart.fill" : "heart"} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
