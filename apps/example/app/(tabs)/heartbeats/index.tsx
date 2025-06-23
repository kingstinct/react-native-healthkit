import { Button, Host, List } from '@expo/ui/swift-ui'
import { Text, VStack } from '@expo/ui/swift-ui-primitives'
import { HeartbeatSeries } from '@kingstinct/react-native-healthkit/modules'
import type { HeartbeatSeriesSample } from '@kingstinct/react-native-healthkit/types/HeartbeatSeries'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { ListItem } from '@/components/SwiftListItem'

export default function HeartbeatSeriesScreen() {
  const [heartbeatSeries, setHeartbeatSeries] = useState<
    readonly HeartbeatSeriesSample[]
  >([])
  const [queryTime, setQueryTime] = useState<null | number>()
  const [anchor, setAnchor] = useState<string | undefined>()
  const [deletedSamples, setDeletedSamples] = useState<readonly string[]>([])

  const queryHeartbeatSeries = useCallback(async (anchor?: string) => {
    try {
      const startedAt = Date.now()

      if (anchor) {
        // Query with anchor for pagination
        const { samples, deletedSamples, newAnchor } =
          await HeartbeatSeries.queryHeartbeatSeriesSamplesWithAnchor({
            anchor,
          })
        setQueryTime(Date.now() - startedAt)
        setHeartbeatSeries(samples)
        setAnchor(newAnchor)
        setDeletedSamples(deletedSamples.map((d) => d.uuid))
      } else {
        // Initial query without anchor
        const samples = await HeartbeatSeries.queryHeartbeatSeriesSamples({
          limit: 20,
          ascending: false,
        })
        setQueryTime(Date.now() - startedAt)
        setHeartbeatSeries(samples)
        setDeletedSamples([])
      }
    } catch (error) {
      console.error('Error querying heartbeat series:', error)
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
      <Host style={{ padding: 16 }}>
        <VStack>
          <Text>
            {queryTime !== null ? `Query time: ${queryTime}ms` : 'Loading...'}
          </Text>
          <Text>{`Series count: ${heartbeatSeries.length}`}</Text>
          {deletedSamples.length > 0 ? (
            <Text>{`Deleted samples: ${deletedSamples.length}`}</Text>
          ) : null}
          {anchor ? (
            <Text>{`Anchor: ${anchor.substring(0, 20)}...`}</Text>
          ) : null}
          {anchor ? (
            <Button
              onPress={() => {
                queryHeartbeatSeries(anchor)
              }}
            >
              Next page
            </Button>
          ) : null}
        </VStack>
      </Host>

      <List scrollEnabled>
        {heartbeatSeries.map((item) => (
          <ListItem
            key={item.uuid}
            title={`${item.heartbeats.length} heartbeats`}
            subtitle={`${item.startDate.toLocaleString()} • Duration: ${formatDuration(item.startDate, item.endDate)}`}
            onPress={() =>
              router.push(`/heartbeats/details?seriesId=${item.uuid}`)
            }
          />
        ))}
      </List>
    </View>
  )
}
