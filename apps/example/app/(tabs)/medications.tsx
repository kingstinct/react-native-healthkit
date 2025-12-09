import { Host, List } from '@expo/ui/swift-ui'
import {
  type QuantitySampleForSaving,
  saveCorrelationSample,
} from '@kingstinct/react-native-healthkit'
import {
  queryMedicationEvents,
  queryMedications,
  requestMedicationsAuthorization,
} from '@kingstinct/react-native-healthkit/healthkit.ios'
import type {
  MedicationDoseEvent,
  MedicationDoseEventsWithAnchorResponse,
  UserAnnotatedMedication,
} from '@kingstinct/react-native-healthkit/specs/MedicationModule.nitro'
import { useEffect, useState } from 'react'
import { Button, View } from 'react-native'
import { ListItem } from '@/components/SwiftListItem'

const CorrelationScreen = () => {
  const [medications, setMedications] = useState<
    readonly UserAnnotatedMedication[]
  >([])

  const [medicationDoseEvents, setMedicationDoseEvents] = useState<
    readonly MedicationDoseEvent[]
  >([])
  const onSaveCorrelationSample = () => {
    const createdAt = new Date()
    const samples: QuantitySampleForSaving[] = [
      {
        quantityType: 'HKQuantityTypeIdentifierBloodPressureSystolic',
        quantity: 122,
        unit: 'mmHg',
        startDate: createdAt,
        endDate: createdAt,
        metadata: {},
      },
      {
        quantityType: 'HKQuantityTypeIdentifierBloodPressureDiastolic',
        quantity: 90,
        unit: 'mmHg',
        startDate: createdAt,
        endDate: createdAt,
        metadata: {},
      },
    ]

    saveCorrelationSample(
      'HKCorrelationTypeIdentifierBloodPressure',
      samples,
      createdAt,
      createdAt,
      {},
    )
  }

  useEffect(() => {
    const fetchmedications = async () => {
      await requestMedicationsAuthorization()
      const medications = await queryMedications()
      setMedications(medications)
      const medicationDoseEvents = await queryMedicationEvents({
        limit: Infinity,
      })
      setMedicationDoseEvents(medicationDoseEvents)
    }

    fetchmedications()
  }, [])

  console.log(JSON.stringify(medications, null, 2))
  console.log(JSON.stringify(medicationDoseEvents, null, 2))

  return (
    <View style={{ flex: 1 }}>
      <Button
        onPress={onSaveCorrelationSample}
        title="Save Correlation Sample"
      />
      <Host style={{ flex: 1 }}>
        <List scrollEnabled>
          {medicationDoseEvents.map((event) => {
            return (
              <ListItem
                key={event.uuid}
                title={`${event.medicationConceptIdentifier} (${event.logStatus}) objects`}
                subtitle={event.uuid?.toLocaleString()}
              />
            )
          })}

          {medications.map((item) => {
            return (
              <ListItem
                key={item.medication.identifier}
                title={`${item.medication.identifier} (${item.medication.displayText})`}
                subtitle={item.nickname?.toLocaleString()}
              />
            )
          })}
        </List>
        <View style={{ height: 100 }} />
      </Host>
    </View>
  )
}

export default CorrelationScreen
