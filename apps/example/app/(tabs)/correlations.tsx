import { Host, List } from '@expo/ui/swift-ui'
import {
  type CorrelationSample,
  type QuantitySampleForSaving,
  queryCorrelationSamples,
  saveCorrelationSample,
} from '@kingstinct/react-native-healthkit'
import { useEffect, useState } from 'react'
import { Button, View } from 'react-native'
import { ListItem } from '@/components/SwiftListItem'

const CorrelationScreen = () => {
  const [correlationSamples, setCorrelationSamples] = useState<
    readonly CorrelationSample[]
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
    const fetchCorrelationSamples = async () => {
      const samples = await queryCorrelationSamples(
        'HKCorrelationTypeIdentifierBloodPressure',
        {
          limit: 20,
        },
      )
      setCorrelationSamples(samples)
    }

    fetchCorrelationSamples()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Button
        onPress={onSaveCorrelationSample}
        title="Save Correlation Sample"
      />
      <Host style={{ flex: 1 }}>
        <List scrollEnabled>
          {correlationSamples.map((item) => {
            return (
              <ListItem
                key={item.uuid}
                title={`${item.correlationType} (${item.objects.length}) objects`}
                subtitle={item.startDate.toLocaleString()}
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
