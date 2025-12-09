import { Host, List } from '@expo/ui/swift-ui'
import { queryElectrocardiogramSamples } from '@kingstinct/react-native-healthkit'
import type { ElectrocardiogramSample } from '@kingstinct/react-native-healthkit/types/ElectrocardiogramSample'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { ListItem } from '@/components/SwiftListItem'

export default function ElectrocardiogramsScreen() {
  const [ecgs, setEcgs] = useState<readonly ElectrocardiogramSample[]>([])

  const queryHeartbeatSeries = useCallback(async () => {
    try {
      const ecgs = await queryElectrocardiogramSamples({
        includeVoltages: true,
        limit: 20,
      })
      setEcgs(ecgs)
    } catch (error) {
      console.error('Error querying ecg series:', error)
    }
  }, [])

  useEffect(() => {
    queryHeartbeatSeries()
  }, [queryHeartbeatSeries])

  const formatDuration = (start: Date, end: Date) => {
    const durationMs = end.getTime() - start.getTime()
    const durationSeconds = Math.round(durationMs / 1000)
    return `${durationSeconds}s`
  }

  return (
    <View style={{ flex: 1 }}>
      <Host style={{ padding: 16, flex: 1 }}>
        <List scrollEnabled>
          {ecgs.map((item) => (
            <ListItem
              key={item.uuid}
              title={`${item.averageHeartRateBpm} BPM`}
              subtitle={`${item.startDate.toLocaleString()} • Duration: ${formatDuration(
                item.startDate,
                item.endDate,
              )} • Voltage Measurements: ${item.numberOfVoltageMeasurements}`}
            />
          ))}
        </List>
      </Host>
    </View>
  )
}
