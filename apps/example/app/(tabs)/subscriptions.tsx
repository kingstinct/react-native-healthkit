import { ListItem } from "@/components/SwiftListItem"
import { AllSampleTypesInApp } from "@/constants/AllUsedIdentifiersInApp"
import { List } from "@expo/ui/swift-ui"
import { Section, Text } from "@expo/ui/swift-ui-primitives"
import { useEffect, useState } from "react"
import { Core } from "react-native-healthkit"
import { SampleTypeIdentifier } from "react-native-healthkit/types/Shared"


const transformIdentifierToName = (identifier: SampleTypeIdentifier) => {
    return identifier.replace('HKQuantityTypeIdentifier', '').replace('HK', '').replace(/([A-Z])/g, ' $1').trim();
}

const Subscriptions = () => {
    const [events, setEvents] = useState<{ sampleTypeIdentifier: SampleTypeIdentifier, timestamp: Date }[]>([]);
    useEffect(() => {
        const subscriptionIds = AllSampleTypesInApp.map((sampleType) => {
            return Core.subscribeToObserverQuery(sampleType, (args) => {
                if(args.errorMessage){
                    alert(`Error in observer query for ${sampleType}: ${args.errorMessage}`);
                }
                setEvents((prevEvents) => [{ sampleTypeIdentifier: args.typeIdentifier, timestamp: new Date() }, ...prevEvents]);
            })
        })

        return () => {
            subscriptionIds.forEach((subscriptionId) => {
                Core.unsubscribeQuery(subscriptionId);
            });
        }
        
    }, [])

    return <List scrollEnabled>
        <Text>Listening for new events..</Text>
        <Section title='Events'>
        {events.map((event, index) => (
            <ListItem key={index} title={transformIdentifierToName(event.sampleTypeIdentifier)} subtitle={`${event.timestamp.toLocaleTimeString()}`} />
        ))}
        </Section>
    </List>

}

export default Subscriptions;