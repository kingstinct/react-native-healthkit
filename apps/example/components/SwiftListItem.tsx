import { Host, HStack, Text } from "@expo/ui/swift-ui-primitives";
import { Spacer } from "./Spacer";
import { Pressable, View } from "react-native";
import { ThemedText } from "./ThemedText";

export type ListItemProps = {
    title: string;
    subtitle: string;
    onPress?: () => void;
}

export const ListItem = ({ title, subtitle, onPress }: ListItemProps) => (
    <HStack>
        <Text>{title}</Text>
        <Spacer />
        <Text weight='light' design="monospaced">{subtitle}</Text>
    </HStack>
);


export const ListItemAdvanced = ({ title, subtitle, onPress }: ListItemProps) => (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', backgroundColor: 'red' }}>
            <ThemedText>{title}</ThemedText>
            <ThemedText>{subtitle}</ThemedText>
        </View>
    </Pressable>
);