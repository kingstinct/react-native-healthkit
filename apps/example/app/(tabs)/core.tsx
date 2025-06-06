import { ListItem, ListItemProps } from '@/components/SwiftListItem';
import { enumKeyLookup } from '@/utils/enumKeyLookup';
import { List } from '@expo/ui/swift-ui';
import { Section } from '@expo/ui/swift-ui-primitives';
import { useEffect, useState } from 'react';
import { Characteristics, Core } from 'react-native-healthkit';
import { BiologicalSex, BloodType, FitzpatrickSkinType, WheelchairUse } from 'react-native-healthkit/types/Characteristics';


const color = '#007AFF'; // Default color for the label, can be customized

const biologicalSexLookup = enumKeyLookup(BiologicalSex);
const bloodTypeLookup = enumKeyLookup(BloodType);
const wheelchairUseLookup = enumKeyLookup(WheelchairUse);
const fitzpatrickSkinTypeLookup = enumKeyLookup(FitzpatrickSkinType);
const coreStuffDefaults = [
    { title: 'Is health data available?', subtitle: Core.isHealthDataAvailable() ? '✅' : '❌' },
    { title: 'Is protected data available?', subtitle: Core.isProtectedDataAvailable() ? '✅' : '❌' },
]

const CoreTab = () => {
    const characteristics: ListItemProps[] = [
        { title: 'Biological Sex', subtitle: biologicalSexLookup[Characteristics.getBiologicalSex()] },
        { title: 'Birthday', subtitle: Characteristics.getDateOfBirth() },
        { title: 'Blood type', subtitle: bloodTypeLookup[Characteristics.getBloodType()] },
        { title: 'Fitzpatrick Skin Type', subtitle: fitzpatrickSkinTypeLookup[Characteristics.getFitzpatrickSkinType()] },
        { title: 'Wheelchair Use', subtitle: wheelchairUseLookup[Characteristics.getWheelchairUse()] },
    ];

    const [coreStuff, setCoreStuff] = useState<ListItemProps[]>([])

    useEffect(() => {
        const init = async () => {
            try {
                const units = await Core.getPreferredUnits([
                    'HKQuantityTypeIdentifierDistanceWalkingRunning',
                    'HKQuantityTypeIdentifierBodyMass',
                    'HKQuantityTypeIdentifierBloodGlucose'
                ])
                setCoreStuff([
                    ...units.map(({ typeIdentifier, unit }) => ({
                        title: `Unit for ${typeIdentifier}`,
                        subtitle: unit || 'N/A'
                    }))
                ]);
            } catch (error) {
                console.error('Error fetching preferred units:', error);
            }
        }
        init()
    }, [])

    return <List
        scrollEnabled
        // editModeEnabled={editModeEnabled}
        onSelectionChange={(items) => alert(`indexes of selected items: ${items.join(', ')}`)}
        // moveEnabled={moveEnabled}
        onMoveItem={(from, to) => alert(`moved item at index ${from} to index ${to}`)}
        onDeleteItem={(item) => alert(`deleted item at index: ${item}`)}
        style={{ flex: 1, marginBottom: 100 }}
        listStyle='automatic'
    // deleteEnabled={deleteEnabled}
    // selectEnabled={selectEnabled}
    >
        <Section title='Characteristics'>
            {characteristics.map((item, index) => (
                <ListItem key={index} title={item.title} subtitle={item.subtitle} />
            ))}
        </Section>
        <Section title='Device'>
            {coreStuffDefaults.map((item, index) => (
                <ListItem key={index} title={item.title} subtitle={item.subtitle} />
            ))}
        </Section>
        <Section title='Units'>
            {coreStuff.map((item, index) => (
                <ListItem key={index} title={item.title} subtitle={item.subtitle} />
            ))}
        </Section>
    </List>
}

export default CoreTab;