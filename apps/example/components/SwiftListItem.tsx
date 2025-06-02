import { Host, HStack, Text } from "@expo/ui/swift-ui-primitives";
import { Spacer } from "./Spacer";
import { Pressable } from "react-native";

export type ListItemProps = {
    title: string;
    subtitle: string;
}

export const ListItem = ({ title, subtitle }: ListItemProps) => (
    
            <HStack>
                <Text>{title}</Text>
                <Spacer />
                <Text weight='light' design="monospaced">{subtitle}</Text>
            </HStack>
);