import { ListItem } from '@/components/SwiftListItem'
import { List } from '@expo/ui/swift-ui'
import { Section } from '@expo/ui/swift-ui-primitives'
import { HeartbeatSeries } from '@kingstinct/react-native-healthkit'
import type { HeartbeatSeriesSample } from '@kingstinct/react-native-healthkit/types/HeartbeatSeries'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'

export default function HeartbeatSeriesDetails() {
  const { seriesId } = useLocalSearchParams<{ seriesId?: string }>()
  const [heartbeatSeries, setHeartbeatSeries] =
    useState<HeartbeatSeriesSample | null>(null)

  useEffect(() => {
    if (!seriesId) {
      return
    }

    // Find the specific heartbeat series by UUID
    // Since we don't have a direct "get by UUID" method, we'll query recent samples
    // and find the one with matching UUID
    HeartbeatSeries.queryHeartbeatSeriesSamples({
      limit: 100,
      ascending: false,
    })
      .then((samples) => {
        const foundSeries = samples.find((s) => s.uuid === seriesId)
        setHeartbeatSeries(foundSeries || null)
      })
      .catch(console.error)
  }, [seriesId])

  if (!heartbeatSeries) {
    return (
      <List>
        <ListItem title="Loading heartbeat series details..." />
      </List>
    )
  }

  const formatTimestamp = (timestamp: number) => {
    return `${timestamp.toFixed(3)}s`
  }

  const formatGapInfo = (precededByGap: boolean) => {
    return precededByGap ? 'Gap before' : 'Continuous'
  }

  return (
    <List scrollEnabled>
      <Section title="Series Information">
        <ListItem title="UUID" subtitle={heartbeatSeries.uuid} />
        <ListItem
          title="Started"
          subtitle={heartbeatSeries.startDate.toLocaleString()}
        />
        <ListItem
          title="Ended"
          subtitle={heartbeatSeries.endDate.toLocaleString()}
        />
        <ListItem
          title="Duration"
          subtitle={`${Math.round((heartbeatSeries.endDate.valueOf() - heartbeatSeries.startDate.valueOf()) / 1000)} seconds`}
        />
        <ListItem
          title="Total Heartbeats"
          subtitle={`${heartbeatSeries.heartbeats.length}`}
        />
      </Section>

      {heartbeatSeries.device ? (
        <Section title="Device">
          {heartbeatSeries.device.name ? (
            <ListItem title="Name" subtitle={heartbeatSeries.device.name} />
          ) : null}
          {heartbeatSeries.device.model ? (
            <ListItem title="Model" subtitle={heartbeatSeries.device.model} />
          ) : null}
          {heartbeatSeries.device.manufacturer ? (
            <ListItem
              title="Manufacturer"
              subtitle={heartbeatSeries.device.manufacturer}
            />
          ) : null}
          {heartbeatSeries.device.hardwareVersion ? (
            <ListItem
              title="Hardware Version"
              subtitle={heartbeatSeries.device.hardwareVersion}
            />
          ) : null}
          {heartbeatSeries.device.softwareVersion ? (
            <ListItem
              title="Software Version"
              subtitle={heartbeatSeries.device.softwareVersion}
            />
          ) : null}
        </Section>
      ) : null}

      {heartbeatSeries.metadata &&
        Object.keys(heartbeatSeries.metadata).length > 0 && (
          <Section title="Metadata">
            {Object.entries(heartbeatSeries.metadata).map(([key, value]) => (
              <ListItem
                key={key}
                title={key}
                subtitle={
                  typeof value === 'string' ? value : JSON.stringify(value)
                }
              />
            ))}
          </Section>
        )}

      <Section title={`Heartbeats (${heartbeatSeries.heartbeats.length})`}>
        {heartbeatSeries.heartbeats.slice(0, 50).map((heartbeat, index) => (
          <ListItem
            key={heartbeat.timeSinceSeriesStart}
            title={`Beat ${index + 1}`}
            subtitle={`Time: ${formatTimestamp(heartbeat.timeSinceSeriesStart)} • ${formatGapInfo(heartbeat.precededByGap)}`}
          />
        ))}
        {heartbeatSeries.heartbeats.length > 50 && (
          <ListItem
            title={`... and ${heartbeatSeries.heartbeats.length - 50} more beats`}
            subtitle="Showing first 50 beats only"
          />
        )}
      </Section>

      {heartbeatSeries.sourceRevision && (
        <Section title="Source">
          {heartbeatSeries.sourceRevision.source?.name && (
            <ListItem
              title="Source Name"
              subtitle={heartbeatSeries.sourceRevision.source.name}
            />
          )}
          {heartbeatSeries.sourceRevision.source?.bundleIdentifier && (
            <ListItem
              title="Bundle Identifier"
              subtitle={heartbeatSeries.sourceRevision.source.bundleIdentifier}
            />
          )}
          {heartbeatSeries.sourceRevision.version && (
            <ListItem
              title="Version"
              subtitle={heartbeatSeries.sourceRevision.version}
            />
          )}
          {heartbeatSeries.sourceRevision.operatingSystemVersion && (
            <ListItem
              title="OS Version"
              subtitle={heartbeatSeries.sourceRevision.operatingSystemVersion}
            />
          )}
        </Section>
      )}
    </List>
  )
}
