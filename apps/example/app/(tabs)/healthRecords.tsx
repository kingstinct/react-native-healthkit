import { Host, List } from '@expo/ui/swift-ui'
import {
  AllClinicalTypeIdentifiers,
  type ClinicalRecord,
  type ClinicalTypeIdentifier,
  parseFHIRResourceData,
  queryClinicalRecords,
  requestAuthorization,
  supportsHealthRecords,
  useSubscribeToClinicalRecordChanges,
} from '@react-native-healthkit/health-records'
import { useCallback, useEffect, useState } from 'react'
import { Button, Text, View } from 'react-native'
import { ListItem } from '@/components/SwiftListItem'

const HealthRecordsScreen = () => {
  const [records, setRecords] = useState<readonly ClinicalRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const supported = supportsHealthRecords()

  const fetchRecords = useCallback(async () => {
    try {
      const all = await Promise.all(
        AllClinicalTypeIdentifiers.map((clinicalType: ClinicalTypeIdentifier) =>
          queryClinicalRecords(clinicalType, { limit: 0 }).catch((e) => {
            console.warn(`Failed to query ${clinicalType}`, e)
            return [] as readonly ClinicalRecord[]
          }),
        ),
      )
      setRecords(all.flat())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])

  const onRequestAuthorization = useCallback(async () => {
    try {
      await requestAuthorization(AllClinicalTypeIdentifiers)
      await fetchRecords()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [fetchRecords])

  useEffect(() => {
    if (supported) {
      void fetchRecords()
    }
  }, [fetchRecords, supported])

  useSubscribeToClinicalRecordChanges(
    'HKClinicalTypeIdentifierLabResultRecord',
    () => {
      void fetchRecords()
    },
  )

  if (!supported) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Health Records are not supported on this device or region.</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Button
        onPress={onRequestAuthorization}
        title="Request Health Records access"
      />
      {error ? <Text style={{ padding: 16 }}>{error}</Text> : null}
      <Host style={{ flex: 1 }}>
        <List scrollEnabled>
          {records.map((record) => {
            const fhir = parseFHIRResourceData(record)
            return (
              <ListItem
                key={record.uuid}
                title={`${record.displayName} (${record.fhirResource?.resourceType ?? 'no FHIR'})`}
                subtitle={`${record.clinicalType.replace('HKClinicalTypeIdentifier', '')} · ${record.startDate.toLocaleDateString()} · FHIR ${record.fhirResource?.fhirVersion.stringRepresentation ?? '?'} · ${fhir ? Object.keys(fhir).length : 0} keys`}
              />
            )
          })}
        </List>
        <View style={{ height: 100 }} />
      </Host>
    </View>
  )
}

export default HealthRecordsScreen
