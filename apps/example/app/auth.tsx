import { AllObjectTypesInApp, AllSampleTypesInApp } from "@/constants/AllUsedIdentifiersInApp";
import { enumKeyLookup } from "@/utils/enumKeyLookup";
import { Button, CircularProgress, Host } from "@expo/ui/swift-ui";
import { HStack, Text, VStack } from "@expo/ui/swift-ui-primitives";
import { router } from 'expo-router';
import { useEffect, useState } from "react";

import { Core } from "react-native-healthkit";
import { AuthorizationRequestStatus, AuthorizationStatus } from "react-native-healthkit/types/Auth";


const authEnumLookup = enumKeyLookup(AuthorizationStatus);

export default function AuthScreen() {
    const requestAuth = async () => {
        try {
            const res = await Core.requestAuthorization(AllSampleTypesInApp, AllSampleTypesInApp)

            alert('response: ' + res)

            router.replace('/');
        }
        catch (error) {
            console.error('Error requesting authorization:', error);
        }
    }

    const [status, setStatus] = useState<AuthorizationRequestStatus | null>(null);


    useEffect(() => {
        const updateStatus = async () => {
            try {
                const status = await Core.getRequestStatusForAuthorization(AllSampleTypesInApp, AllObjectTypesInApp);
                setStatus(status);
            } catch (error) {
                setStatus(AuthorizationRequestStatus.unknown)
                const err = error as Error
                if ('message' in err) {
                    alert(err.message)
                } else {
                    alert(error)
                }
            }
        }

        // Check the authorization status when the component mounts
        updateStatus();
    }, []);

    return <Host>
        <VStack>

            <HStack padding={16} spacing={16}>
                {status ? <Text weight='bold'>
                    {authEnumLookup[status]}
                </Text> : <CircularProgress />}
            </HStack>
            <HStack padding={16} spacing={16}>
                <Button onPress={requestAuth} variant="borderedProminent">Request Permissions</Button>
            </HStack>
        </VStack>
    </Host>
}