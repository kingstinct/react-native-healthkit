import {
  type QuantitySampleForSaving,
  saveCorrelationSample,
} from '@kingstinct/react-native-healthkit'
import { Button, View } from 'react-native'

const CorrelationScreen = () => {
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

  return (
    <View>
      <Button
        onPress={onSaveCorrelationSample}
        title="Save Correlation Sample"
      />
    </View>
  )
}

export default CorrelationScreen
