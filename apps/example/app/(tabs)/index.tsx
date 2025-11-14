import { Host, List, Section } from '@expo/ui/swift-ui'
import HealthKit, {
  AuthorizationRequestStatus,
  AuthorizationStatus,
  authorizationStatusFor,
  getBloodType,
  getFitzpatrickSkinType,
  getPreferredUnits,
  getRequestStatusForAuthorization,
  getWheelchairUse,
  isHealthDataAvailable,
  isProtectedDataAvailable,
} from '@kingstinct/react-native-healthkit'
import {
  BiologicalSex,
  BloodType,
  FitzpatrickSkinType,
  WheelchairUse,
} from '@kingstinct/react-native-healthkit/types/Characteristics'
import { useEffect, useMemo, useState } from 'react'
import { ListItem, type ListItemProps } from '@/components/SwiftListItem'
import { enumKeyLookup } from '@/utils/enumKeyLookup'

const biologicalSexLookup = enumKeyLookup(BiologicalSex)
const bloodTypeLookup = enumKeyLookup(BloodType)
const wheelchairUseLookup = enumKeyLookup(WheelchairUse)
const fitzpatrickSkinTypeLookup = enumKeyLookup(FitzpatrickSkinType)
const authorizationStatusLookup = enumKeyLookup(AuthorizationStatus)
const AuthorizationRequestStatusLookup = enumKeyLookup(
  AuthorizationRequestStatus,
)

const deviceStuff = [
  {
    title: 'Is health data available?',
    subtitle: isHealthDataAvailable() ? '✅' : '❌',
  },
  {
    title: 'Is protected data available?',
    subtitle: isProtectedDataAvailable() ? '✅' : '❌',
  },
]

const CoreTab = () => {
  const characteristics: ListItemProps[] = useMemo(
    () => [
      {
        title: 'Biological Sex',
        subtitle: biologicalSexLookup[HealthKit.getBiologicalSex()],
      },
      {
        title: 'Birthday',
        subtitle: HealthKit.getDateOfBirth()?.toLocaleDateString(),
      },
      {
        title: 'Blood type',
        subtitle: bloodTypeLookup[getBloodType()],
      },
      {
        title: 'Fitzpatrick Skin Type',
        subtitle: fitzpatrickSkinTypeLookup[getFitzpatrickSkinType()],
      },
      {
        title: 'Wheelchair Use',
        subtitle: wheelchairUseLookup[getWheelchairUse()],
      },
    ],
    [],
  )

  const [unitStuff, setUnitStuff] = useState<ListItemProps[]>([])

  useEffect(() => {
    const init = async () => {
      try {
        const units = await getPreferredUnits([
          'HKQuantityTypeIdentifierDistanceWalkingRunning',
          'HKQuantityTypeIdentifierBodyMass',
          'HKQuantityTypeIdentifierBloodGlucose',
        ])
        setUnitStuff([
          ...units.map(({ typeIdentifier, unit }) => ({
            title: `Unit for ${typeIdentifier}`,
            subtitle: unit || 'N/A',
          })),
        ])
      } catch (error) {
        console.error('Error fetching preferred units:', error)
      }
    }
    init()
  }, [])

  const [authStuff, setAuthStuff] = useState<ListItemProps[]>([])

  useEffect(() => {
    const init = async () => {
      try {
        setAuthStuff([
          {
            title: `authorizationStatusFor`,
            subtitle:
              authorizationStatusLookup[
                authorizationStatusFor('HKQuantityTypeIdentifierStepCount')
              ] || 'N/A',
          },
          {
            title: `getRequestStatusForAuthorization`,
            subtitle:
              AuthorizationRequestStatusLookup[
                await getRequestStatusForAuthorization({
                  toRead: ['HKQuantityTypeIdentifierStepCount'],
                  toShare: ['HKQuantityTypeIdentifierStepCount'],
                })
              ],
          },
        ])
      } catch (error) {
        console.error('Error fetching preferred units:', error)
      }
    }
    init()
  }, [])

  return (
    <Host style={{ flex: 1 }}>
      <List
        scrollEnabled
        // editModeEnabled={editModeEnabled}
        onSelectionChange={(items) =>
          alert(`indexes of selected items: ${items.join(', ')}`)
        }
        // moveEnabled={moveEnabled}
        onMoveItem={(from, to) =>
          alert(`moved item at index ${from} to index ${to}`)
        }
        onDeleteItem={(item) => alert(`deleted item at index: ${item}`)}
        listStyle="automatic"
        // deleteEnabled={deleteEnabled}
        // selectEnabled={selectEnabled}
      >
        <Section title="Auth (stepCount)">
          {authStuff.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
            />
          ))}
        </Section>
        <Section title="Characteristics">
          {characteristics.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
            />
          ))}
        </Section>
        <Section title="Device">
          {deviceStuff.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
            />
          ))}
        </Section>
        <Section title="Units">
          {unitStuff.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
            />
          ))}
        </Section>
      </List>
    </Host>
  )
}

export default CoreTab
